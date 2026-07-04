import {
  Controller, Post, Get, Patch, Body, Param, UseGuards,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApplicationsService } from './applications.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submit(
    @CurrentUser('userId') userId: string,
    @Body() dto: SubmitApplicationDto,
  ) {
    return this.applicationsService.submit(userId, dto);
  }

  @Get('my')
  async getMyApplications(@CurrentUser('userId') userId: string) {
    return this.applicationsService.findByUser(userId);
  }

  @Get('job/:id')
  @UseGuards(RolesGuard)
  @Roles('EMPLOYER', 'ADMIN')
  async getJobApplications(
    @Param('id') jobId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.applicationsService.findByJob(jobId, userId);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.applicationsService.findOne(id, userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('EMPLOYER', 'ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.applicationsService.updateStatus(id, dto, userId);
  }
}