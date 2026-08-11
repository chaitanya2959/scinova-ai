import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  comparePapers,
} from "../controllers/comparison.controller.js";


const router = express.Router();


router.post(
  "/",
  protect,
  comparePapers
);


export default router;