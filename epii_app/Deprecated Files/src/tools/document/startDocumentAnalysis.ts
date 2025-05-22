import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ObjectId } from "mongodb";
import { StartDocumentAnalysisSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const startDocumentAnalysisTool: Tool = {
  name: "startDocumentAnalysis",
  description: "Start analysis for a document and update its status.",
  inputSchema: zodToJsonSchema(StartDocumentAnalysisSchema),
};

/**
 * Start analysis for a document and update its status
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleStartDocumentAnalysis(dependencies: ToolDependencies, args: any) {
  try {
    const validatedArgs = StartDocumentAnalysisSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const collectionName = validatedArgs.collection || "Documents";
    const collection = mongoDb.collection(collectionName);

    console.log(`Starting analysis for document in collection: ${collectionName}`);
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

    // Update document status
    await collection.updateOne(
      { _id: documentId },
      {
        $set: {
          status: "analyzing",
          analysisStarted: new Date(),
          lastModified: new Date()
        }
      }
    );

    console.log(`Analysis started for document ${validatedArgs.documentId} in collection ${collectionName}`);

    // Get the updated document
    const document = await collection.findOne({ _id: documentId });
    if (!document) {
      throw new McpError(ErrorCode.InternalError, "Failed to retrieve updated document");
    }

    const serializableDocument = { ...document, _id: document._id.toString() };

    // In a real implementation, we would trigger the analysis pipeline here
    // For now, just return the updated document with a status message
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "analysis_started",
          message: "Document analysis has been started",
          document: serializableDocument
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "startDocumentAnalysis");
  }
}
