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

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';
import { GraphControls } from "../../../shared/components/meta/GraphControls";
import { NodeDetailsPanel } from "../../../shared/components/meta/NodeDetailsPanel";
import GeometricBackground from '../../../shared/components/ui/GeometricBackground';
import Meta2DContainer from '../4_context/Meta2DContainer';
import Meta2DFoundation from '../3_visualization/Meta2DFoundation';
import { useGraphData } from '../2_hooks/useGraphData';
import { useGraphProcessing } from '../3_visualization/useGraphProcessing';
import { useGraphLayout } from '../2_hooks/useGraphLayout';
import { useNodeStyling } from '../../3_mahamaya/2_hooks/useNodeStyling';
import { useGraphInteractions } from '../4_context/useGraphInteractions';
import { useGraphRendering } from '../3_visualization/useGraphRendering';
import { useLinkPulse, applyPulseToLinkColor } from '../../2_parashakti/2_hooks/useLinkPulse';

const Meta2DIntegration: React.FC = () => {
  // Get the navigate function from react-router-dom
  const navigate = useNavigate();
  // Refs
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(false);

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

  // Handle interactions
  const {
    activeNodeData,
    highlightedNodes,
    highlightedLinks,
    handleNodeClick,
    handleNodeHover,
    handleBackgroundClick
  } = useGraphInteractions(styledNodes || [], styledEdges || []);

  // Get custom rendering functions
  const { drawHexagon } = useGraphRendering();

  // Set up link pulse animation
  const pulseFactorRef = useLinkPulse((_pulseFactor) => {
    // Force refresh the graph to update link colors
    // The try/catch is handled inside the hook
    if (fgRef.current && typeof fgRef.current.refresh === 'function') {
      fgRef.current.refresh();
    }
  }, 100); // Refresh every 100ms for smoother animation

  // Prepare graph data
  const graphData = {
    nodes: styledNodes || [],
    links: styledEdges || []
  };

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

  // Initialize component
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom * 1.5, 400); // 1.5x zoom with 400ms transition
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom / 1.5, 400); // 1.5x zoom out with 400ms transition
    }
  }, []);

  const resetView = useCallback(() => {
    if (fgRef.current) {
      // Find the root node to center on
      const rootNode = styledNodes?.find(node => node.bimbaCoordinate === '#');
      const centerX = rootNode ? rootNode.x || 0 : 0;
      const centerY = rootNode ? rootNode.y || 0 : 0;

      // Reset zoom and center
      fgRef.current.centerAt(centerX, centerY, 1000);
      fgRef.current.zoom(1, 1000);
    }
  }, [styledNodes]);

  // Force refresh the graph
  const forceRefreshGraph = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.refresh();
    }
  }, []);

  // Add new node (placeholder function)
  const addNewNode = useCallback(() => {
    console.log('Add new node functionality not implemented yet');
    // This would typically open a modal or form to add a new node
  }, []);

  return (
    <div className="flex flex-col w-full" ref={containerRef}>
      <Meta2DContainer
        nodes={styledNodes || []}
        edges={styledEdges || []}
        isLoading={isLoading}
        error={error || null}
      >
        {/* Graph Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <GraphControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={resetView}
              onAddNode={addNewNode}
              onRefresh={forceRefreshGraph}
              viewMode="2D"
              onViewModeChange={() => navigate('/meta3d')}
            />
          </div>

          {/* Graph Visualization */}
          {!isLoading && !error && (
            <div className="relative h-[600px] bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
              <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                width={graphDimensions.width}
                height={graphDimensions.height}
                // Physics engine configuration
                cooldownTicks={Infinity} // Keep physics simulation running indefinitely
                warmupTicks={100}
                d3AlphaDecay={0.005} // Extremely slow decay for very stable behavior
                d3VelocityDecay={0.1} // Significantly reduced for much more fluid movement
                d3AlphaMin={0.0005} // Lower minimum to allow simulation to run longer
                // Node styling
                nodeRelSize={7.5} // Reduced to 0.25x the original size (was 30)
                nodeVal={node => node.val || 30} // Use pre-calculated size with fallback
                nodeColor={node => node.color || '#aaaaaa'} // Use pre-calculated color with fallback
                // Custom node rendering
                nodeCanvasObject={(node, ctx, globalScale) => {
                  drawHexagon(node, ctx, globalScale, highlightedNodes, activeNodeData);
                }}
                // Link styling
                linkWidth={link => {
                  const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;
                  return highlightedLinks.has(id) ? 2 : link.width || 0.5;
                }}
                linkColor={link => {
                  // Get link ID
                  const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;

                  // Check if link is highlighted
                  const isHighlighted = highlightedLinks.has(id);

                  // Get base color
                  const baseColor = link.color || 'rgba(180, 180, 180, 0.3)';

                  // Apply pulse to the link color
                  return applyPulseToLinkColor(baseColor, pulseFactorRef.current, isHighlighted);
                }}
                linkDirectionalParticles={link => {
                  const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;
                  return highlightedLinks.has(id) ? 4 : 1;
                }}
                linkDirectionalParticleWidth={3} // Larger particles
                linkDirectionalParticleSpeed={0.01} // Faster particles for more noticeable motion
                // Node and link identification
                nodeId="id"
                nodeLabel="name" // Show name on hover
                linkSource="source"
                linkTarget="target"
                // Interaction handlers
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onBackgroundClick={handleBackgroundClick}
                // Enable node dragging
                enableNodeDrag={true}
                // Handle node drag events
                onNodeDrag={node => {
                  // Temporarily stop the node from being affected by forces
                  if (!node.__dragging) {
                    node.__dragging = true;
                  }
                }}
                onNodeDragEnd={node => {
                  // Resume normal behavior after drag ends
                  delete node.__dragging;
                }}
                backgroundColor="rgba(0,0,0,0)"
              />
            </div>
          )}

          {/* Node Details Panel */}
          {activeNodeData && (
            <NodeDetailsPanel
              activeNode={activeNodeData}
              onClose={handleBackgroundClick}
            />
          )}
        </div>
      </Meta2DContainer>
    </div>
  );
};

export default Meta2DIntegration;
