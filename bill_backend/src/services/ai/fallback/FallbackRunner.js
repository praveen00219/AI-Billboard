import { withRetry } from "../utils/retry.js";
import { getBreaker } from "./circuitBreaker.js";
import { normalizeAnalysis } from "../adapters/normalize.js";
import { recordAttempt } from "../utils/logger.js";

/**
 * FallbackRunner — Strategy/Chain-of-Responsibility orchestrator.
 * Tries providers in priority order: retry transient failures, trip the breaker
 * on hard failure, then fall through to the next provider. Returns the first
 * provider's normalized analysis, or throws if every provider failed (the facade
 * turns that into the static safe object).
 */
export class FallbackRunner {
  /**
   * @param {{ providers: import("../interfaces/AIProvider.js").AIProvider[], config: object }} opts
   */
  constructor({ providers, config }) {
    this.providers = providers;
    this.config = config;
  }

  /** Ordered list of providers that are configured and not circuit-open. */
  #eligible() {
    const order = this.config.priority;
    const byName = new Map(this.providers.map((p) => [p.name, p]));
    const list = [];
    for (const name of order) {
      const p = byName.get(name);
      if (p && p.isConfigured()) list.push(p);
      if (!this.config.fallbackEnabled && list.length) break; // primary only
    }
    return list;
  }

  /**
   * @param {{ imageBase64: string, mimeType: string, maxRetries?: number }} input
   * @returns {Promise<{ analysis: object, providerUsed: string, attempts: number, latencyMs: number, providerAttempts: object[] }>}
   */
  async analyze(input) {
    const eligible = this.#eligible();
    const providerAttempts = [];
    let fellThrough = false;

    if (!eligible.length) {
      const err = new Error("No AI provider is configured");
      err.code = "NO_PROVIDER";
      throw err;
    }

    for (let i = 0; i < eligible.length; i++) {
      const provider = eligible[i];
      const breaker = getBreaker(provider.name, this.config.breaker);

      if (!breaker.canRequest()) {
        providerAttempts.push({ provider: provider.name, skipped: "circuit_open" });
        fellThrough = true;
        continue;
      }

      const started = Date.now();
      try {
        const { result: raw, attempts } = await withRetry(
          (signal) => provider.analyzeBillboardImage(input.imageBase64, input.mimeType, { signal }),
          {
            maxRetries: input.maxRetries ?? this.config.maxRetries,
            timeoutMs: this.config.timeoutMs,
          }
        );
        const latencyMs = Date.now() - started;
        const analysis = normalizeAnalysis(raw, provider.name);
        breaker.recordSuccess();

        const usage = provider.lastUsage || {};
        recordAttempt({
          provider: provider.name,
          success: true,
          latencyMs,
          tokensIn: usage.tokensIn,
          tokensOut: usage.tokensOut,
          model: provider.model,
        });
        providerAttempts.push({ provider: provider.name, ok: true, attempts, latencyMs });

        return {
          analysis,
          providerUsed: provider.name,
          attempts,
          latencyMs,
          fallbackOccurred: fellThrough || i > 0,
          providerAttempts,
        };
      } catch (err) {
        breaker.recordFailure();
        recordAttempt({ provider: provider.name, success: false });
        providerAttempts.push({
          provider: provider.name,
          ok: false,
          status: err.status,
          code: err.code,
          message: err.message?.slice(0, 160),
        });
        fellThrough = true;
        // ...continue to next provider
      }
    }

    const err = new Error("All AI providers failed");
    err.code = "ALL_PROVIDERS_FAILED";
    err.providerAttempts = providerAttempts;
    throw err;
  }
}

export default FallbackRunner;
