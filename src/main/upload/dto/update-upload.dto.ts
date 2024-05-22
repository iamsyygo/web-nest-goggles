import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Upload } from '../entities/upload.entity';

export class UpdateUploadDto extends PartialType(OmitType(Upload, ['createDate', 'updateDate'] as const)) {}
