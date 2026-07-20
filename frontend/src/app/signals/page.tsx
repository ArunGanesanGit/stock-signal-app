"use client";

import { useEffect, useState } from "react";
import SignalCard from "@/components/SignalCard";
import { fetchAPI } from "@/lib/api";

interface TradingSignal {
  symbol: string;
  signal: "buy" | "sell" | "hold";
  confidence: number;
  technicalScore: number;
  sentimentScore: number;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  reasons: string[];
  expiresAt: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "hold">("all");

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/api/signals/active");
      setSignals((data as TradingSignal[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signals");
    } finally {
      setLoading(false);
    }
  };

  const filteredSignals = signals.filter(s =>
    filter === "all" ? true : s.signal === filter
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Trading Signals</h1>
        <p className="text-gray-600">Active trading signals based on technical and sentiment analysis</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4">
        {(["all", "buy", "sell", "hold"] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded font-semibold capitalize ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-64"></div>
          ))}
        </div>
      )}

      {/* Signals Grid */}
      {!loading && filteredSignals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSignals.map(signal => (
            <SignalCard key={signal.symbol} signal={signal} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSignals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No signals found for this filter</p>
        </div>
      )}
    </div>
  );
}
