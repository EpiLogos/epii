/**
 * useLinkPulse3D Hook
 *
 * This hook provides a way to use the link pulse animation in 3D React components.
 * It handles the animation loop and provides the current pulse factor.
 */

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  startLinkPulse,
  stopLinkPulse,
  calculatePulseFactor
} from '../subsystems/2_parashakti/1_utils/linkPulseUtils';

/**
 * Hook for using the link pulse animation in 3D
 * @param fgRef - Reference to the ForceGraph3D component
 * @param highlightedLinks - Set of highlighted link IDs
 * @param refreshInterval - Optional interval in ms for throttling refreshes (default: 100ms)
 * @returns The current pulse factor reference
 */
export function useLinkPulse3D(
  fgRef: React.RefObject<any>,
  highlightedLinks: Set<string>,
  refreshInterval: number = 100 // Default to 100ms (10 refreshes per second)
) {
  // Reference for the pulse factor
  const pulseFactorRef = useRef<number>(1.0);

  // Reference for the last refresh time
  const lastRefreshTimeRef = useRef<number>(0);

  // Reference for the animation frame ID
  const animationFrameIdRef = useRef<number | null>(null);

  // Reference for whether the component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Reference for the original linkOpacity value
  const originalLinkOpacityRef = useRef<number>(0.5);

  // Set up pulse animation
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Start the pulse animation
    startLinkPulse();

    // Store the original linkOpacity value
    if (fgRef.current && typeof fgRef.current.linkOpacity === 'function') {
      originalLinkOpacityRef.current = fgRef.current.linkOpacity();
    }

    // Animation function
    const animate = () => {
      // Skip if component is unmounted
      if (!isMountedRef.current) return;

      // Calculate the current pulse factor
      const pulseFactor = calculatePulseFactor();

      // Update the pulse factor reference
      pulseFactorRef.current = pulseFactor;

      // Throttle refreshes to the specified interval
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

      // Always update on the flash point (when pulseFactor is near max)
      const isFlashPoint = pulseFactor > 1.8; // 90% of max (2.0)

      if (isFlashPoint || timeSinceLastRefresh >= refreshInterval) {
        try {
          // Get the ForceGraph3D component
          if (fgRef.current) {
            // Calculate the new opacity based on the pulse factor
            // Base opacity is 0.5 (from the component)
            const baseOpacity = originalLinkOpacityRef.current;
            const maxOpacity = baseOpacity * 1.7; // Maximum opacity 70% higher
            const minOpacity = baseOpacity / 3; // Minimum opacity (3x lower)

            // Calculate final opacity using the pulse factor
            // Scale between minOpacity and maxOpacity
            const finalOpacity = minOpacity + (maxOpacity - minOpacity) * pulseFactor;

            // Set the new opacity directly on the ForceGraph3D component
            if (typeof fgRef.current.linkOpacity === 'function') {
              fgRef.current.linkOpacity(finalOpacity);
            }

            // Debug: Log the pulse factor and opacity updates
            if (isFlashPoint) {
              console.log('Link pulse factor:', pulseFactor, 'Opacity:', finalOpacity);
            }
          }

          lastRefreshTimeRef.current = now;
        } catch (error) {
          // Silently handle errors
          console.debug('Error in pulse animation callback:', error);
        }
      }

      // Continue animation
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Clean up animation on unmount
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;

      // Restore original opacity
      if (fgRef.current && typeof fgRef.current.linkOpacity === 'function') {
        fgRef.current.linkOpacity(originalLinkOpacityRef.current);
      }

      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      stopLinkPulse();
    };
  }, [fgRef, highlightedLinks, refreshInterval]);

  return pulseFactorRef;
}
