import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SearchDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search query',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
