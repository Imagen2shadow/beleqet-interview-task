"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HttpExceptionFilter = void 0;
// common/filters/http-exception.filter.ts
var common_1 = require("@nestjs/common");
var HttpExceptionFilter = /** @class */ (function () {
    function HttpExceptionFilter() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    HttpExceptionFilter_1 = HttpExceptionFilter;
    HttpExceptionFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var res = ctx.getResponse();
        var req = ctx.getRequest();
        var status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        var message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        if (status >= 500) {
            this.logger.error("".concat(req.method, " ").concat(req.url, " \u2192 ").concat(status), exception instanceof Error ? exception.stack : String(exception));
        }
        res.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: req.url,
            message: typeof message === 'string' ? message : message.message
        });
    };
    var HttpExceptionFilter_1;
    HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
        (0, common_1.Catch)()
    ], HttpExceptionFilter);
    return HttpExceptionFilter;
}());
exports.HttpExceptionFilter = HttpExceptionFilter;
