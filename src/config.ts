export const config = {
    SECRET_KEY: process.env.EXEAT_SECRET_KEY || '1gq684gfqsd5f4gqsdfsqdf4qse4éq6se54fqsgr',
    TOKEN_EXPIRATION: process.env.EXEAT_TOKEN_EXPIRATION || 10800,
    BASE_URL: process.env.EXEAT_BASE_URL || 'http://localhost:8080',
    APP_ENV: process.env.APP_ENV || 'PREPROD',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: +process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_NAME: process.env.DB_NAME || 'exeat',
    APP_PORT: process.env.APP_PORT || '8200',
    APP_NAME: process.env.APP_NAME || 'authService',
    APP_HOST: process.env.APP_HOST || '127.0.0.1',
};