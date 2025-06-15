/**
 * useGraphRendering3D Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-3 (QL/AT Vis - Visualization)
 *
 * This hook is responsible for rendering the 3D graph.
 */

import { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Node, Edge } from "../../../shared/components/meta/metaData";
import { usePulsationAnimation } from '../../2_parashakti/2_hooks/usePulsationAnimation';

/**
 * Hook for rendering the 3D graph
 * @param nodes The styled graph nodes
 * @param edges The styled graph edges
 * @param highlightedNodes The set of highlighted node IDs
 * @param highlightedLinks The set of highlighted link IDs
 * @param forceGraphRef Optional reference to the ForceGraph3D component for refreshing
 * @returns The animated nodes and edges
 */
export function useGraphRendering3D(
  nodes: Node[],
  edges: Edge[],
  highlightedNodes?: Set<string>,
  highlightedLinks?: Set<string>,
  forceGraphRef?: React.MutableRefObject<any>
) {
  // Use empty sets as defaults if not provided
  const actualHighlightedNodes = highlightedNodes || new Set<string>();
  const actualHighlightedLinks = highlightedLinks || new Set<string>();
  // Reference for the last animation time
  const lastAnimationTimeRef = useRef<number>(Date.now());

  // Reference for the current pulsation factor
  const pulseFactorRef = useRef<number>(1.0);

  // DISABLED: Direct Three.js manipulation for link styling
  // We're now using the ForceGraph3D props for link styling
  // This is more natural and aligns better with React's declarative paradigm
  // The pulsation factor is still calculated and exposed for use in ForceGraph3D props
  useEffect(() => {
    // Function to update the pulsation factor
    const updatePulsation = () => {
      // Calculate pulsation factor using a sine wave pattern
      const now = Date.now();
      const pulseCycle = 5000; // 5 seconds per cycle
      const normalizedTime = (now % pulseCycle) / pulseCycle;

      // Use a sine wave for smoother pulsation
      // Scale from 0.3 to 2.0 for a good visual range - MATCHES 2D GRAPH
      const pulseFactor = 0.3 + (Math.sin(normalizedTime * Math.PI * 2) * 0.5 + 0.5) * 1.7;
      pulseFactorRef.current = pulseFactor;
    };

    // Set up interval for pulsation
    const intervalId = setInterval(updatePulsation, 250); // Update 4 times per second

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Keep track of the previous nodes and edges to avoid unnecessary recreation
  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);
  const prevHighlightedNodesRef = useRef(actualHighlightedNodes);
  const prevHighlightedLinksRef = useRef(actualHighlightedLinks);

  // Separate memoization for nodes and edges to avoid unnecessary recreation
  const animatedNodes = useMemo(() => {
    // CRITICAL FIX: ALWAYS return the original nodes array
    // This prevents physics resets by never creating new node objects
    // Visual highlighting is now handled via React state

    // UNIFIED APPROACH: We no longer need to debug node styling
    // All styling is now handled by useGraphStylingFunctions in Meta3DVisualization
    // This ensures a consistent approach based on virtual depth for all nodes

    return nodes;
  }, [nodes]); // CRITICAL FIX: Only depend on nodes, not highlightedNodes

  // Separate memoization for edges
  const animatedEdges = useMemo(() => {
    // CRITICAL FIX: ALWAYS return the original edges array
    // This prevents physics resets by never creating new edge objects
    // Visual highlighting is now handled via React state
    return edges;
  }, [edges]); // CRITICAL FIX: Only depend on edges, not highlightedLinks

  // Use a separate useMemo to combine the results
  // This ensures we don't create a new object on every render
  const result = useMemo(() => {
    return { animatedNodes, animatedEdges, pulseFactorRef };
  }, [animatedNodes, animatedEdges, pulseFactorRef]);

  return result;
}
