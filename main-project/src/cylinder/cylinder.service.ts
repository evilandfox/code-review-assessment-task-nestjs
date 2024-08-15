import { Injectable } from '@nestjs/common';
import { connect, type NatsConnection, StringCodec } from 'nats';

@Injectable()
export class CylinderService {
  private client: NatsConnection;
  private sc = StringCodec();

  async calculateArea(radius: number, height: number): Promise<number> {
    await this.connectToNats();

    const response = await this.sendCalculationRequest({ radius, height });
    const parsedResponse = this.parseResponse(response);

    return parsedResponse;
  }

  private async connectToNats(): Promise<void> {
    if (!this.client) {
      this.client = await connect({ servers: 'nats://localhost:4222' });
    }
  }

  private async sendCalculationRequest(data: any): Promise<string> {
    const requestData = this.sc.encode(JSON.stringify(data));

    const msg = await this.client.request('calculateArea', requestData);

    return this.sc.decode(msg.data);
  }

  private parseResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Invalid response data');
    }
  }
}
