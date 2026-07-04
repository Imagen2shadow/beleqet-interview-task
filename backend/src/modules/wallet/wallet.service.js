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
exports.WalletService = exports.WithdrawDto = void 0;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
var WithdrawDto = /** @class */ (function () {
    function WithdrawDto() {
    }
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.Min)(1, { message: 'Minimum withdrawal is ETB 1' }),
        (0, class_validator_1.Max)(1000000, { message: 'Maximum single withdrawal is ETB 1,000,000' })
    ], WithdrawDto.prototype, "amount");
    __decorate([
        (0, class_validator_1.IsEnum)(['CHAPA', 'TELEBIRR', 'CBE_BIRR'], { message: 'method must be CHAPA, TELEBIRR, or CBE_BIRR' })
    ], WithdrawDto.prototype, "method");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(50, { message: 'accountRef must be 50 characters or fewer' })
    ], WithdrawDto.prototype, "accountRef");
    return WithdrawDto;
}());
exports.WithdrawDto = WithdrawDto;
var WalletService = /** @class */ (function () {
    function WalletService(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(WalletService_1.name);
    }
    WalletService_1 = WalletService;
    WalletService.prototype.getOrCreate = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.freelancerWallet.upsert({
                        where: { userId: userId },
                        update: {},
                        create: { userId: userId },
                        include: { transactions: { orderBy: { createdAt: 'desc' }, take: 30 } }
                    })];
            });
        });
    };
    WalletService.prototype.withdraw = function (userId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, tx, chapaSecret, response, data, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.freelancerWallet.findUnique({ where: { userId: userId } })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet)
                            throw new common_1.NotFoundException('Wallet not found');
                        if (wallet.availableBalance < dto.amount)
                            throw new common_1.BadRequestException('Insufficient available balance');
                        return [4 /*yield*/, this.prisma.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                var tx;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma.freelancerWallet.update({
                                                where: { userId: userId },
                                                data: { availableBalance: { decrement: dto.amount } }
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, prisma.walletTransaction.create({
                                                    data: { walletId: wallet.id, type: 'DEBIT_WITHDRAWAL', amount: dto.amount, note: "Withdrawal via ".concat(dto.method, " \u2014 pending") }
                                                })];
                                        case 2:
                                            tx = _a.sent();
                                            return [2 /*return*/, { tx: tx }];
                                    }
                                });
                            }); })];
                    case 2:
                        tx = (_a.sent()).tx;
                        chapaSecret = this.config.get('CHAPA_SECRET_KEY');
                        if (!chapaSecret) return [3 /*break*/, 10];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 10]);
                        return [4 /*yield*/, fetch('https://api.chapa.co/v1/transfers', {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(chapaSecret),
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    account_name: 'Freelancer',
                                    account_number: dto.accountRef,
                                    amount: dto.amount.toString(),
                                    currency: 'ETB',
                                    reference: tx.id,
                                    bank_code: dto.method === 'TELEBIRR' ? '855' : '853d0598-9c01-41ab-ac99-48eab4da1513'
                                })
                            })];
                    case 4:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 5:
                        data = _a.sent();
                        if (!(data.status !== 'success')) return [3 /*break*/, 7];
                        // Step 3 (rollback): Chapa rejected — restore balance
                        this.logger.warn("Chapa payout rejected: ".concat(data.message, ". Rolling back balance for user ").concat(userId));
                        return [4 /*yield*/, this.prisma.$transaction([
                                this.prisma.freelancerWallet.update({
                                    where: { userId: userId },
                                    data: { availableBalance: { increment: dto.amount } }
                                }),
                                this.prisma.walletTransaction.update({
                                    where: { id: tx.id },
                                    data: { note: "Withdrawal via ".concat(dto.method, " \u2014 FAILED: ").concat(data.message) }
                                }),
                            ])];
                    case 6:
                        _a.sent();
                        throw new common_1.InternalServerErrorException("Payout rejected by payment gateway: ".concat(data.message));
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        err_1 = _a.sent();
                        if (err_1 instanceof common_1.InternalServerErrorException)
                            throw err_1;
                        // Network error — roll back
                        this.logger.error("Failed to reach Chapa payout: ".concat(err_1.message, ". Rolling back."));
                        return [4 /*yield*/, this.prisma.$transaction([
                                this.prisma.freelancerWallet.update({
                                    where: { userId: userId },
                                    data: { availableBalance: { increment: dto.amount } }
                                }),
                                this.prisma.walletTransaction.update({
                                    where: { id: tx.id },
                                    data: { note: "Withdrawal via ".concat(dto.method, " \u2014 FAILED: network error") }
                                }),
                            ])];
                    case 9:
                        _a.sent();
                        throw new common_1.InternalServerErrorException('Could not reach payment gateway. Your balance has been restored.');
                    case 10: return [2 /*return*/, { success: true, amount: dto.amount, method: dto.method, note: 'Payout processing — typically 1-2 business days' }];
                }
            });
        });
    };
    var WalletService_1;
    WalletService = WalletService_1 = __decorate([
        (0, common_1.Injectable)()
    ], WalletService);
    return WalletService;
}());
exports.WalletService = WalletService;
