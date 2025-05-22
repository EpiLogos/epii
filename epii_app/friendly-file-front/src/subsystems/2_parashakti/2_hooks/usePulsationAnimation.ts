/**
 * usePulsationAnimation Hook
 *
 * This hook is responsible for creating a pulsation animation effect
 * that can be used to animate link opacity and other visual properties.
 */

import { useRef, useEffect } from 'react';

/**
 * Hook for creating a pulsation animation effect
 * @param onPulse Callback function to be called on each animation frame
 * @param refreshInterval Optional interval in ms for throttling refreshes (default: 250ms)
 * @returns The current pulsation factor
 */
export function usePulsationAnimation(
  onPulse: (pulseFactor: number) => void,
  refreshInterval: number = 250 // Default to 250ms (4 refreshes per second)
) {
  // Reference for the pulsation factor
  const pulseFactorRef = useRef<number>(1.0);

  // Reference for the last refresh time
  const lastRefreshTimeRef = useRef<number>(0);

  // Reference for the animation frame ID
  const animationFrameIdRef = useRef<number | null>(null);

  // Set up pulsation animation
  useEffect(() => {
    // Define pulsation parameters
    const minPulseFactor = 0.3; // Minimum opacity factor
    const maxPulseFactor = 2.0; // Maximum opacity factor for more dramatic effect
    const pulseDuration = 2000; // 2 seconds per pulse cycle

    // Animation function for pulsating with sawtooth wave pattern
    const animatePulsation = () => {
      // Calculate pulse factor based on time
      const now = Date.now();
      const normalizedTime = (now % pulseDuration) / pulseDuration;

      // Use a sawtooth wave pattern with logarithmic scaling
      // This creates a slow rise and quick fall pattern
      let pulseFactor: number;

      if (normalizedTime < 0.85) {
        // Build-up phase (85% of the cycle) - slower for more anticipation
        const buildUpProgress = normalizedTime / 0.85; // 0 to 1 during build-up

        // Use a sigmoid function for a dramatic curve that stays low for a long time
        // and then rises very quickly at the end
        const steepness = 12; // Higher value = steeper curve
        const midpoint = 0.8; // Point where the curve reaches 50% (shifted right for later rise)

        // Sigmoid function that stays very flat and then rises very quickly
        const sigmoid = 1 / (1 + Math.exp(-steepness * (buildUpProgress - midpoint)));

        // Apply the sigmoid curve to our opacity range
        pulseFactor = minPulseFactor + sigmoid * (maxPulseFactor - minPulseFactor);
      } else {
        // Fall phase (15% of the cycle) - faster for more pronounced effect
        const fallProgress = (normalizedTime - 0.85) / 0.15; // 0 to 1 during fall

        // Use a curve that falls extremely quickly at first but then slows down dramatically
        // This creates an extremely quick initial drop with a very long tail for the decay
        const fallCurve = Math.pow(1 - fallProgress, 3) * (0.7 + 0.3 * Math.pow(1 - fallProgress, 2));

        // Map the fall curve to our opacity range
        pulseFactor = minPulseFactor + fallCurve * (maxPulseFactor - minPulseFactor);
      }

      // Update the pulse factor reference
      pulseFactorRef.current = pulseFactor;

      // Throttle refreshes to the specified interval
      // Always update on the flash point (when pulseFactor is near max)
      const isFlashPoint = pulseFactor > maxPulseFactor * 0.9;
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

      if (isFlashPoint || timeSinceLastRefresh >= refreshInterval) {
        // Call the callback function to refresh the graph
        onPulse(pulseFactor);
        lastRefreshTimeRef.current = now;
      }

      // Continue animation
      animationFrameIdRef.current = requestAnimationFrame(animatePulsation);
    };

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(animatePulsation);

    // Clean up animation on unmount
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [onPulse, refreshInterval]);

  return pulseFactorRef;
}
