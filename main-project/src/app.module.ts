import { PromModule } from '@digikare/nestjs-prom';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { CylinderModule } from './cylinder/cylinder.module';
import { MyExceptionFilter } from './exception/exception.filter';
import { HealthModule } from './health/health.module';
import { MyNatsMiddleware } from './middleware/nats.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PromModule.forRoot({
      defaultMetrics: {
        enabled: true,
      },
    }),
    HealthModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
      exclude: [
        { method: RequestMethod.ALL, path: 'health' },
        { method: RequestMethod.ALL, path: 'metrics' },
        { method: RequestMethod.ALL, path: 'loglevel' },
      ],
    }),
    CylinderModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MyNatsMiddleware).forRoutes('cylinder');
  }
}
