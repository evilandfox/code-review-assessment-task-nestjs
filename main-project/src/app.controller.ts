import { Controller, Get, Post } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('loglevel')
  toggleLogLevel() {
    const level = (PinoLogger.root.level =
      PinoLogger.root.level === 'debug' ? 'info' : 'debug');
    this.logger.info('Log level toggled into %s', level);
    return level;
  }
}
