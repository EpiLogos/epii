# getMongoContext.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/mongo/getMongoContext.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
MongoDB Context Retrieval Tool providing flexible database querying capabilities for MongoDB collections within the BPMCP server. Handles collection-based queries with filtering, sorting, projection, and result limiting for comprehensive data access. Serves as the primary MongoDB integration layer within the BPMCP database ecosystem enabling flexible data retrieval, context analysis, and document-based operations across all MongoDB-based storage systems.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: GetMongoContextSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **getMongoContextTool**: Tool definition for MCP tool registration
- **handleGetMongoContext**: Main handler function for MongoDB context retrieval operations

### Dependencies
- **MongoDB Database**: MongoDB connection through ToolDependencies for database integration
- **Schema Validation**: GetMongoContextSchema for input validation
- **Error Handling**: Centralized error handling for database operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Context Operations**: Context-based operations requiring MongoDB data access capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring MongoDB data retrieval functionality
- **Database Integration**: Systems requiring flexible MongoDB querying and data access

## Key Functions/Components
### getMongoContextTool Definition (Lines 8-12)
**Purpose**: Defines the MCP tool for MongoDB context retrieval operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 76 lines implementing comprehensive MongoDB context retrieval with database integration

### handleGetMongoContext Function (Lines 20-76)
**Purpose**: Main handler function for MongoDB context retrieval operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: MongoDB query results with comprehensive data and metadata
**Notes**: Flexible MongoDB querying with collection targeting, filtering, sorting, and projection

### Input Validation (Lines 22-28)
**Purpose**: Validates input arguments against GetMongoContextSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring collection, query, and parameter integrity

### Query Logging (Lines 27-28)
**Purpose**: Logs MongoDB query details for monitoring and debugging
**Parameters**: Collection name and query filter information
**Returns**: Comprehensive logging for database operation tracking
**Notes**: Detailed logging with collection awareness and query parameter tracking

### Collection Access (Lines 30-40)
**Purpose**: Accesses MongoDB collection for query execution
**Parameters**: Collection name and database connection
**Returns**: MongoDB collection reference for querying
**Notes**: Direct MongoDB collection access with connection management

### Query Execution (Lines 42-55)
**Purpose**: Executes MongoDB query with filtering, sorting, and projection
**Parameters**: Query filter, sort specification, projection, and limit
**Returns**: MongoDB query results with applied parameters
**Notes**: Flexible query execution with comprehensive parameter support

### Result Processing (Lines 57-65)
**Purpose**: Processes MongoDB query results for client consumption
**Parameters**: Raw MongoDB results and processing configuration
**Returns**: Processed results with metadata and formatting
**Notes**: Result processing with document formatting and metadata extraction

### Response Formatting (Lines 67-76)
**Purpose**: Formats MongoDB context response for client consumption
**Parameters**: Processed results and operation metadata
**Returns**: Formatted response with comprehensive data and context information
**Notes**: Structured response format for client consumption with complete MongoDB data

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Database Access**: Collection targeting → Database connection → Collection reference → Query preparation
3. **Query Execution**: Filter application → Sort processing → Projection handling → Limit enforcement
4. **Result Processing**: Data retrieval → Document processing → Metadata extraction → Response formatting
5. **Response Delivery**: Formatted results → Client delivery → Operation completion → Connection cleanup

## Configuration
### Tool Configuration
- **Tool Name**: "getMongoContext" for MCP tool identification
- **Description**: Clear description of MongoDB context retrieval functionality
- **Input Schema**: GetMongoContextSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Query Configuration
- **Collection Targeting**: Flexible collection specification for data access
- **Query Filtering**: MongoDB query filter support with comprehensive operators
- **Result Limiting**: Configurable result limits (1-100, default 10) for performance
- **Sort Support**: Optional sorting with field-based ordering

### Database Configuration
- **MongoDB Integration**: Direct MongoDB database integration through dependencies
- **Collection Access**: Dynamic collection targeting and access
- **Query Processing**: Comprehensive MongoDB query processing and execution
- **Result Handling**: Flexible result processing and formatting

## Testing
No explicit test files referenced, but includes comprehensive input validation and MongoDB operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: GetMongoContextSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling

### Mongo Tools Ecosystem
- **./schemas.ts**: Schema definitions for MongoDB tools validation
- **./index.ts**: MongoDB tools module exports and organization

### Integration Points
- **MongoDB Database**: MongoDB database integration and collection access
- **MCP Server**: Tool registration and execution
- **Client Applications**: MongoDB context requests and data retrieval responses
- **Database Systems**: MongoDB-based storage and data access integration

## Development Notes
- **Flexible Querying**: Comprehensive MongoDB querying with filtering, sorting, and projection
- **Database Integration**: Direct MongoDB integration with collection-based access
- **Parameter Support**: Full MongoDB query parameter support with validation
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for database operations and connection issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable MongoDB access suitable for production database operations
- **Development Support**: Clear database operations and MongoDB integration for development
- **Extensible Design**: Easy addition of new MongoDB features and query capabilities
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
