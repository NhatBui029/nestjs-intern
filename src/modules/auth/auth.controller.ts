import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import JwtRedisService from './redis-jwt.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtRedisService: JwtRedisService
  ) {}

  @Post('/login')
  async login(@Body() info: LoginDTO): Promise<Object> {
    console.log('login')
    return this.authService.login(info);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() token: { refresh_token: string },
  ): Promise<Object> { 
    return this.authService.refreshToken(token.refresh_token);
  }

  @Post('/logout')
  async logout(
    @Body() token: { token: string },
  ): Promise<Object> {
    return this.authService.logout(token.token);
  }

  @Get('/redis')
  async getValueRedis(): Promise<string> {
    // await this.redisService.setRedis('name', 'nhatbui');

    return await this.jwtRedisService.getRedis('3_token');
  }
}
