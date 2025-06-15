/**
 * Depth Calculation Utilities
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-1 (Bimba Vis / Geom Ground - Utils)
 *
 * This file contains utility functions for calculating node depths in the Bimba structure.
 */

import { Node, Edge } from "../../../shared/components/meta/metaData";

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
 * Calculates the virtual depth of each node based on its bimbaCoordinate or parent-child relationships.
 *
 * @param nodes - The graph nodes
 * @param parentChildMap - The map of parent-child relationships
 * @returns A map of node IDs to virtual depths
 */
export function calculateVirtualDepths(nodes: Node[], parentChildMap: Map<string, string[]>): Map<string, number> {
  const virtualDepths = new Map<string, number>();

  // Early return if nodes array is empty
  if (!nodes || nodes.length === 0) {
    console.log('calculateVirtualDepths: No nodes provided, returning empty depth map');
    return virtualDepths;
  }

  // Find the root node with bimbaCoordinate "#"
  const rootNode = nodes.find(node => node.bimbaCoordinate === '#');
  let rootNodeId: string | undefined;

  if (rootNode) {
    rootNodeId = rootNode.id;
    // Ensure root node is set to depth 0
    virtualDepths.set(rootNodeId, 0);
    rootNode.virtualDepth = 0;
    console.log('Root node found:', rootNodeId, 'set to depth 0');
  } else {
    // Only log a warning if we actually have nodes but no root
    if (nodes.length > 0) {
      console.warn('Root node with bimbaCoordinate "#" not found');

      // DEBUG: Log all nodes to see what's available
      console.log('Available nodes:', nodes.map(node => ({
        id: node.id,
        bimbaCoordinate: node.bimbaCoordinate,
        label: node.label
      })));
    }
  }

  // Create a map of bimbaCoordinate to node ID for quick lookups
  const bimbaCoordinateMap = new Map<string, string>();
  nodes.forEach(node => {
    if (node.bimbaCoordinate) {
      bimbaCoordinateMap.set(node.bimbaCoordinate, node.id);
    }
  });

  // First, set depths for all mapped nodes
  nodes.forEach(node => {
    if (node.bimbaCoordinate) {
      // Skip the root node as we've already handled it
      if (node.bimbaCoordinate === '#') return;

      const depth = calculateDepth(node.bimbaCoordinate);
      virtualDepths.set(node.id, depth);
      // Also update the node's virtualDepth property directly for convenience
      node.virtualDepth = depth;

      // Special handling for main subsystem nodes (#0-#5)
      // Ensure they're properly linked to the root node in our depth calculations
      if (/^#[0-5]$/.test(node.bimbaCoordinate) && rootNodeId) {
        // These should always be at depth 1
        virtualDepths.set(node.id, 1);
        node.virtualDepth = 1;
        console.log(`Main subsystem node ${node.bimbaCoordinate} (${node.id}) set to depth 1`);
      }
    }
  });

  // Enhance parent-child relationships for bimba nodes
  // This ensures the hierarchical structure is properly represented
  if (rootNodeId) {
    // For each main subsystem node (#0-#5), ensure it's linked to the root
    for (let i = 0; i <= 5; i++) {
      const bimbaCoord = `#${i}`;
      const nodeId = bimbaCoordinateMap.get(bimbaCoord);

      if (nodeId) {
        // Add this node as a child of the root node if not already present
        const rootChildren = parentChildMap.get(rootNodeId) || [];
        if (!rootChildren.includes(nodeId)) {
          rootChildren.push(nodeId);
          parentChildMap.set(rootNodeId, rootChildren);
          console.log(`Added ${bimbaCoord} as child of root node`);
        }
      }
    }

    // For each second level node (#X-Y or #X.Y), ensure it's linked to its parent
    nodes.forEach(node => {
      if (node.bimbaCoordinate && /^#[0-5][-.]([0-5])$/.test(node.bimbaCoordinate)) {
        // Extract the main subsystem number
        const mainSubsystem = node.bimbaCoordinate.charAt(1);
        const parentBimbaCoord = `#${mainSubsystem}`;
        const parentId = bimbaCoordinateMap.get(parentBimbaCoord);

        if (parentId) {
          // Add this node as a child of its parent if not already present
          const parentChildren = parentChildMap.get(parentId) || [];
          if (!parentChildren.includes(node.id)) {
            parentChildren.push(node.id);
            parentChildMap.set(parentId, parentChildren);
            console.log(`Added ${node.bimbaCoordinate} as child of ${parentBimbaCoord}`);
          }
        }
      }
    });
  }

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
