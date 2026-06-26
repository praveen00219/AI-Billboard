/**
 * Per-provider circuit breaker. Prevents hammering a known-down provider
 * (critical given Gemini's 0-quota state — every request would otherwise burn
 * the retry budget before falling through to Claude).
 *
 * States: CLOSED -> (failures >= threshold) -> OPEN -> (cooldown) -> HALF_OPEN
 *         HALF_OPEN -> success -> CLOSED | failure -> OPEN
 */
export class CircuitBreaker {
  constructor({ failureThreshold = 4, cooldownMs = 30000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.state = "CLOSED";
    this.failures = 0;
    this.openUntil = 0;
  }

  /** @returns {boolean} whether a request is allowed through right now. */
  canRequest(now = Date.now()) {
    if (this.state === "OPEN") {
      if (now >= this.openUntil) {
        this.state = "HALF_OPEN";
        return true; // allow a single trial
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.state = "CLOSED";
    this.failures = 0;
    this.openUntil = 0;
  }

  recordFailure(now = Date.now()) {
    this.failures += 1;
    if (this.state === "HALF_OPEN" || this.failures >= this.failureThreshold) {
      this.state = "OPEN";
      this.openUntil = now + this.cooldownMs;
    }
  }

  snapshot() {
    return {
      state: this.state,
      failures: this.failures,
      openForMs: this.state === "OPEN" ? Math.max(0, this.openUntil - Date.now()) : 0,
    };
  }
}

// One breaker per provider name.
const registry = new Map();
export function getBreaker(name, opts) {
  if (!registry.has(name)) registry.set(name, new CircuitBreaker(opts));
  return registry.get(name);
}
export function snapshotBreakers() {
  return Object.fromEntries([...registry.entries()].map(([k, b]) => [k, b.snapshot()]));
}

export default { CircuitBreaker, getBreaker, snapshotBreakers };
