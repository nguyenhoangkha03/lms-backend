import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get(key: string): Promise<string> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  // đặt ttl
  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  // lấy thời gian tồn tại còn lại (-1 nếu tồn tại k có ttl, -2 khóa k tồn tại)
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  // hash: key: { field1: value1, field2: value2, ... }
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.redis.hset(key, field, value);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    return this.redis.hdel(key, field);
  }

  // chèn 1 hoặc nhiều value vào bên trái list
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.redis.lpush(key, ...values); // length
  }

  // xóa và trả về phần tử cuối cùng (bên phải) list
  async rpop(key: string): Promise<string | null> {
    return this.redis.rpop(key); // phần tử xóa
  }

  // chiều dài của danh sách có tên là key
  async llen(key: string): Promise<number> {
    return this.redis.llen(key);
  }

  // set: không có thứ tự, không chứa các phần tử trùng lặp.
  // thêm một hoặc nhiều member vào tập hợp có tên là key. Các phần tử trùng lặp sẽ bị bỏ qua.
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.redis.sadd(key, ...members); // số lượng phần tử mới được thêm vào tập hợp.
  }

  // xóa một hoặc nhiều member khỏi tập hợp có tên là key
  async srem(key: string, ...members: string[]): Promise<number> {
    return this.redis.srem(key, ...members); // số lượng phần tử đã bị xóa.
  }

  // lấy tất cả các phần tử trong tập hợp có tên là key
  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(key); // một mảng các chuỗi chứa tất cả các phần tử.
  }

  // nếu khóa key không tồn tại, nó sẽ được tạo và giá trị được khởi tạo là 0, sau đó tăng lên 1
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  // nếu khóa key không tồn tại, nó sẽ được tạo và giá trị được khởi tạo là 0, sau đó giảm xuống -1
  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  // xóa tất cả key
  async flushall(): Promise<string> {
    return this.redis.flushall();
  }

  // Cache with JSON
  async setObject(key: string, value: any, ttl?: number): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.set(key, jsonValue, ttl);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    const key = `session:${sessionId}`;
    await this.setObject(key, data, ttl);
  }

  async getSession<T>(sessionId: string): Promise<T | null> {
    const key = `session:${sessionId}`;
    return this.getObject<T>(key);
  }

  async deleteSession(sessionId: string): Promise<number> {
    const key = `session:${sessionId}`;
    return this.del(key);
  }

  // Rate limiting
  // kiểm tra và thực thi giới hạn tần suất cho một key cụ thể (ví dụ: IP address, user ID). Đây là một cách phổ biến để bảo vệ API khỏi bị lạm dụng hoặc tấn công DDoS
  async checkRateLimit(
    key: string,
    limit: number,
    window: number, // khoảng thời gian
  ): Promise<{ allowed: boolean; remaining: number }> {
    const current = await this.incr(key);

    if (current === 1) {
      await this.expire(key, window);
    }

    const remaining = Math.max(0, limit - current);

    return {
      allowed: current <= limit,
      remaining,
    };
  }
}
