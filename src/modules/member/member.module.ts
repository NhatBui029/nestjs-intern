import { config } from 'dotenv';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from 'src/entities/member.entity';
import { CheckUsernameExists } from './middlewares/checkUsernameExists.middleware';
import { CheckPasswordChange } from './middlewares/checkPasswordChange.middleware';
import { HideTicketContent } from '../project/middlewares/hiddenTicketContent.middleware';
import { CheckListTicketNumber } from './middlewares/checkListTicketNumber.middleware';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketService } from '../ticket/ticket.service';
import { BcryptService } from '../auth/bcrypt.service';
import { CheckAuthenticationMiddleware } from '../../middlewares/checkAuthentication.middleware';
import { Role } from 'src/entities/role.entity';
import JwtRedisService from '../auth/redis-jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Ticket, Role])],
  controllers: [MemberController],
  providers: [MemberService, TicketService, BcryptService, JwtRedisService, JwtService],
  exports: [MemberService],
})
export class MemberModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckUsernameExists, CheckPasswordChange)
      .forRoutes(
        { path: '/member/add', method: RequestMethod.POST },
        { path: '/member/edit', method: RequestMethod.PUT }
      )
    consumer.apply(CheckListTicketNumber).forRoutes('/member/set-ticket')
    consumer.apply(CheckAuthenticationMiddleware).forRoutes(MemberController)
  }
}
