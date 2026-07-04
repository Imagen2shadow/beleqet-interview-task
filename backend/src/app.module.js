"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var throttler_1 = require("@nestjs/throttler");
var event_emitter_1 = require("@nestjs/event-emitter");
var bull_1 = require("@nestjs/bull");
var prisma_module_1 = require("./prisma/prisma.module");
var auth_module_1 = require("./modules/auth/auth.module");
var users_module_1 = require("./modules/users/users.module");
var jobs_module_1 = require("./modules/jobs/jobs.module");
var applications_module_1 = require("./modules/applications/applications.module");
var screening_module_1 = require("./modules/screening/screening.module");
var notifications_module_1 = require("./modules/notifications/notifications.module");
var analytics_module_1 = require("./modules/analytics/analytics.module");
var queues_module_1 = require("./modules/queues/queues.module");
var freelance_module_1 = require("./modules/freelance/freelance.module");
var escrow_module_1 = require("./modules/escrow/escrow.module");
var wallet_module_1 = require("./modules/wallet/wallet.module");
var admin_module_1 = require("./modules/admin/admin.module");
var chat_module_1 = require("./modules/chat/chat.module");
var uploads_module_1 = require("./modules/uploads/uploads.module");
var telegram_module_1 = require("./modules/telegram/telegram.module");
var validation_schema_1 = require("./config/validation.schema");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                // ── Configuration (loads .env) ─────────────────────────────────────────
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: validation_schema_1["default"],
                    validationOptions: {
                        allowUnknown: true,
                        abortEarly: false
                    }
                }),
                // ── Rate limiting ──────────────────────────────────────────────────────
                throttler_1.ThrottlerModule.forRoot([
                    { name: 'short', ttl: 1000, limit: 10 },
                    { name: 'medium', ttl: 10000, limit: 50 },
                    { name: 'long', ttl: 60000, limit: 200 },
                ]),
                // ── Event bus (in-process events between modules) ──────────────────────
                event_emitter_1.EventEmitterModule.forRoot({
                    wildcard: true,
                    delimiter: '.',
                    maxListeners: 20
                }),
                // ── BullMQ (Redis-backed job queues) ───────────────────────────────────
                bull_1.BullModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return ({
                        redis: {
                            host: config.get('REDIS_HOST', 'localhost'),
                            port: config.get('REDIS_PORT', 6379),
                            password: config.get('REDIS_PASSWORD'),
                            tls: config.get('REDIS_TLS', false) ? {} : undefined
                        },
                        defaultJobOptions: {
                            removeOnComplete: 100,
                            removeOnFail: 200,
                            attempts: 3,
                            backoff: { type: 'exponential', delay: 2000 }
                        }
                    }); }
                }),
                // ── Feature modules ────────────────────────────────────────────────────
                prisma_module_1.PrismaModule,
                queues_module_1.QueuesModule,
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                jobs_module_1.JobsModule,
                applications_module_1.ApplicationsModule.register({
                    enableAiScreening: true,
                    enableRecruiterNotifications: true
                }),
                screening_module_1.ScreeningModule.register({
                    openaiApiKey: process.env.OPENAI_API_KEY,
                    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    minScoreForShortlist: parseInt(process.env.MIN_SCORE_SHORTLIST || '70', 10),
                    enableAutoInterview: process.env.ENABLE_AUTO_INTERVIEW === 'true'
                }),
                notifications_module_1.NotificationsModule.register({
                    enableTelegram: true,
                    enableEmail: true,
                    enableInApp: true
                }),
                analytics_module_1.AnalyticsModule,
                freelance_module_1.FreelanceModule,
                escrow_module_1.EscrowModule,
                wallet_module_1.WalletModule,
                admin_module_1.AdminModule,
                chat_module_1.ChatModule,
                uploads_module_1.UploadsModule,
                telegram_module_1.TelegramModule,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
