import { REDIS_CLIENT } from '@/modules/redis/redis.module';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async getHealthStatus() {
    const [database, redis] = await Promise.allSettled([
      this.getDatabaseHealth(),
      this.getRedisHealth(),
    ]);
    // Nếu Promise thành công, đối tượng sẽ có dạng { status: 'fulfilled', value: <kết_quả_của_promise> }.
    // Nếu Promise thất bại, đối tượng sẽ có dạng { status: 'rejected', reason: <lỗi_của_promise> }.

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: database.status === 'fulfilled' ? database.value : { status: 'error' },
        redis: redis.status === 'fulfilled' ? redis.value : { status: 'error' },
      },
    };
  }

  async getDatabaseHealth() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'unhealthy', message: error };
    }
  }

  async getRedisHealth() {
    try {
      await this.redis.ping();
      return { status: 'healthy', message: 'Redis connection successful' };
    } catch (error) {
      return { status: 'unhealthy', message: error };
    }
  }
}
