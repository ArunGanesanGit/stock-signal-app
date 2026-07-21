"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SignalDashboard from "@/components/SignalDashboard";
import { fetchAPI } from "@/lib/api";

interface LiveStats {
  trackedStocks: number;
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  avgConfidence: number;
}

export default function Home() {
  const [stats, setStats] = useState<LiveStats>({
    trackedStocks: 0,
    buySignals: 0,
    sellSignals: 0,
    holdSignals: 0,
    avgConfidence: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAPI<LiveStats>("/api/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section - Professional Dark */}
      <div className="rounded-lg border-l-4 p-10 bg-black" style={{ backgroundColor: '#151B24', borderLeftColor: '#FF6666' }}>
        <h1 className="mb-4 text-4xl font-bold" style={{ color: '#FFB800' }}>
          Stock Signal Analyzer
        </h1>
        <p className="mb-6 text-base leading-relaxed" style={{ color: '#E0E0E0' }}>
          Real-time trading signals powered by technical analysis and news sentiment
        </p>
        <div className="flex gap-4">
          <Link
            href="/signals"
            className="rounded px-6 py-3 font-semibold transition-colors"
            style={{ backgroundColor: '#FF6666', color: 'white' }}
          >
            View All Signals
          </Link>
          <Link
            href="/stocks"
            className="rounded px-6 py-3 font-semibold transition-colors"
            style={{ backgroundColor: '#FFB800', color: '#000000' }}
          >
            Browse Stocks
          </Link>
        </div>
      </div>

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
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: '#FFB800' }}>Live Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#151B24', padding: '20px', borderRadius: '8px', border: '1px solid #1F2633' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Tracked Stocks</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFB800' }}>{loading ? '...' : stats.trackedStocks}</p>
          </div>
          <div style={{ backgroundColor: '#151B24', padding: '20px', borderRadius: '8px', border: '1px solid #1F2633' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Buy Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ADE80' }}>{loading ? '...' : stats.buySignals}</p>
          </div>
          <div style={{ backgroundColor: '#151B24', padding: '20px', borderRadius: '8px', border: '1px solid #1F2633' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Sell Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6666' }}>{loading ? '...' : stats.sellSignals}</p>
          </div>
          <div style={{ backgroundColor: '#151B24', padding: '20px', borderRadius: '8px', border: '1px solid #1F2633' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Hold Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFB800' }}>{loading ? '...' : stats.holdSignals}</p>
          </div>
          <div style={{ backgroundColor: '#151B24', padding: '20px', borderRadius: '8px', border: '1px solid #1F2633' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Avg Confidence</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFA500' }}>{loading ? '...' : stats.avgConfidence.toFixed(1)}%</p>
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
