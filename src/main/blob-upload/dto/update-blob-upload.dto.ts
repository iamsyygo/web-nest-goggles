import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { BlobUpload } from '../entities/blob-upload.entity';

export class UpdateBlobUploadDto extends PartialType(
  OmitType(BlobUpload, ['createDate', 'updateDate'] as const),
) {}
