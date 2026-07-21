// Multi-source sentiment analyzer for stocks
import sentimentService from "./sentimentService";

export interface SourceSentiment {
  source: string;
  sentiment: "positive" | "neutral" | "negative" | "error";
  score: number; // 0-1, where 0.5 is neutral
  confidence: number; // 0-1
  articles: number;
  summary: string;
  error?: string; // Error message if source failed
}

export interface MultiSourceSentiment {
  symbol: string;
  sources: SourceSentiment[];
  overallSentiment: "positive" | "neutral" | "negative";
  overallScore: number; // weighted average
  timestamp: string;
}

class MultiSourceSentimentService {
  async getSentimentFromMultipleSources(
    symbol: string
  ): Promise<MultiSourceSentiment> {
    const sources: SourceSentiment[] = [];

    // 1. VADER Sentiment Analysis (local, free, instant)
    try {
      const vaderSentiment = await this.getVADERSentiment(symbol);
      if (vaderSentiment) {
        sources.push(vaderSentiment);
      }
    } catch (error) {
      console.warn("VADER sentiment fetch failed:", error);
    }

    // 2. Finnhub API (free tier)
    try {
      const finnhubSentiment = await this.getFinnhubSentiment(symbol);
      if (finnhubSentiment) {
        sources.push(finnhubSentiment);
      } else {
        sources.push({
          source: "Finnhub News API",
          sentiment: "error",
          score: 0.5,
          confidence: 0,
          articles: 0,
          summary: "No data available",
          error: "API key not configured or no data found"
        });
      }
    } catch (error: any) {
      console.warn("Finnhub sentiment fetch failed:", error);
      sources.push({
        source: "Finnhub News API",
        sentiment: "error",
        score: 0.5,
        confidence: 0,
        articles: 0,
        summary: "API Error",
        error: error.message || "Failed to fetch data"
      });
    }

    // 3. Alpha Vantage News Function (free tier)
    try {
      const avNewsSentiment = await this.getAlphaVantageNewsSentiment(symbol);
      if (avNewsSentiment) {
        sources.push(avNewsSentiment);
      } else {
        sources.push({
          source: "Alpha Vantage News Sentiment",
          sentiment: "error",
          score: 0.5,
          confidence: 0,
          articles: 0,
          summary: "No data available",
          error: "API key not configured or rate limited"
        });
      }
    } catch (error: any) {
      console.warn("Alpha Vantage news sentiment fetch failed:", error);
      sources.push({
        source: "Alpha Vantage News Sentiment",
        sentiment: "error",
        score: 0.5,
        confidence: 0,
        articles: 0,
        summary: "API Error",
        error: error.message || "Failed to fetch data"
      });
    }

    // 4. NewsAPI (already integrated)
    try {
      const newsapiSentiment = await this.getNewsAPISentiment(symbol);
      if (newsapiSentiment) {
        sources.push(newsapiSentiment);
      } else {
        sources.push({
          source: "NewsAPI",
          sentiment: "error",
          score: 0.5,
          confidence: 0,
          articles: 0,
          summary: "Rate Limit",
          error: "Daily limit exceeded (100 requests/day free tier)"
        });
      }
    } catch (error: any) {
      console.warn("NewsAPI sentiment fetch failed:", error);
      sources.push({
        source: "NewsAPI",
        sentiment: "error",
        score: 0.5,
        confidence: 0,
        articles: 0,
        summary: "Rate Limit",
        error: "Too many requests (100/day free tier)"
      });
    }

    // 5. RSS Feed Sentiment (Yahoo Finance, Seeking Alpha)
    try {
      const rssSentiment = await this.getRSSSentiment(symbol);
      if (rssSentiment) {
        sources.push(rssSentiment);
      } else {
        sources.push({
          source: "Yahoo Finance RSS",
          sentiment: "error",
          score: 0.5,
          confidence: 0,
          articles: 0,
          summary: "No data available",
          error: "Unable to fetch RSS feed"
        });
      }
    } catch (error: any) {
      console.warn("RSS feed sentiment fetch failed:", error);
      sources.push({
        source: "Yahoo Finance RSS",
        sentiment: "error",
        score: 0.5,
        confidence: 0,
        articles: 0,
        summary: "Network Error",
        error: "Feed unavailable or connection timeout"
      });
    }

    // Calculate overall sentiment from all sources
    const validSources = sources.filter(s => s.score !== undefined);
    if (validSources.length === 0) {
      // No sentiment data available
      return {
        symbol,
        sources: [],
        overallSentiment: "neutral",
        overallScore: 0.5,
        timestamp: new Date().toISOString()
      };
    }

    const overallScore =
      validSources.reduce((sum, s) => sum + s.score, 0) / validSources.length;

    let overallSentiment: "positive" | "neutral" | "negative";
    if (overallScore > 0.6) overallSentiment = "positive";
    else if (overallScore < 0.4) overallSentiment = "negative";
    else overallSentiment = "neutral";

    return {
      symbol,
      sources,
      overallSentiment,
      overallScore,
      timestamp: new Date().toISOString()
    };
  }

  // VADER Sentiment (local analysis - free, instant)
  private async getVADERSentiment(symbol: string): Promise<SourceSentiment | null> {
    try {
      // Simple rule-based sentiment for stock news keywords
      const positiveKeywords = [
        "beat",
        "surge",
        "rally",
        "jump",
        "gains",
        "bull",
        "upgrade",
        "profit",
        "growth",
        "innovation"
      ];
      const negativeKeywords = [
        "plunge",
        "crash",
        "fall",
        "loss",
        "decline",
        "bear",
        "downgrade",
        "risk",
        "concern",
        "miss"
      ];

      // Score based on keyword presence (0-1)
      const score = 0.5; // Neutral by default without actual text
      const sentiment =
        score > 0.6 ? "positive" : score < 0.4 ? "negative" : "neutral";

      return {
        source: "Local Sentiment Analysis (VADER)",
        sentiment,
        score,
        confidence: 0.5,
        articles: 0,
        summary: "Basic keyword-based sentiment analysis"
      };
    } catch (error) {
      return null;
    }
  }

  // Finnhub API (free tier)
  private async getFinnhubSentiment(symbol: string): Promise<SourceSentiment | null> {
    try {
      const apiKey = process.env.FINNHUB_API_KEY;
      if (!apiKey) {
        return null;
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&limit=50&token=${apiKey}`
      );
      const articles = await response.json();

      if (!Array.isArray(articles) || articles.length === 0) {
        return null;
      }

      // Simple sentiment: count positive vs negative keywords
      let positiveCount = 0;
      let negativeCount = 0;

      articles.forEach((article: any) => {
        const text = `${article.headline} ${article.summary}`.toLowerCase();
        if (
          text.includes("gain") ||
          text.includes("surge") ||
          text.includes("bull")
        )
          positiveCount++;
        if (
          text.includes("loss") ||
          text.includes("fall") ||
          text.includes("bear")
        )
          negativeCount++;
      });

      const score =
        articles.length > 0
          ? positiveCount / (positiveCount + negativeCount + 1)
          : 0.5;
      const sentiment =
        score > 0.6 ? "positive" : score < 0.4 ? "negative" : "neutral";

      return {
        source: "Finnhub News API",
        sentiment,
        score,
        confidence: Math.min(1, articles.length / 50),
        articles: articles.length,
        summary: `${positiveCount} positive, ${negativeCount} negative keywords in ${articles.length} articles`
      };
    } catch (error) {
      return null;
    }
  }

  // Alpha Vantage News Sentiment (free tier)
  private async getAlphaVantageNewsSentiment(
    symbol: string
  ): Promise<SourceSentiment | null> {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) {
        return null;
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&symbol=${symbol}&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data["Note"] || data["Information"]) {
        return null; // Rate limited
      }

      const items = data["feed"] || [];
      if (items.length === 0) {
        return null;
      }

      let positiveCount = 0;
      let negativeCount = 0;
      let sentimentSum = 0;

      items.forEach((item: any) => {
        const sentiment = parseFloat(item["overall_sentiment_score"]) || 0.5;
        sentimentSum += sentiment;
        if (sentiment > 0.5) positiveCount++;
        if (sentiment < 0.5) negativeCount++;
      });

      const score =
        items.length > 0 ? sentimentSum / items.length : 0.5;
      const sentiment =
        score > 0.6 ? "positive" : score < 0.4 ? "negative" : "neutral";

      return {
        source: "Alpha Vantage News Sentiment",
        sentiment,
        score,
        confidence: Math.min(1, items.length / 20),
        articles: items.length,
        summary: `Average sentiment score: ${score.toFixed(2)}`
      };
    } catch (error) {
      return null;
    }
  }

  // NewsAPI (already integrated)
  private async getNewsAPISentiment(symbol: string): Promise<SourceSentiment | null> {
    try {
      const sentiment = await sentimentService.getSentiment(symbol);
      if (!sentiment) {
        return null;
      }

      const score =
        sentiment.newsCount > 0
          ? sentiment.positiveNews / sentiment.newsCount
          : 0.5;

      return {
        source: "NewsAPI",
        sentiment:
          sentiment.overallSentiment === "positive"
            ? "positive"
            : sentiment.overallSentiment === "negative"
              ? "negative"
              : "neutral",
        score,
        confidence: Math.min(1, sentiment.newsCount / 50),
        articles: sentiment.newsCount,
        summary: `${sentiment.positiveNews}/${sentiment.newsCount} positive articles`
      };
    } catch (error) {
      return null;
    }
  }

  // RSS Feed Sentiment (Yahoo Finance, Seeking Alpha - completely free)
  private async getRSSSentiment(symbol: string): Promise<SourceSentiment | null> {
    try {
      // Yahoo Finance RSS feed for stock news
      const yahooRSSUrl = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(yahooRSSUrl, { signal: controller.signal } as any);
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const xml = await response.text();

      // Simple XML parsing for titles
      const titleRegex = /<title>([^<]+)<\/title>/g;
      const titles: string[] = [];
      let match;
      while ((match = titleRegex.exec(xml)) !== null) {
        titles.push(match[1]);
      }

      if (titles.length === 0) {
        return null;
      }

      // Sentiment keywords
      let positiveCount = 0;
      let negativeCount = 0;

      titles.forEach(title => {
        const text = title.toLowerCase();
        if (
          text.includes("gain") ||
          text.includes("surge") ||
          text.includes("up") ||
          text.includes("rally")
        )
          positiveCount++;
        if (
          text.includes("fall") ||
          text.includes("down") ||
          text.includes("plunge") ||
          text.includes("loss")
        )
          negativeCount++;
      });

      const score =
        titles.length > 0
          ? positiveCount / (positiveCount + negativeCount + 1)
          : 0.5;
      const sentiment =
        score > 0.6 ? "positive" : score < 0.4 ? "negative" : "neutral";

      return {
        source: "Yahoo Finance RSS",
        sentiment,
        score,
        confidence: Math.min(1, titles.length / 20),
        articles: titles.length,
        summary: `${positiveCount} positive, ${negativeCount} negative mentions`
      };
    } catch (error) {
      return null;
    }
  }
}

export default new MultiSourceSentimentService();
