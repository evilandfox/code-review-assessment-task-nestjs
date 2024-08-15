import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseFloatPipe,
} from '@nestjs/common';
import { CylinderService } from './cylinder.service';

@Controller('cylinder')
export class CylinderController {
  constructor(private readonly cylinderService: CylinderService) {}

  @Get(':radius/:height')
  async calculateArea(
    @Param(
      'radius',
      new ParseFloatPipe({
        exceptionFactory: () => new HttpException('Радиус не число', 400),
      }),
    )
    radius: number,
    @Param(
      'height',
      new ParseFloatPipe({
        exceptionFactory: () => new HttpException('Длина не число', 400),
      }),
    )
    height: number,
  ) {
    return this.cylinderService.calculateArea(radius, height);
  }
}
