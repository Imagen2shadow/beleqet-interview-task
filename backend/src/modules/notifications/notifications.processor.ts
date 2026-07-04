import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { QUEUE_NAMES, NOTIFICATION_JOBS } from '../queues/queues.constants';

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process(NOTIFICATION_JOBS.SEND_IN_APP)
  async handleSendInApp(job: Job<{ userId: string; type: string; title: string; body: string; metadata?: any }>) {
    this.logger.log(`[send-in-app] Sending notification to user ${job.data.userId}`);
    
    await this.prisma.notification.create({
      data: {
        userId: job.data.userId,
        channel: 'IN_APP',
        type: job.data.type,
        title: job.data.title,
        body: job.data.body,
        metadata: job.data.metadata ?? {},
      },
    });
  }

  @Process(NOTIFICATION_JOBS.SEND_TELEGRAM)
  async handleSendTelegram(job: Job<{ telegramId: string; message: string }>) {
    this.logger.log(`[send-telegram] Sending to telegram ID ${job.data.telegramId}`);
    // Telegram integration would go here
    // For now, just log it
  }
}