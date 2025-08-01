# universal-orchestration-pipeline.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/2_pipelines/universal-orchestration-pipeline.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Universal Orchestration Pipeline orchestrating complex workflows across multiple subsystems for the Epi-Logos Agent. Manages sophisticated multi-stage pipelines including document analysis, multi-coordinate analysis, and cross-subsystem synthesis. Provides workflow management, stage tracking, and comprehensive orchestration capabilities with frontend context integration and knowledge base operations.

## System Integration
### Imports
- **Foundation Types**: SubsystemExperts, AgentRequestTypes, ContextFrames from types.mjs

### Exports
- **UniversalOrchestrationPipeline**: Main pipeline class for workflow orchestration

### Dependencies
- **Orchestrator**: Main orchestration service for subsystem delegation
- **Frontend Context Manager**: Frontend state and context management
- **Knowledge Base**: BPMCP tools and Bimba graph operations
- **Subsystem Experts**: Epii, Nara, Paramasiva, Anuttara subsystems

### Dependents
- **Epi-Logos Orchestrator**: Primary consumer for complex workflow execution
- **Agent Request Handlers**: Pipeline execution for multi-stage operations
- **Frontend Integration**: Workflow results and status updates

## Key Functions/Components
### UniversalOrchestrationPipeline Class (Lines 8-426)
**Purpose**: Main pipeline class orchestrating complex workflows across subsystems
**Parameters**: orchestrator (orchestration service), frontendContextManager (context service)
**Returns**: UniversalOrchestrationPipeline instance
**Notes**: 426 lines implementing comprehensive workflow orchestration

### executeDocumentAnalysisPipeline(request) (Lines 19-111)
**Purpose**: Orchestrate document analysis across epii, paramasiva, and nara subsystems
**Parameters**: request (object) with content, context, and analysis parameters
**Returns**: Promise<Object> - Workflow result with synthesis and metadata
**Notes**: 5-stage pipeline with frontend context, primary analysis, coordinate analysis, user context, synthesis

### executeMultiCoordinateAnalysisPipeline(request) (Lines 117-200)
**Purpose**: Handle document analysis across multiple user-specified coordinates
**Parameters**: request (object) with targetCoordinates and document
**Returns**: Promise<Object> - Multi-coordinate analysis results
**Notes**: Coordinate-specific analysis using BPMCP tools and knowledge base queries

### synthesizeDocumentAnalysis(primaryAnalysis, coordinateAnalysis, userContext, documentContext) (Lines 250-300)
**Purpose**: Synthesize results from multiple analysis stages into coherent output
**Parameters**: Analysis results from different subsystems and contexts
**Returns**: Promise<Object> - Synthesized analysis with integrated insights
**Notes**: Cross-subsystem synthesis with contextual integration

### updateWorkflowStage(workflowId, stageName, status, result) (Lines 350-370)
**Purpose**: Update workflow stage status and results
**Parameters**: workflowId, stageName, status, result
**Returns**: void
**Notes**: Workflow tracking and stage management

### generateWorkflowId(type) (Lines 380-390)
**Purpose**: Generate unique workflow identifier
**Parameters**: type (string) - workflow type
**Returns**: string - unique workflow ID
**Notes**: UUID-based workflow identification

### completeWorkflow(workflowId, result) (Lines 400-410)
**Purpose**: Mark workflow as completed with final results
**Parameters**: workflowId, result
**Returns**: void
**Notes**: Workflow completion and cleanup

### failWorkflow(workflowId, error) (Lines 415-425)
**Purpose**: Handle workflow failure with error logging
**Parameters**: workflowId, error
**Returns**: void
**Notes**: Error handling and workflow failure management

## Data Flow
1. **Pipeline Initiation**: Request received → Workflow ID generated → Workflow tracking initialized
2. **Frontend Context**: Context manager → Frontend state retrieval → Document/coordinate context
3. **Subsystem Delegation**: Expert selection → Request delegation → Subsystem processing → Results collection
4. **Knowledge Base Integration**: BPMCP queries → Bimba graph operations → Semantic analysis → Knowledge synthesis
5. **Cross-Subsystem Synthesis**: Multiple results → Integration logic → Synthesized output → Workflow completion

## Configuration
### Workflow Types
- **document-analysis**: Comprehensive document analysis across subsystems
- **multi-coordinate**: Multi-coordinate analysis with coordinate-specific insights
- **synthesis**: Cross-subsystem result synthesis and integration

### Pipeline Stages
#### Document Analysis Pipeline
1. **frontend-context**: Frontend document context retrieval
2. **primary-analysis**: Epii subsystem primary analysis
3. **coordinate-analysis**: Paramasiva coordinate analysis (if applicable)
4. **user-context**: Nara user context enrichment
5. **synthesis**: Cross-subsystem synthesis

#### Multi-Coordinate Pipeline
1. **coordinate-context**: Frontend coordinate selection context
2. **coordinate-analysis**: Per-coordinate BPMCP analysis
3. **semantic-analysis**: Knowledge base semantic processing
4. **synthesis**: Multi-coordinate result integration

### Subsystem Integration
- **Epii**: Primary document analysis and meta-perspective
- **Paramasiva**: Coordinate analysis and quaternary logic
- **Nara**: User context and personalization
- **Anuttara**: Foundational analysis (when needed)
- **Universal**: Cross-system coordination

## Testing
No explicit test files referenced, but includes comprehensive error handling and workflow tracking

## Related Files
### Core Dependencies
- **../0_foundation/types.mjs**: Foundation types and enums
- **Orchestrator**: Main orchestration service
- **Frontend Context Manager**: Frontend state management

### Integration Points
- **Epi-Logos Orchestrator**: Primary consumer for workflow execution
- **Subsystem Experts**: Epii, Nara, Paramasiva, Anuttara integration
- **Knowledge Base**: BPMCP tools and Bimba graph operations
- **Frontend Components**: Context retrieval and result delivery

### Pipeline Architecture
- **Workflow Management**: Comprehensive workflow tracking and management
- **Stage Orchestration**: Multi-stage pipeline execution with status tracking
- **Cross-Subsystem Integration**: Seamless integration across all subsystems

## Development Notes
- **Multi-Stage Orchestration**: Sophisticated pipeline management with stage tracking
- **Cross-Subsystem Integration**: Seamless coordination across all Epi-Logos subsystems
- **Frontend Context Integration**: Real-time frontend state and context retrieval
- **Knowledge Base Operations**: Direct BPMCP integration for coordinate-specific analysis
- **Workflow Tracking**: Comprehensive workflow status and stage management
- **Error Resilience**: Robust error handling with workflow failure management
- **Synthesis Capabilities**: Advanced cross-subsystem result synthesis
- **Configurable Pipelines**: Flexible pipeline configuration for different analysis types
- **Performance Optimization**: Efficient workflow execution with parallel processing where possible
- **Extensible Architecture**: Easy addition of new pipeline types and stages
