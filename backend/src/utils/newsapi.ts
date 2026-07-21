// NewsAPI Integration for real-time news and sentiment analysis

const BASE_URL = "https://newsapi.org/v2";

function getApiKey() {
  return process.env.NEWSAPI_KEY;
}

interface NewsArticle {
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

interface SentimentResult {
  overallSentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  newsCount: number;
  positiveNews: number;
  negativeNews: number;
  neutralNews: number;
}

// Simple sentiment analysis using keyword matching
function analyzeSentiment(text: string): { sentiment: "positive" | "neutral" | "negative"; score: number } {
  const positiveKeywords = [
    "surge",
    "jump",
    "rally",
    "gain",
    "profit",
    "strong",
    "beat",
    "growth",
    "increase",
    "bullish",
    "success",
    "excellent"
  ];
  const negativeKeywords = [
    "drop",
    "fall",
    "crash",
    "loss",
    "decline",
    "weak",
    "miss",
    "bearish",
    "down",
    "negative",
    "struggling",
    "concern"
  ];

  const lowerText = text.toLowerCase();
  let score = 0;

  positiveKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) score += 0.1;
  });

  negativeKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) score -= 0.1;
  });

  // Clamp score between -1 and 1
  score = Math.max(-1, Math.min(1, score));

  let sentiment: "positive" | "neutral" | "negative";
  if (score > 0.2) sentiment = "positive";
  else if (score < -0.2) sentiment = "negative";
  else sentiment = "neutral";

  // Convert to 0-1 scale for consistency
  const normalizedScore = (score + 1) / 2;

  return { sentiment, score: normalizedScore };
}

export async function getNewsAndSentiment(
  symbol: string,
  limit: number = 20
): Promise<{ articles: NewsArticle[]; sentiment: SentimentResult } | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn(`NewsAPI key not set for ${symbol}, returning null`);
    return null;
  }
  console.log(`Fetching news for ${symbol} with NewsAPI`);

  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${symbol}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error(`NewsAPI returned status ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return null;
    }

    const articles: NewsArticle[] = data.articles.map((article: any, index: number) => {
      const { sentiment, score } = analyzeSentiment(article.title + " " + (article.description || ""));
      return {
        id: `news-${index}`,
        symbol,
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        summary: article.description || article.title,
        sentiment,
        sentimentScore: score
      };
    });

    // Calculate aggregate sentiment
    const positiveCount = articles.filter(a => a.sentiment === "positive").length;
    const negativeCount = articles.filter(a => a.sentiment === "negative").length;
    const neutralCount = articles.filter(a => a.sentiment === "neutral").length;

    const averageScore = articles.reduce((sum, a) => sum + a.sentimentScore, 0) / articles.length;

    let overallSentiment: "positive" | "neutral" | "negative";
    if (positiveCount > negativeCount) overallSentiment = "positive";
    else if (negativeCount > positiveCount) overallSentiment = "negative";
    else overallSentiment = "neutral";

    return {
      articles,
      sentiment: {
        overallSentiment,
        sentimentScore: averageScore,
        newsCount: articles.length,
        positiveNews: positiveCount,
        negativeNews: negativeCount,
        neutralNews: neutralCount
      }
    };
  } catch (error) {
    console.error("NewsAPI error:", error);
  }

  return null;
}

export async function getNews(symbol: string, limit: number = 10): Promise<NewsArticle[] | null> {
  const result = await getNewsAndSentiment(symbol, limit);
  return result?.articles || null;
}
