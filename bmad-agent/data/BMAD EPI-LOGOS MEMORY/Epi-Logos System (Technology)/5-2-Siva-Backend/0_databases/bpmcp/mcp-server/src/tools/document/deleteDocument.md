# deleteDocument.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/document/deleteDocument.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Document Deletion Tool providing MongoDB document deletion capabilities by ID for the BPMCP server. Handles document removal with ObjectId validation, collection management, and deletion confirmation with comprehensive error handling. Serves as the primary document removal layer within the BPMCP tool ecosystem enabling document cleanup, data management, and storage optimization across all document-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **MongoDB**: ObjectId from mongodb for document ID validation and conversion
- **Schemas**: DeleteDocumentSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **deleteDocumentTool**: Tool definition for MCP tool registration
- **handleDeleteDocument**: Main handler function for document deletion operations

### Dependencies
- **MongoDB**: Database connection through ToolDependencies for document deletion
- **Schema Validation**: DeleteDocumentSchema for input validation
- **Error Handling**: Centralized error handling for deletion operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Document Management**: Document-based operations requiring deletion capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring document removal functionality
- **Data Cleanup**: Systems requiring document cleanup and storage management

## Key Functions/Components
### deleteDocumentTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for document deletion operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 66 lines implementing comprehensive document deletion with MongoDB integration

### handleDeleteDocument Function (Lines 21-66)
**Purpose**: Main handler function for document deletion operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Deletion result with confirmation or not found response
**Notes**: Comprehensive document deletion with ObjectId validation and collection management

### Input Validation (Lines 23-24)
**Purpose**: Validates input arguments against DeleteDocumentSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring document ID and collection integrity

### Collection Management (Lines 24-26)
**Purpose**: Manages MongoDB collection selection and access
**Parameters**: Collection name from arguments or default "Documents"
**Returns**: MongoDB collection reference
**Notes**: Flexible collection management with default fallback

### ObjectId Conversion (Lines 32-38)
**Purpose**: Converts string document ID to MongoDB ObjectId
**Parameters**: Document ID string from validated arguments
**Returns**: Valid ObjectId for MongoDB deletion query
**Notes**: Includes ObjectId validation and error handling for invalid IDs

### Document Deletion (Lines 40-50)
**Purpose**: Deletes document from MongoDB collection by ObjectId
**Parameters**: ObjectId and collection reference
**Returns**: Deletion result with deleted count
**Notes**: MongoDB deleteOne operation with result validation

### Response Formatting (Lines 52-66)
**Purpose**: Formats deletion response for client consumption
**Parameters**: Deletion result and document metadata
**Returns**: Formatted response with deletion confirmation or not found message
**Notes**: Structured response format handling both success and not found cases

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Collection Setup**: Collection name → MongoDB collection → Collection reference → Deletion preparation
3. **ID Processing**: Document ID → ObjectId conversion → ID validation → Query preparation
4. **Deletion Operation**: ObjectId query → MongoDB deleteOne → Result validation → Deletion confirmation
5. **Response Processing**: Deletion result → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "deleteDocument" for MCP tool identification
- **Description**: Clear description of document deletion functionality
- **Input Schema**: DeleteDocumentSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Deletion Configuration
- **Default Collection**: "Documents" collection for document deletion
- **Collection Flexibility**: Configurable collection names for organization
- **ObjectId Validation**: Automatic ObjectId conversion and validation
- **Error Handling**: Comprehensive error handling for invalid IDs and missing documents

### MongoDB Configuration
- **Database Access**: MongoDB database through dependency injection
- **Collection Management**: Dynamic collection access and deletion operations
- **Document Removal**: ObjectId-based document deletion
- **Result Processing**: Deletion confirmation and not found handling

## Testing
No explicit test files referenced, but includes comprehensive input validation and MongoDB operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: DeleteDocumentSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **mongodb**: MongoDB ObjectId for document ID handling

### Integration Points
- **MongoDB Database**: Document storage and deletion operations
- **MCP Server**: Tool registration and execution
- **Client Applications**: Document deletion requests and responses
- **Document Management**: Document lifecycle and cleanup systems

### Tool Architecture
- **Document Deletion**: Primary document removal functionality
- **Collection Management**: Flexible collection organization
- **ObjectId Handling**: Proper MongoDB ObjectId validation and conversion
- **Error Handling**: Comprehensive error handling and validation

## Development Notes
- **Document Deletion**: Comprehensive MongoDB document deletion with ObjectId validation
- **Collection Flexibility**: Configurable collection names for document organization
- **ObjectId Validation**: Robust ObjectId conversion and validation for MongoDB compatibility
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for deletion operations and MongoDB issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Robust document deletion suitable for production document management
- **Development Support**: Clear deletion operations and error handling for development
- **Extensible Design**: Easy addition of new document deletion features and filtering
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
