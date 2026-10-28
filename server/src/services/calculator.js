import { models, defaults } from "../data/models.js";

const finiteNonNegative = (value, name, max) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) {
    const err = new Error(`${name} must be between 0 and ${max}.`);
    err.status = 400;
    throw err;
  }
  return n;
};

export function calculateFootprint(payload) {
  const model = models.find(m => m.id === payload.modelId);
  if (!model) {
    const err = new Error("Choose a valid model scenario.");
    err.status = 400;
    throw err;
  }
  const inputTokens = finiteNonNegative(payload.inputTokens, "Input tokens", 1_000_000_000);
  const outputTokens = finiteNonNegative(payload.outputTokens, "Output tokens", 1_000_000_000);
  const requests = finiteNonNegative(payload.requests, "Requests", 1_000_000_000);
  if (requests < 1) {
    const err = new Error("Requests must be at least 1.");
    err.status = 400;
    throw err;
  }
  const gridCarbonIntensity = finiteNonNegative(
    payload.gridCarbonIntensity ?? defaults.gridCarbonIntensity, "Grid carbon intensity", 5000
  );
  const waterIntensity = finiteNonNegative(
    payload.waterIntensity ?? defaults.waterIntensity, "Water intensity", 1000
  );

  const inputKwh = (inputTokens / 1000) * model.inputKwhPer1kTokens * requests;
  const outputKwh = (outputTokens / 1000) * model.outputKwhPer1kTokens * requests;
  const electricityKwh = inputKwh + outputKwh;
  const carbonGrams = electricityKwh * gridCarbonIntensity;
  const waterLitres = electricityKwh * waterIntensity;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    inputs: { modelId: model.id, inputTokens, outputTokens, requests, gridCarbonIntensity, waterIntensity },
    model: { id: model.id, name: model.name, sourceLabel: model.sourceLabel, confidence: model.confidence },
    results: {
      inputElectricityKwh: inputKwh,
      outputElectricityKwh: outputKwh,
      electricityKwh,
      electricityWh: electricityKwh * 1000,
      carbonGrams,
      carbonKg: carbonGrams / 1000,
      waterLitres
    },
    methodology: {
      energyFormula: "(input tokens / 1,000 × input kWh factor + output tokens / 1,000 × output kWh factor) × requests",
      carbonFormula: "electricity (kWh) × grid carbon intensity (gCO₂e/kWh)",
      waterFormula: "electricity (kWh) × water intensity (L/kWh)",
      gridCarbonIntensity,
      waterIntensity,
      waterBoundary: defaults.waterBoundary,
      disclaimer: "All included energy factors are illustrative demo assumptions, not verified provider measurements. Actual impact depends on model, hardware, batching, utilisation, facility overhead and measurement boundary."
    }
  };
}
