import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Ticket } from 'src/entities/ticket.entity';

@Injectable()
export class HideTicketContent implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (res.locals.tickets) {
      res.locals.tickets.map((ticket: Ticket) => {
        const {content, ...info} = ticket;
        return info;
      });
    }
    return next();
  }
}
