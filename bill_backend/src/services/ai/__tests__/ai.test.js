import test from "node:test";
import assert from "node:assert/strict";

import { classifyError, AIProviderError } from "../utils/errors.js";
import { normalizeAnalysis } from "../adapters/normalize.js";
import { CircuitBreaker } from "../fallback/circuitBreaker.js";
import { withRetry } from "../utils/retry.js";
import { FallbackRunner } from "../fallback/FallbackRunner.js";
import { calculateRisk } from "../utils/risk.js";

/* ── Fake provider for runner tests (unique name per test avoids shared breaker state) ── */
class FakeProvider {
  constructor(name, { configured = true, script = [] } = {}) {
    this.name = name;
    this._configured = configured;
    this._script = script; // array of () => result | throws
    this.calls = 0;
    this.lastUsage = { tokensIn: 1, tokensOut: 1 };
  }
  isConfigured() { return this._configured; }
  async analyzeBillboardImage() {
    const step = this._script[Math.min(this.calls, this._script.length - 1)];
    this.calls += 1;
    return step();
  }
}

const RAW = {
  text: "SALE", category: "Safety Hazard",
  content: { obscene_detected: false, political_detected: false, content_compliant: true },
  structure: { structural_damage: false, leaning: false, broken_parts: false, structural_hazard: false },
  placement: { size_appropriate: true, obstructs_traffic: false, blocks_visibility: false, too_close_to_road: false },
  summary: "Looks fine",
};

const baseConfig = {
  fallbackEnabled: true,
  maxRetries: 1,
  timeoutMs: 2000,
  breaker: { failureThreshold: 4, cooldownMs: 50 },
};

/* ── errors classifier ───────────────────────────────────────── */
test("classifyError: 429 is retryable, 401 is not, network code is retryable", () => {
  assert.equal(classifyError({ status: 429 }).retryable, true);
  assert.equal(classifyError({ status: 503 }).retryable, true);
  assert.equal(classifyError({ status: 401 }).retryable, false);
  assert.equal(classifyError({ status: 400 }).retryable, false);
  assert.equal(classifyError({ code: "ECONNRESET" }).retryable, true);
  assert.equal(classifyError(new AIProviderError("x", { code: "INVALID_JSON" })).retryable, true);
});

/* ── normalizer ──────────────────────────────────────────────── */
test("normalizeAnalysis: defaults fields and coerces invalid category", () => {
  const n = normalizeAnalysis({ category: "Nonsense", content: { obscene_detected: true } }, "gemini");
  assert.equal(n.category, "Safety Hazard");
  assert.equal(n.content.obscene_detected, true);
  assert.equal(n.content.content_compliant, true); // defaulted
  assert.equal(n.placement.size_appropriate, true); // defaulted
  assert.equal(typeof n.text, "string");
});
test("normalizeAnalysis: throws on empty input", () => {
  assert.throws(() => normalizeAnalysis(null, "claude"), /Empty\/invalid/);
});

/* ── risk engine ─────────────────────────────────────────────── */
test("calculateRisk: high-risk structural hazard", () => {
  const r = calculateRisk({ structure: { structural_hazard: true, leaning: true }, content: {}, placement: { size_appropriate: true } });
  assert.equal(r.riskLevel, "High");
  assert.ok(r.riskPercentage >= 70);
});

/* ── circuit breaker ─────────────────────────────────────────── */
test("CircuitBreaker: opens after threshold, blocks, then half-opens after cooldown", () => {
  const cb = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 100 });
  assert.equal(cb.canRequest(0), true);
  cb.recordFailure(0);
  cb.recordFailure(0);
  assert.equal(cb.state, "OPEN");
  assert.equal(cb.canRequest(50), false); // still in cooldown
  assert.equal(cb.canRequest(150), true); // cooldown elapsed -> HALF_OPEN
  assert.equal(cb.state, "HALF_OPEN");
  cb.recordSuccess();
  assert.equal(cb.state, "CLOSED");
});

/* ── retry ───────────────────────────────────────────────────── */
test("withRetry: retries a transient failure then succeeds", async () => {
  let n = 0;
  const { result, attempts } = await withRetry(async () => {
    n += 1;
    if (n < 2) { const e = new Error("boom"); e.status = 503; throw e; }
    return "ok";
  }, { maxRetries: 3, timeoutMs: 1000, baseDelayMs: 1 });
  assert.equal(result, "ok");
  assert.equal(attempts, 2);
});
test("withRetry: does NOT retry a non-retryable error", async () => {
  let n = 0;
  await assert.rejects(
    withRetry(async () => { n += 1; const e = new Error("bad"); e.status = 400; throw e; },
      { maxRetries: 3, timeoutMs: 1000, baseDelayMs: 1 }),
    /bad/
  );
  assert.equal(n, 1);
});

/* ── FallbackRunner: the core failover matrix ────────────────── */
test("runner: primary success → uses primary", async () => {
  const p1 = new FakeProvider("ga", { script: [() => RAW] });
  const p2 = new FakeProvider("ca", { script: [() => RAW] });
  const runner = new FallbackRunner({ providers: [p1, p2], config: { ...baseConfig, priority: ["ga", "ca"] } });
  const out = await runner.analyze({ imageBase64: "x", mimeType: "image/png" });
  assert.equal(out.providerUsed, "ga");
  assert.equal(out.fallbackOccurred, false);
  assert.equal(p2.calls, 0);
});

test("runner: primary fails → falls through to fallback", async () => {
  const p1 = new FakeProvider("gb", { script: [() => { const e = new Error("429"); e.status = 429; throw e; }] });
  const p2 = new FakeProvider("cb", { script: [() => RAW] });
  const runner = new FallbackRunner({ providers: [p1, p2], config: { ...baseConfig, priority: ["gb", "cb"] } });
  const out = await runner.analyze({ imageBase64: "x", mimeType: "image/png" });
  assert.equal(out.providerUsed, "cb");
  assert.equal(out.fallbackOccurred, true);
  assert.ok(p1.calls >= 1 && p2.calls === 1);
});

test("runner: all providers fail → throws ALL_PROVIDERS_FAILED", async () => {
  const boom = () => { const e = new Error("down"); e.status = 500; throw e; };
  const p1 = new FakeProvider("gc", { script: [boom] });
  const p2 = new FakeProvider("cc", { script: [boom] });
  const runner = new FallbackRunner({ providers: [p1, p2], config: { ...baseConfig, priority: ["gc", "cc"] } });
  await assert.rejects(runner.analyze({ imageBase64: "x", mimeType: "image/png" }), /All AI providers failed/);
});

test("runner: unconfigured fallback is skipped (Gemini-only)", async () => {
  const p1 = new FakeProvider("gd", { script: [() => RAW] });
  const p2 = new FakeProvider("cd", { configured: false, script: [() => RAW] });
  const runner = new FallbackRunner({ providers: [p1, p2], config: { ...baseConfig, priority: ["gd", "cd"] } });
  const out = await runner.analyze({ imageBase64: "x", mimeType: "image/png" });
  assert.equal(out.providerUsed, "gd");
  assert.equal(p2.calls, 0);
});

test("runner: no eligible provider → throws NO_PROVIDER", async () => {
  const p1 = new FakeProvider("ge", { configured: false });
  const runner = new FallbackRunner({ providers: [p1], config: { ...baseConfig, priority: ["ge"] } });
  await assert.rejects(runner.analyze({ imageBase64: "x", mimeType: "image/png" }), /No AI provider/);
});
