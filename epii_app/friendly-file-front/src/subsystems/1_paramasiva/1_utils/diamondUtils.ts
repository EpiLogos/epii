/**
 * Diamond Wireframe Utilities
 *
 * This file contains functions for creating and updating diamond wireframes
 * in the 3D visualization.
 */

import * as THREE from 'three';
import { Node } from "../../../shared/components/meta/metaData";
import { calculate3DDiamondPosition } from './calculate3DDiamondPosition';

/**
 * Creates a wireframe for the main diamond connecting nodes #0-#5
 * @param nodes - The graph nodes (not used directly, but kept for API consistency)
 * @returns The main diamond wireframe object
 */
export function createMainDiamondWireframe(_nodes: Node[]): THREE.Object3D | null {
  try {
    // Disabled logging for performance

    // Create a group to hold the main diamond
    const group = new THREE.Group();
    group.name = 'main-diamond-wireframe';

    // Get the positions of the main subsystem nodes directly
    // This avoids the need to search through the nodes array
    const position0 = calculate3DDiamondPosition('#0');
    const position1 = calculate3DDiamondPosition('#1');
    const position2 = calculate3DDiamondPosition('#2');
    const position3 = calculate3DDiamondPosition('#3');
    const position4 = calculate3DDiamondPosition('#4');
    const position5 = calculate3DDiamondPosition('#5');

    // Check if any positions are missing
    if (!position0) console.error('Failed to calculate position for #0');
    if (!position1) console.error('Failed to calculate position for #1');
    if (!position2) console.error('Failed to calculate position for #2');
    if (!position3) console.error('Failed to calculate position for #3');
    if (!position4) console.error('Failed to calculate position for #4');
    if (!position5) console.error('Failed to calculate position for #5');

    if (!position0 || !position1 || !position2 || !position3 || !position4 || !position5) {
      console.error('Missing positions for main diamond wireframe');
      return null;
    }

    // Note: We don't need to find the actual node objects for coloring
    // We're using fixed colors for the main diamond wireframe
    // The positions are calculated directly from the bimbaCoordinates

    // Create colored line materials for each subsystem
    // Increased opacity to 0.8 for more visible wireframes
    const materials = {
      0: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, linewidth: 2.0 }), // Anuttara - White
      1: new THREE.LineBasicMaterial({ color: 0x1e78ff, transparent: true, opacity: 0.8, linewidth: 2.0 }), // Paramasiva - Blue
      2: new THREE.LineBasicMaterial({ color: 0xff1e78, transparent: true, opacity: 0.8, linewidth: 2.0 }), // Parashakti - Red
      3: new THREE.LineBasicMaterial({ color: 0xffdc1e, transparent: true, opacity: 0.8, linewidth: 2.0 }), // Mahamaya - Yellow
      4: new THREE.LineBasicMaterial({ color: 0x1edc78, transparent: true, opacity: 0.8, linewidth: 2.0 }), // Nara - Green
      5: new THREE.LineBasicMaterial({ color: 0xdc1eff, transparent: true, opacity: 0.6, linewidth: 1.5 })  // Epii - Purple
    };

    // Create separate geometries for each connection to use different colors

    // CRITICAL FIX: Connect #0 to #1, #2, #3, #4 (these form the base of the octahedron)
    const edges0 = [
      // Connect to #1-#4 (square on the xy plane)
      new THREE.Vector3(position0.x, position0.y, position0.z),
      new THREE.Vector3(position1.x, position1.y, position1.z),
      new THREE.Vector3(position0.x, position0.y, position0.z),
      new THREE.Vector3(position2.x, position2.y, position2.z),
      new THREE.Vector3(position0.x, position0.y, position0.z),
      new THREE.Vector3(position3.x, position3.y, position3.z),
      new THREE.Vector3(position0.x, position0.y, position0.z),
      new THREE.Vector3(position4.x, position4.y, position4.z),
    ];
    const geometry0 = new THREE.BufferGeometry().setFromPoints(edges0);
    const lines0 = new THREE.LineSegments(geometry0, materials[0]);
    lines0.name = 'main-diamond-edges-0';
    group.add(lines0);

    // CRITICAL FIX: Connect #5 to #1, #2, #3, #4 (these form the top of the octahedron)
    const edges5 = [
      // Connect to #1-#4 (square on the xy plane)
      new THREE.Vector3(position5.x, position5.y, position5.z),
      new THREE.Vector3(position1.x, position1.y, position1.z),
      new THREE.Vector3(position5.x, position5.y, position5.z),
      new THREE.Vector3(position2.x, position2.y, position2.z),
      new THREE.Vector3(position5.x, position5.y, position5.z),
      new THREE.Vector3(position3.x, position3.y, position3.z),
      new THREE.Vector3(position5.x, position5.y, position5.z),
      new THREE.Vector3(position4.x, position4.y, position4.z),
    ];
    const geometry5 = new THREE.BufferGeometry().setFromPoints(edges5);
    const lines5 = new THREE.LineSegments(geometry5, materials[5]);
    lines5.name = 'main-diamond-edges-5';
    group.add(lines5);

    // Connect #1-#2 with #1's color
    const edges1 = [
      new THREE.Vector3(position1.x, position1.y, position1.z),
      new THREE.Vector3(position2.x, position2.y, position2.z),
    ];
    const geometry1 = new THREE.BufferGeometry().setFromPoints(edges1);
    const lines1 = new THREE.LineSegments(geometry1, materials[1]);
    lines1.name = 'main-diamond-edges-1';
    group.add(lines1);

    // Connect #2-#3 with #2's color
    const edges2 = [
      new THREE.Vector3(position2.x, position2.y, position2.z),
      new THREE.Vector3(position3.x, position3.y, position3.z),
    ];
    const geometry2 = new THREE.BufferGeometry().setFromPoints(edges2);
    const lines2 = new THREE.LineSegments(geometry2, materials[2]);
    lines2.name = 'main-diamond-edges-2';
    group.add(lines2);

    // Connect #3-#4 with #3's color
    const edges3 = [
      new THREE.Vector3(position3.x, position3.y, position3.z),
      new THREE.Vector3(position4.x, position4.y, position4.z),
    ];
    const geometry3 = new THREE.BufferGeometry().setFromPoints(edges3);
    const lines3 = new THREE.LineSegments(geometry3, materials[3]);
    lines3.name = 'main-diamond-edges-3';
    group.add(lines3);

    // Connect #4-#1 with #4's color
    const edges4 = [
      new THREE.Vector3(position4.x, position4.y, position4.z),
      new THREE.Vector3(position1.x, position1.y, position1.z),
    ];
    const geometry4 = new THREE.BufferGeometry().setFromPoints(edges4);
    const lines4 = new THREE.LineSegments(geometry4, materials[4]);
    lines4.name = 'main-diamond-edges-4';
    group.add(lines4);

    // REMOVED: Diagonal connections for the square on the xy plane
    // We only want the 8 outer lines for each diamond

    // Successfully created main diamond wireframe
    return group;
  } catch (error) {
    console.error('Error creating main diamond wireframe:', error);
    return null;
  }
}

/**
 * Creates a wireframe for a subsystem based on its child nodes
 * @param parentNode - The parent node
 * @param nodes - All graph nodes
 * @returns The subsystem diamond wireframe object
 */
export function createSubsystemDiamondWireframe(parentNode: Node, nodes: Node[]): THREE.Object3D | null {
  try {
    // Skip if no parent node or no bimbaCoordinate
    if (!parentNode) {
      console.error('Parent node is null or undefined');
      return null;
    }

    if (!parentNode.bimbaCoordinate) {
      console.error('Parent node has no bimbaCoordinate');
      return null;
    }

    // Creating subsystem diamond

    // Get the position of the parent node
    const parentPosition = calculate3DDiamondPosition(parentNode.bimbaCoordinate);
    if (!parentPosition) {
      console.error(`Failed to calculate position for parent node ${parentNode.bimbaCoordinate}`);
      return null;
    }

    // For a proper diamond, we need to find the 6 child nodes (0-5) of this parent
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

    // Found child nodes

    // If we don't have enough child nodes, try to find any direct children
    if (childNodes.length < 3) {
      // Not enough specific child nodes, looking for any direct children

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

      // After looking for any direct children

      // If we still don't have enough, return null
      if (childNodes.length < 3) {
        // Still not enough child nodes
        return null;
      }
    }

    // Create a group to hold the subsystem diamond
    const group = new THREE.Group();
    group.name = `subsystem-diamond-${parentNode.id}`;

    // Sort child nodes by their subsystem number (0-5)
    childNodes.sort((a, b) => {
      const aMatch = a.bimbaCoordinate?.match(/[-.](\d+)$/);
      const bMatch = b.bimbaCoordinate?.match(/[-.](\d+)$/);
      const aNum = aMatch ? parseInt(aMatch[1], 10) : 999;
      const bNum = bMatch ? parseInt(bMatch[1], 10) : 999;
      return aNum - bNum;
    });

    // Get positions for all child nodes
    const childPositions: THREE.Vector3[] = [];
    for (const childNode of childNodes) {
      if (!childNode.bimbaCoordinate) {
        console.warn(`Child node has no bimbaCoordinate`);
        continue;
      }

      const childPosition = calculate3DDiamondPosition(childNode.bimbaCoordinate);
      if (!childPosition) {
        console.warn(`Failed to calculate position for child node ${childNode.bimbaCoordinate}`);
        continue;
      }

      childPositions.push(new THREE.Vector3(childPosition.x, childPosition.y, childPosition.z));
    }

    // Skip if there are not enough child positions
    if (childPositions.length < 3) {
      console.warn(`Not enough valid child positions for ${parentNode.bimbaCoordinate} (only ${childPositions.length})`);
      return null;
    }

    // Create vertices for the edges
    const edgeVertices: THREE.Vector3[] = [];

    // For a proper diamond, we need to create a complete wireframe
    // This means connecting all vertices to each other

    // CRITICAL FIX: Don't connect parent to children
    // The diamond wireframe should only connect nodes 0 and 5 to nodes 1-4

    // CRITICAL FIX: Identify nodes 0, 5, and 1-4 by their subsystem number
    let node0Position = null;
    let node5Position = null;
    const middleNodes = [];

    // Sort child nodes by their subsystem number
    childNodes.sort((a, b) => {
      const aMatch = a.bimbaCoordinate?.match(/[-.]([0-5])$/);
      const bMatch = b.bimbaCoordinate?.match(/[-.]([0-5])$/);
      const aNum = aMatch ? parseInt(aMatch[1], 10) : 999;
      const bNum = bMatch ? parseInt(bMatch[1], 10) : 999;
      return aNum - bNum;
    });

    // Identify nodes by their subsystem number
    for (let i = 0; i < childPositions.length; i++) {
      const childNode = childNodes[i];
      if (!childNode.bimbaCoordinate) continue;

      const match = childNode.bimbaCoordinate.match(/[-.]([0-5])$/);
      if (!match) continue;

      const subsystemNumber = parseInt(match[1], 10);

      if (subsystemNumber === 0) {
        node0Position = childPositions[i];
      } else if (subsystemNumber === 5) {
        node5Position = childPositions[i];
      } else if (subsystemNumber >= 1 && subsystemNumber <= 4) {
        middleNodes.push({
          position: childPositions[i],
          index: subsystemNumber
        });
      }
    }

    // Sort middle nodes by index
    middleNodes.sort((a, b) => a.index - b.index);

    // Connect node 0 to nodes 1-4
    if (node0Position) {
      for (const node of middleNodes) {
        edgeVertices.push(node0Position.clone(), node.position.clone());
      }
    }

    // Connect node 5 to nodes 1-4
    if (node5Position) {
      for (const node of middleNodes) {
        edgeVertices.push(node5Position.clone(), node.position.clone());
      }
    }

    // Connect nodes 1-4 in a ring
    for (let i = 0; i < middleNodes.length; i++) {
      const nextIndex = (i + 1) % middleNodes.length;
      edgeVertices.push(
        middleNodes[i].position.clone(),
        middleNodes[nextIndex].position.clone()
      );
    }

    // REMOVED: Connections between non-adjacent vertices
    // We only want the 8 outer lines for each diamond (parent to children + outer ring)

    // Skip if there are no edges
    if (edgeVertices.length === 0) {
      console.warn(`No edges created for ${parentNode.bimbaCoordinate}`);
      return null;
    }

    // Create edge geometry
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(edgeVertices);

    // Get parent node color for the wireframe
    let wireframeColor = 0xffffff; // Default white
    let wireframeOpacity = 0.5;    // Default opacity

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
      // This ensures that deeper wireframes are still visible but don't overwhelm the visualization
      const depth = parentNode.bimbaCoordinate.split(/[-.]/).length;
      const baseOpacity = 0.8;
      const opacityDecayFactor = 0.9;
      wireframeOpacity = Math.max(0.3, baseOpacity * Math.pow(opacityDecayFactor, depth - 1));
    }

    // Create a line material with the parent node's color
    // Increased opacity and linewidth for more visible wireframes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: wireframeColor,
      transparent: true,
      opacity: Math.min(0.8, wireframeOpacity), // Increased opacity for better visibility
      linewidth: 2.0 // Increased linewidth for better visibility
    });

    // Create the line segments
    const lines = new THREE.LineSegments(edgeGeometry, lineMaterial);
    lines.name = 'subsystem-diamond-edges';
    group.add(lines);

    // Successfully created diamond wireframe
    return group;
  } catch (error) {
    console.error(`Error creating subsystem diamond wireframe for ${parentNode?.bimbaCoordinate || 'unknown'}:`, error);
    return null;
  }
}

/**
 * Updates all diamond wireframes in the scene
 * @param nodes - The graph nodes
 * @param scene - The THREE.js scene
 */
export function updateDiamondWireframes(nodes: Node[], scene: THREE.Scene): void {
  // updateDiamondWireframes called

  if (!scene) {
    console.error('Scene is null or undefined');
    return;
  }

  if (!nodes || nodes.length === 0) {
    console.error('Nodes array is empty or undefined');
    return;
  }

  try {
    // Find or create the main group for wireframes
    let wireframeGroup = scene.getObjectByName('diamond-wireframes') as THREE.Group;
    if (!wireframeGroup) {
      // Creating new wireframe group
      wireframeGroup = new THREE.Group();
      wireframeGroup.name = 'diamond-wireframes';
      scene.add(wireframeGroup);
    } else {
      // Found existing wireframe group
    }

    // Clear existing wireframes
    while (wireframeGroup.children.length > 0) {
      wireframeGroup.remove(wireframeGroup.children[0]);
    }
    // Cleared existing wireframes

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
    // Found mapped nodes

    // Create and add the main diamond wireframe
    // Only create if we have all the main subsystem nodes
    const mainSubsystemNodes = [
      mappedNodes.find(node => node.bimbaCoordinate === '#0'),
      mappedNodes.find(node => node.bimbaCoordinate === '#1'),
      mappedNodes.find(node => node.bimbaCoordinate === '#2'),
      mappedNodes.find(node => node.bimbaCoordinate === '#3'),
      mappedNodes.find(node => node.bimbaCoordinate === '#4'),
      mappedNodes.find(node => node.bimbaCoordinate === '#5')
    ];

    // Main subsystem nodes

    if (mainSubsystemNodes.every(node => node)) {
      // Creating main diamond wireframe
      const mainWireframe = createMainDiamondWireframe(nodes);
      if (mainWireframe) {
        wireframeGroup.add(mainWireframe);
        // Added main diamond wireframe
      } else {
        console.error('Failed to create main diamond wireframe');
      }
    } else {
      // Not all main subsystem nodes are present
    }

    // Limit the number of subsystem wireframes to avoid performance issues
    const maxSubsystemWireframes = 50; // Increased from 25 to 50 for more wireframes
    let subsystemWireframeCount = 0;

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
      // Limit the number of subsystem wireframes
      if (subsystemWireframeCount >= maxSubsystemWireframes) break;

      // Creating subsystem diamond wireframe for main subsystem
      const subsystemWireframe = createSubsystemDiamondWireframe(parentNode, nodes);
      if (subsystemWireframe) {
        wireframeGroup.add(subsystemWireframe);
        subsystemWireframeCount++;
      }
    }

    // Then process other nodes
    for (const parentNode of otherParentNodes) {
      // Limit the number of subsystem wireframes
      if (subsystemWireframeCount >= maxSubsystemWireframes) break;

      // Skip nodes with fewer than 3 children
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

      // Creating subsystem diamond wireframe
      const subsystemWireframe = createSubsystemDiamondWireframe(parentNode, nodes);
      if (subsystemWireframe) {
        wireframeGroup.add(subsystemWireframe);
        subsystemWireframeCount++;
      }
    }

    // Diamond wireframes update complete
  } catch (error) {
    // Error updating diamond wireframes
  }
}
