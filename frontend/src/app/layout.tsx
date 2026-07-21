import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
  title: "Stock Signal - Technical Analysis & Sentiment",
  description: "Real-time stock signals synthesizing technical analysis and news sentiment",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#00ff00",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stock Signal"
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192" }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Stock Signal" />
        <meta name="theme-color" content="#00ff00" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={{ backgroundColor: '#0A0E14', color: '#E0E0E0', fontSize: '13px' }}>
        <PWARegister />
        <header style={{ backgroundColor: '#0F1419', borderBottom: '2px solid #FF6666', padding: '0' }}>
          <nav style={{ maxWidth: '100%', margin: '0 auto', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFB800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📈 Stock Signals
              </a>
              <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><a href="/signals" style={{ color: '#FFA500', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>Signals</a></li>
                <li><a href="/stocks" style={{ color: '#FFA500', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>Stocks</a></li>
                <li><a href="/portfolio" style={{ color: '#FFA500', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>Portfolio</a></li>
              </ul>
            </div>
          </nav>
        </header>

        <main style={{ maxWidth: '100%', margin: '0 auto', padding: '16px', minHeight: '80vh' }}>
          {children}
        </main>

        <footer style={{ backgroundColor: '#0F1419', borderTop: '1px solid #FF6666', marginTop: '32px', padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#888888', fontSize: '11px' }}>
            <p>&copy; 2026 Stock Signal. Real-time data powered by AlphaVantage & NewsAPI</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
