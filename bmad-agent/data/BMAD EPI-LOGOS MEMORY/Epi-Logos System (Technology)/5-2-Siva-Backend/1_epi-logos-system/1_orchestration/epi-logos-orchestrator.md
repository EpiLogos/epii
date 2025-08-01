# epi-logos-orchestrator.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/1_orchestration/epi-logos-orchestrator.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Epi-Logos Universal Orchestrator serving as the core orchestrating intelligence that coordinates all subsystem experts. Manages sophisticated request analysis, subsystem delegation, knowledge base integration, and response synthesis. Provides comprehensive orchestration capabilities with BPMCP integration, state management, and intelligent routing across all six subsystems (Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, Epii).

## System Integration
### Imports
- **Foundation Types**: SubsystemExperts, AgentRequestTypes, ContextFrames, OrchestrationStates from types.mjs
- **BPMCP Integration**: BPMCPAgentIntegration for knowledge base operations

### Exports
- **EpiLogosOrchestrator**: Main orchestrator class for subsystem coordination

### Dependencies
- **BPMCP Agent Integration**: Knowledge base queries and Bimba graph operations
- **Subsystem Expert Agents**: All six subsystem expert agents
- **Foundation Types**: Core type definitions and enums

### Dependents
- **Universal Orchestration Pipeline**: Primary consumer for workflow execution
- **Agent Request Handlers**: Orchestration for complex multi-subsystem requests
- **Frontend Integration**: Orchestrated responses and subsystem coordination

## Key Functions/Components
### EpiLogosOrchestrator Class (Lines 9-377)
**Purpose**: Main orchestrator class coordinating all subsystem experts with intelligent routing
**Parameters**: config (optional configuration object)
**Returns**: EpiLogosOrchestrator instance
**Notes**: 377 lines implementing comprehensive orchestration functionality

### initializeSubsystemExperts() (Lines 26-63)
**Purpose**: Initialize connections to all subsystem expert agents with capabilities mapping
**Parameters**: None
**Returns**: void
**Notes**: Maps all six subsystems with domains and capabilities for intelligent routing

### initializeBPMCP() (Lines 68-76)
**Purpose**: Initialize BPMCP knowledge integration for context-aware orchestration
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Establishes knowledge base connection for intelligent request analysis

### orchestrate(request) (Lines 81-107)
**Purpose**: Main orchestration method receiving user requests and coordinating responses
**Parameters**: request (object) with type, content, context
**Returns**: Promise<Object> - Orchestrated response with synthesis
**Notes**: Complete orchestration lifecycle with state management and error handling

### analyzeRequest(request) (Lines 112-200)
**Purpose**: Analyze incoming request to determine which subsystems to engage
**Parameters**: request (object) with type, content, context
**Returns**: Promise<Object> - Orchestration plan with primary and supporting subsystems
**Notes**: Intelligent analysis using BPMCP knowledge base and context evaluation

### executeOrchestrationPlan(plan) (Lines 250-300)
**Purpose**: Execute orchestration plan by delegating to appropriate subsystems
**Parameters**: plan (object) with subsystem assignments and coordination strategy
**Returns**: Promise<Object> - Results from subsystem execution
**Notes**: Parallel and sequential subsystem coordination based on plan complexity

### synthesizeResponse(result) (Lines 320-350)
**Purpose**: Synthesize results from multiple subsystems into coherent response
**Parameters**: result (object) with subsystem outputs
**Returns**: Promise<Object> - Synthesized response with integrated insights
**Notes**: Cross-subsystem synthesis with knowledge integration

### delegateToSubsystem(subsystem, request) (Lines 360-377)
**Purpose**: Delegate specific request to target subsystem expert
**Parameters**: subsystem (enum), request (object)
**Returns**: Promise<Object> - Subsystem response
**Notes**: Direct subsystem delegation with error handling

## Data Flow
1. **Request Reception**: User request → Request analysis → Knowledge base query → Context evaluation
2. **Orchestration Planning**: Primary subsystem selection → Supporting subsystems → Coordination strategy
3. **Subsystem Delegation**: Plan execution → Parallel/sequential delegation → Result collection
4. **Response Synthesis**: Multiple results → Cross-subsystem integration → Coherent response
5. **State Management**: Orchestration states → Progress tracking → Error handling → Cleanup

## Configuration
### Subsystem Experts Mapping
- **Anuttara (#0)**: Transcendent void, void logic, proto analysis, foundational patterns
- **Paramasiva (#1)**: Quaternal logic, algebraic topology, logical structures, mathematical analysis
- **Parashakti (#2)**: Cosmic experientiality, experiential analysis, dynamic processing, flow coordination
- **Mahamaya (#3)**: Cosmic imagination, visualization, imagination synthesis, creative analysis
- **Nara (#4)**: Individualized cognition, user interaction, personal context, identity management
- **Epii (#5)**: Self awareness, document analysis, memory crystallization, meta reflection

### Orchestration States
- **IDLE**: Orchestrator ready for new requests
- **ANALYZING**: Request analysis and planning phase
- **DELEGATING**: Subsystem delegation and execution
- **SYNTHESIZING**: Cross-subsystem result synthesis
- **RESPONDING**: Final response preparation and delivery

### Request Types
- **ANALYSIS**: Document and content analysis requests
- **QUERY**: Information and knowledge queries
- **SYNTHESIS**: Cross-domain synthesis requests
- **COORDINATION**: Multi-subsystem coordination requests

## Testing
No explicit test files referenced, but includes comprehensive error handling and state management

## Related Files
### Core Dependencies
- **../0_foundation/types.mjs**: Foundation types and orchestration enums
- **../5_integration/bpmcp-agent-integration.mjs**: BPMCP knowledge base integration

### Integration Points
- **Universal Orchestration Pipeline**: Primary consumer for complex workflow execution
- **Subsystem Expert Agents**: All six subsystem agents for delegation
- **BPMCP Knowledge Base**: Context-aware request analysis and routing

### Orchestration Architecture
- **State Management**: Comprehensive orchestration state tracking
- **Subsystem Coordination**: Intelligent routing and delegation across all subsystems
- **Knowledge Integration**: BPMCP-powered context analysis and routing decisions

## Development Notes
- **Intelligent Routing**: Context-aware subsystem selection using BPMCP knowledge base
- **Comprehensive Subsystem Support**: Full integration with all six Epi-Logos subsystems
- **State Management**: Robust orchestration state tracking with error recovery
- **Knowledge Integration**: Deep BPMCP integration for context-aware orchestration
- **Parallel Coordination**: Support for both parallel and sequential subsystem delegation
- **Error Resilience**: Comprehensive error handling with graceful degradation
- **Extensible Architecture**: Easy addition of new subsystems and orchestration strategies
- **Performance Optimization**: Efficient subsystem delegation with minimal overhead
- **Context Preservation**: Intelligent context passing between subsystems
- **Response Synthesis**: Advanced cross-subsystem result integration and synthesis
