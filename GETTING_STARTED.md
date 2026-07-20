# Getting Started

## 30-Second Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start backend (Terminal 1)
npm run backend:dev

# 3. Start frontend (Terminal 2)
npm run frontend:dev

# 4. Open browser
# Frontend: http://localhost:3000
# API: http://localhost:5000
```

## What's Included

✅ Full-stack TypeScript application
✅ Mock data (easily swappable for real APIs)
✅ 5 pre-loaded stocks (AAPL, MSFT, GOOGL, TSLA, AMZN)
✅ Technical analysis with RSI, MACD, Bollinger Bands, etc.
✅ News sentiment analysis
✅ AI-powered trading signals
✅ Cloud-ready: Vercel + AWS Lambda
✅ Tailwind CSS styling
✅ Responsive design

## Project Structure

```
stock-signal-app/
├── frontend/          # Next.js React app (port 3000)
├── backend/           # Express API (port 5000)
├── shared/            # Shared TypeScript types
├── docker-compose.yml # Local development
└── docs/              # This documentation
```

## Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Overview & stats |
| Signals | `/signals` | Trading signals dashboard |
| Stocks | `/stocks` | Browse all stocks |
| Portfolio | `/portfolio` | Manage holdings |

## API Endpoints

**Stocks**
- `GET /api/stocks` - All stocks
- `GET /api/stocks/:symbol` - Single stock

**Technical Analysis**
- `GET /api/technical/:symbol` - Indicators

**News & Sentiment**
- `GET /api/sentiment/:symbol` - Sentiment data
- `GET /api/sentiment/:symbol/news` - Latest news

**Trading Signals**
- `GET /api/signals/active` - Active signals
- `GET /api/signals/buy` - Buy signals only
- `GET /api/signals/sell` - Sell signals only

## Key Features

### 1. Stock Data
Pre-loaded with real market cap and fundamentals for:
- Apple (AAPL)
- Microsoft (MSFT)
- Google (GOOGL)
- Tesla (TSLA)
- Amazon (AMZN)

### 2. Technical Indicators
Each stock includes:
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Moving Averages (20, 50, 200 day)
- ADX (Average Directional Index)
- Stochastic Oscillator

### 3. Sentiment Analysis
Real-time news sentiment:
- News articles with sentiment scores
- Positive/negative/neutral breakdown
- Overall sentiment for each stock

### 4. Trading Signals
Generated signals include:
- Signal type: Buy, Sell, Hold
- Confidence level (0-100%)
- Entry, target, and stop-loss prices
- Reasoning (human-readable explanation)
- Technical & sentiment scores

### 5. Portfolio Tracking
Monitor your positions:
- Current values
- Gain/loss tracking
- Performance metrics
- Portfolio allocation

## Customization

### Change Mock Data

Edit `backend/src/data/*.json`:

```bash
# Stocks data
backend/src/data/stocks.json

# Technical indicators
backend/src/data/technical.json

# Sentiment analysis
backend/src/data/sentiment.json

# News articles
backend/src/data/news.json

# Trading signals
backend/src/data/signals.json
```

### Use Real APIs

Replace mock data with real APIs:

1. **AlphaVantage** (stock data & technical indicators)
   ```typescript
   const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
   const url = `https://www.alphavantage.co/query?function=QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
   ```

2. **Finnhub** (stocks & technical)
   ```typescript
   const API_KEY = process.env.FINNHUB_API_KEY;
   const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
   ```

3. **NewsAPI** (news sentiment)
   ```typescript
   const API_KEY = process.env.NEWSAPI_KEY;
   const url = `https://newsapi.org/v2/everything?q=${symbol}&apiKey=${API_KEY}`;
   ```

## Development Commands

```bash
# Start everything
npm run dev

# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Docker development
docker-compose up -d
```

## Environment Variables

### Backend (.env.local)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
USE_MOCK_DATA=true

# Real API keys (when ready to integrate)
ALPHA_VANTAGE_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

### Quick Deployment Checklist

**Frontend to Vercel:**
1. Push to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

**Backend to AWS Lambda:**
1. Install Serverless: `npm install -g serverless`
2. Configure AWS credentials
3. Run `cd backend && npm run build && serverless deploy`
4. Update frontend API URL with Lambda endpoint

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill

# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### API Connection Error

Check:
1. Backend running: `http://localhost:5000/health`
2. Frontend `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. No CORS issues in browser console
4. Restart both servers

### Type Errors

```bash
# Check types across all packages
npm run type-check

# Check specific workspace
npm run type-check --workspace=backend
```

### Missing Dependencies

```bash
# Reinstall all packages
rm -rf node_modules */node_modules
npm install
```

## Next Steps

1. **Explore the code**
   - Check `/frontend/src/app` for page structure
   - Check `/backend/src/routes` for API implementation
   - Review `/shared/src/types` for data models

2. **Customize styling**
   - Edit `frontend/src/app/globals.css`
   - Modify `frontend/tailwind.config.ts`

3. **Add features**
   - Create new pages in `/frontend/src/app`
   - Create new API routes in `/backend/src/routes`
   - Add types to `/shared/src/types`

4. **Integrate real data**
   - Sign up for market data APIs
   - Update services in `/backend/src/services`
   - Keep same response format for frontend compatibility

5. **Deploy to production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Set up continuous deployment
   - Monitor with CloudWatch

## Documentation

- [README.md](./README.md) - Project overview
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup & architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check backend logs: `npm run backend:dev`
4. Check browser console for frontend errors
5. Verify environment variables are set correctly

Happy trading! 📈
