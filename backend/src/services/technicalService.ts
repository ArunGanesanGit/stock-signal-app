import { TechnicalIndicators } from "@stock-signal/shared";
import technicalData from "../data/technical.json";

class TechnicalService {
  getIndicators(symbol: string): TechnicalIndicators | null {
    const indicators = technicalData.find(t =>
      t.symbol === symbol.toUpperCase()
    );
    return indicators || null;
  }

  getAllIndicators(): TechnicalIndicators[] {
    return technicalData;
  }

  // Helper: Calculate buy/sell scores based on indicators
  calculateSignalScore(indicators: TechnicalIndicators): number {
    let score = 0;

    // RSI scoring (0-100, 30 oversold, 70 overbought)
    if (indicators.rsi < 30) score += 0.3; // Buy signal
    else if (indicators.rsi > 70) score += 0.2; // Sell signal
    else if (indicators.rsi > 40 && indicators.rsi < 60) score += 0.1; // Neutral

    // MACD scoring
    if (indicators.macd.histogram > 0 && indicators.macd.value > indicators.macd.signal) {
      score += 0.25; // Bullish
    } else if (indicators.macd.histogram < 0 && indicators.macd.value < indicators.macd.signal) {
      score -= 0.25; // Bearish
    }

    // Moving averages scoring
    const currentPrice = 0; // Would be from stock service
    if (currentPrice > indicators.movingAverages.ma20 &&
        indicators.movingAverages.ma20 > indicators.movingAverages.ma50 &&
        indicators.movingAverages.ma50 > indicators.movingAverages.ma200) {
      score += 0.2; // Uptrend
    }

    // ADX scoring (trend strength)
    if (indicators.adx > 50) score += 0.15; // Strong trend
    else if (indicators.adx > 25) score += 0.05; // Weak trend

    return Math.min(Math.max(score, -1), 1);
  }
}

export default new TechnicalService();
