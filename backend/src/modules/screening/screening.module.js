"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScreeningModule = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var config_1 = require("@nestjs/config");
var queues_constants_1 = require("../queues/queues.constants");
var screening_processor_1 = require("./screening.processor");
var ScreeningModule = /** @class */ (function () {
    function ScreeningModule() {
    }
    ScreeningModule_1 = ScreeningModule;
    ScreeningModule.register = function (options) {
        var _a, _b, _c;
        return {
            module: ScreeningModule_1,
            imports: [
                config_1.ConfigModule,
                bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.APPLICATION }, { name: queues_constants_1.QUEUE_NAMES.NOTIFICATIONS }, { name: queues_constants_1.QUEUE_NAMES.ANALYTICS }),
            ],
            providers: [
                {
                    provide: 'SCREENING_CONFIG',
                    useValue: {
                        openaiModel: (_a = options.openaiModel) !== null && _a !== void 0 ? _a : 'gpt-4o-mini',
                        minScoreForShortlist: (_b = options.minScoreForShortlist) !== null && _b !== void 0 ? _b : 70,
                        enableAutoInterview: (_c = options.enableAutoInterview) !== null && _c !== void 0 ? _c : true,
                        openaiApiKey: options.openaiApiKey
                    }
                },
                screening_processor_1.ScreeningProcessor,
            ],
            exports: [screening_processor_1.ScreeningProcessor]
        };
    };
    var ScreeningModule_1;
    ScreeningModule = ScreeningModule_1 = __decorate([
        (0, common_1.Module)({})
    ], ScreeningModule);
    return ScreeningModule;
}());
exports.ScreeningModule = ScreeningModule;
