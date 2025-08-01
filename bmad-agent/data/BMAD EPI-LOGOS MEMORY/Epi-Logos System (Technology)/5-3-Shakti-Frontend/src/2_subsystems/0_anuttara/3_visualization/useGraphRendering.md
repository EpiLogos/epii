# useGraphRendering.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/0_anuttara/3_visualization/useGraphRendering.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graph Rendering Hook providing comprehensive custom rendering functions for 2D graph nodes and links with subsystem-aware styling. Implements hexagonal node rendering, subsystem color schemes, link styling, and visual feedback systems. Serves as the core rendering engine for Meta2D visualization with sophisticated color management, geometric rendering, and interaction feedback for the Anuttara subsystem's 2D graph visualization.

## System Integration
### Imports
- **React Hooks**: useCallback for performance optimization and memoization
- **Meta Data Types**: Node from shared components for graph data structures

### Exports
- **useGraphRendering**: Main hook providing node and link rendering functions
- **subsystemColors**: Color mapping for different subsystems
- **subsystemColorFamilies**: Extended color palettes for subsystem variations
- **renderNodeLabel**: Function for node label rendering
- **renderLinkLabel**: Function for link label rendering

### Dependencies
- **React**: Core hooks for performance optimization
- **Meta Data System**: Node type definitions and graph data structures
- **Canvas API**: HTML5 Canvas for custom node and link rendering
- **Color System**: Subsystem-based color scheme management

### Dependents
- **Meta2DVisualization**: Primary consumer for 2D graph rendering
- **ForceGraph2D Integration**: Direct integration with force-directed graph library
- **Graph Interaction Systems**: Components requiring custom rendering feedback
- **Node Detail Systems**: Components needing visual node representation

## Key Functions/Components
### Subsystem Color Definitions (Lines 14-45)
**Purpose**: Comprehensive color scheme definitions for all subsystems with fallback colors
**Parameters**: Subsystem identifiers mapped to color values
**Returns**: Color mapping objects for subsystem identification
**Notes**: 296 lines implementing complete color system with primary colors and color families

### useGraphRendering Hook (Lines 47-296)
**Purpose**: Main hook providing comprehensive node and link rendering functions
**Parameters**: None (uses internal color schemes and rendering logic)
**Returns**: Object with nodeCanvasObject, linkCanvasObject, and label rendering functions
**Notes**: Complete rendering system with hexagonal nodes, styled links, and interaction feedback

### Node Canvas Rendering (Lines 65-150)
**Purpose**: Custom canvas rendering function for hexagonal nodes with subsystem colors
**Parameters**: node (Node), ctx (CanvasRenderingContext2D), globalScale (number)
**Returns**: void (renders directly to canvas)
**Notes**: Implements hexagonal geometry, subsystem coloring, and highlight effects

### Link Canvas Rendering (Lines 152-200)
**Purpose**: Custom canvas rendering function for graph links with styling and animations
**Parameters**: link (Edge), ctx (CanvasRenderingContext2D), globalScale (number)
**Returns**: void (renders directly to canvas)
**Notes**: Implements link styling, color coordination, and visual feedback

### Label Rendering Functions (Lines 202-250)
**Purpose**: Text label rendering for nodes and links with positioning and styling
**Parameters**: Various label parameters including text, position, and styling options
**Returns**: Rendered label elements or canvas text
**Notes**: Comprehensive label system with positioning and visual hierarchy

### Color Management System (Lines 25-45)
**Purpose**: Advanced color management with subsystem families and variations
**Parameters**: Subsystem identifiers and color variation requirements
**Returns**: Color values and color family arrays
**Notes**: Supports primary colors, color families, and fallback color handling

## Data Flow
1. **Hook Initialization**: Hook called → Color schemes loaded → Rendering functions created → Callback memoization
2. **Node Rendering**: Node data received → Subsystem identification → Color selection → Hexagonal rendering → Canvas output
3. **Link Rendering**: Link data received → Style calculation → Color coordination → Canvas rendering → Visual output
4. **Label Processing**: Label requests → Text processing → Position calculation → Rendering output → Visual integration
5. **Color Resolution**: Subsystem ID → Color lookup → Family selection → Fallback handling → Final color value

## Configuration
### Color System Configuration
- **Primary Colors**: Base colors for each subsystem (0-5 plus default)
- **Color Families**: Extended color palettes with 5 variations per subsystem
- **Fallback Handling**: Default colors for unknown or undefined subsystems
- **Color Consistency**: Coordinated color schemes across nodes and links

### Rendering Configuration
- **Hexagonal Geometry**: Custom hexagonal node shapes with precise geometry
- **Scale Responsiveness**: Adaptive rendering based on zoom level and global scale
- **Highlight Effects**: Visual feedback for selected and highlighted elements
- **Performance Optimization**: Memoized rendering functions for efficient updates

### Canvas Integration
- **Canvas Context**: Direct HTML5 Canvas API integration for custom rendering
- **Coordinate System**: Proper coordinate transformation and scaling
- **Rendering Pipeline**: Efficient rendering order and layer management
- **Visual Quality**: Anti-aliasing and smooth rendering optimization

### Subsystem Integration
- **Anuttara (0)**: Silver/Neutral color scheme with grey family variations
- **Paramasiva (1)**: Vibrant Red/Foundation with red family variations
- **Parashakti (2)**: Golden/Vibration with amber family variations
- **Mahamaya (3)**: Emerald/Integration with green family variations
- **Nara (4)**: Ocean Blue/Context with blue family variations
- **Epii (5)**: Deep Purple/Synthesis with purple family variations

## Testing
No explicit test files referenced, but includes comprehensive color validation and rendering error handling

## Related Files
### Core Dependencies
- **../../../shared/components/meta/metaData**: Graph data type definitions
- **React**: Core hooks for performance optimization

### Integration Points
- **Meta2DVisualization**: Primary consumer for 2D graph rendering
- **ForceGraph2D**: Direct integration with force-directed graph library
- **Canvas Rendering**: HTML5 Canvas API for custom graphics
- **Color System**: Subsystem-based visual identity management

### Rendering Architecture
- **Custom Node Rendering**: Hexagonal geometry with subsystem colors
- **Link Styling**: Coordinated link appearance with node colors
- **Label System**: Comprehensive text rendering and positioning
- **Performance Optimization**: Memoized functions and efficient rendering

## Development Notes
- **Hexagonal Node Geometry**: Custom hexagonal rendering with precise mathematical calculations
- **Subsystem Color Coordination**: Comprehensive color system with primary colors and family variations
- **Canvas Performance**: Optimized canvas rendering with scale-aware drawing
- **Memoization Strategy**: useCallback optimization for rendering function stability
- **Color Family System**: Extended color palettes supporting visual hierarchy and variation
- **Fallback Handling**: Robust color fallback system for undefined subsystems
- **Scale Responsiveness**: Adaptive rendering quality based on zoom level
- **Visual Consistency**: Coordinated appearance across nodes, links, and labels
- **Integration Ready**: Seamless integration with ForceGraph2D and Meta2D systems
- **Extensible Design**: Easy addition of new subsystems and color schemes
