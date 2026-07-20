"use client";

import Link from "next/link";
import SignalDashboard from "@/components/SignalDashboard";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Stock Signal Analyzer</h1>
        <p className="text-xl mb-8">
          Real-time trading signals powered by technical analysis and news sentiment
        </p>
        <div className="flex gap-4">
          <Link
            href="/signals"
            className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            View All Signals
          </Link>
          <Link
            href="/stocks"
            className="bg-blue-500 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700"
          >
            Browse Stocks
          </Link>
        </div>
      </section>

      {/* Interactive Dashboard */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Analyze Any Stock</h2>
        <SignalDashboard />
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">📊 Technical Analysis</h3>
            <p className="text-gray-400 text-sm">
              RSI (14), SMA (50/200), Momentum, MACD, Bollinger Bands, ADX, and Stochastic indicators
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">📰 Sentiment Analysis</h3>
            <p className="text-gray-400 text-sm">
              Real-time news sentiment tracking with positive/negative news ratio analysis
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">🎯 Signal Generation</h3>
            <p className="text-gray-400 text-sm">
              Buy, Sell, and Hold signals with confidence scores and detailed breakdown
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Live Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
            <p className="text-blue-300 text-xs">Tracked Stocks</p>
            <p className="text-3xl font-bold text-blue-400">5</p>
          </div>
          <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-700">
            <p className="text-green-300 text-xs">Buy Signals</p>
            <p className="text-3xl font-bold text-green-400">2</p>
          </div>
          <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-700">
            <p className="text-red-300 text-xs">Sell Signals</p>
            <p className="text-3xl font-bold text-red-400">1</p>
          </div>
          <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-700">
            <p className="text-yellow-300 text-xs">Hold Signals</p>
            <p className="text-3xl font-bold text-yellow-400">2</p>
          </div>
          <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-700">
            <p className="text-purple-300 text-xs">Avg Confidence</p>
            <p className="text-3xl font-bold text-purple-400">72%</p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <ol className="space-y-2 text-gray-700">
          <li><strong>1.</strong> Enter a stock ticker (AAPL, MSFT, GOOGL, TSLA, AMZN)</li>
          <li><strong>2.</strong> View technical indicators: RSI, SMA, Momentum</li>
          <li><strong>3.</strong> Check sentiment from recent news</li>
          <li><strong>4.</strong> Get Buy/Sell/Hold signal with confidence score</li>
        </ol>
      </section>
    </div>
  );
}
