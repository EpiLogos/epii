import { z } from "zod";

// Bimba tools schemas
export const BimbaKnowingSchema = z.object({
  query: z.string().describe("Natural language query about system architecture or concepts."),
  contextDepth: z.union([
    z.string().regex(/^\d+$/).transform(val => parseInt(val, 10)),
    z.number().int().min(1).max(5)
  ]).default(3).describe("Depth of graph traversal for context (1-5 hops, default: 3)."),
  focusCoordinate: z.string().optional().describe("Optional Bimba coordinate to focus search (e.g., '#5-2')."),
  agentCoordinate: z.string().optional().describe("Optional agent's Bimba coordinate for branch awareness (e.g., '#5')."),
  limit: z.union([
    z.string().regex(/^\d+$/).transform(val => parseInt(val, 10)),
    z.number().int().min(1).max(100)
  ]).default(20).describe("Maximum number of results to return (default: 20)."),
  includeRelations: z.boolean().default(true).describe("Whether to include related nodes (parents, children, siblings)."),
  // QL Properties
  qlPosition: z.union([
    z.number().int().min(0).max(5),
    z.array(z.number().int().min(0).max(5))
  ]).optional().describe("Filter by QL Position (0-5) or an array of positions."),
  strengthRange: z.array(
    z.number().min(0.0).max(1.0)
  ).length(2).optional().describe("Filter by strength range [min, max] (0.0-1.0)."),
  confidenceThreshold: z.number().min(0.0).max(1.0).optional()
    .describe("Filter by minimum confidence score (0.0-1.0). Applied to vector search score or explicit confidence property."),
  qlDynamics: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe("Filter by QL Dynamics (e.g., 'foundational_emergence') or an array of dynamics."),
  qlContextFrame: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe("Filter by QL Context Frame (e.g., '0/1') or an array of frames."),
});

export const GenerateBimbaEmbeddingsSchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === 'number' ? Math.floor(val) : val),
    z.number().int().min(1).max(1000).default(100)
  ).describe("Maximum number of nodes to process (default: 100)."),
  labelFilter: z.string().optional().describe("Optional Neo4j label to filter nodes by."),
  forceRegenerate: z.boolean().default(false).describe("Whether to regenerate embeddings for nodes that already have them."),
});

export const QueryBimbaGraphSchema = z.object({
  query: z.string().optional().describe("Cypher query to execute against the Neo4j Bimba graph. Required if specificCoordinate is not provided."),
  params: z.record(z.any()).optional().describe("Optional parameters for the Cypher query."),
  specificCoordinate: z.string().optional().describe("Optional Bimba coordinate to fetch a specific node's properties (e.g., '#5-2')."),
});

export const UpdateBimbaGraphSchema = z.object({
  query: z.string().describe("Write Cypher query to execute against the Neo4j Bimba graph (CREATE, UPDATE, DELETE, MERGE operations)."),
  params: z.record(z.any()).optional().describe("Optional parameters for the Cypher query."),
});
// Removed the .refine call that was causing the error, as 'specificCoordinate'
// is not a field of UpdateBimbaGraphSchema. The 'query' field is already mandatory.

export const ResolveBimbaCoordinateSchema = z.object({
  targetCoordinate: z.string().describe("The Bimba coordinate to resolve to a Notion page URL (e.g., '#5-2-1')."),
});
