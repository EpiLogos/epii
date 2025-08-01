# searchGraphitiEntities.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/searchGraphitiEntities.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Entity Search Tool providing temporal knowledge graph entity search capabilities for the BPMCP server. Handles entity queries with Bimba coordinate filtering, relationship context, and temporal awareness with comprehensive result processing. Serves as the primary temporal knowledge graph interface within the BPMCP tool ecosystem enabling entity discovery, relationship exploration, and temporal context analysis across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: SearchGraphitiEntitiesSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **searchGraphitiEntitiesTool**: Tool definition for MCP tool registration
- **handleSearchGraphitiEntities**: Main handler function for entity search operations

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for entity storage and retrieval
- **Schema Validation**: SearchGraphitiEntitiesSchema for input validation
- **Error Handling**: Centralized error handling for search operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Bimba Coordinate System**: Coordinate-based filtering and context management

### Dependents
- **Knowledge Operations**: Knowledge-based operations requiring entity search capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring temporal knowledge graph access
- **Context Analysis**: Systems requiring entity relationship and temporal context

## Key Functions/Components
### searchGraphitiEntitiesTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for Graphiti entity search operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 123 lines implementing comprehensive temporal knowledge graph entity search

### handleSearchGraphitiEntities Function (Lines 21-123)
**Purpose**: Main handler function for Graphiti entity search operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Entity search results with temporal context and relationships
**Notes**: Comprehensive entity search with Bimba coordinate filtering and temporal awareness

### Input Validation (Lines 23-24)
**Purpose**: Validates input arguments against SearchGraphitiEntitiesSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring search query and coordinate integrity

### Search Query Processing (Lines 25-30)
**Purpose**: Processes search query with Bimba coordinate filtering
**Parameters**: Validated search query, coordinate filter, and node limits
**Returns**: Processed query parameters for Graphiti search
**Notes**: Query logging with coordinate-aware filtering and result limiting

### Graphiti Client Integration (Lines 32-50)
**Purpose**: Integrates with Graphiti temporal knowledge graph for entity search
**Parameters**: Search parameters and Graphiti client configuration
**Returns**: Raw entity search results from Graphiti
**Notes**: Temporal knowledge graph search with coordinate-based filtering

### Entity Result Processing (Lines 52-80)
**Purpose**: Processes and formats entity search results with relationships
**Parameters**: Raw Graphiti search results and metadata
**Returns**: Formatted entity results with relationship context
**Notes**: Entity formatting, relationship extraction, and temporal context processing

### Coordinate Filtering (Lines 82-95)
**Purpose**: Applies Bimba coordinate filtering to entity results
**Parameters**: Entity results and coordinate filter criteria
**Returns**: Filtered entities matching coordinate criteria
**Notes**: Coordinate-based filtering for context-aware entity discovery

### Relationship Context (Lines 97-110)
**Purpose**: Extracts and formats entity relationship context
**Parameters**: Entity data and relationship information
**Returns**: Relationship context with temporal awareness
**Notes**: Relationship mapping and temporal context extraction

### Response Formatting (Lines 112-123)
**Purpose**: Formats successful entity search response for client
**Parameters**: Processed entity results and metadata
**Returns**: Formatted response with entities, relationships, and temporal context
**Notes**: Structured response format for client consumption with full context

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Search Processing**: Search query → Coordinate filtering → Graphiti search → Result retrieval
3. **Entity Processing**: Raw entities → Relationship extraction → Temporal context → Coordinate filtering
4. **Context Analysis**: Entity relationships → Temporal awareness → Context formatting → Response preparation
5. **Response Delivery**: Formatted entities → Response structuring → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "searchGraphitiEntities" for MCP tool identification
- **Description**: Comprehensive description of temporal knowledge graph entity search
- **Input Schema**: SearchGraphitiEntitiesSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Search Configuration
- **Entity Search**: Temporal knowledge graph entity discovery
- **Coordinate Filtering**: Bimba coordinate-based result filtering
- **Relationship Context**: Entity relationship extraction and formatting
- **Temporal Awareness**: Temporal context analysis and processing

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and querying
- **Entity Processing**: Entity result formatting and relationship extraction
- **Coordinate System**: Bimba coordinate integration for context-aware search
- **Temporal Context**: Temporal awareness and context analysis

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: SearchGraphitiEntitiesSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for entity storage and retrieval
- **MCP Server**: Tool registration and execution
- **Client Applications**: Entity search requests and responses
- **Knowledge Systems**: Temporal knowledge analysis and entity relationship exploration

### Tool Architecture
- **Entity Search**: Primary temporal knowledge graph entity discovery
- **Coordinate Integration**: Bimba coordinate system integration for context filtering
- **Relationship Processing**: Entity relationship extraction and context analysis
- **Temporal Awareness**: Temporal context analysis and processing

## Development Notes
- **Temporal Knowledge Graph**: Comprehensive Graphiti integration for temporal entity search
- **Coordinate-Aware Filtering**: Advanced Bimba coordinate filtering for context-aware discovery
- **Relationship Context**: Rich entity relationship extraction and temporal context analysis
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for Graphiti operations and search issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable entity search suitable for production knowledge operations
- **Development Support**: Clear entity search operations and Graphiti integration for development
- **Extensible Design**: Easy addition of new search features and relationship processing
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
