import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRedisConfig } from '@/config/redis.config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/common/constants/redis.constants';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [RedisController],
  providers: [
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
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
