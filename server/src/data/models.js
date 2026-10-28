// DEMO ONLY: these values are illustrative placeholders, NOT verified model measurements.
// Replace with sourced, versioned values before making real-world comparisons.
export const models = [
  {
    id: "demo-efficient",
    name: "Efficient model (demo)",
    description: "Illustrative low-energy scenario",
    inputKwhPer1kTokens: 0.00008,
    outputKwhPer1kTokens: 0.00024,
    sourceLabel: "Illustrative demo assumption",
    confidence: "low",
    note: "Not a provider measurement. Use only to test the calculator workflow."
  },
  {
    id: "demo-balanced",
    name: "Balanced model (demo)",
    description: "Illustrative middle scenario",
    inputKwhPer1kTokens: 0.00016,
    outputKwhPer1kTokens: 0.00048,
    sourceLabel: "Illustrative demo assumption",
    confidence: "low",
    note: "Not a provider measurement. Use only to test the calculator workflow."
  },
  {
    id: "demo-intensive",
    name: "Intensive model (demo)",
    description: "Illustrative high-energy scenario",
    inputKwhPer1kTokens: 0.00032,
    outputKwhPer1kTokens: 0.00096,
    sourceLabel: "Illustrative demo assumption",
    confidence: "low",
    note: "Not a provider measurement. Use only to test the calculator workflow."
  }
];
export const defaults = {
  gridCarbonIntensity: 400,
  waterIntensity: 1.2,
  waterBoundary: "Illustrative litres per kWh; boundary unspecified in demo"
};
