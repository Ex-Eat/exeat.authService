import { RolesTypeEnum } from '../_enums/roles-type.enum';

export interface ICreateUserDto {
	username: string;
	email: string;
	password: string;
	birthDate: Date;
	cguAccepted: boolean;
	confirmPassword: string;
}

export interface IUserDto {
	id: number;
	username: string;
	email: string;
	role: RolesTypeEnum;
	birthDate: Date;
	isClient: boolean;
	isDev: boolean;
	isRestaurant: boolean;
	isDeliverer: boolean;
	createdAt: Date;
}
