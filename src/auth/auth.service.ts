import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';
import { config } from '../config';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { RpcException } from '@nestjs/microservices';
import { RpcErrorsEnum } from '../_enums/rpc-errors.enum';
import {IUserDto} from "../user/user.dto";

@Injectable()
export class AuthService {
	constructor(private _jwtService: JwtService) {}

	createToken(user: UserEntity): string {
		const expiresIn: number = +config.TOKEN_EXPIRATION;

		const payload: JwtPayload = {
			sub: user.id,
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role,
			createdAt: user.createdAt,
			isClient: user.isClient,
			isDeliverer: user.isDeliverer,
			isRestaurant: user.isRestaurant,
			isDev: user.isDev,
		};

		return this._jwtService.sign(payload, { expiresIn });
	}

	async validateUser(user: UserEntity, password: string): Promise<UserEntity | null> {
		if (await bcrypt.compare(password, user.password)) {
			return user;
		}
		return null;
	}

	verifyToken(token: string, ignoreExpiration = false): string | JwtPayload | object {
		try {
			return this._jwtService.verify(token, { ignoreExpiration });
		} catch (e: any) {
			if (e.name === 'TokenExpiredError') {
				throw new RpcException(RpcErrorsEnum.TOKEN_EXPIRED_REFRESH_NEEDED);
			} else {
				throw new RpcException(RpcErrorsEnum.INVALID_TOKEN);
			}
		}
	}

	sanitize(user: UserEntity): IUserDto {
		const {password, ...rest} = user;
		return rest;
	}
}
