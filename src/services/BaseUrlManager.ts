/**
 * Immutable manager that standardizes endpoint URLs, validates allowed network protocols, and exposes safe route segments.
 */
export class BaseUrlManager {
  /** Internal native Web API URL instance serving as the absolute root origin for all structural route derivations */
  private readonly baseUrl: URL;

  /**
   * Initializes the manager by processing the raw endpoint string and validating against permitted transport protocols.
   */
  constructor(
    endpointUrl: string,
    contextName: string,
    allowedProtocols: string[] = ['http:', 'https:']
  ) {
    const parsedUrl = BaseUrlManager.sanitizeAndNormalizeUrl(
      endpointUrl,
      contextName
    );

    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      throw new Error(
        `[${contextName}] Security error: Only ${allowedProtocols.join(', ')} protocols are allowed.`
      );
    }

    this.baseUrl = parsedUrl;
  }

  /**
   * Exposes the internal immutable URL instance for advanced parameter appending.
   */
  public get raw(): URL {
    return this.baseUrl;
  }

  /**
   * Returns the fully serialized URL string stripped of any trailing slashes.
   */
  public get url(): string {
    return this.baseUrl.toString().replace(/\/+$/, '');
  }

  /**
   * Returns the isolated URL pathname string stripped of any trailing slashes.
   */
  public get path(): string {
    return this.baseUrl.pathname.replace(/\/+$/, '');
  }

  /**
   * Creates a fresh URL instance paired with additional path nodes, identifiers, or pre-built search parameters.
   */
  public resolve(pathSegment?: string, searchParams?: URLSearchParams): URL {
    const targetUrl = pathSegment
      ? new URL(pathSegment, this.baseUrl)
      : new URL(this.baseUrl.toString());
    if (searchParams) {
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
      });
    }
    return targetUrl;
  }

  /**
   * Converts a raw string configuration into a structurally sound URL instance by fixing backslashes and path closures.
   */
  private static sanitizeAndNormalizeUrl(
    url: string,
    contextName: string
  ): URL {
    if (!url || typeof url !== 'string') {
      throw new Error(
        `[${contextName}] Critical configuration error: Base endpoint URL is missing.`
      );
    }

    try {
      const parsedUrl = new URL(url.replace(/\\/g, '/'));

      if (!parsedUrl.pathname.endsWith('/')) {
        parsedUrl.pathname += '/';
      }

      return parsedUrl;
    } catch (error) {
      throw new Error(
        `[${contextName}] Configuration error: Provided string is not a valid absolute URL.`,
        { cause: error }
      );
    }
  }
}
