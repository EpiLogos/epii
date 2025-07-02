/**
 * Meta2DVisualization Component
 *
 * This component is responsible for rendering the 2D graph visualization.
 * It follows the exact same pattern as Meta3DVisualization.
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-3 (Bimba Vis / Geom Ground - Visualization)
 * - Contains the SINGLE ForceGraph2D component
 * - Handles all graph rendering, styling, and interactions
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';

import { NodeDetailsPanel } from "../../../shared/components/meta/NodeDetailsPanel";
import { Node, Edge } from "../../../shared/components/meta/metaData";
import { useMeta2D } from '../4_context/Meta2DContainer';
import { useGraphInteractions } from '../4_context/useGraphInteractions';
import { useGraphRendering } from './useGraphRendering';
import { useLinkPulse, applyPulseToLinkColor } from '../../2_parashakti/2_hooks/useLinkPulse';
import { configurePhysics2D } from '../0_foundation/physicsConfig';
import { getAnimationManager } from '../../2_parashakti/1_utils/AnimationManager';
import { useNodeDetails } from "../../../shared/hooks/bimba/useNodeDetails";
import { AnimationConsoleTrigger } from "../../2_parashakti/5_integration/AnimationConsoleTrigger";

interface Meta2DVisualizationProps {
  graphData: {
    nodes: Node[];
    links: Edge[];
  };
  graphDimensions: { width: number; height: number };
  isLoading: boolean;
  error: Error | null;
}

export const Meta2DVisualization: React.FC<Meta2DVisualizationProps> = ({
  graphData,
  graphDimensions,
  isLoading,
  error
}) => {
  const navigate = useNavigate();

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Ref for the graph container to get actual dimensions
  const graphContainerRef = useRef<HTMLDivElement>(null);

  // Get the Meta2D context - this is the single source of truth for state
  const {
    graphRef,
    highlightedNodes,
    highlightedLinks,
    setHighlightedNodes,
    setHighlightedLinks,
    activeNode: activeNodeData,
    setActiveNode: setActiveNodeData,
  } = useMeta2D();

  // Track physics initialization
  const physicsInitializedRef = useRef<boolean>(false);
  const [physicsInitialized, setPhysicsInitialized] = useState<boolean>(false);

  // Track actual container dimensions
  const [actualDimensions, setActualDimensions] = useState({ width: 800, height: 600 });

  // Handle interactions with physics management - pass context setters
  const {
    handleNodeClick,
    handleNodeHover,
    handleBackgroundClick,
    interactionStateRef
  } = useGraphInteractions(
    graphData?.nodes || [],
    graphData?.links || [],
    graphRef,
    setHighlightedNodes,
    setHighlightedLinks,
    activeNodeData,
    setActiveNodeData
  );

  // Get node details for the active node (like Meta3D)
  const {
    data: nodeDetails,
    isLoading: isLoadingNodeDetails,
    error: nodeDetailsError
  } = useNodeDetails(activeNodeData || null);

  // Debug logging (can be removed once confirmed working)
  useEffect(() => {
    if (activeNodeData) {
      console.log('[Meta2D] Active node set:', activeNodeData);
      console.log('[Meta2D] Node details:', nodeDetails);
      console.log('[Meta2D] Loading:', isLoadingNodeDetails);
    }
  }, [activeNodeData, nodeDetails, isLoadingNodeDetails]);

  // Get custom rendering functions
  const { drawHexagon } = useGraphRendering();

  // Set up link pulse animation with AnimationManager integration
  const pulseFactorRef = useLinkPulse((_pulseFactor) => {
    // Skip refresh() call that causes physics resets
    // AnimationManager coordinates animations, ForceGraph2D handles visual updates automatically
    // The linkColor function will be called naturally during the animation loop
  }, 100); // Animation timing for smoother transitions

  // Memoize graph data to prevent ForceGraph2D restarts
  const memoizedGraphData = useMemo(() => ({
    nodes: graphData?.nodes || [],
    links: graphData?.links || []
  }), [graphData?.nodes, graphData?.links]);

  // Create STABLE styling functions exactly like Meta3D does
  const nodeCanvasObjectCallback = useCallback((node, ctx, globalScale) => {
    drawHexagon(node, ctx, globalScale, highlightedNodes, activeNodeData);
  }, [drawHexagon, highlightedNodes, activeNodeData]);

  const linkWidthCallback = useCallback(link => {
    const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;
    return highlightedLinks.has(id) ? 2 : link.width || 0.5;
  }, [highlightedLinks]);

  const linkColorCallback = useCallback(link => {
    // Get link ID
    const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;

    // Check if link is highlighted
    const isHighlighted = highlightedLinks.has(id);

    // Get base color
    const baseColor = link.color || 'rgba(180, 180, 180, 0.3)';

    // Apply pulse to the link color
    return applyPulseToLinkColor(baseColor, pulseFactorRef.current, isHighlighted);
  }, [highlightedLinks, pulseFactorRef]);

  const linkDirectionalParticlesCallback = useCallback(link => {
    const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;
    return highlightedLinks.has(id) ? 4 : 1;
  }, [highlightedLinks]);

  const onNodeClickCallback = useCallback((node) => {
    if (!node) return;

    // Track click time for double-click detection (exactly like Meta3D)
    const now = Date.now();
    interface NodeWithClickTime extends Node {
      __lastClickTime?: number;
    }
    const typedNode = node as NodeWithClickTime;
    const lastClickTime = typedNode.__lastClickTime || 0;
    typedNode.__lastClickTime = now;

    // Check if this is a double-click (within 300ms)
    const isDoubleClick = now - lastClickTime < 300;

    if (isDoubleClick) {
      // Double-click: show node details panel
      // The highlight is already set by the first click
      setActiveNodeData(node);
    } else {
      // Single click: toggle highlight only (no node details)
      handleNodeClick(node);
    }
  }, [handleNodeClick, setActiveNodeData]);

  const onNodeDragCallback = useCallback(node => {
    if (!node || !node.id) return;

    // Mark the node as being dragged
    if (!node.__dragging) {
      node.__dragging = true;

      // For mapped nodes, temporarily remove fixed positions during drag (like Meta3D)
      if (node.bimbaCoordinate) {
        // Store original position for restoration after drag
        node.__originalFx = node.fx;
        node.__originalFy = node.fy;

        // Remove fixed positions to allow movement
        node.fx = undefined;
        node.fy = undefined;
      }

      // Update interaction state for physics management
      if (interactionStateRef.current) {
        interactionStateRef.current.isDragging = true;
        interactionStateRef.current.draggedNodeId = node.id;
        interactionStateRef.current.isInteracting = true;
      }
    }
  }, []);

  const onNodeDragEndCallback = useCallback(node => {
    if (!node || !node.id) return;

    // Clear the dragging flag on the node
    delete node.__dragging;

    // For mapped nodes, restore their original fixed positions (like Meta3D)
    if (node.bimbaCoordinate) {
      // Get the original fixed positions
      const originalFx = node.__originalFx;
      const originalFy = node.__originalFy;

      // Restore fixed positions if they exist
      if (originalFx !== undefined) node.fx = originalFx;
      if (originalFy !== undefined) node.fy = originalFy;

      // Clean up temporary properties
      delete node.__originalFx;
      delete node.__originalFy;
    }

    // Reset interaction state
    if (interactionStateRef.current) {
      interactionStateRef.current.isDragging = false;
      interactionStateRef.current.draggedNodeId = null;
      interactionStateRef.current.isInteracting = false;
    }

    // Restore physics stability
    if (graphRef.current && typeof graphRef.current.d3Force === 'function') {
      const simulation = graphRef.current.d3Force();
      if (simulation && typeof simulation.alpha === 'function') {
        simulation.alpha(Math.max(simulation.alpha(), 0.1));
      }
    }
  }, []);

  // REMOVED: Camera controls - no longer needed since controls were removed

  // Track when physics stabilizes for initial animation
  useEffect(() => {
    if (graphData?.nodes && graphData.nodes.length > 0 && !physicsInitialized) {
      const timeout = setTimeout(() => {
        setPhysicsInitialized(true);
      }, 1000); // Wait 1 second for initial physics stabilization

      return () => clearTimeout(timeout);
    }
  }, [graphData?.nodes, physicsInitialized]);

  // Measure container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (graphContainerRef.current) {
        const rect = graphContainerRef.current.getBoundingClientRect();
        setActualDimensions({
          width: rect.width || 800,
          height: 700 // Fixed height to match container
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);

    // Use ResizeObserver for more accurate container size tracking
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (graphContainerRef.current) {
      resizeObserver.observe(graphContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // Initial zoom-out animation after physics stabilization
  useEffect(() => {
    if (!physicsInitialized || !graphRef.current) return;

    const animationTimeout = setTimeout(() => {
      if (!graphRef.current) return;

      // Find root node for centering
      const rootNode = graphData?.nodes?.find(node => node.bimbaCoordinate === '#');
      const centerX = rootNode ? rootNode.x || 0 : 0;
      const centerY = rootNode ? rootNode.y || 0 : 0;

      // Zoom out to 0.08 (12x zoom out) and center on root for elegant initial view
      graphRef.current.centerAt(centerX, centerY, 1000);
      graphRef.current.zoom(0.08, 1000);
    }, 600); // Wait 600ms after physics initialization for stability

    return () => clearTimeout(animationTimeout);
  }, [physicsInitialized, graphData?.nodes]);

  // Mark component as mounted - cleanup handled by forced remounting
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Configure physics ONLY on initial mount and when graph structure fundamentally changes
  useEffect(() => {
    if (!graphRef.current || !graphData?.nodes || graphData.nodes.length === 0) return;

    // Get the force simulation
    const simulation = graphRef.current.d3Force();
    if (!simulation) return;

    // Configure physics with interaction state management
    configurePhysics2D(simulation, graphData.nodes, graphData.links || [], interactionStateRef);

    console.log('[Meta2D] Physics configured for', graphData.nodes.length, 'nodes');

    // Start AnimationManager for coordinated animations
    const animationManager = getAnimationManager();
    if (!animationManager.isRunning) {
      animationManager.start();
      console.log('[Meta2D] AnimationManager started');
    }
  }, [graphData?.nodes?.length, graphData?.links?.length]);

  return (
    <>
      {/* Graph */}
      {!isLoading && !error && graphData && graphData.nodes.length > 0 && (
        <div
          ref={graphContainerRef}
          className="relative w-full h-[700px] bg-epii-dark/40 neo-glow rounded-lg overflow-hidden"
          style={{ minHeight: '700px' }}
        >
          {/* Animation Console Trigger */}
          <div className="absolute top-4 right-4 z-10">
            <AnimationConsoleTrigger page="meta2d" />
          </div>
          <ForceGraph2D
          ref={graphRef}
          graphData={memoizedGraphData}
          width={actualDimensions.width}
          height={actualDimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          // Physics engine configuration
          cooldownTicks={Infinity} // Keep physics simulation running indefinitely
          warmupTicks={100}
          d3AlphaDecay={0.005} // Extremely slow decay for very stable behavior
          d3VelocityDecay={0.1} // Significantly reduced for much more fluid movement
          d3AlphaMin={0.0005} // Lower minimum to allow simulation to run longer
          // Node styling
          nodeRelSize={3.0} // Further reduced for smaller, depth-appropriate nodes
          nodeVal={node => node.val} // Use pre-calculated size
          nodeColor={node => node.color} // Use pre-calculated color
          // Custom node rendering - STABLE function using memoized callbacks
          nodeCanvasObject={nodeCanvasObjectCallback}
          // Link styling - STABLE functions using memoized callbacks
          linkWidth={linkWidthCallback}
          linkColor={linkColorCallback}
          linkDirectionalParticles={linkDirectionalParticlesCallback}
          linkDirectionalParticleWidth={2.0}
          linkDirectionalParticleSpeed={0.005}
          // Interaction handlers - STABLE functions
          onNodeClick={onNodeClickCallback}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
          // Handle node drag events with physics management
          onNodeDrag={onNodeDragCallback}
          onNodeDragEnd={onNodeDragEndCallback}
        />
        </div>
      )}

      {/* Node details panel - exactly like Meta3D */}
      {activeNodeData && (
        <NodeDetailsPanel
          activeNode={{
            ...activeNodeData,
            details: nodeDetails ? {
              properties: nodeDetails.properties,
              connections: nodeDetails.connections,
              notionResolution: nodeDetails.notionResolution
            } : null,
            connections: Array.from(highlightedNodes).filter(id => id !== activeNodeData.id),
            highlightedLinks: graphData?.links.filter(link => highlightedLinks.has(link.id)) || [],
            isLoading: isLoadingNodeDetails,
            error: nodeDetailsError?.message
          }}
          onClose={() => {
            // Close the details panel but keep the highlight (like Meta3D)
            setActiveNodeData(null);
            // Don't clear highlighted nodes/links
          }}
        />
      )}
    </>
  );
};

export default Meta2DVisualization;
