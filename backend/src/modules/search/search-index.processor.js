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
exports.SearchIndexProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var common_1 = require("@nestjs/common");
var queues_constants_1 = require("../queues/queues.constants");
/**
 * SearchIndexProcessor — Phase 2
 *
 * Keeps OpenSearch in sync with PostgreSQL.
 * Every job or freelance_job create/update/delete enqueues a message here.
 * The processor fetches the latest data from Postgres and upserts/deletes
 * the OpenSearch document.
 *
 * Decoupled by design: Postgres is always the source of truth.
 * If OpenSearch goes down, queue messages accumulate in Redis and replay
 * automatically when the service recovers.
 */
var SearchIndexProcessor = /** @class */ (function () {
    function SearchIndexProcessor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SearchIndexProcessor_1.name);
    }
    SearchIndexProcessor_1 = SearchIndexProcessor;
    SearchIndexProcessor.prototype.indexJob = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, action, entityType, entityId, data, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, action = _a.action, entityType = _a.entityType, entityId = _a.entityId;
                        if (action === 'delete') {
                            // await this.opensearch.delete({ index: entityType, id: entityId });
                            this.logger.debug("[search-index] Delete ".concat(entityType, ":").concat(entityId));
                            return [2 /*return*/];
                        }
                        if (!(entityType === 'job')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.job.findUnique({
                                where: { id: entityId },
                                include: { company: true, category: true }
                            })];
                    case 1:
                        data = _b.sent();
                        if (!data)
                            return [2 /*return*/];
                        // Phase 2: upsert into OpenSearch
                        // await this.opensearch.index({ index: 'jobs', id: entityId, body: data });
                        this.logger.debug("[search-index] Indexed job:".concat(entityId, " \"").concat(data.title, "\""));
                        _b.label = 2;
                    case 2:
                        if (!(entityType === 'freelance_job')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.freelanceJob.findUnique({
                                where: { id: entityId },
                                include: { category: true }
                            })];
                    case 3:
                        data = _b.sent();
                        if (!data)
                            return [2 /*return*/];
                        // Phase 2: upsert into OpenSearch
                        // await this.opensearch.index({ index: 'freelance_jobs', id: entityId, body: data });
                        this.logger.debug("[search-index] Indexed freelance_job:".concat(entityId, " \"").concat(data.title, "\""));
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var SearchIndexProcessor_1;
    __decorate([
        (0, bull_1.Process)('index-job')
    ], SearchIndexProcessor.prototype, "indexJob");
    SearchIndexProcessor = SearchIndexProcessor_1 = __decorate([
        (0, common_1.Injectable)(),
        (0, bull_1.Processor)(queues_constants_1.QUEUE_NAMES.SEARCH_INDEX)
    ], SearchIndexProcessor);
    return SearchIndexProcessor;
}());
exports.SearchIndexProcessor = SearchIndexProcessor;
