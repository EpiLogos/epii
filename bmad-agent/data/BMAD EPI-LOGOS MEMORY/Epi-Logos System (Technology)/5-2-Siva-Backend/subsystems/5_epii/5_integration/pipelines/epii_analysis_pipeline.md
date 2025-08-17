# epii_analysis_pipeline.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/epii_analysis_pipeline.mjs`
**Bimba Coordinate**: `#5-5-3-1`
**Last Updated**: `2025-01-30`

## Purpose & Role
Epii Analysis Pipeline Main Entry Point providing comprehensive document analysis orchestration through QL (-) Analysis cycle with stage coordination and cache management. Handles pipeline execution, stage orchestration, cache invalidation, and comprehensive analysis workflow coordination. Serves as the primary analysis pipeline orchestrator enabling document processing, stage management, and advanced analysis coordination with AG-UI integration and error handling.

## System Integration
### Imports
- **Pipeline Stages**: runStageMinus5, runStageMinus4, runStageMinus3, runStageMinus2, runStageMinus1, runStageMinus0 from ./stages/ for complete analysis cycle
- **Cache Utilities**: invalidateBimbaCache, invalidateMEFCache, clearLLMCache from ../../../../databases/shared/utils/cache.utils.mjs for cache management
- **AG-UI Integration**: emitStageStarted, emitStageFinished, emitStageError, emitPipelineFailure, emitBimbaUpdateSuggestions, emitMemoryOnboarding, hasAGUIContext from ../../../../databases/shared/utils/agui-integration.mjs

### Exports
- **runEpiiAnalysisPipeline**: Main pipeline execution function for complete document analysis workflow
- **invalidateAllCaches**: Cache invalidation function for pipeline reset and cleanup
- **runPipelineStage**: Individual stage execution function for targeted analysis operations
- **getPipelineStatus**: Pipeline status retrieval function for monitoring and tracking

### Dependencies
- **Pipeline Stages**: All six analysis stages (-5 through -0) for complete QL analysis cycle
- **Cache Management**: Cache utilities for Bimba, MEF, and LLM cache invalidation and management
- **AG-UI Integration**: AG-UI event emission for real-time pipeline monitoring and coordination
- **Error Handling**: Comprehensive error handling and pipeline failure management

### Dependents
- **Analysis Controllers**: Analysis controllers consuming pipeline for document processing operations
- **API Endpoints**: API endpoints utilizing pipeline for analysis request handling
- **Automation Systems**: Automation systems requiring document analysis pipeline execution
- **Monitoring Services**: Monitoring services tracking pipeline execution and performance

## Key Functions/Components
### runEpiiAnalysisPipeline Function (Lines 80-250)
**Purpose**: Main pipeline execution function orchestrating complete document analysis through QL (-) Analysis cycle
**Parameters**: analysisRequest (object) - Analysis request with document, context, and configuration parameters
**Returns**: Promise<object> - Complete analysis results with stage outputs and comprehensive analysis data
**Notes**: 337 lines implementing comprehensive analysis pipeline with stage orchestration and advanced coordination

### QL Analysis Cycle Stages (Lines 8-14)
**Purpose**: Defines complete QL (-) Analysis cycle with six stages corresponding to positive QL coordinates
**Parameters**: Stage progression from -5 (Fetch Document) through -0 (Synthesize Payload)
**Returns**: Structured analysis cycle with comprehensive document processing and synthesis
**Notes**: Advanced QL cycle implementation with stage correspondence and comprehensive analysis workflow

### invalidateAllCaches Function (Lines 30-60)
**Purpose**: Invalidates all caches related to Bimba data, MEF templates, and LLM responses for pipeline reset
**Parameters**: No parameters - comprehensive cache invalidation for pipeline cleanup
**Returns**: Promise<void> - Cache invalidation completion with cleanup confirmation
**Notes**: Comprehensive cache management ensuring clean pipeline execution and data consistency

### runPipelineStage Function (Lines 252-300)
**Purpose**: Executes individual pipeline stages with comprehensive error handling and AG-UI integration
**Parameters**: stageNumber (number), stageData (object), stageConfig (object) - Stage execution parameters
**Returns**: Promise<object> - Stage execution results with output data and status information
**Notes**: Advanced stage execution with error handling, monitoring, and AG-UI event coordination

### getPipelineStatus Function (Lines 302-337)
**Purpose**: Retrieves pipeline execution status with comprehensive monitoring and progress tracking
**Parameters**: pipelineId (string), statusConfig (object) - Pipeline identification and status configuration
**Returns**: Object with pipeline status, stage progress, and execution monitoring information
**Notes**: Comprehensive status tracking enabling real-time pipeline monitoring and progress assessment

## Data Flow
1. **Pipeline Initiation**: Analysis request → Pipeline configuration → Cache invalidation → Stage preparation → Execution start
2. **Stage Execution**: Stage -5 → Stage -4 → Stage -3 → Stage -2 → Stage -1 → Stage -0 → Analysis completion
3. **AG-UI Integration**: Stage events → AG-UI emission → Real-time monitoring → Progress tracking → Status updates
4. **Cache Management**: Cache invalidation → Clean execution → Result caching → Performance optimization → Data consistency
5. **Error Handling**: Error detection → Error emission → Recovery processing → Pipeline resilience → Graceful failure
6. **Result Synthesis**: Stage outputs → Result consolidation → Final synthesis → Analysis delivery → Pipeline completion

## Configuration
### Pipeline Configuration
- **QL Analysis Cycle**: Complete QL (-) Analysis cycle with six stages and comprehensive document processing
- **Stage Orchestration**: Advanced stage orchestration with sequential execution and data flow management
- **Cache Management**: Comprehensive cache invalidation and management for clean pipeline execution
- **AG-UI Integration**: Real-time AG-UI event emission for monitoring and progress tracking

### Stage Configuration
- **Stage -5**: Document fetch and initialization with source preparation and context setup
- **Stage -4**: Context analysis and document preparation with comprehensive contextualization
- **Stage -3**: Structure integration and RAG preparation with knowledge base coordination
- **Stage -2**: Chunk analysis and concept relation with enhanced context windows
- **Stage -1**: Core elements synthesis and analysis consolidation with insight generation
- **Stage -0**: Final synthesis and payload generation with comprehensive result formatting

### Integration Configuration
- **Error Handling**: Comprehensive error handling with pipeline failure management and recovery
- **Monitoring Integration**: Real-time monitoring with AG-UI integration and progress tracking
- **Cache Coordination**: Cache management with invalidation strategies and performance optimization
- **Status Tracking**: Pipeline status tracking with comprehensive monitoring and progress assessment

## Testing
Analysis pipeline testing available in subsystems/5_epii/tests/integration/ directory with comprehensive pipeline execution and stage coordination testing

## Related Files
### Core Dependencies
- **./stages/**: All six pipeline stages for complete QL analysis cycle execution
- **../../../../databases/shared/utils/cache.utils.mjs**: Cache management utilities for pipeline optimization
- **../../../../databases/shared/utils/agui-integration.mjs**: AG-UI integration for real-time monitoring

### Integration Points
- **../../4_controllers/analysis.controller.mjs**: Analysis controllers consuming pipeline for operations
- **../../2_services/**: Analysis services supporting pipeline execution and coordination
- **API Endpoints**: API endpoints utilizing pipeline for analysis request handling
- **Monitoring Systems**: Systems tracking pipeline execution and performance

### System Architecture
- **Pipeline Orchestration**: Primary pipeline orchestration for complete document analysis workflow
- **Stage Coordination**: Advanced stage coordination with sequential execution and data flow
- **Cache Management**: Comprehensive cache management with invalidation and optimization
- **AG-UI Integration**: Real-time monitoring integration with AG-UI event emission and tracking

## Development Notes
- **Pipeline Orchestration Excellence**: Comprehensive analysis pipeline enabling complete document analysis through QL (-) Analysis cycle
- **QL Analysis Cycle**: Advanced QL cycle implementation with six stages and comprehensive document processing workflow
- **Stage Coordination**: Sophisticated stage orchestration with sequential execution and comprehensive data flow management
- **Cache Management**: Advanced cache management with invalidation strategies and performance optimization
- **AG-UI Integration**: Real-time AG-UI integration with event emission and comprehensive monitoring capabilities
- **Error Handling Resilience**: Comprehensive error handling ensuring pipeline resilience and graceful failure management
- **Development Support**: Clear pipeline boundaries and comprehensive analysis workflow management
- **Production Pipeline**: Scalable analysis pipeline suitable for production document processing operations
- **Debugging Excellence**: Comprehensive pipeline monitoring and stage execution tracking
- **BPMCP Alignment**: Analysis pipeline integration with sophisticated Bimba coordinate system and QL analysis cycle support
