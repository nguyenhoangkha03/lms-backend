import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const getRedisConfig = (configService: ConfigService): RedisOptions => ({
  host: configService.get('REDIS_HOST', 'localhost'),
  port: parseInt(configService.get('REDIS_PORT', '6379')),
  password: configService.get('REDIS_PASSWORD') || undefined,
  db: parseInt(configService.get('REDIS_DB', '0')),
  // hàm được gọi khi kết nối Redis bị mất và cần thử kết nối lại.
  retryStrategy: times => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: false, // true (mặc định), ioredis sẽ gửi lệnh INFO hoặc PING để kiểm tra xem Redis đã sẵn sàng chấp nhận lệnh hay chưa
  maxRetriesPerRequest: 3, // Số lần tối đa một lệnh Redis sẽ được thử lại nếu nó thất bại
  lazyConnect: true, // Khi đặt là true, ioredis sẽ không kết nối ngay lập tức khi bạn khởi tạo thể hiện của Redis.
  keepAlive: 30000, // Khoảng thời gian (miligiây) mà kết nối TCP sẽ được duy trì hoạt động thông qua các gói tin "keep-alive" để ngăn kết nối bị đóng bởi tường lửa hoặc do không hoạt động. Ở đây là 30 giây.
  family: 4, // Chỉ định loại giao thức IP để sử dụng. 4 là IPv4. 6 là IPv6.
  keyPrefix: 'lms:', // Một tiền tố sẽ được thêm vào tất cả các khóa Redis mà ứng dụng sử dụng
});
