# Stock Signal Application - Quick Start

## 🚀 One Command Startup

```bash
cd /Users/arunganesan/Documents/workspace/stock-signal-app
npm install
npm start
```

That's it! Both frontend and backend will start automatically.

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 What You Get

✅ Full-stack stock signal analyzer
✅ Technical analysis with RSI (14), SMA (50/200), Momentum
✅ News sentiment scoring
✅ Buy/Sell/Hold signals with confidence breakdown
✅ Pre-loaded with 5 stocks: AAPL, MSFT, GOOGL, TSLA, AMZN
✅ Ready for cloud deployment (Vercel + AWS Lambda)

## 🎯 Core Features Implemented

### 1. Backend API - GET /api/signals/:ticker

**Endpoint**: `GET http://localhost:5000/api/signals/AAPL`

**Response Format**:
```json
{
  "success": true,
  "data": {
    "signal": "buy",
    "confidence": 0.78,
    "breakdown": {
      "technical": {
        "score": 0.75,
        "rsi": {
          "value": 65,
          "interpretation": "Neutral"
        },
        "sma": {
          "interpretation": "Above both moving averages - Uptrend"
        },
        "momentum": {
          "value": 2.45,
          "direction": "Positive"
        },
        "summary": "Strong uptrend with positive momentum"
      },
      "sentiment": {
        "score": 0.82,
        "summary": "Mostly positive sentiment from recent news",
        "newsCount": 45,
        "positiveRatio": 0.62
      },
      "combined": {
        "reasons": [
          "RSI indicates strong momentum",
          "MACD is bullish",
          "Positive news sentiment"
        ],
        "priceTargets": {
          "entry": 189.95,
          "target": 210.00,
          "stopLoss": 175.00
        }
      }
    }
  },
  "timestamp": "2026-07-20T16:00:00Z"
}
```

### 2. Frontend Dashboard

**Location**: http://localhost:3000

**Features**:
- 🔍 Interactive ticker search (AAPL, MSFT, GOOGL, TSLA, AMZN)
- 📊 Real-time technical analysis display
- 📰 Sentiment analysis breakdown
- 🎯 Signal recommendation with confidence
- 💰 Price targets (Entry, Target, Stop Loss)
- 📈 Key reasons for signal

### 3. Technical Indicators

Implemented calculations:
- **RSI (14)**: Relative Strength Index - measures momentum
- **SMA (50/200)**: Simple Moving Averages - trend identification
- **Momentum**: Price change momentum indicator
- **Interpretation**: Automatic signal generation from indicators

### 4. Sentiment Analysis

Mock data with:
- News article count
- Positive/negative news ratio
- Overall sentiment score (0-1)
- Sentiment interpretation

## 🧪 Test the Application

### 1. Test Frontend Dashboard

1. Open http://localhost:3000
2. Enter a ticker: **AAPL**
3. Click "Analyze"
4. See complete signal breakdown with:
   - Buy/Sell/Hold recommendation
   - Confidence level
   - Technical scores
   - Sentiment analysis
   - Price targets

### 2. Test API Directly

```bash
# Test AAPL signal
curl http://localhost:5000/api/signals/AAPL

# Test TSLA signal
curl http://localhost:5000/api/signals/TSLA

# Test MSFT signal
curl http://localhost:5000/api/signals/MSFT

# Get all active signals
curl http://localhost:5000/api/signals/active

# Get buy signals
curl http://localhost:5000/api/signals/buy

# Get sell signals
curl http://localhost:5000/api/signals/sell
```

### 3. Test Other Features

```bash
# Get all stocks
curl http://localhost:5000/api/stocks

# Get specific stock
curl http://localhost:5000/api/stocks/AAPL

# Get technical indicators
curl http://localhost:5000/api/technical/AAPL

# Get sentiment
curl http://localhost:5000/api/sentiment/AAPL

# Get news
curl http://localhost:5000/api/sentiment/AAPL/news

# Health check
curl http://localhost:5000/health
```

## 📁 Project Structure

```
stock-signal-app/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/         # API endpoints (signals, stocks, etc.)
│   │   ├── services/       # Business logic (calculations, analysis)
│   │   ├── utils/          # Technical calculations (RSI, SMA, etc.)
│   │   └── data/           # Mock JSON data
│   └── package.json
│
├── frontend/                # Next.js React dashboard
│   ├── src/
│   │   ├── app/            # Pages and layout
│   │   ├── components/     # React components
│   │   │   ├── SignalDashboard.tsx    # Main ticker search dashboard
│   │   │   ├── SignalCard.tsx         # Signal display
│   │   │   └── StockRow.tsx           # Stock table
│   │   └── lib/            # API client
│   └── package.json
│
└── shared/                  # TypeScript type definitions
    └── src/types/          # Shared interfaces
```

## 🔧 Key Endpoints Explained

### GET /api/signals/:ticker

**The Main Endpoint** - Returns complete signal analysis for a stock ticker.

```bash
curl http://localhost:5000/api/signals/AAPL | jq
```

Returns:
- Signal recommendation (buy/sell/hold)
- Confidence level (0-1)
- Breakdown with technical and sentiment scores
- Key reasons for the signal
- Price targets

### Supported Tickers
- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Google)
- TSLA (Tesla)
- AMZN (Amazon)

## 📊 Data Sources (Mock)

All data is currently mocked for demonstration:

**Stock Data**: `backend/src/data/stocks.json`
- Price, volume, fundamentals
- Easy to swap with AlphaVantage API

**Technical Data**: `backend/src/data/technical.json`
- RSI, MACD, Bollinger Bands
- Easy to swap with Finnhub API

**Sentiment Data**: `backend/src/data/sentiment.json`
- News sentiment scores
- Easy to swap with NewsAPI

**News Articles**: `backend/src/data/news.json`
- Sample articles with sentiment
- Easy to swap with NewsAPI

**Signals**: `backend/src/data/signals.json`
- Pre-generated trading signals
- Auto-generated from technical + sentiment

## 🛠️ Integration Ready

### To Use Real APIs

1. **Stock & Technical Data** → AlphaVantage
   ```typescript
   // Update backend/src/services/stockService.ts
   const response = await fetch(`https://www.alphavantage.co/query?...`);
   ```

2. **News & Sentiment** → NewsAPI
   ```typescript
   // Update backend/src/services/sentimentService.ts
   const response = await fetch(`https://newsapi.org/v2/everything?...`);
   ```

3. **Set API Keys**
   ```bash
   # backend/.env.local
   ALPHA_VANTAGE_API_KEY=your_key_here
   NEWSAPI_KEY=your_key_here
   USE_MOCK_DATA=false
   ```

## ⚠️ Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill

# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Can't Connect Backend from Frontend

Check `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Missing Dependencies

```bash
npm install
npm run build
```

### Clear Everything and Start Fresh

```bash
npm run clean
npm install
npm start
```

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture & development guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed structure
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Getting started guide

## 🚀 Deployment

### Deploy Frontend to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set NEXT_PUBLIC_API_URL environment variable in Vercel dashboard
```

### Deploy Backend to AWS Lambda

```bash
# Install Serverless
npm install -g serverless

# Configure AWS credentials
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET

# Deploy
cd backend
npm run build
serverless deploy --region us-east-1
```

## 📈 Next Steps

1. ✅ **Explore**: Run `npm start` and test the dashboard
2. ✅ **Customize**: Modify `backend/src/data/*.json` to change data
3. ✅ **Enhance**: Add real API integrations
4. ✅ **Deploy**: Push to Vercel + AWS

## 💡 Tips

- Frontend hot-reloads on code changes
- Backend requires restart on code changes
- All timestamps are in ISO 8601 format
- Confidence scores range from 0 to 1
- Use `?confidence=0.8` query param to filter high-confidence signals

---

**Happy trading!** 📈

For questions, check the documentation or review the code comments.
