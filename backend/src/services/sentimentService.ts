import { SentimentData, NewsArticle } from "@stock-signal/shared";
import sentimentData from "../data/sentiment.json";
import newsData from "../data/news.json";
import { getNewsAndSentiment, getNews } from "../utils/newsapi";

class SentimentService {
  private mockSentiment: SentimentData[] = sentimentData as SentimentData[];
  private mockNews: NewsArticle[] = newsData as NewsArticle[];

  async getSentiment(symbol: string): Promise<SentimentData | null> {
    const upperSymbol = symbol.toUpperCase();

    // Try real API first
    const realData = await getNewsAndSentiment(upperSymbol);
    if (realData) {
      return {
        symbol: upperSymbol,
        overallSentiment: realData.sentiment.overallSentiment,
        sentimentScore: realData.sentiment.sentimentScore,
        newsCount: realData.sentiment.newsCount,
        positiveNews: realData.sentiment.positiveNews,
        negativeNews: realData.sentiment.negativeNews,
        neutralNews: realData.sentiment.neutralNews,
        lastAnalyzed: new Date().toISOString()
      };
    }

    // Fallback to mock data
    const sentiment = this.mockSentiment.find(s =>
      s.symbol === upperSymbol
    );
    return sentiment as SentimentData | null;
  }

  getAllSentiments(): SentimentData[] {
    return this.mockSentiment as SentimentData[];
  }

  async getNews(symbol: string): Promise<NewsArticle[]> {
    const upperSymbol = symbol.toUpperCase();

    // Try real API first
    const realNews = await getNews(upperSymbol);
    if (realNews && realNews.length > 0) {
      return realNews;
    }

    // Fallback to mock data
    return this.mockNews.filter(n =>
      n.symbol === upperSymbol
    ) as NewsArticle[];
  }

  getAllNews(): NewsArticle[] {
    return this.mockNews as NewsArticle[];
  }

  async getRecentNews(symbol: string, limit: number = 10): Promise<NewsArticle[]> {
    const news = await this.getNews(symbol);
    return news
      .sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }

  // Calculate sentiment score from 0 to 1
  calculateSentimentScore(sentimentData: SentimentData): number {
    const { positiveNews, negativeNews, newsCount } = sentimentData;

    if (newsCount === 0) return 0.5; // Neutral if no news

    const positiveRatio = positiveNews / newsCount;
    const negativeRatio = negativeNews / newsCount;

    // Scale to 0-1: 0 = very negative, 0.5 = neutral, 1 = very positive
    return (positiveRatio - negativeRatio + 1) / 2;
  }
}

export default new SentimentService();
