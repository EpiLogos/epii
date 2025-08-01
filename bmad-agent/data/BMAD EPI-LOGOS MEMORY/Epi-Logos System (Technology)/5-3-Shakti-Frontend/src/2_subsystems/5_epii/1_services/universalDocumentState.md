# universalDocumentState.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/universalDocumentState.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal Document State Management service replacing EpiiContext with AG-UI StateDelta event-driven state management. Centralizes all document state through webSocketService AG-UI events, eliminating the need for local React Context and providing universal access. Manages documents, selections, analysis sessions, and chat messages with real-time synchronization across the application.

## System Integration
### Imports
- **WebSocket Service**: emitAGUIEvent, onAGUIEvent, offAGUIEvent for AG-UI event handling
- **Document Cache Service**: documentCacheService for performance optimization
- **Document State Service**: documentStateService for state persistence

### Exports
- **UniversalDocument**: Interface for document structure
- **DocumentSelection**: Interface for text selections
- **AnalysisSession**: Interface for analysis sessions
- **ChatMessage**: Interface for chat messages (deprecated)
- **UniversalDocumentState**: Complete state interface
- **DocumentStateDelta**: AG-UI StateDelta event interface
- **UniversalDocumentStateManager**: Main state management class
- **universalDocumentState**: Singleton service instance

### Dependencies
- **WebSocket Service**: AG-UI event system for real-time state synchronization
- **Document Cache Service**: Performance optimization with caching
- **Document State Service**: State persistence and management

### Dependents
- **useUniversalDocumentState Hook**: React hook consuming this service
- **Document Canvas**: Primary consumer for document editing and analysis
- **All Epii Components**: Universal document state access across subsystem

## Key Functions/Components
### UniversalDocumentStateManager Class (Lines 109-587)
**Purpose**: Main state management class with AG-UI event integration
**Parameters**: None (singleton pattern)
**Returns**: UniversalDocumentStateManager instance
**Notes**: 587 lines implementing complete universal document state management

### State Interfaces (Lines 14-89)
**Purpose**: TypeScript interfaces defining complete state structure
**Parameters**: Various interface properties
**Returns**: Type definitions
**Notes**: Comprehensive interfaces for documents, selections, sessions, and state

### AG-UI StateDelta Interface (Lines 92-107)
**Purpose**: Event interface for AG-UI StateDelta document operations
**Parameters**: Event type, scope, operation, changes, metadata
**Returns**: StateDelta event structure
**Notes**: Standardized event format for document state changes

### initialize() (Lines 142-200)
**Purpose**: Initialize universal document state manager with event listeners
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Sets up AG-UI event listeners, initializes services, loads initial state

### setupEventListeners() (Lines 250-300)
**Purpose**: Set up AG-UI event listeners for document state changes
**Parameters**: None
**Returns**: void
**Notes**: Comprehensive event handling for all document operations

### emitStateDelta(delta) (Lines 350-380)
**Purpose**: Emit AG-UI StateDelta event for document state changes
**Parameters**: delta (DocumentStateDelta)
**Returns**: Promise<void>
**Notes**: Standardized event emission with metadata and error handling

### updateState(changes) (Lines 400-430)
**Purpose**: Update internal state and notify listeners
**Parameters**: changes (Partial<UniversalDocumentState>)
**Returns**: void
**Notes**: State updates with listener notification and timestamp tracking

### subscribe(callback) (Lines 450-470)
**Purpose**: Subscribe to state changes with callback function
**Parameters**: callback (function)
**Returns**: Unsubscribe function
**Notes**: Event subscription with automatic cleanup

### Document Operations (Lines 500-587)
**Purpose**: CRUD operations for documents with AG-UI event emission
**Parameters**: Various document operation parameters
**Returns**: Updated state or operation results
**Notes**: Complete document lifecycle management with event-driven updates

## Data Flow
1. **Initialization**: Service initialized → Event listeners setup → Initial state loaded → Ready for operations
2. **State Changes**: Operation triggered → State updated → StateDelta event emitted → Listeners notified
3. **Event Handling**: AG-UI event received → State changes applied → Cache updated → UI refreshed
4. **Synchronization**: External changes → Event received → State synchronized → Real-time updates
5. **Subscription**: Component subscribes → State changes → Callback triggered → Component updated

## Configuration
### State Structure
- **Documents**: Array of UniversalDocument objects with metadata
- **Selections**: Text selections with coordinates and notes
- **Analysis Sessions**: Document analysis session tracking
- **Chat Messages**: Deprecated in favor of universal agent
- **UI State**: Loading, error, and status message states

### AG-UI Event Types
- **StateDelta Events**: document, selection, analysis, chat, ui scopes
- **Operations**: create, update, delete, sync operations
- **Metadata**: Source, timestamp, bimbaCoordinate tracking

### Synchronization Settings
- **Real-time Updates**: AG-UI event-driven synchronization
- **Cache Integration**: Document cache service integration
- **Error Handling**: Comprehensive error state management

### Event Scopes
- **document**: Document CRUD operations
- **selection**: Text selection management
- **analysis**: Analysis session operations
- **chat**: Chat message handling (deprecated)
- **ui**: UI state management

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../../epi-logos-system/3_services/webSocketService.ts` - AG-UI event system
- `../../../shared/services/documentCacheService.ts` - Document caching
- `./documentStateService.ts` - State persistence

### Integration Points
- **useUniversalDocumentState Hook**: React hook integration
- **Document Canvas**: Primary consumer for document operations
- **AG-UI System**: Event-driven state synchronization

### Service Architecture
- **Universal Access**: System-wide document state management
- **Event-Driven**: AG-UI StateDelta event system integration
- **Cache Integration**: Performance optimization with caching

## Development Notes
- **EpiiContext Replacement**: Replaces local React Context with universal state management
- **AG-UI Integration**: Complete integration with AG-UI StateDelta event system
- **Real-time Synchronization**: Event-driven state synchronization across application
- **Performance Optimization**: Document cache service integration for performance
- **Type Safety**: Comprehensive TypeScript interfaces for all state structures
- **Error Resilience**: Comprehensive error handling and state validation
- **Singleton Pattern**: Single service instance for universal access
- **Event-Driven Architecture**: AG-UI event system for state management
- **Deprecation Handling**: Chat messages deprecated in favor of universal agent
- **State Persistence**: Integration with document state service for persistence
