# Development Guide

## Project Overview

Stock Signal is a full-stack application for generating trading signals based on technical analysis and news sentiment.

### Architecture

```
stock-signal-app/
├── shared/              # Shared TypeScript types and utilities
├── backend/             # Express API server (Node.js)
├── frontend/            # Next.js React application
└── docker-compose.yml   # Local development with Docker
```

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional, for containerized development)

### Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env.local
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start development servers (two terminals)**
   ```bash
   # Terminal 1: Backend
   npm run backend:dev
   
   # Terminal 2: Frontend
   npm run frontend:dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

### Docker Setup

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

### Backend (`/backend`)

**Key Files:**
- `src/index.ts` - Entry point
- `src/app.ts` - Express configuration
- `src/routes/` - API route handlers
- `src/services/` - Business logic
- `src/data/` - Mock data files (easily swappable)

**Mock Data Files:**
- `stocks.json` - Stock price and fundamental data
- `technical.json` - Technical indicators (RSI, MACD, etc.)
- `sentiment.json` - News sentiment scores
- `news.json` - Sample news articles
- `signals.json` - Trading signals

**API Endpoints:**
```
GET  /api/stocks                    # All stocks
GET  /api/stocks/:symbol            # Stock by symbol
GET  /api/technical/:symbol         # Technical indicators
GET  /api/sentiment/:symbol         # Sentiment data
GET  /api/sentiment/:symbol/news    # News for symbol
GET  /api/signals/active            # All active signals
GET  /api/signals/buy               # Buy signals
GET  /api/signals/sell              # Sell signals
GET  /api/signals/high-confidence   # High confidence signals
```

### Frontend (`/frontend`)

**Key Files:**
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Home page
- `src/app/signals/page.tsx` - Signals dashboard
- `src/app/stocks/page.tsx` - Stock browser
- `src/app/portfolio/page.tsx` - Portfolio tracker
- `src/lib/api.ts` - API client wrapper
- `src/components/` - Reusable components

**Styling:**
- Tailwind CSS for utility-first styling
- Global styles in `src/app/globals.css`
- Dark mode support via `@media (prefers-color-scheme: dark)`

### Shared Types (`/shared`)

All TypeScript types are defined in the shared package:
- `types/stock.ts` - Stock data models
- `types/api.ts` - API response types

## Development Workflow

### Adding a New API Endpoint

1. **Update shared types** (if needed)
   ```typescript
   // shared/src/types/stock.ts
   export interface NewData {
     // fields
   }
   ```

2. **Create/update service**
   ```typescript
   // backend/src/services/newService.ts
   class NewService {
     getData(): NewData[] {
       // implementation
     }
   }
   export default new NewService();
   ```

3. **Add route**
   ```typescript
   // backend/src/routes/new.ts
   router.get("/", (req, res) => {
     const data = newService.getData();
     res.json({ success: true, data, timestamp: new Date().toISOString() });
   });
   ```

4. **Register in app.ts**
   ```typescript
   import newRoutes from "./routes/new";
   app.use("/api/new", newRoutes);
   ```

### Adding a Frontend Component

1. **Create component**
   ```typescript
   // frontend/src/components/NewComponent.tsx
   export default function NewComponent() {
     return <div>Component</div>;
   }
   ```

2. **Use in pages**
   ```typescript
   import NewComponent from "@/components/NewComponent";
   ```

### Testing Data

All data comes from mock JSON files in `backend/src/data/`. To swap for real APIs:

1. Update the service to fetch from real source
2. Configure API keys in `.env`
3. Keep the same response format for compatibility

Example:
```typescript
// Before (mock data)
const technicalData = require("../data/technical.json");

// After (real API)
const response = await fetch(`https://api.example.com/technical/${symbol}`, {
  headers: { "Authorization": `Bearer ${process.env.API_KEY}` }
});
```

## Deployment

### Frontend (Vercel)

1. **Connect repository to Vercel**
   ```bash
   vercel deploy
   ```

2. **Set environment variables**
   - `NEXT_PUBLIC_API_URL` → Backend API URL

3. **Configure build settings**
   - Build command: `npm run build`
   - Output directory: `.next`

### Backend (AWS Lambda)

#### Option 1: Serverless Framework

```bash
# Install serverless
npm install -g serverless

# Deploy
cd backend
npm run build
serverless deploy
```

#### Option 2: AWS SAM

```bash
# Install AWS SAM
brew install aws-sam-cli

# Build and deploy
cd backend
sam build
sam deploy --guided
```

#### Option 3: AWS Console

1. Create Lambda function from console
2. Upload `backend/dist` as zip
3. Set environment variables
4. Configure API Gateway trigger

## Type Safety

Run type checking:
```bash
npm run type-check

# Or specific workspaces
npm run type-check --workspace=backend
npm run type-check --workspace=frontend
```

## Linting

```bash
npm run lint

# Fix issues
npm run lint -- --fix
```

## Common Issues

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Backend CORS middleware allows frontend origin

### API connection errors
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env`
- Check logs: `npm run backend:dev` and `npm run frontend:dev`

### Type errors
- Run `npm run type-check` to identify issues
- Ensure shared types are exported and imported correctly
- Check shared package is built: `npm run build --workspace=shared`

## Performance Tips

1. **Enable SWR caching** in components
2. **Use React.memo** for expensive components
3. **Optimize images** in frontend
4. **Implement pagination** for large datasets
5. **Cache** API responses with appropriate TTLs

## Next Steps

1. **Integrate real data sources**
   - AlphaVantage for stock data
   - Finnhub for technical indicators
   - NewsAPI for news sentiment

2. **Add user authentication**
   - Implement login/signup
   - Store user watchlists and portfolios

3. **Enhanced signal generation**
   - Machine learning models
   - More sophisticated indicator combinations
   - Historical signal performance tracking

4. **Mobile app**
   - React Native or Flutter
   - Share business logic with web backend

5. **Database integration**
   - PostgreSQL for persistent data
   - Store historical signals and backtest results
