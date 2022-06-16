import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {config} from "./config";

export const ormConfig: TypeOrmModuleOptions = {
    name: 'default',
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: [process.env.DATABASE_MIGRATION_PATH || './dist/src/database/migration/*.js'],
    migrationsRun: false,
    logging: ['error']
};