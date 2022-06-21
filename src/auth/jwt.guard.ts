import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { config } from '../config';
import {RpcException} from "@nestjs/microservices";
import {RpcErrorsEnum} from "../_enums/rpc-errors.enum";

@Injectable()
export class JwtGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            return false;
        }
        request.user = await JwtGuard.validateToken(request.headers.authorization);
        return true;
    }

    static async validateToken(auth: string) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new RpcException(RpcErrorsEnum.INVALID_TOKEN);
        }
        const token = auth.split(' ')[1];
        try {
            return await jwt.verify(token, config.SECRET_KEY)
        } catch (e: any) {
            if (e.name === 'TokenExpiredError') {
                throw new RpcException(RpcErrorsEnum.TOKEN_EXPIRED_REFRESH_NEEDED);
            } else {
                throw new RpcException(RpcErrorsEnum.INVALID_TOKEN);
            }
        }
    }

}