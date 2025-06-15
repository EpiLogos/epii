import { z } from "zod";

// Mongo tools schemas
export const GetMongoContextSchema = z.object({
  collection: z.string().describe("MongoDB collection to query."),
  query: z.record(z.any()).describe("MongoDB query filter."),
  limit: z.number().int().min(1).max(100).default(10).describe("Maximum number of results to return (default: 10)."),
  sort: z.record(z.number()).optional().describe("Optional MongoDB sort specification."),
  projection: z.record(z.number()).optional().describe("Optional MongoDB projection specification."),
});
