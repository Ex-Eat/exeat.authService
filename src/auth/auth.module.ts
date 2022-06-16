import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {config} from "../config";
import {UserModule} from "../user/user.module";
import {RefreshTokensModule} from "../refresh-tokens/refresh-tokens.module";

@Module({
    imports: [
        JwtModule.register({
            secret: config.SECRET_KEY,
            signOptions: {
                expiresIn: config.TOKEN_EXPIRATION,
            }
        }),
        UserModule,
        RefreshTokensModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {
}
