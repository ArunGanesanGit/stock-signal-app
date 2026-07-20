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
      <body style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '12px' }}>
        <PWARegister />
        <header style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #00ff00' }}>
          <nav style={{ maxWidth: '100%', margin: '0 auto', padding: '8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="/" style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ffff' }}>
                📈 Stock Signals
              </a>
              <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><a href="/signals" style={{ color: '#00ff00', fontSize: '11px', textDecoration: 'none' }}>Signals</a></li>
                <li><a href="/stocks" style={{ color: '#00ff00', fontSize: '11px', textDecoration: 'none' }}>Stocks</a></li>
                <li><a href="/portfolio" style={{ color: '#00ff00', fontSize: '11px', textDecoration: 'none' }}>Portfolio</a></li>
              </ul>
            </div>
          </nav>
        </header>

        <main style={{ maxWidth: '100%', margin: '0 auto', padding: '16px', minHeight: '80vh' }}>
          {children}
        </main>

        <footer style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #ff00ff', marginTop: '32px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#ffff00', fontSize: '10px' }}>
            <p>&copy; 2026 Stock Signal. Real-time data powered by AlphaVantage & NewsAPI</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
