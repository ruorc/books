import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { MockApiBooksService } from './MockApiBooksService';

/**
 * Singleton instance of the specialized MockAPI books service.
 * Pre-configured with the vendor-specific project endpoint configuration.
 * Use this exported instance directly across components or state managers for server operations.
 */
export const booksService = new MockApiBooksService(
  MOCKAPI_CONFIG.ENDPOINTS.BOOKS
);
