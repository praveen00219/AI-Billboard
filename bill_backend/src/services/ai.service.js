import fetch from "node-fetch";
import config from "../config/app.config.js";

const API_URL = config.ai.apiUrl;
const API_KEY = config.ai.apiKey;

/* =========================
   UTIL: Sleep for retry
========================= */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/* =========================
   GEMINI CALL (ROBUST)
   - retry handling
   - 429 backoff
========================= */
async function callGeminiAPI(prompt, imageBase64 = null, mimeType = "image/png", retries = 4) {
    if (!API_KEY) throw new Error("AI API key is not configured");
    if (!API_URL) throw new Error("AI API URL is not configured");

    const url = `${API_URL}?key=${API_KEY}`;

    const body = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    ...(imageBase64
                        ? [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: imageBase64,
                                },
                            },
                        ]
                        : []),
                ],
            },
        ],
    };

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                return (
                    data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                );
            }

            const errText = await response.text();

            // Rate limit handling
            if (response.status === 429) {
                const wait = Math.pow(2, attempt) * 1000;
                console.warn(`⚠️ Rate limited. retrying in ${wait}ms`);
                await sleep(wait);
                continue;
            }

            throw new Error(`Gemini API Error ${response.status}: ${errText}`);
        } catch (err) {
            if (attempt === retries - 1) throw err;
            await sleep(1000 * (attempt + 1));
        }
    }

    throw new Error("Gemini API failed after retries");
}

/* =========================
   SINGLE AI ANALYSIS (ALL-IN-ONE)
========================= */
async function analyzeImage(imageBase64, mimeType) {
    const prompt = `You are an AI system specialized in billboard compliance and safety analysis.
Analyze the provided image of a billboard and return a detailed report in JSON format.

RELEVANT CATEGORIES:
- Structural Hazard (Leaning, rusted, broken parts)
- Content Violation (Obscene, illegal products, political without permission)
- Size & Placement (Blocks traffic signs, too close to road)
- Safety Hazard (No lighting, loose wires)
- Regulatory Compliance (Standard billboard)

RESPONSE FORMAT (JSON ONLY):
{
  "text": "Extracted text from the billboard",
  "category": "Structural Hazard | Content Violation | Size & Placement | Safety Hazard | Regulatory Compliance | Environmental Impact",
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

    const response = await callGeminiAPI(prompt, imageBase64, mimeType);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini: " + response);
    }

    return JSON.parse(jsonMatch[0]);
}

/* =========================
   RISK ENGINE (NO AI CALL)
========================= */
function calculateRisk(data) {
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

/* =========================
   MAIN FUNCTION
========================= */
export async function analyzeBillboard(
    imageBase64,
    mimeType,
    description,
    latitude,
    longitude
) {
    try {
        const aiResult = await analyzeImage(imageBase64, mimeType);

        const risk = calculateRisk(aiResult);

        return {
            extractedText: aiResult.text || "",
            category: aiResult.category || "Safety Hazard",
            contentAnalysis: aiResult.content,
            structuralAnalysis: aiResult.structure,
            sizeAnalysis: aiResult.placement,
            riskPercentage: risk.riskPercentage,
            riskLevel: risk.riskLevel,
            riskReason: aiResult.summary || risk.reason,
        };
    } catch (err) {
        console.error("🚨 Billboard Analysis Error:", err.message);

        return {
            extractedText: "",
            category: "Safety Hazard",
            contentAnalysis: {},
            structuralAnalysis: {},
            sizeAnalysis: {},
            riskPercentage: 25,
            riskLevel: "Medium",
            riskReason: `Fallback due to error: ${err.message}`,
        };
    }
}

export default { analyzeBillboard };