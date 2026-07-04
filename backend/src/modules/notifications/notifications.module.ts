import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from '../queues/queues.constants';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';

export interface NotificationsModuleOptions {
  enableTelegram: boolean;
  enableEmail: boolean;
  enableInApp: boolean;
}

@Module({})
export class NotificationsModule {
  static register(options: NotificationsModuleOptions): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [
        ConfigModule,
        BullModule.registerQueue({ name: QUEUE_NAMES.NOTIFICATIONS }),
      ],
           providers: [
        {
          provide: 'NOTIFICATIONS_CONFIG',
          useValue: {
            enableTelegram: options.enableTelegram ?? true,
            enableEmail: options.enableEmail ?? true,
            enableInApp: options.enableInApp ?? true,
          },
        },
        NotificationsProcessor,
        NotificationsService,
      ],
      exports: [NotificationsProcessor, NotificationsService],
    };
  }
}