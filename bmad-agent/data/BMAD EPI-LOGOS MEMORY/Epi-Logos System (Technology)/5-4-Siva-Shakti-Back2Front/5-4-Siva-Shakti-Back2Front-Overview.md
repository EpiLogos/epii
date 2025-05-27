# 5-4 Siva-Shakti-Back2Front: Overview

## 1. Current Architecture (As per `epii_app/friendly-file-back2front/README.md`)

The `friendly-file-back2front` application is the **critical communication and coordination hub** for all agents within the Epi-Logos system. It embodies the **#5-4 "Siva-Shakti"** layer, mediating between the backend's processing capabilities (Siva) and the frontend's expressive interface (Shakti).

### Core Purpose:

*   **Agent-to-Agent (A2A) Communication Hub**: Implements Google's A2A protocol with Bimba coordinate extensions.
*   **Siva-Shakti Mediation**: Bridges backend processing with frontend expression via agent coordination.
*   **Expert Agent Orchestration**: Facilitates specialized subsystem expert agents (#5-4-X).
*   **QL Cycle Management**: Manages task states and Quaternal Logic transitions.
*   **Unified Communication Protocol**: Standardizes agent capability discovery, task routing, and state synchronization.

### Current Directory Structure:

```
friendly-file-back2front/ (#5-4 "Siva-Shakti" Integration Layer)
├── a2a-server.js               # Core A2A WebSocket server
├── a2a-service.js              # Main entry point and service orchestration
├── a2a-message.schema.js       # A2A protocol message schema (with Bimba extensions)
├── a2a-client.service.js       # A2A client for agent-to-agent communication
├── task-state-manager.js       # QL cycle and task state management
├── integration.js              # Integration layer with existing agent systems
├── adapters/                   # Agent-specific A2A protocol adapters
│   ├── epii-agent-adapter.js   # Epii agent A2A integration
│   └── nara-agent-adapter.js   # Nara agent A2A integration
├── agent-cards/                # Agent capability and skill definitions
│   ├── epii-agent-card.js      # Epii agent capabilities & Bimba coordinates
│   ├── nara-agent-card.js      # Nara agent capabilities & coordinates
│   └── index.js                # Agent registry and discovery
├── skills/                     # Bimba-aligned skills registry and routing
│   ├── bimba-skills-registry.js    # Central skills registry (coordinate mapping)
│   ├── bimba-skills-router.js      # Intelligent skill routing and execution
│   ├── epii-skills-initializer.js  # Epii-specific skill definitions
│   ├── nara-skills-initializer.js  # Nara-specific skill definitions
│   └── index.js                    # Skills module orchestration
├── examples/                   # Test clients and usage demonstrations
├── epii-agent-client.js        # Epii agent client implementation
├── nara-agent-client.js        # Nara agent client implementation
└── package.json                # Dependencies and service configuration
```

### Key Components:

*   **A2A Server (`a2a-server.js`)**: WebSocket hub for agent registration, discovery, message routing, and Bimba coordinate integration.
*   **A2A Message Schema (`a2a-message.schema.js`)**: Standardized message structure with Bimba coordinate and QL stage extensions.
*   **Task State Manager (`task-state-manager.js`)**: Manages QL cycle states, context frames, and task history with Bimba coordinate tracking.
*   **Agent Adapters (`adapters/`)**: Translate A2A protocol for existing agents, manage capability exposure, and synchronize state.
*   **Agent Cards (`agent-cards/`)**: Define agent capabilities, skill schemas, Bimba coordinate mappings, and support service discovery.
*   **Skills Registry and Router (`skills/`)**: Centralizes skill definitions with Bimba coordinate organization and intelligent routing.

### Bimba Architectural Alignment (#5-4 "Siva-Shakti"):

*   Facilitates Subsystem Expert Agents (#5-4-X) across the cosmic mind architecture (Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, Epii).
*   Integrates Siva (backend processing) and Shakti (frontend expression) through the A2A framework.
*   Coordinates QL cycles by mapping A2A task states to QL stages (0-5).
*   Employs fractal organization principles in agent capabilities and message routing.

## 2. Intended/Refactored Architecture (As per `Bimba Tech Architecture Refactoring Plan.md` and `friendly-file-back2front/README.md`)

The refactoring plan aims to enhance the `friendly-file-back2front` system by formally structuring it around Bimba subsystems and integrating an AG-UI (Agent-User Interaction) protocol for richer real-time user experiences.

### Target Directory Structure:

```
friendly-file-back2front/ (#5-4 Siva-Shakti Integration Layer)
├── subsystems/                     # Bimba-aligned expert agent subsystems
│   ├── 0_anuttara/                 # Foundational services (e.g., database access via agent)
│   ├── 1_paramasiva/               # QL/AT Logic implementation agent
│   ├── 2_parashakti/               # Harmonic layer services agent
│   ├── 3_mahamaya/                 # Symbolic transformation agent
│   ├── 4_nara/                     # API/contextual agent services
│   └── 5_epii/                     # Document analysis & Notion integration agent services
├── shared/                         # Shared utilities, configurations, or base classes for agents
├── adapters/                       # Enhanced agent adapters (A2A + AG-UI)
│   ├── epii-agent-adapter.js
│   └── nara-agent-adapter.js       # (and future agent adapters)
├── skills/                         # Existing skills structure (potentially refined per subsystem)
├── agent-cards/                    # Enhanced agent capability definitions (A2A + AG-UI)
├── a2a/                              # A2A core components (Agent-to-Agent)
│   ├── a2a-server.js
│   ├── a2a-message.schema.js
│   ├── task-state-manager.js
│   ├── a2a-client.service.js
│   └── integration.js
├── ag-ui/                            # AG-UI specific components (Agent-to-User)
│   ├── ag-ui-websocket-handler.js    # Centralized AG-UI WebSocket gateway
│   ├── ag-ui-event-definitions.js    # Project-specific AG-UI event extensions
│   ├── ag-ui-event-emitter.js        # Utility for emitting AG-UI events
│   └── README.md                     # AG-UI components documentation
└── README.md                         # Updated main README
```

### Key Refactoring Goals:

1.  **Bimba Subsystem Alignment**: Explicitly organize agent-specific logic and services within the `subsystems/` directory, mirroring the #5-4-X Bimba coordinates.
    *   Each subsystem (e.g., `subsystems/5_epii/`) would house the specific logic, skills, and potentially refined agent card definitions pertinent to that expert agent (e.g., Epii Agent).
2.  **AG-UI Protocol Integration**: Introduce a dedicated `ag-ui/` directory for components managing real-time communication between agents and the user interface.
    *   **`ag-ui-websocket-handler.js`**: A new central gateway for AG-UI events, likely distinct from the A2A WebSocket server to handle different communication patterns.
    *   **`ag-ui-event-definitions.js`**: Define specific AG-UI events tailored for Epi-Logos (e.g., `RunStarted`, `StepFinished`, `ToolCallVisualized`, `TextMessageContent`).
    *   **`ag-ui-event-emitter.js`**: A utility for agents (via their adapters) to emit these AG-UI events.
3.  **Enhanced Adapters and Agent Cards**: Modify `adapters/` and `agent-cards/` to support both A2A communication for inter-agent tasks and AG-UI event emission for frontend updates.
4.  **Bifurcated Communication**: Clearly separate A2A (inter-agent) and AG-UI (agent-to-frontend) concerns.
    *   The existing A2A components (server, schema, task manager) will be grouped under an `a2a/` directory.

### Migration Considerations:

*   **Agent Logic Relocation**: Move agent-specific functionalities currently in `epii-agent-client.js`, `nara-agent-client.js`, parts of `adapters/`, and `skills/` into their respective `subsystems/` directories.
*   **Adapter Enhancement**: Refactor `epii-agent-adapter.js` and `nara-agent-adapter.js` to integrate with the new `ag-ui/event-emitter.js` for sending real-time updates to the frontend.
*   **Skill Refinement**: Review `skills/` to see if specific skills should be more tightly coupled with their respective agents within the `subsystems/` directories.
*   **Configuration Updates**: Ensure all paths and dependencies are updated after restructuring.
*   **Testing**: Thoroughly test both A2A communication between agents and the new AG-UI event stream to the frontend.