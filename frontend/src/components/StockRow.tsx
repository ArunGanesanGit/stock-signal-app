import Link from "next/link";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe?: number;
}

interface StockRowProps {
  stock: StockData;
}

export default function StockRow({ stock }: StockRowProps) {
  const changeColor = stock.change >= 0 ? "text-green-600" : "text-red-600";
  const changeBg = stock.change >= 0 ? "bg-green-50" : "bg-red-50";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <Link
          href={`/stocks/${stock.symbol}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {stock.symbol}
        </Link>
      </td>
      <td className={`px-6 py-4 text-right font-semibold`}>
        ${stock.price.toFixed(2)}
      </td>
      <td className={`px-6 py-4 text-right font-semibold ${changeColor}`}>
        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
        <span className={`text-sm ml-2 px-2 py-1 rounded ${changeBg}`}>
          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 text-right text-gray-600">
        {(stock.volume / 1_000_000).toFixed(2)}M
      </td>
      <td className="px-6 py-4 text-right text-gray-600">
        {(stock.pe || 0).toFixed(2)}x
      </td>
    </tr>
  );
}
