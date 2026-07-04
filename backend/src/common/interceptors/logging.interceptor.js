"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoggingInterceptor = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var LoggingInterceptor = /** @class */ (function () {
    function LoggingInterceptor() {
        this.logger = new common_1.Logger('HTTP');
    }
    LoggingInterceptor.prototype.intercept = function (context, next) {
        var _this = this;
        var req = context.switchToHttp().getRequest();
        var method = req.method;
        var url = req.url;
        var start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(function () {
            var ms = Date.now() - start;
            _this.logger.log("".concat(method, " ").concat(url, " \u2192 ").concat(ms, "ms"));
        }));
    };
    LoggingInterceptor = __decorate([
        (0, common_1.Injectable)()
    ], LoggingInterceptor);
    return LoggingInterceptor;
}());
exports.LoggingInterceptor = LoggingInterceptor;
