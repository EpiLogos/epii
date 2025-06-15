#!/usr/bin/env node

/**
 * Bimba-Pratibimba Memory MCP Service
 *
 * This is the main entry point for the Bimba-Pratibimba Memory MCP service.
 * It initializes the database connections, services, and server.
 */

// Import modules
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from "dotenv";

// Import local modules
import { loadConfig } from "./config.js";
import { initializeDatabases, closeDatabases } from "./db/index.js";
import { initializeServices } from "./services/index.js";
import { setupServer } from "./server.js";
import { DatabaseConnections } from "./types/index.js";

/**
 * Main function to start the server
 */
async function main() {
  try {
    console.log("Starting Bimba-Pratibimba-Memory-MCP server...");

    // Load environment variables
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });

    // Load configuration
    const config = loadConfig();
    console.log("Configuration loaded successfully");

    // Initialize database connections
    const dbConnections = await initializeDatabases(config);
    console.log("Database connections initialized successfully");

    // Initialize services
    const services = initializeServices(config);
    console.log("Services initialized successfully");

    // Set up initial dependencies
    const dependencies = {
      db: dbConnections,
      services: services
    };

    // Set up server
    const { wsTransport } = await setupServer({
      config,
      dependencies
    });

    // Update dependencies with wsTransport for use in broadcastEvent tool
    // Use type assertion to avoid TypeScript error
    (dependencies as any).wsTransport = wsTransport;

    console.log("Bimba-Pratibimba-Memory-MCP server started successfully");

    // Handle process signals for graceful shutdown
    process.on('SIGINT', async () => {
      console.log("Received SIGINT signal");
      await shutdown(dbConnections, wsTransport);
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log("Received SIGTERM signal");
      await shutdown(dbConnections, wsTransport);
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Shutdown function to gracefully close connections
 */
async function shutdown(dbConnections: DatabaseConnections, wsTransport: any) {
  console.log("Shutting down Bimba-Pratibimba-Memory-MCP server...");

  // Close WebSocket transport
  if (wsTransport) {
    try {
      wsTransport.close();
      console.log("WebSocket transport closed");
    } catch (error) {
      console.error("Error closing WebSocket transport:", error);
    }
  }

  // Close database connections
  if (dbConnections) {
    try {
      await closeDatabases(dbConnections);
      console.log("Database connections closed");
    } catch (error) {
      console.error("Error closing database connections:", error);
    }
  }

  console.log("Shutdown complete");
}

// Start the server
main().catch(error => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});
