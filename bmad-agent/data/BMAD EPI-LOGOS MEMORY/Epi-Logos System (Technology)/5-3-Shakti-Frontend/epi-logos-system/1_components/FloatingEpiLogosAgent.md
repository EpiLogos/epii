# FloatingEpiLogosAgent.tsx - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Floating Epi-Logos Agent Component providing universal agent interface that can invoke any subsystem with comprehensive orchestration capabilities and real-time communication. Handles agent session management, WebSocket communication, generative UI rendering, and cross-subsystem orchestration coordination. Serves as the primary frontend agent interface enabling universal subsystem invocation, session persistence, and comprehensive agent interaction with AG-UI integration and advanced state management.

## System Integration
### Imports
- **React Core**: React hooks (useState, useEffect, useRef, useCallback, useMemo) for component state management
- **Icons**: Lucide React icons (Minus, MessageCircle, Send, Settings, Archive, FileText) for UI elements
- **Foundation Types**: AgentMessage, AgentSession, OrchestrationRequest, OrchestrationResponse, FloatingAgentState, OrchestrationStates, UI_CONFIG, EPI_LOGOS_AGENT_ID from ../0_foundation
- **Services**: sessionHistoryService, contextCompactingService, webSocketService for agent functionality
- **UI Components**: GenerativeUIRenderer for dynamic UI rendering and agent interaction
- **Hooks**: useUniversalDocumentState, useActiveMode, useCurrentExpert for state management
- **Components**: ChatSessionManager for session management integration

### Exports
- **FloatingEpiLogosAgent**: Main floating agent component for universal subsystem invocation
- **FloatingEpiLogosAgentProps**: Component props interface for agent configuration

### Dependencies
- **Session Services**: Session history and context compacting services for conversation persistence
- **WebSocket Services**: Real-time communication services for backend integration
- **Document Services**: Universal document state management and operations
- **Agent Context**: Active mode and expert selection context for subsystem coordination
- **UI Rendering**: Generative UI rendering for dynamic agent interface

### Dependents
- **Main Application**: Primary agent interface for universal subsystem access
- **Subsystem Integration**: Universal interface for all subsystem expert invocation
- **Session Management**: Agent session persistence and conversation management
- **Real-time Communication**: WebSocket-based real-time agent communication

## Key Functions/Components
### FloatingEpiLogosAgent Component (Lines 27-1289)
**Purpose**: Main floating agent component providing universal subsystem invocation interface
**Parameters**: FloatingEpiLogosAgentProps with initialPosition and onClose callback
**Returns**: React component with floating agent interface and universal orchestration capabilities
**Notes**: 1289 lines implementing comprehensive floating agent with universal subsystem access and advanced state management

### Component State Management (Lines 32-80)
**Purpose**: Manages comprehensive agent state including position, visibility, sessions, and orchestration
**Parameters**: React state hooks for agent state management
**Returns**: State management for floating agent interface and orchestration coordination
**Notes**: Advanced state management with position tracking, session management, and orchestration state coordination

### WebSocket Integration (Lines 82-150)
**Purpose**: Integrates WebSocket services for real-time agent communication and AG-UI events
**Parameters**: WebSocket service integration with event subscription and message handling
**Returns**: Real-time communication capabilities for agent interaction and backend coordination
**Notes**: Comprehensive WebSocket integration with AG-UI event handling and real-time communication

### Session Management Integration (Lines 152-220)
**Purpose**: Integrates session history and context compacting services for conversation persistence
**Parameters**: Session services integration with history management and context compacting
**Returns**: Session persistence and conversation management for agent interactions
**Notes**: Advanced session management with conversation persistence and context optimization

### Orchestration Request Handling (Lines 222-320)
**Purpose**: Handles orchestration requests for universal subsystem invocation and coordination
**Parameters**: OrchestrationRequest with subsystem requirements and agent context
**Returns**: OrchestrationResponse with subsystem coordination results and agent responses
**Notes**: Comprehensive orchestration handling with universal subsystem access and coordination management

### Generative UI Rendering (Lines 322-420)
**Purpose**: Renders dynamic UI components based on agent responses and generative content
**Parameters**: GenerativeUIComponent data and rendering context
**Returns**: Dynamic UI rendering for agent interface and interaction components
**Notes**: Advanced generative UI rendering enabling dynamic agent interface and content presentation

### Document State Integration (Lines 422-520)
**Purpose**: Integrates universal document state management for document-aware agent operations
**Parameters**: Document state hooks and operations service integration
**Returns**: Document-aware agent capabilities with universal document access
**Notes**: Comprehensive document integration enabling document-aware agent operations and state management

### Agent Context Management (Lines 522-620)
**Purpose**: Manages active mode and expert selection context for subsystem coordination
**Parameters**: Active mode and current expert context hooks
**Returns**: Context-aware agent operations with subsystem expert coordination
**Notes**: Advanced context management enabling subsystem-aware agent operations and expert coordination

### Message Processing (Lines 622-720)
**Purpose**: Processes agent messages with comprehensive formatting and response handling
**Parameters**: AgentMessage objects with content, type, and metadata
**Returns**: Processed messages with formatting and response coordination
**Notes**: Comprehensive message processing with formatting, validation, and response handling

### UI Event Handling (Lines 722-820)
**Purpose**: Handles UI events including drag, resize, minimize, and interaction events
**Parameters**: UI event objects with event data and interaction context
**Returns**: UI event processing with interface state management and user interaction handling
**Notes**: Advanced UI event handling enabling draggable, resizable floating agent interface

### Session Persistence (Lines 822-920)
**Purpose**: Manages session persistence across page reloads and browser sessions
**Parameters**: Session data and persistence configuration
**Returns**: Session persistence with conversation continuity and state restoration
**Notes**: Comprehensive session persistence ensuring conversation continuity and agent state restoration

### Error Handling (Lines 922-1020)
**Purpose**: Handles agent errors with comprehensive error reporting and recovery
**Parameters**: Error objects and error context for agent operations
**Returns**: Error handling with user feedback and graceful failure recovery
**Notes**: Robust error handling ensuring agent resilience and user experience continuity

### Component Lifecycle Management (Lines 1022-1120)
**Purpose**: Manages component lifecycle including initialization, updates, and cleanup
**Parameters**: Component lifecycle hooks and cleanup functions
**Returns**: Component lifecycle management with resource cleanup and state management
**Notes**: Advanced lifecycle management ensuring proper component initialization and cleanup

### Accessibility Integration (Lines 1122-1220)
**Purpose**: Integrates accessibility features for agent interface and interaction
**Parameters**: Accessibility configuration and ARIA attributes
**Returns**: Accessible agent interface with keyboard navigation and screen reader support
**Notes**: Comprehensive accessibility integration ensuring inclusive agent interface design

### Performance Optimization (Lines 1222-1289)
**Purpose**: Optimizes component performance with memoization and efficient rendering
**Parameters**: Performance optimization hooks and rendering optimization
**Returns**: Optimized component performance with efficient state management and rendering
**Notes**: Advanced performance optimization ensuring smooth agent interface operation and responsiveness

## Data Flow
1. **Component Initialization**: Props processing → State initialization → Service integration → WebSocket connection → Agent readiness
2. **Orchestration Flow**: User input → Orchestration request → Subsystem coordination → Response processing → UI update
3. **Session Management**: Message creation → Session persistence → History management → Context compacting → Conversation continuity
4. **Real-time Communication**: WebSocket events → AG-UI processing → Backend coordination → Response handling → UI updates
5. **Document Integration**: Document state → Universal access → Agent awareness → Document operations → State synchronization
6. **UI Interaction**: User events → Event handling → State updates → Interface changes → User feedback

## Configuration
### Agent Configuration
- **Universal Access**: Universal subsystem invocation and orchestration capabilities
- **Session Management**: Comprehensive session persistence and conversation management
- **Real-time Communication**: WebSocket integration for real-time agent communication
- **Generative UI**: Dynamic UI rendering based on agent responses and content

### Interface Configuration
- **Floating Interface**: Draggable, resizable floating agent interface
- **Position Management**: Initial position configuration and position persistence
- **UI State**: Minimize, maximize, and visibility state management
- **Accessibility**: Comprehensive accessibility features and keyboard navigation

### Integration Configuration
- **WebSocket Services**: Real-time communication and AG-UI event integration
- **Document Services**: Universal document state management and operations
- **Context Services**: Active mode and expert selection context integration
- **Session Services**: Session history and context compacting service integration

## Testing
Frontend agent component testing available in epi-logos-system/tests/components/ directory with comprehensive agent interface and orchestration testing

## Related Files
### Core Dependencies
- **../0_foundation**: Foundation types and configuration for agent operations
- **../3_services/**: Session, context, and WebSocket services for agent functionality
- **../../shared/components/agent**: Generative UI rendering components
- **../../subsystems/5_epii/**: Document state and operations integration

### Integration Points
- **./ChatSessionManager.tsx**: Session management component integration
- **../4_contexts/ActiveModeProvider.tsx**: Active mode and expert context integration
- **Backend WebSocket Services**: Real-time communication with backend agent services
- **Universal Document System**: Document-aware agent operations and state management

### System Architecture
- **Universal Agent Interface**: Primary frontend interface for all subsystem access
- **Orchestration Coordination**: Universal orchestration request handling and subsystem coordination
- **Session Management**: Comprehensive conversation persistence and session management
- **Real-time Communication**: WebSocket-based real-time agent communication and coordination

## Development Notes
- **Universal Agent Interface**: Comprehensive floating agent interface enabling universal subsystem invocation and orchestration
- **Advanced State Management**: Sophisticated state management with position tracking, session persistence, and orchestration coordination
- **Real-time Communication Excellence**: Advanced WebSocket integration with AG-UI event handling and real-time backend coordination
- **Session Persistence**: Comprehensive session management with conversation continuity and context optimization
- **Generative UI Integration**: Dynamic UI rendering enabling adaptive agent interface and content presentation
- **Document Awareness**: Universal document state integration enabling document-aware agent operations
- **Accessibility Excellence**: Comprehensive accessibility features ensuring inclusive agent interface design
- **Performance Optimization**: Advanced performance optimization with memoization and efficient rendering
- **Error Handling Resilience**: Robust error handling ensuring agent resilience and user experience continuity
- **Development Support**: Clear component boundaries and comprehensive agent interface management
- **Production Interface**: Scalable floating agent interface suitable for production universal subsystem access
- **Debugging Excellence**: Comprehensive agent interface monitoring and orchestration tracking
- **BPMCP Alignment**: Universal agent interface integration with sophisticated Bimba coordinate system support
