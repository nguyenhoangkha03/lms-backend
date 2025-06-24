import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health') // Gom các endpoint thuộc "Health" vào một nhóm trong Swagger UI
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' }) // Mô tả ngắn cho endpoint (hiển thị trong danh sách Swagger)
  @ApiResponse({ status: 200, description: 'Health status' }) // Mô tả kết quả trả về của API
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('database')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database health status' })
  async getDatabaseHealth() {
    return this.healthService.getDatabaseHealth();
  }

  @Get('redis')
  @ApiOperation({ summary: 'Redis health check' })
  @ApiResponse({ status: 200, description: 'Redis health status' })
  async getRedisHealth() {
    return this.healthService.getRedisHealth();
  }
}
