import fetch from "node-fetch";
import { AIProvider } from "../../interfaces/AIProvider.js";
import { AIProviderError } from "../../utils/errors.js";
import { GEMINI_PROMPT } from "../../prompts/billboardAnalysis.prompt.js";

/**
 * GeminiProvider — wraps the Google Generative Language REST API.
 * Preserves the original call/parse behavior (tolerant JSON extraction), but
 * returns RAW analysis and throws classified errors (the orchestrator owns
 * retries/fallback, not this adapter).
 */
export class GeminiProvider extends AIProvider {
  name = "gemini";

  /**
   * @param {{ apiKey: string, apiUrl: string, fetchImpl?: Function }} cfg
   */
  constructor(cfg = {}) {
    super();
    this.apiKey = cfg.apiKey;
    this.apiUrl = cfg.apiUrl;
    this.fetch = cfg.fetchImpl || fetch; // injectable for tests
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiUrl);
  }

  async #call(prompt, imageBase64, mimeType, signal) {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...(imageBase64 ? [{ inlineData: { mimeType, data: imageBase64 } }] : []),
          ],
        },
      ],
    };

    let response;
    try {
      response = await this.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
    } catch (err) {
      throw new AIProviderError(`Gemini network error: ${err.message}`, {
        provider: this.name,
        code: err.name === "AbortError" ? "ABORT_ERR" : err.code,
        cause: err,
      });
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      const e = new AIProviderError(`Gemini API ${response.status}: ${errText.slice(0, 200)}`, {
        provider: this.name,
        status: response.status,
      });
      const retryAfter = Number(response.headers?.get?.("retry-after"));
      if (Number.isFinite(retryAfter)) e.retryAfterMs = retryAfter * 1000;
      throw e;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  async analyzeBillboardImage(imageBase64, mimeType, { signal } = {}) {
    const text = await this.#call(GEMINI_PROMPT, imageBase64, mimeType, signal);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new AIProviderError("Gemini returned no parseable JSON", {
        provider: this.name,
        code: "INVALID_JSON",
      });
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      throw new AIProviderError(`Gemini JSON parse failed: ${err.message}`, {
        provider: this.name,
        code: "INVALID_JSON",
        cause: err,
      });
    }
  }

  async chat({ system, messages = [], signal } = {}) {
    const prompt = [system, ...messages.map((m) => m.content)].filter(Boolean).join("\n\n");
    return this.#call(prompt, null, null, signal);
  }
}

export default GeminiProvider;
