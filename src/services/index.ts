import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { MockApiHttpBooksService } from './MockApiBooksService';

/**
 * Singleton instance of the specialized application books infrastructure service.
 */
export const booksService = new MockApiHttpBooksService(
  MOCKAPI_CONFIG.ENDPOINTS.BOOKS
);
