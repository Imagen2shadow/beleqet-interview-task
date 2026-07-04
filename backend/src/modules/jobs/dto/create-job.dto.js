"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QueryJobsDto = exports.CreateJobDto = exports.JobStatus = exports.JobType = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
// Local enum — mirrors Prisma JobType without requiring generated client
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "FULL_TIME";
    JobType["PART_TIME"] = "PART_TIME";
    JobType["REMOTE"] = "REMOTE";
    JobType["HYBRID"] = "HYBRID";
    JobType["CONTRACT"] = "CONTRACT";
})(JobType = exports.JobType || (exports.JobType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "DRAFT";
    JobStatus["PUBLISHED"] = "PUBLISHED";
    JobStatus["CLOSED"] = "CLOSED";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
var CreateJobDto = /** @class */ (function () {
    function CreateJobDto() {
    }
    CreateJobDto._OPENAPI_METADATA_FACTORY = function () {
        return { title: { required: true, type: function () { return String; } }, description: { required: true, type: function () { return String; } }, requirements: { required: false, type: function () { return String; } }, location: { required: true, type: function () { return String; } }, type: { required: true, "enum": require("./create-job.dto").JobType }, categoryId: { required: true, type: function () { return String; } }, salaryMin: { required: false, type: function () { return Number; } }, salaryMax: { required: false, type: function () { return Number; } }, deadline: { required: false, type: function () { return String; } }, featured: { required: false, type: function () { return Boolean; } }, tags: { required: false, type: function () { return [String]; } }, filled: { required: false, type: function () { return Boolean; } }, urgent: { required: false, type: function () { return Boolean; } }, jobSite: { required: false, type: function () { return String; } }, gender: { required: false, type: function () { return String; } }, salaryType: { required: false, type: function () { return String; } }, vacancies: { required: false, type: function () { return Number; } }, experienceLevel: { required: false, type: function () { return String; } }, yearsOfExperience: { required: false, type: function () { return String; } }, qualification: { required: false, type: function () { return String; } }, expiryDate: { required: false, type: function () { return String; } }, applyType: { required: false, type: function () { return String; } }, applyUrl: { required: false, type: function () { return String; } }, applyEmail: { required: false, type: function () { return String; } }, contactPhone: { required: false, type: function () { return String; } }, companyName: { required: false, type: function () { return String; } }, companyLogo: { required: false, type: function () { return String; } }, status: { required: false, "enum": require("./create-job.dto").JobStatus }, currency: { required: false, type: function () { return String; } } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "title");
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "description");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "requirements");
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "location");
    __decorate([
        (0, swagger_1.ApiProperty)({ "enum": JobType }),
        (0, class_validator_1.IsEnum)(JobType)
    ], CreateJobDto.prototype, "type");
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "categoryId");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], CreateJobDto.prototype, "salaryMin");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], CreateJobDto.prototype, "salaryMax");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)()
    ], CreateJobDto.prototype, "deadline");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], CreateJobDto.prototype, "featured");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true })
    ], CreateJobDto.prototype, "tags");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], CreateJobDto.prototype, "filled");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], CreateJobDto.prototype, "urgent");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "jobSite");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "gender");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "salaryType");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], CreateJobDto.prototype, "vacancies");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "experienceLevel");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "yearsOfExperience");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "qualification");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)()
    ], CreateJobDto.prototype, "expiryDate");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "applyType");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "applyUrl");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "applyEmail");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "contactPhone");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "companyName");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "companyLogo");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, "enum": JobStatus }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(JobStatus)
    ], CreateJobDto.prototype, "status");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateJobDto.prototype, "currency");
    return CreateJobDto;
}());
exports.CreateJobDto = CreateJobDto;
var QueryJobsDto = /** @class */ (function () {
    function QueryJobsDto() {
    }
    QueryJobsDto._OPENAPI_METADATA_FACTORY = function () {
        return { q: { required: false, type: function () { return String; } }, category: { required: false, type: function () { return String; } }, location: { required: false, type: function () { return String; } }, type: { required: false, "enum": require("./create-job.dto").JobType }, page: { required: false, type: function () { return Number; } }, limit: { required: false, type: function () { return Number; } } };
    };
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], QueryJobsDto.prototype, "q");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], QueryJobsDto.prototype, "category");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], QueryJobsDto.prototype, "location");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(JobType)
    ], QueryJobsDto.prototype, "type");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], QueryJobsDto.prototype, "page");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], QueryJobsDto.prototype, "limit");
    return QueryJobsDto;
}());
exports.QueryJobsDto = QueryJobsDto;
