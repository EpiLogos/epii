import { z } from "zod";

// Pratibimba tools schemas
export const SearchPratibimbaContextSchema = z.object({
  query: z.string().describe("Natural language query to search for in the Pratibimba vector store."),
  limit: z.number().int().min(1).max(100).default(10).describe("Maximum number of results to return (default: 10)."),
  collection: z.string().optional().describe("Optional Qdrant collection name to search in."),
  threshold: z.number().min(0).max(1).default(0.7).describe("Similarity threshold for vector search (0-1, default: 0.7)."),
  includeMetadata: z.boolean().default(true).describe("Whether to include metadata in the results."),
});
