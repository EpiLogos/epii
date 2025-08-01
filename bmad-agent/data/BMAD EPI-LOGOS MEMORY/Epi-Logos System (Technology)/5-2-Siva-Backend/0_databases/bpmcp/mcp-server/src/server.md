# server.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/server.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
MCP Server Setup providing comprehensive Model Context Protocol server initialization and configuration. Handles server creation, tool registration, transport setup, and request handling with WebSocket and stdio transport support. Serves as the core server orchestration system within the BPMCP server architecture ensuring proper MCP protocol compliance and tool availability across all client connections.

## System Integration
### Imports
- **MCP SDK**: Server, StdioServerTransport for MCP server functionality
- **MCP Types**: CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode for protocol compliance
- **Tools**: tools, handlers from tools/index.js for tool registration
- **Types**: Config, ToolDependencies for type safety
- **Transports**: CustomWebSocketServerTransport for WebSocket support
- **Utils**: handleError for error management

### Exports
- **ServerOptions**: Interface defining server initialization options
- **ServerInstance**: Interface defining server instance structure
- **setupServer**: Main function for server setup and initialization

### Dependencies
- **MCP SDK**: Model Context Protocol server implementation
- **Tool System**: All BPMCP tools and handlers
- **Transport Layer**: WebSocket and stdio transport implementations
- **Configuration**: Server configuration and dependencies
- **Error Handling**: Centralized error management

### Dependents
- **Main Entry Point**: index.ts uses setupServer for server initialization
- **Client Connections**: MCP clients connect through configured transports
- **Tool Execution**: All tool requests are handled through this server
- **WebSocket Clients**: Real-time clients connect through WebSocket transport

## Key Functions/Components
### ServerOptions Interface (Lines 14-17)
**Purpose**: Defines the structure for server initialization options
**Parameters**: config (Config), dependencies (ToolDependencies)
**Returns**: Interface for server setup parameters
**Notes**: 85 lines implementing comprehensive MCP server setup and management

### ServerInstance Interface (Lines 19-22)
**Purpose**: Defines the structure for server instance return value
**Parameters**: server (Server), wsTransport (CustomWebSocketServerTransport)
**Returns**: Interface for server instance management
**Notes**: Provides access to both server and WebSocket transport for management

### setupServer Function (Lines 29-85)
**Purpose**: Main function for MCP server setup and initialization
**Parameters**: options (ServerOptions) containing config and dependencies
**Returns**: Promise<ServerInstance> with configured server and transport
**Notes**: Comprehensive server setup with tool registration and transport configuration

### Server Creation (Lines 31-35)
**Purpose**: Creates new MCP server instance with configuration
**Parameters**: Server configuration and metadata
**Returns**: Configured MCP server instance
**Notes**: Includes server name, version, and capability configuration

### Tool Registration (Lines 37-50)
**Purpose**: Registers all BPMCP tools with the MCP server
**Parameters**: Tool definitions and handlers
**Returns**: Registered tools available for client requests
**Notes**: Dynamic tool registration with comprehensive error handling

### Request Handlers (Lines 52-70)
**Purpose**: Sets up request handlers for tool calls and tool listing
**Parameters**: Request schemas and handler functions
**Returns**: Configured request handling system
**Notes**: Handles both ListTools and CallTool requests with proper validation

### Transport Configuration (Lines 72-85)
**Purpose**: Configures WebSocket and stdio transports for client connections
**Parameters**: Transport configuration and server instance
**Returns**: Configured transport layer for client communication
**Notes**: Dual transport support for different client connection types

## Data Flow
1. **Server Initialization**: Options received → Server creation → Tool registration → Handler setup → Transport configuration
2. **Tool Registration**: Tool definitions → Handler mapping → Server registration → Tool availability → Client access
3. **Request Handling**: Client request → Request validation → Tool execution → Response formatting → Client response
4. **Transport Management**: Client connection → Transport selection → Protocol handling → Message routing → Response delivery
5. **Error Handling**: Error occurrence → Error processing → MCP error formatting → Client error response → Connection maintenance

## Configuration
### Server Configuration
- **Server Name**: "bimba-pratibimba-memory-mcp" for MCP identification
- **Server Version**: Version information for client compatibility
- **Capabilities**: Server capability advertisement to clients
- **Tool Registration**: Dynamic registration of all available tools

### Transport Configuration
- **WebSocket Transport**: Custom WebSocket transport for real-time connections
- **Stdio Transport**: Standard input/output transport for CLI clients
- **Dual Transport**: Support for both transport types simultaneously
- **Connection Management**: Proper connection lifecycle management

### Request Handling Configuration
- **ListTools Handler**: Returns available tools and their schemas
- **CallTool Handler**: Executes tool requests with validation
- **Error Handling**: Comprehensive error handling and MCP compliance
- **Validation**: Request validation and parameter checking

### Tool Integration Configuration
- **Dynamic Registration**: Automatic registration of all available tools
- **Handler Mapping**: Proper mapping between tools and their handlers
- **Dependency Injection**: Tool dependencies provided through server setup
- **Error Propagation**: Proper error handling and propagation to clients

## Testing
No explicit test files referenced, but includes comprehensive error handling and MCP protocol compliance validation

## Related Files
### Core Dependencies
- **@modelcontextprotocol/sdk**: MCP server implementation and types
- **./tools/index.js**: All BPMCP tools and handlers
- **./types/index.js**: Type definitions for server configuration
- **./transports/websocket.js**: Custom WebSocket transport implementation
- **./utils/error.js**: Centralized error handling

### Integration Points
- **index.ts**: Main entry point using setupServer for initialization
- **All BPMCP Tools**: Tools registered and made available through server
- **Client Applications**: MCP clients connect and interact through server
- **Transport Layer**: WebSocket and stdio transports for client communication

### Server Architecture
- **MCP Compliance**: Full compliance with Model Context Protocol
- **Tool Management**: Dynamic tool registration and execution
- **Transport Abstraction**: Support for multiple transport types
- **Error Handling**: Comprehensive error handling and client communication

## Development Notes
- **MCP Protocol Compliance**: Full compliance with Model Context Protocol standards
- **Dual Transport Support**: Supports both WebSocket and stdio transports for flexibility
- **Dynamic Tool Registration**: Automatic registration of all available BPMCP tools
- **Comprehensive Error Handling**: Robust error handling with proper MCP error formatting
- **Type Safety**: Strongly typed interfaces for server configuration and management
- **Dependency Injection**: Clean dependency injection pattern for tool execution
- **Connection Management**: Proper lifecycle management for client connections
- **Extensible Design**: Easy addition of new tools and transport types
- **Production Ready**: Robust server implementation suitable for production deployment
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
