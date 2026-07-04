"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var ChatGateway = /** @class */ (function () {
    function ChatGateway(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    ChatGateway_1 = ChatGateway;
    ChatGateway.prototype.handleConnection = function (client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tokenString, token, payload;
            return __generator(this, function (_c) {
                try {
                    tokenString = ((_a = client.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = client.handshake.headers) === null || _b === void 0 ? void 0 : _b.authorization);
                    if (!tokenString)
                        throw new Error('No token provided');
                    token = tokenString.replace('Bearer ', '').trim();
                    payload = this.jwtService.verify(token);
                    client.data.user = payload;
                    this.logger.log("[ChatGateway] Client connected: ".concat(client.id, " (User: ").concat(payload.userId, ")"));
                }
                catch (err) {
                    this.logger.warn("[ChatGateway] Unauthorized connection attempt: ".concat(client.id));
                    client.disconnect();
                }
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.handleDisconnect = function (client) {
        this.logger.log("[ChatGateway] Client disconnected: ".concat(client.id));
    };
    ChatGateway.prototype.handleJoinRoom = function (data, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, history_1, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = client.data.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId || !data.roomId)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        client.join(data.roomId);
                        this.logger.log("User ".concat(userId, " joined room ").concat(data.roomId));
                        return [4 /*yield*/, this.chatService.getRoomMessages(data.roomId, userId)];
                    case 2:
                        history_1 = _b.sent();
                        client.emit('room_history', history_1);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        this.logger.error("Error joining room: ".concat(err_1.message));
                        client.emit('error', { message: 'Failed to join room' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.handleMessage = function (data, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, savedMsg, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = client.data.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId || !data.roomId || !data.content)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.chatService.saveMessage(data.roomId, userId, data.content)];
                    case 2:
                        savedMsg = _b.sent();
                        // Broadcast to everyone in the room (including sender)
                        this.server.to(data.roomId).emit('new_message', savedMsg);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        this.logger.error("Error sending message: ".concat(err_2.message));
                        client.emit('error', { message: 'Failed to send message' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var ChatGateway_1;
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChatGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('join_room'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], ChatGateway.prototype, "handleJoinRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('send_message'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], ChatGateway.prototype, "handleMessage");
    ChatGateway = ChatGateway_1 = __decorate([
        (0, websockets_1.WebSocketGateway)({
            cors: { origin: true, credentials: true },
            namespace: '/chat'
        })
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
