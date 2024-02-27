/// <reference types="multer" />
import { BlobUpload } from './entities/blob-upload.entity';
import { ConfigService } from '@nestjs/config';
import { PageQueryDto } from './dto/query-blob-upload.dto';
export declare class BlobUploadService {
    private readonly configService;
    private readonly BlobUploadRepo;
    constructor(configService: ConfigService);
    upload(file: Express.Multer.File): Promise<boolean>;
    findList({ page, pageSize }: PageQueryDto): Promise<{
        list: BlobUpload[];
        total: number;
        meta: {
            page: number;
            pageSize: number;
            totalSize: number;
        };
    }>;
    findOne(id: number): Promise<BlobUpload>;
    remove(id: number): Promise<boolean>;
}
