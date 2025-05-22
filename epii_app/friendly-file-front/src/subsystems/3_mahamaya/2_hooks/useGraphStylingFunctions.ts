/**
 * useGraphStylingFunctions Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-3-2 (QL/AT Vis - Mahamaya - Hooks)
 *
 * This hook provides memoized styling functions for nodes and links in the 3D graph.
 * It ensures that styling functions are recreated when highlighting state changes.
 */

import { useCallback, useEffect } from 'react';
import { calculateNodeColor, calculateNodeSize } from '../1_utils/nodeStyleUtils';
import { startLinkPulse, calculatePulseFactor, applyPulsationToColor } from '../../2_parashakti/1_utils/linkPulseUtils';
import { useMeta3D } from '../../1_paramasiva/4_context/Meta3DContainer';

/**
 * Hook for providing memoized styling functions for nodes and links in the 3D graph.
 *
 * This hook is responsible for styling nodes and links based on their properties and interaction state.
 * It uses a unified approach based on virtual depth for all nodes, regardless of whether they are
 * mapped (have bimbaCoordinate) or unmapped.
 *
 * UNIFIED STYLING APPROACH:
 * - Uses virtual depth as the primary factor for styling all nodes
 * - Doesn't distinguish between mapped and unmapped nodes in the styling logic
 * - Uses pre-calculated values (node.color, node.val) when available
 * - Provides consistent fallback calculations based on virtual depth
 *
 * This ensures that all nodes are styled consistently, overcoming the separation between
 * mapped and unmapped nodes that was causing styling issues.
 *
 * @param highlightedNodes The set of highlighted node IDs
 * @param highlightedLinks The set of highlighted link IDs
 * @param pulsationFactor The current pulsation factor for animations
 * @returns Memoized styling functions for nodes and links
 */
export function useGraphStylingFunctions(
  highlightedNodes: Set<string>,
  highlightedLinks: Set<string>,
  pulsationFactor: number = 1.0
) {
  // Get all nodes from the Meta3D context
  const { nodes: allNodes } = useMeta3D();

  // Start the link pulse animation when the hook is first used
  useEffect(() => {
    // Start the link pulse animation
    startLinkPulse();

    // No cleanup needed as the animation will continue for the lifetime of the app
  }, []);

  // Node color function - memoized to prevent unnecessary re-renders
  const getNodeColor = useCallback((node: any) => {
    // Check if node is highlighted
    const isHighlighted = node.id && highlightedNodes.has(node.id);

    // Get the node's virtual depth
    const virtualDepth = node.virtualDepth !== undefined ? node.virtualDepth : 3;

    // UNIFIED APPROACH: Always use calculateNodeColor with the proper priority system
    // This ensures consistent coloring across all nodes based on virtual depth
    // The function handles all special cases internally
    return calculateNodeColor(
      node.type,
      virtualDepth,
      isHighlighted,
      node.bimbaCoordinate,
      node.parentId,
      allNodes // Pass all nodes to allow parent color inheritance
    );
  }, [highlightedNodes, allNodes]);

  // Node size function - memoized to prevent unnecessary re-renders
  const getNodeSize = useCallback((node: any) => {
    // Check if node is highlighted
    const isHighlighted = node.id && highlightedNodes.has(node.id);

    // Get the node's virtual depth
    const virtualDepth = node.virtualDepth !== undefined ? node.virtualDepth : 3;

    // UNIFIED APPROACH: Calculate base size using the unified approach
    // This ensures consistent sizing across all nodes based on virtual depth
    const baseSize = calculateNodeSize(
      virtualDepth,
      node.bimbaCoordinate,
      8 // Increased baseSize for 3D mode to make nodes larger
    );

    // Apply highlight effect if needed
    if (isHighlighted) {
      // For highlighted nodes, make them larger with pulsation
      return baseSize * (1.0 + (pulsationFactor - 1.0) * 0.5);
    } else {
      // For non-highlighted nodes, use the calculated size
      return baseSize;
    }
  }, [highlightedNodes, pulsationFactor]);

  // Node opacity function - memoized to prevent unnecessary re-renders
  const getNodeOpacity = useCallback((node: any) => {
    // Check if node is highlighted
    const isHighlighted = node.id && highlightedNodes.has(node.id);

    // Return opacity based on highlight state
    if (isHighlighted) {
      // For highlighted nodes, make them more opaque
      // Apply pulsation factor for animation effect
      return 0.9;
    } else {
      // For non-highlighted nodes, use a lower opacity
      return 0.7;
    }
  }, [highlightedNodes]);

  // Link width function - memoized to prevent unnecessary re-renders
  const getLinkWidth = useCallback((link: any) => {
    // Generate link ID if not present
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;

    // Try multiple ID formats to ensure compatibility
    const id = link.id || `${sourceId}-${targetId}`;
    const altId = `${sourceId}-${targetId}`;
    const reverseId = `${targetId}-${sourceId}`;

    // Check if link is highlighted
    const isHighlighted =
      highlightedLinks.has(id) ||
      highlightedLinks.has(altId) ||
      highlightedLinks.has(reverseId);

    // Return width based on highlight state with pulsation
    if (isHighlighted) {
      // Apply pulsation to width for highlighted links
      return 1.5 + (pulsationFactor - 1.0) * 0.5; // Varies based on pulsation
    } else {
      // Check if this is a main subsystem link
      const isMainSubsystemLink =
        link.type === 'DEVELOPS_INTO' ||
        link.type === 'CONTAINS' ||
        link.type === 'RETURNS_TO';

      if (isMainSubsystemLink) {
        return 0.9; // Increased thickness for main subsystem links (was 0.5)
      } else {
        return 0.4; // Increased thickness for other relationships (was 0.2)
      }
    }
  }, [highlightedLinks, pulsationFactor]);

  // Link color function - memoized to prevent unnecessary re-renders
  const getLinkColor = useCallback((link: any) => {
    // Generate link ID if not present
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;

    // Try multiple ID formats to ensure compatibility
    const id = link.id || `${sourceId}-${targetId}`;
    const altId = `${sourceId}-${targetId}`;
    const reverseId = `${targetId}-${sourceId}`;

    // Check if link is highlighted
    const isHighlighted =
      highlightedLinks.has(id) ||
      highlightedLinks.has(altId) ||
      highlightedLinks.has(reverseId);

    // Check if this is a main subsystem link
    const isMainSubsystemLink =
      link.type === 'DEVELOPS_INTO' ||
      link.type === 'CONTAINS' ||
      link.type === 'RETURNS_TO';

    // Calculate the pulse factor for this frame
    const currentPulseFactor = calculatePulseFactor();

    // Return color based on highlight state with pulsation
    if (isHighlighted) {
      // Apply pulsation to opacity for highlighted links
      return applyPulsationToColor(`rgba(255, 255, 255, 0.8)`, currentPulseFactor);
    } else if (isMainSubsystemLink) {
      // Apply stronger pulsation to main subsystem links with higher max opacity
      return applyPulsationToColor(`rgba(180, 180, 220, 0.7)`, currentPulseFactor * 0.9);
    } else {
      // Apply moderate pulsation to regular links with higher max opacity
      return applyPulsationToColor(`rgba(170, 170, 170, 0.5)`, currentPulseFactor * 0.7);
    }
  }, [highlightedLinks]);

  // Link directional particles function - memoized to prevent unnecessary re-renders
  const getLinkDirectionalParticles = useCallback((link: any) => {
    // Generate link ID if not present
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;

    // Try multiple ID formats to ensure compatibility
    const id = link.id || `${sourceId}-${targetId}`;
    const altId = `${sourceId}-${targetId}`;
    const reverseId = `${targetId}-${sourceId}`;

    // Check if link is highlighted
    const isHighlighted =
      highlightedLinks.has(id) ||
      highlightedLinks.has(altId) ||
      highlightedLinks.has(reverseId);

    // Always show directional particles, more for highlighted links
    // Check if this is a main subsystem link
    const isMainSubsystemLink =
      link.type === 'DEVELOPS_INTO' ||
      link.type === 'CONTAINS' ||
      link.type === 'RETURNS_TO';

    if (isHighlighted) {
      return 4; // More particles for highlighted links
    } else if (isMainSubsystemLink) {
      return 2; // Medium particles for main subsystem links
    } else {
      return 1; // Fewer particles for other links
    }
  }, [highlightedLinks]);

  // Styling functions are memoized and will update when highlighting state changes

  // Return all styling functions
  return {
    getNodeColor,
    getNodeSize,
    getNodeOpacity,
    getLinkWidth,
    getLinkColor,
    getLinkDirectionalParticles
  };
}
