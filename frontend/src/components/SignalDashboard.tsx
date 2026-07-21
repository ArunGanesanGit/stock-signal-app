"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
}

interface SourceSentiment {
  source: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  confidence: number;
  articles: number;
  summary: string;
}

interface MultiSourceSentiment {
  symbol: string;
  sources: SourceSentiment[];
  overallSentiment: "positive" | "neutral" | "negative";
  overallScore: number;
  timestamp: string;
}

interface SignalData {
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
      recentArticles?: NewsArticle[];
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

export default function SignalDashboard() {
  const [ticker, setTicker] = useState("");
  const [signal, setSignal] = useState<SignalData | null>(null);
  const [sentimentSources, setSentimentSources] = useState<MultiSourceSentiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticker.trim()) {
      setError("Please enter a ticker symbol");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const upperTicker = ticker.toUpperCase();
      const data = await fetchAPI<SignalData>(`/api/signals/${upperTicker}`);
      setSignal(data);

      // Also fetch multi-source sentiment
      try {
        const sentimentData = await fetchAPI<MultiSourceSentiment>(`/api/sentiment-sources/${upperTicker}`);
        setSentimentSources(sentimentData);
      } catch (sentimentErr) {
        console.warn("Failed to fetch sentiment sources:", sentimentErr);
      }
    } catch (err: any) {
      let errorMessage = "Failed to fetch signal";

      // Parse API error responses
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;

        // Add helpful details for specific errors
        if (err.response?.data?.details) {
          errorMessage += `: ${err.response.data.details}`;
        }

        // Handle specific error scenarios
        if (err.response?.status === 429) {
          errorMessage += "\n\nPlease wait a few minutes before trying again.";
        } else if (err.response?.status === 500) {
          const provider = err.response.data?.provider || "API";
          errorMessage = `Unable to fetch ${provider} data for ${ticker.toUpperCase()}. This stock may not have news coverage or the API is temporarily unavailable. Try another ticker.`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSignal(null);
    } finally {
      setLoading(false);
    }
  };

  const getSignalColor = (sig: "buy" | "sell" | "hold") => {
    switch (sig) {
      case "buy":
        return { text: "#00ff00", bg: "#001a00", border: "#00ff00" };
      case "sell":
        return { text: "#ff0000", bg: "#1a0000", border: "#ff0000" };
      case "hold":
        return { text: "#ffff00", bg: "#1a1a00", border: "#ffff00" };
    }
  };

  const colors = signal ? getSignalColor(signal.signal) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ backgroundColor: "#0a0a0a", padding: "16px", borderRadius: "4px", border: "1px solid #0088ff" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", marginBottom: "8px", color: "#00ffff" }}>Stock Ticker</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="e.g., AAPL, MSFT, TSLA"
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #0088ff",
              borderRadius: "4px",
              backgroundColor: "#1a1a1a",
              color: "#00ff00",
              fontSize: "11px",
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0088ff",
              color: "#000000",
              borderRadius: "4px",
              border: "1px solid #00ff00",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        <p style={{ fontSize: "10px", color: "#ffff00", marginTop: "8px" }}>Search any stock ticker - Popular: AAPL, MSFT, GOOGL, TSLA, AMZN, NVDA, AMD, META</p>
      </form>

      {/* Error Message */}
      {error && (
        <div style={{ backgroundColor: "#1a0000", border: "1px solid #ff0000", padding: "12px", borderRadius: "4px" }}>
          <p style={{ color: "#ff0000", fontWeight: "bold", fontSize: "11px" }}>⚠️ Error</p>
          <p style={{ color: "#ff6666", fontSize: "10px", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {error}
          </p>
          <p style={{ color: "#ff8888", fontSize: "9px", marginTop: "8px", fontStyle: "italic" }}>
            💡 Tip: Popular stocks like AAPL, MSFT, GOOGL, TSLA usually have better news coverage
          </p>
        </div>
      )}

      {/* Signal Result */}
      {signal && colors && (
        <div style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "4px", padding: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ color: "#00ffff", fontSize: "11px" }}>Signal for {ticker.toUpperCase()}</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: colors.text, textTransform: "uppercase" }}>
                {signal.signal}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: colors.text }}>
                {(signal.confidence * 100).toFixed(0)}%
              </p>
              <p style={{ color: "#ffff00", fontSize: "10px" }}>Confidence</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {/* Technical Analysis */}
            <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", padding: "12px", border: "1px solid #0088ff" }}>
              <h3 style={{ fontWeight: "bold", color: "#00ff00", fontSize: "12px", marginBottom: "8px" }}>📊 Technical Analysis</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#ffff00" }}>RSI (14)</span>
                  <span style={{ color: "#00ffff", fontWeight: "bold" }}>{signal.breakdown.technical.rsi.value}</span>
                </div>
                <p style={{ color: "#00ff00", fontSize: "10px" }}>
                  {signal.breakdown.technical.rsi.interpretation}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                  <span style={{ color: "#ffff00" }}>Momentum</span>
                  <span style={{ color: "#00ffff", fontWeight: "bold" }}>
                    {signal.breakdown.technical.momentum.direction}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                  <span style={{ color: "#ffff00" }}>Moving Averages</span>
                  <span style={{ fontSize: "10px", textAlign: "right", color: "#00ffff", fontWeight: "bold" }}>
                    {signal.breakdown.technical.sma.interpretation}
                  </span>
                </div>

                <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#0a0a0a", borderRadius: "4px", border: "1px solid #ff00ff" }}>
                  <p style={{ color: "#ff00ff", fontWeight: "bold", fontSize: "10px" }}>Score</p>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#00ff00" }}>
                    {(signal.breakdown.technical.score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", padding: "12px", border: "1px solid #ff00ff" }}>
              <h3 style={{ fontWeight: "bold", color: "#00ffff", fontSize: "12px", marginBottom: "8px" }}>📰 Sentiment Analysis</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#ffff00" }}>News Count</span>
                  <span style={{ color: "#00ff00", fontWeight: "bold" }}>{signal.breakdown.sentiment.newsCount}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#ffff00" }}>Positive Ratio</span>
                  <span style={{ color: "#00ff00", fontWeight: "bold" }}>
                    {(signal.breakdown.sentiment.positiveRatio * 100).toFixed(0)}%
                  </span>
                </div>

                <div style={{ paddingTop: "8px" }}>
                  <p style={{ color: "#ffff00", fontSize: "10px", marginBottom: "4px" }}>Summary</p>
                  <p style={{ color: "#00ffff", fontSize: "10px" }}>
                    {signal.breakdown.sentiment.summary}
                  </p>
                </div>

                <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#0a0a0a", borderRadius: "4px", border: "1px solid #00ff00" }}>
                  <p style={{ color: "#00ff00", fontWeight: "bold", fontSize: "10px" }}>Score</p>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#ff00ff" }}>
                    {(signal.breakdown.sentiment.score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div style={{ marginTop: "16px", backgroundColor: "#0a0a0a", borderRadius: "4px", padding: "12px", border: "1px solid #00ff00" }}>
            <h3 style={{ fontWeight: "bold", color: "#00ff00", marginBottom: "8px", fontSize: "12px" }}>🎯 Key Reasons</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              {signal.breakdown.combined.reasons.map((reason, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", fontSize: "11px" }}>
                  <span style={{ fontWeight: "bold", marginRight: "8px", color: colors.text }}>✓</span>
                  <span style={{ color: "#00ffff" }}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent News Articles */}
          {signal.breakdown.sentiment.recentArticles && signal.breakdown.sentiment.recentArticles.length > 0 && (
            <div style={{ marginTop: "16px", backgroundColor: "#0a0a0a", borderRadius: "4px", padding: "12px", border: "1px solid #00ffff" }}>
              <h3 style={{ fontWeight: "bold", color: "#00ffff", marginBottom: "12px", fontSize: "12px" }}>📰 Recent News Impact</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {signal.breakdown.sentiment.recentArticles.map((article, idx) => (
                  <div key={idx} style={{ padding: "10px", backgroundColor: "#1a1a1a", borderRadius: "4px", border: `1px solid ${article.sentiment === "positive" ? "#00ff00" : article.sentiment === "negative" ? "#ff0000" : "#ffff00"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: "#00ffff", textDecoration: "none", flex: 1, fontSize: "11px", fontWeight: "bold", marginRight: "8px" }}>
                        {article.title}
                      </a>
                      <span style={{ fontSize: "9px", color: article.sentiment === "positive" ? "#00ff00" : article.sentiment === "negative" ? "#ff0000" : "#ffff00", fontWeight: "bold", whiteSpace: "nowrap" }}>
                        {article.sentiment.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: "9px", color: "#888888", margin: "4px 0" }}>
                      {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: "10px", color: "#cccccc", lineHeight: "1.4" }}>
                      {article.summary.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Source Sentiment Analysis */}
          {sentimentSources && sentimentSources.sources.length > 0 && (
            <div style={{ marginTop: "16px", backgroundColor: "#0a0a0a", borderRadius: "4px", padding: "12px", border: "1px solid #FFA500" }}>
              <h3 style={{ fontWeight: "bold", color: "#FFA500", marginBottom: "12px", fontSize: "12px" }}>🔍 Sentiment from Multiple Sources</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                {sentimentSources.sources.map((source, idx) => {
                  const sentimentColor =
                    source.sentiment === "positive"
                      ? "#00ff00"
                      : source.sentiment === "negative"
                        ? "#ff0000"
                        : "#ffff00";
                  const bgColor =
                    source.sentiment === "positive"
                      ? "#001a00"
                      : source.sentiment === "negative"
                        ? "#1a0000"
                        : "#1a1a00";

                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: bgColor,
                        borderRadius: "4px",
                        padding: "10px",
                        border: `1px solid ${sentimentColor}`,
                        textAlign: "center"
                      }}
                    >
                      <p style={{ fontSize: "9px", color: "#888888", marginBottom: "4px" }}>
                        {source.source}
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: sentimentColor,
                          textTransform: "uppercase",
                          marginBottom: "6px"
                        }}
                      >
                        {source.sentiment === "positive"
                          ? "🟢"
                          : source.sentiment === "negative"
                            ? "🔴"
                            : "🟡"}{" "}
                        {source.sentiment}
                      </p>
                      <p style={{ fontSize: "9px", color: "#cccccc", marginBottom: "4px" }}>
                        {source.summary}
                      </p>
                      {source.articles > 0 && (
                        <p style={{ fontSize: "8px", color: "#888888" }}>
                          {source.articles} articles analyzed
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#1a1a1a", borderRadius: "4px", border: `1px solid ${sentimentSources.overallSentiment === "positive" ? "#00ff00" : sentimentSources.overallSentiment === "negative" ? "#ff0000" : "#ffff00"}` }}>
                <p style={{ fontSize: "9px", color: "#888888", marginBottom: "4px" }}>Overall Sentiment (Weighted Average)</p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color:
                      sentimentSources.overallSentiment === "positive"
                        ? "#00ff00"
                        : sentimentSources.overallSentiment === "negative"
                          ? "#ff0000"
                          : "#ffff00"
                  }}
                >
                  {sentimentSources.overallSentiment === "positive"
                    ? "🟢"
                    : sentimentSources.overallSentiment === "negative"
                      ? "🔴"
                      : "🟡"}{" "}
                  {sentimentSources.overallSentiment.toUpperCase()} ({(sentimentSources.overallScore * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          )}

          {/* Price Targets */}
          {signal.breakdown.combined.priceTargets && (
            <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", padding: "12px", textAlign: "center", border: "1px solid #0088ff" }}>
                <p style={{ color: "#00ff00", fontSize: "10px", fontWeight: "bold" }}>Entry</p>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#00ffff" }}>${signal.breakdown.combined.priceTargets.entry.toFixed(2)}</p>
              </div>
              <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", padding: "12px", textAlign: "center", border: "1px solid #00ff00" }}>
                <p style={{ color: "#00ff00", fontSize: "10px", fontWeight: "bold" }}>Target</p>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#00ff00" }}>${signal.breakdown.combined.priceTargets.target.toFixed(2)}</p>
              </div>
              <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", padding: "12px", textAlign: "center", border: "1px solid #ff0000" }}>
                <p style={{ color: "#ff0000", fontSize: "10px", fontWeight: "bold" }}>Stop Loss</p>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#ff0000" }}>${signal.breakdown.combined.priceTargets.stopLoss.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!signal && !error && !loading && (
        <div style={{ backgroundColor: "#151B24", border: "1px solid #FF6666", padding: "32px", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ color: "#FF6666", fontSize: "13px", fontWeight: "bold", marginBottom: "8px" }}>Ready to Analyze</p>
          <p style={{ color: "#E0E0E0", fontSize: "11px" }}>Enter a stock ticker to get a detailed trading signal with technical and sentiment breakdown.</p>
        </div>
      )}
    </div>
  );
}
