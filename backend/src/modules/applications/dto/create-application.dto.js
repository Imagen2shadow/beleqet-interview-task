"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateApplicationStatusDto = exports.ApplicationStatus = exports.CreateApplicationDto = void 0;
var openapi = require("@nestjs/swagger");
// dto/create-application.dto.ts
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateApplicationDto = /** @class */ (function () {
    function CreateApplicationDto() {
    }
    CreateApplicationDto._OPENAPI_METADATA_FACTORY = function () {
        return { jobId: { required: true, type: function () { return String; }, format: "uuid" }, coverLetter: { required: false, type: function () { return String; }, minLength: 50, maxLength: 10000 }, resumeUrl: { required: false, type: function () { return String; }, maxLength: 500, format: "uri" }, screeningAnswers: { required: false, type: "object", additionalProperties: true }, portfolioUrl: { required: false, type: function () { return String; }, format: "uri" }, expectedSalary: { required: false, type: function () { return Number; } } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ description: 'UUID of the job being applied to', example: '123e4567-e89b-12d3-a456-426614174000' }),
        (0, class_validator_1.IsUUID)()
    ], CreateApplicationDto.prototype, "jobId");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, example: 'I am writing to express my interest in this position. I have over 5 years of experience building scalable backend APIs using NestJS and PostgreSQL...' }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(50, { message: 'Cover letter must be at least 50 characters long' }),
        (0, class_validator_1.MaxLength)(10000)
    ], CreateApplicationDto.prototype, "coverLetter");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, description: 'URL to uploaded resume/CV', example: 'https://example.com/resume.pdf' }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)(),
        (0, class_validator_1.MaxLength)(500)
    ], CreateApplicationDto.prototype, "resumeUrl");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, example: { "Why do you want this job?": "I love coding." } }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsObject)()
    ], CreateApplicationDto.prototype, "screeningAnswers");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, example: 'https://github.com/beleqet' }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateApplicationDto.prototype, "portfolioUrl");
    __decorate([
        (0, swagger_1.ApiProperty)({ required: false, example: 50000 }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)()
    ], CreateApplicationDto.prototype, "expectedSalary");
    return CreateApplicationDto;
}());
exports.CreateApplicationDto = CreateApplicationDto;
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["SUBMITTED"] = "SUBMITTED";
    ApplicationStatus["SCREENING"] = "SCREENING";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["INTERVIEW_SCHEDULED"] = "INTERVIEW_SCHEDULED";
    ApplicationStatus["OFFERED"] = "OFFERED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStatus = exports.ApplicationStatus || (exports.ApplicationStatus = {}));
var UpdateApplicationStatusDto = /** @class */ (function () {
    function UpdateApplicationStatusDto() {
    }
    UpdateApplicationStatusDto._OPENAPI_METADATA_FACTORY = function () {
        return { status: { required: true, "enum": require("./create-application.dto").ApplicationStatus } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ "enum": ApplicationStatus, enumName: 'ApplicationStatus', example: ApplicationStatus.SHORTLISTED }),
        (0, class_validator_1.IsEnum)(ApplicationStatus)
    ], UpdateApplicationStatusDto.prototype, "status");
    return UpdateApplicationStatusDto;
}());
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
