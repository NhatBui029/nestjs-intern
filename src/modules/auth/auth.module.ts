import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MemberService } from '../member/member.service';
import { BcryptService } from './bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/entities/role.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

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
  providers: [AuthService, MemberService, BcryptService, RedisService],
  exports: [BcryptService],
})
export class AuthModule {}
