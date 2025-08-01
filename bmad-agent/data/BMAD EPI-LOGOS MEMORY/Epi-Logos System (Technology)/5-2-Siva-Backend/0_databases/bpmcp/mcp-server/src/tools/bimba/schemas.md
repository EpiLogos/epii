# schemas.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/schemas.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Bimba Tools Schemas defining comprehensive Zod validation schemas for all Bimba graph operations. Provides type-safe validation for knowledge queries, graph operations, relationship management, and coordinate resolution. Serves as the foundational schema layer ensuring data integrity and type safety across all Bimba-related MCP tools with sophisticated QL (Quaternary Logic) integration.

## System Integration
### Imports
- **zod**: Zod validation library for schema definition and runtime validation

### Exports
- **BimbaKnowingSchema**: Schema for natural language knowledge queries with QL filtering
- **GenerateBimbaEmbeddingsSchema**: Schema for embedding generation operations
- **QueryBimbaGraphSchema**: Schema for Cypher graph queries and coordinate lookups
- **UpdateBimbaGraphSchema**: Schema for graph write operations (CREATE, UPDATE, DELETE, MERGE)
- **ManageBimbaRelationshipsSchema**: Schema for relationship CRUD operations
- **ResolveBimbaCoordinateSchema**: Schema for coordinate-to-Notion resolution

### Dependencies
- **Zod Library**: Runtime validation and type inference
- **Neo4j Graph Database**: Target database for schema validation
- **Quaternary Logic System**: QL properties and filtering integration

### Dependents
- **Bimba MCP Tools**: All Bimba tools use these schemas for input validation
- **BPMCP Server**: Schema validation for incoming tool requests
- **Frontend Services**: Type safety for Bimba operations
- **Agent Integration**: Validated tool calls from agents

## Key Functions/Components
### BimbaKnowingSchema (Lines 4-35)
**Purpose**: Schema for natural language knowledge queries with comprehensive QL filtering
**Parameters**: query, contextDepth, focusCoordinate, agentCoordinate, limit, includeRelations, QL properties
**Returns**: Validated BimbaKnowing input object
**Notes**: Most comprehensive schema with full QL integration including position, dynamics, context frames

### GenerateBimbaEmbeddingsSchema (Lines 37-44)
**Purpose**: Schema for embedding generation operations with filtering and regeneration options
**Parameters**: limit, labelFilter, forceRegenerate
**Returns**: Validated embedding generation input object
**Notes**: Supports batch processing with optional label filtering and force regeneration

### QueryBimbaGraphSchema (Lines 46-50)
**Purpose**: Schema for Cypher graph queries and specific coordinate lookups
**Parameters**: query (optional), params (optional), specificCoordinate (optional)
**Returns**: Validated graph query input object
**Notes**: Flexible schema supporting both raw Cypher queries and coordinate-specific lookups

### UpdateBimbaGraphSchema (Lines 52-58)
**Purpose**: Schema for graph write operations with Cypher query validation
**Parameters**: query (required), params (optional)
**Returns**: Validated graph update input object
**Notes**: Supports all write operations (CREATE, UPDATE, DELETE, MERGE) with parameter binding

### ManageBimbaRelationshipsSchema (Lines 59-65)
**Purpose**: Schema for relationship CRUD operations between Bimba coordinates
**Parameters**: operation, sourceCoordinate, targetCoordinate, relationshipType, relationshipProperties
**Returns**: Validated relationship management input object
**Notes**: Comprehensive relationship management with property support

### ResolveBimbaCoordinateSchema (Lines 67-70)
**Purpose**: Schema for resolving Bimba coordinates to Notion page URLs
**Parameters**: targetCoordinate
**Returns**: Validated coordinate resolution input object
**Notes**: Simple schema for coordinate-to-Notion URL resolution

## Data Flow
1. **Schema Definition**: Zod schemas → Runtime validation → Type inference → Tool input validation
2. **Knowledge Queries**: Natural language → BimbaKnowingSchema → QL filtering → Graph traversal → Results
3. **Graph Operations**: Cypher queries → QueryBimbaGraphSchema/UpdateBimbaGraphSchema → Neo4j execution → Response
4. **Relationship Management**: CRUD operations → ManageBimbaRelationshipsSchema → Graph updates → Relationship changes
5. **Coordinate Resolution**: Bimba coordinate → ResolveBimbaCoordinateSchema → Notion URL → Integration

## Configuration
### BimbaKnowing Schema Parameters
- **query**: Natural language query (required string)
- **contextDepth**: Graph traversal depth (1-5 hops, default: 3)
- **focusCoordinate**: Optional coordinate focus (e.g., '#5-2')
- **agentCoordinate**: Optional agent coordinate for branch awareness (e.g., '#5')
- **limit**: Maximum results (1-100, default: 20)
- **includeRelations**: Include related nodes (default: true)

### Quaternary Logic Integration
- **qlPosition**: Filter by QL Position (0-5) or array of positions
- **strengthRange**: Filter by strength range [min, max] (0.0-1.0)
- **confidenceThreshold**: Minimum confidence score (0.0-1.0)
- **qlDynamics**: Filter by QL Dynamics (string or array)
- **qlContextFrame**: Filter by QL Context Frame (string or array, e.g., '0/1')

### Graph Operation Parameters
- **query**: Cypher query string (required for updates, optional for queries)
- **params**: Optional parameters for Cypher query binding
- **specificCoordinate**: Direct coordinate lookup (alternative to query)

### Relationship Management Parameters
- **operation**: CRUD operation ('create', 'update', 'delete')
- **sourceCoordinate**: Source node coordinate (e.g., '#5-2')
- **targetCoordinate**: Target node coordinate (e.g., '#5-2-1')
- **relationshipType**: Relationship type (e.g., 'HAS_INTERNAL_COMPONENT')
- **relationshipProperties**: Optional relationship properties

### Embedding Generation Parameters
- **limit**: Maximum nodes to process (1-1000, default: 100)
- **labelFilter**: Optional Neo4j label filter
- **forceRegenerate**: Force regeneration of existing embeddings (default: false)

## Testing
No explicit test files referenced, but schemas provide comprehensive runtime validation

## Related Files
### Core Dependencies
- **Zod Library**: Schema definition and validation framework
- **Neo4j Database**: Target database for validated operations

### Integration Points
- **Bimba MCP Tools**: All tools use these schemas for input validation
- **BPMCP Server**: Central validation point for tool requests
- **Frontend Services**: Type-safe Bimba operations
- **Agent Integration**: Validated agent tool calls

### Schema Architecture
- **Type Safety**: Runtime validation with TypeScript type inference
- **Comprehensive Coverage**: All Bimba operations covered by schemas
- **QL Integration**: Deep integration with Quaternary Logic system

## Development Notes
- **Comprehensive QL Integration**: Full support for Quaternary Logic properties and filtering
- **Type Safety**: Zod schemas provide both runtime validation and TypeScript type inference
- **Flexible Query Support**: Supports both raw Cypher queries and coordinate-specific lookups
- **Parameter Binding**: Safe parameter binding for all Cypher operations
- **Relationship Management**: Complete CRUD operations for graph relationships
- **Coordinate Resolution**: Direct integration with Notion coordinate resolution
- **Performance Optimization**: Configurable limits and filtering for efficient operations
- **Error Prevention**: Comprehensive validation prevents invalid operations
- **Extensible Design**: Easy addition of new schema properties and validation rules
- **Agent-Aware**: Special support for agent coordinate awareness in queries
