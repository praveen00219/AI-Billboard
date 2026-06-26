import Anthropic from "@anthropic-ai/sdk";
import { AIProvider } from "../../interfaces/AIProvider.js";
import { AIProviderError } from "../../utils/errors.js";
import {
  SYSTEM_INSTRUCTION,
  CLAUDE_USER_INSTRUCTION,
  ANALYSIS_JSON_SCHEMA,
} from "../../prompts/billboardAnalysis.prompt.js";

// Claude vision accepts these media types only.
const SUPPORTED_MEDIA = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
function normalizeMedia(mimeType) {
  if (mimeType === "image/jpg") return "image/jpeg";
  return mimeType;
}

/**
 * ClaudeProvider — Anthropic Claude (Sonnet 4.6 by default) via the official SDK.
 * Uses base64 vision + structured outputs (output_config.format) so the JSON is
 * guaranteed valid (no regex parsing). Key-agnostic: isConfigured() is false when
 * ANTHROPIC_API_KEY is absent, so the orchestrator simply skips it.
 */
export class ClaudeProvider extends AIProvider {
  name = "claude";

  /**
   * @param {{ apiKey: string, model: string, client?: object }} cfg
   */
  constructor(cfg = {}) {
    super();
    this.apiKey = cfg.apiKey;
    this.model = cfg.model || "claude-sonnet-4-6";
    // Injectable for tests; otherwise lazily built only when a key exists.
    this._client = cfg.client || null;
    this.lastUsage = { tokensIn: 0, tokensOut: 0 };
  }

  isConfigured() {
    return Boolean(this.apiKey) || Boolean(this._client);
  }

  #client() {
    if (!this._client) {
      // maxRetries:1 — the orchestrator owns retry/backoff; don't multiply.
      this._client = new Anthropic({ apiKey: this.apiKey, maxRetries: 1 });
    }
    return this._client;
  }

  async analyzeBillboardImage(imageBase64, mimeType, { signal } = {}) {
    const media = normalizeMedia(mimeType);
    if (!SUPPORTED_MEDIA.has(media)) {
      throw new AIProviderError(`Claude: unsupported image type ${mimeType}`, {
        provider: this.name,
        status: 400,
        code: "UNSUPPORTED_MEDIA",
      });
    }

    let response;
    try {
      response = await this.#client().messages.create(
        {
          model: this.model,
          max_tokens: 1024,
          thinking: { type: "disabled" },
          output_config: {
            effort: "low",
            format: { type: "json_schema", schema: ANALYSIS_JSON_SCHEMA },
          },
          system: SYSTEM_INSTRUCTION,
          messages: [
            {
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: media, data: imageBase64 } },
                { type: "text", text: CLAUDE_USER_INSTRUCTION },
              ],
            },
          ],
        },
        { signal }
      );
    } catch (err) {
      // Re-wrap so the classifier sees provider + status. SDK errors already
      // carry .status / .name (RateLimitError, APIConnectionError, ...).
      err.provider = this.name;
      throw err;
    }

    this.lastUsage = {
      tokensIn: response?.usage?.input_tokens || 0,
      tokensOut: response?.usage?.output_tokens || 0,
    };

    if (response?.stop_reason === "refusal") {
      throw new AIProviderError("Claude declined the request (refusal)", {
        provider: this.name,
        code: "REFUSAL",
      });
    }

    const textBlock = (response?.content || []).find((b) => b.type === "text");
    if (!textBlock?.text) {
      throw new AIProviderError("Claude returned no text content", {
        provider: this.name,
        code: "EMPTY_RESPONSE",
      });
    }
    try {
      return JSON.parse(textBlock.text);
    } catch (err) {
      throw new AIProviderError(`Claude JSON parse failed: ${err.message}`, {
        provider: this.name,
        code: "INVALID_JSON",
        cause: err,
      });
    }
  }

  async chat({ system, messages = [], maxTokens = 1024, signal } = {}) {
    const response = await this.#client().messages.create(
      {
        model: this.model,
        max_tokens: maxTokens,
        thinking: { type: "disabled" },
        system,
        messages: messages.map((m) => ({ role: m.role || "user", content: m.content })),
      },
      { signal }
    );
    this.lastUsage = {
      tokensIn: response?.usage?.input_tokens || 0,
      tokensOut: response?.usage?.output_tokens || 0,
    };
    return (response?.content || []).find((b) => b.type === "text")?.text || "";
  }
}

export default ClaudeProvider;
