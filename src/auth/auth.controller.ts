import {Body, Controller, Headers, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {RefreshTokensService} from "../refresh-tokens/refresh-tokens.service";
import {RefreshTokensEntity} from "../refresh-tokens/refresh-tokens.entity";
import * as dayjs from "dayjs";
import {UserEntity} from "../user/user.entity";
import {MessagePattern, RpcException} from '@nestjs/microservices';
import {RpcErrorsEnum} from "../_enums/rpc-errors.enum";

@Controller()
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

<<<<<<< HEAD
    @MessagePattern({ cmd: 'login' })
    async login(data: {email: string, password: string}): Promise<{accessToken: string, refreshToken: string}> {
        const user = await this._userService.findByEmail(data.email);
        if (!user) throw new RpcException(RpcErrorsEnum.WRONG_CREDENTIALS);
        const validatedUser = await this._service.validateUser(user, data.password);
        if (!validatedUser) throw new RpcException(RpcErrorsEnum.WRONG_CREDENTIALS);
        return {
            accessToken: await this._service.createToken(user),
            refreshToken: await this._refreshTokenService.create(user)
        };
    }

    @MessagePattern('refresh')
    async refreshToken(data: {refresh: string, authorization: string}): Promise<{accessToken: string, refreshToken: string}> {
        const accessToken: any = this._service.verifyToken(data.authorization, true);
        const refreshToken: RefreshTokensEntity = await this._refreshTokenService.get(data.refresh);

        if (!('id' in accessToken)) {
            throw new UnauthorizedException(RpcErrorsEnum.INVALID_TOKEN);
        }
        if (dayjs().isAfter(refreshToken.expiresAt) || dayjs().isBefore(refreshToken.createdAt)) {
            throw new RpcException(RpcErrorsEnum.TOKEN_EXPIRED);
        }
        const user: UserEntity = await this._userService.findOne(accessToken.id);
        return {
            accessToken: await this._service.createToken(user),
            refreshToken: await this._refreshTokenService.create(user)
        };
=======
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
>>>>>>> 6-add-unit-testing
    }
    const user: UserEntity = await this._userService.findOne(accessToken.id);
    return {
      accessToken: await this._service.createToken(user),
      refreshToken: await this._refreshTokenService.create(user),
    };
  }
}
