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
exports.EscrowService = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var PLATFORM_FEE_PCT = 0.10;
var EscrowService = /** @class */ (function () {
    function EscrowService(prisma, config, escrowQueue) {
        this.prisma = prisma;
        this.config = config;
        this.escrowQueue = escrowQueue;
        this.logger = new common_1.Logger(EscrowService_1.name);
    }
    EscrowService_1 = EscrowService;
    /** Initiate escrow — returns Chapa/Telebirr payment link */
    EscrowService.prototype.initiate = function (clientId, freelanceJobId) {
        return __awaiter(this, void 0, void 0, function () {
            var job, grossAmount, platformFee, netAmount, escrow, checkoutUrl, chapaSecret, response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.freelanceJob.findFirst({
                            where: { id: freelanceJobId, clientId: clientId },
                            include: { client: true, contract: true }
                        })];
                    case 1:
                        job = _a.sent();
                        if (!job)
                            throw new common_1.NotFoundException('Gig not found');
                        grossAmount = job.contract ? job.contract.agreedAmount : job.budgetMax;
                        if (!job.contract) {
                            this.logger.warn("Escrow initiated without a contract for job ".concat(freelanceJobId, " \u2014 using budgetMax. Consider initiating escrow after bid acceptance."));
                        }
                        platformFee = Math.round(grossAmount * PLATFORM_FEE_PCT);
                        netAmount = grossAmount - platformFee;
                        return [4 /*yield*/, this.prisma.escrowTransaction.create({
                                data: { freelanceJobId: freelanceJobId, grossAmount: grossAmount, platformFee: platformFee, netAmount: netAmount, status: 'PENDING' }
                            })];
                    case 2:
                        escrow = _a.sent();
                        checkoutUrl = "".concat(this.config.get('FRONTEND_URL'), "/freelance/pay?escrow=").concat(escrow.id);
                        chapaSecret = this.config.get('CHAPA_SECRET_KEY');
                        if (!chapaSecret) return [3 /*break*/, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fetch('https://api.chapa.co/v1/transaction/initialize', {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(chapaSecret),
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    amount: grossAmount.toString(),
                                    currency: 'ETB',
                                    email: job.client.email,
                                    first_name: job.client.firstName,
                                    last_name: job.client.lastName,
                                    tx_ref: escrow.id,
                                    callback_url: this.config.get('CHAPA_CALLBACK_URL'),
                                    return_url: this.config.get('CHAPA_RETURN_URL'),
                                    customization: {
                                        title: 'Beleqet Escrow',
                                        description: "Payment for Gig: ".concat(job.title)
                                    }
                                })
                            })];
                    case 4:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 5:
                        data = _a.sent();
                        if (data.status === 'success') {
                            checkoutUrl = data.data.checkout_url;
                        }
                        else {
                            this.logger.warn("Chapa initialization failed: ".concat(data.message));
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        this.logger.error("Failed to reach Chapa: ".concat(err_1.message));
                        return [3 /*break*/, 7];
                    case 7:
                        this.logger.log("Escrow initiated: ".concat(escrow.id, " for job ").concat(freelanceJobId, " \u2014 amount: ETB ").concat(grossAmount));
                        return [2 /*return*/, { escrowId: escrow.id, checkoutUrl: checkoutUrl, grossAmount: grossAmount, platformFee: platformFee, netAmount: netAmount }];
                }
            });
        });
    };
    /** Called by Chapa webhook — verifies signature, marks escrow funded */
    EscrowService.prototype.handleWebhook = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.escrowQueue.add(queues_constants_1.ESCROW_JOBS.PROCESS_WEBHOOK, payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Called when employer approves milestone */
    EscrowService.prototype.releaseMilestone = function (milestoneId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var milestone, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.milestone.findFirst({
                            where: { id: milestoneId, contract: { clientId: clientId } },
                            include: { contract: { include: { freelanceJob: { include: { escrowTx: true } } } } }
                        })];
                    case 1:
                        milestone = _a.sent();
                        if (!milestone)
                            throw new common_1.NotFoundException('Milestone not found');
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.milestone.update({
                                                where: { id: milestoneId },
                                                data: { status: 'APPROVED', approvedAt: new Date() }
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, tx.eventLog.create({
                                                    data: {
                                                        eventType: 'milestone.approved',
                                                        entityId: milestoneId,
                                                        entityType: 'Milestone',
                                                        payload: {
                                                            milestoneId: milestoneId,
                                                            freelancerId: milestone.contract.freelancerId,
                                                            amount: milestone.amount
                                                        },
                                                        processedBy: EscrowService_1.name
                                                    }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        // Add to wallet pending balance (3-day hold)
                        return [4 /*yield*/, this.escrowQueue.add(queues_constants_1.ESCROW_JOBS.AUTO_RELEASE, {
                                milestoneId: milestoneId,
                                freelancerId: milestone.contract.freelancerId,
                                amount: milestone.amount,
                                releaseAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                            })];
                    case 4:
                        // Add to wallet pending balance (3-day hold)
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        this.logger.error("Failed to enqueue auto-release for milestone ".concat(milestoneId), err_2 instanceof Error ? err_2.stack : err_2);
                        return [3 /*break*/, 6];
                    case 6:
                        this.logger.log("Milestone ".concat(milestoneId, " approved \u2014 payout queued"));
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    var EscrowService_1;
    EscrowService = EscrowService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(2, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.ESCROW))
    ], EscrowService);
    return EscrowService;
}());
exports.EscrowService = EscrowService;
