import { BadRequestException, Body, Controller, ForbiddenException, Get, Headers, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { ICreateUserDto } from './user.dto';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import { AuthService } from '../auth/auth.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcErrorsEnum } from '../_enums/rpc-errors.enum';
import { ITokenDto } from '../auth/ITokenDto';

@Controller('user')
export class UserController {
	constructor(
		private _service: UserService,
		private _authService: AuthService,
		private _refreshTokenService: RefreshTokensService,
	) {}

	@MessagePattern({ cmd: 'user/get' })
	async get(): Promise<UserEntity[]> {
		return await this._service.find();
	}

	@MessagePattern({ cmd: 'user/create' })
	async create(data: { user: ICreateUserDto; authorization: string }): Promise<ITokenDto> {
		const { user, authorization } = data;
		if (authorization) {
			throw new ForbiddenException(RpcErrorsEnum.ALREADY_LOGGED_IN);
		}
		if (!this._service.isEmailValid(user.email)) {
			throw new BadRequestException(RpcErrorsEnum.INVALID_EMAIL);
		}
		if (user.password !== user.confirmPassword) {
			throw new BadRequestException(RpcErrorsEnum.NO_MATCHING_PASSWORD);
		}
		if (!this._service.isPasswordValid(user.password)) {
			throw new BadRequestException(RpcErrorsEnum.INVALID_PASSWORD);
		}
		const createdUser: UserEntity = await this._service.create(user);
		return {
			user: this._authService.sanitize(createdUser),
			accessToken: this._authService.createToken(createdUser),
			refreshToken: await this._refreshTokenService.create(createdUser),
		};
	}
}
