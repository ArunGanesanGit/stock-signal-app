import { StockData } from "@stock-signal/shared";
import stocksData from "../data/stocks.json";
import { getStockQuote } from "../utils/alphavantage";

class StockService {
  private mockData: StockData[] = stocksData as StockData[];

  async getAllStocks(): Promise<StockData[]> {
    return this.mockData;
  }

  async getStockBySymbol(symbol: string): Promise<StockData | null> {
    const upperSymbol = symbol.toUpperCase();

    // Fetch from real API only - no mock data fallback
    const realData = await getStockQuote(upperSymbol);

    // Merge with mock data to get other fields (52-week high/low, PE, etc.) if available
    const mock = this.mockData.find(s => s.symbol === upperSymbol);
    if (mock) {
      return {
        ...mock,
        price: realData.price,
        change: realData.change,
        changePercent: realData.changePercent,
        volume: realData.volume,
        high52Week: realData.high52Week || mock.high52Week,
        low52Week: realData.low52Week || mock.low52Week,
        lastUpdated: new Date().toISOString()
      };
    }

    return { ...realData, marketCap: 0, pe: 0, eps: 0, lastUpdated: new Date().toISOString() } as StockData;
  }

  searchStocks(query: string): StockData[] {
    const q = query.toLowerCase();
    return this.mockData.filter(s =>
      s.symbol.toLowerCase().includes(q)
    );
  }
}

export default new StockService();
