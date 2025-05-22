/**
 * useGraphLayout Hook
 *
 * This hook is responsible for calculating node positions.
 * It applies hexagonal positioning to mapped nodes and orbital positioning to unmapped nodes.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../components/meta/metaData';
import { calculateHexagonalPosition, calculateOrbitalPosition } from '../utils/graphUtils';

/**
 * Hook for calculating node positions
 * @param nodes - The processed graph nodes
 * @param edges - The graph edges
 * @param parentChildMap - The map of parent-child relationships
 * @param virtualDepths - The map of node IDs to virtual depths
 * @returns The positioned nodes and edges
 */
export function useGraphLayout(
  nodes: Node[],
  edges: Edge[],
  parentChildMap: Map<string, string[]>,
  virtualDepths: Map<string, number>
) {
  // Create a node map for quick lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  // Calculate positions for all nodes
  const positionedNodes = useMemo(() => {
    return nodes.map(node => {
      if (node.bimbaCoordinate) {
        // Apply hexagonal positioning to mapped nodes
        const position = calculateHexagonalPosition(node.bimbaCoordinate);
        if (position) {
          return {
            ...node,
            x: position.x,
            y: position.y,
            z: position.z || 0,
            fx: position.x,
            fy: position.y,
            fz: position.z || 0
          };
        }
      }

      // Apply orbital positioning to unmapped nodes
      return calculateOrbitalPosition(node, parentChildMap, virtualDepths, nodeMap);
    });
  }, [nodes, parentChildMap, virtualDepths, nodeMap]);

  return { positionedNodes, edges };
}
