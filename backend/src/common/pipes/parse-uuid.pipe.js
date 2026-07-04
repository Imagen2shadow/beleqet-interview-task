"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ParseUUIDPipe = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var ParseUUIDPipe = /** @class */ (function () {
    function ParseUUIDPipe() {
    }
    ParseUUIDPipe.prototype.transform = function (value) {
        if (!(0, uuid_1.validate)(value)) {
            throw new common_1.BadRequestException("Validation failed: \"".concat(value, "\" is not a valid UUID"));
        }
        return value;
    };
    ParseUUIDPipe = __decorate([
        (0, common_1.Injectable)()
    ], ParseUUIDPipe);
    return ParseUUIDPipe;
}());
exports.ParseUUIDPipe = ParseUUIDPipe;
