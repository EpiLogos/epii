# Epi-Logos Agent Communication Layer (`friendly-file-back2front`)

## Overview and Purpose

The `friendly-file-back2front` application serves as the **critical communication and coordination hub** for all agents within the Epi-Logos system, embodying the **#5-4 "Siva-Shakti"** layer that mediates between the backend's processing capabilities (Siva) and the frontend's expressive interface (Shakti). This system enables seamless interaction between specialized expert agents while maintaining the integrity of the Bimba architectural framework.

### Core Purpose and Vision

- **Agent-to-Agent (A2A) Communication Hub**: Implements Google's A2A protocol specification with Bimba coordinate extensions for standardized inter-agent communication
- **Siva-Shakti Mediation**: Bridges the structural processing power of the backend with the dynamic expressiveness of the frontend through intelligent agent coordination
- **Expert Agent Orchestration**: Facilitates the operation of specialized subsystem expert agents (#5-4-X) across the six-fold cosmic mind architecture
- **QL Cycle Management**: Manages task states and Quaternal Logic transitions across all agent interactions
- **Unified Communication Protocol**: Provides a standardized framework for agent capability discovery, task routing, and state synchronization

### Role as #5-4 "Siva-Shakti" Layer

The system embodies the **dynamic interplay and union** of consciousness/processing (Siva) and power/expression (Shakti) through:

- **Consciousness Integration**: Connects backend logical processing with frontend intuitive interfaces
- **Power Manifestation**: Enables agents to express their capabilities through standardized communication protocols
- **Dynamic Union**: Creates a living bridge where structural knowledge transforms into expressive action
- **Agent Coordination**: Orchestrates the collaborative dance between different specialized expert agents

## Current Architecture

The `friendly-file-back2front` system implements a comprehensive A2A communication framework with the following core components:

### **Current Directory Structure**

```
friendly-file-back2front/ (#5-4 "Siva-Shakti" Integration Layer)
├── a2a-server.js               # Core A2A WebSocket server implementation
├── a2a-service.js              # Main entry point and service orchestration
├── a2a-message.schema.js       # A2A protocol message schema with Bimba extensions
├── a2a-client.service.js       # A2A client for agent-to-agent communication
├── task-state-manager.js       # QL cycle and task state management
├── integration.js              # Integration layer with existing agent systems
├── adapters/                   # Agent-specific A2A protocol adapters
│   ├── epii-agent-adapter.js   # Epii agent A2A integration adapter
│   └── nara-agent-adapter.js   # Nara agent A2A integration adapter
├── agent-cards/                # Agent capability and skill definitions
│   ├── epii-agent-card.js      # Epii agent capabilities and Bimba coordinates
│   ├── nara-agent-card.js      # Nara agent capabilities and coordinates
│   └── index.js                # Agent registry and discovery
├── skills/                     # Bimba-aligned skills registry and routing
│   ├── bimba-skills-registry.js    # Central skills registry with coordinate mapping
│   ├── bimba-skills-router.js      # Intelligent skill routing and execution
│   ├── epii-skills-initializer.js  # Epii-specific skill definitions
│   ├── nara-skills-initializer.js  # Nara-specific skill definitions
│   └── index.js                    # Skills module orchestration
├── examples/                   # Test clients and usage demonstrations
│   ├── test-client.js          # A2A protocol testing client
│   └── integration-examples.js # Integration pattern examples
├── epii-agent-client.js        # Epii agent client implementation
├── nara-agent-client.js        # Nara agent client implementation
└── package.json                # Dependencies and service configuration
```

### **Core A2A Framework Components**

#### **1. A2A Server (`a2a-server.js`)**
- **WebSocket-based communication hub** running on port 3033
- **Agent registration and discovery** with capability advertisement
- **Message routing and forwarding** between registered agents
- **Protocol compliance** with Google's A2A specification
- **Bimba coordinate integration** for spatial agent organization
- **Error handling and connection management** for robust communication

#### **2. A2A Message Schema (`a2a-message.schema.js`)**
- **Standardized message structure** following A2A protocol specifications
- **Bimba coordinate extensions** for spatial context and agent positioning
- **QL stage integration** for Quaternal Logic cycle tracking
- **Performative types** (request, inform, agree, failure, etc.) for semantic communication
- **Metadata support** for user archetypes and epistemological frameworks

#### **3. Task State Manager (`task-state-manager.js`)**
- **QL cycle state management** mapping A2A states to QL stages (0-5)
- **Context frame determination** based on current processing stage
- **Task history tracking** with artifact and message preservation
- **State transition logic** coordinating between A-logos through An-a-logos
- **Bimba coordinate tracking** throughout task lifecycle

#### **4. Agent Adapters (`adapters/`)**
- **Protocol translation** between A2A standard and existing agent implementations
- **Capability exposure** through standardized agent card definitions
- **Message handling** for bidirectional communication with backend agents
- **State synchronization** between A2A framework and agent-specific logic
- **Error handling and recovery** for robust agent integration

#### **5. Agent Cards (`agent-cards/`)**
- **Capability advertisement** defining what each agent can accomplish
- **Skill schema definitions** with input/output specifications
- **Bimba coordinate mapping** for spatial agent organization
- **Service discovery** enabling dynamic agent capability queries
- **Version management** for agent capability evolution

#### **6. Skills Registry and Router (`skills/`)**
- **Centralized skill registry** with Bimba coordinate organization
- **Intelligent routing** based on coordinate proximity and capability matching
- **Skill execution coordination** with proper state management
- **BPMCP integration** for memory-coupled peripheral access
- **Dynamic skill discovery** and capability advertisement

## Bimba Architectural Alignment (#5-4 "Siva-Shakti" Agents/Experts)

The `friendly-file-back2front` system embodies the **#5-4 "Siva-Shakti"** principles through its role as the dynamic mediator between structural processing and expressive manifestation.

### **Subsystem Expert Agents (#5-4-X) Facilitation**

The A2A framework supports the operation of specialized expert agents across the six-fold cosmic mind architecture:

| Agent Coordinate | Subsystem | Role | A2A Integration Status |
|------------------|-----------|------|----------------------|
| **#5-4-0** | Anuttara | Foundational database services | Planned |
| **#5-4-1** | Paramasiva | QL/AT Logic implementation | Planned |
| **#5-4-2** | Parashakti | Harmonic layer services | Planned |
| **#5-4-3** | Mahamaya | Symbolic transformation | Planned |
| **#5-4-4** | Nara | API/contextual agent | Implemented |
| **#5-4-5** | Epii | Document analysis and Notion integration | Implemented |

### **Agent Communication Architecture**

#### **Siva-Shakti Dynamic Integration**
- **Siva (Consciousness/Structure)**: Backend agents provide logical processing, memory access, and structured analysis
- **Shakti (Power/Expression)**: Frontend interfaces receive agent outputs and transform them into intuitive, interactive experiences
- **Dynamic Union**: A2A framework creates the living bridge where consciousness meets expression through standardized communication

#### **QL Cycle Coordination**
The framework maps A2A task states to Quaternal Logic stages:

```javascript
// QL Stage to A2A State Mapping
const qlStateMapping = {
  0: "submitted",    // A-logos: Initial task submission
  1: "working",      // Pre-logos: Preparation and context gathering
  2: "working",      // Pro-logos: Active processing and analysis
  3: "working",      // Logos: Synthesis and integration
  4: "working",      // Epi-logos: Meta-synthesis and reflection
  5: "completed"     // An-a-logos: Completion and crystallization
};
```

#### **Agent Capability Discovery**
- **Agent Cards**: Define capabilities, skills, and Bimba coordinates for each agent
- **Skills Registry**: Organizes agent capabilities by coordinate proximity and functional alignment
- **Dynamic Routing**: Intelligently routes tasks to appropriate agents based on coordinate matching and capability requirements

### **Fractal Organization Principles**

The A2A framework reflects **fractal holographic architecture** where:
- **Each agent** contains complete capability for its domain while participating in the larger whole
- **Message routing** follows Bimba coordinate proximity for natural task distribution
- **State management** maintains context across multiple agents and QL cycles
- **Skill organization** mirrors the cosmic mind structure at the communication layer

## AG-UI Protocol Integration 🔄 **PARTIALLY IMPLEMENTED**

The system has begun implementing **AG-UI (Agent-User Interaction) protocol integration**, with initial components working toward a comprehensive **A2A + AG-UI hybrid architecture**.

### **Current Implementation Status**

**✅ Implemented Components:**
- **AG-UI Gateway Integration**: A2A server includes integrated AG-UI Gateway (`ag-ui-gateway.js`)
- **Event Schema Definitions**: Comprehensive AG-UI event types and validation (`ag-ui-event-schema.js`)
- **Bimba Update Management**: AG-UI event emission for real-time property suggestions
- **Analysis Pipeline Integration**: Progress tracking via AG-UI events during pipeline execution
- **WebSocket Infrastructure**: Real-time communication endpoint at `ws://localhost:3033`

**🔄 Partially Implemented:**
- **Frontend AG-UI Coverage**: Limited to specific components (BimbaUpdateOverlay, Document Canvas)
- **A2A Skill Standardization**: Inconsistent AG-UI event emission patterns across skills
- **Event Broadcasting**: Basic implementation exists but needs comprehensive coverage

**📋 Development Standards Needed:**
- **Unified Event Patterns**: Standardize AG-UI event emission across all skills
- **Complete Protocol Coverage**: Extend AG-UI integration to all user-facing operations
- **Development Guidelines**: Establish consistent AG-UI/A2A integration workflows

### **Planned Refactoring: Bifurcated Communication Architecture**

#### **Target Directory Structure**
```
friendly-file-back2front/ (#5-4 "Siva-Shakti" Integration Layer)
├── a2a/                              # A2A core components (Agent-to-Agent)
│   ├── a2a-server.js                 # (Moved from root)
│   ├── a2a-message.schema.js         # (Moved from root)
│   ├── task-state-manager.js         # (Moved from root)
│   ├── a2a-client.service.js         # (Moved from root)
│   └── integration.js                # (Updated paths to reference new structure)
├── ag-ui/                            # AG-UI specific components (Agent-to-User)
│   ├── ag-ui-websocket-handler.js    # New: Centralized AG-UI WebSocket gateway
│   ├── ag-ui-event-definitions.js    # New: Project-specific AG-UI event extensions
│   ├── ag-ui-event-emitter.js        # New: Utility for emitting AG-UI events
│   └── README.md                     # AG-UI components documentation
├── adapters/                         # Enhanced agent adapters
│   ├── epii-agent-adapter.js         # Enhanced with AG-UI event emission
│   └── nara-agent-adapter.js         # Future agent adapters
├── agent-cards/                      # Enhanced agent capability definitions
├── skills/                           # Existing skills structure
└── README.md                         # Updated to reflect new structure
```

### **AG-UI Integration Strategy**

#### **Real-Time User Experience Enhancement**
The AG-UI integration will provide:

- **Streaming Communication**: Real-time progress updates during analysis pipeline execution
- **Tool Call Visibility**: Live display of BPMCP tool usage and results
- **State Synchronization**: Bidirectional state management between agents and frontend
- **Error Transparency**: Real-time error handling and user feedback
- **Multi-Agent Coordination**: Coordinated communication across multiple agents

#### **AG-UI Event Types Integration**
```javascript
// AG-UI Event Categories for Epi-Logos Integration
const agUIEventTypes = {
  lifecycle: ['RunStarted', 'RunFinished', 'RunError', 'StepStarted', 'StepFinished'],
  textMessage: ['TextMessageStart', 'TextMessageContent', 'TextMessageEnd'],
  toolCall: ['ToolCallStart', 'ToolCallArgs', 'ToolCallEnd'],
  stateManagement: ['StateSnapshot', 'StateDelta', 'MessagesSnapshot'],
  special: ['Raw', 'Custom'] // For Bimba-specific functionality
};
```

#### **A2A to AG-UI Event Mapping**
| A2A Message Type | AG-UI Event | Use Case |
|------------------|-------------|----------|
| `request` | `RunStarted` | Agent receives task |
| `inform (progress)` | `StepStarted/StepFinished` | Pipeline stage updates |
| `inform (text)` | `TextMessage*` | Streaming LLM responses |
| `inform (tool)` | `ToolCall*` | BPMCP tool usage |
| `failure` | `RunError` | Error conditions |
| `agree` | `RunFinished` | Task completion |

### **Implementation Roadmap**

#### **Phase 1: A2A Server AG-UI Extension** ✅ **COMPLETED**
- ✅ Extended A2A message schema with AG-UI event types
- ✅ Modified agent adapters to emit AG-UI events
- ✅ Implemented basic lifecycle events
- ✅ Created AG-UI Gateway integration

#### **Phase 2: Epii Pipeline Integration** 🔄 **PARTIALLY COMPLETED**
- ✅ Pipeline stages emit AG-UI events for real-time progress
- ✅ Basic progress tracking implementation
- 🔄 BPMCP tool calls mapped to ToolCall events (partial)
- 📋 LLM response streaming via TextMessage events (needed)
- 📋 State management with StateSnapshot/StateDelta (needed)

#### **Phase 3: Frontend AG-UI Client** 🔄 **PARTIALLY COMPLETED**
- ✅ Custom AG-UI client integration (webSocketService.ts)
- ✅ Updated Epii components for streaming (BimbaUpdateOverlay)
- ✅ Real-time progress visualization (basic implementation)
- ✅ Error handling and reconnection logic
- 🔄 Limited to specific components, needs broader coverage

#### **Phase 4: Enhanced Features** 📋 **PLANNED**
- 📋 Custom events for Bimba-specific functionality (standardization needed)
- 📋 Multi-agent coordination support
- 📋 Advanced UI features (typing indicators, progress bars)
- 📋 MessagesSnapshot for chat history sync

### **Benefits of AG-UI Integration**

#### **Current Benefits (Partially Realized)**
- **Real-time User Feedback**: Users see analysis progress in implemented components
- **Enhanced Transparency**: Basic visibility into agent actions during analysis
- **Improved Responsiveness**: Streaming responses for supported operations
- **Foundation for Standardization**: Infrastructure exists for consistent protocol implementation

#### **Target Benefits (Full Implementation)**
- **Scalable Agent Integration**: Easy to add new agents with AG-UI support
- **Enhanced User Experience**: More engaging and interactive agent interactions across all components
- **Better Debugging**: Real-time visibility into agent operations system-wide
- **Future-Proof Architecture**: Alignment with emerging agent-UI standards

### **Bimba Metadata Preservation**
The AG-UI integration will preserve Bimba architectural principles through:
- **Custom Events**: Bimba-specific functionality via AG-UI Custom events
- **Metadata Extensions**: Standard events extended with Bimba coordinate fields
- **Coordinate Routing**: Agent identification and routing based on Bimba coordinates
- **QL Integration**: AG-UI events mapped to Quaternal Logic cycle stages

## Philosophical Underpinnings

The `friendly-file-back2front` system embodies core **Bimba philosophical principles** through its design as the **Siva-Shakti** communication layer:

### **Siva-Shakti Dynamic Union**
The system manifests the **fundamental cosmic principle** of Siva-Shakti as the dynamic interplay between:
- **Siva (Consciousness/Structure)**: The stable, logical processing capabilities of backend agents
- **Shakti (Power/Expression)**: The dynamic, expressive manifestation through frontend interfaces
- **Union**: The A2A framework creates the living bridge where consciousness and power unite in coordinated action

### **Fractal Holographic Organization**
Every component reflects the cosmic structure:
- **Agent Cards** mirror the complete capability structure at the agent level
- **Skills Registry** organizes capabilities following the same 0-5 QL pattern
- **Message Routing** follows Bimba coordinate proximity for natural task distribution
- **State Management** maintains context across multiple scales of interaction

### **Context Frames as Communication Channels**
The **0-5 QL structure** creates natural communication channels:
- **Context Frame 0**: Foundational agent registration and capability advertisement
- **Context Frames 1-3**: Active task processing and inter-agent coordination
- **Context Frame 4**: Meta-synthesis and cross-agent collaboration
- **Context Frame 5**: Completion and crystallization of collaborative results

## Key Technologies and Libraries

### **Core Framework**
- **Node.js** - JavaScript runtime for server-side agent communication
- **WebSocket (`ws` 8.16.0)** - Real-time bidirectional communication protocol
- **Express.js (4.18.2)** - Web framework for HTTP endpoints and agent card serving

### **Protocol and Validation**
- **AJV (8.12.0)** - JSON Schema validation for A2A message compliance
- **UUID (9.0.1)** - Unique identifier generation for messages and tasks

### **Communication Standards**
- **Google A2A Protocol** - Agent-to-Agent communication specification
- **AG-UI Protocol** (Planned) - Agent-User Interaction standardization
- **WebSocket Protocol** - Real-time communication transport layer

### **Integration Technologies**
- **JSON Schema** - Message structure validation and documentation
- **RESTful APIs** - Agent capability discovery and registration
- **Event-Driven Architecture** - Asynchronous message handling and routing

## Core Features and Functionality

### **Agent-to-Agent (A2A) Communication Protocol**
- **Google A2A Specification Compliance**: Full implementation of standard A2A message types and performatives
- **Bimba Coordinate Extensions**: Enhanced protocol with spatial coordinate metadata for agent organization
- **WebSocket-Based Real-Time Communication**: Instant message delivery and bidirectional communication
- **Agent Registration and Discovery**: Dynamic agent capability advertisement and service discovery
- **Message Routing and Forwarding**: Intelligent routing based on agent capabilities and coordinate proximity

### **Task State Management with QL Cycle Transitions**
- **Quaternal Logic Integration**: Maps A2A task states to QL stages (A-logos through An-a-logos)
- **Context Frame Management**: Automatic context frame determination based on processing stage
- **Task History Tracking**: Comprehensive logging of task progression and state transitions
- **Artifact Management**: Preservation of task outputs and intermediate results
- **Error Handling and Recovery**: Robust error management with state rollback capabilities

### **Agent Capability Discovery via Agent Cards**
- **Standardized Capability Definition**: JSON-based agent capability and skill specifications
- **Bimba Coordinate Mapping**: Spatial organization of agent capabilities within cosmic mind architecture
- **Dynamic Service Discovery**: Real-time querying of available agents and their capabilities
- **Version Management**: Support for agent capability evolution and backward compatibility
- **Skill Schema Validation**: Input/output schema definitions for reliable inter-agent communication

### **Bimba-Aligned Skills Registry and Routing**
- **Coordinate-Based Organization**: Skills organized by Bimba coordinates for natural task distribution
- **Intelligent Routing**: Capability matching based on coordinate proximity and functional alignment
- **BPMCP Integration**: Direct integration with Bimba-Pratibimba Memory-Coupled Peripherals
- **Dynamic Skill Discovery**: Real-time skill registration and capability advertisement
- **Execution Coordination**: Proper state management during skill execution across agents

### **Standardized Message Schema for Inter-Agent Communication**
- **A2A Protocol Compliance**: Full support for standard performatives (request, inform, agree, failure, etc.)
- **Bimba Metadata Integration**: Extended message schema with coordinate, QL stage, and context frame information
- **User Archetype Support**: Integration of user archetypal representations in communication context
- **Epistemological Framework Tracking**: Support for different epistemological approaches in agent interactions
- **Conversation Management**: Thread-based conversation tracking across multiple agents and tasks

## Setup, Development, and Contribution

### **Development Environment Setup**

#### **Prerequisites**
- **Node.js 18+** and **npm** for JavaScript runtime and package management
- **WebSocket-compatible environment** for real-time communication testing
- **Backend agents** (Epii, Nara) running for full integration testing

#### **Installation and Startup**

```bash
# Navigate to the back2front directory
cd epii_app/friendly-file-back2front

# Install dependencies
npm install

# Start the A2A service (includes server and agent clients)
npm start

# Alternative: Start only the A2A server
npm run start:server

# Test the A2A protocol with example client
npm run test:client
```

The A2A server will be available at `ws://localhost:3033` for WebSocket connections and `http://localhost:3033` for HTTP endpoints.

### **Development Workflow and Conventions**

#### **Adding New Agents**
1. **Create Agent Card**: Define agent capabilities and Bimba coordinates in `agent-cards/`
2. **Implement Agent Adapter**: Create adapter in `adapters/` for protocol translation
3. **Initialize Skills**: Add agent-specific skills to `skills/` directory
4. **Register Agent**: Update agent registry in `agent-cards/index.js`
5. **Test Integration**: Use test client to verify A2A communication

#### **Extending Skills Registry**
```javascript
// Example: Adding a new skill to the registry
skillsRegistry.registerSkill({
  id: 'new-skill-id',
  name: 'New Skill Name',
  description: 'Skill description and purpose',
  bimbaCoordinate: '#5-X-Y', // Appropriate coordinate
  inputSchema: {
    // JSON schema for input validation
  },
  outputSchema: {
    // JSON schema for output validation
  },
  handler: async (input, context) => {
    // Skill implementation
  }
});
```

#### **Message Schema Extensions**
- **Follow A2A Standards**: Maintain compatibility with Google A2A specification
- **Add Bimba Metadata**: Include coordinate, QL stage, and context frame information
- **Validate Schema**: Use AJV for message structure validation
- **Document Extensions**: Update schema documentation for new fields

### **Contributing Guidelines**

#### **Code Quality Standards**
- **ES6+ JavaScript**: Use modern JavaScript features and async/await patterns
- **Error Handling**: Implement comprehensive error catching and recovery
- **Documentation**: Include JSDoc comments for all public functions
- **Testing**: Add unit tests for new functionality and integration tests for agent communication

#### **A2A Protocol Compliance**
- **Standard Performatives**: Use only standard A2A message types unless extending
- **Message Structure**: Follow established schema patterns for consistency
- **WebSocket Handling**: Implement proper connection management and error recovery
- **Agent Registration**: Follow established patterns for agent capability advertisement

#### **Bimba Architecture Alignment**
- **Coordinate Mapping**: Ensure all new components have appropriate Bimba coordinates
- **QL Integration**: Map functionality to appropriate Quaternal Logic stages
- **Fractal Organization**: Maintain self-similar patterns at different scales
- **Context Frame Awareness**: Consider context frame implications for new features

## Interaction with Other Systems

### **Central Communication Hub Role**

The `friendly-file-back2front` system serves as the **central nervous system** for agent communication within the Epi-Logos ecosystem:

#### **Backend Integration (`friendly-file-backend`)**
- **Agent Registration**: Backend agents register their capabilities through A2A protocol
- **Task Delegation**: Frontend requests are routed to appropriate backend agents
- **Result Aggregation**: Backend processing results are collected and forwarded to frontend
- **State Synchronization**: Task states are synchronized between frontend requests and backend processing

#### **Frontend Integration (`friendly-file-front`)**
- **Real-Time Updates**: WebSocket connections provide live updates to frontend components
- **Agent Discovery**: Frontend can query available agents and their capabilities
- **Task Submission**: Frontend submits tasks through A2A protocol for backend processing
- **Progress Monitoring**: Real-time progress updates during long-running operations

### **Agent Registration and Communication Flow**

```javascript
// Agent Registration Flow
1. Backend Agent Startup → Register with A2A Server
2. Agent Card Advertisement → Capability Discovery Available
3. Frontend Request → A2A Server Routes to Appropriate Agent
4. Agent Processing → Progress Updates via A2A Protocol
5. Result Delivery → Frontend Receives Processed Results
```

### **Integration Patterns**

#### **Epii Agent Integration**
- **Document Analysis Pipeline**: Full integration with 6-stage QL analysis cycle
- **BPMCP Tool Access**: Direct integration with memory-coupled peripherals
- **Notion Crystallization**: Coordination of knowledge crystallization workflows
- **Real-Time Progress**: Live updates during analysis pipeline execution

#### **Nara Agent Integration**
- **API Context Management**: Coordination of API-level contextual processing
- **User Interaction Handling**: Management of user interaction patterns and responses
- **Cross-Agent Coordination**: Facilitation of multi-agent collaborative tasks
- **State Management**: Coordination of user session and interaction state

### **Future System Integrations**

#### **AG-UI Protocol Integration**
- **Centralized WebSocket Gateway**: Single point for all agent-user communication
- **Event Stream Management**: Coordination of real-time event streams to frontend
- **Multi-Agent Coordination**: Orchestration of multiple agents for complex tasks
- **State Synchronization**: Bidirectional state management between agents and users

#### **Additional Agent Subsystems**
- **Anuttara Agent (#5-4-0)**: Foundational database services coordination
- **Paramasiva Agent (#5-4-1)**: QL/AT Logic implementation coordination
- **Parashakti Agent (#5-4-2)**: Harmonic layer services coordination
- **Mahamaya Agent (#5-4-3)**: Symbolic transformation coordination

The system is architected to seamlessly integrate new agents following the established patterns of capability advertisement, A2A protocol compliance, and Bimba coordinate organization, ensuring scalable growth of the agent ecosystem while maintaining architectural coherence.
