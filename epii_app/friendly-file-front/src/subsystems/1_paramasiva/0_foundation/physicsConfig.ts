/**
 * Physics Configuration for 3D Graph
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-0 (QL/AT Vis - Foundation)
 *
 * This file contains the physics configuration for the 3D graph visualization.
 */

// No need to import constants as we're using presets

// Physics parameter presets for different states
export const PhysicsPresets = {
  // Default state - continuous motion without equilibrium
  default: {
    alpha: 0.8,            // Higher initial energy
    alphaDecay: 0.00001,   // Ultra-slow decay to prevent equilibrium
    velocityDecay: 0.01,   // Very low friction for fluid, continuous movement
    alphaMin: 0,           // No minimum alpha - never stop naturally
    alphaTarget: 0.1       // High target to maintain constant activity
  },
  // Hover state - slightly more responsive
  hover: {
    alpha: 0.6,
    alphaDecay: 0.00001,   // Ultra-slow decay
    velocityDecay: 0.01,   // Very low friction
    alphaMin: 0,
    alphaTarget: 0.1       // Same high target as default
  },
  // Drag state - very responsive, no decay
  drag: {
    alpha: 1.0,            // Maximum energy during drag
    alphaDecay: 0.000001,  // Practically no decay during drag
    velocityDecay: 0.005,  // Extremely low friction during drag
    alphaMin: 0,
    alphaTarget: 0.2       // Very high target for maximum activity
  }
};
import { InteractionState } from '../4_context/useCameraControls3D';
import { ForceGraph3DInstance } from 'react-force-graph';
import { MutableRefObject } from 'react';
import * as THREE from 'three';
import { Node } from '../../../components/meta/metaData';
import {
  getAnimationManager,
  AnimationSubsystem,
  AnimationCategory,
  AnimationPriority
} from '../../2_parashakti/1_utils/AnimationManager';

/**
 * Configure physics for the 3D graph
 * @param fgRef Reference to the ForceGraph3D component
 * @param interactionStateRef Reference to the interaction state
 */
export function configurePhysics3D(
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  interactionStateRef: MutableRefObject<InteractionState>
) {
  if (!fgRef.current) return;

  // Configure physics for 3D
  const fg = fgRef.current;

  // Set up physics forces
  if (fg.d3Force) {
    try {
      // Ensure 3D physics
      const simulation = fg.d3Force();
      if (simulation && simulation.numDimensions && typeof simulation.numDimensions === 'function') {
        simulation.numDimensions(3);
      }

      // Configure physics parameters for fluid motion
      if (simulation) {
        // Save the original restart function
        if (typeof simulation.restart === 'function' && !interactionStateRef.current.originalRestart) {
          interactionStateRef.current.originalRestart = simulation.restart;

          // Store the original restart function on the simulation object as well
          // This allows other components to access it directly
          simulation.__originalRestart = simulation.restart;

          // Patch the restart function to prevent alpha resets during interactions
          simulation.restart = function() {
            // Only apply a full restart if we're not in the middle of an interaction
            if (!interactionStateRef.current.isInteracting) {
              // Call the original restart function
              if (interactionStateRef.current.originalRestart) {
                interactionStateRef.current.originalRestart.call(this);
              }
            } else {
              // During interactions, just ensure the simulation keeps running
              // without resetting alpha (which causes the jarring restart)
              // Use a gentler alpha boost to prevent jarring motion
              this.alpha(Math.max(this.alpha(), 0.05));
            }
          };
        }

        // Configure physics parameters using the default preset
        const preset = PhysicsPresets.default;

        // Apply the preset parameters
        simulation.alpha(preset.alpha);
        simulation.alphaDecay(preset.alphaDecay);
        simulation.velocityDecay(preset.velocityDecay);
        simulation.alphaMin(preset.alphaMin);
        if (typeof simulation.alphaTarget === 'function') {
          simulation.alphaTarget(preset.alphaTarget);
        }

        // Store physics parameters in interaction state
        interactionStateRef.current.alpha = preset.alpha;
        interactionStateRef.current.alphaDecay = preset.alphaDecay;
        interactionStateRef.current.velocityDecay = preset.velocityDecay;
        interactionStateRef.current.alphaMin = preset.alphaMin;
        interactionStateRef.current.alphaTarget = preset.alphaTarget;

        // Add custom force to keep mapped nodes at their positions
        simulation.force('keepMappedNodesFixed', (alpha: number) => {
          // Get the nodes from the graph
          const nodes = fg.graphData().nodes || [];

          // Process each node
          nodes.forEach((node: any) => {
            // Skip nodes being dragged
            if (node.__dragging) return;

            // Handle mapped nodes
            if (node.bimbaCoordinate) {
              // Get the original fixed position
              const fx = node.__originalFx !== undefined ? node.__originalFx : node.fx;
              const fy = node.__originalFy !== undefined ? node.__originalFy : node.fy;
              const fz = node.__originalFz !== undefined ? node.__originalFz : node.fz;

              // If we have fixed positions, move the node back to them
              if (fx !== undefined && fy !== undefined && fz !== undefined) {
                // Calculate distance from current position to fixed position
                const dx = fx - node.x;
                const dy = fy - node.y;
                const dz = fz - node.z;

                // Calculate distance squared for efficiency
                const distanceSquared = dx * dx + dy * dy + dz * dz;

                // Apply force to move back to fixed position
                // Use a stronger force for more precise positioning
                // Scale the strength based on distance - stronger when further away
                const baseStrength = 0.1; // Increased for more direct positioning
                const distanceStrength = Math.min(0.2, distanceSquared / 5000); // Stronger distance-based adjustment
                const strength = (baseStrength + distanceStrength) * alpha;

                // Update velocity
                node.vx = (node.vx || 0) + dx * strength;
                node.vy = (node.vy || 0) + dy * strength;
                node.vz = (node.vz || 0) + dz * strength;
              }
            }
          });
        });

        // Add custom force to keep unmapped nodes connected to their links
        simulation.force('keepUnmappedNodesConnected', (alpha: number) => {
          // Get the nodes and links from the graph
          const nodes = fg.graphData().nodes || [];
          const links = fg.graphData().links || [];

          // Create a map of node connections
          const nodeConnections = new Map<string, string[]>();

          // Build the connection map
          links.forEach((link: any) => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

            if (!nodeConnections.has(sourceId)) {
              nodeConnections.set(sourceId, []);
            }
            if (!nodeConnections.has(targetId)) {
              nodeConnections.set(targetId, []);
            }

            nodeConnections.get(sourceId)?.push(targetId);
            nodeConnections.get(targetId)?.push(sourceId);
          });

          // Process unmapped nodes
          nodes.forEach((node: any) => {
            // Skip mapped nodes and nodes being dragged
            if (node.bimbaCoordinate || node.__dragging) return;

            // Skip nodes that are currently highlighted (to allow smoother highlighting)
            if (interactionStateRef.current.hoveredNodeId === node.id ||
                interactionStateRef.current.clickedNodeId === node.id) return;

            // Get connections for this node
            const connections = nodeConnections.get(node.id) || [];
            if (connections.length === 0) return;

            // Calculate center of connected nodes
            let centerX = 0;
            let centerY = 0;
            let centerZ = 0;
            let count = 0;
            let hasMappedConnection = false;

            connections.forEach(connId => {
              const connNode = nodes.find((n: any) => n.id === connId);
              if (connNode) {
                // Give more weight to mapped nodes to keep unmapped nodes closer to the structure
                const weight = connNode.bimbaCoordinate ? 2.0 : 1.0;
                centerX += (connNode.x || 0) * weight;
                centerY += (connNode.y || 0) * weight;
                centerZ += (connNode.z || 0) * weight;
                count += weight;

                // Track if this node has any mapped connections
                if (connNode.bimbaCoordinate) {
                  hasMappedConnection = true;
                }
              }
            });

            if (count > 0) {
              centerX /= count;
              centerY /= count;
              centerZ /= count;

              // Calculate distance from node to center of connections
              const dx = centerX - node.x;
              const dy = centerY - node.y;
              const dz = centerZ - node.z;
              const distanceSquared = dx * dx + dy * dy + dz * dz;
              const distance = Math.sqrt(distanceSquared);

              // Apply very gentle force to keep node near its connections
              // Use a much weaker force for unmapped nodes to allow free-flowing movement
              // But use a slightly stronger force for nodes connected to mapped nodes
              const baseStrength = hasMappedConnection ? 0.1 : 0.5; // Significantly reduced

              // Scale strength based on distance - only apply when very far away
              const distanceThreshold = hasMappedConnection ? 1000 : 220; // Increased thresholds

              // Only apply force if the node is too far from its connections
              if (distance > distanceThreshold) {
                // Calculate strength based on how far beyond the threshold the node is
                const distanceFactor = Math.min(50.0, (distance - distanceThreshold) / 200);
                const strength = baseStrength * distanceFactor * alpha;

                // Update velocity with a gentler force
                node.vx = (node.vx || 0) + dx * strength;
                node.vy = (node.vy || 0) + dy * strength;
                node.vz = (node.vz || 0) + dz * strength;
              }

              // Enhanced orbital motion for more natural, free-flowing behavior
              // This creates a more dynamic, fluid motion with orbital tendencies
              if (!interactionStateRef.current.isDragging) {
                // Calculate distance from center for orbital strength scaling
                const distanceFromCenter = Math.sqrt(distanceSquared);

                // Base orbital strength - significantly increased for more visible motion
                // This creates a more dynamic orbital effect with noticeable movement
                const baseOrbitalStrength = 0.01 * alpha; // Increased from 0.003
                const distanceScale = Math.min(1.0, 150 / Math.max(10, distanceFromCenter));
                const orbitalStrength = baseOrbitalStrength * distanceScale;

                // Calculate orbital angle perpendicular to the center direction
                const angle = Math.atan2(dy, dx) + Math.PI / 2;

                // Apply orbital velocity with slight randomization for natural variation
                const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% variation
                node.vx = (node.vx || 0) + Math.cos(angle) * orbitalStrength * randomFactor;
                node.vy = (node.vy || 0) + Math.sin(angle) * orbitalStrength * randomFactor;

                // Add slight z-axis oscillation for more interesting 3D motion
                // Use a sine wave based on the node's ID to create consistent but varied motion
                const nodeIdHash = node.id ? node.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
                const zOscillation = Math.sin((Date.now() / 2000) + nodeIdHash) * orbitalStrength * 0.5;
                node.vz = (node.vz || 0) + zOscillation;
              }
            }
          });
        });

        // Add a gravitational force that pulls nodes toward their parent nodes
        simulation.force('parentGravity', (alpha: number) => {
          // Get the nodes from the graph
          const nodes = fg.graphData().nodes || [];

          // Process each node
          nodes.forEach((node: any) => {
            // Skip nodes being dragged
            if (node.__dragging) return;

            // Skip nodes that are currently highlighted
            if (interactionStateRef.current.hoveredNodeId === node.id ||
                interactionStateRef.current.clickedNodeId === node.id) return;

            // Skip nodes without a parent
            if (!node.parentId) return;

            // Find the parent node
            const parentNode = nodes.find((n: any) => n.id === node.parentId);
            if (!parentNode) return;

            // Calculate direction to parent
            const dx = parentNode.x - node.x;
            const dy = parentNode.y - node.y;
            const dz = parentNode.z - node.z;

            // Calculate distance squared
            const distanceSquared = dx * dx + dy * dy + dz * dz;
            const distance = Math.sqrt(distanceSquared);

            // Skip if too close to parent (prevents oscillation)
            if (distance < 5) return;

            // Calculate gravitational strength - very gentle to allow free movement
            // Use inverse square law for realistic gravity (strength ∝ 1/r²) but with reduced strength
            const baseStrength = 0.08 * alpha; // Reduced from 0.002
            const distanceFactor = Math.min(1.0, 1000 / Math.max(100, distanceSquared));
            const strength = baseStrength * distanceFactor;

            // Apply gravitational force toward parent
            node.vx = (node.vx || 1) + dx * strength;
            node.vy = (node.vy || 1) + dy * strength;
            node.vz = (node.vz || 1) + dz * strength;

            // Add slight random variation for more natural motion
            const randomStrength = strength * 0.1;
            node.vx += (Math.random() - 0.1) * randomStrength;
            node.vy += (Math.random() - 0.1) * randomStrength;
            node.vz += (Math.random() - 0.1) * randomStrength;
          });
        });

        // Add a gentle repulsion force to prevent nodes from overlapping
        simulation.force('repulsion', (alpha: number) => {
          const nodes = fg.graphData().nodes || [];
          const repulsionDistance = 50; // Minimum distance between nodes
          const repulsionStrength = 0.02 * alpha;

          // Only process a subset of node pairs each frame for performance
          // This is a simple optimization to avoid O(n²) complexity
          for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            // Skip nodes being dragged
            if (nodeA.__dragging) continue;

            // Process every 5th node for performance (adjust as needed)
            for (let j = (i + 1) % 5; j < nodes.length; j += 5) {
              const nodeB = nodes[j];
              // Skip nodes being dragged
              if (nodeB.__dragging) continue;

              // Skip if both nodes are mapped (they have their own positioning)
              if (nodeA.bimbaCoordinate && nodeB.bimbaCoordinate) continue;

              // Calculate distance between nodes
              const dx = nodeB.x - nodeA.x;
              const dy = nodeB.y - nodeA.y;
              const dz = nodeB.z - nodeA.z;
              const distanceSquared = dx * dx + dy * dy + dz * dz;

              // Only apply repulsion if nodes are too close
              if (distanceSquared > 0 && distanceSquared < repulsionDistance * repulsionDistance) {
                const distance = Math.sqrt(distanceSquared);
                const force = repulsionStrength * (repulsionDistance - distance) / distance;

                // Apply repulsion force
                if (!nodeA.bimbaCoordinate) {
                  nodeA.vx = (nodeA.vx || 0) - dx * force;
                  nodeA.vy = (nodeA.vy || 0) - dy * force;
                  nodeA.vz = (nodeA.vz || 0) - dz * force;
                }

                if (!nodeB.bimbaCoordinate) {
                  nodeB.vx = (nodeB.vx || 0) + dx * force;
                  nodeB.vy = (nodeB.vy || 0) + dy * force;
                  nodeB.vz = (nodeB.vz || 0) + dz * force;
                }
              }
            }
          }
        });

        // Add orbital motion force for unmapped nodes
        simulation.force('orbitalMotion', (alpha: number) => {
          const nodes = fg.graphData().nodes || [];

          // Process each unmapped node
          nodes.forEach((node: any) => {
            // Skip mapped nodes, nodes being dragged, or nodes without a parent
            if (node.bimbaCoordinate || node.__dragging || !node.parentId) return;

            // Find the parent node
            const parentNode = nodes.find((p) => p.id === node.parentId);
            if (!parentNode) return;

            // Calculate vector from parent to node
            const dx = node.x - parentNode.x;
            const dy = node.y - parentNode.y;
            const dz = node.z - parentNode.z;

            // Calculate distance from parent
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (distance === 0) return; // Avoid division by zero

            // Calculate unit vector from parent to node
            const ux = dx / distance;
            const uy = dy / distance;
            const uz = dz / distance;

            // Calculate target distance based on virtual depth
            // Deeper nodes orbit further from their parents
            const virtualDepth = node.virtualDepth || 3;
            const targetDistance = 50 + virtualDepth * 20;

            // Apply gravitational force to maintain target distance
            const distanceError = distance - targetDistance;
            const gravityStrength = 0.03 * alpha;

            // Apply force along radius vector to maintain target distance
            node.vx = (node.vx || 0) - ux * distanceError * gravityStrength;
            node.vy = (node.vy || 0) - uy * distanceError * gravityStrength;
            node.vz = (node.vz || 0) - uz * distanceError * gravityStrength;

            // Calculate orbital plane
            // We'll use the cross product of the radius vector and the up vector
            // to get a vector perpendicular to both, which gives us the orbital direction

            // Define "up" vector - we'll use the z-axis as default
            const upX = 0;
            const upY = 0;
            const upZ = 1;

            // Calculate cross product (r × up) to get tangential direction
            // This creates a vector perpendicular to both the radius and up vectors
            let tangentX = uy * upZ - uz * upY;
            let tangentY = uz * upX - ux * upZ;
            let tangentZ = ux * upY - uy * upX;

            // Normalize the tangent vector
            const tangentLength = Math.sqrt(tangentX*tangentX + tangentY*tangentY + tangentZ*tangentZ);
            if (tangentLength > 0) {
              tangentX /= tangentLength;
              tangentY /= tangentLength;
              tangentZ /= tangentLength;

              // Apply orbital velocity - scale by alpha and virtual depth
              // Deeper nodes orbit more slowly (inverse relationship)
              const orbitalStrength = 0.1 * alpha / Math.sqrt(virtualDepth);

              // Add velocity in the tangential direction to create orbital motion
              node.vx = (node.vx || 0) + tangentX * orbitalStrength;
              node.vy = (node.vy || 0) + tangentY * orbitalStrength;
              node.vz = (node.vz || 0) + tangentZ * orbitalStrength;

              // Add slight random variation for more natural motion
              // Use node ID hash for consistent but varied behavior
              const nodeIdHash = node.id ? node.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0) : 0;
              const timeOffset = nodeIdHash % 1000;
              const time = Date.now() + timeOffset;

              // Add slight oscillation in the orbital plane
              const oscillationStrength = 0.01 * alpha;
              const oscillationFactor = Math.sin(time / 2000);
              node.vx = (node.vx || 0) + tangentX * oscillationFactor * oscillationStrength;
              node.vy = (node.vy || 0) + tangentY * oscillationFactor * oscillationStrength;
              node.vz = (node.vz || 0) + tangentZ * oscillationFactor * oscillationStrength;
            }
          });
        });

        // Register physics simulation with the animation manager
        registerPhysicsWithAnimationManager(simulation, interactionStateRef);
      }
    } catch (error) {
      console.error('Error configuring physics:', error);
    }
  }
}

/**
 * Register the physics simulation with the animation manager
 * @param simulation The D3 force simulation
 * @param interactionStateRef Reference to the interaction state
 */
function registerPhysicsWithAnimationManager(
  simulation: any,
  interactionStateRef: MutableRefObject<InteractionState>
) {
  // Get the animation manager instance
  const animationManager = getAnimationManager();

  // Register the physics simulation with the animation manager
  animationManager.registerAnimation(
    (_time, _deltaTime) => {
      // Skip if simulation is not available
      if (!simulation) return;

      // Get the appropriate physics preset based on interaction state
      const preset = interactionStateRef.current.isDragging
        ? PhysicsPresets.drag
        : interactionStateRef.current.isHovering
          ? PhysicsPresets.hover
          : PhysicsPresets.default;

      // Apply the preset parameters
      if (typeof simulation.alphaTarget === 'function') {
        simulation.alphaTarget(preset.alphaTarget);
      }

      if (typeof simulation.alphaDecay === 'function') {
        simulation.alphaDecay(preset.alphaDecay);
      }

      if (typeof simulation.velocityDecay === 'function') {
        simulation.velocityDecay(preset.velocityDecay);
      }

      // CRITICAL: Ensure alpha is high enough to keep the simulation running
      if (typeof simulation.alpha === 'function') {
        const currentAlpha = simulation.alpha();
        if (currentAlpha < 0.1) {
          simulation.alpha(0.5); // Boost alpha if it gets too low
        }
      }

      // Periodically restart the simulation to ensure it keeps running
      // This is especially important at the beginning
      if (typeof simulation.restart === 'function' && Math.random() < 0.01) { // 1% chance each frame
        simulation.restart();
      }

      // Apply a gentle alpha boost if it's getting too low
      // This ensures the simulation keeps running
      if (simulation.alpha() < preset.alphaTarget) {
        simulation.alpha(Math.max(simulation.alpha(), preset.alphaTarget));
      }
    },
    {
      subsystem: AnimationSubsystem.PARAMASIVA,
      category: AnimationCategory.PHYSICS,
      priority: AnimationPriority.HIGH,
      updateInterval: 0, // Update every frame for smoother response
      name: 'Meta3D Physics Simulation'
    }
  );
}

/**
 * Adjust physics for interaction state
 * @param fgRef Reference to the ForceGraph3D component
 * @param interactionStateRef Reference to the interaction state
 * @param isInteracting Whether the user is interacting with a node (hovering or dragging)
 * @param isDragging Whether the user is specifically dragging (stronger effect than just hovering)
 */
export function adjustPhysicsForInteraction(
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  interactionStateRef: MutableRefObject<InteractionState>,
  isInteracting: boolean,
  isDragging: boolean = false
) {
  if (!fgRef.current) return;

  // Get the force simulation
  const simulation = fgRef.current.d3Force();
  if (!simulation) return;

  // Update the interaction state flags
  interactionStateRef.current.isInteracting = isInteracting;

  // Select the appropriate preset based on interaction state
  let preset = PhysicsPresets.default; // Default preset as fallback

  if (isDragging) {
    // Update dragging state
    interactionStateRef.current.isDragging = true;
    interactionStateRef.current.isHovering = false;
    preset = PhysicsPresets.drag;

    // Give a strong alpha boost for immediate response during drag
    if (typeof simulation.alpha === 'function') {
      simulation.alpha(1.0); // Full energy for dragging
    }
  } else if (isInteracting) {
    // Update hovering state
    interactionStateRef.current.isHovering = true;
    interactionStateRef.current.isDragging = false;
    preset = PhysicsPresets.hover;

    // Give a moderate alpha boost for hover
    if (typeof simulation.alpha === 'function') {
      simulation.alpha(Math.max(simulation.alpha(), 0.6));
    }
  } else {
    // End of interaction - restore normal state
    interactionStateRef.current.isDragging = false;
    interactionStateRef.current.isHovering = false;
    interactionStateRef.current.isInteracting = false;
    preset = PhysicsPresets.default;

    // Give a small alpha boost to ensure physics continues running
    if (typeof simulation.alpha === 'function') {
      simulation.alpha(Math.max(simulation.alpha(), 0.8));
    }

    // Ensure physics is enabled
    interactionStateRef.current.physicsEnabled = true;
  }

  // Apply the selected preset parameters consistently
  if (typeof simulation.alphaTarget === 'function') {
    simulation.alphaTarget(preset.alphaTarget);
  }

  if (typeof simulation.alphaDecay === 'function') {
    simulation.alphaDecay(preset.alphaDecay);
  }

  if (typeof simulation.velocityDecay === 'function') {
    simulation.velocityDecay(preset.velocityDecay);
  }

  // Store the current physics parameters in the interaction state
  interactionStateRef.current.alpha = preset.alpha;
  interactionStateRef.current.alphaTarget = preset.alphaTarget;
  interactionStateRef.current.alphaDecay = preset.alphaDecay;
  interactionStateRef.current.velocityDecay = preset.velocityDecay;
  interactionStateRef.current.alphaMin = preset.alphaMin;
}

/**
 * Store original fixed positions for mapped nodes
 * @param nodes The graph nodes
 */
export function storeOriginalPositions(nodes: Node[]) {
  nodes.forEach((node) => {
    if (node.bimbaCoordinate) {
      // Store original fixed positions
      // Only store if the values are defined
      const typedNode = node as any; // Type assertion for dynamic properties
      if (typedNode.fx !== undefined) typedNode.__originalFx = typedNode.fx;
      if (typedNode.fy !== undefined) typedNode.__originalFy = typedNode.fy;
      if (typedNode.fz !== undefined) typedNode.__originalFz = typedNode.fz;
    }
  });
}

/**
 * Get physics configuration props for ForceGraph3D
 * @returns Physics configuration props for ForceGraph3D
 */
export function getPhysicsProps() {
  // Use the default preset for the ForceGraph3D props
  const preset = PhysicsPresets.default;

  return {
    cooldownTicks: Infinity, // Keep physics simulation running indefinitely
    cooldownTime: null, // Disable time-based cooldown completely
    warmupTicks: 0, // No initial warmup
    d3AlphaDecay: preset.alphaDecay,
    d3VelocityDecay: preset.velocityDecay,
    d3AlphaMin: preset.alphaMin,
    d3AlphaTarget: preset.alphaTarget,
    numDimensions: 3 // 3D visualization
  };
}

/**
 * Initialize physics for the 3D graph
 * This function handles all aspects of physics initialization
 * @param fgRef Reference to the ForceGraph3D component
 * @param interactionStateRef Reference to the interaction state
 * @param isMountedRef Reference to track if the component is mounted
 * @param graphData Graph data containing nodes and links
 * @param physicsInitializedRef Reference to track if physics is initialized
 * @param setPhysicsInitialized Function to set physics initialized state
 * @returns Cleanup function
 */
export function initializePhysics(
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  interactionStateRef: MutableRefObject<InteractionState>,
  // isMountedRef is not used, but kept for API compatibility
  _isMountedRef: MutableRefObject<boolean>,
  graphData: { nodes: Node[], links: any[] } | null | undefined,
  physicsInitializedRef: MutableRefObject<boolean>,
  setPhysicsInitialized: (initialized: boolean) => void
): () => void {
  // Initialize physics
  configurePhysics3D(fgRef, interactionStateRef);

  // CRITICAL: Explicitly restart the simulation to ensure it's running
  if (fgRef.current && typeof fgRef.current.d3Force === 'function') {
    const simulation = fgRef.current.d3Force();
    if (simulation) {
      // Set critical parameters directly to ensure continuous motion
      if (typeof simulation.alpha === 'function') {
        simulation.alpha(1.0); // Full energy
      }
      if (typeof simulation.alphaTarget === 'function') {
        simulation.alphaTarget(0.3); // High target to maintain constant activity
      }
      if (typeof simulation.restart === 'function') {
        simulation.restart();
        console.log('Physics simulation explicitly restarted during initialization');
      }
    }
  }

  // Store original positions for mapped nodes
  if (graphData?.nodes) {
    storeOriginalPositions(graphData.nodes);
  }

  // Mark physics as initialized - this will trigger wireframe creation
  physicsInitializedRef.current = true;
  setPhysicsInitialized(true);

  // Clean up function
  return () => {
    console.log('Physics cleanup: Stopping physics simulation');

    // Stop the physics simulation
    if (fgRef.current && typeof fgRef.current.d3Force === 'function') {
      try {
        const simulation = fgRef.current.d3Force();
        if (simulation && typeof simulation.stop === 'function') {
          simulation.stop();
        }

        // Set alpha to 0 to ensure simulation is fully stopped
        if (simulation && typeof simulation.alpha === 'function') {
          simulation.alpha(0);
        }
      } catch (error) {
        console.error('Error stopping physics simulation during cleanup:', error);
      }
    }

    // Reset physics state
    physicsInitializedRef.current = false;
    setPhysicsInitialized(false);

    console.log('Physics cleanup complete');
  };
}

/**
 * Set up a physics heartbeat to ensure continuous motion
 * @param fgRef Reference to the ForceGraph3D component
 * @param interactionStateRef Reference to the interaction state
 * @param isMountedRef Reference to track if the component is mounted
 * @param highlightedNodes Set of highlighted node IDs
 * @returns Cleanup function to clear the interval
 */
export function setupPhysicsHeartbeat(
  fgRef: MutableRefObject<ForceGraph3DInstance | null>,
  interactionStateRef: MutableRefObject<InteractionState>,
  isMountedRef: MutableRefObject<boolean>,
  highlightedNodesRef: Set<string> | { current: Set<string> }
): () => void {
  // Get the actual Set<string> from the reference if it's a ref object
  const getHighlightedNodes = () => {
    return 'current' in highlightedNodesRef ? highlightedNodesRef.current : highlightedNodesRef;
  };
  if (!fgRef.current) return () => {};

  // Get the ForceGraph3D instance
  const fg = fgRef.current;

  // Get the animation manager instance
  const animationManager = getAnimationManager();

  // Register the physics heartbeat with the animation manager
  // This ensures it's properly coordinated with other animations
  const heartbeatId = animationManager.registerAnimation(
    (_time, _deltaTime) => {
      if (!fg || !fg.d3Force || !isMountedRef.current) return;

      try {
        const simulation = fg.d3Force();
        if (simulation && typeof simulation.alpha === 'function') {
          // Skip physics adjustments during interactions to prevent disruption
          if (interactionStateRef.current.isInteracting) {
            return;
          }

          // Boost alpha more aggressively to ensure continuous motion
          // This is critical for preventing the simulation from stopping
          if (simulation.alpha() < 0.2) {
            // Apply a stronger boost
            simulation.alpha(0.5);
            console.log('Physics alpha boosted to 0.5');
          }

          // Make sure alphaTarget is set high enough to prevent stopping
          if (typeof simulation.alphaTarget === 'function') {
            simulation.alphaTarget(0.1); // Higher value for more continuous motion
          }

          // Periodically restart the simulation to ensure it keeps running
          if (typeof simulation.restart === 'function' && Math.random() < 0.01) { // 1% chance each frame
            simulation.restart();
            console.log('Physics simulation restarted in heartbeat');
          }

          // Apply random impulses only to unmapped nodes that aren't being interacted with
          const nodes = simulation.nodes();
          if (nodes && nodes.length > 0) {
            // Only apply impulses to a subset of nodes each time for better performance
            // and to create more natural, varied motion
            const randomOffset = Math.floor(Math.random() * 5); // Random starting offset

            for (let i = randomOffset; i < nodes.length; i += 5) { // Process every 5th node
              const n = nodes[i];

              // Skip mapped nodes, nodes being dragged, and nodes that are highlighted
              const highlightedNodesSet = getHighlightedNodes();
              if (n.bimbaCoordinate || n.fx !== undefined || n.fy !== undefined ||
                  n.__dragging || (n.id && highlightedNodesSet.has(n.id))) {
                continue;
              }

              // Apply more dynamic random impulses for natural, free-flowing motion
              // This creates more interesting and varied 3D motion

              // Base strength for more dynamic, free-flowing motion
              const baseStrength = 0.5; // Significantly increased for more visible motion

              // Calculate node-specific variation based on its ID for consistent behavior
              // This makes each node have its own characteristic motion pattern
              const nodeIdHash = n.id ? n.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0) : 0;
              const nodeSpecificFactor = 0.8 + ((nodeIdHash % 100) / 100) * 0.4; // 80-120% variation

              // Time-based oscillation for more natural, flowing motion
              const timeFactor = Math.sin((Date.now() / 3000) + nodeIdHash);

              // Calculate strengths with more variation in Z axis
              const xStrength = baseStrength * nodeSpecificFactor * (0.8 + Math.random() * 0.4);
              const yStrength = baseStrength * nodeSpecificFactor * (0.8 + Math.random() * 0.4);
              const zStrength = baseStrength * nodeSpecificFactor * (1.2 + Math.random() * 0.8) * (1 + timeFactor * 0.3);

              // Apply impulses with slight directional bias based on time
              // This creates flowing currents in the motion rather than pure randomness
              const xBias = Math.sin((Date.now() / 5000)) * 0.2;
              const yBias = Math.cos((Date.now() / 6000)) * 0.2;
              const zBias = Math.sin((Date.now() / 4000)) * 0.3;

              n.vx += ((Math.random() - 0.5) + xBias) * xStrength;
              n.vy += ((Math.random() - 0.5) + yBias) * yStrength;
              n.vz += ((Math.random() - 0.5) + zBias) * zStrength;

              // If node has a parent, add a slight drift toward parent for cohesion
              if (n.parentId) {
                const parent = nodes.find((p) => p.id === n.parentId);
                if (parent) {
                  const dx = parent.x - n.x;
                  const dy = parent.y - n.y;
                  const dz = parent.z - n.z;
                  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                  if (dist > 0) {
                    // Very gentle drift - just enough to maintain some cohesion
                    const driftStrength = 0.0005; // Reduced by half for more freedom
                    n.vx += (dx / dist) * driftStrength;
                    n.vy += (dy / dist) * driftStrength;
                    n.vz += (dz / dist) * driftStrength;
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in physics heartbeat:', error);
      }
    },
    {
      subsystem: AnimationSubsystem.PARAMASIVA,
      category: AnimationCategory.PHYSICS,
      priority: AnimationPriority.MEDIUM,
      updateInterval: 100, // More frequent updates for smoother motion
      name: 'Meta3D Physics Heartbeat'
    }
  );

  // Return cleanup function
  return () => {
    // Unregister the animation when component unmounts
    animationManager.unregisterAnimation(heartbeatId);
  };
}
