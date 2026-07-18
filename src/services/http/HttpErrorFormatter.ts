/**
 * Safely extracts detailed diagnostic messaging or structural validation logs from non-ok server responses.
 */
export async function formatServerError(response: Response): Promise<string> {
  const defaultMessage = `HTTP error. Status: ${response.status}`;

  try {
    const errorJson = await response.json();
    const serverMessage =
      errorJson?.message ||
      errorJson?.error ||
      (Array.isArray(errorJson?.errors)
        ? errorJson.errors.join(', ')
        : JSON.stringify(errorJson));

    return serverMessage
      ? `HTTP ${response.status}: ${serverMessage}`
      : defaultMessage;
  } catch {
    try {
      const textFallback = await response.text();

      return textFallback
        ? `HTTP ${response.status}: ${textFallback}`
        : defaultMessage;
    } catch {
      return defaultMessage;
    }
  }
}
