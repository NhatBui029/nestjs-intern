import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MemberService } from 'src/modules/member/member.service';
import JwtRedisService from '../redis-jwt.service';

@Injectable()
export class RemoveTokenBeforeLoginAgain implements NestMiddleware {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtRedisService: JwtRedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const members = await this.memberService.getMember({ username });
      const id = members[0]?.id;
      const [result1, result2] = await this.jwtRedisService.destroy(
        id?.toString(),
      );
      return next();
    } catch (error) {
        throw new Error(error)
    }
  }
}
