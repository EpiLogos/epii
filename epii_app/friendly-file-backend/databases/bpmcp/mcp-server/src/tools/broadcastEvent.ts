/**
 * Broadcast Event Tool
 *
 * This tool broadcasts an event to all connected WebSocket clients.
 * It's used for sending real-time updates to frontend clients.
 */

import { z } from "zod";
import { Tool, ToolDependencies } from "../types/index.js";
import { CustomWebSocketServerTransport } from "../transports/websocket.js";
import { zodToJsonSchema } from "../utils/zodToJsonSchema.js";

// Define the schema for the event
const EventSchema = z.object({
  type: z.string().describe("The type of event to broadcast"),
  documentId: z.string().optional().describe("Optional document ID related to the event"),
  analysisResults: z.any().optional().describe("Optional analysis results to include with the event"),
  timestamp: z.date().or(z.string()).optional().describe("Optional timestamp for the event")
});

// Define the tool
export const broadcastEventTool: Tool = {
  name: "broadcastEvent",
  description: "Broadcasts an event to all connected WebSocket clients",
  inputSchema: zodToJsonSchema(EventSchema)
};

// Define the handler
export const broadcastEventHandler = async (
  dependencies: ToolDependencies,
  args: z.infer<typeof EventSchema>
) => {
  try {
    // Get the WebSocket transport from dependencies
    const wsTransport = dependencies.wsTransport as CustomWebSocketServerTransport;

    if (!wsTransport || !wsTransport.wss) {
      throw new Error("WebSocket server not available");
    }

    // Create the event message
    const eventMessage = {
      type: "event",
      event: {
        ...args,
        timestamp: args.timestamp || new Date().toISOString()
      }
    };

    // Count of clients that received the message
    let clientCount = 0;

    // Broadcast to all connected clients
    wsTransport.wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(eventMessage));
        clientCount++;
      }
    });

    console.log(`Broadcasted ${args.type} event to ${clientCount} clients`);

    // Return success response
    return {
      success: true,
      message: `Event broadcasted to all connected clients`,
      clientCount
    };
  } catch (error: any) {
    console.error(`Error broadcasting event:`, error);
    throw new Error(`Failed to broadcast event: ${error.message}`);
  }
};
