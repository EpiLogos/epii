# index.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/index.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Master Tools Integration Index providing comprehensive tool aggregation and handler management for the entire BPMCP server ecosystem. Handles centralized tool registration, handler mapping, and unified access to all functional tool ecosystems including Bimba, Pratibimba, MongoDB, Notion, Web, Document, Graphiti, and Event tools. Serves as the primary tool orchestration layer within the BPMCP server architecture enabling unified tool access, centralized registration, and comprehensive handler management across all operational domains.

## System Integration
### Imports
- **Types**: Tool, ToolHandler from types/index.js for tool definition and handler typing
- **Bimba Tools**: Complete Bimba coordinate-based operations ecosystem
- **Pratibimba Tools**: Complete vector search and semantic operations ecosystem
- **MongoDB Tools**: Complete database querying and context operations ecosystem
- **Notion Tools**: Complete workspace integration and content management ecosystem
- **Web Tools**: Complete web search and research integration ecosystem
- **Document Tools**: Complete document CRUD and analysis operations ecosystem
- **Graphiti Tools**: Complete temporal knowledge graph operations ecosystem
- **Event Tools**: Real-time WebSocket event broadcasting capabilities

### Exports
- **tools**: Comprehensive array of all tool definitions for MCP server registration
- **handlers**: Complete record mapping tool names to handler functions for execution

### Dependencies
- **All Tool Ecosystems**: Complete dependency on all functional tool ecosystems
- **Tool Type System**: Tool and ToolHandler type definitions for consistency
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **MCP Server**: Primary consumer for tool registration and handler execution
- **Server Setup**: Server initialization and tool registration processes
- **Client Applications**: Indirect dependency through server tool availability
- **Tool Registry**: Complete tool ecosystem access and management

## Key Functions/Components
### Tool Ecosystem Imports (Lines 4-11)
**Purpose**: Imports all functional tool ecosystems for centralized aggregation
**Parameters**: Complete tool ecosystem modules
**Returns**: All tool definitions and handlers from each ecosystem
**Notes**: 114 lines implementing comprehensive master tools integration with complete ecosystem coverage

### Bimba Tools Integration (Lines 16-21)
**Purpose**: Integrates complete Bimba coordinate-based operations ecosystem
**Parameters**: All Bimba tools including knowing, embeddings, graph operations, relationships, and coordinate resolution
**Returns**: Bimba tool definitions for centralized registration
**Notes**: Complete coordinate-based operations with graph management and relationship handling

### Pratibimba Tools Integration (Line 24)
**Purpose**: Integrates complete Pratibimba vector search ecosystem
**Parameters**: Semantic vector search with similarity filtering and metadata support
**Returns**: Pratibimba tool definitions for centralized registration
**Notes**: Complete vector search operations with embedding generation and threshold control

### MongoDB Tools Integration (Line 27)
**Purpose**: Integrates complete MongoDB database operations ecosystem
**Parameters**: Flexible database querying with collection targeting and result processing
**Returns**: MongoDB tool definitions for centralized registration
**Notes**: Complete database operations with query flexibility and performance optimization

### Notion Tools Integration (Lines 30-33)
**Purpose**: Integrates complete Notion workspace operations ecosystem
**Parameters**: Workspace search, page properties, block append, and page creation tools
**Returns**: Notion tool definitions for centralized registration
**Notes**: Complete workspace integration with content management and coordinate integration

### Web Tools Integration (Lines 36-37)
**Purpose**: Integrates complete web research and integration ecosystem
**Parameters**: Basic web search and advanced research with multi-source analysis
**Returns**: Web tool definitions for centralized registration
**Notes**: Complete web operations with research capabilities and content synthesis

### Document Tools Integration (Lines 40-46)
**Purpose**: Integrates complete document CRUD and analysis ecosystem
**Parameters**: Storage, retrieval, update, deletion, listing, and analysis operations
**Returns**: Document tool definitions for centralized registration
**Notes**: Complete document operations with comprehensive CRUD and workflow management

### Graphiti Tools Integration (Lines 49-58)
**Purpose**: Integrates complete temporal knowledge graph operations ecosystem
**Parameters**: Entity search, fact discovery, episode management, context synthesis, and administrative utilities
**Returns**: Graphiti tool definitions for centralized registration
**Notes**: Complete temporal knowledge graph operations with relationship management and administrative excellence

### Event Tools Integration (Line 61)
**Purpose**: Integrates real-time WebSocket event broadcasting capabilities
**Parameters**: Event broadcasting with client synchronization and delivery tracking
**Returns**: Event tool definitions for centralized registration
**Notes**: Complete real-time communication with WebSocket integration

### Handler Mapping (Lines 65-113)
**Purpose**: Maps all tool names to their corresponding handler functions for execution
**Parameters**: Complete handler mapping across all tool ecosystems
**Returns**: Comprehensive handler record for tool execution
**Notes**: Complete handler management with consistent naming and execution patterns

## Data Flow
1. **Tool Aggregation**: Individual ecosystems → Tool imports → Centralized collection → Unified registration
2. **Handler Mapping**: Tool handlers → Name mapping → Execution registry → Runtime access
3. **Server Integration**: Tool definitions → MCP registration → Server availability → Client access
4. **Execution Flow**: Client requests → Handler lookup → Tool execution → Response delivery

## Configuration
### Integration Configuration
- **Complete Ecosystem Coverage**: All functional tool ecosystems integrated and available
- **Unified Registration**: Centralized tool registration for MCP server integration
- **Handler Management**: Comprehensive handler mapping for consistent execution
- **Tool Orchestration**: Unified access to all operational domains

### Tool Organization
- **Bimba Tools**: 6 coordinate-based operations tools
- **Pratibimba Tools**: 1 vector search tool
- **MongoDB Tools**: 1 database operations tool
- **Notion Tools**: 4 workspace integration tools
- **Web Tools**: 2 research and integration tools
- **Document Tools**: 7 CRUD and analysis tools
- **Graphiti Tools**: 10 temporal knowledge graph tools
- **Event Tools**: 1 real-time broadcasting tool
- **Total**: 32 comprehensive tools across all operational domains

### System Architecture
- **Modular Design**: Clean separation between tool ecosystems with unified integration
- **Centralized Management**: Single point of tool registration and handler management
- **Scalable Architecture**: Easy addition of new tool ecosystems and capabilities
- **Consistent Interface**: Uniform tool definition and handler patterns across all ecosystems

## Testing
No explicit test files referenced, but provides comprehensive tool integration testing through unified access patterns

## Related Files
### Core Dependencies
- **../types/index.js**: Tool and handler type definitions
- **All Tool Ecosystem Indexes**: Complete dependency on all functional tool ecosystems

### Tool Ecosystem Integration
- **./bimba/index.js**: Complete Bimba coordinate-based operations ecosystem
- **./pratibimba/index.js**: Complete Pratibimba vector search ecosystem
- **./mongo/index.js**: Complete MongoDB database operations ecosystem
- **./notion/index.js**: Complete Notion workspace integration ecosystem
- **./web/index.js**: Complete web research and integration ecosystem
- **./document/index.js**: Complete document CRUD and analysis ecosystem
- **./graphiti/index.js**: Complete temporal knowledge graph operations ecosystem
- **./broadcastEvent.js**: Real-time WebSocket event broadcasting tool

### Integration Points
- **MCP Server**: Primary consumer for tool registration and execution
- **Server Setup**: Tool registration and initialization processes
- **Client Applications**: Tool availability and execution through server
- **Tool Registry**: Complete tool ecosystem management and access

## Development Notes
- **Master Integration**: Comprehensive integration of all BPMCP tool ecosystems
- **Complete Coverage**: All 32 tools across 8 functional domains integrated and available
- **Unified Access**: Single point of access for all tool definitions and handlers
- **Scalable Architecture**: Easy addition of new tool ecosystems and capabilities
- **Consistent Patterns**: Uniform tool definition and handler patterns across all ecosystems
- **Production Ready**: Comprehensive tool integration suitable for production operations
- **Development Support**: Clear tool organization and integration for development
- **Debugging Excellence**: Complete tool coverage for comprehensive system debugging
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
- **System Completeness**: Represents the complete operational capability of the BPMCP system
