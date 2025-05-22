/**
 * useCameraControls3D Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-4 (QL/AT Vis - Context)
 *
 * This hook is responsible for handling camera controls in the 3D visualization
 * and provides a centralized interaction state management system.
 */

import { useCallback, useRef, MutableRefObject, useEffect } from 'react';
import { ForceGraph3DInstance } from 'react-force-graph';

// Define a comprehensive interaction state interface
export interface InteractionState {
  isDragging: boolean;
  isHovering: boolean;
  isClicking: boolean;
  isInteracting: boolean; // General flag for any interaction (hover, click, drag)
  draggedNodeId: string | null;
  hoveredNodeId: string | null;
  clickedNodeId: string | null;
  cameraControlsEnabled: boolean;
  animationsEnabled: boolean;
  physicsEnabled: boolean;
  // Physics simulation state
  alpha: number;
  alphaTarget: number;
  alphaDecay: number;
  velocityDecay: number;
  alphaMin: number;
  // Store the original restart function for physics simulation
  originalRestart?: () => void;
}

/**
 * Hook for handling camera controls in the 3D visualization
 * @param fgRef Reference to the ForceGraph3D component
 * @param existingInteractionStateRef Optional existing interaction state ref
 * @returns Camera control functions and state
 */
export function useCameraControls3D(
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  existingInteractionStateRef?: MutableRefObject<InteractionState>
) {
  // Create a ref to hold the interaction state
  const interactionStateRef = existingInteractionStateRef || useRef<InteractionState>({
    isDragging: false,
    isHovering: false,
    isClicking: false,
    isInteracting: false, // Initialize the general interaction flag
    draggedNodeId: null,
    hoveredNodeId: null,
    clickedNodeId: null,
    cameraControlsEnabled: true,
    animationsEnabled: true,
    physicsEnabled: true,
    // Physics simulation state
    alpha: 0.5,
    alphaTarget: 0,
    alphaDecay: 0.001,
    velocityDecay: 0.03,
    alphaMin: 0.0005
  });

  // Methods to update interaction state
  const setDragging = useCallback((isDragging: boolean, nodeId: string | null = null) => {
    interactionStateRef.current.isDragging = isDragging;
    interactionStateRef.current.draggedNodeId = isDragging ? nodeId : null;

    // Update the general interaction flag
    interactionStateRef.current.isInteracting = isDragging ||
                                               interactionStateRef.current.isHovering ||
                                               interactionStateRef.current.isClicking;

    // Update camera controls based on drag state
    updateCameraControls();

    // Update animation state based on drag state
    // Don't disable animations completely, just slow them down
    interactionStateRef.current.animationsEnabled = true;
  }, []);

  const setHovering = useCallback((isHovering: boolean, nodeId: string | null = null) => {
    interactionStateRef.current.isHovering = isHovering;
    interactionStateRef.current.hoveredNodeId = isHovering ? nodeId : null;

    // Update the general interaction flag
    interactionStateRef.current.isInteracting = isHovering ||
                                               interactionStateRef.current.isDragging ||
                                               interactionStateRef.current.isClicking;

    // Don't change camera controls or animations on hover
  }, []);

  const setClicking = useCallback((isClicking: boolean, nodeId: string | null = null) => {
    interactionStateRef.current.isClicking = isClicking;
    interactionStateRef.current.clickedNodeId = isClicking ? nodeId : null;

    // Update the general interaction flag
    interactionStateRef.current.isInteracting = isClicking ||
                                               interactionStateRef.current.isDragging ||
                                               interactionStateRef.current.isHovering;

    // Don't change camera controls or animations on click
  }, []);

  // Method to update camera controls based on current state - optimized version
  const updateCameraControls = useCallback(() => {
    const shouldEnableControls = !interactionStateRef.current.isDragging;

    // Only update if the state has changed
    if (interactionStateRef.current.cameraControlsEnabled !== shouldEnableControls) {
      interactionStateRef.current.cameraControlsEnabled = shouldEnableControls;

      // Only access controls if we have a valid reference and the state has changed
      if (fgRef.current && typeof fgRef.current.controls === 'function') {
        const controls = fgRef.current.controls();
        if (controls && typeof controls.enabled === 'boolean' && controls.enabled !== shouldEnableControls) {
          controls.enabled = shouldEnableControls;

          // Only update if we're enabling controls (no need to update when disabling)
          if (shouldEnableControls && typeof controls.update === 'function') {
            controls.update();
          }
        }
      }
    }
  }, [fgRef, interactionStateRef]);

  // Function to ensure camera controls are enabled - optimized version
  const ensureCameraControlsEnabled = useCallback(() => {
    try {
      // Skip if ref is not available
      if (!fgRef.current) return;

      // Skip if we're already in the correct state
      if (interactionStateRef.current.isDragging || interactionStateRef.current.cameraControlsEnabled) {
        return;
      }

      // Get the ForceGraph3D instance
      const fg = fgRef.current;

      // Ensure camera controls are enabled
      if (typeof fg.controls === 'function') {
        const controls = fg.controls();
        if (controls && typeof controls.enabled === 'boolean' && !controls.enabled) {
          // Re-enable controls
          controls.enabled = true;
          interactionStateRef.current.cameraControlsEnabled = true;

          // Force a controls update - use requestAnimationFrame for better performance
          if (typeof controls.update === 'function') {
            requestAnimationFrame(() => {
              try {
                controls.update();
              } catch (e) {
                // Silent error handling
              }
            });
          }
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }, [fgRef, interactionStateRef]);

  // View control handlers - optimized versions
  // Use a ref to track ongoing camera animations to prevent overlapping animations
  const cameraAnimationInProgressRef = useRef(false);

  const handleZoomIn = useCallback(() => {
    // Skip if animation already in progress or no graph ref
    if (cameraAnimationInProgressRef.current || !fgRef.current) return;

    // Mark animation as in progress
    cameraAnimationInProgressRef.current = true;

    // Use requestAnimationFrame for smoother animation scheduling
    requestAnimationFrame(() => {
      try {
        if (!fgRef.current) return;

        const distance = fgRef.current.cameraPosition().z;
        fgRef.current.cameraPosition(
          { z: distance * 0.8 }, // Zoom in by 20%
          null,
          500, // 500ms animation
          // Callback when animation completes
          () => { cameraAnimationInProgressRef.current = false; }
        );
      } catch (e) {
        // Reset flag in case of error
        cameraAnimationInProgressRef.current = false;
      }
    });
  }, [fgRef]);

  const handleZoomOut = useCallback(() => {
    // Skip if animation already in progress or no graph ref
    if (cameraAnimationInProgressRef.current || !fgRef.current) return;

    // Mark animation as in progress
    cameraAnimationInProgressRef.current = true;

    // Use requestAnimationFrame for smoother animation scheduling
    requestAnimationFrame(() => {
      try {
        if (!fgRef.current) return;

        const distance = fgRef.current.cameraPosition().z;
        fgRef.current.cameraPosition(
          { z: distance * 1.2 }, // Zoom out by 20%
          null,
          500, // 500ms animation
          // Callback when animation completes
          () => { cameraAnimationInProgressRef.current = false; }
        );
      } catch (e) {
        // Reset flag in case of error
        cameraAnimationInProgressRef.current = false;
      }
    });
  }, [fgRef]);

  const resetView = useCallback(() => {
    // Skip if animation already in progress or no graph ref
    if (cameraAnimationInProgressRef.current || !fgRef.current) return;

    // Mark animation as in progress
    cameraAnimationInProgressRef.current = true;

    // Use requestAnimationFrame for smoother animation scheduling
    requestAnimationFrame(() => {
      try {
        if (!fgRef.current) return;

        fgRef.current.cameraPosition(
          { x: 0, y: 0, z: 1000 }, // Reset to default position
          { x: 0, y: 0, z: 0 },    // Look at center
          1000,                    // 1000ms animation
          // Callback when animation completes
          () => { cameraAnimationInProgressRef.current = false; }
        );
      } catch (e) {
        // Reset flag in case of error
        cameraAnimationInProgressRef.current = false;
      }
    });
  }, [fgRef]);

  // Function to safely manage drag controls without patching
  const setupDragControls = useCallback(() => {
    if (!fgRef.current) return;

    try {
      // Instead of patching the drag controls, we'll use the ForceGraph3D's
      // onNodeDrag and onNodeDragEnd props to manage camera controls
      // This is a more reliable approach that avoids timing issues

      // We'll implement the actual drag handling in Meta3DIntegration.tsx
      // This function just ensures the interaction state is properly initialized

      // Initialize the interaction state
      interactionStateRef.current.isDragging = false;
      interactionStateRef.current.draggedNodeId = null;
      interactionStateRef.current.cameraControlsEnabled = true;

      // Ensure camera controls are enabled by default
      if (fgRef.current && typeof fgRef.current.controls === 'function') {
        const controls = fgRef.current.controls();
        if (controls && typeof controls.enabled === 'boolean') {
          controls.enabled = true;
        }
      }
    } catch (error) {
      console.error('Error in setupDragControls:', error);
    }
  }, [fgRef]);

  // Configure physics for continuous motion with simplified approach
  const configurePhysics = useCallback(() => {
    if (!fgRef.current) return;

    // Configure physics for 3D
    const fg = fgRef.current;

    // Set up physics forces
    if (fg.d3Force) {
      try {
        // Ensure 3D physics
        const simulation = fg.d3Force();
        if (simulation && simulation.numDimensions && typeof simulation.numDimensions === 'function') {
          simulation.numDimensions(3);
        }

        // Configure physics parameters for fluid motion
        if (simulation) {
          // SIMPLIFIED PHYSICS CONFIGURATION
          // Use moderate values that work well without constant adjustments

          // Set alphaDecay to a moderate value for stable simulation
          if (typeof simulation.alphaDecay === 'function') simulation.alphaDecay(0.005);

          // Set alphaMin to a moderate value to prevent excessive jiggling
          if (typeof simulation.alphaMin === 'function') simulation.alphaMin(0.001);

          // Set alphaTarget to 0 for natural settling
          if (typeof simulation.alphaTarget === 'function') simulation.alphaTarget(0);

          // Set velocityDecay to a moderate value for balanced motion
          if (typeof simulation.velocityDecay === 'function') simulation.velocityDecay(0.05);

          // Apply a moderate alpha boost to start the simulation
          if (typeof simulation.alpha === 'function') {
            simulation.alpha(0.5);

            // Use the simulation's own restart function
            if (typeof simulation.restart === 'function') {
              simulation.restart();
            }
          }
        }
      } catch (error) {
        console.error('Error configuring physics:', error);
      }
    }
  }, [fgRef]);

  // Set up an effect to ensure camera controls are enabled when the component mounts
  useEffect(() => {
    // Setup drag controls (without patching)
    setupDragControls();

    // Configure physics
    configurePhysics();

    // Ensure camera controls are enabled
    ensureCameraControlsEnabled();
  }, [setupDragControls, configurePhysics, ensureCameraControlsEnabled]);

  /**
   * Set up continuous monitoring of camera controls
   * @param isMountedRef Reference to track if the component is mounted
   * @returns Cleanup function to clear the interval
   */
  const setupCameraControlsMonitoring = useCallback((isMountedRef: MutableRefObject<boolean>) => {
    if (!isMountedRef.current) return () => {};

    // Check camera controls less frequently to reduce overhead (250ms instead of 100ms)
    // This still provides responsive recovery while reducing CPU usage
    const intervalId = setInterval(() => {
      try {
        // Skip if component is unmounted or ref is not available
        if (!isMountedRef.current || !fgRef.current) return;

        // Get the ForceGraph3D instance
        const fg = fgRef.current;

        // Check if we're currently dragging
        const isDragging = fg.__isDragging === true;

        // Only enable controls if we're not dragging and controls are disabled
        // This avoids unnecessary control updates
        if (!isDragging && interactionStateRef.current.cameraControlsEnabled === false) {
          // Ensure camera controls are enabled
          if (typeof fg.controls === 'function') {
            const controls = fg.controls();
            if (controls && typeof controls.enabled === 'boolean' && !controls.enabled) {
              // Re-enable controls
              controls.enabled = true;
              interactionStateRef.current.cameraControlsEnabled = true;

              // Force a controls update
              if (typeof controls.update === 'function') {
                controls.update();
              }
            }
          }
        }
      } catch (error) {
        // Silent error - don't log to avoid console spam
      }
    }, 250); // Reduced frequency from 100ms to 250ms

    // Return cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [fgRef, interactionStateRef]);

  /**
   * Get camera controls props for ForceGraph3D
   * @returns Camera controls props for ForceGraph3D
   */
  const getCameraControlsProps = useCallback(() => {
    return {
      controlType: 'orbit' as 'orbit', // Type assertion to fix type issue
      enableNavigationControls: true,
      showNavInfo: false
    };
  }, []);

  return {
    interactionStateRef,
    setDragging,
    setHovering,
    setClicking,
    handleZoomIn,
    handleZoomOut,
    resetView,
    ensureCameraControlsEnabled,
    setupDragControls,
    configurePhysics,
    updateCameraControls,
    setupCameraControlsMonitoring,
    getCameraControlsProps
  };
}
