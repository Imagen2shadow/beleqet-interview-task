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
exports.WalletProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var common_1 = require("@nestjs/common");
var queues_constants_1 = require("../queues/queues.constants");
/**
 * WalletProcessor — consumes the WALLET queue.
 * Handles any wallet-specific background tasks that are not
 * already covered by EscrowProcessor (e.g. admin-triggered adjustments).
 */
var WalletProcessor = /** @class */ (function () {
    function WalletProcessor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WalletProcessor_1.name);
    }
    WalletProcessor_1 = WalletProcessor;
    WalletProcessor.prototype.handleReleasePending = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, walletId, userId, amount, milestoneId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = job.data, walletId = _a.walletId, userId = _a.userId, amount = _a.amount, milestoneId = _a.milestoneId;
                        return [4 /*yield*/, this.prisma.freelancerWallet.update({
                                where: { id: walletId },
                                data: {
                                    pendingBalance: { decrement: amount },
                                    availableBalance: { increment: amount }
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.prisma.walletTransaction.create({
                                data: {
                                    walletId: walletId,
                                    type: 'CREDIT_AVAILABLE',
                                    amount: amount,
                                    note: 'Hold period cleared',
                                    milestoneId: milestoneId
                                }
                            })];
                    case 2:
                        _b.sent();
                        this.logger.log("[wallet] Released ETB ".concat(amount, " from pending \u2192 available for user ").concat(userId));
                        return [2 /*return*/];
                }
            });
        });
    };
    var WalletProcessor_1;
    __decorate([
        (0, bull_1.Process)('release-pending')
    ], WalletProcessor.prototype, "handleReleasePending");
    WalletProcessor = WalletProcessor_1 = __decorate([
        (0, common_1.Injectable)(),
        (0, bull_1.Processor)(queues_constants_1.QUEUE_NAMES.WALLET)
    ], WalletProcessor);
    return WalletProcessor;
}());
exports.WalletProcessor = WalletProcessor;
