import { IUserDto } from '../user/user.dto';

export interface ITokenDto {
	user: IUserDto;
	accessToken: string;
	refreshToken: string;
}
