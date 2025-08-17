# storeDocument.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/document/storeDocument.ts`
**Bimba Coordinate**: `#5-2-0-26`
**Last Updated**: `2025-01-30`

## Purpose & Role
Document Storage Tool providing MongoDB document storage capabilities for the BPMCP server. Handles document insertion with metadata, collection management, and storage validation with comprehensive error handling. Serves as the primary document persistence layer within the BPMCP tool ecosystem enabling document storage, retrieval, and management across all document-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: StoreDocumentSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **storeDocumentTool**: Tool definition for MCP tool registration
- **handleStoreDocument**: Main handler function for document storage operations

### Dependencies
- **MongoDB**: Database connection through ToolDependencies for document storage
- **Schema Validation**: StoreDocumentSchema for input validation
- **Error Handling**: Centralized error handling for storage operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Document Management**: Document-based operations requiring storage capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring document storage functionality
- **Data Persistence**: Systems requiring persistent document storage

## Key Functions/Components
### storeDocumentTool Definition (Lines 8-12)
**Purpose**: Defines the MCP tool for document storage operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 63 lines implementing comprehensive document storage with MongoDB integration

### handleStoreDocument Function (Lines 20-63)
**Purpose**: Main handler function for document storage operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Storage result with document ID and metadata
**Notes**: Comprehensive document storage with metadata and collection management

### Input Validation (Lines 22-24)
**Purpose**: Validates input arguments against StoreDocumentSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring data integrity

### Collection Management (Lines 24-25)
**Purpose**: Manages MongoDB collection selection and creation
**Parameters**: Collection name from arguments or default "Documents"
**Returns**: MongoDB collection reference
**Notes**: Flexible collection management with default fallback

### Document Preparation (Lines 30-45)
**Purpose**: Prepares document with additional metadata fields
**Parameters**: Validated document data and metadata
**Returns**: Enhanced document with timestamps and metadata
**Notes**: Adds createdAt, updatedAt, and storage metadata

### Document Insertion (Lines 47-55)
**Purpose**: Inserts document into MongoDB collection
**Parameters**: Prepared document and collection reference
**Returns**: Insertion result with document ID
**Notes**: MongoDB insertion with result validation and error handling

### Response Formatting (Lines 57-63)
**Purpose**: Formats successful storage response for client
**Parameters**: Insertion result and document metadata
**Returns**: Formatted response with document ID and confirmation
**Notes**: Structured response format for client consumption

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Collection Setup**: Collection name → MongoDB collection → Collection reference → Storage preparation
3. **Document Preparation**: Document data → Metadata addition → Timestamp addition → Storage formatting
4. **Storage Operation**: Prepared document → MongoDB insertion → Result validation → Success confirmation
5. **Response Processing**: Storage result → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "storeDocument" for MCP tool identification
- **Description**: Clear description of document storage functionality
- **Input Schema**: StoreDocumentSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Storage Configuration
- **Default Collection**: "Documents" collection for document storage
- **Collection Flexibility**: Configurable collection names for organization
- **Metadata Enhancement**: Automatic metadata addition for document tracking
- **Timestamp Management**: Automatic createdAt and updatedAt timestamps

### MongoDB Configuration
- **Database Access**: MongoDB database through dependency injection
- **Collection Management**: Dynamic collection creation and access
- **Document Structure**: Flexible document structure with metadata
- **Error Handling**: Comprehensive MongoDB error handling

## Testing
No explicit test files referenced, but includes comprehensive input validation and MongoDB operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: StoreDocumentSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling

### Integration Points
- **MongoDB Database**: Document storage and retrieval operations
- **MCP Server**: Tool registration and execution
- **Client Applications**: Document storage requests and responses
- **Document Management**: Document lifecycle and organization

### Tool Architecture
- **Document Storage**: Primary document persistence functionality
- **Collection Management**: Flexible collection organization
- **Metadata Enhancement**: Automatic document metadata management
- **Error Handling**: Comprehensive error handling and validation

## Development Notes
- **Document Storage**: Comprehensive MongoDB document storage with metadata enhancement
- **Collection Flexibility**: Configurable collection names for document organization
- **Metadata Management**: Automatic timestamp and metadata addition for document tracking
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for storage operations and MongoDB issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Robust document storage suitable for production document management
- **Development Support**: Clear storage operations and error handling for development
- **Extensible Design**: Easy addition of new document storage features and metadata
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
