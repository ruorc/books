import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { MockApiHttpBooksService } from './MockApiBooksService';

/**
 * Singleton instance of the operational books infrastructure service boundary.
 * Enforces centralized synchronization routing across the MockAPI server schema pipelines.
 */
export const booksService = new MockApiHttpBooksService(
  MOCKAPI_CONFIG.ENDPOINTS.BOOKS
);
