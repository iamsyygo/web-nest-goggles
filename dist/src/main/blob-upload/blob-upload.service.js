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
exports.BlobUploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const blob_upload_entity_1 = require("./entities/blob-upload.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const blob_1 = require("@vercel/blob");
let BlobUploadService = class BlobUploadService {
    constructor(configService) {
        this.configService = configService;
    }
    async upload(file) {
        const token = this.configService.get('vercel.blob_read_write_token', '');
        if (!token)
            throw new Error('未配置 vercel token');
        const fileName = file.originalname;
        const size = file.size;
        const fileBuffer = file.buffer;
        const putRes = await (0, blob_1.put)(fileName, fileBuffer, { access: 'public', token: token });
        const et = {
            ...putRes,
            size,
            fileName,
        };
        const BlobUpload = await this.BlobUploadRepo.insert(et);
        if (BlobUpload.identifiers.length === 0)
            throw new common_1.BadRequestException('上传失败');
        return true;
    }
    async findList({ page = 1, pageSize = 10 }) {
        const [list, total] = await this.BlobUploadRepo.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            total,
            meta: {
                page: +page,
                pageSize: +pageSize,
                totalSize: Math.ceil(total / pageSize),
            },
        };
    }
    async findOne(id) {
        return await this.BlobUploadRepo.findOne({
            where: { id },
        });
    }
    async remove(id) {
        const BlobUpload = await this.BlobUploadRepo.findOne({ where: { id } });
        if (!BlobUpload)
            throw new common_1.BadRequestException('资源不存在');
        const token = this.configService.get('vercel.blob_read_write_token', '');
        if (!token)
            throw new Error('未配置 vercel token');
        await (0, blob_1.del)(BlobUpload.url, { token });
        const result = await this.BlobUploadRepo.softRemove({ ...BlobUpload });
        return !!result;
    }
};
exports.BlobUploadService = BlobUploadService;
__decorate([
    (0, typeorm_1.InjectRepository)(blob_upload_entity_1.BlobUpload),
    __metadata("design:type", typeorm_2.Repository)
], BlobUploadService.prototype, "BlobUploadRepo", void 0);
exports.BlobUploadService = BlobUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BlobUploadService);
//# sourceMappingURL=blob-upload.service.js.map