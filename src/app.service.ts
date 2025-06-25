import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getApiInfo() {
    return {
      name: 'LMS Backend API',
      version: '1.0.0',
      description: 'AI-Powered Learning Management System Backend',
      environment: this.configService.get('NODE_ENV'),
      timestamp: new Date().toISOString(),
    };
  }

  getStatus() {
    return {
      status: 'ok',
      uptime: process.uptime(), // Số giây app đã chạy từ lúc khởi động.
      timestamp: new Date().toISOString(), // Thời điểm hiện tại theo chuẩn ISO 8601.
      environment: this.configService.get('NODE_ENV'), // Giá trị của biến môi trường NODE_ENV
      nodeVersion: process.version, // Phiên bản Node.js hiện tại đang chạy app.
      memoryUsage: process.memoryUsage(), // Thông tin bộ nhớ đang sử dụng bởi tiến trình Node.js hiện tại.
    };
  }
}
