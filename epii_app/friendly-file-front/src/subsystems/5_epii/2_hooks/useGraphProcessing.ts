/**
 * useGraphProcessing Hook
 *
 * This hook is responsible for processing the raw graph data into a format suitable for visualization.
 * It calculates parent-child relationships and virtual depths for all nodes.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../components/meta/metaData';
import { buildParentChildMap, calculateVirtualDepths } from '../utils/graphUtils';

/**
 * Hook for processing graph data
 * @param nodes - The raw graph nodes
 * @param edges - The raw graph edges
 * @returns The processed nodes, edges, parent-child map, and virtual depths
 */
export function useGraphProcessing(nodes: Node[], edges: Edge[]) {
  // Calculate parent-child relationships
  const parentChildMap = useMemo(() => buildParentChildMap(nodes, edges), [nodes, edges]);

  // Calculate virtual depths for all nodes
  const virtualDepths = useMemo(() => calculateVirtualDepths(nodes, parentChildMap), [nodes, parentChildMap]);

  // Apply virtual depths and parent-child relationships to nodes
  const processedNodes = useMemo(() => {
    // Create a map for quick node lookups
    const nodeMap = new Map<string, Node>();
    nodes.forEach(node => {
      nodeMap.set(node.id, node);
    });

    return nodes.map(node => {
      // Find parent for unmapped nodes
      let parentId: string | undefined;
      if (!node.bimbaCoordinate) {
        for (const [parent, children] of parentChildMap.entries()) {
          if (children.includes(node.id)) {
            parentId = parent;
            break;
          }
        }
      }

      return {
        ...node,
        virtualDepth: virtualDepths.get(node.id) || 3,
        parentId: parentId,
      };
    });
  }, [nodes, virtualDepths, parentChildMap]);

  return { processedNodes, edges, parentChildMap, virtualDepths };
}
