# epii.expert.agent.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Epii Subsystem Expert Agent implementing coordinate #5-4-5 logic. Provides meta-perspective, self-awareness context, and integration principles for the QL cycle. Manages the Meta-Techne loop by guiding final synthesis/validation (Node +5/-0) and initial grounding (Node +0/-5). Integrates identity dynamics, philosophical framework, technical architecture, and understanding processes across all Bimba coordinates associated with #5.

## System Integration
### Imports
- **bpMCPService**: BPMCP service for knowledge retrieval and graph operations
- **uuid (v4)**: Unique ID generation for agent operations

### Exports
- **invokeEpiiExpertAgent**: Main agent invocation function
- **identifyRelevantCoordinates**: Coordinate identification logic
- **retrieveKnowledgeContext**: Knowledge retrieval orchestration
- **integrateKnowledge**: Knowledge integration and contextualization
- **applyKnowledgeToTask**: Task-specific knowledge application

### Dependencies
- **BPMCP MCP Server**: Core dependency for all knowledge operations
- **QL Cycle System**: Integrates with QL cycle state management
- **Bimba Coordinate System**: Relies on coordinate-based knowledge organization
- **Neo4j Graph Database**: Via BPMCP for structural knowledge retrieval

### Dependents
- **QL Cycle Orchestrator**: Invokes this agent during QL cycle execution
- **Analysis Pipeline**: Uses agent for document analysis validation
- **Backend Controllers**: Route handlers that trigger agent operations
- **Frontend Components**: Indirect dependency through API calls

## Key Functions/Components
### invokeEpiiExpertAgent(currentState, additionalInput) (Lines 21-56)
**Purpose**: Main agent entry point for QL cycle integration
**Parameters**: currentState (QL cycle state), additionalInput (task-specific data)
**Returns**: Promise<object> - Agent output with epiiPerspective, triggerSync, validationPassed
**Notes**: Orchestrates full agent workflow with comprehensive error handling

### identifyRelevantCoordinates(currentState, additionalInput, nodeNumber, isPositivePhase) (Lines 67-200)
**Purpose**: Identifies Bimba coordinates relevant to current QL cycle node and phase
**Parameters**: currentState, additionalInput, nodeNumber (0-5), isPositivePhase (boolean)
**Returns**: Promise<string[]> - Array of relevant Bimba coordinates
**Notes**: Maps QL nodes to specific coordinate combinations, handles synthesis (+) vs analysis (-) phases

### retrieveKnowledgeContext(relevantCoordinates, currentState) (Lines 202-280)
**Purpose**: Retrieves knowledge from multiple sources based on identified coordinates
**Parameters**: relevantCoordinates (string[]), currentState (object)
**Returns**: Promise<object> - Consolidated knowledge context from all sources
**Notes**: Orchestrates parallel knowledge retrieval from structural, semantic, and crystallized sources

### integrateKnowledge(knowledgeContext, currentState, additionalInput) (Lines 282-350)
**Purpose**: Integrates and contextualizes retrieved knowledge for current task
**Parameters**: knowledgeContext, currentState, additionalInput
**Returns**: object - Integrated context with synthesized insights
**Notes**: Applies meta-perspective integration principles

### applyKnowledgeToTask(integratedContext, currentState, additionalInput, nodeNumber, isPositivePhase) (Lines 352-450)
**Purpose**: Applies integrated knowledge to specific QL cycle task
**Parameters**: integratedContext, currentState, additionalInput, nodeNumber, isPositivePhase
**Returns**: Promise<object> - Task-specific output with validation and synthesis results
**Notes**: Handles both synthesis and analysis phase logic

### generateMetaPerspective(context, nodeNumber, isPositivePhase) (Lines 452-550)
**Purpose**: Generates meta-perspective insights based on current QL node
**Parameters**: context (object), nodeNumber (0-5), isPositivePhase (boolean)
**Returns**: string - Meta-perspective analysis
**Notes**: Node-specific perspective generation with philosophical integration

### validateSynthesis(synthesis, context, nodeNumber) (Lines 552-650)
**Purpose**: Validates synthesis results against Epii criteria
**Parameters**: synthesis (object), context (object), nodeNumber (0-5)
**Returns**: object - Validation results with passed/failed status
**Notes**: Comprehensive validation including coherence, completeness, and integration checks

## Data Flow
1. **Agent Invocation**: QL cycle → invokeEpiiExpertAgent() → coordinate identification
2. **Knowledge Retrieval**: Coordinates → retrieveKnowledgeContext() → parallel BPMCP queries
3. **Integration**: Raw knowledge → integrateKnowledge() → synthesized context
4. **Task Application**: Integrated context → applyKnowledgeToTask() → QL-specific output
5. **Validation**: Output → validateSynthesis() → validation results → QL cycle update

## Configuration
### QL Cycle Integration
- **Node Mapping**: Maps QL nodes (0-5) to specific Bimba coordinates
- **Phase Handling**: Different logic for synthesis (+) vs analysis (-) phases
- **State Management**: Integrates with QL cycle state object

### Coordinate System
- **Base Coordinates**: Always includes #5, #5-0, #5-1, #5-5
- **Node-Specific**: Adds coordinates based on current QL node
- **Task-Specific**: Additional coordinates based on current mode/task

### Knowledge Sources
- **Structural**: Neo4j graph traversal via BPMCP
- **Semantic**: Vector search and similarity matching
- **Crystallized**: Notion pages and documented insights

## Testing
No explicit test files referenced, but includes comprehensive logging and error handling

## Related Files
### Core Dependencies
- `../../databases/bpmcp/bpMCP.service.mjs` - Primary knowledge interface
- `../../graph/ql_cycle.graph.mjs` - QL cycle state management

### Subsystem Integration
- `../5_epii/` - Other Epii subsystem components
- `../../epi-logos-system/` - Universal agent orchestration

### Knowledge Sources
- BPMCP MCP Server tools for all knowledge operations
- Neo4j database for structural knowledge
- Notion API for crystallized knowledge

## Development Notes
- **Meta-Techne Loop**: Implements the philosophical Meta-Techne loop concept
- **Coordinate Mapping**: Sophisticated mapping between QL nodes and Bimba coordinates
- **Phase Awareness**: Different behavior for synthesis vs analysis phases
- **Error Resilience**: Comprehensive error handling with fallback outputs
- **Knowledge Integration**: Multi-source knowledge synthesis with meta-perspective
- **Validation Logic**: Built-in validation for synthesis quality and coherence
- **Async Architecture**: Full async/await pattern for all operations
- **Logging**: Extensive console logging for debugging and monitoring
