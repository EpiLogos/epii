# getGraphitiEpisodes.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/getGraphitiEpisodes.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Episode Retrieval Tool providing temporal knowledge graph episode access capabilities for the BPMCP server. Handles episode queries with Bimba coordinate filtering, group management, and temporal context retrieval with comprehensive error handling. Serves as the primary temporal knowledge graph episode access layer within the BPMCP tool ecosystem enabling episode discovery, temporal analysis, and knowledge graph exploration across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: GetGraphitiEpisodesSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **getGraphitiEpisodesTool**: Tool definition for MCP tool registration
- **handleGetGraphitiEpisodes**: Main handler function for episode retrieval operations

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for episode storage and retrieval
- **Schema Validation**: GetGraphitiEpisodesSchema for input validation
- **Error Handling**: Centralized error handling for retrieval operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Bimba Coordinate System**: Coordinate-based filtering and context management

### Dependents
- **Knowledge Exploration**: Knowledge-based operations requiring episode access capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring temporal knowledge graph episode access
- **Temporal Analysis**: Systems requiring episode temporal context and analysis

## Key Functions/Components
### getGraphitiEpisodesTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for Graphiti episode retrieval operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 134 lines implementing comprehensive temporal knowledge graph episode retrieval

### handleGetGraphitiEpisodes Function (Lines 21-134)
**Purpose**: Main handler function for Graphiti episode retrieval operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Episode retrieval results with temporal context and coordinate associations
**Notes**: Comprehensive episode retrieval with Bimba coordinate filtering and temporal awareness

### Input Validation (Lines 23-25)
**Purpose**: Validates input arguments against GetGraphitiEpisodesSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring query parameters and coordinate integrity

### Episode Query Logging (Lines 27-31)
**Purpose**: Logs episode retrieval details for monitoring and debugging
**Parameters**: Validated group ID, coordinate filter, and result limit
**Returns**: Comprehensive logging for episode tracking
**Notes**: Detailed logging with coordinate awareness and query parameter tracking

### Graphiti Client Integration (Lines 33-55)
**Purpose**: Integrates with Graphiti temporal knowledge graph for episode retrieval
**Parameters**: Query parameters and Graphiti client configuration
**Returns**: Episode retrieval results from Graphiti
**Notes**: Temporal knowledge graph integration with coordinate-aware filtering

### Episode Data Processing (Lines 57-80)
**Purpose**: Processes and formats episode data with temporal context
**Parameters**: Raw Graphiti episode results and metadata
**Returns**: Enhanced episode data with temporal and coordinate context
**Notes**: Episode enhancement with coordinate integration and temporal context

### Coordinate Filtering (Lines 82-100)
**Purpose**: Applies Bimba coordinate filtering to episode results
**Parameters**: Episode results and coordinate filter criteria
**Returns**: Filtered episodes matching coordinate criteria
**Notes**: Coordinate-based filtering for context-aware episode discovery

### Temporal Context Processing (Lines 102-120)
**Purpose**: Processes temporal context and relationships for episodes
**Parameters**: Episode data and temporal information
**Returns**: Episodes with enhanced temporal context
**Notes**: Temporal processing with coordinate-aware context management

### Response Formatting (Lines 122-134)
**Purpose**: Formats successful episode retrieval response for client
**Parameters**: Processed episode results and metadata
**Returns**: Formatted response with episodes, temporal context, and coordinate associations
**Notes**: Structured response format for client consumption with full temporal context

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Query Processing**: Query parameters → Coordinate filtering → Group management → Retrieval preparation
3. **Graphiti Retrieval**: Enhanced query → Temporal knowledge graph search → Episode retrieval → Result validation
4. **Episode Processing**: Raw episodes → Temporal context → Coordinate filtering → Context enhancement
5. **Response Delivery**: Formatted episodes → Response structuring → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "getGraphitiEpisodes" for MCP tool identification
- **Description**: Comprehensive description of temporal knowledge graph episode retrieval
- **Input Schema**: GetGraphitiEpisodesSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Retrieval Configuration
- **Episode Access**: Temporal knowledge graph episode discovery and retrieval
- **Coordinate Filtering**: Bimba coordinate-based result filtering
- **Group Management**: Episode group organization and filtering
- **Temporal Context**: Temporal awareness and context processing

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and episode querying
- **Episode Processing**: Episode result formatting and temporal context extraction
- **Coordinate System**: Bimba coordinate integration for context-aware retrieval
- **Temporal Management**: Temporal context analysis and episode organization

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: GetGraphitiEpisodesSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for episode storage and retrieval
- **MCP Server**: Tool registration and execution
- **Client Applications**: Episode retrieval requests and responses
- **Knowledge Systems**: Temporal knowledge exploration and episode analysis

### Tool Architecture
- **Episode Retrieval**: Primary temporal knowledge graph episode access
- **Coordinate Integration**: Bimba coordinate system integration for context filtering
- **Temporal Processing**: Episode temporal context analysis and processing
- **Knowledge Graph Exploration**: Comprehensive knowledge graph episode management

## Development Notes
- **Temporal Knowledge Graph**: Comprehensive Graphiti integration for temporal episode retrieval
- **Coordinate-Aware Filtering**: Advanced Bimba coordinate filtering for context-aware discovery
- **Episode Enhancement**: Rich episode data enhancement with temporal and coordinate context
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for Graphiti operations and retrieval issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable episode retrieval suitable for production knowledge operations
- **Development Support**: Clear episode retrieval operations and Graphiti integration for development
- **Extensible Design**: Easy addition of new retrieval features and temporal processing
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
