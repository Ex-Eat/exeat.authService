import {BadRequestException, Body, Controller, ForbiddenException, Get, Headers, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {ICreateUserDto} from "./user.dto";
import {RolesTypeEnum} from "../_enums/roles-type.enum";
import {AuthService} from "../auth/auth.service";
import {RefreshTokensService} from "../refresh-tokens/refresh-tokens.service";

@Controller('user')
export class UserController {

    constructor(private _service: UserService,
                private _authService: AuthService,
                private _refreshTokenService: RefreshTokensService) {}

    @Get()
    async get(): Promise<UserEntity[]> {
        return await this._service.find();
    }

    @Post()
    async create(@Body() user: ICreateUserDto,
                 @Headers('authorization') authorization: string): Promise<{accessToken: string, refreshToken: string}> {
        if (authorization) {
            throw new ForbiddenException("Error, looks like you are already connected");
        }
        if (!this._service.isEmailValid(user.email)) {
            throw new BadRequestException("Invalid email.")
        }
        if (user.password !== user.confirmPassword) {
            throw new BadRequestException("Please provide a confirmation password matching the password.")
        }
        if (!this._service.isPasswordValid(user.password)) {
            throw new BadRequestException("Invalid password.")
        }
        const createdUser: UserEntity = await this._service.create(user);
        return {
            accessToken: await this._authService.createToken(createdUser),
            refreshToken: await this._refreshTokenService.create(createdUser)
        };
    }

}
