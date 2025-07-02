/**
 * Meta3DVisualization Component
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-3 (QL/AT Vis - Visualization)
 *
 * This component is responsible for rendering the 3D visualization of the Meta structure.
 * It uses hooks from the appropriate subsystems to handle rendering, interactions, and camera controls.
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph3D from 'react-force-graph-3d';
import { NodeDetailsPanel } from "../../../shared/components/meta/NodeDetailsPanel";

import { Node, Edge } from "../../../shared/components/meta/metaData";
// Import the useMeta3D hook from the correct Meta3DContainer
// This ensures we're using the context from the Paramasiva subsystem
import { useMeta3D } from '../4_context/Meta3DContainer';
import { useGraphInteractions3D } from '../4_context/useGraphInteractions3D';
import { useCameraControls3D } from '../4_context/useCameraControls3D';
import { useWireframeInitialization } from '../2_hooks/useWireframeInitialization';
import { initializePhysics, setupPhysicsHeartbeat } from '../0_foundation/physicsConfig';
import { useTorusAnimation3D } from '../../2_parashakti/2_hooks/useTorusAnimation3D';
import { RelationVisualizer } from '../../2_parashakti/3_visualization/RelationVisualizer';
// Import the useGraphStylingFunctions hook from Mahamaya subsystem
// This is now the single source of truth for all node and link styling
// It uses a unified approach based on virtual depth for all nodes
import { useGraphStylingFunctions } from '../../3_mahamaya/2_hooks/useGraphStylingFunctions';
import { useNodeDetails } from "../../../shared/hooks/bimba/useNodeDetails";
import { AnimationConsoleTrigger } from "../../2_parashakti/5_integration/AnimationConsoleTrigger";
import { getAnimationManager } from '../../2_parashakti/1_utils/AnimationManager';

interface Meta3DVisualizationProps {
  graphData: {
    nodes: Node[];
    links: Edge[];
  };
  graphDimensions: { width: number; height: number };
  isLoading: boolean;
  error: Error | null;
}

export const Meta3DVisualization: React.FC<Meta3DVisualizationProps> = ({
  graphData,
  graphDimensions,
  isLoading,
  error
}) => {
  const navigate = useNavigate();

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Get the Meta3D context
  const {
    graphRef,
    highlightedNodes,
    highlightedLinks,
    setHighlightedNodes,
    setHighlightedLinks,
    activeNode: activeNodeData,
    setActiveNode: setActiveNodeData,
    pulsationFactor, // Get the pulsation factor from the context
  } = useMeta3D();

  // Track physics initialization
  const physicsInitializedRef = useRef<boolean>(false);
  const [physicsInitialized, setPhysicsInitialized] = React.useState<boolean>(false);

  // Set up camera controls
  const {
    interactionStateRef,
    handleZoomIn,
    handleZoomOut,
    resetView,
    getCameraControlsProps
  } = useCameraControls3D(graphRef);

  // Set up graph interactions
  const {
    handleNodeClick,
    handleNodeHover,
    handleNodeDrag,
    handleNodeDragEnd,
    handleBackgroundClick
  } = useGraphInteractions3D(
    graphData?.nodes || [],
    graphData?.links || [],
    graphRef,
    interactionStateRef,
    highlightedNodes,
    highlightedLinks,
    setHighlightedNodes,
    setHighlightedLinks,
    activeNodeData,
    setActiveNodeData
  );

  // Get styling functions from Mahamaya subsystem
  // UNIFIED APPROACH: useGraphStylingFunctions is now the single source of truth for node styling
  // It uses a unified approach based on virtual depth for all nodes, regardless of mapped/unmapped status
  const {
    getNodeColor,
    getNodeSize,
    getLinkWidth,
    getLinkColor,
    getLinkDirectionalParticles
  } = useGraphStylingFunctions(
    highlightedNodes,
    highlightedLinks,
    pulsationFactor || 1.0
  );

  // Initialize wireframes after physics
  // We don't need the return values, but we need to call the hook
  // Pass a callback to be called when wireframes are created
  const [wireframesCreated, setWireframesCreated] = React.useState<boolean>(false);

  // Get wireframe initialization state
  const {
    diamondWireframesCreated,
    torusWireframesCreated
  } = useWireframeInitialization(
    graphRef,
    graphData,
    physicsInitialized,
    () => {
      console.log('Meta3DVisualization: Wireframes created callback');
      setWireframesCreated(true);
    }
  );

  // CRITICAL: This is the initialization sequence control point
  // We use a ref to track if we've already initialized to prevent redundant initialization
  const initializationDoneRef = useRef<boolean>(false);

  // Update wireframesCreated state when both diamond and torus wireframes are created
  useEffect(() => {
    // Skip if we've already initialized or if wireframes aren't ready
    if (initializationDoneRef.current || !diamondWireframesCreated || !torusWireframesCreated) {
      return;
    }

    console.log('Meta3DVisualization: Both wireframes created, initializing animation manager');

    // Mark as initialized to prevent redundant initialization
    initializationDoneRef.current = true;

    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Set the scene in the animation manager
    if (graphRef.current) {
      const scene = graphRef.current.scene();
      if (scene) {
        console.log('Meta3DVisualization: Setting scene in animation manager');
        animationManager.setScene(scene);
      }
    }

    // Start the animation manager
    console.log('Meta3DVisualization: Starting animation manager');
    animationManager.start();

    // Now set the wireframesCreated state to trigger animations
    setWireframesCreated(true);
  }, [diamondWireframesCreated, torusWireframesCreated, graphRef]);

  // Initialize torus animations after wireframes
  // The useTorusAnimation3D hook now uses the centralized AnimationManager
  // for better performance and coordination
  const {
    isInitialized: animationsInitialized,
    setPerformanceMode
  } = useTorusAnimation3D(graphRef);

  // Set performance mode based on device capabilities
  useEffect(() => {
    if (animationsInitialized) {
      // Check if we're on a mobile device or low-end hardware
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEnd = window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency <= 4;

      if (isMobile || isLowEnd) {
        // Use low performance mode on mobile or low-end devices
        setPerformanceMode('low');
      } else {
        // Use balanced mode by default
        setPerformanceMode('balanced');
      }
    }
  }, [animationsInitialized, setPerformanceMode]);

  // Fetch node details for the active node
  const { data: nodeDetails, error: nodeDetailsError, isLoading: isLoadingNodeDetails } = useNodeDetails(activeNodeData);

  // Track changes to highlightedNodes and highlightedLinks
  useEffect(() => {
    // Instead of refreshing the entire graph, directly update materials
    if (graphRef.current && graphRef.current.scene) {
      try {
        const scene = graphRef.current.scene();
        if (!scene) return;

        // Force a visual refresh without resetting physics
        if (graphRef.current.renderer) {
          const renderer = graphRef.current.renderer();
          if (renderer && typeof renderer.render === 'function') {
            const camera = graphRef.current.camera();
            if (scene && camera) {
              renderer.render(scene, camera);
            }
          }
        }
      } catch (e) {
        // Silent error handling
        console.debug('Error updating scene:', e);
      }
    }
  }, [graphRef, highlightedNodes, highlightedLinks]);

  // Add a camera controls recovery mechanism
  // This ensures camera controls are always re-enabled after any interaction
  useEffect(() => {
    // Set up an interval to check and recover camera controls
    const recoveryInterval = setInterval(() => {
      if (!graphRef.current) return;

      // Skip if we're currently dragging (don't interfere with drag)
      if (interactionStateRef.current.isDragging) return;

      // Check if camera controls are disabled but should be enabled
      if (typeof graphRef.current.controls === 'function') {
        const controls = graphRef.current.controls();
        if (controls && typeof controls.enabled === 'boolean' && !controls.enabled) {
          // Re-enable controls if we're not dragging
          if (!interactionStateRef.current.isDragging) {
            controls.enabled = true;
            if (typeof controls.update === 'function') {
              controls.update();
            }
            console.log('Camera controls recovered');
          }
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(recoveryInterval);
  }, [graphRef, interactionStateRef]);

  // Update visuals when pulsationFactor changes without refreshing the graph
  useEffect(() => {
    if (graphRef.current && graphRef.current.scene) {
      try {
        const scene = graphRef.current.scene();
        if (!scene) return;

        // Force a visual refresh without resetting physics
        if (graphRef.current.renderer) {
          const renderer = graphRef.current.renderer();
          if (renderer && typeof renderer.render === 'function') {
            const camera = graphRef.current.camera();
            if (scene && camera) {
              renderer.render(scene, camera);
            }
          }
        }
      } catch (e) {
        // Silent error handling
        console.debug('Error updating scene:', e);
      }
    }
  }, [graphRef, pulsationFactor]);

  // Mark component as mounted - cleanup handled by forced remounting
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize physics when component mounts
  useEffect(() => {
    // Skip if no graph ref, no graph data, or physics already initialized
    if (!graphRef.current || !graphData || physicsInitializedRef.current) {
      console.log('Physics initialization skipped:', {
        graphRefExists: !!graphRef.current,
        graphDataExists: !!graphData,
        physicsAlreadyInitialized: physicsInitializedRef.current
      });
      return;
    }

    console.log('Initializing physics...');

    // Use the initializePhysics function from physicsConfig.ts
    // This ensures all physics configuration is handled in the appropriate subsystem
    const cleanup = initializePhysics(
      graphRef,
      interactionStateRef,
      isMountedRef,
      graphData,
      physicsInitializedRef,
      setPhysicsInitialized
    );

    // Physics is already configured in initializePhysics
    // No need to call configurePhysics3D again

    return cleanup;
  }, [graphRef, graphData, interactionStateRef]);

  // Track if physics heartbeat has been set up
  const heartbeatSetupRef = useRef<boolean>(false);

  // Create a ref to highlightedNodes to avoid recreating the heartbeat when nodes are highlighted
  const highlightedNodesRef = useRef<Set<string>>(highlightedNodes);

  // Keep the ref updated when highlightedNodes changes
  useEffect(() => {
    highlightedNodesRef.current = highlightedNodes;
  }, [highlightedNodes]);

  // Set up physics heartbeat after physics is initialized
  // This ensures continuous motion even when there are no interactions
  useEffect(() => {
    // Skip if physics is not initialized, no graph ref, or heartbeat already set up
    if (!physicsInitialized || !graphRef.current || heartbeatSetupRef.current) return;

    console.log('Setting up physics heartbeat (once)...');
    heartbeatSetupRef.current = true;

    // Set up the physics heartbeat with the ref to highlightedNodes
    const heartbeatCleanup = setupPhysicsHeartbeat(
      graphRef,
      interactionStateRef,
      isMountedRef,
      highlightedNodesRef // Pass the ref instead of the actual set
    );

    // Return cleanup function
    return () => {
      console.log('Cleaning up physics heartbeat...');
      heartbeatSetupRef.current = false;
      heartbeatCleanup();
    };
  }, [graphRef, interactionStateRef, physicsInitialized]);

  // Add camera animation after initialization
  useEffect(() => {
    // Only run this effect when physics is initialized
    if (!physicsInitialized || !graphRef.current) return;

    // Wait a short moment for the graph to stabilize
    const animationTimeout = setTimeout(() => {
      if (!graphRef.current) return;

      // Get current camera position
      const currentPosition = graphRef.current.cameraPosition();

      // Calculate target position (400% zoom out and 60 degree downward tilt)
      // For 400% zoom out, we multiply the current z distance by 5
      // For 60 degree downward tilt, we set a positive y value
      const targetPosition = {
        x: currentPosition.x,
        y: Math.abs(currentPosition.z) * 7.777, //
        z: currentPosition.z * 5 // 400% zoom out
      };

      // Animate to the new position over 2.5 seconds for smoother transition
      graphRef.current.cameraPosition(
        targetPosition,
        { x: 0, y: 0, z: 0 }, // Look at center
        2500 // Duration in milliseconds - longer for smoother transition
      );
    }, 600); // Wait 800ms after physics initialization for more stability

    // Clean up the timeout if component unmounts
    return () => clearTimeout(animationTimeout);
  }, [physicsInitialized, graphRef]);

  return (
    <>
      {/* Relation Visualizer - handles all link styling and animations */}
      <RelationVisualizer wireframesCreated={wireframesCreated} />

      {/* Graph */}
      {!isLoading && !error && graphData && graphData.nodes.length > 0 && (
        <div className="relative w-full h-[700px] bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
          {/* Animation Console Trigger */}
          <div className="absolute top-4 right-4 z-10">
            <AnimationConsoleTrigger page="meta3d" />
          </div>
          <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          width={graphDimensions.width}
          height={700}
          backgroundColor="rgba(0,0,0,0)"
          // Node styling - using the unified styling functions from Mahamaya subsystem
          // These functions apply styling based on virtual depth for all nodes
          nodeRelSize={3} // Decreased back to original value
          nodeVal={getNodeSize} // Uses virtual depth for consistent sizing
          nodeColor={getNodeColor} // Uses virtual depth for consistent coloring
          nodeOpacity={0.75} // Fixed value, we'll handle opacity in getNodeColor
          nodeResolution={16}

          // Link styling - using the unified styling functions from Mahamaya subsystem
          // These functions apply consistent styling to all links
          linkWidth={getLinkWidth}
          linkColor={getLinkColor}
          linkOpacity={0.5}
          linkDirectionalParticles={getLinkDirectionalParticles}
          linkDirectionalParticleWidth={2.0}
          linkDirectionalParticleSpeed={0.005}

          // Use camera controls props from the useCameraControls3D hook
          {...getCameraControlsProps()}

          // Physics configuration - match the default preset
          cooldownTicks={Infinity}
          warmupTicks={0}
          d3AlphaDecay={0.00001}
          d3VelocityDecay={0.01}
          d3AlphaMin={0}
          numDimensions={3}

          // Interaction handlers
          onNodeDrag={handleNodeDrag}
          onNodeDragEnd={handleNodeDragEnd}
          onNodeClick={(node) => {
            if (!node) return;

            // Track click time for double-click detection
            const now = Date.now();
            // Use a type assertion with a more specific interface
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
          }}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
        />
        </div>
      )}

      {/* Node details panel */}
      {activeNodeData && (
        <div className="absolute top-4 right-4 z-10">
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
              // Close the details panel but keep the highlight
              setActiveNodeData(null);
              // Don't clear highlighted nodes/links
            }}
          />
        </div>
      )}
    </>
  );
};

export default Meta3DVisualization;
