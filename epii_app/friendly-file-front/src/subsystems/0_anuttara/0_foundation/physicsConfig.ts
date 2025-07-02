/**
 * Physics Configuration for 2D Graph
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-0 (Bimba Vis / Geom Ground - Foundation)
 *
 * This file contains the physics configuration for the 2D graph visualization.
 */

import { PHYSICS_ALPHA_DECAY, PHYSICS_VELOCITY_DECAY, PHYSICS_ALPHA_MIN } from './constants';
import * as d3 from 'd3-force';
import { Node, Edge } from "../../../shared/components/meta/metaData";
import { MutableRefObject } from 'react';

// Physics parameter presets for different states (adapted from Meta3D)
export const PhysicsPresets2D = {
  // Default state - continuous motion without equilibrium
  default: {
    alpha: 0.5,            // Moderate initial energy for 2D
    alphaDecay: 0.005,     // Slow decay to prevent stopping
    velocityDecay: 0.1,    // Low friction for fluid movement
    alphaMin: 0.0005,      // Very low minimum alpha
    alphaTarget: 0.1       // Target to maintain activity
  },
  // Hover state - slightly more responsive
  hover: {
    alpha: 0.3,
    alphaDecay: 0.005,
    velocityDecay: 0.1,
    alphaMin: 0.0005,
    alphaTarget: 0.1
  },
  // Drag state - very responsive
  drag: {
    alpha: 1.0,            // Maximum energy during drag
    alphaDecay: 0.001,     // Very slow decay during drag
    velocityDecay: 0.05,   // Lower friction during drag
    alphaMin: 0.0005,
    alphaTarget: 0.2       // High target for maximum activity
  }
};

// Define interaction state interface for 2D
interface InteractionState2D {
  isInteracting: boolean;
  isHovering: boolean;
  isDragging: boolean;
  hoveredNodeId: string | null;
  draggedNodeId: string | null;
  clickedNodeId: string | null;
  physicsEnabled: boolean;
  originalRestart?: () => void;
}

/**
 * Configure physics for the 2D graph with advanced interaction management
 * @param simulation The D3 force simulation
 * @param nodes The graph nodes
 * @param edges The graph edges
 * @param interactionStateRef Reference to interaction state for physics management
 */
export function configurePhysics2D(
  simulation: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>,
  nodes: Node[],
  edges: Edge[],
  interactionStateRef?: MutableRefObject<any>
) {
  // Remove default forces
  simulation.force('charge', null);
  simulation.force('center', null);
  simulation.force('link', null);

  // Add custom forces

  // 1. Charge force - repulsion between nodes
  const chargeForce = d3.forceManyBody()
    .strength((node: any) => {
      // Mapped nodes have stronger repulsion to maintain structure
      if (node.bimbaCoordinate) {
        return -100;
      }
      // Unmapped nodes have weaker repulsion
      return -50;
    })
    .distanceMax(400);

  // 2. Center force - keeps the graph centered
  const centerForce = d3.forceCenter(0, 0);

  // 3. Link force - maintains connections between nodes
  // Cast edges to the type expected by d3.forceLink
  const linkForce = d3.forceLink(edges as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
    .id((d) => (d as Node).id)
    .distance((link: any) => {
      // Get source and target nodes
      const sourceId = typeof link.source === 'object' ? (link.source as { id: string }).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as { id: string }).id : link.target;
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);

      if (!sourceNode || !targetNode) return 100;

      // Mapped nodes should maintain more distance
      if (sourceNode.bimbaCoordinate && targetNode.bimbaCoordinate) {
        // Core relationships are tighter
        if (link.type === 'DEVELOPS_INTO' || link.type === 'CONTAINS' || link.type === 'RETURNS_TO') {
          return 150;
        }
        return 200;
      }

      // Unmapped nodes can be closer
      return 100;
    });

  // Add forces to simulation
  simulation.force('charge', chargeForce);
  simulation.force('center', centerForce);
  simulation.force('link', linkForce);

  // Configure physics parameters using presets
  const preset = PhysicsPresets2D.default;
  simulation.alpha(preset.alpha);
  simulation.alphaDecay(preset.alphaDecay);
  simulation.velocityDecay(preset.velocityDecay);
  simulation.alphaMin(preset.alphaMin);
  if (typeof simulation.alphaTarget === 'function') {
    simulation.alphaTarget(preset.alphaTarget);
  }

  // CRITICAL: Patch restart function to prevent physics disruption during interactions
  if (interactionStateRef && typeof simulation.restart === 'function') {
    // Save original restart function
    if (!interactionStateRef.current.originalRestart) {
      interactionStateRef.current.originalRestart = simulation.restart;

      // Patch the restart function to prevent alpha resets during interactions
      simulation.restart = function() {
        // CRITICAL: Block restart during ANY interaction (including highlighting)
        if (interactionStateRef.current.isInteracting || interactionStateRef.current.isHovering) {
          // During interactions, just ensure the simulation keeps running
          // without resetting alpha (which causes node scattering)
          const currentAlpha = this.alpha();
          if (currentAlpha < 0.1) {
            this.alpha(0.1); // Minimal boost to keep simulation alive
          }
          console.log('[Meta2D Physics] Restart blocked during interaction, alpha:', this.alpha());
        } else {
          // Only allow full restart when not interacting
          if (interactionStateRef.current.originalRestart) {
            console.log('[Meta2D Physics] Full restart allowed - no interaction');
            interactionStateRef.current.originalRestart.call(this);
          }
        }
      };
    }
  }

  // Removed custom stabilizing forces - the real fix is preventing physics resets
  // The root cause was the high-level refresh() calls, not physics instability
}

/**
 * Add orbital force for unmapped nodes
 * @param nodes The graph nodes
 */
export function addOrbitalForce(nodes: Node[]) {
  nodes.forEach((node) => {
    // Skip mapped nodes and nodes being dragged
    if (node.bimbaCoordinate || node.fx !== undefined || node.fy !== undefined || node.__dragging) return;

    // Skip if no parent ID
    if (!node.parentId) return;

    // Find parent node
    const parentNode = nodes.find(n => n.id === node.parentId);
    if (!parentNode) return;

    // Calculate distance to parent
    const dx = node.x - parentNode.x;
    const dy = node.y - parentNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Skip if distance is zero
    if (distance === 0) return;

    // Calculate target distance based on virtual depth
    const targetDistance = 100 + (node.virtualDepth || 3) * 20;

    // Calculate force strength
    const strength = 0.05;

    // Apply force to move towards target distance
    const factor = strength * (1 - targetDistance / distance);
    node.vx = (node.vx || 0) - dx * factor;
    node.vy = (node.vy || 0) - dy * factor;

    // Add slight orbital motion
    const angle = Math.atan2(dy, dx) + Math.PI / 2;
    const orbitalStrength = 0.02;
    node.vx = (node.vx || 0) + Math.cos(angle) * orbitalStrength;
    node.vy = (node.vy || 0) + Math.sin(angle) * orbitalStrength;
  });
}
