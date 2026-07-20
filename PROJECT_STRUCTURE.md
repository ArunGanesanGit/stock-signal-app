# Project Structure

```
stock-signal-app/
│
├── frontend/                          # Next.js React Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout with navigation
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── signals/
│   │   │   │   └── page.tsx          # Signals dashboard
│   │   │   ├── stocks/
│   │   │   │   └── page.tsx          # Stock browser
│   │   │   └── portfolio/
│   │   │       └── page.tsx          # Portfolio tracker
│   │   ├── components/
│   │   │   ├── SignalCard.tsx        # Signal display component
│   │   │   └── StockRow.tsx          # Stock table row
│   │   └── lib/
│   │       └── api.ts                # API client wrapper
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── next.config.js                # Next.js config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── .env.example                  # Example env vars
│   ├── vercel.json                   # Vercel deployment config
│   └── Dockerfile                    # Docker image for frontend
│
├── backend/                           # Express.js API Server
│   ├── src/
│   │   ├── index.ts                  # Entry point
│   │   ├── app.ts                    # Express app setup
│   │   ├── handler.ts                # AWS Lambda handler
│   │   ├── routes/
│   │   │   ├── stock.ts              # Stock routes
│   │   │   ├── technical.ts          # Technical analysis routes
│   │   │   ├── sentiment.ts          # Sentiment routes
│   │   │   └── signals.ts            # Trading signal routes
│   │   ├── services/
│   │   │   ├── stockService.ts       # Stock business logic
│   │   │   ├── technicalService.ts   # Technical indicators logic
│   │   │   ├── sentimentService.ts   # Sentiment analysis logic
│   │   │   └── signalService.ts      # Signal generation logic
│   │   └── data/
│   │       ├── stocks.json           # Stock mock data
│   │       ├── technical.json        # Technical indicators mock data
│   │       ├── sentiment.json        # Sentiment mock data
│   │       ├── news.json             # News articles mock data
│   │       └── signals.json          # Trading signals mock data
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── .env.example                  # Example env vars
│   ├── serverless.yml                # Serverless Framework config
│   ├── template.yaml                 # AWS SAM template
│   ├── Dockerfile                    # Docker image for backend
│   └── Makefile                      # Build commands
│
├── shared/                            # Shared TypeScript Types
│   ├── src/
│   │   ├── types/
│   │   │   ├── stock.ts              # Stock-related types
│   │   │   └── api.ts                # API response types
│   │   └── index.ts                  # Exports
│   ├── package.json                  # Dependencies
│   └── tsconfig.json                 # TypeScript config
│
├── Documentation
│   ├── README.md                     # Project overview
│   ├── GETTING_STARTED.md            # Quick start guide
│   ├── DEVELOPMENT.md                # Development guide
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── PROJECT_STRUCTURE.md          # This file
│
├── Configuration
│   ├── docker-compose.yml            # Docker Compose setup
│   ├── .gitignore                    # Git ignore patterns
│   ├── .eslintrc.json                # ESLint configuration
│   ├── package.json                  # Monorepo root config
│   └── tsconfig.json                 # Root TypeScript config
│
└── GitHub/CI-CD
    └── .github/workflows/
        └── deploy.yml                # GitHub Actions deployment (optional)
```

## Directory Details

### `/frontend` - React Application
- **Purpose**: User-facing web application
- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Type**: Full-stack TypeScript

**Key Pages:**
- `/` - Home with statistics
- `/signals` - Trading signals dashboard with filtering
- `/stocks` - Stock browser with sorting
- `/portfolio` - Portfolio tracker with P&L

**Key Components:**
- `SignalCard` - Displays individual trading signals
- `StockRow` - Stock data table row

### `/backend` - API Server
- **Purpose**: RESTful API for data and signals
- **Framework**: Express.js
- **Language**: TypeScript
- **Data**: Mock JSON (swappable for real APIs)
- **Deployment**: AWS Lambda (Serverless or SAM)

**API Routes:**
```
/api/stocks/          - Stock operations
/api/technical/       - Technical indicators
/api/sentiment/       - News sentiment
/api/signals/         - Trading signals
```

**Services:**
- `StockService` - Stock data management
- `TechnicalService` - Technical analysis calculations
- `SentimentService` - Sentiment scoring
- `SignalService` - Signal generation

### `/shared` - Shared Types
- **Purpose**: Centralized TypeScript type definitions
- **Usage**: Imported by both frontend and backend
- **Types**: 
  - `StockData` - Stock information
  - `TechnicalIndicators` - Technical analysis data
  - `SentimentData` - News sentiment
  - `NewsArticle` - News items
  - `TradingSignal` - Trading recommendations
  - `PortfolioItem` - Holdings

## Mock Data Files

Each data file can be easily replaced with real API calls:

### `stocks.json`
```json
[
  {
    "symbol": "AAPL",
    "price": 189.95,
    "change": 2.45,
    "changePercent": 1.31,
    ...
  }
]
```

### `technical.json`
```json
[
  {
    "symbol": "AAPL",
    "rsi": 65,
    "macd": { "value": 2.34, "signal": 1.89, ... },
    ...
  }
]
```

### `sentiment.json`
```json
[
  {
    "symbol": "AAPL",
    "overallSentiment": "positive",
    "sentimentScore": 0.72,
    ...
  }
]
```

### `news.json`
```json
[
  {
    "id": "news-1",
    "symbol": "AAPL",
    "title": "Apple reports strong earnings",
    "sentiment": "positive",
    ...
  }
]
```

### `signals.json`
```json
[
  {
    "id": "signal-1",
    "symbol": "AAPL",
    "signal": "buy",
    "confidence": 0.78,
    ...
  }
]
```

## Configuration Files

### Package Management
- **Root `package.json`** - Monorepo workspace configuration
- **Workspaces**: frontend, backend, shared
- **Scripts**: Run commands across all packages

### TypeScript
- **Root `tsconfig.json`** - Base configuration
- **Package-specific**: Each package has its own tsconfig
- **Strict mode**: Enabled for type safety

### Docker
- **docker-compose.yml** - Local development with services
- **Dockerfiles** - Individual container images for frontend/backend

### Environment Variables
- **`.env.example` files** - Template for required variables
- **`.env.local`** - Not committed to git

### Linting
- **.eslintrc.json** - ESLint rules
- **Monorepo support** - Configuration applies to all packages

## Development Workflow

```
Code Change
    ↓
Local Development (npm run dev)
    ↓
Type Checking (npm run type-check)
    ↓
Linting (npm run lint)
    ↓
Git Commit
    ↓
Push to Repository
    ↓
CI/CD Pipeline (GitHub Actions)
    ↓
Frontend Deploy (Vercel)
    ↓
Backend Deploy (AWS Lambda)
```

## Key Technologies

### Frontend
- **Next.js** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **SWR** - Data fetching library
- **React Hooks** - State management

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **AWS Lambda** - Serverless deployment
- **Serverless Framework** - Deployment tool

### Shared
- **TypeScript** - Centralized type definitions
- **NPM Workspaces** - Monorepo management

### Infrastructure
- **Vercel** - Frontend hosting
- **AWS Lambda** - Serverless backend
- **AWS API Gateway** - REST API endpoint
- **AWS CloudWatch** - Logging & monitoring
- **Docker** - Containerization

## File Size Overview

```
Total Size: ~500 KB (without node_modules)
- Source code: ~50 KB
- Configuration: ~10 KB
- Documentation: ~40 KB
- Data files: ~20 KB
```

## Dependencies Summary

### Frontend Dependencies
- next@14+
- react@18+
- tailwindcss@3+
- swr@2+

### Backend Dependencies
- express@4+
- cors@2+
- dotenv@16+

### Dev Dependencies
- typescript@5+
- @typescript-eslint/*
- eslint@8+

## Next Steps

1. **Explore Documentation**
   - Read [GETTING_STARTED.md](./GETTING_STARTED.md) for quickstart
   - Read [DEVELOPMENT.md](./DEVELOPMENT.md) for architecture
   - Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production

2. **Start Development**
   - `npm install` - Install dependencies
   - `npm run dev` - Start both servers
   - Open http://localhost:3000

3. **Customize**
   - Modify data in `/backend/src/data`
   - Add new pages in `/frontend/src/app`
   - Create new API routes in `/backend/src/routes`

4. **Deploy**
   - Push to GitHub
   - Deploy frontend to Vercel
   - Deploy backend to AWS Lambda
