# torusGeometryCache.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/1_paramasiva/1_utils/torusGeometryCache.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Torus Geometry Cache utility providing performance optimization for 3D torus geometries through intelligent caching. Reduces memory allocations and garbage collection by reusing torus geometries with identical parameters. Serves as a performance optimization layer for the Paramasiva subsystem's 3D visualization with cache statistics and memory management.

## System Integration
### Imports
- **Three.js**: THREE for 3D torus geometry creation and management

### Exports
- **getTorusGeometry**: Main function for retrieving cached or creating new torus geometries
- **clearTorusCache**: Function for clearing the geometry cache
- **getTorusCacheStats**: Function for retrieving cache performance statistics
- **TorusGeometryKey**: Interface for torus geometry parameters

### Dependencies
- **Three.js**: 3D graphics library for torus geometry creation
- **JavaScript Map**: Native Map for efficient geometry caching

### Dependents
- **Torus Visualization Components**: 3D torus rendering components
- **Paramasiva Graph System**: 3D graph visualization with torus elements
- **Performance-Critical Rendering**: Any component requiring optimized torus geometries

## Key Functions/Components
### TorusGeometryKey Interface (Lines 14-19)
**Purpose**: Interface defining parameters for torus geometry identification
**Parameters**: radius, tubeRadius, radialSegments, tubularSegments
**Returns**: Type definition for torus parameters
**Notes**: Used for cache key generation and geometry parameter validation

### keyToString Function (Lines 22-24)
**Purpose**: Converts torus geometry parameters to string key for cache lookup
**Parameters**: key (TorusGeometryKey)
**Returns**: string - Formatted cache key
**Notes**: Uses fixed precision (3 decimal places) for consistent key generation

### getTorusGeometry Function (Lines 40-65)
**Purpose**: Main caching function that retrieves existing or creates new torus geometries
**Parameters**: radius, tubeRadius, radialSegments, tubularSegments
**Returns**: THREE.TorusGeometry - Cached or newly created torus geometry
**Notes**: Implements cache-first strategy with automatic geometry creation and caching

### clearTorusCache Function (Lines 67-85)
**Purpose**: Clears the geometry cache and disposes of Three.js resources
**Parameters**: None
**Returns**: void
**Notes**: Properly disposes of geometries to prevent memory leaks

### getTorusCacheStats Function (Lines 87-106)
**Purpose**: Provides cache performance statistics for debugging and optimization
**Parameters**: None
**Returns**: Object with cache statistics (size, hits, misses, hitRate)
**Notes**: Useful for performance monitoring and cache effectiveness analysis

## Data Flow
1. **Geometry Request**: Parameters received → Key generation → Cache lookup → Geometry retrieval or creation
2. **Cache Hit**: Existing geometry found → Statistics updated → Cached geometry returned
3. **Cache Miss**: New geometry created → Cache storage → Statistics updated → New geometry returned
4. **Cache Management**: Cache clearing → Geometry disposal → Memory cleanup → Statistics reset
5. **Performance Monitoring**: Statistics request → Cache analysis → Performance metrics returned

## Configuration
### Torus Parameters
- **radius**: Main radius of the torus (number)
- **tubeRadius**: Radius of the tube forming the torus (number)
- **radialSegments**: Number of segments around the tube (integer)
- **tubularSegments**: Number of segments around the torus (integer)

### Cache Configuration
- **Key Precision**: 3 decimal places for floating-point parameters
- **Cache Storage**: JavaScript Map for O(1) lookup performance
- **Memory Management**: Automatic geometry disposal on cache clear
- **Statistics Tracking**: Hit/miss ratio and cache size monitoring

### Performance Optimization
- **Cache-First Strategy**: Always check cache before creating new geometries
- **Memory Efficiency**: Reuse identical geometries across components
- **Garbage Collection**: Proper disposal prevents memory leaks
- **Statistics Monitoring**: Performance tracking for optimization insights

## Testing
No explicit test files referenced, but includes comprehensive cache statistics for performance validation

## Related Files
### Core Dependencies
- **Three.js**: 3D graphics library for torus geometry creation

### Integration Points
- **Torus Visualization Components**: Primary consumers of cached geometries
- **Paramasiva 3D System**: Integration with 3D graph visualization
- **Performance Monitoring**: Cache statistics for system optimization

### Utility Architecture
- **Performance Layer**: Optimization utility for 3D rendering
- **Memory Management**: Efficient resource usage and cleanup
- **Statistics Integration**: Performance monitoring and analysis

## Development Notes
- **Performance Optimization**: Significant reduction in memory allocations for repeated torus creation
- **Cache Efficiency**: String-based keys provide O(1) lookup performance
- **Memory Management**: Proper Three.js geometry disposal prevents memory leaks
- **Statistics Tracking**: Comprehensive cache performance monitoring for optimization
- **Parameter Precision**: Fixed decimal precision ensures consistent cache key generation
- **Resource Cleanup**: clearTorusCache function properly disposes of Three.js resources
- **Scalable Design**: Map-based caching scales efficiently with geometry variety
- **Debug Support**: Cache statistics provide insights for performance tuning
- **Integration Ready**: Simple API for easy integration with 3D visualization components
- **Thread Safety**: Stateless functions ensure safe concurrent usage
