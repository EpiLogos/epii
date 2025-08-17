# bimbaKnowing.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/bimbaKnowing.ts`
**Bimba Coordinate**: `#5-2-0-14`
**Last Updated**: `2025-01-30`

## Purpose & Role
Bimba Knowing Tool providing semantic search and graph traversal for architectural context from the Bimba graph database. Combines vector similarity search with structural graph understanding to deliver intelligent context-aware responses. Serves as the primary knowledge retrieval interface within the BPMCP server architecture with sophisticated embedding-based search, property filtering, and comprehensive result processing for architectural context discovery.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Neo4j Driver**: neo4j for database connectivity and session management
- **Bimba Schemas**: BimbaKnowingSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **bimbaKnowingTool**: Tool definition with name, description, and input schema
- **handleBimbaKnowing**: Main handler function for semantic search operations
- **filterNodeProperties**: Utility function for property filtering

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Vector Search**: Neo4j vector similarity search capabilities
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for semantic search operations
- **Analysis Pipeline**: Systems requiring architectural context discovery
- **Frontend Search**: Components needing intelligent context retrieval
- **Knowledge Discovery**: Systems exploring architectural relationships

## Key Functions/Components
### filterNodeProperties Function (Lines 16-24)
**Purpose**: Filters out unnecessary properties from node properties for cleaner responses
**Parameters**: properties (Record<string, any>) - Raw node properties
**Returns**: Filtered properties excluding embedding, timestamps, and technical metadata
**Notes**: 792 lines implementing comprehensive semantic search and graph traversal

### bimbaKnowingTool Definition (Lines 27-31)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: Semantic search and graph traversal tool for architectural context

### handleBimbaKnowing Function (Lines 35-792)
**Purpose**: Main handler function executing semantic search with graph traversal
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with semantic search results and architectural context
**Notes**: Comprehensive semantic search handler with vector similarity and structural understanding

### Input Validation (Lines 45-60)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to BimbaKnowingSchema
**Notes**: Strict validation ensures search integrity and parameter correctness

### Vector Search Execution (Lines 65-200)
**Purpose**: Executes vector similarity search against Neo4j vector index
**Parameters**: Search query, similarity threshold, and result limits
**Returns**: Vector search results with similarity scores
**Notes**: Advanced vector search with embedding-based similarity matching

### Graph Traversal (Lines 202-350)
**Purpose**: Performs structural graph traversal from vector search results
**Parameters**: Initial search results and traversal parameters
**Returns**: Extended results with structural relationships
**Notes**: Combines vector similarity with graph structure for comprehensive context

### Result Processing (Lines 352-500)
**Purpose**: Processes and formats search results with property filtering
**Parameters**: Raw search results and formatting options
**Returns**: Formatted results with filtered properties and metadata
**Notes**: Comprehensive result processing with property filtering and context enhancement

### Similarity Scoring (Lines 502-600)
**Purpose**: Calculates and applies similarity scoring for result ranking
**Parameters**: Search results and scoring parameters
**Returns**: Scored and ranked results based on relevance
**Notes**: Advanced scoring combining vector similarity with structural relevance

### Context Enhancement (Lines 602-700)
**Purpose**: Enhances results with additional architectural context
**Parameters**: Base results and context enhancement parameters
**Returns**: Enhanced results with architectural relationships and context
**Notes**: Adds structural context and architectural relationships to search results

### Response Formatting (Lines 702-792)
**Purpose**: Formats final response with comprehensive result structure
**Parameters**: Enhanced results and formatting options
**Returns**: Standardized MCP response with semantic search results
**Notes**: Comprehensive response formatting with metadata and context information

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Search parameter extraction
2. **Vector Search**: Query embedding → Vector similarity search → Initial result collection → Similarity scoring
3. **Graph Traversal**: Initial results → Structural traversal → Relationship discovery → Context enhancement
4. **Result Processing**: Raw results → Property filtering → Context enhancement → Similarity ranking
5. **Response Formatting**: Processed results → Response formatting → Metadata addition → MCP response return

## Configuration
### Tool Configuration
- **Tool Name**: "bimbaKnowing" for MCP tool registration
- **Description**: Semantic search and graph traversal for architectural context
- **Input Schema**: BimbaKnowingSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Vector Search Configuration
- **Similarity Threshold**: Configurable similarity threshold for vector matching
- **Result Limits**: Maximum number of results to return from vector search
- **Embedding Dimensions**: Vector embedding dimensions for similarity calculation
- **Index Configuration**: Neo4j vector index configuration and optimization

### Property Filtering Configuration
- **Excluded Properties**: Properties to exclude from responses (embedding, timestamps, technical metadata)
- **Property Whitelist**: Essential properties to include in responses
- **Filtering Rules**: Rules for property inclusion/exclusion based on context
- **Response Optimization**: Property filtering for cleaner, more relevant responses

### Graph Traversal Configuration
- **Traversal Depth**: Maximum depth for structural graph traversal
- **Relationship Types**: Types of relationships to follow during traversal
- **Context Expansion**: Rules for expanding architectural context
- **Structural Relevance**: Scoring for structural relationships and context

## Testing
No explicit test files referenced, but includes comprehensive error handling and validation for robust semantic search operation

## Related Files
### Core Dependencies
- **./schemas.js**: BimbaKnowingSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for semantic search operations
- **Neo4j Database**: Direct integration with Bimba graph database and vector index
- **MCP Server**: Integration with Model Context Protocol server
- **Analysis Pipeline**: Integration with architectural analysis systems

### Tool Architecture
- **Semantic Search**: Vector similarity search with embedding-based matching
- **Graph Traversal**: Structural graph exploration for context discovery
- **Property Filtering**: Intelligent property filtering for clean responses
- **Context Enhancement**: Architectural context discovery and enhancement

## Development Notes
- **Semantic Intelligence**: Advanced semantic search combining vector similarity with structural understanding
- **Vector Search Integration**: Deep integration with Neo4j vector search capabilities
- **Property Management**: Intelligent property filtering for cleaner, more relevant responses
- **Graph Traversal**: Sophisticated graph traversal for architectural context discovery
- **Performance Optimization**: Efficient vector search and graph traversal with result caching
- **Context Awareness**: Architectural context enhancement for comprehensive understanding
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Validation Framework**: Strict input validation ensures search integrity
- **Resource Management**: Efficient Neo4j session management and vector index usage
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture for intelligent knowledge discovery
