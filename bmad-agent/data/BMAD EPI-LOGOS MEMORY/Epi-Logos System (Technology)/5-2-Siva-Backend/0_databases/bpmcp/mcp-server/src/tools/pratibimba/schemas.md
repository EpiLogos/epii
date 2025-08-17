# schemas.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/pratibimba/schemas.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pratibimba Tools Schema Definitions providing comprehensive input validation and type safety for vector search operations within the BPMCP server. Handles schema definitions for Pratibimba context search with query validation, result limiting, collection targeting, similarity thresholds, and metadata inclusion parameters. Serves as the primary validation layer within the BPMCP Pratibimba tools ecosystem enabling robust input validation, type safety, and parameter management across all vector-based search operations.

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation

### Exports
- **SearchPratibimbaContextSchema**: Schema definition for Pratibimba context search operations

### Dependencies
- **Zod Library**: Schema validation and type safety framework
- **Type System**: TypeScript type inference and validation

### Dependents
- **Pratibimba Search Tool**: searchPratibimbaContext.ts for vector search validation
- **Tool Registry**: MCP server tool registration and schema conversion
- **Client Applications**: Input validation for vector-based search operations

## Key Functions/Components
### SearchPratibimbaContextSchema Definition (Lines 4-10)
**Purpose**: Defines validation schema for Pratibimba context search operations
**Parameters**: query (string), limit (number 1-100, default 10), collection (optional string), threshold (number 0-1, default 0.7), includeMetadata (boolean, default true)
**Returns**: Zod schema object for Pratibimba context search validation
**Notes**: 11 lines implementing comprehensive Pratibimba tools schema definitions

### Query Validation (Line 5)
**Purpose**: Validates natural language query strings for vector search operations
**Parameters**: String input for search queries
**Returns**: Validated query string
**Notes**: Natural language query validation for semantic search

### Limit Constraints (Line 6)
**Purpose**: Enforces result limits for vector search operations with reasonable bounds
**Parameters**: Integer limits with min/max constraints (1-100, default 10)
**Returns**: Validated limit numbers within acceptable ranges
**Notes**: Performance-oriented limit validation for vector search optimization

### Collection Specification (Line 7)
**Purpose**: Validates optional Qdrant collection names for targeted vector search
**Parameters**: Optional string input for collection names
**Returns**: Validated collection name string
**Notes**: Optional collection targeting for focused vector search

### Similarity Threshold Validation (Line 8)
**Purpose**: Validates similarity threshold values for vector search quality control
**Parameters**: Number input with range constraints (0-1, default 0.7)
**Returns**: Validated threshold number within similarity range
**Notes**: Similarity threshold validation for search quality management (0-1 range, default 0.7)

### Metadata Inclusion Flag (Line 9)
**Purpose**: Manages metadata inclusion preferences for vector search results
**Parameters**: Boolean flag for metadata inclusion
**Returns**: Validated boolean value with appropriate default
**Notes**: Metadata inclusion management for enhanced search results (default true)

## Data Flow
1. **Schema Definition**: Zod schema creation → Parameter specification → Validation rules → Type inference
2. **Input Validation**: Client input → Schema validation → Type checking → Parameter extraction
3. **Error Handling**: Validation errors → Error formatting → Client feedback → Correction guidance
4. **Type Safety**: Schema validation → TypeScript type inference → Compile-time safety → Runtime validation

## Configuration
### Schema Configuration
- **SearchPratibimbaContextSchema**: Vector search with query, limit, collection, threshold, and metadata
- **Validation Rules**: Comprehensive parameter constraints and optional specifications
- **Type Safety**: Full TypeScript integration with runtime validation

### Parameter Configuration
- **Query Validation**: Natural language string validation for semantic search
- **Result Limiting**: 1-100 results with default 10 for optimal vector search performance
- **Collection Targeting**: Optional collection specification for focused search
- **Similarity Control**: 0-1 threshold with default 0.7 for quality management
- **Metadata Support**: Boolean flag with default true for enhanced results

### Validation Configuration
- **String Validation**: Query and collection name string validation
- **Number Constraints**: Integer limits and float thresholds with appropriate bounds
- **Boolean Flags**: Metadata inclusion preferences and operational flags
- **Optional Parameters**: Flexible optional parameter validation for advanced features

## Testing
No explicit test files referenced, but schemas provide comprehensive validation testing through Zod framework

## Related Files
### Core Dependencies
- **zod**: Schema validation and type safety framework

### Pratibimba Tools Ecosystem
- **./searchPratibimbaContext.ts**: Vector search tool using SearchPratibimbaContextSchema
- **./index.ts**: Pratibimba tools module exports and organization

### Integration Points
- **MCP Server**: Schema conversion for tool registration
- **Tool Registry**: Schema-based tool validation and registration
- **Client Applications**: Input validation for vector search operations
- **Type System**: TypeScript type inference and compile-time safety

## Development Notes
- **Comprehensive Validation**: Complete schema definitions for vector search operations
- **Type Safety**: Full TypeScript integration with runtime validation
- **Parameter Management**: Flexible parameter constraints supporting vector search features
- **Vector Integration**: Vector search-specific validation supporting queries, thresholds, and collections
- **Performance Optimization**: Reasonable limits and defaults for optimal vector search performance
- **Quality Control**: Similarity threshold validation for search quality management
- **Production Ready**: Robust schema validation suitable for production vector operations
- **Development Support**: Clear schema definitions and validation for development
- **Extensible Design**: Easy addition of new vector search schemas and validation rules
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
