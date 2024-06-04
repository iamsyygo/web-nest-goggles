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
  async uploadFile(file: Express.Multer.File, user: User) {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);
      await this.saveUploadRecord(fileName, file.originalname, user);
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
    const results = await this.uploadRepo.delete({ fileName });
    return results.affected > 0;
  }

  async setPresignedByPut(originalname: string, user: User) {
    try {
      const fileName = `${Date.now()}-${originalname}`;

      // const url = await this.minioClient.presignedPutObject('goggles', name, 60 * 60 * 24);
      const url = await this.minioClient.presignedPutObject(this.bucketName, fileName);
      await this.saveUploadRecord(fileName, originalname, user);
      return url;
    } catch (e) {
      console.error(e);
      return '获取预签名URL失败';
    }
  }

  saveUploadRecord(fileName: string, originalFileName: string, user: User) {
    const upload = plainToClass(Upload, {
      username: user.username,
      userId: user.id,
      fileName,
      originalFileName,
    });
    return this.uploadRepo.save(upload);
  }
}
