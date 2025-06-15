/**
 * Geometry Utilities for 2D Visualization
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-1 (Bimba Vis / Geom Ground - Utils)
 *
 * This file contains utility functions for 2D geometry calculations.
 */

import { Node, Edge } from "../../../shared/components/meta/metaData";

/**
 * Calculates the position of a node in the hexagonal layout based on its bimbaCoordinate.
 *
 * @param coordinate - The bimbaCoordinate of the node
 * @returns The position of the node in the hexagonal layout
 */
export function calculateHexagonalPosition(coordinate: string | undefined | null): { x: number, y: number, z?: number } | null {
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
 * @param parentId - The ID of the parent node
 * @param parentNode - The parent node
 * @param childDepth - The virtual depth of the child node
 * @param siblings - Array of sibling node IDs
 * @returns The node with updated position
 */
export function calculateOrbitalPosition2D(
  node: Node,
  parentId: string,
  parentNode: Node,
  childDepth: number,
  siblings: string[]
): Node {
  // Get parent position
  const parentX = parentNode.x || 0;
  const parentY = parentNode.y || 0;

  // Base distance for orbital positioning
  const baseDistance = 150;

  // Scale distance based on depth
  const distance = baseDistance * Math.pow(1.2, childDepth - 2);

  // Calculate angle based on position among siblings
  const siblingIndex = siblings.indexOf(node.id);
  const totalSiblings = siblings.length;
  const angle = (siblingIndex / totalSiblings) * 2 * Math.PI;

  // Calculate position
  const x = parentX + distance * Math.cos(angle);
  const y = parentY + distance * Math.sin(angle);

  // Calculate velocity for orbital motion
  const orbitalSpeed = 0.5 / Math.sqrt(distance);
  const direction = childDepth % 2 === 0 ? 1 : -1;
  const vx = -Math.sin(angle) * orbitalSpeed * direction;
  const vy = Math.cos(angle) * orbitalSpeed * direction;

  return {
    ...node,
    parentId,
    x,
    y,
    vx,
    vy,
    fx: undefined,
    fy: undefined
  };
}

/**
 * Creates a hexagon path for a node.
 *
 * @param size - The size of the hexagon
 * @returns The SVG path for the hexagon
 */
export function createHexagonPath(size: number): string {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M${points.join('L')}Z`;
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
  highlightedNodes: Set<string>,
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
