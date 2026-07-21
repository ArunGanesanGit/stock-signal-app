import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import signalService from "../services/signalService";

const router = Router();

interface LiveStats {
  trackedStocks: number;
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  avgConfidence: number;
}

router.get("/", async (req: Request, res: Response<ApiResponse<LiveStats>>) => {
  try {
    const stocks = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];
    
    let buyCount = 0;
    let sellCount = 0;
    let holdCount = 0;
    let totalConfidence = 0;
    let successfulSignals = 0;

    // Generate signals for each stock
    for (const stock of stocks) {
      try {
        const signal = await signalService.getSignalByTicker(stock);
        if (signal) {
          if (signal.signal === "buy") buyCount++;
          else if (signal.signal === "sell") sellCount++;
          else if (signal.signal === "hold") holdCount++;
          
          totalConfidence += signal.confidence;
          successfulSignals++;
        }
      } catch (error) {
        // Skip this stock if signal generation fails
        continue;
      }
    }

    const stats: LiveStats = {
      trackedStocks: stocks.length,
      buySignals: buyCount,
      sellSignals: sellCount,
      holdSignals: holdCount,
      avgConfidence: successfulSignals > 0 ? (totalConfidence / successfulSignals) * 100 : 0
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to calculate stats",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
