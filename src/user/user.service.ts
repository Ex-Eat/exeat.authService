import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ICreateUserDto } from './user.dto';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import * as bcrypt from 'bcrypt';
import { RpcErrorsEnum } from '../_enums/rpc-errors.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private _repository: Repository<UserEntity>) {}

	async find(): Promise<UserEntity[]> {
		return await this._repository.find();
	}

	async findOne(id: number): Promise<UserEntity> {
		return await this._repository.findOne({ where: { id } });
	}

	async findByEmail(email: string): Promise<UserEntity> {
		return await this._repository.findOne({ where: { email } });
	}

	async update(update: Partial<UserEntity>): Promise<UserEntity> {
		await this._repository.save(update);
		const id = update['id']
		return await this._repository.findOne({ where: { id } });
	}

	async create(user: ICreateUserDto): Promise<UserEntity> {
		if (!user.cguAccepted) throw new RpcException(RpcErrorsEnum.WRONG_DATA);

		const { confirmPassword, ...rest } = user;
		const createdUser = await this._repository.create(rest);
		createdUser.password = await this.hashPassword(createdUser.password);
		createdUser.role = RolesTypeEnum.USER;
		createdUser.createdAt = new Date();
		return await this._repository.save(createdUser);
	}

	hasPasswordNumber(password: string): boolean {
		return new RegExp(/.*[0-9]/).test(password);
	}

	hasPasswordSpecialChar(password: string): boolean {
		return new RegExp(/.*[!@#$%^&*]/).test(password);
	}

	hasPasswordUpper(password: string): boolean {
		return new RegExp(/.*[A-Z]/).test(password);
	}

	hasPasswordLower(password: string): boolean {
		return new RegExp(/.*[a-z]/).test(password);
	}

	isLongEnough(password: string): boolean {
		return new RegExp(/.{8,}/).test(password);
	}

	async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, 14);
	}

	isEmailValid(email: string): boolean {
		return new RegExp(/^[a-z0-9_.]+\@[a-z0-9_]+\.[a-z]{2,4}$/).test(email);
	}

	isPasswordValid(password: string): boolean {
		return (
			this.hasPasswordNumber(password) &&
			this.hasPasswordSpecialChar(password) &&
			this.hasPasswordUpper(password) &&
			this.hasPasswordLower(password) &&
			this.isLongEnough(password)
		);
	}
}
