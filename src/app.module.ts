import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ormConfig} from "./orm-config";
import { UserModule } from './user/user.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot(ormConfig),
        UserModule,
        RefreshTokensModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
