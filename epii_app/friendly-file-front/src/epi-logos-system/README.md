# Epi-Logos System (Frontend)

**Bimba Coordinate**: Universal Agent System  
**Purpose**: Universal agent interface and coordination layer  
**Phase**: 2 Implementation (December 2024)

## Overview

The `epi-logos-system` directory contains the **universal Epi-Logos agent system** implemented in Phase 2. This system provides a floating agent interface that can operate across all subsystems while maintaining expert routing to appropriate domain specialists.

## Architecture

### Directory Structure (0-5 QL Organization)

```
epi-logos-system/
├── 0_foundation/          # Core types and interfaces
├── 1_components/          # Agent UI components  
├── 2_hooks/              # Agent-specific React hooks
├── 3_services/           # Session management and communication
├── 4_contexts/           # Expert routing context providers
└── 5_integration/        # System-wide integrations
```

## Core Components

### 1_components/

#### FloatingEpiLogosAgent.tsx
**Purpose**: Universal floating agent interface  
**Features**:
- Resizable and draggable with position anchoring
- Expert routing integration via ActiveModeProvider
- Session management integration
- Context-aware conversations

#### ChatSessionManager.tsx  
**Purpose**: Advanced session management interface  
**Features**:
- New session creation and management
- Session history with search and filtering
- Context compression and archival
- Export and bulk operations

#### SessionHistoryPanel.tsx
**Purpose**: Comprehensive session history interface  
**Features**:
- Chronological session listing
- Advanced search and filtering capabilities
- Session preview and metadata display
- Bulk session operations

### 3_services/

#### SessionRoutingService.ts
**Purpose**: Intelligent session routing based on context  
**Features**:
- Document selection → document-specific sessions
- Mode changes → expert-specific sessions  
- Seamless context transitions
- Session continuity management

#### ContextCompactingService.ts
**Purpose**: Session context compression and optimization  
**Features**:
- Intelligent conversation summarization
- Context preservation for long sessions
- Performance optimization for large histories

#### webSocketService.ts
**Purpose**: Real-time communication with backend agents  
**Features**:
- AG-UI event handling and emission
- WebSocket connection management
- Skill execution coordination
- Progress tracking and updates

### 4_contexts/

#### ActiveModeProvider.tsx
**Purpose**: Expert routing context for universal agent  
**Features**:
- Route-to-expert mapping (#0-5 subsystem awareness)
- Automatic mode detection from URL paths
- AG-UI event coordination for mode changes
- Universal integration across all subsystems

## Key Patterns

### Expert Routing Pattern
```typescript
const PAGE_TO_MODE_MAP: Record<string, ActiveModeContext> = {
  '/epii': {
    currentCoordinate: '#5',
    expertSkillId: 'epii-chat',
    modeCapabilities: ['document-analysis', 'bimba-updates']
  },
  '/meta3d': {
    currentCoordinate: '#1', 
    expertSkillId: 'paramasiva-chat',
    modeCapabilities: ['3d-visualization', 'topological-analysis']
  }
};
```

### Service Layer Architecture
```typescript
// Complex operations in services, clean React APIs
const EpiiStateService = new EventEmitter();
export const useEpiiContext = () => {
  // Clean React hook over service layer
  return { /* simplified interface */ };
};
```

### Session Management Flow
```typescript
// Intelligent context-aware routing
document.selection → DocumentSpecificSession
mode.change → ExpertSpecificSession  
manual.creation → UserControlledSession
```

## Integration Points

### With Subsystems
- **Universal Access**: Agent available from any subsystem page
- **Expert Routing**: Routes conversations to appropriate subsystem experts
- **Context Awareness**: Understands current subsystem capabilities and context

### With Backend  
- **WebSocket Communication**: Real-time AG-UI event coordination
- **Session Persistence**: MongoDB-based session storage and retrieval
- **Expert Orchestration**: Backend expert routing via A2A protocol

### With Back2Front
- **A2A Protocol**: Standard agent-to-agent communication
- **Skill Execution**: Coordinated skill execution across agent systems
- **State Synchronization**: Consistent state across communication layers

## Usage Examples

### Basic Agent Interaction
```typescript
import { FloatingEpiLogosAgent } from './1_components/FloatingEpiLogosAgent';

// Agent automatically available on all pages
<App>
  <ActiveModeProvider>
    <UserContextProvider>
      <Routes>...</Routes>
      <FloatingEpiLogosAgent />
    </UserContextProvider>
  </ActiveModeProvider>
</App>
```

### Expert Routing Usage
```typescript
import { useActiveMode } from './4_contexts/ActiveModeProvider';

const { currentCoordinate, expertSkillId } = useActiveMode();
// Agent automatically routes to appropriate expert based on current page
```

### Session Management
```typescript
import { SessionRoutingService } from './3_services/SessionRoutingService';

// Automatic session routing based on context
SessionRoutingService.handleDocumentSelection(documentId);
SessionRoutingService.handleModeChange('/epii');
```

## Development Guidelines

### Component Development
- Follow holographic architecture (each component contains complete QL structure)
- Implement proper TypeScript interfaces for all agent interactions
- Use AG-UI events for all cross-system communication
- Maintain backward compatibility during architectural transitions

### Service Layer Patterns
- Complex async operations belong in services (outside React constraints)
- React hooks provide clean APIs over service layer complexity
- EventEmitter pattern for service coordination
- AG-UI event bridging for global state coordination

### Expert Integration
- Respect subsystem boundaries while enabling universal coordination
- Route through chat skills as "personality skins" for universal agent
- Preserve subsystem expertise and domain specialization
- Enable cross-subsystem workflows through universal orchestration

## Phase 2 Achievements

### ✅ Universal Agent System
- Complete floating agent implementation with expert routing
- Advanced session management with compression and archival
- Service layer architecture separating concerns effectively

### ✅ Expert Routing Architecture  
- Automatic route-to-expert mapping based on Bimba coordinates
- AG-UI event coordination for seamless mode transitions
- Universal integration without disrupting subsystem integrity

### ✅ Service Layer Foundation
- EventEmitter-based services for complex operations
- Clean React context APIs over service complexity
- Backward compatibility bridge patterns

### ✅ Session Management Infrastructure
- Intelligent context-aware session routing
- Advanced UI with search, filtering, bulk operations
- Backend integration with MongoDB persistence

## Future Enhancements

### Planned Improvements
- Multi-agent conversation support (agent-to-agent dialogues)
- Enhanced context compression with semantic understanding
- Advanced routing based on conversation history and user preferences
- Integration with contemplative synthesis workflows

### Extension Points
- Additional expert routing patterns for new subsystems
- Enhanced session analytics and insights
- Collaborative session sharing and synchronization
- Advanced context understanding and prediction

---

**Implementation Status**: Phase 2 Complete  
**Last Updated**: December 2024  
**Next Phase**: Testing and refinement based on usage patterns