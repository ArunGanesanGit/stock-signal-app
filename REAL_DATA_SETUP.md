# Real-Time Data Integration Setup

The app now supports real-time data from AlphaVantage and NewsAPI, with automatic fallback to mock data if APIs are unavailable.

## ✨ Features

✅ **Real-time Stock Prices** - From AlphaVantage
✅ **Real News & Sentiment** - From NewsAPI  
✅ **Automatic Fallback** - Uses mock data if APIs fail
✅ **Sentiment Analysis** - AI-powered keyword analysis
✅ **Rate Limiting** - Handles API rate limits gracefully

---

## 🔑 Get Free API Keys

### 1. AlphaVantage (Stock Data)

**Website**: https://www.alphavantage.co/

**Steps**:
1. Go to the website
2. Click **"GET FREE API KEY"**
3. Enter your email
4. You'll get an API key immediately
5. Copy it

**Features**:
- Real-time stock quotes
- Technical indicators (RSI, MACD, etc.)
- Intraday data
- Free tier: 5 requests per minute, 100 per day

### 2. NewsAPI (News & Sentiment)

**Website**: https://newsapi.org/

**Steps**:
1. Go to the website  
2. Click **"Get API Key"**
3. Sign up for free (email + password)
4. Verify email
5. Go to Dashboard → Copy your API key

**Features**:
- Real-time news articles
- News by symbol
- Sentiment analysis
- Free tier: 100 requests per day

---

## 📝 Add Keys to Your App

Once you have both keys:

### Option 1: Edit .env.local (Easiest)

Edit `backend/.env.local`:

```env
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Add your API keys here
ALPHA_VANTAGE_API_KEY=your_alphavantage_key_here
NEWSAPI_KEY=your_newsapi_key_here

USE_MOCK_DATA=false
```

### Option 2: Set Environment Variables

```bash
export ALPHA_VANTAGE_API_KEY=your_key_here
export NEWSAPI_KEY=your_key_here
npm start
```

---

## 🚀 Start the App

```bash
cd /Users/arunganesan/Documents/workspace/stock-signal-app
npm start
```

**Now it will use:**
- ✅ Real stock prices from AlphaVantage
- ✅ Real news from NewsAPI
- ✅ AI sentiment analysis
- ✅ Falls back to mock if APIs are down

---

## 🔄 How It Works

### Without API Keys (Mock Data)
```
User → Frontend → Backend → Mock JSON Files
```

### With API Keys (Real Data)
```
User → Frontend → Backend → AlphaVantage API + NewsAPI → Real Data
                         ↓ (falls back if API fails)
                    Mock JSON Files
```

---

## ⚙️ Customization

### Change API Rate Limit Behavior

Edit `backend/src/utils/alphavantage.ts` and `backend/src/utils/newsapi.ts` to add:
- Caching
- Retry logic
- Rate limiting

### Improve Sentiment Analysis

Edit `backend/src/utils/newsapi.ts` - `analyzeSentiment()` function:
```typescript
// Add more keywords or use ML model
function analyzeSentiment(text: string) {
  // Currently uses keyword matching
  // Can be enhanced with: 
  // - More keywords
  // - ML sentiment model
  // - Score weighting
}
```

---

## 📊 Supported Stocks

By default, the app tracks:
- **AAPL** - Apple
- **MSFT** - Microsoft
- **GOOGL** - Google
- **TSLA** - Tesla
- **AMZN** - Amazon

You can add more by modifying the routes or stock service.

---

## 🐛 Troubleshooting

### "Failed to fetch" error
- Check if `.env.local` exists in backend folder
- Verify API keys are correct
- Check network connectivity
- App will use mock data automatically if APIs fail

### Rate limit hit
- Wait a few minutes before next request
- AlphaVantage: 5 requests/minute free tier
- NewsAPI: 100 requests/day free tier

### Real data not showing
- Check browser console for errors
- Verify API keys in `.env.local`
- Check backend logs for API responses
- App falls back to mock data if anything fails

---

## 🎯 Next Steps

1. ✅ Get API keys from AlphaVantage and NewsAPI
2. ✅ Add them to `backend/.env.local`
3. ✅ Run `npm start`
4. ✅ Visit http://localhost:3005 (or whatever port)
5. ✅ You now have real-time data!

---

## 📚 API Documentation

- [AlphaVantage Docs](https://www.alphavantage.co/documentation/)
- [NewsAPI Docs](https://newsapi.org/docs)

---

**Happy Trading! 📈**
