import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import stockService from "../services/stockService";

const router = Router();

// GET /api/stocks - Get all stocks
router.get("/", async (req: Request, res: Response<ApiResponse<any>>) => {
  const stocks = await stockService.getAllStocks();
  res.json({
    success: true,
    data: stocks,
    timestamp: new Date().toISOString()
  });
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
        error: "API Rate Limit Exceeded",
        details: "You've reached the maximum API calls. Please try again in a few minutes.",
        timestamp: new Date().toISOString()
      });
    }
    throw error;
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
