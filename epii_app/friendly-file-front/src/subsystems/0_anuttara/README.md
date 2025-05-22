# 0_anuttara Subsystem

## Bimba Tech Architecture Alignment
- **#5-3-4.0 (Bimba Vis / Geom Ground)**
- Visualizes the foundational Bimba structure using D3.js/ForceGraph2D
- Represents the Agent (0000)=(0/1) (Being/Prakasa-Vimarsa)

## Overview
The 0_anuttara subsystem is responsible for the 2D visualization of the Bimba structure. It provides the foundational geometric visualization that serves as the "ground" upon which other visualizations are built. As part of the #5-3-4.X coordinate structure, it serves as a context frame (#5-3-4.0) that defines shared services and utilities for 2D visualization and data fetching across the webapp frontend.

## QL Structure

### 0_foundation (#5-3-4.0-0)
Contains constants and physics settings for the 2D visualization:
- `physics2DSettings.ts` - Physics simulation parameters
- `graphConstants.ts` - Constants for graph visualization

### 1_utils (#5-3-4.0-1)
Contains utility functions for 2D geometry calculations, including:
- `depthCalculation.ts` (#5-3-4.0-1-0) - Virtual depth calculation
- `hexagonalPositioning.ts` (#5-3-4.0-1-1) - Hexagonal grid positioning
- `orbitalPositioning.ts` (#5-3-4.0-1-2) - Orbital positioning
- `nodeDataProcessing.ts` (#5-3-4.0-1-3) - Node data processing

### 2_hooks (#5-3-4.0-2)
Contains React hooks for the 2D visualization, including:
- `useGraphData.ts` (#5-3-4.0-2-0) - Data fetching from backend
- `useGraphLayout.ts` (#5-3-4.0-2-1) - 2D node positioning
- `useGraphStyling.ts` (#5-3-4.0-2-2) - Node styling

### 3_visualization (#5-3-4.0-3)
Contains visual components for the 2D visualization, including:
- `Meta2DFoundation.tsx` (#5-3-4.0-3-0) - Base 2D visualization
- `useGraphProcessing.ts` (#5-3-4.0-3-1) - Data processing
- `useGraphRendering.ts` (#5-3-4.0-3-2) - Custom rendering functions

### 4_context (#5-3-4.0-4)
Contains context providers and interaction handlers for the 2D visualization, including:
- `Meta2DContainer.tsx` (#5-3-4.0-4-0) - Context provider
- `useGraphInteractions.ts` (#5-3-4.0-4-1) - Interaction handlers

### 5_integration (#5-3-4.0-5)
Contains the main page component for the 2D visualization:
- `Meta2DIntegration.tsx` (#5-3-4.0-5-0) - Main Meta2D page component

## Usage
To use the 2D visualization, import the Meta2DIntegration component:

```tsx
import Meta2DIntegration from '../subsystems/0_anuttara/5_integration/Meta2DIntegration';

const App = () => {
  return (
    <div>
      <Meta2DIntegration />
    </div>
  );
};
```

## Component Interactions

The Anuttara subsystem components interact in the following way:

1. **Meta2DContainer** (#5-3-4.0-4-0) provides global state management for the 2D visualization
2. **Meta2DFoundation** (#5-3-4.0-3-0) serves as the main container for the 2D visualization
3. **useGraphData** (#5-3-4.0-2-0) fetches graph data from the backend
4. **useGraphLayout** (#5-3-4.0-2-1) handles 2D node positioning based on virtual depth
5. **useGraphStyling** (#5-3-4.0-2-2) provides styling for nodes and links
6. **useGraphProcessing** (#5-3-4.0-3-1) processes graph data for visualization
7. **useGraphRendering** (#5-3-4.0-3-2) provides custom rendering functions
8. **useGraphInteractions** (#5-3-4.0-4-1) handles user interactions with the 2D visualization

## Integration with Other Subsystems

As a context frame (#5-3-4.0), the Anuttara subsystem provides shared services and utilities for 2D visualization and data fetching across the webapp frontend:

1. **Paramasiva** (#5-3-4.1): Provides graph data for 3D visualization
2. **Parashakti** (#5-3-4.2): Uses link styling from Anuttara
3. **Mahamaya** (#5-3-4.3): Provides node styling for 2D visualization
4. **Nara** (#5-3-4.4): Uses graph data for chat context
5. **Epii** (#5-3-4.5): Uses graph data for document analysis

## Future Enhancements

Planned enhancements for this subsystem include:

1. **Enhanced Data Fetching**: More sophisticated data fetching with caching and pagination
2. **Interactive Filtering**: Advanced filtering capabilities for graph visualization
3. **Search Integration**: Integrated search functionality for finding nodes
4. **Performance Optimization**: Improved rendering performance for large graphs
5. **Accessibility**: Enhanced accessibility features for the 2D visualization
