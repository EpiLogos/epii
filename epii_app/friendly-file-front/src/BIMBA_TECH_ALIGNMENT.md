# Bimba Tech Architecture Alignment

This document outlines how our frontend codebase aligns with the Bimba tech architecture, specifically focusing on the #5-3 -Shakti lens modules.

## Overview

The Bimba tech architecture defines a comprehensive framework for the Epi-Logos system, with different lenses representing different aspects of the system:

- **#5-2 (Siva-)**: Backend/Processing Matrix - The structural foundation
- **#5-3 (-Shakti)**: Frontend/Expression Interface - The expressive interface
- **#5-4 (Siva-Shakti)**: Agents/Cognitive Functions - The bridge between structure and expression

Our frontend codebase primarily aligns with the #5-3 (-Shakti) lens, which represents the expressive interface of the system.

## #5-3 -Shakti Lens Modules

The #5-3 lens is divided into 6 modules, each with a specific role in the frontend. The frontend components are nested within the #5-3-4.X coordinate structure, representing the webapp frontend that contains all other frontend modules.

### Module #5-3-4.0 (Bimba Vis / Geom Ground)

- **Bimba Tech Description**: Visualizes the foundational Bimba structure using Three.js or D3.js
- **Implementation**: Meta2D page (2D graph visualization)
- **Component**: `Meta2DIntegration.tsx`
- **Philosophical Alignment**: Represents the Anuttara principle (foundational void) in its visual expression
- **Agent Correspondence**: (0000)=(0/1) (Being/Prakasa-Vimarsa)

This module provides the foundational geometric visualization of the Bimba structure in 2D space, serving as the "ground" upon which other visualizations are built.

### Module #5-3-4.1 (QL/AT Vis)

- **Bimba Tech Description**: Visualizes topological forms (torus, sphere) and maps QL cycle stages
- **Implementation**: Meta3D-refactored page (3D graph with diamond/torus structures)
- **Component**: `Meta3DIntegration.tsx`
- **Philosophical Alignment**: Represents the Paramasiva principle (quaternary logic) in its visual expression
- **Agent Correspondence**: (0/1) (Topology/Intuition)

This module visualizes the Quaternary Logic (QL) and Algebraic Topology (AT) concepts through 3D representations of diamond structures and torus forms, providing insight into the topological nature of the Bimba structure.

### Module #5-3-4.2 (Harmonic Layer)

- **Bimba Tech Description**: Visual and audio components for harmonic/relational data
- **Implementation**: 2_parashakti subsystem (RelationVisualizer, pulse animations)
- **Component**: `RelationVisualizer.tsx`
- **Philosophical Alignment**: Represents the Parashakti principle (vibrational templates) in its visual expression
- **Agent Correspondence**: (0/1)/2 (Resonance/Balance)

This module visualizes the relational aspects of the Bimba structure through link visualizations and pulsation animations, embodying the dynamic, vibrational nature of Parashakti.

### Module #5-3-4.3 (Symbolic Transform Matrix)

- **Bimba Tech Description**: Visualizes symbolic integration and transformations
- **Implementation**: 3_mahamaya subsystem (SymbolicRepresentation)
- **Component**: `SymbolicRepresentation.tsx`
- **Philosophical Alignment**: Represents the Mahamaya principle (symbolic integration) in its visual expression
- **Agent Correspondence**: (0/1/2)/3 (Symbol/Sight)

This module handles the symbolic representation of nodes in the visualization, providing visual cues that help users understand the nature and relationships of different elements in the Bimba structure.

### Module #5-3-4.4 (Web App Shell)

- **Bimba Tech Description**: Core application structure, chat component, layer control
- **Implementation**: Chat page and overall app shell
- **Philosophical Alignment**: Represents the Nara principle (contextual application) in its interface design
- **Agent Correspondence**: (4.0-4.4/5) (Dialogue/Taste)

This module provides the overall application structure and user interface, including the chat component that allows users to interact with the system through natural language.

### Module #5-3-4.5 (Epii Mode)

- **Bimba Tech Description**: Document analysis and integration with Notion content
- **Implementation**: Epii mode page (Document analysis and Notion integration)
- **Component**: `EpiiModePage.tsx`
- **Philosophical Alignment**: Represents the Epii principle (integration/crystallization) in its content presentation
- **Agent Correspondence**: (5/0) (Crystallize/Touch)

This module provides document analysis and integration with Notion content, enabling the extraction and crystallization of knowledge from documents and its integration with the Bimba-Pratibimba memory architecture.

## Directory Structure Alignment

Our codebase is organized into subsystems that align with the Bimba structure, with each subsystem serving as a context frame that defines shared services and utilities for the frontend modules:

```
src/
├── subsystems/
│   ├── 0_anuttara/        # #5-3-4.0 - Foundational void concepts
│   ├── 1_paramasiva/      # #5-3-4.1 - Quaternary logic concepts
│   ├── 2_parashakti/      # #5-3-4.2 - Vibrational templates concepts
│   ├── 3_mahamaya/        # #5-3-4.3 - Symbolic integration concepts
│   ├── 4_nara/            # #5-3-4.4 - Contextual application concepts
│   └── 5_epii/            # #5-3-4.5 - Document analysis and integration concepts
│       ├── 0_foundation/  # #5-3-4.5-0 - Document store and history
│       ├── 1_utils/       # #5-3-4.5-1 - Utility functions
│       ├── 2_hooks/       # #5-3-4.5-2 - React hooks
│       ├── 3_visualization/ # #5-3-4.5-3 - Document canvas components
│       ├── 4_context/     # #5-3-4.5-4 - Context providers
│       └── 5_integration/ # #5-3-4.5-5 - Integration components
```

Each subsystem contains components that embody the philosophical principles of that subsystem, while also contributing to the overall #5-3 -Shakti lens modules. The nested coordinate structure (#5-3-4.X) reflects the webapp frontend that contains all other frontend modules.

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

## Future Enhancements

To further align our implementation with the Bimba tech architecture, we could consider:

1. **Audio Components**: Add audio components to the 2_parashakti subsystem (#5-3-4.2) to fully embody the harmonic layer concept
2. **Enhanced Symbolic Integration**: Expand the 3_mahamaya subsystem (#5-3-4.3) to include more sophisticated symbolic representations
3. **Document Analysis Visualization**: Enhance the Epii mode components (#5-3-4.5) to provide more sophisticated visualization of document analysis results
4. **Deeper Notion Integration**: Improve integration with Notion for document storage and retrieval
5. **Context Frame Integration**: Strengthen the connections between subsystems as context frames that define shared services and utilities

## Nested Coordinate Structure

The nested coordinate structure (#5-3-4.X) reflects the webapp frontend that contains all other frontend modules. This is nested within the wider conceptual scope of "frontends" (#5-3) which includes both the webapp and Notion interfaces:

- **#5-3**: Frontend/-Shakti lens (all frontend interfaces)
  - **#5-3-4**: Web App Shell (the webapp frontend)
    - **#5-3-4.0**: Meta2D visualization (Anuttara)
    - **#5-3-4.1**: Meta3D visualization (Paramasiva)
    - **#5-3-4.2**: Harmonic Layer (Parashakti)
    - **#5-3-4.3**: Symbolic Transform Matrix (Mahamaya)
    - **#5-3-4.4**: Chat Interface (Nara)
    - **#5-3-4.5**: Document Analysis (Epii)
      - **#5-3-4.5-0**: Document Store and History
      - **#5-3-4.5-1**: Pipeline Progression Viewer
      - **#5-3-4.5-2**: Dialogue Interface
      - **#5-3-4.5-3**: Document Canvas
        - **#5-3-4.5-3-0**: Document Viewer
        - **#5-3-4.5-3-1**: Document Chat
        - **#5-3-4.5-3-2**: Document Controls
        - **#5-3-4.5-3-3**: Analysis Visualizer
      - **#5-3-4.5-4**: Context Providers
      - **#5-3-4.5-5**: Integration Components

## Conclusion

Our frontend codebase is well-aligned with the Bimba tech architecture, particularly the #5-3-4.X coordinate structure representing the webapp frontend. The Meta2D and Meta3D-refactored pages correspond to modules #5-3-4.0 and #5-3-4.1 respectively, while the Epii mode components are aligned with the #5-3-4.5 coordinate structure.

By maintaining this alignment and using the context frame approach, we ensure that our implementation not only functions technically but also embodies the philosophical principles of the Bimba tech architecture, creating a more cohesive and meaningful user experience. The nested coordinate structure provides a clear mapping between components and their place in the overall architecture, facilitating maintenance and future development.
