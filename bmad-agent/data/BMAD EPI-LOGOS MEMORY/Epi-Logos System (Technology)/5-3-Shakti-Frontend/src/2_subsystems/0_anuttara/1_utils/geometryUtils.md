# geometryUtils.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/0_anuttara/1_utils/geometryUtils.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Geometry Utilities providing comprehensive 2D geometric calculations for graph visualization with coordinate-based positioning. Implements hexagonal layout algorithms, coordinate parsing, position calculations, and geometric transformations. Serves as the mathematical foundation for Meta2D visualization with sophisticated coordinate system support and geometric layout algorithms for the Anuttara subsystem's 2D graph positioning.

## System Integration
### Imports
- **Meta Data Types**: Node, Edge from shared components for graph data structures

### Exports
- **calculateHexagonalPosition**: Main function for hexagonal coordinate positioning
- **parseCoordinate**: Function for coordinate string parsing and validation
- **calculateDistance**: Function for distance calculations between nodes
- **getNeighborPositions**: Function for calculating neighboring positions
- **validateCoordinateFormat**: Function for coordinate format validation

### Dependencies
- **Meta Data System**: Node and Edge type definitions
- **JavaScript Math**: Native mathematical functions for geometric calculations
- **Coordinate System**: Bimba coordinate parsing and validation

### Dependents
- **Meta2DVisualization**: Primary consumer for node positioning
- **Graph Layout Systems**: Components requiring geometric positioning
- **Node Positioning**: Systems needing coordinate-based layout
- **Geometric Rendering**: Components requiring position calculations

## Key Functions/Components
### calculateHexagonalPosition Function (Lines 18-120)
**Purpose**: Main function calculating hexagonal layout positions based on Bimba coordinates
**Parameters**: coordinate (string | undefined | null)
**Returns**: Position object with x, y, z coordinates or null
**Notes**: 246 lines implementing comprehensive hexagonal positioning with multi-level support

### Coordinate Parsing (Lines 25-45)
**Purpose**: Parses and validates Bimba coordinate strings for position calculation
**Parameters**: coordinate (string), parsing options
**Returns**: Parsed coordinate segments and validation results
**Notes**: Handles coordinate prefixes, segment splitting, and format validation

### Hexagonal Mathematics (Lines 47-90)
**Purpose**: Core hexagonal geometry calculations with radius and angle computations
**Parameters**: Level, segment, and positioning parameters
**Returns**: Calculated x, y coordinates for hexagonal positioning
**Notes**: Implements precise hexagonal geometry with configurable radius scaling

### Multi-Level Positioning (Lines 92-150)
**Purpose**: Handles complex multi-level coordinate positioning with hierarchical layout
**Parameters**: Coordinate segments, level depth, positioning options
**Returns**: Hierarchical position calculations with proper spacing
**Notes**: Supports nested hexagonal layouts with appropriate scaling

### Distance Calculations (Lines 152-180)
**Purpose**: Calculates distances between nodes for layout optimization
**Parameters**: Two position objects or coordinate strings
**Returns**: Distance value and relative positioning information
**Notes**: Supports both Euclidean and hexagonal distance metrics

### Neighbor Position Calculations (Lines 182-220)
**Purpose**: Calculates positions for neighboring nodes in hexagonal layout
**Parameters**: Center coordinate, neighbor count, radius parameters
**Returns**: Array of neighbor positions around center point
**Notes**: Generates evenly distributed neighbor positions in hexagonal pattern

### Coordinate Validation (Lines 222-246)
**Purpose**: Validates coordinate format and structure for geometric calculations
**Parameters**: coordinate (string), validation options
**Returns**: Validation result with error details and suggestions
**Notes**: Comprehensive validation with format checking and structure verification

## Data Flow
1. **Coordinate Input**: Coordinate string received → Parsing → Validation → Segment extraction
2. **Position Calculation**: Parsed segments → Level determination → Hexagonal math → Position output
3. **Layout Processing**: Multiple coordinates → Position calculations → Distance optimization → Final layout
4. **Validation Flow**: Coordinate validation → Format checking → Error reporting → Correction suggestions
5. **Neighbor Generation**: Center position → Neighbor calculation → Position distribution → Layout completion

## Configuration
### Hexagonal Layout Configuration
- **Base Radius**: 100 units for first level hexagon positioning
- **Level Scaling**: 1.5x radius increase per hierarchical level
- **Angle Distribution**: 60-degree increments for hexagonal positioning
- **Center Position**: (0, 0, 0) for root coordinate positioning

### Coordinate Format Support
- **Root Coordinate**: '#' for center position
- **Standard Format**: '#X-Y-Z' for hierarchical coordinates
- **Segment Separators**: Hyphens and dots for coordinate parsing
- **Prefix Handling**: Automatic '#' prefix detection and removal

### Mathematical Constants
- **Hexagonal Angles**: 0°, 60°, 120°, 180°, 240°, 300° for node positioning
- **Radius Scaling**: Exponential scaling for multi-level layouts
- **Distance Metrics**: Euclidean and hexagonal distance calculations
- **Position Precision**: Floating-point precision for smooth positioning

### Layout Optimization
- **Spacing Algorithms**: Optimal spacing between nodes and levels
- **Collision Avoidance**: Position adjustment to prevent node overlap
- **Visual Balance**: Symmetric positioning for aesthetic layout
- **Performance Optimization**: Efficient calculation algorithms

## Testing
No explicit test files referenced, but includes comprehensive coordinate validation and error handling

## Related Files
### Core Dependencies
- **../../../shared/components/meta/metaData**: Graph data type definitions

### Integration Points
- **Meta2DVisualization**: Primary consumer for node positioning
- **useGraphRendering**: Integration with rendering system for position-based styling
- **Graph Layout Systems**: Components requiring geometric positioning
- **Coordinate Systems**: Integration with Bimba coordinate management

### Geometric Architecture
- **Hexagonal Mathematics**: Core geometric calculations for layout
- **Coordinate Parsing**: String processing and validation
- **Position Optimization**: Layout algorithms for visual appeal
- **Multi-Level Support**: Hierarchical positioning with proper scaling

## Development Notes
- **Hexagonal Geometry**: Precise mathematical implementation of hexagonal layout algorithms
- **Coordinate System Integration**: Deep integration with Bimba coordinate system
- **Multi-Level Support**: Sophisticated hierarchical positioning with proper scaling
- **Performance Optimization**: Efficient geometric calculations with minimal computational overhead
- **Validation Framework**: Comprehensive coordinate validation with helpful error messages
- **Mathematical Precision**: Accurate geometric calculations for smooth visual positioning
- **Extensible Design**: Easy addition of new coordinate formats and layout algorithms
- **Error Resilience**: Robust error handling for invalid coordinates and edge cases
- **Visual Optimization**: Layout algorithms designed for aesthetic and functional appeal
- **Integration Ready**: Seamless integration with Meta2D visualization and rendering systems
