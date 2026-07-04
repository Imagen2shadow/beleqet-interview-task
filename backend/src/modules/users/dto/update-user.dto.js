"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateCompanyDto = exports.UpdateUserDto = void 0;
var openapi = require("@nestjs/swagger");
// dto/update-user.dto.ts
var class_validator_1 = require("class-validator");
var UpdateUserDto = /** @class */ (function () {
    function UpdateUserDto() {
    }
    UpdateUserDto._OPENAPI_METADATA_FACTORY = function () {
        return { firstName: { required: false, type: function () { return String; } }, lastName: { required: false, type: function () { return String; } }, phone: { required: false, type: function () { return String; } }, avatarUrl: { required: false, type: function () { return String; }, format: "uri" }, telegramId: { required: false, type: function () { return String; } }, headline: { required: false, type: function () { return String; } }, bio: { required: false, type: function () { return String; } }, location: { required: false, type: function () { return String; } }, defaultResumeUrl: { required: false, type: function () { return String; }, format: "uri" }, portfolioUrl: { required: false, type: function () { return String; }, format: "uri" }, githubUrl: { required: false, type: function () { return String; }, format: "uri" }, linkedinUrl: { required: false, type: function () { return String; }, format: "uri" }, skills: { required: false, type: function () { return [String]; } } };
    };
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "firstName");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "lastName");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "phone");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], UpdateUserDto.prototype, "avatarUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "telegramId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "headline");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "bio");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "location");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], UpdateUserDto.prototype, "defaultResumeUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], UpdateUserDto.prototype, "portfolioUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], UpdateUserDto.prototype, "githubUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], UpdateUserDto.prototype, "linkedinUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)({ each: true })
    ], UpdateUserDto.prototype, "skills");
    return UpdateUserDto;
}());
exports.UpdateUserDto = UpdateUserDto;
var CreateCompanyDto = /** @class */ (function () {
    function CreateCompanyDto() {
    }
    CreateCompanyDto._OPENAPI_METADATA_FACTORY = function () {
        return { name: { required: true, type: function () { return String; } }, description: { required: false, type: function () { return String; } }, logoUrl: { required: false, type: function () { return String; }, format: "uri" }, website: { required: false, type: function () { return String; }, format: "uri" }, industry: { required: false, type: function () { return String; } }, size: { required: false, type: function () { return String; } }, location: { required: false, type: function () { return String; } }, linkedinUrl: { required: false, type: function () { return String; }, format: "uri" }, twitterUrl: { required: false, type: function () { return String; }, format: "uri" }, facebookUrl: { required: false, type: function () { return String; }, format: "uri" }, coverImageUrl: { required: false, type: function () { return String; } }, benefits: { required: false, type: function () { return [String]; } }, foundedYear: { required: false, type: function () { return Number; } } };
    };
    __decorate([
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "name");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "description");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateCompanyDto.prototype, "logoUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateCompanyDto.prototype, "website");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "industry");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "size");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "location");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateCompanyDto.prototype, "linkedinUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateCompanyDto.prototype, "twitterUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], CreateCompanyDto.prototype, "facebookUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateCompanyDto.prototype, "coverImageUrl");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)({ each: true })
    ], CreateCompanyDto.prototype, "benefits");
    __decorate([
        (0, class_validator_1.IsOptional)()
    ], CreateCompanyDto.prototype, "foundedYear");
    return CreateCompanyDto;
}());
exports.CreateCompanyDto = CreateCompanyDto;
