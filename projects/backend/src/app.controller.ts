import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(): string {
    return this.appService.getHome();
  }
}
