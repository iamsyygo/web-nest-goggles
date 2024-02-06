"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../entities/user.entity");
class UpdateUserDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(user_entity_1.User, ['createDate', 'password', 'lastLoginDate', 'lastLoginIp', 'updateDate'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map