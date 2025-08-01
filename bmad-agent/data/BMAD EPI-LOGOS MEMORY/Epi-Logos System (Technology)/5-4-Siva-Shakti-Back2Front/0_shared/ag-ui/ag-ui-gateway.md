# ag-ui-gateway.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/shared/ag-ui/ag-ui-gateway.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
AG-UI Gateway component managing Agent-to-UI event routing, subscriptions, and broadcasting within the Siva-Shakti communication layer. Provides real-time communication bridge between backend agents and frontend UI components. Handles client registration, event subscriptions, run tracking, and WebSocket message routing for the AG-UI protocol implementation.

## System Integration
### Imports
- **uuid**: Unique identifier generation for clients and events
- **ag-ui-event-schema**: AGUIEventTypes, createAGUIEvent, validateAGUIEvent for event management
- **a2a-message.schema**: A2AAGUIEventTypes, createAGUIA2AMessage, isAGUIEvent, extractAGUIEventData for message handling

### Exports
- **AGUIGateway**: Main gateway class for AG-UI event management
- **Client Management**: Registration, subscription, and communication methods
- **Event Broadcasting**: Event routing and distribution functionality

### Dependencies
- **WebSocket Connections**: Client WebSocket connections for real-time communication
- **AG-UI Event Schema**: Event type definitions and validation
- **A2A Message Schema**: Message format integration with A2A server
- **Event History System**: Run tracking and event history management

### Dependents
- **A2A Server**: Integrates AG-UI gateway for frontend communication
- **Frontend WebSocket Client**: Receives AG-UI events via gateway
- **Backend Agents**: Send events through gateway to frontend
- **Analysis Pipeline**: Emits stage events via AG-UI integration

## Key Functions/Components
### AGUIGateway Class (Lines 18-403)
**Purpose**: Main gateway class managing AG-UI event system
**Parameters**: None (constructor)
**Returns**: AGUIGateway instance
**Notes**: 403 lines implementing complete AG-UI gateway functionality

### registerClient(clientId, ws, metadata) (Lines 33-55)
**Purpose**: Register WebSocket client for AG-UI events
**Parameters**: clientId (string), ws (WebSocket), metadata (object)
**Returns**: void
**Notes**: Stores client connection, metadata, and sends registration confirmation

### subscribe(clientId, runId, threadId, eventType) (Lines 88-118)
**Purpose**: Subscribe client to specific AG-UI events
**Parameters**: clientId (string), runId (optional), threadId (optional), eventType (optional)
**Returns**: void
**Notes**: Creates subscription keys and manages subscription mappings

### unregisterClient(clientId) (Lines 61-79)
**Purpose**: Unregister client and clean up subscriptions
**Parameters**: clientId (string)
**Returns**: void
**Notes**: Removes all client subscriptions and connection references

### broadcastEvent(event, runId, threadId) (Lines 200-250)
**Purpose**: Broadcast AG-UI events to subscribed clients
**Parameters**: event (object), runId (optional), threadId (optional)
**Returns**: void
**Notes**: Routes events to appropriate subscribers based on subscription keys

### createSubscriptionKey(runId, threadId, eventType) (Lines 150-170)
**Purpose**: Create unique subscription key for event filtering
**Parameters**: runId (optional), threadId (optional), eventType (optional)
**Returns**: string - Subscription key
**Notes**: Generates hierarchical subscription keys for flexible event routing

### sendToClient(clientId, message) (Lines 300-320)
**Purpose**: Send message to specific client via WebSocket
**Parameters**: clientId (string), message (object)
**Returns**: void
**Notes**: Handles WebSocket message sending with error handling

## Data Flow
1. **Client Registration**: WebSocket connection → registerClient() → Client stored → Registration confirmation sent
2. **Event Subscription**: Client subscribes → Subscription key created → Mapping stored → Confirmation sent
3. **Event Broadcasting**: Event received → Subscription matching → Message routing → WebSocket delivery
4. **Run Tracking**: Run started → Run metadata stored → Events tracked → History maintained
5. **Client Cleanup**: Connection closed → unregisterClient() → Subscriptions removed → Resources cleaned

## Configuration
### Client Management
- **Client Storage**: Map of clientId to client data (WebSocket, subscriptions, metadata)
- **Subscription Mapping**: Map of subscription keys to client sets
- **Metadata Tracking**: Agent ID, name, capabilities, registration time

### Event System
- **Event History**: Map of runId to event arrays
- **History Limit**: Maximum 1000 events per run
- **Subscription Keys**: Hierarchical key system for flexible filtering

### WebSocket Integration
- **Connection Management**: Client WebSocket connection tracking
- **Message Routing**: Event-based message distribution
- **Error Handling**: WebSocket error management and cleanup

## Testing
No explicit test files referenced, but includes comprehensive logging and error handling

## Related Files
### Core Dependencies
- `./ag-ui-event-schema.js` - AG-UI event type definitions and validation
- `../a2a/a2a-message.schema.js` - A2A message format integration

### Integration Points
- **A2A Server**: Primary integration point for AG-UI gateway
- **Frontend WebSocket Client**: Receives events via gateway
- **Backend Services**: Send events through gateway

### Event Sources
- **Analysis Pipeline**: Stage events and pipeline status
- **Agent Operations**: Agent responses and state changes
- **System Events**: Registration, subscription, and error events

## Development Notes
- **Event-Driven Architecture**: Complete event-driven communication system
- **Subscription Flexibility**: Hierarchical subscription system for granular event filtering
- **Client Management**: Comprehensive client lifecycle management
- **Memory Management**: Event history limits and cleanup procedures
- **Error Resilience**: WebSocket error handling and connection cleanup
- **Real-time Communication**: Low-latency event broadcasting
- **Scalable Design**: Map-based storage for efficient client and subscription management
- **Integration Ready**: Seamless integration with A2A server infrastructure
- **Logging Strategy**: Comprehensive logging for debugging and monitoring
- **Protocol Compliance**: Full AG-UI protocol implementation
