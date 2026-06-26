/**
 * Deterministic risk engine — provider-agnostic, no LLM. Moved verbatim from the
 * original ai.service so its behavior is unchanged. Operates on the *normalized*
 * analysis shape ({ content, structure, placement, summary }).
 */
export function calculateRisk(data) {
  let risk = 0;

  // Content risks
  if (data.content?.obscene_detected) risk += 25;
  if (data.content?.political_detected) risk += 10;
  if (!data.content?.content_compliant) risk += 15;

  // Structure risks
  if (data.structure?.structural_hazard) risk += 35;
  if (data.structure?.leaning) risk += 20;
  if (data.structure?.broken_parts) risk += 20;

  // Placement risks
  if (data.placement?.obstructs_traffic) risk += 25;
  if (data.placement?.too_close_to_road) risk += 20;
  if (!data.placement?.size_appropriate) risk += 10;

  risk = Math.min(100, risk);

  let level = "Low";
  if (risk >= 70) level = "High";
  else if (risk >= 40) level = "Medium";

  return {
    riskPercentage: risk,
    riskLevel: level,
    reason: data.summary || "Calculated from AI structural + content + placement analysis",
  };
}

export default { calculateRisk };
