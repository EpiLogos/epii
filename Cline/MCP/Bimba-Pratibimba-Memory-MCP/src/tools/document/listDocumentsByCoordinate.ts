import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ListDocumentsByCoordinateSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const listDocumentsByCoordinateTool: Tool = {
  name: "listDocumentsByCoordinate",
  description: "List documents by Bimba coordinate from the MongoDB collection.",
  inputSchema: zodToJsonSchema(ListDocumentsByCoordinateSchema),
};

/**
 * List documents by Bimba coordinate from the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleListDocumentsByCoordinate(dependencies: ToolDependencies, args: any) {
  const logPrefix = `[listDocumentsByCoordinate]`;

  try {
    // Validate arguments
    const validatedArgs = ListDocumentsByCoordinateSchema.parse(args);

    // Get MongoDB database
    const { mongoDb } = dependencies.db;

    if (!mongoDb) {
      console.error(`${logPrefix} MongoDB database is not available`);
      throw new McpError(ErrorCode.InternalError, "MongoDB database is not available");
    }

    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Listing documents from collection: ${collectionName}`);
    console.log(`Bimba coordinate: ${validatedArgs.coordinate}`);

    // Check both targetCoordinate and bimbaCoordinate fields for backward compatibility
    const query = {
      $or: [
        { targetCoordinate: validatedArgs.coordinate },
        { bimbaCoordinate: validatedArgs.coordinate }
      ]
    };

    // Removed .sort({ uploadDate: -1 }) to avoid MongoDB 32MB in-memory sort limit
    // Frontend handles sorting by coordinate which is the desired behavior anyway
    const results = await collection.find(query)
      .limit(validatedArgs.limit)
      .toArray();

    console.log(`Found ${results.length} documents with Bimba coordinate ${validatedArgs.coordinate}`);

    // Convert ObjectId to string for serialization
    const serializableResults = results.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(serializableResults, null, 2) }]
    };
  } catch (error: any) {
    console.error(`${logPrefix} Tool execution error:`, error);
    throw handleError(error, "listDocumentsByCoordinate");
  }
}
