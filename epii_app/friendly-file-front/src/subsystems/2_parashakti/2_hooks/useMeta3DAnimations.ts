/**
 * useMeta3DAnimations Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-2 (Harmonic Layer - Hooks)
 *
 * This hook provides a way to register and manage Meta3D animations
 * using the centralized AnimationManager.
 */

import { useRef, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority,
  AnimationId
} from '../1_utils/AnimationManager';
import {
  startTorusRotation,
  stopTorusRotation,
  updateTorusRotations
} from '../../1_paramasiva/1_utils/torusAnimationUtils';
import {
  startTorusPulse,
  stopTorusPulse,
  updateTorusPulses
} from '../1_utils/torusPulseUtils';

interface Meta3DAnimationState {
  torusRotationId: AnimationId | null;
  torusPulseId: AnimationId | null;
  linkPulseId: AnimationId | null;
  isInitialized: boolean;
}

/**
 * Hook for managing Meta3D animations
 * @param fgRef Reference to the ForceGraph3D component
 * @param setPulsationFactor Function to update the pulsation factor in the Meta3D context
 * @param wireframesCreated Whether the wireframes have been created
 * @returns Animation state and control functions
 */
export function useMeta3DAnimations(
  fgRef: MutableRefObject<any | null>,
  setPulsationFactor?: (factor: number) => void,
  wireframesCreated: boolean = false
) {
  // Animation state
  const animationStateRef = useRef<Meta3DAnimationState>({
    torusRotationId: null,
    torusPulseId: null,
    linkPulseId: null,
    isInitialized: false
  });

  // Component mounted ref
  const isMountedRef = useRef<boolean>(false);

  // Initialize animations
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Debug mode is disabled for performance
    animationManager.setDebugMode(false);

    // Skip initialization if already initialized
    if (animationStateRef.current.isInitialized) {
      console.log('[useMeta3DAnimations] Already initialized, skipping');
      return;
    }

    // CRITICAL: Only initialize once
    // This prevents redundant initialization attempts
    console.log('[useMeta3DAnimations] First initialization attempt');

    // Function to initialize animations when the scene and wireframes are ready
    const initializeAnimations = () => {
      console.log('[useMeta3DAnimations] Attempting to initialize animations');

      if (!isMountedRef.current || !fgRef.current) {
        console.log('[useMeta3DAnimations] Component not mounted or fgRef not available');
        return;
      }

      try {
        // Get the scene
        const scene = fgRef.current.scene();
        if (!scene) {
          console.log('[useMeta3DAnimations] Scene not available');
          return;
        }

        console.log('[useMeta3DAnimations] Scene available, continuing initialization');

        // REMOVED: Setting scene in animation manager
        // The scene is already set in Meta3DVisualization.tsx
        // This prevents multiple scene settings which could cause inconsistencies

        // If wireframesCreated is true from the prop, we can skip the check
        if (wireframesCreated) {
          console.log('[useMeta3DAnimations] Wireframes already created via prop, continuing');
        } else {
          // Check if torus wireframes exist
          const torusGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
          console.log('[useMeta3DAnimations] Checking for torus wireframes:',
            torusGroup ? `Found with ${torusGroup.children.length} children` : 'Not found');

          if (!torusGroup || torusGroup.children.length === 0) {
            // Torus wireframes don't exist yet, check again later
            console.log('[useMeta3DAnimations] Torus wireframes not ready, scheduling retry');
            setTimeout(initializeAnimations, 100);
            return;
          }
        }

        console.log('[useMeta3DAnimations] Torus wireframes ready, registering animations');

        // Register torus rotation animation
        // Use performance.now() for consistent timing with the animation manager
        startTorusRotation(performance.now());
        const torusRotationId = animationManager.registerAnimation(
          (time, _deltaTime, scene) => {
            try {
              if (scene) {
                // Update torus rotations with the current time from the animation manager
                // Let ForceGraph3D handle the rendering
                updateTorusRotations(scene, time);
              }
            } catch (error) {
              console.error('Error in torus rotation animation:', error);
            }
          },
          {
            subsystem: AnimationSubsystem.PARAMASIVA,
            category: AnimationCategory.WIREFRAME,
            priority: AnimationPriority.MEDIUM,
            updateInterval: 8, // 120fps - double the refresh rate for smoother animation
            name: 'Meta3D Torus Rotation'
          }
        );
        animationStateRef.current.torusRotationId = torusRotationId;

        // Register torus pulse animation
        // Use performance.now() for consistent timing with the animation manager
        startTorusPulse(performance.now());
        const torusPulseId = animationManager.registerAnimation(
          (time, _deltaTime, scene) => {
            try {
              if (scene) {
                // Update torus pulses with the current time from the animation manager
                // Let ForceGraph3D handle the rendering
                updateTorusPulses(scene, time);
              }
            } catch (error) {
              console.error('Error in torus pulse animation:', error);
            }
          },
          {
            subsystem: AnimationSubsystem.PARAMASIVA,
            category: AnimationCategory.WIREFRAME,
            priority: AnimationPriority.MEDIUM, // Same priority as torus rotation for better synchronization
            updateInterval: 8, // 120fps - double the refresh rate for smoother animation
            name: 'Meta3D Torus Pulse'
          }
        );
        animationStateRef.current.torusPulseId = torusPulseId;

        // Register link pulse animation if setPulsationFactor is provided
        if (setPulsationFactor) {
          // Keep track of the last pulse factor to avoid unnecessary updates
          let lastPulseFactor = 0;

          const linkPulseId = animationManager.registerAnimation(
            (time) => {
              try {
                // Calculate pulse factor based on time using a sine wave pattern
                const pulseFactor = 0.7 + 0.3 * Math.sin(time * 0.002);

                // Only update if the change is significant (reduces graph refreshes)
                if (Math.abs(pulseFactor - lastPulseFactor) > 0.02) {
                  // Update the global pulse factor
                  setPulsationFactor(pulseFactor);
                  lastPulseFactor = pulseFactor;
                }
              } catch (error) {
                console.error('Error in link pulse animation:', error);
              }
            },
            {
              subsystem: AnimationSubsystem.PARAMASIVA,
              category: AnimationCategory.LINK,
              priority: AnimationPriority.MEDIUM, // Changed from HIGH to MEDIUM
              updateInterval: 8, // 120fps - double the refresh rate for smoother animation
              name: 'Meta3D Link Pulse'
            }
          );
          animationStateRef.current.linkPulseId = linkPulseId;
        }

        // Force high quality animations
        animationManager.setPerformanceMode('high');

        // Start the animation manager
        animationManager.start();

        // Mark as initialized
        animationStateRef.current.isInitialized = true;

        console.log('[useMeta3DAnimations] Animations initialized successfully');
      } catch (error) {
        console.error('[useMeta3DAnimations] Error initializing animations:', error);
      }
    };

    // CRITICAL: Simplified initialization sequence
    // This is a one-time check that doesn't retry endlessly
    const initializeOnce = () => {
      // Only proceed if component is mounted, graph ref exists, and not already initialized
      if (!isMountedRef.current || !fgRef.current || animationStateRef.current.isInitialized) {
        return;
      }

      // If wireframes are already created via prop, initialize immediately
      if (wireframesCreated) {
        console.log('[useMeta3DAnimations] Wireframes already created via prop, initializing immediately');
        initializeAnimations();
        return;
      }

      // Otherwise, check if the scene exists
      const scene = fgRef.current.scene();
      if (!scene) {
        console.log('[useMeta3DAnimations] Scene not available yet');
        return;
      }

      // Check if torus wireframes exist
      const torusGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
      if (!torusGroup || torusGroup.children.length === 0) {
        console.log('[useMeta3DAnimations] Torus wireframes not ready yet');
        return;
      }

      // If we get here, everything is ready - initialize animations
      console.log('[useMeta3DAnimations] All prerequisites ready, initializing animations');
      initializeAnimations();
    };

    // Call initializeOnce immediately
    initializeOnce();

    // Capture animation state at the time the effect runs
    // This prevents React warnings about stale refs in cleanup
    const animationState = { ...animationStateRef.current };

    // Clean up
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;

      // Use the captured animation IDs
      const { torusRotationId, torusPulseId, linkPulseId } = animationState;

      // Get the animation manager instance
      const animationManager = getAnimationManager();

      // Unregister animations
      if (torusRotationId) {
        stopTorusRotation();
        animationManager.unregisterAnimation(torusRotationId);
      }

      if (torusPulseId) {
        stopTorusPulse();
        animationManager.unregisterAnimation(torusPulseId);
      }

      if (linkPulseId) {
        animationManager.unregisterAnimation(linkPulseId);
      }

      // Reset animation state
      animationStateRef.current = {
        isInitialized: false,
        torusRotationId: null,
        torusPulseId: null,
        linkPulseId: null
      };

      console.log('[useMeta3DAnimations] Cleanup complete');
    };
  }, [fgRef, setPulsationFactor, wireframesCreated]);

  /**
   * Enable or disable torus rotation animation
   * @param enabled Whether the animation should be enabled
   */
  const setTorusRotationEnabled = (enabled: boolean) => {
    if (animationStateRef.current.torusRotationId) {
      const animationManager = getAnimationManager();
      animationManager.setAnimationEnabled(animationStateRef.current.torusRotationId, enabled);
    }
  };

  /**
   * Enable or disable torus pulse animation
   * @param enabled Whether the animation should be enabled
   */
  const setTorusPulseEnabled = (enabled: boolean) => {
    if (animationStateRef.current.torusPulseId) {
      const animationManager = getAnimationManager();
      animationManager.setAnimationEnabled(animationStateRef.current.torusPulseId, enabled);
    }
  };

  /**
   * Enable or disable link pulse animation
   * @param enabled Whether the animation should be enabled
   */
  const setLinkPulseEnabled = (enabled: boolean) => {
    if (animationStateRef.current.linkPulseId) {
      const animationManager = getAnimationManager();
      animationManager.setAnimationEnabled(animationStateRef.current.linkPulseId, enabled);
    }
  };

  /**
   * Set the performance mode for all animations
   * @param mode Performance mode ('high', 'balanced', or 'low')
   */
  const setPerformanceMode = (mode: 'high' | 'balanced' | 'low') => {
    const animationManager = getAnimationManager();
    animationManager.setPerformanceMode(mode);
  };

  /**
   * Get the current performance metrics
   */
  const getPerformanceMetrics = () => {
    const animationManager = getAnimationManager();
    return animationManager.getPerformanceMetrics();
  };

  return {
    isInitialized: animationStateRef.current.isInitialized,
    setTorusRotationEnabled,
    setTorusPulseEnabled,
    setLinkPulseEnabled,
    setPerformanceMode,
    getPerformanceMetrics
  };
}
