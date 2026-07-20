export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high52Week: number;
  low52Week: number;
  marketCap: number;
  pe: number;
  eps: number;
  lastUpdated: string;
}

export interface TechnicalIndicators {
  symbol: string;
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  movingAverages: {
    ma20: number;
    ma50: number;
    ma200: number;
  };
  adx: number;
  stochastic: {
    k: number;
    d: number;
  };
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  symbol: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
}

export interface SentimentData {
  symbol: string;
  overallSentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  newsCount: number;
  positiveNews: number;
  negativeNews: number;
  neutralNews: number;
  lastAnalyzed: string;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  signal: "buy" | "sell" | "hold";
  confidence: number;
  technicalScore: number;
  sentimentScore: number;
  reasons: string[];
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  createdAt: string;
  expiresAt: string;
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  gain: number;
  gainPercent: number;
}
