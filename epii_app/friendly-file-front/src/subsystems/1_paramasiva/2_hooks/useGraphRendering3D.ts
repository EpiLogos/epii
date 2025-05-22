/**
 * useGraphRendering3D Hook
 *
 * This hook is responsible for rendering the 3D graph.
 * It uses the AnimationManager for better performance and coordination.
 */

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Node, Edge } from '../../../components/meta/metaData';
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority,
  AnimationId
} from '../../2_parashakti/1_utils/AnimationManager';

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
  highlightedNodes: Set<string>,
  highlightedLinks: Set<string>,
  forceGraphRef?: React.MutableRefObject<any>
) {
  // Reference for the current pulsation factor
  const pulseFactorRef = useRef<number>(1.0);

  // Animation ID reference
  const animationIdRef = useRef<AnimationId | null>(null);

  // Use AnimationManager for pulsation animation
  useEffect(() => {
    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Register the pulsation animation with the AnimationManager
    const animationId = animationManager.registerAnimation(
      (time, _deltaTime, scene) => {
        // Calculate pulsation factor using a sine wave pattern
        const pulseCycle = 5000; // 5 seconds per cycle
        const normalizedTime = (time % pulseCycle) / pulseCycle;

        // Use a sine wave for smoother pulsation
        // Scale from 0.3 to 1.7 for a good visual range - MATCHES 2D GRAPH
        const pulseFactor = 0.3 + (Math.sin(normalizedTime * Math.PI * 2) * 0.5 + 0.5) * 1.4;
        pulseFactorRef.current = pulseFactor;

        // Directly update link materials without refreshing the graph
        if (forceGraphRef?.current && forceGraphRef.current.scene) {
          try {
            // Use the scene from the animation callback if available, otherwise get it from the graph
            const graphScene = scene || forceGraphRef.current.scene();
            if (!graphScene) return;

            // Find all link objects and update their opacity based on type
            graphScene.traverse((object: THREE.Object3D) => {
              if (object.userData && object.userData.linkId && object.material) {
                // Don't skip highlighted links - we want to animate them too

                // Check if this is a main subsystem link
                const isMainSubsystemLink = object.userData.linkType === 'DEVELOPS_INTO' ||
                                           object.userData.linkType === 'CONTAINS' ||
                                           object.userData.linkType === 'RETURNS_TO';

                // Calculate opacity based on link type and highlight state
                let opacity = 0.7; // Default opacity

                // Get the link ID to check if it's highlighted
                const linkId = object.userData.linkId;
                const isHighlighted = highlightedLinks.has(linkId);

                if (isHighlighted) {
                  // Highlighted edges have high opacity with dramatic pulsation
                  // Minimum 0.85, maximum based on pulse factor (up to 2.0)
                  const highlightedMinOpacity = 0.85;
                  opacity = Math.max(highlightedMinOpacity, Math.min(2.0, pulseFactor));
                } else if (isMainSubsystemLink) {
                  // Main subsystem links have moderate opacity with visible pulsation
                  // Minimum 0.7, maximum based on pulse factor (up to 1.5)
                  opacity = 0.7 + (pulseFactor - 0.3) * 0.8; // Scale to 0.7-1.5 range
                } else {
                  // Other links have low opacity with subtle pulsation
                  // Minimum 0.4, maximum based on pulse factor (up to 0.9)
                  opacity = 0.4 + (pulseFactor - 0.3) * 0.5; // Scale to 0.4-0.9 range
                }

                // Update material opacity
                object.material.opacity = opacity;
              }
            });

            // Force a visual refresh without resetting physics
            if (forceGraphRef.current.renderer) {
              const renderer = forceGraphRef.current.renderer();
              if (renderer && typeof renderer.render === 'function') {
                const camera = forceGraphRef.current.camera();
                if (graphScene && camera) {
                  renderer.render(graphScene, camera);
                }
              }
            }
          } catch (e) {
            // Silent error handling
          }
        }
      },
      {
        subsystem: AnimationSubsystem.PARAMASIVA,
        category: AnimationCategory.LINK,
        priority: AnimationPriority.MEDIUM,
        updateInterval: 100, // 10fps - smoother animation than before (was 250ms/4fps)
        name: 'Graph Link Pulsation'
      }
    );

    // Store the animation ID
    animationIdRef.current = animationId;

    // Start the animation manager if not already started
    if (!animationManager.getIsRunning()) {
      animationManager.start();
    }

    // Clean up animation on unmount
    return () => {
      // Unregister the animation
      if (animationIdRef.current) {
        const animationManager = getAnimationManager();
        animationManager.unregisterAnimation(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [forceGraphRef, highlightedLinks]);

  // No need to track previous values since we're always returning the original arrays

  // Separate memoization for nodes and edges to avoid unnecessary recreation
  const animatedNodes = useMemo(() => {
    // CRITICAL FIX: ALWAYS return the original nodes array
    // This prevents physics resets by never creating new node objects
    // Visual highlighting is now handled via React state
    return nodes;

    /* REMOVED: This code was causing physics resets
    // Only update nodes if nodes or highlightedNodes have changed
    // This prevents physics resets when only highlightedLinks changes
    if (
      nodes === prevNodesRef.current &&
      highlightedNodes === prevHighlightedNodesRef.current
    ) {
      return prevNodesRef.current;
    }

    // Update references
    prevNodesRef.current = nodes;
    prevHighlightedNodesRef.current = highlightedNodes;

    // Update animation time
    const now = Date.now();
    lastAnimationTimeRef.current = now;

    // Process nodes - IMPORTANT: Don't create new node objects if not necessary
    return nodes.map(node => {
      // Check if node is highlighted
      const isHighlighted = node.id && highlightedNodes.has(node.id);

      // If node already has velocity components and isn't highlighted, don't modify it
      // This is crucial for preserving physics state
      if (
        node.vx !== undefined &&
        node.vy !== undefined &&
        node.vz !== undefined &&
        !isHighlighted
      ) {
        return node;
      }

      // Skip mapped nodes unless they're highlighted
      if (node.bimbaCoordinate && typeof node.bimbaCoordinate === 'string' && !isHighlighted) {
        return node;
      }

      // For highlighted nodes, we want to ensure they're visible but don't need to change physics
      if (isHighlighted) {
        // Preserve existing velocity if present
        return {
          ...node,
          // Don't add new velocity components if they already exist
          ...(node.vx === undefined ? { vx: 0 } : {}),
          ...(node.vy === undefined ? { vy: 0 } : {}),
          ...(node.vz === undefined ? { vz: 0 } : {})
        };
      }
    */

      /* REMOVED: This code was causing physics resets
      // For unmapped nodes without velocity, add gentle random motion
      // Calculate random velocity for unmapped nodes
      const randomStrength = 0.2 + Math.random() * 0.3;

      // Use spherical coordinates for uniform distribution
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      // Convert spherical to cartesian coordinates for velocity
      const vx = Math.sin(phi) * Math.cos(theta) * randomStrength;
      const vy = Math.sin(phi) * Math.sin(theta) * randomStrength;
      const vz = Math.cos(phi) * randomStrength * 3.0; // 3x stronger z-component

      return {
        ...node,
        vx,
        vy,
        vz
      };
      */
  }, [nodes]); // CRITICAL FIX: Only depend on nodes, not highlightedNodes

  // Separate memoization for edges
  const animatedEdges = useMemo(() => {
    // CRITICAL FIX: ALWAYS return the original edges array
    // This prevents physics resets by never creating new edge objects
    // Visual highlighting is now handled via React state
    return edges;

    /* REMOVED: This code was causing physics resets
    // Only update edges if edges or highlightedLinks have changed
    if (
      edges === prevEdgesRef.current &&
      highlightedLinks === prevHighlightedLinksRef.current
    ) {
      return prevEdgesRef.current;
    }

    // Update references
    prevEdgesRef.current = edges;
    prevHighlightedLinksRef.current = highlightedLinks;

    // Get the current pulse factor
    const pulseFactor = pulseFactorRef.current;

    // Animate edges with pulsating opacity
    return edges.map(edge => {
      // Generate edge ID
      const sourceId = typeof edge.source === 'object' ? (edge.source as {id: string})?.id : edge.source as string;
      const targetId = typeof edge.target === 'object' ? (edge.target as {id: string})?.id : edge.target as string;
      const edgeId = edge.id || `${sourceId}-${targetId}`;

      // Check if edge is highlighted
      const isHighlighted = highlightedLinks.has(edgeId);

      // Check if this is a main subsystem link
      const isMainSubsystemLink = edge.type === 'DEVELOPS_INTO' || edge.type === 'CONTAINS' || edge.type === 'RETURNS_TO';

      // Base opacity from the edge
      const baseOpacity = edge.opacity || 0.7;

      // Calculate pulsating opacity using the sawtooth wave pattern
      let opacity = baseOpacity;

      if (isHighlighted) {
        // Highlighted edges have high opacity with dramatic pulsation
        // Minimum 0.85, maximum based on pulse factor (up to 2.0)
        const highlightedMinOpacity = 0.85;
        opacity = Math.max(highlightedMinOpacity, Math.min(2.0, pulseFactor));
      } else if (isMainSubsystemLink) {
        // Main subsystem links have moderate opacity with visible pulsation
        // Minimum 0.7, maximum based on pulse factor (up to 1.5)
        opacity = 0.7 + (pulseFactor - 0.3) * 0.8; // Scale to 0.7-1.5 range
      } else {
        // Other links have low opacity with subtle pulsation
        // Minimum 0.4, maximum based on pulse factor (up to 0.9)
        opacity = 0.4 + (pulseFactor - 0.3) * 0.5; // Scale to 0.4-0.9 range
      }

      // Add particles based on link type and highlight state
      let particles = 2; // Default to 2 particles for all links

      if (isHighlighted) {
        // Highlighted links have many particles
        particles = 10;
      } else if (isMainSubsystemLink) {
        // Main subsystem links always have some particles
        particles = 6;
      }

      return {
        ...edge,
        opacity,
        particles
      };
    });
    */
  }, [edges]); // CRITICAL FIX: Only depend on edges, not highlightedLinks

  // Use a separate useMemo to combine the results
  // This ensures we don't create a new object on every render
  const result = useMemo(() => {
    return { animatedNodes, animatedEdges, pulseFactorRef };
  }, [animatedNodes, animatedEdges, pulseFactorRef]);

  return result;
}
