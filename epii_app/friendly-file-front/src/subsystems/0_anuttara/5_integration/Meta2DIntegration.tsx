/**
 * Meta2DIntegration Component
 *
 * This component integrates all the subsystem components into a cohesive 2D visualization.
 *
 * Bimba Tech Architecture Alignment:
 * - Corresponds to Module #5-3-0 (Bimba Vis / Geom Ground)
 * - Visualizes the foundational Bimba structure using D3.js/ForceGraph2D
 * - Represents the Agent (0000)=(0/1) (Being/Prakasa-Vimarsa)
 *
 * This component serves as the 2D representation of the Bimba structure, providing
 * a foundational geometric visualization of the knowledge graph. It embodies the
 * Anuttara principle (foundational void) in its visual expression.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';

import Meta2DContainer from '../4_context/Meta2DContainer';
import Meta2DVisualization from '../3_visualization/Meta2DVisualization';
import { useGraphData } from '../2_hooks/useGraphData';
import { useGraphProcessing } from '../3_visualization/useGraphProcessing';
import { useGraphLayout } from '../2_hooks/useGraphLayout';
import { useNodeStyling } from '../../3_mahamaya/2_hooks/useNodeStyling';

const Meta2DIntegration: React.FC = () => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [graphDimensions, setGraphDimensions] = useState({
    width: 800,
    height: 600
  });

  // Fetch and process graph data
  const { nodes: rawNodes, edges: rawEdges, error, isLoading } = useGraphData();
  const { processedNodes, edges, parentChildMap, virtualDepths } = useGraphProcessing(rawNodes || [], rawEdges || []);
  const { positionedNodes, edges: layoutEdges } = useGraphLayout(processedNodes || [], edges || [], parentChildMap || new Map(), virtualDepths || new Map());
  const { styledNodes, styledEdges } = useNodeStyling(positionedNodes || [], layoutEdges || [], virtualDepths || new Map());

  // REMOVED: All interaction, rendering, and physics code - now handled by Meta2DVisualization

  // Update graph dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGraphDimensions({
          width: containerRef.current.clientWidth || 800,
          height: Math.min(window.innerHeight - 200, 800)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // REMOVED: All physics, animation, and camera control code - now handled by Meta2DVisualization

  // Prepare graph data for Meta2DVisualization
  const graphData = useMemo(() => ({
    nodes: styledNodes || [],
    links: styledEdges || []
  }), [styledNodes, styledEdges]);

  return (
    <div className="flex flex-col w-full h-full">
      <Meta2DContainer
        nodes={styledNodes || []}
        edges={styledEdges || []}
        isLoading={isLoading}
        error={error}
      >
        <Meta2DVisualization
          graphData={graphData}
          graphDimensions={graphDimensions}
          isLoading={isLoading}
          error={error}
        />
      </Meta2DContainer>


    </div>
  );
};

export default Meta2DIntegration;
