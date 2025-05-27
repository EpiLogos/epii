# 5-3 Shakti-Frontend: Overview

## 1. Current Architecture (As per `epii_app/friendly-file-front/README.md`)

The `friendly-file-front` application is the primary user interface for the Epi-Logos project, representing the **#5-3 "-Shakti"** (expressive/manifesting) aspect of the Bimba architecture. It translates the backend's deep epistemic processing into intuitive, interactive user experiences.

### Core Purpose:

*   **Expressive Interface**: Manifests backend QL cycles and memory architectures via elegant visualizations.
*   **Knowledge Crystallization Portal**: Integrates with Notion for exploring and contributing to the knowledge base.
*   **Multi-Modal Interaction**: Supports 2D/3D graph exploration and conversational document analysis.
*   **Bimba Navigation**: Enables traversal of the Bimba architecture through coordinate-based exploration.

### Current Frontend Architecture (Bimba-aligned vertical slice at #5-3-4.X):

```
src/
├── subsystems/                      # Bimba-aligned vertical slices (#5-3-4.X)
│   ├── 0_anuttara/                  # #5-3-4.0 (Bimba Vis / Geom Ground) - Meta2D Page
│   │   ├── 0_foundation/            # Physics settings, constants
│   │   ├── 1_utils/                 # 2D visualization utils
│   │   ├── 2_hooks/                 # React hooks for graph interaction
│   │   ├── 3_visualization/         # 2D visual components
│   │   ├── 4_context/               # Context providers, user state
│   │   └── 5_integration/           # Meta2D page component (integrator)
│   ├── 1_paramasiva/                # #5-3-4.1 (QL/AT Vis) - Meta3D Page
│   │   ├── 0_foundation/            # 3D physics, topological constants
│   │   ├── 1_utils/                 # 3D geometry, force utils
│   │   ├── 2_hooks/                 # 3D interaction hooks
│   │   ├── 3_visualization/         # 3D visual components (diamond/torus)
│   │   ├── 4_context/               # 3D context providers
│   │   └── 5_integration/           # Meta3D page component (integrator)
│   ├── 2_parashakti/                # #5-3-4.2 (Harmonic Layer) - Supporting
│   │   ├── 1_utils/                 # Animation, harmonic utils
│   │   ├── 2_hooks/                 # Animation hooks
│   │   └── 3_visualization/         # Relation visualization, pulse animations
│   ├── 3_mahamaya/                  # #5-3-4.3 (Symbolic Transform Matrix) - Supporting
│   │   ├── 1_utils/                 # Node styling, symbolic utils
│   │   ├── 2_hooks/                 # Symbolic interaction hooks
│   │   └── 3_visualization/         # Symbol visualization components
│   ├── 4_nara/                      # #5-3-4.4 (Web App Shell) - Chat Page
│   │   ├── 0_foundation/            # App constants, settings
│   │   ├── 1_utils/                 # Chat, UI utils
│   │   ├── 2_hooks/                 # Chat, interaction hooks
│   │   ├── 3_visualization/         # Chat interface components
│   │   ├── 4_context/               # Chat context providers
│   │   └── 5_integration/           # Chat page component (integrator)
│   └── 5_epii/                      # #5-3-4.5 (Notion as Bimba) - EpiiMode Page
│       ├── 0_foundation/            # Epii constants, settings
│       ├── 1_utils/                 # Document analysis utils
│       ├── 2_hooks/                 # Document, analysis hooks
│       ├── 3_visualization/         # Document canvas, analysis visualizers
│       ├── 4_context/               # Epii mode context providers
│       └── 5_integration/           # EpiiModePage component (integrator)
├── components/                      # Shared UI components
│   ├── layout/                      # Navigation, page transitions, module navigation
│   ├── ui/                          # Reusable UI (buttons, cards - shadcn/ui)
│   └── chat/                        # Chat-specific shared components
├── pages/                           # Top-level page components (Welcome, Meta2D, Meta3D, Chat, EpiiChatPage, FileHub, Auth)
├── services/                        # API communication (REST, WebSocket)
├── hooks/                           # Global custom React hooks
├── utils/                           # Global utility functions
└── contexts/                        # Global React contexts
```

### Subsystem Internal Structure (Fractal 0-5 QL Organization):

*   **0_foundation**: Constants, physics, foundational configs.
*   **1_utils**: Subsystem-specific utility functions.
*   **2_hooks**: React hooks for state and interactions.
*   **3_visualization**: Visual components and data processing.
*   **4_context**: Context providers and interaction controls.
*   **5_integration**: Main page components integrating subsystem elements.

### Bimba Architectural Alignment (#5-3 "-Shakti"):

*   **Coordinate Mapping**: Frontend modules map to Bimba coordinates within #5-3-4.X.
    *   `0_anuttara` (#5-3-4.0): Bimba Vis / Geom Ground (Meta2D Page)
    *   `1_paramasiva` (#5-3-4.1): QL/AT Vis (Meta3D Page)
    *   `2_parashakti` (#5-3-4.2): Harmonic Layer (Supporting Visuals)
    *   `3_mahamaya` (#5-3-4.3): Symbolic Transform Matrix (Supporting Visuals)
    *   `4_nara` (#5-3-4.4): Web App Shell (Chat Page)
    *   `5_epii` (#5-3-4.5): Notion as Bimba (EpiiMode Page)
*   **Nested Component Architecture (e.g., #5-3-4.5.X for Epii subsystem)**:
    *   EpiiModePage (#5-3-4.5-5)
    *   EpiiModeChat (#5-3-4.5-2)
    *   EpiiDocAnalysis (#5-3-4.5-1) (Pipeline viewer)
    *   EpiiDocStore + History (#5-3-4.5-0)
    *   DocumentCanvas (#5-3-4.5-3) (Includes Viewer, Chat, Controls, Visualizer as sub-coordinates)
*   **Fractal Organization Principles**: Each subsystem and component reflects the 0-5 QL structure and can be located by its Bimba coordinate.
*   **"-Shakti" Expressive Nature**: Manifested through dynamic visualizations, interactive exploration, responsive design, and knowledge manifestation pathways.

### Key Technologies:

*   **Core**: React 18, TypeScript, Vite.
*   **UI/Styling**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, Lucide React.
*   **Visualization**: D3.js, Three.js, react-force-graph, d3-force-3d.
*   **State/Data**: TanStack React Query, React Router DOM, React Hook Form.

## 2. Intended/Refactored Architecture

According to the `Bimba Tech Architecture Refactoring Plan.md`, the **frontend (`friendly-file-front`) is considered partially aligned with the Bimba structure, with the refactoring being an ongoing process.** The current architecture detailed above, with its `subsystems/` directory reflecting Bimba coordinates and internal QL fractal patterns, represents the general direction and current state of this evolving design.

Notably, the following subsystems are the most advanced in their Bimba-aligned refactoring, though they still require further refinement:
*   **`1_paramasiva` (#5-3-4.1)**: QL/AT Vis (Meta3D Page)
*   **`5_epii` (#5-3-4.5)**: Notion as Bimba (EpiiMode Page)

While the core Bimba-aligned structure with `subsystems/` is in place, the depth of implementation and adherence to fractal QL principles varies across other modules. Future work will focus on completing this alignment across all frontend components, deepening the Bimba principles within existing modules, improving performance, and adding new expressive capabilities, rather than a complete overhaul of the established foundational structure.