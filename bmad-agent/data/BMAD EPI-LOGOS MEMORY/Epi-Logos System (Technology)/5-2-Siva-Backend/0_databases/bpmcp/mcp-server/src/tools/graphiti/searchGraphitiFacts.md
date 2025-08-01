# searchGraphitiFacts.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/searchGraphitiFacts.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Facts Search Tool providing temporal knowledge graph relationship discovery capabilities for the BPMCP server. Handles fact/relationship queries with Bimba coordinate filtering, entity relationship analysis, and temporal context retrieval with comprehensive error handling. Serves as the primary relationship discovery layer within the BPMCP Graphiti ecosystem enabling fact-based knowledge exploration, relationship analysis, and temporal relationship tracking across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: SearchGraphitiFactsSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **searchGraphitiFactsTool**: Tool definition for MCP tool registration
- **handleSearchGraphitiFacts**: Main handler function for fact search operations

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for fact storage and relationship queries
- **Schema Validation**: SearchGraphitiFactsSchema for input validation
- **Error Handling**: Centralized error handling for search operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Bimba Coordinate System**: Coordinate-based filtering and context management

### Dependents
- **Knowledge Exploration**: Knowledge-based operations requiring relationship discovery capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring temporal knowledge graph fact search
- **Relationship Analysis**: Systems requiring entity relationship exploration and analysis

## Key Functions/Components
### searchGraphitiFactsTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for Graphiti fact search operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 120 lines implementing comprehensive temporal knowledge graph fact search

### handleSearchGraphitiFacts Function (Lines 21-120)
**Purpose**: Main handler function for Graphiti fact search operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Fact search results with relationship data and temporal context
**Notes**: Comprehensive fact search with Bimba coordinate filtering and relationship analysis

### Input Validation (Lines 23-25)
**Purpose**: Validates input arguments against SearchGraphitiFactsSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring query parameters and coordinate integrity

### Search Query Logging (Lines 27-29)
**Purpose**: Logs fact search details for monitoring and debugging
**Parameters**: Search query, coordinate filter, and result limits
**Returns**: Comprehensive logging for fact search tracking
**Notes**: Detailed logging with coordinate awareness and query parameter tracking

### Graphiti Client Integration (Lines 31-50)
**Purpose**: Integrates with Graphiti temporal knowledge graph for fact search
**Parameters**: Search query and Graphiti client configuration
**Returns**: Fact search results from Graphiti
**Notes**: Temporal knowledge graph integration with coordinate-aware filtering

### Fact Data Processing (Lines 52-75)
**Purpose**: Processes and formats fact/relationship data with temporal context
**Parameters**: Raw Graphiti fact results and metadata
**Returns**: Enhanced fact data with temporal and coordinate context
**Notes**: Fact enhancement with coordinate integration and relationship context

### Coordinate Filtering (Lines 77-95)
**Purpose**: Applies Bimba coordinate filtering to fact search results
**Parameters**: Fact results and coordinate filter criteria
**Returns**: Filtered facts matching coordinate criteria
**Notes**: Coordinate-based filtering for context-aware fact discovery

### Relationship Analysis (Lines 97-110)
**Purpose**: Analyzes entity relationships and connection patterns in facts
**Parameters**: Fact data and relationship analysis configuration
**Returns**: Enhanced facts with relationship analysis and connection insights
**Notes**: Advanced relationship analysis with entity connection mapping

### Response Formatting (Lines 112-120)
**Purpose**: Formats successful fact search response for client consumption
**Parameters**: Processed fact results and metadata
**Returns**: Formatted response with facts, relationships, and temporal context
**Notes**: Structured response format for client consumption with full relationship context

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Search Processing**: Search query → Coordinate filtering → Fact search preparation → Query optimization
3. **Graphiti Search**: Enhanced query → Temporal knowledge graph search → Fact retrieval → Result validation
4. **Fact Processing**: Raw facts → Temporal context → Coordinate filtering → Relationship analysis
5. **Response Delivery**: Formatted facts → Response structuring → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "searchGraphitiFacts" for MCP tool identification
- **Description**: Comprehensive description of temporal knowledge graph fact search
- **Input Schema**: SearchGraphitiFactsSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Search Configuration
- **Fact Discovery**: Temporal knowledge graph fact and relationship search
- **Coordinate Filtering**: Bimba coordinate-based result filtering
- **Relationship Analysis**: Entity relationship exploration and connection mapping
- **Temporal Context**: Temporal awareness and context processing

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and fact querying
- **Fact Processing**: Fact result formatting and temporal context extraction
- **Coordinate System**: Bimba coordinate integration for context-aware search
- **Relationship Management**: Entity relationship analysis and connection discovery

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: SearchGraphitiFactsSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Graphiti Tools Ecosystem
- **./searchGraphitiEntities.ts**: Entity search and discovery
- **./addGraphitiEpisode.ts**: Episode creation and temporal content addition
- **./getGraphitiEpisodes.ts**: Episode retrieval and temporal context access
- **./getGraphitiContext.ts**: Comprehensive context retrieval for coordinates
- **./graphitiUtils.ts**: Advanced utility operations and graph management

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for fact storage and relationship queries
- **MCP Server**: Tool registration and execution
- **Client Applications**: Fact search requests and responses
- **Knowledge Systems**: Temporal knowledge exploration and relationship analysis

## Development Notes
- **Temporal Knowledge Graph**: Comprehensive Graphiti integration for temporal fact search
- **Coordinate-Aware Filtering**: Advanced Bimba coordinate filtering for context-aware discovery
- **Relationship Analysis**: Rich fact data enhancement with entity relationship analysis
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for Graphiti operations and search issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable fact search suitable for production knowledge operations
- **Development Support**: Clear fact search operations and Graphiti integration for development
- **Extensible Design**: Easy addition of new search features and relationship analysis
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
