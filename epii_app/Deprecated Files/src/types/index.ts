import { McpError } from "@modelcontextprotocol/sdk/types.js";
import { Driver } from "neo4j-driver";
import { QdrantClient } from "@qdrant/js-client-rest";
import { MongoClient, Db } from "mongodb";
import { Client as NotionClient } from "@notionhq/client";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

/**
 * Tool definition
 */
export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
}

/**
 * Database connections
 */
export interface DatabaseConnections {
  neo4jDriver: Driver;
  qdrantClient: QdrantClient;
  mongoClient: MongoClient;
  mongoDb: Db;
}

/**
 * Services
 */
export interface Services {
  notionClient: NotionClient;
  embeddings: GoogleGenerativeAIEmbeddings;
}

/**
 * Dependencies for tool handlers
 */
export interface ToolDependencies {
  db: DatabaseConnections;
  services: Services;
}

/**
 * Handler function for a tool
 */
export type ToolHandler = (dependencies: ToolDependencies, args: any) => Promise<any>;

/**
 * Configuration
 */
export interface Config {
  neo4j: {
    uri: string;
    username: string;
    password: string;
  };
  qdrant: {
    url: string;
    apiKey?: string;
  };
  mongodb: {
    uri: string;
    dbName: string;
  };
  notion: {
    apiKey: string;
  };
  google: {
    apiKey: string;
    embeddingModel: string;
  };
  perplexity: {
    apiKey: string;
  };
  brave: {
    apiKey: string;
  };
  firecrawl: {
    apiKey: string;
  };
  server: {
    wsPort: number;
  };
}
