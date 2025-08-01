# useGraphStylingFunctions.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/3_mahamaya/2_hooks/useGraphStylingFunctions.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Graph Styling Functions Hook providing memoized styling functions for nodes and links in 3D graph visualization. Implements unified styling approach based on virtual depth for all nodes regardless of mapping status. Serves as the single source of truth for graph styling across Meta2D and Meta3D visualizations with comprehensive pulsation effects and highlight management.

## System Integration
### Imports
- **React Hooks**: useCallback, useEffect for memoization and lifecycle management
- **Node Style Utils**: calculateNodeColor, calculateNodeSize from Mahamaya utils
- **Link Pulse Utils**: startLinkPulse, calculatePulseFactor, applyPulsationToColor from Parashakti utils
- **Meta3D Context**: useMeta3D for accessing graph nodes and state

### Exports
- **useGraphStylingFunctions**: Main hook providing memoized styling functions

### Dependencies
- **Meta3D Context**: Graph nodes and state management
- **Node Style Utils**: Color and size calculation utilities
- **Link Pulse Utils**: Animation and pulsation utilities
- **React Memoization**: Performance optimization through useCallback

### Dependents
- **Meta3D Visualization**: Primary consumer for 3D graph styling
- **Meta2D Visualization**: Secondary consumer for 2D graph styling
- **Graph Components**: Any component requiring consistent graph styling

## Key Functions/Components
### useGraphStylingFunctions Hook (Lines 37-236)
**Purpose**: Main hook providing memoized styling functions for graph visualization
**Parameters**: highlightedNodes (Set<string>), highlightedLinks (Set<string>), pulsationFactor (number)
**Returns**: Object with styling functions (getNodeColor, getNodeSize, getNodeOpacity, getLinkWidth, getLinkColor, getLinkOpacity)
**Notes**: 236 lines implementing comprehensive unified styling approach

### getNodeColor Function (Lines 54-72)
**Purpose**: Memoized node color calculation based on virtual depth and highlight state
**Parameters**: node (object) with type, virtualDepth, bimbaCoordinate, parentId
**Returns**: string - CSS color value
**Notes**: Unified approach using calculateNodeColor with proper priority system

### getNodeSize Function (Lines 75-98)
**Purpose**: Memoized node size calculation with highlight effects and pulsation
**Parameters**: node (object) with virtualDepth, bimbaCoordinate, highlight state
**Returns**: number - Node size value
**Notes**: Increased base size for 3D mode with pulsation effects for highlighted nodes

### getNodeOpacity Function (Lines 101-114)
**Purpose**: Memoized node opacity calculation based on highlight state
**Parameters**: node (object) with highlight state
**Returns**: number - Opacity value (0.7 normal, 0.9 highlighted)
**Notes**: Simple opacity management for visual hierarchy

### getLinkWidth Function (Lines 117-150)
**Purpose**: Memoized link width calculation with highlight effects and pulsation
**Parameters**: link (object) with source, target, type, highlight state
**Returns**: number - Link width value
**Notes**: Multiple ID format compatibility with pulsation effects for highlighted links

### getLinkColor Function (Lines 152-200)
**Purpose**: Memoized link color calculation with pulsation and highlight effects
**Parameters**: link (object) with source, target, type, highlight state
**Returns**: string - CSS color value
**Notes**: Sophisticated color management with pulsation effects and relationship type differentiation

### getLinkOpacity Function (Lines 202-236)
**Purpose**: Memoized link opacity calculation based on highlight state and relationship type
**Parameters**: link (object) with type and highlight state
**Returns**: number - Opacity value
**Notes**: Relationship type-based opacity with highlight effects

## Data Flow
1. **Hook Initialization**: Parameters received → Context accessed → Animation started → Functions memoized
2. **Node Styling**: Node data → Virtual depth extraction → Color/size calculation → Highlight effects → Styled output
3. **Link Styling**: Link data → ID generation → Highlight detection → Width/color calculation → Pulsation effects
4. **Memoization**: Dependencies changed → Functions recalculated → Performance optimization → Consistent rendering
5. **Animation Integration**: Pulsation factor → Animation effects → Visual feedback → Continuous updates

## Configuration
### Unified Styling Approach
- **Virtual Depth Priority**: Primary factor for all node styling regardless of mapping status
- **Consistent Fallbacks**: Unified calculations for mapped and unmapped nodes
- **Pre-calculated Values**: Uses node.color and node.val when available
- **No Mapping Distinction**: Eliminates separation between mapped and unmapped nodes

### Node Styling Parameters
- **Base Size 3D**: 8 (increased for 3D visibility)
- **Highlight Multiplier**: 1.5x for highlighted nodes
- **Pulsation Factor**: 0.75 intensity for size pulsation
- **Opacity Normal**: 0.7 for non-highlighted nodes
- **Opacity Highlighted**: 0.9 for highlighted nodes

### Link Styling Parameters
- **Highlighted Width**: 1.5 + pulsation effects
- **Main Subsystem Width**: 0.9 (DEVELOPS_INTO, CONTAINS, RETURNS_TO)
- **Other Relationship Width**: 0.4
- **Pulsation Intensity**: 0.5 for width variation

## Testing
No explicit test files referenced, but includes comprehensive memoization and performance optimization

## Related Files
### Core Dependencies
- **../1_utils/nodeStyleUtils**: Color and size calculation utilities
- **../../2_parashakti/1_utils/linkPulseUtils**: Animation and pulsation utilities
- **../../1_paramasiva/4_context/Meta3DContainer**: Graph state and nodes

### Integration Points
- **Meta3D Visualization**: Primary consumer for 3D graph styling
- **Meta2D Visualization**: Secondary consumer for 2D graph styling
- **Animation System**: Pulsation and animation coordination

### Styling Architecture
- **Unified Approach**: Single source of truth for graph styling
- **Cross-Subsystem**: Integrates utilities from multiple subsystems
- **Performance Optimized**: Comprehensive memoization for rendering efficiency

## Development Notes
- **Unified Styling Approach**: Eliminates mapped/unmapped node distinction for consistent styling
- **Virtual Depth Priority**: Uses virtual depth as primary styling factor for all nodes
- **Cross-Subsystem Integration**: Combines utilities from Mahamaya, Parashakti, and Paramasiva
- **Performance Optimization**: Comprehensive memoization prevents unnecessary re-renders
- **Animation Integration**: Seamless pulsation effects for highlighted elements
- **Multiple ID Compatibility**: Handles various link ID formats for robust highlighting
- **Relationship Type Awareness**: Different styling for different relationship types
- **Highlight Management**: Sophisticated highlight detection and visual feedback
- **3D Optimization**: Increased sizes and effects optimized for 3D visualization
- **Extensible Design**: Easy addition of new styling parameters and effects
