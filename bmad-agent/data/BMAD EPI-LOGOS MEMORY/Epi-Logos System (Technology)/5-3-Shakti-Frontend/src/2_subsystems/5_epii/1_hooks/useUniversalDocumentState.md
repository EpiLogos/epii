# useUniversalDocumentState.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/5_epii/1_hooks/useUniversalDocumentState.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal Document State React hook providing the same interface as the old EpiiContext but powered by the universal AG-UI StateDelta event system. Replaces useEpii() and useEpiiAnalysis() hooks with comprehensive document management, selection handling, analysis session tracking, and real-time state synchronization. Serves as the primary document state management interface for the Epii subsystem.

## System Integration
### Imports
- **React Hooks**: useState, useEffect, useCallback, useRef for hook implementation
- **Universal Document State**: universalDocumentState service and type definitions
- **Type Definitions**: UniversalDocumentState, UniversalDocument, DocumentSelection, AnalysisSession, ChatMessage

### Exports
- **DocumentStateHook**: Interface defining the complete hook API
- **useUniversalDocumentState**: Main React hook for document state management

### Dependencies
- **Universal Document State Service**: Core state management service
- **AG-UI StateDelta System**: Event-driven state synchronization
- **React**: Hook implementation and lifecycle management

### Dependents
- **Document Canvas**: Primary consumer for document editing and analysis
- **Epii Components**: All Epii subsystem components requiring document state
- **Analysis Workflows**: Document analysis and session management
- **Selection Management**: Text selection and annotation features

## Key Functions/Components
### useUniversalDocumentState Hook (Lines 85-420)
**Purpose**: Main React hook providing comprehensive document state management
**Parameters**: None
**Returns**: DocumentStateHook - Complete document state interface
**Notes**: 420 lines implementing full document state management with real-time sync

### DocumentStateHook Interface (Lines 19-83)
**Purpose**: TypeScript interface defining complete hook API
**Parameters**: None
**Returns**: Interface specification
**Notes**: Comprehensive interface with state, actions, and utilities

### Document Management Actions (Lines 106-149)
**Purpose**: CRUD operations for document management
**Parameters**: Various document operations
**Returns**: void (state updates)
**Notes**: setCurrentDocument, addDocument, updateDocument, deleteDocument

### Selection Management (Lines 150-200)
**Purpose**: Text selection and annotation management
**Parameters**: Selection operations
**Returns**: void (state updates)
**Notes**: addSelection, updateSelection, deleteSelection, setCurrentSelection

### Analysis Session Management (Lines 250-300)
**Purpose**: Analysis session lifecycle management
**Parameters**: Session operations
**Returns**: string (session ID) or void
**Notes**: createAnalysisSession, updateAnalysisSession, deleteAnalysisSession

### State Synchronization (Lines 96-103)
**Purpose**: Real-time state synchronization with universal document state
**Parameters**: None
**Returns**: Cleanup function
**Notes**: Subscribes to state changes and updates React state

### Utility Functions (Lines 350-420)
**Purpose**: Helper functions for document and session queries
**Parameters**: Various query parameters
**Returns**: Filtered data arrays or individual items
**Notes**: getDocumentById, getDocumentsByCoordinate, getSelectionsByDocument

## Data Flow
1. **Hook Initialization**: Component mounts → Hook initializes → Universal state subscribed
2. **State Synchronization**: Universal state changes → Hook state updated → Component re-renders
3. **Action Dispatch**: User actions → Hook methods called → Universal state updated → Sync triggered
4. **Document Operations**: CRUD operations → State deltas emitted → Real-time updates propagated
5. **Selection Management**: Text selections → Selection state updated → Analysis sessions linked

## Configuration
### Hook State Structure
- **Documents**: Array of UniversalDocument objects
- **Current Document**: Active document reference
- **Selections**: Text selections and annotations
- **Analysis Sessions**: Document analysis session tracking
- **UI State**: Loading, error, and status message states

### Action Categories
- **Document Actions**: CRUD operations for documents
- **Selection Actions**: Text selection and annotation management
- **Session Actions**: Analysis session lifecycle management
- **UI Actions**: Loading, error, and status management
- **Utility Actions**: Query and helper functions

### Synchronization Settings
- **Real-time Updates**: AG-UI StateDelta event system
- **State Subscription**: Automatic React state synchronization
- **Error Handling**: Comprehensive error state management

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../1_services/universalDocumentState.ts` - Universal document state service
- React hooks and lifecycle management

### Integration Points
- **Document Canvas**: Primary consumer for document editing
- **Analysis Pipeline**: Document analysis and session management
- **Selection Components**: Text selection and annotation features

### State Management
- **AG-UI StateDelta System**: Event-driven state synchronization
- **Universal Document State**: Core state management service
- **React State**: Component-level state management

## Development Notes
- **Migration Path**: Replaces old EpiiContext with universal state system
- **Interface Compatibility**: Maintains same interface as old useEpii() hooks
- **Real-time Sync**: AG-UI StateDelta system for real-time state synchronization
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Error Resilience**: Comprehensive error handling and state validation
- **Performance Optimization**: useCallback for action memoization
- **State Consistency**: Ensures ID consistency between id and _id properties
- **Deprecation Handling**: Chat messages deprecated in favor of universal agent
- **Initialization Management**: Lazy initialization with ref tracking
- **Memory Management**: Proper subscription cleanup and state management
