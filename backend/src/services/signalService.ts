import { TradingSignal } from "@stock-signal/shared";
import signalsData from "../data/signals.json";
import technicalService from "./technicalService";
import sentimentService from "./sentimentService";
import stockService from "./stockService";
import { interpretRSI, calculatePriceAction, calculateMomentumDirection } from "../utils/calculations";

export interface NewsArticleItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface SignalBreakdown {
  signal: "buy" | "sell" | "hold";
  confidence: number;
  breakdown: {
    technical: {
      score: number;
      rsi: { value: number; interpretation: string };
      sma: { interpretation: string };
      momentum: { value: number; direction: string };
      summary: string;
    };
    sentiment: {
      score: number;
      summary: string;
      newsCount: number;
      positiveRatio: number;
      recentArticles: NewsArticleItem[];
    };
    combined: {
      reasons: string[];
      priceTargets: {
        entry: number;
        target: number;
        stopLoss: number;
      } | null;
    };
  };
}

class SignalService {
  getSignal(id: string): TradingSignal | null {
    return (signalsData.find(s => s.id === id) as TradingSignal | undefined) || null;
  }

  getSignalsBySymbol(symbol: string): TradingSignal[] {
    return signalsData.filter(s =>
      s.symbol === symbol.toUpperCase()
    ) as TradingSignal[];
  }

  async getSignalByTicker(ticker: string): Promise<SignalBreakdown | null> {
    return await this.generateDetailedSignal(ticker);
  }

  getActiveSignals(): TradingSignal[] {
    const now = new Date();
    return signalsData.filter(s => new Date(s.expiresAt) > now) as TradingSignal[];
  }

  getBuySignals(): TradingSignal[] {
    return this.getActiveSignals().filter(s => s.signal === "buy");
  }

  getSellSignals(): TradingSignal[] {
    return this.getActiveSignals().filter(s => s.signal === "sell");
  }

  getHoldSignals(): TradingSignal[] {
    return this.getActiveSignals().filter(s => s.signal === "hold");
  }

  getHighConfidenceSignals(minConfidence: number = 0.7): TradingSignal[] {
    return this.getActiveSignals().filter(s => s.confidence >= minConfidence);
  }

  // Generate a detailed signal based on technical and sentiment analysis
  async generateDetailedSignal(ticker: string): Promise<SignalBreakdown | null> {
    const technical = technicalService.getIndicators(ticker);
    const sentiment = await sentimentService.getSentiment(ticker);
    const stock = await stockService.getStockBySymbol(ticker);
    const recentNews = await sentimentService.getRecentNews(ticker, 5);

    if (!technical) throw new Error("Unable to calculate technical indicators");
    if (!sentiment) throw new Error("Unable to fetch sentiment data");

    const techScore = technicalService.calculateSignalScore(technical);
    const sentimentScore = sentimentService.calculateSentimentScore(sentiment);

    // Weighted score: 60% technical, 40% sentiment
    const combinedScore = techScore * 0.6 + sentimentScore * 0.4;

    let signal: "buy" | "sell" | "hold";
    if (combinedScore > 0.3) signal = "buy";
    else if (combinedScore < -0.3) signal = "sell";
    else signal = "hold";

    const confidence = Math.abs(combinedScore);

    const reasons: string[] = [];
    if (technical.rsi > 70) reasons.push("RSI indicates strong momentum");
    if (technical.rsi < 30) reasons.push("RSI suggests potential reversal");
    if (technical.macd.histogram > 0) reasons.push("MACD is bullish");
    if (sentiment.sentimentScore > 0.6) reasons.push("Positive news sentiment");
    if (sentiment.sentimentScore < 0.4) reasons.push("Negative news sentiment");

    // Calculate price targets based on real stock price
    let priceTargets: { entry: number; target: number; stopLoss: number } | null = null;
    if (signal !== "hold" && stock) {
      const entry = stock.price;
      const target = signal === "buy" ? entry * 1.1 : entry * 0.9;
      const stopLoss = signal === "buy" ? entry * 0.92 : entry * 1.08;
      priceTargets = {
        entry: Math.round(entry * 100) / 100,
        target: Math.round(target * 100) / 100,
        stopLoss: Math.round(stopLoss * 100) / 100
      };
    }

    return {
      signal,
      confidence,
      breakdown: {
        technical: {
          score: techScore,
          rsi: {
            value: technical.rsi,
            interpretation: interpretRSI(technical.rsi)
          },
          sma: {
            interpretation: calculatePriceAction(
              stock?.price || 0,
              technical.movingAverages.ma50,
              technical.movingAverages.ma200
            )
          },
          momentum: {
            value: technical.macd.histogram,
            direction: calculateMomentumDirection(technical.macd.histogram)
          },
          summary: `RSI at ${technical.rsi}, MACD ${technical.macd.histogram > 0 ? "bullish" : "bearish"}`
        },
        sentiment: {
          score: sentimentScore,
          summary: `${sentiment.overallSentiment} sentiment (${sentiment.positiveNews}/${sentiment.newsCount} positive)`,
          newsCount: sentiment.newsCount,
          positiveRatio: sentiment.newsCount > 0 ? sentiment.positiveNews / sentiment.newsCount : 0,
          recentArticles: recentNews.map(article => ({
            title: article.title,
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            summary: article.summary,
            sentiment: article.sentiment
          }))
        },
        combined: {
          reasons: reasons.length > 0 ? reasons : ["No clear technical or sentiment signals"],
          priceTargets
        }
      }
    };
  }

  // Generate a signal based on technical and sentiment analysis
  async generateSignal(symbol: string): Promise<Partial<TradingSignal> | null> {
    const detailed = await this.generateDetailedSignal(symbol);
    if (!detailed) return null;

    return {
      signal: detailed.signal,
      confidence: detailed.confidence,
      technicalScore: detailed.breakdown.technical.score,
      sentimentScore: detailed.breakdown.sentiment.score
    };
  }
}

export default new SignalService();
