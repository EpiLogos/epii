/**
 * useGraphStyling3D Hook
 *
 * This hook is responsible for styling the 3D graph nodes and edges.
 */

import { useMemo } from 'react';
import { Node, Edge } from '../components/meta/metaData";
import { calculateNodeColorAndOpacity, calculateEdgeColorAndOpacity } from '../subsystems/0_anuttara/1_utils/graphUtils';

/**
 * Hook for styling the 3D graph nodes and edges
 * @param nodes The positioned graph nodes
 * @param edges The graph edges
 * @param virtualDepths The map of node IDs to virtual depths
 * @returns The styled nodes and edges
 */
export function useGraphStyling3D(
  nodes: Node[],
  edges: Edge[],
  virtualDepths: Map<string, number>
) {
  // Style nodes
  const styledNodes = useMemo(() => {
    // First, calculate and set virtual depths for all nodes

    nodes.forEach(node => {
      // Get node's virtual depth - first from node.virtualDepth, then from virtualDepths map
      let depth = node.virtualDepth !== undefined ? node.virtualDepth : (virtualDepths.get(node.id) || 3);

      // Ensure root node (#) has depth 0
      if (node.bimbaCoordinate === '#') {
        depth = 0;
      }
      // Ensure main subsystem nodes (#0-#5) have depth 1
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5]$/.test(node.bimbaCoordinate)) {
        depth = 1;
      }
      // Ensure second level nodes (#X-Y) have depth 2
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        depth = 2;
      }
      // Ensure third level nodes (#X-Y-Z) have depth 3
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        depth = 3;
      }
      // Ensure fourth level nodes (#X-Y-Z-W) have depth 4
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5][-\.][0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        depth = 4;
      }
      // For other mapped nodes, calculate depth from bimbaCoordinate
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string') {
        // Count segments for deeper nodes
        const segments = node.bimbaCoordinate.substring(1).split(/[-.]/);
        depth = segments.length;
      }

      // Update node's virtualDepth property for consistency
      node.virtualDepth = depth;

      // Also update the virtualDepths map
      virtualDepths.set(node.id, depth);
    });

    // CRITICAL FIX: Second pass: handle unmapped nodes based on their parent's depth
    // Increase max iterations to ensure all nodes get proper depths
    let changed = true;
    let iterations = 0;
    const maxIterations = 10; // Increased from 5 to ensure all nodes get proper depths

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      nodes.forEach(node => {
        // Skip mapped nodes
        if (node.bimbaCoordinate) return;

        // Find parent node
        const parentId = node.parentId;
        if (parentId) {
          const parentNode = nodes.find(n => n.id === parentId);
          if (parentNode && parentNode.virtualDepth !== undefined) {
            // Set depth to parent's depth + 1
            const newDepth = parentNode.virtualDepth + 1;
            if (node.virtualDepth !== newDepth) {
              node.virtualDepth = newDepth;
              virtualDepths.set(node.id, newDepth);
              changed = true;
            }
          }
        }
      });
    }

    // Virtual depths calculated

    // Ensure all nodes have a virtual depth
    nodes.forEach(node => {
      if (node.virtualDepth === undefined) {
        node.virtualDepth = 3; // Default depth
        virtualDepths.set(node.id, 3);
      }
    });

    // Now style the nodes based on their virtual depths
    return nodes.map(node => {
      // Get the node's virtual depth (should be set by now)
      const depth = node.virtualDepth !== undefined ? node.virtualDepth : 3;

      // Calculate node size based on virtual depth and bimbaCoordinate
      // Base size is 3.6 units (increased by factor of 1.2x)
      const baseSize = 3.6;
      let nodeSize = baseSize;

      // Use a consistent scaling law based on depth
      // The formula is: size = baseSize * (scaleFactor ^ (maxDepth - depth))
      // This creates an exponential decrease in size as depth increases
      const scaleFactor = 1.5; // Reduced from 1.8 for less dramatic scaling
      const maxDepth = 6;      // Maximum depth for scaling purposes

      // Root node (#) is largest
      if (node.bimbaCoordinate === '#') {
        nodeSize = baseSize * Math.pow(scaleFactor, maxDepth - 1); // ~85
      }
      // Main subsystem nodes (#0-#5) are next largest
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5]$/.test(node.bimbaCoordinate)) {
        nodeSize = baseSize * Math.pow(scaleFactor, maxDepth - 2); // ~57
      }
      // Second level nodes (#X-Y) are medium-large
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        nodeSize = baseSize * Math.pow(scaleFactor, maxDepth - 3); // ~38
      }
      // Third level nodes (#X-Y-Z) are medium
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        nodeSize = baseSize * Math.pow(scaleFactor, maxDepth - 4); // ~25
      }
      // Fourth level nodes (#X-Y-Z-W) are small-medium
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && /^#[0-5][-\.][0-5][-\.][0-5][-\.][0-5]$/.test(node.bimbaCoordinate)) {
        nodeSize = baseSize * Math.pow(scaleFactor, maxDepth - 5); // ~17
        // Fourth level node
      }
      // Other mapped nodes are small
      else if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string') {
        // Calculate depth from bimbaCoordinate
        const segments = node.bimbaCoordinate.substring(1).split(/[-.]/);
        const coordDepth = segments.length;
        // Use the calculated depth for consistent scaling
        nodeSize = baseSize * Math.pow(scaleFactor, Math.max(0, maxDepth - coordDepth - 4)); // Ensures very small sizes for deep nodes
        // Deep mapped node
      }
      // Unmapped nodes are sized based on their virtual depth
      else {
        // CRITICAL FIX: Much more aggressive scaling for unmapped nodes
        // Use a steeper scaling factor and much lower minimum size
        const unmappedFactor = 0.7; // Reduced from 0.8 for more dramatic scaling
        const unmappedScaleFactor = 2.5; // Increased from 2.0 for more dramatic scaling

        // Calculate size with much more aggressive scaling
        // Allow negative exponents for very small sizes at deep depths
        nodeSize = baseSize * unmappedFactor * Math.pow(unmappedScaleFactor, Math.max(-4, maxDepth - depth - 3));

        // CRITICAL FIX: Use an extremely low minimum size to allow proper parent-child scaling
        const minSize = baseSize * 0.01; // Drastically reduced from 0.05 for proper depth scaling
        nodeSize = Math.max(minSize, nodeSize);

        // Node sizing logging disabled

        // Unmapped node
      }

      // Calculate node color and opacity based on type, depth, bimbaCoordinate, and parentId
      // For unmapped nodes, we'll pass the parentId to inherit colors from parent
      const { color: nodeColor, opacity } = calculateNodeColorAndOpacity(
        node.type || 'default',
        depth,
        false,
        node.bimbaCoordinate,
        node.parentId ? node.parentId : undefined,
        nodes // Pass all nodes to allow parent lookup
      );

      // Store opacity as a separate property for use in THREE.js materials
      const nodeWithOpacity = {
        ...node,
        val: nodeSize,
        color: nodeColor,
        opacity: opacity
      };

      return nodeWithOpacity;
    });
  }, [nodes, virtualDepths]);

  // Style edges
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      // Handle null or undefined source/target
      if (!edge.source || !edge.target) {
        return {
          ...edge,
          id: edge.id || `edge-${Math.random().toString(36).substring(2, 9)}`,
          width: 0.2,
          color: 'rgba(255, 255, 255, 0.2)'
        };
      }

      // Generate edge ID
      const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string})?.id : edge.source as string;
      const targetId = typeof edge.target === 'object' ? (edge.target as {id: string})?.id : edge.target as string;
      const edgeId = edge.id || `${sourceId}-${targetId}`;

      // Calculate edge width based on type
      let edgeWidth = 0.2; // Default width

      // Core relationships are thicker
      if (edge.type === 'DEVELOPS_INTO' || edge.type === 'CONTAINS' || edge.type === 'RETURNS_TO') {
        edgeWidth = 0.8; // 4x thicker for main subsystem relationships
      }
      // Relationships between main subsystems are thicker
      else if (sourceId && targetId) {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        // Check if both nodes are main subsystems
        const isSourceMainSubsystem = sourceNode?.bimbaCoordinate && /^#[0-5]$/.test(sourceNode.bimbaCoordinate);
        const isTargetMainSubsystem = targetNode?.bimbaCoordinate && /^#[0-5]$/.test(targetNode.bimbaCoordinate);

        if (isSourceMainSubsystem && isTargetMainSubsystem) {
          edgeWidth = 0.6; // 3x thicker for relationships between main subsystems
        }
      }

      // Calculate edge color and opacity based on type
      const { color: edgeColor, opacity: edgeOpacity } = calculateEdgeColorAndOpacity(edge.type);

      return {
        ...edge,
        id: edgeId,
        width: edgeWidth,
        color: edgeColor,
        opacity: edgeOpacity
      };
    });
  }, [edges]);

  return { styledNodes, styledEdges };
}
