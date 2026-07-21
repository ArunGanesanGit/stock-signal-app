import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import multiSourceSentimentService from "../services/multiSourceSentimentService";

const router = Router();

// GET /api/sentiment-sources/:symbol - Get sentiment from all sources
router.get(
  "/:symbol",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    const { symbol } = req.params;

    try {
      const sentiment = await multiSourceSentimentService.getSentimentFromMultipleSources(
        symbol.toUpperCase()
      );

      res.json({
        success: true,
        data: sentiment,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch multi-source sentiment",
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;
