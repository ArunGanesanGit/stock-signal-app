// AlphaVantage API Integration for real-time stock data

const BASE_URL = "https://www.alphavantage.co/query";

function getApiKey() {
  return process.env.ALPHA_VANTAGE_API_KEY;
}

interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high52Week: number;
  low52Week: number;
}

interface TechnicalData {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  sma: { ma20: number; ma50: number; ma200: number };
}

export async function getStockQuote(symbol: string): Promise<QuoteData | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_NOT_SET");
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();

    // Check for rate limit error
    if (data["Note"] || data["Information"]) {
      const error = new Error("RATE_LIMIT_EXCEEDED");
      (error as any).apiMessage = data["Note"] || data["Information"];
      throw error;
    }

    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const quote = data["Global Quote"];
      return {
        symbol,
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"]),
        volume: parseInt(quote["06. volume"]),
        high52Week: parseFloat(quote["52. 52 week high"] || 0),
        low52Week: parseFloat(quote["52. 52 week low"] || 0)
      };
    }
    throw new Error(`No data received for symbol ${symbol}`);
  } catch (error: any) {
    if (error.message === "RATE_LIMIT_EXCEEDED") {
      throw error;
    }
    throw error;
  }
}

export async function getTechnicalIndicators(
  symbol: string
): Promise<TechnicalData | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    // Fetch daily time series data (compact = 100 latest data points, free tier compatible)
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
    );
    const data = await response.json();

    // Check for rate limit error
    if (data["Note"] || data["Information"]) {
      console.warn("AlphaVantage rate limit or error:", data["Note"] || data["Information"]);
      return null;
    }

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      console.warn(`No time series data for ${symbol}`);
      return null;
    }

    // Extract OHLC data (compact mode returns ~100 trading days)
    const dates = Object.keys(timeSeries).slice(0, 100);
    const closes = dates
      .reverse()
      .map(date => parseFloat(timeSeries[date]["4. close"]));
    const highs = dates
      .reverse()
      .map(date => parseFloat(timeSeries[date]["2. high"]));
    const lows = dates
      .reverse()
      .map(date => parseFloat(timeSeries[date]["3. low"]));

    if (closes.length < 20) {
      console.warn(`Insufficient data for ${symbol}`);
      return null;
    }

    // Calculate indicators
    const {
      calculateRSI,
      calculateMACD,
      calculateMovingAverages,
      calculateADX,
      calculateStochastic
    } = await import("./indicators");

    const rsi = calculateRSI(closes);
    const macd = calculateMACD(closes);
    const sma = calculateMovingAverages(closes);
    const adx = calculateADX(highs, lows, closes);
    const stochastic = calculateStochastic(highs, lows, closes);

    return {
      rsi,
      macd,
      sma
    };
  } catch (error) {
    console.error("Technical indicators API error:", error);
  }

  return null;
}

export async function intraday(symbol: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Intraday data error:", error);
  }

  return null;
}
