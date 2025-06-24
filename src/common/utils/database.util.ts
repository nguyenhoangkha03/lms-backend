// nơi chứa các hàm tiện ích tái sử dụng được liên quan đến db
// có thể dùng ở mọi nơi trong project, không gắn với module cụ thể.

import { Repository, EntityTarget, DataSource } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'; // cập nhật 1 phần

export class DatabaseUtil {
  static async truncateTable<T extends BaseEntity>(
    dataSource: DataSource,
    entity: EntityTarget<T>,
  ): Promise<void> {
    const repository = dataSource.getRepository(entity);
    const tableName = repository.metadata.tableName;

    await dataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await dataSource.query(`TRUNCATE TABLE ${tableName}`);
    await dataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }

  static async resetAutoIncrement<T extends BaseEntity>(
    dataSource: DataSource,
    entity: EntityTarget<T>,
  ): Promise<void> {
    const repository = dataSource.getRepository(entity);
    const tableName = repository.metadata.tableName;

    await dataSource.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
  }

  static async getTableSize<T extends BaseEntity>(
    dataSource: DataSource,
    entity: EntityTarget<T>,
  ): Promise<number> {
    const repository = dataSource.getRepository(entity);
    return repository.count();
  }

  static async bulkInsert<T extends BaseEntity>(
    repository: Repository<T>,
    entities: Partial<T>[],
    chunkSize: number = 1000,
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      await repository.insert(chunk as any);
    }
  }

  static async bulkUpdate<T extends BaseEntity>(
    repository: Repository<T>,
    entities: Array<{ id: string; data: QueryDeepPartialEntity<T> }>,
    chunkSize: number = 1000,
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);

      for (const entity of chunk) {
        await repository.update(entity.id, entity.data);
      }
    }
  }
}
