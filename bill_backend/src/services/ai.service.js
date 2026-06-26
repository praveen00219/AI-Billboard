/**
 * Back-compat shim. The AI implementation moved to ./ai/ (multi-provider layer
 * with Gemini → Claude failover). Existing imports keep working unchanged:
 *
 *   import { analyzeBillboard } from "../services/ai.service.js";
 */
export { analyzeBillboard, getAiHealth } from "./ai/index.js";
export { default } from "./ai/index.js";
