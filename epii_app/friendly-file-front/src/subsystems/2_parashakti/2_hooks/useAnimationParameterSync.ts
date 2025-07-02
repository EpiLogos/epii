/**
 * Animation Parameter Sync Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-2 (Harmonic Layer - Hooks)
 *
 * This hook synchronizes animation console parameters with the actual animation systems.
 * It provides real-time updates to AnimationManager, link pulse, torus animations, etc.
 */

import { useEffect, useRef } from 'react';
import { useAnimationConsole } from '../4_context/AnimationConsoleContext';
import { getAnimationManager } from '../1_utils/AnimationManager';

// Import animation utilities that need to be controlled
import { 
  setLinkPulseParameters,
  getLinkPulseParameters 
} from '../1_utils/linkPulseUtils';
import { 
  setTorusRotationSpeed,
  getTorusRotationState 
} from '../../1_paramasiva/1_utils/torusAnimationUtils';

/**
 * Hook that synchronizes animation console parameters with actual animation systems
 * This ensures that parameter changes in the console immediately affect the running animations
 */
export function useAnimationParameterSync() {
  const { groups, currentPage } = useAnimationConsole();
  const lastSyncedValues = useRef<Record<string, any>>({});

  useEffect(() => {
    // Get the animation manager instance
    const animationManager = getAnimationManager();

    // Process each parameter group
    groups.forEach(group => {
      group.parameters.forEach(param => {
        const { id, currentValue } = param;
        
        // Only sync if the value has actually changed
        if (lastSyncedValues.current[id] === currentValue) {
          return;
        }

        // Update the last synced value
        lastSyncedValues.current[id] = currentValue;

        // Sync parameter based on its ID
        try {
          switch (id) {
            // AnimationManager parameters
            case 'animationManager.performanceMode':
              animationManager.setPerformanceMode(currentValue as 'high' | 'balanced' | 'low');
              console.log(`[AnimationConsole] Set performance mode: ${currentValue}`);
              break;

            case 'animationManager.debugMode':
              animationManager.setDebugMode(currentValue as boolean);
              console.log(`[AnimationConsole] Set debug mode: ${currentValue}`);
              break;

            // Link pulse parameters (2D and shared)
            case 'linkPulse.cycleDuration':
            case 'linkPulse.minPulseFactor':
            case 'linkPulse.maxPulseFactor':
            case 'linkPulse.pulseSpeed':
              // Get current link pulse parameters
              const currentLinkParams = getLinkPulseParameters();
              
              // Update the specific parameter
              const paramName = id.split('.')[1] as keyof typeof currentLinkParams;
              const updatedLinkParams = {
                ...currentLinkParams,
                [paramName]: currentValue
              };
              
              // Apply the updated parameters
              setLinkPulseParameters(updatedLinkParams);
              console.log(`[AnimationConsole] Updated link pulse ${paramName}: ${currentValue}`);
              break;

            // Torus animation parameters (3D)
            case 'torusAnimation.speed':
              setTorusRotationSpeed(currentValue as number);
              console.log(`[AnimationConsole] Set torus rotation speed: ${currentValue}`);
              break;

            case 'torusAnimation.cycleDuration':
              // Note: Torus cycle duration requires more complex handling
              // For now, we'll log it but may need to implement a setter in torusAnimationUtils
              console.log(`[AnimationConsole] Torus cycle duration change requested: ${currentValue}`);
              // TODO: Implement setTorusCycleDuration in torusAnimationUtils
              break;

            // 3D Link pulse parameters
            case 'linkPulse3D.pulseCycle':
            case 'linkPulse3D.minRange':
            case 'linkPulse3D.maxRange':
              // These parameters affect the 3D link pulse animation
              // They would need to be applied to the specific 3D animation registration
              console.log(`[AnimationConsole] 3D link pulse parameter ${id}: ${currentValue}`);
              // TODO: Implement 3D-specific parameter updates
              break;

            default:
              console.warn(`[AnimationConsole] Unknown parameter ID: ${id}`);
              break;
          }
        } catch (error) {
          console.error(`[AnimationConsole] Error syncing parameter ${id}:`, error);
        }
      });
    });
  }, [groups, currentPage]);

  // Return current parameter values for external use
  const getCurrentParameterValues = () => {
    const values: Record<string, any> = {};
    groups.forEach(group => {
      group.parameters.forEach(param => {
        values[param.id] = param.currentValue;
      });
    });
    return values;
  };

  return {
    getCurrentParameterValues
  };
}

/**
 * Hook that provides real-time animation metrics for display in the console
 */
export function useAnimationMetrics() {
  const animationManager = getAnimationManager();

  // Get performance metrics
  const getMetrics = () => {
    try {
      return {
        fps: animationManager.getDisplayFps(),
        frameTime: animationManager.getAverageFrameTime(),
        animationCount: animationManager.getAnimationCount(),
        isRunning: animationManager.isRunning
      };
    } catch (error) {
      console.error('[AnimationConsole] Error getting metrics:', error);
      return {
        fps: 0,
        frameTime: 0,
        animationCount: 0,
        isRunning: false
      };
    }
  };

  return {
    getMetrics
  };
}
