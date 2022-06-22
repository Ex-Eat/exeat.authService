import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'alive' })
	getHello(): string {
		return this.appService.getHello();
	}
}
