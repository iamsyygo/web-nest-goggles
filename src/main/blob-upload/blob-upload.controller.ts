import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlobUploadService } from './blob-upload.service';

@ApiTags('文件上传相关接口')
@Controller('blob-upload')
export class BlobUploadController {
  constructor(private readonly blobUploadService: BlobUploadService) {}
}
