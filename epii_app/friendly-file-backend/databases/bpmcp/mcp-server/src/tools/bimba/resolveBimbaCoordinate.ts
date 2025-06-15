import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ResolveBimbaCoordinateSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const resolveBimbaCoordinateTool: Tool = {
  name: "resolveBimbaCoordinate",
  description: "Resolve a Bimba coordinate to its associated Notion page URL. Simple conversion: targetCoordinate -> Neo4j lookup for notionPageId -> Notion URL.",
  inputSchema: zodToJsonSchema(ResolveBimbaCoordinateSchema),
};

/**
 * Execute resolveBimbaCoordinate tool
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response with Notion page URL
 */
export async function handleResolveBimbaCoordinate(dependencies: ToolDependencies, args: any) {
  let session: any = null;
  const logPrefix = `[resolveBimbaCoordinate]`;

  try {
    // Validate arguments
    const validatedArgs = ResolveBimbaCoordinateSchema.parse(args);
    const { targetCoordinate } = validatedArgs;

    console.log(`${logPrefix} Resolving coordinate: ${targetCoordinate}`);

    // Get Neo4j driver
    const { neo4jDriver } = dependencies.db;

    if (!neo4jDriver) {
      console.error(`${logPrefix} Neo4j driver is not available`);
      throw new McpError(ErrorCode.InternalError, "Neo4j driver is not available");
    }

    // Create Neo4j session
    session = neo4jDriver.session({
      defaultAccessMode: 'READ',
      database: 'neo4j',
      fetchSize: 100
    });

    // Query for the node with the target coordinate and get its notionPageId
    const query = `
      MATCH (n) 
      WHERE n.coordinate = $targetCoordinate 
         OR n.bimbaCoordinate = $targetCoordinate 
         OR n.targetCoordinate = $targetCoordinate
      RETURN n.notionPageId as notionPageId, 
             n.coordinate as coordinate,
             n.bimbaCoordinate as bimbaCoordinate,
             n.targetCoordinate as targetCoordinate,
             labels(n) as labels
      LIMIT 1
    `;

    console.log(`${logPrefix} Executing query for coordinate: ${targetCoordinate}`);
    
    const result = await session.run(query, { targetCoordinate });

    if (result.records.length === 0) {
      console.warn(`${logPrefix} No node found for coordinate: ${targetCoordinate}`);
      throw new McpError(
        ErrorCode.InvalidRequest, 
        `No Bimba node found for coordinate: ${targetCoordinate}`
      );
    }

    const record = result.records[0];
    const notionPageId = record.get('notionPageId');
    const foundCoordinate = record.get('coordinate') || record.get('bimbaCoordinate') || record.get('targetCoordinate');
    const labels = record.get('labels');

    console.log(`${logPrefix} Found node with coordinate: ${foundCoordinate}, labels: ${labels?.join(', ')}`);

    if (!notionPageId) {
      console.warn(`${logPrefix} Node found but no notionPageId property for coordinate: ${targetCoordinate}`);
      throw new McpError(
        ErrorCode.InvalidRequest, 
        `Bimba node for coordinate ${targetCoordinate} does not have an associated Notion page (missing notionPageId property)`
      );
    }

    // Convert notionPageId (UUID) to Notion page URL
    // Remove any hyphens from the UUID for the URL format
    const cleanPageId = notionPageId.replace(/-/g, '');
    const notionPageUrl = `https://www.notion.so/${cleanPageId}`;

    console.log(`${logPrefix} Successfully resolved ${targetCoordinate} -> ${notionPageUrl}`);

    // Return the result
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          targetCoordinate,
          foundCoordinate,
          notionPageId,
          notionPageUrl,
          labels
        }, null, 2)
      }]
    };

  } catch (error: any) {
    console.error(`${logPrefix} Error:`, error);
    return handleError(error, logPrefix);
  } finally {
    // Close session
    if (session) {
      try {
        await session.close();
      } catch (closeError) {
        console.error(`${logPrefix} Error closing session:`, closeError);
      }
    }
  }
}
