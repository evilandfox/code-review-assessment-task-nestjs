import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PromModule } from '@digikare/nestjs-prom';
import { CylinderModule } from './cylinder/cylinder.module';
import { MyNatsMiddleware } from './middleware/nats.middleware';
import { MyExceptionFilter } from './exception/exception.filter';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PromModule.forRoot({
      defaultMetrics: {
        enabled: true,
      },
    }),
    HealthModule,
    CylinderModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MyNatsMiddleware).forRoutes('cylinder');
  }
}
