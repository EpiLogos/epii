/**
 * useGraphProcessing Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-3 (Bimba Vis / Geom Ground - Visualization)
 *
 * This hook is responsible for processing the raw graph data into a format suitable for visualization.
 * It calculates parent-child relationships and virtual depths for all nodes.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../../../components/meta/metaData';
import { buildParentChildMap, calculateVirtualDepths } from '../1_utils/depthCalculation';

/**
 * Hook for processing graph data
 * @param nodes - The raw graph nodes
 * @param edges - The raw graph edges
 * @returns The processed nodes, edges, parent-child map, and virtual depths
 */
export function useGraphProcessing(nodes: Node[], edges: Edge[]) {
  // Ensure a root node exists
  const nodesWithRoot = useMemo(() => {
    // Check if a root node with bimbaCoordinate "#" exists
    const rootNodeExists = nodes.some(node => node.bimbaCoordinate === '#');

    // If no root node exists, create one
    if (!rootNodeExists && nodes.length > 0) {
      console.log('Creating root node with bimbaCoordinate "#" in useGraphProcessing');

      // Create a new root node
      const rootNode = {
        id: 'root-node',
        bimbaCoordinate: '#',
        name: 'Root',
        label: 'Root',
        labels: ['Root']
      };

      // Add the root node to the beginning of the array
      return [rootNode, ...nodes];
    }

    return nodes;
  }, [nodes]);

  // Calculate parent-child relationships only if we have nodes
  const parentChildMap = useMemo(() => {
    // Only build the parent-child map if we have nodes
    if (nodesWithRoot.length === 0) {
      return new Map<string, string[]>();
    }
    return buildParentChildMap(nodesWithRoot, edges);
  }, [nodesWithRoot, edges]);

  // Calculate virtual depths for all nodes only if we have nodes and a parent-child map
  const virtualDepths = useMemo(() => {
    // Only calculate virtual depths if we have nodes
    if (nodesWithRoot.length === 0) {
      return new Map<string, number>();
    }
    return calculateVirtualDepths(nodesWithRoot, parentChildMap);
  }, [nodesWithRoot, parentChildMap]);

  // Apply virtual depths and parent-child relationships to nodes
  const processedNodes = useMemo(() => {
    // Create a map for quick node lookups
    const nodeMap = new Map<string, Node>();
    nodesWithRoot.forEach(node => {
      nodeMap.set(node.id, node);
    });

    return nodesWithRoot.map(node => {
      // Find parent for all nodes, not just unmapped ones
      // This ensures proper color inheritance for all nodes
      let parentId: string | undefined;

      // For mapped nodes with bimbaCoordinate, we can determine the parent from the coordinate
      if (node.bimbaCoordinate) {
        // Root node has no parent
        if (node.bimbaCoordinate === '#') {
          parentId = undefined;
        }
        // Main subsystem nodes (#0-#5) have root as parent
        else if (/^#[0-5]$/.test(node.bimbaCoordinate)) {
          const rootNode = nodesWithRoot.find(n => n.bimbaCoordinate === '#');
          parentId = rootNode?.id;
        }
        // Second level nodes (#X-Y or #X.Y) have main subsystem as parent
        else if (/^#[0-5][-.]([0-5])$/.test(node.bimbaCoordinate)) {
          const mainSubsystem = node.bimbaCoordinate.charAt(1);
          const parentCoord = `#${mainSubsystem}`;
          const parentNode = nodesWithRoot.find(n => n.bimbaCoordinate === parentCoord);
          parentId = parentNode?.id;
        }
        // Deeper nodes - extract parent coordinate and find parent
        else if (node.bimbaCoordinate.includes('-') || node.bimbaCoordinate.includes('.')) {
          // Remove the last segment to get the parent coordinate
          const lastSeparatorIndex = Math.max(
            node.bimbaCoordinate.lastIndexOf('-'),
            node.bimbaCoordinate.lastIndexOf('.')
          );
          if (lastSeparatorIndex > 0) {
            const parentCoord = node.bimbaCoordinate.substring(0, lastSeparatorIndex);
            const parentNode = nodesWithRoot.find(n => n.bimbaCoordinate === parentCoord);
            parentId = parentNode?.id;
          }
        }
      }

      // For all nodes (mapped or unmapped), also check the parent-child map
      // This is especially important for unmapped nodes
      if (!parentId) {
        for (const [parent, children] of parentChildMap.entries()) {
          if (children.includes(node.id)) {
            parentId = parent;
            break;
          }
        }
      }

      // Get virtual depth from the map
      const depth = virtualDepths.get(node.id) || 3;

      // Create a new node with the virtual depth and parentId
      return {
        ...node,
        virtualDepth: depth,
        parentId: parentId,
      };
    });
  }, [nodesWithRoot, virtualDepths, parentChildMap]);

  return { processedNodes, edges, parentChildMap, virtualDepths };
}
