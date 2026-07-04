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
exports.FreelanceController = void 0;
var openapi = require("@nestjs/swagger");
// freelance.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
var FreelanceController = /** @class */ (function () {
    function FreelanceController(svc) {
        this.svc = svc;
    }
    FreelanceController.prototype.findJobs = function (q) { return this.svc.findJobs(q); };
    FreelanceController.prototype.findJob = function (id) { return this.svc.findJobById(id); };
    FreelanceController.prototype.createJob = function (u, dto) { return this.svc.createJob(u.userId, dto); };
    FreelanceController.prototype.submitBid = function (id, u, dto) { return this.svc.submitBid(u.userId, id, dto); };
    FreelanceController.prototype.acceptBid = function (id, u) { return this.svc.acceptBid(id, u.userId); };
    FreelanceController.prototype.myBids = function (u) { return this.svc.getMyBids(u.userId); };
    FreelanceController.prototype.contract = function (id) { return this.svc.getContract(id); };
    FreelanceController.prototype.approveMilestone = function (id, u) { return this.svc.approveMilestone(id, u.userId); };
    __decorate([
        (0, common_1.Get)('jobs'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Query)())
    ], FreelanceController.prototype, "findJobs");
    __decorate([
        (0, common_1.Get)('jobs/:id'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Param)('id'))
    ], FreelanceController.prototype, "findJob");
    __decorate([
        (0, common_1.Post)('jobs'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 201, type: Object }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)())
    ], FreelanceController.prototype, "createJob");
    __decorate([
        (0, common_1.Post)('jobs/:id/bids'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __param(2, (0, common_1.Body)())
    ], FreelanceController.prototype, "submitBid");
    __decorate([
        (0, common_1.Patch)('bids/:id/accept'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], FreelanceController.prototype, "acceptBid");
    __decorate([
        (0, common_1.Get)('my-bids'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200, type: [Object] }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], FreelanceController.prototype, "myBids");
    __decorate([
        (0, common_1.Get)('contracts/:id'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Param)('id'))
    ], FreelanceController.prototype, "contract");
    __decorate([
        (0, common_1.Patch)('milestones/:id/approve'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], FreelanceController.prototype, "approveMilestone");
    FreelanceController = __decorate([
        (0, swagger_1.ApiTags)('freelance'),
        (0, common_1.Controller)('freelance')
    ], FreelanceController);
    return FreelanceController;
}());
exports.FreelanceController = FreelanceController;
