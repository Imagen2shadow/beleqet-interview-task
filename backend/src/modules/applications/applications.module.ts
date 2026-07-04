import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from '../queues/queues.constants';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

export interface ApplicationsModuleOptions {
  enableAiScreening: boolean;
  enableRecruiterNotifications: boolean;
}

@Module({})
export class ApplicationsModule {
  static register(options: ApplicationsModuleOptions): DynamicModule {
    return {
      module: ApplicationsModule,
      imports: [
        ConfigModule,
        BullModule.registerQueue(
          { name: QUEUE_NAMES.APPLICATION },
          { name: QUEUE_NAMES.ANALYTICS },
        ),
      ],
      providers: [
        {
          provide: 'APPLICATIONS_CONFIG',
          useValue: options,
        },
        ApplicationsService,
      ],
      controllers: [ApplicationsController],
      exports: [ApplicationsService],
    };
  }
}