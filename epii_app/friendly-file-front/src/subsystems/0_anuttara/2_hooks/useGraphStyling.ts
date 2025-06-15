/**
 * useGraphStyling Hook
 *
 * This hook is responsible for calculating node and edge styles based on virtual depth and other properties.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../components/meta/metaData";
import { calculateNodeSize, calculateNodeColor, calculateEdgeWidth, calculateEdgeColor } from '../subsystems/0_anuttara/1_utils/graphUtils';

/**
 * Hook for calculating node and edge styles
 * @param nodes - The positioned graph nodes
 * @param edges - The graph edges
 * @param virtualDepths - The map of node IDs to virtual depths
 * @returns The styled nodes and edges
 */
export function useGraphStyling(
  nodes: Node[],
  edges: Edge[],
  virtualDepths: Map<string, number>
) {
  // Calculate styles for all nodes
  const styledNodes = useMemo(() => {
    // First, create a map of node IDs to their parent nodes
    const nodeParentMap = new Map<string, string>();
    const nodeMap = new Map<string, Node>();

    // Build node map for quick lookups
    nodes.forEach(node => {
      nodeMap.set(node.id, node);
    });

    // Find parent for each node
    nodes.forEach(node => {
      if (node.parentId) {
        nodeParentMap.set(node.id, node.parentId);
      }
    });

    // Process nodes in multiple passes to ensure parent styling cascades down
    // First, style nodes with bimbaCoordinates
    const styledNodeMap = new Map<string, Node>();

    // First pass: style nodes with bimbaCoordinates
    nodes.forEach(node => {
      if (node.bimbaCoordinate) {
        const depth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);
        const val = calculateNodeSize(depth, node.bimbaCoordinate);
        const color = calculateNodeColor(node.type, depth, false, node.bimbaCoordinate);

        styledNodeMap.set(node.id, {
          ...node,
          val,
          color,
          __styled: true // Mark as styled
        });
      }
    });

    // Second pass: style unmapped nodes based on their parent's subsystem
    let changed = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      nodes.forEach(node => {
        // Skip already styled nodes
        if (styledNodeMap.has(node.id)) return;

        // Find parent
        const parentId = node.parentId;
        if (parentId && styledNodeMap.has(parentId)) {
          // Get parent node
          const parentNode = styledNodeMap.get(parentId)!;

          // Get node's depth
          const depth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);

          // Calculate size based on depth
          const val = calculateNodeSize(depth, node.bimbaCoordinate);

          // Calculate color using the shared utility function
          // Pass the parent's ID to inherit color from parent
          const color = calculateNodeColor(node.type, depth, false, node.bimbaCoordinate, parentId, nodes);

          // Extract subsystem from parent's bimbaCoordinate for metadata
          let subsystem: number | undefined;

          if (parentNode.bimbaCoordinate) {
            const match = parentNode.bimbaCoordinate.match(/^#([0-5])/);
            if (match) {
              subsystem = parseInt(match[1], 10);
            }
          }

          styledNodeMap.set(node.id, {
            ...node,
            val,
            color,
            __styled: true,
            __parentSubsystem: subsystem
          });

          changed = true;
        }
      });
    }

    // Final pass: style any remaining nodes with default styling
    nodes.forEach(node => {
      if (!styledNodeMap.has(node.id)) {
        const depth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);
        const val = calculateNodeSize(depth, node.bimbaCoordinate);
        // Calculate color using the shared utility function
        const color = calculateNodeColor(node.type, depth, false, node.bimbaCoordinate);

        styledNodeMap.set(node.id, {
          ...node,
          val,
          color
        });
      }
    });

    // Convert map back to array
    return Array.from(styledNodeMap.values());
  }, [nodes, virtualDepths]);

  // Calculate styles for all edges
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      // Calculate edge style based on type
      const width = calculateEdgeWidth(edge.type);
      const color = calculateEdgeColor(edge.type);

      return {
        ...edge,
        width,
        color
      };
    });
  }, [edges]);

  return { styledNodes, styledEdges };
}
