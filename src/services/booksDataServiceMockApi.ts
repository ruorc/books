import { MOCKAPI_CONFIG } from '@/config/mockapi';
import { MockApiBooksService } from './MockApiBooksService'; 

// Initialize the specialized MockAPI child service with specific project configuration endpoints parameters
export const booksService = new MockApiBooksService(MOCKAPI_CONFIG.ENDPOINTS.BOOKS);
