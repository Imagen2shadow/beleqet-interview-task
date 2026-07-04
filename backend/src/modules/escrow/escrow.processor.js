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
exports.EscrowProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var common_1 = require("@nestjs/common");
var bull_2 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var EscrowProcessor = /** @class */ (function () {
    function EscrowProcessor(prisma, config, notificationsQueue) {
        this.prisma = prisma;
        this.config = config;
        this.notificationsQueue = notificationsQueue;
        this.logger = new common_1.Logger(EscrowProcessor_1.name);
    }
    EscrowProcessor_1 = EscrowProcessor;
    // ── 1. Process Chapa / Telebirr Webhook ───────────────────────────────────
    EscrowProcessor.prototype.handleWebhook = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, reference, status, tx_ref, escrow;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, reference = _a.reference, status = _a.status, tx_ref = _a.tx_ref;
                        this.logger.log("[escrow-webhook] ref=".concat(reference, " status=").concat(status));
                        return [4 /*yield*/, this.prisma.escrowTransaction.findFirst({
                                where: {
                                    OR: [
                                        { gatewayRef: reference },
                                        { gatewayRef: tx_ref },
                                    ]
                                },
                                include: {
                                    freelanceJob: { include: { client: true } }
                                }
                            })];
                    case 1:
                        escrow = _b.sent();
                        if (!escrow) {
                            this.logger.warn("[escrow-webhook] No escrow found for ref=".concat(reference));
                            return [2 /*return*/];
                        }
                        // Idempotency — skip if already funded
                        if (escrow.status === 'FUNDED') {
                            this.logger.debug("[escrow-webhook] Already funded, skipping");
                            return [2 /*return*/];
                        }
                        if (!(status === 'success' || status === 'SUCCESS')) return [3 /*break*/, 4];
                        // Mark escrow as funded and publish the gig
                        return [4 /*yield*/, this.prisma.$transaction([
                                this.prisma.escrowTransaction.update({
                                    where: { id: escrow.id },
                                    data: {
                                        status: 'FUNDED',
                                        fundedAt: new Date(),
                                        gatewayResponse: job.data
                                    }
                                }),
                                this.prisma.freelanceJob.update({
                                    where: { id: escrow.freelanceJobId },
                                    data: { status: 'FUNDED' }
                                }),
                                this.prisma.eventLog.create({
                                    data: {
                                        eventType: 'escrow.funded',
                                        entityId: escrow.id,
                                        entityType: 'EscrowTransaction',
                                        payload: { escrowId: escrow.id, amount: escrow.grossAmount, ref: reference },
                                        processedBy: EscrowProcessor_1.name
                                    }
                                }),
                            ])];
                    case 2:
                        // Mark escrow as funded and publish the gig
                        _b.sent();
                        // Notify the client
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                                userId: escrow.freelanceJob.clientId,
                                type: 'escrow.funded',
                                title: '✅ Escrow funded — your gig is now live!',
                                body: "ETB ".concat(escrow.grossAmount.toLocaleString(), " has been secured. Freelancers can now bid on your project."),
                                metadata: { escrowId: escrow.id, freelanceJobId: escrow.freelanceJobId }
                            })];
                    case 3:
                        // Notify the client
                        _b.sent();
                        this.logger.log("[escrow-webhook] Escrow ".concat(escrow.id, " funded \u2014 gig published"));
                        return [3 /*break*/, 6];
                    case 4: 
                    // Payment failed
                    return [4 /*yield*/, this.prisma.escrowTransaction.update({
                            where: { id: escrow.id },
                            data: { gatewayResponse: job.data }
                        })];
                    case 5:
                        // Payment failed
                        _b.sent();
                        this.logger.warn("[escrow-webhook] Payment failed for escrow ".concat(escrow.id));
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // ── 2. Auto-Release Milestone After 3-Day Hold ────────────────────────────
    EscrowProcessor.prototype.handleAutoRelease = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, milestoneId, freelancerId, amount, releaseAt, delayMs, wallet, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, milestoneId = _a.milestoneId, freelancerId = _a.freelancerId, amount = _a.amount;
                        this.logger.log("[auto-release] Processing milestone ".concat(milestoneId, " for freelancer ").concat(freelancerId));
                        releaseAt = new Date(job.data.releaseAt);
                        if (!(releaseAt > new Date())) return [3 /*break*/, 2];
                        delayMs = releaseAt.getTime() - Date.now();
                        return [4 /*yield*/, job.queue.add(queues_constants_1.ESCROW_JOBS.AUTO_RELEASE, job.data, { delay: delayMs })];
                    case 1:
                        _b.sent();
                        this.logger.debug("[auto-release] Hold not elapsed, re-queued with ".concat(delayMs, "ms delay"));
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.prisma.freelancerWallet.upsert({
                            where: { userId: freelancerId },
                            update: {
                                pendingBalance: { decrement: amount },
                                availableBalance: { increment: amount }
                            },
                            create: {
                                userId: freelancerId,
                                pendingBalance: 0,
                                availableBalance: amount
                            }
                        })];
                    case 3:
                        wallet = _b.sent();
                        return [4 /*yield*/, this.prisma.walletTransaction.create({
                                data: {
                                    walletId: wallet.id,
                                    type: 'CREDIT_AVAILABLE',
                                    amount: amount,
                                    note: "Milestone payout cleared \u2014 3-day hold complete",
                                    milestoneId: milestoneId
                                }
                            })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.prisma.eventLog.create({
                                data: {
                                    eventType: 'wallet.credited',
                                    entityId: milestoneId,
                                    entityType: 'Milestone',
                                    payload: { milestoneId: milestoneId, freelancerId: freelancerId, amount: amount },
                                    processedBy: EscrowProcessor_1.name
                                }
                            })];
                    case 5:
                        _b.sent();
                        // Notify freelancer
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                                userId: freelancerId,
                                type: 'wallet.credited',
                                title: "\uD83D\uDCB0 ETB ".concat(amount.toLocaleString(), " is now available"),
                                body: 'Your hold period has cleared. You can now withdraw these funds.',
                                metadata: { milestoneId: milestoneId, amount: amount }
                            })];
                    case 6:
                        // Notify freelancer
                        _b.sent();
                        return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: freelancerId } })];
                    case 7:
                        user = _b.sent();
                        if (!(user === null || user === void 0 ? void 0 : user.telegramId)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_TELEGRAM, {
                                telegramId: user.telegramId,
                                message: "\uD83D\uDCB0 *ETB ".concat(amount.toLocaleString(), " is now available in your Beleqet wallet!*\n\nYour 3-day hold has cleared. Withdraw at: ").concat(this.config.get('FRONTEND_URL'), "/freelance/wallet")
                            })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        this.logger.log("[auto-release] ETB ".concat(amount, " moved to available for freelancer ").concat(freelancerId));
                        return [2 /*return*/];
                }
            });
        });
    };
    // ── 3. Process Withdrawal ─────────────────────────────────────────────────
    EscrowProcessor.prototype.handleWithdrawal = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, amount, method, chapaSecret, response, data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, userId = _a.userId, amount = _a.amount, method = _a.method;
                        this.logger.log("[withdrawal] Processing ETB ".concat(amount, " via ").concat(method, " for user ").concat(userId));
                        chapaSecret = this.config.get('CHAPA_SECRET_KEY');
                        if (!chapaSecret) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('https://api.chapa.co/v1/transfers', {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(chapaSecret),
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    account_name: 'Freelancer',
                                    account_number: job.data.accountRef,
                                    amount: amount.toString(),
                                    currency: 'ETB',
                                    reference: "withdrawal-".concat(job.id),
                                    bank_code: method === 'TELEBIRR' ? '855' : '853d0598-9c01-41ab-ac99-48eab4da1513'
                                })
                            })];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        if (data.status !== 'success') {
                            this.logger.warn("Chapa payout queue failed: ".concat(data.message));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        this.logger.error("Failed to reach Chapa payout queue: ".concat(err_1.message));
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_IN_APP, {
                            userId: userId,
                            type: 'wallet.withdrawal_processing',
                            title: "Withdrawal of ETB ".concat(amount.toLocaleString(), " is processing"),
                            body: "Your ".concat(method, " withdrawal is being processed. Funds typically arrive within 1\u20132 business days."),
                            metadata: { amount: amount, method: method }
                        })];
                    case 6:
                        _b.sent();
                        this.logger.log("[withdrawal] ETB ".concat(amount, " payout initiated via ").concat(method));
                        return [2 /*return*/];
                }
            });
        });
    };
    // ── Error Handler ─────────────────────────────────────────────────────────
    EscrowProcessor.prototype.onFailed = function (job, error) {
        this.logger.error("[escrow-queue] Job failed: [".concat(job.name, "] id=").concat(job.id, " attempt=").concat(job.attemptsMade), error.stack);
    };
    var EscrowProcessor_1;
    __decorate([
        (0, bull_1.Process)(queues_constants_1.ESCROW_JOBS.PROCESS_WEBHOOK)
    ], EscrowProcessor.prototype, "handleWebhook");
    __decorate([
        (0, bull_1.Process)(queues_constants_1.ESCROW_JOBS.AUTO_RELEASE)
    ], EscrowProcessor.prototype, "handleAutoRelease");
    __decorate([
        (0, bull_1.Process)(queues_constants_1.ESCROW_JOBS.PROCESS_WITHDRAWAL)
    ], EscrowProcessor.prototype, "handleWithdrawal");
    __decorate([
        (0, bull_1.OnQueueFailed)()
    ], EscrowProcessor.prototype, "onFailed");
    EscrowProcessor = EscrowProcessor_1 = __decorate([
        (0, common_1.Injectable)(),
        (0, bull_1.Processor)(queues_constants_1.QUEUE_NAMES.ESCROW),
        __param(2, (0, bull_2.InjectQueue)(queues_constants_1.QUEUE_NAMES.NOTIFICATIONS))
    ], EscrowProcessor);
    return EscrowProcessor;
}());
exports.EscrowProcessor = EscrowProcessor;
