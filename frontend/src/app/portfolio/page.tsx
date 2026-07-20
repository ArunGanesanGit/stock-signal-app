"use client";

import { useState } from "react";

interface PortfolioItem {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  gain: number;
  gainPercent: number;
}

export default function PortfolioPage() {
  const [portfolio] = useState<PortfolioItem[]>([
    {
      symbol: "AAPL",
      quantity: 10,
      purchasePrice: 150.0,
      currentPrice: 189.95,
      gain: 399.5,
      gainPercent: 26.63
    },
    {
      symbol: "MSFT",
      quantity: 5,
      purchasePrice: 350.0,
      currentPrice: 428.75,
      gain: 394.25,
      gainPercent: 22.5
    },
    {
      symbol: "GOOGL",
      quantity: 8,
      purchasePrice: 140.0,
      currentPrice: 165.42,
      gain: 203.36,
      gainPercent: 18.15
    }
  ]);

  const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);
  const totalGain = portfolio.reduce((sum, item) => sum + item.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-gray-600">Your investment positions and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Value</p>
          <p className="text-3xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Gain</p>
          <p className={`text-3xl font-bold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${totalGain.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Return %</p>
          <p className={`text-3xl font-bold ${totalGainPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalGainPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Symbol</th>
              <th className="px-6 py-3 text-right font-semibold">Quantity</th>
              <th className="px-6 py-3 text-right font-semibold">Entry Price</th>
              <th className="px-6 py-3 text-right font-semibold">Current Price</th>
              <th className="px-6 py-3 text-right font-semibold">Gain</th>
              <th className="px-6 py-3 text-right font-semibold">Gain %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {portfolio.map(item => (
              <tr key={item.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{item.symbol}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-right">${item.purchasePrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">${item.currentPrice.toFixed(2)}</td>
                <td className={`px-6 py-4 text-right font-semibold ${item.gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${item.gain.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${item.gainPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.gainPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
