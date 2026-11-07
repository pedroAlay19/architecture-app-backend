import { PaginationMetadata } from "../interfaces/pagination-metadata.interface";

export const buildPagination = (
  total: number,
  page: number,
  limit: number,
): PaginationMetadata => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});