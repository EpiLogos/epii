import { graph } from './databases/neo4j/neo4j.service.mjs';
import { qdrantClient } from './databases/lightrag/qdrant.service.mjs';
import { getDb } from './databases/mongodb/mongo.service.mjs';
import { notionClient, NOTION_DATABASE_ID } from './databases/notion/notion.service.mjs';

async function verifyConnections() {
  console.log("--- Verifying Connections ---");

  // Verify Neo4j
  console.log("\nVerifying Neo4j connection...");
  if (graph) {
    try {
      await graph.query('RETURN 1 AS result');
      console.log("Neo4j connection: SUCCESS");
    } catch (error) {
      console.error("Neo4j connection: FAILED");
      console.error("Neo4j Error:", error.message);
    }
  } else {
    console.error("Neo4j connection: FAILED (Graph client not initialized)");
  }

  // Verify Qdrant
  console.log("\nVerifying Qdrant connection...");
  if (qdrantClient) {
    try {
      await qdrantClient.getCollections(); // Simple operation to check connectivity
      console.log("Qdrant connection: SUCCESS");
    } catch (error) {
      console.error("Qdrant connection: FAILED");
      console.error("Qdrant Error:", error.message);
    }
  } else {
    console.error("Qdrant connection: FAILED (Qdrant client not initialized)");
  }

  // Verify MongoDB
  console.log("\nVerifying MongoDB connection...");
  try {
    const db = await getDb(); // This function handles connection attempt
    if (db) {
      // Optional: Ping command for more robust check
      await db.admin().ping();
      console.log("MongoDB connection: SUCCESS");
    } else {
      console.error("MongoDB connection: FAILED (Could not get DB instance)");
    }
  } catch (error) {
    console.error("MongoDB connection: FAILED");
    console.error("MongoDB Error:", error.message);
  }

  // Verify Notion
  console.log("\nVerifying Notion connection...");
  if (notionClient && NOTION_DATABASE_ID) {
    try {
      // Retrieve database info as a connection test
      await notionClient.databases.retrieve({ database_id: NOTION_DATABASE_ID });
      console.log("Notion connection: SUCCESS (Able to retrieve DB info)");
    } catch (error) {
      console.error("Notion connection: FAILED");
      console.error("Notion Error:", error.message || error.body);
      console.error("Ensure NOTION_API_KEY and NOTION_CRYSTALLIZED_DB_ID are correct in .env");
    }
  } else if (!notionClient) {
     console.error("Notion connection: FAILED (Notion client not initialized - check NOTION_API_KEY)");
  } else {
     console.error("Notion connection: FAILED (NOTION_CRYSTALLIZED_DB_ID not set in .env)");
  }


  console.log("\n--- Verification Complete ---");
  // Optionally close connections if needed, though script exit usually handles this
  // e.g., const mongoClient = await getClient(); if (mongoClient) await mongoClient.close();
}

verifyConnections();
