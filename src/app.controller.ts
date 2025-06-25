import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Root endpoint' })
  @ApiResponse({ status: 200, description: 'API information' })
  getApiInfo() {
    return this.appService.getApiInfo();
  }

  @Get('status')
  @ApiOperation({ summary: 'API Status' })
  @ApiResponse({ status: 200, description: 'API status' })
  getStatus() {
    return this.appService.getStatus();
  }
}
