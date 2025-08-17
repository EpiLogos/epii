# bpWebSocketClient.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/bpWebSocketClient.mjs`
**Bimba Coordinate**: `#5-2-0-6`
**Last Updated**: `2025-01-30`

## Purpose & Role
WebSocket client for communicating with the Bimba-Pratibimba MCP server. Provides reliable WebSocket connection management with automatic reconnection, request timeout handling, caching capabilities, and comprehensive error handling. Serves as the low-level communication layer between the backend application and the BPMCP MCP server for all tool operations.

## System Integration
### Imports
- **WebSocket (ws)**: WebSocket client library for Node.js
- **path**: File system path utilities
- **fileURLToPath**: ES module URL to file path conversion
- **fs**: File system operations for cache management

### Exports
- **BPWebSocketClient**: Main WebSocket client class
- **Default Export**: Singleton instance of BPWebSocketClient

### Dependencies
- **BPMCP MCP Server**: External MCP server for tool execution
- **Environment Variables**: Configuration via environment variables
- **File System**: Cache directory management
- **WebSocket Library**: ws package for WebSocket communication

### Dependents
- **BPMCP Service**: Primary consumer for MCP tool operations
- **Backend Controllers**: Indirect usage through BPMCP service
- **Analysis Pipeline**: Tool execution via BPMCP service

## Key Functions/Components
### BPWebSocketClient Class (Lines 31-356)
**Purpose**: Main WebSocket client class with connection management and tool calling
**Parameters**: options (object) with url, name, version, reconnectInterval, requestTimeout
**Returns**: BPWebSocketClient instance
**Notes**: 356 lines implementing complete WebSocket client functionality

### connect() (Lines 51-129)
**Purpose**: Establish WebSocket connection with automatic reconnection logic
**Parameters**: None
**Returns**: Promise<void> - Resolves when connected
**Notes**: Handles connection state, event listeners, automatic reconnection on close

### callTool(toolName, args) (Lines 131-200)
**Purpose**: Call MCP server tool with request/response handling
**Parameters**: toolName (string), args (object)
**Returns**: Promise<any> - Tool execution result
**Notes**: Ensures connection, manages request IDs, handles timeouts and retries

### Message Handling (Lines 71-95)
**Purpose**: Process incoming WebSocket messages and resolve pending requests
**Parameters**: WebSocket message data
**Returns**: void
**Notes**: JSON parsing, request ID matching, error handling, promise resolution

### Connection Management (Lines 97-117)
**Purpose**: Handle WebSocket connection lifecycle events
**Parameters**: WebSocket events (close, error)
**Returns**: void
**Notes**: Automatic reconnection, pending request cleanup, error propagation

### Cache Management (Lines 18-29, 250-300)
**Purpose**: File-based caching for tool results with TTL support
**Parameters**: Cache key, data, TTL
**Returns**: Cached data or null
**Notes**: Optional caching with configurable TTL, cache directory management

### Configuration Setup (Lines 10-17)
**Purpose**: Environment variable configuration with sensible defaults
**Parameters**: Environment variables
**Returns**: Configuration constants
**Notes**: Timeout, reconnection, caching, and retry settings

## Data Flow
1. **Connection**: Client connects → WebSocket established → Event listeners attached
2. **Tool Call**: callTool() → Connection check → Request creation → Message sent
3. **Response**: Server response → Message parsing → Request ID matching → Promise resolution
4. **Error Handling**: Errors caught → Cleanup performed → Reconnection attempted
5. **Caching**: Tool results → Cache check → File system storage → TTL management

## Configuration
### Environment Variables
- **BP_MCP_WS_URL**: WebSocket server URL (default: ws://localhost:3030/mcp)
- **BP_MCP_REQUEST_TIMEOUT**: Request timeout in ms (default: 300000 - 5 minutes)
- **BP_MCP_RECONNECT_INTERVAL**: Reconnection interval in ms (default: 5000)
- **BP_MCP_MAX_RETRIES**: Maximum retry attempts (default: 3)
- **BP_MCP_CACHE_ENABLED**: Enable caching (default: true)
- **BP_MCP_CACHE_TTL**: Cache TTL in ms (default: 300000 - 5 minutes)

### Connection Settings
- **Client Name**: 'epii-backend-client'
- **Client Version**: '1.0.0'
- **Automatic Reconnection**: Enabled with configurable interval
- **Request Timeout**: 5 minutes for LLM operations

### Cache Configuration
- **Cache Directory**: ../cache relative to client file
- **File-based Storage**: JSON files with TTL metadata
- **Automatic Cleanup**: TTL-based cache invalidation

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- External BPMCP MCP server for tool execution
- WebSocket library (ws) for communication

### Integration Points
- **BPMCP Service**: Primary consumer of WebSocket client
- **Backend Controllers**: Indirect usage through service layer
- **Analysis Pipeline**: Tool execution via client

### Cache System
- **Cache Directory**: File system cache storage
- **Cache Files**: JSON files with TTL metadata
- **Cache Management**: Automatic cleanup and invalidation

## Development Notes
- **Connection Resilience**: Automatic reconnection with exponential backoff
- **Request Management**: Comprehensive request ID tracking and timeout handling
- **Error Handling**: Robust error handling with detailed logging
- **Caching Strategy**: Optional file-based caching with TTL support
- **Performance Optimization**: Long timeout (5 minutes) for LLM operations
- **Memory Management**: Proper cleanup of pending requests and timers
- **Event-Driven Architecture**: WebSocket event handling with promise-based API
- **Configuration Flexibility**: Environment variable configuration with defaults
- **Singleton Pattern**: Default export as singleton instance
- **State Management**: Connection state tracking with proper lifecycle management
