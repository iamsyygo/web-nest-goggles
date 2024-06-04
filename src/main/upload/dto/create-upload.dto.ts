import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  file: Express.Multer.File;
}

export class CreateUploadInfoDto {
  @ApiProperty({ type: 'etag', format: 'string', description: 'etag 信息' })
  etag?: string;

  @ApiProperty({ type: 'objectName', format: 'string', description: '文件名' })
  objectName: string;

  @ApiProperty({ type: 'originalname', format: 'string', description: '原文件名' })
  originalname: string;

  @ApiProperty({ type: 'url', format: 'string', description: 'minio 地址' })
  url: string;

  @ApiProperty({ type: 'mimetype', format: 'string', description: '文件类型' })
  mimetype?: string;

  @ApiProperty({ type: 'size', format: 'number', description: '文件大小' })
  size?: number;

  userId?: number;
  username?: string;
}
