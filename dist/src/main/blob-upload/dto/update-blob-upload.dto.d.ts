import { BlobUpload } from '../entities/blob-upload.entity';
declare const UpdateBlobUploadDto_base: import("@nestjs/common").Type<Partial<Omit<BlobUpload, "createDate" | "updateDate">>>;
export declare class UpdateBlobUploadDto extends UpdateBlobUploadDto_base {
}
export {};
