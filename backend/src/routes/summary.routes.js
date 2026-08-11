import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  generateSummary,
  getSummary,
} from "../controllers/summary.controller.js";

const router = express.Router();

router.post(
  "/:paperId/generate",
  protect,
  generateSummary
);

router.get(
  "/:paperId",
  protect,
  getSummary
);

export default router;
