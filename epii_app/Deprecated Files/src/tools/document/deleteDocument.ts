import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ObjectId } from "mongodb";
import { DeleteDocumentSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const deleteDocumentTool: Tool = {
  name: "deleteDocument",
  description: "Delete a document from the MongoDB collection.",
  inputSchema: zodToJsonSchema(DeleteDocumentSchema),
};

/**
 * Delete a document from the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleDeleteDocument(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = DeleteDocumentSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Deleting document from collection: ${collectionName}`);
    console.log(`Document ID: ${validatedArgs.documentId}`);

    let documentId;
    try {
      documentId = new ObjectId(validatedArgs.documentId);
    } catch (error) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid document ID format: ${validatedArgs.documentId}`);
    }

    // Check if document exists
    const existingDocument = await collection.findOne({ _id: documentId });
    if (!existingDocument) {
      throw new McpError(ErrorCode.NotFound, `Document not found with ID: ${validatedArgs.documentId}`);
    }

    // Delete document
    const result = await collection.deleteOne({ _id: documentId });
    if (result.deletedCount !== 1) {
      throw new McpError(ErrorCode.InternalError, `Failed to delete document with ID: ${validatedArgs.documentId}`);
    }

    console.log(`Document deleted with ID: ${validatedArgs.documentId}`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "success",
          message: `Document with ID ${validatedArgs.documentId} has been deleted`,
          documentId: validatedArgs.documentId
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "deleteDocument");
  }
}
