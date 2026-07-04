"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ApplicationsService = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var ApplicationsService = /** @class */ (function () {
    function ApplicationsService(prisma, applicationQueue, analyticsQueue, config) {
        this.prisma = prisma;
        this.applicationQueue = applicationQueue;
        this.analyticsQueue = analyticsQueue;
        this.config = config;
    }
    ApplicationsService.prototype.submit = function (userId, dto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var existing, job, application, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.application.findUnique({
                            where: { jobId_userId: { jobId: dto.jobId, userId: userId } }
                        })];
                    case 1:
                        existing = _c.sent();
                        if (existing) {
                            throw new common_1.ForbiddenException('You have already applied for this job');
                        }
                        return [4 /*yield*/, this.prisma.job.findUnique({
                                where: { id: dto.jobId },
                                include: { company: true }
                            })];
                    case 2:
                        job = _c.sent();
                        if (!job) {
                            throw new common_1.NotFoundException('Job not found');
                        }
                        return [4 /*yield*/, this.prisma.application.create({
                                data: {
                                    jobId: dto.jobId,
                                    userId: userId,
                                    coverLetter: dto.coverLetter,
                                    resumeUrl: dto.resumeUrl,
                                    portfolioUrl: dto.portfolioUrl,
                                    expectedSalary: dto.expectedSalary,
                                    status: 'SUBMITTED'
                                },
                                include: {
                                    job: true,
                                    user: true
                                }
                            })];
                    case 3:
                        application = _c.sent();
                        if (!this.config.enableAiScreening) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.applicationQueue.add(queues_constants_1.APPLICATION_JOBS.SCREEN_CANDIDATE, {
                                applicationId: application.id,
                                userId: userId,
                                jobId: dto.jobId,
                                jobTitle: job.title,
                                jobDescription: job.description,
                                jobRequirements: job.requirements,
                                coverLetter: dto.coverLetter,
                                resumeUrl: dto.resumeUrl,
                                companyId: job.companyId
                            }, {
                                attempts: 3,
                                backoff: { type: 'exponential', delay: 2000 },
                                removeOnComplete: 100
                            })];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        if (!this.config.enableRecruiterNotifications) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                    case 6:
                        user = _c.sent();
                        return [4 /*yield*/, this.applicationQueue.add(queues_constants_1.APPLICATION_JOBS.NOTIFY_RECRUITER, {
                                applicationId: application.id,
                                jobTitle: job.title,
                                companyId: job.companyId,
                                applicantName: "".concat((_a = user === null || user === void 0 ? void 0 : user.firstName) !== null && _a !== void 0 ? _a : '', " ").concat((_b = user === null || user === void 0 ? void 0 : user.lastName) !== null && _b !== void 0 ? _b : '').trim()
                            }, {
                                attempts: 3,
                                backoff: { type: 'fixed', delay: 1000 }
                            })];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: 
                    // Analytics event
                    return [4 /*yield*/, this.analyticsQueue.add('log-event', {
                            eventType: 'application.submitted',
                            entityId: application.id,
                            jobId: dto.jobId,
                            userId: userId
                        })];
                    case 9:
                        // Analytics event
                        _c.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Application submitted successfully',
                                applicationId: application.id,
                                status: application.status
                            }];
                }
            });
        });
    };
    ApplicationsService.prototype.findByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.application.findMany({
                        where: { userId: userId },
                        include: { job: { include: { company: true } }, score: true },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    ApplicationsService.prototype.findByJob = function (jobId, employerId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.job.findUnique({
                            where: { id: jobId },
                            include: { company: true }
                        })];
                    case 1:
                        job = _b.sent();
                        if (!job || ((_a = job.company) === null || _a === void 0 ? void 0 : _a.userId) !== employerId) {
                            throw new common_1.ForbiddenException('You do not have access to these applications');
                        }
                        return [2 /*return*/, this.prisma.application.findMany({
                                where: { jobId: jobId },
                                include: { user: true, score: true },
                                orderBy: { createdAt: 'desc' }
                            })];
                }
            });
        });
    };
    ApplicationsService.prototype.findOne = function (id, userId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var application, isOwner, isEmployer;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.application.findUnique({
                            where: { id: id },
                            include: { job: { include: { company: true } }, user: true, score: true }
                        })];
                    case 1:
                        application = _c.sent();
                        if (!application) {
                            throw new common_1.NotFoundException('Application not found');
                        }
                        isOwner = application.userId === userId;
                        isEmployer = ((_b = (_a = application.job) === null || _a === void 0 ? void 0 : _a.company) === null || _b === void 0 ? void 0 : _b.userId) === userId;
                        if (!isOwner && !isEmployer) {
                            throw new common_1.ForbiddenException('Access denied');
                        }
                        return [2 /*return*/, application];
                }
            });
        });
    };
    ApplicationsService.prototype.updateStatus = function (id, dto, employerId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var application;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.application.findUnique({
                            where: { id: id },
                            include: { job: { include: { company: true } } }
                        })];
                    case 1:
                        application = _c.sent();
                        if (!application) {
                            throw new common_1.NotFoundException('Application not found');
                        }
                        if (((_b = (_a = application.job) === null || _a === void 0 ? void 0 : _a.company) === null || _b === void 0 ? void 0 : _b.userId) !== employerId) {
                            throw new common_1.ForbiddenException('You can only update applications for your own jobs');
                        }
                        return [2 /*return*/, this.prisma.application.update({
                                where: { id: id },
                                data: {
                                    status: dto.status,
                                    notes: dto.notes
                                },
                                include: { user: true, job: true }
                            })];
                }
            });
        });
    };
    ApplicationsService = __decorate([
        (0, common_1.Injectable)(),
        __param(1, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.APPLICATION)),
        __param(2, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.ANALYTICS)),
        __param(3, (0, common_1.Inject)('APPLICATIONS_CONFIG'))
    ], ApplicationsService);
    return ApplicationsService;
}());
exports.ApplicationsService = ApplicationsService;
