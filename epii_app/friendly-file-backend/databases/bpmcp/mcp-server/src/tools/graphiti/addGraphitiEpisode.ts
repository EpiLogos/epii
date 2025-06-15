import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { AddGraphitiEpisodeSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import { GraphitiClient } from "./client.js";

// Tool definition
export const addGraphitiEpisodeTool: Tool = {
  name: "addGraphitiEpisode",
  description: "Add an episode to Graphiti's temporal knowledge graph with Bimba coordinate integration. Episodes are the primary units of information that get processed into entities and relationships.",
  inputSchema: zodToJsonSchema(AddGraphitiEpisodeSchema),
};

/**
 * Add an episode to Graphiti with coordinate-aware context
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleAddGraphitiEpisode(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = AddGraphitiEpisodeSchema.parse(args);
    const logPrefix = `[addGraphitiEpisode]`;

    console.log(`${logPrefix} Adding episode: "${validatedArgs.name}"`);
    console.log(`${logPrefix} Source type: ${validatedArgs.source}`);
    console.log(`${logPrefix} Bimba coordinate: ${validatedArgs.bimbaCoordinate || 'none'}`);

    // Create Graphiti client
    const graphitiClient = new GraphitiClient({
      baseUrl: 'http://127.0.0.1:8000', // Graphiti MCP server port from startup.md
    });

    // Skip health check and try operation directly
    console.log(`${logPrefix} Attempting to connect to Graphiti MCP server...`);

    // Prepare episode data with coordinate context
    const episodeParams = {
      name: validatedArgs.name,
      episodeBody: validatedArgs.episodeBody,
      source: validatedArgs.source,
      sourceDescription: validatedArgs.sourceDescription,
      groupId: validatedArgs.groupId,
      uuid: validatedArgs.uuid,
      bimbaCoordinate: validatedArgs.bimbaCoordinate,
      qlVariant: validatedArgs.qlVariant,
      contextFrame: validatedArgs.contextFrame,
      analysisContext: validatedArgs.analysisContext,
      relevanceScore: validatedArgs.relevanceScore,
    };

    // Add episode to Graphiti
    const response = await graphitiClient.addEpisode(episodeParams);

    if (response.isError) {
      throw new Error(`Graphiti episode creation failed: ${response.content[0]?.text || 'Unknown error'}`);
    }

    // Extract response content
    const responseText = response.content[0]?.text || 'Episode added successfully';

    console.log(`${logPrefix} Episode added successfully`);

    // Return structured response with coordinate context
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: responseText,
            episodeName: validatedArgs.name,
            sourceType: validatedArgs.source,
            bimbaCoordinate: validatedArgs.bimbaCoordinate,
            qlVariant: validatedArgs.qlVariant,
            contextFrame: validatedArgs.contextFrame,
            groupId: episodeParams.groupId || (validatedArgs.bimbaCoordinate ? validatedArgs.bimbaCoordinate.replace('#', 'coord_') : 'default'),
            timestamp: new Date().toISOString(),
            graphitiResponse: response
          }, null, 2)
        }
      ]
    };

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    console.error(`[addGraphitiEpisode] Error:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString(),
            tool: 'addGraphitiEpisode'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
