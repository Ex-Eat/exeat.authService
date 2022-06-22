import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {ICreateUserDto} from "./user.dto";
import {RolesTypeEnum} from "../_enums/roles-type.enum";


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private _repository: Repository<UserEntity>) {}

    async find(): Promise<UserEntity[]> {
        return await this._repository.find();
    }

    async findOne(id: number): Promise<UserEntity> {
        return await this._repository.findOne({ where: { id }});
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this._repository.findOne({ where: { email }});
    }

    async create(user: ICreateUserDto): Promise<UserEntity> {
        const {confirmPassword, ...rest} = user;
        const createdUser = await this._repository.create(rest);
        createdUser.role = RolesTypeEnum.USER;
        createdUser.createdAt = new Date();
        return await this._repository.save(createdUser)
    }

    hasPasswordNumber(password: string): boolean {
        return (new RegExp(/.*[0-9]/)).test(password);
    }

    hasPasswordSpecialChar(password: string): boolean {
        return (new RegExp(/.*[!@#$%^&*]/)).test(password);
    }

    hasPasswordUpper(password: string): boolean {
        return (new RegExp(/.*[A-Z]/)).test(password);
    }

    hasPasswordLower(password: string): boolean {
        return (new RegExp(/.*[a-z]/)).test(password);
    }

    isLongEnough(password: string): boolean {
        return (new RegExp(/.{8,}/)).test(password);
    }

    isEmailValid(email: string): boolean {
        return (new RegExp(/^[a-z0-9_]+\.[a-z0-9_]+\@[a-z0-9_]+\.[a-z]{2,4}$/)).test(email);
    }

    isPasswordValid(password: string): boolean {
        return this.hasPasswordNumber(password)
            && this.hasPasswordSpecialChar(password)
            && this.hasPasswordUpper(password)
            && this.hasPasswordLower(password)
            && this.isLongEnough(password)
    }
}