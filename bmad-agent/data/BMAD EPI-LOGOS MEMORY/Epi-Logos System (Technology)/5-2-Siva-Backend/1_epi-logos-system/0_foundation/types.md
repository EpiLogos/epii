# types.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/0_foundation/types.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Foundation Types for Epi-Logos Universal Agent providing core type definitions for the universal orchestrating agent. Defines comprehensive enumerations for subsystem experts, agent request types, context frames, and orchestration states. Serves as the foundational type system ensuring consistency across all Epi-Logos system components with standardized constants and enums.

## System Integration
### Imports
- **No external imports**: Pure JavaScript constant definitions

### Exports
- **SubsystemExperts**: Enumeration of all six subsystem experts
- **AgentRequestTypes**: Types of agent requests and operations
- **ContextFrames**: Context frame definitions for different operational modes
- **OrchestrationStates**: States in the orchestration lifecycle

### Dependencies
- **Pure JavaScript**: No external dependencies for maximum compatibility

### Dependents
- **Epi-Logos Orchestrator**: Primary consumer for subsystem and state definitions
- **Universal Orchestration Pipeline**: Request types and context frames
- **Frontend Context Manager**: Context frame definitions
- **BPMCP Agent Integration**: Context and request type integration
- **All Agent Services**: Foundational type consistency across system

## Key Functions/Components
### SubsystemExperts Enum (Lines 6-13)
**Purpose**: Enumeration of all six subsystem experts in the Epi-Logos system
**Parameters**: Static constant object
**Returns**: Subsystem expert identifiers
**Notes**: Complete mapping of all subsystems with consistent naming

### AgentRequestTypes Enum (Lines 15-21)
**Purpose**: Types of agent requests and operations for orchestration
**Parameters**: Static constant object
**Returns**: Request type identifiers
**Notes**: Comprehensive request categorization for intelligent routing

### ContextFrames Enum (Lines 23-29)
**Purpose**: Context frame definitions for different operational modes
**Parameters**: Static constant object
**Returns**: Context frame identifiers
**Notes**: Operational context categorization for appropriate processing

### OrchestrationStates Enum (Lines 31-38)
**Purpose**: States in the orchestration lifecycle for state management
**Parameters**: Static constant object
**Returns**: Orchestration state identifiers
**Notes**: Complete orchestration state machine definition

## Data Flow
1. **Type Import**: System components → Type imports → Consistent type usage
2. **Subsystem Routing**: Request → Subsystem expert selection → Consistent routing
3. **Request Classification**: Incoming request → Request type identification → Appropriate handling
4. **Context Management**: Operation context → Context frame selection → Contextual processing
5. **State Tracking**: Orchestration progress → State transitions → Lifecycle management

## Configuration
### Subsystem Experts
- **ANUTTARA**: 'anuttara' - Transcendent void, void logic, proto analysis (#0)
- **PARAMASIVA**: 'paramasiva' - Quaternal logic, algebraic topology, logical structures (#1)
- **PARASHAKTI**: 'parashakti' - Cosmic experientiality, experiential analysis, dynamic processing (#2)
- **MAHAMAYA**: 'mahamaya' - Cosmic imagination, visualization, imagination synthesis (#3)
- **NARA**: 'nara' - Individualized cognition, user interaction, personal context (#4)
- **EPII**: 'epii' - Self awareness, document analysis, memory crystallization (#5)

### Agent Request Types
- **QUERY**: 'query' - Information and knowledge queries
- **ANALYSIS**: 'analysis' - Document and content analysis requests
- **ORCHESTRATION**: 'orchestration' - Multi-subsystem coordination requests
- **REFLECTION**: 'reflection' - Meta-cognitive and reflective operations
- **ACTION**: 'action' - Direct action and execution requests

### Context Frames
- **DOCUMENT**: 'document' - Document-focused operations and analysis
- **SELECTION**: 'selection' - Selection-based operations and context
- **GRAPH**: 'graph' - Graph-based operations and visualization
- **COORDINATE**: 'coordinate' - Coordinate-specific operations and analysis
- **UNIVERSAL**: 'universal' - Cross-system and universal operations

### Orchestration States
- **IDLE**: 'idle' - Orchestrator ready for new requests
- **ANALYZING**: 'analyzing' - Request analysis and planning phase
- **DELEGATING**: 'delegating' - Subsystem delegation and task assignment
- **COORDINATING**: 'coordinating' - Multi-subsystem coordination and synchronization
- **SYNTHESIZING**: 'synthesizing' - Cross-subsystem result synthesis
- **RESPONDING**: 'responding' - Final response preparation and delivery

## Testing
No explicit test files referenced, but provides foundational consistency for all system testing

## Related Files
### Core Dependencies
- **Pure JavaScript**: No external dependencies for maximum compatibility

### Integration Points
- **Epi-Logos Orchestrator**: Primary consumer for subsystem and state definitions
- **Universal Orchestration Pipeline**: Request types and context frames
- **Frontend Context Manager**: Context frame definitions
- **BPMCP Agent Integration**: Context and request type integration

### Type System Architecture
- **Foundational Types**: Core type definitions for entire system
- **Consistency Enforcement**: Standardized constants across all components
- **Extensible Design**: Easy addition of new types and categories

## Development Notes
- **Foundational Architecture**: Core type system for entire Epi-Logos system
- **Consistency Enforcement**: Standardized constants prevent type mismatches
- **Complete Subsystem Coverage**: All six subsystems properly enumerated
- **Comprehensive Request Types**: Complete categorization of agent operations
- **Context Awareness**: Full context frame definitions for operational modes
- **State Machine Support**: Complete orchestration state lifecycle definition
- **Zero Dependencies**: Pure JavaScript for maximum compatibility and performance
- **Extensible Design**: Easy addition of new types without breaking changes
- **Naming Consistency**: Consistent naming conventions across all enumerations
- **Documentation Integration**: Clear mapping between types and system components
