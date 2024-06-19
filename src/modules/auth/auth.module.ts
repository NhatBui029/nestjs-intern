import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MemberService } from '../member/member.service';
import { BcryptService } from './bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/entities/role.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import JwtRedisService from './redis-jwt.service';
import { RemoveTokenBeforeLoginAgain } from './middleswares/removeTokenBeforeLogin.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Role]),
    JwtModule.register({
      global: true,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: 'redis://redis:6379',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MemberService, BcryptService, JwtRedisService],
  exports: [BcryptService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RemoveTokenBeforeLoginAgain)
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });
  }
}
