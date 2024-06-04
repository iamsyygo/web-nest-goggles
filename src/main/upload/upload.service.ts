import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from './dto/query-upload.dto';
import { Upload } from './entities/upload.entity';
import { transformPageResult } from '@/utils';
import { APP_MINIO } from '../minio/minio.module';
import { Client } from 'minio';
import { plainToClass } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { CreateUploadInfoDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
  @InjectRepository(Upload)
  private readonly uploadRepo: Repository<Upload>;

  @Inject(APP_MINIO)
  private minioClient: Client;

  bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = configService.get('minio-bucket');
  }

  async findList({ page = 1, pageSize = 10 }: PageQueryDto) {
    const results = await this.uploadRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
  }

  async deleteFile(objectName: string) {
    await this.minioClient.removeObject(this.bucketName, objectName);
    const results = await this.uploadRepo.delete({ objectName });
    return results.affected > 0;
  }

  async uploadFile(file: Express.Multer.File, user: User) {
    const bucketName = this.bucketName;
    const objectName = `${Date.now()}-${file.originalname}`;
    const { etag } = await this.minioClient.putObject(bucketName, objectName, file.buffer, file.size, {
      // 决定是预览还是下载
      'Content-Type': file.mimetype,
    });
    const url = await this.getFileUrl(objectName);
    const entity: CreateUploadInfoDto = {
      etag,
      objectName,
      originalname: file.originalname,
      url,
      userId: user.id,
      username: user.username,
      size: file.size,
      mimetype: file.mimetype,
    };
    await this.save(entity);
    return entity;
  }

  async getFileUrl(objectName: string) {
    return this.minioClient.presignedGetObject(this.bucketName, objectName);
  }

  async generatePresignedUrl(filename: string) {
    const bucketName = this.bucketName;
    const objectName = `${Date.now()}-${filename}`;
    return this.minioClient.presignedPutObject(bucketName, objectName);
  }

  async save(fileInfo: CreateUploadInfoDto) {
    const entity = plainToClass(Upload, fileInfo);
    await this.uploadRepo.save(entity);
    return entity;
  }
}
