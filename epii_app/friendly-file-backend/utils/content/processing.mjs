/**
 * Data processing utilities for the Epii Analysis Pipeline.
 * These functions provide a consistent interface for processing and transforming
 * analysis data, with proper formatting and error handling.
 */

/**
 * Consolidates mappings across chunks to eliminate duplicates and enhance insights.
 * This function is used by analyzeChunkGroup to consolidate mappings from multiple chunks.
 *
 * @param {Array<object>} chunkResults - The analysis results for each chunk
 * @returns {Array<object>} - The consolidated results
 */
export function consolidateMappingsAcrossChunks(chunkResults) {
    if (!chunkResults || !Array.isArray(chunkResults) || chunkResults.length === 0) {
        return [];
    }

    // Create a deep copy of the results to avoid modifying the original
    const consolidatedResults = JSON.parse(JSON.stringify(chunkResults));

    // Step 1: Collect all mappings across chunks
    const allMappings = [];
    consolidatedResults.forEach(result => {
        if (result.extractedMappings && Array.isArray(result.extractedMappings)) {
            allMappings.push(...result.extractedMappings);
        }
    });

    // Step 2: Consolidate mappings by type and value
    const mappingsByKey = {};
    allMappings.forEach(mapping => {
        const key = `${mapping.mappingType}:${mapping.mappingValue}`;

        if (!mappingsByKey[key]) {
            mappingsByKey[key] = {
                ...mapping,
                occurrences: 1,
                confidenceScores: [mapping.confidenceScore || 0.5],
                reasonings: mapping.reasoning ? [mapping.reasoning] : [],
                chunkIndices: [mapping.chunkIndex]
            };
        } else {
            // Update existing mapping
            mappingsByKey[key].occurrences += 1;

            // Add confidence score if available
            if (mapping.confidenceScore) {
                mappingsByKey[key].confidenceScores.push(mapping.confidenceScore);
            }

            // Add reasoning if available and not duplicate
            if (mapping.reasoning && !mappingsByKey[key].reasonings.includes(mapping.reasoning)) {
                mappingsByKey[key].reasonings.push(mapping.reasoning);
            }

            // Add chunk index if not already included
            if (!mappingsByKey[key].chunkIndices.includes(mapping.chunkIndex)) {
                mappingsByKey[key].chunkIndices.push(mapping.chunkIndex);
            }
        }
    });

    // Step 3: Calculate average confidence score and combine reasonings
    Object.values(mappingsByKey).forEach(mapping => {
        // Calculate average confidence score
        if (mapping.confidenceScores.length > 0) {
            mapping.confidenceScore = mapping.confidenceScores.reduce((sum, score) => sum + score, 0) / mapping.confidenceScores.length;
            delete mapping.confidenceScores;
        }

        // Combine reasonings
        if (mapping.reasonings.length > 0) {
            mapping.reasoning = mapping.reasonings.join(' | ');
            delete mapping.reasonings;
        }
    });

    // Step 4: Distribute consolidated mappings back to their respective chunks
    consolidatedResults.forEach((result, index) => {
        // Get mappings that belong to this chunk
        const chunkMappings = Object.values(mappingsByKey).filter(mapping =>
            mapping.chunkIndices.includes(index)
        );

        // Update the chunk's mappings
        result.extractedMappings = chunkMappings;

        // Generate tags based on the consolidated mappings
        result.tags = generateTags({
            extractedMappings: chunkMappings,
            identifiedVariations: result.identifiedVariations || []
        });
    });

    return consolidatedResults;
}

/**
 * Generates tags from mappings and variations.
 * This is a helper function for consolidateMappingsAcrossChunks.
 *
 * @param {object} data - The data containing mappings and variations
 * @returns {string[]} - The generated tags
 */
function generateTags(data) {
    const tags = [];

    // Extract tags from mappings
    if (data.extractedMappings && Array.isArray(data.extractedMappings)) {
        data.extractedMappings.forEach(mapping => {
            if (mapping.mappingValue && typeof mapping.mappingValue === 'string') {
                // Add the mapping value as a tag
                tags.push(mapping.mappingValue);

                // For concept mappings, also add individual words as tags
                if (mapping.mappingType === 'Concept' || mapping.mappingType === 'Entity') {
                    const words = mapping.mappingValue.split(/\s+/);
                    words.forEach(word => {
                        if (word.length > 3 && !tags.includes(word)) {
                            tags.push(word);
                        }
                    });
                }
            }
        });
    }

    // Extract tags from variations
    if (data.identifiedVariations && Array.isArray(data.identifiedVariations)) {
        data.identifiedVariations.forEach(variation => {
            if (variation.variationType && typeof variation.variationType === 'string') {
                tags.push(variation.variationType);
            }
        });
    }

    // Remove duplicates and limit to 10 tags
    return [...new Set(tags)].slice(0, 10);
}

/**
 * Enhanced consolidation of mappings with sophisticated deduplication and merging.
 *
 * @param {object[]} mappings - The mappings to consolidate
 * @param {Function} idGenerator - Function to generate unique IDs
 * @returns {Promise<object[]>} - The consolidated mappings
 */
export function consolidateMappingsEnhanced(mappings, idGenerator) {
    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
        return [];
    }

    const consolidatedMappings = {};

    // Group mappings by type and value
    mappings.forEach(mapping => {
        const key = `${mapping.mappingType}:${mapping.mappingValue}`;

        if (!consolidatedMappings[key]) {
            consolidatedMappings[key] = {
                ...mapping,
                mappingId: `map-${idGenerator ? idGenerator() : Math.random().toString(36).substring(2, 9)}`,
                occurrences: 1,
                confidenceScores: [mapping.confidenceScore || 0.5],
                reasonings: mapping.reasoning ? [mapping.reasoning] : [],
                relevantContentSnippets: []
            };
        } else {
            // Update existing mapping
            consolidatedMappings[key].occurrences += 1;

            // Add confidence score if available
            if (mapping.confidenceScore) {
                consolidatedMappings[key].confidenceScores.push(mapping.confidenceScore);
            }

            // Add reasoning if available and not duplicate
            if (mapping.reasoning &&
                !consolidatedMappings[key].reasonings.includes(mapping.reasoning)) {
                consolidatedMappings[key].reasonings.push(mapping.reasoning);
            }
        }

        // Add content snippet if available
        if (mapping.contentReference) {
            consolidatedMappings[key].relevantContentSnippets.push({
                text: mapping.contentReference,
                chunkIndex: mapping.chunkIndex || 0
            });
        }
    });

    // Calculate average confidence score and combine reasonings
    Object.values(consolidatedMappings).forEach(mapping => {
        // Calculate average confidence score
        if (mapping.confidenceScores.length > 0) {
            mapping.confidenceScore = mapping.confidenceScores.reduce((sum, score) => sum + score, 0) / mapping.confidenceScores.length;
            delete mapping.confidenceScores;
        }

        // Combine reasonings
        if (mapping.reasonings.length > 0) {
            mapping.reasoning = mapping.reasonings.join(' | ');
            delete mapping.reasonings;
        }
    });

    return Object.values(consolidatedMappings);
}

/**
 * Reranks mappings to prioritize the most relevant ones.
 *
 * @param {object[]} consolidatedMappings - The consolidated mappings
 * @param {string} targetCoordinate - The target coordinate
 * @returns {Promise<object[]>} - The reranked mappings
 */
export function rerankMappings(consolidatedMappings, targetCoordinate) {
    if (!consolidatedMappings || !Array.isArray(consolidatedMappings) || consolidatedMappings.length === 0) {
        return [];
    }

    // Clone the mappings to avoid modifying the original
    const rerankedMappings = [...consolidatedMappings];

    // Calculate relevance score for each mapping
    rerankedMappings.forEach(mapping => {
        let relevanceScore = 0;

        // Base score from confidence
        relevanceScore += mapping.confidenceScore || 0.5;

        // Bonus for multiple occurrences
        relevanceScore += Math.min(mapping.occurrences / 10, 0.3);

        // Bonus for mappings directly related to target coordinate
        if (mapping.mappingType === 'Bimba_Node' &&
            (mapping.mappingValue === targetCoordinate ||
            mapping.mappingValue.startsWith(targetCoordinate + '-'))) {
            relevanceScore += 0.2;
        }

        // Bonus for QL_Stage mappings
        if (mapping.mappingType === 'QL_Stage') {
            relevanceScore += 0.1;
        }

        // Bonus for MEF_Lens mappings
        if (mapping.mappingType === 'MEF_Lens') {
            relevanceScore += 0.15;
        }

        // Store the relevance score
        mapping.relevanceScore = relevanceScore;
    });

    // Sort by relevance score (descending)
    return rerankedMappings.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
