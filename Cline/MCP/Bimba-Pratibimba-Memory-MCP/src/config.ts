import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Config } from "./types/index.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

/**
 * Load and validate configuration from environment variables
 * @returns Configuration object
 */
export function loadConfig(): Config {
  // Load environment variables
  dotenv.config({ path: envPath });
  
  // Check if .env file was loaded
  if (!process.env.NEO4J_URI) {
    console.warn(`Warning: NEO4J_URI not found after loading .env from ${envPath}. Environment variables might not be loaded correctly.`);
  } else {
    console.log(`.env loaded from ${envPath}. NEO4J_URI found.`);
  }
  
  // Validate required environment variables
  const requiredVars = [
    "NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD",
    "QDRANT_URL", "MONGODB_URI", "MONGODB_DB_NAME",
    "NOTION_API_KEY", "GOOGLE_API_KEY", "GEMINI_EMBEDDING_MODEL"
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
  
  // Create and return config object
  return {
    neo4j: {
      uri: process.env.NEO4J_URI!,
      username: process.env.NEO4J_USERNAME!,
      password: process.env.NEO4J_PASSWORD!,
    },
    qdrant: {
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY,
    },
    mongodb: {
      uri: process.env.MONGODB_URI!,
      dbName: process.env.MONGODB_DB_NAME!,
    },
    notion: {
      apiKey: process.env.NOTION_API_KEY!,
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY!,
      embeddingModel: process.env.GEMINI_EMBEDDING_MODEL!,
    },
    perplexity: {
      apiKey: process.env.PERPLEXITY_API_KEY!,
    },
    brave: {
      apiKey: process.env.BRAVE_API_KEY!,
    },
    firecrawl: {
      apiKey: process.env.FIRECRAWL_API_KEY!,
    },
    server: {
      wsPort: parseInt(process.env.WS_PORT || "3030", 10),
    },
  };
}
