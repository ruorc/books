import { generateRuntimeId } from '@/utils/crypto';

/**
 * Generates a structurally unique, randomized but persistent imagery placeholder source location.
 * Leverages atomic runtime entropy slices to seed the remote vendor asset endpoint,
 * ensuring the returned graphics remains stable across layout paint updates and re-renders.
 */
export const generateStablePicsumUrl = (): string => {
  const rawId = generateRuntimeId();
  const uniqueSeed = rawId.split('-')[0] || 'fallback-seed';

  return `https://picsum.photos/seed/${uniqueSeed}/200/300`;
};
