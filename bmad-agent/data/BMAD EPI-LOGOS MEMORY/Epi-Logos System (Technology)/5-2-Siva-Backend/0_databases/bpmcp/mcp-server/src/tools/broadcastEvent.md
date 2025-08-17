# broadcastEvent.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/broadcastEvent.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
WebSocket Event Broadcasting Tool providing real-time event distribution capabilities for connected clients within the BPMCP server. Handles event broadcasting with type specification, document association, analysis results inclusion, and timestamp management for comprehensive real-time communication. Serves as the primary real-time communication layer within the BPMCP server architecture enabling live updates, event notifications, and client synchronization across all connected WebSocket clients.

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation
- **Types**: Tool, ToolDependencies from types/index.js for tool definition and dependency injection
- **WebSocket Transport**: CustomWebSocketServerTransport from transports/websocket.js for client communication
- **Utils**: zodToJsonSchema from utils/zodToJsonSchema.js for schema conversion

### Exports
- **broadcastEventTool**: Tool definition for MCP tool registration
- **broadcastEventHandler**: Main handler function for event broadcasting operations

### Dependencies
- **WebSocket Transport**: CustomWebSocketServerTransport for client communication and event distribution
- **Schema Validation**: EventSchema for input validation and type safety
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Real-time Operations**: Operations requiring live client updates and event notifications
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: WebSocket clients receiving real-time event broadcasts
- **Analysis Systems**: Systems requiring real-time analysis result distribution

## Key Functions/Components
### EventSchema Definition (Lines 14-19)
**Purpose**: Defines validation schema for event broadcasting operations
**Parameters**: type (string), documentId (optional string), analysisResults (optional any), timestamp (optional date/string)
**Returns**: Zod schema object for event validation
**Notes**: 74 lines implementing comprehensive WebSocket event broadcasting with real-time communication

### broadcastEventTool Definition (Lines 22-26)
**Purpose**: Defines the MCP tool for WebSocket event broadcasting operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: Real-time event broadcasting tool for client communication

### broadcastEventHandler Function (Lines 29-74)
**Purpose**: Main handler function for WebSocket event broadcasting operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Broadcasting confirmation with client count and event details
**Notes**: Comprehensive event broadcasting with WebSocket client distribution and validation

### Input Validation (Lines 32-38)
**Purpose**: Validates input arguments against EventSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring event type, document ID, and timestamp integrity

### Event Logging (Lines 37-38)
**Purpose**: Logs event broadcasting details for monitoring and debugging
**Parameters**: Event type and optional document ID information
**Returns**: Comprehensive logging for event tracking
**Notes**: Detailed logging with event awareness and client communication tracking

### WebSocket Transport Access (Lines 40-45)
**Purpose**: Accesses WebSocket transport for client communication
**Parameters**: Dependencies and transport configuration
**Returns**: WebSocket transport reference for broadcasting
**Notes**: Direct WebSocket transport access with connection management

### Event Preparation (Lines 47-55)
**Purpose**: Prepares event data for broadcasting with timestamp and metadata
**Parameters**: Event data, timestamp, and preparation configuration
**Returns**: Prepared event object for client distribution
**Notes**: Event preparation with timestamp normalization and metadata inclusion

### Client Broadcasting (Lines 57-65)
**Purpose**: Broadcasts event to all connected WebSocket clients
**Parameters**: Prepared event data and broadcasting configuration
**Returns**: Broadcasting results with client count and delivery status
**Notes**: Real-time event distribution to all connected clients with delivery tracking

### Response Formatting (Lines 67-74)
**Purpose**: Formats broadcasting response for client consumption
**Parameters**: Broadcasting results and operation metadata
**Returns**: Formatted response with broadcasting confirmation and client information
**Notes**: Structured response format for client consumption with comprehensive broadcasting data

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Event Preparation**: Event data → Timestamp processing → Metadata inclusion → Broadcasting preparation
3. **WebSocket Access**: Transport access → Client enumeration → Connection validation → Broadcasting setup
4. **Event Distribution**: Event broadcasting → Client delivery → Delivery tracking → Result collection
5. **Response Delivery**: Broadcasting results → Response formatting → Client confirmation → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "broadcastEvent" for MCP tool identification
- **Description**: Clear description of WebSocket event broadcasting functionality
- **Input Schema**: EventSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Event Configuration
- **Event Types**: Flexible event type specification for different notification categories
- **Document Association**: Optional document ID association for document-related events
- **Analysis Results**: Optional analysis results inclusion for analysis-related events
- **Timestamp Management**: Flexible timestamp handling with date/string support

### WebSocket Configuration
- **Client Broadcasting**: Real-time event distribution to all connected WebSocket clients
- **Transport Integration**: Direct WebSocket transport integration through dependencies
- **Delivery Tracking**: Client count tracking and delivery status monitoring
- **Connection Management**: WebSocket connection validation and client enumeration

## Testing
No explicit test files referenced, but includes comprehensive input validation and WebSocket broadcasting operation testing

## Related Files
### Core Dependencies
- **../types/index.js**: Tool and dependency type definitions
- **../transports/websocket.js**: CustomWebSocketServerTransport for client communication
- **../utils/zodToJsonSchema.js**: Schema conversion utilities

### Integration Points
- **WebSocket Transport**: Real-time client communication and event distribution
- **MCP Server**: Tool registration and execution
- **Client Applications**: WebSocket event reception and real-time updates
- **Analysis Systems**: Real-time analysis result distribution and event notifications

## Development Notes
- **Real-time Communication**: Comprehensive WebSocket event broadcasting with client distribution
- **Event Management**: Flexible event type specification with document and analysis association
- **Client Synchronization**: Real-time client updates and event notifications
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for WebSocket operations and client communication
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable event broadcasting suitable for production real-time operations
- **Development Support**: Clear WebSocket operations and real-time communication for development
- **Extensible Design**: Easy addition of new event types and broadcasting features
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
