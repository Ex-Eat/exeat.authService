import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as dayjs from 'dayjs';
import FR from 'dayjs/locale/fr';
import { config } from './config';

dayjs.locale(FR);

const microServiceOptions = {
	transport: Transport.TCP,
	options: {
		host: config.APP_HOST,
		port: config.APP_PORT,
	},
};

async function bootstrap() {
	const app = await NestFactory.createMicroservice(
		AppModule,
		microServiceOptions,
	);
	await app.listen();
}

bootstrap();
