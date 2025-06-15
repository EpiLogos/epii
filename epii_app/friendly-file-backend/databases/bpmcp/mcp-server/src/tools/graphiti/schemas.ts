import { z } from "zod";

// Graphiti Episode Types (aligned with Graphiti MCP server)
export const GraphitiEpisodeType = z.enum(["text", "json", "message"]);

// QL-aligned enums for coordinate-aware operations
export const QLVariant = z.enum(["0/1", "2/3", "4/6", "7/8/9", "10/12", "16/24"]);
export const QLContextFrame = z.enum(["0000", "0/1", "0/1/2", "0/1/2/3", "4.0-4/5", "5/0"]);

// Add Graphiti Episode Schema with Bimba coordinate integration
export const AddGraphitiEpisodeSchema = z.object({
  name: z.string().describe("Name of the episode"),
  episodeBody: z.string().describe("The content of the episode. For JSON episodes, this must be a properly escaped JSON string."),
  source: GraphitiEpisodeType.default("text").describe("Source type: 'text' for plain text, 'json' for structured data, 'message' for conversation-style content"),
  sourceDescription: z.string().optional().describe("Description of the source"),
  groupId: z.string().optional().describe("Group ID for organizing related data. If not provided, uses coordinate-based grouping."),
  uuid: z.string().optional().describe("Optional UUID for the episode"),
  
  // Bimba coordinate integration
  bimbaCoordinate: z.string().optional().describe("Associated Bimba coordinate (e.g., '#5-2')"),
  qlVariant: QLVariant.default("4/6").describe("QL variant for this episode"),
  contextFrame: QLContextFrame.optional().describe("QL context frame for operational context"),
  
  // Analysis context
  analysisContext: z.string().optional().describe("Context from document analysis pipeline"),
  relevanceScore: z.number().min(0).max(1).optional().describe("Relevance score (0.0-1.0)"),
});

// Search Graphiti Entities (Nodes) Schema
export const SearchGraphitiEntitiesSchema = z.object({
  query: z.string().describe("Search query for entities/nodes"),
  groupIds: z.array(z.string()).optional().describe("Optional list of group IDs to filter results"),
  maxNodes: z.number().int().min(1).max(50).default(10).describe("Maximum number of nodes to return"),
  centerNodeUuid: z.string().optional().describe("Optional UUID of a node to center the search around"),
  entityType: z.string().optional().describe("Optional entity type to filter results"),
  
  // Bimba coordinate filtering
  bimbaCoordinate: z.string().optional().describe("Filter by associated Bimba coordinate"),
  qlVariant: QLVariant.optional().describe("Filter by QL variant"),
  contextFrame: QLContextFrame.optional().describe("Filter by QL context frame"),
});

// Search Graphiti Facts (Relationships) Schema
export const SearchGraphitiFactsSchema = z.object({
  query: z.string().describe("Search query for facts/relationships"),
  groupIds: z.array(z.string()).optional().describe("Optional list of group IDs to filter results"),
  maxFacts: z.number().int().min(1).max(50).default(10).describe("Maximum number of facts to return"),
  centerNodeUuid: z.string().optional().describe("Optional UUID of a node to center the search around"),
  
  // Bimba coordinate filtering
  bimbaCoordinate: z.string().optional().describe("Filter by associated Bimba coordinate"),
  qlVariant: QLVariant.optional().describe("Filter by QL variant"),
});

// Get Graphiti Context Schema - for retrieving dynamic context for coordinates
export const GetGraphitiContextSchema = z.object({
  bimbaCoordinate: z.string().describe("Bimba coordinate to get context for (e.g., '#5-2')"),
  contextDepth: z.number().int().min(1).max(5).default(3).describe("Depth of context retrieval (1-5)"),
  includeRelated: z.boolean().default(true).describe("Include related coordinates in context"),
  maxEpisodes: z.number().int().min(1).max(20).default(10).describe("Maximum number of recent episodes to include"),
});

// Get Graphiti Episodes Schema
export const GetGraphitiEpisodesSchema = z.object({
  groupId: z.string().optional().describe("Group ID to retrieve episodes from"),
  lastN: z.number().int().min(1).max(50).default(10).describe("Number of most recent episodes to retrieve"),
  
  // Bimba coordinate filtering
  bimbaCoordinate: z.string().optional().describe("Filter episodes by associated Bimba coordinate"),
  qlVariant: QLVariant.optional().describe("Filter by QL variant"),
});

// Delete Graphiti Episode Schema
export const DeleteGraphitiEpisodeSchema = z.object({
  uuid: z.string().describe("UUID of the episode to delete"),
});

// Delete Graphiti Entity Edge Schema
export const DeleteGraphitiEntityEdgeSchema = z.object({
  uuid: z.string().describe("UUID of the entity edge to delete"),
});

// Get Graphiti Entity Edge Schema
export const GetGraphitiEntityEdgeSchema = z.object({
  uuid: z.string().describe("UUID of the entity edge to retrieve"),
});

// Clear Graphiti Graph Schema
export const ClearGraphitiGraphSchema = z.object({
  confirmClear: z.boolean().describe("Confirmation that you want to clear all graph data"),
});

// Get Graphiti Status Schema
export const GetGraphitiStatusSchema = z.object({
  // No parameters needed for status check
});
