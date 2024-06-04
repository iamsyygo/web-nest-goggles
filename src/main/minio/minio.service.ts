import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MinioService {
  @Inject('APP_MINIO')
  private readonly minioClient: any;
}
