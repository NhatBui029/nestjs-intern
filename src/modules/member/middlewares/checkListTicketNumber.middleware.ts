import { Injectable, NestMiddleware, ParseIntPipe } from '@nestjs/common';
import { MemberService } from '../member.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckListTicketNumber implements NestMiddleware {
  constructor(private readonly memberService: MemberService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { tickets } = req.body;

    let list = tickets.split(',').map(Number);
    req.body.tickets = list;
    return next();
  }
}
