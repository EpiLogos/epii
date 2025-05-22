/**
 * Calculates the position of a node in a 3D diamond layout based on its bimbaCoordinate.
 *
 * This creates a diamond/octahedron shape where:
 * - The root node (#) is at the center
 * - Nodes #1-#4 form a square on the x-y plane
 * - Node #0 is below the center on the z-axis
 * - Node #5 is above the center on the z-axis
 *
 * For child nodes, they are positioned relative to their parent node,
 * maintaining the diamond structure but at a smaller scale.
 */

/**
 * Calculate the position of a node in the 3D diamond layout
 * @param bimbaCoordinate - The bimbaCoordinate of the node
 * @returns The position of the node in the 3D diamond layout
 */
export function calculate3DDiamondPosition(bimbaCoordinate: string | undefined | null): { x: number, y: number, z: number } | null {
  if (!bimbaCoordinate) {
    console.warn('calculate3DDiamondPosition: bimbaCoordinate is null or undefined');
    return null;
  }

  try {
    // Root node at center
    if (bimbaCoordinate === '#') {
      return { x: 0, y: 0, z: 0 };
    }

    // Base distance for the first level
    const baseDistance = 1200;

    // Scaling factor for each level deeper
    const distanceScaleFactor = 0.3;

    // For main subsystem nodes (#0-#5)
    if (/^#[0-5]$/.test(bimbaCoordinate)) {
      const mainSubsystem = parseInt(bimbaCoordinate.substring(1), 10);

      // Calculate the square side length to ensure nodes #1-#4 form a perfect square
      // centered on the parent node
      const squareSideLength = baseDistance * Math.sqrt(2);

      switch(mainSubsystem) {
        case 0: // Anuttara - below center
          return { x: 0, y: 0, z: -baseDistance };
        case 1: // Paramasiva - front-right
          return { x: squareSideLength / 2, y: squareSideLength / 2, z: 0 };
        case 2: // Parashakti - front-left
          return { x: -squareSideLength / 2, y: squareSideLength / 2, z: 0 };
        case 3: // Mahamaya - back-left
          return { x: -squareSideLength / 2, y: -squareSideLength / 2, z: 0 };
        case 4: // Nara - back-right
          return { x: squareSideLength / 2, y: -squareSideLength / 2, z: 0 };
        case 5: // Epii - above center
          return { x: 0, y: 0, z: baseDistance };
        default:
          console.warn(`calculate3DDiamondPosition: Invalid subsystem number: ${mainSubsystem}`);
          return { x: 0, y: 0, z: 0 };
      }
    }

    // For other mapped nodes, calculate position based on parent
    if (bimbaCoordinate && (bimbaCoordinate.includes('-') || bimbaCoordinate.includes('.'))) {
      // Remove the '#' prefix and split into segments
      const cleanCoordinate = bimbaCoordinate.substring(1);
      const segments = cleanCoordinate.split(/[-\.]/);

      if (segments.length === 0) {
        console.warn(`calculate3DDiamondPosition: Invalid bimbaCoordinate format: ${bimbaCoordinate}`);
        return { x: 0, y: 0, z: 0 };
      }

      // Start from the center
      let x = 0;
      let y = 0;
      let z = 0;

      // Current distance for this level
      let currentDistance = baseDistance;

      // Process the first segment (main subsystem)
      if (segments.length > 0) {
        const mainSubsystem = parseInt(segments[0], 10);

        if (isNaN(mainSubsystem) || mainSubsystem < 0 || mainSubsystem > 5) {
          console.warn(`calculate3DDiamondPosition: Invalid main subsystem: ${segments[0]}`);
          return { x: 0, y: 0, z: 0 };
        }

        // Calculate the square side length to ensure nodes #1-#4 form a perfect square
        // centered on the parent node
        const squareSideLength = currentDistance * Math.sqrt(2);

        switch(mainSubsystem) {
          case 0: // Anuttara - below center
            z = -currentDistance;
            break;
          case 1: // Paramasiva - front-right
            x = squareSideLength / 2;
            y = squareSideLength / 2;
            break;
          case 2: // Parashakti - front-left
            x = -squareSideLength / 2;
            y = squareSideLength / 2;
            break;
          case 3: // Mahamaya - back-left
            x = -squareSideLength / 2;
            y = -squareSideLength / 2;
            break;
          case 4: // Nara - back-right
            x = squareSideLength / 2;
            y = -squareSideLength / 2;
            break;
          case 5: // Epii - above center
            z = currentDistance;
            break;
        }

        // Reduce distance for next level
        currentDistance *= distanceScaleFactor;
      }

      // Process deeper segments
      for (let i = 1; i < segments.length; i++) {
        const segmentValue = parseInt(segments[i], 10);

        if (isNaN(segmentValue)) {
          console.warn(`calculate3DDiamondPosition: Invalid segment value: ${segments[i]}`);
          continue;
        }

        // Calculate position relative to current position
        // This maintains the diamond shape for deeper nodes
        // Calculate the square side length for this level
        const squareSideLength = currentDistance * Math.sqrt(2);

        switch(segmentValue % 6) {
          case 0: // Below
            z -= currentDistance;
            break;
          case 1: // Front-right
            x += squareSideLength / 2;
            y += squareSideLength / 2;
            break;
          case 2: // Front-left
            x -= squareSideLength / 2;
            y += squareSideLength / 2;
            break;
          case 3: // Back-left
            x -= squareSideLength / 2;
            y -= squareSideLength / 2;
            break;
          case 4: // Back-right
            x += squareSideLength / 2;
            y -= squareSideLength / 2;
            break;
          case 5: // Above
            z += currentDistance;
            break;
        }

        // Reduce distance for next level
        currentDistance *= distanceScaleFactor;
      }

      // Add a small random offset to prevent exact overlaps
      const randomOffset = 5;
      x += (Math.random() - 0.5) * randomOffset;
      y += (Math.random() - 0.5) * randomOffset;
      z += (Math.random() - 0.5) * randomOffset;

      return { x, y, z };
    }

    // Default position for any other nodes
    console.warn(`calculate3DDiamondPosition: Unrecognized bimbaCoordinate format: ${bimbaCoordinate}`);
    return { x: 0, y: 0, z: 0 };
  } catch (error) {
    console.error(`calculate3DDiamondPosition: Error calculating position for ${bimbaCoordinate}:`, error);
    return { x: 0, y: 0, z: 0 };
  }
}
