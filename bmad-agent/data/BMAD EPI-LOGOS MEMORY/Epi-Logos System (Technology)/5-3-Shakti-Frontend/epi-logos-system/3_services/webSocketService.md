# webSocketService.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/3_services/webSocketService.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
WebSocket Service providing universal real-time communication between frontend and backend with comprehensive AG-UI event integration and document cache management. Handles WebSocket connection management, AG-UI event processing, skill execution coordination, and real-time document updates. Serves as the primary real-time communication layer enabling backend coordination, AG-UI event emission, and comprehensive WebSocket-based agent communication with advanced event handling and connection management.

## System Integration
### Imports
- **Document Cache Service**: documentCacheService from ../../shared/services/documentCacheService for document cache integration

### Exports
- **sendWebSocketMessage**: Function for sending WebSocket messages to backend
- **subscribeToAGUIEvents**: Function for subscribing to AG-UI events and real-time updates
- **onAGUIEvent**: Function for handling AG-UI event processing and coordination
- **executeSkillWithAGUI**: Function for executing skills with AG-UI integration and event emission

### Dependencies
- **WebSocket Connection**: Browser WebSocket API for real-time communication with backend
- **Document Cache Service**: Document cache integration for real-time document updates
- **AG-UI Event System**: AG-UI event processing and coordination for agent communication
- **Backend Services**: Backend WebSocket services for real-time agent coordination

### Dependents
- **Floating Epi-Logos Agent**: Primary consumer for real-time agent communication
- **Frontend Components**: Components requiring real-time backend communication
- **Document Systems**: Document-aware components requiring real-time updates
- **Agent Interfaces**: Agent components requiring AG-UI event integration

## Key Functions/Components
### WebSocket Message Types (Lines 11-25)
**Purpose**: Defines WebSocket message structure and types for communication protocol
**Parameters**: WebSocketMessage interface with type, agentId, payload, and additional properties
**Returns**: Type definitions for WebSocket message structure and communication protocol
**Notes**: 850 lines implementing comprehensive WebSocket service with AG-UI integration and advanced event handling

### AG-UI Event Types (Lines 27-80)
**Purpose**: Defines AG-UI event structure and standard emission types for agent communication
**Parameters**: AGUIEvent interface with type, runId, threadId, and event-specific properties
**Returns**: Type definitions for AG-UI event structure and agent communication protocol
**Notes**: Comprehensive AG-UI event type definitions with 16 standard emission types for agent coordination

### WebSocket Connection Management (Lines 82-150)
**Purpose**: Manages WebSocket connection lifecycle including connection, reconnection, and error handling
**Parameters**: WebSocket configuration and connection parameters
**Returns**: WebSocket connection management with automatic reconnection and error handling
**Notes**: Advanced connection management with reconnection logic and connection state tracking

### Message Sending (Lines 152-200)
**Purpose**: Sends WebSocket messages to backend with comprehensive error handling and validation
**Parameters**: WebSocketMessage object with message type, payload, and routing information
**Returns**: Promise<void> - Message sending completion with error handling and validation
**Notes**: Comprehensive message sending with validation, error handling, and delivery confirmation

### AG-UI Event Subscription (Lines 202-280)
**Purpose**: Subscribes to AG-UI events for real-time agent communication and coordination
**Parameters**: Event subscription configuration and event handler functions
**Returns**: Event subscription management with handler registration and event processing
**Notes**: Advanced event subscription with handler management and real-time event processing

### AG-UI Event Processing (Lines 282-380)
**Purpose**: Processes AG-UI events with comprehensive event handling and coordination
**Parameters**: AGUIEvent objects with event type, data, and processing context
**Returns**: Event processing results with coordination and response handling
**Notes**: Comprehensive event processing with validation, routing, and response coordination

### Skill Execution with AG-UI (Lines 382-480)
**Purpose**: Executes skills with AG-UI integration and event emission coordination
**Parameters**: Skill execution parameters with AG-UI context and event configuration
**Returns**: Promise<any> - Skill execution results with AG-UI event coordination and response handling
**Notes**: Advanced skill execution with AG-UI integration and comprehensive event coordination

### Document Cache Integration (Lines 482-550)
**Purpose**: Integrates document cache updates with real-time WebSocket communication
**Parameters**: Document cache update events and synchronization configuration
**Returns**: Document cache synchronization with real-time updates and state management
**Notes**: Comprehensive document cache integration enabling real-time document updates and synchronization

### Connection State Management (Lines 552-620)
**Purpose**: Manages WebSocket connection state with comprehensive state tracking and monitoring
**Parameters**: Connection state configuration and monitoring parameters
**Returns**: Connection state management with state tracking and connection monitoring
**Notes**: Advanced connection state management with comprehensive monitoring and state synchronization

### Error Handling (Lines 622-700)
**Purpose**: Handles WebSocket errors with comprehensive error reporting and recovery
**Parameters**: WebSocket error objects and error context for connection management
**Returns**: Error handling with recovery strategies and graceful failure management
**Notes**: Robust error handling ensuring WebSocket resilience and connection recovery

### Event Handler Management (Lines 702-780)
**Purpose**: Manages event handler registration and cleanup for AG-UI events
**Parameters**: Event handler functions and registration configuration
**Returns**: Event handler management with registration, cleanup, and lifecycle management
**Notes**: Advanced event handler management ensuring proper registration and cleanup

### Real-time Update Processing (Lines 782-850)
**Purpose**: Processes real-time updates from backend with comprehensive update handling
**Parameters**: Real-time update events and processing configuration
**Returns**: Real-time update processing with state synchronization and UI updates
**Notes**: Comprehensive real-time update processing enabling responsive frontend updates and state synchronization

## Data Flow
1. **Connection Establishment**: WebSocket initialization → Backend connection → Connection state management → Service readiness
2. **Message Communication**: Message creation → Validation → WebSocket transmission → Backend processing → Response handling
3. **AG-UI Event Flow**: Event subscription → Event reception → Event processing → Handler execution → UI updates
4. **Skill Execution**: Skill request → AG-UI integration → Backend execution → Event emission → Response processing
5. **Document Updates**: Document changes → Cache updates → WebSocket notification → Real-time synchronization → UI updates
6. **Error Handling**: Error detection → Error processing → Recovery strategies → Connection restoration → Service continuity

## Configuration
### WebSocket Configuration
- **Connection Management**: Automatic connection establishment and reconnection handling
- **Message Protocol**: Comprehensive message structure and communication protocol
- **Error Handling**: Robust error handling with recovery strategies and graceful failure
- **State Management**: Connection state tracking and monitoring capabilities

### AG-UI Configuration
- **Event Types**: 16 standard AG-UI event types for comprehensive agent communication
- **Event Processing**: Advanced event processing with validation and coordination
- **Handler Management**: Event handler registration and lifecycle management
- **Skill Integration**: Skill execution with AG-UI event coordination and emission

### Document Integration Configuration
- **Cache Synchronization**: Real-time document cache updates and synchronization
- **Update Processing**: Comprehensive real-time update processing and state management
- **State Coordination**: Document state coordination with WebSocket communication
- **UI Synchronization**: Real-time UI updates based on document changes

## Testing
WebSocket service testing available in epi-logos-system/tests/services/ directory with comprehensive real-time communication and AG-UI event testing

## Related Files
### Core Dependencies
- **../../shared/services/documentCacheService**: Document cache integration for real-time updates
- **Browser WebSocket API**: Native WebSocket functionality for real-time communication

### Integration Points
- **../1_components/FloatingEpiLogosAgent.tsx**: Primary consumer for real-time agent communication
- **Backend WebSocket Services**: Backend services for real-time agent coordination
- **Document Systems**: Document-aware components requiring real-time updates
- **AG-UI Event System**: AG-UI event processing and coordination infrastructure

### System Architecture
- **Real-time Communication**: Primary real-time communication layer for frontend-backend coordination
- **AG-UI Integration**: Comprehensive AG-UI event processing and coordination
- **Document Synchronization**: Real-time document updates and cache synchronization
- **Event Management**: Advanced event handling and subscription management

## Development Notes
- **Real-time Communication Excellence**: Comprehensive WebSocket service enabling real-time frontend-backend communication
- **AG-UI Integration**: Advanced AG-UI event processing with 16 standard emission types and comprehensive coordination
- **Connection Management**: Sophisticated connection lifecycle management with automatic reconnection and error handling
- **Document Synchronization**: Real-time document cache integration enabling responsive document updates
- **Event Handling Architecture**: Advanced event subscription and handler management with lifecycle coordination
- **Skill Execution Integration**: Comprehensive skill execution with AG-UI event coordination and emission
- **Error Handling Resilience**: Robust error handling ensuring WebSocket resilience and connection recovery
- **State Management**: Advanced connection state tracking and monitoring with comprehensive state coordination
- **Development Support**: Clear WebSocket service boundaries and comprehensive real-time communication management
- **Production Communication**: Scalable WebSocket service suitable for production real-time agent communication
- **Debugging Excellence**: Comprehensive WebSocket monitoring and event tracking with connection state visibility
- **BPMCP Alignment**: Real-time communication integration with sophisticated Bimba coordinate system support
