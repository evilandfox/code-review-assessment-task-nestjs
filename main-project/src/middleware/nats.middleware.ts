import {
  CounterMetric,
  PromService,
  SummaryMetric,
} from '@digikare/nestjs-prom';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MyNatsMiddleware implements NestMiddleware {
  private readonly messagesCounter: CounterMetric;
  private readonly processingTimeSummary: SummaryMetric;
  private readonly statusCounter: CounterMetric;

  constructor(private readonly promService: PromService) {
    this.messagesCounter = this.promService.getCounter({
      name: 'nats_messages_counter',
      help: 'Total number of NATS messages',
      labelNames: []
    });

    this.processingTimeSummary = this.promService.getSummary({
      name: 'nats_messages_processing_time',
      help: 'Processing time of NATS messages',
      labelNames: []
    });

    this.statusCounter = this.promService.getCounter({
      name: 'nats_messages_status_counter',
      help: 'Status codes of NATS message responses',
      labelNames: ['status'],
    });
  }

  use(req: any, res: any, next: () => void) {
    const start = process.hrtime();

    this.messagesCounter.inc();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const processingTime = duration[0] * 1000 + duration[1] / 1e6;
      this.processingTimeSummary.observe(processingTime);
      this.statusCounter.inc({
        status: res.statusCode.toString(),
      });
    });

    next();
  }
}
