"use client";

import { useEffect, useState } from "react";
import StockRow from "@/components/StockRow";
import { fetchAPI } from "@/lib/api";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe?: number;
}

interface TrendingStock {
  symbol: string;
  price: number;
  change: number;
  newsCount: number;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  trend: "🔥 Trending Up" | "📈 Gaining Interest" | "➡️ Stable" | "📉 Losing Interest" | "❄️ Trending Down";
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"trending" | "all">("trending");
  const [sortBy, setSortBy] = useState<"symbol" | "price" | "change" | "news" | "sentiment">("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const stocksData = await fetchAPI("/api/stocks");
      setStocks((stocksData as StockData[]) || []);

      // Generate trending data based on sentiment analysis
      const stocks_ = (stocksData as StockData[]) || [];
      const trending = await Promise.all(
        stocks_.map(async (stock: StockData) => {
          try {
            const signal = await fetchAPI(`/api/signals/${stock.symbol}`);
            const signalData = signal as any;
            return {
              symbol: stock.symbol,
              price: stock.price,
              change: stock.change,
              newsCount: signalData?.breakdown?.sentiment?.newsCount || 0,
              sentiment: signalData?.breakdown?.sentiment?.summary?.includes("positive") ? "positive" :
                        signalData?.breakdown?.sentiment?.summary?.includes("negative") ? "negative" : "neutral",
              sentimentScore: signalData?.breakdown?.sentiment?.score || 0.5,
              trend: getTrend(signalData?.breakdown?.sentiment?.newsCount || 0, signalData?.breakdown?.sentiment?.score || 0.5)
            };
          } catch {
            return {
              symbol: stock.symbol,
              price: stock.price,
              change: stock.change,
              newsCount: 0,
              sentiment: "neutral",
              sentimentScore: 0.5,
              trend: "➡️ Stable" as const
            };
          }
        })
      );
      setTrendingStocks(trending as TrendingStock[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getTrend = (newsCount: number, sentiment: number) => {
    if (newsCount > 30 && sentiment > 0.6) return "🔥 Trending Up" as const;
    if (newsCount > 20 && sentiment > 0.5) return "📈 Gaining Interest" as const;
    if (newsCount > 10) return "➡️ Stable" as const;
    if (newsCount > 5 && sentiment < 0.5) return "📉 Losing Interest" as const;
    return "❄️ Trending Down" as const;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const stock = await fetchAPI(`/api/stocks/${searchQuery.toUpperCase()}`);
      setSearchResults([stock as StockData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stock not found");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return b.price - a.price;
      case "change":
        return b.change - a.change;
      default:
        return a.symbol.localeCompare(b.symbol);
    }
  });

  const sortedTrendingStocks = [...trendingStocks].sort((a, b) => {
    switch (sortBy) {
      case "news":
        return b.newsCount - a.newsCount;
      case "sentiment":
        return b.sentimentScore - a.sentimentScore;
      case "price":
        return b.price - a.price;
      case "change":
        return b.change - a.change;
      default:
        return a.symbol.localeCompare(b.symbol);
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: "#00ff00" }}>📊 Stocks & Trends</h1>
        <p style={{ color: "#00ffff", fontSize: "12px" }}>Monitor stock prices, sentiment, and trending topics</p>
      </div>

      {/* Search Any Stock */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any stock ticker (e.g., NVDA, AMD, GOOGL)"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "4px",
            backgroundColor: "#1a1a1a",
            border: "1px solid #00ffff",
            color: "#00ff00",
            fontSize: "12px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: "4px",
            backgroundColor: "#00ffff",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* View Toggle */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setView("trending")}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "11px",
            backgroundColor: view === "trending" ? "#00ff00" : "#0a0a0a",
            color: view === "trending" ? "#000000" : "#00ff00",
            border: view === "trending" ? "1px solid #00ff00" : "1px solid #00ff00",
            cursor: "pointer",
          }}
        >
          🔥 Trending
        </button>
        <button
          onClick={() => setView("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "11px",
            backgroundColor: view === "all" ? "#0088ff" : "#0a0a0a",
            color: view === "all" ? "#000000" : "#0088ff",
            border: view === "all" ? "1px solid #0088ff" : "1px solid #0088ff",
            cursor: "pointer",
          }}
        >
          📋 All Stocks
        </button>
      </div>

      {/* Sort Controls */}
      {view === "trending" && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {(["news", "sentiment", "price", "change"] as const).map(type => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "11px",
                backgroundColor: sortBy === type ? "#ff00ff" : "#0a0a0a",
                color: sortBy === type ? "#000000" : "#ff00ff",
                border: "1px solid #ff00ff",
                cursor: "pointer",
              }}
            >
              Sort by {type}
            </button>
          ))}
        </div>
      )}

      {view === "all" && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {(["symbol", "price", "change"] as const).map(type => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "11px",
                backgroundColor: sortBy === type ? "#0088ff" : "#0a0a0a",
                color: sortBy === type ? "#000000" : "#0088ff",
                border: "1px solid #0088ff",
                cursor: "pointer",
              }}
            >
              Sort by {type}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{ backgroundColor: "#0a0a0a", borderRadius: "4px", overflow: "hidden", border: "1px solid #00ffff" }}>
          <div style={{ padding: "12px", backgroundColor: "#1a1a1a", borderBottom: "1px solid #00ffff" }}>
            <h2 style={{ color: "#00ffff", fontSize: "14px", fontWeight: "bold", margin: 0 }}>Search Result: {searchResults[0].symbol}</h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #00ffff" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left", color: "#00ffff", fontWeight: "bold" }}>Symbol</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#00ffff", fontWeight: "bold" }}>Price</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#00ffff", fontWeight: "bold" }}>Change</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#00ffff", fontWeight: "bold" }}>Volume</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#00ffff", fontWeight: "bold" }}>P/E</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((stock) => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "12px", color: "#00ffff", fontWeight: "bold" }}>{stock.symbol}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ff00" }}>${stock.price.toFixed(2)}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: stock.change >= 0 ? "#00ff00" : "#ff0000" }}>
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#ffff00" }}>{(stock.volume / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ffff" }}>{(stock.pe || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error State */}
      {error && searchResults.length === 0 && (
        <div style={{ backgroundColor: "#1a0000", border: "1px solid #ff0000", padding: "12px", borderRadius: "4px" }}>
          <p style={{ color: "#ff0000", fontWeight: "bold", fontSize: "11px" }}>⚠️ Error: {error}</p>
          <p style={{ color: "#ff6666", fontSize: "10px", marginTop: "6px" }}>Try searching for: AAPL, MSFT, GOOGL, TSLA, AMZN, NVDA, AMD, META, etc.</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: "40px", backgroundColor: "#1a1a1a", borderRadius: "4px", animation: "pulse 2s infinite" }}></div>
          ))}
        </div>
      )}

      {/* Trending Stocks Table */}
      {!loading && view === "trending" && sortedTrendingStocks.length > 0 && (
        <div style={{ backgroundColor: "#0a0a0a", borderRadius: "4px", overflow: "hidden", border: "1px solid #ff00ff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #ff00ff" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left", color: "#ff00ff", fontWeight: "bold" }}>Symbol</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#ff00ff", fontWeight: "bold" }}>Price</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#ff00ff", fontWeight: "bold" }}>Change</th>
                <th style={{ padding: "12px", textAlign: "center", color: "#ff00ff", fontWeight: "bold" }}>📰 News</th>
                <th style={{ padding: "12px", textAlign: "center", color: "#ff00ff", fontWeight: "bold" }}>😊 Sentiment</th>
                <th style={{ padding: "12px", textAlign: "center", color: "#ff00ff", fontWeight: "bold" }}>📈 Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrendingStocks.map((stock, idx) => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #333", backgroundColor: idx % 2 === 0 ? "#0a0a0a" : "#1a1a1a" }}>
                  <td style={{ padding: "12px", color: "#00ffff", fontWeight: "bold" }}>{stock.symbol}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ff00" }}>${stock.price.toFixed(2)}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: stock.change >= 0 ? "#00ff00" : "#ff0000" }}>
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#ffff00", fontWeight: "bold" }}>{stock.newsCount}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: stock.sentiment === "positive" ? "#00ff00" : stock.sentiment === "negative" ? "#ff0000" : "#ffff00", fontWeight: "bold" }}>
                    {stock.sentiment === "positive" ? "😊 Positive" : stock.sentiment === "negative" ? "😞 Negative" : "😐 Neutral"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#00ffff", fontWeight: "bold" }}>{stock.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Stocks Table */}
      {!loading && view === "all" && sortedStocks.length > 0 && (
        <div style={{ backgroundColor: "#0a0a0a", borderRadius: "4px", overflow: "hidden", border: "1px solid #0088ff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #0088ff" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left", color: "#0088ff", fontWeight: "bold" }}>Symbol</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#0088ff", fontWeight: "bold" }}>Price</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#0088ff", fontWeight: "bold" }}>Change</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#0088ff", fontWeight: "bold" }}>Volume</th>
                <th style={{ padding: "12px", textAlign: "right", color: "#0088ff", fontWeight: "bold" }}>P/E</th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock, idx) => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #333", backgroundColor: idx % 2 === 0 ? "#0a0a0a" : "#1a1a1a" }}>
                  <td style={{ padding: "12px", color: "#00ffff", fontWeight: "bold" }}>{stock.symbol}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ff00" }}>${stock.price.toFixed(2)}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: stock.change >= 0 ? "#00ff00" : "#ff0000" }}>
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#ffff00" }}>{(stock.volume / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ffff" }}>{(stock.pe || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
