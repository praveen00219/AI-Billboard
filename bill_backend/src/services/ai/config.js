import appConfig from "../../config/app.config.js";

/**
 * Centralized configuration for the multi-LLM AI layer.
 * Reads from process.env (loaded by dotenv in app.config) with safe defaults so
 * the system runs Gemini-only until an Anthropic key is added.
 */
const env = process.env;

function int(name, fallback) {
  const v = parseInt(env[name], 10);
  return Number.isFinite(v) ? v : fallback;
}

export const aiConfig = {
  // Ordered provider priority. First configured + healthy provider wins.
  priority: (env.AI_PROVIDER_PRIORITY || "gemini,claude")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Master switch — false => only the first provider is ever used (no failover).
  fallbackEnabled: env.AI_FALLBACK_ENABLED !== "false",

  // Per-provider retry/timeout defaults (the orchestrator owns retries).
  maxRetries: int("AI_MAX_RETRIES", 2),
  timeoutMs: int("AI_TIMEOUT_MS", 15000),

  // Circuit breaker tuning.
  breaker: {
    failureThreshold: int("AI_BREAKER_THRESHOLD", 4),
    cooldownMs: int("AI_BREAKER_COOLDOWN_MS", 30000),
  },

  gemini: {
    apiKey: appConfig.ai.apiKey, // process.env.KEY
    apiUrl: appConfig.ai.apiUrl, // process.env.API
  },

  claude: {
    apiKey: env.ANTHROPIC_API_KEY || "",
    model: env.CLAUDE_MODEL || "claude-sonnet-4-6",
  },
};

export default aiConfig;
