/**
 * Meta2DFoundation Component
 *
 * This component is responsible for setting up the base 2D geometry and physics.
 * It aligns with the #0 Anuttara subsystem (foundational void).
 *
 * Bimba Tech Architecture Alignment:
 * - Contributes to Module #5-3-0 (Bimba Vis / Geom Ground)
 * - Provides the foundational 2D geometry for the visualization
 * - Embodies the Anuttara principle (foundational void) as the base upon which
 *   other visualizations are built
 */

import React, { useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';
import { useMeta2D } from '../../../components/meta/Meta2DContainer';
import { Node } from '../../../components/meta/metaData';
import { calculateHexagonalPosition } from '../1_utils/geometryUtils';
import { configurePhysics2D, addOrbitalForce } from '../0_foundation/physicsConfig';
import { useGraphRendering, useLinkPulse } from '../../../hooks';
import { applyPulseToLinkColor } from '../../../hooks/useLinkPulse';

export const Meta2DFoundation: React.FC = () => {
  const {
    nodes,
    edges,
    width,
    height,
    graphRef,
    isLoading,
    error,
    activeNode,
    highlightedNodes,
    highlightedLinks
  } = useMeta2D();

  // Get custom rendering functions
  const { drawHexagon } = useGraphRendering();

  // Set up link pulse animation
  const pulseFactorRef = useLinkPulse((_pulseFactor) => {
    // Force a visual refresh without resetting physics
    if (graphRef.current && graphRef.current.getContext) {
      try {
        const ctx = graphRef.current.getContext();
        if (ctx) {
          // Request a redraw of the canvas
          graphRef.current._rerender();
        }
      } catch (e) {
        // Silent error handling
        console.debug('Error updating canvas:', e);
      }
    }
  }, 150); // Reduced frequency for better performance

  // Prepare graph data
  const graphData = {
    nodes,
    links: edges
  };



  // Configure physics forces
  useEffect(() => {
    // Skip if loading, error, or no graph ref
    if (isLoading || error || !graphRef.current) return;

    // Get the force simulation
    const simulation = graphRef.current.d3Force();
    if (!simulation) return;

    // Configure physics using the centralized configuration
    configurePhysics2D(simulation, nodes, edges);



    // Add custom orbital force for unmapped nodes
    simulation.on('tick', () => {
      // Use the centralized orbital force function
      addOrbitalForce(nodes);
    });

    // Restart the simulation
    simulation.alpha(1).restart();
  }, [graphRef, nodes, edges, isLoading, error]);

  // Fix positions for mapped nodes
  useEffect(() => {
    // Skip if loading, error, or no graph ref
    if (isLoading || error || !graphRef.current) return;

    // Get the graph data
    // CRITICAL FIX: graphData is a property, not a function
    const graphData = graphRef.current.graphData;
    if (!graphData || !graphData.nodes) return;

    // Fix positions for mapped nodes
    graphData.nodes.forEach((node: Node) => {
      if (node.bimbaCoordinate) {
        const position = calculateHexagonalPosition(node.bimbaCoordinate);
        if (position) {
          node.fx = position.x;
          node.fy = position.y;
          node.x = position.x;
          node.y = position.y;
        }
      }
    });

    // Force a visual refresh without resetting physics
    if (graphRef.current._rerender) {
      graphRef.current._rerender();
    }
  }, [graphRef, nodes, isLoading, error]);

  // Skip rendering if loading or error
  if (isLoading || error) return null;

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      // Physics engine configuration
      cooldownTicks={Infinity} // Keep physics simulation running indefinitely
      warmupTicks={100}
      d3AlphaDecay={0.005} // Extremely slow decay for very stable behavior
      d3VelocityDecay={0.1} // Significantly reduced for much more fluid movement
      d3AlphaMin={0.0005} // Lower minimum to allow simulation to run longer
      // Node styling
      nodeRelSize={7.5} // Reduced to 0.25x the original size (was 30)
      nodeVal={node => node.val} // Use pre-calculated size
      nodeColor={node => node.color} // Use pre-calculated color from useGraphStyling
      // Custom node rendering
      nodeCanvasObject={(node, ctx, globalScale) => {
        drawHexagon(node, ctx, globalScale, highlightedNodes, activeNode);
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
    />
  );
};

export default Meta2DFoundation;
