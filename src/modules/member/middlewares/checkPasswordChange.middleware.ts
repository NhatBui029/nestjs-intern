import { Injectable, NestMiddleware } from '@nestjs/common';
import { MemberService } from '../member.service';
import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { BcryptService } from 'src/modules/auth/bcrypt.service';

@Injectable()
export class CheckPasswordChange implements NestMiddleware {
  constructor(
    private readonly memberService: MemberService,
    private readonly bcryptService: BcryptService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id, password } = req.body;

    if (id && password) {
      const oldUser = await this.memberService.getMember({ id: id });
      if (
        await this.bcryptService.comparePassword(password, oldUser[0].password)
      ) {
        return res
          .status(400)
          .json({ status: false, message: 'Password does not change !' });
      } else return next();
    }

    return next();
  }
}
