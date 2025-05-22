import WebSocket from 'ws';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const WS_SERVER_URL = process.env.BP_MCP_WS_URL || 'ws://localhost:3030/mcp';
const REQUEST_TIMEOUT = parseInt(process.env.BP_MCP_REQUEST_TIMEOUT || '30000', 10);
const RECONNECT_INTERVAL = parseInt(process.env.BP_MCP_RECONNECT_INTERVAL || '5000', 10);

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
      
      // Send request
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

// Export methods
export const callBPMCPTool = async (toolName, args) => {
  try {
    console.log(`Calling B-P MCP tool '${toolName}' via WebSocket`);
    const result = await bpWebSocketClient.callTool(toolName, args);
    
    // Process result
    if (result?.isError) {
      const errorContent = result.content?.[0]?.text || "Unknown MCP tool error";
      console.error(`B-P MCP Tool '${toolName}' returned an error:`, errorContent);
      throw new Error(`MCP Tool Error (${toolName}): ${errorContent}`);
    }
    
    // Extract content
    const resultText = result?.content?.[0]?.text;
    if (resultText) {
      try {
        // Attempt to parse if it looks like JSON
        return JSON.parse(resultText);
      } catch (parseError) {
        // Return as plain text if not JSON
        return resultText;
      }
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
