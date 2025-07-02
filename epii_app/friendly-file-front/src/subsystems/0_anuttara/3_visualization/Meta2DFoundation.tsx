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
import { useMeta2D } from "../4_context/Meta2DContainer";
import { Node } from "../../../shared/components/meta/metaData";
import { calculateHexagonalPosition } from '../1_utils/geometryUtils';
import { configurePhysics2D, addOrbitalForce } from '../0_foundation/physicsConfig';
import { useGraphRendering, useLinkPulse } from '../../../hooks';
import { applyPulseToLinkColor } from "../../../shared/hooks/useLinkPulse';

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

  // Set up link pulse animation with direct canvas approach
  const pulseFactorRef = useLinkPulse((_pulseFactor) => {
    // Skip refresh - rely on ForceGraph2D's built-in animation loop
    // Removing _rerender() call that causes physics resets
    // The graph will update automatically on the next animation frame
  }, 150); // Reduced frequency for better performance

  // Prepare graph data
  const graphData = {
    nodes,
    links: edges
  };



  // REMOVED: Competing physics configuration that was causing conflicts
  // Physics is now handled centrally in Meta2DIntegration to avoid multiple
  // systems trying to control the same simulation

  // The Foundation component now focuses on its core responsibility:
  // providing the base geometric structure without interfering with physics

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

    // Skip visual refresh - ForceGraph2D will handle updates automatically
    // Removing _rerender() call that causes physics resets
  }, [graphRef, nodes, isLoading, error]);

  // Skip rendering if loading or error
  if (isLoading || error) return null;

  // REMOVED: ForceGraph2D component - now handled by Meta2DVisualization
  // This component now focuses on its core responsibility: providing foundational geometry
  // The actual graph rendering is handled by Meta2DVisualization following the Meta3D pattern

  return null;
};

export default Meta2DFoundation;
