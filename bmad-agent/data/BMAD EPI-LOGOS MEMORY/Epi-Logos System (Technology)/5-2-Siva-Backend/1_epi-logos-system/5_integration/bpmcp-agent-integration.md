# bpmcp-agent-integration.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/5_integration/bpmcp-agent-integration.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
BPMCP Agent Integration connecting the universal agent orchestrator to BPMCP knowledge operations. Provides comprehensive knowledge base integration with caching, tool discovery, and sophisticated query capabilities. Serves as the primary interface between the Epi-Logos Agent and the BPMCP knowledge system with performance optimization and error resilience.

## System Integration
### Imports
- **BPWebSocketClient**: WebSocket client for BPMCP server communication

### Exports
- **BPMCPAgentIntegration**: Main integration class for BPMCP knowledge operations

### Dependencies
- **BPMCP Server**: Knowledge base server with graph operations
- **BPWebSocketClient**: WebSocket communication layer
- **Knowledge Cache**: In-memory caching for performance optimization

### Dependents
- **Epi-Logos Orchestrator**: Primary consumer for knowledge-based orchestration
- **Universal Orchestration Pipeline**: Knowledge integration in workflows
- **Agent Services**: Knowledge queries for intelligent decision making

## Key Functions/Components
### BPMCPAgentIntegration Class (Lines 8-389)
**Purpose**: Main integration class providing BPMCP knowledge operations with caching
**Parameters**: None (constructor)
**Returns**: BPMCPAgentIntegration instance
**Notes**: 389 lines implementing comprehensive knowledge integration functionality

### initialize() (Lines 20-42)
**Purpose**: Initialize BPMCP connection for agent with tool discovery
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Establishes WebSocket connection, discovers available tools, handles connection errors

### discoverAvailableTools() (Lines 47-71)
**Purpose**: Discover available BPMCP tools with fallback to known tools
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Queries BPMCP server for tools, falls back to default known tools on failure

### queryBimbaGraph(query, options) (Lines 76-109)
**Purpose**: Query Bimba graph with caching and comprehensive options
**Parameters**: query (string), options (object) with limit, relationships, filters
**Returns**: Promise<Object> - Graph query results
**Notes**: Cached queries with 5-minute timeout, comprehensive error handling

### bimbaKnowing(query, options) (Lines 114-148)
**Purpose**: Bimba knowing (semantic search) with caching and performance optimization
**Parameters**: query (string), options (object) with topK, threshold, coordinates
**Returns**: Promise<Object> - Semantic search results
**Notes**: Cached semantic search with configurable parameters and coordinate filtering

### generateBimbaEmbeddings(content, options) (Lines 150-200)
**Purpose**: Generate embeddings for content using BPMCP embedding service
**Parameters**: content (string), options (object) with coordinate context
**Returns**: Promise<Object> - Generated embeddings
**Notes**: Content embedding generation with coordinate context integration

### manageBimbaRelationships(operation, data) (Lines 250-300)
**Purpose**: Manage Bimba graph relationships with CRUD operations
**Parameters**: operation (string), data (object) with relationship information
**Returns**: Promise<Object> - Relationship operation results
**Notes**: Comprehensive relationship management with validation and error handling

### clearCache() (Lines 350-360)
**Purpose**: Clear knowledge cache for fresh queries
**Parameters**: None
**Returns**: void
**Notes**: Cache management for memory optimization and fresh data retrieval

### isToolAvailable(toolName) (Lines 365-367)
**Purpose**: Check if specific BPMCP tool is available
**Parameters**: toolName (string)
**Returns**: boolean - Tool availability status
**Notes**: Tool availability checking for conditional functionality

### disconnect() (Lines 370-389)
**Purpose**: Disconnect from BPMCP server and cleanup resources
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Clean disconnection with resource cleanup and state management

## Data Flow
1. **Initialization**: Agent start → BPMCP connection → Tool discovery → Ready state
2. **Knowledge Query**: Query request → Cache check → BPMCP call → Result caching → Response
3. **Semantic Search**: Search query → Cache check → Embedding generation → Semantic matching → Results
4. **Graph Operations**: Graph query → Coordinate filtering → Relationship inclusion → Cached results
5. **Relationship Management**: Operation request → Validation → BPMCP execution → Result confirmation

## Configuration
### Connection Settings
- **Client Name**: 'epi-logos-agent'
- **Client Version**: '1.0.0'
- **Cache Timeout**: 5 minutes (300,000ms)
- **WebSocket Connection**: Persistent connection with reconnection handling

### Available Tools
- **queryBimbaGraph**: Graph database queries with coordinate filtering
- **bimbaKnowing**: Semantic search with embedding-based matching
- **generateBimbaEmbeddings**: Content embedding generation
- **manageBimbaRelationships**: Graph relationship CRUD operations

### Query Options
#### Graph Query Options
- **limit**: Maximum results (default: 10)
- **includeRelationships**: Include relationship data (default: true)
- **coordinateFilter**: Filter by Bimba coordinates
- **Custom Options**: Extensible options for specific queries

#### Semantic Search Options
- **topK**: Top K results (default: 5)
- **threshold**: Similarity threshold (default: 0.7)
- **includeCoordinates**: Include coordinate information (default: true)
- **coordinateFilter**: Filter by coordinate context

### Cache Management
- **Cache Key Format**: Tool-specific prefixes with query serialization
- **Cache Timeout**: 5-minute expiration for fresh data
- **Memory Management**: Map-based caching with timestamp tracking
- **Cache Clearing**: Manual cache clearing for fresh queries

## Testing
No explicit test files referenced, but includes comprehensive error handling and fallback mechanisms

## Related Files
### Core Dependencies
- **../../databases/bpmcp/bpWebSocketClient.mjs**: WebSocket communication layer
- **BPMCP Server**: Knowledge base server with graph operations

### Integration Points
- **Epi-Logos Orchestrator**: Primary consumer for knowledge-based orchestration
- **Universal Orchestration Pipeline**: Knowledge integration in workflows
- **Agent Services**: Knowledge queries for intelligent decision making

### Knowledge Architecture
- **Graph Database**: Bimba graph with coordinate-based organization
- **Semantic Search**: Embedding-based knowledge retrieval
- **Relationship Management**: Graph relationship operations and maintenance

## Development Notes
- **Performance Optimization**: Comprehensive caching with 5-minute timeout for frequent queries
- **Error Resilience**: Robust error handling with fallback mechanisms for tool discovery
- **Tool Discovery**: Dynamic tool discovery with fallback to known tools
- **Cache Management**: Intelligent caching with timestamp-based expiration
- **Connection Management**: Persistent WebSocket connection with proper cleanup
- **Coordinate Integration**: Deep integration with Bimba coordinate system
- **Semantic Capabilities**: Advanced semantic search with configurable parameters
- **Relationship Operations**: Comprehensive graph relationship management
- **Extensible Design**: Easy addition of new BPMCP tools and capabilities
- **Memory Efficiency**: Proper cache management to prevent memory leaks
