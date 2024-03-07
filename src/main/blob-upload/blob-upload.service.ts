import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from './dto/query-blob-upload.dto';
import { BlobUpload } from './entities/blob-upload.entity';

@Injectable()
export class BlobUploadService {
  @InjectRepository(BlobUpload)
  private readonly BlobUploadRepo: Repository<BlobUpload>;

  constructor(private readonly configService: ConfigService) {}

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
}
