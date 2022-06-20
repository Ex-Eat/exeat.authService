import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {JwtPayload, JwtToken} from "./auth.interface";
import {config} from "../config";
import * as bcrypt from "bcrypt";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class AuthService {

    constructor(private _jwtService: JwtService) {
    }

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

        return this._jwtService.sign(payload, {expiresIn});
    }

    async validateUser(user: UserEntity, password: string): Promise<UserEntity | null> {
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    verifyToken(auth: string, ignoreExpiration: boolean = false): string | JwtPayload | object  {
        let action: string | JwtPayload | object = 'reject';
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new UnauthorizedException('Invalid token');
        }
        const token = auth.split(' ')[1];
        try {
            action = this._jwtService.verify(token, { ignoreExpiration });
        } catch (e: any) {
            if (e.name === 'TokenExpiredError') {
                action = 'renew'
            } else {
                action = 'reject'
            }
        }
        return action;
    }

}
