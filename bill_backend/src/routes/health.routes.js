import express from "express";
import { getAiHealth } from "../services/ai.service.js";

const router = express.Router();

// AI provider health / observability (provider config, breaker states, metrics)
router.get("/ai", (req, res) => {
  res.status(200).json({ status: true, ai: getAiHealth() });
});

export default router;
