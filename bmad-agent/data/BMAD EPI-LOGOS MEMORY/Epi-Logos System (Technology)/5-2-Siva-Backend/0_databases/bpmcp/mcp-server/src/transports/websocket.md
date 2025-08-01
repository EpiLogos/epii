# websocket.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/transports/websocket.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
WebSocket Transport providing real-time bidirectional communication for the BPMCP server. Implements custom WebSocket server transport with client management, message handling, and event broadcasting capabilities. Serves as the primary real-time communication layer within the BPMCP server architecture enabling live updates, tool execution, and client interaction across web applications and real-time interfaces.

## System Integration
### Imports
- **WebSocket**: WebSocket, WebSocketServer from ws for WebSocket functionality
- **HTTP**: http from Node.js for HTTP server creation
- **MCP SDK**: Server from @modelcontextprotocol/sdk for MCP integration
- **MCP Types**: McpError, ErrorCode for error handling
- **Types**: ToolDependencies for dependency injection
- **Utils**: handleError for centralized error management

### Exports
- **CustomWebSocketServerTransport**: Main WebSocket transport class for real-time communication

### Dependencies
- **MCP Server**: Server instance for tool execution and protocol handling
- **Tool Dependencies**: Database connections and services for tool execution
- **Error Handling**: Centralized error handling for WebSocket operations
- **HTTP Server**: HTTP server for WebSocket upgrade handling

### Dependents
- **Server Setup**: server.ts uses CustomWebSocketServerTransport for real-time communication
- **Web Clients**: Frontend applications connect through WebSocket transport
- **Real-time Tools**: Tools requiring real-time updates and event broadcasting
- **Client Management**: WebSocket client lifecycle and connection management

## Key Functions/Components
### CustomWebSocketServerTransport Class (Lines 19-155)
**Purpose**: Main WebSocket transport class providing real-time communication capabilities
**Parameters**: CustomWebSocketServerTransportOptions with port, server, dependencies, handlers
**Returns**: WebSocket transport instance with client management and message handling
**Notes**: 155 lines implementing comprehensive WebSocket transport with MCP integration

### Constructor (Lines 28-45)
**Purpose**: Initializes WebSocket transport with HTTP server and WebSocket server
**Parameters**: Transport options including port, MCP server, dependencies, handlers
**Returns**: Configured transport instance
**Notes**: Sets up HTTP server, WebSocket server, and client management

### Client Management (Lines 47-65)
**Purpose**: Handles WebSocket client connections, disconnections, and lifecycle
**Parameters**: WebSocket connections and client metadata
**Returns**: Client registration and management
**Notes**: Maintains client registry with unique IDs and connection tracking

### Message Handling (Lines 67-95)
**Purpose**: Processes incoming WebSocket messages and routes to appropriate handlers
**Parameters**: WebSocket messages and client context
**Returns**: Message processing and response handling
**Notes**: JSON message parsing, tool execution, and response formatting

### Tool Execution (Lines 97-120)
**Purpose**: Executes BPMCP tools through WebSocket requests
**Parameters**: Tool requests with parameters and client context
**Returns**: Tool execution results and response formatting
**Notes**: Integration with MCP tool system and dependency injection

### Event Broadcasting (Lines 122-140)
**Purpose**: Broadcasts events and updates to connected WebSocket clients
**Parameters**: Event data and target client selection
**Returns**: Event distribution to connected clients
**Notes**: Supports both targeted and broadcast messaging

### Error Handling (Lines 142-155)
**Purpose**: Handles WebSocket errors and connection issues
**Parameters**: Error objects and client context
**Returns**: Error processing and client notification
**Notes**: Comprehensive error handling with proper client communication

## Data Flow
1. **Connection Establishment**: Client connection → WebSocket upgrade → Client registration → Connection confirmation
2. **Message Processing**: Client message → JSON parsing → Tool routing → Handler execution → Response formatting
3. **Tool Execution**: Tool request → Dependency injection → Tool execution → Result processing → Client response
4. **Event Broadcasting**: Event generation → Client selection → Message formatting → WebSocket transmission
5. **Error Handling**: Error occurrence → Error processing → Client notification → Connection maintenance

## Configuration
### Transport Configuration
- **Port Configuration**: Configurable port for WebSocket server
- **HTTP Server**: HTTP server for WebSocket upgrade handling
- **Client Management**: Client connection tracking and lifecycle management
- **Message Handling**: JSON message parsing and response formatting

### WebSocket Configuration
- **Server Setup**: WebSocket server with HTTP upgrade support
- **Client Tracking**: Unique client ID generation and connection management
- **Connection Lifecycle**: Proper connection establishment and cleanup
- **Error Handling**: Comprehensive error handling and client notification

### MCP Integration Configuration
- **Tool Integration**: Full integration with MCP tool system
- **Dependency Injection**: Tool dependencies provided through transport
- **Protocol Compliance**: Full MCP protocol compliance over WebSocket
- **Response Formatting**: Proper MCP response formatting and transmission

### Broadcasting Configuration
- **Event Distribution**: Event broadcasting to connected clients
- **Client Selection**: Targeted and broadcast messaging capabilities
- **Message Formatting**: Proper message formatting for client consumption
- **Real-time Updates**: Live updates and notifications to connected clients

## Testing
No explicit test files referenced, but includes comprehensive WebSocket connection testing and message handling validation

## Related Files
### Core Dependencies
- **ws**: WebSocket library for Node.js
- **http**: Node.js HTTP server for WebSocket upgrades
- **@modelcontextprotocol/sdk**: MCP server integration
- **../types/index.js**: Type definitions for dependencies
- **../utils/error.js**: Centralized error handling

### Integration Points
- **server.ts**: Server setup using CustomWebSocketServerTransport
- **All BPMCP Tools**: Tools accessible through WebSocket transport
- **Frontend Applications**: Web clients connecting through WebSocket
- **Real-time Features**: Live updates and event broadcasting

### Transport Architecture
- **Real-time Communication**: Bidirectional WebSocket communication
- **Client Management**: Comprehensive client lifecycle management
- **MCP Integration**: Full MCP protocol support over WebSocket
- **Event Broadcasting**: Real-time event distribution capabilities

## Development Notes
- **Real-time Communication**: Full bidirectional WebSocket communication for live updates
- **MCP Protocol Integration**: Complete MCP protocol support over WebSocket transport
- **Client Management**: Comprehensive client connection tracking and lifecycle management
- **Event Broadcasting**: Powerful event broadcasting system for real-time notifications
- **Error Resilience**: Robust error handling with proper client notification
- **Production Ready**: Scalable WebSocket transport suitable for production deployment
- **Development Support**: Clear WebSocket setup and debugging for development
- **Extensible Design**: Easy addition of new WebSocket features and message types
- **Performance Optimization**: Efficient WebSocket handling with proper resource management
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
