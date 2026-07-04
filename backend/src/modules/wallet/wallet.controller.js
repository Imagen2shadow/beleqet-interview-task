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
exports.__esModule = true;
exports.WalletController = void 0;
var openapi = require("@nestjs/swagger");
// wallet.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
var WalletController = /** @class */ (function () {
    function WalletController(svc) {
        this.svc = svc;
    }
    WalletController.prototype.getWallet = function (u) { return this.svc.getOrCreate(u.userId); };
    WalletController.prototype.withdraw = function (u, dto) { return this.svc.withdraw(u.userId, dto); };
    __decorate([
        (0, common_1.Get)(),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], WalletController.prototype, "getWallet");
    __decorate([
        (0, common_1.Post)('withdraw'),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)())
    ], WalletController.prototype, "withdraw");
    WalletController = __decorate([
        (0, swagger_1.ApiTags)('wallet'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Controller)('wallet')
    ], WalletController);
    return WalletController;
}());
exports.WalletController = WalletController;
