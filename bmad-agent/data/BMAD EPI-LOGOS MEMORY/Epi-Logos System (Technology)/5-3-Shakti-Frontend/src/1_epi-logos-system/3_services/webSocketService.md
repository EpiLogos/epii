# webSocketService.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/3_services/webSocketService.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal WebSocket service providing real-time communication between frontend and backend systems. Implements AG-UI protocol for agent-to-UI events, manages document cache updates, handles frontend context requests, and provides comprehensive WebSocket connection management with automatic reconnection. Serves as the primary real-time communication layer for the entire Epi-Logos system.

## System Integration
### Imports
- **Document Cache Service**: documentCacheService for cache invalidation and updates

### Exports
- **initializeWebSocket**: WebSocket connection initialization with AG-UI support
- **sendWebSocketMessage**: Send messages to backend via WebSocket
- **emitAGUIEvent**: Emit AG-UI events to backend agents
- **subscribeToAGUIEvents**: Subscribe to specific AG-UI event types
- **registerFrontendAction**: Register frontend actions for backend invocation
- **requestFrontendContext**: Request context data from frontend components
- **isConnected**: Connection status getter

### Dependencies
- **A2A Server**: WebSocket connection to A2A server with AG-UI gateway
- **Document Cache Service**: Cache management for document updates
- **Environment Variables**: VITE_A2A_WS_URL for WebSocket connection
- **AG-UI Protocol**: Event types and message formatting

### Dependents
- **FloatingEpiLogosAgent**: Real-time agent communication
- **Document Canvas**: Analysis pipeline status updates
- **Active Mode Provider**: Mode change notifications
- **All Frontend Components**: Real-time updates and notifications

## Key Functions/Components
### initializeWebSocket() (Lines 128-186)
**Purpose**: Initialize WebSocket connection with AG-UI support and automatic reconnection
**Parameters**: None
**Returns**: void
**Notes**: Connects to A2A server, registers as frontend client, handles connection lifecycle

### handleWebSocketMessage(data) (Lines 192-250)
**Purpose**: Handle incoming WebSocket messages with AG-UI event routing
**Parameters**: data (WebSocketMessage)
**Returns**: void
**Notes**: Routes AG-UI events, document updates, and frontend context requests

### emitAGUIEvent(eventType, payload, metadata) (Lines 300-350)
**Purpose**: Emit AG-UI events to backend agents with proper formatting
**Parameters**: eventType (string), payload (any), metadata (object)
**Returns**: void
**Notes**: Creates standardized AG-UI events with timestamps and metadata

### subscribeToAGUIEvents(eventTypes, callback) (Lines 400-450)
**Purpose**: Subscribe to specific AG-UI event types with callback handling
**Parameters**: eventTypes (string[]), callback (function)
**Returns**: Unsubscribe function
**Notes**: Event subscription management with cleanup capabilities

### registerFrontendAction(actionName, handler) (Lines 500-520)
**Purpose**: Register frontend actions for backend invocation
**Parameters**: actionName (string), handler (function)
**Returns**: void
**Notes**: Allows backend to invoke frontend functions via WebSocket

### requestFrontendContext(contextType, componentId) (Lines 600-650)
**Purpose**: Request context data from frontend components
**Parameters**: contextType (string), componentId (optional string)
**Returns**: Promise<any> - Context data
**Notes**: Async context retrieval with timeout handling

### AG-UI Event Types (Lines 70-105)
**Purpose**: Define 16 standard AG-UI event types for system communication
**Parameters**: None
**Returns**: Event type constants
**Notes**: Complete AG-UI protocol event type definitions

## Data Flow
1. **Connection Initialization**: WebSocket created → A2A server connection → Client registration → AG-UI capabilities announced
2. **Outbound Events**: Frontend events → emitAGUIEvent() → WebSocket message → Backend agents
3. **Inbound Events**: Backend events → handleWebSocketMessage() → Event routing → Component callbacks
4. **Document Updates**: Backend analysis → Document cache update → Cache invalidation → UI refresh
5. **Context Requests**: Backend request → Frontend context retrieval → Response with data

## Configuration
### WebSocket Connection
- **Default URL**: ws://localhost:3033 (A2A server)
- **Environment Variable**: VITE_A2A_WS_URL for custom WebSocket URL
- **Reconnection**: Maximum 5 attempts with 3-second delay
- **Client Registration**: frontend-client with AG-UI capabilities

### AG-UI Event Types (16 Standard Types)
- **Pipeline Events**: PIPELINE_STARTED, PIPELINE_FINISHED, PIPELINE_FAILED
- **Stage Events**: STAGE_STARTED, STAGE_FINISHED, STAGE_ERROR
- **Update Events**: BIMBA_UPDATE_SUGGESTIONS, MEMORY_ONBOARDING
- **Analysis Events**: ANALYSIS_STARTED, ANALYSIS_FINISHED, ANALYSIS_ERROR
- **Document Events**: DOCUMENT_UPDATED, DOCUMENT_ANALYSIS_COMPLETE
- **Agent Events**: AGENT_RESPONSE, AGENT_STATE_CHANGE
- **Special Events**: RAW, CUSTOM

### Context Management
- **Request Timeout**: 30 seconds for context requests
- **Context Types**: fullState, currentDocument, selectedText, userProfile
- **Action Registry**: Map of registered frontend actions

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../shared/services/documentCacheService.ts` - Document cache management

### Integration Points
- **A2A Server**: Primary WebSocket connection endpoint
- **AG-UI Gateway**: Backend AG-UI event routing
- **FloatingEpiLogosAgent**: Primary consumer for agent communication
- **Document Canvas**: Analysis pipeline status updates

### Event Consumers
- All components requiring real-time updates
- Analysis pipeline status tracking
- Document cache synchronization
- Agent communication interfaces

## Development Notes
- **Universal Service**: Moved from subsystem-specific to universal layer
- **AG-UI Protocol**: Complete implementation of 16 standard event types
- **Automatic Reconnection**: Robust reconnection logic with exponential backoff
- **Event Subscription**: Flexible subscription system with cleanup
- **Context Bridge**: Frontend-backend context sharing mechanism
- **Error Resilience**: Comprehensive error handling and connection management
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Real-time Communication**: Low-latency WebSocket communication
- **Frontend Actions**: Backend can invoke frontend functions via registered actions
- **Memory Management**: Proper cleanup of subscriptions and pending requests
