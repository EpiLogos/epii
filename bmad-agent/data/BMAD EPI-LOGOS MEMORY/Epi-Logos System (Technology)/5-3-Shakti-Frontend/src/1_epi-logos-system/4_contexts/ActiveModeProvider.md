# ActiveModeProvider.tsx - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/4_contexts/ActiveModeProvider.tsx`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Active Mode Context Provider implementing Expert-Oriented Routing pattern for intelligent agent routing. Tracks current active page/mode and communicates context to the Epi-Logos Agent for routing chat interactions to appropriate subsystem experts. Manages mode transitions, skill resolution, and capability mapping across all subsystems (Epii, Nara, Paramasiva, Anuttara, Universal).

## System Integration
### Imports
- **React**: createContext, useContext, useEffect, useState for context management
- **React Router**: useLocation for route-based mode detection
- **WebSocket Service**: emitAGUIEvent for real-time mode communication
- **Agent Registration Service**: agentRegistrationService for skill availability checking

### Exports
- **SubsystemMode**: Type definition for subsystem modes
- **ActiveModeContext**: Interface for mode context data
- **ActiveModeProvider**: React context provider component
- **useActiveMode**: Hook for accessing current mode context
- **useCurrentExpert**: Hook for accessing current expert information

### Dependencies
- **React Router**: Route-based mode detection and navigation
- **WebSocket Service**: Real-time communication with backend agents
- **Agent Registration Service**: Dynamic skill availability and resolution
- **Subsystem Architecture**: Integration with all five subsystems

### Dependents
- **FloatingEpiLogosAgent**: Uses mode context for intelligent routing
- **All Subsystem Pages**: Provide mode context to child components
- **Chat Components**: Route messages based on active mode
- **Navigation Components**: Display current mode and capabilities

## Key Functions/Components
### ActiveModeProvider Component (Lines 140-331)
**Purpose**: React context provider managing active mode state and transitions
**Parameters**: children (React.ReactNode)
**Returns**: JSX.Element with context provider
**Notes**: 331 lines implementing complete mode management with route detection

### resolveExpertSkillId(preferredSkillId) (Lines 103-121)
**Purpose**: Resolve preferred skill ID to actual available skill with fallback
**Parameters**: preferredSkillId (string)
**Returns**: Promise<string> - Resolved skill ID
**Notes**: Checks skill availability, provides fallback to best available chat skill

### getDefaultMode() (Lines 124-134)
**Purpose**: Get default universal mode with resolved skill ID
**Parameters**: None
**Returns**: Promise<ActiveModeContext> - Default mode context
**Notes**: Async resolution of universal chat skill with fallback

### PAGE_PREFERENCES Configuration (Lines 28-100)
**Purpose**: Static configuration mapping routes to preferred subsystem modes
**Parameters**: None
**Returns**: Configuration object with route mappings
**Notes**: Defines coordinates, skills, capabilities, names, and descriptions for each route

### Mode Resolution Effect (Lines 146-200)
**Purpose**: React effect handling route-based mode resolution and updates
**Parameters**: location.pathname
**Returns**: void
**Notes**: Async mode resolution with AG-UI event emission

### Context Hooks (Lines 250-331)
**Purpose**: Custom hooks for accessing mode context and expert information
**Parameters**: None
**Returns**: Mode context data and expert information
**Notes**: useActiveMode and useCurrentExpert hooks with error handling

## Data Flow
1. **Route Detection**: Location change → Route analysis → Page preference lookup
2. **Skill Resolution**: Preferred skill → Availability check → Fallback resolution → Final skill ID
3. **Mode Update**: Resolved mode → Context state update → AG-UI event emission
4. **Context Consumption**: Components access context → Mode-aware behavior → Expert routing
5. **Real-time Updates**: Mode changes → WebSocket events → Backend notification

## Configuration
### Page Preferences
- **Epii (/epii)**: Coordinate #5, epii-chat skill, document analysis capabilities
- **Nara (/chat)**: Coordinate #4, nara-chat skill, user context capabilities
- **Paramasiva (/meta3d)**: Coordinate #1, paramasiva-chat skill, 3D visualization capabilities
- **Anuttara (/meta2d)**: Coordinate #0, anuttara-chat skill, 2D visualization capabilities
- **Universal (/files)**: Coordinate #, universal-chat skill, cross-system capabilities

### Mode Context Structure
- **currentMode**: SubsystemMode enum value
- **currentCoordinate**: Bimba coordinate string
- **expertSkillId**: Resolved skill ID for routing
- **modeCapabilities**: Array of capability strings
- **modeName**: Human-readable mode name
- **modeDescription**: Detailed mode description

### Skill Resolution
- **Preferred Skills**: Route-specific preferred skill IDs
- **Availability Checking**: Dynamic skill availability validation
- **Fallback Strategy**: Best available chat skill resolution
- **Hard Fallback**: epii-chat as ultimate fallback

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../3_services/webSocketService.ts` - Real-time communication with backend
- `../3_services/AgentRegistrationService.ts` - Skill availability and resolution

### Integration Points
- **FloatingEpiLogosAgent**: Primary consumer for intelligent routing
- **Subsystem Pages**: All pages provide mode context
- **Chat Components**: Route messages based on active mode

### Context Consumers
- All components requiring mode-aware behavior
- Navigation components displaying current mode
- Agent routing components

## Development Notes
- **Expert-Oriented Routing**: Implements intelligent routing based on page context
- **Dynamic Skill Resolution**: Runtime skill availability checking with fallbacks
- **Real-time Communication**: AG-UI events for backend mode synchronization
- **Route-Based Detection**: Automatic mode detection from URL paths
- **Capability Mapping**: Each mode defines specific capabilities for agent routing
- **Error Resilience**: Comprehensive fallback strategy for skill resolution
- **Context Architecture**: Clean React context pattern with custom hooks
- **Async Resolution**: Proper async handling for skill availability checking
- **Type Safety**: Full TypeScript integration with comprehensive type definitions
- **Subsystem Integration**: Complete integration with all five subsystem modes
