/**
 * useGraphLayout Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-2 (Bimba Vis / Geom Ground - Hooks)
 *
 * This hook is responsible for calculating node positions.
 * It applies hexagonal positioning to mapped nodes and orbital positioning to unmapped nodes.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../../../components/meta/metaData';
import { calculateHexagonalPosition, calculateOrbitalPosition2D } from '../1_utils/geometryUtils';

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

      // For unmapped nodes, find parent
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
          // Get child's virtual depth
          const childDepth = virtualDepths.get(node.id) || 3;

          // Get parent's children
          const siblings = parentChildMap.get(parentId) || [];

          // Apply orbital positioning
          return calculateOrbitalPosition2D(
            node,
            parentId,
            parentNode,
            childDepth,
            siblings
          );
        }
      }

      // Default position for disconnected nodes
      const distance = 500 + Math.random() * 500;
      const angle = Math.random() * 2 * Math.PI;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);

      return {
        ...node,
        x,
        y,
        fx: undefined,
        fy: undefined
      };
    });
  }, [nodes, parentChildMap, virtualDepths, nodeMap]);

  return { positionedNodes, edges };
}
