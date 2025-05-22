import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, handlers } from "./tools/index.js";
import { Config, ToolDependencies } from "./types/index.js";
import { CustomWebSocketServerTransport } from "./transports/websocket.js";
import { handleError } from "./utils/error.js";

export interface ServerOptions {
  config: Config;
  dependencies: ToolDependencies;
}

export interface ServerInstance {
  server: Server;
  wsTransport: CustomWebSocketServerTransport;
}

/**
 * Set up the MCP server
 * @param options Server options
 * @returns Server instance
 */
export async function setupServer(options: ServerOptions): Promise<ServerInstance> {
  const { config, dependencies } = options;
  
  // Create MCP server
  const server = new Server(
    {
      name: "Bimba-Pratibimba-Memory-MCP",
      version: "0.2.0",
      description: "A Model Context Protocol Server For Integration of Bimba-Pratibimba Memory System into IDE's and Agents",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );
  
  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });
  
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments;
    
    try {
      // Get handler for the requested tool
      const handler = handlers[toolName];
      
      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
      }
      
      // Call the handler with dependencies and arguments
      return await handler(dependencies, args);
    } catch (error: any) {
      throw handleError(error, toolName);
    }
  });
  
  // Connect MCP server via stdio transport (for backward compatibility)
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
  console.log("MCP server connected via stdio.");
  
  // Create and start WebSocket transport
  const wsTransport = new CustomWebSocketServerTransport({
    port: config.server.wsPort,
    server,
    dependencies,
    handlers,
  });
  
  return { server, wsTransport };
}
