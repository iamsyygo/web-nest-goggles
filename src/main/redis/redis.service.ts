import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  // private readonly redisClient: RedisClientType;

  // fix vercel deploy log by redis_1 is not defined(RedisClientType)
  private readonly redisClient: any;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
