import express from "express";

const router = express.Router();

router.get("/users");
router.get("/papers");
router.delete("/user/:id");
router.delete("/paper/:id");

export default router;