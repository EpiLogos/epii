/**
 * InteractionLayer Component
 *
 * This component is responsible for handling user interactions with the graph.
 * It aligns with the #4 Nara subsystem (contextual application).
 *
 * Bimba Tech Architecture Alignment:
 * - Contributes to Module #5-3-4 (Web App Shell / Notion Frontend)
 * - Handles user interactions with the visualization
 * - Embodies the Nara principle (contextual application) by providing
 *   personalized, context-aware interactions with the knowledge structure
 * - Connects to the broader application shell that includes the chat component
 *   and other user interface elements
 */

import React, { useEffect, useCallback } from 'react';
import { useMeta3D } from '../../1_paramasiva/4_context/Meta3DContainer';
import { NodeDetailsPanel } from "../../../shared/components/meta/NodeDetailsPanel';
import { useNodeDetails } from "../../../shared/hooks/bimba/useNodeDetails';

// Debounce function to limit the rate of function calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const InteractionLayer: React.FC = () => {
  const {
    nodes,
    edges,
    graphRef,
    activeNode,
    setActiveNode,
    highlightedNodes,
    setHighlightedNodes,
    highlightedLinks,
    setHighlightedLinks
  } = useMeta3D();

  // Fetch node details
  const { data: nodeDetails, isLoading: detailsLoading } = useNodeDetails(activeNode);

  // Find connected nodes and links for a given node
  const findConnectedElements = useCallback((nodeId: string) => {
    const connectedNodes = new Set<string>([nodeId]);
    const connectedLinks = new Set<string>();

    // Find all connected links and nodes
    edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        connectedLinks.add(edge.id);

        // Add the connected node
        if (edge.source === nodeId) {
          connectedNodes.add(edge.target);
        } else {
          connectedNodes.add(edge.source);
        }
      }
    });

    return { connectedNodes, connectedLinks };
  }, [edges]);

  // Node click handler
  const handleNodeClick = useCallback((node: any) => {
    // Set active node
    setActiveNode(node);

    // Find connected nodes and links
    const { connectedNodes, connectedLinks } = findConnectedElements(node.id);

    // Update highlighted elements
    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);
  }, [setActiveNode, findConnectedElements, setHighlightedNodes, setHighlightedLinks]);

  // Node hover handler
  const handleNodeHover = useCallback(
    debounce((node: any) => {
      if (!node) return;

      // Find connected nodes and links
      const { connectedNodes, connectedLinks } = findConnectedElements(node.id);

      // Update highlighted elements
      setHighlightedNodes(connectedNodes);
      setHighlightedLinks(connectedLinks);
    }, 100),
    [findConnectedElements, setHighlightedNodes, setHighlightedLinks]
  );

  // Background click handler
  const handleBackgroundClick = useCallback(() => {
    setActiveNode(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  }, [setActiveNode, setHighlightedNodes, setHighlightedLinks]);

  // Set up event handlers
  useEffect(() => {
    if (!graphRef.current) return;

    // Set node click handler
    graphRef.current.onNodeClick(handleNodeClick);

    // Set node hover handler
    graphRef.current.onNodeHover(handleNodeHover);

    // Set background click handler
    graphRef.current.onBackgroundClick(handleBackgroundClick);

    // Enable node dragging
    graphRef.current.enableNodeDrag(true);

    // Enable pointer interaction
    graphRef.current.enablePointerInteraction(true);
  }, [graphRef, handleNodeClick, handleNodeHover, handleBackgroundClick]);

  // Prepare active node data for the details panel
  const activeNodeData = activeNode
    ? {
        ...activeNode,
        details: nodeDetails || null,
        connections: Array.from(highlightedNodes).filter(id => id !== activeNode.id),
        highlightedLinks: edges.filter(edge => highlightedLinks.has(edge.id)),
        isLoading: detailsLoading
      }
    : null;

  return (
    <>
      {/* Node Details Panel */}
      {activeNodeData && (
        <NodeDetailsPanel
          activeNode={activeNodeData}
          onClose={handleBackgroundClick}
        />
      )}
    </>
  );
};

export default InteractionLayer;
