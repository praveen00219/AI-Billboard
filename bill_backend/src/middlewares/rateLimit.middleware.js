import rateLimit from "express-rate-limit";

/**
 * Rate limiter for AI endpoints — caps how often a client can trigger paid LLM
 * calls (abuse / runaway-cost protection). Keyed by IP by default.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 AI requests / minute / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many AI requests. Please wait a moment and try again." },
});

export default { aiRateLimiter };
