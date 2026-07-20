import dotenv from "dotenv";
const envResult = dotenv.config({ path: ".env.local" });
if (envResult.error) {
  console.error("Error loading .env.local:", envResult.error);
} else {
  console.log(".env.local loaded successfully");
  console.log("API Key loaded:", process.env.ALPHA_VANTAGE_API_KEY ? "Yes" : "No");
}

import app from "./app";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Key: ${process.env.ALPHA_VANTAGE_API_KEY ? "Set" : "Not Set"}`);
});
