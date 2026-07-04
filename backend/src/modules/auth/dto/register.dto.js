"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.VerifyEmailDto = exports.RefreshDto = exports.LoginDto = exports.RegisterDto = exports.UserRole = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
// Local enum — avoids dependency on generated Prisma client at compile time.
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["EMPLOYER"] = "EMPLOYER";
    UserRole["JOB_SEEKER"] = "JOB_SEEKER";
    UserRole["FREELANCER"] = "FREELANCER";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var RegisterDto = /** @class */ (function () {
    function RegisterDto() {
    }
    RegisterDto._OPENAPI_METADATA_FACTORY = function () {
        return { email: { required: true, type: function () { return String; }, format: "email" }, firstName: { required: true, type: function () { return String; } }, lastName: { required: true, type: function () { return String; } }, password: { required: true, type: function () { return String; }, minLength: 8 }, role: { required: false, "enum": require("./register.dto").UserRole } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'henok@beleqet.com' }),
        (0, class_validator_1.IsEmail)()
    ], RegisterDto.prototype, "email");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'Henok' }),
        (0, class_validator_1.IsString)()
    ], RegisterDto.prototype, "firstName");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'Mekonnen' }),
        (0, class_validator_1.IsString)()
    ], RegisterDto.prototype, "lastName");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(8)
    ], RegisterDto.prototype, "password");
    __decorate([
        (0, swagger_1.ApiProperty)({ "enum": UserRole, "default": UserRole.JOB_SEEKER }),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(UserRole)
    ], RegisterDto.prototype, "role");
    return RegisterDto;
}());
exports.RegisterDto = RegisterDto;
var LoginDto = /** @class */ (function () {
    function LoginDto() {
    }
    LoginDto._OPENAPI_METADATA_FACTORY = function () {
        return { email: { required: true, type: function () { return String; }, format: "email" }, password: { required: true, type: function () { return String; } } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'henok@beleqet.com' }),
        (0, class_validator_1.IsEmail)()
    ], LoginDto.prototype, "email");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
        (0, class_validator_1.IsString)()
    ], LoginDto.prototype, "password");
    return LoginDto;
}());
exports.LoginDto = LoginDto;
var RefreshDto = /** @class */ (function () {
    function RefreshDto() {
    }
    RefreshDto._OPENAPI_METADATA_FACTORY = function () {
        return { refreshToken: { required: true, type: function () { return String; } } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], RefreshDto.prototype, "refreshToken");
    return RefreshDto;
}());
exports.RefreshDto = RefreshDto;
var VerifyEmailDto = /** @class */ (function () {
    function VerifyEmailDto() {
    }
    VerifyEmailDto._OPENAPI_METADATA_FACTORY = function () {
        return { token: { required: true, type: function () { return String; } } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], VerifyEmailDto.prototype, "token");
    return VerifyEmailDto;
}());
exports.VerifyEmailDto = VerifyEmailDto;
var ForgotPasswordDto = /** @class */ (function () {
    function ForgotPasswordDto() {
    }
    ForgotPasswordDto._OPENAPI_METADATA_FACTORY = function () {
        return { email: { required: true, type: function () { return String; }, format: "email" } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'henok@beleqet.com' }),
        (0, class_validator_1.IsEmail)()
    ], ForgotPasswordDto.prototype, "email");
    return ForgotPasswordDto;
}());
exports.ForgotPasswordDto = ForgotPasswordDto;
var ResetPasswordDto = /** @class */ (function () {
    function ResetPasswordDto() {
    }
    ResetPasswordDto._OPENAPI_METADATA_FACTORY = function () {
        return { token: { required: true, type: function () { return String; } }, newPassword: { required: true, type: function () { return String; }, minLength: 8 } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, class_validator_1.IsString)()
    ], ResetPasswordDto.prototype, "token");
    __decorate([
        (0, swagger_1.ApiProperty)({ example: 'NewSecurePass123!' }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(8)
    ], ResetPasswordDto.prototype, "newPassword");
    return ResetPasswordDto;
}());
exports.ResetPasswordDto = ResetPasswordDto;
