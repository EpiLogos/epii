/**
 * useGraphInteractions Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-4 (Bimba Vis / Geom Ground - Context)
 *
 * This hook is responsible for handling node interactions (click, hover, etc.).
 * It manages the active node state and fetches node details from the backend.
 */

import { useState, useCallback, useEffect, useRef, useMemo, MutableRefObject } from 'react';
import axios from 'axios';
import { Node, Edge } from "../../../shared/components/meta/metaData";
import { getActiveNodeData, ActiveNodeData } from '../1_utils/geometryUtils';
import bpmcpService, { BpmcpNodeDetails, NotionResolution } from '../../../shared/services/bpmcpService';

// Define interaction state interface similar to Meta3D
interface InteractionState2D {
  isInteracting: boolean;
  isHovering: boolean;
  isDragging: boolean;
  hoveredNodeId: string | null;
  draggedNodeId: string | null;
  clickedNodeId: string | null;
  physicsEnabled: boolean;
}

// Debounce function to limit the rate of function calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Hook for handling node interactions with advanced physics management
 * @param nodes - The styled graph nodes
 * @param edges - The styled graph edges
 * @param fgRef - Reference to the ForceGraph2D component
 * @param setHighlightedNodes - Function to update highlighted nodes in context
 * @param setHighlightedLinks - Function to update highlighted links in context
 * @param activeNode - The active node from context
 * @param setActiveNode - Function to update active node in context
 * @returns The interaction handlers
 */
export function useGraphInteractions(
  nodes: Node[],
  edges: Edge[],
  fgRef?: MutableRefObject<any | null>,
  setHighlightedNodes?: (nodes: Set<string>) => void,
  setHighlightedLinks?: (links: Set<string>) => void,
  activeNode?: Node | null,
  setActiveNode?: (node: Node | null) => void
) {
  // Create interaction state ref similar to Meta3D
  const interactionStateRef = useRef<InteractionState2D>({
    isInteracting: false,
    isHovering: false,
    isDragging: false,
    hoveredNodeId: null,
    draggedNodeId: null,
    clickedNodeId: null,
    physicsEnabled: true
  });
  // Use context setters if provided, otherwise fall back to local state for backward compatibility
  const [localHighlightedNodes, setLocalHighlightedNodes] = useState<Set<string>>(new Set());
  const [localHighlightedLinks, setLocalHighlightedLinks] = useState<Set<string>>(new Set());

  // Use context setters if available, otherwise use local state
  const updateHighlightedNodes = setHighlightedNodes || setLocalHighlightedNodes;
  const updateHighlightedLinks = setHighlightedLinks || setLocalHighlightedLinks;

  // Get active node ID from context if available
  const activeNodeId = activeNode?.id || null;

  // Create a reference to store the last clicked node to prevent duplicate clicks
  const lastClickedNodeRef = useRef<string | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the currently highlighted node from single clicks (separate from active node for details)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Double-click detection
  const lastClickTimeRef = useRef<number>(0);
  const DOUBLE_CLICK_THRESHOLD = 300; // 300ms window for double-click

  // Node click handler with double-click detection and BPMCP integration
  const handleNodeClick = useCallback((node: Node, isDoubleClick?: boolean) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;

    // Detect double-click if not explicitly provided
    if (isDoubleClick === undefined) {
      isDoubleClick = timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && lastClickedNodeRef.current === node.id;
    }

    lastClickTimeRef.current = currentTime;

    // For double-click, show node details panel immediately
    if (isDoubleClick) {
      console.log(`[Graph Interactions] Double-click detected on node: ${node.bimbaCoordinate || node.id}`);
      if (setActiveNode) {
        setActiveNode(node);
      }
      // The node details will be fetched in the effect below
      return;
    }

    // For single click, check if this node is already highlighted
    if (highlightedNodeId === node.id) {
      // Second click on same node - deselect
      setHighlightedNodeId(null);
      updateHighlightedNodes(new Set());
      updateHighlightedLinks(new Set());
      return;
    }

    // Prevent duplicate single clicks on the same node in quick succession (only for new highlights)
    if (lastClickedNodeRef.current === node.id && timeSinceLastClick < 100) {
      return;
    }

    // Set the last clicked node and clear it after a delay
    lastClickedNodeRef.current = node.id;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      lastClickedNodeRef.current = null;
    }, 300); // 300ms throttle time

    // First click or different node - set highlighted node and calculate connections
    setHighlightedNodeId(node.id);

    // Calculate highlighted nodes and links
    const connectedNodes = new Set<string>();
    const connectedLinks = new Set<string>();

    // Add the clicked node itself
    connectedNodes.add(node.id);

    // Find all connected nodes and links
    edges.forEach(edge => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

      // Check if the edge is connected to the clicked node
      if (sourceId === node.id || targetId === node.id) {
        // Add the connected node
        if (sourceId === node.id) {
          connectedNodes.add(targetId);
        } else {
          connectedNodes.add(sourceId);
        }

        // Add the edge
        connectedLinks.add(edge.id || `${sourceId}-${targetId}`);
      }
    });

    updateHighlightedNodes(connectedNodes);
    updateHighlightedLinks(connectedLinks);

    // IMPORTANT: Don't modify any node properties here
    // This ensures click doesn't affect animations or physics
    // Instead, we'll just update the visual highlighting
  }, [edges]);

  // Create a reference to store the raw hover handler
  const rawHoverHandlerRef = useRef<(node: Node | null) => void>();

  // Node hover handler with advanced physics management
  const handleNodeHover = useCallback((node: Node | null) => {
    try {
      // Skip if we're already dragging a node
      if (interactionStateRef.current.isDragging) return;

      // If we have a highlighted node from click, don't change highlights on hover
      if (highlightedNodeId) return;

      // Store the hovered node for delayed processing
      const isHovering = !!node && !!node.id;
      const hoveredNodeId = node?.id || null;

      // Update interaction state
      if (interactionStateRef.current) {
        interactionStateRef.current.isHovering = isHovering;
        interactionStateRef.current.hoveredNodeId = hoveredNodeId;
        interactionStateRef.current.isInteracting = isHovering;
      }

      // If no node is hovered, clear highlights
      if (!node || !node.id) {
        updateHighlightedNodes(new Set());
        updateHighlightedLinks(new Set());

        // Don't call physics adjustment - let the restart protection handle it
        return;
      }

      // Calculate highlighted nodes and links WITHOUT modifying original objects
      const connectedNodes = new Set<string>([node.id]);
      const connectedLinks = new Set<string>();

      // Find all connected nodes and links
      edges.forEach(edge => {
        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

        // Check if the edge is connected to the hovered node
        if (sourceId === node.id || targetId === node.id) {
          // Add the connected node
          if (sourceId === node.id) {
            connectedNodes.add(targetId);
          } else {
            connectedNodes.add(sourceId);
          }

          // Add the edge with multiple formats for compatibility
          const edgeId = edge.id || `${sourceId}-${targetId}`;
          connectedLinks.add(edgeId);
          connectedLinks.add(`${sourceId}-${targetId}`);
          connectedLinks.add(`${targetId}-${sourceId}`);
        }
      });

      updateHighlightedNodes(connectedNodes);
      updateHighlightedLinks(connectedLinks);

      // Don't call adjustPhysicsForInteraction2D - the restart protection handles it
    } catch (error) {
      // Silent error - don't log to avoid console spam during hover
      console.debug('Error in hover handler:', error);
    }
  }, [edges, activeNodeId, highlightedNodeId]);

  // Store the raw handler in a ref to avoid recreating the debounced function
  rawHoverHandlerRef.current = handleNodeHover;

  // Create debounced hover handler
  const debouncedHoverHandler = useMemo(
    () => debounce(handleNodeHover, 50), // 50ms debounce for smooth hover
    [handleNodeHover]
  );

  // Background click handler with throttling
  const lastBackgroundClickTimeRef = useRef<number>(0);

  const handleBackgroundClick = useCallback(() => {
    // Prevent rapid background clicks
    const now = Date.now();
    if (now - lastBackgroundClickTimeRef.current < 300) { // 300ms throttle
      return;
    }
    lastBackgroundClickTimeRef.current = now;

    // Clear active node and highlights
    if (setActiveNode) {
      setActiveNode(null);
    }
    setHighlightedNodeId(null);
    updateHighlightedNodes(new Set());
    updateHighlightedLinks(new Set());
  }, []);

  // REMOVED: Node details fetching - now handled by useNodeDetails hook in Meta2DVisualization

  // Return the interaction handlers (like Meta3D)
  return {
    handleNodeClick,
    handleNodeHover: debouncedHoverHandler,
    handleBackgroundClick,
    interactionStateRef
  };
}

/**
 * Enhanced physics protection for interaction state (2D version)
 * Prevents physics resets during highlighting operations
 * @param fgRef Reference to the ForceGraph2D component
 * @param interactionStateRef Reference to the interaction state
 * @param isInteracting Whether the user is interacting with a node
 * @param isDragging Whether the user is specifically dragging
 */
function adjustPhysicsForInteraction2D(
  fgRef: MutableRefObject<any | null>,
  interactionStateRef: MutableRefObject<InteractionState2D>,
  isInteracting: boolean,
  isDragging: boolean = false
) {
  if (!fgRef.current) return;

  // Get the force simulation for 2D
  const simulation = fgRef.current.d3Force();
  if (!simulation) return;

  // Store original restart function if not already stored
  if (!interactionStateRef.current.originalRestart && typeof simulation.restart === 'function') {
    interactionStateRef.current.originalRestart = simulation.restart;
  }

  // CRITICAL: Always prevent physics restart during ANY interaction
  // This is the key fix that prevents node scattering during highlighting
  if (typeof simulation.restart === 'function') {
    simulation.restart = function() {
      // NEVER allow full restart during interactions - just gentle alpha boost
      const currentAlpha = this.alpha();
      if (currentAlpha < 0.1) {
        this.alpha(0.1); // Minimal boost to keep simulation alive
      }
      // Do NOT call the original restart function during interactions
    };
  }

  // Update the interaction state flags
  interactionStateRef.current.isInteracting = isInteracting;

  if (isDragging) {
    // Update dragging state
    interactionStateRef.current.isDragging = true;
    interactionStateRef.current.isHovering = false;

    // Give a strong alpha boost for immediate response during drag
    if (typeof simulation.alpha === 'function') {
      simulation.alpha(Math.max(simulation.alpha(), 0.8)); // Strong but not full reset
    }
    if (typeof simulation.alphaTarget === 'function') {
      simulation.alphaTarget(0.15); // Moderate target to prevent excessive motion
    }
  } else if (isInteracting) {
    // Update hovering state
    interactionStateRef.current.isHovering = true;
    interactionStateRef.current.isDragging = false;

    // MINIMAL alpha adjustment for hover to prevent disruption
    if (typeof simulation.alpha === 'function') {
      const currentAlpha = simulation.alpha();
      if (currentAlpha < 0.05) {
        simulation.alpha(0.05); // Very gentle minimum boost only if needed
      }
    }
    // NO alpha target changes during hover to prevent physics disruption
  } else {
    // End of interaction - restore normal state gradually
    interactionStateRef.current.isDragging = false;
    interactionStateRef.current.isHovering = false;
    interactionStateRef.current.isInteracting = false;

    // Restore original restart function
    if (interactionStateRef.current.originalRestart && typeof simulation.restart === 'function') {
      simulation.restart = interactionStateRef.current.originalRestart;
    }

    // Gentle restoration of physics parameters
    if (typeof simulation.alphaTarget === 'function') {
      simulation.alphaTarget(0.1); // Standard target
    }
  }

}