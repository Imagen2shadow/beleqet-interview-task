"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var swagger_1 = require("@nestjs/swagger");
var helmet_1 = require("helmet");
var app_module_1 = require("./app.module");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
var logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, app, configService, port, nodeEnv, swaggerConfig, document_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new common_1.Logger('Bootstrap');
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true, rawBody: true })];
                case 1:
                    app = _a.sent();
                    configService = app.get(config_1.ConfigService);
                    port = configService.get('PORT', 4000);
                    nodeEnv = configService.get('NODE_ENV', 'development');
                    // ── Security ──────────────────────────────────────────────────────────────
                    app.use((0, helmet_1["default"])());
                    app.enableCors({
                        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
                        credentials: true,
                        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
                    });
                    // ── Global prefix ─────────────────────────────────────────────────────────
                    app.setGlobalPrefix('api/v1');
                    // ── Validation ────────────────────────────────────────────────────────────
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                        transformOptions: { enableImplicitConversion: true }
                    }));
                    // ── Serialization ─────────────────────────────────────────────────────────
                    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
                    // ── Exception filter ──────────────────────────────────────────────────────
                    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
                    // ── Logging interceptor ───────────────────────────────────────────────────
                    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
                    // ── Swagger (disabled in production) ──────────────────────────────────────
                    if (nodeEnv !== 'production') {
                        swaggerConfig = new swagger_1.DocumentBuilder()
                            .setTitle('Beleqet API')
                            .setDescription('Beleqet Hiring Platform — Jobs Board, Freelance Marketplace, BeleqetSafe Escrow')
                            .setVersion('1.0')
                            .addBearerAuth()
                            .addTag('auth', 'Authentication & session management')
                            .addTag('users', 'User profile management')
                            .addTag('jobs', 'Job listings & search')
                            .addTag('applications', 'Job applications & workflow')
                            .addTag('freelance', 'Freelance gigs, bids & contracts')
                            .addTag('escrow', 'BeleqetSafe escrow & payments')
                            .addTag('wallet', 'Freelancer wallet & withdrawals')
                            .addTag('notifications', 'Notification management')
                            .addTag('analytics', 'Platform analytics')
                            .build();
                        document_1 = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
                        swagger_1.SwaggerModule.setup('api/docs', app, document_1);
                        logger.log("Swagger UI \u2192 http://localhost:".concat(port, "/api/docs"));
                    }
                    // ── Graceful shutdown ─────────────────────────────────────────────────────
                    app.enableShutdownHooks();
                    return [4 /*yield*/, app.listen(port)];
                case 2:
                    _a.sent();
                    logger.log("\uD83D\uDE80 Beleqet API running on http://localhost:".concat(port, "/api/v1"));
                    logger.log("   Environment: ".concat(nodeEnv));
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap()["catch"](function (err) {
    var logger = new common_1.Logger('Bootstrap');
    logger.error('Fatal startup error', err);
    process.exit(1);
});
