# addGraphitiEpisode.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/addGraphitiEpisode.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Episode Addition Tool providing temporal knowledge graph episode creation capabilities for the BPMCP server. Handles episode insertion with Bimba coordinate integration, source tracking, and temporal context processing with comprehensive error handling. Serves as the primary temporal knowledge graph content ingestion layer within the BPMCP tool ecosystem enabling episode creation, knowledge graph population, and temporal context management across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: AddGraphitiEpisodeSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **addGraphitiEpisodeTool**: Tool definition for MCP tool registration
- **handleAddGraphitiEpisode**: Main handler function for episode addition operations

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for episode storage and processing
- **Schema Validation**: AddGraphitiEpisodeSchema for input validation
- **Error Handling**: Centralized error handling for episode operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Bimba Coordinate System**: Coordinate-based context and metadata management

### Dependents
- **Knowledge Ingestion**: Knowledge-based operations requiring episode creation capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring temporal knowledge graph content addition
- **Context Management**: Systems requiring Bimba coordinate integration and temporal context

## Key Functions/Components
### addGraphitiEpisodeTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for Graphiti episode addition operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 107 lines implementing comprehensive temporal knowledge graph episode creation

### handleAddGraphitiEpisode Function (Lines 21-107)
**Purpose**: Main handler function for Graphiti episode addition operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Episode creation result with temporal context and processing status
**Notes**: Comprehensive episode addition with Bimba coordinate integration and temporal processing

### Input Validation (Lines 23-25)
**Purpose**: Validates input arguments against AddGraphitiEpisodeSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring episode data and coordinate integrity

### Episode Logging (Lines 27-30)
**Purpose**: Logs episode creation details for monitoring and debugging
**Parameters**: Validated episode name, source type, and Bimba coordinate
**Returns**: Comprehensive logging for episode tracking
**Notes**: Detailed logging with coordinate awareness and source tracking

### Graphiti Client Integration (Lines 32-50)
**Purpose**: Integrates with Graphiti temporal knowledge graph for episode creation
**Parameters**: Episode data and Graphiti client configuration
**Returns**: Episode creation result from Graphiti
**Notes**: Temporal knowledge graph integration with coordinate-aware processing

### Episode Data Preparation (Lines 52-70)
**Purpose**: Prepares episode data with Bimba coordinate metadata and temporal context
**Parameters**: Validated episode data and coordinate information
**Returns**: Enhanced episode data with coordinate and temporal metadata
**Notes**: Episode enhancement with coordinate integration and temporal context

### Temporal Processing (Lines 72-85)
**Purpose**: Processes episode for temporal knowledge graph integration
**Parameters**: Enhanced episode data and temporal context
**Returns**: Processed episode ready for knowledge graph insertion
**Notes**: Temporal processing with coordinate-aware context management

### Knowledge Graph Insertion (Lines 87-95)
**Purpose**: Inserts processed episode into Graphiti temporal knowledge graph
**Parameters**: Processed episode data and Graphiti client
**Returns**: Insertion result with episode ID and processing status
**Notes**: Knowledge graph insertion with result validation and error handling

### Response Formatting (Lines 97-107)
**Purpose**: Formats successful episode addition response for client
**Parameters**: Episode creation result and metadata
**Returns**: Formatted response with episode ID and processing confirmation
**Notes**: Structured response format for client consumption with full context

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Episode Preparation**: Episode data → Coordinate integration → Metadata enhancement → Temporal context
3. **Graphiti Processing**: Enhanced episode → Temporal processing → Knowledge graph preparation → Context management
4. **Knowledge Graph Insertion**: Processed episode → Graphiti insertion → Result validation → Processing confirmation
5. **Response Delivery**: Creation result → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "addGraphitiEpisode" for MCP tool identification
- **Description**: Comprehensive description of temporal knowledge graph episode addition
- **Input Schema**: AddGraphitiEpisodeSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Episode Configuration
- **Episode Creation**: Temporal knowledge graph episode insertion
- **Coordinate Integration**: Bimba coordinate metadata and context management
- **Source Tracking**: Episode source type and origin tracking
- **Temporal Context**: Temporal awareness and context processing

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and episode insertion
- **Episode Processing**: Episode data enhancement and temporal processing
- **Coordinate System**: Bimba coordinate integration for context-aware processing
- **Temporal Management**: Temporal context analysis and knowledge graph integration

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: AddGraphitiEpisodeSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for episode storage and processing
- **MCP Server**: Tool registration and execution
- **Client Applications**: Episode addition requests and responses
- **Knowledge Systems**: Temporal knowledge ingestion and context management

### Tool Architecture
- **Episode Creation**: Primary temporal knowledge graph episode insertion
- **Coordinate Integration**: Bimba coordinate system integration for context management
- **Temporal Processing**: Episode temporal context analysis and processing
- **Knowledge Graph Management**: Comprehensive knowledge graph content management

## Development Notes
- **Temporal Knowledge Graph**: Comprehensive Graphiti integration for temporal episode creation
- **Coordinate-Aware Processing**: Advanced Bimba coordinate integration for context management
- **Episode Enhancement**: Rich episode data enhancement with temporal and coordinate context
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for Graphiti operations and episode issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable episode creation suitable for production knowledge operations
- **Development Support**: Clear episode creation operations and Graphiti integration for development
- **Extensible Design**: Easy addition of new episode features and temporal processing
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
