#!/bin/bash

# Stock Signal Application - Automatic Setup & Run Script
# This script handles everything - just run it!

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Stock Signal Application - Automatic Setup             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "📥 INSTALL NODE.JS:"
    echo "   • Mac:     Visit https://nodejs.org/ and download LTS"
    echo "   • Windows: Visit https://nodejs.org/ and download LTS"
    echo "   • Linux:   sudo apt install nodejs npm"
    echo ""
    echo "Once installed, run this script again!"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js installed: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if [ ! -d "node_modules" ]; then
    npm install --silent
else
    echo "   Dependencies already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🚀 Starting Stock Signal Application             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📌 IMPORTANT:"
echo "   • Frontend will be ready at:  http://localhost:3000"
echo "   • Backend API will be ready at: http://localhost:5000"
echo ""
echo "   Wait 20-30 seconds for both to fully start..."
echo ""
echo "🎯 WHEN READY:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Enter a stock ticker (AAPL, MSFT, GOOGL, TSLA, AMZN)"
echo "   3. Click 'Analyze' to see the signal"
echo ""
echo "⏹️  TO STOP: Press Ctrl + C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the application
npm start
