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
exports.EscrowController = void 0;
var openapi = require("@nestjs/swagger");
// escrow.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
var crypto = require("crypto");
var EscrowController = /** @class */ (function () {
    function EscrowController(svc, config) {
        this.svc = svc;
        this.config = config;
    }
    EscrowController.prototype.initiate = function (gigId, u) {
        return this.svc.initiate(u.userId, gigId);
    };
    /** Webhook endpoint — verified via Chapa signature header */
    EscrowController.prototype.webhook = function (payload, req, chapaSignature, xChapaSignature) {
        var signature = chapaSignature || xChapaSignature;
        var secret = this.config.get('CHAPA_WEBHOOK_SECRET');
        var isProduction = this.config.get('NODE_ENV') === 'production';
        if (isProduction && (!secret || !req.rawBody || !signature)) {
            throw new common_1.UnauthorizedException('Webhook signature verification failed: missing required components');
        }
        if (secret && req.rawBody && signature) {
            var hash = crypto.createHmac('sha256', secret)
                .update(req.rawBody)
                .digest('hex');
            if (hash !== signature) {
                throw new common_1.UnauthorizedException('Invalid Webhook Signature');
            }
        }
        return this.svc.handleWebhook(payload);
    };
    EscrowController.prototype.release = function (id, u) {
        return this.svc.releaseMilestone(id, u.userId);
    };
    __decorate([
        (0, common_1.Post)('initiate/:gigId'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Param)('gigId')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], EscrowController.prototype, "initiate");
    __decorate([
        (0, common_1.Post)('callback'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Req)()),
        __param(2, (0, common_1.Headers)('chapa-signature')),
        __param(3, (0, common_1.Headers)('x-chapa-signature'))
    ], EscrowController.prototype, "webhook");
    __decorate([
        (0, common_1.Post)('milestones/:id/release'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], EscrowController.prototype, "release");
    EscrowController = __decorate([
        (0, swagger_1.ApiTags)('escrow'),
        (0, common_1.Controller)('escrow')
    ], EscrowController);
    return EscrowController;
}());
exports.EscrowController = EscrowController;
