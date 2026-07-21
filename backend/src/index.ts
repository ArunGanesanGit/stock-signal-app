import dotenv from "dotenv";
const envResult = dotenv.config({ path: ".env.local" });
if (envResult.error) {
  console.error("Error loading .env.local:", envResult.error);
} else {
  console.log(".env.local loaded successfully");
  console.log("AlphaVantage API Key loaded:", process.env.ALPHA_VANTAGE_API_KEY ? "Yes" : "No");
  console.log("NewsAPI Key loaded:", process.env.NEWSAPI_KEY ? "Yes" : "No");
}

import app from "./app";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`AlphaVantage Key: ${process.env.ALPHA_VANTAGE_API_KEY ? "Set" : "Not Set"}`);
  console.log(`NewsAPI Key: ${process.env.NEWSAPI_KEY ? "Set" : "Not Set"}`);
});
