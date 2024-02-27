"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobUploadController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_blob_upload_dto_1 = require("./dto/create-blob-upload.dto");
const blob_upload_service_1 = require("./blob-upload.service");
const skip_jwt_passport_decorator_1 = require("../../decorator/skip-jwt-passport.decorator");
const query_blob_upload_dto_1 = require("./dto/query-blob-upload.dto");
const platform_express_1 = require("@nestjs/platform-express");
let BlobUploadController = class BlobUploadController {
    constructor(blobUploadService) {
        this.blobUploadService = blobUploadService;
    }
    upload(file, body) {
        return this.blobUploadService.upload(file);
    }
    findList(pageQueryDto) {
        return this.blobUploadService.findList(pageQueryDto);
    }
    findOne(id) {
        return this.blobUploadService.findOne(+id);
    }
    remove(id) {
        return this.blobUploadService.remove(+id);
    }
};
exports.BlobUploadController = BlobUploadController;
__decorate([
    (0, swagger_1.ApiOperation)({ description: '', summary: 'vercel blob 上传' }),
    (0, skip_jwt_passport_decorator_1.SkipJwtPassport)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 4.5 * 1024 * 1024,
        },
    })),
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(201),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_blob_upload_dto_1.CreateBlobUploadDto]),
    __metadata("design:returntype", void 0)
], BlobUploadController.prototype, "upload", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: '', summary: 'vercel blob 列表查询' }),
    (0, skip_jwt_passport_decorator_1.SkipJwtPassport)(),
    (0, common_1.Get)('/list'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_blob_upload_dto_1.PageQueryDto]),
    __metadata("design:returntype", void 0)
], BlobUploadController.prototype, "findList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: '', summary: '根据 id 查询' }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/blob-upload.entity").BlobUpload }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlobUploadController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ description: '', summary: '删除 vercel blob' }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlobUploadController.prototype, "remove", null);
exports.BlobUploadController = BlobUploadController = __decorate([
    (0, swagger_1.ApiTags)('vercel blob upload'),
    (0, common_1.Controller)('blob-upload'),
    __metadata("design:paramtypes", [blob_upload_service_1.BlobUploadService])
], BlobUploadController);
//# sourceMappingURL=blob-upload.controller.js.map