import { z } from "zod";

// Document tools schemas
export const ListDocumentsSchema = z.object({
  limit: z.number().int().positive().optional().default(100).describe("Maximum number of documents to return."),
  query: z.record(z.any()).optional().describe("Optional MongoDB query filter."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const GetDocumentByIdSchema = z.object({
  documentId: z.string().describe("ID of the document to retrieve."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const ListDocumentsByCoordinateSchema = z.object({
  bimbaCoordinate: z.string().describe("Bimba coordinate to filter documents by."),
  limit: z.number().int().positive().optional().default(100).describe("Maximum number of documents to return."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const StoreDocumentSchema = z.object({
  document: z.object({
    originalName: z.string().describe("Original name of the document."),
    title: z.string().describe("Title of the document."),
    textContent: z.string().describe("Text content of the document."),
    bimbaCoordinate: z.string().optional().describe("Bimba coordinate for the document."),
    metadata: z.record(z.any()).optional().describe("Additional metadata for the document."),
  }).describe("Document to store."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to store the document in. Default is 'Documents'."),
});

export const UpdateDocumentSchema = z.object({
  documentId: z.string().describe("ID of the document to update."),
  updates: z.object({
    title: z.string().optional().describe("New title for the document."),
    textContent: z.string().optional().describe("New text content for the document."),
    bimbaCoordinate: z.string().optional().describe("New Bimba coordinate for the document."),
    metadata: z.record(z.any()).optional().describe("New metadata for the document."),
    status: z.string().optional().describe("New status for the document."),
  }).describe("Updates to apply to the document."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to update the document in. Default is 'Documents'."),
});

export const DeleteDocumentSchema = z.object({
  documentId: z.string().describe("ID of the document to delete."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to delete the document from. Default is 'Documents'."),
});

export const StartDocumentAnalysisSchema = z.object({
  documentId: z.string().describe("ID of the document to analyze."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection containing the document. Default is 'Documents'."),
});
