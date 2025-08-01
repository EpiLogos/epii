# epii_analysis_pipeline.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/epii_analysis_pipeline.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Main entry point for the Epii Analysis Pipeline implementing the complete QL (-) Analysis cycle. Orchestrates document analysis through six sequential stages (-5 through -0) corresponding to the QL cycle phases. Integrates with BPMCP service, AG-UI events, cache management, and stage-specific processing modules. Serves as the primary document analysis orchestrator for the Epii subsystem.

## System Integration
### Imports
- **Stage Functions**: runStageMinus5 through runStageMinus0 from individual stage modules
- **Cache Utils**: invalidateBimbaCache, invalidateMEFCache, clearLLMCache for cache management
- **AG-UI Integration**: emitStageStarted, emitStageFinished, emitStageError, emitPipelineFailure, emitBimbaUpdateSuggestions, emitMemoryOnboarding, hasAGUIContext
- **BPMCP Service**: Dynamic import of bpMCP.service.mjs for document operations

### Exports
- **runPipeline**: Main pipeline execution function
- **invalidateAllBimbaCaches**: Cache invalidation utility function

### Dependencies
- **Stage Modules**: Six individual stage processing modules (stage_minus5 through stage_minus0)
- **BPMCP Service**: Document retrieval, storage, and MCP tool operations
- **Cache System**: Bimba, MEF, and LLM cache management
- **AG-UI System**: Real-time frontend event emission
- **QL Cycle Framework**: Philosophical framework for analysis stages

### Dependents
- **BPMCP Service**: Calls runPipeline for document analysis
- **Backend Controllers**: Analysis route handlers
- **Document Analysis Workflows**: All document analysis operations
- **Frontend Components**: Receive AG-UI events from pipeline execution

## Key Functions/Components
### runPipeline(initialState) (Lines 49-337)
**Purpose**: Execute complete Epii Analysis Pipeline through all six stages
**Parameters**: initialState (object) with userId, targetCoordinate, documentId, graphData, bpMCPService
**Returns**: Promise<object> - Final state with notionUpdatePayload and epiiPerspective
**Notes**: 337 lines implementing complete pipeline orchestration with error handling and AG-UI integration

### invalidateAllBimbaCaches() (Lines 35-40)
**Purpose**: Invalidate all Bimba-related caches when structure is updated
**Parameters**: None
**Returns**: void
**Notes**: Clears Bimba, MEF, and LLM caches for data consistency

### Stage Execution Sequence (Lines 100-200)
**Purpose**: Execute six sequential analysis stages with AG-UI event emission
**Parameters**: Enhanced initial state with graphData
**Returns**: Stage output passed to next stage
**Notes**: Each stage emits start/finish events for frontend tracking

### Parameter Validation (Lines 54-72)
**Purpose**: Validate required parameters and import BPMCP service if needed
**Parameters**: initialState object
**Returns**: Enhanced state with required services
**Notes**: Ensures userId and document identification, imports bpMCPService dynamically

### Error Handling (Lines 250-337)
**Purpose**: Comprehensive error handling with AG-UI event emission
**Parameters**: Error objects and current stage context
**Returns**: Error responses with stage information
**Notes**: Emits pipeline failure events and provides detailed error context

## Data Flow
1. **Pipeline Initialization**: Parameters validated → BPMCP service imported → Initial state enhanced
2. **Stage Execution**: Stage -5 (Fetch) → Stage -4 (Contextualize) → Stage -3 (Integrate) → Stage -2 (Relate) → Stage -1 (Define) → Stage -0 (Synthesize)
3. **AG-UI Integration**: Stage start events → Processing → Stage finish events → Frontend updates
4. **Error Management**: Errors caught → AG-UI error events → Pipeline failure emission
5. **Final Output**: notionUpdatePayload generated → epiiPerspective created → Results returned

## Configuration
### Required Parameters
- **userId**: User identification for analysis context
- **targetCoordinate**: Bimba coordinate for analysis focus
- **documentId/fileId/documentContent**: Document identification or content

### Optional Parameters
- **graphData**: Graph context for enhanced analysis (defaults to empty graph)
- **bpMCPService**: BPMCP service instance (imported if not provided)

### Stage Configuration
- **QL Cycle Mapping**: Stages -5 through -0 correspond to QL cycle phases +0 through +5
- **AG-UI Events**: Real-time event emission for frontend tracking
- **Cache Management**: Automatic cache invalidation for data consistency

## Testing
No explicit test files referenced, but includes comprehensive logging and error handling

## Related Files
### Stage Modules
- `./stages/stage_minus5.mjs` - Document fetching and preparation
- `./stages/stage_minus4.mjs` - Context gathering and Bimba integration
- `./stages/stage_minus3.mjs` - Document chunking and LightRAG integration
- `./stages/stage_minus2.mjs` - Concept analysis and pattern identification
- `./stages/stage_minus1.mjs` - Core element definition
- `./stages/stage_minus0.mjs` - Payload synthesis and finalization

### Core Dependencies
- `../../../../databases/bpmcp/bpMCP.service.mjs` - BPMCP service integration
- `../../../../databases/shared/utils/cache.utils.mjs` - Cache management utilities
- `../../../../databases/shared/utils/agui-integration.mjs` - AG-UI event system

### Integration Points
- **BPMCP Service**: Primary interface for document operations
- **Frontend AG-UI**: Real-time pipeline status updates
- **Cache System**: Data consistency and performance optimization

## Development Notes
- **QL Cycle Implementation**: Follows philosophical QL (-) Analysis cycle with stage correspondence
- **Modular Architecture**: Each stage is a separate module for maintainability
- **Error Resilience**: Comprehensive error handling with detailed context
- **AG-UI Integration**: Real-time frontend communication for user experience
- **Cache Management**: Intelligent cache invalidation for data consistency
- **Dynamic Imports**: BPMCP service imported dynamically if not provided
- **State Enhancement**: Initial state enhanced with required defaults
- **Logging Strategy**: Extensive logging for debugging and monitoring
- **Parameter Flexibility**: Supports multiple document identification methods
- **Event-Driven Architecture**: AG-UI events for real-time frontend updates
