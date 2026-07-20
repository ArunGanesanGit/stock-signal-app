# 📈 Stock Signal Application

A production-ready full-stack application that synthesizes technical analysis and news sentiment to generate actionable trading signals.

## ✨ Features

✅ **Interactive Dashboard** - Search any stock ticker and get instant signals
✅ **Technical Analysis** - RSI (14), SMA (50/200), Momentum indicators
✅ **Sentiment Analysis** - Real-time news sentiment scoring
✅ **Signal Generation** - Buy/Sell/Hold with confidence breakdown
✅ **API Endpoints** - RESTful API with `/api/signals/:ticker`
✅ **Cloud Ready** - Deployment configs for Vercel + AWS Lambda
✅ **TypeScript** - Full type safety across frontend and backend
✅ **Mock Data** - Pre-loaded with 5 stocks, easily swappable for real APIs

## 🚀 Quick Start

### One Command Startup

```bash
cd stock-signal-app
npm install
npm start
```

**That's it!** Both frontend and backend start automatically.

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:5000
- 📊 **Health Check**: http://localhost:5000/health

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🎯 Test It Out

### 1. Open Frontend Dashboard
- Visit http://localhost:3000
- Enter ticker: **AAPL**
- See Buy/Sell/Hold signal with breakdown

### 2. Test API Endpoints
```bash
# Get signal for a stock
curl http://localhost:5000/api/signals/AAPL | jq

# Get all active signals
curl http://localhost:5000/api/signals/active | jq

# Get buy signals
curl http://localhost:5000/api/signals/buy | jq
```

### 3. Run Test Script
```bash
chmod +x test-api.sh
./test-api.sh
```

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Dashboard & UI |
| **Backend** | Express.js, TypeScript, Node.js 18 | REST API |
| **Styling** | Tailwind CSS | Responsive design |
| **Data** | Mock JSON | Pre-loaded stocks |
| **Frontend Deploy** | Vercel | Production hosting |
| **Backend Deploy** | AWS Lambda | Serverless API |

## 📁 Project Structure

```
stock-signal-app/
├── frontend/                    # Next.js React app
│   ├── src/app/                # Pages (/, /signals, /stocks, /portfolio)
│   ├── src/components/         # React components
│   │   └── SignalDashboard.tsx # Main ticker analysis component
│   └── src/lib/api.ts          # API client wrapper
│
├── backend/                     # Express API server
│   ├── src/routes/             # API endpoints
│   │   └── signals.ts          # GET /api/signals/:ticker
│   ├── src/services/           # Business logic (calculations, analysis)
│   ├── src/utils/              # Technical calculations (RSI, SMA, etc.)
│   └── src/data/               # Mock data (stocks, indicators, sentiment)
│
└── shared/                      # Shared TypeScript types
    └── src/types/              # Interfaces for type safety
```

## 🔌 API Endpoints

### Primary Endpoint

**GET** `/api/signals/:ticker`

Returns comprehensive signal analysis with technical and sentiment breakdown.

```bash
curl http://localhost:5000/api/signals/AAPL | jq
```

**Response**:
```json
{
  "success": true,
  "data": {
    "signal": "buy",
    "confidence": 0.78,
    "breakdown": {
      "technical": {
        "score": 0.75,
        "rsi": { "value": 65, "interpretation": "Neutral" },
        "sma": { "interpretation": "Above both moving averages - Uptrend" },
        "momentum": { "value": 2.45, "direction": "Positive" }
      },
      "sentiment": {
        "score": 0.82,
        "summary": "Mostly positive sentiment from recent news",
        "newsCount": 45,
        "positiveRatio": 0.62
      },
      "combined": {
        "reasons": ["RSI indicates momentum", "Positive news sentiment"],
        "priceTargets": {
          "entry": 189.95,
          "target": 210.00,
          "stopLoss": 175.00
        }
      }
    }
  }
}
```

### Other Endpoints

- `GET /api/signals/active` - All active signals
- `GET /api/signals/buy` - Buy signals only
- `GET /api/signals/sell` - Sell signals only
- `GET /api/signals/high-confidence` - High confidence signals
- `GET /api/stocks` - All stocks
- `GET /api/stocks/:symbol` - Specific stock
- `GET /api/technical/:symbol` - Technical indicators
- `GET /api/sentiment/:symbol` - Sentiment analysis
- `GET /api/sentiment/:symbol/news` - News articles

**Full documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Test with Mock Data

Pre-loaded stocks:
- **AAPL** - Apple
- **MSFT** - Microsoft
- **GOOGL** - Google
- **TSLA** - Tesla
- **AMZN** - Amazon

All data is mocked. Easy to integrate real APIs (AlphaVantage, Finnhub, NewsAPI).

## 🔧 Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env.local)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
USE_MOCK_DATA=true
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set NEXT_PUBLIC_API_URL in Vercel dashboard
```

### Backend (AWS Lambda)
```bash
# Install Serverless
npm install -g serverless

# Configure AWS
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET

# Deploy
cd backend
npm run build
serverless deploy --region us-east-1
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 30-second setup & testing |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development guide & architecture |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Detailed project structure |

## 🛠️ Development Commands

```bash
# Start everything (dev mode)
npm start

# Or separately:
npm run backend:dev    # Terminal 1: Start backend on :5000
npm run frontend:dev   # Terminal 2: Start frontend on :3000

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Clean build artifacts
npm run clean

# Docker development
docker-compose up -d
```

## 🔄 Integrate Real APIs

### To use AlphaVantage for stocks
```typescript
// backend/src/services/stockService.ts
const response = await fetch(`https://www.alphavantage.co/query?...`);
```

### To use NewsAPI for sentiment
```typescript
// backend/src/services/sentimentService.ts
const response = await fetch(`https://newsapi.org/v2/everything?...`);
```

### Set API Keys
```env
ALPHA_VANTAGE_API_KEY=your_key
NEWSAPI_KEY=your_key
USE_MOCK_DATA=false
```

## 📈 What's Included

### Technical Indicators
- **RSI (14)** - Relative Strength Index for momentum
- **SMA (50/200)** - Simple Moving Averages for trend
- **Momentum** - Price change momentum
- **MACD** - Convergence/Divergence indicator
- **Bollinger Bands** - Volatility bands
- **ADX** - Trend strength

### Sentiment Analysis
- News article sentiment scoring
- Positive/negative/neutral ratio
- Overall sentiment calculation
- Sample news articles with scores

### Signal Generation
- Buy/Sell/Hold recommendations
- Confidence scores (0-1)
- Detailed breakdown of technical and sentiment factors
- Price targets (entry, target, stop loss)
- Key reasons for the signal

## ⚙️ Customization

### Change Mock Data
Edit JSON files in `backend/src/data/`:
- `stocks.json` - Stock prices & fundamentals
- `technical.json` - Technical indicators
- `sentiment.json` - News sentiment
- `news.json` - News articles
- `signals.json` - Generated signals

### Modify Frontend
- Pages: `frontend/src/app/`
- Components: `frontend/src/components/`
- Styles: `frontend/src/app/globals.css`

### Modify Backend
- Routes: `backend/src/routes/`
- Services: `backend/src/services/`
- Calculations: `backend/src/utils/`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill

# Kill port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Can't Connect to Backend
Check `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Missing Dependencies
```bash
npm install
npm run build
npm start
```

### API Returns 404
Make sure ticker is uppercase: AAPL not aapl
Supported tickers: AAPL, MSFT, GOOGL, TSLA, AMZN

## 📝 License

MIT License - Free to use for personal and commercial projects

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests.

## 📞 Support

- Check [QUICKSTART.md](./QUICKSTART.md) for setup issues
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API questions
- Review code comments in `backend/src/` and `frontend/src/`

---

**Ready to trade?** Run `npm install && npm start` and head to http://localhost:3000 🚀
