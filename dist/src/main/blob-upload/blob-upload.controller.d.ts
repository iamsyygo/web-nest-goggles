/// <reference types="multer" />
import { CreateBlobUploadDto } from './dto/create-blob-upload.dto';
import { BlobUploadService } from './blob-upload.service';
import { PageQueryDto } from './dto/query-blob-upload.dto';
export declare class BlobUploadController {
    private readonly blobUploadService;
    constructor(blobUploadService: BlobUploadService);
    upload(file: Express.Multer.File, body: CreateBlobUploadDto): Promise<boolean>;
    findList(pageQueryDto: PageQueryDto): Promise<{
        list: import("./entities/blob-upload.entity").BlobUpload[];
        total: number;
        meta: {
            page: number;
            pageSize: number;
            totalSize: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/blob-upload.entity").BlobUpload>;
    remove(id: string): Promise<boolean>;
}
