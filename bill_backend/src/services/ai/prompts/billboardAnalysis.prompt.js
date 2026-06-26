/**
 * Shared billboard-analysis spec, reused by every provider so the *meaning* of
 * the output is identical regardless of which model produced it.
 */
export const CATEGORIES = [
  "Structural Hazard",
  "Content Violation",
  "Size & Placement",
  "Safety Hazard",
  "Regulatory Compliance",
  "Environmental Impact",
];

export const SYSTEM_INSTRUCTION =
  "You are an AI system specialized in billboard compliance and safety analysis. " +
  "Analyze the provided image of a billboard and return a detailed structured report.";

/** Full prompt for providers that emit JSON inside free text (Gemini). */
export const GEMINI_PROMPT = `${SYSTEM_INSTRUCTION}

RELEVANT CATEGORIES:
- Structural Hazard (Leaning, rusted, broken parts)
- Content Violation (Obscene, illegal products, political without permission)
- Size & Placement (Blocks traffic signs, too close to road)
- Safety Hazard (No lighting, loose wires)
- Regulatory Compliance (Standard billboard)

RESPONSE FORMAT (JSON ONLY):
{
  "text": "Extracted text from the billboard",
  "category": "${CATEGORIES.join(" | ")}",
  "content": {
    "obscene_detected": boolean,
    "political_detected": boolean,
    "content_compliant": boolean
  },
  "structure": {
    "structural_damage": boolean,
    "leaning": boolean,
    "broken_parts": boolean,
    "structural_hazard": boolean
  },
  "placement": {
    "size_appropriate": boolean,
    "obstructs_traffic": boolean,
    "blocks_visibility": boolean,
    "too_close_to_road": boolean
  },
  "summary": "Brief explanation of findings"
}
`;

/** Short instruction for providers that take a separate system prompt + schema (Claude). */
export const CLAUDE_USER_INSTRUCTION =
  "Analyze this billboard image and return the structured compliance report. " +
  "Extract any visible text, classify the violation category, set each boolean flag, " +
  "and write a one-or-two sentence summary of the findings.";

/**
 * JSON Schema for Claude structured outputs (output_config.format).
 * Obeys structured-output limits: additionalProperties:false everywhere, all
 * fields required, no numeric/string length constraints.
 */
export const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    category: { type: "string", enum: CATEGORIES },
    content: {
      type: "object",
      additionalProperties: false,
      properties: {
        obscene_detected: { type: "boolean" },
        political_detected: { type: "boolean" },
        content_compliant: { type: "boolean" },
      },
      required: ["obscene_detected", "political_detected", "content_compliant"],
    },
    structure: {
      type: "object",
      additionalProperties: false,
      properties: {
        structural_damage: { type: "boolean" },
        leaning: { type: "boolean" },
        broken_parts: { type: "boolean" },
        structural_hazard: { type: "boolean" },
      },
      required: ["structural_damage", "leaning", "broken_parts", "structural_hazard"],
    },
    placement: {
      type: "object",
      additionalProperties: false,
      properties: {
        size_appropriate: { type: "boolean" },
        obstructs_traffic: { type: "boolean" },
        blocks_visibility: { type: "boolean" },
        too_close_to_road: { type: "boolean" },
      },
      required: ["size_appropriate", "obstructs_traffic", "blocks_visibility", "too_close_to_road"],
    },
    summary: { type: "string" },
  },
  required: ["text", "category", "content", "structure", "placement", "summary"],
};
