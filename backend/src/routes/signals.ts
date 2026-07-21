import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import signalService from "../services/signalService";

const router = Router();

// Special routes MUST come before :ticker to avoid conflicts
// GET /api/signals/active - Get active signals
router.get("/active", (req: Request, res: Response<ApiResponse<any>>) => {
  const signals = signalService.getActiveSignals();
  res.json({
    success: true,
    data: signals,
    timestamp: new Date().toISOString()
  });
});

// GET /api/signals/buy - Get all buy signals
router.get("/buy", (req: Request, res: Response<ApiResponse<any>>) => {
  const signals = signalService.getBuySignals();
  res.json({
    success: true,
    data: signals,
    timestamp: new Date().toISOString()
  });
});

// GET /api/signals/sell - Get all sell signals
router.get("/sell", (req: Request, res: Response<ApiResponse<any>>) => {
  const signals = signalService.getSellSignals();
  res.json({
    success: true,
    data: signals,
    timestamp: new Date().toISOString()
  });
});

// GET /api/signals/high-confidence - Get high confidence signals
router.get("/high-confidence", (req: Request, res: Response<ApiResponse<any>>) => {
  const minConfidence = parseFloat(req.query.confidence as string) || 0.7;
  const signals = signalService.getHighConfidenceSignals(minConfidence);

  res.json({
    success: true,
    data: signals,
    timestamp: new Date().toISOString()
  });
});

// GET /api/signals/:ticker - Get detailed signal for a ticker
// IMPORTANT: This must come AFTER the special routes
router.get("/:ticker", async (req: Request, res: Response<ApiResponse<any>>) => {
  const { ticker } = req.params;
  const upperTicker = ticker.toUpperCase();

  try {
    const signal = await signalService.getSignalByTicker(upperTicker);

    if (!signal) {
      return res.status(404).json({
        success: false,
        error: `No signal data available for ${ticker}. Try: AAPL, MSFT, GOOGL, TSLA, AMZN`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: signal,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    // Handle specific API errors
    if (error.message === "RATE_LIMIT_EXCEEDED") {
      return res.status(429).json({
        success: false,
        error: "AlphaVantage API Rate Limit Exceeded",
        details: "Too many requests to stock price API. Please try again in a few minutes.",
        provider: "AlphaVantage",
        timestamp: new Date().toISOString()
      });
    }

    if (error.message === "NEWSAPI_RATE_LIMIT_EXCEEDED") {
      return res.status(429).json({
        success: false,
        error: "NewsAPI Rate Limit Exceeded",
        details: "Too many requests to news sentiment API. Please try again later.",
        provider: "NewsAPI",
        timestamp: new Date().toISOString()
      });
    }

    if (error.message === "API_KEY_NOT_SET") {
      return res.status(500).json({
        success: false,
        error: "AlphaVantage API Key Not Configured",
        details: "Stock price API key is not set on the server.",
        provider: "AlphaVantage",
        timestamp: new Date().toISOString()
      });
    }

    if (error.message === "NEWS_API_KEY_NOT_SET") {
      return res.status(500).json({
        success: false,
        error: "NewsAPI Key Not Configured",
        details: "News sentiment API key is not set on the server.",
        provider: "NewsAPI",
        timestamp: new Date().toISOString()
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate signal",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
