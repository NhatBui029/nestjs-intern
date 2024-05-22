import { Injectable, NestMiddleware } from '@nestjs/common';
import { MemberService } from '../member.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckUsernameExists implements NestMiddleware {
  constructor(private readonly memberService: MemberService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id, username } = req.body;

    if (username) {
      const memberExists = await this.memberService.getMember({
        username: username,
      });

      if (id && memberExists[0]?.id == id) return next();

      if (memberExists.length > 0)
        return res
          .status(400)
          .json({ status: false, message: 'Username already exists !' });
    }

    return next();
  }
}
