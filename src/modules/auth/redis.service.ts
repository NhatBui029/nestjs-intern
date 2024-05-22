import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setRedis(key: string, value: any): Promise<void> {
    await this.redis.set(key, value);
  }

  async setExRedis(key: string, value: any, timeExpire: number): Promise<void> {
    await this.redis.setex(key, timeExpire, value);
  }

  async getRedis(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async deleteRedis(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
