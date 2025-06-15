import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.warn("Neo4j environment variables (NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD) not fully set. Neo4jGraph initialization might fail.");
}

const graphConfig = {
  url: NEO4J_URI,
  username: NEO4J_USERNAME,
  password: NEO4J_PASSWORD,
};

let graph;
try {
  graph = new Neo4jGraph(graphConfig);
  console.log("Neo4jGraph instance initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Neo4jGraph:", error);
  graph = null;
}

export { graph };
