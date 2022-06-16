import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import FR from 'dayjs/locale/fr';

dayjs.locale(FR);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
