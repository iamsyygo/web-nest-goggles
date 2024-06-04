import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
export const APP_MINIO = 'APP_MINIO';
export const minioUseFactory = async (configService: ConfigService): Promise<any> => {
  const minioConfig = configService.get('minio') as AppYamlConfig['minio'];
  const client = new Client({
    ...minioConfig,
  });
  return client;
};
