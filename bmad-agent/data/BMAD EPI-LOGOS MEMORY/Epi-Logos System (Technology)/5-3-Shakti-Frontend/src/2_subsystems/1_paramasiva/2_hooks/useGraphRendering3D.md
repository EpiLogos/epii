# useGraphRendering3D.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/1_paramasiva/2_hooks/useGraphRendering3D.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graph Rendering 3D Hook responsible for rendering the 3D graph visualization with performance optimization through AnimationManager coordination. Provides animated nodes and edges with pulsation effects, highlight management, and smooth rendering updates. Serves as the core rendering engine for the Paramasiva subsystem's 3D graph visualization with sophisticated animation integration and performance optimization.

## System Integration
### Imports
- **React Hooks**: useRef, useEffect, useMemo for state management and lifecycle
- **Three.js**: THREE for 3D graphics and animation calculations
- **Meta Data Types**: Node, Edge from shared components for graph data structures
- **Animation Manager**: getAnimationManager and related types from Parashakti utils for coordinated animations

### Exports
- **useGraphRendering3D**: Main hook providing animated nodes and edges for 3D graph rendering

### Dependencies
- **AnimationManager**: Parashakti animation coordination system
- **Meta Data Types**: Shared graph data structure definitions
- **Three.js**: 3D graphics library for mathematical calculations
- **React**: Core hooks for component lifecycle management

### Dependents
- **Meta3D Visualization**: Primary consumer for 3D graph rendering
- **Paramasiva Graph Components**: 3D graph visualization components
- **ForceGraph3D Integration**: Direct integration with force-directed graph layout

## Key Functions/Components
### useGraphRendering3D Hook (Lines 28-314)
**Purpose**: Main hook providing animated 3D graph rendering with performance optimization
**Parameters**: nodes (Node[]), edges (Edge[]), highlightedNodes (Set<string>), highlightedLinks (Set<string>), forceGraphRef (optional)
**Returns**: Object with animatedNodes and animatedEdges arrays
**Notes**: 314 lines implementing comprehensive 3D rendering with AnimationManager integration

### Animation Registration (Lines 42-89)
**Purpose**: Registers pulsation animation with AnimationManager for coordinated performance
**Parameters**: Animation callback with time, deltaTime, scene parameters
**Returns**: Animation ID for management and cleanup
**Notes**: Uses sine wave pattern with 5-second cycle for smooth pulsation effects

### Node Animation Processing (Lines 91-180)
**Purpose**: Processes and animates individual nodes with highlight effects and pulsation
**Parameters**: Node data with styling and highlight state
**Returns**: Animated node objects with updated properties
**Notes**: Applies pulsation effects to highlighted nodes with size and opacity modulation

### Edge Animation Processing (Lines 182-250)
**Purpose**: Processes and animates edges with highlight effects and visual feedback
**Parameters**: Edge data with styling and highlight state
**Returns**: Animated edge objects with updated properties
**Notes**: Coordinate pulsation effects with node animations for visual consistency

### Cleanup and Memory Management (Lines 252-314)
**Purpose**: Handles animation cleanup and memory management on component unmount
**Parameters**: Animation ID and manager references
**Returns**: Cleanup functions for proper resource disposal
**Notes**: Prevents memory leaks through proper animation deregistration

## Data Flow
1. **Hook Initialization**: Parameters received → Animation manager accessed → Animation registered → References initialized
2. **Animation Loop**: Time updates → Pulsation calculation → Node/edge processing → Animated output generation
3. **Highlight Processing**: Highlight sets → Node/edge filtering → Animation effects → Visual feedback
4. **Performance Optimization**: AnimationManager coordination → Shared animation loop → Reduced computational overhead
5. **Cleanup**: Component unmount → Animation deregistration → Memory cleanup → Resource disposal

## Configuration
### Animation Parameters
- **Pulse Cycle**: 5000ms (5 seconds) for complete pulsation cycle
- **Pulsation Range**: 0.5 to 1.5 multiplier for size effects
- **Animation Priority**: Standard priority in AnimationManager queue
- **Subsystem**: AnimationSubsystem.PARAMASIVA for proper categorization

### Rendering Settings
- **Base Pulsation Factor**: 1.0 as neutral state
- **Highlight Amplification**: Enhanced effects for highlighted elements
- **Smooth Transitions**: Continuous animation updates for fluid motion
- **Memory Optimization**: Efficient reference management and cleanup

### Performance Configuration
- **Animation Manager Integration**: Coordinated with other subsystem animations
- **Shared Animation Loop**: Reduces individual animation overhead
- **Efficient Updates**: Memoized calculations and optimized re-renders
- **Resource Management**: Proper cleanup prevents memory leaks

## Testing
No explicit test files referenced, but includes comprehensive animation lifecycle management and error handling

## Related Files
### Core Dependencies
- **../../2_parashakti/1_utils/AnimationManager**: Animation coordination system
- **../../../shared/components/meta/metaData**: Graph data type definitions
- **Three.js**: 3D graphics and mathematical calculations

### Integration Points
- **Meta3D Visualization**: Primary consumer for 3D graph rendering
- **ForceGraph3D Components**: Direct integration with force-directed layouts
- **Paramasiva Graph System**: Core component of 3D visualization subsystem

### Animation Architecture
- **AnimationManager**: Centralized animation coordination across subsystems
- **Performance Optimization**: Shared animation loops and efficient resource usage
- **Cross-Subsystem Integration**: Coordinated animations with other subsystems

## Development Notes
- **AnimationManager Integration**: Uses centralized animation system for better performance and coordination
- **Pulsation Effects**: Sophisticated sine wave-based pulsation for smooth visual feedback
- **Highlight Management**: Comprehensive highlight detection and visual enhancement
- **Performance Optimization**: Efficient animation loops and memory management
- **Three.js Integration**: Leverages Three.js for mathematical calculations and 3D operations
- **Resource Cleanup**: Proper animation deregistration prevents memory leaks
- **Memoization**: Optimized re-renders through React memoization patterns
- **Flexible Integration**: Optional ForceGraph3D reference for external refresh coordination
- **Scalable Architecture**: Designed to handle large graphs with efficient animation processing
- **Cross-Subsystem Coordination**: Integrates with Parashakti animation utilities for system-wide coordination
