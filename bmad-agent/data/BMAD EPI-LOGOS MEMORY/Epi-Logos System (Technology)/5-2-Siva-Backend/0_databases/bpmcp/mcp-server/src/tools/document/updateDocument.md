# updateDocument.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/document/updateDocument.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Document Update Tool providing MongoDB document modification capabilities for the BPMCP server. Handles document updates with ObjectId validation, flexible update operations, and backward compatibility with legacy formats. Serves as the primary document modification layer within the BPMCP document management ecosystem enabling content updates, metadata changes, and document lifecycle management across all document-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **MongoDB**: ObjectId from mongodb for document ID validation and conversion
- **Schemas**: UpdateDocumentSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **updateDocumentTool**: Tool definition for MCP tool registration
- **handleUpdateDocument**: Main handler function for document update operations

### Dependencies
- **MongoDB**: Database connection through ToolDependencies for document updates
- **Schema Validation**: UpdateDocumentSchema for input validation
- **Error Handling**: Centralized error handling for update operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Document Tools Ecosystem**: Part of comprehensive document CRUD operations

### Dependents
- **Document Management**: Document-based operations requiring update capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring document modification functionality
- **Content Management**: Systems requiring document content and metadata updates

## Key Functions/Components
### updateDocumentTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for document update operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 125 lines implementing comprehensive document update with MongoDB integration

### handleUpdateDocument Function (Lines 21-125)
**Purpose**: Main handler function for document update operations with backward compatibility
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Update result with modification confirmation and updated document data
**Notes**: Comprehensive document update with legacy format support and flexible update operations

### Schema Format Detection (Lines 23-40)
**Purpose**: Detects and handles both new schema format and legacy update format
**Parameters**: Input arguments with format detection logic
**Returns**: Parsed document ID, update operations, and collection name
**Notes**: Backward compatibility support for existing integrations

### Input Validation (Lines 27-35)
**Purpose**: Validates input arguments against UpdateDocumentSchema for new format
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring document ID and update operation integrity

### Collection Management (Lines 29-45)
**Purpose**: Manages MongoDB collection selection and access
**Parameters**: Collection name from arguments or default "Documents"
**Returns**: MongoDB collection reference
**Notes**: Flexible collection management with default fallback

### ObjectId Conversion (Lines 47-55)
**Purpose**: Converts string document ID to MongoDB ObjectId
**Parameters**: Document ID string from validated arguments
**Returns**: Valid ObjectId for MongoDB update query
**Notes**: Includes ObjectId validation and error handling for invalid IDs

### Update Operations Processing (Lines 57-75)
**Purpose**: Processes and validates update operations for MongoDB
**Parameters**: Update operations object and validation rules
**Returns**: Properly formatted MongoDB update operations
**Notes**: Supports various MongoDB update operators and field modifications

### Document Update Execution (Lines 77-95)
**Purpose**: Executes document update in MongoDB collection by ObjectId
**Parameters**: ObjectId, update operations, and collection reference
**Returns**: Update result with modification count and updated document
**Notes**: MongoDB updateOne operation with result validation and document retrieval

### Response Formatting (Lines 97-125)
**Purpose**: Formats update response for client consumption
**Parameters**: Update result, modified document, and operation metadata
**Returns**: Formatted response with update confirmation and document data
**Notes**: Structured response format handling both success and not found cases

## Data Flow
1. **Request Reception**: Client request → Format detection → Schema validation → Parameter extraction
2. **Collection Setup**: Collection name → MongoDB collection → Collection reference → Update preparation
3. **ID Processing**: Document ID → ObjectId conversion → ID validation → Query preparation
4. **Update Processing**: Update operations → Validation → MongoDB formatting → Operation preparation
5. **Update Execution**: ObjectId query → MongoDB updateOne → Result validation → Document retrieval
6. **Response Processing**: Update result → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "updateDocument" for MCP tool identification
- **Description**: Clear description of document update functionality
- **Input Schema**: UpdateDocumentSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Update Configuration
- **Default Collection**: "Documents" collection for document updates
- **Collection Flexibility**: Configurable collection names for organization
- **ObjectId Validation**: Automatic ObjectId conversion and validation
- **Backward Compatibility**: Support for legacy update format
- **Update Operations**: Flexible MongoDB update operator support

### MongoDB Configuration
- **Database Access**: MongoDB database through dependency injection
- **Collection Management**: Dynamic collection access and update operations
- **Document Modification**: ObjectId-based document updates with operation validation
- **Result Processing**: Update confirmation and document retrieval

## Testing
No explicit test files referenced, but includes comprehensive input validation and MongoDB operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: UpdateDocumentSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **mongodb**: MongoDB ObjectId for document ID handling

### Document Tools Ecosystem
- **./storeDocument.ts**: Document creation and storage
- **./getDocumentById.ts**: Document retrieval by ID
- **./deleteDocument.ts**: Document deletion operations
- **./listDocuments.ts**: Document listing and discovery
- **./startDocumentAnalysis.ts**: Document analysis workflow

### Integration Points
- **MongoDB Database**: Document storage and update operations
- **MCP Server**: Tool registration and execution
- **Client Applications**: Document update requests and responses
- **Document Management**: Document lifecycle and modification systems

## Development Notes
- **Document Updates**: Comprehensive MongoDB document update with ObjectId validation
- **Backward Compatibility**: Legacy format support for existing integrations
- **Collection Flexibility**: Configurable collection names for document organization
- **ObjectId Validation**: Robust ObjectId conversion and validation for MongoDB compatibility
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for update operations and MongoDB issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Robust document updates suitable for production document management
- **Development Support**: Clear update operations and error handling for development
- **Extensible Design**: Easy addition of new update features and operation types
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
