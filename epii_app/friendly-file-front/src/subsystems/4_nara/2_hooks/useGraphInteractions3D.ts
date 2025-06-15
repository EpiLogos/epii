/**
 * useGraphInteractions3D Hook
 *
 * This hook is responsible for handling user interactions with the 3D graph.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Node, Edge } from '../components/meta/metaData";
import { getActiveNodeData } from '../subsystems/0_anuttara/1_utils/graphUtils';

// Debounce function to limit the rate of function calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Hook for handling user interactions with the 3D graph
 * @param nodes The styled graph nodes
 * @param edges The styled graph edges
 * @returns The active node data, highlighted nodes and links, and event handlers
 */
export function useGraphInteractions3D(
  nodes: Node[],
  edges: Edge[]
) {
  // State for active node
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // State for highlighted nodes and links
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());

  // Active node data
  const activeNodeData = activeNodeId
    ? getActiveNodeData(activeNodeId, nodes, edges, highlightedLinks)
    : null;

  // Node click handler
  const handleNodeClick = useCallback((node: Node) => {
    if (!node || !node.id) return;

    setActiveNodeId(node.id);

    // Find connected nodes and links
    const connectedNodes = new Set<string>([node.id]);
    const connectedLinks = new Set<string>();

    edges.forEach(edge => {
      // Handle null or undefined source/target
      if (!edge.source || !edge.target) return;

      // Generate edge ID
      const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string})?.id : edge.source as string;
      const targetId = typeof edge.target === 'object' ? (edge.target as {id: string})?.id : edge.target as string;

      // Skip if source or target ID is missing
      if (!sourceId || !targetId) return;

      const edgeId = edge.id || `${sourceId}-${targetId}`;

      if (sourceId === node.id || targetId === node.id) {
        connectedLinks.add(edgeId);

        if (sourceId === node.id) {
          connectedNodes.add(targetId);
        } else {
          connectedNodes.add(sourceId);
        }
      }
    });

    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);
  }, [edges]);

  // Track the last hovered node to prevent multiple nodes being highlighted
  const lastHoveredNodeRef = useRef<string | null>(null);

  // Node hover handler
  const handleNodeHover = useCallback(
    (node: Node | null) => {
      // If we have an active node, don't change highlights
      if (activeNodeId) return;

      // If no node is hovered, clear highlights
      if (!node || !node.id) {
        // Clear highlights when hover ends
        setHighlightedNodes(new Set());
        setHighlightedLinks(new Set());
        lastHoveredNodeRef.current = null;
        return;
      }

      // If this is the same node we're already hovering, do nothing
      if (lastHoveredNodeRef.current === node.id) return;

      // Update the last hovered node
      lastHoveredNodeRef.current = node.id;

      // Find connected nodes and links
      const connectedNodes = new Set<string>([node.id]);
      const connectedLinks = new Set<string>();

      edges.forEach(edge => {
        // Handle null or undefined source/target
        if (!edge.source || !edge.target) return;

        // Generate edge ID
        const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string})?.id : edge.source as string;
        const targetId = typeof edge.target === 'object' ? (edge.target as {id: string})?.id : edge.target as string;

        // Skip if source or target ID is missing
        if (!sourceId || !targetId) return;

        const edgeId = edge.id || `${sourceId}-${targetId}`;

        if (sourceId === node.id || targetId === node.id) {
          connectedLinks.add(edgeId);

          if (sourceId === node.id) {
            connectedNodes.add(targetId);
          } else {
            connectedNodes.add(sourceId);
          }
        }
      });

      setHighlightedNodes(connectedNodes);
      setHighlightedLinks(connectedLinks);
    },
    [edges, activeNodeId, setHighlightedNodes, setHighlightedLinks]
  );

  // Background click handler
  const handleBackgroundClick = useCallback(() => {
    setActiveNodeId(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  }, []);

  return {
    activeNodeData,
    highlightedNodes,
    highlightedLinks,
    handleNodeClick,
    handleNodeHover,
    handleBackgroundClick,
    // Expose the set functions for direct manipulation
    setHighlightedNodes,
    setHighlightedLinks
  };
}
