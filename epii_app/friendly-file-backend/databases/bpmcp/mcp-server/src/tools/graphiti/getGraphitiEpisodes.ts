import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GetGraphitiEpisodesSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definition
export const getGraphitiEpisodesTool: Tool = {
  name: "getGraphitiEpisodes",
  description: "Get recent episodes from Graphiti's temporal knowledge graph with Bimba coordinate filtering. Returns episode data with temporal context and coordinate associations.",
  inputSchema: zodToJsonSchema(GetGraphitiEpisodesSchema),
};

/**
 * Get recent episodes from Graphiti with coordinate-aware filtering
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetGraphitiEpisodes(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = GetGraphitiEpisodesSchema.parse(args);
    const logPrefix = `[getGraphitiEpisodes]`;

    console.log(`${logPrefix} Getting episodes`);
    console.log(`${logPrefix} Group ID: ${validatedArgs.groupId || 'default'}`);
    console.log(`${logPrefix} Bimba coordinate filter: ${validatedArgs.bimbaCoordinate || 'none'}`);
    console.log(`${logPrefix} Last N: ${validatedArgs.lastN}`);

    // Create Graphiti client
    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000',
    });

    // Connect to Graphiti MCP server
    console.log(`${logPrefix} Attempting to connect to Graphiti MCP server...`);

    // Prepare parameters with coordinate filtering
    const episodeParams = {
      groupId: validatedArgs.groupId,
      lastN: validatedArgs.lastN,
      bimbaCoordinate: validatedArgs.bimbaCoordinate,
      qlVariant: validatedArgs.qlVariant,
    };

    // Get episodes from Graphiti
    const response = await graphitiClient.getEpisodes(episodeParams);

    if (response.isError) {
      throw new Error(`Graphiti episodes retrieval failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    // Parse the response to extract episodes
    let episodesData;
    try {
      const responseText = response.content[0]?.text || '[]';
      episodesData = JSON.parse(responseText);
    } catch (parseError) {
      // If response is not JSON, treat as plain text
      episodesData = [];
    }

    // Ensure episodesData is an array
    const episodes = Array.isArray(episodesData) ? episodesData : [];

    console.log(`${logPrefix} Retrieved ${episodes.length} episodes`);

    // Filter episodes by coordinate if specified (client-side filtering for additional precision)
    let filteredEpisodes = episodes;
    if (validatedArgs.bimbaCoordinate) {
      filteredEpisodes = episodes.filter((episode: any) => {
        // Check if episode content contains the coordinate
        const episodeContent = episode.episode_body || episode.content || '';
        return episodeContent.includes(validatedArgs.bimbaCoordinate);
      });
      console.log(`${logPrefix} Filtered to ${filteredEpisodes.length} episodes matching coordinate ${validatedArgs.bimbaCoordinate}`);
    }

    // Enhance results with coordinate context
    const enhancedResults = {
      success: true,
      searchContext: {
        groupId: validatedArgs.groupId,
        bimbaCoordinate: validatedArgs.bimbaCoordinate,
        qlVariant: validatedArgs.qlVariant,
        lastN: validatedArgs.lastN,
        effectiveGroupId: episodeParams.groupId || (validatedArgs.bimbaCoordinate ? validatedArgs.bimbaCoordinate.replace('#', 'coord_') : 'default'),
      },
      results: {
        totalEpisodes: episodes.length,
        filteredEpisodes: filteredEpisodes.length,
        episodes: filteredEpisodes,
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
    console.error(`[getGraphitiEpisodes] Error:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            searchContext: {
              groupId: args.groupId,
              bimbaCoordinate: args.bimbaCoordinate,
              lastN: args.lastN,
            },
            timestamp: new Date().toISOString(),
            tool: 'getGraphitiEpisodes'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
