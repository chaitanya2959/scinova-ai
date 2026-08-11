import express from "express";

import authRoutes from "./auth.routes.js";
import paperRoutes from "./paper.routes.js";
import summaryRoutes from "./summary.routes.js";
import gapRoutes from "./gap.routes.js";
import comparisonRoutes from "./comparison.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/papers", paperRoutes);
router.use("/summary", summaryRoutes);
router.use(
  "/gap",
  gapRoutes
);
router.use(
  "/compare",
  comparisonRoutes
);
router.use("/users", userRoutes);

export default router;
