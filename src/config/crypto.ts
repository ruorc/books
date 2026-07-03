/**
 * Generates a universally unique identifier (UUID) or a structured random fallback string.
 * Safely guards against runtime execution crashes when the application is opened
 * within insecure environments (e.g., plain http:// configuration zones without SSL support).
 *
 * Both success and fallback paths return a hyphen-separated string format to ensure
 * predictable substring extraction at the call site.
 *
 * @returns A guaranteed unique or randomized identification string containing hyphens.
 */
export const generateRuntimeId = (): string => {
  const hasCryptoSupport =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

  if (hasCryptoSupport) {
    return crypto.randomUUID();
  }

  // Create a structured hyphenated token mimicking UUID segments for call-site predictability
  const randomSegmentA = Math.floor(Math.random() * 1000000).toString(16);
  const randomSegmentB = Date.now().toString(16);

  return `${randomSegmentA}-${randomSegmentB}`;
};
