import { generateRuntimeId } from '@/utils/crypto';

/**
 * Generates a fresh random but persistent Picsum asset placeholder location string for newly created books.
 * Leverages internal runtime identification tokens to slice a unique seed value for the URL signature.
 */
export const generateStablePicsumUrl = (): string => {
  const rawId = generateRuntimeId();
  const uniqueSeed = rawId.split('-')[0] || 'fallback-seed';

  return `https://picsum.photos/seed/${uniqueSeed}/200/300`;
};
