
/**
 * Calculate the color of a node based on its virtual depth, bimbaCoordinate, and parent relationships
 *
 * UNIFIED APPROACH:
 * This function uses a truly unified approach based on virtual depth for all nodes.
 *
 * The color determination follows this priority:
 * 1. For highlighted nodes: Always white
 * 2. For mapped nodes with specific bimbaCoordinates: Fixed colors based on subsystem
 * 3. For unmapped nodes: Inherit color from parent, with lightness based on depth
 * 4. Fallback: Use type-based color with lightness based on depth
 *
 * @param type - The type of the node
 * @param depth - The virtual depth of the node
 * @param isHighlighted - Whether the node is highlighted
 * @param bimbaCoordinate - The bimbaCoordinate of the node (if any)
 * @param parentId - The parent ID of the node (for color inheritance)
 * @param allNodes - Array of all nodes (for parent lookup)
 * @returns The color of the node as a hex string
 */
export function calculateNodeColor(
  type: string | undefined,
  depth: number,
  isHighlighted: boolean = false,
  bimbaCoordinate: string | undefined | null = null,
  parentId?: string | undefined,
  allNodes?: Array<{
    id: string;
    bimbaCoordinate?: string | null;
    color?: string;
  }>
): string {
  // Base colors for each subsystem
  const baseColors: { [key: number]: number[] } = {
    0: [255, 255, 255], // Anuttara - White
    1: [30, 120, 255],  // Paramasiva - Blue
    2: [255, 30, 120],  // Parashakti - Red
    3: [255, 220, 30],  // Mahamaya - Yellow
    4: [30, 220, 120],  // Nara - Green
    5: [220, 30, 255]   // Epii - Purple
  };

  // Type-based colors (fallback)
  const typeColors: { [key: string]: string } = {
    'AbstractType': '#555555',
    'ConcreteType': '#999999',
    'Static': '#777777',
    'Dynamic': '#222222',
    'Synchronous': '#111111',
    'Asynchronous': '#444444',
    'Blocking': '#666666',
    'NonBlocking': '#888888',
    'Sequential': '#bbbbbb',
    'Parallel': '#cccccc',
    'Distributed': '#dddddd',
    'Centralized': '#eeeeee',
  };
  const defaultColor = '#aaaaaa';

  // PRIORITY 1: Highlighted nodes are always white
  if (isHighlighted) {
    return '#ffffff';
  }

  // PRIORITY 2: Mapped nodes with specific bimbaCoordinates get fixed colors
  if (bimbaCoordinate) {
    // Root node (#) - white
    if (bimbaCoordinate === '#') {
      return '#ffffff';
    }

    // Extract the main subsystem number
    const mainSubsystem = parseInt(bimbaCoordinate.charAt(1), 10);

    // Main subsystem nodes (#0-#5) - vibrant colors
    if (/^#[0-5]$/.test(bimbaCoordinate)) {
      switch (mainSubsystem) {
        case 0: return '#ffffff'; // Anuttara - White
        case 1: return '#1e78ff'; // Paramasiva - Blue
        case 2: return '#ff1e78'; // Parashakti - Red
        case 3: return '#ffdc1e'; // Mahamaya - Yellow
        case 4: return '#1edc78'; // Nara - Green
        case 5: return '#dc1eff'; // Epii - Purple
        default: return '#aaaaaa'; // Default color
      }
    }

    // Second level nodes (#X-Y or #X.Y) - lighter versions
    if (/^#[0-5][-.]([0-5])$/.test(bimbaCoordinate)) {
      switch (mainSubsystem) {
        case 0: return '#e0e0e0'; // Anuttara - Light Grey
        case 1: return '#7eaaff'; // Paramasiva - Light Blue
        case 2: return '#ff7eaa'; // Parashakti - Light Red
        case 3: return '#ffec7e'; // Mahamaya - Light Yellow
        case 4: return '#7eecaa'; // Nara - Light Green
        case 5: return '#ec7eff'; // Epii - Light Purple
        default: return '#cccccc'; // Default color
      }
    }

    // Third level nodes (#X-Y-Z or #X.Y.Z) - even lighter versions
    if (/^#[0-5][-.]([0-5])[-.]([0-5])$/.test(bimbaCoordinate)) {
      switch (mainSubsystem) {
        case 0: return '#f0f0f0'; // Anuttara - Very Light Grey
        case 1: return '#b0d0ff'; // Paramasiva - Very Light Blue
        case 2: return '#ffb0d0'; // Parashakti - Very Light Red
        case 3: return '#fff8b0'; // Mahamaya - Very Light Yellow
        case 4: return '#b0f8d0'; // Nara - Very Light Green
        case 5: return '#f8b0ff'; // Epii - Very Light Purple
        default: return '#dddddd'; // Default color
      }
    }

    // For deeper mapped nodes, calculate color based on depth and subsystem
    // Get base color for this subsystem
    const baseColor = baseColors[mainSubsystem] || [170, 170, 170];

    // Calculate lightness factor based on virtual depth
    // Reduce the rate at which colors get lighter with depth
    const lightnessFactor = Math.min(0.7, 0.3 + (depth - 2) * 0.05);

    // Mix with white based on lightness factor
    const r = Math.floor(baseColor[0] + (255 - baseColor[0]) * lightnessFactor);
    const g = Math.floor(baseColor[1] + (255 - baseColor[1]) * lightnessFactor);
    const b = Math.floor(baseColor[2] + (255 - baseColor[2]) * lightnessFactor);

    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // PRIORITY 3: Unmapped nodes inherit color from parent
  if (parentId && allNodes) {
    const parentNode = allNodes.find(node => node.id === parentId);
    if (parentNode) {
      // If parent has a bimbaCoordinate, derive color from it
      if (parentNode.bimbaCoordinate) {
        // If parent is the root node, use a light gray
        if (parentNode.bimbaCoordinate === '#') {
          return '#e0e0e0'; // Light gray for children of root
        }

        // Get the main subsystem from the parent
        const mainSubsystem = parseInt(parentNode.bimbaCoordinate.charAt(1), 10);
        const baseColor = baseColors[mainSubsystem] || [170, 170, 170];

        // Calculate lightness factor based on virtual depth
        // Reduce the rate at which colors get lighter with depth
        const lightnessFactor = Math.min(0.7, 0.3 + (depth - 1) * 0.05);

        // Mix with white based on lightness factor
        const r = Math.floor(baseColor[0] + (255 - baseColor[0]) * lightnessFactor);
        const g = Math.floor(baseColor[1] + (255 - baseColor[1]) * lightnessFactor);
        const b = Math.floor(baseColor[2] + (255 - baseColor[2]) * lightnessFactor);

        // Convert to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }

      // If parent has a color, use a lighter version of it
      if (parentNode.color) {
        // Parse the parent's color
        const r = parseInt(parentNode.color.substring(1, 3), 16);
        const g = parseInt(parentNode.color.substring(3, 5), 16);
        const b = parseInt(parentNode.color.substring(5, 7), 16);

        // Make it lighter based on virtual depth
        // Reduce the rate at which colors get lighter with depth
        const lightnessFactor = Math.min(0.7, 0.3 + (depth - 1) * 0.05);

        // Mix with white
        const adjustedR = Math.floor(r + (255 - r) * lightnessFactor);
        const adjustedG = Math.floor(g + (255 - g) * lightnessFactor);
        const adjustedB = Math.floor(b + (255 - b) * lightnessFactor);

        // Convert back to hex
        return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
      }
    }
  }

  // PRIORITY 4: Fallback to type-based color with depth-based lightness
  const baseColor = type && typeColors[type] ? typeColors[type] : defaultColor;

  // Parse the base color
  const r = parseInt(baseColor.substring(1, 3), 16);
  const g = parseInt(baseColor.substring(3, 5), 16);
  const b = parseInt(baseColor.substring(5, 7), 16);

  // Calculate lightness factor based on virtual depth
  // Reduce the rate at which colors get lighter with depth
  const lightnessFactor = Math.min(0.7, 0.3 + (depth - 1) * 0.05);

  // Mix with white based on lightness factor
  const adjustedR = Math.floor(r + (255 - r) * lightnessFactor);
  const adjustedG = Math.floor(g + (255 - g) * lightnessFactor);
  const adjustedB = Math.floor(b + (255 - b) * lightnessFactor);

  // Convert back to hex
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
}

/**
 * Calculate the size of a node based on its virtual depth and bimbaCoordinate
 *
 * UNIFIED APPROACH:
 * This function uses a truly unified approach based on virtual depth for all nodes.
 *
 * The size determination follows this priority:
 * 1. For mapped nodes with specific bimbaCoordinates: Fixed sizes based on hierarchy level
 * 2. For all other nodes: Size based on virtual depth with mode-specific scaling
 *
 * @param virtualDepth - The virtual depth of the node
 * @param bimbaCoordinate - The bimbaCoordinate of the node (if any)
 * @param baseSize - The base size of nodes (smaller values indicate 3D mode)
 * @returns The size of the node
 */
export function calculateNodeSize(
  virtualDepth: number | undefined,
  bimbaCoordinate: string | undefined | null,
  baseSize: number = 30
): number {
  // Use a default depth if not provided
  const depth = virtualDepth !== undefined ? virtualDepth : 3;

  // Determine if we're in 3D mode based on baseSize
  const is3D = baseSize <= 5;

  // PRIORITY 1: Mapped nodes with specific bimbaCoordinates get fixed sizes

  // Root node (#) - largest
  if (bimbaCoordinate === '#') {
    return is3D ? baseSize * 20.0 : baseSize * 2.0;
  }

  // Main subsystem nodes (#0-#5) - large
  if (bimbaCoordinate && /^#[0-5]$/.test(bimbaCoordinate)) {
    return is3D ? baseSize * 15.0 : baseSize * 1.5;
  }

  // Second level nodes (#X-Y or #X.Y) - medium-large
  if (bimbaCoordinate && /^#[0-5][-.]([0-5])$/.test(bimbaCoordinate)) {
    return is3D ? baseSize * 10.0 : baseSize * 1.3;
  }

  // Third level nodes (#X-Y-Z or #X.Y.Z) - medium
  if (bimbaCoordinate && /^#[0-5][-.]([0-5])[-.]([0-5])$/.test(bimbaCoordinate)) {
    return is3D ? baseSize * 7.0 : baseSize * 1.2;
  }

  // PRIORITY 2: All other nodes (mapped or unmapped) use virtual depth for sizing

  // Different scaling for 3D vs 2D
  if (is3D) {
    // 3D nodes need more aggressive scaling but larger minimum size
    const scaleFactor = 2.5;
    const calculatedSize = baseSize * Math.pow(scaleFactor, Math.max(-1, 3 - depth));
    return Math.max(baseSize * 1.0, calculatedSize);
  } else {
    // 2D nodes
    return baseSize * Math.max(0.5, 1.5 - depth * 0.15);
  }
}
