# documents.routes.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/api/routes/documents.routes.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Documents API routes providing comprehensive HTTP endpoints for document management operations. Handles document listing, coordinate-based filtering, file uploads with multer, CRUD operations, and analysis pipeline integration. Serves as the primary HTTP interface for frontend applications to manage documents with proper file handling and coordinate-based organization.

## System Integration
### Imports
- **express**: Express.js router for HTTP endpoint definition
- **multer**: File upload middleware for handling multipart/form-data
- **path**: File system path utilities
- **fileURLToPath**: ES module URL to file path conversion
- **documents.controller**: Document operation controllers

### Exports
- **router**: Express router with document management endpoints

### Dependencies
- **Documents Controller**: Business logic for document operations
- **Multer**: File upload handling middleware
- **Express.js**: Web framework for HTTP endpoint handling
- **File System**: Upload directory management

### Dependents
- **Frontend Applications**: Primary consumers of document API endpoints
- **Document Service**: Uses document routes for CRUD operations
- **File Upload Components**: File upload functionality
- **Backend Index**: Mounts document routes at /api/documents

## Key Functions/Components
### Multer Configuration (Lines 18-33)
**Purpose**: Configure file upload handling with disk storage
**Parameters**: destination, filename configuration
**Returns**: Multer upload middleware
**Notes**: Unique filename generation, uploads directory management

### GET /api/documents (Line 44)
**Purpose**: List all documents with optional filtering
**Parameters**: Query parameters for filtering
**Returns**: JSON array of documents
**Notes**: Routes to listDocuments controller

### GET /api/documents/by-coordinate/:coordinate (Line 45)
**Purpose**: List documents filtered by Bimba coordinate
**Parameters**: coordinate (URL parameter)
**Returns**: JSON array of coordinate-specific documents
**Notes**: Routes to listDocumentsByCoordinate controller

### POST /api/documents/upload (Line 46)
**Purpose**: Upload new document with file handling
**Parameters**: Multipart form data with file
**Returns**: JSON response with uploaded document data
**Notes**: Uses multer middleware for file processing

### GET /api/documents/:id (Line 47)
**Purpose**: Get specific document by ID
**Parameters**: id (URL parameter)
**Returns**: JSON document object
**Notes**: Routes to getDocument controller

### PATCH /api/documents/:id/coordinate (Line 48)
**Purpose**: Update document's Bimba coordinate
**Parameters**: id (URL parameter), coordinate data in body
**Returns**: JSON response with updated document
**Notes**: Routes to updateDocumentCoordinate controller

### PATCH /api/documents/:id/content (Line 49)
**Purpose**: Update document content
**Parameters**: id (URL parameter), content data in body
**Returns**: JSON response with updated document
**Notes**: Routes to updateDocumentContent controller

### DELETE /api/documents/:id (Line 50)
**Purpose**: Delete document by ID
**Parameters**: id (URL parameter)
**Returns**: JSON response with deletion status
**Notes**: Routes to deleteDocument controller

### POST /api/documents/:id/analyze (Line 53)
**Purpose**: Start document analysis pipeline
**Parameters**: id (URL parameter), analysis parameters in body
**Returns**: JSON response with analysis initiation status
**Notes**: Routes to startDocumentAnalysis controller

### GET /api/documents/debug (Lines 36-41)
**Purpose**: Debug endpoint for API connectivity testing
**Parameters**: None
**Returns**: JSON response with status and timestamp
**Notes**: Simple connectivity test endpoint

## Data Flow
1. **HTTP Request**: Frontend request → Express router → Route matching
2. **File Upload**: Multipart data → Multer processing → File storage → Controller call
3. **Controller Routing**: Route handler → Controller function → Business logic execution
4. **Response**: Controller result → JSON response → Frontend application
5. **Error Handling**: Errors caught → Error response → Frontend error handling

## Configuration
### API Endpoints
- **GET /**: List all documents
- **GET /by-coordinate/:coordinate**: List documents by coordinate
- **POST /upload**: Upload new document
- **GET /:id**: Get specific document
- **PATCH /:id/coordinate**: Update document coordinate
- **PATCH /:id/content**: Update document content
- **DELETE /:id**: Delete document
- **POST /:id/analyze**: Start document analysis
- **GET /debug**: API connectivity test

### File Upload Configuration
- **Storage**: Disk storage in uploads directory
- **Filename**: Timestamp + random suffix + original name
- **Upload Directory**: ../uploads/ relative to routes file
- **Single File**: upload.single('file') middleware

### Route Parameters
- **Document ID**: MongoDB ObjectId format
- **Coordinate**: Bimba coordinate string
- **File Field**: 'file' field name for uploads

## Testing
Debug endpoint available at /api/documents/debug for connectivity testing

## Related Files
### Core Dependencies
- `../controllers/documents.controller.mjs` - Document operation controllers
- Express.js framework for HTTP handling
- Multer middleware for file uploads

### Integration Points
- **Backend Index**: Mounts routes at /api/documents prefix
- **Frontend Services**: Primary consumers of document API
- **File System**: Upload directory management
- **Analysis Pipeline**: Document analysis integration

### Controller Functions
- **listDocuments**: Document listing with filtering
- **uploadDocument**: File upload and document creation
- **getDocument**: Document retrieval by ID
- **updateDocumentCoordinate**: Coordinate updates
- **updateDocumentContent**: Content updates
- **deleteDocument**: Document deletion
- **startDocumentAnalysis**: Analysis pipeline integration

## Development Notes
- **File Upload Handling**: Comprehensive multer configuration for file processing
- **RESTful Design**: Standard REST API patterns for document operations
- **Coordinate Integration**: Bimba coordinate-based document organization
- **Error Handling**: Proper HTTP status codes and error responses
- **Upload Security**: Unique filename generation prevents conflicts
- **Directory Management**: Automatic upload directory handling
- **Analysis Integration**: Direct integration with document analysis pipeline
- **Debug Support**: Connectivity testing endpoint for troubleshooting
- **Modular Design**: Clean separation between routes and business logic
