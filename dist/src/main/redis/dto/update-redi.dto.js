"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRediDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_redi_dto_1 = require("./create-redi.dto");
class UpdateRediDto extends (0, swagger_1.PartialType)(create_redi_dto_1.CreateRediDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateRediDto = UpdateRediDto;
//# sourceMappingURL=update-redi.dto.js.map