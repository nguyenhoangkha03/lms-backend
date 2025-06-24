export interface PaginationOptions {
  page?: number; // số trang hiện tại muốn lấy
  limit?: number; // số lượng bản ghi trên mỗi trang
  sortBy?: string; // trường cần sắp xếp
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
