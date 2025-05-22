// Admin tool to create the vector index for bimbaKnowing tool
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

console.log(`Trying to load .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
} else {
  console.log(`Successfully loaded .env from: ${envPath}`);
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
const neo4jDriver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);

async function createVectorIndex() {
  console.log('=== Creating Neo4j Vector Index for bimbaKnowing ===');

  const session = neo4jDriver.session();

  try {
    // Step 1: Check Neo4j connection
    console.log('\nStep 1: Checking Neo4j connection...');
    const connectionQuery = "RETURN 'Connected to Neo4j' as status";
    const connectionResult = await session.run(connectionQuery);
    console.log(`✅ ${connectionResult.records[0].get('status')}`);

    // Step 2: Check if index already exists
    console.log('\nStep 2: Checking if vector index already exists...');
    const checkIndexQuery = `
      SHOW INDEXES
      YIELD name, type, state
      WHERE type = 'VECTOR' AND name = 'bimba_embedding_index'
      RETURN name, state
    `;

    const indexResult = await session.run(checkIndexQuery);

    if (indexResult.records.length > 0) {
      const indexState = indexResult.records[0].get('state');
      console.log(`⚠️ Vector index 'bimba_embedding_index' already exists (State: ${indexState})`);
      console.log('Proceeding to drop and recreate the index...');
    }

    // Step 3: Drop existing index if it exists
    console.log('\nStep 3: Dropping existing index if it exists...');
    const dropIndexQuery = `
      DROP INDEX bimba_embedding_index IF EXISTS
    `;

    await session.run(dropIndexQuery);
    console.log('✅ Dropped existing index (if it existed)');

    // Step 4: Find nodes with embeddings and their labels
    console.log('\nStep 4: Finding nodes with embeddings...');
    const findNodesQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      RETURN labels(n) AS labels, count(*) AS count
      ORDER BY count DESC
      LIMIT 5
    `;

    const nodesResult = await session.run(findNodesQuery);

    if (nodesResult.records.length === 0) {
      console.log('❌ No nodes with embeddings found. Please generate embeddings first.');
      return;
    }

    console.log('Found nodes with the following labels:');
    nodesResult.records.forEach(record => {
      const labels = record.get('labels');
      const count = record.get('count');
      console.log(`- ${labels.join(', ')}: ${count} nodes`);
    });

    // Step 5: Create the vector index
    console.log('\nStep 5: Creating vector index...');

    // Using the correct syntax for Neo4j vector index creation
    // Add a common label to all nodes with embeddings
    console.log('Step 5.1: Adding a common label "VectorNode" to all nodes with embeddings...');

    const addLabelQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      SET n:VectorNode
      RETURN count(n) as nodesLabeled
    `;

    const labelResult = await session.run(addLabelQuery);

    // Handle the result safely, as it might not be a Neo4j Integer
    let nodesLabeled = 0;
    if (labelResult.records.length > 0) {
      const result = labelResult.records[0].get('nodesLabeled');
      nodesLabeled = typeof result.toNumber === 'function' ? result.toNumber() : Number(result);
    }

    console.log(`✅ Added "VectorNode" label to ${nodesLabeled} nodes with embeddings`);

    // Create a single vector index on the common label
    console.log('Step 5.2: Creating a single vector index for all nodes with the VectorNode label...');

    const createIndexQuery = `
      CALL db.index.vector.createNodeIndex(
        'bimba_embedding_index',
        'VectorNode',
        'embedding',
        768,
        'cosine'
      )
    `;

    await session.run(createIndexQuery);
    console.log('✅ Vector index created successfully for all nodes with embeddings');

    // Step 6: Verify the index was created
    console.log('\nStep 6: Verifying index creation...');
    const verifyQuery = `
      SHOW INDEXES
      YIELD name, type, state, entityType, labelsOrTypes, properties
      WHERE name = 'bimba_embedding_index'
      RETURN name, state, entityType, labelsOrTypes, properties
    `;

    const verifyResult = await session.run(verifyQuery);

    if (verifyResult.records.length > 0) {
      console.log(`✅ Found ${verifyResult.records.length} vector indexes:`);

      verifyResult.records.forEach(record => {
        console.log(`
        Name: ${record.get('name')}
        State: ${record.get('state')}
        Entity Type: ${record.get('entityType')}
        Labels/Types: ${record.get('labelsOrTypes')}
        Properties: ${record.get('properties')}
        `);
      });
    } else {
      console.log('❌ Failed to verify index creation');
    }

    console.log('\n=== Vector Index Creation Complete ===');
    console.log('Note: The index may take a moment to become ONLINE. If queries fail,');
    console.log('wait a few moments and try again.');

  } catch (error) {
    console.error('Error during index creation:', error);
  } finally {
    await session.close();
    await neo4jDriver.close();
  }
}

// Run the function
createVectorIndex().catch(error => {
  console.error('Failed to create vector index:', error);
  process.exit(1);
});
