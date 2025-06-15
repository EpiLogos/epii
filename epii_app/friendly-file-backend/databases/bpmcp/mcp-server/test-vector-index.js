// Test script for Neo4j vector index functionality
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
dotenv.config();

// Neo4j connection details
const NEO4J_URI = process.env.NEO4J_URI || 'neo4j://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// Create a Neo4j driver instance
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

async function testVectorIndex() {
  const session = driver.session();

  try {
    console.log('Testing Neo4j vector index functionality...');

    // Step 1: Check if the GenAI plugin is installed
    console.log('\n1. Checking if GenAI plugin is installed...');
    try {
      const pluginResult = await session.run(`
        CALL dbms.procedures()
        YIELD name
        WHERE name STARTS WITH 'genai.'
        RETURN count(name) > 0 AS genaiPluginInstalled
      `);

      const genaiPluginInstalled = pluginResult.records[0]?.get('genaiPluginInstalled');
      console.log(`GenAI plugin installed: ${genaiPluginInstalled ? 'YES' : 'NO'}`);

      if (!genaiPluginInstalled) {
        console.log('WARNING: GenAI plugin does not appear to be installed.');
        console.log('Please install the GenAI plugin and restart Neo4j.');
      }
    } catch (error) {
      console.error('Error checking GenAI plugin:', error.message);
    }

    // Step 2: Check if vector index procedures are available
    console.log('\n2. Checking if vector index procedures are available...');
    try {
      const proceduresResult = await session.run(`
        CALL dbms.procedures()
        YIELD name
        WHERE name CONTAINS 'vector' OR name = 'db.indexes'
        RETURN name
      `);

      if (proceduresResult.records.length === 0) {
        console.log('WARNING: No vector index procedures found.');
      } else {
        console.log('Vector index procedures available:');
        proceduresResult.records.forEach(record => {
          console.log(`- ${record.get('name')}`);
        });
      }
    } catch (error) {
      console.error('Error checking vector procedures:', error.message);
    }

    // Step 3: Try to create a test vector index
    console.log('\n3. Attempting to create a test vector index...');
    try {
      // First check if our test node exists
      const nodeCheckResult = await session.run(`
        MATCH (n:TestVectorNode)
        RETURN count(n) > 0 AS nodeExists
      `);

      const nodeExists = nodeCheckResult.records[0]?.get('nodeExists');

      if (!nodeExists) {
        console.log('Creating test node with embedding...');
        // Create a test node with an embedding
        await session.run(`
          CREATE (n:TestVectorNode {
            name: 'Test Vector Node',
            description: 'This is a test node for vector indexing',
            embedding: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
          })
        `);
        console.log('Test node created successfully.');
      } else {
        console.log('Test node already exists.');
      }

      // Try to create a vector index using Cypher
      console.log('Creating vector index using Cypher...');
      try {
        await session.run(`
          CREATE VECTOR INDEX test_vector_index IF NOT EXISTS
          FOR (n:TestVectorNode) ON (n.embedding)
          OPTIONS {
            indexConfig: {
              'vector.dimensions': 10,
              'vector.similarity_function': 'cosine'
            }
          }
        `);
        console.log('Vector index created successfully using Cypher.');
      } catch (cypherError) {
        console.error('Error creating vector index using Cypher:', cypherError.message);

        // If Cypher fails, try using the procedure
        console.log('Trying to create vector index using procedure...');
        try {
          await session.run(`
            CALL db.index.vector.createNodeIndex(
              'test_vector_index_proc',
              'TestVectorNode',
              'embedding',
              10,
              'cosine'
            )
          `);
          console.log('Vector index created successfully using procedure.');
        } catch (procError) {
          console.error('Error creating vector index using procedure:', procError.message);
        }
      }

      // Check if the index was created
      console.log('\n4. Checking if vector index was created...');
      try {
        const indexResult = await session.run(`
          SHOW INDEXES
          YIELD name, type
          WHERE type = 'VECTOR'
          RETURN name, type
        `);

        if (indexResult.records.length === 0) {
          console.log('WARNING: No vector indexes found.');

          // Try alternative method to list indexes
          try {
            console.log('Trying alternative method to list indexes...');
            const altIndexResult = await session.run(`
              CALL db.indexes()
              YIELD name, type
              WHERE type = 'VECTOR'
              RETURN name, type
            `);

            if (altIndexResult.records.length === 0) {
              console.log('WARNING: No vector indexes found using alternative method.');
            } else {
              console.log('Vector indexes found using alternative method:');
              altIndexResult.records.forEach(record => {
                console.log(`- ${record.get('name')} (${record.get('type')})`);
              });
            }
          } catch (altError) {
            console.error('Error using alternative method to list indexes:', altError.message);
          }
        } else {
          console.log('Vector indexes found:');
          indexResult.records.forEach(record => {
            console.log(`- ${record.get('name')} (${record.get('type')})`);
          });
        }
      } catch (error) {
        console.error('Error checking vector indexes:', error.message);
      }

      // Step 5: Try to query the vector index
      console.log('\n5. Attempting to query the vector index...');
      try {
        const queryVector = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.0];

        // Try using Cypher first
        try {
          console.log('Querying vector index using Cypher...');
          const queryResult = await session.run(`
            MATCH (n:TestVectorNode)
            WITH n, vector.similarity.cosine(n.embedding, $queryVector) AS score
            RETURN n.name, score
            ORDER BY score DESC
            LIMIT 5
          `, { queryVector });

          console.log('Query results using Cypher:');
          queryResult.records.forEach(record => {
            console.log(`- ${record.get('n.name')} (score: ${record.get('score')})`);
          });
        } catch (cypherQueryError) {
          console.error('Error querying vector index using Cypher:', cypherQueryError.message);
        }

        // Try using the procedure
        try {
          console.log('Querying vector index using procedure...');
          const procQueryResult = await session.run(`
            CALL db.index.vector.queryNodes('test_vector_index', 5, $queryVector)
            YIELD node, score
            RETURN node.name, score
            ORDER BY score DESC
          `, { queryVector });

          console.log('Query results using procedure:');
          if (procQueryResult.records.length === 0) {
            console.log('No results found.');
          } else {
            procQueryResult.records.forEach(record => {
              console.log(`- ${record.get('node.name')} (score: ${record.get('score')})`);
            });
          }
        } catch (procQueryError) {
          console.error('Error querying vector index using procedure:', procQueryError.message);

          // Try alternative procedure name
          try {
            console.log('Trying alternative procedure name...');
            const altProcQueryResult = await session.run(`
              CALL db.index.vector.queryNodeIndex('test_vector_index', $queryVector, 5)
              YIELD node, score
              RETURN node.name, score
              ORDER BY score DESC
            `, { queryVector });

            console.log('Query results using alternative procedure:');
            if (altProcQueryResult.records.length === 0) {
              console.log('No results found.');
            } else {
              altProcQueryResult.records.forEach(record => {
                console.log(`- ${record.get('node.name')} (score: ${record.get('score')})`);
              });
            }
          } catch (altProcQueryError) {
            console.error('Error querying vector index using alternative procedure:', altProcQueryError.message);
          }
        }
      } catch (error) {
        console.error('Error during vector query testing:', error.message);
      }

    } catch (error) {
      console.error('Error creating test vector index:', error.message);
    }

    console.log('\nTest completed.');

  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the test
testVectorIndex().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
