import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from 'src/entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { CheckNameProjectExists } from './middlewares/checkNameProjectExists.middleware';
import { CheckProjectTypeEnum } from './middlewares/checkProjectTypeEnum.middleware';
import { HideTicketContent } from './middlewares/hiddenTicketContent.middleware';
import { Ticket } from 'src/entities/ticket.entity';
import { Member } from 'src/entities/member.entity';
import { MemberService } from '../member/member.service';
import { CheckLoginMiddleware } from '../../middlewares/checkLogin.middleware';
import { Role } from 'src/entities/role.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Project, Member, Role])],
  controllers: [ProjectController],
  providers: [ProjectService, MemberService],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckNameProjectExists, CheckProjectTypeEnum)
      .forRoutes(
        { path: '/project/add', method: RequestMethod.POST },
        { path: '/project/edit', method: RequestMethod.PUT },
      )
    consumer.apply(CheckLoginMiddleware).forRoutes(ProjectController)
  }
}
