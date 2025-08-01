# FloatingEpiLogosAgent.tsx - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal floating agent interface that provides access to all subsystem experts through intelligent routing. Implements a resizable, draggable chat interface that can invoke any subsystem agent based on context and user intent. Serves as the primary user interaction point for the Epi-Logos system, managing session history, context compacting, and real-time communication with the backend through WebSocket connections.

## System Integration
### Imports
- **React Hooks**: useState, useEffect, useRef, useCallback, useMemo for state management
- **Lucide Icons**: Minus, MessageCircle, Send, Settings, Archive, FileText for UI
- **Foundation Types**: AgentMessage, AgentSession, OrchestrationRequest/Response, FloatingAgentState
- **Services**: sessionHistoryService, contextCompactingService, webSocketService
- **Components**: GenerativeUIRenderer, ChatSessionManager
- **Hooks**: useUniversalDocumentState, useActiveMode, useCurrentExpert
- **Document Operations**: documentOperationsService

### Exports
- **FloatingEpiLogosAgent**: Main React component for universal agent interface

### Dependencies
- **WebSocket Service**: Real-time communication with backend A2A/AG-UI systems
- **Session Management**: MongoDB-backed session history and context compacting
- **Document State**: Universal document state management for context awareness
- **Active Mode Provider**: Expert routing based on current page/mode context
- **Generative UI**: Dynamic component rendering from agent responses

### Dependents
- **App.tsx**: Root application component that renders the floating agent
- **All Subsystem Pages**: Indirectly depends on agent for universal access
- **Session History**: Persistent storage of all agent interactions

## Key Functions/Components
### FloatingEpiLogosAgent Component (Lines 43-1279)
**Purpose**: Main React component implementing universal agent interface
**Parameters**: initialPosition (optional), onClose (optional)
**Returns**: JSX.Element - Rendered floating agent interface
**Notes**: 1279 lines implementing complete agent functionality with drag, resize, and chat

### initializeAgent() (Lines 139-149)
**Purpose**: Initialize agent and establish backend connections
**Parameters**: None
**Returns**: void
**Notes**: Sets up MongoDB integration, subscribes to AG-UI events, establishes WebSocket connections

### handleSendMessage() (Lines 200-280)
**Purpose**: Process user messages and route to appropriate expert
**Parameters**: None (uses inputMessage state)
**Returns**: Promise<void>
**Notes**: Orchestrates message sending, expert routing, and response handling

### handleOrchestrationRequest(message) (Lines 300-400)
**Purpose**: Create and send orchestration requests to backend
**Parameters**: message (string)
**Returns**: Promise<void>
**Notes**: Builds context-aware requests with document state and expert routing

### handleDragStart/handleDrag/handleDragEnd (Lines 500-600)
**Purpose**: Implement draggable interface functionality
**Parameters**: MouseEvent objects
**Returns**: void
**Notes**: Performance-optimized dragging with position constraints and smooth movement

### handleResize functions (Lines 700-800)
**Purpose**: Implement resizable interface functionality
**Parameters**: MouseEvent objects, resize direction
**Returns**: void
**Notes**: Multi-directional resizing with min/max constraints and responsive behavior

### renderMinimizedView() (Lines 900-950)
**Purpose**: Render collapsed circular agent bubble
**Parameters**: None
**Returns**: JSX.Element
**Notes**: Minimized state with hover effects and click-to-expand

### renderExpandedView() (Lines 950-1200)
**Purpose**: Render full chat interface with message history
**Parameters**: None
**Returns**: JSX.Element
**Notes**: Complete chat UI with message history, input field, and controls

## Data Flow
1. **Initialization**: Component mount → initializeAgent() → WebSocket connection → AG-UI subscription
2. **Message Flow**: User input → handleSendMessage() → orchestration request → backend routing → expert response
3. **Context Awareness**: Document state → expert routing → context-enhanced requests
4. **Session Management**: Messages → sessionHistoryService → MongoDB persistence → history retrieval
5. **Real-time Updates**: Backend events → WebSocket → AG-UI events → UI updates

## Configuration
### UI Configuration
- **Default Size**: 400x600px with min/max constraints
- **Position**: Bottom-right corner with viewport boundary constraints
- **Resize Handles**: 8-directional resizing support
- **Animation**: Smooth transitions for expand/collapse and drag operations

### WebSocket Configuration
- **AG-UI Events**: orchestration:response, agent:message, agent:state
- **Message Types**: OrchestrationRequest/Response with context metadata
- **Error Handling**: Automatic reconnection and fallback messaging

### Session Configuration
- **User ID**: 'default-user' (TODO: Replace with actual auth)
- **History Persistence**: MongoDB-backed session storage
- **Context Compacting**: Automatic context summarization for long conversations

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../0_foundation/index.ts` - Type definitions and constants
- `../3_services/SessionHistoryService.ts` - Session management
- `../3_services/ContextCompactingService.ts` - Context optimization
- `../3_services/webSocketService.ts` - Real-time communication

### UI Components
- `./ChatSessionManager.tsx` - Session management UI
- `../../shared/components/agent/GenerativeUIRenderer.tsx` - Dynamic UI rendering

### Context Providers
- `../4_contexts/ActiveModeProvider.tsx` - Expert routing context
- `../../subsystems/5_epii/1_hooks/useUniversalDocumentState.ts` - Document context

### Integration Points
- Backend A2A/AG-UI systems for agent communication
- MongoDB for session persistence
- All subsystem expert agents for routing

## Development Notes
- **Performance Optimization**: Uses refs for drag tracking to avoid re-renders
- **Context Awareness**: Integrates document state for intelligent expert routing
- **Responsive Design**: Adapts to different screen sizes with position constraints
- **Error Resilience**: Comprehensive error handling with user feedback
- **Accessibility**: Keyboard navigation and screen reader support
- **Memory Management**: Proper cleanup of event listeners and subscriptions
- **State Management**: Complex state with multiple UI modes and interaction states
- **Real-time Communication**: WebSocket integration with automatic reconnection
- **Session Persistence**: MongoDB integration for conversation history
- **Expert Routing**: Intelligent routing based on context and user intent
