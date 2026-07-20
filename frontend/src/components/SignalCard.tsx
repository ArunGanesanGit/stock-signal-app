import { TradingSignal } from "@stock-signal/shared";
import Link from "next/link";

interface SignalCardProps {
  signal: TradingSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const signalColor = {
    buy: "text-green-600",
    sell: "text-red-600",
    hold: "text-yellow-600"
  }[signal.signal];

  const signalBg = {
    buy: "bg-green-50 border-green-200",
    sell: "bg-red-50 border-red-200",
    hold: "bg-yellow-50 border-yellow-200"
  }[signal.signal];

  const confidenceColor = signal.confidence > 0.75 ? "text-green-600" : signal.confidence > 0.6 ? "text-yellow-600" : "text-gray-600";

  return (
    <div className={`border rounded-lg p-6 ${signalBg}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm">Signal for</p>
          <Link
            href={`/stocks/${signal.symbol}`}
            className="text-2xl font-bold text-blue-600 hover:underline"
          >
            {signal.symbol}
          </Link>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${signalColor} capitalize`}>
            {signal.signal}
          </p>
          <p className={`text-sm font-semibold ${confidenceColor}`}>
            {(signal.confidence * 100).toFixed(0)}% confidence
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs">Technical</p>
          <p className="text-lg font-semibold">{(signal.technicalScore * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs">Sentiment</p>
          <p className="text-lg font-semibold">{(signal.sentimentScore * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Price Targets */}
      {signal.entryPrice && (
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Entry:</span>
            <span className="font-semibold">${signal.entryPrice.toFixed(2)}</span>
          </div>
          {signal.targetPrice && (
            <div className="flex justify-between">
              <span className="text-gray-600">Target:</span>
              <span className="font-semibold">${signal.targetPrice.toFixed(2)}</span>
            </div>
          )}
          {signal.stopLoss && (
            <div className="flex justify-between">
              <span className="text-gray-600">Stop Loss:</span>
              <span className="font-semibold">${signal.stopLoss.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Reasons */}
      <div className="bg-white rounded p-3 mb-4">
        <p className="text-gray-600 text-xs font-semibold mb-2">Reasons</p>
        <ul className="space-y-1 text-sm">
          {signal.reasons.slice(0, 3).map((reason, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span className="text-gray-700">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expiration */}
      <p className="text-gray-500 text-xs">
        Expires: {new Date(signal.expiresAt).toLocaleDateString()}
      </p>
    </div>
  );
}
