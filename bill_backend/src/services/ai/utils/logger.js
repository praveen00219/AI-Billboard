/**
 * Structured AI logging + lightweight in-memory metrics.
 * One JSON line per AI request, plus running counters surfaced at /api/health/ai.
 * Never logs image bytes or API keys.
 */

// Per-1M-token USD pricing for cost estimation.
const PRICING = {
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-haiku-4-5": { in: 1, out: 5 },
  gemini: { in: 0, out: 0 }, // free tier / not separately billed here
};

export function estimateCostUSD(model, tokensIn = 0, tokensOut = 0) {
  const p = PRICING[model] || PRICING.gemini;
  return +(((tokensIn * p.in) + (tokensOut * p.out)) / 1_000_000).toFixed(6);
}

const metrics = {
  totalRequests: 0,
  fallbackOccurred: 0,
  staticFallback: 0,
  byProvider: {}, // name -> { used, success, failure, tokensIn, tokensOut, costUSD, latencySamples: [] }
};

function providerBucket(name) {
  if (!metrics.byProvider[name]) {
    metrics.byProvider[name] = {
      used: 0, success: 0, failure: 0, tokensIn: 0, tokensOut: 0, costUSD: 0, latencyMs: [],
    };
  }
  return metrics.byProvider[name];
}

export function recordAttempt({ provider, success, latencyMs = 0, tokensIn = 0, tokensOut = 0, model }) {
  const b = providerBucket(provider);
  if (success) {
    b.used += 1;
    b.success += 1;
    b.tokensIn += tokensIn;
    b.tokensOut += tokensOut;
    b.costUSD = +(b.costUSD + estimateCostUSD(model || provider, tokensIn, tokensOut)).toFixed(6);
    b.latencyMs.push(latencyMs);
    if (b.latencyMs.length > 200) b.latencyMs.shift();
  } else {
    b.failure += 1;
  }
}

export function logAiEvent(event) {
  metrics.totalRequests += 1;
  if (event.fallbackOccurred) metrics.fallbackOccurred += 1;
  if (event.providerUsed === "none") metrics.staticFallback += 1;
  // Single structured line — safe fields only.
  try {
    console.log(`[ai] ${JSON.stringify(event)}`);
  } catch {
    console.log("[ai] <unserializable event>");
  }
}

function percentile(arr, q) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((q / 100) * sorted.length));
  return sorted[idx];
}

export function getMetricsSnapshot() {
  const providers = Object.fromEntries(
    Object.entries(metrics.byProvider).map(([name, b]) => [
      name,
      {
        used: b.used,
        success: b.success,
        failure: b.failure,
        successRate: b.used + b.failure ? +(b.success / (b.used + b.failure)).toFixed(3) : null,
        tokensIn: b.tokensIn,
        tokensOut: b.tokensOut,
        estCostUSD: b.costUSD,
        p50LatencyMs: percentile(b.latencyMs, 50),
        p95LatencyMs: percentile(b.latencyMs, 95),
      },
    ])
  );
  return {
    totalRequests: metrics.totalRequests,
    fallbackOccurred: metrics.fallbackOccurred,
    fallbackRate: metrics.totalRequests ? +(metrics.fallbackOccurred / metrics.totalRequests).toFixed(3) : 0,
    staticFallback: metrics.staticFallback,
    providers,
  };
}

export default { logAiEvent, recordAttempt, getMetricsSnapshot, estimateCostUSD };
