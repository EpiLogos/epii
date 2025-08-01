# BMAD Memory System: Comprehensive Codebase Reflection Plan

## Executive Summary

This plan establishes a complete natural language reflection of the Epi-Logos codebase within the BMAD memory system, creating a living documentation system that maintains perfect synchronization between actual implementation and memory representation.

## Phase 1: Directory Structure Creation

### Target Location
`bmad-agent/data/BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/`

### Complete Directory Structure

```
Epi-Logos System (Technology)/
├── 5-2-Siva-Backend/                    # Backend System Documentation
│   ├── 0_databases/                     # Database layer documentation
│   │   ├── bpmcp/                       # BPMCP MCP server documentation
│   │   │   ├── mcp-server/              # TypeScript MCP server docs
│   │   │   └── bpWebSocketClient.md     # WebSocket client documentation
│   │   ├── lightrag/                    # LightRAG MCP server documentation
│   │   │   ├── mcp-server/              # Python FastAPI server docs
│   │   │   └── qdrant.service.md        # Qdrant service documentation
│   │   ├── graphiti/                    # Graphiti MCP server documentation
│   │   │   └── mcp-server/              # Python MCP server docs
│   │   ├── neo4j/                       # Neo4j services documentation
│   │   │   ├── neo4j.service.md         # Neo4j connection service
│   │   │   └── bimbaPratibimbaClient.md # Bimba-specific operations
│   │   ├── mongodb/                     # MongoDB services documentation
│   │   │   └── mongo.service.md         # MongoDB service documentation
│   │   ├── notion/                      # Notion services documentation
│   │   │   └── notion.service.md        # Notion service documentation
│   │   ├── shared/                      # Shared database utilities
│   │   │   ├── models/                  # Cross-system models documentation
│   │   │   ├── utils/                   # QL utilities, graphData, caching
│   │   │   └── schemas/                 # Database schema definitions
│   │   ├── cache/                       # Caching services documentation
│   │   └── api/                         # Database API layer documentation
│   │       ├── controllers/             # Database operation controllers
│   │       └── routes/                  # Database API routes
│   ├── 1_subsystems/                    # Subsystem-specific backend logic
│   │   ├── 0_anuttara/                  # Anuttara subsystem backend
│   │   │   ├── 0_foundation/            # Core utilities documentation
│   │   │   ├── 1_utils/                 # Anuttara-specific utilities
│   │   │   ├── 2_services/              # Foundational services
│   │   │   ├── 3_models/                # Foundational data models
│   │   │   ├── 4_controllers/           # Foundational controllers
│   │   │   ├── 5_integration/           # Integration endpoints
│   │   │   ├── docs/                    # Documentation
│   │   │   └── anuttara.expert.agent.md # Agent implementation
│   │   ├── 1_paramasiva/                # Paramasiva subsystem backend
│   │   │   ├── 0_foundation/            # QL/AT foundational logic
│   │   │   ├── 1_utils/                 # Paramasiva utilities
│   │   │   ├── 2_services/              # QL/AT services
│   │   │   ├── 3_models/                # QL/AT models
│   │   │   ├── 4_controllers/           # QL/AT controllers
│   │   │   ├── 5_integration/           # QL/AT integration
│   │   │   └── paramasiva.expert.agent.md # Agent implementation
│   │   ├── 2_parashakti/                # Parashakti subsystem backend
│   │   │   ├── 0_foundation/            # Harmonic foundational logic
│   │   │   ├── 1_utils/                 # Harmonic utilities
│   │   │   ├── 2_services/              # Harmonic services
│   │   │   ├── 3_models/                # Harmonic models
│   │   │   ├── 4_controllers/           # Harmonic controllers
│   │   │   ├── 5_integration/           # Harmonic integration
│   │   │   └── parashakti.expert.agent.md # Agent implementation
│   │   ├── 3_mahamaya/                  # Mahamaya subsystem backend
│   │   │   ├── 0_foundation/            # Symbolic foundational logic
│   │   │   ├── 1_utils/                 # Symbolic utilities
│   │   │   ├── 2_services/              # Symbolic services
│   │   │   ├── 3_models/                # Symbolic models
│   │   │   ├── 4_controllers/           # Symbolic controllers
│   │   │   ├── 5_integration/           # Symbolic integration
│   │   │   └── mahamaya.expert.agent.md # Agent implementation
│   │   ├── 4_nara/                      # Nara subsystem backend
│   │   │   ├── 0_foundation/            # Nara foundational types
│   │   │   ├── 1_utils/                 # Nara-specific utilities
│   │   │   ├── 2_services/              # Auth, Mahamaya Matrix, user context
│   │   │   │   ├── auth.service.md      # Authentication service
│   │   │   │   ├── decanic.service.md   # Decanic service
│   │   │   │   ├── mahamaya-matrix.service.md # Matrix service
│   │   │   │   ├── nara-agent.service.md # Nara agent service
│   │   │   │   └── user-context.service.md # User context service
│   │   │   ├── 3_models/                # Mahamaya schema documentation
│   │   │   ├── 4_controllers/           # Auth, user, Matrix controllers
│   │   │   ├── 5_integration/           # API routes documentation
│   │   │   │   └── routes/              # Route implementations
│   │   │   ├── docs/                    # OpenAPI/Swagger specs
│   │   │   └── nara.expert.agent.md     # Nara agent implementation
│   │   └── 5_epii/                      # Epii subsystem backend
│   │       ├── 0_foundation/            # Epii foundational utilities
│   │       ├── 1_utils/                 # Document, notion, content utils
│   │       ├── 2_services/              # Analysis and crystallization
│   │       │   ├── analysis.service.md  # Analysis service
│   │       │   ├── crystallization.service.md # Crystallization service
│   │       │   └── epii-agent.service.md # Epii agent service
│   │       ├── 3_models/                # Analysis session, document models
│   │       ├── 4_controllers/           # Analysis and document controllers
│   │       ├── 5_integration/           # Epii integration layer
│   │       │   ├── pipelines/           # Analysis pipeline documentation
│   │       │   │   ├── stages/          # Individual stage documentation
│   │       │   │   └── pipeline_overview.md # Pipeline architecture
│   │       │   └── routes/              # Epii API routes
│   │       └── epii.expert.agent.md     # Epii agent implementation
│   ├── 2_epi_logos_system/              # Universal agent system backend
│   │   ├── 0_foundation/                # Universal agent types
│   │   ├── 1_orchestration/             # Agent orchestration logic
│   │   ├── 2_pipelines/                 # Universal orchestration pipelines
│   │   ├── 3_tools/                     # Universal agent tools
│   │   ├── 4_communication/             # Frontend context management
│   │   └── 5_integration/               # BPMCP agent integration
│   ├── 3_shared/                        # Shared backend components
│   ├── 4_config/                        # Configuration documentation
│   ├── 5_utils/                         # Utility functions documentation
│   └── index.md                         # Main backend entry point
├── 5-3-Shakti-Frontend/                 # Frontend System Documentation
│   ├── 0_shared/                        # Shared frontend components
│   │   ├── components/                  # Shared UI components
│   │   │   ├── layout/                  # Navigation, transitions
│   │   │   ├── ui/                      # Reusable UI components
│   │   │   ├── chat/                    # Chat-specific components
│   │   │   └── agent/                   # Agent-related components
│   │   ├── hooks/                       # Global custom React hooks
│   │   ├── services/                    # API communication services
│   │   ├── utils/                       # Global utility functions
│   │   ├── contexts/                    # Global React contexts
│   │   └── pages/                       # Top-level page components
│   ├── 1_subsystems/                    # Subsystem-specific frontend
│   │   ├── 0_anuttara/                  # Anuttara frontend (Meta2D)
│   │   │   ├── 0_foundation/            # Physics settings, constants
│   │   │   ├── 1_utils/                 # 2D visualization utilities
│   │   │   ├── 2_hooks/                 # Graph interaction hooks
│   │   │   ├── 3_visualization/         # 2D visual components
│   │   │   ├── 4_context/               # Context providers
│   │   │   └── 5_integration/           # Meta2D page component
│   │   ├── 1_paramasiva/                # Paramasiva frontend (Meta3D)
│   │   │   ├── 0_foundation/            # 3D physics, topological constants
│   │   │   ├── 1_utils/                 # 3D geometry, force utilities
│   │   │   ├── 2_hooks/                 # 3D interaction hooks
│   │   │   ├── 3_visualization/         # 3D visual components
│   │   │   ├── 4_context/               # 3D context providers
│   │   │   └── 5_integration/           # Meta3D page component
│   │   ├── 2_parashakti/                # Parashakti frontend (Dev Console)
│   │   │   ├── 1_utils/                 # Animation, harmonic utilities
│   │   │   ├── 2_hooks/                 # Animation hooks
│   │   │   ├── 3_visualization/         # Relation visualization
│   │   │   └── 4_context/               # Animation context
│   │   ├── 3_mahamaya/                  # Mahamaya frontend
│   │   │   ├── 1_utils/                 # Node styling, symbolic utils
│   │   │   ├── 2_hooks/                 # Symbolic interaction hooks
│   │   │   └── 3_visualization/         # Symbol visualization
│   │   ├── 4_nara/                      # Nara frontend (Oracle/Journal)
│   │   │   ├── 0_foundation/            # App constants, settings
│   │   │   ├── 1_utils/                 # Chat, UI utilities
│   │   │   ├── 2_hooks/                 # Chat, interaction hooks
│   │   │   ├── 3_visualization/         # Chat interface components
│   │   │   ├── 4_context/               # Chat context providers
│   │   │   └── 5_integration/           # Nara page components
│   │   └── 5_epii/                      # Epii frontend (Document Canvas)
│   │       ├── 0_foundation/            # Epii constants, settings
│   │       ├── 1_utils/                 # Document analysis utilities
│   │       ├── 2_hooks/                 # Document, analysis hooks
│   │       ├── 3_visualization/         # Document canvas, visualizers
│   │       │   ├── DocumentCanvas.md    # Main editing interface
│   │       │   ├── EpiiSidebar.md       # Sidebar component
│   │       │   ├── BimbaUpdateOverlay.md # Update management
│   │       │   └── RecursiveCoordinateTree.md # Coordinate navigation
│   │       ├── 4_context/               # Epii mode context providers
│   │       └── 5_integration/           # EpiiModePage component
│   ├── 2_epi_logos_system/              # Universal agent system frontend
│   │   ├── 0_foundation/                # Agent types, interfaces
│   │   ├── 1_components/                # Agent UI components
│   │   │   ├── FloatingEpiLogosAgent.md # Universal floating interface
│   │   │   ├── ChatSessionManager.md    # Session management
│   │   │   └── SessionHistoryPanel.md   # History panel
│   │   ├── 2_hooks/                     # Agent-specific hooks
│   │   ├── 3_services/                  # Session management, communication
│   │   ├── 4_contexts/                  # Expert routing contexts
│   │   │   └── ActiveModeProvider.md    # Expert routing provider
│   │   └── 5_integration/               # System-wide integrations
│   ├── 3_hooks/                         # React hooks documentation
│   ├── 4_services/                      # Frontend services documentation
│   └── 5_integration/                   # Frontend integration documentation
├── 5-4-Siva-Shakti-Back2Front/          # Back2Front System Documentation
│   ├── shared/                          # Shared infrastructure (#5-4-0)
│   │   ├── a2a/                         # Agent-to-Agent communication
│   │   │   ├── a2a-server.md            # Core A2A WebSocket server
│   │   │   ├── a2a-message.schema.md    # Message schema with Bimba extensions
│   │   │   ├── task-state-manager.md    # QL cycle and task management
│   │   │   └── integration.md           # Integration layer
│   │   ├── ag-ui/                       # Agent-to-UI communication
│   │   │   ├── ag-ui-gateway.md         # AG-UI WebSocket gateway
│   │   │   └── ag-ui-event-schema.md    # AG-UI event definitions
│   │   ├── services/                    # Shared services
│   │   │   ├── bimba-skills-registry.md # Central skills registry
│   │   │   ├── bimba-skills-router.md   # Intelligent routing
│   │   │   └── unifiedRAG.md            # Universal RAG skill
│   │   ├── docs/                        # Documentation and guides
│   │   └── tests/                       # Test suites and validation
│   ├── epi-logos-system/                # Universal agent system (#5-4-1)
│   │   ├── 0_foundation/                # Universal foundations
│   │   ├── 1_orchestration/             # Agent orchestration
│   │   ├── 2_skills/                    # Universal agent skills
│   │   │   ├── epi-logos-orchestration-skill.md # Universal orchestration
│   │   │   └── execute-frontend-action-skill.md # Frontend actions
│   │   ├── 3_communication/             # AG-UI and A2A integration
│   │   │   └── a2a-epi-logos-integration.md # Integration layer
│   │   ├── 4_integration/               # System-wide integrations
│   │   └── 5_services/                  # Universal services
│   ├── subsystems/                      # Subsystem-specific back2front (#5-4-2)
│   │   ├── 0_anuttara/                  # Anuttara back2front
│   │   │   ├── adapters/                # Anuttara adapters
│   │   │   ├── agent-cards/             # Anuttara agent cards
│   │   │   └── skills/                  # Anuttara skills
│   │   ├── 1_paramasiva/                # Paramasiva back2front
│   │   │   ├── adapters/                # Paramasiva adapters
│   │   │   ├── agent-cards/             # Paramasiva agent cards
│   │   │   └── skills/                  # Paramasiva skills
│   │   ├── 2_parashakti/                # Parashakti back2front
│   │   │   ├── adapters/                # Parashakti adapters
│   │   │   ├── agent-cards/             # Parashakti agent cards
│   │   │   └── skills/                  # Parashakti skills
│   │   ├── 3_mahamaya/                  # Mahamaya back2front
│   │   │   ├── adapters/                # Mahamaya adapters
│   │   │   ├── agent-cards/             # Mahamaya agent cards
│   │   │   └── skills/                  # Mahamaya skills
│   │   ├── 4_nara/                      # Nara back2front
│   │   │   ├── adapters/                # Nara adapters
│   │   │   ├── agent-cards/             # Nara agent cards
│   │   │   └── skills/                  # Nara skills
│   │   └── 5_epii/                      # Epii back2front
│   │       ├── adapters/                # Epii adapters
│   │       ├── agent-cards/             # Epii agent cards
│   │       └── skills/                  # Epii skills
│   │           ├── epii-analysis-pipeline-skill.md # Analysis pipeline skill
│   │           ├── epii-chat-skill.md   # Chat skill
│   │           ├── epii-skills-initializer.md # Skills initializer
│   │           └── bimba-update-management-skill.md # Update management
│   ├── adapters/                        # Root level agent adapters
│   │   ├── epii-agent-adapter.md        # Epii A2A integration
│   │   └── nara-agent-adapter.md        # Nara A2A integration
│   ├── agent-cards/                     # Root level agent capability definitions
│   │   ├── epii-agent-card.md           # Epii capabilities
│   │   ├── nara-agent-card.md           # Nara capabilities
│   │   └── index.md                     # Agent registry
│   ├── skills/                          # Root level skills registry and routing
│   │   ├── epii-skills-initializer.md   # Epii skill definitions
│   │   ├── nara-skills-initializer.md   # Nara skill definitions
│   │   └── index.md                     # Skills orchestration
│   └── examples/                        # Test clients and usage demonstrations
└── 0_system_overview/                   # System-wide documentation
    ├── architecture_overview.md         # High-level architecture
    ├── data_flow_diagrams.md           # System data flows
    ├── coordinate_system_mapping.md     # Bimba coordinate mappings
    ├── integration_patterns.md          # Common integration patterns
    └── development_guidelines.md        # Development standards
```

## Phase 2: Documentation Template Standards

### File Documentation Template
Each `.md` file follows this structure:

```markdown
# [File Name] - BMAD Memory Documentation

## File Location
**Path**: `[relative path from epii_app root]`
**Bimba Coordinate**: `[coordinate if applicable]`
**Last Updated**: `[date]`

## Purpose & Role
[2-3 sentence description of what this file does and its role in the system]

## System Integration
### Imports
- [List of key imports with brief descriptions]

### Exports
- [List of key exports with brief descriptions]

### Dependencies
- [List of files/services this depends on]

### Dependents
- [List of files/services that depend on this]

## Key Functions/Components
### [Function/Component Name] (Lines X-Y)
**Purpose**: [Brief description]
**Parameters**: [If applicable]
**Returns**: [If applicable]
**Notes**: [Any important implementation details, bugs, or quirks]

## Data Flow
[Description of how data flows through this file]

## Configuration
[Any configuration options, environment variables, or settings]

## Known Issues
[List any bugs, TODOs, or problematic areas]

## Testing
[Information about tests, if any]

## Related Files
[List of closely related files with brief descriptions of relationships]

## Development Notes
[Any important notes for future development]
```

## Phase 3: Implementation Strategy

### Step 1: Backend Documentation (Priority 1)
1. **Database Layer** - Document MCP servers and database services
2. **Subsystem Backend** - Document agent implementations and pipelines
3. **Epi-Logos System** - Document universal agent orchestration

### Step 2: Back2Front Documentation (Priority 2)
1. **A2A System** - Document agent communication protocols
2. **Skills System** - Document skill registry and routing
3. **Agent Integration** - Document adapters and capabilities

### Step 3: Frontend Documentation (Priority 3)
1. **Shared Components** - Document UI infrastructure
2. **Subsystem Frontend** - Document visualization components
3. **Epi-Logos System** - Document universal agent interface

## Phase 4: Automated Update System

### Custom Slash Command: `/update-bmad-memory`
**Functionality**:
- Detect file changes via git diff
- Parse structural changes in modified files
- Update corresponding BMAD memory documentation
- Validate cross-references and coordinate mappings
- Generate change reports

### Implementation Structure
```javascript
{
  name: "update-bmad-memory",
  description: "Update BMAD memory system to reflect codebase changes",
  parameters: {
    scope: ["all", "backend", "frontend", "back2front", "specific-file"],
    mode: ["incremental", "full-refresh"],
    target: "optional file path for specific updates"
  },
  workflow: [
    "detect_changes",
    "analyze_impact",
    "update_documentation",
    "validate_consistency",
    "generate_report"
  ]
}
```

## Success Metrics

1. **Completeness**: 100% coverage of significant codebase files
2. **Accuracy**: Documentation reflects actual implementation, not intentions
3. **Maintainability**: Automated updates keep documentation current
4. **Usability**: Context-efficient for agent planning and development
5. **Consistency**: Uniform structure and terminology throughout

## Next Steps

1. Create directory structure in BMAD memory system
2. Begin systematic documentation starting with backend database layer
3. Implement automated update tooling
4. Validate and refine documentation standards
5. Deploy custom slash command for maintenance

This plan ensures the BMAD memory system becomes a living, accurate reflection of the codebase that supports effective development without context window overflow or missing critical details.
