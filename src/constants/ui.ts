import { generateRuntimeId } from '@/config/crypto';

/** Display label announced by screen readers when lazy-loaded routing chunks trigger loading delays */
export const LOADER_ACCESSIBILITY_TEXT = 'Loading page content...' as const;

/**
 * Human-readable presentation labels representing system architecture engines.
 * Shared across the global Layout and structural Footer sub-components.
 */
export const ENGINE_LABELS = {
  /** Display descriptor for the hooks-driven reactive rendering flow */
  FUNCTIONAL: 'Functional Components (Hooks)',
  /** Display descriptor for the class-based legacy engine architecture */
  CLASS: 'Class Components (Lifecycle)',
} as const;

/**
 * Generates a stable and immutable Picsum asset placeholder location string.
 * Extracts the first structural block before the initial hyphen separator to guarantee
 * that the returned image remains absolutely consistent across all subsequent rerenders.
 */
export const generateStablePicsumUrl = (): string => {
  const rawId = generateRuntimeId();
  const uniqueSeed = rawId.split('-')[0] || 'fallback-seed';

  return `https://picsum.photos/seed/${uniqueSeed}/200/300`;
};
