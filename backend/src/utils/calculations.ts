// Technical Analysis Calculations

export interface CalculatedIndicators {
  rsi: number;
  sma50: number;
  sma200: number;
  momentum: number;
}

// Simple Mock Implementation - Replace with real calculations for production
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  if (avgGain === 0) return 0;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return Math.round(rsi * 100) / 100;
}

export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];

  const slice = prices.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return Math.round((sum / period) * 100) / 100;
}

export function calculateMomentum(currentPrice: number, priceNPeriodsAgo: number, period: number = 10): number {
  const momentum = currentPrice - priceNPeriodsAgo;
  return Math.round(momentum * 100) / 100;
}

// For mock data, generate realistic technical indicators
export function generateTechnicalIndicators(symbol: string, basePrice: number): CalculatedIndicators {
  // Generate mock price history (last 200 days)
  const priceHistory = generatePriceHistory(basePrice, 200);

  return {
    rsi: calculateRSI(priceHistory, 14),
    sma50: calculateSMA(priceHistory, 50),
    sma200: calculateSMA(priceHistory, 200),
    momentum: calculateMomentum(priceHistory[priceHistory.length - 1], priceHistory[priceHistory.length - 11], 10)
  };
}

function generatePriceHistory(basePrice: number, periods: number): number[] {
  const prices = [basePrice];

  for (let i = 1; i < periods; i++) {
    const change = (Math.random() - 0.48) * basePrice * 0.02; // ±2% daily variation
    prices.push(Math.max(prices[i - 1] + change, basePrice * 0.5));
  }

  return prices;
}

export function interpretRSI(rsi: number): string {
  if (rsi > 70) return "Overbought";
  if (rsi < 30) return "Oversold";
  return "Neutral";
}

export function calculatePriceAction(currentPrice: number, sma50: number, sma200: number): string {
  if (currentPrice > sma50 && sma50 > sma200) {
    return "Above both moving averages - Uptrend";
  } else if (currentPrice < sma50 && sma50 < sma200) {
    return "Below both moving averages - Downtrend";
  }
  return "Mixed signals";
}

export function calculateMomentumDirection(momentum: number): string {
  if (momentum > 0) return "Positive";
  if (momentum < 0) return "Negative";
  return "Neutral";
}
