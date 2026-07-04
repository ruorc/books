/**
 * Generates a universally unique identifier or a highly structured random fallback string.
 * Intercepts environment execution states to safeguard against terminal runtime crashes
 * when the application gets loaded inside insecure contexts without active SSL certifications.
 * Returns a guaranteed non-nullable string containing hyphens for stable call-site splitting.
 */
export const generateRuntimeId = (): string => {
  const hasCryptoSupport =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

  if (hasCryptoSupport) {
    return crypto.randomUUID();
  }

  const randomSegmentA = Math.floor(Math.random() * 1000000).toString(16);
  const randomSegmentB = Date.now().toString(16);

  return `${randomSegmentA}-${randomSegmentB}`;
};
