/**
 * useLinkPulse Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-2 (Harmonic Layer - Hooks)
 *
 * This hook provides a way to use the link pulse animation in React components.
 * It now uses the centralized AnimationManager for better performance and coordination.
 */

import { useRef, useEffect } from 'react';
import {
  startLinkPulse,
  stopLinkPulse,
  calculatePulseFactor,
  applyPulsationToColor
} from '../1_utils/linkPulseUtils';
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority,
  AnimationId
} from '../1_utils/AnimationManager';

/**
 * Hook for using the link pulse animation
 * @param onPulse - Callback function to be called on each pulse update
 * @param refreshInterval - Optional interval in ms for throttling refreshes (default: 100ms)
 * @returns The current pulse factor reference
 */
export function useLinkPulse(
  onPulse: (pulseFactor: number) => void,
  refreshInterval: number = 100 // Default to 100ms (10 refreshes per second)
) {
  // Reference for the pulse factor
  const pulseFactorRef = useRef<number>(1.0);

  // Reference for the last refresh time
  const lastRefreshTimeRef = useRef<number>(0);

  // Reference for the animation ID
  const animationIdRef = useRef<AnimationId | null>(null);

  // Reference for whether the component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Set up pulse animation
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
            // Call the callback function
            onPulse(pulseFactor);
            lastRefreshTimeRef.current = now;
          } catch (error) {
            // Silently handle errors (e.g., if graphRef is not available yet)
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
        // Get the animation manager instance
        const animationManager = getAnimationManager();
        animationManager.unregisterAnimation(animationIdRef.current);
        animationIdRef.current = null;
      }
      stopLinkPulse();
    };
  }, [onPulse, refreshInterval]);

  return pulseFactorRef;
}

/**
 * Apply pulsation to a link color
 * @param color - The original color string (RGB or RGBA)
 * @param pulseFactor - The pulse factor to apply
 * @param isHighlighted - Whether the link is highlighted
 * @returns The pulsated RGBA color string
 */
export function applyPulseToLinkColor(
  color: string,
  pulseFactor: number,
  isHighlighted: boolean = false
): string {
  // Apply basic pulsation to the color
  let pulsedColor = applyPulsationToColor(color, pulseFactor);

  // If the link is highlighted, ensure it has a higher minimum opacity
  if (isHighlighted) {
    // Extract RGB components
    const rgbaMatch = pulsedColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const r = rgbaMatch[1];
      const g = rgbaMatch[2];
      const b = rgbaMatch[3];

      // Use a higher minimum opacity for highlighted links
      const highlightedMinOpacity = 0.75;

      // Scale the pulse factor to a new range with a higher minimum
      const globalMin = 0.3;
      const globalMax = 2.0;
      const highlightedMax = 2.0;

      // Scale the current pulse factor to our new range
      const adjustedPulseFactor = highlightedMinOpacity +
        (pulseFactor - globalMin) * ((highlightedMax - highlightedMinOpacity) / (globalMax - globalMin));

      // Ensure the opacity is within bounds
      const finalOpacity = Math.max(highlightedMinOpacity, Math.min(adjustedPulseFactor, highlightedMax));

      // Return the adjusted color
      return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
    }
  }

  return pulsedColor;
}
