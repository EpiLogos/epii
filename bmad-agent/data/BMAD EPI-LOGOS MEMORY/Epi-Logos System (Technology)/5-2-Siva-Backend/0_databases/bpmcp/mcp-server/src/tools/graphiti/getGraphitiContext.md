# getGraphitiContext.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/getGraphitiContext.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Context Retrieval Tool providing comprehensive dynamic context aggregation for Bimba coordinates from temporal knowledge graph for the BPMCP server. Handles multi-dimensional context assembly combining entities, relationships, episodes, and temporal patterns with coordinate-aware memory retrieval. Serves as the primary contextual intelligence layer within the BPMCP Graphiti ecosystem enabling holistic knowledge synthesis, coordinate-based memory access, and comprehensive temporal context understanding across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: GetGraphitiContextSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **getGraphitiContextTool**: Tool definition for MCP tool registration
- **handleGetGraphitiContext**: Main handler function for context retrieval operations

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for comprehensive context data
- **Schema Validation**: GetGraphitiContextSchema for input validation
- **Error Handling**: Centralized error handling for context operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Bimba Coordinate System**: Coordinate-based context aggregation and memory retrieval

### Dependents
- **Knowledge Synthesis**: Knowledge-based operations requiring comprehensive context capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring holistic temporal knowledge graph context
- **Memory Systems**: Systems requiring coordinate-based memory retrieval and context assembly

## Key Functions/Components
### getGraphitiContextTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for Graphiti context retrieval operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 197 lines implementing comprehensive temporal knowledge graph context retrieval

### handleGetGraphitiContext Function (Lines 21-197)
**Purpose**: Main handler function for comprehensive Graphiti context retrieval
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Comprehensive context data with entities, relationships, episodes, and temporal patterns
**Notes**: Advanced context assembly with multi-dimensional knowledge synthesis and coordinate awareness

### Input Validation (Lines 23-28)
**Purpose**: Validates input arguments against GetGraphitiContextSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring coordinate and context depth parameters integrity

### Context Query Logging (Lines 27-28)
**Purpose**: Logs context retrieval details for monitoring and debugging
**Parameters**: Bimba coordinate and context depth parameters
**Returns**: Comprehensive logging for context tracking
**Notes**: Detailed logging with coordinate awareness and depth parameter tracking

### Graphiti Client Integration (Lines 30-45)
**Purpose**: Integrates with Graphiti temporal knowledge graph for context retrieval
**Parameters**: Context query parameters and Graphiti client configuration
**Returns**: Multi-dimensional context data from Graphiti
**Notes**: Temporal knowledge graph integration with coordinate-aware context assembly

### Entity Context Assembly (Lines 47-70)
**Purpose**: Assembles entity-based context for the specified coordinate
**Parameters**: Coordinate filter and entity context parameters
**Returns**: Entity context data with coordinate associations
**Notes**: Entity-focused context assembly with relationship mapping

### Relationship Context Processing (Lines 72-95)
**Purpose**: Processes relationship context and connection patterns
**Parameters**: Relationship data and context depth configuration
**Returns**: Relationship context with connection analysis and temporal patterns
**Notes**: Advanced relationship context processing with temporal awareness

### Episode Context Integration (Lines 97-120)
**Purpose**: Integrates episode-based temporal context for comprehensive understanding
**Parameters**: Episode data and temporal context parameters
**Returns**: Episode context with temporal patterns and coordinate associations
**Notes**: Temporal episode context integration with coordinate-aware processing

### Context Synthesis (Lines 122-150)
**Purpose**: Synthesizes multi-dimensional context into comprehensive knowledge representation
**Parameters**: Entity, relationship, and episode context data
**Returns**: Synthesized comprehensive context with holistic knowledge representation
**Notes**: Advanced context synthesis with multi-dimensional knowledge integration

### Temporal Pattern Analysis (Lines 152-175)
**Purpose**: Analyzes temporal patterns and trends within the assembled context
**Parameters**: Temporal context data and pattern analysis configuration
**Returns**: Temporal pattern insights and trend analysis
**Notes**: Advanced temporal pattern analysis with coordinate-aware processing

### Context Optimization (Lines 177-190)
**Purpose**: Optimizes context data for efficient delivery and processing
**Parameters**: Comprehensive context data and optimization parameters
**Returns**: Optimized context data with efficient structure and reduced redundancy
**Notes**: Context optimization with performance considerations and data efficiency

### Response Formatting (Lines 192-197)
**Purpose**: Formats comprehensive context response for client consumption
**Parameters**: Optimized context data and metadata
**Returns**: Formatted response with comprehensive context and temporal intelligence
**Notes**: Structured response format for client consumption with full contextual intelligence

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Context Assembly**: Coordinate processing → Multi-dimensional context retrieval → Entity/relationship/episode assembly
3. **Graphiti Integration**: Enhanced queries → Temporal knowledge graph access → Context data retrieval → Result validation
4. **Context Synthesis**: Raw context → Multi-dimensional synthesis → Temporal pattern analysis → Context optimization
5. **Response Delivery**: Comprehensive context → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "getGraphitiContext" for MCP tool identification
- **Description**: Comprehensive description of temporal knowledge graph context retrieval
- **Input Schema**: GetGraphitiContextSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Context Configuration
- **Context Assembly**: Multi-dimensional context aggregation and synthesis
- **Coordinate Processing**: Bimba coordinate-based context retrieval and memory access
- **Context Depth**: Configurable context depth for comprehensive or focused retrieval
- **Temporal Integration**: Temporal pattern analysis and trend identification

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and comprehensive context querying
- **Context Processing**: Multi-dimensional context formatting and synthesis
- **Coordinate System**: Bimba coordinate integration for context-aware memory retrieval
- **Temporal Management**: Temporal pattern analysis and contextual intelligence

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: GetGraphitiContextSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Graphiti Tools Ecosystem
- **./searchGraphitiEntities.ts**: Entity search and discovery for context assembly
- **./searchGraphitiFacts.ts**: Fact search and relationship discovery for context
- **./addGraphitiEpisode.ts**: Episode creation and temporal content addition
- **./getGraphitiEpisodes.ts**: Episode retrieval and temporal context access
- **./graphitiUtils.ts**: Advanced utility operations and graph management

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for comprehensive context data
- **MCP Server**: Tool registration and execution
- **Client Applications**: Context retrieval requests and responses
- **Memory Systems**: Coordinate-based memory retrieval and contextual intelligence

## Development Notes
- **Comprehensive Context**: Advanced multi-dimensional context assembly with temporal intelligence
- **Coordinate-Aware Memory**: Sophisticated Bimba coordinate-based memory retrieval and context synthesis
- **Temporal Intelligence**: Rich temporal pattern analysis and contextual understanding
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for context operations and Graphiti issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable context retrieval suitable for production knowledge operations
- **Development Support**: Clear context operations and Graphiti integration for development
- **Extensible Design**: Easy addition of new context features and synthesis capabilities
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
