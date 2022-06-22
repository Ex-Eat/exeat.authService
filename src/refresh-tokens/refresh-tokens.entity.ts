import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {PrimaryGeneratedColumn} from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import {UserEntity} from "../user/user.entity";

@Entity({ name: 'refresh_token' })
export class RefreshTokensEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    token: string;

    @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'expires_at' })
    expiresAt: Date;

    @ManyToOne(() => UserEntity, user => user.refreshTokens)
    @JoinColumn({ name: 'user' })
    user: UserEntity

}