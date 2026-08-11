import express from "express";

const router = express.Router();

router.post("/gap-analysis");
router.post("/compare-papers");
router.post("/generate-ideas");

export default router;