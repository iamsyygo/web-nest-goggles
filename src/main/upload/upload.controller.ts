import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('文件上传相关接口')
@Controller('upload')
export class BlobUploadController {
  constructor(private readonly uploadService: UploadService) {}
}
