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

/**
 * Configure physics for the 2D graph
 * @param simulation The D3 force simulation
 * @param nodes The graph nodes
 * @param edges The graph edges
 */
export function configurePhysics2D(
  simulation: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>,
  nodes: Node[],
  edges: Edge[]
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

  // Configure physics parameters
  simulation.alpha(0.5);
  simulation.alphaDecay(PHYSICS_ALPHA_DECAY);
  simulation.velocityDecay(PHYSICS_VELOCITY_DECAY);
  simulation.alphaMin(PHYSICS_ALPHA_MIN);
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
