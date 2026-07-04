"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var ChatService = /** @class */ (function () {
    function ChatService(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    ChatService_1 = ChatService;
    /** Create or fetch a chat room between two users (e.g. for a freelance contract) */
    ChatService.prototype.createOrGetRoom = function (userId1, userId2, contractId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!contractId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.chatRoom.findUnique({
                                where: { contractId: contractId },
                                include: { participants: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } }
                            })];
                    case 1:
                        existing = _a.sent();
                        if (existing)
                            return [2 /*return*/, existing];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.prisma.chatRoom.create({
                            data: {
                                contractId: contractId,
                                participants: {
                                    create: [{ userId: userId1 }, { userId: userId2 }]
                                }
                            },
                            include: { participants: true, messages: true }
                        })];
                    case 3:
                        room = _a.sent();
                        this.logger.log("Created new ChatRoom ".concat(room.id, " for users ").concat(userId1, " and ").concat(userId2));
                        return [2 /*return*/, room];
                }
            });
        });
    };
    /** Save a message to DB and return it populated */
    ChatService.prototype.saveMessage = function (roomId, senderId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.chatParticipant.findUnique({
                            where: { roomId_userId: { roomId: roomId, userId: senderId } }
                        })];
                    case 1:
                        participant = _a.sent();
                        if (!participant)
                            throw new common_1.NotFoundException('User is not a participant of this chat room');
                        return [2 /*return*/, this.prisma.message.create({
                                data: {
                                    roomId: roomId,
                                    senderId: senderId,
                                    content: content
                                },
                                include: {
                                    sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } }
                                }
                            })];
                }
            });
        });
    };
    /** Fetch message history */
    ChatService.prototype.getRoomMessages = function (roomId, userId, take) {
        if (take === void 0) { take = 50; }
        return __awaiter(this, void 0, void 0, function () {
            var participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.chatParticipant.findUnique({
                            where: { roomId_userId: { roomId: roomId, userId: userId } }
                        })];
                    case 1:
                        participant = _a.sent();
                        if (!participant)
                            throw new common_1.NotFoundException('Unauthorized');
                        return [2 /*return*/, this.prisma.message.findMany({
                                where: { roomId: roomId },
                                orderBy: { createdAt: 'asc' },
                                take: take,
                                include: {
                                    sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } }
                                }
                            })];
                }
            });
        });
    };
    var ChatService_1;
    ChatService = ChatService_1 = __decorate([
        (0, common_1.Injectable)()
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
