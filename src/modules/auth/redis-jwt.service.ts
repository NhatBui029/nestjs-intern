import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class JwtRedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async setRedis(
    payload: Object,
    secretKey: string,
    time: string,
    keyRedis: string,
  ): Promise<string> {
    const token: string = await this.jwtService.signAsync(payload, {
      expiresIn: time,
      secret: secretKey,
    });

    const decode = await this.jwtService.verifyAsync(token, {
      secret: secretKey,
    });

    const key = `${decode.id}_${keyRedis}`;
    if (decode.exp) {
      const now = Date.now();
      const duration = Math.floor(decode.exp - now / 1000);
      if (duration > 0) {
        await this.redis.setex(key, duration, decode.redisId);
      }
    } else {
      await this.redis.set(key, 'true');
    }
    return token;
  }

  async getRedis(key: string) {
    const redisRecord = await this.redis.get(key);
    return redisRecord;
  }

  async destroy(key: string): Promise<number[] | null> {
    return await Promise.all([
      this.redis.del(`${key}_token`),
      this.redis.del(`${key}refreshToken`),
    ]);
  }
}
