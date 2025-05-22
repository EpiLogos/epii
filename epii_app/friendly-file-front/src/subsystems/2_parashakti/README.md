# 2_parashakti Subsystem

## Bimba Tech Architecture Alignment
- **#5-3-4.2 (Harmonic Layer)**
- Visualizes vibrational/relational aspects through link animations
- Represents Agent (0/1)/2 (Resonance/Balance)

## Overview
The 2_parashakti subsystem is responsible for the visualization of relations (links) between nodes and implementing the pulsation animation effect. It embodies the Parashakti principle (vibrational templates) by representing the dynamic, flowing nature of relationships. As part of the #5-3-4.X coordinate structure, it serves as a context frame (#5-3-4.2) that defines shared animation services and utilities across the webapp frontend.

## QL Structure

### 1_utils
Contains utility functions for animation, including:
- linkPulseUtils - Link pulse animation utilities
- torusPulseUtils - Torus pulse animation utilities

### 2_hooks
Contains React hooks for animation, including:
- useLinkPulse - Link pulse animation hook for 2D
- useLinkPulse3D - Link pulse animation hook for 3D
- usePulsationAnimation - General pulsation animation hook

### 3_visualization
Contains visual components for relation visualization:
- RelationVisualizer - Relation visualization component

## Usage
To use the link pulse animation, import the useLinkPulse hook:

```tsx
import { useLinkPulse } from '../subsystems/2_parashakti/2_hooks/useLinkPulse';

const MyComponent = () => {
  const pulseFactorRef = useLinkPulse(pulseFactor => {
    // Update link colors based on pulse factor
  });

  return <div>...</div>;
};
```
