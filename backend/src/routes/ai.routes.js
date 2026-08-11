import express from "express";

const router = express.Router();

router.post("/chat");
router.post("/embedding");
router.post("/search");
router.post("/summarize");

export default router;