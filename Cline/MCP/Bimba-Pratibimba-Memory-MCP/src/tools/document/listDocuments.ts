import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ListDocumentsSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const listDocumentsTool: Tool = {
  name: "listDocuments",
  description: "List documents from the MongoDB collection.",
  inputSchema: zodToJsonSchema(ListDocumentsSchema),
};

/**
 * List documents from the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleListDocuments(dependencies: ToolDependencies, args: any) {
  const logPrefix = `[listDocuments]`;

  try {
    // Validate arguments
    const validatedArgs = ListDocumentsSchema.parse(args);

    // Get MongoDB database
    const { mongoDb } = dependencies.db;

    if (!mongoDb) {
      console.error(`${logPrefix} MongoDB database is not available`);
      throw new McpError(ErrorCode.InternalError, "MongoDB database is not available");
    }

    const collectionName = validatedArgs.collection || "Documents";
    console.log(`Listing documents from collection: ${collectionName}`);

    const collection = mongoDb.collection(collectionName);

    // Removed .sort({ uploadDate: -1 }) to avoid MongoDB 32MB in-memory sort limit
    // Frontend handles sorting by coordinate which is the desired behavior anyway
    const results = await collection.find(validatedArgs.query || {})
      .limit(validatedArgs.limit)
      .toArray();

    console.log(`Found ${results.length} documents in collection ${collectionName}`);

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
    throw handleError(error, "listDocuments");
  }
}
