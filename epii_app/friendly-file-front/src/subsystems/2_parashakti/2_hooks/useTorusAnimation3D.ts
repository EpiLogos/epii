/**
 * useTorusAnimation3D Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-2 (Harmonic Layer - Hooks)
 *
 * This hook provides a way to use torus rotation and pulse animations in 3D React components.
 * It now uses the centralized AnimationManager for better performance and coordination.
 */

import { useRef, useEffect, MutableRefObject } from 'react';
import { useMeta3DAnimations } from './useMeta3DAnimations';

/**
 * Hook for using torus animations in 3D
 * @param fgRef - Reference to the ForceGraph3D component
 * @returns Animation state and control functions
 */
export function useTorusAnimation3D(
  fgRef: MutableRefObject<any | null>
) {
  // Component mounted ref
  const isMountedRef = useRef<boolean>(false);

  // Use the Meta3D animations hook to manage animations
  const {
    isInitialized,
    setTorusRotationEnabled,
    setTorusPulseEnabled,
    setPerformanceMode
  } = useMeta3DAnimations(fgRef);

  // Set up animations
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Set performance mode based on device capabilities
    if (isInitialized) {
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

    // Clean up on unmount
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;
    };
  }, [isInitialized, setPerformanceMode]);

  return {
    isInitialized,
    setTorusRotationEnabled,
    setTorusPulseEnabled,
    setPerformanceMode
  };
}
