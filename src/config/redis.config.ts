import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisUseFactory = async (configService: ConfigService): Promise<any> => {
  const redisConfig = configService.get('db.redis') as AppYamlConfig['db']['redis'];
  const client = createClient({
    socket: { ...redisConfig },
    // password: redisConfig.password,
    // url: redisConfig.host,
  });
  await client.connect();
  return client;
};
