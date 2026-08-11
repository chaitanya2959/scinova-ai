import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  generateResearchGap,
} from "../controllers/gap.controller.js";


const router = express.Router();


router.post(
  "/:paperId/analyze",
  protect,
  generateResearchGap
);


export default router;