export declare class RedisService {
    private readonly redisClient;
    get(key: string): Promise<any>;
    set(key: string, value: string | number, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
}
