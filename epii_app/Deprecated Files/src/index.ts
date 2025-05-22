#!/usr/bin/env node

import { loadConfig } from "./config.js";
import { initializeDatabases, closeDatabases } from "./db/index.js";
import { initializeServices } from "./services/index.js";
import { setupServer } from "./server.js";
import { CustomWebSocketServerTransport } from "./transports/websocket.js";
import { DatabaseConnections } from "./types/index.js";

// Store WebSocket transport instance for shutdown
let wsTransport: CustomWebSocketServerTransport | null = null;

// Store database connections for shutdown
let dbConnections: DatabaseConnections | null = null;

// --- Graceful Shutdown ---
async function shutdown() {
  console.log("Shutting down server...");
  try {
    if (wsTransport) wsTransport.close();
    if (dbConnections) await closeDatabases(dbConnections);
    console.log("Connections closed.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown); // Ctrl+C
process.on('SIGTERM', shutdown); // Termination signal

// --- Server Startup ---
async function main() {
  try {
    // Load configuration
    const config = loadConfig();
    
    // Initialize databases
    const db = await initializeDatabases(config);
    dbConnections = db;
    
    // Initialize services
    const services = initializeServices(config);
    
    // Setup server
    const { server, wsTransport: transport } = await setupServer({
      config,
      dependencies: { db, services },
    });
    
    // Store transport for shutdown
    wsTransport = transport;
    
    console.log("Server started successfully");
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
}

// --- Run Server ---
main();
