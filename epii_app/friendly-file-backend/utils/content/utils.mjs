/**
 * Core utility functions for the Epii Analysis Pipeline.
 * These functions provide general-purpose utilities for content processing,
 * with proper formatting and error handling.
 */

/**
 * Determines the content type based on analysis data.
 *
 * @param {object} analysisData - The analysis data
 * @returns {string} - The content type
 */
export function determineContentType(analysisData) {
    // Check for dominant mapping types to determine content type
    const mappingTypes = analysisData.extractedMappings.map(m => m.mappingType);

    // Count occurrences of each mapping type
    const typeCounts = {};
    mappingTypes.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Determine content type based on dominant mapping types
    if (typeCounts['Conceptual_Framework'] > (mappingTypes.length / 4)) {
        return "Conceptual";
    } else if (typeCounts['Symbolic_Anchor'] > (mappingTypes.length / 4)) {
        return "Symbolic";
    } else if (typeCounts['MEF_Lens'] > (mappingTypes.length / 4)) {
        return "Meta-Epistemic";
    } else if (typeCounts['Logic_Operator'] > (mappingTypes.length / 4)) {
        return "Logical";
    }

    // Default to "Analysis" if no specific type can be determined
    return "Analysis";
}

/**
 * Generates tags from analysis data.
 *
 * @param {object} analysisData - The analysis data
 * @returns {string[]} - The generated tags
 */
export function generateTags(analysisData) {
    // Extract tags from analysis data
    const tags = [];

    // Add tags based on dominant MEF lenses
    const mefLenses = analysisData.extractedMappings
        .filter(m => m.mappingType === 'MEF_Lens')
        .map(m => m.mappingValue);

    if (mefLenses.length > 0) {
        tags.push(...mefLenses.map(lens => `MEF:${lens}`));
    }

    // Add tags based on variation types
    const variationTypes = [...new Set(analysisData.identifiedVariations
        .map(v => v.variationType))];

    if (variationTypes.length > 0) {
        tags.push(...variationTypes.map(type => `Variation:${type}`));
    }

    // Add tags based on QL phases
    const qlPhases = [...new Set(analysisData.extractedMappings
        .filter(m => m.qlPhase)
        .map(m => m.qlPhase))];

    if (qlPhases.length > 0) {
        tags.push(...qlPhases.map(phase => `QL:${phase}`));
    }

    return tags;
}

/**
 * Detects the content type of a document based on its content.
 *
 * @param {string} content - The document content
 * @returns {string} - The detected content type ('json', 'html', 'markdown', or 'text')
 */
export function detectContentType(content) {
    // If no content, return text
    if (!content) return 'text';

    // Check content patterns
    const firstNonWhitespace = content.trim().substring(0, 10);

    // Check for JSON
    if (firstNonWhitespace.startsWith('{') || firstNonWhitespace.startsWith('[')) {
        try {
            JSON.parse(content);
            return 'json';
        } catch (e) {
            // Not valid JSON
        }
    }

    // Check for HTML
    if (content.includes('<html') || content.includes('<!DOCTYPE html')) {
        return 'html';
    }

    // Check for Markdown
    if (content.includes('# ') || content.includes('## ') || content.includes('```') ||
        content.includes('*') && content.includes('**')) {
        return 'markdown';
    }

    // Default to plain text
    return 'text';
}

/**
 * Truncates text with context awareness.
 * This function is used to truncate text while preserving context.
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length of the truncated text
 * @param {string} importance - The importance of the text ('high', 'medium', or 'low')
 * @returns {string} - The truncated text
 */
export function contextAwareTruncate(text, maxLength, importance = 'medium') {
    if (!text || text.length <= maxLength) return text;

    // Adjust max length based on importance
    let adjustedMaxLength = maxLength;
    if (importance === 'high') {
        adjustedMaxLength = Math.floor(maxLength * 1.2);
    } else if (importance === 'low') {
        adjustedMaxLength = Math.floor(maxLength * 0.8);
    }

    // Try to truncate at paragraph boundaries
    let truncated = '';
    const paragraphs = text.split('\n\n');
    let i = 0;

    // Add paragraphs until we reach the maxLength
    while (i < paragraphs.length && truncated.length + paragraphs[i].length + 2 <= adjustedMaxLength) {
        truncated += paragraphs[i] + '\n\n';
        i++;
    }

    // If we couldn't fit enough content, try to truncate at sentence boundaries
    if (truncated.length < adjustedMaxLength * 0.5) {
        truncated = '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        i = 0;

        while (i < sentences.length && truncated.length + sentences[i].length + 1 <= adjustedMaxLength) {
            truncated += sentences[i] + ' ';
            i++;
        }
    }

    // If we still couldn't fit enough content, use semantic truncation
    if (truncated.length < adjustedMaxLength * 0.3) {
        // For high importance, include beginning and end
        if (importance === 'high') {
            const beginLength = Math.floor(adjustedMaxLength * 0.7);
            const endLength = Math.floor(adjustedMaxLength * 0.3);
            return text.substring(0, beginLength) +
                   "\n\n[...content omitted for brevity...]\n\n" +
                   text.substring(text.length - endLength);
        } else {
            // For medium/low importance, just include beginning
            return text.substring(0, adjustedMaxLength) + "...";
        }
    }

    return truncated.trim() + (truncated.length < text.length ? '...' : '');
}

/**
 * Normalizes a Bimba coordinate by replacing dots with dashes.
 *
 * @param {string} coordinate - The Bimba coordinate to normalize
 * @returns {string} - The normalized coordinate
 */
export function normalizeBimbaCoordinate(coordinate) {
    if (!coordinate) return '';
    return coordinate.replace(/\./g, '-');
}

/**
 * Gets the parent coordinate of a Bimba coordinate.
 *
 * @param {string} coordinate - The Bimba coordinate
 * @returns {string|null} - The parent coordinate or null if it's a root coordinate
 */
export function getParentCoordinate(coordinate) {
    if (!coordinate) return null;

    // Normalize the coordinate
    const normalizedCoord = normalizeBimbaCoordinate(coordinate);

    // Split the coordinate into parts
    const parts = normalizedCoord.split('-');

    // If it's a root coordinate, return null
    if (parts.length <= 1) return null;

    // Return the parent coordinate
    return parts.slice(0, -1).join('-');
}

/**
 * Checks if a coordinate is a child of another coordinate.
 *
 * @param {string} childCoord - The potential child coordinate
 * @param {string} parentCoord - The potential parent coordinate
 * @returns {boolean} - True if childCoord is a child of parentCoord
 */
export function isChildCoordinate(childCoord, parentCoord) {
    if (!childCoord || !parentCoord) return false;

    // Normalize the coordinates
    const normalizedChild = normalizeBimbaCoordinate(childCoord);
    const normalizedParent = normalizeBimbaCoordinate(parentCoord);

    // Check if the child starts with the parent and has more parts
    return normalizedChild.startsWith(normalizedParent + '-');
}

/**
 * Checks if a coordinate is a sibling of another coordinate.
 *
 * @param {string} coord1 - The first coordinate
 * @param {string} coord2 - The second coordinate
 * @returns {boolean} - True if coord1 and coord2 are siblings
 */
export function isSiblingCoordinate(coord1, coord2) {
    if (!coord1 || !coord2) return false;

    // Get the parent coordinates
    const parent1 = getParentCoordinate(coord1);
    const parent2 = getParentCoordinate(coord2);

    // If either has no parent, they can't be siblings
    if (!parent1 || !parent2) return false;

    // Check if they have the same parent
    return parent1 === parent2;
}

/**
 * Gets the coordinate level (depth) in the Bimba hierarchy.
 *
 * @param {string} coordinate - The Bimba coordinate
 * @returns {number} - The coordinate level (0 for root, 1 for first level, etc.)
 */
export function getCoordinateLevel(coordinate) {
    if (!coordinate) return 0;

    // Normalize the coordinate
    const normalizedCoord = normalizeBimbaCoordinate(coordinate);

    // Split the coordinate into parts
    const parts = normalizedCoord.split('-');

    // Return the level (number of parts - 1)
    return parts.length - 1;
}
