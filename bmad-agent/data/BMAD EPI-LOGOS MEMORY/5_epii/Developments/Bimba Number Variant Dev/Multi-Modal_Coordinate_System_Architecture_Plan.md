# Multi-Modal Coordinate System Architecture Plan

## Executive Summary

This document outlines a comprehensive plan for expanding the Bimba coordinate system beyond the current mod6 architecture to support multiple coordinate system variants including 7/8fold (mod8), 12fold (mod12), and 0/1fold (mod2) systems, while maintaining future-proof extensibility for any modular arithmetic system.

## Current State Analysis

### Existing Infrastructure (mod6 System)
- **Coordinate Range**: 0-5 with hierarchical nesting (#0, #1-2, #3-4-5, etc.)
- **2D Visualization**: Hexagonal positioning via `calculateHexagonalPosition()`
- **3D Visualization**: Diamond layout via `calculate3DDiamondPosition()`
- **Shape Rendering**: Hexagon drawing in Meta2D, diamond nodes in Meta3D
- **Detection**: Hardcoded mod6 assumptions throughout the system
- **QL Integration**: QLVariant enum partially supports multiple systems

### Key Components Currently Handling Coordinates

#### Visualization Components
1. **Meta2D Positioning**: `geometryUtils.ts` - hexagonal layout with established scaling laws
2. **Meta3D Positioning**: `calculate3DDiamondPosition.ts` - 3D diamond/octahedral layout
3. **Node Styling**: `nodeStyleUtils.ts` - size and color calculations based on depth and coordinates
4. **Graph Rendering**: `useGraphRendering.ts` - canvas rendering with coordinate-based sizing

#### Data Processing Components
5. **Graph Data Parsing**: `graphData.utils.mjs` - coordinate processing and validation
6. **Coordinate Parsing**: `bimbaUtils.ts` - coordinate string parsing with separator handling
7. **Recursive Coordinate Tree**: `RecursiveCoordinateTree.tsx` - hierarchical file listing
8. **Bimba Update Manager**: `bimba-update-management-skill.js` - node creation and management

#### Existing Scaling Laws (CRITICAL FOR HARMONIZATION)
- **Meta2D**: `baseRadius = 1200`, `radiusScaleFactor = 0.3` per level
- **Meta3D**: `baseDistance = 1200`, `distanceScaleFactor = 0.3` per level
- **Node Sizes**: Depth-based scaling with different formulas for 2D vs 3D modes
- **Orbital Positioning**: `baseDistance = 150` with `Math.pow(1.2, childDepth - 2)` scaling

## Requirements Specification

### Coordinate System Complexities Identified

Based on analysis of actual coordinate data, the system must handle significantly more complexity than simple modular arithmetic:

#### 1. Foundational vs Context Frame Coordinates
- **Foundational**: Simple mod6 coordinates like `#1-2-3`, `#0-2-9`
- **Context Frames**: Complex extensions like `#1-3-4.0/1/2/3`, `#0-4.0/1/2`
- **Nested Frames**: Multi-level nesting like `#1-3-4.4.0-4.4/5`
- **Recursive Frames**: Self-referential patterns like `#1-3-4.5/0`

#### 2. Nondual Coordinate Systems
- **0/1 Notation**: Coordinates like `#0-1-0/1`, `#0-3-0/1`, `#0-5-0/1`
- **Dual-State Representation**: Single coordinate representing two states simultaneously
- **Visual Challenge**: How to render nodes that exist in two positions

#### 3. Nested Interpenetrating Systems
- **#0-3 Branch**: 12fold archetypal number language (children 0-11, minus 1, plus nondual 0/1)
- **#0-2-9 Integration**: Central node within #0-3 system, not standalone - represents 9≡0/1 equivalence
- **#0-2-9 Children**: Form enneagon (0-8) around central #0-2-9 within the #0-3 dodecagonal structure
- **Special Relationship**: Visual connection between #0-3-0/1 and central #0-2-9 showing nondual essence

#### 4. Subset Systems (7/8fold Question)
- **Incomplete Sets**: Systems where not all theoretical positions are filled
- **Parent Integration**: Should parent node serve as "vertex 0" for children?
- **Adaptive Rendering**: Shapes based on actual children, not theoretical maximum

#### 5. System Type Classifications Needed
1. **FOUNDATIONAL_MOD6**: Standard mod6 coordinates (`#1-2-3`)
2. **CONTEXT_FRAME**: Context extensions (`#1-3-4.0/1/2`)
3. **NONDUAL**: Contains 0/1 notation (`#0-1-0/1`)
4. **NESTED**: Nested frame patterns (`#1-3-4.4.0-4.4/5`)
5. **RECURSIVE**: Recursive patterns (`#1-3-4.5/0`)
6. **MOD12_ARCHETYPAL**: 12fold archetypal number language (`#0-3` branch)
7. **NESTED_ENNEAGON**: #0-2-9 system integrated within #0-3 12fold structure
8. **TRIKA_QUATERNITY**: Special #0 system structure (#0-0-0, #0-0-1, #0-1-0/1, #0-2-9)
9. **ADAPTIVE**: Variable child counts requiring adaptive shapes

### Critical Design Questions & Solutions

#### Q1: How to render shapes where there is a subset at play (e.g., 7/8)?
**Solution**: Use **Adaptive Parent-Centered Approach**
- Parent node serves as the central anchor point
- Children are positioned around parent using actual child count (not theoretical maximum)
- For 7-element systems: Use heptagonal (7-sided) positioning, not octagonal with gaps
- Visual distinction: Parent node uses different styling to indicate it's the system center

#### Q2: How to handle #0-2-9 special case?
**Solution**: **Central Integration** within #0-3 archetypal number language
- #0-2-9 is positioned at the CENTER of the #0-3 dodecagonal (12fold) structure
- #0-2-9 has children (0-8) that form an enneagon around the central #0-2-9 node
- The entire #0-2-9 enneagonal system sits within the #0-3 dodecagonal system
- **Special Connection**: Visual bridge between #0-3-0/1 (nondual) and central #0-2-9 showing 9≡0/1
- **Nested Structure**: Enneagon (9 children) within Dodecagon (12fold) within Hexagon (mod6 base)
- **Visual Hierarchy**: Shows interpenetration of numerical systems rather than separation

#### Q3: How to represent mod6 foundational vs context frame variants?
**Solution**: **Layered Visual Distinction System**
- **Foundational coordinates**: Solid, filled shapes (hexagons, octagons, etc.)
- **Context frames**: Outlined/wireframe versions of the same shapes
- **Nested frames**: Concentric shapes with transparency gradients
- **Recursive frames**: Spiral or möbius-strip visual patterns
- **Nondual coordinates**: Figure-8 or infinity symbol shapes with dual positioning

#### Q4: How to handle nondual 0/1 coordinates visually?
**Solution**: **Dual-Position Bridge Rendering**
- Render two semi-transparent nodes at calculated positions
- Connect with a subtle bridge or gradient line
- Both positions respond to the same interaction
- Special animation: gentle pulsing between positions
- Color coding: Use complementary colors for the dual aspects

#### Q5: How to manage mixed modular systems in the same tree?
**Solution**: **Hierarchical System Inheritance with Visual Transitions**
- Each branch inherits parent's base system but can extend with its own modulus
- Visual transitions: Gradient borders between different system types
- System indicators: Small icons or color coding to show system type
- Adaptive scaling: Child systems scale appropriately within parent's geometric constraints

#### Q6: How to represent the trika/quaternity structure in #0 system?
**Solution**: **Primary Tetrahedron with Nested Archetypal System**
- **Fundamental Hierarchy**: Lower numbers = more fundamental (tetrahedron contains #0-3 system)
- **Primary Structure**: Tetrahedron (#0-0-0, #0-0-1, #0-1-0/1, #0-2-9) as foundational organizing geometry
- **Nested Integration**: #0-3 archetypal system nests WITHIN tetrahedron space, not alongside it
- **2D Representation**: Triangle with #0-3 dodecagon scaled smaller and centered on #0-2-9 vertex
- **3D Representation**: Tetrahedron with #0-3 icosahedron emanating from #0-2-9 vertex
- **Vertex Anchoring**: #0-2-9 serves as tetrahedron vertex AND anchor point for #0-3 system
- **Base Framework**: All structures exist within the established mod6 hexagon/diamond framework
- **Organic Growth**: #0-3 system "blooms" from #0-2-9 completion principle like flower from stem

## Harmonization with Existing Scaling Laws

### Critical Requirement: Maintain Established Scaling Patterns

All new coordinate system variants MUST harmonize with the existing foundational scaling laws to ensure visual consistency and proper geometric relationships.

#### Meta2D Scaling Laws (geometryUtils.ts)
```typescript
// EXISTING SCALING CONSTANTS - MUST BE PRESERVED
const baseRadius = 1200;           // Base radius for first level hexagon
const radiusScaleFactor = 0.3;     // Scaling factor for each deeper level
const baseDistance = 150;          // Base distance for orbital positioning
const orbitalScaling = Math.pow(1.2, childDepth - 2); // Orbital distance scaling

// POSITIONING ALGORITHM - FOUNDATION FOR ALL SYSTEMS
for (let i = 0; i < segments.length; i++) {
  const angle = (hexPosition * Math.PI / 3) - Math.PI / 6;
  x += currentRadius * Math.cos(angle);
  y += currentRadius * Math.sin(angle);
  currentRadius *= radiusScaleFactor; // 0.3 scaling per level
}
```

#### Meta3D Scaling Laws (calculate3DDiamondPosition.ts)
```typescript
// EXISTING 3D SCALING CONSTANTS - MUST BE PRESERVED
const baseDistance = 1200;         // Base distance for first level diamond
const distanceScaleFactor = 0.3;   // Scaling factor for each deeper level
const squareSideLength = baseDistance * Math.sqrt(2); // Diamond geometry

// DIAMOND POSITIONING - FOUNDATION FOR ALL 3D SYSTEMS
for (let i = 1; i < segments.length; i++) {
  // Diamond vertex calculations with consistent scaling
  currentDistance *= distanceScaleFactor; // 0.3 scaling per level
}
```

#### Node Size Scaling Laws (nodeStyleUtils.ts)
```typescript
// EXISTING NODE SIZE CALCULATIONS - MUST BE HARMONIZED
export function calculateNodeSize(virtualDepth, bimbaCoordinate, baseSize = 30) {
  const is3D = baseSize <= 5;

  // Root node (#) - largest
  if (bimbaCoordinate === '#') {
    return is3D ? baseSize * 20.0 : baseSize * 2.0;
  }

  // Main subsystem nodes (#0-#5) - large
  if (/^#[0-5]$/.test(bimbaCoordinate)) {
    return is3D ? baseSize * 15.0 : baseSize * 1.5;
  }

  // Depth-based scaling for other nodes
  if (is3D) {
    const scaleFactor = 2.5;
    return baseSize * Math.pow(scaleFactor, Math.max(-1, 3 - depth));
  } else {
    return baseSize * Math.max(0.5, 1.5 - depth * 0.15);
  }
}
```

### Harmonization Strategy for New Systems

#### 1. Preserve Base Constants
All new coordinate systems MUST use the same foundational constants:
- `baseRadius/baseDistance = 1200`
- `scaleFactor = 0.3` per hierarchical level
- Node size ratios maintained across all system types

#### 2. Geometric Scaling Relationships
```typescript
// UNIVERSAL SCALING FORMULA FOR ALL SYSTEMS
export function calculateUniversalPosition(coordinate, systemConfig) {
  const { modulus, baseRadius = 1200, scaleFactor = 0.3 } = systemConfig;

  let currentRadius = baseRadius;
  const segments = parseCoordinate(coordinate);

  for (const segment of segments) {
    // System-specific angle calculation
    const angle = (2 * Math.PI * segment) / modulus;

    // Apply position with CONSISTENT scaling
    x += currentRadius * Math.cos(angle);
    y += currentRadius * Math.sin(angle);

    // CRITICAL: Use same scaling factor as existing systems
    currentRadius *= scaleFactor; // 0.3 - NEVER CHANGE THIS
  }
}
```

#### 3. Special System Scaling Adaptations

**Trika/Quaternity System:**
```typescript
// Sacred geometry WITHIN existing scaling framework
const trikaRadius = baseRadius / goldenRatio; // 1200 / 1.618 = 741
const quaternityScale = trikaRadius * 0.3;    // Consistent with existing scaling
```

**Nested Enneagon (#0-2-9 within #0-3):**
```typescript
// Nested system maintains proportional scaling
const archetypalRadius = baseRadius;           // 1200 for #0-3 system
const nestedRadius = archetypalRadius * 0.3;   // 360 for #0-2-9 children
```

**Context Frame Systems:**
```typescript
// Context frames use same base scaling with visual distinction
const contextRadius = baseRadius * Math.pow(0.3, depth); // Same scaling law
// Only visual styling differs (wireframe vs solid)
```

## Enhanced Solution Approaches

### Approach 1: Centralized Coordinate System Registry (Recommended)

**Architecture**: Single registry managing all coordinate system configurations

**Advantages**:
- Centralized configuration and management
- Easy to add new systems
- Consistent API across all components
- Clear separation of concerns

**Implementation**:
```javascript
class CoordinateSystemRegistry {
  static detectSystem(graphData) { /* detection logic */ }
  static getSystemConfig(systemType) { /* configuration */ }
  static getPositionCalculator(systemType) { /* positioning */ }
  static getShapeRenderer(systemType) { /* rendering */ }
}
```

**Components**:
- `CoordinateSystemDetector`: Analyzes graph data to determine system type
- `SystemConfigurationManager`: Manages system-specific configurations
- `UniversalPositionCalculator`: Mathematical positioning for any modN system
- `ShapeRendererFactory`: Creates appropriate shape renderers

### Approach 2: Plugin-Based Architecture

**Architecture**: Each coordinate system as an independent plugin

**Advantages**:
- Highly modular and extensible
- Easy to add custom systems
- Clean separation between systems
- Hot-swappable system implementations

**Implementation**:
```javascript
class CoordinateSystemPlugin {
  detect(graphData) { /* detection */ }
  calculatePosition(coordinate) { /* positioning */ }
  renderShape(context, node) { /* rendering */ }
}
```

**Trade-offs**: More complex initial setup, potential performance overhead

### Approach 3: Mathematical Abstraction Framework

**Architecture**: Pure mathematical approach using regular polygons/polyhedra

**Advantages**:
- Mathematically elegant and consistent
- Automatically supports any modN system
- Minimal code duplication
- Scientifically rigorous

**Implementation**:
```javascript
class RegularPolygonCalculator {
  static calculateVertices(n, radius, center) { /* math */ }
  static getVertexPosition(index, n, radius, center) { /* math */ }
}
```

**Components**:
- `RegularPolygonCalculator`: 2D positioning mathematics
- `RegularPolyhedronCalculator`: 3D positioning mathematics
- `GeometricShapeRenderer`: Universal shape rendering

### Approach 4: Hybrid Detection + Configuration

**Architecture**: Combines automatic detection with manual configuration override

**Advantages**:
- Flexible and robust
- Handles edge cases gracefully
- User control when needed
- Backward compatible

**Implementation**: Detection algorithms with configuration fallbacks and user overrides

### Approach 5: Template-Based System

**Architecture**: Pre-defined templates for common systems with composition support

**Advantages**:
- Fast implementation for common cases
- Template inheritance and composition
- Easy customization
- Performance optimized

**Implementation**: Template definitions with inheritance chains and custom template creation

## Recommended Implementation Strategy

**Primary Approach**: Combination of Approach 1 (Centralized Registry) and Approach 3 (Mathematical Framework)

**Rationale**:
- Centralized management provides consistency and maintainability
- Mathematical foundation ensures accuracy and extensibility
- Balances complexity with functionality
- Maintains performance while adding flexibility

## Technical Implementation Plan

### Enhanced Coordinate Parser for Complex Systems

#### Complex Coordinate Pattern Recognition
```javascript
export class EnhancedCoordinateParser {
  static parseComplexCoordinate(coordinate) {
    const patterns = {
      contextFrame: /^(#[\d-]+)\.(.+)$/,
      nondual: /\/\d+/,
      nested: /\.\d+\.\d+-\d+\.\d+\/\d+/,
      recursive: /\.\d+\/\d+$/,
      specialMod9: /^#0-2-9/
    };

    return {
      baseCoordinate: this.extractBase(coordinate),
      systemType: this.classifySystemType(coordinate, patterns),
      contextFrame: this.extractContextFrame(coordinate),
      isNondual: patterns.nondual.test(coordinate),
      isNested: patterns.nested.test(coordinate),
      isRecursive: patterns.recursive.test(coordinate),
      modulus: this.determineModulus(coordinate),
      childCount: this.getActualChildCount(coordinate),
      renderingStrategy: this.determineRenderingStrategy(coordinate)
    };
  }

  static classifySystemType(coordinate, patterns) {
    if (patterns.specialMod9.test(coordinate)) return 'SPECIAL_MOD9';
    if (patterns.recursive.test(coordinate)) return 'RECURSIVE';
    if (patterns.nested.test(coordinate)) return 'NESTED';
    if (patterns.nondual.test(coordinate)) return 'NONDUAL';
    if (patterns.contextFrame.test(coordinate)) return 'CONTEXT_FRAME';
    return 'FOUNDATIONAL_MOD6';
  }
}
```

#### System-Specific Rendering Configurations
```javascript
const ENHANCED_SYSTEM_CONFIGS = {
  FOUNDATIONAL_MOD6: {
    modulus: 6,
    shape2D: 'hexagon',
    shape3D: 'diamond',
    style: 'solid',
    positioning: 'radial'
  },
  CONTEXT_FRAME: {
    modulus: 'variable',
    shape2D: 'wireframe',
    shape3D: 'wireframe',
    style: 'outlined',
    positioning: 'contextual'
  },
  NONDUAL: {
    modulus: 2,
    shape2D: 'figure8',
    shape3D: 'dual_sphere',
    style: 'dual_position',
    positioning: 'bridge'
  },
  MOD12_ARCHETYPAL: {
    modulus: 12,
    shape2D: 'dodecagon',
    shape3D: 'icosahedron',
    style: 'archetypal',
    positioning: 'radial'
  },
  NESTED_ENNEAGON: {
    modulus: 9,
    shape2D: 'enneagon',
    shape3D: 'nested_enneagon',
    style: 'central_nested',
    positioning: 'within_parent',
    parentSystem: 'MOD12_ARCHETYPAL',
    specialConnection: 'nondual_equivalence' // #0-2-9 ≡ #0-3-0/1
  },
  TRIKA_QUATERNITY: {
    modulus: 4,
    shape2D: 'triangle_with_nested_systems',
    shape3D: 'tetrahedron_with_nested_systems',
    style: 'primary_sacred_geometry',
    positioning: 'foundational_container',
    specialNodes: ['#0-0-0', '#0-0-1', '#0-1-0/1', '#0-2-9'],
    trikaNodes: ['#0-0-0', '#0-0-1', '#0-1-0/1'],
    quaternityAnchor: '#0-2-9',
    nestedSystems: ['MOD12_ARCHETYPAL'], // #0-3 system nests within
    anchorVertex: '#0-2-9', // Vertex that anchors nested systems
    proportions: 'golden_ratio',
    hierarchy: 'primary' // Most fundamental structure
  }
};
```

### Phase 1: Enhanced Core Infrastructure

#### 1.1 Advanced Coordinate System Detection
**File**: `epii_app/friendly-file-backend/databases/shared/utils/coordinateSystemDetector.mjs`

**Detection Methods**:
1. **Coordinate Range Analysis**: Scan all coordinates to find maximum values per branch
2. **QLVariant Property**: Use existing QLVariant enum values
3. **Graph Metadata**: Check for system-level metadata properties
4. **Pattern Recognition**: Analyze coordinate distribution patterns

```javascript
export class CoordinateSystemDetector {
  static detectSystemType(graphData) {
    // Multi-method detection with confidence scoring
    const methods = [
      this.detectByCoordinateRange(graphData),
      this.detectByQLVariant(graphData),
      this.detectByMetadata(graphData),
      this.detectByPattern(graphData)
    ];
    return this.consolidateDetection(methods);
  }
}
```

#### 1.2 System Configuration Registry
**File**: `epii_app/friendly-file-backend/databases/shared/utils/coordinateSystemRegistry.mjs`

**System Configurations**:
```javascript
const SYSTEM_CONFIGS = {
  mod2: { modulus: 2, shape2D: 'circle', shape3D: 'sphere' },
  mod6: { modulus: 6, shape2D: 'hexagon', shape3D: 'diamond' },
  mod8: { modulus: 8, shape2D: 'octagon', shape3D: 'cube' },
  mod12: { modulus: 12, shape2D: 'dodecagon', shape3D: 'icosahedron' }
};
```

### Phase 2: Mathematical Foundation

#### 2.1 Universal Position Calculator
**File**: `epii_app/friendly-file-front/src/shared/utils/universalPositionCalculator.ts`

**Core Algorithm**:
```typescript
export class UniversalPositionCalculator {
  static calculate2DPosition(coordinate: string, systemConfig: SystemConfig): Position2D {
    const { modulus, baseRadius, scaleFactor } = systemConfig;
    const parts = parseCoordinate(coordinate);

    let x = 0, y = 0;
    let currentRadius = baseRadius;

    for (const [index, part] of parts.entries()) {
      const angle = (2 * Math.PI * part) / modulus;
      x += currentRadius * Math.cos(angle);
      y += currentRadius * Math.sin(angle);
      currentRadius *= scaleFactor;
    }

    return { x, y };
  }
}
```

#### 2.2 Shape Generators
**Files**:
- `epii_app/friendly-file-front/src/shared/utils/shapeGenerators2D.ts`
- `epii_app/friendly-file-front/src/shared/utils/shapeGenerators3D.ts`

**2D Shapes**:
- `RegularPolygonGenerator`: N-sided polygons for any modN system
- `CircleGenerator`: Special case for mod2 systems
- `OctagonGenerator`: Optimized octagon with nondual handling

**3D Shapes**:
- `RegularPolyhedronGenerator`: Mathematical polyhedra generation
- `CubeGenerator`: 8-vertex cube for mod8 systems
- `IcosahedronGenerator`: 12-vertex icosahedron for mod12 systems
- `SphereGenerator`: Spherical positioning for mod2 systems

### Phase 3: Integration Updates

#### 3.1 Graph Data Processing
**File**: `epii_app/friendly-file-backend/databases/shared/utils/graphData.utils.mjs`

**Updates**:
- Add coordinate system detection to graph processing pipeline
- Update coordinate validation to handle multiple systems
- Enhance coordinate mapping with system awareness

#### 3.2 Meta2D Integration
**Files**:
- `epii_app/friendly-file-front/src/subsystems/0_anuttara/1_utils/geometryUtils.ts`
- `epii_app/friendly-file-front/src/subsystems/0_anuttara/3_visualization/useGraphRendering.ts`

**Updates**:
- Replace `calculateHexagonalPosition()` with universal position calculator
- Add shape-specific rendering functions (octagon, dodecagon, circle)
- Update canvas drawing to handle different node shapes

#### 3.3 Meta3D Integration
**Files**:
- `epii_app/friendly-file-front/src/subsystems/1_paramasiva/1_utils/calculate3DDiamondPosition.ts`
- `epii_app/friendly-file-front/src/subsystems/1_paramasiva/2_hooks/useGraphLayout3D.ts`

**Updates**:
- Generalize 3D positioning beyond diamond layout
- Add cube, icosahedron, and sphere positioning
- Handle special cases for nondual elements in 8fold systems

## Enhanced Drawing Function Specifications

### Special Case Drawing Functions

#### Nondual 0/1 Coordinate Rendering
```typescript
export function drawNondualNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  radius: number
) {
  const { x, y } = node;
  const offset = radius * 0.6;

  // Draw dual positions
  const pos1 = { x: x - offset, y: y };
  const pos2 = { x: x + offset, y: y };

  // Draw connecting bridge
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.moveTo(pos1.x, pos1.y);
  ctx.lineTo(pos2.x, pos2.y);
  ctx.stroke();

  // Draw dual nodes with complementary colors
  drawCircle(ctx, pos1, radius * 0.8, 'rgba(100, 200, 255, 0.7)');
  drawCircle(ctx, pos2, radius * 0.8, 'rgba(255, 100, 200, 0.7)');

  // Add pulsing animation indicator
  if (node.isActive) {
    const pulseRadius = radius * (1 + 0.2 * Math.sin(Date.now() * 0.005));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
```

#### Context Frame Wireframe Rendering
```typescript
export function drawContextFrameNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  radius: number,
  frameType: string
) {
  const { x, y } = node;

  // Base wireframe shape
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent fill

  switch (frameType) {
    case 'CONTEXT_FRAME':
      drawWireframeHexagon(ctx, x, y, radius);
      break;
    case 'NESTED':
      drawConcentricShapes(ctx, x, y, radius);
      break;
    case 'RECURSIVE':
      drawSpiralPattern(ctx, x, y, radius);
      break;
  }

  ctx.stroke();
}

function drawConcentricShapes(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  for (let i = 0; i < 3; i++) {
    const r = radius * (1 - i * 0.25);
    const alpha = 0.8 - i * 0.2;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
```

#### Nested Enneagon within Dodecagon (#0-2-9 within #0-3)
```typescript
export function drawNestedArchetypalSystem(
  ctx: CanvasRenderingContext2D,
  parentNode: Node, // #0-3 node
  centralNode: Node, // #0-2-9 node
  enneagonChildren: Node[], // #0-2-9-0 through #0-2-9-8
  radius: number
) {
  const { x, y } = parentNode;

  // 1. Draw outer dodecagon (#0-3 archetypal number language)
  drawDodecagon(ctx, parentNode, radius);

  // 2. Draw central #0-2-9 node
  const centralRadius = radius * 0.3;
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Golden for 9≡0/1
  ctx.arc(x, y, centralRadius * 0.5, 0, 2 * Math.PI);
  ctx.fill();

  // 3. Draw enneagon of #0-2-9 children around central node
  const enneagonRadius = radius * 0.6;
  const angleStep = (2 * Math.PI) / 9;

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
  ctx.lineWidth = 2;

  for (let i = 0; i < 9; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const px = x + enneagonRadius * Math.cos(angle);
    const py = y + enneagonRadius * Math.sin(angle);

    // Draw enneagon structure
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);

    // Draw child nodes
    ctx.save();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  ctx.closePath();
  ctx.stroke();

  // 4. Draw special connection to nondual element
  drawNondualConnection(ctx, x, y, radius);
}

function drawNondualConnection(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
  // Draw connection between central #0-2-9 and #0-3-0/1 showing 9≡0/1
  const nondualAngle = 0; // Position of 0/1 element in dodecagon
  const nondualX = centerX + radius * Math.cos(nondualAngle);
  const nondualY = centerY + radius * Math.sin(nondualAngle);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(nondualX, nondualY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // Add equivalence symbol
  const midX = (centerX + nondualX) / 2;
  const midY = (centerY + nondualY) / 2;
  ctx.font = '16px serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('≡', midX, midY);
}
```

#### Primary Tetrahedron with Nested Archetypal System (#0 Foundation)
```typescript
export function drawPrimaryTetrahedronWithNesting(
  ctx: CanvasRenderingContext2D,
  trikaNodes: Node[], // [#0-0-0, #0-0-1, #0-1-0/1]
  quaternityAnchor: Node, // #0-2-9
  archetypalNodes: Node[], // #0-3 system nodes
  radius: number
) {
  // Golden ratio proportions for sacred geometry
  const goldenRatio = 1.618;

  // 1. Calculate tetrahedron projection (triangle with #0-2-9 as one vertex)
  const tetrahedronVertices = [];

  // Position #0-2-9 at a specific vertex (e.g., top)
  tetrahedronVertices.push({
    node: quaternityAnchor,
    x: quaternityAnchor.x,
    y: quaternityAnchor.y - radius * 0.6
  });

  // Position trika nodes as base triangle
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI / 3) + Math.PI / 6; // Offset for proper tetrahedron projection
    tetrahedronVertices.push({
      node: trikaNodes[i],
      x: quaternityAnchor.x + (radius * 0.8) * Math.cos(angle),
      y: quaternityAnchor.y + (radius * 0.4) * Math.sin(angle)
    });
  }

  // 2. Draw primary tetrahedron structure
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;

  // Draw all tetrahedron edges
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      ctx.moveTo(tetrahedronVertices[i].x, tetrahedronVertices[i].y);
      ctx.lineTo(tetrahedronVertices[j].x, tetrahedronVertices[j].y);
    }
  }
  ctx.stroke();

  // 3. Draw tetrahedron vertices with archetypal colors
  const colors = [
    'rgba(255, 215, 0, 1)',   // #0-2-9 Completion - gold
    'rgba(255, 255, 255, 0.9)', // #0-0-0 Transcendent - white
    'rgba(100, 255, 100, 0.9)', // #0-0-1 Immanent - green
    'rgba(255, 200, 100, 0.9)'  // #0-1-0/1 Nondual - golden
  ];

  tetrahedronVertices.forEach((vertex, i) => {
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    const nodeSize = i === 0 ? 12 : 10; // #0-2-9 slightly larger as anchor
    ctx.arc(vertex.x, vertex.y, nodeSize, 0, 2 * Math.PI);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // 4. Draw nested #0-3 archetypal system anchored to #0-2-9
  const anchorVertex = tetrahedronVertices[0]; // #0-2-9
  const nestedRadius = radius * 0.3; // Smaller scale for nesting

  // Draw nested dodecagon centered on #0-2-9 vertex
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.lineWidth = 1;

  for (let i = 0; i < 12; i++) {
    const angle = (i * 2 * Math.PI / 12) - Math.PI / 2;
    const x = anchorVertex.x + nestedRadius * Math.cos(angle);
    const y = anchorVertex.y + nestedRadius * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    // Draw small nodes for archetypal elements
    ctx.save();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  ctx.closePath();
  ctx.stroke();

  // 5. Draw connection showing nesting relationship
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);

  // Draw lines from #0-2-9 to nested system perimeter
  for (let i = 0; i < 12; i += 3) { // Every 3rd element for clarity
    const angle = (i * 2 * Math.PI / 12) - Math.PI / 2;
    const x = anchorVertex.x + nestedRadius * Math.cos(angle);
    const y = anchorVertex.y + nestedRadius * Math.sin(angle);

    ctx.moveTo(anchorVertex.x, anchorVertex.y);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // 6. Add hierarchical labels
  ctx.font = '10px serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('Primary Tetrahedron', quaternityAnchor.x, quaternityAnchor.y + radius + 20);
  ctx.fillText('Nested #0-3 System', anchorVertex.x, anchorVertex.y + nestedRadius + 15);
}

export function drawPrimaryTetrahedron3DWithNesting(
  scene: THREE.Scene,
  trikaNodes: Node[],
  quaternityAnchor: Node,
  archetypalNodes: Node[],
  scale: number = 100
) {
  // 1. Create primary tetrahedron geometry
  const tetrahedronGeometry = new THREE.TetrahedronGeometry(scale);
  const vertices = tetrahedronGeometry.attributes.position.array;

  // Map nodes to tetrahedron vertices (#0-2-9 as anchor vertex)
  const tetrahedronVertices = [
    { node: quaternityAnchor, position: [vertices[0], vertices[1], vertices[2]] }, // #0-2-9 anchor
    { node: trikaNodes[0], position: [vertices[3], vertices[4], vertices[5]] },    // #0-0-0
    { node: trikaNodes[1], position: [vertices[6], vertices[7], vertices[8]] },    // #0-0-1
    { node: trikaNodes[2], position: [vertices[9], vertices[10], vertices[11]] }   // #0-1-0/1
  ];

  // 2. Create wireframe tetrahedron (primary structure)
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.8,
    transparent: true,
    linewidth: 3
  });
  const wireframe = new THREE.WireframeGeometry(tetrahedronGeometry);
  const tetrahedronWireframe = new THREE.LineSegments(wireframe, wireframeMaterial);
  scene.add(tetrahedronWireframe);

  // 3. Add tetrahedron vertices with archetypal colors
  const colors = [0xffd700, 0xffffff, 0x66ff66, 0xffcc66]; // Gold, white, green, golden
  tetrahedronVertices.forEach(({ node, position }, i) => {
    const nodeGeometry = new THREE.SphereGeometry(scale * 0.12);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0.9
    });
    const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);

    nodeMesh.position.set(position[0], position[1], position[2]);
    scene.add(nodeMesh);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(scale * 0.15);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0.3
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.copy(nodeMesh.position);
    scene.add(glowMesh);
  });

  // 4. Create nested #0-3 icosahedron anchored to #0-2-9 vertex
  const anchorPosition = tetrahedronVertices[0].position; // #0-2-9 position
  const nestedScale = scale * 0.4; // Smaller scale for nesting

  const icosahedronGeometry = new THREE.IcosahedronGeometry(nestedScale);
  const icosahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const nestedIcosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);

  // Position icosahedron at the #0-2-9 vertex
  nestedIcosahedron.position.set(anchorPosition[0], anchorPosition[1], anchorPosition[2]);
  scene.add(nestedIcosahedron);

  // 5. Add archetypal nodes around the icosahedron
  const icosahedronVertices = icosahedronGeometry.attributes.position.array;
  for (let i = 0; i < 12; i++) { // 12 archetypal elements
    const vertexIndex = i * 3;
    const nodeGeometry = new THREE.SphereGeometry(scale * 0.04);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.6
    });
    const archetypalNode = new THREE.Mesh(nodeGeometry, nodeMaterial);

    // Position relative to the icosahedron center (which is at #0-2-9)
    archetypalNode.position.set(
      anchorPosition[0] + icosahedronVertices[vertexIndex],
      anchorPosition[1] + icosahedronVertices[vertexIndex + 1],
      anchorPosition[2] + icosahedronVertices[vertexIndex + 2]
    );
    scene.add(archetypalNode);
  }

  // 6. Draw connection lines showing nesting relationship
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.4
  });

  // Connect #0-2-9 to key archetypal nodes
  for (let i = 0; i < 12; i += 3) { // Every 3rd node for clarity
    const vertexIndex = i * 3;
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(anchorPosition[0], anchorPosition[1], anchorPosition[2]),
      new THREE.Vector3(
        anchorPosition[0] + icosahedronVertices[vertexIndex],
        anchorPosition[1] + icosahedronVertices[vertexIndex + 1],
        anchorPosition[2] + icosahedronVertices[vertexIndex + 2]
      )
    ]);
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(connectionLine);
  }
}
```

### Standard 2D Shape Drawing Functions

#### Octagon (mod8 System)
```typescript
export function drawOctagon(
  ctx: CanvasRenderingContext2D,
  node: Node,
  radius: number,
  handleNondual: boolean = false
) {
  const vertices = 8;
  const angleStep = (2 * Math.PI) / vertices;

  // Special handling for 7-element systems with nondual
  if (handleNondual && node.isNondual) {
    // Draw dual-position indicator or special styling
    drawNondualOctagon(ctx, node, radius);
    return;
  }

  // Standard octagon drawing
  ctx.beginPath();
  for (let i = 0; i < vertices; i++) {
    const angle = i * angleStep - Math.PI / 8; // Rotate for flat top
    const x = node.x + radius * Math.cos(angle);
    const y = node.y + radius * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
```

#### Dodecagon (mod12 System)
```typescript
export function drawDodecagon(
  ctx: CanvasRenderingContext2D,
  node: Node,
  radius: number
) {
  const vertices = 12;
  const angleStep = (2 * Math.PI) / vertices;

  ctx.beginPath();
  for (let i = 0; i < vertices; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start at top
    const x = node.x + radius * Math.cos(angle);
    const y = node.y + radius * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
```

#### Circle (mod2 System)
```typescript
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  node: Node,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
}
```

### 3D Shape Positioning Functions

#### Cube (mod8 System)
```typescript
export function calculateCubePosition(
  coordinate: string,
  baseDistance: number = 1200
): Position3D {
  const parts = parseCoordinate(coordinate);
  if (!parts) return { x: 0, y: 0, z: 0 };

  let x = 0, y = 0, z = 0;
  let currentDistance = baseDistance;

  for (const part of parts.parts) {
    // Cube vertices: 8 positions
    const cubePositions = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],  // bottom face
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]   // top face
    ];

    if (part < 8) {
      const [dx, dy, dz] = cubePositions[part];
      x += currentDistance * dx * 0.5;
      y += currentDistance * dy * 0.5;
      z += currentDistance * dz * 0.5;
    }

    currentDistance *= 0.3; // Scale for next level
  }

  return { x, y, z };
}
```

#### Icosahedron (mod12 System)
```typescript
export function calculateIcosahedronPosition(
  coordinate: string,
  baseDistance: number = 1200
): Position3D {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const parts = parseCoordinate(coordinate);
  if (!parts) return { x: 0, y: 0, z: 0 };

  // 12 vertices of icosahedron using golden ratio
  const icosahedronVertices = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
  ];

  let x = 0, y = 0, z = 0;
  let currentDistance = baseDistance;

  for (const part of parts.parts) {
    if (part < 12) {
      const [dx, dy, dz] = icosahedronVertices[part];
      const normalizer = Math.sqrt(dx*dx + dy*dy + dz*dz);
      x += currentDistance * (dx / normalizer);
      y += currentDistance * (dy / normalizer);
      z += currentDistance * (dz / normalizer);
    }

    currentDistance *= 0.3;
  }

  return { x, y, z };
}
```

#### Sphere (mod2 System)
```typescript
export function calculateSpherePosition(
  coordinate: string,
  baseDistance: number = 1200
): Position3D {
  const parts = parseCoordinate(coordinate);
  if (!parts) return { x: 0, y: 0, z: 0 };

  let x = 0, y = 0, z = 0;
  let currentDistance = baseDistance;

  for (const part of parts.parts) {
    // Two poles: north (0) and south (1)
    const spherePositions = [
      [0, 0, 1],   // North pole
      [0, 0, -1]   // South pole
    ];

    if (part < 2) {
      const [dx, dy, dz] = spherePositions[part];
      x += currentDistance * dx;
      y += currentDistance * dy;
      z += currentDistance * dz;
    }

    currentDistance *= 0.3;
  }

  return { x, y, z };
}
```

## Special Case Handling

### Nondual Elements in 8fold Systems
When a 7-element system uses an 8fold structure, one element represents a nondual state (e.g., 0/1 combined). This requires special handling:

1. **Dual Position Rendering**: Show the node at two positions simultaneously
2. **Special Styling**: Use different colors/shapes to indicate nondual nature
3. **Interaction Handling**: Clicks on either position activate the same node
4. **Animation**: Subtle pulsing or connection between dual positions

### Mixed Coordinate Systems
Handle cases where different branches use different moduli:
- Parent-child system inheritance
- System boundary detection
- Transition rendering between systems
- Validation of mixed system coherence

## Future-Proofing Strategy

### Mathematical Extensibility
- All algorithms based on modular arithmetic principles
- Regular polygon/polyhedron mathematics for any N
- Configurable parameters for custom systems
- Automatic vertex calculation for any modulus

### Configuration-Driven Architecture
- JSON/YAML configuration files for new systems
- Runtime system registration
- Hot-swappable system implementations
- User-defined custom systems

### Performance Optimization
- Lazy loading of system-specific code
- Caching of calculated positions
- Efficient shape rendering with canvas optimization
- Memory management for large coordinate sets

## Implementation Timeline

### Phase 1 (Weeks 1-2): Core Infrastructure
- Coordinate system detection
- System configuration registry
- Mathematical foundation classes

### Phase 2 (Weeks 3-4): Shape Generation
- 2D shape generators and renderers
- 3D positioning algorithms
- Special case handling

### Phase 3 (Weeks 5-6): Integration
- Meta2D/3D component updates
- File/node listing updates
- Testing and validation

### Phase 4 (Weeks 7-8): Polish and Optimization
- Performance optimization
- Edge case handling
- Documentation and examples

## Key Insights from Actual Coordinate Analysis

### Complexity Beyond Initial Assumptions
The actual coordinate data reveals a system far more sophisticated than simple modular arithmetic variants:

1. **Context Frame Complexity**: Coordinates like `#1-3-4.0/1/2/3` represent multi-dimensional context frames, not just positional extensions
2. **Nondual Integration**: The 0/1 notation represents fundamental nondual states requiring special dual-position rendering
3. **Mixed Systems**: Different branches use different modular bases within the same coordinate tree
4. **Nested Integration**: #0-2-9 is centrally integrated within the #0-3 archetypal system, showing interpenetration rather than separation
5. **Adaptive Requirements**: The system must adapt to actual child counts rather than theoretical maximums
6. **Sacred Geometry Foundation**: The #0 system contains unique trika/quaternity structures requiring special sacred geometry rendering

### Critical Implementation Priorities

#### Phase 1: Enhanced Parser (Weeks 1-2)
- **Priority**: Complex coordinate pattern recognition
- **Focus**: Context frames, nondual notation, nested patterns
- **Deliverable**: `EnhancedCoordinateParser` class with full pattern support

#### Phase 2: Visual Distinction System (Weeks 3-4)
- **Priority**: Foundational vs context frame visual differentiation
- **Focus**: Solid vs wireframe rendering, special case styling
- **Deliverable**: Complete rendering system with visual hierarchy

#### Phase 3: Special Case Handlers (Weeks 5-6)
- **Priority**: #0-2-9 enneagon, nondual dual-position, mixed systems
- **Focus**: Custom rendering logic for unique patterns
- **Deliverable**: Specialized drawing functions and positioning algorithms

#### Phase 4: Integration & Testing (Weeks 7-8)
- **Priority**: Meta2D/3D integration, file/node listing updates
- **Focus**: Seamless integration with existing components
- **Deliverable**: Fully functional multi-modal coordinate system

### Architectural Recommendations

#### Recommended Approach: Enhanced Centralized Registry
Combining **Approach 1** (Centralized Registry) with **Approach 3** (Mathematical Framework) plus:
- **Complex Pattern Recognition**: Advanced parsing for context frames
- **Visual Distinction System**: Clear differentiation between coordinate types
- **Adaptive Rendering**: Shapes based on actual structure, not theoretical limits
- **Special Case Handling**: Custom logic for unique patterns

#### Future-Proofing Strategy
- **Mathematical Foundation**: Regular polygon/polyhedron calculations for any N
- **Pattern-Based Detection**: Extensible regex patterns for new coordinate types
- **Configuration-Driven**: JSON/YAML configs for new system variants
- **Plugin Architecture**: Modular handlers for special cases

### Next Steps for Implementation

1. **Immediate**: Create `EnhancedCoordinateParser` with pattern recognition
2. **Short-term**: Implement visual distinction system for foundational vs context frames
3. **Medium-term**: Add special case handlers for nondual and #0-2-9 systems
4. **Long-term**: Full integration with Meta2D/3D and file management systems

## Comprehensive System Integration Beyond Visualization

### Critical Scope Expansion: All Coordinate-Dependent Components

This plan addresses not only visualization components but ALL systems that process coordinates:

#### 1. Data Processing & Management Components

**Recursive Coordinate Tree (`RecursiveCoordinateTree.tsx`)**
- **Current**: Handles coordinate parsing with `-` and `.` separators
- **Required Updates**:
  - Enhanced parsing for context frames (`#1-3-4.0/1/2/3`)
  - Nondual coordinate display (`#0-1-0/1`)
  - Special handling for nested systems (#0-2-9 within #0-3)
  - Visual distinction between foundational and context frame coordinates

**Bimba Update Manager (`bimba-update-management-skill.js`)**
- **Current**: Creates and manages nodes with coordinate validation
- **Required Updates**:
  - Complex coordinate pattern recognition
  - Parent-child relationship handling for nested systems
  - Context frame coordinate creation and validation
  - Special case handling for trika/quaternity structures

**Coordinate Parsing (`bimbaUtils.ts`)**
- **Current**: Basic parsing with separator normalization
- **Required Updates**:
  ```typescript
  // ENHANCED PARSING FOR COMPLEX COORDINATES
  export const parseComplexCoordinate = (input: string) => {
    return {
      baseCoordinate: extractBase(input),
      contextFrame: extractContextFrame(input),
      isNondual: input.includes('0/1'),
      isNested: detectNestedPattern(input),
      systemType: classifySystemType(input),
      modulus: determineModulus(input)
    };
  };
  ```

#### 2. Graph Data Processing (`graphData.utils.mjs`)

**Current Limitations:**
- Hardcoded mod6 assumptions
- No context frame recognition
- Limited coordinate system detection

**Required Enhancements:**
```javascript
// ENHANCED GRAPH DATA PROCESSING
export class EnhancedGraphDataProcessor {
  static processCoordinates(graphData) {
    return graphData.nodes.map(node => {
      const coordinateInfo = this.analyzeCoordinate(node.bimbaCoordinate);

      return {
        ...node,
        systemType: coordinateInfo.systemType,
        modulus: coordinateInfo.modulus,
        isNondual: coordinateInfo.isNondual,
        contextFrame: coordinateInfo.contextFrame,
        renderingStrategy: this.determineRenderingStrategy(coordinateInfo)
      };
    });
  }

  static analyzeCoordinate(coordinate) {
    // Multi-method analysis combining:
    // - Pattern recognition
    // - Child count analysis
    // - QLVariant property checking
    // - System inheritance detection
  }
}
```

#### 3. File Organization & Node Listings

**Recursive File Structures:**
- **Current**: Simple hierarchical display
- **Required**:
  - Context frame grouping
  - Nondual coordinate special display
  - Nested system visualization
  - System type indicators

**Node Management:**
- **Current**: Basic CRUD operations
- **Required**:
  - System-aware node creation
  - Complex coordinate validation
  - Parent-child relationship management for nested systems
  - Context frame inheritance handling

#### 4. Component Integration Matrix

| Component | Current State | Required Updates | Priority |
|-----------|---------------|------------------|----------|
| `geometryUtils.ts` | Hexagonal only | Multi-system positioning | HIGH |
| `calculate3DDiamondPosition.ts` | Diamond only | Multi-system 3D positioning | HIGH |
| `bimbaUtils.ts` | Basic parsing | Complex pattern recognition | HIGH |
| `RecursiveCoordinateTree.tsx` | Simple hierarchy | System-aware display | MEDIUM |
| `bimba-update-management-skill.js` | Basic CRUD | Complex coordinate handling | MEDIUM |
| `graphData.utils.mjs` | Mod6 assumptions | System detection & processing | HIGH |
| `nodeStyleUtils.ts` | Depth-based sizing | System-aware sizing | MEDIUM |

#### 5. Scaling Law Harmonization Requirements

**All components must maintain consistency with established scaling constants:**
- `baseRadius/baseDistance = 1200` (never change)
- `scaleFactor = 0.3` per hierarchical level (never change)
- Node size ratios preserved across all system types
- Orbital positioning formulas maintained

**Example Integration:**
```typescript
// UNIVERSAL SCALING INTEGRATION
export function updateGeometryUtils() {
  // Extend existing calculateHexagonalPosition to support multiple systems
  // while preserving baseRadius = 1200 and radiusScaleFactor = 0.3
}

export function updateCalculate3DDiamondPosition() {
  // Extend to support multiple 3D systems
  // while preserving baseDistance = 1200 and distanceScaleFactor = 0.3
}
```

## Conclusion

This enhanced multi-modal coordinate system architecture addresses the actual complexity of the Bimba coordinate system, moving beyond simple modular arithmetic to handle context frames, nondual states, mixed systems, and special completions.

**Key Achievements:**
1. **Comprehensive Scope**: Addresses ALL coordinate-dependent components, not just visualization
2. **Scaling Law Harmonization**: Maintains consistency with established geometric relationships
3. **Sacred Geometry Integration**: Properly handles trika/quaternity and nested archetypal systems
4. **Future-Proof Architecture**: Extensible framework for any modular arithmetic system
5. **Philosophical Coherence**: Reflects the deep structural complexity of the Epi-Logos system

The implementation provides a robust foundation for the philosophical and mathematical sophistication inherent in the coordinate system while maintaining practical usability, visual consistency, and comprehensive system integration.

The key insight is that this is not just a technical upgrade but a recognition of the deep structural complexity that reflects the philosophical foundations of the Epi-Logos system itself, requiring harmonious integration across all system components.
