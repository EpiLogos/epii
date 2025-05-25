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
  query: z.string().describe("Cypher query to execute against the Neo4j Bimba graph."),
  params: z.record(z.any()).optional().describe("Optional parameters for the Cypher query."),
});

export const UpdateBimbaGraphSchema = z.object({
  query: z.string().describe("Write Cypher query to execute against the Neo4j Bimba graph (CREATE, UPDATE, DELETE, MERGE operations)."),
  params: z.record(z.any()).optional().describe("Optional parameters for the Cypher query."),
});

export const ResolveBimbaCoordinateSchema = z.object({
  targetCoordinate: z.string().describe("The Bimba coordinate to resolve to a Notion page URL (e.g., '#5-2-1')."),
});
