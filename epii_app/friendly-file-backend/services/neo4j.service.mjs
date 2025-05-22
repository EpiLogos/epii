import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph"; // Adjusted import path
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
// Optional: Specify database if not the default one
// const NEO4J_DATABASE = process.env.NEO4J_DATABASE;

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.warn("Neo4j environment variables (NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD) not fully set. Neo4jGraph initialization might fail.");
  // Depending on requirements, you might throw an error here instead:
  // throw new Error("Missing required Neo4j environment variables.");
}

// Initialize the Neo4jGraph instance
// Pass database parameter only if it's defined
const graphConfig = {
  url: NEO4J_URI,
  username: NEO4J_USERNAME,
  password: NEO4J_PASSWORD,
  // ...(process.env.NEO4J_DATABASE && { database: process.env.NEO4J_DATABASE }),
};

let graph;
try {
  // @ts-ignore // Langchain types might not perfectly align yet
  graph = new Neo4jGraph(graphConfig);
  console.log("Neo4jGraph instance initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Neo4jGraph:", error);
  // Handle initialization error appropriately
  graph = null; // Ensure graph is null if initialization fails
}

export { graph };
