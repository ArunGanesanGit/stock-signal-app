#!/bin/bash

# API Testing Script for Stock Signal Application
# Usage: ./test-api.sh

API_URL="http://localhost:5000"
TICKERS=("AAPL" "MSFT" "GOOGL" "TSLA" "AMZN")

echo "================================"
echo "Stock Signal API Test Suite"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test health check
echo -e "${BLUE}Testing Health Check...${NC}"
curl -s "$API_URL/health" | jq '.'
echo ""

# Test individual signal endpoints
echo -e "${BLUE}Testing Individual Signal Endpoints...${NC}"
for ticker in "${TICKERS[@]}"; do
  echo -e "${GREEN}Signal for $ticker:${NC}"
  curl -s "$API_URL/api/signals/$ticker" | jq '.data | {signal, confidence, breakdown: {technical: {score}, sentiment: {score}}}'
  echo ""
done

# Test all active signals
echo -e "${BLUE}Testing Active Signals...${NC}"
curl -s "$API_URL/api/signals/active" | jq '.data | length as $count | "Found \($count) active signals"'
echo ""

# Test buy signals
echo -e "${BLUE}Testing Buy Signals...${NC}"
curl -s "$API_URL/api/signals/buy" | jq '.data | map(.symbol) | "Buy signals for: \(.)"'
echo ""

# Test sell signals
echo -e "${BLUE}Testing Sell Signals...${NC}"
curl -s "$API_URL/api/signals/sell" | jq '.data | map(.symbol) | "Sell signals for: \(.)"'
echo ""

# Test stocks endpoint
echo -e "${BLUE}Testing Stocks Endpoint...${NC}"
curl -s "$API_URL/api/stocks" | jq '.data | map(.symbol) | "Available stocks: \(.)"'
echo ""

# Test technical indicators
echo -e "${BLUE}Testing Technical Indicators (AAPL)...${NC}"
curl -s "$API_URL/api/technical/AAPL" | jq '.data | {rsi, macd: {value}, bollingerBands: {upper, middle, lower}, movingAverages: {ma20, ma50, ma200}}'
echo ""

# Test sentiment
echo -e "${BLUE}Testing Sentiment (AAPL)...${NC}"
curl -s "$API_URL/api/sentiment/AAPL" | jq '.data | {overallSentiment, sentimentScore, newsCount, positiveNews}'
echo ""

# Test news
echo -e "${BLUE}Testing News (AAPL)...${NC}"
curl -s "$API_URL/api/sentiment/AAPL/news?limit=2" | jq '.data | map({title, sentiment, sentimentScore})'
echo ""

echo -e "${GREEN}✓ All tests completed!${NC}"
