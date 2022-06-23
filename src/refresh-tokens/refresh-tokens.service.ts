import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokensEntity } from './refresh-tokens.entity';
import { UserEntity } from '../user/user.entity';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokensService {
	constructor(@InjectRepository(RefreshTokensEntity) private _repository: Repository<RefreshTokensEntity>) {}

	async get(token: string): Promise<RefreshTokensEntity> {
		return this._repository.findOne({
			where: {
				token,
			},
		});
	}

	async create(user: UserEntity): Promise<string> {
		const refreshToken = await this._repository.create({
			token: crypto.randomBytes(128).toString('base64'),
			expiresAt: dayjs().add(7, 'days').toDate(),
		});
		refreshToken.user = user;
		return (await this._repository.save(refreshToken)).token;
	}

	async logout(refreshToken: string): Promise<UpdateResult> {
		return this._repository
			.createQueryBuilder()
			.update(RefreshTokensEntity)
			.set({
				expiresAt: new Date(),
			})
			.where('token = :token', { token: refreshToken })
			.execute();
	}
}
