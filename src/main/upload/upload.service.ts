import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from './dto/query-upload.dto';
import { Upload } from './entities/upload.entity';
import { transformPageResult } from '@/utils';
import { APP_MINIO } from '../minio/minio.module';
import { Client } from 'minio';

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
      // withDeleted: true,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
  }

  // 上传文件至minio
  async uploadFile(file: Express.Multer.File) {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);
      return fileName;
    } catch (error) {
      console.error(error);
      throw new Error('上传失败');
    }
  }

  // 根据文件名获取 minio 文件的预签名URL
  async getFileUrl(fileName: string) {
    try {
      return await this.minioClient.presignedUrl('GET', this.bucketName, fileName);
    } catch (e) {
      console.error(e);
      return '获取预签名URL失败';
    }
  }

  // 根据文件名删除 minio 文件
  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async setPresignedByPut(fileName: string) {
    try {
      // const url = await this.minioClient.presignedPutObject('goggles', name, 60 * 60 * 24);
      return await this.minioClient.presignedPutObject('goggles', fileName);
    } catch (e) {
      console.error(e);
      return '获取预签名URL失败';
    }
  }

  saveUploadRecord(fileName: string, userId: number) {
    return this.uploadRepo.save({
      fileName,
      userId,
    });
  }
}
