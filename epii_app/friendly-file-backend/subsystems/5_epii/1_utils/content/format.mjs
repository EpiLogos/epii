/**
 * Content formatting utilities for the Epii Analysis Pipeline.
 * These functions provide a consistent interface for generating markdown content
 * from analysis data, with proper formatting and error handling.
 */

// Import required functions from other modules
import { getNodeName, getParentCoordinate, isChildCoordinate } from '../graphData.utils.mjs';

/**
 * Generates a section header in markdown format.
 *
 * @param {string} title - The title of the section
 * @param {number} level - The heading level (1-6)
 * @returns {string} - The formatted section header
 */
export function generateSectionHeader(title, level = 2) {
    const headerMarker = '#'.repeat(Math.min(Math.max(level, 1), 6));
    return `${headerMarker} ${title}\n\n`;
}

/**
 * Generates a section for mappings in markdown format.
 *
 * @param {Array} mappings - The mappings to include in the section
 * @returns {string} - The formatted mappings section
 */
export function generateMappingsSection(mappings) {
    let content = generateSectionHeader('Extracted Mappings');

    if (mappings && mappings.length > 0) {
        mappings.forEach((mapping, index) => {
            content += generateSectionHeader(`Mapping ${index + 1}: ${mapping.mappingType}`, 3);
            content += `- Value: ${mapping.mappingValue}\n`;
            if (mapping.reasoning) {
                content += `- Reasoning: ${mapping.reasoning}\n`;
            }
            content += `- QL Phase: ${mapping.qlPhase || 'Not specified'}\n\n`;
        });
    } else {
        content += "No mappings extracted.\n\n";
    }

    return content;
}

/**
 * Generates a section for variations in markdown format.
 *
 * @param {Array} variations - The variations to include in the section
 * @returns {string} - The formatted variations section
 */
export function generateVariationsSection(variations) {
    let content = generateSectionHeader('Identified Variations');

    if (variations && variations.length > 0) {
        variations.forEach((variation, index) => {
            content += generateSectionHeader(`Variation ${index + 1}: ${variation.variationType}`, 3);
            content += `- Status: ${variation.status}\n`;
            if (variation.variationText) {
                content += `- Text: ${variation.variationText}\n\n`;
            }
            if (variation.proposedResolution) {
                content += `- Proposed Resolution: ${variation.proposedResolution}\n\n`;
            }
        });
    } else {
        content += "No variations identified.\n\n";
    }

    return content;
}

/**
 * Generates a section for natural elaborations in markdown format.
 *
 * @param {Array} elaborations - The elaborations to include in the section
 * @returns {string} - The formatted elaborations section
 */
export function generateNaturalElaborationsSection(elaborations) {
    let content = generateSectionHeader('Natural Elaborations');

    if (elaborations && elaborations.length > 0) {
        elaborations.forEach((elaboration, index) => {
            content += generateSectionHeader(`Elaboration ${index + 1}: ${elaboration.elaborationType}`, 3);
            content += `- Target Coordinate: ${elaboration.targetCoordinate || 'Not specified'}\n`;
            if (elaboration.elaborationText) {
                content += `- Text: ${elaboration.elaborationText}\n\n`;
            }
            if (elaboration.confidenceScore) {
                content += `- Confidence: ${elaboration.confidenceScore.toFixed(2)}\n\n`;
            }
        });
    } else {
        content += "No natural elaborations identified.\n\n";
    }

    return content;
}

/**
 * Generates a section for MEF lens insights in markdown format.
 *
 * @param {object} mefLensInsights - The MEF lens insights to include in the section
 * @returns {string} - The formatted MEF lens insights section
 */
export function generateMEFLensInsightsSection(mefLensInsights) {
    let content = generateSectionHeader('MEF Lens Insights');

    if (mefLensInsights && Object.keys(mefLensInsights).length > 0) {
        Object.entries(mefLensInsights).forEach(([lens, insight]) => {
            content += generateSectionHeader(lens, 3);
            content += `${insight}\n\n`;
        });
    } else {
        content += "No MEF lens insights identified.\n\n";
    }

    return content;
}

/**
 * Generates a section for subnode mappings in markdown format.
 *
 * @param {object} subnodeMappings - The subnode mappings to include in the section
 * @returns {string} - The formatted subnode mappings section
 */
export function generateSubnodeMappingsSection(subnodeMappings) {
    let content = generateSectionHeader('Subnode Mappings');

    if (subnodeMappings && Object.keys(subnodeMappings).length > 0) {
        content += `The following subnodes were identified in the document:\n\n`;

        for (const [subnodeCoord, subnodeData] of Object.entries(subnodeMappings)) {
            content += generateSectionHeader(`${subnodeCoord} (${subnodeData.nodeDetails.name})`, 3);
            content += `${subnodeData.summary.substring(0, 200)}${subnodeData.summary.length > 200 ? '...' : ''}\n\n`;
            content += `Mappings: ${subnodeData.mappings.length}\n`;
            content += `Relevant Chunks: ${subnodeData.chunks.length}\n\n`;
        }
    } else {
        content += "No subnode mappings identified.\n\n";
    }

    return content;
}

/**
 * Generates a section for structural context in markdown format.
 *
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {string} - The formatted structural context section
 */
export function generateStructuralContextSection(targetCoordinate, graphData) {
    let content = generateSectionHeader('Structural Context');

    if (graphData && graphData.nodes) {
        const targetNode = graphData.nodes.find(node => node.bimbaCoordinate === targetCoordinate);

        if (targetNode) {
            content += `- Target Coordinate: ${targetCoordinate} (${getNodeName(targetNode)})\n`;

            // Find parent node
            const parentCoord = getParentCoordinate(targetCoordinate);
            if (parentCoord) {
                const parentNode = graphData.nodes.find(node => node.bimbaCoordinate === parentCoord);
                if (parentNode) {
                    content += `- Parent: ${parentCoord} (${getNodeName(parentNode)})\n`;
                }
            }

            // Find child nodes
            const childNodes = graphData.nodes.filter(node =>
                node.bimbaCoordinate &&
                isChildCoordinate(node.bimbaCoordinate, targetCoordinate)
            );

            if (childNodes && childNodes.length > 0) {
                content += `- Children: ${childNodes.map(node =>
                    `${node.bimbaCoordinate} (${getNodeName(node)})`
                ).join(', ')}\n`;
            }

            content += `\n`;
        }
    }

    return content;
}

/**
 * Generates content from analysis data with structural context.
 *
 * @param {object} analysisData - The analysis data
 * @param {object} sourceMetadata - The source metadata
 * @param {object} graphData - The graph data from frontend context
 * @returns {string} - The generated content
 */
export function generateContentFromAnalysis(analysisData, sourceMetadata, graphData) {
    // Generate markdown content from analysis data
    let content = `# Analysis of ${sourceMetadata.sourceFileName}\n\n`;

    // Add Bimba map summary if available
    if (analysisData.bimbaMapSummary) {
        content += generateSectionHeader('Bimba Map Summary');
        content += `${analysisData.bimbaMapSummary}\n\n`;
    }

    // Add overall summary
    content += generateSectionHeader('Overall Summary');
    content += `${analysisData.overallSummary}\n\n`;

    // Add structural context if graphData is available
    content += generateStructuralContextSection(sourceMetadata.targetCoordinate, graphData);

    // Add mappings section
    content += generateMappingsSection(analysisData.extractedMappings);

    // Add variations section
    content += generateVariationsSection(analysisData.identifiedVariations);

    // Add natural elaborations section
    content += generateNaturalElaborationsSection(analysisData.naturalElaborations);

    // Add MEF lens insights section
    content += generateMEFLensInsightsSection(analysisData.mefLensInsights);

    // Add subnode mappings section if available
    content += generateSubnodeMappingsSection(analysisData.processedSubnodeMappings);

    return content;
}

/**
 * Generates content for a specific subnode.
 *
 * @param {object} subnodeData - The subnode data
 * @param {string} subnodeCoordinate - The subnode coordinate
 * @param {object} sourceMetadata - The source metadata
 * @returns {string} - The generated content
 */
export function generateSubnodeContent(subnodeData, subnodeCoordinate, sourceMetadata) {
    let content = `# Content for ${subnodeCoordinate} from ${sourceMetadata.sourceFileName}\n\n`;

    // Add summary
    content += generateSectionHeader('Summary');
    content += `${subnodeData.summary}\n\n`;

    // Add mappings section
    content += generateMappingsSection(subnodeData.mappings);

    // Add natural elaborations section if available
    if (subnodeData.naturalElaborations && subnodeData.naturalElaborations.length > 0) {
        content += generateNaturalElaborationsSection(subnodeData.naturalElaborations);
    }

    // Add MEF lens insights section if available
    if (subnodeData.mefLensInsights && Object.keys(subnodeData.mefLensInsights).length > 0) {
        content += generateMEFLensInsightsSection(subnodeData.mefLensInsights);
    }

    // Add relevant chunks
    content += generateSectionHeader('Relevant Content Chunks');
    if (subnodeData.chunks && subnodeData.chunks.length > 0) {
        subnodeData.chunks.forEach((chunk, index) => {
            content += generateSectionHeader(`Chunk ${index + 1}`, 3);
            content += `${chunk.text.substring(0, 500)}${chunk.text.length > 500 ? '...' : ''}\n\n`;
        });
    } else {
        content += "No relevant chunks found.\n\n";
    }

    // Add relationship to parent
    content += generateSectionHeader('Relationship to Parent');
    content += `This content is related to the parent coordinate ${sourceMetadata.targetCoordinate} and represents a specific aspect or subcomponent of it.\n\n`;

    return content;
}
