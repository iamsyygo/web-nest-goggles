import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from './dto/query-upload.dto';
import { Upload } from './entities/upload.entity';
import { transformPageResult } from '@/utils';

@Injectable()
export class UploadService {
  @InjectRepository(Upload)
  private readonly UploadRepo: Repository<Upload>;

  constructor(private readonly configService: ConfigService) {}

  async findList({ page = 1, pageSize = 10 }: PageQueryDto) {
    const results = await this.UploadRepo.findAndCount({
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
}
