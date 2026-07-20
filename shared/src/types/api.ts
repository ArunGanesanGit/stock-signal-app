export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  timestamp: string;
}

export enum ErrorCode {
  INVALID_SYMBOL = "INVALID_SYMBOL",
  STOCK_NOT_FOUND = "STOCK_NOT_FOUND",
  RATE_LIMIT = "RATE_LIMIT",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR"
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: ErrorCode;
  timestamp: string;
}
