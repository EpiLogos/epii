/**
 * RelationVisualizer Component
 *
 * This component is responsible for visualizing relations (links) between nodes
 * and implementing the pulsation animation effect.
 * It aligns with the #2 Parashakti subsystem (vibrational templates).
 *
 * Bimba Tech Architecture Alignment:
 * - Contributes to Module #5-3-2 (Harmonic Layer)
 * - Visualizes the vibrational/relational aspects through link animations
 * - Embodies the Parashakti principle (vibrational templates) by representing
 *   the dynamic, flowing nature of relationships
 * - Future enhancement potential: Add audio components to fully realize the
 *   harmonic layer concept
 */

import React, { useEffect, useState } from 'react';
import { useMeta3D } from '../../1_paramasiva/4_context/Meta3DContainer';
import { useMeta3DAnimations } from '../2_hooks/useMeta3DAnimations';
import { getAnimationManager } from '../1_utils/AnimationManager';

interface RelationVisualizerProps {
  wireframesCreated?: boolean;
}

export const RelationVisualizer: React.FC<RelationVisualizerProps> = ({ wireframesCreated = false }) => {
  const {
    graphRef,
    setPulsationFactor
  } = useMeta3D();

  // Track if the graph is fully initialized
  const [graphInitialized, setGraphInitialized] = useState(false);

  // Use the Meta3D animations hook to manage animations
  // Pass wireframesCreated to avoid polling for wireframes
  const {
    isInitialized,
    setLinkPulseEnabled,
    setPerformanceMode
  } = useMeta3DAnimations(graphRef, setPulsationFactor, wireframesCreated);

  // Ensure animation manager is running
  useEffect(() => {
    if (isInitialized && wireframesCreated) {
      // Get the animation manager instance
      const animationManager = getAnimationManager();

      // Force high quality animations
      animationManager.setPerformanceMode('high');

      // Ensure animation manager is running
      if (!animationManager.getIsRunning()) {
        console.log('[RelationVisualizer] Starting animation loop');

        // REMOVED: Setting scene in animation manager
        // The scene is already set in Meta3DVisualization.tsx
        // This prevents multiple scene settings which could cause inconsistencies

        // Start the animation manager
        animationManager.start();
      } else {
        console.log('[RelationVisualizer] Animation manager already running');
      }

      console.log('[RelationVisualizer] Animation setup complete');
    }
  }, [isInitialized, wireframesCreated, graphRef]);

  // Check if the graph is fully initialized
  useEffect(() => {
    // Skip if no graph ref
    if (!graphRef.current) return;

    // Use a small delay to ensure the graph is fully initialized
    const checkInitialization = () => {
      // Check if the graph has the necessary methods
      const isInitialized =
        typeof graphRef.current?.graphData === 'function' &&
        typeof graphRef.current?.refresh === 'function';

      if (isInitialized && !graphInitialized) {
        // Graph is fully initialized
        setGraphInitialized(true);
      } else if (!isInitialized) {
        // Try again after a short delay
        setTimeout(checkInitialization, 100);
      }
    };

    // Start checking
    checkInitialization();
  }, [graphRef, graphInitialized]);

  // REMOVED: Setting performance mode based on device capabilities
  // This is now handled centrally in useMeta3DAnimations.ts to avoid conflicts

  // The component now focuses solely on providing the pulsation animation
  // The actual link styling and highlighting is handled by the useGraphStylingFunctions hook

  return null; // This component doesn't render anything directly
};

export default RelationVisualizer;
