# error.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/utils/error.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Error Handling Utilities providing centralized error management and MCP error conversion for the BPMCP server. Defines custom error types, error classes, and standardized error handling functions with comprehensive MCP error code mapping. Serves as the foundational error management system within the BPMCP server architecture ensuring consistent error handling and proper MCP protocol compliance across all tools and operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling

### Exports
- **ErrorType**: Enum defining application-specific error categories
- **AppError**: Custom error class with MCP conversion capabilities
- **handleError**: Centralized error handling function with logging and MCP conversion

### Dependencies
- **MCP SDK**: Model Context Protocol error types and codes
- **Node.js**: Built-in Error class for error inheritance

### Dependents
- **All BPMCP Tools**: Every tool uses handleError for consistent error management
- **Database Operations**: Neo4j operations rely on error handling for database errors
- **Validation Systems**: Schema validation uses error handling for validation errors
- **MCP Server**: Server-level error handling and response formatting

## Key Functions/Components
### ErrorType Enum (Lines 6-13)
**Purpose**: Defines application-specific error categories for consistent error classification
**Parameters**: Error type identifiers
**Returns**: Enum values for error categorization
**Notes**: 75 lines implementing comprehensive error handling with MCP integration

### AppError Class (Lines 18-50)
**Purpose**: Custom error class extending built-in Error with type classification and MCP conversion
**Parameters**: ErrorType and error message
**Returns**: AppError instance with MCP conversion capabilities
**Notes**: Comprehensive error class with type safety and MCP protocol compliance

### toMcpError Method (Lines 30-45)
**Purpose**: Converts AppError instances to standardized MCP error format
**Parameters**: AppError instance properties
**Returns**: McpError object conforming to MCP protocol
**Notes**: Maps application error types to appropriate MCP error codes

### handleError Function (Lines 55-75)
**Purpose**: Centralized error handling function with logging and MCP conversion
**Parameters**: Error object, optional context, and logging configuration
**Returns**: Standardized MCP error response
**Notes**: Comprehensive error processing with logging, type detection, and MCP formatting

### Error Type Mapping (Lines 30-45)
**Purpose**: Maps application error types to MCP error codes
**Parameters**: ErrorType enum values
**Returns**: Appropriate MCP ErrorCode values
**Notes**: Ensures proper MCP protocol compliance for all error scenarios

## Data Flow
1. **Error Occurrence**: Error thrown → Error detection → Type classification → Error processing
2. **Error Processing**: Error object → Type identification → Context extraction → Logging execution
3. **MCP Conversion**: Processed error → MCP mapping → Error code assignment → Response formatting
4. **Error Response**: MCP error → Response preparation → Client transmission → Error handling completion
5. **Logging Flow**: Error details → Log formatting → Console output → Debug information

## Configuration
### Error Type Configuration
- **ValidationError**: Input validation and schema errors
- **DatabaseError**: Neo4j and database connection errors
- **NotFoundError**: Resource not found errors
- **AuthenticationError**: Authentication and credential errors
- **AuthorizationError**: Permission and access control errors
- **InternalError**: System and unexpected errors

### MCP Error Code Mapping
- **ValidationError** → `ErrorCode.InvalidParams`
- **DatabaseError** → `ErrorCode.InternalError`
- **NotFoundError** → `ErrorCode.InvalidRequest`
- **AuthenticationError** → `ErrorCode.InvalidRequest`
- **AuthorizationError** → `ErrorCode.InvalidRequest`
- **InternalError** → `ErrorCode.InternalError`

### Logging Configuration
- **Error Details**: Comprehensive error information logging
- **Context Information**: Optional context and operation details
- **Stack Traces**: Full stack trace logging for debugging
- **MCP Compliance**: Proper MCP error format and codes

## Testing
No explicit test files referenced, but includes comprehensive error type coverage and MCP compliance validation

## Related Files
### Core Dependencies
- **@modelcontextprotocol/sdk/types.js**: MCP error types and codes

### Integration Points
- **All BPMCP Tools**: Universal error handling across all tools
- **Database Operations**: Error handling for Neo4j and database operations
- **Validation Systems**: Error handling for schema and input validation
- **MCP Server**: Server-level error handling and response formatting

### Error Architecture
- **Centralized Handling**: Single source of truth for error management
- **Type Safety**: Strongly typed error categories and handling
- **MCP Compliance**: Full compliance with MCP error protocol
- **Logging Integration**: Comprehensive logging and debugging support

## Development Notes
- **Centralized Error Management**: Single source of truth for all BPMCP error handling
- **MCP Protocol Compliance**: Full compliance with Model Context Protocol error standards
- **Type Safety**: Strongly typed error categories prevent error handling mistakes
- **Comprehensive Coverage**: Covers all major error scenarios in BPMCP operations
- **Logging Integration**: Built-in logging for debugging and monitoring
- **Extensible Design**: Easy addition of new error types and MCP mappings
- **Consistent Interface**: Uniform error handling across all BPMCP tools
- **Debug Support**: Comprehensive error information for development and troubleshooting
- **Performance Optimization**: Efficient error processing with minimal overhead
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
