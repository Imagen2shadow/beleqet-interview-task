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
exports.JobsService = void 0;
var common_1 = require("@nestjs/common");
var JobsService = /** @class */ (function () {
    function JobsService(prisma) {
        this.prisma = prisma;
    }
    JobsService.prototype.create = function (employerId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var company, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.company.findUnique({ where: { userId: employerId } })];
                    case 1:
                        company = _a.sent();
                        if (!company)
                            throw new common_1.ForbiddenException('Create a company profile before posting jobs');
                        data = __assign(__assign({}, dto), { companyId: company.id, status: dto.status || 'PUBLISHED' });
                        if (data.deadline)
                            data.deadline = new Date(data.deadline);
                        if (data.expiryDate)
                            data.expiryDate = new Date(data.expiryDate);
                        return [2 /*return*/, this.prisma.job.create({
                                data: data,
                                include: { company: true, category: true }
                            })];
                }
            });
        });
    };
    JobsService.prototype.getCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.jobCategory.findMany({
                        orderBy: { label: 'asc' }
                    })];
            });
        });
    };
    JobsService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var pageNum, limitNum, q, category, location, type, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pageNum = Number(query.page) || 1;
                        limitNum = Number(query.limit) || 20;
                        q = query.q, category = query.category, location = query.location, type = query.type;
                        where = { status: 'PUBLISHED' };
                        if (type)
                            where['type'] = type;
                        if (category)
                            where['category'] = { slug: category };
                        if (location)
                            where['location'] = { contains: location, mode: 'insensitive' };
                        if (q)
                            where['OR'] = [
                                { title: { contains: q, mode: 'insensitive' } },
                                { description: { contains: q, mode: 'insensitive' } },
                            ];
                        return [4 /*yield*/, Promise.all([
                                this.prisma.job.findMany({
                                    where: where,
                                    include: { company: true, category: true, _count: { select: { applications: true } } },
                                    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                                    skip: (pageNum - 1) * limitNum,
                                    take: limitNum
                                }),
                                this.prisma.job.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, { items: items, total: total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }];
                }
            });
        });
    };
    JobsService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.job.findUnique({
                            where: { id: id },
                            include: { company: true, category: true, _count: { select: { applications: true } } }
                        })];
                    case 1:
                        job = _a.sent();
                        if (!job)
                            throw new common_1.NotFoundException("Job ".concat(id, " not found"));
                        return [2 /*return*/, job];
                }
            });
        });
    };
    JobsService.prototype.update = function (id, employerId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.job.findFirst({ where: { id: id, company: { userId: employerId } } })];
                    case 1:
                        job = _a.sent();
                        if (!job)
                            throw new common_1.NotFoundException('Job not found or access denied');
                        return [2 /*return*/, this.prisma.job.update({ where: { id: id }, data: dto })];
                }
            });
        });
    };
    JobsService.prototype.remove = function (id, employerId) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.job.findFirst({ where: { id: id, company: { userId: employerId } } })];
                    case 1:
                        job = _a.sent();
                        if (!job)
                            throw new common_1.NotFoundException('Job not found or access denied');
                        return [2 /*return*/, this.prisma.job.update({ where: { id: id }, data: { status: 'ARCHIVED' } })];
                }
            });
        });
    };
    JobsService.prototype.findByCompany = function (employerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.job.findMany({
                        where: { company: { userId: employerId } },
                        include: { category: true, _count: { select: { applications: true } } },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    JobsService = __decorate([
        (0, common_1.Injectable)()
    ], JobsService);
    return JobsService;
}());
exports.JobsService = JobsService;
