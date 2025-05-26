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

  const normalized = input.replace(/\./g, '-');
  const partsString = normalized.replace('#', '').split('-');

  if (partsString.some(part => isNaN(Number(part)) || part === '')) {
    // console.error("Invalid coordinate input: Parts must be numbers and not empty.");
    return null; // Or throw error
  }

  const parts = partsString.map(Number);

  if (parts.length === 0) {
    // console.error("Invalid coordinate input: No parts found after #.");
    return null;
  }

  return {
    fullCoordinate: `#${parts.join('-')}`,
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
  const parsed = parseCoordinate(coordinate);
  if (!parsed || parsed.parts.length <= 1) {
    return null; // Root level or first-level node, no parent in this format
  }

  const parentParts = parsed.parts.slice(0, -1);
  return `#${parentParts.join('-')}`;
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
    qlPosition: parsed.qlPosition,
    name: `Node ${parsed.fullCoordinate}`, // Default name
    title: `QL Position ${parsed.qlPosition} Node`, // Default title
    // description is intentionally left out from the original plan as BimbaNodeSchema requires it
    // and it should likely be user-defined or more intelligently generated.
    // The schema also doesn't list 'title' as a property, but it's in the plan.
    // For now, adhering to the provided plan's function signature.
    // Consider aligning with BimbaNodeSchema more closely in a future step if needed.
    description: `Quaternal Logic position ${parsed.qlPosition} node at ${parsed.fullCoordinate}`, // Added a more descriptive default
    createdAt: now,
    updatedAt: now,
    // Other properties from BimbaNodeSchema like qlCategory, parentCoordinate, etc.,
    // would need to be set based on further logic or user input.
  };
};
