"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AnalyticsProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var common_1 = require("@nestjs/common");
var queues_constants_1 = require("../queues/queues.constants");
var AnalyticsProcessor = /** @class */ (function () {
    function AnalyticsProcessor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsProcessor_1.name);
    }
    AnalyticsProcessor_1 = AnalyticsProcessor;
    AnalyticsProcessor.prototype.logEvent = function (job) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.eventLog.create({
                            data: {
                                eventType: job.data.eventType,
                                entityId: String((_b = (_a = job.data.jobId) !== null && _a !== void 0 ? _a : job.data.applicationId) !== null && _b !== void 0 ? _b : 'global'),
                                entityType: 'Analytics',
                                payload: job.data,
                                processedBy: AnalyticsProcessor_1.name
                            }
                        })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsProcessor.prototype.updateJobStats = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.application.count({ where: { jobId: job.data.jobId } })];
                    case 1:
                        count = _a.sent();
                        this.logger.debug("Job ".concat(job.data.jobId, " now has ").concat(count, " applications"));
                        return [2 /*return*/];
                }
            });
        });
    };
    var AnalyticsProcessor_1;
    __decorate([
        (0, bull_1.Process)(queues_constants_1.ANALYTICS_JOBS.LOG_EVENT)
    ], AnalyticsProcessor.prototype, "logEvent");
    __decorate([
        (0, bull_1.Process)(queues_constants_1.ANALYTICS_JOBS.UPDATE_JOB_STATS)
    ], AnalyticsProcessor.prototype, "updateJobStats");
    AnalyticsProcessor = AnalyticsProcessor_1 = __decorate([
        (0, common_1.Injectable)(),
        (0, bull_1.Processor)(queues_constants_1.QUEUE_NAMES.ANALYTICS)
    ], AnalyticsProcessor);
    return AnalyticsProcessor;
}());
exports.AnalyticsProcessor = AnalyticsProcessor;
