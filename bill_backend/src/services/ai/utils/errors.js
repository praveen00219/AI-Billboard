/**
 * Unified AI error + classifier. Providers throw AIProviderError (or pass through
 * vendor SDK errors that carry `.status`); the classifier decides whether to
 * retry the same provider or fall through to the next one.
 */
export class AIProviderError extends Error {
  constructor(message, { provider, status, code, cause } = {}) {
    super(message);
    this.name = "AIProviderError";
    this.provider = provider;
    this.status = status; // HTTP status when known
    this.code = code; // e.g. "ECONNRESET", "EMPTY_RESPONSE", "INVALID_JSON"
    if (cause) this.cause = cause;
  }
}

// Network/transport error codes that are worth retrying.
const RETRYABLE_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EAI_AGAIN",
  "EPIPE",
  "ABORT_ERR",
  "EMPTY_RESPONSE",
  "INVALID_JSON",
]);

const NON_RETRYABLE_STATUS = new Set([400, 401, 403, 404, 422]);

/**
 * @returns {{ retryable: boolean, status?: number, code?: string }}
 *   retryable=true  -> transient; retry the same provider (then fall through)
 *   retryable=false -> config/input problem; skip to next provider immediately
 */
export function classifyError(err) {
  const status = err?.status ?? err?.statusCode;
  const code = err?.code ?? err?.cause?.code;
  const name = err?.name;

  // Aborts / timeouts (AbortController) are transient.
  if (name === "AbortError" || name === "APIConnectionError" || name === "APIConnectionTimeoutError") {
    return { retryable: true, status, code: code || "ABORT_ERR" };
  }

  if (typeof status === "number") {
    if (NON_RETRYABLE_STATUS.has(status)) return { retryable: false, status, code };
    if (status === 408 || status === 409 || status === 429 || status >= 500) {
      return { retryable: true, status, code };
    }
    // Unknown 4xx -> treat as non-retryable config error.
    if (status >= 400 && status < 500) return { retryable: false, status, code };
  }

  if (code && RETRYABLE_CODES.has(code)) return { retryable: true, status, code };

  // No signal at all (e.g. unexpected parse error) -> retry once defensively.
  return { retryable: true, status, code };
}

export default { AIProviderError, classifyError };
