import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async isConnected(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async getQueryRunner(): Promise<QueryRunner> {
    return this.dataSource.createQueryRunner();
  }

  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    return this.dataSource.query(query, parameters);
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // kết nối QueryRunner với DB
    await queryRunner.startTransaction();
    return queryRunner; // QueryRunner đã được khởi tạo giao dịch
  }

  async commitTransaction(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
    await queryRunner.release(); // giải phóng QueryRunner trở lại pool kết nối
  }

  async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string; redis?: string }> {
    const isDbConnected = await this.isConnected();

    return {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      database: isDbConnected ? 'connected' : 'disconnected',
    };
  }
}
