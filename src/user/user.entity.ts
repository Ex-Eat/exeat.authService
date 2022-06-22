import {Column, Entity, JoinColumn, OneToMany} from 'typeorm';
import { RolesTypeEnum } from '../_enums/roles-type.enum';
import {PrimaryGeneratedColumn} from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import {RefreshTokensEntity} from "../refresh-tokens/refresh-tokens.entity";

@Entity({ name: 'user' })
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
    roles: RolesTypeEnum;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => RefreshTokensEntity, refreshToken => refreshToken.user)
    @JoinColumn({ name: 'refresh_token' })
    refreshTokens: RefreshTokensEntity[];

}