import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { QUEUE_NAMES, APPLICATION_JOBS } from '../queues/queues.constants';
import { ApplicationsModuleOptions } from './applications.module';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.APPLICATION) private readonly applicationQueue: Queue,
    @InjectQueue(QUEUE_NAMES.ANALYTICS) private readonly analyticsQueue: Queue,
    @Inject('APPLICATIONS_CONFIG') private readonly config: ApplicationsModuleOptions,
  ) {}

  async submit(userId: string, dto: SubmitApplicationDto) {
    // Check if user already applied
    const existing = await this.prisma.application.findUnique({
      where: { jobId_userId: { jobId: dto.jobId, userId } },
    });

    if (existing) {
      throw new ForbiddenException('You have already applied for this job');
    }

    // Get job details for screening
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Create application
    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        userId,
        coverLetter: dto.coverLetter,
        resumeUrl: dto.resumeUrl,
        portfolioUrl: dto.portfolioUrl,
        expectedSalary: dto.expectedSalary,
        status: 'SUBMITTED',
      },
      include: {
        job: true,
        user: true,
      },
    });

    // Queue AI screening if enabled
    if (this.config.enableAiScreening) {
      await this.applicationQueue.add(
        APPLICATION_JOBS.SCREEN_CANDIDATE,
        {
          applicationId: application.id,
          userId,
          jobId: dto.jobId,
          jobTitle: job.title,
          jobDescription: job.description,
          jobRequirements: job.requirements,
          coverLetter: dto.coverLetter,
          resumeUrl: dto.resumeUrl,
          companyId: job.companyId,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
        },
      );
    }

    // Queue recruiter notification if enabled
    if (this.config.enableRecruiterNotifications) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.applicationQueue.add(
        APPLICATION_JOBS.NOTIFY_RECRUITER,
        {
          applicationId: application.id,
          jobTitle: job.title,
          companyId: job.companyId,
          applicantName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        },
        {
          attempts: 3,
          backoff: { type: 'fixed', delay: 1000 },
        },
      );
    }

    // Analytics event
    await this.analyticsQueue.add('log-event', {
      eventType: 'application.submitted',
      entityId: application.id,
      jobId: dto.jobId,
      userId,
    });

    return {
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
      status: application.status,
    };
  }

  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { job: { include: { company: true } }, score: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string, employerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job || job.company?.userId !== employerId) {
      throw new ForbiddenException('You do not have access to these applications');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: { user: true, score: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: { include: { company: true } }, user: true, score: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const isOwner = application.userId === userId;
    const isEmployer = application.job?.company?.userId === userId;

    if (!isOwner && !isEmployer) {
      throw new ForbiddenException('Access denied');
    }

    return application;
  }

  async updateStatus(id: string, dto: UpdateStatusDto, employerId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: { include: { company: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job?.company?.userId !== employerId) {
      throw new ForbiddenException('You can only update applications for your own jobs');
    }

    return this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status as any,
        notes: dto.notes,
      },
      include: { user: true, job: true },
    });
  }
}