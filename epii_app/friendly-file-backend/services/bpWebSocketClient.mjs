import WebSocket from 'ws';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Configuration
const WS_SERVER_URL = process.env.BP_MCP_WS_URL || 'ws://localhost:3030/mcp';
const REQUEST_TIMEOUT = parseInt(process.env.BP_MCP_REQUEST_TIMEOUT || '300000', 10); // Increased to 300s (5 minutes) for LLM calls
const RECONNECT_INTERVAL = parseInt(process.env.BP_MCP_RECONNECT_INTERVAL || '5000', 10);
const MAX_RETRIES = parseInt(process.env.BP_MCP_MAX_RETRIES || '3', 10);
const CACHE_ENABLED = process.env.BP_MCP_CACHE_ENABLED !== 'false'; // Enable caching by default
const CACHE_TTL = parseInt(process.env.BP_MCP_CACHE_TTL || '300000', 10); // Cache TTL in ms (5 minutes default)

// Cache directory setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '../cache');

// Create cache directory if it doesn't exist
if (CACHE_ENABLED && !fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`Created cache directory at ${CACHE_DIR}`);
  } catch (error) {
    console.error(`Failed to create cache directory: ${error.message}`);
  }
}

class BPWebSocketClient {
  constructor(options = {}) {
    this.url = options.url || WS_SERVER_URL;
    this.name = options.name || 'epii-backend-client';
    this.version = options.version || '1.0.0';
    this.reconnectInterval = options.reconnectInterval || RECONNECT_INTERVAL;
    this.requestTimeout = options.requestTimeout || REQUEST_TIMEOUT;

    this.ws = null;
    this.connected = false;
    this.connecting = false;
    this.requestId = 0;
    this.pendingRequests = new Map();

    // Bind methods
    this.connect = this.connect.bind(this);
    this.callTool = this.callTool.bind(this);
    this.close = this.close.bind(this);
  }

  async connect() {
    if (this.connected || this.connecting) {
      return;
    }

    this.connecting = true;

    return new Promise((resolve, reject) => {
      console.log(`Connecting to B-P MCP WebSocket server at ${this.url}`);

      try {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
          console.log('Connected to B-P MCP WebSocket server');
          this.connected = true;
          this.connecting = false;
          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());

            // Check if this is a response to a pending request
            if (message.id && this.pendingRequests.has(message.id)) {
              const { resolve, reject, timer } = this.pendingRequests.get(message.id);

              // Clear timeout timer
              clearTimeout(timer);

              // Remove from pending requests
              this.pendingRequests.delete(message.id);

              // Handle response
              if (message.error) {
                reject(new Error(message.error.message || 'Unknown error'));
              } else {
                resolve(message.result);
              }
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });

        this.ws.on('close', () => {
          console.log('Disconnected from B-P MCP WebSocket server');
          this.connected = false;
          this.connecting = false;

          // Reject all pending requests
          for (const [id, { reject, timer }] of this.pendingRequests.entries()) {
            clearTimeout(timer);
            reject(new Error('WebSocket connection closed'));
            this.pendingRequests.delete(id);
          }

          // Attempt to reconnect
          setTimeout(() => {
            if (!this.connected && !this.connecting) {
              this.connect().catch(error => {
                console.error('Error reconnecting to B-P MCP WebSocket server:', error);
              });
            }
          }, this.reconnectInterval);
        });

        this.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.connecting = false;
          reject(error);
        });
      } catch (error) {
        this.connecting = false;
        reject(error);
      }
    });
  }

  async callTool(toolName, args) {
    // Ensure we're connected
    if (!this.connected) {
      try {
        await this.connect();
      } catch (error) {
        throw new Error(`Failed to connect to WebSocket server: ${error.message}`);
      }
    }

    // Create request ID
    const id = (++this.requestId).toString();

    // Create request
    const request = {
      id,
      method: 'callTool',
      params: {
        name: toolName,
        arguments: args
      }
    };

    return new Promise((resolve, reject) => {
      // Set timeout
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout for tool ${toolName}`));
        }
      }, this.requestTimeout);

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject, timer });

      // Log the request for debugging
      if (request.params && request.params.arguments) {
        console.log(`Sending arguments for ${request.params.name}:`,
          JSON.stringify(request.params.arguments, null, 2));
      }

      // Send the request without any processing
      // The server now uses neo4j.int() to properly convert numeric values to Neo4j integers
      this.ws.send(JSON.stringify(request));
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.connecting = false;
    }
  }
}

// Create singleton instance
const bpWebSocketClient = new BPWebSocketClient();

// Function to map parameter names between client and server
const mapToolParameters = (toolName, args) => {
  // Clone the args to avoid modifying the original
  const mappedArgs = { ...args };

  // Map parameter names based on the tool
  switch (toolName) {
    case 'getNotionPageProperties':
      // Map notionPageId to pageId
      if (mappedArgs.notionPageId) {
        mappedArgs.pageId = mappedArgs.notionPageId;
        delete mappedArgs.notionPageId;
      }
      // Map fetchFileFromProperty to filePropertyName
      if (mappedArgs.fetchFileFromProperty) {
        mappedArgs.filePropertyName = mappedArgs.fetchFileFromProperty;
        delete mappedArgs.fetchFileFromProperty;
      }
      // Add default includeContent if not present
      if (mappedArgs.includeContent === undefined) {
        mappedArgs.includeContent = true;
      }
      break;

    case 'appendNotionBlock':
      // Map notionPageId to pageId
      if (mappedArgs.notionPageId) {
        mappedArgs.pageId = mappedArgs.notionPageId;
        delete mappedArgs.notionPageId;
      }
      break;

    case 'crystallizeToNotion':
      // Add debugging to see what's happening
      console.log(`DEBUG - crystallizeToNotion - targetBimbaCoordinate: ${mappedArgs.targetBimbaCoordinate}`);

      // Log the properties being sent
      if (mappedArgs.properties) {
        console.log(`DEBUG - crystallizeToNotion - properties:`, JSON.stringify(mappedArgs.properties, null, 2));

        // Fix property names if needed
        if (mappedArgs.properties["Type"] && !mappedArgs.properties["Content Type"]) {
          // Rename Type to Content Type
          mappedArgs.properties["Content Type"] = mappedArgs.properties["Type"];
          delete mappedArgs.properties["Type"];
        }

        // Log the properties being sent - we're now using simple string values
        // The MCP's formatPropertyValue function will convert these to the correct Notion API format
        if (mappedArgs.properties) {
          console.log("DEBUG - Properties being sent to MCP:", JSON.stringify(mappedArgs.properties, null, 2));

          // Ensure Content Type is a simple string
          if (mappedArgs.properties["Content Type"] && typeof mappedArgs.properties["Content Type"] !== 'string') {
            // If it's not a string, convert it to "Crystallization"
            mappedArgs.properties["Content Type"] = "Crystallization";
            console.log("DEBUG - Converted Content Type to simple string:", mappedArgs.properties["Content Type"]);
          }

          // Ensure Status is a simple string
          if (mappedArgs.properties["Status"] && typeof mappedArgs.properties["Status"] !== 'string') {
            // If it's not a string, convert it to "1"
            mappedArgs.properties["Status"] = "1";
            console.log("DEBUG - Converted Status to simple string:", mappedArgs.properties["Status"]);
          }
        }
      }
      break;

    // Add other tools as needed
  }

  return mappedArgs;
};

// Export methods
export const callBPMCPTool = async (toolName, args) => {
  try {
    console.log(`Calling B-P MCP tool '${toolName}' via WebSocket`);

    // Map parameter names if needed
    const mappedArgs = mapToolParameters(toolName, args);

    // Log the final arguments being sent to the MCP
    if (toolName === 'crystallizeToNotion' && mappedArgs.properties) {
      console.log("FINAL CHECK - Properties being sent to MCP:", JSON.stringify(mappedArgs.properties, null, 2));
    }

    const result = await bpWebSocketClient.callTool(toolName, mappedArgs);

    // Process result
    if (result?.isError) {
      const errorContent = result.content?.[0]?.text || "Unknown MCP tool error";
      console.error(`B-P MCP Tool '${toolName}' returned an error:`, errorContent);

      // Special handling for deleteDocument tool - if the error is "Document not found",
      // consider it a success since the document is already gone
      if (toolName === 'deleteDocument' &&
          (errorContent.includes('Document not found') ||
           errorContent.includes('not found') ||
           errorContent.includes('Invalid document ID format'))) {
        console.log(`Document deletion 'error' is actually a success - document is already gone`);
        return { success: true, message: 'Document already deleted or not found' };
      }

      throw new Error(`MCP Tool Error (${toolName}): ${errorContent}`);
    }

    // For bimbaKnowing, return the raw MCP response to let the tool handler process it
    if (toolName === 'bimbaKnowing') {
      return result;
    }

    // Special handling for deleteDocument tool - ensure we always return a consistent response
    if (toolName === 'deleteDocument') {
      // If we got here, the deletion was successful
      console.log(`Document deletion successful via WebSocket`);

      // Ensure we return a consistent response format
      if (typeof result === 'object' && !Array.isArray(result)) {
        return { ...result, success: true };
      } else {
        return { success: true, message: 'Document deleted successfully' };
      }
    }

    // For other tools, extract content as before
    const resultText = result?.content?.[0]?.text;
    if (resultText) {
      try {
        // Attempt to parse if it looks like JSON
        if (resultText.trim().startsWith('{') || resultText.trim().startsWith('[')) {
          return JSON.parse(resultText);
        } else {
          // Return as plain text if not JSON-like
          return resultText;
        }
      } catch (parseError) {
        console.warn(`Failed to parse JSON response for tool ${toolName}:`, parseError.message);
        // Return as plain text if JSON parsing fails
        return resultText;
      }
    } else if (result?.content && Array.isArray(result.content)) {
      // If there's content but no text property, return the content array
      console.log(`Returning content array for tool ${toolName}`);
      return result.content;
    } else {
      // Return the raw result if no text content found
      console.warn(`No text content found in response for tool ${toolName}. Returning raw result.`);
      return result;
    }
  } catch (error) {
    console.error(`Error calling B-P MCP tool '${toolName}' via WebSocket:`, error);
    throw error;
  }
};

export const closeBPMCPClient = () => {
  bpWebSocketClient.close();
};

// Handle process exit
process.on('exit', () => {
  closeBPMCPClient();
});
