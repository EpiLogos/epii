# schemas.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/web/schemas.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Web Tools Schema Definitions providing comprehensive input validation and type safety for web-based operations within the BPMCP server. Handles schema definitions for web search and research tools with parameter validation, type constraints, and default value management. Serves as the primary validation layer within the BPMCP web tools ecosystem enabling robust input validation, type safety, and parameter management across all web-based operations.

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation

### Exports
- **SearchWebSchema**: Schema definition for web search operations
- **ResearchAndIntegrateSchema**: Schema definition for research and integration operations

### Dependencies
- **Zod Library**: Schema validation and type safety framework
- **Type System**: TypeScript type inference and validation

### Dependents
- **Web Search Tool**: searchWeb.ts for basic web search validation
- **Research Tool**: researchAndIntegrate.ts for advanced research validation
- **Tool Registry**: MCP server tool registration and schema conversion
- **Client Applications**: Input validation for web-based operations

## Key Functions/Components
### SearchWebSchema Definition (Lines 4-8)
**Purpose**: Defines validation schema for basic web search operations
**Parameters**: query (string), limit (number 1-20, default 5), includeContent (boolean, default false)
**Returns**: Zod schema object for web search validation
**Notes**: 16 lines implementing comprehensive web tools schema definitions

### ResearchAndIntegrateSchema Definition (Lines 10-15)
**Purpose**: Defines validation schema for advanced research and integration operations
**Parameters**: topic (string), questions (array of strings), maxSources (number 1-20, default 5), includeSourceContent (boolean, default false)
**Returns**: Zod schema object for research validation
**Notes**: Advanced research schema with multi-parameter validation and source management

### Query Validation (Line 5)
**Purpose**: Validates search query strings for web operations
**Parameters**: String input for search queries
**Returns**: Validated query string
**Notes**: Basic string validation for search query integrity

### Limit Constraints (Lines 6, 13)
**Purpose**: Enforces result limits for web operations with reasonable bounds
**Parameters**: Integer limits with min/max constraints
**Returns**: Validated limit numbers within acceptable ranges
**Notes**: Consistent limit validation across web tools (1-20 range with default 5)

### Content Inclusion Flags (Lines 7, 14)
**Purpose**: Manages content inclusion preferences for web operations
**Parameters**: Boolean flags for content inclusion
**Returns**: Validated boolean values with appropriate defaults
**Notes**: Consistent content inclusion management across web tools

### Question Array Validation (Line 12)
**Purpose**: Validates arrays of research questions for advanced research operations
**Parameters**: Array of string questions
**Returns**: Validated question array
**Notes**: Advanced validation for multi-question research workflows

## Data Flow
1. **Schema Definition**: Zod schema creation → Parameter specification → Validation rules → Type inference
2. **Input Validation**: Client input → Schema validation → Type checking → Parameter extraction
3. **Error Handling**: Validation errors → Error formatting → Client feedback → Correction guidance
4. **Type Safety**: Schema validation → TypeScript type inference → Compile-time safety → Runtime validation

## Configuration
### Schema Configuration
- **SearchWebSchema**: Basic web search with query, limit, and content inclusion
- **ResearchAndIntegrateSchema**: Advanced research with topic, questions, sources, and content
- **Validation Rules**: Consistent parameter constraints and default values
- **Type Safety**: Full TypeScript integration with runtime validation

### Parameter Configuration
- **Query Limits**: 1-20 results with default 5 for optimal performance
- **Content Inclusion**: Optional content retrieval for bandwidth management
- **Source Management**: Configurable source limits for research operations
- **Question Support**: Array-based question validation for research workflows

### Validation Configuration
- **String Validation**: Query and topic string validation
- **Number Constraints**: Integer limits with min/max bounds
- **Boolean Flags**: Content inclusion and source content preferences
- **Array Validation**: Question array validation for research operations

## Testing
No explicit test files referenced, but schemas provide comprehensive validation testing through Zod framework

## Related Files
### Core Dependencies
- **zod**: Schema validation and type safety framework

### Web Tools Ecosystem
- **./searchWeb.ts**: Basic web search tool using SearchWebSchema
- **./researchAndIntegrate.ts**: Advanced research tool using ResearchAndIntegrateSchema
- **./index.ts**: Web tools module exports and organization

### Integration Points
- **MCP Server**: Schema conversion for tool registration
- **Tool Registry**: Schema-based tool validation and registration
- **Client Applications**: Input validation for web operations
- **Type System**: TypeScript type inference and compile-time safety

## Development Notes
- **Comprehensive Validation**: Complete schema definitions for all web tool operations
- **Type Safety**: Full TypeScript integration with runtime validation
- **Parameter Management**: Consistent parameter constraints and default values across tools
- **Extensible Design**: Easy addition of new web tool schemas and validation rules
- **Performance Optimization**: Reasonable limits and defaults for optimal web operation performance
- **Error Handling**: Clear validation error messages and correction guidance
- **Production Ready**: Robust schema validation suitable for production web operations
- **Development Support**: Clear schema definitions and validation for development
- **Consistency**: Uniform validation patterns across all web tools
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
