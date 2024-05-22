import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService) {
        const socket = configService.get('redis') as AppYamlConfig['redis'];
        const client = createClient({ socket, username: socket.username, password: socket.password });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
