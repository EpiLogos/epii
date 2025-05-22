/**
 * Torus Wireframe Utilities
 *
 * This file contains functions for creating and updating torus wireframes
 * in the 3D visualization. The torus runs through nodes 0 and 5 of each system,
 * forming a band around the diamond.
 */

import * as THREE from 'three';
import { Node } from '../components/meta/metaData';
import { calculate3DDiamondPosition } from './calculate3DDiamondPosition';

/**
 * Creates a wireframe for the main torus connecting nodes #0 and #5
 * @param nodes - The graph nodes (not used directly, but kept for API consistency)
 * @returns The main torus wireframe object
 */
export function createMainTorusWireframe(_nodes: Node[]): THREE.Object3D | null {
  try {
    // Create a group to hold the main torus
    const group = new THREE.Group();
    group.name = 'main-torus-wireframe';

    // Get the positions of the main subsystem nodes directly
    const position0 = calculate3DDiamondPosition('#0');
    const position1 = calculate3DDiamondPosition('#1');
    const position2 = calculate3DDiamondPosition('#2');
    const position3 = calculate3DDiamondPosition('#3');
    const position4 = calculate3DDiamondPosition('#4');
    const position5 = calculate3DDiamondPosition('#5');

    // Check if any positions are missing
    if (!position0 || !position1 || !position2 || !position3 || !position4 || !position5) {
      console.error('Missing positions for main torus wireframe');
      return null;
    }

    // Calculate the center of the torus (midpoint between #0 and #5)
    const center = new THREE.Vector3(
      (position0.x + position5.x) / 2,
      (position0.y + position5.y) / 2,
      (position0.z + position5.z) / 2
    );

    // Calculate the direction vector from #0 to #5 (this will be the axis of the torus)
    const axis = new THREE.Vector3(
      position5.x - position0.x,
      position5.y - position0.y,
      position5.z - position0.z
    ).normalize();

    // FIXED: Calculate the radius of the torus correctly
    // We need to find the distance from the 0-5 axis to nodes 1-4
    const middlePositions = [position1, position2, position3, position4];
    let torusRadius = 0;

    for (const pos of middlePositions) {
      // Convert position to Vector3
      const nodePos = new THREE.Vector3(pos.x, pos.y, pos.z);

      // Calculate the closest point on the 0-5 axis to this node
      // First, create a vector from position0 to the node
      const pos0ToNode = nodePos.clone().sub(new THREE.Vector3(position0.x, position0.y, position0.z));

      // Project this vector onto the axis to find the distance along the axis
      const distanceAlongAxis = pos0ToNode.dot(axis);

      // Calculate the closest point on the axis
      const closestPointOnAxis = new THREE.Vector3(position0.x, position0.y, position0.z)
        .add(axis.clone().multiplyScalar(distanceAlongAxis));

      // Calculate the distance from the node to this closest point on the axis
      const distance = nodePos.distanceTo(closestPointOnAxis);

      // Add this distance to our running total
      torusRadius += distance;
    }

    // Calculate the average radius
    torusRadius /= middlePositions.length;

    // Make tube radius thicker as requested
    const tubeRadius = torusRadius * 0.16; // Increased to 16% of torus radius

    // Make axis line materials more translucent and thinner
    const materials = {
      0: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, linewidth: 0.3 }), // Anuttara - White
      5: new THREE.LineBasicMaterial({ color: 0xdc1eff, transparent: true, opacity: 0.1, linewidth: 0.3 })  // Epii - Purple
    };

    // Increase segment count as requested
    const torusGeometry = new THREE.TorusGeometry(
      torusRadius,       // radius
      tubeRadius,        // tube radius (thicker)
      6,                 // radial segments (kept at 6)
      24                 // tubular segments (increased to 24)
    );

    // Make wireframe lines more translucent
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1       // Reduced to 0.1 for more translucency
    });
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.name = 'main-torus-mesh';

    // CRITICAL FIX: Correct the torus orientation
    // The issue was that we were aligning the torus's central hole with the 0-5 axis,
    // but we actually want the central hole to be perpendicular to the 0-5 axis.

    // First, create a quaternion that rotates from the y-axis to our axis
    // This makes the torus's central hole perpendicular to the 0-5 axis
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);

    // Apply the rotation to the torus
    torusMesh.quaternion.copy(quaternion);

    // Store the original quaternion for animation
    torusMesh.userData.originalQuaternion = quaternion.clone();

    // Position the torus at the center
    torusMesh.position.copy(center);

    // Add the torus to the group
    group.add(torusMesh);

    // Create a subtle axis line from #0 to #5
    const linePoints = [
      new THREE.Vector3(position0.x, position0.y, position0.z),
      new THREE.Vector3(position5.x, position5.y, position5.z)
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

    // Create a line with #0's color (reduced opacity)
    const line0 = new THREE.Line(lineGeometry, materials[0]);
    line0.name = 'main-torus-axis-0';
    group.add(line0);

    // Create a line with #5's color (slightly offset to make both visible)
    const line5 = new THREE.Line(lineGeometry, materials[5]);
    line5.name = 'main-torus-axis-5';
    line5.position.x += 0.1; // Small offset to make both lines visible
    group.add(line5);

    return group;
  } catch (error) {
    console.error('Error creating main torus wireframe:', error);
    return null;
  }
}

/**
 * Creates a torus wireframe for a subsystem based on its child nodes
 * @param parentNode - The parent node
 * @param nodes - All graph nodes
 * @returns The subsystem torus wireframe object
 */
export function createSubsystemTorusWireframe(parentNode: Node, nodes: Node[]): THREE.Object3D | null {
  try {
    // Skip if no parent node or no bimbaCoordinate
    if (!parentNode || !parentNode.bimbaCoordinate) {
      return null;
    }

    // Get the position of the parent node
    const parentPosition = calculate3DDiamondPosition(parentNode.bimbaCoordinate);
    if (!parentPosition) {
      return null;
    }

    // For a proper torus, we need to find the 6 child nodes (0-5) of this parent
    // First, determine the expected child coordinates
    const parentCoord = parentNode.bimbaCoordinate;
    const expectedChildCoords = [];

    // Create the expected child coordinates (0-5)
    for (let i = 0; i < 6; i++) {
      expectedChildCoords.push(`${parentCoord}-${i}`);
      expectedChildCoords.push(`${parentCoord}.${i}`); // Alternative separator
    }

    // Find the actual child nodes
    const childNodes: Node[] = [];
    const foundCoords = new Set<string>();

    // First pass: look for exact matches
    for (const node of nodes) {
      if (!node.bimbaCoordinate) continue;

      if (expectedChildCoords.includes(node.bimbaCoordinate)) {
        childNodes.push(node);
        foundCoords.add(node.bimbaCoordinate);
      }
    }

    // If we don't have enough child nodes, try to find any direct children
    if (childNodes.length < 3) {
      // Look for any direct children
      for (const node of nodes) {
        if (!node.bimbaCoordinate) continue;
        if (node.bimbaCoordinate === parentNode.bimbaCoordinate) continue;

        // Check if this is a direct child (starts with parent coordinate + separator)
        if (node.bimbaCoordinate.startsWith(parentCoord + '-') || node.bimbaCoordinate.startsWith(parentCoord + '.')) {
          // Only add if not already added
          if (!foundCoords.has(node.bimbaCoordinate)) {
            childNodes.push(node);
            foundCoords.add(node.bimbaCoordinate);
          }
        }
      }

      // If we still don't have enough, return null
      if (childNodes.length < 3) {
        return null;
      }
    }

    // Create a group to hold the subsystem torus
    const group = new THREE.Group();
    group.name = `subsystem-torus-${parentNode.id}`;

    // Sort child nodes by their subsystem number (0-5)
    childNodes.sort((a, b) => {
      const aMatch = a.bimbaCoordinate?.match(/[-.](\d+)$/);
      const bMatch = b.bimbaCoordinate?.match(/[-.](\d+)$/);
      const aNum = aMatch ? parseInt(aMatch[1], 10) : 999;
      const bNum = bMatch ? parseInt(bMatch[1], 10) : 999;
      return aNum - bNum;
    });

    // Identify nodes 0 and 5 by their subsystem number
    let node0Position: THREE.Vector3 | null = null;
    let node5Position: THREE.Vector3 | null = null;
    const middleNodes: { position: THREE.Vector3, index: number }[] = [];

    // Get positions for all child nodes and identify nodes 0, 5, and 1-4
    // Improved to be more flexible in detecting node numbers
    for (const childNode of childNodes) {
      if (!childNode.bimbaCoordinate) continue;

      const childPosition = calculate3DDiamondPosition(childNode.bimbaCoordinate);
      if (!childPosition) continue;

      // More flexible pattern matching to catch different formats
      // Look for the last number in the coordinate
      const match = childNode.bimbaCoordinate.match(/[-.](\d+)$/) ||
                   childNode.bimbaCoordinate.match(/#(\d+)$/);

      if (!match) continue;

      const subsystemNumber = parseInt(match[1], 10);
      const position = new THREE.Vector3(childPosition.x, childPosition.y, childPosition.z);

      if (subsystemNumber === 0) {
        node0Position = position;
      } else if (subsystemNumber === 5) {
        node5Position = position;
      } else if (subsystemNumber >= 1 && subsystemNumber <= 4) {
        middleNodes.push({
          position,
          index: subsystemNumber
        });
      }
    }

    // If we still don't have nodes 0 and 5, try to infer them from the parent and other nodes
    if (!node0Position || !node5Position) {
      // If we have the parent position and at least one middle node, we can estimate
      if (parentPosition && middleNodes.length > 0) {
        const parentPos = new THREE.Vector3(parentPosition.x, parentPosition.y, parentPosition.z);

        // If missing node 0, estimate it based on parent position
        if (!node0Position) {
          // Place node 0 below the parent (negative Y direction)
          node0Position = parentPos.clone();
          node0Position.y -= 50; // Arbitrary offset
        }

        // If missing node 5, estimate it based on parent position
        if (!node5Position) {
          // Place node 5 above the parent (positive Y direction)
          node5Position = parentPos.clone();
          node5Position.y += 50; // Arbitrary offset
        }
      }
    }

    // Sort middle nodes by index
    middleNodes.sort((a, b) => a.index - b.index);

    // Skip if we don't have nodes 0 and 5 and couldn't infer them
    if (!node0Position || !node5Position) {
      return null;
    }

    // If we have fewer than 2 middle nodes, we'll still create a torus
    // but it might not be as accurate in terms of radius

    // Calculate the center of the torus (midpoint between nodes 0 and 5)
    const center = new THREE.Vector3(
      (node0Position.x + node5Position.x) / 2,
      (node0Position.y + node5Position.y) / 2,
      (node0Position.z + node5Position.z) / 2
    );

    // Calculate the direction vector from node 0 to node 5 (this will be the axis of the torus)
    const axis = new THREE.Vector3(
      node5Position.x - node0Position.x,
      node5Position.y - node0Position.y,
      node5Position.z - node0Position.z
    ).normalize();

    // Calculate the radius of the torus correctly
    // We need to find the distance from the 0-5 axis to nodes 1-4
    let torusRadius = 0;

    if (middleNodes.length > 0) {
      // Calculate radius based on middle nodes
      for (const node of middleNodes) {
        // Calculate the closest point on the 0-5 axis to this node
        // First, create a vector from node0Position to the middle node
        const pos0ToNode = node.position.clone().sub(node0Position);

        // Project this vector onto the axis to find the distance along the axis
        const distanceAlongAxis = pos0ToNode.dot(axis);

        // Calculate the closest point on the axis
        const closestPointOnAxis = node0Position.clone()
          .add(axis.clone().multiplyScalar(distanceAlongAxis));

        // Calculate the distance from the node to this closest point on the axis
        const distance = node.position.distanceTo(closestPointOnAxis);

        // Add this distance to our running total
        torusRadius += distance;
      }

      // Calculate the average radius
      torusRadius /= middleNodes.length;
    } else {
      // If we have no middle nodes, estimate a reasonable radius
      // Use the distance between nodes 0 and 5 as a reference
      const axis0to5Length = node0Position.distanceTo(node5Position);
      torusRadius = axis0to5Length * 0.5; // Use 50% of the 0-5 distance as radius
    }

    // Make tube radius thicker as requested
    const tubeRadius = torusRadius * 0.16; // Increased to 16% of torus radius

    // Get parent node color for the wireframe
    let wireframeColor = 0xffffff; // Default white
    let wireframeOpacity = 0.1;    // Reduced opacity for more translucency

    // Extract subsystem number from bimbaCoordinate
    let subsystem: number | null = null;
    const matchResult = parentNode.bimbaCoordinate.match(/^#([0-5])/);
    if (matchResult && matchResult[1]) {
      subsystem = parseInt(matchResult[1], 10);
    }

    // Set color based on subsystem
    if (subsystem !== null) {
      switch (subsystem) {
        case 0: wireframeColor = 0xffffff; break; // Anuttara - White
        case 1: wireframeColor = 0x1e78ff; break; // Paramasiva - Blue
        case 2: wireframeColor = 0xff1e78; break; // Parashakti - Red
        case 3: wireframeColor = 0xffdc1e; break; // Mahamaya - Yellow
        case 4: wireframeColor = 0x1edc78; break; // Nara - Green
        case 5: wireframeColor = 0xdc1eff; break; // Epii - Purple
      }

      // Adjust opacity based on depth using an exponential decay function
      const depth = parentNode.bimbaCoordinate.split(/[-.]/).length;
      const baseOpacity = 0.15; // Reduced for more translucency
      const opacityDecayFactor = 0.7; // Increased decay for faster falloff
      wireframeOpacity = Math.max(0.05, baseOpacity * Math.pow(opacityDecayFactor, depth - 1)); // Reduced min opacity to 0.05
    }

    // Increase segment count as requested
    const torusGeometry = new THREE.TorusGeometry(
      torusRadius,       // radius
      tubeRadius,        // tube radius (thicker)
      6,                 // radial segments (kept at 6)
      24                 // tubular segments (increased to 24)
    );

    // Create a mesh for the torus
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: wireframeOpacity
    });
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.name = 'subsystem-torus-mesh';

    // CRITICAL FIX: Correct the torus orientation
    // The issue was that we were aligning the torus's central hole with the 0-5 axis,
    // but we actually want the central hole to be perpendicular to the 0-5 axis.
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis); // Use y-axis instead of z-axis
    torusMesh.quaternion.copy(quaternion);

    // Store the original quaternion for animation
    torusMesh.userData.originalQuaternion = quaternion.clone();

    // Position the torus at the center
    torusMesh.position.copy(center);

    // Add the torus to the group
    group.add(torusMesh);

    // Create a line material for the axis line with very low opacity
    const lineMaterial = new THREE.LineBasicMaterial({
      color: wireframeColor,
      transparent: true,
      opacity: Math.min(0.1, wireframeOpacity), // Reduced to make lines extremely translucent
      linewidth: 0.3 // Further reduced linewidth for even thinner lines
    });

    // Create a subtle line from node 0 to node 5 to highlight the axis
    const linePoints = [
      node0Position,
      node5Position
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const axisLine = new THREE.Line(lineGeometry, lineMaterial);
    axisLine.name = 'subsystem-torus-axis';
    group.add(axisLine);

    return group;
  } catch (error) {
    console.error(`Error creating subsystem torus wireframe for ${parentNode?.bimbaCoordinate || 'unknown'}:`, error);
    return null;
  }
}

/**
 * Updates all torus wireframes in the scene
 * @param nodes - The graph nodes
 * @param scene - The THREE.js scene
 */
export function updateTorusWireframes(nodes: Node[], scene: THREE.Scene): void {
  if (!scene || !nodes || nodes.length === 0) {
    return;
  }

  try {
    // Find or create the main group for torus wireframes
    let torusGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
    if (!torusGroup) {
      torusGroup = new THREE.Group();
      torusGroup.name = 'torus-wireframes';
      scene.add(torusGroup);
    }

    // Clear existing torus wireframes
    while (torusGroup.children.length > 0) {
      torusGroup.remove(torusGroup.children[0]);
    }

    // Create a map for quick node lookups
    const nodeMap = new Map<string, Node>();
    const mappedNodes = [];

    // Populate the map and collect mapped nodes
    for (const node of nodes) {
      nodeMap.set(node.id, node);
      if (node.bimbaCoordinate) {
        mappedNodes.push(node);
      }
    }

    // Create and add the main torus wireframe
    // Only create if we have all the main subsystem nodes
    const mainSubsystemNodes = [
      mappedNodes.find(node => node.bimbaCoordinate === '#0'),
      mappedNodes.find(node => node.bimbaCoordinate === '#1'),
      mappedNodes.find(node => node.bimbaCoordinate === '#2'),
      mappedNodes.find(node => node.bimbaCoordinate === '#3'),
      mappedNodes.find(node => node.bimbaCoordinate === '#4'),
      mappedNodes.find(node => node.bimbaCoordinate === '#5')
    ];

    if (mainSubsystemNodes.every(node => node)) {
      const mainTorus = createMainTorusWireframe(nodes);
      if (mainTorus) {
        torusGroup.add(mainTorus);
      }
    }

    // Limit the number of subsystem torus wireframes to avoid performance issues
    // Increased to match diamond wireframes count
    const maxSubsystemTorus = 25; // Increased from 15 to 25 to match diamond wireframes
    let subsystemTorusCount = 0;

    // Count direct children for each mapped node
    const childCounts = new Map<string, number>();
    for (const parentNode of mappedNodes) {
      if (parentNode.bimbaCoordinate === '#') continue; // Skip root node

      const parentCoord = parentNode.bimbaCoordinate;
      let childCount = 0;

      // Count direct children
      for (const node of nodes) {
        if (!node.bimbaCoordinate) continue;
        if (node.bimbaCoordinate === parentCoord) continue;

        if (node.bimbaCoordinate.startsWith(parentCoord + '-') || node.bimbaCoordinate.startsWith(parentCoord + '.')) {
          childCount++;
        }
      }

      childCounts.set(parentNode.id, childCount);
    }

    // Sort mapped nodes by child count (descending) to prioritize nodes with more children
    const sortedParentNodes = [...mappedNodes]
      .filter(node => node.bimbaCoordinate !== '#') // Skip root node
      .sort((a, b) => {
        const aCount = childCounts.get(a.id) || 0;
        const bCount = childCounts.get(b.id) || 0;
        return bCount - aCount; // Descending order
      });

    // First, prioritize main subsystem nodes (#0-#5)
    const mainSubsystemParentNodes = sortedParentNodes.filter(node =>
      node.bimbaCoordinate && /^#[0-5]$/.test(node.bimbaCoordinate)
    );

    // Then, process other nodes
    const otherParentNodes = sortedParentNodes.filter(node =>
      node.bimbaCoordinate && !/^#[0-5]$/.test(node.bimbaCoordinate)
    );

    // Process main subsystem nodes first
    for (const parentNode of mainSubsystemParentNodes) {
      // Limit the number of subsystem torus wireframes
      if (subsystemTorusCount >= maxSubsystemTorus) break;

      const subsystemTorus = createSubsystemTorusWireframe(parentNode, nodes);
      if (subsystemTorus) {
        torusGroup.add(subsystemTorus);
        subsystemTorusCount++;
      }
    }

    // Then process other nodes
    for (const parentNode of otherParentNodes) {
      // Limit the number of subsystem torus wireframes
      if (subsystemTorusCount >= maxSubsystemTorus) break;

      // Skip nodes with fewer than 3 children (matching diamond wireframe logic)
      const childCount = childCounts.get(parentNode.id) || 0;
      if (childCount < 3) continue;

      // Skip if this node doesn't have a bimbaCoordinate
      if (!parentNode.bimbaCoordinate) continue;

      // TARGETED FIX: Only filter out the specific problematic pattern (#4.4.3-X)
      // This avoids breaking other subsystems like #2-1-X-Y
      const coord = parentNode.bimbaCoordinate;

      // Normalize the coordinate for comparison (handle both dot and hyphen formats)
      const normalizedCoord = coord.replace(/\./g, '-');

      // Check if this is the specific problematic pattern (#4.4.3 or #4-4-3)
      // We only want to skip this exact pattern to avoid duplicates
      if (normalizedCoord === '#4-4-3' || /^#4-4-3-\d+$/.test(normalizedCoord)) {
        // Skip this specific pattern to avoid duplicates
        continue;
      }

      const subsystemTorus = createSubsystemTorusWireframe(parentNode, nodes);
      if (subsystemTorus) {
        torusGroup.add(subsystemTorus);
        subsystemTorusCount++;
      }
    }
  } catch (error) {
    console.error('Error updating torus wireframes:', error);
  }
}
