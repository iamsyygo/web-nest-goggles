import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';
import { Client } from 'minio';
import { MinioService } from './minio.service';

export const APP_MINIO = 'APP_MINIO';

@Global()
@Module({
  controllers: [MinioController],
  // providers: [
  //   MinioService,
  //   {
  //     inject: [ConfigService],
  //     provide: APP_MINIO,
  //     async useFactory(configService) {
  //       const config = configService.get('minio') as AppYamlConfig['minio'];
  //       const client = new Client(config);
  //       return client;
  //     },
  //   },
  // ],
  providers: [
    MinioService,
    {
      inject: [ConfigService],
      provide: APP_MINIO,
      async useFactory(configService) {
        const config = configService.get('minio') as AppYamlConfig['minio'];
        const client = new Client(config);
        return client;
      },
    },
  ],
  exports: [APP_MINIO],
})
export class MinioModule {}
