import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import technicalService from "../services/technicalService";

const router = Router();

// GET /api/technical - Get all technical indicators
router.get("/", (req: Request, res: Response<ApiResponse<any>>) => {
  const indicators = technicalService.getAllIndicators();
  res.json({
    success: true,
    data: indicators,
    timestamp: new Date().toISOString()
  });
});

// GET /api/technical/:symbol - Get technical indicators for a symbol
router.get("/:symbol", (req: Request, res: Response<ApiResponse<any>>) => {
  const { symbol } = req.params;
  const indicators = technicalService.getIndicators(symbol);

  if (!indicators) {
    return res.status(404).json({
      success: false,
      error: `Technical indicators for ${symbol} not found`,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    data: indicators,
    timestamp: new Date().toISOString()
  });
});

export default router;
