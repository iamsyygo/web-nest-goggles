import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlobUploadDto } from './dto/create-blob-upload.dto';
import { UpdateBlobUploadDto } from './dto/update-blob-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlobUpload } from './entities/blob-upload.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { compare, hashSync } from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageQueryDto } from './dto/query-blob-upload.dto';
import { put, del } from '@vercel/blob';

@Injectable()
export class BlobUploadService {
  @InjectRepository(BlobUpload)
  private readonly BlobUploadRepo: Repository<BlobUpload>;

  constructor(private readonly configService: ConfigService) {}

  async upload(file: Express.Multer.File) {
    const token = this.configService.get('vercel.blob_read_write_token', '');
    if (!token) throw new Error('未配置 vercel token');
    const fileName = file.originalname;
    const size = file.size;
    const fileBuffer = file.buffer;
    const putRes = await put(fileName, fileBuffer, { access: 'public', token: token });
    const et: Partial<BlobUpload> = {
      ...putRes,
      size,
      fileName,
    };
    const BlobUpload = await this.BlobUploadRepo.insert(et);
    if (BlobUpload.identifiers.length === 0) throw new BadRequestException('上传失败');
    return true;
  }

  async findList({ page = 1, pageSize = 10 }: PageQueryDto) {
    const [list, total] = await this.BlobUploadRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      // withDeleted: true,
    });
    return {
      list,
      total,
      meta: {
        page: +page,
        pageSize: +pageSize,
        totalSize: Math.ceil(total / pageSize),
      },
    };
  }
  // findAll() {
  //   return `This action returns all BlobUpload`;
  // }
  async findOne(id: number) {
    return await this.BlobUploadRepo.findOne({
      where: { id },
      // withDeleted: true,
    });
  }
  // async update(id: number, updateBlobUploadDto: UpdateBlobUploadDto) {
  //   const result = await this.BlobUploadRepo.update(id, updateBlobUploadDto);
  //   if (result.affected === 0) throw new BadRequestException('更新失败');
  //   return true;
  // }

  async remove(id: number) {
    const BlobUpload = await this.BlobUploadRepo.findOne({ where: { id } });
    if (!BlobUpload) throw new BadRequestException('资源不存在');
    const token = this.configService.get('vercel.blob_read_write_token', '');
    if (!token) throw new Error('未配置 vercel token');
    await del(BlobUpload.url, { token });
    const result = await this.BlobUploadRepo.softRemove({ ...BlobUpload });
    return !!result;
  }
}
