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
}
