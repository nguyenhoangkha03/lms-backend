import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // lấy instance của ConfigService từ NestJS container để có thể dùng trong main.ts.
  const logger = new Logger('Bootstrap'); // Tạo một instance logger với context tên là "Bootstrap"

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Security
  // Dùng thư viện Helmet để bảo vệ ứng dụng khỏi các lỗ hổng bảo mật phổ biến trên web bằng cách thiết lập các HTTP headers.
  app.use(helmet());
  // Dùng thư viện cookie-parser để đọc cookies từ các request HTTP. req.cookies
  app.use(cookieParser());

  // CORS
  const corsEnabled = configService.get('CORS_ENABLED', 'true') === 'true';
  if (corsEnabled) {
    app.enableCors({
      origin: configService.get('CORS_ORIGIN', 'http://localhost:3001'),
      credentials: true, // Cho phép gửi cookie, Authorization headers, v.v. từ browser đến API
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Chỉ định các header được phép gửi từ client
    });
  }

  // Global vilidation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Không chỉ loại bỏ, mà còn báo lỗi nếu client gửi các field thừa.
      transformOptions: {
        enableImplicitConversion: true, // Cho phép chuyển đổi tự động kiểu dữ liệu dựa trên type trong DTO mà không cần dùng @Type(() => Number) thủ công.
      },
    }),
  );

  // Swagger documentation
  const swaggerEnabled = configService.get('SWAGGER_ENABLED', 'true') === 'true';
  if (swaggerEnabled) {
    const config = new DocumentBuilder() //  class từ @nestjs/swagger được sử dụng để bắt đầu xây dựng cấu hình cho tài liệu OpenAPI.
      .setTitle('LMS Backend API') // Đặt tiêu đề lớn hiển thị ở đầu trang tài liệu.
      .setDescription('AI-Powered Learning Management System Backend API Documentation') // Mô tả ngắn gọn về API.
      .setVersion('1.0.0') // Phiên bản của API.
      .addBearerAuth(
        // Cấu hình cơ chế xác thực cho API.
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'JWT-auth', // Tên định danh cho cơ chế bảo mật này. Các endpoint có thể sử dụng @ApiBearerAuth('JWT-auth')
      )
      .addTag('Authentication', 'User authentication and authorization') // Thêm các "tag" (nhóm) vào tài liệu, để nhóm các endpoint của chúng lại với nhau
      .addTag('Users', 'User management operations')
      .addTag('Courses', 'Course management operations')
      .addTag('Assessments', 'Assessment and quiz operations')
      .addTag('AI', 'AI-powered features')
      .addTag('Health', 'Health check endpoints')
      .build(); //  Hoàn tất quá trình xây dựng cấu hình và trả về một đối tượng cấu hình tài liệu.

    const document = SwaggerModule.createDocument(app, config); // quét toàn bộ ứng dụng NestJS (app), đọc decorators
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      // Thiết lập endpoint để truy cập giao diện Swagger UI.
      swaggerOptions: {
        persistAuthorization: true, //  Đảm bảo rằng JWT token nhập vào ô "Authorize" sẽ được lưu lại khi bạn làm mới trang hoặc chuyển đổi giữa các trang tài liệu.
        // Sắp xếp các tag (nhóm API) và các operation (API endpoint) theo thứ tự bảng chữ cái
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    logger.log(`📚 Swagger documentation available at /${apiPrefix}/docs`);
  }

  // start server
  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🏥 Health check available at: http://localhost:${port}/${apiPrefix}/health`);

  if (swaggerEnabled) {
    logger.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
  }
}

bootstrap().catch(error => {
  Logger.error('❌ Error starting server', error);
  process.exit(1);
});
