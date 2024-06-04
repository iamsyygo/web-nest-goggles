import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Client } from 'minio';
import { APP_MINIO } from '@/main/minio/minio.module';
import { SkipJwtPassport } from '@/decorator/skip-jwt-passport.decorator';

@ApiTags('文件上传相关接口')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Inject(APP_MINIO)
  private minioClient: Client;

  @SkipJwtPassport()
  @Get('test')
  async test() {
    try {
      // filePath 相对与根路径
      await this.minioClient.fPutObject('goggles', 'hello.json', './package.json');
      return 'http://localhost:9000/goggles/hello.json';
    } catch (e) {
      console.error(e);
      return '上传失败';
    }
  }

  @SkipJwtPassport()
  @ApiOperation({ summary: '获取预签名URL' })
  @Get('presigned')
  async presigned(@Query('name') name: string) {
    try {
      // const url = await this.minioClient.presignedPutObject('goggles', name, 60 * 60 * 24);
      const url = await this.minioClient.presignedPutObject('goggles', name, 60 * 60 * 24);
      return url;
    } catch (e) {
      console.error(e);
      return '获取预签名URL失败';
    }
  }
}
