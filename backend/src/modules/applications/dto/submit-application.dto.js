"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SubmitApplicationDto = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var SubmitApplicationDto = /** @class */ (function () {
    function SubmitApplicationDto() {
    }
    SubmitApplicationDto._OPENAPI_METADATA_FACTORY = function () {
        return { jobId: { required: true, type: function () { return String; }, format: "uuid" }, coverLetter: { required: true, type: function () { return String; }, minLength: 50, maxLength: 5000 }, resumeUrl: { required: false, type: function () { return String; }, format: "uri" }, portfolioUrl: { required: false, type: function () { return String; }, format: "uri" }, expectedSalary: { required: false, type: function () { return Number; }, minimum: 0 } };
    };
    __decorate([
        (0, class_validator_1.IsUUID)()
    ], SubmitApplicationDto.prototype, "jobId");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(50, { message: 'Cover letter must be at least 50 characters' }),
        (0, class_validator_1.MaxLength)(5000, { message: 'Cover letter must not exceed 5000 characters' })
    ], SubmitApplicationDto.prototype, "coverLetter");
    __decorate([
        (0, class_validator_1.IsUrl)(),
        (0, class_validator_1.IsOptional)()
    ], SubmitApplicationDto.prototype, "resumeUrl");
    __decorate([
        (0, class_validator_1.IsUrl)(),
        (0, class_validator_1.IsOptional)()
    ], SubmitApplicationDto.prototype, "portfolioUrl");
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.Min)(0),
        (0, class_validator_1.IsOptional)()
    ], SubmitApplicationDto.prototype, "expectedSalary");
    return SubmitApplicationDto;
}());
exports.SubmitApplicationDto = SubmitApplicationDto;
