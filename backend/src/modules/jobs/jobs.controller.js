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
exports.JobsController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../../common/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
var JobsController = /** @class */ (function () {
    function JobsController(svc) {
        this.svc = svc;
    }
    JobsController.prototype.findAll = function (query) {
        return this.svc.findAll(query);
    };
    JobsController.prototype.myJobs = function (user) {
        return this.svc.findByCompany(user.userId);
    };
    JobsController.prototype.getCategories = function () {
        return this.svc.getCategories();
    };
    JobsController.prototype.findOne = function (id) {
        return this.svc.findOne(id);
    };
    JobsController.prototype.create = function (user, dto) {
        return this.svc.create(user.userId, dto);
    };
    JobsController.prototype.update = function (id, user, dto) {
        return this.svc.update(id, user.userId, dto);
    };
    JobsController.prototype.remove = function (id, user) {
        return this.svc.remove(id, user.userId);
    };
    __decorate([
        (0, common_1.Get)(),
        (0, swagger_1.ApiOperation)({ summary: 'Search & browse job listings (public)' }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Query)())
    ], JobsController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)('my'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)('EMPLOYER', 'ADMIN'),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200, type: [Object] }),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], JobsController.prototype, "myJobs");
    __decorate([
        (0, common_1.Get)('categories'),
        (0, swagger_1.ApiOperation)({ summary: 'Get all job categories' }),
        openapi.ApiResponse({ status: 200 })
    ], JobsController.prototype, "getCategories");
    __decorate([
        (0, common_1.Get)(':id'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Param)('id'))
    ], JobsController.prototype, "findOne");
    __decorate([
        (0, common_1.Post)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)('EMPLOYER', 'ADMIN'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, swagger_1.ApiOperation)({ summary: 'Create a job listing (employer only)' }),
        openapi.ApiResponse({ status: 201, type: Object }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)())
    ], JobsController.prototype, "create");
    __decorate([
        (0, common_1.Patch)(':id'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)('EMPLOYER', 'ADMIN'),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __param(2, (0, common_1.Body)())
    ], JobsController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)('EMPLOYER', 'ADMIN'),
        (0, swagger_1.ApiBearerAuth)(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)())
    ], JobsController.prototype, "remove");
    JobsController = __decorate([
        (0, swagger_1.ApiTags)('jobs'),
        (0, common_1.Controller)('jobs')
    ], JobsController);
    return JobsController;
}());
exports.JobsController = JobsController;
