"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AnalyticsModule = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var analytics_processor_1 = require("./analytics.processor");
var AnalyticsModule = /** @class */ (function () {
    function AnalyticsModule() {
    }
    AnalyticsModule = __decorate([
        (0, common_1.Module)({
            imports: [bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.ANALYTICS })],
            providers: [analytics_processor_1.AnalyticsProcessor]
        })
    ], AnalyticsModule);
    return AnalyticsModule;
}());
exports.AnalyticsModule = AnalyticsModule;
