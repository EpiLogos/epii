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
  try {
    const validatedArgs = ListDocumentsByCoordinateSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Listing documents from collection: ${collectionName}`);
    console.log(`Bimba coordinate: ${validatedArgs.bimbaCoordinate}`);

    const query = { bimbaCoordinate: validatedArgs.bimbaCoordinate };
    const results = await collection.find(query)
      .limit(validatedArgs.limit)
      .sort({ uploadDate: -1 })
      .toArray();

    console.log(`Found ${results.length} documents with Bimba coordinate ${validatedArgs.bimbaCoordinate}`);

    // Convert ObjectId to string for serialization
    const serializableResults = results.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(serializableResults, null, 2) }]
    };
  } catch (error: any) {
    throw handleError(error, "listDocumentsByCoordinate");
  }
}
