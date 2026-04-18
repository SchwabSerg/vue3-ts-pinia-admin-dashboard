export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type SortDirection = 'asc' | 'desc';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
