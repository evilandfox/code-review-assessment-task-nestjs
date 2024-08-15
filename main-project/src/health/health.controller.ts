import { Controller, Get } from '@nestjs/common';
import {
  RedisOptions,
  TcpClientOptions,
  Transport,
  NatsOptions,
} from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.microservice.pingCheck<TcpClientOptions>('main', {
          transport: Transport.TCP,
          options: { host: 'localhost', port: 3000 },
        }),
      async () =>
        this.microservice.pingCheck<TcpClientOptions>('calc', {
          transport: Transport.TCP,
          options: { host: 'localhost', port: 5000 },
        }),
      () =>
        this.microservice.pingCheck<NatsOptions>('nats', {
          transport: Transport.NATS,
          options: { servers: 'nats://localhost:4222' },
        }),
    ]);
  }
}
