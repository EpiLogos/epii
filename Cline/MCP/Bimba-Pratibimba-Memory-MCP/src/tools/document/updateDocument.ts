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
    // Accept either the new schema format or the old format with direct update object
    let documentId, update, collectionName;

    // Check if this is using the new schema format
    if (args.updates) {
      const validatedArgs = UpdateDocumentSchema.parse(args);
      documentId = validatedArgs.documentId;
      collectionName = validatedArgs.collection || "Documents";

      // Prepare update with type safety
      const updateSet: Record<string, any> = { lastModified: new Date() };
      const updateObj: Record<string, any> = { $set: updateSet };

      // Add fields to update
      if (validatedArgs.updates.title) {
        updateSet.title = validatedArgs.updates.title;
      }

      if (validatedArgs.updates.bimbaCoordinate) {
        updateSet.bimbaCoordinate = validatedArgs.updates.bimbaCoordinate;
      }

      if (validatedArgs.updates.metadata) {
        updateSet.metadata = validatedArgs.updates.metadata;
      }

      if (validatedArgs.updates.status) {
        updateSet.status = validatedArgs.updates.status;
      }

      // Add new version if text content is updated
      if (validatedArgs.updates.textContent) {
        updateSet.textContent = validatedArgs.updates.textContent;

        // Add new version to versions array
        updateObj.$push = {
          versions: {
            timestamp: new Date(),
            content: validatedArgs.updates.textContent,
            metadata: updateSet.metadata || {}
          }
        };
      }

      update = updateObj;
    }
    // Handle the old format with direct update object
    else if (args.update) {
      documentId = args.documentId;
      update = args.update;
      collectionName = args.collection || "Documents";

      // Ensure lastModified is set
      if (!update.$set) {
        update.$set = { lastModified: new Date() };
      } else if (!update.$set.lastModified) {
        update.$set.lastModified = new Date();
      }
    } else {
      throw new McpError(ErrorCode.InvalidParams, "Invalid update format: must provide either 'updates' or 'update' field");
    }

    const { mongoDb } = dependencies.db;
    const collection = mongoDb.collection(collectionName);

    console.log(`Updating document in collection: ${collectionName}`);
    console.log(`Document ID: ${documentId}`);
    console.log(`Update object: ${JSON.stringify(update)}`);

    let mongoDocumentId;
    try {
      mongoDocumentId = new ObjectId(documentId);
    } catch (error) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid document ID format: ${documentId}`);
    }

    // Check if document exists
    const existingDocument = await collection.findOne({ _id: mongoDocumentId });
    if (!existingDocument) {
      throw new McpError(ErrorCode.MethodNotFound, `Document not found with ID: ${documentId}`);
    }

    // Update document
    await collection.updateOne(
      { _id: mongoDocumentId },
      update
    );

    console.log(`Document updated with ID: ${documentId}`);

    // Get updated document
    const updatedDocument = await collection.findOne({ _id: mongoDocumentId });
    if (!updatedDocument) {
      throw new McpError(ErrorCode.InternalError, "Failed to retrieve updated document");
    }

    const serializableDocument = { ...updatedDocument, _id: updatedDocument._id.toString() };
    return { content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }] };
  } catch (error: any) {
    throw handleError(error, "updateDocument");
  }
}
