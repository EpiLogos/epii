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
  try {
    const validatedArgs = ListDocumentsSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Listing documents from collection: ${collectionName}`);
    console.log(`Query: ${JSON.stringify(validatedArgs.query || {})}`);

    const results = await collection.find(validatedArgs.query || {})
      .limit(validatedArgs.limit)
      .sort({ uploadDate: -1 })
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
    throw handleError(error, "listDocuments");
  }
}
