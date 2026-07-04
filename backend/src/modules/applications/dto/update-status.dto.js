"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateStatusDto = exports.ApplicationStatus = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["SUBMITTED"] = "SUBMITTED";
    ApplicationStatus["SCREENING"] = "SCREENING";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["INTERVIEW_SCHEDULED"] = "INTERVIEW_SCHEDULED";
    ApplicationStatus["HIRED"] = "HIRED";
})(ApplicationStatus = exports.ApplicationStatus || (exports.ApplicationStatus = {}));
var UpdateStatusDto = /** @class */ (function () {
    function UpdateStatusDto() {
    }
    UpdateStatusDto._OPENAPI_METADATA_FACTORY = function () {
        return { status: { required: true, "enum": require("./update-status.dto").ApplicationStatus }, notes: { required: false, type: function () { return String; } } };
    };
    __decorate([
        (0, class_validator_1.IsEnum)(ApplicationStatus)
    ], UpdateStatusDto.prototype, "status");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], UpdateStatusDto.prototype, "notes");
    return UpdateStatusDto;
}());
exports.UpdateStatusDto = UpdateStatusDto;
