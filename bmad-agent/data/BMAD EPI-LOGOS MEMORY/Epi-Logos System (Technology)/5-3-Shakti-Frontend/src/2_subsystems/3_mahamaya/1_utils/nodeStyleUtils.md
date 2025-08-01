# nodeStyleUtils.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/3_mahamaya/1_utils/nodeStyleUtils.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Node Style Utilities providing comprehensive color calculation and styling functions for graph nodes based on virtual depth, Bimba coordinates, and parent relationships. Implements unified color determination with subsystem-based mapping, depth-based lightness, and parent color inheritance. Serves as the central styling engine for node visualization within the Mahamaya integration subsystem with sophisticated color management and visual hierarchy support.

## System Integration
### Imports
- **No external imports**: Pure utility functions with no dependencies

### Exports
- **calculateNodeColor**: Main function for node color calculation based on multiple factors
- **getSubsystemColor**: Function for retrieving subsystem-specific colors
- **calculateDepthLightness**: Function for depth-based lightness calculation
- **inheritParentColor**: Function for parent color inheritance logic

### Dependencies
- **Pure JavaScript**: No external dependencies, self-contained utility functions
- **Color Mathematics**: HSL color space calculations for lightness adjustments

### Dependents
- **Meta2D Visualization**: Primary consumer for 2D node styling
- **Meta3D Visualization**: Primary consumer for 3D node styling
- **Graph Rendering Systems**: Components requiring node color calculation
- **Node Interaction Systems**: Components needing dynamic node styling

## Key Functions/Components
### calculateNodeColor Function (Lines 22-150)
**Purpose**: Main function calculating node color based on type, depth, highlight state, and Bimba coordinates
**Parameters**: type, depth, isHighlighted, bimbaCoordinate, parentId, allNodes
**Returns**: Hex color string for node styling
**Notes**: 264 lines implementing comprehensive color calculation with unified approach

### Highlight Color Handling (Lines 35-45)
**Purpose**: Handles highlighted node color override with white color
**Parameters**: isHighlighted boolean flag
**Returns**: White color (#FFFFFF) for highlighted nodes
**Notes**: Priority override for highlighted nodes regardless of other factors

### Bimba Coordinate Mapping (Lines 47-85)
**Purpose**: Maps Bimba coordinates to specific subsystem colors
**Parameters**: bimbaCoordinate string and coordinate parsing
**Returns**: Fixed subsystem colors based on coordinate mapping
**Notes**: Direct mapping from coordinates to subsystem color schemes

### Parent Color Inheritance (Lines 87-130)
**Purpose**: Implements parent color inheritance for unmapped nodes
**Parameters**: parentId, allNodes array, and inheritance logic
**Returns**: Inherited color from parent with depth-based lightness adjustment
**Notes**: Recursive parent lookup with color inheritance chain

### Depth-Based Lightness (Lines 132-150)
**Purpose**: Calculates lightness adjustment based on virtual depth
**Parameters**: base color and depth value
**Returns**: Color with adjusted lightness for visual hierarchy
**Notes**: Progressive lightness increase with depth for visual depth perception

### Subsystem Color Mapping (Lines 152-200)
**Purpose**: Defines and retrieves subsystem-specific color schemes
**Parameters**: subsystem identifier or coordinate
**Returns**: Subsystem color values and mappings
**Notes**: Complete color mapping for all 6 subsystems (0-5)

### Type-Based Fallback (Lines 202-230)
**Purpose**: Provides fallback color calculation based on node type
**Parameters**: node type and depth information
**Returns**: Type-based color with depth adjustment
**Notes**: Fallback mechanism when other color determination methods fail

### Color Utility Functions (Lines 232-264)
**Purpose**: Helper functions for color manipulation and calculation
**Parameters**: Various color values and manipulation parameters
**Returns**: Processed color values and utility calculations
**Notes**: Supporting functions for HSL conversion and color mathematics

## Data Flow
1. **Color Request**: Node data received → Parameter extraction → Color calculation initiation
2. **Priority Check**: Highlight check → Coordinate mapping → Parent inheritance → Type fallback
3. **Coordinate Processing**: Bimba coordinate → Subsystem identification → Color mapping → Fixed color return
4. **Inheritance Processing**: Parent lookup → Color extraction → Depth adjustment → Inherited color return
5. **Fallback Processing**: Type identification → Base color → Depth adjustment → Final color return

## Configuration
### Color Calculation Priority
1. **Highlighted Nodes**: Always white (#FFFFFF) regardless of other factors
2. **Mapped Nodes**: Fixed colors based on Bimba coordinate subsystem mapping
3. **Unmapped Nodes**: Inherit color from parent with depth-based lightness
4. **Fallback**: Type-based color with depth-based lightness adjustment

### Subsystem Color Mapping
- **Anuttara (0)**: Silver/Neutral (#C0C0C0) - Foundational structure
- **Paramasiva (1)**: Vibrant Red (#FF4444) - Logical structure
- **Parashakti (2)**: Golden (#FFD700) - Vibrational/template
- **Mahamaya (3)**: Emerald (#50C878) - Integration
- **Nara (4)**: Ocean Blue (#4169E1) - Application context
- **Epii (5)**: Deep Purple (#8A2BE2) - Meta-synthesis

### Depth-Based Lightness
- **Base Lightness**: Starting lightness value for depth 0
- **Lightness Increment**: Progressive lightness increase per depth level
- **Maximum Lightness**: Upper bound for lightness to maintain visibility
- **Visual Hierarchy**: Deeper nodes appear lighter for depth perception

### Parent Inheritance Logic
- **Recursive Lookup**: Traverses parent chain to find color source
- **Inheritance Chain**: Follows parent relationships for color propagation
- **Depth Adjustment**: Applies depth-based lightness to inherited colors
- **Fallback Handling**: Graceful handling when parent chain breaks

## Testing
No explicit test files referenced, but includes comprehensive color calculation validation and edge case handling

## Related Files
### Core Dependencies
- **Pure JavaScript**: No external dependencies, self-contained utility

### Integration Points
- **Meta2D Visualization**: Primary consumer for 2D node color calculation
- **Meta3D Visualization**: Primary consumer for 3D node color calculation
- **Graph Rendering Systems**: Integration with node rendering pipelines
- **Node Interaction Systems**: Dynamic styling for user interactions

### Styling Architecture
- **Color Calculation**: Centralized color determination logic
- **Visual Hierarchy**: Depth-based visual organization
- **Subsystem Integration**: Coordinate-based color mapping
- **Parent Relationships**: Color inheritance for node hierarchies

## Development Notes
- **Unified Approach**: Single function handles all node color calculation scenarios
- **Priority System**: Clear priority order for color determination methods
- **Subsystem Integration**: Deep integration with Bimba coordinate system
- **Visual Hierarchy**: Depth-based lightness creates clear visual depth perception
- **Parent Inheritance**: Sophisticated parent color inheritance with recursive lookup
- **Performance Optimization**: Efficient color calculation with minimal computational overhead
- **Color Consistency**: Consistent color schemes across all visualization components
- **Extensible Design**: Easy addition of new subsystems and color schemes
- **Mathematical Precision**: Accurate HSL color space calculations for lightness adjustment
- **Mahamaya Alignment**: Properly aligned with integration subsystem principles for unified styling
