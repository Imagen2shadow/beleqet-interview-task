"use strict";
exports.__esModule = true;
exports.Roles = exports.ROLES_KEY = exports.CurrentUser = void 0;
// common/decorators/current-user.decorator.ts
var common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)(function (_data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    return request.user;
});
// common/decorators/roles.decorator.ts
var common_2 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
var Roles = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, common_2.SetMetadata)(exports.ROLES_KEY, roles);
};
exports.Roles = Roles;
