import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async increment(key: string) {
    await this.redisClient.incr(key);
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }

  async scan(pattern: string) {
    const stream = this.redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    });

    const keys: string[] = [];
    for await (const key of stream) {
      keys.push(key);
    }

    return keys;
  }
}
