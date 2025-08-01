# epii-agent-adapter.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/subsystems/5_epii/adapters/epii-agent-adapter.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Epii Agent Adapter bridging A2A protocol with existing Epii agent implementation within the Siva-Shakti layer. Translates A2A tasks to Epii agent calls, manages task state, handles skills registration and routing, and provides agent card capabilities. Enables the existing LangChain/LangGraph Epii implementation to work seamlessly with the A2A communication protocol.

## System Integration
### Imports
- **TaskStateManager**: Task state management for A2A protocol
- **epiiAgentCard**: Agent capability definitions and metadata
- **uuid (v4)**: Unique identifier generation for tasks
- **initializeSkillsModule**: Skills registry and router initialization

### Exports
- **EpiiAgentAdapter**: Main adapter class for A2A-Epii integration

### Dependencies
- **A2A Protocol**: Task state management and communication protocol
- **Skills System**: Skills registry and router for capability management
- **Epii Agent Service**: Existing Epii agent implementation
- **Agent Cards**: Capability definitions and metadata

### Dependents
- **A2A Server**: Uses adapter for Epii agent integration
- **Skills Router**: Routes skills through adapter
- **Task Management**: Task execution and state tracking

## Key Functions/Components
### EpiiAgentAdapter Class (Lines 18-340)
**Purpose**: Main adapter class connecting A2A protocol with Epii agent
**Parameters**: options (object) with epiiAgentService
**Returns**: EpiiAgentAdapter instance
**Notes**: 340 lines implementing complete A2A-Epii bridge functionality

### initializeSkills() (Lines 35-45)
**Purpose**: Initialize skills registry and router asynchronously
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Sets up skills system with error handling and initialization tracking

### handleTask(task, updateCallback) (Lines 77-200)
**Purpose**: Handle A2A task by translating to Epii agent calls
**Parameters**: task (A2A task object), updateCallback (function)
**Returns**: Promise<Object> - Task result
**Notes**: Extracts message content, manages task state, routes to skills

### getSkillsForAgent(agentId) (Lines 58-61)
**Purpose**: Get all skills provided by specific agent
**Parameters**: agentId (string)
**Returns**: Promise<Array> - Array of skills
**Notes**: Ensures initialization before querying skills registry

### getAgentCard() (Lines 67-69)
**Purpose**: Get agent card with capabilities and metadata
**Parameters**: None
**Returns**: Object - Agent card
**Notes**: Returns static epiiAgentCard configuration

### ensureInitialized() (Lines 47-51)
**Purpose**: Ensure skills system is initialized before operations
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Lazy initialization pattern for skills system

### Message Processing (Lines 84-103)
**Purpose**: Extract and process message content from A2A tasks
**Parameters**: task.message
**Returns**: Processed text content and files
**Notes**: Handles text parts, file parts, and content extraction

## Data Flow
1. **Task Reception**: A2A task received → Task state manager created → Task stored
2. **Message Processing**: Message parts extracted → Text content compiled → Files processed
3. **State Preparation**: Initial state created → Bimba coordinates extracted → Context prepared
4. **Skills Routing**: Request prepared → Skills router invoked → Epii agent called
5. **Response Handling**: Results processed → Task state updated → Response returned

## Configuration
### Adapter Configuration
- **epiiAgentService**: Existing Epii agent service instance
- **taskStore**: Map for active task management
- **skillsRegistry**: Skills registry for capability management
- **skillsRouter**: Skills router for execution

### Task State Management
- **Task ID**: UUID-based task identification
- **State Tracking**: working, completed, error states
- **Update Callbacks**: Real-time task status updates

### Message Format
- **Text Parts**: Extracted and joined for content
- **File Parts**: Processed with name, content, mimeType
- **Metadata**: Bimba coordinates and context information

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../../shared/a2a/task-state-manager.js` - Task state management
- `../agent-cards/epii-agent-card.js` - Agent capability definitions
- `../../../shared/services/index.js` - Skills module initialization

### Integration Points
- **A2A Server**: Primary integration point for agent adapter
- **Skills System**: Skills registry and router integration
- **Epii Agent Service**: Backend Epii agent implementation

### Agent System
- **Agent Cards**: Capability definitions and metadata
- **Skills Registry**: Skill registration and discovery
- **Task Management**: A2A task execution and tracking

## Development Notes
- **Siva-Shakti Layer**: Adapter within Siva-Shakti communication layer
- **Protocol Bridge**: Seamless integration between A2A and existing Epii implementation
- **Async Initialization**: Lazy loading of skills system for performance
- **Task State Management**: Comprehensive task tracking with real-time updates
- **Message Processing**: Robust handling of text and file content
- **Error Resilience**: Comprehensive error handling with detailed logging
- **Skills Integration**: Full integration with skills registry and router
- **Context Preservation**: Maintains context across A2A-Epii translation
- **File Handling**: Support for file attachments in A2A tasks
- **Metadata Extraction**: Bimba coordinate extraction from message metadata
