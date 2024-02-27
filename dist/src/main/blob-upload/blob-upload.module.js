"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobUploadModule = void 0;
const common_1 = require("@nestjs/common");
const blob_upload_service_1 = require("./blob-upload.service");
const blob_upload_controller_1 = require("./blob-upload.controller");
const typeorm_1 = require("@nestjs/typeorm");
const blob_upload_entity_1 = require("./entities/blob-upload.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_config_1 = require("../../config/jwt.config");
let BlobUploadModule = class BlobUploadModule {
};
exports.BlobUploadModule = BlobUploadModule;
exports.BlobUploadModule = BlobUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([blob_upload_entity_1.BlobUpload]),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: jwt_config_1.JwtUseFactory,
            }),
        ],
        controllers: [blob_upload_controller_1.BlobUploadController],
        providers: [blob_upload_service_1.BlobUploadService, jwt_config_1.JwtAuthStrategy],
    })
], BlobUploadModule);
//# sourceMappingURL=blob-upload.module.js.map