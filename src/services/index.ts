import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { MockApiHttpBooksService } from '@/views/BooksDomain/services/MockApiBooksService';

export { BaseUrlManager } from './BaseUrlManager';
export { HttpBaseService } from './http/HttpBaseService';
export { HttpCrudService } from './http/HttpCrudService';
export { HttpServiceError } from './http/HttpServiceError';
export { formatServerError } from './http/HttpErrorFormatter';
export { runWithRetry, shouldRetryRequest } from './http/HttpRetryRunner';

/**
 * Singleton instance of the specialized application books infrastructure service.
 */
export const booksService = new MockApiHttpBooksService(
  MOCKAPI_CONFIG.ENDPOINTS.BOOKS
);
