"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisUseFactory = void 0;
const redis_1 = require("redis");
const redisUseFactory = async (configService) => {
    const redisConfig = configService.get('db.redis');
    const client = (0, redis_1.createClient)({
        socket: { ...redisConfig },
    });
    await client.connect();
    return client;
};
exports.redisUseFactory = redisUseFactory;
//# sourceMappingURL=redis.config.js.map