"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMailDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_email_dto_1 = require("./create-email.dto");
class UpdateMailDto extends (0, swagger_1.PartialType)(create_email_dto_1.CreateMailDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMailDto = UpdateMailDto;
//# sourceMappingURL=update-email.dto.js.map