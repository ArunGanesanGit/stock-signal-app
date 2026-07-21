// Calculate technical indicators from price data

export interface OHLCData {
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface CalculatedIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  movingAverages: { ma20: number; ma50: number; ma200: number };
  bollingerBands: { upper: number; middle: number; lower: number };
  adx: number;
  stochastic: { k: number; d: number };
}

// Calculate RSI
export function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50; // Default neutral

  let gains = 0;
  let losses = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 10) / 10;
}

// Calculate MACD
export function calculateMACD(
  closes: number[]
): { value: number; signal: number; histogram: number } {
  if (closes.length < 26) {
    return { value: 0, signal: 0, histogram: 0 };
  }

  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macdValue = ema12 - ema26;

  const macdValues = [];
  for (let i = Math.max(25, 11); i < closes.length; i++) {
    const e12 = calculateEMA(closes.slice(0, i + 1), 12);
    const e26 = calculateEMA(closes.slice(0, i + 1), 26);
    macdValues.push(e12 - e26);
  }

  const signal = calculateEMA(macdValues, 9);
  const histogram = macdValue - signal;

  return {
    value: Math.round(macdValue * 100) / 100,
    signal: Math.round(signal * 100) / 100,
    histogram: Math.round(histogram * 100) / 100
  };
}

// Calculate EMA
function calculateEMA(values: number[], period: number): number {
  if (values.length < period) return values[values.length - 1];

  let sma = values.slice(0, period).reduce((a, b) => a + b) / period;
  let ema = sma;

  const multiplier = 2 / (period + 1);
  for (let i = period; i < values.length; i++) {
    ema = values[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
}

// Calculate Moving Averages
export function calculateMovingAverages(
  closes: number[]
): { ma20: number; ma50: number; ma200: number } {
  const current = closes[closes.length - 1];

  const ma20 =
    closes.length >= 20
      ? closes.slice(-20).reduce((a, b) => a + b) / 20
      : current;

  const ma50 =
    closes.length >= 50
      ? closes.slice(-50).reduce((a, b) => a + b) / 50
      : current;

  const ma200 =
    closes.length >= 200
      ? closes.slice(-200).reduce((a, b) => a + b) / 200
      : current;

  return {
    ma20: Math.round(ma20 * 100) / 100,
    ma50: Math.round(ma50 * 100) / 100,
    ma200: Math.round(ma200 * 100) / 100
  };
}

// Calculate Bollinger Bands
export function calculateBollingerBands(
  closes: number[],
  period: number = 20,
  stdDevs: number = 2
): { upper: number; middle: number; lower: number } {
  if (closes.length < period) {
    return { upper: 0, middle: 0, lower: 0 };
  }

  const recent = closes.slice(-period);
  const middle = recent.reduce((a, b) => a + b) / period;

  const variance =
    recent.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    upper: Math.round((middle + stdDev * stdDevs) * 100) / 100,
    middle: Math.round(middle * 100) / 100,
    lower: Math.round((middle - stdDev * stdDevs) * 100) / 100
  };
}

// Calculate ADX (simplified - just return trend strength)
export function calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  if (highs.length < period) return 25; // Neutral trend strength

  let upMoves = 0;
  let downMoves = 0;

  for (let i = highs.length - period; i < highs.length; i++) {
    const highChange = highs[i] - highs[i - 1];
    const lowChange = lows[i - 1] - lows[i];

    if (highChange > lowChange && highChange > 0) upMoves += highChange;
    else if (lowChange > highChange && lowChange > 0) downMoves += lowChange;
  }

  const totalMoves = upMoves + downMoves;
  if (totalMoves === 0) return 25;

  const adx = ((upMoves - downMoves) / totalMoves) * 100;
  return Math.round(Math.abs(adx) * 10) / 10;
}

// Calculate Stochastic
export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): { k: number; d: number } {
  if (closes.length < period) {
    return { k: 50, d: 50 };
  }

  const recent = {
    highs: highs.slice(-period),
    lows: lows.slice(-period),
    closes: closes.slice(-period)
  };

  const highestHigh = Math.max(...recent.highs);
  const lowestLow = Math.min(...recent.lows);
  const currentClose = closes[closes.length - 1];

  const k =
    highestHigh === lowestLow
      ? 50
      : ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;

  const d = closes.length >= period + 2
    ? closes.slice(-3).reduce((a, b) => a + b) / 3
    : k;

  return {
    k: Math.round(k * 10) / 10,
    d: Math.round(d * 10) / 10
  };
}
