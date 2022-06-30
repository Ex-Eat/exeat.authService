import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { RefreshTokensEntity } from '../refresh-tokens/refresh-tokens.entity';
import * as dayjs from 'dayjs';
import { UserEntity } from '../user/user.entity';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { RpcErrorsEnum } from '../_enums/rpc-errors.enum';
import { JwtPayload } from './auth.interface';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import { ITokenDto } from './ITokenDto';

@Controller()
export class AuthController {
  constructor(
    private _service: AuthService,
    private _userService: UserService,
    private _refreshTokenService: RefreshTokensService,
  ) {}

  @MessagePattern({ cmd: 'auth/login' })
  async login(data: { email: string; password: string }): Promise<ITokenDto> {
    const user = await this._userService.findByEmail(data.email);
    if (!user) throw new RpcException(RpcErrorsEnum.WRONG_CREDENTIALS);
    const validatedUser = await this._service.validateUser(user, data.password);
    if (!validatedUser) throw new RpcException(RpcErrorsEnum.WRONG_CREDENTIALS);
    return {
      user: this._service.sanitize(user),
      accessToken: this._service.createToken(user),
      refreshToken: await this._refreshTokenService.create(user),
    };
  }

  @MessagePattern({ cmd: 'auth/refresh' })
  verify(data: {
    accessToken: string;
    roles: RolesTypeEnum[];
  }): string | JwtPayload | object {
    return this._service.verifyToken(data.accessToken, true);
  }

  @MessagePattern({ cmd: 'auth/logout' })
  logout(refreshToken: string): string | JwtPayload | object {
    return this._refreshTokenService.logout(refreshToken);
  }

  @MessagePattern({ cmd: 'auth/refreshToken' })
  async refreshToken(data: {
    refreshToken: string;
    accessToken: string;
  }): Promise<{ user: Partial<UserEntity>, accessToken: string; refreshToken: string }> {
    const accessToken: any = this._service.verifyToken(data.accessToken, true);
    const refreshToken: RefreshTokensEntity =
      await this._refreshTokenService.get(data.refreshToken);


    if (!('id' in accessToken)) {
      throw new UnauthorizedException(RpcErrorsEnum.INVALID_TOKEN);
    }
    if (
      dayjs().isAfter(refreshToken.expiresAt) ||
      dayjs().isBefore(refreshToken.createdAt)
    ) {
      throw new RpcException(RpcErrorsEnum.TOKEN_EXPIRED);
    }
    const user: UserEntity = await this._userService.findOne(accessToken.id);
    const { password, ...restUser } = user;
    return {
      user: restUser,
      accessToken: this._service.createToken(user),
      refreshToken: await this._refreshTokenService.create(user),
    };
  }

  @MessagePattern({ cmd: 'auth/isLoggedIn' })
  isLoggedIn(data: { accessToken: string }): boolean {
    if (!data.accessToken) return false;
    const token = this._service.verifyToken(data.accessToken);
    return typeof token !== 'string';
  }

  @MessagePattern({ cmd: 'auth/getLoggedUser' })
  getLoggedUser(data: { accessToken: string }): string | object | JwtPayload {
    return this._service.verifyToken(data.accessToken);
  }
}
