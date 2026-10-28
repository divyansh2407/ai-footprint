import { Router } from "express";
import { models, defaults } from "../data/models.js";
import { calculateFootprint } from "../services/calculator.js";
import { getHistory, saveHistory, clearHistory } from "../storage.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", service: "ai-footprint-api", timestamp: new Date().toISOString() }));
router.get("/models", (_req, res) => res.json({
  models,
  defaults,
  dataNotice: "All bundled energy factors are illustrative demo assumptions, not verified provider measurements."
}));
router.post("/calculate", async (req, res, next) => {
  try {
    const result = calculateFootprint(req.body ?? {});
    await saveHistory(result);
    res.json(result);
  } catch (error) { next(error); }
});
router.get("/history", async (_req, res, next) => {
  try { res.json({ history: await getHistory() }); }
  catch (error) { next(error); }
});
router.delete("/history", async (_req, res, next) => {
  try { await clearHistory(); res.json({ cleared: true }); }
  catch (error) { next(error); }
});
router.post("/simulator", (req, res, next) => {
  try {
    const users = Number(req.body.users);
    const requestsPerUser = Number(req.body.requestsPerUser);
    const inputTokens = Number(req.body.inputTokens);
    const outputTokens = Number(req.body.outputTokens);
    const modelId = req.body.modelId;
    const result = calculateFootprint({ modelId, inputTokens, outputTokens, requests: users * requestsPerUser,
      gridCarbonIntensity: req.body.gridCarbonIntensity, waterIntensity: req.body.waterIntensity });
    res.json({ assumptions: { users, requestsPerUser, totalRequests: users * requestsPerUser }, ...result });
  } catch (error) { next(error); }
});
export default router;
