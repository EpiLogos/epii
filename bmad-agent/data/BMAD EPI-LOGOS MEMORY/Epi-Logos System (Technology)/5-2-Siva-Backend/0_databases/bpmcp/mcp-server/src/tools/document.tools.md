# document.tools.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/document.tools.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
**DEPRECATED** Legacy Document Tools providing backward compatibility for document management operations within the BPMCP server. Originally handled comprehensive document CRUD operations including storage, retrieval, listing, deletion, and coordinate-based filtering before modularization. **This file is deprecated and maintained only for backward compatibility - all functionality has been refactored into the modular document/ directory tools and will be removed in a future version.**

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation
- **MongoDB**: ObjectId from mongodb for document ID handling
- **MCP SDK**: McpError, ErrorCode from @modelcontextprotocol/sdk/types.js for error handling

### Exports
- **Legacy Schema Exports**: ListDocumentsInputSchema, GetDocumentByIdInputSchema, ListDocumentsByCoordinateInputSchema, StoreDocumentInputSchema, DeleteDocumentInputSchema
- **Legacy Tool Exports**: listDocumentsTool, getDocumentByIdTool, listDocumentsByCoordinateTool, storeDocumentTool, deleteDocumentTool
- **Legacy Handler Exports**: listDocumentsHandler, getDocumentByIdHandler, listDocumentsByCoordinateHandler, storeDocumentHandler, deleteDocumentHandler

### Dependencies
- **MongoDB Database**: MongoDB connection for document operations
- **Schema Validation**: Zod schemas for input validation
- **Error Handling**: MCP error handling for operation failures

### Dependents
- **Legacy Systems**: Systems still using the old monolithic document tools interface
- **Backward Compatibility**: Applications requiring the deprecated tool interface
- **Migration Support**: Systems in transition to the new modular document tools

## Key Functions/Components
### Legacy Schema Definitions (Lines 16-50)
**Purpose**: Defines validation schemas for all legacy document operations
**Parameters**: Various schemas for listing, retrieval, storage, and deletion operations
**Returns**: Zod schema objects for legacy tool validation
**Notes**: 368 lines implementing deprecated document tools for backward compatibility

### Legacy Tool Definitions (Lines 52-120)
**Purpose**: Defines MCP tools for legacy document operations
**Parameters**: Tool names, descriptions, and input schemas
**Returns**: Tool definitions for MCP registration
**Notes**: **DEPRECATED** - Use modular document tools in document/ directory instead

### Legacy Handler Functions (Lines 122-368)
**Purpose**: Main handler functions for legacy document operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Document operation results using legacy interface
**Notes**: **DEPRECATED** - Comprehensive document operations replaced by modular tools

### listDocumentsHandler (Lines 122-150)
**Purpose**: **DEPRECATED** Legacy handler for document listing operations
**Parameters**: MongoDB query, limit, and collection parameters
**Returns**: Document list with legacy formatting
**Notes**: **REPLACED BY**: document/listDocuments.ts

### getDocumentByIdHandler (Lines 152-180)
**Purpose**: **DEPRECATED** Legacy handler for document retrieval by ID
**Parameters**: Document ID and collection parameters
**Returns**: Single document with legacy formatting
**Notes**: **REPLACED BY**: document/getDocument.ts

### listDocumentsByCoordinateHandler (Lines 182-210)
**Purpose**: **DEPRECATED** Legacy handler for coordinate-based document filtering
**Parameters**: Bimba coordinate, limit, and collection parameters
**Returns**: Coordinate-filtered documents with legacy formatting
**Notes**: **REPLACED BY**: document/listDocuments.ts with coordinate filtering

### storeDocumentHandler (Lines 212-280)
**Purpose**: **DEPRECATED** Legacy handler for document storage operations
**Parameters**: Document content, metadata, and storage parameters
**Returns**: Storage confirmation with legacy formatting
**Notes**: **REPLACED BY**: document/storeDocument.ts

### deleteDocumentHandler (Lines 282-368)
**Purpose**: **DEPRECATED** Legacy handler for document deletion operations
**Parameters**: Document ID and deletion parameters
**Returns**: Deletion confirmation with legacy formatting
**Notes**: **REPLACED BY**: document/deleteDocument.ts

## Data Flow
**DEPRECATED DATA FLOW** - Use modular document tools instead:
1. **Legacy Request**: Client request → Legacy validation → Legacy processing → Legacy response
2. **Migration Path**: Legacy tools → Modular tools → Enhanced functionality → Future compatibility

## Configuration
### Legacy Configuration
- **Backward Compatibility**: Maintained for systems still using legacy interface
- **Migration Support**: Gradual transition to modular document tools
- **Deprecation Warning**: Clear deprecation notices and migration guidance

### Migration Configuration
- **Modular Replacement**: All functionality available in document/ directory
- **Enhanced Features**: Improved error handling, validation, and functionality in new tools
- **Future Removal**: Planned removal in future version after migration period

## Known Issues
### Deprecation Issues
- **DEPRECATED**: This entire file is deprecated and will be removed
- **Legacy Interface**: Uses outdated interface patterns and error handling
- **Limited Features**: Missing advanced features available in modular tools
- **Migration Required**: Systems should migrate to modular document tools

### Migration Path
- **listDocuments**: Use document/listDocuments.ts
- **getDocument**: Use document/getDocument.ts
- **storeDocument**: Use document/storeDocument.ts
- **deleteDocument**: Use document/deleteDocument.ts
- **updateDocument**: Use document/updateDocument.ts (new feature)
- **startDocumentAnalysis**: Use document/startDocumentAnalysis.ts (new feature)

## Testing
**DEPRECATED** - Testing should focus on modular document tools in document/ directory

## Related Files
### Replacement Files (Use These Instead)
- **document/listDocuments.ts**: Modern document listing with enhanced features
- **document/getDocument.ts**: Modern document retrieval with improved error handling
- **document/storeDocument.ts**: Modern document storage with validation
- **document/updateDocument.ts**: Modern document updates (new feature)
- **document/deleteDocument.ts**: Modern document deletion with safety checks
- **document/startDocumentAnalysis.ts**: Modern document analysis (new feature)

### Legacy Dependencies
- **MongoDB**: Document database operations
- **Zod**: Schema validation
- **MCP SDK**: Error handling

## Development Notes
- **DEPRECATED**: This file is deprecated and maintained only for backward compatibility
- **Migration Required**: All systems should migrate to modular document tools in document/ directory
- **Enhanced Functionality**: Modular tools provide improved error handling, validation, and features
- **Future Removal**: This file will be removed in a future version after migration period
- **Backward Compatibility**: Maintained temporarily to support legacy systems during migration
- **No New Development**: No new features or improvements should be made to this file
- **Documentation Purpose**: Documented for historical reference and migration guidance
- **BPMCP Evolution**: Part of BPMCP architecture evolution toward modular tool design
