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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcryptjs");
var uuid_1 = require("uuid");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var AuthService = /** @class */ (function () {
    function AuthService(prisma, jwt, config, notificationsQueue) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.notificationsQueue = notificationsQueue;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    AuthService_1 = AuthService;
    AuthService.prototype.register = function (dto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var existing, passwordHash, user;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: dto.email } })];
                    case 1:
                        existing = _b.sent();
                        if (existing)
                            throw new common_1.ConflictException('Email already registered');
                        return [4 /*yield*/, bcrypt.hash(dto.password, 12)];
                    case 2:
                        passwordHash = _b.sent();
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: dto.email.toLowerCase().trim(),
                                    passwordHash: passwordHash,
                                    firstName: dto.firstName,
                                    lastName: dto.lastName,
                                    role: (_a = dto.role) !== null && _a !== void 0 ? _a : 'JOB_SEEKER'
                                },
                                select: { id: true, email: true, firstName: true, lastName: true, role: true }
                            })];
                    case 3:
                        user = _b.sent();
                        this.logger.log("New user registered: ".concat(user.email, " (").concat(user.role, ")"));
                        // Fire-and-forget: email queue failure must NOT crash registration
                        this.sendVerificationEmail(user.id)["catch"](function (err) {
                            return _this.logger.error("Failed to enqueue verification email for ".concat(user.email, ": ").concat(err.message));
                        });
                        return [2 /*return*/, this.issueTokens(user)];
                }
            });
        });
    };
    AuthService.prototype.validateUser = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, valid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email.toLowerCase() } })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.isActive)
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        return [4 /*yield*/, bcrypt.compare(password, user.passwordHash)];
                    case 2:
                        valid = _a.sent();
                        if (!valid)
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.prototype.login = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.issueTokens(user)];
            });
        });
    };
    AuthService.prototype.refresh = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var storedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.refreshToken.findUnique({
                            where: { token: token },
                            include: { user: true }
                        })];
                    case 1:
                        storedToken = _a.sent();
                        if (!storedToken || storedToken.expiresAt < new Date()) {
                            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                        }
                        // Rotate token
                        return [4 /*yield*/, this.prisma.refreshToken["delete"]({ where: { id: storedToken.id } })];
                    case 2:
                        // Rotate token
                        _a.sent();
                        return [2 /*return*/, this.issueTokens(storedToken.user)];
                }
            });
        });
    };
    AuthService.prototype.logout = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.refreshToken.deleteMany({ where: { userId: userId } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendVerificationEmail = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, token, verifyUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        token = (0, uuid_1.v4)();
                        return [4 /*yield*/, this.prisma.verificationToken.create({
                                data: {
                                    userId: user.id,
                                    token: token,
                                    type: 'EMAIL_VERIFICATION',
                                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                                }
                            })];
                    case 2:
                        _a.sent();
                        verifyUrl = "".concat(this.config.get('FRONTEND_URL'), "/auth/verify-email?token=").concat(token);
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_EMAIL, {
                                to: user.email,
                                subject: 'Verify your Beleqet Account',
                                html: "<p>Hi ".concat(user.firstName, ",</p><p>Please verify your email by clicking the link below:</p><p><a href=\"").concat(verifyUrl, "\">Verify Email</a></p>")
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verifyEmail = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.verificationToken.findUnique({ where: { token: token } })];
                    case 1:
                        verificationToken = _a.sent();
                        if (!verificationToken || verificationToken.type !== 'EMAIL_VERIFICATION' || verificationToken.expiresAt < new Date()) {
                            throw new common_1.BadRequestException('Invalid or expired verification token');
                        }
                        return [4 /*yield*/, this.prisma.user.update({
                                where: { id: verificationToken.userId },
                                data: { emailVerified: true }
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.verificationToken["delete"]({ where: { id: verificationToken.id } })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'Email verified successfully' }];
                }
            });
        });
    };
    AuthService.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, token, resetUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email.toLowerCase() } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, { success: true, message: 'If an account exists, a reset link was sent.' }];
                        token = (0, uuid_1.v4)();
                        return [4 /*yield*/, this.prisma.verificationToken.create({
                                data: {
                                    userId: user.id,
                                    token: token,
                                    type: 'PASSWORD_RESET',
                                    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
                                }
                            })];
                    case 2:
                        _a.sent();
                        resetUrl = "".concat(this.config.get('FRONTEND_URL'), "/auth/reset-password?token=").concat(token);
                        return [4 /*yield*/, this.notificationsQueue.add(queues_constants_1.NOTIFICATION_JOBS.SEND_EMAIL, {
                                to: user.email,
                                subject: 'Reset your Beleqet Password',
                                html: "<p>Hi ".concat(user.firstName, ",</p><p>You requested a password reset. Click the link below to set a new password:</p><p><a href=\"").concat(resetUrl, "\">Reset Password</a></p>")
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'If an account exists, a reset link was sent.' }];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationToken, passwordHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.verificationToken.findUnique({ where: { token: token } })];
                    case 1:
                        verificationToken = _a.sent();
                        if (!verificationToken || verificationToken.type !== 'PASSWORD_RESET' || verificationToken.expiresAt < new Date()) {
                            throw new common_1.BadRequestException('Invalid or expired reset token');
                        }
                        return [4 /*yield*/, bcrypt.hash(newPassword, 12)];
                    case 2:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, this.prisma.user.update({
                                where: { id: verificationToken.userId },
                                data: { passwordHash: passwordHash }
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.verificationToken.deleteMany({ where: { userId: verificationToken.userId, type: 'PASSWORD_RESET' } })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'Password reset successfully' }];
                }
            });
        });
    };
    AuthService.prototype.issueTokens = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, accessToken, refreshTokenStr, expiresAt, MAX_SESSIONS, tokens, toDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { sub: user.id, email: user.email, role: user.role };
                        accessToken = this.jwt.sign(payload, {
                            secret: this.config.get('JWT_ACCESS_SECRET'),
                            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m')
                        });
                        refreshTokenStr = (0, uuid_1.v4)();
                        expiresAt = new Date();
                        expiresAt.setDate(expiresAt.getDate() + 30);
                        return [4 /*yield*/, this.prisma.refreshToken.create({
                                data: { token: refreshTokenStr, userId: user.id, expiresAt: expiresAt }
                            })];
                    case 1:
                        _a.sent();
                        MAX_SESSIONS = 5;
                        return [4 /*yield*/, this.prisma.refreshToken.findMany({
                                where: { userId: user.id },
                                orderBy: { createdAt: 'asc' },
                                select: { id: true }
                            })];
                    case 2:
                        tokens = _a.sent();
                        if (!(tokens.length > MAX_SESSIONS)) return [3 /*break*/, 4];
                        toDelete = tokens.slice(0, tokens.length - MAX_SESSIONS).map(function (t) { return t.id; });
                        return [4 /*yield*/, this.prisma.refreshToken.deleteMany({ where: { id: { "in": toDelete } } })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            accessToken: accessToken,
                            refreshToken: refreshTokenStr,
                            user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role
                            }
                        }];
                }
            });
        });
    };
    var AuthService_1;
    AuthService = AuthService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(3, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.NOTIFICATIONS))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
