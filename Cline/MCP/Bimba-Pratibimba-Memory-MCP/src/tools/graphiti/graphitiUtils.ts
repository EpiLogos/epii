import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import {
  DeleteGraphitiEpisodeSchema,
  DeleteGraphitiEntityEdgeSchema,
  GetGraphitiEntityEdgeSchema,
  ClearGraphitiGraphSchema,
  GetGraphitiStatusSchema
} from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definitions
export const deleteGraphitiEpisodeTool: Tool = {
  name: "deleteGraphitiEpisode",
  description: "Delete an episode from Graphiti's temporal knowledge graph by UUID.",
  inputSchema: zodToJsonSchema(DeleteGraphitiEpisodeSchema),
};

export const deleteGraphitiEntityEdgeTool: Tool = {
  name: "deleteGraphitiEntityEdge",
  description: "Delete an entity edge (relationship) from Graphiti's temporal knowledge graph by UUID.",
  inputSchema: zodToJsonSchema(DeleteGraphitiEntityEdgeSchema),
};

export const getGraphitiEntityEdgeTool: Tool = {
  name: "getGraphitiEntityEdge",
  description: "Get an entity edge (relationship) from Graphiti's temporal knowledge graph by UUID.",
  inputSchema: zodToJsonSchema(GetGraphitiEntityEdgeSchema),
};

export const clearGraphitiGraphTool: Tool = {
  name: "clearGraphitiGraph",
  description: "Clear all data from Graphiti's temporal knowledge graph. WARNING: This is irreversible!",
  inputSchema: zodToJsonSchema(ClearGraphitiGraphSchema),
};

export const getGraphitiStatusTool: Tool = {
  name: "getGraphitiStatus",
  description: "Get the status of the Graphiti MCP server and Neo4j connection.",
  inputSchema: zodToJsonSchema(GetGraphitiStatusSchema),
};

/**
 * Delete an episode from Graphiti
 */
export async function handleDeleteGraphitiEpisode(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = DeleteGraphitiEpisodeSchema.parse(args);
    const logPrefix = `[deleteGraphitiEpisode]`;

    console.log(`${logPrefix} Deleting episode: ${validatedArgs.uuid}`);

    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    const response = await graphitiClient.deleteEpisode(validatedArgs.uuid);

    if (response.isError) {
      throw new Error(`Episode deletion failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Episode ${validatedArgs.uuid} deleted successfully`,
            uuid: validatedArgs.uuid,
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
            uuid: args.uuid,
            timestamp: new Date().toISOString(),
            tool: 'deleteGraphitiEpisode'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

/**
 * Delete an entity edge from Graphiti
 */
export async function handleDeleteGraphitiEntityEdge(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = DeleteGraphitiEntityEdgeSchema.parse(args);
    const logPrefix = `[deleteGraphitiEntityEdge]`;

    console.log(`${logPrefix} Deleting entity edge: ${validatedArgs.uuid}`);

    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    const response = await graphitiClient.deleteEntityEdge(validatedArgs.uuid);

    if (response.isError) {
      throw new Error(`Entity edge deletion failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Entity edge ${validatedArgs.uuid} deleted successfully`,
            uuid: validatedArgs.uuid,
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
            uuid: args.uuid,
            timestamp: new Date().toISOString(),
            tool: 'deleteGraphitiEntityEdge'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

/**
 * Get an entity edge from Graphiti
 */
export async function handleGetGraphitiEntityEdge(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = GetGraphitiEntityEdgeSchema.parse(args);
    const logPrefix = `[getGraphitiEntityEdge]`;

    console.log(`${logPrefix} Getting entity edge: ${validatedArgs.uuid}`);

    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    const response = await graphitiClient.getEntityEdge(validatedArgs.uuid);

    if (response.isError) {
      throw new Error(`Entity edge retrieval failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    let entityEdgeData;
    try {
      const responseText = response.content[0]?.text || '{}';
      entityEdgeData = JSON.parse(responseText);
    } catch (parseError) {
      entityEdgeData = { raw_response: response.content[0]?.text };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            uuid: validatedArgs.uuid,
            entityEdge: entityEdgeData,
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
            uuid: args.uuid,
            timestamp: new Date().toISOString(),
            tool: 'getGraphitiEntityEdge'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

/**
 * Clear the Graphiti graph
 */
export async function handleClearGraphitiGraph(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = ClearGraphitiGraphSchema.parse(args);
    const logPrefix = `[clearGraphitiGraph]`;

    if (!validatedArgs.confirmClear) {
      throw new Error('Graph clearing requires explicit confirmation. Set confirmClear to true.');
    }

    console.log(`${logPrefix} Clearing Graphiti graph - WARNING: This is irreversible!`);

    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    const response = await graphitiClient.clearGraph();

    if (response.isError) {
      throw new Error(`Graph clearing failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: 'Graphiti graph cleared successfully',
            warning: 'All graph data has been permanently deleted',
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
            tool: 'clearGraphitiGraph'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

/**
 * Get Graphiti server status
 */
export async function handleGetGraphitiStatus(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = GetGraphitiStatusSchema.parse(args);
    const logPrefix = `[getGraphitiStatus]`;

    console.log(`${logPrefix} Checking Graphiti server status`);

    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    const response = await graphitiClient.getStatus();

    let statusData;
    try {
      const responseText = response.content[0]?.text || '{}';
      statusData = JSON.parse(responseText);
    } catch (parseError) {
      statusData = {
        status: response.isError ? 'error' : 'unknown',
        message: response.content[0]?.text || 'Status check completed'
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: !response.isError,
            serverStatus: statusData,
            serverUrl: 'http://localhost:8000',
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
            serverUrl: 'http://localhost:8000',
            timestamp: new Date().toISOString(),
            tool: 'getGraphitiStatus'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
