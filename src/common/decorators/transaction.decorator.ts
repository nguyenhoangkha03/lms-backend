import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

// Tạo decorator để inject queryRunner từ request vào controller, service
export const TransactionQueryRunner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): QueryRunner => {
    const request = ctx.switchToHttp().getRequest();
    return request.queryRunner;
  },
);
