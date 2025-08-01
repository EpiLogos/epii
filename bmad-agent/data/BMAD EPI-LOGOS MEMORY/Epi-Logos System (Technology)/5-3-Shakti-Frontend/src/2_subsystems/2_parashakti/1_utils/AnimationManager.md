# AnimationManager.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/2_parashakti/1_utils/AnimationManager.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Animation Manager providing centralized coordination and management of all animations across the Epi-Logos system. Implements subsystem-based animation organization, priority management, performance optimization, and synchronized animation loops. Serves as the core animation orchestration system within the Parashakti vibration subsystem with sophisticated animation lifecycle management, Three.js integration, and cross-subsystem coordination capabilities.

## System Integration
### Imports
- **Three.js**: THREE for 3D animation calculations and scene management

### Exports
- **AnimationSubsystem**: Enum defining subsystem-based animation categories (0-5)
- **AnimationCategory**: Enum defining animation types (wireframe, node, link, camera, physics)
- **AnimationPriority**: Enum defining animation priority levels (low, normal, high, critical)
- **getAnimationManager**: Function returning singleton animation manager instance
- **AnimationManager**: Main class providing centralized animation management

### Dependencies
- **Three.js**: 3D graphics library for animation calculations and scene management
- **Browser APIs**: requestAnimationFrame for smooth animation loops
- **Performance APIs**: Performance timing for animation optimization

### Dependents
- **Meta2D/Meta3D Visualizations**: Primary consumers for coordinated animations
- **Graph Rendering Systems**: Components requiring synchronized animation
- **Node/Link Animation Systems**: Individual animation components
- **Performance Monitoring**: Systems requiring animation performance data

## Key Functions/Components
### AnimationSubsystem Enum (Lines 15-22)
**Purpose**: Defines subsystem-based animation categories aligned with Bimba architecture
**Parameters**: Subsystem identifiers (0-5) mapped to animation categories
**Returns**: Enum values for subsystem-based animation organization
**Notes**: 630 lines implementing comprehensive animation management with subsystem alignment

### AnimationCategory Enum (Lines 25-31)
**Purpose**: Defines animation types for categorization and management
**Parameters**: Animation category identifiers
**Returns**: Enum values for animation type classification
**Notes**: Covers wireframe, node, link, camera, and physics animations

### AnimationPriority Enum (Lines 33-38)
**Purpose**: Defines priority levels for animation scheduling and resource allocation
**Parameters**: Priority level identifiers
**Returns**: Enum values for animation priority management
**Notes**: Enables priority-based animation scheduling and resource optimization

### AnimationManager Class (Lines 45-400)
**Purpose**: Main singleton class providing centralized animation management and coordination
**Parameters**: Animation registration, management, and coordination parameters
**Returns**: Animation manager instance with full lifecycle management
**Notes**: Comprehensive animation management with subsystem coordination and performance optimization

### Animation Registration (Lines 85-150)
**Purpose**: Handles animation registration with subsystem categorization and priority management
**Parameters**: Animation callbacks, subsystem, category, priority, and configuration
**Returns**: Animation ID for management and cleanup
**Notes**: Sophisticated registration system with conflict resolution and resource management

### Animation Loop Management (Lines 152-250)
**Purpose**: Manages centralized animation loop with performance optimization and synchronization
**Parameters**: Animation loop configuration and performance parameters
**Returns**: Animation loop control and performance metrics
**Notes**: Optimized animation loop with frame rate control and performance monitoring

### Subsystem Coordination (Lines 252-350)
**Purpose**: Coordinates animations across different subsystems with priority management
**Parameters**: Subsystem identifiers, coordination rules, and synchronization parameters
**Returns**: Coordinated animation execution and subsystem synchronization
**Notes**: Cross-subsystem animation coordination with conflict resolution

### Performance Monitoring (Lines 352-450)
**Purpose**: Monitors animation performance with metrics collection and optimization
**Parameters**: Performance monitoring configuration and metrics collection
**Returns**: Performance data and optimization recommendations
**Notes**: Comprehensive performance monitoring with automatic optimization

### Resource Management (Lines 452-550)
**Purpose**: Manages animation resources with cleanup and memory optimization
**Parameters**: Resource management configuration and cleanup parameters
**Returns**: Resource cleanup and memory optimization functions
**Notes**: Prevents memory leaks through proper resource lifecycle management

### Three.js Integration (Lines 552-630)
**Purpose**: Integrates with Three.js for 3D animation calculations and scene management
**Parameters**: Three.js scene objects and animation parameters
**Returns**: Three.js-integrated animation functions and scene updates
**Notes**: Deep Three.js integration for 3D animation coordination and optimization

## Data Flow
1. **Manager Initialization**: Singleton creation → Subsystem setup → Animation loop initialization → Performance monitoring setup
2. **Animation Registration**: Registration request → Subsystem categorization → Priority assignment → Resource allocation → ID generation
3. **Animation Execution**: Animation loop → Priority sorting → Subsystem coordination → Animation callbacks → Performance monitoring
4. **Resource Management**: Resource tracking → Cleanup scheduling → Memory optimization → Performance analysis
5. **Cross-Subsystem Coordination**: Subsystem communication → Priority resolution → Synchronized execution → Conflict resolution

## Configuration
### Subsystem Configuration
- **Anuttara (0)**: Foundational animations with base priority
- **Paramasiva (1)**: Logical structure animations with normal priority
- **Parashakti (2)**: Vibrational/template animations with high priority
- **Mahamaya (3)**: Integration animations with normal priority
- **Nara (4)**: Application-level animations with low priority
- **Epii (5)**: Meta-level animations with critical priority

### Animation Categories
- **Wireframe**: Diamond/torus wireframe animations with structural priority
- **Node**: Node animations (size, color, position) with visual priority
- **Link**: Link animations (pulse, particles, flow) with interaction priority
- **Camera**: Camera movements and transitions with navigation priority
- **Physics**: Physics simulation adjustments with system priority

### Performance Configuration
- **Frame Rate**: Target 60fps with adaptive frame rate control
- **Priority Scheduling**: Priority-based animation execution order
- **Resource Limits**: Memory and CPU usage limits for animation optimization
- **Performance Monitoring**: Real-time performance metrics and optimization

### Three.js Integration
- **Scene Management**: Integration with Three.js scenes and objects
- **Animation Calculations**: 3D animation mathematics and transformations
- **Render Coordination**: Synchronized rendering with animation updates
- **Resource Optimization**: Efficient Three.js resource usage and cleanup

## Testing
No explicit test files referenced, but includes comprehensive performance monitoring and animation validation

## Related Files
### Core Dependencies
- **Three.js**: 3D graphics library for animation calculations

### Integration Points
- **Meta2D/Meta3D Visualizations**: Primary consumers for coordinated animations
- **Graph Rendering Systems**: Integration with rendering pipelines
- **Animation Hooks**: Integration with React animation hooks
- **Performance Systems**: Performance monitoring and optimization integration

### Animation Architecture
- **Centralized Management**: Single source of truth for all system animations
- **Subsystem Coordination**: Cross-subsystem animation synchronization
- **Priority Management**: Priority-based animation scheduling and resource allocation
- **Performance Optimization**: Comprehensive performance monitoring and optimization

## Development Notes
- **Singleton Pattern**: Centralized animation management through singleton pattern
- **Subsystem Alignment**: Perfect alignment with Bimba architecture subsystem organization
- **Performance Optimization**: Sophisticated performance monitoring and automatic optimization
- **Three.js Integration**: Deep integration with Three.js for 3D animation coordination
- **Priority Management**: Advanced priority-based animation scheduling and resource allocation
- **Cross-Subsystem Coordination**: Sophisticated coordination between different subsystem animations
- **Memory Management**: Comprehensive resource cleanup and memory optimization
- **Extensible Design**: Easy addition of new animation types and subsystem categories
- **Real-time Monitoring**: Live performance monitoring with automatic optimization recommendations
- **Parashakti Alignment**: Properly aligned with vibration/animation subsystem principles for coordinated system-wide animation management
