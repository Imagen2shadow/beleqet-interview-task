"use strict";
// =============================================================================
// Beleqet — Screening BullMQ Processor
//
// This is the heart of the event-driven hiring workflow.
// It processes:
//   1. screen-candidate        → calls OpenAI, saves score to DB
//   2. notify-recruiter-*      → delegates to NotificationsService
//   3. schedule-interview      → creates calendar slot in DB
//
// Event chain visualised:
//   application.submitted
//     → [queue] screen-candidate
//       → candidate.scored
//         → [queue] notify-recruiter (if score ≥ threshold → shortlisted)
//         → [queue] notify-recruiter (if score < threshold → rejected)
//         → [queue] schedule-interview (if auto-shortlisted)
//         → [queue] log-platform-event (analytics)
// =============================================================================
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
exports.ScreeningProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var common_1 = require("@nestjs/common");
var bull_2 = require("@nestjs/bull");
var openai_1 = require("openai");
var queues_constants_1 = require("../queues/queues.constants");
var ScreeningProcessor = /** @class */ (function () {
    function ScreeningProcessor(prisma, eventEmitter, config, notificationsQueue, analyticsQueue) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.notificationsQueue = notificationsQueue;
        this.analyticsQueue = analyticsQueue;
        this.logger = new common_1.Logger(ScreeningProcessor_1.name);
        this.openai = new openai_1["default"]({
            apiKey: this.config.get('OPENAI_API_KEY')
        });
    }
    ScreeningProcessor_1 = ScreeningProcessor;
    // ── 1. AI Screening ──────────────────────────────────────────────────────
    ScreeningProcessor.prototype.handleScreenCandidate = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, applicationId, jobTitle, jobDescription, jobRequirements, coverLetter, scoreResult, isShortlisted, isAutoRejected, newStatus;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, applicationId = _a.applicationId, jobTitle = _a.jobTitle, jobDescription = _a.jobDescription, jobRequirements = _a.jobRequirements, coverLetter = _a.coverLetter;
                        this.logger.log("[screen-candidate] Processing application ".concat(applicationId));
                        // a. Update application status to SCREENING
                        return [4 /*yield*/, this.prisma.application.update({
                                where: { id: applicationId },
                                data: { status: 'SCREENING' }
                            })];
                    case 1:
                        // a. Update application status to SCREENING
                        _b.sent();
                        return [4 /*yield*/, this.runAiScoring({
                                jobTitle: jobTitle,
                                jobDescription: jobDescription,
                                jobRequirements: jobRequirements,
                                coverLetter: coverLetter
                            })];
                    case 2:
                        scoreResult = _b.sent();
                        // c. Persist score
                        return [4 /*yield*/, this.prisma.candidateScore.create({
                                data: {
                                    applicationId: applicationId,
                                    userId: job.data.userId,
                                    overallScore: scoreResult.overallScore,
                                    skillScore: scoreResult.skillScore,
                                    experienceScore: scoreResult.experienceScore,
                                    cultureFitScore: scoreResult.cultureFitScore,
                                    reasoning: scoreResult.reasoning,
                                    rawAiResponse: scoreResult,
                                    modelUsed: this.config.get('OPENAI_MODEL', 'gpt-4o-mini')
                                }
                            })];
                    case 3:
                        // c. Persist score
                        _b.sent();
                        isShortlisted = scoreResult.overallScore >= queues_constants_1.SCORING.AUTO_SHORTLIST_THRESHOLD;
                        isAutoRejected = scoreResult.overallScore < queues_constants_1.SCORING.AUTO_REJECT_THRESHOLD;
                        newStatus = isAutoRejected
                            ? 'REJECTED'
                            : isShortlisted
                                ? 'SHORTLISTED'
                                : 'SCREENING';
                        return [4 /*yield*/, this.prisma.application.update({
                                where: { id: applicationId },
                                data: { status: newStatus }
                            })];
                    case 4:
                        _b.sent();
                        // e. Log event
                        return [4 /*yield*/, this.prisma.eventLog.create({
                                data: {
                                    eventType: 'candidate.scored',
                                    entityId: applicationId,
                                    entityType: 'Application',
                                    payload: {
                                        applicationId: applicationId,
                                        overallScore: scoreResult.overallScore,
                                        newStatus: newStatus,
                                        jobId: job.data.jobId
                                    },
                                    processedBy: ScreeningProcessor_1.name
                                }
                            })];
                    case 5:
                        // e. Log event
                        _b.sent();
                        // f. Emit in-process event
                        this.eventEmitter.emit('candidate.scored', {
                            applicationId: applicationId,
                            score: scoreResult.overallScore,
                            status: newStatus
                        });
                        // g. Queue downstream jobs
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                                userId: job.data.userId,
                                type: isShortlisted ? 'application.shortlisted' : isAutoRejected ? 'application.rejected' : 'application.received',
                                title: isShortlisted
                                    ? "\uD83C\uDF89 You've been shortlisted for ".concat(jobTitle)
                                    : isAutoRejected
                                        ? "Application update for ".concat(jobTitle)
                                        : "Application received for ".concat(jobTitle),
                                body: isShortlisted
                                    ? 'Congratulations! Your profile stands out. Expect an interview invitation soon.'
                                    : isAutoRejected
                                        ? 'Thank you for applying. Unfortunately your profile does not match the requirements for this role.'
                                        : 'Your application is being reviewed by our team.',
                                metadata: { applicationId: applicationId, jobId: job.data.jobId, score: scoreResult.overallScore }
                            })];
                    case 6:
                        // g. Queue downstream jobs
                        _b.sent();
                        if (!isShortlisted) return [3 /*break*/, 10];
                        if (!(scoreResult.overallScore >= 90)) return [3 /*break*/, 8];
                        return [4 /*yield*/, job.queue.add(queues_constants_1.APPLICATION_JOBS.SCHEDULE_INTERVIEW, {
                                applicationId: applicationId,
                                userId: job.data.userId,
                                jobId: job.data.jobId,
                                jobTitle: jobTitle,
                                companyId: job.data.companyId
                            })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: 
                    // Notify recruiter about a high-quality candidate
                    return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                            companyId: job.data.companyId,
                            type: 'candidate.shortlisted',
                            title: "Strong candidate shortlisted for ".concat(jobTitle),
                            body: "A candidate scored ".concat(scoreResult.overallScore, "/100 \u2014 review their profile now."),
                            metadata: { applicationId: applicationId, score: scoreResult.overallScore }
                        })];
                    case 9:
                        // Notify recruiter about a high-quality candidate
                        _b.sent();
                        _b.label = 10;
                    case 10: 
                    // h. Update analytics
                    return [4 /*yield*/, this.analyticsQueue.add(queues_constants_1.ANALYTICS_JOBS.LOG_EVENT, {
                            eventType: 'candidate.screened',
                            jobId: job.data.jobId,
                            score: scoreResult.overallScore,
                            status: newStatus
                        })];
                    case 11:
                        // h. Update analytics
                        _b.sent();
                        this.logger.log("[screen-candidate] ".concat(applicationId, " scored ").concat(scoreResult.overallScore, " \u2192 ").concat(newStatus));
                        return [2 /*return*/, { applicationId: applicationId, score: scoreResult.overallScore, status: newStatus }];
                }
            });
        });
    };
    // ── 2. Notify Recruiter ───────────────────────────────────────────────────
    ScreeningProcessor.prototype.handleNotifyRecruiter = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var company;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("[notify-recruiter] New application for ".concat(job.data.jobTitle));
                        return [4 /*yield*/, this.prisma.company.findUnique({
                                where: { id: job.data.companyId },
                                include: { user: true }
                            })];
                    case 1:
                        company = _a.sent();
                        if (!company) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                                userId: company.userId,
                                type: 'application.received',
                                title: "New application for ".concat(job.data.jobTitle),
                                body: "".concat(job.data.applicantName, " just applied to your job listing."),
                                metadata: { applicationId: job.data.applicationId }
                            })];
                    case 2:
                        _a.sent();
                        if (!company.user.telegramId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_TELEGRAM, {
                                telegramId: company.user.telegramId,
                                message: "\uD83D\uDCCB New application for *".concat(job.data.jobTitle, "*\nApplicant: ").concat(job.data.applicantName, "\n\nReview \u2192 ").concat(this.config.get('FRONTEND_URL'), "/dashboard/applications/").concat(job.data.applicationId)
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ── 3. Schedule Interview ────────────────────────────────────────────────
    ScreeningProcessor.prototype.handleScheduleInterview = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var proposedSlot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("[schedule-interview] Scheduling for application ".concat(job.data.applicationId));
                        proposedSlot = new Date();
                        proposedSlot.setDate(proposedSlot.getDate() + 3);
                        proposedSlot.setHours(10, 0, 0, 0);
                        return [4 /*yield*/, this.prisma.application.update({
                                where: { id: job.data.applicationId },
                                data: {
                                    status: 'INTERVIEW_SCHEDULED',
                                    interviewSlot: proposedSlot
                                }
                            })];
                    case 1:
                        _a.sent();
                        // Notify candidate
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                                userId: job.data.userId,
                                type: 'interview.scheduled',
                                title: "Interview scheduled for ".concat(job.data.jobTitle),
                                body: "An interview has been proposed for ".concat(proposedSlot.toLocaleDateString(), ". Check your dashboard for details."),
                                metadata: { applicationId: job.data.applicationId, interviewSlot: proposedSlot }
                            })];
                    case 2:
                        // Notify candidate
                        _a.sent();
                        this.logger.log("[schedule-interview] Interview set for ".concat(job.data.applicationId, " at ").concat(proposedSlot.toISOString()));
                        return [2 /*return*/];
                }
            });
        });
    };
    // ── Error handling ───────────────────────────────────────────────────────
    ScreeningProcessor.prototype.onFailed = function (job, error) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.error("Queue job failed: [".concat(job.name, "] id=").concat(job.id, " attempt=").concat(job.attemptsMade, "/").concat(job.opts.attempts), error.stack);
                        if (!(job.name === queues_constants_1.APPLICATION_JOBS.SCREEN_CANDIDATE && job.attemptsMade >= ((_a = job.opts.attempts) !== null && _a !== void 0 ? _a : 3))) return [3 /*break*/, 2];
                        data = job.data;
                        return [4 /*yield*/, this.prisma.application.update({
                                where: { id: data.applicationId },
                                data: { notes: "AI screening failed after ".concat(job.attemptsMade, " attempts: ").concat(error.message) }
                            })["catch"](function () { return null; })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ScreeningProcessor.prototype.onCompleted = function (job) {
        this.logger.debug("Queue job completed: [".concat(job.name, "] id=").concat(job.id));
    };
    // ── Private: AI Scoring Logic ─────────────────────────────────────────────
    ScreeningProcessor.prototype.runAiScoring = function (input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var systemPrompt, userPrompt, completion, raw, parsed, err_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        systemPrompt = "You are an expert HR screening assistant for an Ethiopian hiring platform called Beleqet.\nYour task is to score a job application on a scale of 0-100 across three dimensions.\nAlways respond ONLY with valid JSON, no markdown fences, no preamble.";
                        userPrompt = "\nJob Title: ".concat(input.jobTitle, "\nJob Description: ").concat(input.jobDescription, "\nRequirements: ").concat((_a = input.jobRequirements) !== null && _a !== void 0 ? _a : 'Not specified', "\nCandidate Cover Letter: ").concat((_b = input.coverLetter) !== null && _b !== void 0 ? _b : 'Not provided', "\n\nScore this application and return JSON with exactly this shape:\n{\n  \"overallScore\": <number 0-100>,\n  \"skillScore\": <number 0-100>,\n  \"experienceScore\": <number 0-100>,\n  \"cultureFitScore\": <number 0-100>,\n  \"reasoning\": \"<2-3 sentence explanation of the scores>\"\n}\n");
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
                                messages: [
                                    { role: 'system', content: systemPrompt },
                                    { role: 'user', content: userPrompt },
                                ],
                                temperature: 0.2,
                                max_tokens: 400,
                                response_format: { type: 'json_object' }
                            })];
                    case 2:
                        completion = _l.sent();
                        raw = (_e = (_d = (_c = completion.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) !== null && _e !== void 0 ? _e : '{}';
                        parsed = JSON.parse(raw);
                        // Clamp all scores to 0-100
                        return [2 /*return*/, {
                                overallScore: Math.min(100, Math.max(0, (_f = parsed.overallScore) !== null && _f !== void 0 ? _f : 50)),
                                skillScore: Math.min(100, Math.max(0, (_g = parsed.skillScore) !== null && _g !== void 0 ? _g : 50)),
                                experienceScore: Math.min(100, Math.max(0, (_h = parsed.experienceScore) !== null && _h !== void 0 ? _h : 50)),
                                cultureFitScore: Math.min(100, Math.max(0, (_j = parsed.cultureFitScore) !== null && _j !== void 0 ? _j : 50)),
                                reasoning: (_k = parsed.reasoning) !== null && _k !== void 0 ? _k : ''
                            }];
                    case 3:
                        err_1 = _l.sent();
                        this.logger.warn("OpenAI call failed, using fallback scoring: ".concat(err_1.message));
                        // Fallback: neutral score so the application isn't auto-rejected
                        return [2 /*return*/, {
                                overallScore: 50,
                                skillScore: 50,
                                experienceScore: 50,
                                cultureFitScore: 50,
                                reasoning: 'AI scoring unavailable — manual review required.'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var ScreeningProcessor_1;
    __decorate([
        (0, bull_1.Process)(queues_constants_1.APPLICATION_JOBS.SCREEN_CANDIDATE)
    ], ScreeningProcessor.prototype, "handleScreenCandidate");
    __decorate([
        (0, bull_1.Process)(queues_constants_1.APPLICATION_JOBS.NOTIFY_RECRUITER)
    ], ScreeningProcessor.prototype, "handleNotifyRecruiter");
    __decorate([
        (0, bull_1.Process)(queues_constants_1.APPLICATION_JOBS.SCHEDULE_INTERVIEW)
    ], ScreeningProcessor.prototype, "handleScheduleInterview");
    __decorate([
        (0, bull_1.OnQueueFailed)()
    ], ScreeningProcessor.prototype, "onFailed");
    __decorate([
        (0, bull_1.OnQueueCompleted)()
    ], ScreeningProcessor.prototype, "onCompleted");
    ScreeningProcessor = ScreeningProcessor_1 = __decorate([
        (0, common_1.Injectable)(),
        (0, bull_1.Processor)(queues_constants_1.QUEUE_NAMES.APPLICATION),
        __param(3, (0, bull_2.InjectQueue)(queues_constants_1.QUEUE_NAMES.NOTIFICATIONS)),
        __param(4, (0, bull_2.InjectQueue)(queues_constants_1.QUEUE_NAMES.ANALYTICS))
    ], ScreeningProcessor);
    return ScreeningProcessor;
}());
exports.ScreeningProcessor = ScreeningProcessor;
