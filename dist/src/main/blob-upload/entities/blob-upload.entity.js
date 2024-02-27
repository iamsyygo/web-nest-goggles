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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobUpload = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enum_1 = require("../../../types/enum");
let BlobUpload = class BlobUpload {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createDate: { required: true, type: () => Date }, updateDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../types/enum").DataStatusEnum }, deleteDate: { required: true, type: () => Date }, fileName: { required: true, type: () => String }, url: { required: true, type: () => String }, downloadUrl: { required: true, type: () => String }, pathname: { required: true, type: () => String }, contentType: { required: true, type: () => String }, contentDisposition: { required: true, type: () => String }, size: { required: true, type: () => Number } };
    }
};
exports.BlobUpload = BlobUpload;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlobUpload.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        comment: '上传时间',
        update: false,
    }),
    __metadata("design:type", Date)
], BlobUpload.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        comment: '修改时间',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: { from: (value) => value, to: () => new Date() },
    }),
    __metadata("design:type", Date)
], BlobUpload.prototype, "updateDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        comment: '状态',
        default: enum_1.DataStatusEnum.ENABLE,
        enum: enum_1.DataStatusEnum,
        select: false,
    }),
    __metadata("design:type", Number)
], BlobUpload.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        type: 'timestamp',
        comment: '删除时间',
        default: null,
        nullable: true,
    }),
    __metadata("design:type", Date)
], BlobUpload.prototype, "deleteDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '文件名',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        comment: '文件路径(vercel blob 路径)',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        comment: '下载地址',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "downloadUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        comment: '路径名',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "pathname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '文件类型',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        comment: 'contentDisposition',
    }),
    __metadata("design:type", String)
], BlobUpload.prototype, "contentDisposition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        comment: '文件大小',
    }),
    __metadata("design:type", Number)
], BlobUpload.prototype, "size", void 0);
exports.BlobUpload = BlobUpload = __decorate([
    (0, typeorm_1.Entity)()
], BlobUpload);
//# sourceMappingURL=blob-upload.entity.js.map