/**
 * Torus Animation Utilities
 *
 * This file contains functions for animating torus wireframes
 * in the 3D visualization, creating a smooth hexagonal rotational animation
 * that follows the system node arrangement without jumps or warps.
 */

import * as THREE from 'three';

// Animation state for torus rotations
interface TorusRotationState {
  startTime: number;    // Animation start timestamp
  speed: number;        // Rotation speed multiplier
  active: boolean;      // Whether the animation is active
}

// Global animation state
const rotationState: TorusRotationState = {
  startTime: 0,
  speed: 1.0,
  active: false
};

// Animation parameters
// Slowed down by 5x from the previous speed
const CYCLE_DURATION = 5000; // 5 seconds for a full hexagonal cycle

// Reusable objects to avoid garbage collection
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const yRotationQuat = new THREE.Quaternion();
const tubeRotationQuat = new THREE.Quaternion();
const combinedRotationQuat = new THREE.Quaternion();

// Cache for found torus meshes to avoid scene traversal
const torusMeshCache = new Map<string, THREE.Mesh[]>();

/**
 * Start the torus rotation animation
 * @param startTime - Optional start time (from performance.now())
 */
export function startTorusRotation(startTime?: number): void {
  rotationState.active = true;
  rotationState.startTime = startTime !== undefined ? startTime : Date.now();
}

/**
 * Stop the torus rotation animation
 */
export function stopTorusRotation(): void {
  rotationState.active = false;

  // Clear the rotation cache to free memory
  rotationCache.clear();
}

/**
 * Set the speed of the torus rotation animation
 * @param speed - Speed multiplier (1.0 is normal speed)
 */
export function setTorusRotationSpeed(speed: number): void {
  rotationState.speed = Math.max(0.1, Math.min(3.0, speed));
}

// Cache for torus rotation quaternions
const rotationCache = new Map<string, THREE.Quaternion>();

/**
 * Apply rotation to a torus mesh based on the current animation state
 * @param torusMesh - The torus mesh to rotate
 * @param isMainTorus - Whether this is the main torus (affects rotation amplitude)
 * @param time - The current time from the animation manager (performance.now())
 */
export function applyTorusRotation(torusMesh: THREE.Mesh, isMainTorus: boolean = false, time?: number): void {
  if (!rotationState.active || !torusMesh) return;

  // Get the torus ID
  const torusId = torusMesh.uuid;

  // Check if we have a cached rotation for this torus
  if (!rotationCache.has(torusId)) {
    // If not, create and cache the original quaternion
    const originalQuaternion = torusMesh.userData.originalQuaternion as THREE.Quaternion;
    if (!originalQuaternion) {
      // If original quaternion is not stored, save the current one
      torusMesh.userData.originalQuaternion = torusMesh.quaternion.clone();
      return; // Skip this frame to avoid jumps
    }
    rotationCache.set(torusId, originalQuaternion.clone());
  }

  // Get the original orientation quaternion from cache
  const originalQuaternion = rotationCache.get(torusId)!;

  // Calculate elapsed time and apply base speed multiplier
  // Use the provided time from the animation manager if available, otherwise fall back to Date.now()
  const now = time !== undefined ? time : Date.now();
  const baseElapsedTime = (now - rotationState.startTime) * rotationState.speed;

  // Use a longer cycle duration (30 seconds instead of 10)
  // This makes the entire animation much slower and more deliberate
  const cycleDuration = 30000;
  const normalizedTime = (baseElapsedTime % cycleDuration) / cycleDuration;

  // Add a phase offset to shift the pauses slightly
  // This makes the rotations go a bit ahead before pausing
  const phaseOffset = 0.05;

  // Create a non-linear time progression with longer pauses at 90-degree marks
  // The formula t + sin(4π(t+offset))/3 creates longer plateaus at 0.05, 0.3, 0.55, 0.8
  // This allows the rotation to go further before pausing
  const nonLinearTime = normalizedTime + Math.sin(4 * Math.PI * (normalizedTime + phaseOffset)) / 3;

  // Map the non-linear time to a symmetrical rotation angle using a cosine function
  // This creates a smooth, continuous animation that:
  // 1. Starts at 0 degrees (original position)
  // 2. Smoothly increases to 360 degrees at the halfway point
  // 3. Smoothly decreases back to 0 degrees at the end
  // 4. Has continuous derivatives at all points for perfect smoothness
  // 5. Properly loops back to the beginning
  //
  // The formula (1 - cos(x))/2 maps cosine from [-1,1] to [0,1]
  // We then scale to [0,2π] for a full 360-degree rotation
  const yAngle = (1 - Math.cos(nonLinearTime * Math.PI * 2)) / 2 * Math.PI * 2;

  // Create a tube rotation activation function that aligns with the shifted pauses
  // This function peaks sharply at the same shifted positions (0.05, 0.3, 0.55, 0.8)
  // Using power 8 instead of 16 makes the activation window wider
  const tubeActivation = Math.pow(Math.abs(Math.cos(4 * Math.PI * (normalizedTime + phaseOffset))), 8);

  // Calculate tube rotation angle
  // This will be non-zero only during pauses
  // The multiplication by 2π creates a full 360° rotation of the tube
  const tubeAngle = tubeActivation * Math.PI * 2;

  // Apply scaling factor based on whether this is the main torus
  const scaleFactor = isMainTorus ? 1.0 : 0.6;

  // Reuse quaternion objects instead of creating new ones
  // Primary Y-axis rotation (keeps anchors at 0 and 5)
  yRotationQuat.setFromAxisAngle(Y_AXIS, yAngle);

  // Tube rotation (around X-axis only)
  // Using pure X-axis rotation instead of a diagonal axis
  // This creates cleaner, more predictable tube rotation
  tubeRotationQuat.setFromAxisAngle(X_AXIS, tubeAngle * scaleFactor);

  // Combine rotations
  combinedRotationQuat.copy(yRotationQuat);        // Start with Y-axis rotation
  combinedRotationQuat.multiply(tubeRotationQuat); // Then apply tube rotation

  // Apply to the original orientation
  torusMesh.quaternion.copy(originalQuaternion);
  torusMesh.quaternion.multiply(combinedRotationQuat);
}

/**
 * Update all torus rotations in the scene
 * @param scene - The THREE.js scene
 * @param time - The current time from the animation manager (performance.now())
 */
export function updateTorusRotations(scene: THREE.Scene, time?: number): void {
  if (!scene || !rotationState.active) return;

  // Use cached torus meshes if available, otherwise find and cache them
  const sceneId = scene.uuid;
  if (!torusMeshCache.has(sceneId)) {
    // Find the torus wireframes group
    const torusGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
    if (!torusGroup) return;

    // Find and cache all torus meshes
    const meshes: THREE.Mesh[] = [];
    torusGroup.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh && object.name.includes('torus-mesh')) {
        meshes.push(object);
      }
    });

    // Store in cache
    torusMeshCache.set(sceneId, meshes);
  }

  // Get cached meshes
  const meshes = torusMeshCache.get(sceneId)!;

  // Update each torus wireframe
  for (const mesh of meshes) {
    // Check if this is the main torus
    const isMainTorus = mesh.name === 'main-torus-mesh';

    // Apply rotation with the current time
    applyTorusRotation(mesh, isMainTorus, time);
  }
}
