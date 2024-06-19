import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { LoginDTO } from './dto/login.dto';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from './dto/payload.dto';
import JwtRedis from './redis-jwt.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly jwtRedisService: JwtRedis,
  ) {}

  private async generateToken(payload: PayloadDTO): Promise<Object> {
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.jwtRedisService.setRedis(
        payload,
        process.env.SECRET_KEY,
        '1m',
        `token`,
      ),
      this.jwtRedisService.setRedis(
        payload,
        process.env.REFRESH_KEY,
        '5m',
        'refreshToken',
      ),
    ]);

    return {status: true, accessToken, refreshToken };
  }

  async refreshToken(refresh_token: string): Promise<Object> {
    try {
      const verifyAsync = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_KEY,
      });

      const payload: PayloadDTO = {
        id: verifyAsync.id,
        username: verifyAsync.username,
        roles: verifyAsync.roles,
        redisId: uuidv4()
      };

      return this.generateToken(payload);
    } catch (error) {
      throw new HttpException(
        'Refresh Token is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(info: LoginDTO): Promise<Object> {
    const { username, password } = info;
    const members = await this.memberService.getMember({ username });

    if (members.length === 0)
      return { status: false, message: 'Username not exists !' };

    if (
      !(await this.bcryptService.comparePassword(password, members[0].password))
    )
      return { status: false, message: 'Password is incorrect !' };

    const payload: PayloadDTO = {
      id: members[0].id,
      username: members[0].username,
      roles: members[0]?.roles?.map((role) => role.name),
      redisId: uuidv4(),
    };

    return this.generateToken(payload);
  }

  async logout(token: string) {
    try {
      const decode = await this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      const [result1, result2] = await this.jwtRedisService.destroy(decode.id)

      if (result1 == 1 && result2 == 1)
        return { status: true, message: 'Logout success !' };
    } catch (error) {
      throw new Error('Can not remove redis key');
    }
  }
}
