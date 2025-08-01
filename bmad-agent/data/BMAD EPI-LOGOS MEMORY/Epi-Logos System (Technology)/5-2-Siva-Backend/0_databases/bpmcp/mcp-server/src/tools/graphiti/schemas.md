import { z } from "zod";

// Graphiti Episode Types (aligned with Graphiti MCP server)
export const GraphitiEpisodeType = z.enum(["text", "json", "message"]);

// QL-aligned enums for coordinate-aware operations
export const QLVariant = z.enum(["0/1", "2/3", "4/6", "7/8/9/10", "11/12", "16/18/24"]);
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
- **zod**: Zod validation library for schema definition and runtime validation

### Exports
- **GraphitiEpisodeType**: Enum for episode types (text, json, message)
- **QLVariant**: Enum for Quaternary Logic variants (0/1, 2/3, 4/6, 7/8/9, 10/12, 16/24)
- **QLContextFrame**: Enum for QL context frames (0000, 0/1, 0/1/2, 0/1/2/3, 4.0-4/5, 5/0)
- **AddGraphitiEpisodeSchema**: Schema for adding episodes with Bimba coordinate integration
- **SearchGraphitiEntitiesSchema**: Schema for entity/node search with coordinate filtering
- **SearchGraphitiFactsSchema**: Schema for fact/relationship search with QL filtering
- **GetGraphitiContextSchema**: Schema for coordinate-based context retrieval
- **GetGraphitiEpisodesSchema**: Schema for episode retrieval with coordinate filtering
- **DeleteGraphitiEpisodeSchema**: Schema for episode deletion operations
- **DeleteGraphitiEntityEdgeSchema**: Schema for entity edge deletion
- **GetGraphitiEntityEdgeSchema**: Schema for entity edge retrieval
- **ClearGraphitiGraphSchema**: Schema for graph clearing operations
- **GetGraphitiStatusSchema**: Schema for status check operations

### Dependencies
- **Zod Library**: Runtime validation and type inference
- **Graphiti MCP Server**: Target knowledge graph server
- **Bimba Coordinate System**: Coordinate-based organization
- **Quaternary Logic System**: QL variants and context frames

### Dependents
- **Graphiti MCP Tools**: All Graphiti tools use these schemas for input validation
- **BPMCP Server**: Schema validation for Graphiti tool requests
- **Knowledge Graph Service**: Type safety for graph operations
- **Analysis Pipeline**: Episode creation and context retrieval

## Key Functions/Components
### GraphitiEpisodeType Enum (Line 4)
**Purpose**: Enumeration of supported episode types for content classification
**Parameters**: Static enum values (text, json, message)
**Returns**: Episode type identifiers
**Notes**: Aligned with Graphiti MCP server episode type system

### QL Enums (Lines 7-8)
**Purpose**: Quaternary Logic variant and context frame enumerations
**Parameters**: QLVariant (0/1, 2/3, 4/6, 7/8/9, 10/12, 16/24), QLContextFrame (0000, 0/1, 0/1/2, 0/1/2/3, 4.0-4/5, 5/0)
**Returns**: QL classification identifiers
**Notes**: Deep integration with Quaternary Logic system for coordinate-aware operations

### AddGraphitiEpisodeSchema (Lines 11-27)
**Purpose**: Schema for adding episodes with comprehensive Bimba coordinate and QL integration
**Parameters**: name, episodeBody, source, sourceDescription, groupId, uuid, bimbaCoordinate, qlVariant, contextFrame, analysisContext, relevanceScore
**Returns**: Validated episode creation input object
**Notes**: Most comprehensive schema with full coordinate and QL metadata support

### SearchGraphitiEntitiesSchema (Lines 30-41)
**Purpose**: Schema for entity/node search with coordinate-based filtering
**Parameters**: query, groupIds, maxNodes, centerNodeUuid, entityType, bimbaCoordinate, qlVariant, contextFrame
**Returns**: Validated entity search input object
**Notes**: Supports coordinate-aware entity discovery with QL filtering

### SearchGraphitiFactsSchema (Lines 44-53)
**Purpose**: Schema for fact/relationship search with Bimba coordinate filtering
**Parameters**: query, groupIds, maxFacts, centerNodeUuid, bimbaCoordinate, qlVariant
**Returns**: Validated fact search input object
**Notes**: Relationship discovery with coordinate-based filtering

### GetGraphitiContextSchema (Lines 56-61)
**Purpose**: Schema for coordinate-based context retrieval with depth control
**Parameters**: bimbaCoordinate, contextDepth, includeRelated, maxEpisodes
**Returns**: Validated context retrieval input object
**Notes**: Dynamic context retrieval for specific coordinates with configurable depth

### GetGraphitiEpisodesSchema (Lines 64-71)
**Purpose**: Schema for episode retrieval with coordinate and QL filtering
**Parameters**: groupId, lastN, bimbaCoordinate, qlVariant
**Returns**: Validated episode retrieval input object
**Notes**: Recent episode retrieval with coordinate-based filtering

### Deletion and Management Schemas (Lines 74-97)
**Purpose**: Schemas for episode deletion, entity edge operations, graph clearing, and status checks
**Parameters**: Various UUIDs and confirmation flags
**Returns**: Validated operation input objects
**Notes**: Complete graph management operations with safety confirmations

## Data Flow
1. **Schema Definition**: Zod schemas → Runtime validation → Type inference → Tool input validation
2. **Episode Creation**: Episode data → AddGraphitiEpisodeSchema → Graphiti storage → Knowledge graph update
3. **Entity Search**: Search query → SearchGraphitiEntitiesSchema → Graph traversal → Entity results
4. **Context Retrieval**: Coordinate → GetGraphitiContextSchema → Dynamic context → Contextual information
5. **Graph Management**: Management operations → Validation → Graph updates → Operation confirmation

## Configuration
### Episode Creation Parameters
- **name**: Episode name (required string)
- **episodeBody**: Episode content (required string, JSON must be escaped)
- **source**: Episode type (text, json, message, default: text)
- **sourceDescription**: Source description (optional string)
- **groupId**: Organization group ID (optional, uses coordinate-based grouping if not provided)
- **uuid**: Episode UUID (optional string)

### Bimba Coordinate Integration
- **bimbaCoordinate**: Associated coordinate (optional string, e.g., '#5-2')
- **qlVariant**: QL variant classification (default: '4/6')
- **contextFrame**: QL context frame (optional, operational context)
- **analysisContext**: Analysis pipeline context (optional string)
- **relevanceScore**: Relevance score (optional, 0.0-1.0)

### Search Parameters
- **query**: Search query string (required)
- **groupIds**: Group ID filters (optional array)
- **maxNodes/maxFacts**: Result limits (1-50, default: 10)
- **centerNodeUuid**: Search center node (optional)
- **entityType**: Entity type filter (optional)

### Context Retrieval Parameters
- **bimbaCoordinate**: Target coordinate (required string)
- **contextDepth**: Retrieval depth (1-5, default: 3)
- **includeRelated**: Include related coordinates (default: true)
- **maxEpisodes**: Episode limit (1-20, default: 10)

### QL System Integration
- **QLVariant Values**: 0/1, 2/3, 4/6, 7/8/9, 10/12, 16/24
- **QLContextFrame Values**: 0000, 0/1, 0/1/2, 0/1/2/3, 4.0-4/5, 5/0
- **Default QL Variant**: 4/6 for new episodes
- **Coordinate-Aware Grouping**: Automatic grouping based on coordinates

## Testing
No explicit test files referenced, but schemas provide comprehensive runtime validation

## Related Files
### Core Dependencies
- **Zod Library**: Schema definition and validation framework
- **Graphiti MCP Server**: Target knowledge graph server

### Integration Points
- **Graphiti MCP Tools**: All tools use these schemas for input validation
- **BPMCP Server**: Central validation point for Graphiti tool requests
- **Knowledge Graph Service**: Type-safe graph operations
- **Analysis Pipeline**: Episode creation and context retrieval

### Schema Architecture
- **Type Safety**: Runtime validation with TypeScript type inference
- **QL Integration**: Deep integration with Quaternary Logic system
- **Coordinate Awareness**: Full Bimba coordinate support across all operations

## Development Notes
- **Deep QL Integration**: Comprehensive Quaternary Logic variant and context frame support
- **Coordinate-Aware Operations**: All schemas support Bimba coordinate filtering and organization
- **Episode Type Flexibility**: Support for text, JSON, and message episode types
- **Dynamic Context Retrieval**: Configurable depth and scope for context operations
- **Graph Management**: Complete CRUD operations for episodes and entity edges
- **Type Safety**: Zod schemas provide both runtime validation and TypeScript type inference
- **Performance Optimization**: Configurable limits and filtering for efficient operations
- **Analysis Integration**: Direct integration with document analysis pipeline
- **Group Organization**: Flexible grouping with coordinate-based fallbacks
- **Safety Features**: Confirmation requirements for destructive operations like graph clearing
