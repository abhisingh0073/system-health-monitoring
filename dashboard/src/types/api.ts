export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  count: number;
}