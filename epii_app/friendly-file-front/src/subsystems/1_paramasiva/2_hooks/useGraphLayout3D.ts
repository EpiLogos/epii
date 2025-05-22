/**
 * useGraphLayout3D Hook
 *
 * This hook is responsible for calculating the layout of the 3D graph.
 * It positions nodes based on their bimbaCoordinate or parent-child relationships.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../../../components/meta/metaData';
import { calculate3DDiamondPosition } from '../1_utils/calculate3DDiamondPosition';

/**
 * Hook for calculating the layout of the 3D graph
 * @param nodes The graph nodes
 * @param edges The graph edges
 * @param parentChildMap The map of parent-child relationships
 * @param virtualDepths The map of node IDs to virtual depths
 * @returns The positioned nodes and edges
 */
export function useGraphLayout3D(
  nodes: Node[],
  edges: Edge[],
  parentChildMap: Map<string, string[]>,
  virtualDepths: Map<string, number>
) {
  // Calculate node positions
  const positionedNodes = useMemo(() => {
    // Create a node map for quick lookups
    const nodeMap = new Map<string, Node>();
    nodes.forEach(node => {
      nodeMap.set(node.id, node);
    });

    return nodes.map(node => {
      // Skip if node is already positioned
      if (node.x !== undefined && node.y !== undefined && node.z !== undefined) {
        return node;
      }

      // Position mapped nodes using diamond layout
      if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string') {
        const position = calculate3DDiamondPosition(node.bimbaCoordinate);
        if (position) {
          // Root node (#) should be fixed exactly at center
          if (node.bimbaCoordinate === '#') {
            return {
              ...node,
              x: position.x,
              y: position.y,
              z: position.z,
              fx: position.x,
              fy: position.y,
              fz: position.z
            };
          }

          // For main subsystem nodes (#0-#5), fix positions but allow slight wiggle room
          if (typeof node.bimbaCoordinate === 'string' && /^#[0-5]$/.test(node.bimbaCoordinate)) {
            return {
              ...node,
              x: position.x,
              y: position.y,
              z: position.z,
              fx: position.x,
              fy: position.y,
              fz: position.z
            };
          }

          // For other mapped nodes, set position but allow more movement
          return {
            ...node,
            x: position.x,
            y: position.y,
            z: position.z,
            fx: position.x,
            fy: position.y,
            fz: position.z
          };
        }
      }

      // Position unmapped nodes based on their parent
      let parentId: string | undefined;
      for (const [parent, children] of parentChildMap.entries()) {
        if (children.includes(node.id)) {
          parentId = parent;
          break;
        }
      }

      if (parentId) {
        const parentNode = nodeMap.get(parentId);
        if (parentNode && parentNode.x !== undefined && parentNode.y !== undefined && parentNode.z !== undefined) {
          // Get child's virtual depth - first from node.virtualDepth, then from virtualDepths map
          const childDepth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);

          // Get parent's virtual depth
          const parentDepth = parentNode.virtualDepth !== undefined ? parentNode.virtualDepth :
                             (parentNode.bimbaCoordinate === '#' ? 0 :
                             (parentNode.bimbaCoordinate?.match(/-|\./g)?.length || 0) + 1);

          // Calculate relative depth (should be 1 for direct children)
          const relativeDepth = childDepth - parentDepth;

          // Calculate distance based on depth - deeper nodes orbit further out
          // Use different distances for z-axis subsystems (#0 and #5) vs. xy-plane subsystems (#1-#4)
          let baseDistance = 150; // Default base distance

          // Special handling for z-axis subsystems (#0 and #5)
          if (parentNode.bimbaCoordinate === '#0' || parentNode.bimbaCoordinate === '#5') {
            baseDistance = 200; // Larger distance for z-axis subsystems
          }

          // Scale distance based on relative depth
          const distance = baseDistance * Math.pow(0.8, relativeDepth - 1);

          // Calculate random position around parent
          const azimuth = Math.random() * 2 * Math.PI;
          const elevation = Math.acos(2 * Math.random() - 1);

          // Convert spherical to cartesian coordinates
          const x = parentNode.x + distance * Math.sin(elevation) * Math.cos(azimuth);
          const y = parentNode.y + distance * Math.sin(elevation) * Math.sin(azimuth);
          const z = parentNode.z + distance * Math.cos(elevation);

          return {
            ...node,
            x,
            y,
            z,
            parentId,
            virtualDepth: childDepth // Ensure virtualDepth is set on the node
          };
        }
      }

      // Position disconnected nodes randomly
      const distance = 500 + Math.random() * 500;
      const azimuth = Math.random() * 2 * Math.PI;
      const elevation = Math.acos(2 * Math.random() - 1);

      // Convert spherical to cartesian coordinates
      const x = distance * Math.sin(elevation) * Math.cos(azimuth);
      const y = distance * Math.sin(elevation) * Math.sin(azimuth);
      const z = distance * Math.cos(elevation);

      return {
        ...node,
        x,
        y,
        z
      };
    });
  }, [nodes, parentChildMap, virtualDepths]);

  return { positionedNodes, edges };
}
