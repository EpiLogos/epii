import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { SearchGraphitiEntitiesSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definition
export const searchGraphitiEntitiesTool: Tool = {
  name: "searchGraphitiEntities",
  description: "Search Graphiti's temporal knowledge graph for entity nodes with Bimba coordinate filtering. Returns node summaries with relationships and temporal context.",
  inputSchema: zodToJsonSchema(SearchGraphitiEntitiesSchema),
};

/**
 * Search for entities/nodes in Graphiti with coordinate-aware filtering
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleSearchGraphitiEntities(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = SearchGraphitiEntitiesSchema.parse(args);
    const logPrefix = `[searchGraphitiEntities]`;

    console.log(`${logPrefix} Searching entities with query: "${validatedArgs.query}"`);
    console.log(`${logPrefix} Bimba coordinate filter: ${validatedArgs.bimbaCoordinate || 'none'}`);
    console.log(`${logPrefix} Max nodes: ${validatedArgs.maxNodes}`);

    // Create Graphiti client
    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    // Connect to Graphiti MCP server
    console.log(`${logPrefix} Attempting to connect to Graphiti MCP server...`);

    // Prepare search parameters with coordinate filtering
    const searchParams = {
      query: validatedArgs.query,
      groupIds: validatedArgs.groupIds,
      maxNodes: validatedArgs.maxNodes,
      centerNodeUuid: validatedArgs.centerNodeUuid,
      entityType: validatedArgs.entityType,
      bimbaCoordinate: validatedArgs.bimbaCoordinate,
      qlVariant: validatedArgs.qlVariant,
      contextFrame: validatedArgs.contextFrame,
    };

    // Search entities in Graphiti
    const response = await graphitiClient.searchEntities(searchParams);

    if (response.isError) {
      throw new Error(`Graphiti entity search failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    // Parse the response to extract nodes
    let searchResults;
    try {
      const responseText = response.content[0]?.text || '{}';
      searchResults = JSON.parse(responseText);
    } catch (parseError) {
      // If response is not JSON, treat as plain text
      searchResults = {
        message: response.content[0]?.text || 'No results found',
        nodes: []
      };
    }

    console.log(`${logPrefix} Found ${searchResults.nodes?.length || 0} entities`);

    // Enhance results with coordinate context
    const enhancedResults = {
      success: true,
      query: validatedArgs.query,
      searchContext: {
        bimbaCoordinate: validatedArgs.bimbaCoordinate,
        qlVariant: validatedArgs.qlVariant,
        contextFrame: validatedArgs.contextFrame,
        entityTypeFilter: validatedArgs.entityType,
        maxNodes: validatedArgs.maxNodes,
      },
      results: {
        message: searchResults.message || 'Entities retrieved successfully',
        nodeCount: searchResults.nodes?.length || 0,
        nodes: searchResults.nodes || [],
      },
      timestamp: new Date().toISOString(),
      graphitiResponse: response
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(enhancedResults, null, 2)
        }
      ]
    };

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    console.error(`[searchGraphitiEntities] Error:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            query: args.query,
            timestamp: new Date().toISOString(),
            tool: 'searchGraphitiEntities'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
