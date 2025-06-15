/**
 * Graph Utility Functions
 *
 * This file contains utility functions for processing graph data in the MetaStructure component.
 * These functions are pure and don't depend on React state or hooks.
 */

import { Node, Edge } from "../components/meta/metaData";

/**
 * Builds a map of parent-child relationships based on the graph edges.
 *
 * @param nodes - The graph nodes
 * @param edges - The graph edges
 * @returns A map of parent IDs to arrays of child IDs
 */
export function buildParentChildMap(nodes: Node[], edges: Edge[]): Map<string, string[]> {
  const parentChildMap = new Map<string, string[]>();

  // Initialize map with empty arrays for all nodes
  nodes.forEach(node => {
    parentChildMap.set(node.id, []);
  });

  // Populate map based on edges - consider ALL edge types for parent-child relationships
  // This ensures we don't miss any relationships
  edges.forEach(edge => {
    // Handle null or undefined source/target
    if (!edge.source || !edge.target) return;

    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

    // Skip if source or target ID is missing
    if (!sourceId || !targetId) return;

    // Add all relationships to the map, not just specific types
    // This ensures all nodes have a parent if any relationship exists
    const children = parentChildMap.get(sourceId) || [];
    if (!children.includes(targetId)) {
      children.push(targetId);
      parentChildMap.set(sourceId, children);
    }
  });

  return parentChildMap;
}

/**
 * Calculates the depth of a node based on its bimbaCoordinate.
 *
 * @param coordinate - The bimbaCoordinate of the node
 * @returns The depth of the node
 */
export function calculateDepth(coordinate: string | undefined | null): number {
  if (!coordinate) {
    return 3; // Default depth
  }

  // Root node
  if (coordinate === '#') {
    return 0;
  }

  // For main subsystem nodes (#0-#5)
  if (/^#[0-5]$/.test(coordinate)) {
    return 1;
  }

  // For second level nodes (#X-Y or #X.Y)
  if (/^#[0-5][-.]([0-5])$/.test(coordinate)) {
    return 2;
  }

  // For deeper nodes, count segments properly
  // Remove the '#' prefix first
  const cleanCoordinate = coordinate.substring(1);

  // Split by both '-' and '.' separators
  const segments = cleanCoordinate.split(/[-.]/);

  // The depth is the number of segments + 1 (to account for the root level)
  return segments.length + 1;
}

/**
 * Calculates the virtual depth of each node based on its bimbaCoordinate or parent-child relationships.
 *
 * @param nodes - The graph nodes
 * @param parentChildMap - The map of parent-child relationships
 * @returns A map of node IDs to virtual depths
 */
export function calculateVirtualDepths(nodes: Node[], parentChildMap: Map<string, string[]>): Map<string, number> {
  const virtualDepths = new Map<string, number>();

  // First, set depths for all mapped nodes
  nodes.forEach(node => {
    if (node.bimbaCoordinate) {
      const depth = calculateDepth(node.bimbaCoordinate);
      virtualDepths.set(node.id, depth);
      // Also update the node's virtualDepth property directly for convenience
      node.virtualDepth = depth;
    }
  });

  // Then, set depths for unmapped nodes based on their parents
  const processedNodes = new Set<string>();

  // Process nodes with mapped parents first
  nodes.forEach(node => {
    if (!node.bimbaCoordinate && !processedNodes.has(node.id)) {
      // Find parent
      let parentId: string | undefined;
      for (const [parent, children] of parentChildMap.entries()) {
        if (children.includes(node.id)) {
          parentId = parent;
          break;
        }
      }

      if (parentId && virtualDepths.has(parentId)) {
        // Set depth based on parent's depth
        const parentDepth = virtualDepths.get(parentId)!;
        const nodeDepth = parentDepth + 1;
        virtualDepths.set(node.id, nodeDepth);
        // Also update the node's virtualDepth property directly
        node.virtualDepth = nodeDepth;
        processedNodes.add(node.id);
      }
    }
  });

  // Process remaining nodes in multiple passes
  let changed = true;
  let passCount = 0;

  while (changed && passCount < 10) { // Limit to 10 passes to avoid infinite loops
    passCount++;
    changed = false;

    nodes.forEach(node => {
      if (!virtualDepths.has(node.id) && !processedNodes.has(node.id)) {
        // Find parent
        let parentId: string | undefined;
        for (const [parent, children] of parentChildMap.entries()) {
          if (children.includes(node.id)) {
            parentId = parent;
            break;
          }
        }

        if (parentId && virtualDepths.has(parentId)) {
          // Set depth based on parent's depth
          const parentDepth = virtualDepths.get(parentId)!;
          const nodeDepth = parentDepth + 1;
          virtualDepths.set(node.id, nodeDepth);
          // Also update the node's virtualDepth property directly
          node.virtualDepth = nodeDepth;
          processedNodes.add(node.id);
          changed = true;
        }
      }
    });
  }

  // Set default depth for any remaining nodes
  nodes.forEach(node => {
    if (!virtualDepths.has(node.id)) {
      virtualDepths.set(node.id, 3); // Default depth
      // Also update the node's virtualDepth property directly
      node.virtualDepth = 3;
    }
  });

  return virtualDepths;
}

/**
 * Calculates the position of a node in the hexagonal layout based on its bimbaCoordinate.
 *
 * @param coordinate - The bimbaCoordinate of the node
 * @returns The position of the node in the hexagonal layout
 */
export function calculateHexagonalPosition(coordinate: string | undefined | null): { x: number, y: number, z?: number } | null {
  // Removed verbose logging

  if (!coordinate) return null;

  // Root node at center
  if (coordinate === '#') {
    return { x: 0, y: 0, z: 0 };
  }

  // Remove the '#' prefix and then split into segments
  const cleanCoordinate = coordinate.startsWith('#') ? coordinate.substring(1) : coordinate;
  const segments = cleanCoordinate.split(/[-.]/);

  // Base radius for the first level hexagon
  const baseRadius = 1200;

  // Scaling factor for each level deeper
  const radiusScaleFactor = 0.3;

  // Start from the center
  let x = 0;
  let y = 0;
  let z = 0;

  // Current radius for this level
  let currentRadius = baseRadius;

  // For each segment, move outward in the hexagon
  for (let i = 0; i < segments.length; i++) {
    // Skip empty segments
    if (!segments[i]) continue;

    const segmentValue = parseInt(segments[i], 10);

    // Skip if not a valid number
    if (isNaN(segmentValue)) continue;

    // Ensure the value is between 0-5 for hexagonal positioning
    const hexPosition = segmentValue % 6;

    // Calculate angle based on position in hexagon (0-5)
    // Using the same angle calculation as the original version
    const angle = (hexPosition * Math.PI / 3) - Math.PI / 6;

    // Calculate new position
    x += currentRadius * Math.cos(angle);
    y += currentRadius * Math.sin(angle);

    // Reduce radius for next level
    currentRadius *= radiusScaleFactor;

    // Alternate z position for 3D effect
    z += (i % 2 === 0 ? 20 : -20);
  }

  return { x, y, z };
}

/**
 * Calculates the position of an unmapped node in orbit around its parent.
 *
 * @param node - The node to position
 * @param parentChildMap - The map of parent-child relationships
 * @param virtualDepths - The map of node IDs to virtual depths
 * @param nodeMap - The map of node IDs to nodes
 * @returns The node with updated position
 */
export function calculateOrbitalPosition(
  node: Node,
  parentChildMap: Map<string, string[]>,
  virtualDepths: Map<string, number>,
  nodeMap: Map<string, Node>
): Node {
  // Find parent
  let parentId: string | undefined;
  for (const [parent, children] of parentChildMap.entries()) {
    if (children.includes(node.id)) {
      parentId = parent;
      break;
    }
  }

  if (parentId) {
    // Get parent node
    const parentNode = nodeMap.get(parentId);
    if (parentNode) {
      // Get parent position
      const parentX = parentNode.x || 0;
      const parentY = parentNode.y || 0;
      const parentZ = parentNode.z || 0;

      // Get child's virtual depth
      const childDepth = virtualDepths.get(node.id) || 3;

      // Get parent's children
      const siblings = parentChildMap.get(parentId) || [];

      // CRITICAL FIX: Use MODERATE orbital distances that maintain parent-child relationships
      // while still allowing 3D freedom
      const baseDistance = 150; // REDUCED from 300 to 150 for better parent-child relationships

      // Use moderate scaling with depth
      const depthScaling = Math.pow(1.2, childDepth - 2); // Reduced from 1.5 to 1.2
      const distance = baseDistance * depthScaling;

      // CRITICAL FIX: Create TRUE 3D orbital planes that are properly oriented in 3D space
      // This is the key to harmonious 3D orbital motion

      // First, determine the orbital plane orientation based on parent node
      // We'll create a unique orbital plane for each parent node

      // Generate a consistent random value based on parent ID for stable orbital planes
      const parentIdHash = parentNode.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomSeed = parentIdHash / 1000; // Normalize to 0-1 range approximately

      // CRITICAL FIX: Special handling for z-axis subsystems (#0 and #5)
      // This ensures their children orbit in planes perpendicular to the z-axis
      let planeNormalX: number, planeNormalY: number, planeNormalZ: number;

      if (parentNode.bimbaCoordinate === '#0') {
        // For #0 (below), create orbital planes perpendicular to the negative z-axis
        planeNormalX = 0;
        planeNormalY = 0;
        planeNormalZ = -1; // Negative z-axis
      } else if (parentNode.bimbaCoordinate === '#5') {
        // For #5 (above), create orbital planes perpendicular to the positive z-axis
        planeNormalX = 0;
        planeNormalY = 0;
        planeNormalZ = 1; // Positive z-axis
      } else {
        // For other nodes, create unique orbital planes
        planeNormalX = Math.cos(randomSeed * Math.PI * 2);
        planeNormalY = Math.sin(randomSeed * Math.PI * 2);
        planeNormalZ = Math.cos(randomSeed * Math.PI);
      }

      // Normalize the plane normal vector
      const normalLength = Math.sqrt(planeNormalX*planeNormalX + planeNormalY*planeNormalY + planeNormalZ*planeNormalZ);
      const normalizedNX = planeNormalX / normalLength;
      const normalizedNY = planeNormalY / normalLength;
      const normalizedNZ = planeNormalZ / normalLength;

      // Calculate azimuth angle based on position among siblings
      // This distributes siblings evenly around the parent
      const siblingIndex = siblings.indexOf(node.id);
      const totalSiblings = siblings.length;
      const azimuth = (siblingIndex / totalSiblings) * 2 * Math.PI;

      // CRITICAL FIX: Use a moderate orbital inclination angle
      // This tilts the orbital plane to create 3D orbits without extreme z-scaling
      const baseInclination = Math.PI / 6; // 30 degrees inclination

      // Vary inclination slightly based on sibling index for more visual interest
      const inclination = baseInclination * (1 + (siblingIndex % 3 - 1) * 0.2); // Varies by ±20%

      // CRITICAL FIX: Use different orbital parameters for z-axis vs. xy-plane subsystems
      let orbitDistance = distance;
      let inclinationFactor = 1.0;

      // CRITICAL FIX: Special handling for z-axis subsystems (#0 and #5)
      if (parentNode.bimbaCoordinate === '#0' || parentNode.bimbaCoordinate === '#5') {
        // Use larger distances and much stronger inclination for z-axis subsystems
        orbitDistance = distance * 2.0; // 2.0x larger
        inclinationFactor = 3.0; // 3.0x stronger inclination
      }

      // CRITICAL FIX: Calculate position using the orbital plane and inclination
      // This creates true 3D orbital paths that are consistent for each parent

      // First, calculate position in the orbital plane
      const orbitX = Math.cos(azimuth) * orbitDistance;
      const orbitY = Math.sin(azimuth) * orbitDistance;

      // Then, apply inclination to tilt the orbit out of the plane
      const tiltedX = orbitX;
      const tiltedY = orbitY * Math.cos(inclination * inclinationFactor);
      const tiltedZ = orbitY * Math.sin(inclination * inclinationFactor);

      // Finally, transform to parent's coordinate system
      // This requires creating a coordinate system based on the orbital plane normal

      // First basis vector (arbitrary, perpendicular to normal)
      let basisX1: number, basisY1: number, basisZ1: number;

      // Find a vector not parallel to the normal
      if (Math.abs(normalizedNZ) < 0.9) {
        // Use up vector if normal is not close to up
        basisX1 = normalizedNY;
        basisY1 = -normalizedNX;
        basisZ1 = 0;
      } else {
        // Use right vector if normal is close to up
        basisX1 = 0;
        basisY1 = normalizedNZ;
        basisZ1 = -normalizedNY;
      }

      // Normalize first basis vector
      const basis1Length = Math.sqrt(basisX1*basisX1 + basisY1*basisY1 + basisZ1*basisZ1);
      basisX1 /= basis1Length;
      basisY1 /= basis1Length;
      basisZ1 /= basis1Length;

      // Second basis vector (cross product of normal and first basis)
      const basisX2 = normalizedNY * basisZ1 - normalizedNZ * basisY1;
      const basisY2 = normalizedNZ * basisX1 - normalizedNX * basisZ1;
      const basisZ2 = normalizedNX * basisY1 - normalizedNY * basisX1;

      // Transform tilted coordinates to parent's coordinate system
      const x = parentX + tiltedX * basisX1 + tiltedY * basisX2 + tiltedZ * normalizedNX;
      const y = parentY + tiltedX * basisY1 + tiltedY * basisY2 + tiltedZ * normalizedNY;
      const z = parentZ + tiltedX * basisZ1 + tiltedY * basisZ2 + tiltedZ * normalizedNZ;

      // CRITICAL FIX: Calculate tangential velocity that follows the orbital plane
      // This ensures nodes orbit in their proper 3D planes

      // Calculate the tangential direction in the orbital plane
      // This is perpendicular to the radius in the orbital plane
      const tangentialX = -Math.sin(azimuth);
      const tangentialY = Math.cos(azimuth);

      // Apply the same tilting and transformation as for the position
      const tiltedTangentialX = tangentialX;
      const tiltedTangentialY = tangentialY * Math.cos(inclination * inclinationFactor);
      const tiltedTangentialZ = tangentialY * Math.sin(inclination * inclinationFactor);

      // Transform to parent's coordinate system
      const tx = tiltedTangentialX * basisX1 + tiltedTangentialY * basisX2 + tiltedTangentialZ * normalizedNX;
      const ty = tiltedTangentialX * basisY1 + tiltedTangentialY * basisY2 + tiltedTangentialZ * normalizedNY;
      const tz = tiltedTangentialX * basisZ1 + tiltedTangentialY * basisZ2 + tiltedTangentialZ * normalizedNZ;

      // Normalize the tangential vector
      const tangentialLength = Math.sqrt(tx*tx + ty*ty + tz*tz);
      const normalizedTX = tx / tangentialLength;
      const normalizedTY = ty / tangentialLength;
      const normalizedTZ = tz / tangentialLength;

      // CRITICAL FIX: Calculate orbital speed based on distance (Kepler's Third Law)
      // v ∝ 1/√r - closer orbits are faster
      const orbitalPeriodFactor = Math.sqrt(orbitDistance);

      // Use a moderate initial velocity that maintains stable orbits
      const baseVelocity = 0.5; // Moderate velocity for stable orbits
      const initialVelocity = baseVelocity / orbitalPeriodFactor;

      // Alternate direction based on depth for visual interest
      const direction = childDepth % 2 === 0 ? 1 : -1;

      // Calculate the final velocity
      const vx = normalizedTX * initialVelocity * direction;
      const vy = normalizedTY * initialVelocity * direction;
      const vz = normalizedTZ * initialVelocity * direction;

      return {
        ...node,
        parentId,
        x,
        y,
        z,
        vx,
        vy,
        vz,
        fx: undefined,
        fy: undefined,
        fz: undefined
      };
    }
  }

  // CRITICAL FIX: For disconnected unmapped nodes, position randomly in TRUE 3D space
  // Use a balanced approach that creates a true 3D distribution without extreme biases

  // Use a moderate distance range that doesn't overwhelm the visualization
  const distance = Math.pow(Math.random(), 1/3) * 1500; // Reduced from 3000 to 1500

  // CRITICAL FIX: Use true spherical coordinates for uniform distribution on a sphere
  // This ensures nodes are distributed evenly in all directions
  const azimuth = Math.random() * 2 * Math.PI; // Random angle in xy plane

  // Use a slightly biased elevation distribution to favor interesting 3D arrangements
  // without extreme z-bias
  const elevationBias = 0.3; // 30% bias toward poles (reduced from 70%)

  let elevation: number;

  if (Math.random() < elevationBias) {
    // Pole-biased elevation (30% of the time)
    // Use a distribution that favors the poles but not extremely
    const poleDirection = Math.random() < 0.5 ? 1 : -1; // Randomly choose north or south pole
    elevation = Math.acos(Math.random() * 0.7 * poleDirection); // Less concentrated than before
  } else {
    // Uniform distribution on sphere (70% of the time)
    elevation = Math.acos(2 * Math.random() - 1);
  }

  // Convert spherical to cartesian coordinates with balanced scaling
  const x = distance * Math.sin(elevation) * Math.cos(azimuth);
  const y = distance * Math.sin(elevation) * Math.sin(azimuth);
  const z = distance * Math.cos(elevation) * 1.5; // 1.5x z-component (reduced from 2-3x)

  // CRITICAL FIX: Add balanced random velocity for true 3D motion
  // Use a moderate velocity strength that creates interesting motion without flying away
  const velocityStrength = 0.15; // Reduced from 0.2 to 0.15 for better control

  // CRITICAL FIX: Use a balanced approach for velocity distribution
  // This creates interesting 3D motion without extreme biases

  // Calculate a random tangential velocity relative to the center
  // This creates orbital-like motion around the center

  // First, calculate normalized vector from center to node
  const centerDist = Math.sqrt(x*x + y*y + z*z);
  const nx = x / centerDist;
  const ny = y / centerDist;
  const nz = z / centerDist;

  // Create a random perpendicular vector for tangential motion
  // Use cross product with a random vector
  const rx = Math.random() - 0.5;
  const ry = Math.random() - 0.5;
  const rz = Math.random() - 0.5;

  // First tangential vector (cross product)
  let tx1 = ny * rz - nz * ry;
  let ty1 = nz * rx - nx * rz;
  let tz1 = nx * ry - ny * rx;

  // Normalize
  const tLength = Math.sqrt(tx1*tx1 + ty1*ty1 + tz1*tz1);
  tx1 /= tLength;
  ty1 /= tLength;
  tz1 /= tLength;

  // Add a small random component to create more varied motion
  const randomFactor = 0.3; // 30% random component
  const randomX = (Math.random() - 0.5) * randomFactor;
  const randomY = (Math.random() - 0.5) * randomFactor;
  const randomZ = (Math.random() - 0.5) * randomFactor * 1.5; // 1.5x stronger z-component

  // Combine tangential and random components
  const vx = tx1 * velocityStrength * (1 - randomFactor) + randomX * velocityStrength;
  const vy = ty1 * velocityStrength * (1 - randomFactor) + randomY * velocityStrength;
  const vz = tz1 * velocityStrength * (1 - randomFactor) * 1.5 + randomZ * velocityStrength; // 1.5x stronger z-component

  return {
    ...node,
    x,
    y,
    z,
    vx,
    vy,
    vz,
    fx: undefined,
    fy: undefined,
    fz: undefined
  };
}

/**
 * Calculates the size of a node based on its virtual depth and bimbaCoordinate.
 *
 * @param depth - The virtual depth of the node
 * @param bimbaCoordinate - The bimbaCoordinate of the node
 * @returns The size of the node
 */
export function calculateNodeSize(depth: number, bimbaCoordinate?: string): number {
  // Base size - significantly increased
  const baseSize = 2;

  // Root node (#) is largest - 5x bigger (reduced by 0.5x)
  if (bimbaCoordinate === '#') {
    return baseSize * 10;
  }

  // Main subsystem nodes (#0-#5) are larger - 5x bigger
  if (bimbaCoordinate && /^#[0-5]$/.test(bimbaCoordinate)) {
    return baseSize * 10;
  }

  // Second level nodes (#X-Y) are medium sized
  if (bimbaCoordinate && /^#[0-5][-.]([0-5])$/.test(bimbaCoordinate)) {
    return baseSize * 5;
  }

  // CRITICAL FIX: Size decreases with depth much more aggressively
  // Using a much lower minimum size (0.05) and steeper scaling factor (0.9)
  // This creates a more dramatic visual distinction between different depths

  // Check if this is a mapped node (has a bimbaCoordinate)
  const hasBimbaCoordinate = !!bimbaCoordinate;

  if (hasBimbaCoordinate) {
    // For mapped nodes, use a more moderate scaling
    return baseSize * Math.max(0.5, 4 - (depth - 1) * 0.7);
  } else {
    // For unmapped nodes, use a much more aggressive scaling
    // This creates a clearer parent-child visual hierarchy
    return baseSize * Math.max(0.05, 4 - (depth - 1) * 0.9);
  }
}

/**
 * Calculates the color and opacity of a node based on its type, virtual depth, and highlight status.
 *
 * @param type - The type of the node
 * @param depth - The virtual depth of the node
 * @param isHighlighted - Whether the node is highlighted
 * @param bimbaCoordinate - The bimbaCoordinate of the node
 * @returns An object with color (RGB) and opacity values
 */
export function calculateNodeColorAndOpacity(
  _type: string | undefined,
  depth: number,
  isHighlighted: boolean,
  bimbaCoordinate?: string | null,
  parentId?: string,
  nodes?: Node[]
): { color: string, opacity: number } {
  // If highlighted, return white with high opacity
  if (isHighlighted) {
    return { color: 'rgb(255, 255, 255)', opacity: 1.0 };
  }

  // Default color and opacity
  const defaultColor = 'rgb(200, 200, 200)';

  // Calculate opacity based on depth - deeper nodes are more transparent
  // Ensure depth is a number and within reasonable bounds
  const safeDepth = typeof depth === 'number' && !isNaN(depth) ? depth : 3;
  let opacity = Math.max(0.15, 0.5 - (safeDepth - 1) * 0.1);

  // Root node (#) - white with high opacity
  if (bimbaCoordinate === '#') {
    return { color: 'rgb(255, 255, 255)', opacity: 0.9 }; // Increased opacity for better visibility
  }

  // Main subsystem nodes (#0-#5) - vibrant colors with high opacity
  if (bimbaCoordinate && typeof bimbaCoordinate === 'string' && /^#[0-5]$/.test(bimbaCoordinate)) {
    const subsystem = parseInt(bimbaCoordinate.charAt(1), 10);
    opacity = 0.9; // Increased opacity for better visibility of main subsystem nodes

    switch (subsystem) {
      case 0: return { color: 'rgb(255, 255, 255)', opacity }; // Anuttara - White
      case 1: return { color: 'rgb(30, 120, 255)', opacity };  // Paramasiva - Vibrant Blue
      case 2: return { color: 'rgb(255, 30, 120)', opacity };  // Parashakti - Vibrant Red
      case 3: return { color: 'rgb(255, 220, 30)', opacity };  // Mahamaya - Vibrant Yellow
      case 4: return { color: 'rgb(30, 220, 120)', opacity };  // Nara - Vibrant Green
      case 5: return { color: 'rgb(220, 30, 255)', opacity };  // Epii - Vibrant Purple
      default: return { color: defaultColor, opacity };
    }
  }

  // Subsystem children - extract subsystem from coordinate
  if (bimbaCoordinate && typeof bimbaCoordinate === 'string') {
    // Safely use regex match
    let subsystem: number | null = null;
    const matchResult = bimbaCoordinate.match(/^#([0-5])/);
    if (matchResult && matchResult[1]) {
      subsystem = parseInt(matchResult[1], 10);
    }

    if (subsystem !== null) {
      // Calculate opacity based on depth - deeper nodes are more transparent
      opacity = Math.max(0.2, 0.6 - (safeDepth - 1) * 0.1);

      // Color intensity based on depth - deeper nodes have lighter colors
      const colorIntensity = Math.max(0.3, 1.0 - (safeDepth - 2) * 0.15);

      // Apply color intensity to RGB values
      switch (subsystem) {
        case 0: // Anuttara - White
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
        case 1: // Paramasiva - Blue
          return {
            color: `rgb(${Math.round(120 * colorIntensity)}, ${Math.round(170 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
        case 2: // Parashakti - Red
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(120 * colorIntensity)}, ${Math.round(170 * colorIntensity)})`,
            opacity
          };
        case 3: // Mahamaya - Yellow
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(230 * colorIntensity)}, ${Math.round(120 * colorIntensity)})`,
            opacity
          };
        case 4: // Nara - Green
          return {
            color: `rgb(${Math.round(120 * colorIntensity)}, ${Math.round(230 * colorIntensity)}, ${Math.round(170 * colorIntensity)})`,
            opacity
          };
        case 5: // Epii - Purple
          return {
            color: `rgb(${Math.round(230 * colorIntensity)}, ${Math.round(120 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
        default:
          return { color: defaultColor, opacity };
      }
    }
  }

  // Unmapped nodes - determine color based on ancestry
  if (!bimbaCoordinate && nodes && nodes.length > 0) {
    // Function to find the subsystem ancestor of a node
    const findSubsystemAncestor = (nodeId: string, visited = new Set<string>()): { subsystem: number | null, depth: number } => {
      // Prevent infinite recursion
      if (visited.has(nodeId)) return { subsystem: null, depth: 0 };
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (!node) return { subsystem: null, depth: 0 };

      // If node has a bimbaCoordinate, extract the subsystem
      if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string') {
        const matchResult = node.bimbaCoordinate.match(/^#([0-5])/);
        if (matchResult && matchResult[1]) {
          const subsystem = parseInt(matchResult[1], 10);
          return { subsystem, depth: 0 };
        }
      }

      // If node has a parent, check the parent
      if (node.parentId) {
        const ancestorResult = findSubsystemAncestor(node.parentId, visited);
        if (ancestorResult.subsystem !== null) {
          return { subsystem: ancestorResult.subsystem, depth: ancestorResult.depth + 1 };
        }
      }

      // If no subsystem found through parent, check connected nodes
      if (nodes) {
        for (const otherNode of nodes) {
          // Skip self
          if (otherNode.id === nodeId) continue;

          // Check if this node is connected to the current node
          const isConnected = otherNode.parentId === nodeId || node.parentId === otherNode.id;

          if (isConnected && !visited.has(otherNode.id)) {
            const ancestorResult = findSubsystemAncestor(otherNode.id, visited);
            if (ancestorResult.subsystem !== null) {
              return { subsystem: ancestorResult.subsystem, depth: ancestorResult.depth + 1 };
            }
          }
        }
      }

      return { subsystem: null, depth: 0 };
    };

    // Find the subsystem ancestor
    const { subsystem, depth: ancestorDepth } = findSubsystemAncestor(parentId || '');

    if (subsystem !== null) {
      // Calculate total depth (ancestor depth + current depth)
      const totalDepth = ancestorDepth + safeDepth;

      // Calculate opacity based on total depth - deeper nodes are more transparent
      // Increased minimum opacity for better visibility
      const opacity = Math.max(0.4, 0.6 - (totalDepth - 1) * 0.05); // Increased minimum from 0.2 to 0.4, reduced decay rate

      // Color intensity based on total depth - deeper nodes have lighter colors
      const colorIntensity = Math.max(0.3, 0.9 - (totalDepth - 1) * 0.1);

      // Apply color intensity to RGB values - inherit from ancestor's subsystem
      switch (subsystem) {
        case 0: // Anuttara - White
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
        case 1: // Paramasiva - Blue
          return {
            color: `rgb(${Math.round(120 * colorIntensity)}, ${Math.round(170 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
        case 2: // Parashakti - Red
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(120 * colorIntensity)}, ${Math.round(170 * colorIntensity)})`,
            opacity
          };
        case 3: // Mahamaya - Yellow
          return {
            color: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(230 * colorIntensity)}, ${Math.round(120 * colorIntensity)})`,
            opacity
          };
        case 4: // Nara - Green
          return {
            color: `rgb(${Math.round(120 * colorIntensity)}, ${Math.round(230 * colorIntensity)}, ${Math.round(170 * colorIntensity)})`,
            opacity
          };
        case 5: // Epii - Purple
          return {
            color: `rgb(${Math.round(230 * colorIntensity)}, ${Math.round(120 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
            opacity
          };
      }
    }

    // If no subsystem ancestor found, try to use parent's color directly
    if (parentId) {
      const parentNode = nodes.find(n => n.id === parentId);
      if (parentNode && parentNode.color && typeof parentNode.color === 'string') {
        // Parse the parent's color
        let r = 200, g = 200, b = 200;

        // Try to parse RGB or RGBA
        const rgbMatch = parentNode.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/) ||
                         parentNode.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);

        if (rgbMatch) {
          r = parseInt(rgbMatch[1], 10);
          g = parseInt(rgbMatch[2], 10);
          b = parseInt(rgbMatch[3], 10);
        }

        // Calculate a lighter version based on depth
        const lightnessFactor = Math.min(0.9, 0.6 + (safeDepth - 1) * 0.1);
        r = Math.min(255, Math.round(r + (255 - r) * lightnessFactor));
        g = Math.min(255, Math.round(g + (255 - g) * lightnessFactor));
        b = Math.min(255, Math.round(b + (255 - b) * lightnessFactor));

        // Calculate opacity based on depth
        // Increased minimum opacity for better visibility
        const opacity = Math.max(0.4, 0.5 - (safeDepth - 1) * 0.05); // Increased minimum from 0.2 to 0.4, reduced decay rate

        return { color: `rgb(${r}, ${g}, ${b})`, opacity };
      }
    }
  }

  // Fallback for nodes without a parent or if parent color couldn't be determined
  // Use a consistent color scheme based on depth
  // This creates a subtle gradient that helps visualize the hierarchy

  // Base colors for different depth levels
  const depthColors = [
    'rgb(200, 200, 200)', // Level 0 - Light gray
    'rgb(220, 220, 240)', // Level 1 - Light blue-gray
    'rgb(220, 240, 220)', // Level 2 - Light green-gray
    'rgb(240, 220, 220)', // Level 3 - Light red-gray
    'rgb(240, 240, 220)', // Level 4 - Light yellow-gray
    'rgb(220, 220, 220)', // Level 5 - Light gray
    'rgb(200, 200, 200)'  // Level 6+ - Gray
  ];

  // Use depth to select a color, with a fallback
  // For very deep nodes, cycle back through the colors but with reduced intensity
  const baseColorIndex = Math.min(depthColors.length - 1, Math.max(0, safeDepth % depthColors.length));
  const unmappedColor = depthColors[baseColorIndex];

  // Calculate opacity based on depth - deeper nodes are more transparent
  // Use an exponential decay function with a higher minimum and less aggressive decay
  // This ensures that even deep unmapped nodes remain clearly visible
  const baseOpacity = 0.8;
  const opacityDecayFactor = 0.9; // Increased from 0.85 to 0.9 for less aggressive decay
  const unmappedOpacity = Math.max(0.4, baseOpacity * Math.pow(opacityDecayFactor, safeDepth - 1)); // Increased minimum from 0.2 to 0.4

  return { color: unmappedColor, opacity: unmappedOpacity };
}

/**
 * Calculates the color of a node based on its type, virtual depth, and highlight status.
 * This is a compatibility function that returns an RGBA string.
 *
 * @param type - The type of the node
 * @param depth - The virtual depth of the node
 * @param isHighlighted - Whether the node is highlighted
 * @param bimbaCoordinate - The bimbaCoordinate of the node
 * @returns The color of the node as an RGBA string
 */
export function calculateNodeColor(
  type: string | undefined,
  depth: number,
  isHighlighted: boolean,
  bimbaCoordinate?: string | null,
  parentId?: string,
  nodes?: Node[]
): string {
  const { color, opacity } = calculateNodeColorAndOpacity(type, depth, isHighlighted, bimbaCoordinate, parentId, nodes);

  // Ensure proper conversion from RGB to RGBA
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  } else if (color.startsWith('#')) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (color.startsWith('rgba(')) {
    // Already rgba, just update the opacity
    return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${opacity})`);
  }

  // Fallback
  return `rgba(200, 200, 200, ${opacity})`;
}

/**
 * Calculates the width of an edge based on its type.
 *
 * @param type - The type of the edge
 * @returns The width of the edge
 */
export function calculateEdgeWidth(type?: string): number {
  switch (type) {
    case 'DEVELOPS_INTO':
    case 'CONTAINS':
    case 'RETURNS_TO':
      return 0.5; // Core relationships
    default:
      return 0.2; // Other relationships
  }
}

// Global pulsation factor that will be updated by the animation loop
let pulseFactor = 1.0;

/**
 * Updates the global pulsation factor
 *
 * @param factor - The new pulsation factor (0.7 to 1.0)
 */
export function updatePulseFactor(factor: number): void {
  pulseFactor = factor;
}

/**
 * Gets the current pulsation factor
 *
 * @returns The current pulsation factor
 */
export function getPulseFactor(): number {
  return pulseFactor;
}

/**
 * Applies pulsation to a color string (RGB or RGBA)
 *
 * @param color - The original color string (RGB or RGBA)
 * @param pulseFactor - The pulsation factor to apply (default: global pulseFactor)
 * @returns The pulsated RGBA color string
 */
export function applyPulsationToColor(color: string, customPulseFactor?: number): string {
  // Use custom pulsation factor if provided, otherwise use global
  const factor = customPulseFactor !== undefined ? customPulseFactor : pulseFactor;

  // Parse the color string
  let r = 255, g = 255, b = 255, baseOpacity = 0.5;

  // Check if it's an RGBA color
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (rgbaMatch) {
    r = parseInt(rgbaMatch[1], 10);
    g = parseInt(rgbaMatch[2], 10);
    b = parseInt(rgbaMatch[3], 10);
    baseOpacity = parseFloat(rgbaMatch[4]);
  } else {
    // Check if it's an RGB color
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
    } else {
      // Check if it's a hex color
      const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
      if (hexMatch) {
        r = parseInt(hexMatch[1], 16);
        g = parseInt(hexMatch[2], 16);
        b = parseInt(hexMatch[3], 16);
      } else {
        // Return original color if we can't parse it
        return color;
      }
    }
  }

  // Apply pulsation factor to opacity
  const opacity = Math.min(1.0, Math.max(0.1, baseOpacity * factor));

  // Return the new RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Calculates the base color and opacity of an edge based on its type (without pulsation).
 *
 * @param type - The type of the edge
 * @returns An object with color (RGB) and opacity values
 */
export function calculateEdgeColorAndOpacity(type?: string): { color: string, opacity: number } {
  switch (type) {
    case 'DEVELOPS_INTO':
      return { color: 'rgb(255, 255, 255)', opacity: 0.5 }; // White for hexagon structure
    case 'CONTAINS':
      return { color: 'rgb(0, 200, 255)', opacity: 0.4 }; // Cyan for containment
    case 'RETURNS_TO':
      return { color: 'rgb(255, 100, 0)', opacity: 0.4 }; // Orange for return
    case 'HAS_INTERNAL_COMPONENT':
      return { color: 'rgb(200, 200, 200)', opacity: 0.3 }; // Light gray for internal components
    case 'INFLUENCES':
      return { color: 'rgb(255, 200, 100)', opacity: 0.3 }; // INFLUENCES type
    default:
      return { color: 'rgb(150, 150, 150)', opacity: 0.3 }; // Default gray
  }
}

/**
 * Calculates the base color of an edge based on its type (without pulsation).
 * This is a compatibility function that returns an RGBA string.
 *
 * @param type - The type of the edge
 * @returns The color of the edge as an RGBA string
 */
export function calculateEdgeColor(type?: string): string {
  const { color, opacity } = calculateEdgeColorAndOpacity(type);
  // Convert RGB to RGBA
  return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
}

/**
 * Calculates the position of a node in a 3D diamond layout based on its bimbaCoordinate.
 *
 * This creates a diamond/octahedron shape where:
 * - The root node (#) is at the center
 * - Nodes #1-#4 form a square on the x-y plane
 * - Node #0 is below the center on the z-axis
 * - Node #5 is above the center on the z-axis
 *
 * For child nodes, they are positioned relative to their parent node,
 * maintaining the diamond structure but at a smaller scale.
 *
 * @param coordinate - The bimbaCoordinate of the node
 * @returns The position of the node in the 3D diamond layout
 */
export function calculate3DDiamondPosition(coordinate: string | undefined | null): { x: number, y: number, z: number } | null {
  if (!coordinate) return null;

  // Root node at center
  if (coordinate === '#') {
    return { x: 0, y: 0, z: 0 };
  }

  // Base distance for the first level
  const baseDistance = 1200;

  // Scaling factor for each level deeper
  const distanceScaleFactor = 0.3;

  // Remove the '#' prefix and split into segments
  const cleanCoordinate = coordinate.substring(1);
  const segments = cleanCoordinate.split(/[-.]/);

  // Start from the center
  let x = 0;
  let y = 0;
  let z = 0;

  // Current distance for this level
  let currentDistance = baseDistance;

  // Process the first segment (main subsystem)
  if (segments.length > 0) {
    const mainSubsystem = parseInt(segments[0], 10);

    // Calculate the square side length to ensure nodes #1-#4 form a perfect square
    // centered on the parent node
    const squareSideLength = currentDistance * Math.sqrt(2);

    switch(mainSubsystem) {
      case 0: // Anuttara - below center
        z = -currentDistance;
        break;
      case 1: // Paramasiva - front-right
        x = squareSideLength / 2;
        y = squareSideLength / 2;
        break;
      case 2: // Parashakti - front-left
        x = -squareSideLength / 2;
        y = squareSideLength / 2;
        break;
      case 3: // Mahamaya - back-left
        x = -squareSideLength / 2;
        y = -squareSideLength / 2;
        break;
      case 4: // Nara - back-right
        x = squareSideLength / 2;
        y = -squareSideLength / 2;
        break;
      case 5: // Epii - above center
        z = currentDistance;
        break;
    }

    // Reduce distance for next level
    currentDistance *= distanceScaleFactor;
  }

  // Process deeper segments
  for (let i = 1; i < segments.length; i++) {
    const segmentValue = parseInt(segments[i], 10);

    // Calculate position relative to current position
    // This maintains the diamond shape for deeper nodes
    // Calculate the square side length for this level
    const squareSideLength = currentDistance * Math.sqrt(2);

    switch(segmentValue % 6) {
      case 0: // Below
        z -= currentDistance;
        break;
      case 1: // Front-right
        x += squareSideLength / 2;
        y += squareSideLength / 2;
        break;
      case 2: // Front-left
        x -= squareSideLength / 2;
        y += squareSideLength / 2;
        break;
      case 3: // Back-left
        x -= squareSideLength / 2;
        y -= squareSideLength / 2;
        break;
      case 4: // Back-right
        x += squareSideLength / 2;
        y -= squareSideLength / 2;
        break;
      case 5: // Above
        z += currentDistance;
        break;
    }

    // Reduce distance for next level
    currentDistance *= distanceScaleFactor;
  }

  return { x, y, z };
}

/**
 * Interface for active node data
 */
export interface ActiveNodeData extends Node {
  details: {
    properties: {
      name?: string;
      type?: string;
      description?: string;
      content?: string;
      function?: string;
      bimbaCoordinate?: string;
      notionPageId?: string;
      [key: string]: unknown;
    };
    connections: Array<{
      type: string;
      direction: 'in' | 'out';
      nodes: Array<{ name: string; bimbaCoordinate?: string }>;
    }>;
  } | null;
  connections: string[];
  highlightedLinks: Edge[];
  error?: string;
  isLoading?: boolean;
}

/**
 * Prepares the data for the active node to be displayed in the NodeDetailsPanel.
 *
 * @param activeNodeId - The ID of the active node
 * @param nodes - The graph nodes
 * @param edges - The graph edges
 * @param highlightedNodes - The set of highlighted node IDs
 * @param highlightedLinks - The set of highlighted link IDs
 * @returns The active node data
 */


export function getActiveNodeData(
  activeNodeId: string,
  nodes: Node[],
  edges: Edge[],
  highlightedLinks: Set<string>
): ActiveNodeData {
  const activeNode = nodes.find(node => node.id === activeNodeId);
  if (!activeNode) {
    return {
      id: activeNodeId,
      label: 'Unknown Node',
      type: 'document',
      x: 0,
      y: 0,
      details: null,
      connections: [],
      highlightedLinks: [],
      isLoading: true
    };
  }

  // Get connected nodes
  const connections = edges
    .filter(edge => {
      // Handle null or undefined source/target
      if (!edge.source || !edge.target) return false;

      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

      // Skip if source or target ID is missing
      if (!sourceId || !targetId) return false;

      return sourceId === activeNodeId || targetId === activeNodeId;
    })
    .map(edge => {
      // These are safe now because we filtered out null/undefined values
      const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string}).id : edge.source as string;
      const targetId = typeof edge.target === 'object' ? (edge.target as {id: string}).id : edge.target as string;
      return sourceId === activeNodeId ? targetId : sourceId;
    });

  // Get highlighted links
  const highlightedEdges = edges.filter(edge => {
    // Handle null or undefined source/target
    if (!edge.source || !edge.target) return false;

    // Generate edge ID
    const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string}).id : edge.source as string;
    const targetId = typeof edge.target === 'object' ? (edge.target as {id: string}).id : edge.target as string;
    const edgeId = edge.id || `${sourceId}-${targetId}`;

    return highlightedLinks.has(edgeId);
  });

  return {
    ...activeNode,
    details: null, // Will be fetched separately
    connections,
    highlightedLinks: highlightedEdges,
    isLoading: true
  };
}
