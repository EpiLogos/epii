// execute_cypher_update.mjs
// Executes the generated Cypher script to update Bimba nodes with Notion IDs

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import fs from 'fs/promises';

// Load .env from absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CYPHER_SCRIPT_PATH = path.resolve(__dirname, 'update_bimba_notion_ids.cypher');
const BATCH_FILE_PATH = path.resolve(__dirname, 'notion_id_batch.json'); // Batch file is in script directory

// --- INIT CLIENTS ---
const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// --- MAIN SCRIPT ---
async function main() {
  const session = neo4jDriver.session({ database: 'neo4j' }); // Explicitly specify default database
  console.log('Connected to Neo4j database "neo4j".');

  try {
    // 1. Read the Cypher script
    const cypherScriptContent = await fs.readFile(CYPHER_SCRIPT_PATH, 'utf-8');
    console.log('Read Cypher script.');

    // 2. Read the batch data directly from the batch file
    const batch = JSON.parse(await fs.readFile(BATCH_FILE_PATH, 'utf-8'));
    console.log(`Read batch data with ${batch.length} items from ${BATCH_FILE_PATH}.`);

    // 3. Execute the Cypher script with the batch parameter
    console.log('Executing Cypher script...');
    const result = await session.run(cypherScriptContent, { batch });

    const updatedCount = result.summary.counters.updates().nodesSet || 0; // Adjust based on actual counter name if needed
    console.log(`Successfully executed Cypher script. Updated ${updatedCount} nodes.`);

  } catch (error) {
    console.error('Error executing Cypher script:', error);
  } finally {
    await session.close();
    await neo4jDriver.close();
    console.log('Neo4j connection closed.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
