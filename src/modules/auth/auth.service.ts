import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { LoginDTO } from './dto/login.dto';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(payload: PayloadDTO): Promise<Object> {
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1m',
        secret: process.env.SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '5m',
        secret: process.env.REFRESH_KEY,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refresh_token: string): Promise<Object> {
    try {
      const verifyAsync = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_KEY,
      });

      const payload: PayloadDTO = {
        id: verifyAsync.id,
        username: verifyAsync.username,
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

    const payload = {
      id: members[0].id,
      username: members[0].username,
      roles: members[0]?.roles?.map((role) => role.name),
    };

    return this.generateToken(payload);
  }
}
