import {Column, Entity, JoinColumn, OneToMany, Unique} from 'typeorm';
import {PrimaryGeneratedColumn} from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import {RefreshTokensEntity} from "../refresh-tokens/refresh-tokens.entity";
import {RolesTypeEnum} from "../_enums/roles-type.enum";

@Entity({ name: 'user' })
@Unique(["email", "username"])
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    password: string;

    @Column({ unique: true })
    username: string;

    @Column()
    role: RolesTypeEnum;

    @Column({ default: false })
    isClient: boolean;

    @Column({ default: false })
    isDev: boolean;

    @Column({ default: false })
    isRestaurant: boolean;

    @Column({ default: false })
    isDeliverer: boolean;

    @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => RefreshTokensEntity, refreshToken => refreshToken.user)
    @JoinColumn({ name: 'refresh_token' })
    refreshTokens: RefreshTokensEntity[];

}