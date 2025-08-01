# usePulsationAnimation.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/2_parashakti/2_hooks/usePulsationAnimation.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pulsation Animation Hook providing smooth, throttled pulsation effects for visual elements in graph visualizations. Creates continuous sine wave-based pulsation with configurable refresh intervals and callback integration. Serves as the foundational animation primitive for link opacity, node scaling, and other rhythmic visual effects within the Parashakti vibration/animation subsystem.

## System Integration
### Imports
- **React Hooks**: useRef, useEffect for animation lifecycle management

### Exports
- **usePulsationAnimation**: Main hook providing pulsation animation with callback integration

### Dependencies
- **React**: Core React hooks for component lifecycle and reference management
- **Browser APIs**: requestAnimationFrame for smooth animation loops

### Dependents
- **Link Animation Systems**: Components requiring pulsating link effects
- **Node Animation Systems**: Components needing rhythmic node scaling or opacity
- **Visual Feedback Systems**: Components requiring pulsation-based user feedback
- **Meta2D/Meta3D Visualizations**: Graph visualizations using pulsation effects

## Key Functions/Components
### usePulsationAnimation Hook (Lines 16-103)
**Purpose**: Main hook creating smooth pulsation animation with throttled callbacks
**Parameters**: onPulse (callback function), refreshInterval (optional number, default 250ms)
**Returns**: Current pulsation factor and animation lifecycle management
**Notes**: 103 lines implementing smooth sine wave pulsation with performance optimization

### Pulsation Calculation (Lines 35-55)
**Purpose**: Calculates sine wave-based pulsation factor with time-based progression
**Parameters**: Current time and animation parameters
**Returns**: Pulsation factor between 0.5 and 1.5
**Notes**: Uses sine wave mathematics for smooth, continuous pulsation

### Throttled Refresh System (Lines 57-75)
**Purpose**: Implements throttled callback execution to optimize performance
**Parameters**: Refresh interval and last refresh time tracking
**Returns**: Controlled callback execution timing
**Notes**: Prevents excessive callback execution while maintaining smooth animation

### Animation Loop Management (Lines 77-95)
**Purpose**: Manages requestAnimationFrame loop with proper cleanup
**Parameters**: Animation frame ID and lifecycle management
**Returns**: Animation loop control and cleanup functions
**Notes**: Proper animation frame management prevents memory leaks

### Cleanup and Resource Management (Lines 97-103)
**Purpose**: Handles component unmount cleanup and resource disposal
**Parameters**: Animation frame references and cleanup handlers
**Returns**: Cleanup functions for proper resource management
**Notes**: Prevents memory leaks through proper animation frame cancellation

## Data Flow
1. **Hook Initialization**: Hook called → Animation parameters set → Animation loop started → Callback registration
2. **Animation Loop**: requestAnimationFrame → Time calculation → Pulsation calculation → Throttle check → Callback execution
3. **Pulsation Calculation**: Current time → Sine wave calculation → Factor normalization → Pulsation factor output
4. **Callback Execution**: Throttle check → Callback invocation → Visual update → Next frame request
5. **Cleanup**: Component unmount → Animation frame cancellation → Resource cleanup → Memory optimization

## Configuration
### Animation Configuration
- **Refresh Interval**: Default 250ms (4 refreshes per second) for performance optimization
- **Pulsation Range**: 0.5 to 1.5 multiplier for visual effects
- **Sine Wave Period**: Continuous sine wave for smooth pulsation
- **Performance Throttling**: Configurable refresh rate for performance control

### Pulsation Mathematics
- **Base Formula**: Math.sin(time * 0.002) for smooth wave progression
- **Factor Calculation**: (sin + 1) * 0.5 + 0.5 for 0.5-1.5 range
- **Time Scaling**: 0.002 multiplier for appropriate pulsation speed
- **Continuous Loop**: Seamless sine wave progression without discontinuities

### Performance Configuration
- **Throttled Callbacks**: Configurable refresh interval for performance optimization
- **Animation Frame**: requestAnimationFrame for smooth 60fps animation
- **Memory Management**: Proper cleanup prevents memory leaks
- **Resource Optimization**: Efficient calculation and callback execution

## Testing
No explicit test files referenced, but includes comprehensive animation lifecycle management and performance optimization

## Related Files
### Core Dependencies
- **React**: Core React hooks for animation lifecycle management

### Integration Points
- **Link Animation Systems**: Primary consumer for pulsating link effects
- **Node Animation Systems**: Integration with node scaling and opacity effects
- **Meta2D/Meta3D Visualizations**: Graph visualizations using pulsation
- **Visual Feedback Systems**: Components requiring rhythmic visual feedback

### Animation Architecture
- **Animation Primitives**: Foundational animation hook for pulsation effects
- **Performance Optimization**: Throttled execution for efficient animation
- **Lifecycle Management**: Proper animation setup and cleanup
- **Callback Integration**: Flexible callback system for visual updates

## Development Notes
- **Smooth Animation**: Sine wave-based pulsation provides natural, smooth visual effects
- **Performance Optimization**: Throttled refresh system prevents excessive callback execution
- **Memory Management**: Proper requestAnimationFrame cleanup prevents memory leaks
- **Flexible Integration**: Callback-based design allows integration with various visual elements
- **Configurable Timing**: Adjustable refresh interval for performance tuning
- **Mathematical Precision**: Precise sine wave calculations for consistent pulsation
- **Resource Efficiency**: Optimized animation loop with minimal computational overhead
- **Cross-Component Usage**: Designed for reuse across multiple visualization components
- **Animation Foundation**: Serves as building block for more complex animation systems
- **Parashakti Alignment**: Properly aligned with vibration/animation subsystem principles
