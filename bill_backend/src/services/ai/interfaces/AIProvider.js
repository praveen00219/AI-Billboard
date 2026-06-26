/**
 * AIProvider — the contract every LLM provider adapter must satisfy.
 * Implemented by GeminiProvider and ClaudeProvider. The rest of the app depends
 * on this interface, never on a concrete vendor.
 *
 * @typedef {Object} RawAnalysis  Provider-specific structured billboard analysis.
 *   Shape (normalized by adapters/normalize.js):
 *   { text, category, content{...}, structure{...}, placement{...}, summary }
 *
 * Methods:
 *   - name: string  ("gemini" | "claude")
 *   - isConfigured(): boolean   — true when the provider has the credentials it needs
 *   - analyzeBillboardImage(imageBase64, mimeType, { signal }): Promise<RawAnalysis>
 *       The only load-bearing method. Throws on failure (errors are classified by utils/errors.js).
 *   - chat({ system, messages, maxTokens, signal }): Promise<string>
 *       Generic text completion. Provided for interface completeness / future
 *       LLM-authored copy; not used by the current app (titles/descriptions are
 *       derived deterministically by the controller's composeDraft).
 */
export class AIProvider {
  /** @type {string} */
  name = "base";

  // eslint-disable-next-line class-methods-use-this
  isConfigured() {
    return false;
  }

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  async analyzeBillboardImage(_imageBase64, _mimeType, _opts = {}) {
    throw new Error("analyzeBillboardImage() not implemented");
  }

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  async chat(_opts = {}) {
    throw new Error("chat() not implemented");
  }
}

export default AIProvider;
