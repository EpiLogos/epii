/**
 * useGraphRendering Hook
 *
 * This hook provides custom rendering functions for the graph nodes and links.
 */

import { useCallback } from 'react';
import { Node, Edge } from '../components/meta/metaData';

// Define subsystem colors
const subsystemColors: { [key: string]: string } = {
  '0': '#BDBDBD', // Anuttara - Silver/Neutral
  '1': '#FF4D4D', // Paramasiva - Vibrant Red/Foundation
  '2': '#FFCC00', // Parashakti - Golden/Vibration
  '3': '#4CAF50', // Mahamaya - Emerald/Integration
  '4': '#2196F3', // Nara - Ocean Blue/Context
  '5': '#AB47BC', // Epii - Deep Purple/Synthesis
  'default': '#90A4AE' // Fallback color
};

// Define subsystem color families
const subsystemColorFamilies: { [key: string]: string[] } = {
  // Anuttara - Grey family
  '0': ['#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161'],
  // Paramasiva - Red family
  '1': ['#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336'],
  // Parashakti - Amber family
  '2': ['#FFECB3', '#FFE082', '#FFD54F', '#FFCA28', '#FFC107'],
  // Mahamaya - Green family
  '3': ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'],
  // Nara - Blue family
  '4': ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3'],
  // Epii - Purple family
  '5': ['#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0'],
  // Default - Grey-blue family
  'default': ['#CFD8DC', '#B0BEC5', '#90A4AE', '#78909C', '#607D8B']
};

/**
 * Extracts the top-level subsystem ID (0-5) from a Bimba coordinate.
 * Returns null for the root node ('#').
 */
const getSubsystemId = (bimbaCoordinate: string | undefined | null): string | null => {
  if (!bimbaCoordinate || bimbaCoordinate === '#') {
    return null;
  }
  const coordPart = bimbaCoordinate.substring(1);
  // Find the first separator (either '-' or '.')
  const firstSeparatorIndex = Math.min(
    coordPart.indexOf('-') > -1 ? coordPart.indexOf('-') : Infinity,
    coordPart.indexOf('.') > -1 ? coordPart.indexOf('.') : Infinity
  );

  if (firstSeparatorIndex === Infinity) {
    // No separator, it's a top-level subsystem like "#1"
    return coordPart;
  } else {
    // Extract the part before the first separator
    return coordPart.substring(0, firstSeparatorIndex);
  }
};

/**
 * Hook for custom graph rendering
 * @returns Custom rendering functions for nodes and links
 */
export function useGraphRendering() {
  /**
   * Draws a hexagon for a node on the canvas.
   * This is used for custom node rendering in 2D mode.
   */
  const drawHexagon = useCallback((node: Node, ctx: CanvasRenderingContext2D, globalScale: number, highlightedNodesSet?: Set<string>, hoveredNodeRef?: Node | null) => {
    const N_SIDES = 6;

    // Get the node's virtual depth
    const depth = node.virtualDepth || 3;

    // Use the node's pre-calculated size
    const nodeSize = node.val || 1.0;

    // Use the correct nodeRelSize multiplier
    const nodeRelSize = 7.5; // Must match the nodeRelSize prop in ForceGraph2D (reduced to 0.25x)

    // Calculate radius based on node size and a fixed scale factor
    // This prevents the hexagon from growing too large when zooming in
    // and ensures consistent sizing regardless of zoom level
    const baseRadius = nodeSize * nodeRelSize;
    const fixedScale = 0.2; // Fixed scale factor for consistent sizing
    const radius = baseRadius * fixedScale;

    // Determine node color
    let nodeColor = node.color || 'rgba(200, 200, 200, 0.8)';

    // Ensure the node color is properly formatted as rgba
    if (nodeColor && !nodeColor.startsWith('rgba(')) {
      // If it's rgb format, convert to rgba
      if (nodeColor.startsWith('rgb(')) {
        nodeColor = nodeColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)');
      }
      // If it's a hex color, convert to rgba
      else if (nodeColor.startsWith('#')) {
        const r = parseInt(nodeColor.slice(1, 3), 16);
        const g = parseInt(nodeColor.slice(3, 5), 16);
        const b = parseInt(nodeColor.slice(5, 7), 16);
        nodeColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      }
    }

    // Create a pulsing effect for the outer circle
    const time = Date.now() * 0.0005; // Convert to seconds with even slower pulse rate (half the original speed)

    // Calculate the appropriate circle size to match the distance between nodes in the hexagonal layout
    // This creates a perfect flower of life pattern where circles intersect at the exact points of the hexagon
    let circleRadius = radius * 3; // Default size for unmapped nodes

    // For mapped nodes, use the exact same values as in calculateHexagonalPosition
    if (node.bimbaCoordinate) {
      // Base radius for the first level hexagon - must match calculateHexagonalPosition
      const baseRadius = 1200;

      // Scaling factor for each level deeper - must match calculateHexagonalPosition
      const radiusScaleFactor = 0.3;

      if (node.bimbaCoordinate === '#') {
        // Root node - use the base radius
        circleRadius = baseRadius;
      } else {
        // For other mapped nodes, calculate based on their depth in the coordinate
        const segments = node.bimbaCoordinate.substring(1).split(/[-\.]/); // Remove # and split
        const segmentCount = segments.filter(s => s).length; // Count non-empty segments

        // Calculate radius based on segment count (same as in calculateHexagonalPosition)
        if (segmentCount === 1) { // Main subsystem nodes (#0-#5)
          circleRadius = baseRadius;
        } else {
          // For deeper nodes, apply the scaling factor for each level
          // This exactly matches the distance calculation in calculateHexagonalPosition
          circleRadius = baseRadius * Math.pow(radiusScaleFactor, segmentCount - 1);
        }
      }
    }

    // Apply pulsing effect to the circle radius
    const adjustedPulseScale = 1.0 + (0.05 * Math.sin(time * 1.0)); // Even more subtle 5% pulsing at much slower rate
    circleRadius *= adjustedPulseScale;

    // Apply the same scaling approach as in the pre-refactored code
    // Calculate the maximum scale to prevent circles from growing too large when zooming in
    const maxScale = 0.2; // Maximum scale factor to limit growth
    const effectiveScale = Math.min(globalScale, maxScale);
    // Apply the effective scale divided by global scale to maintain proper proportions
    // This ensures circles don't grow too large when zooming in
    circleRadius *= effectiveScale / globalScale;

    // Draw the outer circle for mapped nodes
    if (node.bimbaCoordinate) {
      // Draw the outer circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, circleRadius, 0, 2 * Math.PI);

      // Make the circle just an outline with no fill
      let outerCircleColor: string;

      // Extract RGB components from nodeColor
      let r = 150, g = 150, b = 150;

      if (nodeColor.startsWith('#')) {
        r = parseInt(nodeColor.slice(1, 3), 16);
        g = parseInt(nodeColor.slice(3, 5), 16);
        b = parseInt(nodeColor.slice(5, 7), 16);
      } else {
        // Try to extract RGB from rgba or rgb format
        const rgbMatch = nodeColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);
        if (rgbMatch) {
          r = parseInt(rgbMatch[1], 10);
          g = parseInt(rgbMatch[2], 10);
          b = parseInt(rgbMatch[3], 10);
        }
      }

      // Create a more visible outline with consistent opacity
      outerCircleColor = `rgba(${r}, ${g}, ${b}, 0.6)`;

      // No fill, just stroke
      ctx.strokeStyle = outerCircleColor;
      ctx.lineWidth = 0.8 / globalScale; // Thinner line as requested
      ctx.stroke();
    }

    // Draw the hexagon for all nodes (both mapped and unmapped)
    ctx.beginPath();
    for (let i = 0; i < N_SIDES; i++) {
      const angle = (Math.PI * 2 / N_SIDES) * i - Math.PI / 2; // Start from top
      const x = node.x + radius * Math.cos(angle);
      const y = node.y + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Extract the opacity from the nodeColor if it's in rgba format
    let fillOpacity = Math.max(0.3, 1 - (depth - 1) * 0.1); // Default opacity based on depth

    // Try to extract opacity from rgba format
    if (nodeColor.startsWith('rgba')) {
      const opacityMatch = nodeColor.match(/rgba\s*\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
      if (opacityMatch && opacityMatch[1]) {
        fillOpacity = parseFloat(opacityMatch[1]);
      }
    }

    // Fill the hexagon with the extracted or calculated opacity
    ctx.fillStyle = nodeColor;
    ctx.globalAlpha = fillOpacity;
    ctx.fill();
    ctx.globalAlpha = 1.0; // Reset opacity for other elements

    // Check if node is highlighted or hovered
    const isHighlighted = (highlightedNodesSet && highlightedNodesSet.has(node.id)) ||
                         (hoveredNodeRef && node.id === hoveredNodeRef.id);

    // Add a border to the hexagon with glow effect for highlighted nodes
    if (isHighlighted) {
      // Add glow effect
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur = 15 * globalScale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2.5 * globalScale;

      // Draw a second, larger glow effect for even more emphasis
      ctx.stroke();
      ctx.shadowBlur = 25 * globalScale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3.5 * globalScale;
    } else {
      // Regular border
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5 * globalScale;
    }
    ctx.stroke();

    // If highlighted, darken the background to make the highlighted node stand out more
    if (isHighlighted && highlightedNodesSet && highlightedNodesSet.size > 0) {
      // This is handled by the link rendering, which dims non-highlighted links
    }

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw depth indicator (just a plain number without background)
    if (depth > 1) {
      // Calculate font size based on node size with a fixed scale
      // This ensures consistent text sizing regardless of zoom level
      const fontSize = Math.min(radius / 2, 14 * fixedScale);

      // Draw depth number directly without background
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Use a color that contrasts with the node color
      ctx.fillStyle = isHighlighted ? '#FFFFFF' : 'rgba(255,255,255,0.9)';

      // Draw the depth number
      ctx.fillText(depth.toString(), node.x, node.y);
    }

    // Draw node label if present
    if (node.label) {
      // Use fixed font size regardless of zoom level
      const fontSize = 12 * fixedScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(node.label, node.x, node.y + radius + fontSize);

      // Draw coordinate if present
      if (node.bimbaCoordinate) {
        ctx.font = `${fontSize*0.8}px Sans-Serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(node.bimbaCoordinate, node.x, node.y + radius + fontSize*2 + 5);
      }
    }
  }, []);

  return { drawHexagon };
}
