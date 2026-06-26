import { classifyError } from "./errors.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Run `fn(signal)` with exponential backoff + full jitter, retrying only on
 * transient errors (per classifyError). Each attempt gets its own AbortController
 * timeout. Non-retryable errors throw immediately. Honors a numeric `retryAfterMs`
 * on the error if present.
 *
 * @param {(signal: AbortSignal) => Promise<any>} fn
 * @param {{ maxRetries?: number, timeoutMs?: number, baseDelayMs?: number, maxDelayMs?: number }} opts
 */
export async function withRetry(fn, opts = {}) {
  const {
    maxRetries = 2,
    timeoutMs = 15000,
    baseDelayMs = 500,
    maxDelayMs = 8000,
  } = opts;

  let attempt = 0;
  // total tries = maxRetries (>=1)
  const tries = Math.max(1, maxRetries);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await fn(controller.signal);
      clearTimeout(timer);
      return { result, attempts: attempt + 1 };
    } catch (err) {
      clearTimeout(timer);
      const { retryable } = classifyError(err);
      attempt += 1;
      if (!retryable || attempt >= tries) {
        err.attempts = attempt;
        throw err;
      }
      const retryAfter = Number(err?.retryAfterMs) || 0;
      const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      const jittered = Math.floor(Math.random() * backoff); // full jitter
      await sleep(Math.max(retryAfter, jittered));
    }
  }
}

export default { withRetry };
