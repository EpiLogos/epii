# bpMCP.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/bpMCP.service.mjs`
**Bimba Coordinate**: `#5-2-0-5`
**Last Updated**: `2025-01-30`

## Purpose & Role
Central service layer for accessing the Bimba-Pratibimba MCP (Model Context Protocol) server. Provides a unified interface for all BPMCP tool operations including graph queries, document management, Notion integration, and analysis pipeline orchestration. Acts as the primary bridge between the backend application and the BPMCP MCP server.

## System Integration
### Imports
- **bpWebSocketClient.mjs**: WebSocket client for BPMCP server communication
- **document.utils.mjs**: Document standardization and processing utilities
- **documentCache.utils.mjs**: Document caching utilities
- **epii_analysis_pipeline_refactored.mjs**: Analysis pipeline execution

### Exports
- **BPMCPService (singleton)**: Main service instance with comprehensive BPMCP tool access

### Dependencies
- **BPMCP MCP Server**: Core dependency for all tool operations
- **MongoDB**: Document storage and retrieval
- **Neo4j**: Graph database operations via BPMCP
- **Notion API**: Content crystallization via BPMCP
- **Qdrant**: Vector search operations via BPMCP

### Dependents
- **All Backend Controllers**: Use this service for BPMCP operations
- **Analysis Pipeline**: Primary interface for document analysis
- **Route Handlers**: API endpoints rely on this service
- **Frontend Components**: Indirect dependency through API calls

## Key Functions/Components
### BPMCPService Constructor (Lines 7-11)
**Purpose**: Initialize service with document cache
**Parameters**: None
**Returns**: BPMCPService instance
**Notes**: Creates in-memory Map for document caching

### callTool(toolName, args) (Lines 18-20)
**Purpose**: Generic tool calling interface to BPMCP server
**Parameters**: toolName (string), args (object)
**Returns**: Promise<any> - Tool execution result
**Notes**: Core method that all other methods build upon

### queryBimbaGraph(query, params) (Lines 37-39)
**Purpose**: Execute Cypher queries against Neo4j graph database
**Parameters**: query (string), params (object)
**Returns**: Promise<any> - Query results
**Notes**: Primary interface for graph database operations

### bimbaKnowing(query, contextDepth, focusCoordinate, agentCoordinate, limit) (Lines 118-139)
**Purpose**: Architectural context retrieval using semantic search and graph traversal
**Parameters**: query (string), contextDepth (number), focusCoordinate (string), agentCoordinate (string), limit (number)
**Returns**: Promise<any> - Architectural context data
**Notes**: Core knowledge retrieval method with hexagonal structure awareness (default limit: 6)

### crystallizeToNotion(options) (Lines 207-252)
**Purpose**: Crystallize content to Notion pages with structured block support
**Parameters**: options (object) with targetBimbaCoordinate, contentBlocks/contentToAppend, title, properties
**Returns**: Promise<any> - Crystallization results
**Notes**: Supports both new structured blocks and legacy content formats

### getDocumentById(documentId, collection, useCache) (Lines 310-367)
**Purpose**: Retrieve document with caching and content standardization
**Parameters**: documentId (string), collection (string), useCache (boolean)
**Returns**: Promise<any> - Standardized document with textContent property
**Notes**: Handles content standardization and caching logic

### startDocumentAnalysis(documentId, targetCoordinate, graphData) (Lines 510-679)
**Purpose**: Orchestrate complete document analysis pipeline
**Parameters**: documentId (string), targetCoordinate (string), graphData (object)
**Returns**: Promise<any> - Analysis initiation confirmation
**Notes**: Runs full pipeline (-5 through -0 stages) with comprehensive error handling

## Data Flow
1. **Tool Calls**: Service methods → callTool() → bpWebSocketClient → BPMCP MCP Server
2. **Document Analysis**: startDocumentAnalysis() → getDocumentById() → runPipeline() → updateDocument()
3. **Caching**: Document retrieval → cache check → BPMCP call → cache storage → return result
4. **Error Handling**: Pipeline errors → document status updates → error propagation

## Configuration
### Cache Settings
- **Document Cache**: In-memory Map for document caching
- **Cache Keys**: Document IDs as cache keys
- **Cache Validation**: useCache parameter controls caching behavior

### Analysis Pipeline Settings
- **Default User**: 'admin' for analysis operations
- **Pipeline Stages**: Full pipeline (-5 through -0)
- **Error Tracking**: Analysis status stored in document metadata

### Tool Parameters
- **Integer Conversion**: Automatic conversion for Neo4j compatibility
- **Default Limits**: Hexagonal structure awareness (limit: 6)
- **Context Depth**: 1-3 hops for graph traversal

## Testing
No explicit test files referenced, but includes comprehensive logging for debugging

## Related Files
### Core Dependencies
- `bpWebSocketClient.mjs` - WebSocket communication layer
- `../utils/document.utils.mjs` - Document standardization utilities
- `../utils/documentCache.utils.mjs` - Caching utilities

### Pipeline Integration
- `../pipelines/epii_analysis_pipeline_refactored.mjs` - Analysis pipeline execution
- `../../subsystems/5_epii/` - Epii subsystem integration

### Database Services
- `../neo4j/neo4j.service.mjs` - Direct Neo4j operations
- `../mongodb/mongo.service.mjs` - MongoDB operations
- `../notion/notion.service.mjs` - Notion operations

## Development Notes
- **Singleton Pattern**: Exported as singleton instance for consistent state
- **Backward Compatibility**: crystallizeToNotion supports legacy function signatures
- **Error Resilience**: Comprehensive error handling with status tracking
- **Content Standardization**: Ensures textContent property consistency
- **Async Pipeline**: Analysis runs asynchronously with promise tracking
- **Cache Strategy**: Simple in-memory caching with optional bypass
- **Integer Handling**: Automatic conversion for Neo4j integer compatibility
