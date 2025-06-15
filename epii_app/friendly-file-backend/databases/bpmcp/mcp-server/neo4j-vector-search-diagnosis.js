// Neo4j Vector Search Diagnostic Script
import neo4j from "neo4j-driver";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
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
  NEO4J_PASSWORD,
  GOOGLE_API_KEY,
  GEMINI_EMBEDDING_MODEL
} = process.env;

// Validate essential environment variables
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD || !GOOGLE_API_KEY || !GEMINI_EMBEDDING_MODEL) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Initialize Neo4j driver and embeddings
const neo4jDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GOOGLE_API_KEY,
  model: GEMINI_EMBEDDING_MODEL,
});

// Diagnostic function
async function runDiagnostics() {
  console.log("=== Neo4j Vector Search Diagnostics ===\n");
  const session = neo4jDriver.session();

  try {
    // Step 1: Check Neo4j connection
    console.log("Step 1: Checking Neo4j connection...");
    const connectionQuery = "RETURN 'Connected to Neo4j' as status";
    const connectionResult = await session.run(connectionQuery);
    console.log(`✅ ${connectionResult.records[0].get('status')}`);

    // Step 2: Check if vector index exists
    console.log("\nStep 2: Checking vector index status...");
    const indexQuery = `
      SHOW INDEXES
      YIELD name, type, state, entityType, labelsOrTypes, properties
      WHERE type = 'VECTOR' AND name = 'bimba_embedding_index'
      RETURN name, state, entityType, labelsOrTypes, properties
    `;
    const indexResult = await session.run(indexQuery);

    if (indexResult.records.length === 0) {
      console.log("❌ Vector index 'bimba_embedding_index' not found");
    } else {
      const indexRecord = indexResult.records[0];
      console.log(`✅ Vector index found: ${indexRecord.get('name')}`);
      console.log(`   State: ${indexRecord.get('state')}`);
      console.log(`   Entity Type: ${indexRecord.get('entityType')}`);
      console.log(`   Labels/Types: ${indexRecord.get('labelsOrTypes')}`);
      console.log(`   Properties: ${indexRecord.get('properties')}`);
    }

    // Step 3: Count nodes with embeddings
    console.log("\nStep 3: Counting nodes with embeddings...");
    const embeddingCountQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      RETURN count(n) as count
    `;
    const embeddingCountResult = await session.run(embeddingCountQuery);
    const embeddingCount = embeddingCountResult.records[0].get('count').toNumber();
    console.log(`✅ Found ${embeddingCount} nodes with embeddings`);

    // Step 4: Check nodes with specific coordinate
    console.log("\nStep 4: Checking nodes with coordinate #4...");
    const coordinateQuery = `
      MATCH (n)
      WHERE n.bimbaCoordinate STARTS WITH '#4'
      RETURN count(n) as count
    `;
    const coordinateResult = await session.run(coordinateQuery);
    const coordinateCount = coordinateResult.records[0].get('count').toNumber();
    console.log(`✅ Found ${coordinateCount} nodes with bimbaCoordinate starting with '#4'`);

    // Step 5: Check nodes with both embedding and coordinate
    console.log("\nStep 5: Checking nodes with both embedding and coordinate #4...");
    const bothQuery = `
      MATCH (n)
      WHERE n.bimbaCoordinate STARTS WITH '#4' AND n.embedding IS NOT NULL
      RETURN count(n) as count
    `;
    const bothResult = await session.run(bothQuery);
    const bothCount = bothResult.records[0].get('count').toNumber();
    console.log(`✅ Found ${bothCount} nodes with both bimbaCoordinate '#4' and embedding`);

    // Step 6: Generate a test embedding
    console.log("\nStep 6: Generating test embedding...");
    const testQuery = "information about coordinate #4";
    const testVector = await embeddings.embedQuery(testQuery);
    console.log(`✅ Generated test embedding with ${testVector.length} dimensions`);

    // Step 7: Try direct vector.similarity.cosine search (for comparison)
    console.log("\nStep 7: Testing direct vector.similarity.cosine search...");
    const directSearchQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL AND n.bimbaCoordinate STARTS WITH '#4'
      WITH n, vector.similarity.cosine(n.embedding, $embedding) AS score
      ORDER BY score DESC
      LIMIT 2
      RETURN n.name as name, n.bimbaCoordinate as coordinate, score
    `;
    const directSearchResult = await session.run(directSearchQuery, { embedding: testVector });
    console.log(`✅ Direct search found ${directSearchResult.records.length} results`);
    directSearchResult.records.forEach((record, i) => {
      console.log(`   Result ${i+1}: ${record.get('name')} (${record.get('coordinate')}) - Score: ${record.get('score')}`);
    });

    // Step 8: Try vector index search
    console.log("\nStep 8: Testing vector index search...");
    const indexSearchQuery = `
      CALL db.index.vector.queryNodes('bimba_embedding_index', 4, $embedding)
      YIELD node, score
      WHERE node.bimbaCoordinate STARTS WITH '#4'
      RETURN node.name as name, node.bimbaCoordinate as coordinate, score
      ORDER BY score DESC
      LIMIT 2
    `;

    try {
      const indexSearchResult = await session.run(indexSearchQuery, { embedding: testVector });
      console.log(`✅ Vector index search found ${indexSearchResult.records.length} results`);
      indexSearchResult.records.forEach((record, i) => {
        console.log(`   Result ${i+1}: ${record.get('name')} (${record.get('coordinate')}) - Score: ${record.get('score')}`);
      });
    } catch (error) {
      console.log(`❌ Vector index search failed: ${error.message}`);
    }

    // Step 9: Check if nodes have the correct label for the index
    console.log("\nStep 9: Checking node labels for index compatibility...");
    const labelQuery = `
      SHOW INDEXES
      YIELD name, labelsOrTypes
      WHERE name = 'bimba_embedding_index'
      RETURN labelsOrTypes
    `;
    const labelResult = await session.run(labelQuery);

    if (labelResult.records.length > 0) {
      const indexLabels = labelResult.records[0].get('labelsOrTypes');
      console.log(`✅ Vector index is configured for labels/types: ${indexLabels}`);

      // Check if nodes with embeddings have the required label
      const nodeLabelsQuery = `
        MATCH (n)
        WHERE n.embedding IS NOT NULL AND n.bimbaCoordinate STARTS WITH '#4'
        RETURN labels(n) as nodeLabels, n.name as name, n.bimbaCoordinate as coordinate
        LIMIT 5
      `;

      const nodeLabelsResult = await session.run(nodeLabelsQuery);
      console.log(`✅ Found ${nodeLabelsResult.records.length} nodes with embeddings and coordinate #4`);

      nodeLabelsResult.records.forEach((record, i) => {
        const nodeLabels = record.get('nodeLabels');
        const name = record.get('name');
        const coordinate = record.get('coordinate');
        console.log(`   Node ${i+1}: ${name} (${coordinate}) - Labels: ${nodeLabels}`);
      });
    } else {
      console.log("❌ Could not retrieve index label information");
    }

    // Step 10: Try recreating the vector index with the correct configuration
    console.log("\nStep 10: Recommendations based on diagnostics:");

    if (bothCount === 0) {
      console.log("❌ No nodes found with both coordinate #4 and embeddings. Generate embeddings for these nodes first.");
    } else if (directSearchResult.records.length > 0 && indexResult.records.length === 0) {
      console.log("⚠️ Direct search works but index search doesn't. Try dropping and recreating the vector index:");
      console.log(`
      // Drop existing index if it exists
      DROP INDEX bimba_embedding_index IF EXISTS;

      // Create new vector index with correct configuration
      CREATE VECTOR INDEX bimba_embedding_index
      FOR (n)
      ON n.embedding
      OPTIONS {
        indexConfig: {
          vector:dimensions: 768,
          vector:similarity_function: 'cosine'
        }
      };
      `);
    } else {
      console.log("✅ All diagnostics completed. Review the results above to identify any issues.");
    }

  } catch (error) {
    console.error("Error during diagnostics:", error);
  } finally {
    await session.close();
    await neo4jDriver.close();
  }
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error("Diagnostics failed:", error);
  process.exit(1);
});
