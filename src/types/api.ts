export interface RetryOptions {
  retries?: number;
  delay?: number;
  signal?: AbortSignal;
}

/**
 * Universal dictionary payload for HTTP query string parameters filtering operations
 */
export interface QueryFilters {
  search?: string;
  isFavorite?: boolean;
  author?: string;
  year?: string;
  [key: string]: string | boolean | number | undefined;
}
