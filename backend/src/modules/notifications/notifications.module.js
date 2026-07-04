"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NotificationsModule = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var config_1 = require("@nestjs/config");
var queues_constants_1 = require("../queues/queues.constants");
var notifications_processor_1 = require("./notifications.processor");
var notifications_service_1 = require("./notifications.service");
var NotificationsModule = /** @class */ (function () {
    function NotificationsModule() {
    }
    NotificationsModule_1 = NotificationsModule;
    NotificationsModule.register = function (options) {
        var _a, _b, _c;
        return {
            module: NotificationsModule_1,
            imports: [
                config_1.ConfigModule,
                bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.NOTIFICATIONS }),
            ],
            providers: [
                {
                    provide: 'NOTIFICATIONS_CONFIG',
                    useValue: {
                        enableTelegram: (_a = options.enableTelegram) !== null && _a !== void 0 ? _a : true,
                        enableEmail: (_b = options.enableEmail) !== null && _b !== void 0 ? _b : true,
                        enableInApp: (_c = options.enableInApp) !== null && _c !== void 0 ? _c : true
                    }
                },
                notifications_processor_1.NotificationsProcessor,
                notifications_service_1.NotificationsService,
            ],
            exports: [notifications_processor_1.NotificationsProcessor, notifications_service_1.NotificationsService]
        };
    };
    var NotificationsModule_1;
    NotificationsModule = NotificationsModule_1 = __decorate([
        (0, common_1.Module)({})
    ], NotificationsModule);
    return NotificationsModule;
}());
exports.NotificationsModule = NotificationsModule;
