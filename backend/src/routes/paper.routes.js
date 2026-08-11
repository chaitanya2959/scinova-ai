import express from "express";

import upload from "../config/multer.js";
import protect from "../middleware/auth.middleware.js";

import {
  uploadPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
} from "../controllers/paper.controller.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("paper"),
  uploadPaper
);

router.get(
  "/",
  protect,
  getPapers
);

router.get(
  "/:id",
  protect,
  getPaperById
);

router.put(
  "/:id",
  protect,
  updatePaper
);

router.delete(
  "/:id",
  protect,
  deletePaper
);

export default router;