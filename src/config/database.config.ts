import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: parseInt(configService.get('DB_PORT', '3306')),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_DATABASE', 'lms_database'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../**/*.migration{.ts,.js}'],
  // seeds: [__dirname + '/../database/seeds/*{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get('DB_LOGGING', 'false') === 'true',
  timezone: '+00:00',
  charset: 'utf8mb4',
  extra: {
    connectionLimit: 10, //  Số lượng kết nối tối đa trong pool kết nối.
    acquireTimeout: 60000, // Thời gian tối đa (miligiây) để cố gắng lấy một kết nối từ pool trước khi gặp lỗi.
    timeout: 60000, // Thời gian tối đa (miligiây) để một truy vấn hoàn thành trước khi bị hủy.
  },
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'], // Chỉ định đường dẫn đến các file subscriber. Subscriber trong TypeORM cho phép bạn phản ứng với các sự kiện trong vòng đời của entity (ví dụ: trước khi lưu, sau khi xóa).
};

const AppDataSource = new DataSource(databaseConfig);

export default AppDataSource;
