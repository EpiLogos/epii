import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ToolDependencies } from "../types/index.js";
import { handleError } from "../utils/error.js";

interface Client {
  id: string;
}

interface CustomWebSocketServerTransportOptions {
  port: number;
  server: Server;
  dependencies: ToolDependencies;
  handlers: Record<string, Function>;
}

export class CustomWebSocketServerTransport {
  private httpServer: http.Server;
  private wss: WebSocketServer;
  private clients: Map<WebSocket, Client> = new Map();
  private server: Server;
  private dependencies: ToolDependencies;
  private handlers: Record<string, Function>;

  constructor(options: CustomWebSocketServerTransportOptions) {
    this.server = options.server;
    this.dependencies = options.dependencies;
    this.handlers = options.handlers;
    
    // Create HTTP server
    this.httpServer = http.createServer();

    // Create WebSocket server
    this.wss = new WebSocketServer({
      server: this.httpServer,
      path: '/mcp'
    });

    // Start HTTP server
    this.httpServer.listen(options.port, () => {
      console.log(`WebSocket MCP server running on port ${options.port}`);
    });

    // Handle connections
    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket) {
    const clientId = Math.random().toString(36).substring(2, 15);
    this.clients.set(ws, { id: clientId });

    console.log(`Client connected: ${clientId}`);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`[WebSocket] Received message from client ${clientId}:`, message.method);

        const response = await this.handleMessage(message, clientId);
        ws.send(JSON.stringify(response));
      } catch (error: any) {
        console.error(`[WebSocket] Error processing message:`, error);
        ws.send(JSON.stringify({
          error: {
            code: error.code || ErrorCode.InternalError,
            message: error.message || 'Unknown error'
          }
        }));
      }
    });

    ws.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      this.clients.delete(ws);
    });
  }

  private async handleMessage(message: any, clientId: string) {
    try {
      if (message.method === 'callTool') {
        const { name: toolName, arguments: args } = message.params;
        console.log(`[WebSocket] Calling tool ${toolName} for client ${clientId}`);

        // Get handler for the requested tool
        const handler = this.handlers[toolName];
        
        if (!handler) {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
        }
        
        // Call the handler with dependencies and arguments
        return await handler(this.dependencies, args);
      } else if (message.method === 'listTools') {
        console.log(`[WebSocket] Listing tools for client ${clientId}`);
        
        // Get tools list from server
        const response = await this.server.handleRequest({
          method: 'listTools',
          params: {}
        });
        
        return response;
      }

      throw new McpError(ErrorCode.MethodNotFound, `Unknown method: ${message.method}`);
    } catch (error: any) {
      console.error(`[WebSocket] Error handling message:`, error);
      throw handleError(error, message.params?.name || 'unknown');
    }
  }

  public close() {
    this.httpServer.close();
    this.wss.close();
    console.log("WebSocket server closed");
  }
}
