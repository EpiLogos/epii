/**
 * useGraphInteractions3D Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-4 (QL/AT Vis - Context)
 *
 * This hook is responsible for handling user interactions with the 3D graph.
 */

import { useCallback, useRef, MutableRefObject } from 'react';
import { Node, Edge } from '../../../components/meta/metaData';
import { InteractionState } from './useCameraControls3D';
import { adjustPhysicsForInteraction } from '../0_foundation/physicsConfig';

// Define a type for the ForceGraph3DInstance since it's not exported from react-force-graph
type ForceGraph3DInstance = any;

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    hoverTimeoutId?: number;
  }
}

/**
 * Hook for handling user interactions with the 3D graph
 * @param edges The styled graph edges
 * @param fgRef Reference to the ForceGraph3D component
 * @param interactionStateRef Reference to the interaction state
 * @param setHighlightedNodes Function to update the highlighted nodes in Meta3DContainer
 * @param setHighlightedLinks Function to update the highlighted links in Meta3DContainer
 * @param activeNode The active node from Meta3DContainer
 * @param setActiveNode Function to update the active node in Meta3DContainer
 * @returns The event handlers for user interactions
 */
export function useGraphInteractions3D(
  _nodes: Node[], // Unused but kept for API compatibility
  edges: Edge[],
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  interactionStateRef: MutableRefObject<InteractionState>,
  _highlightedNodes: Set<string>, // Unused but kept for API compatibility
  _highlightedLinks: Set<string>, // Unused but kept for API compatibility
  setHighlightedNodes: (nodes: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
  setHighlightedLinks: (links: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
  activeNode: Node | null,
  setActiveNode: (node: Node | null) => void
) {
  // Track the active node ID for internal use
  const activeNodeId = activeNode?.id || null;

  // Track the clicked node ID for toggling highlight
  const clickedNodeRef = useRef<string | null>(null);

  // Node click handler - now toggles highlighting on single click
  const handleNodeClick = useCallback((node: Node) => {
    if (!node || !node.id) return;

    // Check if this is a click on the same node (for toggling highlight)
    const isToggle = clickedNodeRef.current === node.id;

    // If toggling off, clear highlights and reset clicked node
    if (isToggle) {
      // Clear highlights
      setHighlightedNodes(new Set());
      setHighlightedLinks(new Set());
      clickedNodeRef.current = null;

      // Don't clear the active node - this allows double-click to still work
      // while preserving the highlight state
      return;
    }

    // This is a new node click - store the clicked node ID
    clickedNodeRef.current = node.id;

    // Don't set the active node - that's only for double-clicks
    // This separates highlighting (single click) from node details (double click)

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

      // Generate multiple ID formats to ensure compatibility
      const edgeId = edge.id || `${sourceId}-${targetId}`;
      const explicitFormat = `${sourceId}-${targetId}`;
      const reverseFormat = `${targetId}-${sourceId}`;

      if (sourceId === node.id || targetId === node.id) {
        // Add all possible ID formats to ensure compatibility
        connectedLinks.add(edgeId);
        connectedLinks.add(explicitFormat);
        connectedLinks.add(reverseFormat); // Add reverse format too

        if (sourceId === node.id) {
          connectedNodes.add(targetId);
        } else {
          connectedNodes.add(sourceId);
        }
      }
    });

    // Update the highlighted nodes and links in the Meta3DContainer context
    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);
  }, [edges, setHighlightedNodes, setHighlightedLinks]);

  // Track the last hovered node to prevent multiple nodes being highlighted
  const lastHoveredNodeRef = useRef<string | null>(null);

  // Node hover handler - optimized to minimize re-renders
  const handleNodeHover = useCallback(
    (node: Node | null) => {
      // Skip if we're already dragging a node
      if (interactionStateRef.current.isDragging) return;

      // If we have an active node, don't change highlights
      if (activeNodeId) return;

      // Store the hovered node for delayed processing
      const isHovering = !!node && !!node.id;
      const hoveredNodeId = node?.id || null;

      // Clear any existing hover timeout
      if (window.hoverTimeoutId) {
        clearTimeout(window.hoverTimeoutId);
        window.hoverTimeoutId = undefined;
      }

      // If not hovering, update immediately
      if (!isHovering) {
        // Update interaction state
        if (interactionStateRef.current) {
          interactionStateRef.current.isHovering = false;
          interactionStateRef.current.hoveredNodeId = null;
        }
      } else {
        // For hovering, add a small delay to allow for drag initiation
        window.hoverTimeoutId = window.setTimeout(() => {
          // Skip if we've started dragging during the delay
          if (interactionStateRef.current.isDragging) return;

          // Update interaction state
          if (interactionStateRef.current) {
            interactionStateRef.current.isHovering = isHovering;
            interactionStateRef.current.hoveredNodeId = hoveredNodeId;
          }
        }, 150); // 150ms delay before activating hover effects
      }

      // If no node is hovered, clear highlights
      if (!node || !node.id) {
        // Only clear if we actually have highlights
        if (lastHoveredNodeRef.current !== null) {
          // Use functional updates to avoid capturing stale state
          setHighlightedNodes(new Set());
          setHighlightedLinks(new Set());
          lastHoveredNodeRef.current = null;

          // Adjust physics for non-hover state
          // Pass isDragging=false to indicate this is just ending a hover, not a drag
          adjustPhysicsForInteraction(fgRef, interactionStateRef, false, false);

          // Explicitly reset the interaction state if we're not dragging
          if (!interactionStateRef.current.isDragging) {
            interactionStateRef.current.isInteracting = false;
          }
        }
        return;
      }

      // If this is the same node we're already hovering, do nothing
      if (lastHoveredNodeRef.current === node.id) return;

      // Update the last hovered node
      lastHoveredNodeRef.current = node.id;

      // Find connected nodes and links
      // Use memoization to prevent unnecessary calculations
      const connectedNodes = new Set<string>([node.id]);
      const connectedLinks = new Set<string>();

      // Process edges synchronously to ensure immediate updates
      edges.forEach(edge => {
        // Handle null or undefined source/target
        if (!edge.source || !edge.target) return;

        // Generate edge ID
        const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string})?.id : edge.source as string;
        const targetId = typeof edge.target === 'object' ? (edge.target as {id: string})?.id : edge.target as string;

        // Skip if source or target ID is missing
        if (!sourceId || !targetId) return;

        // Generate multiple ID formats to ensure compatibility
        const edgeId = edge.id || `${sourceId}-${targetId}`;
        const explicitFormat = `${sourceId}-${targetId}`;
        const reverseFormat = `${targetId}-${sourceId}`;

        if (sourceId === node.id || targetId === node.id) {
          // Add all possible ID formats to ensure compatibility
          connectedLinks.add(edgeId);
          connectedLinks.add(explicitFormat);
          connectedLinks.add(reverseFormat); // Add reverse format too

          // Add all link formats to ensure compatibility

          if (sourceId === node.id) {
            connectedNodes.add(targetId);
          } else {
            connectedNodes.add(sourceId);
          }
        }
      });

      // Update the highlighted nodes and links in the Meta3DContainer context
      setHighlightedNodes(connectedNodes);
      setHighlightedLinks(connectedLinks);

      // Highlighting state updated

      // Adjust physics for hover state - do this in requestAnimationFrame to avoid layout thrashing
      // Pass isDragging=false to indicate this is just a hover, not a drag
      requestAnimationFrame(() => {
        adjustPhysicsForInteraction(fgRef, interactionStateRef, true, false);
      });
    },
    [edges, activeNodeId, setHighlightedNodes, setHighlightedLinks, fgRef, interactionStateRef]
  );

  // Background click handler
  const handleBackgroundClick = useCallback(() => {
    // Clear the active node in the Meta3DContainer context
    setActiveNode(null);
    // Clear the highlighted nodes and links in the Meta3DContainer context
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
    // Reset the clicked node reference
    clickedNodeRef.current = null;
  }, [setActiveNode, setHighlightedNodes, setHighlightedLinks]);

  // Node drag handler
  const handleNodeDrag = useCallback((node: Node) => {
    if (!node || !node.id) return;

    // Skip if we're already dragging this node (prevents redundant updates)
    if (interactionStateRef.current.isDragging && interactionStateRef.current.draggedNodeId === node.id) {
      return;
    }

    // Clear any hover timeout to prevent hover effects during drag
    if (window.hoverTimeoutId) {
      clearTimeout(window.hoverTimeoutId);
      window.hoverTimeoutId = undefined;
    }

    // Immediately disable camera controls when drag starts
    // This ensures camera doesn't move when trying to drag a node
    if (fgRef.current) {
      if (typeof fgRef.current.controls === 'function') {
        const controls = fgRef.current.controls();
        if (controls && typeof controls.enabled === 'boolean') {
          controls.enabled = false;
        }
      }
    }

    // Update interaction state
    interactionStateRef.current.isDragging = true;
    interactionStateRef.current.draggedNodeId = node.id;

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

      // Generate multiple ID formats to ensure compatibility
      const edgeId = edge.id || `${sourceId}-${targetId}`;
      const explicitFormat = `${sourceId}-${targetId}`;
      const reverseFormat = `${targetId}-${sourceId}`;

      if (sourceId === node.id || targetId === node.id) {
        // Add all possible ID formats to ensure compatibility
        connectedLinks.add(edgeId);
        connectedLinks.add(explicitFormat);
        connectedLinks.add(reverseFormat); // Add reverse format too

        if (sourceId === node.id) {
          connectedNodes.add(targetId);
        } else {
          connectedNodes.add(sourceId);
        }
      }
    });

    // Update the highlighted nodes and links in the Meta3DContainer context
    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);

    try {
      // Use requestAnimationFrame to batch updates with rendering
      // This helps prevent physics resets by synchronizing with the render cycle
      requestAnimationFrame(() => {
        // Mark the node as being dragged
        (node as any).__dragging = true;

        // For mapped nodes, temporarily remove fixed positions during drag
        if (node.bimbaCoordinate) {
          // Store original position for restoration after drag
          // Use the same properties as storeOriginalPositions for consistency
          (node as any).__originalFx = (node as any).fx;
          (node as any).__originalFy = (node as any).fy;
          (node as any).__originalFz = (node as any).fz;

          // Remove fixed positions to allow movement
          (node as any).fx = undefined;
          (node as any).fy = undefined;
          (node as any).fz = undefined;
        }

        // Set flags on the ForceGraph3D instance to indicate we're dragging
        if (fgRef.current) {
          // Set drag flag
          fgRef.current.__isDragging = true;

          // Explicitly disable camera controls during drag
          if (typeof fgRef.current.controls === 'function') {
            const controls = fgRef.current.controls();
            if (controls && typeof controls.enabled === 'boolean') {
              controls.enabled = false;
            }
          }

          // Adjust physics for dragging - pass isDragging=true to prevent physics boost
          adjustPhysicsForInteraction(fgRef, interactionStateRef, true, true);
        }
      });
    } catch (error) {
      console.error('Error in handleNodeDrag:', error);
    }
  }, [edges, fgRef, interactionStateRef, setHighlightedNodes, setHighlightedLinks]);

  // Node drag end handler
  const handleNodeDragEnd = useCallback((node: Node) => {
    // Skip if node is null or missing id
    if (!node || !node.id) return;

    try {
      // Clear the dragging flag on the node immediately
      delete (node as any).__dragging;

      // Store node reference for delayed position restoration
      const nodeRef = node;

      // IMPORTANT: Reset interaction state immediately to ensure physics can resume
      interactionStateRef.current.isDragging = false;
      interactionStateRef.current.draggedNodeId = null;
      interactionStateRef.current.isInteracting = false;

      // Reset all flags and re-enable camera controls immediately
      if (fgRef.current) {
        // Reset drag flag
        fgRef.current.__isDragging = false;

        // Explicitly re-enable camera controls
        if (typeof fgRef.current.controls === 'function') {
          const controls = fgRef.current.controls();
          if (controls) {
            // Enable controls
            if (typeof controls.enabled === 'boolean') {
              controls.enabled = true;
            }

            // Force a controls update
            if (typeof controls.update === 'function') {
              controls.update();
            }
          }
        }

        // Reset physics parameters after drag - explicitly set isDragging to false
        adjustPhysicsForInteraction(fgRef, interactionStateRef, false, false);

        // Ensure the simulation continues running without disturbing node positions
        if (fgRef.current.d3Force) {
          const simulation = fgRef.current.d3Force();
          if (simulation) {
            // Ensure alpha is high enough to keep the simulation running
            if (typeof simulation.alpha === 'function' && simulation.alpha() < 0.1) {
              simulation.alpha(0.1);
            }

            // Ensure alphaTarget is set to keep the simulation running
            if (typeof simulation.alphaTarget === 'function') {
              simulation.alphaTarget(0.005);
            }

            // Restart the simulation if needed
            if (typeof simulation.restart === 'function') {
              simulation.restart();
            }
          }
        }

        // Force a visual refresh without resetting physics
        if (fgRef.current && fgRef.current.scene && fgRef.current.renderer) {
          try {
            const scene = fgRef.current.scene();
            const renderer = fgRef.current.renderer();
            const camera = fgRef.current.camera();
            if (scene && renderer && camera) {
              renderer.render(scene, camera);
            }
          } catch (e) {
            // Silent error handling
            console.debug('Error updating scene:', e);
          }
        }
      }

      // For mapped nodes, restore their original fixed positions immediately
      if (nodeRef.bimbaCoordinate) {
        // Get the original fixed positions using the same properties as in handleNodeDrag
        const originalFx = (nodeRef as any).__originalFx;
        const originalFy = (nodeRef as any).__originalFy;
        const originalFz = (nodeRef as any).__originalFz;

        // Restore fixed positions if they exist
        if (originalFx !== undefined) nodeRef.fx = originalFx;
        if (originalFy !== undefined) nodeRef.fy = originalFy;
        if (originalFz !== undefined) nodeRef.fz = originalFz;


      }

      // Double-check that camera controls are enabled
      if (fgRef.current && typeof fgRef.current.controls === 'function') {
        const controls = fgRef.current.controls();
        if (controls && typeof controls.enabled === 'boolean' && !controls.enabled) {
          controls.enabled = true;
          if (typeof controls.update === 'function') {
            controls.update();
          }
        }
      }
    } catch (error) {
      console.error('Error in handleNodeDragEnd:', error);

      // Even if there's an error, make sure we reset the interaction state
      interactionStateRef.current.isDragging = false;
      interactionStateRef.current.draggedNodeId = null;
      interactionStateRef.current.isInteracting = false;
    }
  }, [fgRef, interactionStateRef]);

  // We've removed the createNodeObjectFunction in favor of using the built-in node styling props
  // This aligns better with React's declarative paradigm and makes the code more maintainable

  return {
    // We don't need to return the state since it's managed by Meta3DContainer
    // Just return the handler functions
    handleNodeClick,
    handleNodeHover,
    handleBackgroundClick,
    handleNodeDrag,
    handleNodeDragEnd
  };
}
