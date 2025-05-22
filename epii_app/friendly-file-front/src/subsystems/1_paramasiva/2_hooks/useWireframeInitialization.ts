/**
 * useWireframeInitialization Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-2 (QL/AT Vis - Hooks)
 *
 * This hook handles the initialization of diamond and torus wireframes
 * in the 3D visualization. It ensures proper sequencing of wireframe creation
 * and coordinates with the physics engine.
 */

import { useRef, useEffect, useCallback, MutableRefObject } from 'react';
import * as THREE from 'three';
import { Node } from '../../../components/meta/metaData';

/**
 * Hook for initializing wireframes in the 3D visualization
 * @param fgRef - Reference to the ForceGraph3D component
 * @param graphData - The graph data (nodes and links)
 * @param physicsInitialized - Whether the physics engine has been initialized
 * @param onWireframesCreated - Optional callback when wireframes are created
 * @returns Object containing wireframe creation functions and state
 */
export function useWireframeInitialization(
  fgRef: MutableRefObject<any | null>,
  graphData: { nodes: Node[], links: any[] } | null,
  physicsInitialized: boolean = false,
  onWireframesCreated?: () => void
) {
  // References to track wireframe creation state
  const isMountedRef = useRef<boolean>(false);
  const diamondUtilsRef = useRef<any>(null);
  const torusUtilsRef = useRef<any>(null);
  const diamondWireframesCreatedRef = useRef<boolean>(false);
  const torusWireframesCreatedRef = useRef<boolean>(false);
  const lastDiamondUpdateRef = useRef<number>(Date.now());

  // Load wireframe utilities
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;

    // Load diamond wireframe utilities
    import('../1_utils/diamondUtils').then((module) => {
      if (isMountedRef.current) {
        diamondUtilsRef.current = module;
      }
    });

    // Load torus wireframe utilities
    import('../1_utils/torusUtils').then((module) => {
      if (isMountedRef.current) {
        torusUtilsRef.current = module;
      }
    });

    // No cleanup needed
    return () => {};
  }, []);

  // Store the latest graphData in a ref to avoid dependency issues
  const graphDataRef = useRef<{ nodes: Node[], links: any[] } | null>(null);

  // Update the ref when graphData changes
  useEffect(() => {
    graphDataRef.current = graphData;
  }, [graphData]);

  // Function to create diamond wireframes
  const createDiamondWireframes = useCallback(() => {
    // Use the ref instead of the prop directly
    const currentGraphData = graphDataRef.current;

    // Skip if already created or missing dependencies
    if (
      diamondWireframesCreatedRef.current ||
      !fgRef.current ||
      !currentGraphData ||
      !currentGraphData.nodes ||
      currentGraphData.nodes.length === 0 ||
      !diamondUtilsRef.current
    ) {
      console.log('Skipping diamond wireframes creation:', {
        alreadyCreated: diamondWireframesCreatedRef.current,
        fgRefExists: !!fgRef.current,
        graphDataExists: !!currentGraphData,
        nodesExist: !!(currentGraphData?.nodes),
        nodesLength: currentGraphData?.nodes?.length || 0,
        diamondUtilsLoaded: !!diamondUtilsRef.current
      });
      return;
    }

    try {
      console.log('Creating diamond wireframes...');
      const scene = fgRef.current.scene();
      if (scene) {
        // Find existing wireframe group and properly dispose of it
        const existingGroup = scene.getObjectByName('diamond-wireframes') as THREE.Group;
        if (existingGroup) {
          // Properly dispose of all children
          existingGroup.traverse((object) => {
            // Dispose of geometries
            if ((object as any).geometry) {
              (object as any).geometry.dispose();
            }

            // Dispose of materials
            if ((object as any).material) {
              if (Array.isArray((object as any).material)) {
                (object as any).material.forEach((material: any) => material.dispose());
              } else {
                (object as any).material.dispose();
              }
            }
          });

          // Remove from scene
          scene.remove(existingGroup);
        }

        // Create wireframes using the current graph data from the ref
        const currentGraphData = graphDataRef.current;
        if (currentGraphData && currentGraphData.nodes) {
          diamondUtilsRef.current.updateDiamondWireframes(currentGraphData.nodes, scene);
          lastDiamondUpdateRef.current = Date.now();
          diamondWireframesCreatedRef.current = true; // Mark as created to prevent redraws
        } else {
          console.error('No graph data available for diamond wireframes');
        }
        console.log('Diamond wireframes created successfully');
      } else {
        console.log('No scene available for diamond wireframes');
      }
    } catch (error) {
      console.error('Error creating diamond wireframes:', error);
    }
  }, [fgRef]);

  // Function to create torus wireframes
  const createTorusWireframes = useCallback(() => {
    // Use the ref instead of the prop directly
    const currentGraphData = graphDataRef.current;

    // Skip if already created or missing dependencies
    if (
      torusWireframesCreatedRef.current ||
      !fgRef.current ||
      !currentGraphData ||
      !currentGraphData.nodes ||
      currentGraphData.nodes.length === 0 ||
      !torusUtilsRef.current
    ) {
      console.log('Skipping torus wireframes creation:', {
        alreadyCreated: torusWireframesCreatedRef.current,
        fgRefExists: !!fgRef.current,
        graphDataExists: !!currentGraphData,
        nodesExist: !!(currentGraphData?.nodes),
        nodesLength: currentGraphData?.nodes?.length || 0,
        torusUtilsLoaded: !!torusUtilsRef.current
      });
      return;
    }

    try {
      const scene = fgRef.current.scene();
      if (scene) {
        // Find existing torus group and properly dispose of it
        const existingGroup = scene.getObjectByName('torus-wireframes') as THREE.Group;
        if (existingGroup) {
          // Properly dispose of all children
          existingGroup.traverse((object: THREE.Object3D) => {
            // Dispose of geometries
            const obj = object as any;
            if (obj.geometry) {
              obj.geometry.dispose();
            }

            // Dispose of materials
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((material: THREE.Material) => material.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });

          // Remove from scene
          scene.remove(existingGroup);
        }

        // Create new torus group
        const torusGroup = new THREE.Group();
        torusGroup.name = 'torus-wireframes';
        scene.add(torusGroup);

        // Create torus wireframes using the current graph data from the ref
        const currentGraphData = graphDataRef.current;
        if (currentGraphData && currentGraphData.nodes) {
          torusUtilsRef.current.updateTorusWireframes(currentGraphData.nodes, scene);
        } else {
          console.error('No graph data available for torus wireframes');
        }

        // Mark as created to prevent redraws
        torusWireframesCreatedRef.current = true;

        // Call the callback if provided
        if (onWireframesCreated) {
          console.log('useWireframeInitialization: Calling onWireframesCreated callback');
          onWireframesCreated();
        }
      }
    } catch (error) {
      console.error('Error creating torus wireframes:', error);
    }
  }, [fgRef, onWireframesCreated]);

  // Use a static flag to ensure wireframes are only created once per application lifecycle
  // This prevents the hook from running multiple times even if the component remounts
  const staticWireframesCreatedRef = useRef<boolean>(false);

  // Initialize wireframes in the correct sequence - ONCE PER APPLICATION LIFECYCLE
  useEffect(() => {
    // Ensure component is marked as mounted
    isMountedRef.current = true;

    // CRITICAL: Skip if wireframes are already created GLOBALLY
    // This prevents wireframe recreation even if the component remounts
    if (staticWireframesCreatedRef.current) {
      // No logging to reduce console spam
      return;
    }

    // Skip if wireframes are already created locally
    if (diamondWireframesCreatedRef.current && torusWireframesCreatedRef.current) {
      // No logging to reduce console spam
      return;
    }

    // Wait for physics to be initialized before creating wireframes
    if (!physicsInitialized) {
      // No logging to reduce console spam
      return;
    }

    console.log('useWireframeInitialization: Creating wireframes (one-time operation)');

    // Create wireframes in sequence with proper timing
    const initializeWireframes = async () => {
      try {
        // Wait for utilities to be loaded
        const waitForUtils = () => {
          return new Promise<void>((resolve) => {
            const checkUtils = () => {
              if (diamondUtilsRef.current && torusUtilsRef.current) {
                resolve();
              } else {
                setTimeout(checkUtils, 100);
              }
            };
            checkUtils();
          });
        };

        // Wait for utilities to be loaded
        await waitForUtils();

        // Double-check that component is still mounted
        if (!isMountedRef.current) return;

        // Create diamond wireframes first (if not already created)
        if (!diamondWireframesCreatedRef.current) {
          createDiamondWireframes();
        }

        // Wait a short time before creating torus wireframes
        await new Promise(resolve => setTimeout(resolve, 500));

        // Double-check that component is still mounted
        if (!isMountedRef.current) return;

        // Create torus wireframes (if not already created)
        if (!torusWireframesCreatedRef.current) {
          createTorusWireframes();
        }

        // Mark wireframes as created GLOBALLY
        // This prevents wireframe recreation even if the component remounts
        staticWireframesCreatedRef.current = true;
      } catch (error) {
        console.error('Error initializing wireframes:', error);
      }
    };

    // Start the initialization sequence
    initializeWireframes();

    // Clean up
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
    };
  // CRITICAL: Only depend on physicsInitialized to prevent redundant wireframe creation
  // We're using refs for everything else to avoid re-running this effect
  }, [physicsInitialized]);

  // REMOVED: Force redraw of diamond wireframes when utilities are loaded
  // This was causing WebGL context loss due to excessive memory usage
  // The wireframes should be created once during initialization
  useEffect(() => {
    // No-op - we've removed this effect to prevent WebGL context loss
  }, []);

  // REMOVED: Force redraw of torus wireframes when utilities are loaded
  // This was causing WebGL context loss due to excessive memory usage
  // The wireframes should be created once during initialization
  useEffect(() => {
    // No-op - we've removed this effect to prevent WebGL context loss
  }, []);

  return {
    diamondWireframesCreated: diamondWireframesCreatedRef.current,
    torusWireframesCreated: torusWireframesCreatedRef.current,
    createDiamondWireframes,
    createTorusWireframes
  };
}
