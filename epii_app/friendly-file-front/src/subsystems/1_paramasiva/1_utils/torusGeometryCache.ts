/**
 * Torus Geometry Cache
 * 
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-1 (QL/AT Vis - Utils)
 * 
 * This utility provides caching for torus geometries to avoid recreating them,
 * which improves performance by reducing memory allocations and garbage collection.
 */

import * as THREE from 'three';

// Cache for torus geometries
interface TorusGeometryKey {
  radius: number;
  tubeRadius: number;
  radialSegments: number;
  tubularSegments: number;
}

// Convert key to string for map lookup
function keyToString(key: TorusGeometryKey): string {
  return `${key.radius.toFixed(3)}_${key.tubeRadius.toFixed(3)}_${key.radialSegments}_${key.tubularSegments}`;
}

// The geometry cache
const geometryCache = new Map<string, THREE.TorusGeometry>();

// Cache statistics for debugging
const cacheStats = {
  hits: 0,
  misses: 0,
  size: 0
};

/**
 * Get a torus geometry from the cache or create a new one
 * @param radius The radius of the torus
 * @param tubeRadius The radius of the tube
 * @param radialSegments The number of radial segments
 * @param tubularSegments The number of tubular segments
 * @returns The torus geometry
 */
export function getTorusGeometry(
  radius: number,
  tubeRadius: number,
  radialSegments: number = 6,
  tubularSegments: number = 24
): THREE.TorusGeometry {
  // Create the key
  const key: TorusGeometryKey = {
    radius,
    tubeRadius,
    radialSegments,
    tubularSegments
  };
  
  // Convert to string for map lookup
  const keyString = keyToString(key);
  
  // Check if the geometry is in the cache
  if (geometryCache.has(keyString)) {
    cacheStats.hits++;
    return geometryCache.get(keyString)!;
  }
  
  // Create a new geometry
  cacheStats.misses++;
  const geometry = new THREE.TorusGeometry(
    radius,
    tubeRadius,
    radialSegments,
    tubularSegments
  );
  
  // Add to cache
  geometryCache.set(keyString, geometry);
  cacheStats.size = geometryCache.size;
  
  return geometry;
}

/**
 * Clear the geometry cache
 */
export function clearGeometryCache(): void {
  // Dispose all geometries
  geometryCache.forEach(geometry => {
    geometry.dispose();
  });
  
  // Clear the cache
  geometryCache.clear();
  
  // Reset stats
  cacheStats.size = 0;
}

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export function getCacheStats(): typeof cacheStats {
  return { ...cacheStats };
}
