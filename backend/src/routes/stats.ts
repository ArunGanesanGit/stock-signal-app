import { Router, Request, Response } from "express";
import { ApiResponse } from "@stock-signal/shared";
import signalService from "../services/signalService";
import sentimentService from "../services/sentimentService";

const router = Router();

interface LiveStats {
  trackedStocks: number;
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  avgConfidence: number;
}

interface StockActivity {
  symbol: string;
  newsCount: number;
}

// Popular stocks to check for news activity
const popularStocks = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "AMD",
  "NFLX", "INTC", "CRM", "ADBE", "PYPL", "SPOT", "UBER",
  "LYFT", "SNAP", "ROKU", "TWLO", "SQ"
];

router.get("/", async (req: Request, res: Response<ApiResponse<LiveStats>>) => {
  try {
    // Get news activity for popular stocks
    const stockActivity: StockActivity[] = [];

    for (const stock of popularStocks) {
      try {
        const sentiment = await sentimentService.getSentiment(stock);
        if (sentiment) {
          stockActivity.push({
            symbol: stock,
            newsCount: sentiment.newsCount
          });
        }
      } catch (error) {
        // Skip stocks that fail
        continue;
      }
    }

    // Sort by news count and get top 10 trending stocks
    const trendingStocks = stockActivity
      .sort((a, b) => b.newsCount - a.newsCount)
      .slice(0, 10)
      .map(s => s.symbol);

    // If no trending stocks found, use popular stocks
    const trackedStocks = trendingStocks.length > 0 ? trendingStocks : popularStocks.slice(0, 5);

    let buyCount = 0;
    let sellCount = 0;
    let holdCount = 0;
    let totalConfidence = 0;
    let successfulSignals = 0;

    // Generate signals for trending stocks
    for (const stock of trackedStocks) {
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
      trackedStocks: trackedStocks.length,
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
