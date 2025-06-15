import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { StoreDocumentSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const storeDocumentTool: Tool = {
  name: "storeDocument",
  description: "Store a document in the MongoDB collection.",
  inputSchema: zodToJsonSchema(StoreDocumentSchema),
};

/**
 * Store a document in the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleStoreDocument(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = StoreDocumentSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Storing document in collection: ${collectionName}`);
    console.log(`Document name: ${validatedArgs.document.originalName}`);

    // Prepare document with additional fields
    const document = {
      ...validatedArgs.document,
      uploadDate: new Date(),
      lastModified: new Date(),
      status: "uploaded",
      versions: [
        {
          timestamp: new Date(),
          content: validatedArgs.document.textContent,
          metadata: validatedArgs.document.metadata || {}
        }
      ]
    };

    // Insert document
    const result = await collection.insertOne(document);
    console.log(`Document inserted with ID: ${result.insertedId}`);

    // Retrieve inserted document
    const insertedDocument = await collection.findOne({ _id: result.insertedId });
    if (!insertedDocument) {
      throw new McpError(ErrorCode.InternalError, "Failed to retrieve inserted document");
    }

    console.log(`Successfully stored document in collection ${collectionName}`);

    const serializableDocument = { ...insertedDocument, _id: insertedDocument._id.toString() };
    return { content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }] };
  } catch (error: any) {
    throw handleError(error, "storeDocument");
  }
}
