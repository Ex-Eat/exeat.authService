import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { config } from '../config';

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
            throw new UnauthorizedException('Invalid token');
        }
        const token = auth.split(' ')[1];
        try {
            return await jwt.verify(token, config.SECRET_KEY)
        } catch (e: any) {
            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired. Refresh needed');
            } else {
                throw new UnauthorizedException('Invalid token');
            }
        }
    }

}