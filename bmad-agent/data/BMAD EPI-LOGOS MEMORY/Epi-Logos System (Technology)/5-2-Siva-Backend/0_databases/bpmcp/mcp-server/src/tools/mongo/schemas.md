# schemas.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/mongo/schemas.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
MongoDB Tools Schema Definitions providing comprehensive input validation and type safety for MongoDB database operations within the BPMCP server. Handles schema definitions for MongoDB context retrieval with collection targeting, query filtering, sorting, projection, and result limiting parameters. Serves as the primary validation layer within the BPMCP MongoDB tools ecosystem enabling robust input validation, type safety, and parameter management across all MongoDB-based database operations.

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation

### Exports
- **GetMongoContextSchema**: Schema definition for MongoDB context retrieval operations

### Dependencies
- **Zod Library**: Schema validation and type safety framework
- **Type System**: TypeScript type inference and validation

### Dependents
- **MongoDB Context Tool**: getMongoContext.ts for database query validation
- **Tool Registry**: MCP server tool registration and schema conversion
- **Client Applications**: Input validation for MongoDB-based operations

## Key Functions/Components
### GetMongoContextSchema Definition (Lines 4-10)
**Purpose**: Defines validation schema for MongoDB context retrieval operations
**Parameters**: collection (string), query (record object), limit (number 1-100, default 10), sort (optional record), projection (optional record)
**Returns**: Zod schema object for MongoDB context validation
**Notes**: 11 lines implementing comprehensive MongoDB tools schema definitions

### Collection Validation (Line 5)
**Purpose**: Validates MongoDB collection name strings for database operations
**Parameters**: String input for collection names
**Returns**: Validated collection name string
**Notes**: Basic string validation for collection targeting

### Query Filter Validation (Line 6)
**Purpose**: Validates MongoDB query filter objects for database operations
**Parameters**: Record object with query filter specifications
**Returns**: Validated query filter object
**Notes**: Flexible query filter validation supporting MongoDB query operators

### Limit Constraints (Line 7)
**Purpose**: Enforces result limits for MongoDB operations with reasonable bounds
**Parameters**: Integer limits with min/max constraints (1-100, default 10)
**Returns**: Validated limit numbers within acceptable ranges
**Notes**: Performance-oriented limit validation for database query optimization

### Sort Specification Validation (Line 8)
**Purpose**: Validates optional MongoDB sort specifications for query ordering
**Parameters**: Optional record object with sort field specifications
**Returns**: Validated sort specification object
**Notes**: Optional sort validation supporting MongoDB sort syntax

### Projection Specification Validation (Line 9)
**Purpose**: Validates optional MongoDB projection specifications for field selection
**Parameters**: Optional record object with projection field specifications
**Returns**: Validated projection specification object
**Notes**: Optional projection validation supporting MongoDB projection syntax

## Data Flow
1. **Schema Definition**: Zod schema creation → Parameter specification → Validation rules → Type inference
2. **Input Validation**: Client input → Schema validation → Type checking → Parameter extraction
3. **Error Handling**: Validation errors → Error formatting → Client feedback → Correction guidance
4. **Type Safety**: Schema validation → TypeScript type inference → Compile-time safety → Runtime validation

## Configuration
### Schema Configuration
- **GetMongoContextSchema**: MongoDB context retrieval with collection, query, limit, sort, and projection
- **Validation Rules**: Comprehensive parameter constraints and optional specifications
- **Type Safety**: Full TypeScript integration with runtime validation

### Parameter Configuration
- **Collection Targeting**: String validation for MongoDB collection names
- **Query Filtering**: Flexible record validation for MongoDB query filters
- **Result Limiting**: 1-100 results with default 10 for optimal database performance
- **Sort Support**: Optional sort specification validation for query ordering
- **Projection Support**: Optional projection specification validation for field selection

### Validation Configuration
- **String Validation**: Collection name string validation
- **Object Validation**: Complex object validation for query filters, sort, and projection
- **Number Constraints**: Integer limits with min/max bounds for result limiting
- **Optional Parameters**: Flexible optional parameter validation for advanced features

## Testing
No explicit test files referenced, but schemas provide comprehensive validation testing through Zod framework

## Related Files
### Core Dependencies
- **zod**: Schema validation and type safety framework

### Mongo Tools Ecosystem
- **./getMongoContext.ts**: MongoDB context retrieval tool using GetMongoContextSchema
- **./index.ts**: MongoDB tools module exports and organization

### Integration Points
- **MCP Server**: Schema conversion for tool registration
- **Tool Registry**: Schema-based tool validation and registration
- **Client Applications**: Input validation for MongoDB operations
- **Type System**: TypeScript type inference and compile-time safety

## Development Notes
- **Comprehensive Validation**: Complete schema definitions for MongoDB database operations
- **Type Safety**: Full TypeScript integration with runtime validation
- **Parameter Management**: Flexible parameter constraints supporting MongoDB query features
- **Database Integration**: MongoDB-specific validation supporting collection, query, sort, and projection
- **Performance Optimization**: Reasonable limits and defaults for optimal database performance
- **Optional Features**: Flexible optional parameter support for advanced MongoDB features
- **Production Ready**: Robust schema validation suitable for production database operations
- **Development Support**: Clear schema definitions and validation for development
- **Extensible Design**: Easy addition of new MongoDB tool schemas and validation rules
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
