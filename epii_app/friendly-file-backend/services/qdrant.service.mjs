import { QdrantClient } from "@qdrant/js-client-rest"; // Corrected package name
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY; // Optional, depending on Qdrant setup

if (!QDRANT_URL) {
  console.warn("Qdrant environment variable (QDRANT_URL) not set. QdrantClient initialization might fail.");
  // Depending on requirements, you might throw an error here instead:
  // throw new Error("Missing required Qdrant environment variable: QDRANT_URL.");
}

// Initialize the QdrantClient instance
const qdrantConfig = {
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }), // Conditionally add apiKey if it exists
};

let qdrantClient;
try {
  qdrantClient = new QdrantClient(qdrantConfig);
  console.log("QdrantClient instance initialized successfully.");
  // You might want to add a check here to ensure the client can connect
  // e.g., try listing collections or getting cluster info
} catch (error) {
  console.error("Failed to initialize QdrantClient:", error);
  // Handle initialization error appropriately
  qdrantClient = null; // Ensure client is null if initialization fails
}

// Define the collection name (should likely be in .env too)
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || "pratibimba_store";

export { qdrantClient, QDRANT_COLLECTION_NAME };
