import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ObjectId } from "mongodb";
import { GetDocumentByIdSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const getDocumentByIdTool: Tool = {
  name: "getDocumentById",
  description: "Get a document by its ID from the MongoDB collection.",
  inputSchema: zodToJsonSchema(GetDocumentByIdSchema),
};

/**
 * Get a document by its ID from the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetDocumentById(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = GetDocumentByIdSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Getting document from collection: ${collectionName}`);
    console.log(`Document ID: ${validatedArgs.documentId}`);

    let documentId;
    try {
      documentId = new ObjectId(validatedArgs.documentId);
    } catch (error) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid document ID format: ${validatedArgs.documentId}`);
    }

    const document = await collection.findOne({ _id: documentId });
    if (!document) {
      throw new McpError(ErrorCode.MethodNotFound, `Document not found with ID: ${validatedArgs.documentId}`);
    }

    console.log(`Found document with ID: ${validatedArgs.documentId}`);

    // Convert ObjectId to string for serialization
    const serializableDocument = { ...document, _id: document._id.toString() };

    return {
      content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }]
    };
  } catch (error: any) {
    throw handleError(error, "getDocumentById");
  }
}
