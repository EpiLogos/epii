# searchPratibimbaContext.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/pratibimba/searchPratibimbaContext.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pratibimba Context Search Tool providing semantic vector search capabilities for the Pratibimba vector store within the BPMCP server. Handles natural language queries with embedding generation, similarity search, threshold filtering, and metadata inclusion for comprehensive context retrieval. Serves as the primary vector search layer within the BPMCP Pratibimba ecosystem enabling intelligent semantic search, context discovery, and knowledge retrieval across all vector-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: SearchPratibimbaContextSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **searchPratibimbaContextTool**: Tool definition for MCP tool registration
- **handleSearchPratibimbaContext**: Main handler function for Pratibimba context search operations

### Dependencies
- **Qdrant Client**: Vector database client through ToolDependencies for vector search integration
- **Embeddings Service**: Embedding generation service for query vectorization
- **Schema Validation**: SearchPratibimbaContextSchema for input validation
- **Error Handling**: Centralized error handling for vector search operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Context Operations**: Context-based operations requiring semantic search capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring vector-based context retrieval functionality
- **Knowledge Systems**: Systems requiring semantic search and context discovery

## Key Functions/Components
### searchPratibimbaContextTool Definition (Lines 8-12)
**Purpose**: Defines the MCP tool for Pratibimba context search operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 95 lines implementing comprehensive Pratibimba context search with vector integration

### handleSearchPratibimbaContext Function (Lines 20-95)
**Purpose**: Main handler function for Pratibimba context search operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Vector search results with semantic similarity and metadata
**Notes**: Advanced vector search with embedding generation, similarity filtering, and context retrieval

### Input Validation (Lines 22-29)
**Purpose**: Validates input arguments against SearchPratibimbaContextSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring query, limit, collection, and threshold integrity

### Search Logging (Lines 28-29)
**Purpose**: Logs Pratibimba search details for monitoring and debugging
**Parameters**: Query string and limit information
**Returns**: Comprehensive logging for vector search tracking
**Notes**: Detailed logging with query awareness and parameter tracking

### Query Embedding Generation (Lines 31-45)
**Purpose**: Generates vector embeddings for natural language queries
**Parameters**: Query string and embedding service configuration
**Returns**: Vector embeddings for semantic search
**Notes**: Advanced embedding generation with service integration and vectorization

### Vector Search Execution (Lines 47-65)
**Purpose**: Executes vector similarity search in Pratibimba vector store
**Parameters**: Query embeddings, collection, limit, and threshold
**Returns**: Vector search results with similarity scores
**Notes**: Qdrant vector database integration with similarity threshold filtering

### Collection Management (Lines 50-55)
**Purpose**: Manages Qdrant collection targeting for vector search
**Parameters**: Collection specification and database configuration
**Returns**: Collection reference for vector operations
**Notes**: Flexible collection targeting with optional collection specification

### Similarity Filtering (Lines 57-70)
**Purpose**: Filters vector search results based on similarity threshold
**Parameters**: Search results, threshold, and filtering configuration
**Returns**: Filtered results meeting similarity criteria
**Notes**: Advanced similarity filtering with configurable threshold (0-1, default 0.7)

### Metadata Processing (Lines 72-85)
**Purpose**: Processes and includes metadata in search results when enabled
**Parameters**: Search results, metadata inclusion flags, and processing configuration
**Returns**: Enhanced results with metadata information
**Notes**: Optional metadata inclusion with comprehensive result enhancement

### Response Formatting (Lines 87-95)
**Purpose**: Formats Pratibimba context search response for client consumption
**Parameters**: Processed results, metadata, and operation information
**Returns**: Formatted response with semantic search results and context information
**Notes**: Structured response format for client consumption with comprehensive vector search data

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Query Processing**: Natural language query → Embedding generation → Vector preparation → Search preparation
3. **Vector Search**: Qdrant integration → Collection targeting → Similarity search → Threshold filtering
4. **Result Processing**: Search results → Similarity filtering → Metadata processing → Response enhancement
5. **Response Delivery**: Formatted results → Client delivery → Operation completion → Search tracking

## Configuration
### Tool Configuration
- **Tool Name**: "searchPratibimbaContext" for MCP tool identification
- **Description**: Clear description of Pratibimba context search functionality
- **Input Schema**: SearchPratibimbaContextSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Search Configuration
- **Vector Search**: Semantic similarity search with embedding-based queries
- **Collection Targeting**: Optional collection specification for focused search
- **Result Limiting**: Configurable result limits (1-100, default 10) for performance
- **Similarity Threshold**: Configurable threshold (0-1, default 0.7) for quality control

### Vector Integration Configuration
- **Qdrant Integration**: Direct Qdrant vector database integration through dependencies
- **Embedding Service**: Embedding generation service for query vectorization
- **Metadata Support**: Optional metadata inclusion for enhanced results
- **Performance Optimization**: Threshold filtering and result limiting for optimal performance

## Testing
No explicit test files referenced, but includes comprehensive input validation and vector search operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: SearchPratibimbaContextSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling

### Pratibimba Tools Ecosystem
- **./schemas.ts**: Schema definitions for Pratibimba tools validation
- **./index.ts**: Pratibimba tools module exports and organization

### Integration Points
- **Qdrant Database**: Vector database integration and similarity search
- **Embeddings Service**: Query vectorization and embedding generation
- **MCP Server**: Tool registration and execution
- **Client Applications**: Context search requests and semantic search responses
- **Knowledge Systems**: Vector-based context discovery and semantic search integration

## Development Notes
- **Semantic Search**: Advanced vector search with embedding-based natural language queries
- **Vector Integration**: Direct Qdrant integration with comprehensive vector database operations
- **Similarity Control**: Configurable similarity threshold for search quality management
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for vector operations and database issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable vector search suitable for production knowledge operations
- **Development Support**: Clear vector operations and semantic search for development
- **Extensible Design**: Easy addition of new vector search features and embedding capabilities
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
