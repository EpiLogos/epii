/**
 * Torus Pulse Utilities
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-1 (Harmonic Layer - Utils)
 *
 * This file contains utility functions for creating pulsation effects for tori.
 * It embodies the Parashakti principle (vibrational templates).
 */

import * as THREE from 'three';

// Pulse state for torus animation
const pulseState = {
  active: false,
  startTime: 0,
  minOpacity: 0.03, // Reduced base opacity - tori will be very subtle most of the time
  maxOpacity: 0.3, // Reduced from 0.45 to 0.3 (60% of original 0.5 max) for more subtle flashes
  pulseDuration: 40000, // 40 seconds per pulse cycle - longer time between flickers
  currentPulseFactor: 0.03, // Start at minimum opacity
  lastFlickerTime: 0, // Track last flicker time for natural spacing
  flickerClusterActive: false, // Track if we're in a cluster of flickers
  clusterStartTime: 0, // When the current cluster started
  clusterDuration: 0, // How long the current cluster should last
  subClusterActive: false, // Track if we're in a sub-cluster of bright flashes
  subClusterStartTime: 0, // When the current sub-cluster started
  subClusterDuration: 0, // How long the current sub-cluster should last
  subClusterFlashCount: 0, // How many flashes have occurred in the current sub-cluster
  lastSubClusterTime: 0 // When the last sub-cluster ended
};

// Cache for material opacity values
const materialOpacityCache = new Map<string, number>();

// Cache for torus meshes to avoid scene traversal
const torusMeshCache = new Map<string, Array<{
  object: THREE.Object3D;
  isMesh: boolean;
  isLine: boolean;
  material: THREE.Material;
}>>();

/**
 * Start the torus pulse animation
 * @param startTime - Optional start time (from performance.now())
 */
export function startTorusPulse(startTime?: number): void {
  const now = startTime !== undefined ? startTime : Date.now();
  pulseState.active = true;
  pulseState.startTime = now;
  pulseState.lastFlickerTime = now - 5000; // Start with a delay before first flicker
  pulseState.flickerClusterActive = false;
  pulseState.clusterStartTime = 0;
  pulseState.clusterDuration = 0;

  // Initialize sub-cluster state
  pulseState.subClusterActive = false;
  pulseState.subClusterStartTime = 0;
  pulseState.subClusterDuration = 0;
  pulseState.subClusterFlashCount = 0;
  pulseState.lastSubClusterTime = now - 5000; // Start with a delay before first sub-cluster
}

/**
 * Stop the torus pulse animation
 */
export function stopTorusPulse(): void {
  pulseState.active = false;

  // Clear the caches to free memory
  materialOpacityCache.clear();
  torusMeshCache.clear();
}

/**
 * Update the torus pulse animation for all tori in the scene
 * @param scene - The THREE.Scene containing the tori
 * @param time - The current time from the animation manager (performance.now())
 */
export function updateTorusPulses(scene: THREE.Scene, time?: number): void {
  if (!pulseState.active) return;

  // Use cached torus objects if available, otherwise find and cache them
  const sceneId = scene.uuid;
  if (!torusMeshCache.has(sceneId)) {
    // Find the torus wireframes group
    const torusGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
    if (!torusGroup) return;

    // Find and cache all torus objects
    const objects: Array<{
      object: THREE.Object3D;
      isMesh: boolean;
      isLine: boolean;
      material: THREE.Material;
    }> = [];

    // Helper function to process objects
    const processObject = (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshBasicMaterial) {
        objects.push({
          object: obj,
          isMesh: true,
          isLine: false,
          material: obj.material
        });
      } else if (obj instanceof THREE.Line && obj.material instanceof THREE.LineBasicMaterial) {
        objects.push({
          object: obj,
          isMesh: false,
          isLine: true,
          material: obj.material
        });
      }
    };

    // Process the main group
    torusGroup.traverse((child: THREE.Object3D) => {
      processObject(child);

      // If this is a group, process its children too
      if (child instanceof THREE.Group) {
        child.traverse((grandchild: THREE.Object3D) => {
          processObject(grandchild);
        });
      }
    });

    // Store in cache
    torusMeshCache.set(sceneId, objects);
  }

  // Calculate the current pulse factor with the current time
  const pulseFactor = calculatePulseFactor(time);

  // Get cached objects
  const objects = torusMeshCache.get(sceneId)!;

  // Update each object
  for (const obj of objects) {
    if (obj.isMesh) {
      // Update the torus opacity based on the pulse factor
      updateTorusOpacity(obj.material, pulseFactor, obj.object.uuid);
    } else if (obj.isLine) {
      // Update the line opacity based on the pulse factor
      // Use lower opacity for lines to make them more subtle
      updateTorusOpacity(obj.material, pulseFactor * 0.7, obj.object.uuid); // 70% of the mesh opacity for lines
    }
  }
}

// Cache for random values to reduce random number generation
const randomCache = {
  lastUpdateTime: 0,
  updateInterval: 100, // Update random values every 100ms
  flickerProbability: 0,
  clusterChance: 0,
  flickerStrength: 0,
  clusterDuration: 0,
  requiredSpacing: 0,
  requiredQuietPeriod: 0,
  subClusterChance: 0,
  subClusterDuration: 0,
  subClusterSpacing: 0,
  subClusterFlashCount: 0
};

/**
 * Calculate the current pulse factor based on time
 * @param time - The current time from the animation manager (performance.now())
 * @returns The current pulse factor (0-1)
 */
export function calculatePulseFactor(time?: number): number {
  if (!pulseState.active) return pulseState.minOpacity;

  // Calculate time-based pulse factor
  // Use the provided time from the animation manager if available, otherwise fall back to Date.now()
  const now = time !== undefined ? time : Date.now();

  // Update random values periodically instead of every frame
  if (now - randomCache.lastUpdateTime > randomCache.updateInterval) {
    // Update random values
    const elapsed = now - pulseState.startTime;
    const normalizedTime = (elapsed % pulseState.pulseDuration) / pulseState.pulseDuration;

    // Lower base probability but with occasional spikes for more dramatic, rare clusters
    const baseFlickerProbability = 0.01; // 1% base chance (reduced)
    // Create occasional spikes in probability for more clustered, dramatic effects
    const cycleBoost = Math.pow(Math.sin(normalizedTime * Math.PI * 2), 4) * 0.15; // Sharper, higher peaks
    randomCache.flickerProbability = Math.max(0, baseFlickerProbability + cycleBoost);

    // Other random values
    randomCache.clusterChance = Math.random();
    // Higher strength for more dramatic flashes - increased to reach max opacity more often
    randomCache.flickerStrength = Math.random() * 0.5 + 0.5; // 0.5-1.0 strength (increased further)
    // Longer cluster durations for more sustained lightning-like moments
    randomCache.clusterDuration = Math.random() * 1500 + 1000; // 1000-2500ms (increased further)

    // Tighter spacing between flickers in a cluster for lightning-like rapid flashing
    const minFlickerSpacing = 15; // Reduced further from 20
    const maxFlickerSpacing = 50; // Reduced further from 70
    randomCache.requiredSpacing = Math.random() * (maxFlickerSpacing - minFlickerSpacing) + minFlickerSpacing;

    // Sub-cluster parameters (for groups of bright flashes)
    randomCache.subClusterChance = Math.random(); // Chance of starting a sub-cluster
    // Sub-clusters are shorter than main clusters but long enough for multiple flashes
    randomCache.subClusterDuration = Math.random() * 300 + 300; // 300-600ms - guaranteed longer duration
    // Extremely tight spacing within sub-clusters for rapid bright flashes
    const minSubClusterSpacing = 5; // Ultra-tight spacing (reduced from 10ms)
    const maxSubClusterSpacing = 25; // Tighter maximum (reduced from 40ms)
    randomCache.subClusterSpacing = Math.random() * (maxSubClusterSpacing - minSubClusterSpacing) + minSubClusterSpacing;
    // Increased number of flashes in a sub-cluster
    randomCache.subClusterFlashCount = Math.floor(Math.random() * 4) + 3; // 3-6 flashes per sub-cluster (increased)

    // Longer quiet periods between clusters for more dramatic contrast
    const minQuietPeriod = 5000; // Increased from 3000
    const maxQuietPeriod = 15000; // Increased from 10000
    randomCache.requiredQuietPeriod = Math.random() * (maxQuietPeriod - minQuietPeriod) + minQuietPeriod;

    randomCache.lastUpdateTime = now;
  }

  // Default to minimum opacity - this is the base state
  let pulseFactor = pulseState.minOpacity;

  // Determine if we should create a flicker
  const timeSinceLastFlicker = now - pulseState.lastFlickerTime;

  // Check if it's time for a flicker - use cached random values
  if (Math.random() < randomCache.flickerProbability && timeSinceLastFlicker > randomCache.requiredQuietPeriod) {
    // 60% chance of a cluster (increased from 40%), 40% chance of isolated flicker
    if (randomCache.clusterChance < 0.6 && !pulseState.flickerClusterActive) {
      // Start a new flicker cluster
      pulseState.flickerClusterActive = true;
      pulseState.clusterStartTime = now;
      pulseState.clusterDuration = randomCache.clusterDuration;

      // Create the first flicker in the cluster - always at high intensity to start the lightning effect
      // First flash is always at 85-95% of max intensity for dramatic effect (with max now capped at 60%)
      const initialIntensity = 0.85 + (Math.random() * 0.1); // 85-95% of max
      const flickerValue = pulseState.minOpacity +
        initialIntensity * (pulseState.maxOpacity - pulseState.minOpacity);

      pulseFactor = flickerValue;
      pulseState.lastFlickerTime = now;

      // 70% chance to start a sub-cluster of bright flashes (increased from 40%)
      if (randomCache.subClusterChance < 0.7) {
        pulseState.subClusterActive = true;
        pulseState.subClusterStartTime = now;
        pulseState.subClusterDuration = randomCache.subClusterDuration;
        pulseState.subClusterFlashCount = 0; // Reset flash count
      }
    } else if (pulseState.flickerClusterActive) {
      // We're in an active cluster
      const clusterElapsed = now - pulseState.clusterStartTime;

      if (clusterElapsed < pulseState.clusterDuration) {
        // Cluster is still active
        if (timeSinceLastFlicker > randomCache.requiredSpacing) {
          // Check if we're in a sub-cluster of bright flashes
          if (pulseState.subClusterActive) {
            // We're in a sub-cluster - create bright flashes in rapid succession
            const subClusterElapsed = now - pulseState.subClusterStartTime;

            if (subClusterElapsed < pulseState.subClusterDuration &&
                pulseState.subClusterFlashCount < randomCache.subClusterFlashCount) {
              // Still in active sub-cluster and haven't reached max flash count
              // Create a bright flash - always at 85-95% of max intensity (which is now capped at 60%)
              const brightIntensity = 0.85 + (Math.random() * 0.1); // 85-95% of max
              const flickerValue = pulseState.minOpacity +
                brightIntensity * (pulseState.maxOpacity - pulseState.minOpacity);

              pulseFactor = flickerValue;
              pulseState.lastFlickerTime = now;
              pulseState.subClusterFlashCount++;
            } else {
              // Sub-cluster has ended
              pulseState.subClusterActive = false;
              pulseState.lastSubClusterTime = now;

              // Create a normal flicker to transition out of the sub-cluster
              const normalIntensity = 0.4 + (Math.random() * 0.3); // 40-70% intensity
              const flickerValue = pulseState.minOpacity +
                normalIntensity * (pulseState.maxOpacity - pulseState.minOpacity);

              pulseFactor = flickerValue;
              pulseState.lastFlickerTime = now;
            }
          } else {
            // Not in a sub-cluster - check if we should start one
            // 40% chance to start a sub-cluster if enough time has passed since the last one (increased from 20%)
            const timeSinceLastSubCluster = now - pulseState.lastSubClusterTime;
            if (randomCache.subClusterChance < 0.4 && timeSinceLastSubCluster > 500) { // Reduced wait time from 1000ms to 500ms
              // Start a new sub-cluster
              pulseState.subClusterActive = true;
              pulseState.subClusterStartTime = now;
              pulseState.subClusterDuration = randomCache.subClusterDuration;
              pulseState.subClusterFlashCount = 0; // Reset flash count

              // Create the first bright flash in the sub-cluster
              const brightIntensity = 0.85 + (Math.random() * 0.1); // 85-95% of max (of the capped 60% max)
              const flickerValue = pulseState.minOpacity +
                brightIntensity * (pulseState.maxOpacity - pulseState.minOpacity);

              pulseFactor = flickerValue;
              pulseState.lastFlickerTime = now;
              pulseState.subClusterFlashCount++;
            } else {
              // Create a normal flicker with moderate intensity
              const normalIntensity = 0.3 + (Math.random() * 0.4); // 30-70% intensity
              const flickerValue = pulseState.minOpacity +
                normalIntensity * (pulseState.maxOpacity - pulseState.minOpacity);

              pulseFactor = flickerValue;
              pulseState.lastFlickerTime = now;
            }
          }
        } else {
          // Between flickers in a cluster, maintain a slightly elevated glow
          // Slower decay for more visible connection between flashes in a cluster
          const decayFactor = Math.max(0, 1 - (timeSinceLastFlicker / 150)); // Slower decay (150ms vs 100ms)
          pulseFactor = pulseState.minOpacity +
            decayFactor * 0.15 * (pulseState.maxOpacity - pulseState.minOpacity); // Higher residual glow
        }
      } else {
        // Cluster has ended
        pulseState.flickerClusterActive = false;
        pulseState.subClusterActive = false; // Also end any active sub-cluster
        pulseFactor = pulseState.minOpacity; // Return to minimum immediately
      }
    } else {
      // Create an isolated flicker - extremely subtle, barely noticeable
      const flickerStrength = Math.random() * 0.1 + 0.05; // Very subtle 0.05-0.15 strength (reduced)
      const flickerValue = pulseState.minOpacity +
        flickerStrength * (pulseState.maxOpacity - pulseState.minOpacity);

      pulseFactor = flickerValue;
      pulseState.lastFlickerTime = now;
    }
  } else if (timeSinceLastFlicker < 250) {
    // For 250ms after any flicker (increased from 200ms), decay back to minimum more gradually
    // Use a simplified linear decay but slower to maintain visibility between flashes
    const decayFactor = Math.max(0, 1 - (timeSinceLastFlicker / 250));
    pulseFactor = pulseState.minOpacity +
      decayFactor * 0.12 * (pulseState.maxOpacity - pulseState.minOpacity); // Increased residual glow
  }

  // Ensure the pulse factor is within valid range
  pulseFactor = Math.max(pulseState.minOpacity, Math.min(pulseFactor, pulseState.maxOpacity));

  // Update the current pulse factor
  pulseState.currentPulseFactor = pulseFactor;

  return pulseFactor;
}

/**
 * Creates a pulsing torus material
 * @param color - The color of the torus
 * @param opacity - The base opacity of the torus
 * @returns The torus material
 */
export function createPulsingTorusMaterial(color: string, opacity: number = 0.3): THREE.Material {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: opacity,
    wireframe: true,
    depthWrite: false
  });
}

/**
 * Updates the opacity of a torus material based on the pulse factor
 * @param material - The torus material to update
 * @param pulseFactor - The pulse factor (opacity value)
 * @param materialId - Optional ID for caching
 */
export function updateTorusOpacity(
  material: THREE.Material,
  pulseFactor: number,
  materialId?: string
): void {
  if (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.LineBasicMaterial) {
    // For torus pulse, we directly use the pulse factor as the opacity
    // This ensures the flash effect is directly controlled by calculatePulseFactor

    // Ensure the opacity is within valid range
    // CRITICAL FIX: Never let opacity go below 0.03 to ensure wireframes remain visible
    // This matches our new minOpacity value
    // Also ensure we never exceed 0.3 (60% of original max) for more subtle flashes
    const clampedOpacity = Math.max(0.03, Math.min(pulseFactor, 0.3));

    // Skip update if the opacity hasn't changed significantly
    // This reduces unnecessary material updates
    if (materialId) {
      const cachedOpacity = materialOpacityCache.get(materialId);
      if (cachedOpacity !== undefined && Math.abs(cachedOpacity - clampedOpacity) < 0.01) {
        return; // Skip update if change is less than 1%
      }

      // Update the cache
      materialOpacityCache.set(materialId, clampedOpacity);
    }

    // Only update the material opacity if it has changed
    if (material.opacity !== clampedOpacity) {
      material.opacity = clampedOpacity;

      // Mark the material as needing an update only if the opacity has changed
      material.needsUpdate = true;
    }
  }
}

/**
 * Creates a flash effect for a torus
 * @param material - The torus material to update
 * @param duration - The duration of the flash in milliseconds
 * @param maxOpacity - The maximum opacity during the flash
 * @param callback - Optional callback to execute when the flash is complete
 */
export function flashTorus(
  material: THREE.Material,
  duration: number = 500,
  maxOpacity: number = 0.8,
  callback?: () => void
): void {
  if (material instanceof THREE.MeshBasicMaterial) {
    // Store the original opacity
    const originalOpacity = material.opacity;

    // Set the material to maximum opacity only if it has changed
    if (material.opacity !== maxOpacity) {
      material.opacity = maxOpacity;
      material.needsUpdate = true;
    }

    // Gradually reduce the opacity back to the original value
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1.0, elapsed / duration);

      // Calculate the new opacity using easing
      const easedProgress = easeOutQuad(progress);
      const newOpacity = maxOpacity - (maxOpacity - originalOpacity) * easedProgress;

      // Only update if the opacity has changed significantly
      if (Math.abs(material.opacity - newOpacity) > 0.01) {
        material.opacity = newOpacity;
        material.needsUpdate = true;
      }

      // Continue the animation if not complete
      if (progress < 1.0) {
        requestAnimationFrame(animate);
      } else {
        // Reset to the original opacity and call the callback only if needed
        if (Math.abs(material.opacity - originalOpacity) > 0.01) {
          material.opacity = originalOpacity;
          material.needsUpdate = true;
        }

        if (callback) {
          callback();
        }
      }
    };

    // Start the animation
    requestAnimationFrame(animate);
  }
}

/**
 * Easing function for smooth transitions
 * @param t - The progress value (0-1)
 * @returns The eased value
 */
function easeOutQuad(t: number): number {
  return t * (2 - t);
}
