# updateBimbaGraph.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/updateBimbaGraph.ts`
**Bimba Coordinate**: `#5-2-0-18`
**Last Updated**: `2025-01-30`

## Purpose & Role
Update Bimba Graph Tool providing write operations for the Neo4j Bimba graph database through MCP (Model Context Protocol). Handles create, update, and delete operations with comprehensive validation, error handling, and transaction management. Serves as the primary write interface for Bimba coordinate system modifications within the BPMCP server architecture with sophisticated Cypher query execution and result processing.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Bimba Schemas**: UpdateBimbaGraphSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **updateBimbaGraphTool**: Tool definition with name, description, and input schema
- **handleUpdateBimbaGraph**: Main handler function for update operations

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for graph update operations
- **Frontend Update Operations**: Components requiring graph modifications
- **Analysis Pipeline**: Systems needing to update graph based on analysis results
- **Coordinate Management**: Systems managing Bimba coordinate updates

## Key Functions/Components
### updateBimbaGraphTool Definition (Lines 8-13)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: 143 lines implementing comprehensive graph update operations

### handleUpdateBimbaGraph Function (Lines 20-143)
**Purpose**: Main handler function executing write Cypher queries against Neo4j
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with operation results and metadata
**Notes**: Comprehensive update handler with transaction management and error handling

### Input Validation (Lines 25-30)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to UpdateBimbaGraphSchema
**Notes**: Strict validation ensures data integrity and prevents malformed queries

### Neo4j Session Management (Lines 32-45)
**Purpose**: Manages Neo4j database session lifecycle with proper cleanup
**Parameters**: Neo4j driver from dependencies
**Returns**: Database session for query execution
**Notes**: Proper session management prevents connection leaks

### Cypher Query Execution (Lines 47-85)
**Purpose**: Executes write Cypher queries with transaction management
**Parameters**: Validated Cypher query and optional parameters
**Returns**: Query execution results with metadata
**Notes**: Supports parameterized queries for security and performance

### Result Processing (Lines 87-120)
**Purpose**: Processes Neo4j query results into standardized response format
**Parameters**: Raw Neo4j query results
**Returns**: Formatted response with records, summary, and metadata
**Notes**: Comprehensive result processing with statistics and performance metrics

### Error Handling (Lines 122-143)
**Purpose**: Handles errors with proper logging and standardized error responses
**Parameters**: Error objects and execution context
**Returns**: Standardized MCP error responses
**Notes**: Comprehensive error handling with session cleanup and detailed logging

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Dependencies extraction
2. **Session Management**: Neo4j driver → Session creation → Transaction initialization → Connection establishment
3. **Query Execution**: Cypher query → Parameter binding → Transaction execution → Result collection
4. **Result Processing**: Raw results → Data formatting → Statistics collection → Response preparation
5. **Cleanup and Response**: Session cleanup → Error handling → Response formatting → MCP response return

## Configuration
### Tool Configuration
- **Tool Name**: "updateBimbaGraph" for MCP tool registration
- **Description**: Clear description of write operation capabilities
- **Input Schema**: UpdateBimbaGraphSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Neo4j Configuration
- **Session Management**: Proper session lifecycle with cleanup
- **Transaction Handling**: Write transactions for data consistency
- **Query Execution**: Parameterized queries for security
- **Connection Management**: Efficient connection usage and cleanup

### Validation Configuration
- **Schema Validation**: Strict Zod schema validation for input integrity
- **Parameter Validation**: Cypher parameter validation and sanitization
- **Error Validation**: Comprehensive error checking and handling
- **Response Validation**: Standardized response format validation

## Testing
No explicit test files referenced, but includes comprehensive error handling and validation for robust operation

## Related Files
### Core Dependencies
- **./schemas.js**: UpdateBimbaGraphSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for graph update operations
- **Neo4j Database**: Direct integration with Bimba graph database
- **MCP Server**: Integration with Model Context Protocol server
- **Frontend Systems**: Components requiring graph modification capabilities

### Tool Architecture
- **Write Operations**: Comprehensive create, update, delete operations
- **Transaction Management**: Proper transaction handling for data consistency
- **Error Handling**: Robust error handling with detailed logging
- **Validation Framework**: Strict input validation and sanitization

## Development Notes
- **Write-Only Operations**: Focused on graph modification operations with proper transaction management
- **Security Focus**: Parameterized queries prevent injection attacks and ensure data integrity
- **Error Resilience**: Comprehensive error handling with proper session cleanup and detailed logging
- **Performance Optimization**: Efficient session management and query execution
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Validation Framework**: Strict input validation ensures data integrity and prevents malformed operations
- **Transaction Safety**: Proper transaction management ensures data consistency
- **Resource Management**: Efficient Neo4j session management prevents connection leaks
- **Logging Integration**: Comprehensive logging for debugging and monitoring
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
