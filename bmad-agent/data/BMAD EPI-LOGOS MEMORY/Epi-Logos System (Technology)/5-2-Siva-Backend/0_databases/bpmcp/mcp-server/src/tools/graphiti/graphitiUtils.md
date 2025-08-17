# graphitiUtils.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/graphiti/graphitiUtils.ts`
**Bimba Coordinate**: `#5-2-0-36`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graphiti Utilities Collection providing comprehensive temporal knowledge graph management and administrative capabilities for the BPMCP server. Handles advanced graph operations including episode deletion, entity edge management, graph clearing, and status monitoring with comprehensive error handling. Serves as the primary administrative and maintenance layer within the BPMCP Graphiti ecosystem enabling graph lifecycle management, relationship administration, and system monitoring across all knowledge-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: DeleteGraphitiEpisodeSchema, DeleteGraphitiEntityEdgeSchema, GetGraphitiEntityEdgeSchema, ClearGraphitiGraphSchema, GetGraphitiStatusSchema for input validation
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **Graphiti Client**: GraphitiClient for temporal knowledge graph operations

### Exports
- **deleteGraphitiEpisodeTool**: Tool definition for episode deletion operations
- **deleteGraphitiEntityEdgeTool**: Tool definition for entity edge deletion operations
- **getGraphitiEntityEdgeTool**: Tool definition for entity edge retrieval operations
- **clearGraphitiGraphTool**: Tool definition for graph clearing operations
- **getGraphitiStatusTool**: Tool definition for system status monitoring
- **handleDeleteGraphitiEpisode**: Handler function for episode deletion
- **handleDeleteGraphitiEntityEdge**: Handler function for entity edge deletion
- **handleGetGraphitiEntityEdge**: Handler function for entity edge retrieval
- **handleClearGraphitiGraph**: Handler function for graph clearing
- **handleGetGraphitiStatus**: Handler function for status monitoring

### Dependencies
- **Graphiti Knowledge Graph**: Temporal knowledge graph for administrative operations
- **Schema Validation**: Multiple schemas for different utility operations
- **Error Handling**: Centralized error handling for administrative operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **Administrative Systems**: Graph management and monitoring capabilities

### Dependents
- **Graph Administration**: Administrative operations requiring graph management capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring graph administrative functionality
- **Monitoring Systems**: Systems requiring graph status and health monitoring

## Key Functions/Components
### Tool Definitions (Lines 15-45)
**Purpose**: Defines multiple MCP tools for various Graphiti utility operations
**Parameters**: Tool names, descriptions, and input schemas for each utility
**Returns**: Tool definitions for MCP registration
**Notes**: 332 lines implementing comprehensive temporal knowledge graph utilities

### handleDeleteGraphitiEpisode Function (Lines 47-85)
**Purpose**: Deletes episodes from temporal knowledge graph by UUID
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Episode deletion result with confirmation
**Notes**: Episode deletion with UUID validation and comprehensive error handling

### handleDeleteGraphitiEntityEdge Function (Lines 87-125)
**Purpose**: Deletes entity edges (relationships) from temporal knowledge graph by UUID
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Entity edge deletion result with relationship cleanup
**Notes**: Relationship deletion with UUID validation and graph integrity maintenance

### handleGetGraphitiEntityEdge Function (Lines 127-165)
**Purpose**: Retrieves entity edges (relationships) from temporal knowledge graph by UUID
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Entity edge data with relationship details and metadata
**Notes**: Relationship retrieval with UUID validation and comprehensive edge information

### handleClearGraphitiGraph Function (Lines 167-205)
**Purpose**: Clears entire temporal knowledge graph with safety confirmations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Graph clearing result with operation confirmation
**Notes**: Complete graph clearing with safety checks and comprehensive confirmation

### handleGetGraphitiStatus Function (Lines 207-245)
**Purpose**: Retrieves temporal knowledge graph system status and health information
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: System status with health metrics and operational information
**Notes**: Comprehensive status monitoring with health checks and system metrics

### UUID Validation (Lines 50-55, 90-95, 130-135)
**Purpose**: Validates UUID parameters for episode and entity edge operations
**Parameters**: UUID strings from validated arguments
**Returns**: Valid UUIDs for Graphiti operations
**Notes**: Consistent UUID validation across all utility operations

### Graph Integrity Checks (Lines 170-185)
**Purpose**: Performs graph integrity checks before destructive operations
**Parameters**: Graph state and operation parameters
**Returns**: Integrity validation results and safety confirmations
**Notes**: Safety checks for graph clearing and destructive operations

### Status Metrics Collection (Lines 210-230)
**Purpose**: Collects comprehensive system status and health metrics
**Parameters**: System monitoring parameters and metric collection configuration
**Returns**: Detailed status metrics and health information
**Notes**: Comprehensive system monitoring with performance and health metrics

### Error Recovery (Lines 247-280)
**Purpose**: Handles error recovery and rollback for failed administrative operations
**Parameters**: Error objects and operation context
**Returns**: Error recovery results and rollback confirmations
**Notes**: Comprehensive error recovery with operation rollback capabilities

### Administrative Logging (Lines 282-310)
**Purpose**: Provides comprehensive logging for all administrative operations
**Parameters**: Operation details, results, and administrative context
**Returns**: Detailed administrative logs for monitoring and auditing
**Notes**: Extensive logging for administrative operations and system monitoring

### Response Formatting (Lines 312-332)
**Purpose**: Formats administrative operation responses for client consumption
**Parameters**: Operation results and administrative metadata
**Returns**: Formatted responses with operation confirmations and system information
**Notes**: Structured response format for administrative operations with comprehensive details

## Data Flow
1. **Request Reception**: Client request → Tool identification → Input validation → Schema validation → Parameter extraction
2. **Administrative Processing**: Operation type → Safety checks → Graph integrity validation → Operation preparation
3. **Graphiti Operations**: Administrative commands → Temporal knowledge graph operations → Result validation → Confirmation
4. **Status Monitoring**: System queries → Health checks → Metric collection → Status compilation
5. **Response Delivery**: Operation results → Response formatting → Client response → Operation completion

## Configuration
### Tool Configuration
- **Multiple Tools**: Five distinct administrative tools with specific functionality
- **Tool Names**: "deleteGraphitiEpisode", "deleteGraphitiEntityEdge", "getGraphitiEntityEdge", "clearGraphitiGraph", "getGraphitiStatus"
- **Input Schemas**: Specific schemas for each administrative operation
- **MCP Compliance**: Full Model Context Protocol compliance for all tools

### Administrative Configuration
- **Episode Management**: Episode deletion and lifecycle management
- **Relationship Management**: Entity edge creation, deletion, and retrieval
- **Graph Management**: Complete graph clearing and administrative operations
- **Status Monitoring**: System health monitoring and status reporting

### Graphiti Integration Configuration
- **Knowledge Graph**: Temporal knowledge graph access and administrative operations
- **Administrative Processing**: Graph management and maintenance operations
- **System Monitoring**: Health checks and status monitoring
- **Safety Systems**: Graph integrity checks and operation safety validation

## Testing
No explicit test files referenced, but includes comprehensive input validation and Graphiti administrative operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: Multiple schemas for different utility operations
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **./client.js**: GraphitiClient for temporal knowledge graph operations

### Graphiti Tools Ecosystem
- **./searchGraphitiEntities.ts**: Entity search and discovery
- **./searchGraphitiFacts.ts**: Fact search and relationship discovery
- **./addGraphitiEpisode.ts**: Episode creation and temporal content addition
- **./getGraphitiEpisodes.ts**: Episode retrieval and temporal context access
- **./getGraphitiContext.ts**: Comprehensive context retrieval for coordinates

### Integration Points
- **Graphiti Knowledge Graph**: Temporal knowledge graph for administrative operations
- **MCP Server**: Tool registration and execution for multiple administrative tools
- **Client Applications**: Administrative operation requests and responses
- **Monitoring Systems**: System status monitoring and health reporting

## Development Notes
- **Comprehensive Utilities**: Multiple administrative tools in single file for related functionality
- **Administrative Excellence**: Advanced graph management and maintenance capabilities
- **Safety Systems**: Comprehensive safety checks and graph integrity validation
- **Input Validation**: Robust input validation with multiple Zod schemas
- **Error Handling**: Comprehensive error handling for administrative operations and Graphiti issues
- **MCP Compliance**: Full Model Context Protocol compliance for all administrative tools
- **Production Ready**: Robust administrative utilities suitable for production graph management
- **Development Support**: Clear administrative operations and comprehensive system monitoring
- **Extensible Design**: Easy addition of new administrative features and monitoring capabilities
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
