import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GetGraphitiContextSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definition
export const getGraphitiContextTool: Tool = {
  name: "getGraphitiContext",
  description: "Get comprehensive dynamic context for a Bimba coordinate from Graphiti's temporal knowledge graph. Combines entities, relationships, and recent episodes for coordinate-aware memory retrieval.",
  inputSchema: zodToJsonSchema(GetGraphitiContextSchema),
};

/**
 * Get dynamic context for a Bimba coordinate from Graphiti
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetGraphitiContext(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = GetGraphitiContextSchema.parse(args);
    const logPrefix = `[getGraphitiContext]`;

    console.log(`${logPrefix} Getting context for coordinate: ${validatedArgs.bimbaCoordinate}`);
    console.log(`${logPrefix} Context depth: ${validatedArgs.contextDepth}`);

    // Create Graphiti client
    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    // Connect to Graphiti MCP server
    console.log(`${logPrefix} Attempting to connect to Graphiti MCP server...`);

    const coordinate = validatedArgs.bimbaCoordinate;
    const contextResults: any = {
      coordinate: coordinate,
      contextDepth: validatedArgs.contextDepth,
      entities: [],
      facts: [],
      episodes: [],
      relatedCoordinates: [],
    };

    // 1. Search for entities related to this coordinate
    console.log(`${logPrefix} Searching entities for coordinate: ${coordinate}`);
    const entitiesResponse = await graphitiClient.searchEntities({
      query: `coordinate ${coordinate} entities context`,
      bimbaCoordinate: coordinate,
      maxNodes: 10,
    });

    if (!entitiesResponse.isError) {
      try {
        const entitiesData = JSON.parse(entitiesResponse.content[0]?.text || '{}');
        contextResults.entities = entitiesData.nodes || [];
      } catch (parseError) {
        console.warn(`${logPrefix} Failed to parse entities response`);
      }
    }

    // 2. Search for facts/relationships related to this coordinate
    console.log(`${logPrefix} Searching facts for coordinate: ${coordinate}`);
    const factsResponse = await graphitiClient.searchFacts({
      query: `coordinate ${coordinate} relationships context`,
      bimbaCoordinate: coordinate,
      maxFacts: 15,
    });

    if (!factsResponse.isError) {
      try {
        const factsData = JSON.parse(factsResponse.content[0]?.text || '{}');
        contextResults.facts = factsData.facts || [];
      } catch (parseError) {
        console.warn(`${logPrefix} Failed to parse facts response`);
      }
    }

    // 3. Get recent episodes for this coordinate
    console.log(`${logPrefix} Getting episodes for coordinate: ${coordinate}`);
    const episodesResponse = await graphitiClient.getEpisodes({
      bimbaCoordinate: coordinate,
      lastN: validatedArgs.maxEpisodes,
    });

    if (!episodesResponse.isError) {
      try {
        const episodesData = JSON.parse(episodesResponse.content[0]?.text || '[]');
        contextResults.episodes = Array.isArray(episodesData) ? episodesData : [];
      } catch (parseError) {
        console.warn(`${logPrefix} Failed to parse episodes response`);
      }
    }

    // 4. If includeRelated is true, search for related coordinates
    if (validatedArgs.includeRelated) {
      console.log(`${logPrefix} Searching for related coordinates`);

      // Extract coordinate hierarchy (parent/child relationships)
      const coordinateParts = coordinate.split('-');
      const relatedCoordinates = [];

      // Add parent coordinate if this is a child
      if (coordinateParts.length > 1) {
        const parentCoord = coordinateParts.slice(0, -1).join('-');
        relatedCoordinates.push(parentCoord);
      }

      // Add potential sibling coordinates (same parent, different last number)
      if (coordinateParts.length > 1) {
        const baseCoord = coordinateParts.slice(0, -1).join('-');
        for (let i = 0; i <= 5; i++) {
          const siblingCoord = `${baseCoord}-${i}`;
          if (siblingCoord !== coordinate) {
            relatedCoordinates.push(siblingCoord);
          }
        }
      }

      contextResults.relatedCoordinates = relatedCoordinates;

      // Search for entities in related coordinates (limited search)
      for (const relatedCoord of relatedCoordinates.slice(0, 3)) { // Limit to 3 related coordinates
        const relatedEntitiesResponse = await graphitiClient.searchEntities({
          query: `coordinate ${relatedCoord} context`,
          bimbaCoordinate: relatedCoord,
          maxNodes: 3,
        });

        if (!relatedEntitiesResponse.isError) {
          try {
            const relatedData = JSON.parse(relatedEntitiesResponse.content[0]?.text || '{}');
            if (relatedData.nodes && relatedData.nodes.length > 0) {
              contextResults.entities.push(...relatedData.nodes.map((node: any) => ({
                ...node,
                _relatedCoordinate: relatedCoord
              })));
            }
          } catch (parseError) {
            console.warn(`${logPrefix} Failed to parse related entities for ${relatedCoord}`);
          }
        }
      }
    }

    // 5. Compile comprehensive context summary
    const contextSummary = {
      success: true,
      coordinate: coordinate,
      contextDepth: validatedArgs.contextDepth,
      includeRelated: validatedArgs.includeRelated,
      summary: {
        totalEntities: contextResults.entities.length,
        totalFacts: contextResults.facts.length,
        totalEpisodes: contextResults.episodes.length,
        relatedCoordinatesCount: contextResults.relatedCoordinates.length,
      },
      context: contextResults,
      timestamp: new Date().toISOString(),
    };

    console.log(`${logPrefix} Context retrieved: ${contextSummary.summary.totalEntities} entities, ${contextSummary.summary.totalFacts} facts, ${contextSummary.summary.totalEpisodes} episodes`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(contextSummary, null, 2)
        }
      ]
    };

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    console.error(`[getGraphitiContext] Error:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            coordinate: args.bimbaCoordinate,
            timestamp: new Date().toISOString(),
            tool: 'getGraphitiContext'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
