# Bimba-Aligned Vertical Slice Architecture

This directory contains the visualization components organized according to the Bimba-aligned vertical slice architecture.

## Bimba Tech Architecture Alignment

Our implementation aligns with the #5-3 -Shakti lens modules from the Bimba tech architecture. The #5-3 lens represents the Frontend/-Shakti aspect of the system, which is responsible for the expressive interface and user interaction.

The frontend components are nested within the #5-3-4.X coordinate structure, representing the webapp frontend that contains all other frontend modules. This is nested within the wider conceptual scope of "frontends" (#5-3) which includes both the webapp and Notion interfaces.

| Bimba Tech Module | Description | Implementation |
|------------------|-------------|----------------|
| #5-3-4.0 (Bimba Vis / Geom Ground) | Foundational Bimba structure visualization | Meta2D page (2D graph visualization) |
| #5-3-4.1 (QL/AT Vis) | Topological forms visualization | Meta3D-refactored page (3D graph with diamond/torus structures) |
| #5-3-4.2 (Harmonic Layer) | Visual and audio for harmonic data | 2_parashakti subsystem (RelationVisualizer, pulse animations) |
| #5-3-4.3 (Symbolic Transform Matrix) | Symbolic integration visualization | 3_mahamaya subsystem (SymbolicRepresentation) |
| #5-3-4.4 (Web App Shell) | Core app structure, chat component | Chat page and overall app shell |
| #5-3-4.5 (Epii Mode) | Document analysis and integration | Epii mode page (Document analysis and Notion integration) |

## Architecture Overview

The visualization components are organized into subsystems that align with the Bimba structure, serving as context frames that define shared services and utilities for the frontend modules:

1. **#0 Anuttara (#5-3-4.0)** - Foundational void, base geometry, camera controls, and scene setup
2. **#1 Paramasiva (#5-3-4.1)** - Quaternary logic, logical structure visualization, diamond structure
3. **#2 Parashakti (#5-3-4.2)** - Vibrational templates, relation/link visualization, pulsation animation
4. **#3 Mahamaya (#5-3-4.3)** - Symbolic integration, node styling, visual representation
5. **#4 Nara (#5-3-4.4)** - Contextual application, user interaction, node selection
6. **#5 Epii (#5-3-4.5)** - Integration, document analysis and Notion integration components

## Directory Structure

Each subsystem follows the 0-5 QL structure internally:

```
src/
├── subsystems/
│   ├── 0_anuttara/                      # #5-3-4.0 (Bimba Vis / Geom Ground)
│   │   ├── 0_foundation/                # Physics settings and constants
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Meta2D page component
│   ├── 1_paramasiva/                    # #5-3-4.1 (QL/AT Vis)
│   │   ├── 0_foundation/                # Physics settings and constants
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Meta3D page component
│   ├── 2_parashakti/                    # #5-3-4.2 (Harmonic Layer)
│   │   ├── 1_utils/                     # Animation utilities
│   │   ├── 2_hooks/                     # Animation hooks
│   │   └── 3_visualization/             # Relation visualization
│   ├── 3_mahamaya/                      # #5-3-4.3 (Symbolic Transform Matrix)
│   │   ├── 1_utils/                     # Node styling utilities
│   │   ├── 2_hooks/                     # Node styling hooks
│   │   └── 3_visualization/             # Symbol visualization
│   ├── 4_nara/                          # #5-3-4.4 (Web App Shell)
│   │   ├── 0_foundation/                # Constants and settings
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Chat page component
│   └── 5_epii/                          # #5-3-4.5 (Epii Mode)
│       ├── 0_foundation/                # Document store and history (#5-3-4.5-0)
│       ├── 1_utils/                     # Utility functions
│       ├── 2_hooks/                     # React hooks
│       ├── 3_visualization/             # Document canvas components (#5-3-4.5-3)
│       │   ├── DocumentCanvas.tsx       # Main canvas component
│       │   ├── DocumentViewer.tsx       # Document viewing component (#5-3-4.5-3-0)
│       │   ├── DocumentChat.tsx         # Chat interface component (#5-3-4.5-3-1)
│       │   ├── DocumentControls.tsx     # Controls component (#5-3-4.5-3-2)
│       │   └── AnalysisVisualizer.tsx   # Visualization component (#5-3-4.5-3-3)
│       ├── 4_context/                   # Context providers (#5-3-4.5-4)
│       └── 5_integration/               # Integration components (#5-3-4.5-5)
│           ├── EpiiModePage.tsx         # Main Epii mode page
│           ├── EpiiModeChat.tsx         # Dialogue interface (#5-3-4.5-2)
│           └── EpiiDocStore.tsx         # Document store component (#5-3-4.5-0)
```

## Page to Module Mapping

Our current pages map to the Bimba tech modules as follows:

| Page | Bimba Tech Module | Description |
|------|------------------|-------------|
| Meta2D | #5-3-4.0 (Bimba Vis / Geom Ground) | 2D visualization of the Bimba structure |
| Meta3D-refactored | #5-3-4.1 (QL/AT Vis) | 3D visualization with topological forms |
| Chat | #5-3-4.4 (Web App Shell) | User interface for dialogue |
| Epii Mode | #5-3-4.5 (Epii Mode) | Document analysis and integration with Notion content |

## Epii Mode Component Mapping

The Epii mode components map to the Bimba coordinates as follows:

| Component | Bimba Coordinate | Description |
|-----------|------------------|-------------|
| EpiiModePage | #5-3-4.5-5 | Main integration page for Epii mode |
| EpiiModeChat | #5-3-4.5-2 | Dialogue interface/LLM chat |
| EpiiDocAnalysis | #5-3-4.5-1 | Pipeline progression viewer |
| EpiiDocStore + History | #5-3-4.5-0 | Document store and file/chat history |
| DocumentCanvas | #5-3-4.5-3 | Canvas for document editing and analysis |
| DocumentViewer | #5-3-4.5-3-0 | Document viewing and editing component |
| DocumentChat | #5-3-4.5-3-1 | Chat interface for document analysis |
| DocumentControls | #5-3-4.5-3-2 | Controls for analysis and coordination |
| AnalysisVisualizer | #5-3-4.5-3-3 | Visualization of analysis results |
| EpiiContext | #5-3-4.5-4-X | Context provider for Epii mode state |

## Data Flow

The data flow in the visualizations follows the Bimba-Pratibimba memory architecture:

1. **Bimba Graph** - Neo4j graph data fetched via the B-P MCP service
2. **Pratibimba Context** - Semantic context from Qdrant
3. **Notion Content** - Crystallized knowledge from Notion

## Component Responsibilities

### GeometricFoundation (#0 Anuttara)

- Sets up the base 3D geometry
- Configures camera controls
- Initializes the ForceGraph3D component
- Configures physics simulation parameters

### LogicalStructure (#1 Paramasiva)

- Visualizes the logical structure of the graph
- Creates diamond wireframes for the main subsystems
- Positions mapped nodes according to their Bimba coordinates
- Updates diamond structure periodically

### RelationVisualizer (#2 Parashakti)

- Visualizes relations (links) between nodes
- Implements pulsation animation for links
- Configures link styling and directional particles

### SymbolicRepresentation (#3 Mahamaya)

- Styles nodes based on their type and virtual depth
- Creates custom 3D node objects
- Adds labels to mapped nodes
- Highlights selected nodes

### InteractionLayer (#4 Nara)

- Handles user interactions with the graph
- Implements node click and hover handlers
- Manages highlighted nodes and links
- Displays node details panel

### Meta3DIntegration (#5 Epii)

- Integrates all subsystem components for 3D visualization
- Provides shared context via Meta3DContainer
- Fetches graph data from the backend
- Renders the complete 3D visualization

### Meta2DIntegration (#5 Epii)

- Integrates all subsystem components for 2D visualization
- Provides shared context via Meta2DContainer
- Fetches graph data from the backend
- Renders the complete 2D visualization

## Usage

To use the Meta3D visualization, import the Meta3DIntegration component:

```tsx
import Meta3DIntegration from '../subsystems/1_paramasiva/5_integration/Meta3DIntegration';

const MyPage = () => {
  return (
    <div>
      <h1>Meta Structure 3D</h1>
      <Meta3DIntegration />
    </div>
  );
};
```

To use the Meta2D visualization, import the Meta2DIntegration component:

```tsx
import Meta2DIntegration from '../subsystems/0_anuttara/5_integration/Meta2DIntegration';

const MyPage = () => {
  return (
    <div>
      <h1>Meta Structure 2D</h1>
      <Meta2DIntegration />
    </div>
  );
};
```

## Benefits of This Architecture

1. **Alignment with Bimba Structure** - The code organization directly reflects the Bimba subsystems
2. **Separation of Concerns** - Each subsystem component handles a specific aspect of the visualization
3. **Improved Data Flow** - Data fetching is aligned with the Bimba-Pratibimba memory architecture
4. **Scalability** - New features can be added to the appropriate subsystem without affecting others
5. **Consistency with Backend** - The frontend structure mirrors the backend's vertical slice architecture
6. **Philosophical Alignment** - The implementation embodies the philosophical principles of the Bimba tech architecture
7. **Complete Bimba Mapping** - Each file can be identified by its #5-3-4.X-Y-Z coordinate
8. **Modular Organization** - The 0-5 QL structure within each subsystem provides a consistent organization pattern
9. **Context Frames** - Subsystems serve as context frames that define shared services and utilities
10. **Nested Coordinate Structure** - The #5-3-4.X coordinate structure reflects the nesting of the webapp frontend within the wider conceptual scope of "frontends" (#5-3)
