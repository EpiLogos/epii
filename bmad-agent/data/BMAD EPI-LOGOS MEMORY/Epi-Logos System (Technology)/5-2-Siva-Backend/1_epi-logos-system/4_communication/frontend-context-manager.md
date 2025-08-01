# frontend-context-manager.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/4_communication/frontend-context-manager.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Frontend Context Manager handling agent awareness of frontend state implementing the semantic separation between agent awareness and data operations. Provides comprehensive frontend context retrieval, action execution, real-time context updates, and cached context management. Serves as the primary communication bridge between backend agents and frontend components through AG-UI event system.

## System Integration
### Imports
- **EventEmitter**: Node.js EventEmitter for event-driven communication

### Exports
- **FrontendContextManager**: Main context manager class extending EventEmitter

### Dependencies
- **AG-UI Gateway**: Event emission for frontend communication
- **Frontend Components**: Context providers and action handlers
- **Event System**: Node.js EventEmitter for real-time communication

### Dependents
- **Epi-Logos Orchestrator**: Frontend context awareness for orchestration decisions
- **Universal Orchestration Pipeline**: Frontend state integration in workflows
- **Agent Services**: Frontend context for agent decision making

## Key Functions/Components
### FrontendContextManager Class (Lines 8-217)
**Purpose**: Main context manager class providing frontend awareness and communication
**Parameters**: None (extends EventEmitter)
**Returns**: FrontendContextManager instance
**Notes**: 217 lines implementing comprehensive frontend context management

### getFrontendContext(componentId, contextType) (Lines 21-53)
**Purpose**: Get frontend context implementing core agent awareness function
**Parameters**: componentId (string), contextType (string, default: 'fullState')
**Returns**: Promise<Object> - Frontend context data
**Notes**: Promise-based context retrieval with timeout handling and AG-UI event emission

### handleFrontendContextResponse(eventData) (Lines 58-81)
**Purpose**: Handle frontend context response from AG-UI events
**Parameters**: eventData (object) with requestId, context, error
**Returns**: void
**Notes**: Resolves pending context promises and caches active contexts

### executeFrontendAction(actionName, componentId, args) (Lines 86-104)
**Purpose**: Execute frontend action providing agent awareness of frontend capabilities
**Parameters**: actionName (string), componentId (string), args (object)
**Returns**: Promise<Object> - Action execution result
**Notes**: Fire-and-forget action execution through AG-UI events

### getCachedContext(componentId) (Lines 109-111)
**Purpose**: Get currently cached frontend context for component
**Parameters**: componentId (string)
**Returns**: Object|undefined - Cached context data
**Notes**: Direct cache access for performance optimization

### getAllActiveContexts() (Lines 116-118)
**Purpose**: Get all active contexts for agent universal awareness
**Parameters**: None
**Returns**: Object - All active contexts mapped by component ID
**Notes**: Comprehensive context overview for orchestration decisions

### cleanupRequest(requestId) (Lines 123-133)
**Purpose**: Clean up request resources including timeouts and promises
**Parameters**: requestId (string)
**Returns**: void
**Notes**: Resource cleanup to prevent memory leaks

### generateRequestId() (Lines 138-140)
**Purpose**: Generate unique request ID for context requests
**Parameters**: None
**Returns**: string - Unique request identifier
**Notes**: Timestamp and random string combination for uniqueness

### onContextChange(componentId, handler) (Lines 145-147)
**Purpose**: Register context change handler for real-time awareness
**Parameters**: componentId (string), handler (function)
**Returns**: void
**Notes**: Event-driven real-time context updates

## Data Flow
1. **Context Request**: Agent request → Request ID generation → AG-UI event emission → Promise creation
2. **Frontend Response**: Frontend context → AG-UI event → Response handling → Promise resolution → Context caching
3. **Action Execution**: Action request → AG-UI event emission → Frontend action execution → Success response
4. **Real-time Updates**: Frontend changes → Context change events → Handler execution → Cache updates
5. **Context Retrieval**: Cache lookup → Direct context access → Performance optimization

## Configuration
### Context Types
- **fullState**: Complete component state
- **document**: Document-specific context
- **coordinates**: Coordinate selection context
- **user**: User-specific context
- **analysis**: Analysis session context

### Request Management
- **defaultTimeout**: 30 seconds for context requests
- **requestId**: Unique identifier format: `context_{timestamp}_{random}`
- **Promise Management**: Pending request tracking with timeout handling
- **Cache Management**: Active context storage with timestamps

### AG-UI Events
- **frontend:getContext**: Request frontend context
- **frontend:invokeAction**: Execute frontend action
- **context:change**: Real-time context updates
- **context:response**: Frontend context response

### Component Integration
- **documentCanvas**: Document editing and analysis context
- **bimbaUpdateOverlay**: Coordinate selection context
- **meta2d/meta3d**: Visualization context
- **floatingAgent**: Agent interface context

## Testing
No explicit test files referenced, but includes comprehensive error handling and timeout management

## Related Files
### Core Dependencies
- **AG-UI Gateway**: Event emission and frontend communication
- **Frontend Components**: Context providers and action handlers

### Integration Points
- **Epi-Logos Orchestrator**: Frontend context awareness for orchestration
- **Universal Orchestration Pipeline**: Frontend state integration in workflows
- **Agent Services**: Frontend context for decision making

### Communication Architecture
- **Event-Driven**: EventEmitter-based real-time communication
- **Promise-Based**: Asynchronous context retrieval with timeout handling
- **Cache Management**: Performance optimization through context caching

## Development Notes
- **Semantic Separation**: Clear distinction between agent awareness and data operations
- **Event-Driven Architecture**: Real-time communication through EventEmitter pattern
- **Promise-Based Context**: Asynchronous context retrieval with proper error handling
- **Timeout Management**: Comprehensive timeout handling to prevent hanging requests
- **Cache Optimization**: Context caching for performance and reduced frontend load
- **Resource Cleanup**: Proper cleanup to prevent memory leaks and resource exhaustion
- **AG-UI Integration**: Deep integration with AG-UI event system for frontend communication
- **Real-time Awareness**: Live context updates for dynamic agent awareness
- **Error Resilience**: Comprehensive error handling with graceful degradation
- **Extensible Design**: Easy addition of new context types and action handlers
