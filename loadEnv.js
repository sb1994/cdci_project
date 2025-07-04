// server/loadEnv.js
const path = require("path");
const dotenv = require("dotenv");

// Determine correct .env file based on NODE_ENV
const ENV = process.env.NODE_ENV || "development";
const envFile = ENV === "production" ? ".prod.env" : ".env";

// Resolve path and load it
const envPath = path.resolve(__dirname, envFile);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`❌ Failed to load ${envFile}`);
  process.exit(1);
} else {
  console.log(`✅ Loaded environment from ${envFile}`);
}
