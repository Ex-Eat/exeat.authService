
import {Body, Controller, Headers, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {RefreshTokensService} from "../refresh-tokens/refresh-tokens.service";
import {RefreshTokensEntity} from "../refresh-tokens/refresh-tokens.entity";
import dayjs = require("dayjs");
import {UserEntity} from "../user/user.entity";

@Controller('auth')
export class AuthController {
  constructor(
    private _service: AuthService,
    private _userService: UserService,
    private _refreshTokenService: RefreshTokensService,
  ) {}

  @Post()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this._userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('This email was not found');
    const validatedUser = await this._service.validateUser(user, password);
    if (!validatedUser) throw new UnauthorizedException('Wrong Credentials');
    return {
      accessToken: await this._service.createToken(user),
      refreshToken: await this._refreshTokenService.create(user),
    };
  }

  @Post('/refresh')
  async refreshToken(
    @Body('refresh_token') refresh: string,
    @Headers('authorization') authorization,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken: any = this._service.verifyToken(authorization, true);
    const refreshToken: RefreshTokensEntity =
      await this._refreshTokenService.get(refresh);

    if (!('id' in accessToken)) {
      throw new UnauthorizedException('Wrong access token');
    }
    if (
      dayjs().isAfter(refreshToken.expiresAt) ||
      dayjs().isBefore(refreshToken.createdAt)
    ) {
      throw new UnauthorizedException('Token expired');
    }
    const user: UserEntity = await this._userService.findOne(accessToken.id);
    return {
      accessToken: await this._service.createToken(user),
      refreshToken: await this._refreshTokenService.create(user),
    };
  }
}
