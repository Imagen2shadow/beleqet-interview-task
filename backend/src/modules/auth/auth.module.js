"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var passport_1 = require("@nestjs/passport");
var config_1 = require("@nestjs/config");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var jwt_strategy_1 = require("./strategies/jwt.strategy");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
                jwt_1.JwtModule.registerAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return ({
                        secret: config.get('JWT_ACCESS_SECRET'),
                        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES', '15m') }
                    }); }
                }),
                bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.NOTIFICATIONS }),
            ],
            providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
            controllers: [auth_controller_1.AuthController],
            exports: [auth_service_1.AuthService, jwt_1.JwtModule]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
