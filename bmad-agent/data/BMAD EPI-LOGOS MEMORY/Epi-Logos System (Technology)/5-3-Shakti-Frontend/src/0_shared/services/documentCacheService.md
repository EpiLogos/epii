# documentCacheService.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/shared/services/documentCacheService.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal Document Cache Service providing caching for document fetching to reduce redundant API calls and improve performance. Implements TTL-based caching with coordinate-based indexing, ID normalization, and comprehensive cache management. Moved from subsystem-specific to universal service layer for system-wide document caching capabilities.

## System Integration
### Imports
- **TypeScript Interfaces**: CachedDocument, DocumentCache for type safety

### Exports
- **CachedDocument**: Interface for cached document structure
- **documentCacheService**: Main service object with caching methods

### Dependencies
- **In-Memory Storage**: Map-based cache storage for performance
- **TTL Management**: Time-based cache invalidation
- **ID Normalization**: MongoDB ID format handling

### Dependents
- **Document Service**: Primary consumer for document caching
- **WebSocket Service**: Cache invalidation on document updates
- **Universal Document State**: Document state management integration
- **All Document Operations**: Performance optimization across system

## Key Functions/Components
### documentCacheService Object (Lines 53-552)
**Purpose**: Main service object providing comprehensive document caching functionality
**Parameters**: Various method-specific parameters
**Returns**: Service object with caching methods
**Notes**: 552 lines implementing complete document caching system

### getDocumentById(id) (Lines 59-96)
**Purpose**: Get document from cache by ID with ID normalization and TTL validation
**Parameters**: id (string) - Document ID (_id from MongoDB)
**Returns**: CachedDocument | null - Cached document or null if not found
**Notes**: Handles MongoDB ID format, ensures id/_id consistency, TTL validation

### getDocumentsByCoordinate(coordinate, collection) (Lines 104-140)
**Purpose**: Get documents from cache by Bimba coordinate with collection filtering
**Parameters**: coordinate (string), collection (optional string)
**Returns**: CachedDocument[] - Array of cached documents
**Notes**: Standardized cache key format, coordinate-based indexing, collection filtering

### cacheDocument(document) (Lines 200-250)
**Purpose**: Cache single document with coordinate indexing and ID normalization
**Parameters**: document (CachedDocument) - Document to cache
**Returns**: void
**Notes**: Dual indexing by ID and coordinate, timestamp tracking, ID consistency

### cacheDocuments(documents, coordinate, collection) (Lines 300-350)
**Purpose**: Cache multiple documents with coordinate association
**Parameters**: documents (CachedDocument[]), coordinate (string), collection (optional string)
**Returns**: void
**Notes**: Batch caching, coordinate mapping, collection-specific caching

### invalidateDocument(id) (Lines 400-430)
**Purpose**: Invalidate specific document from cache
**Parameters**: id (string) - Document ID to invalidate
**Returns**: void
**Notes**: Removes from both ID and coordinate indexes, cleanup timestamps

### invalidateCoordinate(coordinate, collection) (Lines 450-480)
**Purpose**: Invalidate all documents for specific coordinate
**Parameters**: coordinate (string), collection (optional string)
**Returns**: void
**Notes**: Coordinate-based invalidation, collection-specific cleanup

### hasContent(document) (Lines 147-150)
**Purpose**: Check if document has content in any content field
**Parameters**: document (CachedDocument)
**Returns**: boolean - True if document has content
**Notes**: Checks multiple content field variations

## Data Flow
1. **Cache Lookup**: Document requested → ID/coordinate lookup → TTL validation → Return cached or null
2. **Cache Storage**: Document received → ID normalization → Coordinate indexing → Timestamp recording
3. **Cache Invalidation**: Update event → Specific/coordinate invalidation → Cache cleanup → Memory optimization
4. **Batch Operations**: Multiple documents → Batch processing → Coordinate association → Efficient storage
5. **TTL Management**: Cache access → TTL check → Automatic invalidation → Fresh data request

## Configuration
### Cache Settings
- **Cache TTL**: 5 minutes (300,000 ms) for all cached documents
- **Automatic Invalidation**: TTL-based expiration on access
- **Memory Management**: Map-based storage with cleanup on invalidation

### Cache Structure
- **byId Map**: Document ID → CachedDocument mapping
- **byCoordinate Map**: Coordinate → Document ID array mapping
- **lastFetched Map**: Cache key → Timestamp mapping

### ID Normalization
- **MongoDB Format**: 24-character hexadecimal string handling
- **ID Consistency**: Ensures both id and _id properties exist
- **Backward Compatibility**: Legacy id field support

### Cache Key Format
- **Document Keys**: `doc:${id}` for individual documents
- **Coordinate Keys**: `coord:${coordinate}` or `coord:${coordinate}:${collection}`
- **Standardized Format**: Consistent key naming across all operations

## Testing
No explicit test files referenced, but includes comprehensive validation and error handling

## Related Files
### Core Dependencies
- **Document Service**: Primary consumer for caching functionality
- **WebSocket Service**: Cache invalidation on document updates

### Integration Points
- **Universal Document State**: Document state management integration
- **Document Operations**: All document CRUD operations benefit from caching
- **Performance Optimization**: System-wide document access optimization

### Service Architecture
- **Universal Service**: Moved from subsystem-specific to universal layer
- **In-Memory Caching**: Map-based storage for optimal performance
- **TTL Management**: Automatic cache invalidation and cleanup

## Development Notes
- **Universal Service**: Moved from subsystem-specific to universal layer for system-wide access
- **Performance Optimization**: Reduces redundant API calls with intelligent caching
- **Memory Efficiency**: TTL-based automatic cleanup prevents memory leaks
- **ID Normalization**: Robust handling of MongoDB ID format variations
- **Coordinate Indexing**: Efficient coordinate-based document retrieval
- **Collection Filtering**: Support for collection-specific caching and retrieval
- **Batch Operations**: Optimized batch caching for large document sets
- **Error Resilience**: Graceful handling of malformed IDs and missing documents
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Cache Consistency**: Ensures id/_id property consistency across all operations
