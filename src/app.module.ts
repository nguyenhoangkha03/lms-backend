import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Database và Redis modules
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { HealthModule } from './health/health.module';

// config
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Config module - phải load đầu tiên
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true, // Lần đầu gọi configService.get('REDIS_HOST') sẽ đọc từ .env, các lần sau sẽ đọc từ cache RAM (nhanh hơn rất nhiều).
    }),

    // Database module
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),

    // Global modules
    DatabaseModule,
    RedisModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
