import {Module} from '@nestjs/common';
import {RefreshTokensController} from './refresh-tokens.controller';
import {RefreshTokensService} from './refresh-tokens.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RefreshTokensEntity} from "./refresh-tokens.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RefreshTokensEntity]),
    ],
    controllers: [RefreshTokensController],
    providers: [RefreshTokensService],
    exports: [RefreshTokensService]
})
export class RefreshTokensModule {
}
