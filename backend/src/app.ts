import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import stockRoutes from "./routes/stock";
import technicalRoutes from "./routes/technical";
import sentimentRoutes from "./routes/sentiment";
import sentimentSourcesRoutes from "./routes/sentiment-sources";
import signalRoutes from "./routes/signals";
import statsRoutes from "./routes/stats";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: false
}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/stocks", stockRoutes);
app.use("/api/technical", technicalRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.use("/api/sentiment-sources", sentimentSourcesRoutes);
app.use("/api/signals", signalRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString()
  });
});

export default app;
