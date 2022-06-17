import {RolesTypeEnum} from "../_enums/roles-type.enum";

export interface ICreateUserDto {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IUserDto {
    id: number;
    username: string;
    email: string;
    role: RolesTypeEnum[];
    createdAt: Date;
}