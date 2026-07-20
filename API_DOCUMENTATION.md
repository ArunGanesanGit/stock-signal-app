# Stock Signal API Documentation

## Base URL

Development: `http://localhost:5000`
Production: `https://your-api-domain.com`

## Authentication

No authentication required for current implementation. Add API keys in production.

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if API is running.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 2. Signal Analysis (PRIMARY ENDPOINT)

**GET** `/api/signals/:ticker`

Get comprehensive trading signal analysis for a stock ticker with breakdown of technical and sentiment analysis.

**Parameters**:
- `ticker` (path, required): Stock symbol (AAPL, MSFT, GOOGL, TSLA, AMZN)

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

**Example**:
```bash
curl http://localhost:5000/api/signals/AAPL | jq
```

---

### 3. Active Signals

**GET** `/api/signals/active`

Get all currently active trading signals.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "signal-1",
      "symbol": "AAPL",
      "signal": "buy",
      "confidence": 0.78,
      "technicalScore": 0.75,
      "sentimentScore": 0.82,
      "reasons": [...],
      "entryPrice": 189.95,
      "targetPrice": 210.00,
      "stopLoss": 175.00,
      "createdAt": "2026-07-20T16:00:00Z",
      "expiresAt": "2026-07-27T16:00:00Z"
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 4. Buy Signals

**GET** `/api/signals/buy`

Get all active buy signals.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "signal-1",
      "symbol": "AAPL",
      "signal": "buy",
      ...
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 5. Sell Signals

**GET** `/api/signals/sell`

Get all active sell signals.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "signal-3",
      "symbol": "GOOGL",
      "signal": "sell",
      ...
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 6. High Confidence Signals

**GET** `/api/signals/high-confidence`

Get signals with confidence above threshold.

**Parameters**:
- `confidence` (query, optional): Minimum confidence (0-1, default: 0.7)

**Example**:
```bash
curl "http://localhost:5000/api/signals/high-confidence?confidence=0.8"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "signal-2",
      "symbol": "TSLA",
      "signal": "buy",
      "confidence": 0.82,
      ...
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 7. All Stocks

**GET** `/api/stocks`

Get data for all tracked stocks.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "price": 189.95,
      "change": 2.45,
      "changePercent": 1.31,
      "volume": 52340000,
      "high52Week": 199.62,
      "low52Week": 124.17,
      "marketCap": 2890000000000,
      "pe": 32.5,
      "eps": 5.85,
      "lastUpdated": "2026-07-20T16:00:00Z"
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 8. Stock Detail

**GET** `/api/stocks/:symbol`

Get data for a specific stock.

**Parameters**:
- `symbol` (path, required): Stock symbol (AAPL, MSFT, GOOGL, TSLA, AMZN)

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 189.95,
    ...
  },
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 9. Technical Indicators

**GET** `/api/technical/:symbol`

Get technical indicators for a stock.

**Parameters**:
- `symbol` (path, required): Stock symbol

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "rsi": 65,
    "macd": {
      "value": 2.34,
      "signal": 1.89,
      "histogram": 0.45
    },
    "bollingerBands": {
      "upper": 198.50,
      "middle": 185.25,
      "lower": 172.00
    },
    "movingAverages": {
      "ma20": 186.40,
      "ma50": 182.10,
      "ma200": 168.50
    },
    "adx": 42,
    "stochastic": {
      "k": 72,
      "d": 68
    },
    "timestamp": "2026-07-20T16:00:00Z"
  },
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 10. Sentiment Analysis

**GET** `/api/sentiment/:symbol`

Get news sentiment analysis for a stock.

**Parameters**:
- `symbol` (path, required): Stock symbol

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "overallSentiment": "positive",
    "sentimentScore": 0.72,
    "newsCount": 45,
    "positiveNews": 28,
    "negativeNews": 8,
    "neutralNews": 9,
    "lastAnalyzed": "2026-07-20T15:30:00Z"
  },
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

### 11. News Articles

**GET** `/api/sentiment/:symbol/news`

Get latest news articles and sentiment for a stock.

**Parameters**:
- `symbol` (path, required): Stock symbol
- `limit` (query, optional): Number of articles to return (default: 10, max: 50)

**Example**:
```bash
curl "http://localhost:5000/api/sentiment/AAPL/news?limit=5"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "news-1",
      "symbol": "AAPL",
      "title": "Apple reports record quarterly revenue driven by iPhone sales",
      "source": "Bloomberg",
      "url": "https://bloomberg.com/news/articles/...",
      "publishedAt": "2026-07-20T14:30:00Z",
      "summary": "Apple exceeded analyst expectations...",
      "sentiment": "positive",
      "sentimentScore": 0.85
    }
  ],
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

## Error Responses

### 404 Not Found

```json
{
  "success": false,
  "error": "No signal data available for INVALID",
  "timestamp": "2026-07-20T16:00:00Z"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid ticker symbol",
  "timestamp": "2026-07-20T16:00:00Z"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2026-07-20T16:00:00Z"
}
```

---

## Data Types

### Signal Type
```typescript
type Signal = "buy" | "sell" | "hold"
```

### Sentiment Type
```typescript
type Sentiment = "positive" | "neutral" | "negative"
```

### Confidence Score
```typescript
// 0 to 1 (0% to 100%)
confidence: number
```

---

## Available Stocks

The API currently supports these tickers:

| Symbol | Company |
|--------|---------|
| AAPL | Apple |
| MSFT | Microsoft |
| GOOGL | Google/Alphabet |
| TSLA | Tesla |
| AMZN | Amazon |

---

## Rate Limiting

No rate limiting currently implemented. Add in production environment.

---

## CORS

CORS is enabled for frontend on `localhost:3000`. Configure in production:

```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Testing

### Using cURL

```bash
# Get AAPL signal
curl http://localhost:5000/api/signals/AAPL | jq

# Get all buy signals
curl http://localhost:5000/api/signals/buy | jq

# Get high confidence signals
curl "http://localhost:5000/api/signals/high-confidence?confidence=0.8" | jq
```

### Using Node.js

```javascript
const response = await fetch('http://localhost:5000/api/signals/AAPL');
const data = await response.json();
console.log(data);
```

### Using Python

```python
import requests
response = requests.get('http://localhost:5000/api/signals/AAPL')
data = response.json()
print(data)
```

---

## Integration Guide

### With React/Next.js

```typescript
import { fetchAPI } from "@/lib/api";

const signal = await fetchAPI('/api/signals/AAPL');
```

### With Vue.js

```javascript
const response = await fetch('http://localhost:5000/api/signals/AAPL');
const { data } = await response.json();
```

### With Python/Django

```python
import requests
from django.http import JsonResponse

def get_signal(ticker):
    response = requests.get(f'http://api.example.com/api/signals/{ticker}')
    return JsonResponse(response.json())
```

---

## Response Format

All responses follow a consistent format:

```json
{
  "success": true/false,
  "data": {},           // Present if success is true
  "error": "message",   // Present if success is false
  "timestamp": "ISO8601"
}
```

---

## Changelog

### v1.0.0 (Current)
- Initial release
- 5 stocks supported
- Technical analysis with RSI, SMA, Momentum
- Sentiment analysis with news scoring
- Trading signal generation with breakdown

---

## Future Enhancements

- [ ] Real-time data via WebSockets
- [ ] Historical signal performance tracking
- [ ] Machine learning signal generation
- [ ] User authentication and watchlists
- [ ] Database persistence (PostgreSQL)
- [ ] Mobile app API
- [ ] Rate limiting and caching
- [ ] API key management

---

## Support

For questions or issues, check the project documentation or review the API code in `backend/src/routes/`.
