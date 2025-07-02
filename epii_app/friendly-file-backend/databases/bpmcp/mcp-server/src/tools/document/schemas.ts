import { z } from "zod";

// Document tools schemas
export const ListDocumentsSchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === 'number' ? Math.floor(val) : val),
    z.number().int().positive().optional().default(100)
  ).describe("Maximum number of documents to return."),
  skip: z.preprocess(
    (val) => (typeof val === 'number' ? Math.floor(val) : val),
    z.number().int().min(0).optional().default(0)
  ).describe("Number of documents to skip (for pagination)."),
  query: z.record(z.any()).optional().describe("Optional MongoDB query filter."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
  excludeFields: z.array(z.string()).optional().describe("Fields to exclude from the response to reduce payload size."),
});

export const GetDocumentByIdSchema = z.object({
  documentId: z.string().describe("ID of the document to retrieve."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const ListDocumentsByCoordinateSchema = z.object({
  coordinate: z.string().describe("Bimba coordinate to filter documents by."),
  limit: z.preprocess(
    (val) => (typeof val === 'number' ? Math.floor(val) : val),
    z.number().int().positive().optional().default(100)
  ).describe("Maximum number of documents to return."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection to query. Default is 'Documents'."),
});

export const StoreDocumentSchema = z.object({
  document: z.object({
    originalName: z.string().describe("Original name of the document."),
    title: z.string().describe("Title of the document."),
    fileName: z.string().optional().describe("Stored filename of the document."),
    mimeType: z.string().optional().default("text/plain").describe("MIME type of the document."),
    size: z.number().optional().describe("Size of the document in bytes."),
    textContent: z.string().describe("Text content of the document."),
    targetCoordinate: z.string().nullable().optional().describe("Bimba coordinate associated with the document."),
    userId: z.string().optional().default("anonymous").describe("ID of the user who uploaded the document."),
    analysisStatus: z.string().optional().default("pending").describe("Status of document analysis."),
    bimbaCoordinate: z.string().optional().describe("Bimba coordinate for the document."),
    metadata: z.record(z.any()).optional().describe("Additional metadata for the document."),
  }).passthrough().describe("Document to store."),
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
  targetCoordinate: z.string().describe("The Bimba coordinate to associate with the analysis."),
  collection: z.string().optional().default("Documents").describe("MongoDB collection containing the document. Default is 'Documents'."),
  graphData: z.object({
    nodes: z.array(z.any()).optional().default([]).describe("Graph nodes for enhanced Bimba awareness."),
    edges: z.array(z.any()).optional().default([]).describe("Graph edges for enhanced Bimba awareness."),
  }).optional().describe("Graph data from frontend for enhanced Bimba awareness."),
});
