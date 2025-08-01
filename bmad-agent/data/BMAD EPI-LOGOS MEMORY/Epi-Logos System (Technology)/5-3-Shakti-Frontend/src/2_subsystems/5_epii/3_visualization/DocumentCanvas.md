# DocumentCanvas.tsx - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Primary document editing and analysis interface for the Epii subsystem. Provides a comprehensive canvas for document viewing, editing, analysis orchestration, and results visualization. Integrates with the universal document state, analysis pipeline, and Notion crystallization workflow. Serves as the main user interface for document-centric operations within the Epii coordinate system (#5-3-4.5-3).

## System Integration
### Imports
- **React Hooks**: useState, useEffect, useRef for component state management
- **Lucide Icons**: FileText, Save, AlertCircle, Loader, PenTool, Trash2, Sparkles, Settings, X, ChevronUp, ChevronDown
- **Components**: DocumentViewer, DocumentControls, AnalysisResultsPanel, CrystalliseToNotionOverlay
- **Types**: TextSelection, NotionUpdatePayload from epiiTypes
- **Hooks**: useUniversalDocumentState, useEpii for state management
- **Services**: documentService, documentCacheService, webSocketService
- **Utilities**: payloadSyncService for Notion integration

### Exports
- **DocumentCanvas**: Main React component for document editing and analysis interface

### Dependencies
- **Universal Document State**: Document state management across the application
- **Epii Context**: Subsystem-specific state and dispatch functions
- **Document Services**: Document CRUD operations and caching
- **WebSocket Service**: Real-time communication for analysis pipeline
- **Analysis Pipeline**: Backend analysis orchestration
- **Notion Integration**: Content crystallization to Notion pages

### Dependents
- **Epii Pages**: Main Epii interface pages that render the document canvas
- **Document Workflow**: Document management and analysis workflows
- **Analysis Sessions**: Analysis session management and tracking

## Key Functions/Components
### DocumentCanvas Component (Lines 32-1634)
**Purpose**: Main React component implementing document editing and analysis interface
**Parameters**: userId (string), onDocumentDeleted (optional), onOpenBimbaUpdate (optional)
**Returns**: JSX.Element - Complete document canvas interface
**Notes**: 1634 lines implementing comprehensive document functionality

### startAnalysis() (Lines 103-143)
**Purpose**: Initiate document analysis pipeline with target coordinate
**Parameters**: None (uses component state)
**Returns**: Promise<void>
**Notes**: Creates analysis session, integrates with WebSocket service, handles analysis orchestration

### crystallizeResults() (Lines 145-200)
**Purpose**: Crystallize analysis results to Notion pages
**Parameters**: None (uses latest analysis session)
**Returns**: Promise<boolean> - Success status
**Notes**: Processes analysis results and creates Notion content blocks

### Document State Bridge (Lines 36-73)
**Purpose**: Bridge between EpiiContext and Universal Document State
**Parameters**: None
**Returns**: Unified document state
**Notes**: Temporary bridge for Epic 3 migration, ensures ID consistency

### Analysis Session Management (Lines 95-101)
**Purpose**: Manage analysis sessions for current document
**Parameters**: None
**Returns**: Latest analysis session or null
**Notes**: Filters and sorts sessions by document ID and modification date

### Document Type Detection (Lines 82-84)
**Purpose**: Detect if current document is a pratibimba document
**Parameters**: None
**Returns**: boolean - isPratibimba flag
**Notes**: Used for conditional rendering and behavior

## Data Flow
1. **Component Initialization**: Props received → State initialized → Document state bridged → Current document resolved
2. **Document Loading**: Document selected → Universal state updated → Canvas refreshed → Analysis sessions loaded
3. **Analysis Workflow**: Target coordinate set → Analysis started → Session created → WebSocket communication → Results processed
4. **Crystallization**: Analysis completed → Results processed → Notion payload created → Content crystallized
5. **State Management**: Document changes → State updated → UI refreshed → Cache updated

## Configuration
### Component Props
- **userId**: Required string for user identification
- **onDocumentDeleted**: Optional callback for document deletion events
- **onOpenBimbaUpdate**: Optional callback for Bimba coordinate updates

### State Management
- **Document State**: Universal document state with Epii context bridge
- **Analysis State**: Local analysis state with session management
- **UI State**: Loading, error, and status message states

### Integration Settings
- **WebSocket**: Real-time communication for analysis pipeline
- **Notion**: Content crystallization configuration
- **Cache**: Document caching for performance optimization

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Components
- `./DocumentViewer.tsx` - Document content viewing and editing
- `./DocumentControls.tsx` - Document operation controls
- `./AnalysisResultsPanel.tsx` - Analysis results visualization
- `./CrystalliseToNotionOverlay.tsx` - Notion crystallization interface

### State Management
- `../1_hooks/useUniversalDocumentState.ts` - Universal document state hook
- `../4_context/EpiiContext.tsx` - Epii subsystem context
- `../0_foundation/epiiTypes.ts` - Type definitions

### Services
- `../1_services/documentService.ts` - Document CRUD operations
- `../1_services/payloadSyncService.ts` - Notion payload processing
- `../../../shared/services/documentCacheService.ts` - Document caching
- `../../../epi-logos-system/3_services/webSocketService.ts` - WebSocket communication

## Development Notes
- **State Bridge**: Temporary bridge between EpiiContext and Universal Document State for Epic 3 migration
- **ID Consistency**: Ensures both id and _id properties are available for document compatibility
- **Analysis Integration**: Full integration with backend analysis pipeline via WebSocket
- **Notion Crystallization**: Complete workflow for crystallizing analysis results to Notion
- **Error Handling**: Comprehensive error handling with user feedback
- **Performance**: Document caching and optimized state management
- **Responsive Design**: Adaptive interface for different screen sizes
- **Real-time Updates**: WebSocket integration for live analysis updates
- **Session Management**: Robust analysis session tracking and management
- **Type Safety**: Full TypeScript integration with comprehensive type definitions
