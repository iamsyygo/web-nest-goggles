import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Client } from 'minio';
import { APP_MINIO } from '@/main/minio/minio.module';
import { SkipJwtPassport } from '@/decorator/skip-jwt-passport.decorator';
import { User as UseUser } from '@/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateUploadDto, CreateUploadInfoDto } from './dto/create-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('文件上传相关接口')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Inject(APP_MINIO)
  private minioClient: Client;

  // @ApiOperation({ summary: '获取预签名URL' })
  // @Get('presigned')
  // presigned(@Query('name') name: string, @UseUser() user: User) {
  //   return this.uploadService.getFileUrl(name);
  // }

  @ApiOperation({ summary: '上传文件至 oss' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    type: CreateUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put()
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 35 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UseUser() user: User,
  ) {
    return this.uploadService.uploadFile(file, user);
  }

  // 上传文件到 Minio
  // const uploadResponse = await fetch(url, {
  //   method: 'PUT',
  //   body: file,
  //   headers: { 'Content-Type': file.type },
  // });
  @ApiOperation({ summary: '根据文件名称获取 minio 上传 url' })
  @Post('generate-url')
  async generatePresignedUrl(@Body('filename') filename: string) {
    return await this.uploadService.generatePresignedUrl(filename);
  }

  @ApiOperation({ summary: '成功上传文件后保存文件信息' })
  @Post('store-data')
  async storeFile(@Body() fileInfo: CreateUploadInfoDto) {
    return await this.uploadService.save(fileInfo);
  }

  @ApiOperation({ summary: '删除文件' })
  @Put('delete')
  delete(@Query('name') name: string) {
    return this.uploadService.deleteFile(name);
  }
}
