import express from "express";
import { createSupportTicket } from "../controllers/support.controller.js";
import protect from "../middleware/auth.middleware.js";
import { createSupportTicketValidator } from "../validators/support.validator.js";

const router = express.Router();

// POST /api/support
router.post("/", protect, createSupportTicketValidator, createSupportTicket);

export default router;