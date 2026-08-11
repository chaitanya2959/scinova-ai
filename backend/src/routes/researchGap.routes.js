import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  generateResearchGap,
  getResearchGap,
} from "../controllers/researchGap.controller.js";

const router = express.Router();

router.post(
  "/:paperId/generate",
  protect,
  generateResearchGap
);

router.get(
  "/:paperId",
  protect,
  getResearchGap
);

export default router;
