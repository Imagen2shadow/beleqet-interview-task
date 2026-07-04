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
exports.UsersController = void 0;
var openapi = require("@nestjs/swagger");
// users.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
var UsersController = /** @class */ (function () {
    function UsersController(svc) {
        this.svc = svc;
    }
    UsersController.prototype.profile = function (u) { return this.svc.findById(u.userId); };
    UsersController.prototype.update = function (u, dto) { return this.svc.update(u.userId, dto); };
    UsersController.prototype.getCompany = function (u) { return this.svc.getCompany(u.userId); };
    UsersController.prototype.createCompany = function (u, dto) { return this.svc.createCompany(u.userId, dto); };
    UsersController.prototype.notifications = function (u) { return this.svc.getNotifications(u.userId); };
    UsersController.prototype.markRead = function (id, u) { return this.svc.markNotificationRead(id, u.userId); };
    __decorate([
        (0, common_1.Get)('profile'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], UsersController.prototype, "profile");
    __decorate([
        (0, common_1.Patch)('profile'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "update");
    __decorate([
        (0, common_1.Get)('company'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], UsersController.prototype, "getCompany");
    __decorate([
        (0, common_1.Post)('company'),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "createCompany");
    __decorate([
        (0, common_1.Get)('notifications'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], UsersController.prototype, "notifications");
    __decorate([
        (0, common_1.Patch)('notifications/:id/read'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], UsersController.prototype, "markRead");
    UsersController = __decorate([
        (0, swagger_1.ApiTags)('users'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Controller)('users')
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
