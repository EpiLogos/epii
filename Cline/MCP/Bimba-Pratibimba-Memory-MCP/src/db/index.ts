import neo4j from "neo4j-driver";
import { QdrantClient } from "@qdrant/js-client-rest";
import { MongoClient } from "mongodb";
import { Config, DatabaseConnections } from "../types/index.js";

/**
 * Initialize database connections
 * @param config Configuration object
 * @returns Database connections
 */
export async function initializeDatabases(config: Config): Promise<DatabaseConnections> {
  // Initialize Neo4j driver
  const neo4jDriver = neo4j.driver(
    config.neo4j.uri,
    neo4j.auth.basic(config.neo4j.username, config.neo4j.password),
    { disableLosslessIntegers: true }
  );
  
  // Test Neo4j connection
  try {
    const session = neo4jDriver.session();
    await session.run("RETURN 1");
    await session.close();
    console.log("Neo4j connection successful");
  } catch (error) {
    console.error("Neo4j connection failed:", error);
    throw error;
  }
  
  // Initialize Qdrant client
  const qdrantClient = new QdrantClient({
    url: config.qdrant.url,
    apiKey: config.qdrant.apiKey,
  });
  
  // Initialize MongoDB client
  const mongoClient = new MongoClient(config.mongodb.uri);
  await mongoClient.connect();
  console.log("MongoDB connection successful");
  
  // Get MongoDB database
  const mongoDb = mongoClient.db(config.mongodb.dbName);
  
  return {
    neo4jDriver,
    qdrantClient,
    mongoClient,
    mongoDb,
  };
}

/**
 * Close database connections
 * @param connections Database connections
 */
export async function closeDatabases(connections: DatabaseConnections): Promise<void> {
  await connections.neo4jDriver.close();
  await connections.mongoClient.close();
  console.log("Database connections closed");
}
