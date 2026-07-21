"use client";

import Link from "next/link";
import SignalDashboard from "@/components/SignalDashboard";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section - Professional Dark */}
      <section style={{ backgroundColor: '#1A1F28', padding: '40px 24px', borderRadius: '8px', borderLeft: '4px solid #FF6666' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '16px', color: '#FFB800' }}>
          Stock Signal Analyzer
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '24px', color: '#E0E0E0', lineHeight: '1.6' }}>
          Real-time trading signals powered by technical analysis and news sentiment
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link
            href="/signals"
            style={{
              backgroundColor: '#FF6666',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF7777'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6666'}
          >
            View All Signals
          </Link>
          <Link
            href="/stocks"
            style={{
              backgroundColor: '#FFB800',
              color: '#000000',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC933'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFB800'}
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
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: '#FFB800' }}>Live Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#1A1F28', padding: '20px', borderRadius: '8px', border: '1px solid #2A3040' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Tracked Stocks</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFB800' }}>5</p>
          </div>
          <div style={{ backgroundColor: '#1A1F28', padding: '20px', borderRadius: '8px', border: '1px solid #2A3040' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Buy Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ADE80' }}>2</p>
          </div>
          <div style={{ backgroundColor: '#1A1F28', padding: '20px', borderRadius: '8px', border: '1px solid #2A3040' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Sell Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6666' }}>1</p>
          </div>
          <div style={{ backgroundColor: '#1A1F28', padding: '20px', borderRadius: '8px', border: '1px solid #2A3040' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Hold Signals</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFB800' }}>2</p>
          </div>
          <div style={{ backgroundColor: '#1A1F28', padding: '20px', borderRadius: '8px', border: '1px solid #2A3040' }}>
            <p style={{ color: '#888888', fontSize: '12px', marginBottom: '8px' }}>Avg Confidence</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFA500' }}>72%</p>
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
