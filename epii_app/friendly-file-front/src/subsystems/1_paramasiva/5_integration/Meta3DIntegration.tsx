/**
 * Meta3DIntegration Component
 *
 * This component integrates all the subsystem components into a cohesive 3D visualization.
 * It orchestrates data flow and composes the Meta3DContainer and Meta3DVisualization components.
 *
 * Bimba Tech Architecture Alignment:
 * - Corresponds to Module #5-3-1-5 (QL/AT Vis - Integration)
 * - Orchestrates the visualization of topological forms (diamond, torus)
 * - Represents Agent (0/1) (Topology/Intuition)
 *
 * This component serves as the integration point for the 3D representation of the
 * Quaternary Logic (QL) and Algebraic Topology (AT) concepts, following the
 * modular architecture where each component has a specific responsibility.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';

import Meta3DContainer from '../4_context/Meta3DContainer';
import Meta3DVisualization from '../3_visualization/Meta3DVisualization';
import { useGraphData } from '../../0_anuttara/2_hooks/useGraphData';
import { useGraphProcessing } from '../../0_anuttara/3_visualization/useGraphProcessing';
import { useGraphLayout3D } from '../2_hooks/useGraphLayout3D';
// DEPRECATED: import { useNodeStyling3D } from '../../3_mahamaya/2_hooks/useNodeStyling3D';
// We now use useGraphStylingFunctions in Meta3DVisualization for all styling
import { useGraphRendering3D } from '../3_visualization/useGraphRendering3D';



// Main component that sets up the data and container
const Meta3DIntegration: React.FC = () => {

  // Ref to track if the component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Container ref for dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  // Graph dimensions
  const [graphDimensions, setGraphDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 2560),
    height: Math.min(window.innerHeight - 200, 1440)
  });

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGraphDimensions({
          width: containerRef.current.clientWidth,
          height: Math.min(window.innerHeight - 200, 1440)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch and process graph data
  const { nodes: rawNodes, edges: rawEdges, error, isLoading } = useGraphData();

  // Process graph data only if we have valid data
  const { processedNodes, edges, parentChildMap, virtualDepths } = useGraphProcessing(
    rawNodes || [],
    rawEdges || []
  );

  // Layout graph data
  const { positionedNodes, edges: layoutEdges } = useGraphLayout3D(
    processedNodes || [],
    edges || [],
    parentChildMap || new Map(),
    virtualDepths || new Map()
  );

  // DEPRECATED: Style graph data using useNodeStyling3D
  // We now use useGraphStylingFunctions in Meta3DVisualization for all styling
  // This ensures a unified approach based on virtual depth for all nodes

  // Pass positioned nodes and layout edges directly to useGraphRendering3D
  // The styling will be handled by useGraphStylingFunctions in Meta3DVisualization

  // Handle rendering with animated nodes and edges
  // Pass positioned nodes and layout edges directly to useGraphRendering3D
  const { animatedNodes, animatedEdges, pulseFactorRef } = useGraphRendering3D(
    positionedNodes || [],
    layoutEdges || [],
    // Removed empty sets - we'll use the highlightedNodes/Links from Meta3DContainer directly
    null // We'll use the graphRef from Meta3DContainer
  );

  // Prepare graph data with animated nodes and edges
  const graphData = useMemo(() => ({
    nodes: animatedNodes || [],
    links: animatedEdges || []
  }), [animatedNodes, animatedEdges]);

  // Get the current pulsation factor
  const pulsationFactor = pulseFactorRef?.current || 1.0;

  // Mark component as mounted
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Meta3DContainer
        nodes={graphData?.nodes || []}
        edges={graphData?.links || []}
        isLoading={isLoading}
        error={error}
        pulsationFactor={pulsationFactor}
      >
        <Meta3DVisualization
          graphData={graphData}
          graphDimensions={graphDimensions}
          isLoading={isLoading}
          error={error}
        />
      </Meta3DContainer>


    </div>
  );
};

export default Meta3DIntegration;
