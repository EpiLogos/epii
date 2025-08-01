# task-state-manager.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/shared/a2a/task-state-manager.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Task State Manager managing task state and QL cycle transitions for the A2A framework. Orchestrates the Quaternary Logic progression through six stages (A-logos through An-a-logos), maintains task history and artifacts, handles Bimba coordinate tracking, and manages archetypal representations. Serves as the core state management component for the Siva-Shakti orchestration layer.

## System Integration
### Imports
- **uuid**: UUID generation for task and session IDs

### Exports
- **TaskStateManager**: Main class for task state management

### Dependencies
- **UUID Library**: Unique identifier generation
- **A2A Framework**: Task state management within A2A protocol

### Dependents
- **A2A Server**: Primary consumer for task orchestration
- **Agent Adapters**: Task state tracking and transitions
- **Skills System**: QL stage-aware skill execution
- **Epii Agent Adapter**: Task state management integration

## Key Functions/Components
### TaskStateManager Class (Lines 11-174)
**Purpose**: Main class managing task state and QL cycle transitions
**Parameters**: taskId (optional), sessionId (optional)
**Returns**: TaskStateManager instance
**Notes**: 174 lines implementing complete task state management

### Constructor (Lines 12-33)
**Purpose**: Initialize task state with default values and metadata structure
**Parameters**: taskId (string, optional), sessionId (string, optional)
**Returns**: TaskStateManager instance
**Notes**: Creates comprehensive task structure with QL stage tracking

### advanceQLStage() (Lines 36-83)
**Purpose**: Transition to next QL stage with state mapping and context determination
**Parameters**: None
**Returns**: Updated task object
**Notes**: Cycles through 6 QL stages, maps to A2A states, tracks transitions

### setContextFrame(contextFrame) (Lines 86-89)
**Purpose**: Set current context frame for task execution
**Parameters**: contextFrame (string)
**Returns**: Updated task object
**Notes**: Context frame assignment for subsystem coordination

### setSubsystemPath(subsystemPath) (Lines 92-95)
**Purpose**: Set current subsystem path for task routing
**Parameters**: subsystemPath (string)
**Returns**: Updated task object
**Notes**: Subsystem path tracking for execution routing

### setBimbaCoordinates(coordinates) (Lines 98-105)
**Purpose**: Set Bimba coordinates for task context
**Parameters**: coordinates (array or string)
**Returns**: Updated task object
**Notes**: Handles both single coordinate and array inputs

### addBimbaCoordinate(coordinate) (Lines 108-113)
**Purpose**: Add single Bimba coordinate to task metadata
**Parameters**: coordinate (string)
**Returns**: Updated task object
**Notes**: Prevents duplicate coordinates, maintains coordinate list

### setArchetypes(userArchetype, epistemologyArchetype) (Lines 116-120)
**Purpose**: Set archetypal representations for user and epistemological approach
**Parameters**: userArchetype (string), epistemologyArchetype (string)
**Returns**: Updated task object
**Notes**: Archetypal metadata for personalized task execution

### addArtifact(artifact) (Lines 123-129)
**Purpose**: Add artifact to task with timestamp
**Parameters**: artifact (object)
**Returns**: Updated task object
**Notes**: Artifact tracking with automatic timestamping

### addMessage(message) (Lines 132-138)
**Purpose**: Add message to task history with timestamp
**Parameters**: message (object)
**Returns**: Updated task object
**Notes**: Message history tracking with automatic timestamping

### updateState(state) (Lines 141-145)
**Purpose**: Update task A2A state with timestamp
**Parameters**: state (string)
**Returns**: Updated task object
**Notes**: A2A state updates with timestamp tracking

### getState() (Lines 148-150)
**Purpose**: Get current complete task state
**Parameters**: None
**Returns**: Complete task object
**Notes**: Read-only access to current task state

## Data Flow
1. **Task Creation**: Constructor called → Task structure initialized → UUID generation → Default state set
2. **QL Progression**: advanceQLStage() → Stage incremented → A2A state mapped → Context frame determined → Transition recorded
3. **State Updates**: State methods called → Task properties updated → Timestamps added → Task object returned
4. **Artifact Management**: Artifacts/messages added → Timestamped → Added to collections → Task updated
5. **State Retrieval**: getState() called → Complete task object returned → External systems access state

## Configuration
### QL Stage Mapping
- **Stage 0**: A-logos → "submitted" state
- **Stage 1**: Pre-logos → "working" state
- **Stage 2**: Pro-logos → "working" state
- **Stage 3**: Logos → "working" state
- **Stage 4**: Epi-logos → "working" state (meta-synthesis)
- **Stage 5**: An-a-logos → "completed" state

### Task Structure
- **ID Fields**: taskId, sessionId with UUID generation
- **Status**: state, qlStage, qlStageName, timestamp
- **Context**: contextFrame, subsystemPath
- **Collections**: history, artifacts with timestamping
- **Metadata**: bimbaCoordinates, qlTransitions, archetypes

### State Transitions
- **QL Cycle**: 6-stage cycle (0-5) with automatic progression
- **A2A Mapping**: QL stages mapped to A2A protocol states
- **Transition Tracking**: Complete transition history with timestamps

## Testing
No explicit test files referenced, but includes comprehensive state tracking and validation

## Related Files
### Core Dependencies
- **A2A Server**: Primary consumer for task orchestration
- **Agent Adapters**: Task state integration points

### Integration Points
- **Skills System**: QL stage-aware skill execution
- **Context Management**: Context frame and subsystem path coordination
- **Artifact Management**: Task artifact and message tracking

### A2A Framework
- **Protocol Integration**: A2A state management
- **Task Orchestration**: Central task state coordination
- **Agent Communication**: Task state sharing across agents

## Development Notes
- **QL Cycle Management**: Complete 6-stage Quaternary Logic progression
- **A2A Integration**: Seamless mapping between QL stages and A2A protocol states
- **State Persistence**: Comprehensive state tracking with history and transitions
- **Archetypal Support**: User and epistemological archetype integration
- **Coordinate Tracking**: Bimba coordinate management for context awareness
- **Timestamp Management**: Automatic timestamping for all state changes
- **Artifact Management**: Comprehensive artifact and message tracking
- **Context Awareness**: Context frame and subsystem path management
- **UUID Generation**: Unique task and session identification
- **Immutable Updates**: Methods return updated task object for functional programming patterns
