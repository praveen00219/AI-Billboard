import { createHash } from "crypto";
import aiConfig from "./config.js";
import { GeminiProvider } from "./providers/gemini/gemini.provider.js";
import { ClaudeProvider } from "./providers/claude/claude.provider.js";
import { FallbackRunner } from "./fallback/FallbackRunner.js";
import { calculateRisk } from "./utils/risk.js";
import { logAiEvent, getMetricsSnapshot } from "./utils/logger.js";
import { snapshotBreakers } from "./fallback/circuitBreaker.js";

/* ── Provider factory + orchestrator (built once) ───────────────────────────── */
const gemini = new GeminiProvider({ apiKey: aiConfig.gemini.apiKey, apiUrl: aiConfig.gemini.apiUrl });
const claude = new ClaudeProvider({ apiKey: aiConfig.claude.apiKey, model: aiConfig.claude.model });
const runner = new FallbackRunner({ providers: [gemini, claude], config: aiConfig });

/* ── Tiny TTL+LRU cache keyed by image bytes (dedupes submit↔generate + retries) */
const CACHE_MAX = 200;
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map(); // hash -> { value, expires }

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  // refresh LRU position
  cache.delete(key);
  cache.set(key, hit);
  return hit.value;
}
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
}

const STATIC_FALLBACK = {
  extractedText: "",
  category: "Safety Hazard",
  contentAnalysis: {},
  structuralAnalysis: {},
  sizeAnalysis: {},
  riskPercentage: 25,
  riskLevel: "Medium",
};

/**
 * Public facade — drop-in replacement for the original analyzeBillboard.
 * Same signature and same return shape, so report.controller.js, the DB write,
 * and the frontend are all unchanged. Internally: Gemini → Claude failover.
 *
 * @returns {Promise<{extractedText,category,contentAnalysis,structuralAnalysis,sizeAnalysis,riskPercentage,riskLevel,riskReason}>}
 */
export async function analyzeBillboard(imageBase64, mimeType, description, latitude, longitude, retries) {
  const key = imageBase64 ? createHash("sha256").update(imageBase64).digest("hex") : null;
  if (key) {
    const cached = cacheGet(key);
    if (cached) return cached;
  }

  try {
    const { analysis, providerUsed, attempts, latencyMs, fallbackOccurred, providerAttempts } =
      await runner.analyze({ imageBase64, mimeType, maxRetries: retries });

    const risk = calculateRisk(analysis);
    const result = {
      extractedText: analysis.text || "",
      category: analysis.category || "Safety Hazard",
      contentAnalysis: analysis.content,
      structuralAnalysis: analysis.structure,
      sizeAnalysis: analysis.placement,
      riskPercentage: risk.riskPercentage,
      riskLevel: risk.riskLevel,
      riskReason: analysis.summary || risk.reason,
    };

    logAiEvent({
      operation: "analyzeBillboard",
      providerUsed,
      attempts,
      latencyMs,
      fallbackOccurred,
      providerAttempts,
      success: true,
    });

    if (key) cacheSet(key, result);
    return result;
  } catch (err) {
    // Every provider failed (or none configured) — never throw to the user.
    logAiEvent({
      operation: "analyzeBillboard",
      providerUsed: "none",
      success: false,
      fallbackOccurred: true,
      error: err.code || err.message,
      providerAttempts: err.providerAttempts,
    });
    return { ...STATIC_FALLBACK, riskReason: `Fallback due to error: ${err.message}` };
  }
}

/** Health/observability snapshot for GET /api/health/ai. */
export function getAiHealth() {
  return {
    fallbackEnabled: aiConfig.fallbackEnabled,
    priority: aiConfig.priority,
    providers: {
      gemini: { configured: gemini.isConfigured() },
      claude: { configured: claude.isConfigured(), model: aiConfig.claude.model },
    },
    breakers: snapshotBreakers(),
    metrics: getMetricsSnapshot(),
  };
}

export default { analyzeBillboard, getAiHealth };
