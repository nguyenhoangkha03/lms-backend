import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { ConfigService } from '@nestjs/config';
import { getRedisConfig } from '@/config/redis.config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT'; // Khai báo và xuất một hằng số chuỗi, định danh

@Global()
@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getRedisConfig(configService);
        const redis = new Redis(config);

        redis.on('connect', () => {
          console.log('✅ Redis connected successfully');
        });

        redis.on('error', error => {
          console.error('❌ Redis connection error:', error);
        });

        redis.on('ready', () => {
          console.log('🚀 Redis is ready to use');
        });

        return redis;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
