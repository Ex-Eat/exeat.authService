import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserEntity} from "./user.entity";
import {AuthModule} from "../auth/auth.module";
import {RefreshTokensModule} from "../refresh-tokens/refresh-tokens.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule),
        RefreshTokensModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
}
