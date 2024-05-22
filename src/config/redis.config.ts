import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisUseFactory = async (configService: ConfigService): Promise<any> => {
  const redisConfig = configService.get('redis') as AppYamlConfig['redis'];
  const client = createClient({
    socket: { ...redisConfig },
    // password: redisConfig.password,
    // url: redisConfig.host,
  });
  try {
    await client.connect();
  } catch (error) {
    console.log(error);
  }
  return client;
};
