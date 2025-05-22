import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ObjectId } from "mongodb";
import { UpdateDocumentSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const updateDocumentTool: Tool = {
  name: "updateDocument",
  description: "Update a document in the MongoDB collection.",
  inputSchema: zodToJsonSchema(UpdateDocumentSchema),
};

/**
 * Update a document in the MongoDB collection
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleUpdateDocument(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = UpdateDocumentSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Updating document in collection: ${collectionName}`);
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

    // Prepare update
    const updateData: any = {
      lastModified: new Date()
    };

    // Add fields to update
    if (validatedArgs.updates.title) {
      updateData.title = validatedArgs.updates.title;
    }
    
    if (validatedArgs.updates.bimbaCoordinate) {
      updateData.bimbaCoordinate = validatedArgs.updates.bimbaCoordinate;
    }
    
    if (validatedArgs.updates.metadata) {
      updateData.metadata = {
        ...(existingDocument.metadata || {}),
        ...validatedArgs.updates.metadata
      };
    }
    
    if (validatedArgs.updates.status) {
      updateData.status = validatedArgs.updates.status;
    }

    // Add new version if text content is updated
    if (validatedArgs.updates.textContent) {
      updateData.textContent = validatedArgs.updates.textContent;
      
      // Add new version to versions array
      const newVersion = {
        timestamp: new Date(),
        content: validatedArgs.updates.textContent,
        metadata: updateData.metadata || existingDocument.metadata || {}
      };
      
      updateData.$push = { versions: newVersion };
    }

    // Update document
    await collection.updateOne(
      { _id: documentId },
      { $set: updateData }
    );

    console.log(`Document updated with ID: ${validatedArgs.documentId}`);

    // Get updated document
    const updatedDocument = await collection.findOne({ _id: documentId });
    if (!updatedDocument) {
      throw new McpError(ErrorCode.InternalError, "Failed to retrieve updated document");
    }

    const serializableDocument = { ...updatedDocument, _id: updatedDocument._id.toString() };
    return { content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }] };
  } catch (error: any) {
    throw handleError(error, "updateDocument");
  }
}
