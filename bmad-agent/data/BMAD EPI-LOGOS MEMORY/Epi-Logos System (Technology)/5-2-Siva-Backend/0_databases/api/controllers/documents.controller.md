# documents.controller.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/api/controllers/documents.controller.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Documents Controller implementing business logic for document management operations. Handles document listing, coordinate-based filtering, file uploads with text extraction, CRUD operations, and analysis pipeline integration. Serves as the business logic layer between HTTP routes and BPMCP service, providing comprehensive document management functionality with proper error handling and response formatting.

## System Integration
### Imports
- **bpMCPService**: BPMCP service for document operations and tool calls
- **fs**: File system operations for upload directory management
- **path**: File system path utilities
- **fileURLToPath**: ES module URL to file path conversion
- **extractTextFromFile**: File service for text content extraction

### Exports
- **listDocuments**: List all documents with pagination
- **listDocumentsByCoordinate**: List documents filtered by Bimba coordinate
- **uploadDocument**: Upload document with text extraction and metadata
- **getDocument**: Get specific document by ID with content processing
- **updateDocumentCoordinate**: Update document's Bimba coordinate
- **updateDocumentContent**: Update document content
- **deleteDocument**: Delete document with cleanup
- **startDocumentAnalysis**: Start document analysis pipeline

### Dependencies
- **BPMCP Service**: Core dependency for all document operations
- **File Service**: Text extraction from uploaded files
- **File System**: Upload directory management and file operations
- **Express.js**: HTTP request/response handling

### Dependents
- **Documents Routes**: Primary consumer routing HTTP requests to controllers
- **Frontend Applications**: Indirect consumers via API endpoints
- **Analysis Pipeline**: Document analysis integration

## Key Functions/Components
### listDocuments(req, res) (Lines 19-28)
**Purpose**: List all documents with optional pagination
**Parameters**: req (Express request), res (Express response)
**Returns**: JSON response with documents array
**Notes**: Default limit of 100 documents, uses BPMCP service for data retrieval

### listDocumentsByCoordinate(req, res) (Lines 33-45)
**Purpose**: List documents filtered by specific Bimba coordinate
**Parameters**: req (Express request with coordinate param), res (Express response)
**Returns**: JSON response with filtered documents
**Notes**: Coordinate-based filtering via BPMCP service

### uploadDocument(req, res) (Lines 50-98)
**Purpose**: Upload document with text extraction and metadata processing
**Parameters**: req (Express request with file and metadata), res (Express response)
**Returns**: JSON response with uploaded document details
**Notes**: File validation, text extraction, BPMCP storage, comprehensive metadata handling

### getDocument(req, res) (Lines 103-200)
**Purpose**: Get specific document by ID with multiple response format handling
**Parameters**: req (Express request with document ID), res (Express response)
**Returns**: JSON response with document data
**Notes**: Complex response parsing for different BPMCP result formats, content length calculation

### updateDocumentCoordinate(req, res) (Lines 220-250)
**Purpose**: Update document's Bimba coordinate
**Parameters**: req (Express request with ID and coordinate), res (Express response)
**Returns**: JSON response with update status
**Notes**: Coordinate validation and BPMCP service integration

### updateDocumentContent(req, res) (Lines 270-300)
**Purpose**: Update document content with versioning
**Parameters**: req (Express request with ID and content), res (Express response)
**Returns**: JSON response with update status
**Notes**: Content validation, versioning support, BPMCP service integration

### deleteDocument(req, res) (Lines 320-335)
**Purpose**: Delete document with file system cleanup
**Parameters**: req (Express request with document ID), res (Express response)
**Returns**: JSON response with deletion status
**Notes**: BPMCP deletion, file system cleanup, error handling

### Upload Directory Management (Lines 11-14)
**Purpose**: Ensure uploads directory exists for file storage
**Parameters**: None
**Returns**: void
**Notes**: Automatic directory creation with recursive option

## Data Flow
1. **HTTP Request**: Route handler → Controller function → Parameter extraction
2. **Business Logic**: Validation → BPMCP service call → Data processing
3. **File Operations**: File upload → Text extraction → Metadata creation → Storage
4. **Response Processing**: BPMCP result → Format parsing → Response formatting → HTTP response
5. **Error Handling**: Errors caught → Logging → Error response → Client notification

## Configuration
### Upload Settings
- **Upload Directory**: ../uploads/ relative to controller file
- **Directory Creation**: Automatic recursive directory creation
- **File Processing**: Text extraction from uploaded files

### Response Formats
- **Success Responses**: Structured JSON with data and metadata
- **Error Responses**: Consistent error format with messages and details
- **Document Structure**: Standardized document object format

### BPMCP Integration
- **Service Calls**: All document operations via BPMCP service
- **Tool Calls**: Direct BPMCP tool invocation for specific operations
- **Result Processing**: Multiple BPMCP response format handling

### Pagination
- **Default Limit**: 100 documents for listing operations
- **Query Parameters**: Configurable limit via request query

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../bpmcp/bpMCP.service.mjs` - BPMCP service for document operations
- `../../shared/services/file.service.mjs` - File text extraction service
- Node.js built-in modules for file system operations

### Integration Points
- **Documents Routes**: HTTP route handlers calling controller functions
- **BPMCP Service**: All document operations routed through BPMCP
- **File System**: Upload directory and file management
- **Analysis Pipeline**: Document analysis integration

### Service Layer
- **Business Logic**: Controller implements business logic between routes and services
- **Data Processing**: Document metadata processing and validation
- **Error Handling**: Comprehensive error handling and response formatting

## Development Notes
- **File Upload Processing**: Comprehensive file upload handling with text extraction
- **Response Format Handling**: Multiple BPMCP response format parsing for compatibility
- **Error Resilience**: Comprehensive error handling with detailed logging
- **Metadata Management**: Rich document metadata with coordinate and analysis status
- **Directory Management**: Automatic upload directory creation and management
- **Content Processing**: Text extraction from various file types
- **Coordinate Integration**: Bimba coordinate-based document organization
- **Analysis Integration**: Document analysis pipeline integration
- **Validation**: Input validation for all operations
- **Cleanup**: Proper file system cleanup on document deletion
