/**
 * Document Tools for Bimba-Pratibimba Memory MCP
 *
 * This module provides tools for managing documents in the MongoDB Documents collection.
 *
 * @deprecated Use the modular document tools in the document/ directory instead.
 * All tools from this file have been refactored into separate files in the document/ directory.
 * This file is kept for backward compatibility but will be removed in a future version.
 */

import { z } from "zod";
import { ObjectId } from "mongodb";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// Document tools schemas
export const ListDocumentsInputSchema = z.object({
  limit: z.number().int().positive().optional().default(100).describe("Maximum number of documents to return."),
  query: z.record(z.any()).optional().describe("Optional MongoDB query filter."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const GetDocumentByIdInputSchema = z.object({
  documentId: z.string().describe("The ID of the document to retrieve."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const ListDocumentsByCoordinateInputSchema = z.object({
  coordinate: z.string().describe("The Bimba coordinate to filter documents by."),
  limit: z.number().int().positive().optional().default(100).describe("Maximum number of documents to return."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const StoreDocumentInputSchema = z.object({
  document: z.object({
    originalName: z.string().describe("Original filename of the document."),
    fileName: z.string().optional().describe("Stored filename of the document."),
    mimeType: z.string().describe("MIME type of the document."),
    size: z.number().describe("Size of the document in bytes."),
    path: z.string().optional().describe("Path to the stored document file."),
    textContent: z.string().describe("Text content of the document."),
    targetCoordinate: z.string().nullable().optional().describe("Bimba coordinate associated with the document."),
    userId: z.string().describe("ID of the user who uploaded the document."),
    analysisStatus: z.string().optional().default("pending").describe("Status of document analysis."),
    metadata: z.record(z.any()).optional().describe("Additional metadata for the document."),
    collection: z.string().optional().describe("MongoDB collection to store the document in. Default is 'Documents'."),
  }).passthrough().describe("Document data to store."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to store the document in. Default is 'Documents'."),
});

export const UpdateDocumentInputSchema = z.object({
  documentId: z.string().describe("The ID of the document to update."),
  update: z.record(z.any()).describe("MongoDB update operation."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to update. Default is 'Documents'."),
});

export const DeleteDocumentInputSchema = z.object({
  documentId: z.string().describe("The ID of the document to delete."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to delete from. Default is 'Documents'."),
});

export const StartDocumentAnalysisInputSchema = z.object({
  documentId: z.string().describe("The ID of the document to analyze."),
  targetCoordinate: z.string().describe("The Bimba coordinate to associate with the analysis."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to analyze from. Default is 'Documents'."),
});

/**
 * Handles the listDocuments tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleListDocuments(mongoDb: any, args: any) {
  const validatedArgs = ListDocumentsInputSchema.parse(args);
  const collectionName = validatedArgs.collection || "Documents";
  const collection = mongoDb.collection(collectionName);

  console.log(`Listing documents from collection: ${collectionName}`);
  console.log(`Query: ${JSON.stringify(validatedArgs.query || {})}`);

  const results = await collection.find(validatedArgs.query || {})
    .limit(validatedArgs.limit)
    .sort({ uploadDate: -1 })
    .toArray();

  console.log(`Found ${results.length} documents in collection ${collectionName}`);

  const serializableResults = results.map((doc: any) => ({ ...doc, _id: doc._id.toString() }));
  return { content: [{ type: "text", text: JSON.stringify(serializableResults, null, 2) }] };
}

/**
 * Handles the getDocumentById tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetDocumentById(mongoDb: any, args: any) {
  const validatedArgs = GetDocumentByIdInputSchema.parse(args);
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
    console.log(`Document ${validatedArgs.documentId} not found in collection ${collectionName}`);
    return { content: [{ type: "text", text: JSON.stringify({ error: "Document not found" }, null, 2) }] };
  }

  console.log(`Found document ${validatedArgs.documentId} in collection ${collectionName}`);

  const serializableDocument = { ...document, _id: document._id.toString() };
  return { content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }] };
}

/**
 * Handles the listDocumentsByCoordinate tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleListDocumentsByCoordinate(mongoDb: any, args: any) {
  const validatedArgs = ListDocumentsByCoordinateInputSchema.parse(args);
  const collectionName = validatedArgs.collection || "Documents";
  const collection = mongoDb.collection(collectionName);

  console.log(`Listing documents by coordinate from collection: ${collectionName}`);
  console.log(`Coordinate: ${validatedArgs.coordinate}`);

  const results = await collection.find({ targetCoordinate: validatedArgs.coordinate })
    .limit(validatedArgs.limit)
    .sort({ uploadDate: -1 })
    .toArray();

  console.log(`Found ${results.length} documents with coordinate ${validatedArgs.coordinate} in collection ${collectionName}`);

  const serializableResults = results.map((doc: any) => ({ ...doc, _id: doc._id.toString() }));
  return { content: [{ type: "text", text: JSON.stringify(serializableResults, null, 2) }] };
}

/**
 * Handles the storeDocument tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleStoreDocument(mongoDb: any, args: any) {
  const validatedArgs = StoreDocumentInputSchema.parse(args);

  // Determine collection from args or document
  let collectionName = validatedArgs.collection || "Documents";
  if (validatedArgs.document.collection) {
    collectionName = validatedArgs.document.collection;
    // Remove collection from document to avoid storing it in MongoDB
    delete validatedArgs.document.collection;
  }

  const collection = mongoDb.collection(collectionName);

  console.log(`Storing document in collection: ${collectionName}`);
  console.log(`Document name: ${validatedArgs.document.originalName}`);

  // Prepare document with additional fields
  const document = {
    ...validatedArgs.document,
    uploadDate: new Date(),
    lastModified: new Date(),
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
}

/**
 * Handles the updateDocument tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleUpdateDocument(mongoDb: any, args: any) {
  const validatedArgs = UpdateDocumentInputSchema.parse(args);
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

  // Add lastModified timestamp to update
  const update = validatedArgs.update;
  if (update.$set) {
    update.$set.lastModified = new Date();
  } else {
    update.$set = { lastModified: new Date() };
  }

  console.log(`Update operation: ${JSON.stringify(update)}`);

  // Update document
  const result = await collection.updateOne(
    { _id: documentId },
    update
  );

  if (result.matchedCount === 0) {
    console.log(`Document ${validatedArgs.documentId} not found in collection ${collectionName}`);
    return { content: [{ type: "text", text: JSON.stringify({ error: "Document not found" }, null, 2) }] };
  }

  console.log(`Document ${validatedArgs.documentId} updated in collection ${collectionName}`);

  // Retrieve updated document
  const updatedDocument = await collection.findOne({ _id: documentId });
  if (!updatedDocument) {
    throw new McpError(ErrorCode.InternalError, "Failed to retrieve updated document");
  }

  const serializableDocument = { ...updatedDocument, _id: updatedDocument._id.toString() };
  return { content: [{ type: "text", text: JSON.stringify(serializableDocument, null, 2) }] };
}

/**
 * Handles the deleteDocument tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleDeleteDocument(mongoDb: any, args: any) {
  const validatedArgs = DeleteDocumentInputSchema.parse(args);
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
  const document = await collection.findOne({ _id: documentId });
  if (!document) {
    console.log(`Document ${validatedArgs.documentId} not found in collection ${collectionName}`);
    return { content: [{ type: "text", text: JSON.stringify({ error: "Document not found" }, null, 2) }] };
  }

  // Delete document
  const result = await collection.deleteOne({ _id: documentId });
  console.log(`Document ${validatedArgs.documentId} deleted from collection ${collectionName}`);

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        success: true,
        deletedCount: result.deletedCount,
        documentInfo: {
          id: document._id.toString(),
          originalName: document.originalName,
          path: document.path
        }
      }, null, 2)
    }]
  };
}

/**
 * Handles the startDocumentAnalysis tool request
 * @param mongoDb MongoDB database instance
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleStartDocumentAnalysis(mongoDb: any, args: any) {
  const validatedArgs = StartDocumentAnalysisInputSchema.parse(args);
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

  // Update document status
  const updateResult = await collection.updateOne(
    { _id: documentId },
    {
      $set: {
        analysisStatus: "processing",
        targetCoordinate: validatedArgs.targetCoordinate,
        lastModified: new Date(),
        analysisStartTime: new Date()
      }
    }
  );

  if (updateResult.matchedCount === 0) {
    console.log(`Document ${validatedArgs.documentId} not found in collection ${collectionName}`);
    return { content: [{ type: "text", text: JSON.stringify({ error: "Document not found" }, null, 2) }] };
  }

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
}
