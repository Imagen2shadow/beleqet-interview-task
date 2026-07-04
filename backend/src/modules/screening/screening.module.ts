import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from '../queues/queues.constants';
import { ScreeningProcessor } from './screening.processor';

export interface ScreeningModuleOptions {
  openaiApiKey: string;
  openaiModel?: string;
  minScoreForShortlist?: number;
  enableAutoInterview?: boolean;
}

@Module({})
export class ScreeningModule {
  static register(options: ScreeningModuleOptions): DynamicModule {
    return {
      module: ScreeningModule,
      imports: [
        ConfigModule,
        BullModule.registerQueue(
          { name: QUEUE_NAMES.APPLICATION },
          { name: QUEUE_NAMES.NOTIFICATIONS },
          { name: QUEUE_NAMES.ANALYTICS },
        ),
      ],
      providers: [
        {
          provide: 'SCREENING_CONFIG',
          useValue: {
            openaiModel: options.openaiModel ?? 'gpt-4o-mini',
            minScoreForShortlist: options.minScoreForShortlist ?? 70,
            enableAutoInterview: options.enableAutoInterview ?? true,
            openaiApiKey: options.openaiApiKey,
          },
        },
        ScreeningProcessor,
      ],
      exports: [ScreeningProcessor],
    };
  }
}