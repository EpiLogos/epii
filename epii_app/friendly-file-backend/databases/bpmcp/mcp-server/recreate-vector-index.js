// Script to recreate the Neo4j vector index without label restrictions
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Try multiple possible locations for the .env file
const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env')
];

// Try loading from each path until successful
let envLoaded = false;
for (const envPath of envPaths) {
  console.log(`Trying to load .env from: ${envPath}`);
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`Successfully loaded .env from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn("Could not load .env file from any of the expected locations");
}

// Get environment variables
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = process.env;

// Validate essential environment variables
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Initialize Neo4j driver
const neo4jDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

async function recreateVectorIndex() {
  console.log("=== Recreating Neo4j Vector Index ===\n");
  const session = neo4jDriver.session();

  try {
    // Step 1: Check Neo4j connection
    console.log("Step 1: Checking Neo4j connection...");
    const connectionQuery = "RETURN 'Connected to Neo4j' as status";
    const connectionResult = await session.run(connectionQuery);
    console.log(`✅ ${connectionResult.records[0].get('status')}`);

    // Step 2: Drop existing index if it exists
    console.log("\nStep 2: Dropping existing vector index...");
    const dropIndexQuery = "DROP INDEX bimba_embedding_index IF EXISTS";
    await session.run(dropIndexQuery);
    console.log("✅ Dropped existing index (if it existed)");

    // Step 3: Create new vector index without label restrictions
    console.log("\nStep 3: Creating new vector index without label restrictions...");
    const createIndexQuery = `
      CREATE VECTOR INDEX bimba_embedding_index
      FOR (n:Node)
      ON n.embedding
      OPTIONS {
        indexProvider: 'vector-1.0',
        indexConfig: {
          \`vector.dimensions\`: 768,
          \`vector.similarity_function\`: 'cosine'
        }
      }
    `;
    await session.run(createIndexQuery);
    console.log("✅ Created new vector index");

    // Step 4: Verify index is created
    console.log("\nStep 4: Verifying index creation...");
    const verifyQuery = `
      SHOW INDEXES
      YIELD name, type, state, entityType, labelsOrTypes, properties
      WHERE type = 'VECTOR' AND name = 'bimba_embedding_index'
      RETURN name, state, entityType, labelsOrTypes, properties
    `;
    const verifyResult = await session.run(verifyQuery);

    if (verifyResult.records.length === 0) {
      console.log("❌ Vector index not found after creation attempt");
    } else {
      const indexRecord = verifyResult.records[0];
      console.log(`✅ Vector index verified: ${indexRecord.get('name')}`);
      console.log(`   State: ${indexRecord.get('state')}`);
      console.log(`   Entity Type: ${indexRecord.get('entityType')}`);
      console.log(`   Labels/Types: ${indexRecord.get('labelsOrTypes')}`);
      console.log(`   Properties: ${indexRecord.get('properties')}`);
    }

    console.log("\n=== Vector Index Recreation Complete ===");
    console.log("Note: The index may take a moment to become ONLINE. If it's not ONLINE yet,");
    console.log("wait a few moments and then run the diagnostic script again to verify.");

  } catch (error) {
    console.error("Error during index recreation:", error);
  } finally {
    await session.close();
    await neo4jDriver.close();
  }
}

// Run the index recreation
recreateVectorIndex().catch(error => {
  console.error("Index recreation failed:", error);
  process.exit(1);
});
