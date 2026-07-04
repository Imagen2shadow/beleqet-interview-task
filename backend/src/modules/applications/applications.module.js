"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ApplicationsModule = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var config_1 = require("@nestjs/config");
var queues_constants_1 = require("../queues/queues.constants");
var applications_service_1 = require("./applications.service");
var applications_controller_1 = require("./applications.controller");
var ApplicationsModule = /** @class */ (function () {
    function ApplicationsModule() {
    }
    ApplicationsModule_1 = ApplicationsModule;
    ApplicationsModule.register = function (options) {
        return {
            module: ApplicationsModule_1,
            imports: [
                config_1.ConfigModule,
                bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.APPLICATION }, { name: queues_constants_1.QUEUE_NAMES.ANALYTICS }),
            ],
            providers: [
                {
                    provide: 'APPLICATIONS_CONFIG',
                    useValue: options
                },
                applications_service_1.ApplicationsService,
            ],
            controllers: [applications_controller_1.ApplicationsController],
            exports: [applications_service_1.ApplicationsService]
        };
    };
    var ApplicationsModule_1;
    ApplicationsModule = ApplicationsModule_1 = __decorate([
        (0, common_1.Module)({})
    ], ApplicationsModule);
    return ApplicationsModule;
}());
exports.ApplicationsModule = ApplicationsModule;
