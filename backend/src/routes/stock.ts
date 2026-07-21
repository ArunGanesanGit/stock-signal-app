import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import stockService from "../services/stockService";

const router = Router();

// GET /api/stocks - Get all stocks with real-time data
router.get("/", async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const stocks = await stockService.getAllStocks();

    // Fetch real-time prices for each stock
    const stocksWithRealData = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const realData = await stockService.getStockBySymbol(stock.symbol);
          return realData || stock;
        } catch (error) {
          // If API fails, return mock data
          return stock;
        }
      })
    );

    res.json({
      success: true,
      data: stocksWithRealData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error.message === "RATE_LIMIT_EXCEEDED") {
      return res.status(429).json({
        success: false,
        error: "AlphaVantage API Rate Limit Exceeded",
        details: "Stock data API has reached rate limit. Please try again in a few minutes.",
        provider: "AlphaVantage",
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch stocks",
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/stocks/:symbol - Get stock by symbol
router.get("/:symbol", async (req: Request, res: Response<ApiResponse<any>>) => {
  const { symbol } = req.params;

  try {
    const stock = await stockService.getStockBySymbol(symbol);

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: `Stock with symbol ${symbol} not found`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: stock,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error.message === "RATE_LIMIT_EXCEEDED") {
      return res.status(429).json({
        success: false,
        error: "AlphaVantage API Rate Limit Exceeded",
        details: "You've reached the maximum API calls for AlphaVantage (5 calls/min, 100/day). Please try again in a few minutes.",
        provider: "AlphaVantage",
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

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch stock data",
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/stocks/search?q=query - Search stocks
router.get("/search", (req: Request, res: Response<ApiResponse<any>>) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({
      success: false,
      error: "Query parameter 'q' is required",
      timestamp: new Date().toISOString()
    });
  }

  const results = stockService.searchStocks(q);
  res.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  });
});

export default router;
