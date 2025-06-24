import {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { PaginatedResult, PaginationOptions } from '../types/pagination.interface';

export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async findWithPagination(
    options: PaginationOptions & { where?: FindOptionsWhere<T> }, // là điều kiện lọc trong truy vấn TypeORM (ví dụ: { isActive: true })
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy = 'createAt', sortOrder = 'DESC', where } = options;

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<T> = {
      where,
      take: limit,
      skip,
      order: {
        [sortBy]: sortOrder,
      } as any,
    };

    const [data, total] = await this.findAndCount(findOptions);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findByIds(ids: string[]): Promise<T[]> {
    if (!ids.length) return [];

    return this.createQueryBuilder('entity').whereInIds(ids).getMany();
  }

  // override
  async softDelete(id: string): Promise<UpdateResult> {
    return await this.update(id, { deletedAt: new Date() } as any);
  }

  async restore(id: string): Promise<UpdateResult> {
    return await this.update(id, { deletedAt: null } as any);
  }

  // chỉ truy vấn bảng ghi chưa bị xóa mềm
  createSearchQuery(alias: string): SelectQueryBuilder<T> {
    return this.createQueryBuilder(alias).where(`${alias}.deletedAt IS NULL`);
  }
}
