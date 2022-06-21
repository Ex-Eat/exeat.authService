import {Controller, UnauthorizedException} from '@nestjs/common';
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

    constructor(private _service: AuthService,
                private _userService: UserService,
                private _refreshTokenService: RefreshTokensService) {}

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
    }

}
