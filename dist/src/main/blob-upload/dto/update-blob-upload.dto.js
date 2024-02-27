"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlobUploadDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const blob_upload_entity_1 = require("../entities/blob-upload.entity");
class UpdateBlobUploadDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(blob_upload_entity_1.BlobUpload, ['createDate', 'updateDate'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBlobUploadDto = UpdateBlobUploadDto;
//# sourceMappingURL=update-blob-upload.dto.js.map