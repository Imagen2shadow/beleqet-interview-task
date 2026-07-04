import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES, NOTIFICATION_JOBS } from '../queues/queues.constants';
import { NotificationsModuleOptions } from './notifications.module';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(QUEUE_NAMES.NOTIFICATIONS) private readonly notificationsQueue: Queue,
    @Inject('NOTIFICATIONS_CONFIG') private readonly config: NotificationsModuleOptions,
  ) {}

  async sendInApp(userId: string, type: string, title: string, body: string, metadata?: any) {
    if (!this.config.enableInApp) return;
    
    await this.notificationsQueue.add(NOTIFICATION_JOBS.SEND_IN_APP, {
      userId,
      type,
      title,
      body,
      metadata,
    });
  }

  async sendTelegram(telegramId: string, message: string) {
    if (!this.config.enableTelegram) return;
    
    await this.notificationsQueue.add(NOTIFICATION_JOBS.SEND_TELEGRAM, {
      telegramId,
      message,
    });
  }
}