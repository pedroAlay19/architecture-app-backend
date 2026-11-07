import { PaginationMetadata } from "./pagination-metadata.interface";

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  metadata?: PaginationMetadata;
}