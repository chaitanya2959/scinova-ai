import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
import summaryRoutes from "./routes/summary.routes.js";
import researchGapRoutes from "./routes/researchGap.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import comparisonRoutes from "./routes/comparison.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import supportRoutes from "./routes/support.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.use(
  "/api/summaries",
  summaryRoutes
);

app.use(
  "/api/research-gaps",
  researchGapRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/comparisons",
  comparisonRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/support",
  supportRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 SciNova AI Backend Running",
  });
});

// Error Middleware
app.use(errorHandler);

export default app;