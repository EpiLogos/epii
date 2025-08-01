# resolveBimbaCoordinate.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/resolveBimbaCoordinate.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Resolve Bimba Coordinate Tool providing simple coordinate-to-Notion URL resolution for the Bimba graph database through MCP (Model Context Protocol). Performs direct Neo4j lookups to convert Bimba coordinates to their associated Notion page URLs with comprehensive validation and error handling. Serves as the primary coordinate resolution interface within the BPMCP server architecture for seamless integration between the Bimba coordinate system and Notion workspace.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Bimba Schemas**: ResolveBimbaCoordinateSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **resolveBimbaCoordinateTool**: Tool definition with name, description, and input schema
- **handleResolveBimbaCoordinate**: Main handler function for coordinate resolution operations

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for coordinate resolution operations
- **Frontend Navigation**: Components requiring Notion page URL resolution
- **Analysis Pipeline**: Systems needing to link coordinates to Notion pages
- **Coordinate Integration**: Systems bridging Bimba coordinates and Notion workspace

## Key Functions/Components
### resolveBimbaCoordinateTool Definition (Lines 8-12)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: 122 lines implementing coordinate-to-Notion URL resolution

### handleResolveBimbaCoordinate Function (Lines 20-122)
**Purpose**: Main handler function executing coordinate resolution against Neo4j
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with Notion page URL and metadata
**Notes**: Comprehensive resolution handler with validation and error handling

### Input Validation (Lines 25-30)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to ResolveBimbaCoordinateSchema
**Notes**: Strict validation ensures coordinate format integrity

### Neo4j Session Management (Lines 35-45)
**Purpose**: Manages Neo4j database session lifecycle with proper cleanup
**Parameters**: Neo4j driver from dependencies
**Returns**: Database session for query execution
**Notes**: Proper session management prevents connection leaks

### Coordinate Lookup Query (Lines 47-75)
**Purpose**: Executes Neo4j query to find Notion page ID for given coordinate
**Parameters**: Target coordinate and Neo4j session
**Returns**: Notion page ID associated with the coordinate
**Notes**: Direct property lookup using bimbaCoordinate property

### URL Construction (Lines 77-95)
**Purpose**: Constructs Notion page URL from retrieved page ID
**Parameters**: Notion page ID and URL formatting rules
**Returns**: Complete Notion page URL
**Notes**: Follows Notion URL format conventions

### Result Processing (Lines 97-115)
**Purpose**: Processes resolution results into standardized response format
**Parameters**: Notion URL and resolution metadata
**Returns**: Formatted response with URL and coordinate information
**Notes**: Comprehensive result processing with metadata inclusion

### Error Handling (Lines 117-122)
**Purpose**: Handles errors with proper logging and standardized error responses
**Parameters**: Error objects and execution context
**Returns**: Standardized MCP error responses
**Notes**: Comprehensive error handling with session cleanup and detailed logging

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Coordinate extraction
2. **Session Management**: Neo4j driver → Session creation → Connection establishment → Query preparation
3. **Coordinate Lookup**: Target coordinate → Neo4j query → Notion page ID retrieval → Validation
4. **URL Construction**: Page ID → URL formatting → Notion URL construction → Validation
5. **Response Processing**: URL construction → Response formatting → Metadata addition → MCP response return

## Configuration
### Tool Configuration
- **Tool Name**: "resolveBimbaCoordinate" for MCP tool registration
- **Description**: Clear description of coordinate resolution capabilities
- **Input Schema**: ResolveBimbaCoordinateSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Neo4j Configuration
- **Session Management**: Proper session lifecycle with cleanup
- **Query Execution**: Simple property lookup queries
- **Connection Management**: Efficient connection usage and cleanup
- **Property Lookup**: Direct bimbaCoordinate property matching

### Notion Integration Configuration
- **URL Format**: Standard Notion page URL format construction
- **Page ID Validation**: Validation of retrieved Notion page IDs
- **URL Construction**: Proper URL formatting and validation
- **Integration Bridge**: Seamless bridge between coordinate system and Notion

## Testing
No explicit test files referenced, but includes comprehensive error handling and validation for robust coordinate resolution

## Related Files
### Core Dependencies
- **./schemas.js**: ResolveBimbaCoordinateSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for coordinate resolution operations
- **Neo4j Database**: Direct integration with Bimba graph database
- **MCP Server**: Integration with Model Context Protocol server
- **Notion Workspace**: Integration with Notion page system

### Tool Architecture
- **Coordinate Resolution**: Simple coordinate-to-URL resolution
- **Database Lookup**: Direct Neo4j property lookup operations
- **URL Construction**: Notion URL formatting and construction
- **Validation Framework**: Strict input validation and error handling

## Development Notes
- **Simple Resolution**: Focused on straightforward coordinate-to-URL resolution
- **Direct Lookup**: Efficient direct property lookup without complex queries
- **Notion Integration**: Seamless integration with Notion workspace through URL construction
- **Validation Focus**: Strict coordinate format validation and error handling
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Resource Management**: Efficient Neo4j session management prevents connection leaks
- **Error Resilience**: Comprehensive error handling with detailed logging
- **Performance Optimization**: Simple, fast lookup operations for quick resolution
- **Integration Bridge**: Serves as bridge between Bimba coordinate system and Notion workspace
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
