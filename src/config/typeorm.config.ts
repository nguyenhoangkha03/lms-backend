import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  timezone: '+00:00',
  charset: 'utf8mb4',
  extra: {
    connectionLimit: 10,
  },
  autoLoadEntities: true, // không cần liệt kê thủ công các entity trong file config nữa.
  retryAttempts: 3, // Số lần thử lại (ở đây là 3 lần)
  retryDelay: 3000, // Thời gian chờ giữa các lần thử (ở đây là 3000ms = 3 giây)
});
