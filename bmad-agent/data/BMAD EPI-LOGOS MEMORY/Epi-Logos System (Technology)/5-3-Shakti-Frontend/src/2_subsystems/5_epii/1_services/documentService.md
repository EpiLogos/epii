# documentService.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/documentService.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Document Service for MongoDB operations providing comprehensive document management with caching, batch loading, and AG-UI event integration. Abstracts API calls to the backend, implements intelligent caching strategies, handles large document collections with batching, and emits AG-UI events for real-time updates. Serves as the primary document data access layer for the Epii subsystem.

## System Integration
### Imports
- **Document Cache Service**: documentCacheService for performance optimization
- **WebSocket Service**: sendWebSocketMessage for AG-UI event emission

### Exports
- **documentService**: Main service object with all document operations
- **Document CRUD Operations**: Create, read, update, delete functionality
- **Batch Loading**: Intelligent batch processing for large collections
- **Cache Management**: Performance optimization with caching strategies

### Dependencies
- **Backend API**: BPMCP tool calls for MongoDB operations
- **Document Cache Service**: Caching layer for performance
- **WebSocket Service**: Real-time event emission
- **Environment Variables**: VITE_BACKEND_URL for API endpoint

### Dependents
- **Document Canvas**: Primary consumer for document operations
- **Universal Document State**: Document state management integration
- **Epii Components**: All components requiring document data
- **Analysis Workflows**: Document analysis and processing

## Key Functions/Components
### documentServiceImpl Object (Lines 42-1059)
**Purpose**: Main service implementation with comprehensive document operations
**Parameters**: Various operation-specific parameters
**Returns**: Service object with all document methods
**Notes**: 1059 lines implementing complete document service functionality

### emitDocumentServiceEvent(eventType, documentData) (Lines 12-35)
**Purpose**: AG-UI event emission helper for document service operations
**Parameters**: eventType (string), documentData (any)
**Returns**: Promise<void>
**Notes**: Emits AG-UI events with Bimba coordinate metadata and error handling

### getAllDocuments(collection) (Lines 48-81)
**Purpose**: Get all documents directly from MongoDB without caching
**Parameters**: collection (string, default: 'Documents')
**Returns**: Promise<any[]> - Array of documents
**Notes**: Direct API call with error handling, returns empty array on failure

### getAllDocumentsBatched(collection, batchSize, excludeFields) (Lines 90-200)
**Purpose**: Get documents in batches to avoid WebSocket payload size limits
**Parameters**: collection (string), batchSize (number), excludeFields (string[])
**Returns**: Promise<any[]> - All documents loaded in batches
**Notes**: Intelligent batch sizing, field exclusion for performance optimization

### getDocumentById(documentId, collection, useCache) (Lines 250-350)
**Purpose**: Get single document by ID with optional caching
**Parameters**: documentId (string), collection (string), useCache (boolean)
**Returns**: Promise<any> - Document object or null
**Notes**: Cache integration, fallback to API on cache miss

### createDocument(documentData, collection) (Lines 400-500)
**Purpose**: Create new document in MongoDB with AG-UI event emission
**Parameters**: documentData (object), collection (string)
**Returns**: Promise<any> - Created document
**Notes**: Validates data, emits creation events, updates cache

### updateDocument(documentId, updates, collection) (Lines 550-650)
**Purpose**: Update existing document with change tracking
**Parameters**: documentId (string), updates (object), collection (string)
**Returns**: Promise<any> - Updated document
**Notes**: Partial updates, cache invalidation, AG-UI event emission

### deleteDocument(documentId, collection) (Lines 700-800)
**Purpose**: Delete document from MongoDB with cleanup
**Parameters**: documentId (string), collection (string)
**Returns**: Promise<boolean> - Success status
**Notes**: Cache cleanup, AG-UI event emission, error handling

## Data Flow
1. **Document Retrieval**: API call → BPMCP tool → MongoDB query → Cache update → Return data
2. **Batch Loading**: Batch parameters → Multiple API calls → Data aggregation → Performance optimization
3. **Document Creation**: Validation → API call → MongoDB insert → Cache update → AG-UI event
4. **Document Updates**: Change detection → API call → MongoDB update → Cache invalidation → Event emission
5. **Document Deletion**: API call → MongoDB delete → Cache cleanup → AG-UI event → Cleanup

## Configuration
### Environment Variables
- **VITE_BACKEND_URL**: Backend API endpoint (default: http://localhost:3001)

### Batch Loading Settings
- **Default Batch Size**: 50 for regular documents, 10 for pratibimba documents
- **Field Exclusion**: Automatic exclusion of metadata and versions for large documents
- **Collection-Specific**: Intelligent defaults based on collection type

### Caching Configuration
- **Cache Integration**: Optional caching with documentCacheService
- **Cache Invalidation**: Automatic cache updates on document changes
- **Performance Optimization**: Reduces redundant API calls

### AG-UI Event Settings
- **Event Types**: Document creation, update, deletion events
- **Metadata**: Bimba coordinates, QL stage, context frame
- **Error Handling**: Non-blocking event emission with fallback

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../../shared/services/documentCacheService.ts` - Document caching layer
- `../../../epi-logos-system/3_services/webSocketService.ts` - WebSocket communication

### Integration Points
- **Document Canvas**: Primary consumer for document operations
- **Universal Document State**: State management integration
- **Backend API**: BPMCP tool calls for MongoDB operations

### Data Flow
- **MongoDB**: Backend database for document storage
- **Cache Layer**: Performance optimization with caching
- **AG-UI Events**: Real-time event emission for frontend updates

## Development Notes
- **Epii Subsystem**: Document service within Epii subsystem architecture
- **Performance Optimization**: Intelligent batching and caching strategies
- **Error Resilience**: Comprehensive error handling with graceful degradation
- **AG-UI Integration**: Real-time event emission for frontend synchronization
- **Collection Awareness**: Different strategies for different document collections
- **Cache Management**: Automatic cache invalidation and updates
- **Payload Optimization**: Field exclusion and batch sizing for large documents
- **API Abstraction**: Clean abstraction over backend BPMCP tool calls
- **Type Safety**: TypeScript integration with comprehensive type handling
- **Memory Management**: Efficient handling of large document collections
