/**
 * SymbolicRepresentation Component
 *
 * This component is responsible for the visual styling and representation of nodes.
 * It aligns with the #3 Mahamaya subsystem (symbolic integration).
 *
 * Bimba Tech Architecture Alignment:
 * - Contributes to Module #5-3-3 (Symbolic Transform Matrix)
 * - Visualizes symbolic integration through node styling and representation
 * - Embodies the Mahamaya principle (symbolic integration) by representing
 *   the meaningful patterns and symbols in the knowledge structure
 * - Future enhancement potential: Expand to include more sophisticated symbolic
 *   representations and transformations between symbolic systems
 */

import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useMeta3D } from '../../1_paramasiva/4_context/Meta3DContainer';
import { calculateNodeColor, calculateNodeSize } from '../../../utils/graphUtils';

export const SymbolicRepresentation: React.FC = () => {
  const {
    nodes,
    graphRef,
    highlightedNodes
  } = useMeta3D();

  // Override the node object in the ForceGraph3D component
  useEffect(() => {
    if (!graphRef.current) return;

    // Set node size based on virtual depth
    graphRef.current.nodeVal((node) => {
      // Scale node size based on virtual depth and bimbaCoordinate
      const baseSize = 2;
      const depth = node.virtualDepth !== undefined ? node.virtualDepth : 3;

      // Root node (#) is largest
      if (node.bimbaCoordinate === '#') {
        return baseSize * 6;
      }

      // Main subsystem nodes (#0-#5) are larger
      if (node.bimbaCoordinate && /^#[0-5]$/.test(node.bimbaCoordinate)) {
        return baseSize * 4;
      }

      // Other mapped nodes are medium-sized
      if (node.bimbaCoordinate) {
        return baseSize * 3;
      }

      // Unmapped nodes are smallest, size decreases with depth
      return baseSize * Math.max(1, 4 - depth * 0.5);
    });

    // Set node relative size
    graphRef.current.nodeRelSize(8);

    // Set node color based on type and virtual depth
    graphRef.current.nodeColor((node) => {
      const isHighlighted = highlightedNodes.has(node.id);
      const depth = node.virtualDepth !== undefined ? node.virtualDepth : 3;

      // Use pre-calculated color if available
      if (node.color) return node.color;

      // Calculate color based on node type and depth
      return calculateNodeColor(node.type, depth, isHighlighted);
    });

    // Set custom 3D node object
    graphRef.current.nodeThreeObject((node) => {
      // Create a group to hold both the sphere and the translucent outer sphere
      const group = new THREE.Group();

      // Inner sphere - size based on node's virtual depth
      let sphereSize = 6; // Default size

      // Adjust size based on virtual depth
      if (node.bimbaCoordinate === '#') {
        // Root node is largest
        sphereSize = 12;
      } else if (node.bimbaCoordinate && /^#[0-5]$/.test(node.bimbaCoordinate)) {
        // Main subsystem nodes are larger
        sphereSize = 10;
      } else if (node.bimbaCoordinate) {
        // Other mapped nodes are medium-sized
        sphereSize = 8;
      } else {
        // Unmapped nodes are smallest, size decreases with depth
        const depth = node.virtualDepth !== undefined ? node.virtualDepth : 3;
        sphereSize = Math.max(4, 8 - depth);
      }

      // Get node color
      const nodeColor = node.color || calculateNodeColor(node.type, node.virtualDepth || 3, false);

      // Create inner sphere
      const sphereGeometry = new THREE.SphereGeometry(sphereSize, 16, 16);
      const sphereMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(sphere);

      // Create outer translucent sphere for highlighted nodes
      if (highlightedNodes.has(node.id)) {
        const outerSphereGeometry = new THREE.SphereGeometry(sphereSize * 1.3, 16, 16);
        const outerSphereMaterial = new THREE.MeshLambertMaterial({
          color: new THREE.Color('white'),
          transparent: true,
          opacity: 0.3
        });
        const outerSphere = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);
        group.add(outerSphere);
      }

      // Add label for mapped nodes
      if (node.bimbaCoordinate) {
        // Create text sprite for label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = 256;
          canvas.height = 128;

          // Clear canvas
          context.fillStyle = 'rgba(0, 0, 0, 0)';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Draw text
          context.font = '24px Arial';
          context.fillStyle = 'white';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(node.bimbaCoordinate, canvas.width / 2, canvas.height / 2);

          // Create sprite
          const texture = new THREE.CanvasTexture(canvas);
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(20, 10, 1);
          sprite.position.set(0, sphereSize * 1.5, 0);
          group.add(sprite);
        }
      }

      return group;
    });

    // Enable node three object extension
    graphRef.current.nodeThreeObjectExtend(true);

    // Force a refresh to apply changes
    graphRef.current.refresh();
  }, [graphRef, nodes, highlightedNodes]);

  return null; // This component doesn't render anything directly
};

export default SymbolicRepresentation;
