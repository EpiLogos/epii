/**
 * useNodeStyling Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-3-2 (Symbolic Transform Matrix - Hooks)
 *
 * This hook is responsible for styling nodes in the 2D visualization.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../../../components/meta/metaData';
import { calculateNodeColor, calculateNodeSize } from '../1_utils/nodeStyleUtils';

/**
 * Hook for styling nodes in the 2D visualization
 * @param nodes - The positioned graph nodes
 * @param edges - The graph edges
 * @param virtualDepths - The map of node IDs to virtual depths
 * @param highlightedNodes - The set of highlighted node IDs
 * @returns The styled nodes and edges
 */
export function useNodeStyling(
  nodes: Node[],
  edges: Edge[],
  virtualDepths: Map<string, number>,
  highlightedNodes: Set<string> = new Set()
) {
  // Apply styling to nodes
  const styledNodes = useMemo(() => {
    return nodes.map(node => {
      // Get virtual depth - first from node.virtualDepth, then from virtualDepths map
      const virtualDepth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);

      // Virtual depth is used for styling calculations

      // Check if node is highlighted
      const isHighlighted = highlightedNodes.has(node.id);

      // Calculate node color
      const color = calculateNodeColor(node.type, virtualDepth, isHighlighted, node.bimbaCoordinate);

      // Calculate node size
      const val = calculateNodeSize(virtualDepth, node.bimbaCoordinate);

      return {
        ...node,
        color,
        val
      };
    });
  }, [nodes, virtualDepths, highlightedNodes]);

  // Apply styling to edges
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      // Default color
      let color = 'rgba(200, 200, 200, 0.5)';

      // Core relationships are more prominent
      if (edge.type === 'DEVELOPS_INTO' || edge.type === 'CONTAINS' || edge.type === 'RETURNS_TO') {
        color = 'rgba(255, 255, 255, 0.8)';
      }

      return {
        ...edge,
        color
      };
    });
  }, [edges]);

  return { styledNodes, styledEdges };
}
