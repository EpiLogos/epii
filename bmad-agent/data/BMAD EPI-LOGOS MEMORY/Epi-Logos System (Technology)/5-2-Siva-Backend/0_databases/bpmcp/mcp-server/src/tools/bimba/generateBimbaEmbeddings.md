# generateBimbaEmbeddings.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/generateBimbaEmbeddings.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Generate Bimba Embeddings Tool providing automated embedding generation for nodes in the Bimba graph database through MCP (Model Context Protocol). Creates vector embeddings for nodes lacking them to enable semantic search capabilities with configurable batch processing and label filtering. Serves as the primary embedding generation interface within the BPMCP server architecture for maintaining comprehensive vector search functionality across the Bimba coordinate system.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Bimba Schemas**: GenerateBimbaEmbeddingsSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **generateBimbaEmbeddingsTool**: Tool definition with name, description, and input schema
- **handleGenerateBimbaEmbeddings**: Main handler function for embedding generation operations

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Embedding Service**: AI embedding generation service from dependencies
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for embedding generation operations
- **Vector Search Systems**: Systems requiring comprehensive embedding coverage
- **Semantic Search**: bimbaKnowing tool requiring embeddings for similarity search
- **Graph Maintenance**: Systems maintaining vector search capabilities

## Key Functions/Components
### generateBimbaEmbeddingsTool Definition (Lines 8-12)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: 161 lines implementing automated embedding generation for graph nodes

### handleGenerateBimbaEmbeddings Function (Lines 20-161)
**Purpose**: Main handler function executing embedding generation for nodes without embeddings
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with generation statistics and metadata
**Notes**: Comprehensive embedding generation with batch processing and filtering

### Input Validation (Lines 23-30)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to GenerateBimbaEmbeddingsSchema
**Notes**: Strict validation ensures proper batch size and filtering parameters

### Node Discovery Query (Lines 35-55)
**Purpose**: Discovers nodes in the graph that lack embedding vectors
**Parameters**: Label filter and batch limit parameters
**Returns**: List of nodes requiring embedding generation
**Notes**: Efficient query to identify nodes missing embeddings

### Batch Processing (Lines 57-95)
**Purpose**: Processes nodes in batches for efficient embedding generation
**Parameters**: Node batches and processing configuration
**Returns**: Batch processing results and statistics
**Notes**: Optimized batch processing prevents memory overflow and API rate limiting

### Embedding Generation (Lines 97-125)
**Purpose**: Generates vector embeddings using AI embedding service
**Parameters**: Node content and embedding service configuration
**Returns**: Generated vector embeddings for nodes
**Notes**: Integrates with external embedding service for vector generation

### Database Updates (Lines 127-145)
**Purpose**: Updates Neo4j database with generated embeddings
**Parameters**: Node IDs and generated embedding vectors
**Returns**: Database update results and statistics
**Notes**: Efficient batch updates to store embeddings in graph database

### Progress Tracking (Lines 147-161)
**Purpose**: Tracks and reports embedding generation progress
**Parameters**: Processing statistics and progress metrics
**Returns**: Progress reports and completion statistics
**Notes**: Comprehensive progress tracking for long-running embedding generation

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Configuration extraction
2. **Node Discovery**: Database query → Node identification → Filtering application → Batch preparation
3. **Batch Processing**: Node batches → Content extraction → Embedding generation → Vector creation
4. **Database Updates**: Generated embeddings → Batch updates → Database storage → Statistics collection
5. **Progress Reporting**: Processing statistics → Progress tracking → Completion reporting → Response return

## Configuration
### Tool Configuration
- **Tool Name**: "generateBimbaEmbeddings" for MCP tool registration
- **Description**: Clear description of embedding generation capabilities
- **Input Schema**: GenerateBimbaEmbeddingsSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Batch Processing Configuration
- **Default Limit**: 100 nodes per batch for optimal processing
- **Label Filtering**: Optional label filtering for targeted embedding generation
- **Batch Size**: Configurable batch size for memory and performance optimization
- **Progress Tracking**: Comprehensive progress reporting for long operations

### Embedding Service Configuration
- **Service Integration**: Integration with external embedding service
- **Vector Dimensions**: Configurable embedding vector dimensions
- **Content Processing**: Node content extraction and preparation for embedding
- **Rate Limiting**: Handling of API rate limits and service constraints

### Database Configuration
- **Batch Updates**: Efficient batch update operations for embedding storage
- **Transaction Management**: Proper transaction handling for data consistency
- **Index Management**: Integration with vector index for search optimization
- **Performance Optimization**: Optimized database operations for large-scale updates

## Testing
No explicit test files referenced, but includes comprehensive error handling and progress tracking for robust embedding generation

## Related Files
### Core Dependencies
- **./schemas.js**: GenerateBimbaEmbeddingsSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for embedding generation operations
- **Neo4j Database**: Direct integration with Bimba graph database
- **Embedding Service**: Integration with AI embedding generation service
- **Vector Search Systems**: Systems requiring comprehensive embedding coverage

### Tool Architecture
- **Embedding Generation**: Automated vector embedding creation for graph nodes
- **Batch Processing**: Efficient batch processing for large-scale operations
- **Database Integration**: Seamless integration with Neo4j for embedding storage
- **Progress Tracking**: Comprehensive progress reporting and statistics

## Development Notes
- **Automated Processing**: Fully automated embedding generation for nodes lacking vectors
- **Batch Optimization**: Efficient batch processing prevents memory overflow and API constraints
- **Service Integration**: Seamless integration with external embedding services
- **Performance Focus**: Optimized for large-scale embedding generation operations
- **Progress Transparency**: Comprehensive progress tracking and reporting for long operations
- **Database Efficiency**: Optimized database operations for embedding storage and retrieval
- **Vector Search Support**: Enables comprehensive semantic search capabilities
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Resource Management**: Efficient resource usage and cleanup for large operations
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
