// epii_app/friendly-file-front/src/utils/bimbaUtils.ts

/**
 * Parses a Bimba coordinate string into its components.
 * Handles both '-' and '.' separators.
 *
 * @param input - The coordinate string (e.g., "#1-2-3" or "#1.2.3").
 * @returns An object containing the full coordinate, parts, and QL position.
 */
export const parseCoordinate = (input: string): { fullCoordinate: string; parts: number[]; qlPosition: number } | null => {
  if (!input || !input.startsWith('#')) {
    // console.error("Invalid coordinate input: Must start with #");
    return null; // Or throw error, depending on desired error handling
  }

  // Use the original input for fullCoordinate
  const originalFullCoordinate = input;

  // For deriving parts and qlPosition, we can still normalize.
  const normalizedForParts = input.replace(/\./g, '-');
  const partsString = normalizedForParts.replace('#', '').split('-');

  if (partsString.some(part => isNaN(Number(part)) || part === '')) {
    // console.error("Invalid coordinate input: Parts must be numbers and not empty.");
    return null; // Or throw error
  }

  const parts = partsString.map(Number);

  if (parts.length === 0) {
    // console.error("Invalid coordinate input: No parts found after #.");
    return null;
  }

  // Handle the case where input is just "#" after validation checks
  // The existing check `partsString.some(part => isNaN(Number(part)) || part === '')`
  // for input "#", partsString is `[""]`. `part === ''` is true. So it correctly returns null.
  // No explicit additional check for "#" is needed here as the current logic handles it.

  return {
    fullCoordinate: originalFullCoordinate, // Use the original input here
    parts: parts,
    qlPosition: parts[parts.length - 1], // Final number for QL
  };
};

/**
 * Infers the parent coordinate from a given Bimba coordinate string.
 *
 * @param coordinate - The coordinate string (e.g., "#5-2-3").
 * @returns The parent coordinate string (e.g., "#5-2") or null if it's a root/first-level node.
 */
export const inferParentCoordinate = (coordinate: string): string | null => {
  // Still use parseCoordinate to validate the input and get parts count
  const parsedDetails = parseCoordinate(coordinate);

  // If input is invalid, or has 0 or 1 part (e.g., "#", "#1"), it cannot have a parent in this context.
  if (!parsedDetails || parsedDetails.parts.length <= 1) {
    return null;
  }

  // Use the original fullCoordinate string from parsedDetails, which preserves separators.
  const originalCoordinate = parsedDetails.fullCoordinate; // or simply use the input `coordinate` if confident it's already valid and starts with #

  // Find the last index of either '-' or '.'
  // We need to search in the part of the string after '#'
  const coreCoordinatePart = originalCoordinate.substring(1); // Remove '#'
  const lastDashIndex = coreCoordinatePart.lastIndexOf('-');
  const lastDotIndex = coreCoordinatePart.lastIndexOf('.');

  const lastSeparatorIndex = Math.max(lastDashIndex, lastDotIndex);

  // If no separator is found in the core part, it means it's a single segment like "123" after "#"
  // This case should have been caught by parsedDetails.parts.length <= 1, but as a safeguard:
  if (lastSeparatorIndex === -1) {
    return null;
  }

  // Construct the parent coordinate string by taking the substring
  // up to the last separator, including the leading '#'.
  return "#" + coreCoordinatePart.substring(0, lastSeparatorIndex);
};

/**
 * Initializes QL-aware properties for a new Bimba node based on its coordinate.
 *
 * @param coordinate - The full Bimba coordinate string (e.g., "#5-2-3").
 * @returns An object containing initial properties for the new node.
 */
export const initializeQLProperties = (coordinate: string): object | null => {
  const parsed = parseCoordinate(coordinate);
  if (!parsed) {
    // console.error("Cannot initialize QL properties: Invalid coordinate format.");
    return null;
  }

  const now = new Date().toISOString();

  return {
    bimbaCoordinate: parsed.fullCoordinate,
    qlPosition: parsed.qlPosition, // This is the final number in the coordinate
    qlVariant: '4/6', // Default to 4/6 for all nodes
    name: `Node ${parsed.fullCoordinate}`, // Keep for now but will be primary identifier
    description: `Quaternal Logic position ${parsed.qlPosition} node at ${parsed.fullCoordinate}`,

    // Default relational properties - empty strings that can be populated by analysis pipeline or manual editing
    qlOperators: '',
    epistemicEssence: '',
    archetypalAnchors: '',
    semanticFramework: '',

    createdAt: now,
    updatedAt: now,
    // Remove redundant 'title' property - 'name' should be sufficient
  };
};
