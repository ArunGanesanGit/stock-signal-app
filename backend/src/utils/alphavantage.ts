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
    console.log("AlphaVantage API key not set, using mock data");
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();

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
  } catch (error) {
    console.error("AlphaVantage API error:", error);
  }

  return null;
}

export async function getTechnicalIndicators(
  symbol: string
): Promise<TechnicalData | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    // This would require multiple API calls for RSI, MACD, and SMA
    // For simplicity, we'll return null to use mock data
    // A real implementation would make parallel calls to different functions
    console.log("Technical indicators require multiple API calls - using mock data");
    return null;
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
