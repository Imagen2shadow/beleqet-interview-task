"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.FreelanceService = exports.CreateBidDto = exports.CreateFreelanceJobDto = void 0;
var common_1 = require("@nestjs/common");
var CreateFreelanceJobDto = /** @class */ (function () {
    function CreateFreelanceJobDto() {
    }
    return CreateFreelanceJobDto;
}());
exports.CreateFreelanceJobDto = CreateFreelanceJobDto;
var CreateBidDto = /** @class */ (function () {
    function CreateBidDto() {
    }
    return CreateBidDto;
}());
exports.CreateBidDto = CreateBidDto;
var FreelanceService = /** @class */ (function () {
    function FreelanceService(prisma) {
        this.prisma = prisma;
    }
    FreelanceService.prototype.createJob = function (clientId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.freelanceJob.create({
                        data: __assign(__assign({}, dto), { clientId: clientId, status: 'OPEN' }),
                        include: { category: true, client: { select: { id: true, firstName: true, lastName: true } } }
                    })];
            });
        });
    };
    FreelanceService.prototype.findJobs = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var pageNum, limitNum, q, category, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pageNum = Number(query.page) || 1;
                        limitNum = Number(query.limit) || 20;
                        q = query.q, category = query.category;
                        where = { status: { "in": ['OPEN', 'FUNDED'] } };
                        if (category)
                            where['category'] = { slug: category };
                        if (q)
                            where['OR'] = [
                                { title: { contains: q, mode: 'insensitive' } },
                                { description: { contains: q, mode: 'insensitive' } },
                            ];
                        return [4 /*yield*/, Promise.all([
                                this.prisma.freelanceJob.findMany({
                                    where: where,
                                    include: { category: true, _count: { select: { bids: true } } },
                                    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                                    skip: (pageNum - 1) * limitNum,
                                    take: limitNum
                                }),
                                this.prisma.freelanceJob.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, { items: items, total: total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }];
                }
            });
        });
    };
    FreelanceService.prototype.findJobById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.freelanceJob.findUnique({
                            where: { id: id },
                            include: {
                                category: true,
                                client: { select: { id: true, firstName: true, lastName: true } },
                                bids: {
                                    include: { freelancer: { select: { id: true, firstName: true, lastName: true } } },
                                    orderBy: { createdAt: 'desc' }
                                }
                            }
                        })];
                    case 1:
                        job = _a.sent();
                        if (!job)
                            throw new common_1.NotFoundException('Gig not found');
                        return [2 /*return*/, job];
                }
            });
        });
    };
    FreelanceService.prototype.submitBid = function (freelancerId, gigId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var gig, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.freelanceJob.findFirst({
                            where: { id: gigId, status: { "in": ['OPEN', 'FUNDED'] } }
                        })];
                    case 1:
                        gig = _a.sent();
                        if (!gig)
                            throw new common_1.NotFoundException('Gig not found or no longer accepting bids');
                        return [4 /*yield*/, this.prisma.bid.findUnique({
                                where: { freelanceJobId_freelancerId: { freelanceJobId: gigId, freelancerId: freelancerId } }
                            })];
                    case 2:
                        existing = _a.sent();
                        if (existing)
                            throw new common_1.ConflictException('You have already submitted a bid');
                        return [2 /*return*/, this.prisma.bid.create({ data: __assign(__assign({}, dto), { freelanceJobId: gigId, freelancerId: freelancerId }) })];
                }
            });
        });
    };
    FreelanceService.prototype.acceptBid = function (bidId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var bid, contract;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.bid.findFirst({
                            where: { id: bidId, freelanceJob: { clientId: clientId } }
                        })];
                    case 1:
                        bid = _a.sent();
                        if (!bid)
                            throw new common_1.NotFoundException('Bid not found');
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var c;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Accept chosen bid, reject others
                                        return [4 /*yield*/, tx.bid.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } })];
                                        case 1:
                                            // Accept chosen bid, reject others
                                            _a.sent();
                                            return [4 /*yield*/, tx.bid.updateMany({
                                                    where: { freelanceJobId: bid.freelanceJobId, id: { not: bidId } },
                                                    data: { status: 'REJECTED' }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, tx.contract.create({
                                                    data: { freelanceJobId: bid.freelanceJobId, clientId: clientId, freelancerId: bid.freelancerId, agreedAmount: bid.amount }
                                                })];
                                        case 3:
                                            c = _a.sent();
                                            // Update gig status
                                            return [4 /*yield*/, tx.freelanceJob.update({
                                                    where: { id: bid.freelanceJobId },
                                                    data: { status: 'IN_PROGRESS' }
                                                })];
                                        case 4:
                                            // Update gig status
                                            _a.sent();
                                            // Create a chat room for this contract
                                            return [4 /*yield*/, tx.chatRoom.create({
                                                    data: {
                                                        contractId: c.id,
                                                        participants: { create: [{ userId: clientId }, { userId: bid.freelancerId }] }
                                                    }
                                                })];
                                        case 5:
                                            // Create a chat room for this contract
                                            _a.sent();
                                            return [2 /*return*/, c];
                                    }
                                });
                            }); })];
                    case 2:
                        contract = _a.sent();
                        return [2 /*return*/, contract];
                }
            });
        });
    };
    FreelanceService.prototype.getMyBids = function (freelancerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.bid.findMany({
                        where: { freelancerId: freelancerId },
                        include: { freelanceJob: { include: { category: true } } },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    FreelanceService.prototype.getContract = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.contract.findUnique({
                            where: { id: id },
                            include: {
                                milestones: { include: { deliverables: true } },
                                freelanceJob: true,
                                client: { select: { id: true, firstName: true, lastName: true } },
                                freelancer: { select: { id: true, firstName: true, lastName: true } }
                            }
                        })];
                    case 1:
                        c = _a.sent();
                        if (!c)
                            throw new common_1.NotFoundException('Contract not found');
                        return [2 /*return*/, c];
                }
            });
        });
    };
    FreelanceService.prototype.approveMilestone = function (milestoneId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.milestone.findFirst({
                            where: { id: milestoneId, contract: { clientId: clientId } }
                        })];
                    case 1:
                        m = _a.sent();
                        if (!m)
                            throw new common_1.ForbiddenException('Not authorized or milestone not found');
                        return [2 /*return*/, this.prisma.milestone.update({
                                where: { id: milestoneId },
                                data: { status: 'APPROVED', approvedAt: new Date() }
                            })];
                }
            });
        });
    };
    FreelanceService = __decorate([
        (0, common_1.Injectable)()
    ], FreelanceService);
    return FreelanceService;
}());
exports.FreelanceService = FreelanceService;
