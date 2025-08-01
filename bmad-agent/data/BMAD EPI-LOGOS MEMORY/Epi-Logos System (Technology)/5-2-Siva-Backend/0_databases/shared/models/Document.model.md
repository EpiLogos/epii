# Document.model.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/shared/models/Document.model.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
MongoDB Document Model defining comprehensive schema for Epii documents supporting both raw documents (bimba) and crystallization documents (pratibimba). Provides sophisticated metadata management including analysis status, Notion integration, version control, LightRAG integration, and Bimba coordinate tracking. Serves as the primary data model for all document operations in the system.

## System Integration
### Imports
- **mongoose**: MongoDB ODM for schema definition and model creation

### Exports
- **Document**: Default export - Mongoose model for document operations

### Dependencies
- **MongoDB**: Database storage for document persistence
- **Mongoose ODM**: Object-document mapping and schema validation

### Dependents
- **BPMCP Service**: Primary consumer for document operations
- **Documents Controller**: Business logic layer using document model
- **Analysis Pipeline**: Document analysis and processing
- **LightRAG Integration**: Document ingestion and chunking

## Key Functions/Components
### documentMetadataSchema (Lines 10-129)
**Purpose**: Comprehensive metadata schema for document analysis, crystallization, and integration
**Parameters**: Schema definition object
**Returns**: Mongoose schema for document metadata
**Notes**: 129 lines defining sophisticated metadata structure with analysis, Notion, and LightRAG integration

### documentSchema (Lines 132-184)
**Purpose**: Main document schema with core fields and metadata embedding
**Parameters**: Schema definition object
**Returns**: Mongoose schema for documents
**Returns**: Complete document model with indexing
**Notes**: Core document structure with embedded metadata schema

### Document Model (Lines 189-191)
**Purpose**: Mongoose model creation for document operations
**Parameters**: Schema and model name
**Returns**: Mongoose Document model
**Notes**: Exported model for database operations

### Schema Indexing (Lines 186-187)
**Purpose**: Database indexes for efficient querying
**Parameters**: Index definitions
**Returns**: Database indexes
**Notes**: Compound indexes for userId, documentType, and createdAt

## Data Flow
1. **Document Creation**: Schema validation → Document creation → Database storage → Index updates
2. **Document Retrieval**: Query execution → Index utilization → Document fetching → Metadata population
3. **Document Updates**: Update validation → Version control → Metadata updates → Database persistence
4. **Analysis Integration**: Analysis results → Metadata updates → Status tracking → Notion sync
5. **LightRAG Integration**: Content ingestion → Chunk tracking → Status updates → Coordinate association

## Configuration
### Document Types
- **bimba**: Raw documents (original content)
- **pratibimba**: Crystallization documents (processed/refined content)

### Core Schema Fields
- **title**: Document title (required, string)
- **textContent**: Main document content (required, string)
- **content**: Deprecated field for backward compatibility
- **userId**: User identifier (required, indexed)
- **documentType**: bimba or pratibimba (required, indexed)
- **targetCoordinate**: Bimba coordinate (indexed, nullable)
- **metadata**: Embedded metadata schema

### Metadata Structure
- **Analysis**: Status, results, extracted mappings, variations
- **Crystallization**: Original document references, crystallization tracking
- **Notion Integration**: Sync status, page references, update payloads
- **Version Control**: Version numbers, previous versions, deprecation
- **LightRAG**: Ingestion status, chunk tracking, content hashing

### Status Enumerations
- **Analysis Status**: pending, processing, completed, failed
- **Document Status**: draft, analyzed, ready_for_notion, sent_to_notion, deprecated
- **Notion Status**: draft, synced, failed
- **LightRAG Status**: pending, processing, completed, failed, deprecated, skipped

### Database Indexes
- **Primary Index**: userId + documentType + createdAt (descending)
- **Coordinate Index**: targetCoordinate for efficient coordinate-based queries
- **User Index**: userId for user-specific document retrieval
- **Type Index**: documentType for type-specific operations

## Testing
No explicit test files referenced, but includes comprehensive schema validation and constraints

## Related Files
### Core Dependencies
- **MongoDB**: Database storage and persistence
- **Mongoose ODM**: Schema validation and model operations

### Integration Points
- **BPMCP Service**: Primary consumer for document CRUD operations
- **Documents Controller**: Business logic layer using document model
- **Analysis Pipeline**: Document analysis and metadata updates
- **Notion Integration**: Document synchronization and crystallization

### Data Processing
- **LightRAG Integration**: Document ingestion and chunk management
- **Version Control**: Document versioning and deprecation management
- **Crystallization**: Document refinement and transformation tracking

## Development Notes
- **Dual Document Types**: Supports both bimba (raw) and pratibimba (crystallized) documents
- **Comprehensive Metadata**: Rich metadata structure supporting multiple integration points
- **Version Control**: Sophisticated versioning with deprecation and supersession tracking
- **Analysis Integration**: Complete analysis workflow support with status tracking
- **Notion Synchronization**: Full Notion integration with sync status and payload tracking
- **LightRAG Integration**: Document ingestion with chunk tracking and content hashing
- **Backward Compatibility**: Deprecated content field maintained for compatibility
- **Performance Optimization**: Strategic indexing for efficient querying
- **Coordinate Integration**: Bimba coordinate support for spatial document organization
- **Status Management**: Comprehensive status tracking across all document workflows
- **Crystallization Support**: Complete crystallization workflow with source tracking
- **Error Handling**: Enumerated status values for robust error handling
- **Scalability**: Designed for large-scale document management with efficient indexing
