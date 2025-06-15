// Admin tool to create the vector index for bimbaKnowing tool
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

console.log(`Loading .env from: ${envPath}`);
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

// Helper function to safely get a number from a Neo4j result
function safeGetNumber(record, key) {
  if (!record) return 0;
  const value = record.get(key);
  if (value === null || value === undefined) return 0;
  return typeof value.toNumber === 'function' ? value.toNumber() : Number(value);
}

async function createVectorIndex() {
  console.log('=== Creating Neo4j Vector Index for bimbaKnowing ===');
  
  const session = neo4jDriver.session();
  
  try {
    // Step 1: Check Neo4j connection
    console.log('\nStep 1: Checking Neo4j connection...');
    const connectionQuery = "RETURN 'Connected to Neo4j' as status";
    const connectionResult = await session.run(connectionQuery);
    console.log(`✅ ${connectionResult.records[0].get('status')}`);
    
    // Step 2: Count total nodes with embeddings
    console.log('\nStep 2: Counting nodes with embeddings...');
    const countNodesQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      RETURN count(n) as totalNodes
    `;
    
    const countResult = await session.run(countNodesQuery);
    const totalNodes = safeGetNumber(countResult.records[0], 'totalNodes');
    
    if (totalNodes === 0) {
      console.log('❌ No nodes with embeddings found. Please generate embeddings first.');
      return;
    }
    
    console.log(`✅ Found ${totalNodes} nodes with embeddings`);
    
    // Step 3: Get a sample of node labels for informational purposes
    console.log('\nStep 3: Sampling node labels (for information only)...');
    const sampleLabelsQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      RETURN labels(n) AS labels, count(*) AS count
      ORDER BY count DESC
      LIMIT 10
    `;
    
    const labelsResult = await session.run(sampleLabelsQuery);
    
    console.log('Sample of node labels with embeddings:');
    labelsResult.records.forEach(record => {
      const labels = record.get('labels');
      const count = safeGetNumber(record, 'count');
      console.log(`- ${labels.join(', ')}: ${count} nodes`);
    });
    
    // Step 4: Drop existing index if it exists
    console.log('\nStep 4: Dropping existing index if it exists...');
    const dropIndexQuery = `
      DROP INDEX bimba_embedding_index IF EXISTS
    `;
    
    await session.run(dropIndexQuery);
    console.log('✅ Dropped existing index (if it existed)');
    
    // Step 5: Add VectorNode label to ALL nodes with embeddings
    console.log('\nStep 5: Adding VectorNode label to ALL nodes with embeddings...');
    const addLabelQuery = `
      MATCH (n)
      WHERE n.embedding IS NOT NULL
      SET n:VectorNode
      RETURN count(n) as nodesLabeled
    `;
    
    const labelResult = await session.run(addLabelQuery);
    const nodesLabeled = safeGetNumber(labelResult.records[0], 'nodesLabeled');
    
    console.log(`✅ Added VectorNode label to ${nodesLabeled} nodes with embeddings`);
    
    // Step 6: Create vector index for VectorNode label
    console.log('\nStep 6: Creating vector index for VectorNode label...');
    const createIndexQuery = `
      CREATE VECTOR INDEX bimba_embedding_index
      FOR (n:VectorNode)
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
    console.log('✅ Vector index created successfully');
    
    // Step 7: Verify the index was created
    console.log('\nStep 7: Verifying index creation...');
    const verifyQuery = `
      SHOW INDEXES
      YIELD name, type, state, entityType, labelsOrTypes, properties
      WHERE name = 'bimba_embedding_index'
      RETURN name, state, entityType, labelsOrTypes, properties
    `;
    
    const verifyResult = await session.run(verifyQuery);
    
    if (verifyResult.records.length > 0) {
      const record = verifyResult.records[0];
      console.log(`✅ Vector index verified:
        Name: ${record.get('name')}
        State: ${record.get('state')}
        Entity Type: ${record.get('entityType')}
        Labels/Types: ${record.get('labelsOrTypes')}
        Properties: ${record.get('properties')}
      `);
    } else {
      console.log('❌ Failed to verify index creation');
    }
    
    // Step 8: Count nodes with VectorNode label
    console.log('\nStep 8: Counting nodes with VectorNode label...');
    const countVectorNodesQuery = `
      MATCH (n:VectorNode)
      RETURN count(n) as vectorNodeCount
    `;
    
    const vectorNodeResult = await session.run(countVectorNodesQuery);
    const vectorNodeCount = safeGetNumber(vectorNodeResult.records[0], 'vectorNodeCount');
    
    console.log(`✅ Found ${vectorNodeCount} nodes with VectorNode label`);
    
    if (vectorNodeCount !== totalNodes) {
      console.log(`⚠️ Warning: ${totalNodes - vectorNodeCount} nodes with embeddings do not have the VectorNode label`);
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
