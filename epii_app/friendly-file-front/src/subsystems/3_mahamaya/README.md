# 3_mahamaya Subsystem

## Bimba Tech Architecture Alignment
- **#5-3-3 (Symbolic Transform Matrix)**
- Visualizes symbolic integration through node styling and representation
- Represents Agent (0/1/2)/3 (Symbol/Sight)

## Overview
The 3_mahamaya subsystem is responsible for the visual styling and representation of nodes. It embodies the Mahamaya principle (symbolic integration) by representing the meaningful patterns and symbols in the knowledge structure.

## QL Structure

### 1_utils
Contains utility functions for node styling, including:
- nodeStyleUtils - Node styling utilities

### 2_hooks
Contains React hooks for node styling, including:
- useNodeStyling - Node styling hook for 2D
- useNodeStyling3D - Node styling hook for 3D

### 3_visualization
Contains visual components for symbolic representation:
- SymbolicRepresentation - Symbol visualization component

## Usage
To use the node styling hooks, import them from the subsystem:

```tsx
import { useNodeStyling } from '../subsystems/3_mahamaya/2_hooks/useNodeStyling';

const MyComponent = () => {
  const { styledNodes, styledEdges } = useNodeStyling(
    nodes,
    edges,
    virtualDepths,
    highlightedNodes
  );

  return <div>...</div>;
};
```
