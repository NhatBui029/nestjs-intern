import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  TicketController } from './ticket.controller';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketService } from './ticket.service';
import { CheckDateValid } from './middlewares/checkDateValid.middleware';
import { Project } from 'src/entities/project.entity';
import { ProjectService } from '../project/project.service';
import { CheckLoginMiddleware } from '../../middlewares/checkLogin.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckDateValid)
      .forRoutes(
        { path: '/ticket/add', method: RequestMethod.POST },
        { path: '/ticket/edit', method: RequestMethod.PUT },
      );
    consumer.apply(CheckLoginMiddleware).forRoutes(TicketController)
  }
}
