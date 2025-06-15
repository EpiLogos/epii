import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { SearchGraphitiFactsSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definition
export const searchGraphitiFactsTool: Tool = {
  name: "searchGraphitiFacts",
  description: "Search Graphiti's temporal knowledge graph for facts (relationships between entities) with Bimba coordinate filtering. Returns relationship data with temporal context.",
  inputSchema: zodToJsonSchema(SearchGraphitiFactsSchema),
};

/**
 * Search for facts/relationships in Graphiti with coordinate-aware filtering
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleSearchGraphitiFacts(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = SearchGraphitiFactsSchema.parse(args);
    const logPrefix = `[searchGraphitiFacts]`;

    console.log(`${logPrefix} Searching facts with query: "${validatedArgs.query}"`);
    console.log(`${logPrefix} Bimba coordinate filter: ${validatedArgs.bimbaCoordinate || 'none'}`);
    console.log(`${logPrefix} Max facts: ${validatedArgs.maxFacts}`);

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
      maxFacts: validatedArgs.maxFacts,
      centerNodeUuid: validatedArgs.centerNodeUuid,
      bimbaCoordinate: validatedArgs.bimbaCoordinate,
      qlVariant: validatedArgs.qlVariant,
    };

    // Search facts in Graphiti
    const response = await graphitiClient.searchFacts(searchParams);

    if (response.isError) {
      throw new Error(`Graphiti facts search failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    // Parse the response to extract facts
    let searchResults;
    try {
      const responseText = response.content[0]?.text || '{}';
      searchResults = JSON.parse(responseText);
    } catch (parseError) {
      // If response is not JSON, treat as plain text
      searchResults = {
        message: response.content[0]?.text || 'No results found',
        facts: []
      };
    }

    console.log(`${logPrefix} Found ${searchResults.facts?.length || 0} facts`);

    // Enhance results with coordinate context
    const enhancedResults = {
      success: true,
      query: validatedArgs.query,
      searchContext: {
        bimbaCoordinate: validatedArgs.bimbaCoordinate,
        qlVariant: validatedArgs.qlVariant,
        maxFacts: validatedArgs.maxFacts,
        centerNodeUuid: validatedArgs.centerNodeUuid,
      },
      results: {
        message: searchResults.message || 'Facts retrieved successfully',
        factCount: searchResults.facts?.length || 0,
        facts: searchResults.facts || [],
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
    console.error(`[searchGraphitiFacts] Error:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            query: args.query,
            timestamp: new Date().toISOString(),
            tool: 'searchGraphitiFacts'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
