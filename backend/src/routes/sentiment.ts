import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import sentimentService from "../services/sentimentService";

const router = Router();

// GET /api/sentiment - Get all sentiment data
router.get("/", (req: Request, res: Response<ApiResponse<any>>) => {
  const sentiments = sentimentService.getAllSentiments();
  res.json({
    success: true,
    data: sentiments,
    timestamp: new Date().toISOString()
  });
});

// GET /api/sentiment/:symbol - Get sentiment for a symbol
router.get("/:symbol", async (req: Request, res: Response<ApiResponse<any>>) => {
  const { symbol } = req.params;
  const sentiment = await sentimentService.getSentiment(symbol);

  if (!sentiment) {
    return res.status(404).json({
      success: false,
      error: `Sentiment data for ${symbol} not found`,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    data: sentiment,
    timestamp: new Date().toISOString()
  });
});

// GET /api/sentiment/:symbol/news - Get news for a symbol
router.get("/:symbol/news", async (req: Request, res: Response<ApiResponse<any>>) => {
  const { symbol } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  const news = await sentimentService.getRecentNews(symbol, limit);

  if (news.length === 0) {
    return res.status(404).json({
      success: false,
      error: `No news found for ${symbol}`,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    data: news,
    timestamp: new Date().toISOString()
  });
});

// GET /api/sentiment/news/all - Get all news
router.get("/news/all", (req: Request, res: Response<ApiResponse<any>>) => {
  const news = sentimentService.getAllNews();
  res.json({
    success: true,
    data: news,
    timestamp: new Date().toISOString()
  });
});

export default router;
