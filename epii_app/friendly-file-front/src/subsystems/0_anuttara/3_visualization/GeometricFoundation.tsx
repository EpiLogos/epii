/**
 * GeometricFoundation Component
 *
 * This component is responsible for setting up the base 3D geometry, camera controls, and scene.
 * It aligns with the #0 Anuttara subsystem (foundational void).
 *
 * Bimba Tech Architecture Alignment:
 * - Contributes to Module #5-3-1 (QL/AT Vis)
 * - Provides the foundational 3D geometry for the visualization
 * - Embodies the Anuttara principle (foundational void) as the base upon which
 *   other visualizations are built
 */

import React, { useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useMeta3D } from '../../1_paramasiva/4_context/Meta3DContainer';

export const GeometricFoundation: React.FC = () => {
  const {
    nodes,
    edges,
    width,
    height,
    graphRef,
    isLoading,
    error
  } = useMeta3D();

  // Skip rendering if loading or error
  if (isLoading || error) return null;

  // Prepare graph data
  const graphData = {
    nodes,
    links: edges
  };

  return (
    <ForceGraph3D
      ref={graphRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"

      // 3D-specific camera controls
      controlType="orbit" // Use orbit controls for more stable 3D navigation
      enableNavigationControls={true}

      // Physics configuration optimized for dynamic, floating motion
      cooldownTicks={Infinity} // Keep physics simulation running indefinitely
      warmupTicks={0} // Disable initial warmup - we'll handle this manually
      d3AlphaDecay={0.00005} // Ultra slow decay for persistent motion
      d3VelocityDecay={0.008} // Ultra low friction for maximum freedom
      d3AlphaMin={0.00001} // Ultra low minimum to ensure simulation never stops
      numDimensions={3} // Explicitly set 3 dimensions for the simulation

      // Empty implementations for other subsystems to override
      nodeThreeObject={() => new THREE.Mesh()}
      linkThreeObject={() => new THREE.Mesh()}
      nodeThreeObjectExtend={false}
      linkThreeObjectExtend={false}
    />
  );
};

export default GeometricFoundation;
