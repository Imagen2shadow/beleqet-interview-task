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
exports.AuthController = void 0;
var openapi = require("@nestjs/swagger");
// auth.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.register = function (dto) {
        return this.authService.register(dto);
    };
    AuthController.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.validateUser(dto.email, dto.password)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, this.authService.login(user)];
                }
            });
        });
    };
    AuthController.prototype.refresh = function (dto) {
        return this.authService.refresh(dto.refreshToken);
    };
    AuthController.prototype.logout = function (req) {
        return this.authService.logout(req.user.userId);
    };
    AuthController.prototype.me = function (req) {
        return req.user;
    };
    AuthController.prototype.verifyEmail = function (dto) {
        return this.authService.verifyEmail(dto.token);
    };
    AuthController.prototype.forgotPassword = function (dto) {
        return this.authService.forgotPassword(dto.email);
    };
    AuthController.prototype.resetPassword = function (dto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    };
    __decorate([
        (0, common_1.Post)('register'),
        (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "register");
    __decorate([
        (0, common_1.Post)('login'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, swagger_1.ApiOperation)({ summary: 'Login and receive JWT tokens' }),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.Post)('refresh'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "refresh");
    __decorate([
        (0, common_1.Post)('logout'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
        __param(0, (0, common_1.Request)())
    ], AuthController.prototype, "logout");
    __decorate([
        (0, common_1.Get)('me'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        (0, swagger_1.ApiOperation)({ summary: 'Get authenticated user profile' }),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Request)())
    ], AuthController.prototype, "me");
    __decorate([
        (0, common_1.Post)('verify-email'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, swagger_1.ApiOperation)({ summary: 'Verify user email via token' }),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "verifyEmail");
    __decorate([
        (0, common_1.Post)('forgot-password'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, swagger_1.ApiOperation)({ summary: 'Request password reset email' }),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "forgotPassword");
    __decorate([
        (0, common_1.Post)('reset-password'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, swagger_1.ApiOperation)({ summary: 'Reset password via token' }),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "resetPassword");
    AuthController = __decorate([
        (0, swagger_1.ApiTags)('auth'),
        (0, common_1.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
