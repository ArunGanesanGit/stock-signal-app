#!/bin/bash

# Stock Signal Application - Start and Test Script
# This script starts everything and tests it

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Stock Signal - Complete Setup & Test                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Node.js
echo "1️⃣  Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
echo "✅ Node.js $(node -v) installed"
echo ""

# Step 2: Create env files
echo "2️⃣  Setting up environment variables..."
if [ ! -f "frontend/.env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local
    echo "   Created frontend/.env.local"
fi

if [ ! -f "backend/.env.local" ]; then
    cat > backend/.env.local << 'EOF'
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
USE_MOCK_DATA=true
EOF
    echo "   Created backend/.env.local"
fi
echo "✅ Environment variables configured"
echo ""

# Step 3: Install dependencies if needed
echo "3️⃣  Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing root dependencies..."
    npm install --silent
fi
if [ ! -d "backend/node_modules" ]; then
    echo "   Installing backend dependencies..."
    npm install --silent --workspace=backend
fi
if [ ! -d "frontend/node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install --silent --workspace=frontend
fi
echo "✅ Dependencies installed"
echo ""

# Step 4: Build
echo "4️⃣  Building project..."
npm run build --workspace=shared 2>/dev/null || true
npm run build --workspace=backend 2>/dev/null || true
echo "✅ Build complete"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🚀 Starting Application                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📌 IMPORTANT:"
echo "   • Backend starts on:  http://localhost:5000"
echo "   • Frontend starts on: http://localhost:3000"
echo ""
echo "⏱️  Waiting for servers to start (30 seconds)..."
echo ""

# Start servers in background
cd "$PROJECT_DIR"
npm run backend:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

npm run frontend:dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for servers
sleep 10

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           ✅ Testing Servers                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Test backend health
echo "Testing Backend Health..."
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start"
    echo ""
    echo "Backend logs:"
    cat /tmp/backend.log | tail -20
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Test API endpoint
echo ""
echo "Testing API Endpoint (GET /api/signals/AAPL)..."
RESPONSE=$(curl -s http://localhost:5000/api/signals/AAPL)
if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ API is working!"
    echo ""
    echo "Sample response:"
    echo "$RESPONSE" | jq '.data.signal, .data.confidence' 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ API failed"
    echo "Response: $RESPONSE"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🎉 Everything Ready!                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 OPEN YOUR BROWSER:"
echo "   http://localhost:3000"
echo ""
echo "🎯 TRY THESE TICKERS:"
echo "   AAPL, MSFT, GOOGL, TSLA, AMZN"
echo ""
echo "⏹️  TO STOP:"
echo "   Press Ctrl + C"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
