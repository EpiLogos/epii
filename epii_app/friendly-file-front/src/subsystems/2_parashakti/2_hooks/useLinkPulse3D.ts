/**
 * useLinkPulse3D Hook
 *
 * This hook provides a way to use the link pulse animation in 3D React components.
 * It uses the AnimationManager for better performance and coordination.
 */

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  startLinkPulse,
  stopLinkPulse,
  calculatePulseFactor
} from '../1_utils/linkPulseUtils';
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority,
  AnimationId
} from '../1_utils/AnimationManager';

/**
 * Hook for using the link pulse animation in 3D
 * @param fgRef - Reference to the ForceGraph3D component
 * @param highlightedLinks - Set of highlighted link IDs
 * @param refreshInterval - Optional interval in ms for throttling refreshes (default: 150ms)
 * @returns The current pulse factor reference
 */
export function useLinkPulse3D(
  fgRef: React.RefObject<any>,
  highlightedLinks: Set<string>,
  refreshInterval: number = 150 // Reduced frequency for better performance
) {
  // Reference for the pulse factor
  const pulseFactorRef = useRef<number>(1.0);

  // Reference for the last refresh time
  const lastRefreshTimeRef = useRef<number>(0);

  // Reference for the animation ID
  const animationIdRef = useRef<AnimationId | null>(null);

  // Reference for whether the component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Set up pulse animation using AnimationManager
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Start the pulse animation
    startLinkPulse();

    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Register with the animation manager
    const animationId = animationManager.registerAnimation(
      (time) => {
        // Skip if component is unmounted
        if (!isMountedRef.current) return;

        // Calculate the current pulse factor
        const pulseFactor = calculatePulseFactor();

        // Update the pulse factor reference
        pulseFactorRef.current = pulseFactor;

        // Throttle refreshes to the specified interval
        const now = time;
        const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

        // Always update on the flash point (when pulseFactor is near max)
        const isFlashPoint = pulseFactor > 1.8; // 90% of max (2.0)

        if (isFlashPoint || timeSinceLastRefresh >= refreshInterval) {
          try {
            // Get the ForceGraph3D component
            if (fgRef.current && fgRef.current.scene) {
              const scene = fgRef.current.scene();
              if (!scene) return;

              // Force a visual refresh without resetting physics
              if (fgRef.current.renderer) {
                const renderer = fgRef.current.renderer();
                if (renderer && typeof renderer.render === 'function') {
                  const camera = fgRef.current.camera();
                  if (scene && camera) {
                    renderer.render(scene, camera);
                  }
                }
              }
            }

            lastRefreshTimeRef.current = now;
          } catch (error) {
            // Silently handle errors
            console.debug('Error in pulse animation callback:', error);
          }
        }
      },
      {
        subsystem: AnimationSubsystem.PARASHAKTI,
        category: AnimationCategory.LINK,
        priority: AnimationPriority.MEDIUM,
        updateInterval: Math.min(refreshInterval, 33), // Use the smaller of refreshInterval or 33ms
        name: 'Link Pulse Animation'
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
      // Mark as unmounted
      isMountedRef.current = false;

      // Unregister the animation
      if (animationIdRef.current) {
        const animationManager = getAnimationManager();
        animationManager.unregisterAnimation(animationIdRef.current);
        animationIdRef.current = null;
      }

      stopLinkPulse();
    };
  }, [fgRef, highlightedLinks, refreshInterval]);

  return pulseFactorRef;
}
