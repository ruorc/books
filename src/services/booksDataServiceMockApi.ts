import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { HttpBooksService } from './HttpBooksService';

// Initialize the universal HTTP service with MockAPI specific configuration parameters
export const booksService = new HttpBooksService(MOCKAPI_CONFIG.ENDPOINTS.BOOKS);
