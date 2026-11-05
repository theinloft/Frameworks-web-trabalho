import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiExcludeController } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@SkipThrottle()
@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  check() {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('db')
  async db() {
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', db: 'up' };
  }
}