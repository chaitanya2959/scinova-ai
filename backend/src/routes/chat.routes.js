import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  askQuestion,
  getChatHistory,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
  "/:paperId/ask",
  protect,
  askQuestion
);

router.get(
  "/:paperId/history",
  protect,
  getChatHistory
);

export default router;
