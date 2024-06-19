import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PayloadDTO } from 'src/modules/auth/dto/payload.dto';
import JwtRedisService from 'src/modules/auth/redis-jwt.service';

@Injectable()
export class CheckAuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtRedisService: JwtRedisService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const decode: PayloadDTO = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });

      const value = await this.jwtRedisService.getRedis(`${decode.id}_token`);

      if (value === decode.redisId) {
        req['user'] = decode;
        return next();
      } else throw new UnauthorizedException('Destroyed token');
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
