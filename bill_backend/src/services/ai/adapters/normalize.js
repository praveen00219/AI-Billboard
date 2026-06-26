import { CATEGORIES } from "../prompts/billboardAnalysis.prompt.js";

const bool = (v) => v === true;

/**
 * Convert a provider's raw analysis JSON into the single normalized shape the
 * rest of the app expects. Every field is defaulted so downstream code (risk
 * engine, controller) never sees undefined regardless of which model answered.
 *
 * Normalized shape: { text, category, content{...}, structure{...}, placement{...}, summary }
 */
export function normalizeAnalysis(raw, providerName = "unknown") {
  if (!raw || typeof raw !== "object") {
    const err = new Error(`Empty/invalid analysis from ${providerName}`);
    err.code = "EMPTY_RESPONSE";
    throw err;
  }

  const category = CATEGORIES.includes(raw.category) ? raw.category : "Safety Hazard";
  const c = raw.content || {};
  const s = raw.structure || {};
  const p = raw.placement || {};

  return {
    text: typeof raw.text === "string" ? raw.text : "",
    category,
    content: {
      obscene_detected: bool(c.obscene_detected),
      political_detected: bool(c.political_detected),
      // default compliant=true so a missing flag doesn't inflate risk
      content_compliant: c.content_compliant === undefined ? true : bool(c.content_compliant),
    },
    structure: {
      structural_damage: bool(s.structural_damage),
      leaning: bool(s.leaning),
      broken_parts: bool(s.broken_parts),
      structural_hazard: bool(s.structural_hazard),
    },
    placement: {
      size_appropriate: p.size_appropriate === undefined ? true : bool(p.size_appropriate),
      obstructs_traffic: bool(p.obstructs_traffic),
      blocks_visibility: bool(p.blocks_visibility),
      too_close_to_road: bool(p.too_close_to_road),
    },
    summary: typeof raw.summary === "string" ? raw.summary : "",
  };
}

export default { normalizeAnalysis };
