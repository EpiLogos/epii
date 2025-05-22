/**
 * Utility functions for generating content in the Epii Analysis Pipeline.
 * This file is being deprecated in favor of the modular structure in the content/ directory.
 * Please use the following imports instead:
 * - import { ... } from './content/format.mjs';
 * - import { ... } from './content/context.mjs';
 * - import { ... } from './content/analysis.mjs';
 * - import { ... } from './content/processing.mjs';
 * - import { ... } from './content/synthesis.mjs';
 * - import { ... } from './content/utils.mjs';
 */

// Re-export from the new modular structure
export * from './content/format.mjs';
export * from './content/context.mjs';
export * from './content/analysis.mjs';
export * from './content/processing.mjs';
export * from './content/synthesis.mjs';
export * from './content/utils.mjs';

// Import required functions from graphData.utils.mjs for backward compatibility
import { getNodeName, getParentCoordinate, isChildCoordinate } from './graphData.utils.mjs';

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

/**
 * Analyzes a chunk of text using LLM.
 *
 * @param {string} chunk - The chunk text to analyze
 * @param {object} sourceMetadata - The source metadata
 * @param {object} bimbaContext - The Bimba context
 * @param {object} userContext - The user context
 * @param {string[]} assignedCoords - The assigned coordinates
 * @param {object} metalogikon - The Metalogikon template
 * @param {object} options - Additional options
 * @returns {Promise<object>} - The analysis results
 * @throws {Error} - If analysis fails
 */
export async function analyzeChunk(
    chunk,
    sourceMetadata,
    bimbaContext,
    userContext,
    assignedCoords,
    metalogikon,
    options = {}
) {
    // Validate inputs
    if (!chunk || typeof chunk !== 'string') {
        throw new Error("chunk must be a non-empty string");
    }

    if (!assignedCoords || !Array.isArray(assignedCoords) || assignedCoords.length === 0) {
        throw new Error("assignedCoords must be a non-empty array");
    }

    // Extract options
    const { llmService, graphData = { nodes: [], edges: [] }, contextWindow } = options;

    if (!llmService) {
        throw new Error("LLM service is required for chunk analysis");
    }

    try {
        // Use existing context window or generate a new one
        const chunkContextWindow = contextWindow || await generateContextWindow(
            chunk,
            sourceMetadata.documentContent || "",
            bimbaContext || "",
            graphData,
            userContext || {}
        );

        // Prepare Metalogikon prompt
        let mefPrompt = "No Metalogikon framework available.";
        if (metalogikon && Object.keys(metalogikon).length > 0) {
            mefPrompt = "METALOGIKON FRAMEWORK LENSES:\n";
            for (const [coord, data] of Object.entries(metalogikon)) {
                if (typeof data === 'object' && data.name) {
                    mefPrompt += `- ${coord}: ${data.name} - ${data.description || 'No description'}\n`;
                }
            }
        }

        // Prepare system prompt
        const systemPrompt = `You are Epii, an advanced AI system for analyzing text in relation to the Bimba coordinate system.
Your task is to analyze the provided text chunk and extract mappings, variations, and natural elaborations.

CONTEXT INFORMATION:
${chunkContextWindow.contextText || JSON.stringify(chunkContextWindow, null, 2)}

METALOGIKON FRAMEWORK:
${mefPrompt}

INSTRUCTIONS:
1. Analyze the text chunk in relation to the assigned coordinates: ${assignedCoords.join(', ')}
2. Extract mappings between the text and the Bimba coordinate system
3. Identify variations or contradictions
4. Generate natural elaborations that extend beyond the established definitions
5. Apply the Metalogikon Framework lenses to gain deeper insights
6. Format your response as a structured JSON object`;

        // Prepare user prompt
        const userPrompt = `TEXT CHUNK TO ANALYZE:
"""
${chunk}
"""

Please analyze this text chunk and provide your analysis in the following JSON format:
{
  "extractedMappings": [
    {
      "mappingType": "Bimba_Node | QL_Stage | MEF_Lens | Concept | Entity | Relationship | Nested_Element | Implicit_Dimension",
      "mappingValue": "string",
      "confidenceScore": 0.0-1.0,
      "status": "identified | potential | speculative",
      "reasoning": "string",
      "qlPhase": "+ | -"
    }
  ],
  "identifiedVariations": [
    {
      "variationType": "string",
      "variationText": "string",
      "proposedResolution": "string",
      "status": "confirmed | needs_investigation | needs_clarification",
      "confidenceScore": 0.0-1.0
    }
  ],
  "naturalElaborations": [
    {
      "elaborationType": "string",
      "elaborationText": "string",
      "targetCoordinate": "string",
      "confidenceScore": 0.0-1.0
    }
  ],
  "mefLensInsights": {
    "lensCoordinate": "insightText"
  },
  "subnodeMappings": {
    "subnodeCoordinate": {
      "mappings": [],
      "summary": "string"
    }
  }
}`;

        // Call LLM
        const response = await llmService.generateContent(-2, systemPrompt, userPrompt, {
            temperature: 0.2,
            maxOutputTokens: 4096
        });

        // Parse response
        let analysisData;
        try {
            // Log the raw response for debugging
            console.log("Raw LLM response (first 200 chars):", response.substring(0, 200) + "...");

            // Extract JSON from response using more robust patterns
            let jsonStr = "";

            // Try to extract JSON from code blocks first
            const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                                  response.match(/```\n([\s\S]*?)\n```/);

            if (jsonBlockMatch) {
                jsonStr = jsonBlockMatch[1];
            } else {
                // Try to find JSON object in the response
                const startBrace = response.indexOf('{');
                const endBrace = response.lastIndexOf('}');

                if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
                    jsonStr = response.substring(startBrace, endBrace + 1);
                } else {
                    // If no JSON found, use the whole response
                    jsonStr = response;
                }
            }

            // Clean up the JSON string
            jsonStr = jsonStr.trim();

            // Try to fix common JSON errors
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
            jsonStr = jsonStr.replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2'); // Fix unescaped backslashes

            // Log the extracted JSON string for debugging
            console.log("Extracted JSON string (first 200 chars):", jsonStr.substring(0, 200) + "...");

            // Parse the JSON
            try {
                analysisData = JSON.parse(jsonStr);
            } catch (initialParseError) {
                console.warn("Initial JSON parsing failed, attempting to fix JSON:", initialParseError.message);

                // Try to create a minimal valid structure
                analysisData = {
                    extractedMappings: [],
                    identifiedVariations: [],
                    naturalElaborations: [],
                    mefLensInsights: {},
                    subnodeMappings: {}
                };

                // Try to extract parts of the response
                try {
                    // Look for extractedMappings array
                    const mappingsMatch = jsonStr.match(/"extractedMappings"\s*:\s*\[([\s\S]*?)\]/);
                    if (mappingsMatch) {
                        try {
                            const mappingsJson = `[${mappingsMatch[1]}]`;
                            const mappings = JSON.parse(mappingsJson);
                            analysisData.extractedMappings = mappings;
                        } catch (e) {
                            console.warn("Failed to parse extractedMappings:", e.message);
                        }
                    }

                    // Look for identifiedVariations array
                    const variationsMatch = jsonStr.match(/"identifiedVariations"\s*:\s*\[([\s\S]*?)\]/);
                    if (variationsMatch) {
                        try {
                            const variationsJson = `[${variationsMatch[1]}]`;
                            const variations = JSON.parse(variationsJson);
                            analysisData.identifiedVariations = variations;
                        } catch (e) {
                            console.warn("Failed to parse identifiedVariations:", e.message);
                        }
                    }
                } catch (partialParseError) {
                    console.warn("Failed to extract partial JSON:", partialParseError.message);
                }
            }
        } catch (parseError) {
            console.error("Error parsing LLM response:", parseError);
            throw new Error(`Failed to parse LLM response: ${parseError.message}`);
        }

        return {
            ...analysisData,
            assignedCoordinates: assignedCoords
        };
    } catch (error) {
        console.error("Error in analyzeChunk:", error);
        throw new Error(`Failed to analyze chunk: ${error.message}`);
    }
}

/**
 * Generates Bimba-enhanced context for a document.
 *
 * ENHANCED: This function now:
 * 1. Includes all nodes with coordinates in a structured format
 * 2. Implements context-aware truncation instead of fixed-length limits
 * 3. Organizes nodes hierarchically for better context
 * 4. Provides a more comprehensive view of the Bimba structure
 * 5. Preserves essential information by using intelligent content prioritization
 * 6. Handles both "-" and "." separators consistently
 *
 * @param {string} documentContent - The content of the document
 * @param {string} sourceFileName - The name of the document file
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} bimbaContext - The Bimba context for the target coordinate
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {object} projectContext - Project-level context
 * @param {object} llmService - The LLM service
 * @returns {Promise<string>} - The enhanced Bimba context
 */
export async function generateBimbaEnhancedContext(
    documentContent,
    sourceFileName,
    targetCoordinate,
    bimbaContext,
    fullBimbaMap,
    projectContext,
    llmService
) {
    try {
        // Helper function for context-aware truncation
        function contextAwareTruncate(text, maxLength, importance = 'medium') {
            if (!text || text.length <= maxLength) return text;

            // Adjust maxLength based on importance
            const adjustedMaxLength = importance === 'high' ? maxLength * 1.5 :
                                     importance === 'low' ? maxLength * 0.7 :
                                     maxLength;

            // Try to truncate at paragraph boundaries
            const paragraphs = text.split('\n\n');
            let truncated = '';
            let i = 0;

            // For high importance content, include at least the first paragraph regardless of length
            if (importance === 'high' && paragraphs.length > 0) {
                truncated += paragraphs[0] + '\n\n';
                i = 1;
            }

            while (i < paragraphs.length && truncated.length + paragraphs[i].length + 4 <= adjustedMaxLength) {
                truncated += paragraphs[i] + '\n\n';
                i++;
            }

            // If we couldn't fit enough content, truncate at sentence boundary
            if (truncated.length < adjustedMaxLength * 0.5) {
                const sentences = text.split(/(?<=[.!?])\s+/);
                i = truncated.length > 0 ? 1 : 0; // Skip first sentence if we already have content

                while (i < sentences.length && truncated.length + sentences[i].length + 2 <= adjustedMaxLength) {
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

        // Normalize the target coordinate (replace dots with dashes for consistency)
        const normalizedTargetCoordinate = targetCoordinate.replace(/\./g, '-');

        // Generate document summary with context-aware truncation
        // Document content is high importance as it's the primary content being analyzed
        const documentSummary = contextAwareTruncate(documentContent, 1500, 'high');

        // Generate a basic context
        let enhancedContext = `# Bimba-Enhanced Context for ${sourceFileName}\n\n`;
        enhancedContext += `## Target Coordinate\n${targetCoordinate}\n\n`;
        enhancedContext += `## Document Summary\n${documentSummary}\n\n`;

        // Add information from fullBimbaMap
        if (fullBimbaMap && fullBimbaMap.nodes) {
            // Find the target node - handle both "-" and "." separators
            const targetNode = fullBimbaMap.nodes.find(node => {
                const normalizedNodeCoord = (node.coordinate || '').replace(/\./g, '-');
                return normalizedNodeCoord === normalizedTargetCoordinate;
            });

            if (targetNode) {
                enhancedContext += `## Target Node Details\n`;
                enhancedContext += `- Name: ${targetNode.name || 'Unnamed'}\n`;
                // Target node description is high importance
                enhancedContext += `- Description: ${targetNode.description || 'No description'}\n`;
                enhancedContext += `- Type: ${targetNode.type || 'No type'}\n\n`;

                // Get parent coordinate - handle both separators
                const getParentCoord = (coord) => {
                    if (!coord || coord === '#') return null;

                    // Find the last delimiter (- or .)
                    const lastDashIndex = coord.lastIndexOf('-');
                    const lastDotIndex = coord.lastIndexOf('.');

                    // Use the rightmost delimiter
                    const lastDelimiterIndex = Math.max(lastDashIndex, lastDotIndex);

                    if (lastDelimiterIndex > 0) {
                        return coord.substring(0, lastDelimiterIndex);
                    }

                    return '#'; // Default to root if no delimiter found
                };

                const parentCoord = getParentCoord(targetNode.coordinate);

                // Get parent node
                if (parentCoord) {
                    const parentNode = fullBimbaMap.nodes.find(node => {
                        const normalizedNodeCoord = (node.coordinate || '').replace(/\./g, '-');
                        const normalizedParentCoord = parentCoord.replace(/\./g, '-');
                        return normalizedNodeCoord === normalizedParentCoord;
                    });

                    if (parentNode) {
                        enhancedContext += `## Parent Node\n`;
                        enhancedContext += `- Coordinate: ${parentCoord}\n`;
                        enhancedContext += `- Name: ${parentNode.name || 'Unnamed'}\n`;
                        // Parent node description is medium importance
                        enhancedContext += `- Description: ${parentNode.description ? contextAwareTruncate(parentNode.description, 200, 'medium') : 'No description'}\n\n`;
                    }
                }

                // Get child nodes with context-aware truncation
                // Handle both "-" and "." separators
                const childNodes = fullBimbaMap.nodes.filter(node => {
                    if (!node.coordinate) return false;

                    const normalizedNodeCoord = node.coordinate.replace(/\./g, '-');
                    const isDirectChild = (
                        normalizedNodeCoord.startsWith(normalizedTargetCoordinate + '-') &&
                        normalizedNodeCoord.split('-').length === normalizedTargetCoordinate.split('-').length + 1
                    );

                    return isDirectChild;
                });

                if (childNodes.length > 0) {
                    enhancedContext += `## Child Nodes (${childNodes.length})\n`;

                    // Display all child nodes if there are 10 or fewer, otherwise show first 7 and indicate there are more
                    const displayNodes = childNodes.length <= 10 ? childNodes : childNodes.slice(0, 7);

                    for (const child of displayNodes) {
                        // Child node descriptions are medium-low importance
                        const description = child.description
                            ? contextAwareTruncate(child.description, 150, 'medium')
                            : 'No description';

                        enhancedContext += `- ${child.name || 'Unnamed'} (${child.coordinate}): ${description}\n`;
                    }

                    if (childNodes.length > 10) {
                        enhancedContext += `- ... and ${childNodes.length - 7} more child nodes\n`;
                    }

                    enhancedContext += `\n`;
                }

                // Get relationships with smart organization
                const relationships = fullBimbaMap.relationships.filter(rel =>
                    rel.from === targetNode.id || rel.to === targetNode.id
                );

                if (relationships.length > 0) {
                    // Group relationships by type for better organization
                    const relationshipsByType = {};

                    for (const rel of relationships) {
                        const relType = rel.type || 'Unknown';
                        if (!relationshipsByType[relType]) {
                            relationshipsByType[relType] = [];
                        }

                        const isOutgoing = rel.from === targetNode.id;
                        const otherNodeId = isOutgoing ? rel.to : rel.from;
                        const otherNode = fullBimbaMap.nodes.find(node => node.id === otherNodeId);

                        if (otherNode) {
                            relationshipsByType[relType].push({
                                direction: isOutgoing ? 'To' : 'From',
                                node: otherNode
                            });
                        }
                    }

                    enhancedContext += `## Relationships (${relationships.length})\n`;

                    // Display relationships grouped by type
                    for (const [relType, rels] of Object.entries(relationshipsByType)) {
                        enhancedContext += `### ${relType} (${rels.length})\n`;

                        // Display all relationships if there are 5 or fewer, otherwise show first 3 and indicate there are more
                        const displayRels = rels.length <= 5 ? rels : rels.slice(0, 3);

                        for (const rel of displayRels) {
                            enhancedContext += `- ${rel.direction} ${rel.node.name || 'Unnamed'} (${rel.node.coordinate})\n`;
                        }

                        if (rels.length > 5) {
                            enhancedContext += `- ... and ${rels.length - 3} more ${relType} relationships\n`;
                        }
                    }

                    enhancedContext += `\n`;
                }
            }
        }

        // Add enhanced Bimba context if available
        if (bimbaContext && bimbaContext.length > 0) {
            enhancedContext += `## Bimba Context\n`;

            // Check if we have the enhanced bimbaContext structure with hierarchicalContext
            if (bimbaContext[0] && bimbaContext[0].hierarchicalContext) {
                const hierarchicalContext = bimbaContext[0].hierarchicalContext;

                // Add target node information
                enhancedContext += `### Target Node\n`;
                enhancedContext += `- Coordinate: ${hierarchicalContext.target.coordinate}\n`;
                enhancedContext += `- Name: ${hierarchicalContext.target.name}\n`;
                enhancedContext += `- Description: ${hierarchicalContext.target.description || 'No description'}\n\n`;

                // Add parent nodes
                if (hierarchicalContext.parents && hierarchicalContext.parents.length > 0) {
                    enhancedContext += `### Parent Nodes\n`;
                    for (const parent of hierarchicalContext.parents) {
                        enhancedContext += `- ${parent.name} (${parent.coordinate}): ${parent.description ? contextAwareTruncate(parent.description, 150, 'medium') : 'No description'}\n`;
                    }
                    enhancedContext += `\n`;
                }

                // Add child nodes
                if (hierarchicalContext.children && hierarchicalContext.children.length > 0) {
                    enhancedContext += `### Child Nodes\n`;
                    for (const child of hierarchicalContext.children) {
                        enhancedContext += `- ${child.name} (${child.coordinate}): ${child.description ? contextAwareTruncate(child.description, 100, 'low') : 'No description'}\n`;
                    }
                    enhancedContext += `\n`;
                }
            } else {
                // Fall back to the original format if hierarchicalContext is not available
                for (const record of bimbaContext) {
                    if (record.node) {
                        enhancedContext += `- ${record.node.name || 'Unnamed node'}\n`;

                        // Add connections if available with context-aware truncation
                        if (record.connections && record.connections.length > 0) {
                            enhancedContext += `  - Connections (${record.connections.length}):\n`;

                            // Display all connections if there are 5 or fewer, otherwise show first 3 and indicate there are more
                            const displayConnections = record.connections.length <= 5
                                ? record.connections
                                : record.connections.slice(0, 3);

                            for (const connection of displayConnections) {
                                enhancedContext += `    - ${connection.direction === 'outgoing' ? 'To' : 'From'} ${connection.node.name || 'Unnamed node'} (${connection.relationship})\n`;
                            }

                            if (record.connections.length > 5) {
                                enhancedContext += `    - ... and ${record.connections.length - 3} more connections\n`;
                            }
                        }
                    } else {
                        enhancedContext += `- ${record.name || record.title || 'Unnamed node'}\n`;
                    }
                }
            }
            enhancedContext += `\n`;
        }

        // Add project context if available with enhanced structure
        if (projectContext) {
            enhancedContext += `## Project Context\n`;
            enhancedContext += `- Project Name: ${projectContext.projectName || 'Unnamed Project'}\n`;
            // Project description is high importance
            enhancedContext += `- Project Description: ${projectContext.projectDescription ? contextAwareTruncate(projectContext.projectDescription, 500, 'high') : 'No description'}\n`;

            // Add root node information
            if (projectContext.rootNode) {
                enhancedContext += `- Root Node: ${projectContext.rootNode.name || 'Unnamed'} (${projectContext.rootNode.coordinate})\n`;
            }

            // Add subsystem nodes if available
            if (projectContext.subsystemNodes && projectContext.subsystemNodes.length > 0) {
                enhancedContext += `- Subsystem Nodes (${projectContext.subsystemNodes.length}):\n`;

                // Display all subsystems if there are 6 or fewer, otherwise show first 4 and indicate there are more
                const displaySubsystems = projectContext.subsystemNodes.length <= 6
                    ? projectContext.subsystemNodes
                    : projectContext.subsystemNodes.slice(0, 4);

                for (const node of displaySubsystems) {
                    // Subsystem descriptions are medium importance
                    const description = node.description
                        ? contextAwareTruncate(node.description, 120, 'medium')
                        : 'No description';

                    enhancedContext += `  - ${node.name || 'Unnamed'} (${node.coordinate}): ${description}\n`;
                }

                if (projectContext.subsystemNodes.length > 6) {
                    enhancedContext += `  - ... and ${projectContext.subsystemNodes.length - 4} more subsystems\n`;
                }
            }

            // Add coordinate structure summary if available
            if (projectContext.coordinateStructure) {
                enhancedContext += `- Coordinate Structure: ${Object.keys(projectContext.coordinateStructure).length} main branches\n`;
            }

            // Add total nodes count if available
            if (projectContext.allNodesWithCoordinates) {
                enhancedContext += `- Total Nodes with Coordinates: ${projectContext.allNodesWithCoordinates.length}\n`;
            }

            enhancedContext += `\n`;
        }

        // Add Bimba map summary if available
        if (fullBimbaMap && fullBimbaMap.summary) {
            enhancedContext += `## Bimba Map Summary\n`;
            enhancedContext += `- Total Nodes: ${fullBimbaMap.summary.totalNodes}\n`;
            enhancedContext += `- Total Relationships: ${fullBimbaMap.summary.totalRelationships}\n`;
            enhancedContext += `- Nodes with Coordinates: ${fullBimbaMap.summary.nodesWithCoordinates}\n`;
            enhancedContext += `- Nodes without Coordinates: ${fullBimbaMap.summary.nodesWithoutCoordinates}\n\n`;
        }

        return enhancedContext;
    } catch (error) {
        console.error("Error generating Bimba-enhanced context:", error);
        return `# Bimba-Enhanced Context for ${sourceFileName}\n\nError generating context: ${error.message}\n\nTarget Coordinate: ${targetCoordinate}`;
    }
}

/**
 * Generates a hierarchical context window for chunk analysis.
 * This implementation follows the design in the analysis pipeline development plan.
 *
 * IMPORTANT: This function has been updated to:
 * 1. Create a lightweight context window for RAG chunks (stage -3)
 * 2. Create a comprehensive context window for analysis (stage -2)
 * 3. Implement smart truncation instead of arbitrary character limits
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {string} documentContent - The content of the document
 * @param {string|object} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {object} projectContext - Project-level context
 * @param {string} bimbaMapSummary - Summary of the Bimba map
 * @param {object} options - Additional options
 * @param {boolean} options.forAnalysis - Whether this context window is for analysis (stage -2) or RAG (stage -3)
 * @returns {Promise<object>} - The generated context window object with hierarchical structure
 * @throws {Error} - If required parameters are missing or invalid
 */
export async function generateContextWindow(
    chunkContent,
    documentContent,
    bimbaEnhancedContext,
    fullBimbaMap,
    projectContext,
    bimbaMapSummary = null,
    options = {}
) {
    const { forAnalysis = false } = options;

    // Validate inputs
    if (!chunkContent || typeof chunkContent !== 'string') {
        throw new Error("chunkContent must be a non-empty string");
    }

    if (!documentContent || typeof documentContent !== 'string') {
        throw new Error("documentContent must be a non-empty string");
    }

    // Ensure bimbaEnhancedContext is a string
    const bimbaContextStr = typeof bimbaEnhancedContext === 'string'
        ? bimbaEnhancedContext
        : (bimbaEnhancedContext ? JSON.stringify(bimbaEnhancedContext) : "No Bimba context available");

    try {
        // Helper function for smart truncation
        function smartTruncateText(text, maxLength) {
            if (!text || text.length <= maxLength) return text;

            // Try to truncate at paragraph boundaries
            const paragraphs = text.split('\n\n');
            let truncated = '';
            let i = 0;

            while (i < paragraphs.length && truncated.length + paragraphs[i].length + 4 <= maxLength) {
                truncated += paragraphs[i] + '\n\n';
                i++;
            }

            // If we couldn't fit even one paragraph, truncate at sentence boundary
            if (truncated.length === 0) {
                const sentences = text.split(/(?<=[.!?])\s+/);
                i = 0;

                while (i < sentences.length && truncated.length + sentences[i].length + 2 <= maxLength) {
                    truncated += sentences[i] + ' ';
                    i++;
                }

                // If we still couldn't fit anything, just truncate at maxLength
                if (truncated.length === 0) {
                    truncated = text.substring(0, maxLength);
                }
            }

            return truncated.trim() + '...';
        }

        // Generate chunk-specific context
        const chunkContext = await generateChunkContext(
            chunkContent,
            documentContent,
            bimbaContextStr
        );



        // For RAG chunks (stage -3), create a lightweight context window
        if (!forAnalysis) {
            console.log("Generating lightweight context window for RAG chunk (stage -3)");

            // Create a lightweight context window with minimal but informative structure
            const lightContextWindow = {
                // Structured data for programmatic access
                chunkContext,
                documentContext: bimbaContextStr,
                projectContext: {
                    projectName: projectContext.projectName,
                    projectDescription: projectContext.projectDescription,
                    rootNode: projectContext.rootNode ? {
                        name: projectContext.rootNode.name,
                        coordinate: projectContext.rootNode.coordinate
                    } : null,
                    topLevelNodes: projectContext.topLevelNodes || [] // Include top-level nodes for minimal hierarchy
                },
                bimbaMapSummary: bimbaMapSummary ? {
                    rootNodeDescription: bimbaMapSummary.rootNodeDescription,
                    totalNodes: bimbaMapSummary.totalNodes
                } : null,

                // Formatted text for LLM consumption with smart truncation and clear guidance
                contextText: `# HOW TO USE THIS CONTEXT FOR RAG
This context window provides essential information to help understand this chunk in relation to the document and project for Retrieval Augmented Generation. It contains:
- CHUNK PREVIEW: A brief snippet of the current chunk.
- DOCUMENT CONTEXT: A summary of the overall document this chunk belongs to, enhanced with Bimba insights.
- PROJECT CONTEXT: Information about the broader project, including its main theme and key structural elements (top-level Bimba nodes).
- BIMBA MAP SUMMARY: A high-level overview of the Bimba coordinate system relevant to this project.

When processing this chunk for RAG:
- Use the DOCUMENT CONTEXT to understand the chunk's broader narrative.
- Use the PROJECT CONTEXT to situate the chunk within the project's goals and structure.
- The BIMBA MAP SUMMARY provides overarching structural awareness.
- Focus on how this CHUNK PREVIEW relates to these contexts to generate or retrieve relevant information.

## CHUNK PREVIEW
${chunkContext.contentPreview || chunkContext}

## DOCUMENT CONTEXT (Bimba Enhanced Summary)
${smartTruncateText(bimbaContextStr, 500)}

## PROJECT CONTEXT
### ${projectContext.projectName || "Unknown Project"}
${projectContext.projectDescription || "No project description available."}
${projectContext.topLevelNodes && projectContext.topLevelNodes.length > 0 ?
`
### Key Project Structure (Top-Level Bimba Nodes):
${projectContext.topLevelNodes.slice(0, 5).map(n =>
    `- ${n.name} (${n.coordinate})${n.description ? ': ' + n.description.substring(0, 50) + (n.description.length > 50 ? '...' : '') : ''}`
).join('\n')}${projectContext.topLevelNodes.length > 5 ? `\n- ... and ${projectContext.topLevelNodes.length - 5} more top-level nodes` : ''}`
: ''}

## BIMBA MAP SUMMARY (Overall Project Structure)
${bimbaMapSummary && bimbaMapSummary.rootNodeDescription ? bimbaMapSummary.rootNodeDescription :
  (bimbaMapSummary && bimbaMapSummary.totalNodes ? `Total Bimba Nodes: ${bimbaMapSummary.totalNodes}` : 'No Bimba map summary available.')}
`
            };

            return lightContextWindow;
        }

        // For analysis (stage -2), create a comprehensive context window
        console.log("Generating comprehensive context window for analysis (stage -2)");

        // Extract relevant Bimba context for this chunk
        const relevantBimbaContext = await extractRelevantBimbaContext(
            chunkContent,
            fullBimbaMap
        );

        // Add a dedicated QL context section using BimbaKnowing
        let qlContext = null;

        // First, check if we already have QL context from the Bimba context
        if (relevantBimbaContext.bimbaContext) {
            console.log("Using QL context from existing Bimba context");
            qlContext = relevantBimbaContext.bimbaContext;
        } else {
            // If not, retrieve it directly
            try {
                // Get the target coordinate from the project context or the first mentioned coordinate
                const targetCoordinate =
                    (projectContext && projectContext.targetCoordinate) ||
                    (relevantBimbaContext.mentionedCoordinates && relevantBimbaContext.mentionedCoordinates.length > 0 ?
                        relevantBimbaContext.mentionedCoordinates[0] : null);

                if (targetCoordinate) {
                    console.log(`Retrieving QL context for ${targetCoordinate} using bimbaKnowing tool`);

                    // Call bimbaKnowing tool directly for QL data
                    const bimbaKnowingResult = await bpMCPService.callTool('bimbaKnowing', {
                        query: `Retrieve Quaternal Logic operators (structural, processual, contextual) relevant to ${targetCoordinate}`,
                        contextDepth: 2,
                        focusCoordinate: targetCoordinate,
                        includeRelations: true,
                        includeQLContext: true
                    });

                    // Parse the result with proper error handling
                    if (!bimbaKnowingResult || !bimbaKnowingResult.content || bimbaKnowingResult.content.length === 0) {
                        throw new Error(`BimbaKnowing tool returned empty or invalid response for QL context of ${targetCoordinate}`);
                    }

                    const qlContextText = bimbaKnowingResult.content[0].text;
                    qlContext = JSON.parse(qlContextText);
                    console.log(`Successfully retrieved QL context for ${targetCoordinate}`);

                    // Validate the results
                    if (!qlContext.results || qlContext.results.length === 0) {
                        console.warn(`BimbaKnowing returned no QL results for coordinate ${targetCoordinate}`);
                    }
                } else {
                    console.warn("No target coordinate available for QL context retrieval");
                }
            } catch (error) {
                console.error(`Error retrieving QL context: ${error.message}`);
                // Don't fall back, just propagate the error
                throw new Error(`Failed to retrieve QL context: ${error.message}`);
            }
        }

        // Create a comprehensive context window with full information
        // Add the context usage guide for analysis
        const contextUsageGuide = `
# HOW TO USE THIS CONTEXT WINDOW

This context window provides essential information to help you analyze the document chunk.
It contains:

1. CHUNK CONTEXT: Specific information about this chunk and its content
2. DOCUMENT CONTEXT: Information about the overall document
3. BIMBA CONTEXT: Relevant nodes from the Bimba coordinate system
4. PROJECT CONTEXT: Information about the project this document belongs to
5. QUATERNAL LOGIC (QL) CONTEXT: QL operators and dynamics relevant to this content

When analyzing this chunk:
- Use the Bimba context to identify relevant coordinates and concepts
- Consider how this chunk relates to the overall document
- Apply the MEF lenses to examine the content from multiple perspectives
- Leverage the Quaternal Logic (QL) framework to understand structural, processual, and contextual aspects
- Extract relational properties that connect this content to the broader knowledge structure

Your analysis should be informed by this context, but not limited by it.
`;

        const fullContextWindow = {
            // Structured data for programmatic access
            chunkContext,
            documentContext: bimbaContextStr,
            bimbaContext: relevantBimbaContext,
            projectContext,
            bimbaMapSummary,
            qlContext, // Add QL context to the structured data

            // Formatted text for LLM consumption with smart truncation
            contextText: `${contextUsageGuide}

# Context Window

## Chunk Context
${chunkContext}

## Document Context
${smartTruncateText(bimbaContextStr, 500)}

${bimbaMapSummary ? `## Bimba Map Summary
${smartTruncateText(bimbaMapSummary, 1000)}

` : ''}## Bimba Context
### Directly Relevant Nodes (${relevantBimbaContext.directlyRelevantNodes.length})
${relevantBimbaContext.directlyRelevantNodes.map(node =>
    `- ${node.coordinate}: ${node.name}${node.description ? ` - ${node.description}` : ''}`
).join('\n')}

### Parent Nodes (${relevantBimbaContext.parentNodes.length})
${relevantBimbaContext.parentNodes.map(node =>
    `- ${node.coordinate}: ${node.name}${node.description ? ` - ${node.description}` : ''}`
).join('\n')}

### Sibling Nodes (${relevantBimbaContext.siblingNodes.length})
${relevantBimbaContext.siblingNodes.map(node =>
    `- ${node.coordinate}: ${node.name}`
).join('\n')}

### Coordinate Structure
${JSON.stringify(relevantBimbaContext.coordinateStructure, null, 2)}

${relevantBimbaContext.relationships && relevantBimbaContext.relationships.length > 0 ?
`### Relationships (${relevantBimbaContext.relationships.length})
${relevantBimbaContext.relationships.slice(0, 10).map(rel => {
    let relStr = `- ${rel.source} → ${rel.target} (${rel.type})`;
    const qlProps = [];
    if (rel.qlType) qlProps.push(`QL Type: ${rel.qlType}`);
    if (rel.qlDynamics) qlProps.push(`QL Dynamics: ${rel.qlDynamics}`);
    if (rel.qlContextFrame) qlProps.push(`Context Frame: ${rel.qlContextFrame}`);
    if (qlProps.length > 0) {
        relStr += `\n  ${qlProps.join(', ')}`;
    }
    return relStr;
}).join('\n')}
${relevantBimbaContext.relationships.length > 10 ? `\n- ... and ${relevantBimbaContext.relationships.length - 10} more relationships` : ''}` : ''}

## Project Context
- Project Name: ${projectContext.projectName}
- Project Description: ${projectContext.projectDescription}
${projectContext.rootNode ? `- Root Node: ${projectContext.rootNode.name} (${projectContext.rootNode.coordinate})` : ''}
${projectContext.subsystemNodes ? `
- Subsystems (${projectContext.subsystemNodes.length}): ${projectContext.subsystemNodes.slice(0, 5).map(node =>
    `${node.name || 'Unnamed'} (${node.coordinate})`
).join(', ')}${projectContext.subsystemNodes.length > 5 ? `, and ${projectContext.subsystemNodes.length - 5} more...` : ''}` : ''}
${projectContext.allNodesWithCoordinates ? `- Total Nodes with Coordinates: ${projectContext.allNodesWithCoordinates.length}` : ''}

## Quaternal Logic (QL) Context
${qlContext ? formatQLContext(qlContext) : 'No QL context available for this coordinate.'}

## Analysis Framework
Use the Meta-Epistemic Framework (MEF) as an analytical toolkit to examine this chunk from multiple perspectives.
`
        };

        return fullContextWindow;
    } catch (error) {
        console.error("Error generating context window:", error);
        throw error; // Rethrow the error to stop the pipeline
    }
}

/**
 * Formats QL context from BimbaKnowing for LLM consumption.
 * Categorizes operators by type (structural, processual, contextual).
 *
 * @param {object} qlContext - The QL context from BimbaKnowing
 * @returns {string} - The formatted QL context for LLM consumption
 */
export function formatQLContext(qlContext) {
    if (!qlContext || !qlContext.results) {
        return "No QL context available.";
    }

    // Extract and categorize QL operators
    const nodes = qlContext.results || [];

    // Filter for QL operators
    const qlOperators = nodes.filter(node =>
        node.properties?.type === 'QLOperator' ||
        node.properties?.qlOperatorTypes?.length > 0 ||
        node.properties?.qlPosition !== undefined
    );

    // Categorize by type
    const structuralOperators = qlOperators.filter(node =>
        node.properties?.qlOperatorTypes?.includes('structural') ||
        node.properties?.type === 'QL-STRUCT'
    );

    const processualOperators = qlOperators.filter(node =>
        node.properties?.qlOperatorTypes?.includes('processual') ||
        node.properties?.type === 'QL-PROC'
    );

    const contextualOperators = qlOperators.filter(node =>
        node.properties?.qlOperatorTypes?.includes('contextual') ||
        node.properties?.type === 'QL-CONTEXT'
    );

    // Format for LLM consumption
    let formattedContext = "### QL Operator Categories\n\n";

    formattedContext += "#### Structural Operators\n";
    if (structuralOperators.length > 0) {
        structuralOperators.forEach(op => {
            formattedContext += `- **${op.properties?.name || 'Unnamed'}**: ${op.properties?.description || 'No description'}\n`;
        });
    } else {
        formattedContext += "No structural operators identified for this context.\n";
    }

    formattedContext += "\n#### Processual Operators\n";
    if (processualOperators.length > 0) {
        processualOperators.forEach(op => {
            formattedContext += `- **${op.properties?.name || 'Unnamed'}**: ${op.properties?.description || 'No description'}\n`;
        });
    } else {
        formattedContext += "No processual operators identified for this context.\n";
    }

    formattedContext += "\n#### Contextual Operators\n";
    if (contextualOperators.length > 0) {
        contextualOperators.forEach(op => {
            formattedContext += `- **${op.properties?.name || 'Unnamed'}**: ${op.properties?.description || 'No description'}\n`;
        });
    } else {
        formattedContext += "No contextual operators identified for this context.\n";
    }

    // Add QL-Bimba relationship explanation
    formattedContext += "\n### QL-Bimba Relationship\n";
    formattedContext += "QL provides the foundational, generative logic (comprising specific structural, processual, and contextual operators/dynamics), while the Bimba Coordinate System is the manifested, navigable map built upon and through these QL principles.\n";

    // Add QL dynamics if available
    if (qlContext.relationships && qlContext.relationships.length > 0) {
        const qlDynamics = qlContext.relationships.filter(rel => rel.qlDynamics);

        if (qlDynamics.length > 0) {
            formattedContext += "\n### QL Dynamics\n";
            qlDynamics.forEach(dynamic => {
                formattedContext += `- **${dynamic.source} → ${dynamic.target}**: ${dynamic.qlDynamics || dynamic.type}\n`;
            });
        }
    }

    return formattedContext;
}

/**
 * Extracts relevant Bimba context for a chunk.
 *
 * ENHANCED: This implementation now:
 * 1. Leverages the bimbaKnowing tool for more comprehensive Bimba coordinate relationship data
 * 2. Includes all nodes with coordinates in a structured format
 * 3. Implements smart truncation instead of arbitrary character limits
 * 4. Organizes nodes hierarchically for better context
 * 5. Prioritizes directly relevant nodes while maintaining the full structure
 * 6. Provides richer relationship data between nodes
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {object} fullBimbaMap - The full Bimba map
 * @returns {Promise<object>} - The relevant Bimba context with enhanced structure
 */
export async function extractRelevantBimbaContext(chunkContent, fullBimbaMap) {
    try {
        // Extract potential coordinates mentioned in the chunk
        // Updated pattern to match both "-" and "." separators
        const coordinatePattern = /#[0-5]([-\.][0-5])*\b/g;
        const mentionedCoordinates = chunkContent.match(coordinatePattern) || [];

        // Find directly relevant nodes from the Bimba map
        const directlyRelevantNodes = [];
        // Find parent nodes of mentioned coordinates
        const parentNodes = [];
        // Find sibling nodes of mentioned coordinates
        const siblingNodes = [];
        // Create a lightweight index of all coordinates
        const allNodesWithCoordinates = [];
        // Store relationship data
        const relationships = [];
        // Store the full bimbaKnowing context
        let bimbaContext = null;

        // If we have mentioned coordinates, use bimbaKnowing to get enhanced context
        if (mentionedCoordinates.length > 0) {
            // Use the first mentioned coordinate as the focus
            const focusCoordinate = mentionedCoordinates[0];

            console.log(`Retrieving Bimba context for ${focusCoordinate} using bimbaKnowing tool`);

            // Call bimbaKnowing tool with comprehensive parameters including QL context
            const bimbaKnowingResult = await bpMCPService.callTool('bimbaKnowing', {
                query: `Provide comprehensive context for ${focusCoordinate} including neighboring coordinates, their relationships, and Quaternal Logic operators`,
                contextDepth: 3,
                focusCoordinate: focusCoordinate,
                includeRelations: true,
                includeQLContext: true
            });

            // Parse the bimbaKnowing response
            if (!bimbaKnowingResult || !bimbaKnowingResult.content || bimbaKnowingResult.content.length === 0) {
                throw new Error(`BimbaKnowing tool returned empty or invalid response for coordinate ${focusCoordinate}`);
            }

            // The bimbaKnowing tool returns a JSON string in the first content item
            const bimbaKnowingData = JSON.parse(bimbaKnowingResult.content[0].text);

            // Store the full context for later use
            bimbaContext = bimbaKnowingData;

            // Extract nodes and relationships
            const nodes = bimbaKnowingData.results || [];
            relationships.push(...(bimbaKnowingData.relationships || []));

            console.log(`BimbaKnowing returned ${nodes.length} nodes and ${relationships.length} relationships for coordinate ${focusCoordinate}`);

            if (nodes.length === 0) {
                console.warn(`BimbaKnowing returned no nodes for coordinate ${focusCoordinate}`);
            }

            // Process nodes from bimbaKnowing
            for (const node of nodes) {
                const coordinate = node.properties?.bimbaCoordinate;

                if (!coordinate) {
                    console.warn(`Node missing bimbaCoordinate property: ${JSON.stringify(node)}`);
                    continue;
                }

                // Create a standardized node object
                const standardizedNode = {
                    coordinate,
                    name: node.properties?.name || 'Unnamed',
                    description: node.properties?.description || '',
                    type: node.properties?.type || 'Unknown',
                    qlPosition: node.properties?.qlPosition,
                    qlCategory: node.properties?.qlCategory,
                    qlOperatorTypes: node.properties?.qlOperatorTypes
                };

                // Add to the complete index
                allNodesWithCoordinates.push({
                    coordinate,
                    name: standardizedNode.name,
                    type: standardizedNode.type
                });

                // Categorize the node
                if (mentionedCoordinates.includes(coordinate)) {
                    directlyRelevantNodes.push(standardizedNode);
                } else {
                    // Check if it's a parent of a mentioned coordinate
                    let isParent = false;
                    for (const mentionedCoordinate of mentionedCoordinates) {
                        if (mentionedCoordinate.startsWith(coordinate + '-') ||
                            mentionedCoordinate.startsWith(coordinate + '.')) {
                            parentNodes.push(standardizedNode);
                            isParent = true;
                            break;
                        }
                    }

                    // If not a parent, check if it's a sibling
                    if (!isParent) {
                        for (const mentionedCoordinate of mentionedCoordinates) {
                            const mentionedParts = mentionedCoordinate.split(/[-\.]/);
                            const nodeParts = coordinate.split(/[-\.]/);

                            if (mentionedParts.length === nodeParts.length &&
                                mentionedParts.slice(0, -1).join('-') === nodeParts.slice(0, -1).join('-') &&
                                mentionedParts[mentionedParts.length - 1] !== nodeParts[nodeParts.length - 1]) {
                                siblingNodes.push(standardizedNode);
                                break;
                            }
                        }
                    }
                }
            }
        } else if (fullBimbaMap && fullBimbaMap.nodes) {
            // If no coordinates mentioned, use the full Bimba map directly
            console.log("No coordinates mentioned in chunk, using full Bimba map directly");

            // Process nodes from the full Bimba map
            for (const node of fullBimbaMap.nodes) {
                // Use standardized coordinate property
                const coordinate = node.coordinate || node.bimbaCoordinate || null;

                if (!coordinate) {
                    continue; // Skip nodes without coordinates
                }

                // Add to the complete index
                allNodesWithCoordinates.push({
                    coordinate,
                    name: node.name || 'Unnamed',
                    type: node.type || 'Unknown'
                });
            }

            console.log(`Processed ${allNodesWithCoordinates.length} nodes from full Bimba map`);
        }

        // Create a hierarchical structure of coordinates
        const coordinateStructure = {};

        // Group nodes by their first segment (e.g., #0, #1, etc.)
        for (const node of allNodesWithCoordinates) {
            const parts = node.coordinate.split(/[-\.]/);
            const mainBranch = parts[0]; // e.g., "#", "#0", "#1"

            if (!coordinateStructure[mainBranch]) {
                coordinateStructure[mainBranch] = {
                    coordinate: mainBranch,
                    name: node.coordinate === mainBranch ? node.name : mainBranch,
                    children: {}
                };
            }

            // If this is not a main branch node, add it to the appropriate branch
            if (parts.length > 1) {
                let current = coordinateStructure[mainBranch].children;
                let currentPath = mainBranch;

                // Build the path through the hierarchy
                for (let i = 1; i < parts.length; i++) {
                    const part = parts[i];
                    currentPath += `-${part}`;

                    if (!current[part]) {
                        current[part] = {
                            coordinate: currentPath,
                            name: node.coordinate === currentPath ? node.name : '',
                            children: {}
                        };
                    }

                    current = current[part].children;
                }
            }
        }

        // Implement smart truncation for node descriptions
        const truncateDescription = (description, maxLength = 100) => {
            if (!description) return '';

            // Try to truncate at a sentence boundary
            const firstSentenceMatch = description.match(/^(.*?[.!?])\s/);
            if (firstSentenceMatch) {
                return firstSentenceMatch[1];
            }

            // If no sentence boundary found, truncate at maxLength
            return description.length > maxLength
                ? description.substring(0, maxLength) + '...'
                : description;
        };

        // Process directly relevant nodes to include truncated descriptions
        const processedRelevantNodes = directlyRelevantNodes.map(node => ({
            coordinate: node.coordinate,
            name: node.name || 'Unnamed',
            description: truncateDescription(node.description),
            type: node.type || 'Unknown',
            qlPosition: node.qlPosition,
            qlCategory: node.qlCategory,
            qlOperatorTypes: node.qlOperatorTypes,
            relevance: 'direct'
        }));

        // Process parent nodes with truncated descriptions
        const processedParentNodes = parentNodes.map(node => ({
            coordinate: node.coordinate,
            name: node.name || 'Unnamed',
            description: truncateDescription(node.description, 50), // Shorter for parents
            type: node.type || 'Unknown',
            qlPosition: node.qlPosition,
            qlCategory: node.qlCategory,
            qlOperatorTypes: node.qlOperatorTypes,
            relevance: 'parent'
        }));

        // Process sibling nodes with minimal information
        const processedSiblingNodes = siblingNodes.map(node => ({
            coordinate: node.coordinate,
            name: node.name || 'Unnamed',
            type: node.type || 'Unknown',
            qlPosition: node.qlPosition,
            qlCategory: node.qlCategory,
            qlOperatorTypes: node.qlOperatorTypes,
            relevance: 'sibling'
        }));

        return {
            directlyRelevantNodes: processedRelevantNodes,
            parentNodes: processedParentNodes,
            siblingNodes: processedSiblingNodes,
            mentionedCoordinates,
            allNodesWithCoordinates,
            coordinateStructure,
            relationships,
            bimbaContext // Include the full bimbaKnowing context
        };
    } catch (error) {
        console.error("Error extracting relevant Bimba context:", error);
        throw error; // Rethrow the error to stop the pipeline
    }
}

/**
 * Generates chunk-specific context.
 *
 * ENHANCED: This function now:
 * 1. Provides a more structured and informative chunk context
 * 2. Includes a content preview with smart truncation
 * 3. Adds positional information for better context
 * 4. Extracts key themes and topics from the chunk
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {string} documentContent - The content of the document
 * @param {string} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @returns {Promise<object>} - The chunk-specific context object with structured information
 * @throws {Error} - If required parameters are missing or invalid
 */
export async function generateChunkContext(chunkContent, documentContent, bimbaEnhancedContext) {
    // Validate inputs
    if (!chunkContent || typeof chunkContent !== 'string') {
        throw new Error("chunkContent must be a non-empty string");
    }

    if (!documentContent || typeof documentContent !== 'string') {
        throw new Error("documentContent must be a non-empty string");
    }

    // Ensure bimbaEnhancedContext is a string
    const bimbaContextStr = typeof bimbaEnhancedContext === 'string'
        ? bimbaEnhancedContext
        : (bimbaEnhancedContext ? JSON.stringify(bimbaEnhancedContext) : "No Bimba context available");

    try {
        // Create a content preview with smart truncation
        let contentPreview;

        // Try to extract the first paragraph or first few sentences
        const firstParagraphMatch = chunkContent.match(/^(.+?)(?:\n\s*\n|$)/s);
        if (firstParagraphMatch && firstParagraphMatch[1].length <= 150) {
            contentPreview = firstParagraphMatch[1];
        } else {
            // Extract the first few sentences, up to about 150 chars
            const sentences = chunkContent.split(/(?<=[.!?])\s+/);
            contentPreview = '';
            for (let i = 0; i < sentences.length && contentPreview.length < 150; i++) {
                if (contentPreview.length + sentences[i].length > 150) {
                    contentPreview += sentences[i].substring(0, 150 - contentPreview.length) + '...';
                    break;
                }
                contentPreview += (i > 0 ? ' ' : '') + sentences[i];
            }
        }

        // Calculate the position of the chunk in the document (approximate)
        const chunkPosition = documentContent.indexOf(chunkContent);
        const documentLength = documentContent.length;
        const positionPercentage = Math.round((chunkPosition / documentLength) * 100);

        // Calculate relative position description
        let positionDescription;
        if (positionPercentage < 10) {
            positionDescription = "at the beginning of";
        } else if (positionPercentage < 33) {
            positionDescription = "in the first third of";
        } else if (positionPercentage < 66) {
            positionDescription = "in the middle of";
        } else if (positionPercentage < 90) {
            positionDescription = "in the latter part of";
        } else {
            positionDescription = "near the end of";
        }

        // Extract document context summary (safely)
        let documentContextSummary = 'No document context available';
        try {
            if (bimbaContextStr && bimbaContextStr.length > 0) {
                const lines = bimbaContextStr.split('\n');
                documentContextSummary = lines.slice(0, 3).join('\n');
            }
        } catch (parseError) {
            console.warn("Error parsing bimbaEnhancedContext:", parseError);
            documentContextSummary = 'Error parsing document context';
        }

        // Create a structured chunk context object
        return {
            contentPreview,
            position: {
                percentage: positionPercentage,
                description: positionDescription
            },
            documentContextSummary
        };
    } catch (error) {
        console.error("Error generating chunk context:", error);
        throw new Error(`Failed to generate chunk context: ${error.message}`);
    }
}

/**
 * Analyzes a chunk with the Metalogikon template.
 * This function is used by stage -2 to analyze chunks with context windows.
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {string} originalContent - The original content without context window
 * @param {object} contextWindow - The context window object
 * @param {string} chunkContext - The chunk-specific context
 * @param {object} metalogikon - The Metalogikon template
 * @param {object} relevantBimbaContext - The relevant Bimba context for the chunk
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} llmService - The LLM service
 * @param {object} chunkRun - The LangSmith run for tracing
 * @returns {Promise<object>} - The analysis results
 * @throws {Error} - If analysis fails
 */
export async function analyzeChunkWithMetalogikon(
    chunkContent,
    originalContent,
    contextWindow,
    chunkContext,
    metalogikon,
    relevantBimbaContext,
    targetCoordinate,
    llmService,
    // Remove unused parameter
    // chunkRun = null
) {
    // Validate inputs
    if (!chunkContent || typeof chunkContent !== 'string') {
        throw new Error("chunkContent must be a non-empty string");
    }

    if (!llmService) {
        throw new Error("LLM service is required for chunk analysis");
    }

    try {
        // Prepare Metalogikon prompt
        let mefPrompt = "No Metalogikon framework available.";
        if (metalogikon && metalogikon.lenses && metalogikon.lenses.length > 0) {
            mefPrompt = "# META-EPISTEMIC FRAMEWORK (MEF)\n\n";

            if (metalogikon.rootNode) {
                mefPrompt += `## Overview: ${metalogikon.rootNode.name}\n${metalogikon.rootNode.description || ''}\n\n`;
            }

            mefPrompt += "## MEF LENSES TO APPLY:\n\n";

            // Group lenses by category
            const lensesByCategory = {};
            metalogikon.lenses.forEach(lens => {
                const category = lens.category || 'Uncategorized';
                if (!lensesByCategory[category]) {
                    lensesByCategory[category] = [];
                }
                lensesByCategory[category].push(lens);
            });

            // Add lenses by category
            for (const [category, lenses] of Object.entries(lensesByCategory)) {
                mefPrompt += `### ${category}\n`;
                lenses.forEach(lens => {
                    mefPrompt += `- **${lens.name}** (${lens.coordinate}): ${lens.description || 'No description'}\n`;
                });
                mefPrompt += "\n";
            }
        }

        // Use the full context window for analysis
        // This is the key improvement - using the context window that was prepended to the chunk
        const contextText = contextWindow?.contextText ||
            `# Context Window\n\n## Chunk Context\n${chunkContext}\n\n## Bimba Context\n${JSON.stringify(relevantBimbaContext, null, 2)}`;

        // Prepare system prompt with enhanced QL-Bimba differentiation, Bimba-centric analysis, and deep elaboration requirements
        const systemPrompt = `You are an expert in Quaternal Logic (QL) and the Bimba Coordinate System. Your task is to analyze text in relation to these frameworks.

IMPORTANT DISTINCTION:
- Quaternal Logic (QL) is the foundational, generative framework comprising specific operators (structural, processual, contextual).
- The Bimba Coordinate System is the manifested, navigable map or knowledge structure built UPON and THROUGH these QL principles.
- QL provides the "how and why" for the Bimba map's "what and where."
- QL operators are dynamic and can be active across or within Bimba coordinates.

CONTEXT INFORMATION:
${contextText}

METALOGIKON FRAMEWORK:
${mefPrompt}

BIMBA-CENTRIC ANALYSIS REQUIREMENTS:
1. Situate your findings explicitly within the Bimba Coordinate Map.
2. If multiple Bimba coordinates are relevant, explain their relationship to each other (sequential, hierarchical, complementary, in tension) in the context of this analysis.
3. Describe how the text content "travels through" or "populates" regions of the BimbaMap.
4. Identify any "constellations" of Bimba coordinates that emerge as particularly important.
5. Use precise Bimba terminology when discussing coordinates and their characteristics.

DEEP ELABORATION REQUIREMENTS:
Do not merely state that the text aligns with the target coordinate. Assume basic alignment is established. Your task is to provide DEEP ELABORATION:

1. Explain the significance and specific nature of this alignment. What makes this connection noteworthy or insightful?
2. Identify 3-5 distinct points of deep elaboration. For each point:
   - Clearly state the insight, nuance, tension, strong resonance, or novel perspective
   - Provide specific textual evidence to support your point
   - Explain why this point is significant for understanding either the text, the coordinate, or their interrelation
3. Discuss any novel contributions or unique perspectives this text offers regarding the target coordinate.
4. Identify any subtle QL dynamics that provide a deeper, non-obvious explanation for the text's connection to the coordinate.
5. Summarize the primary analytical value your elaboration provides beyond a simple statement of alignment.

INSTRUCTIONS:
1. Analyze the text chunk in relation to the target coordinate: ${targetCoordinate}
2. Identify relevant Bimba coordinates that appear in the text
3. Identify the specific QL operators (structural, processual, contextual) that are active in the text
4. Explain HOW these QL dynamics give the Bimba coordinates their specific meaning or relevance
5. Extract mappings between the text and the Bimba coordinate system
6. Identify variations or contradictions
7. Generate natural elaborations that extend beyond the established definitions
8. Apply the Metalogikon Framework lenses to gain deeper insights
9. NEVER conflate QL operators with Bimba coordinates themselves
10. Format your response as a structured JSON object`;

        // Prepare user prompt
        const userPrompt = `TEXT CHUNK TO ANALYZE:
"""
${originalContent}
"""

Please analyze this text chunk and provide your analysis in the following JSON format:
{
  "extractedMappings": [
    {
      "mappingType": "Bimba_Node | QL_Stage | MEF_Lens | Concept | Entity | Relationship | Nested_Element | Implicit_Dimension",
      "mappingValue": "string",
      "confidenceScore": 0.0-1.0,
      "status": "identified | potential | speculative",
      "reasoning": "string",
      "qlPhase": "+ | -"
    }
  ],
  "identifiedVariations": [
    {
      "variationType": "string",
      "variationText": "string",
      "proposedResolution": "string",
      "status": "confirmed | needs_investigation | needs_clarification",
      "confidenceScore": 0.0-1.0
    }
  ],
  "naturalElaborations": [
    {
      "elaborationType": "string",
      "elaborationText": "string",
      "targetCoordinate": "string",
      "confidenceScore": 0.0-1.0
    }
  ],
  "mefLensInsights": {
    "lensCoordinate": "insightText"
  },
  "subnodeMappings": {
    "subnodeCoordinate": {
      "mappings": [],
      "summary": "string"
    }
  }
}`;

        // Call LLM
        const response = await llmService.generateContent(-2, systemPrompt, userPrompt, {
            temperature: 0.2,
            maxOutputTokens: 4096
        });

        // Parse response
        let analysisData;
        try {
            // Log the raw response for debugging
            console.log("Raw LLM response (first 200 chars):", response.substring(0, 200) + "...");

            // Extract JSON from response using more robust patterns
            let jsonStr = "";

            // Try to extract JSON from code blocks first
            const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                                  response.match(/```\n([\s\S]*?)\n```/);

            if (jsonBlockMatch) {
                jsonStr = jsonBlockMatch[1];
            } else {
                // Try to find JSON object in the response
                const startBrace = response.indexOf('{');
                const endBrace = response.lastIndexOf('}');

                if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
                    jsonStr = response.substring(startBrace, endBrace + 1);
                } else {
                    // If no JSON found, use the whole response
                    jsonStr = response;
                }
            }

            // Clean up the JSON string
            jsonStr = jsonStr.trim();

            // Try to fix common JSON errors
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
            jsonStr = jsonStr.replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2'); // Fix unescaped backslashes

            // Log the extracted JSON string for debugging
            console.log("Extracted JSON string (first 200 chars):", jsonStr.substring(0, 200) + "...");

            // Parse the JSON
            try {
                analysisData = JSON.parse(jsonStr);
            } catch (initialParseError) {
                console.warn("Initial JSON parsing failed, attempting to fix JSON:", initialParseError.message);

                // Try to create a minimal valid structure
                analysisData = {
                    extractedMappings: [],
                    identifiedVariations: [],
                    naturalElaborations: [],
                    mefLensInsights: {},
                    subnodeMappings: {}
                };

                // Try to extract parts of the response
                try {
                    // Look for extractedMappings array
                    const mappingsMatch = jsonStr.match(/"extractedMappings"\s*:\s*\[([\s\S]*?)\]/);
                    if (mappingsMatch) {
                        try {
                            const mappingsJson = `[${mappingsMatch[1]}]`;
                            const mappings = JSON.parse(mappingsJson);
                            analysisData.extractedMappings = mappings;
                        } catch (e) {
                            console.warn("Failed to parse extractedMappings:", e.message);
                        }
                    }

                    // Look for identifiedVariations array
                    const variationsMatch = jsonStr.match(/"identifiedVariations"\s*:\s*\[([\s\S]*?)\]/);
                    if (variationsMatch) {
                        try {
                            const variationsJson = `[${variationsMatch[1]}]`;
                            const variations = JSON.parse(variationsJson);
                            analysisData.identifiedVariations = variations;
                        } catch (e) {
                            console.warn("Failed to parse identifiedVariations:", e.message);
                        }
                    }

                    // Look for naturalElaborations array
                    const elaborationsMatch = jsonStr.match(/"naturalElaborations"\s*:\s*\[([\s\S]*?)\]/);
                    if (elaborationsMatch) {
                        try {
                            const elaborationsJson = `[${elaborationsMatch[1]}]`;
                            const elaborations = JSON.parse(elaborationsJson);
                            analysisData.naturalElaborations = elaborations;
                        } catch (e) {
                            console.warn("Failed to parse naturalElaborations:", e.message);
                        }
                    }
                } catch (partialParseError) {
                    console.warn("Failed to extract partial JSON:", partialParseError.message);
                }
            }
        } catch (parseError) {
            console.error("Error parsing LLM response:", parseError);
            throw new Error(`Failed to parse LLM response: ${parseError.message}`);
        }

        // Extract mappings, variations, and tags
        const mappings = analysisData.extractedMappings || [];
        const variations = analysisData.identifiedVariations || [];

        // Generate tags from mappings and variations
        const tags = [];

        // Add tags based on dominant MEF lenses
        const mefLenses = mappings
            .filter(m => m.mappingType === 'MEF_Lens')
            .map(m => m.mappingValue);

        if (mefLenses.length > 0) {
            tags.push(...mefLenses.map(lens => `MEF:${lens}`));
        }

        // Add tags based on variation types
        const variationTypes = [...new Set(variations
            .map(v => v.variationType))];

        if (variationTypes.length > 0) {
            tags.push(...variationTypes.map(type => `Variation:${type}`));
        }

        return {
            analysis: response,
            mappings,
            variations,
            tags,
            mefLensInsights: analysisData.mefLensInsights || {},
            naturalElaborations: analysisData.naturalElaborations || [],
            subnodeMappings: analysisData.subnodeMappings || {}
        };
    } catch (error) {
        console.error("Error in analyzeChunkWithMetalogikon:", error);
        throw new Error(`Failed to analyze chunk with Metalogikon: ${error.message}`);
    }
}

/**
 * Analyzes a group of chunks together to maintain context between them.
 * This reduces the number of LLM calls and preserves context across chunks.
 *
 * IMPORTANT: This function has been updated to use the provided contextWindows
 * instead of generating new ones, which eliminates redundant MongoDB calls.
 *
 * @param {string[]} chunks - Array of chunk texts to analyze
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} bimbaContext - The Bimba context
 * @param {object} userContext - The user context
 * @param {string[][]} assignedCoordinates - Array of assigned coordinates for each chunk
 * @param {object} metalogikon - The Metalogikon template
 * @param {object} options - Additional options
 * @param {object} state - The current pipeline state (optional)
 * @returns {Promise<Array<object>>} - Analysis results for each chunk
 * @throws {Error} - If analysis fails
 */
export async function analyzeChunkGroup(
    chunks,
    sourceMetadata,
    bimbaContext,
    userContext,
    assignedCoordinates,
    metalogikon,
    options = {},
    state = null
) {
    // Validate inputs
    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
        throw new Error("chunks must be a non-empty array");
    }

    if (!assignedCoordinates || !Array.isArray(assignedCoordinates) || assignedCoordinates.length === 0) {
        throw new Error("assignedCoordinates must be a non-empty array");
    }

    if (chunks.length !== assignedCoordinates.length) {
        throw new Error("chunks and assignedCoordinates must have the same length");
    }

    // Extract options
    const {
        llmService,
        fullBimbaMap = { nodes: [], edges: [] },
        contextWindows = [],
        useProvidedContextWindows = false // New flag to use provided context windows
    } = options;

    if (!llmService) {
        throw new Error("LLM service is required for chunk group analysis");
    }

    // Validate that we have context windows for all chunks
    if (contextWindows.length !== chunks.length) {
        console.warn(`Context windows array length (${contextWindows.length}) does not match chunks length (${chunks.length}). This may cause issues.`);
    }

    // Log whether we're using provided context windows
    if (useProvidedContextWindows) {
        console.log(`Using provided comprehensive context windows for analysis (useProvidedContextWindows=true)`);
    }

    // Validate context windows if provided
    if (contextWindows && contextWindows.length > 0) {
        if (contextWindows.length !== chunks.length) {
            throw new Error("contextWindows and chunks must have the same length");
        }

        // Verify each context window has the required structure
        contextWindows.forEach((contextWindow, index) => {
            if (!contextWindow || !contextWindow.contextText) {
                throw new Error(`Invalid context window structure for chunk ${index + 1}`);
            }
        });
    }

    // Log that we're using provided context windows to eliminate redundant MongoDB calls
    console.log(`Using ${contextWindows.length} provided context windows to eliminate redundant MongoDB calls`);

    // Display the first context window for debugging
    if (contextWindows && contextWindows.length > 0) {
        console.log(`--- Context Window Debug Information ---`);
        console.log(`Context window for chunk 1 (first 200 chars): ${contextWindows[0].contextText.substring(0, 200)}...`);
        console.log(`--- End Context Window Debug Information ---`);
    }

    try {
        // Prepare Metalogikon prompt
        let mefPrompt = "No Metalogikon framework available.";
        if (metalogikon && metalogikon.lenses && metalogikon.lenses.length > 0) {
            mefPrompt = "# META-EPISTEMIC FRAMEWORK (MEF)\n\n";

            if (metalogikon.rootNode) {
                mefPrompt += `## Overview: ${metalogikon.rootNode.name}\n${metalogikon.rootNode.description || ''}\n\n`;
            }

            mefPrompt += "## MEF LENSES TO APPLY:\n\n";

            // Group lenses by category
            const lensesByCategory = {};
            metalogikon.lenses.forEach(lens => {
                const category = lens.category || 'Uncategorized';
                if (!lensesByCategory[category]) {
                    lensesByCategory[category] = [];
                }
                lensesByCategory[category].push(lens);
            });

            // Add lenses by category
            for (const [category, lenses] of Object.entries(lensesByCategory)) {
                mefPrompt += `### ${category}\n`;
                lenses.forEach(lens => {
                    mefPrompt += `- **${lens.name}** (${lens.coordinate}): ${lens.description || 'No description'}\n`;
                });
                mefPrompt += "\n";
            }
        }

        // Prepare context information using context windows if available
        let contextInformation = "";

        // Create a group context that provides an overview of the Bimba map's relevance to the analysis
        const groupContext = `
# Bimba Map Context for Analysis

## Project Overview
${userContext.projectContext?.projectDescription || userContext.projectDescription || "No project description available."}

## Target Coordinate: ${sourceMetadata.targetCoordinate}
${bimbaContext && bimbaContext.length > 0 && bimbaContext[0].node ?
    `${bimbaContext[0].node.name || 'Unnamed'}: ${bimbaContext[0].node.description || 'No description'}` :
    "No specific context available for this target coordinate."}

## Bimba Map Structure
The Bimba map is organized as a hierarchical coordinate system following a mod6 structure.
Each coordinate (e.g., #0, #1, #0-1, #2-3-4) represents a specific concept or perspective.
The full Bimba Map is available to the analysis model for deeper exploration if needed.

## Relevant Coordinates from Context Window
${contextWindows && contextWindows.length > 0 && contextWindows[0].bimbaContext ?
    formatRelevantCoordinates(contextWindows[0].bimbaContext) :
    "No specific Bimba coordinates highlighted in this chunk's immediate context."}
`;

        // Helper function to format relevant coordinates from bimbaContext
        function formatRelevantCoordinates(bimbaContext) {
            if (!bimbaContext) return "No Bimba context available.";

            let result = "";

            // Format directly relevant nodes
            if (bimbaContext.directlyRelevantNodes && bimbaContext.directlyRelevantNodes.length > 0) {
                result += "### Directly Relevant Nodes:\n";
                bimbaContext.directlyRelevantNodes.forEach(node => {
                    result += `- ${node.coordinate}: ${node.name}${node.description ? ` - ${node.description.substring(0, 100)}${node.description.length > 100 ? '...' : ''}` : ''}\n`;
                });
                result += "\n";
            }

            // Format parent nodes
            if (bimbaContext.parentNodes && bimbaContext.parentNodes.length > 0) {
                result += "### Parent Nodes:\n";
                bimbaContext.parentNodes.forEach(node => {
                    result += `- ${node.coordinate}: ${node.name}\n`;
                });
                result += "\n";
            }

            return result;
        }

        if (contextWindows && contextWindows.length > 0) {
            // Use the first context window's bimba context for overall context
            const firstContextWindow = contextWindows[0];

            // If the context window doesn't have comprehensive information for analysis,
            // regenerate it with forAnalysis=true
            if (!useProvidedContextWindows && (!firstContextWindow.bimbaContext || !firstContextWindow.bimbaContext.directlyRelevantNodes)) {
                console.log(`Context window doesn't have comprehensive information for analysis. Regenerating with forAnalysis=true.`);

                // Get the first chunk to regenerate the context window
                const firstChunk = chunks[0];

                // Regenerate the context window with forAnalysis=true
                // Access documentContent from state directly, not from sourceMetadata
                const documentContent = options.documentContent || state?.documentContent || "";
                const newContextWindow = await generateContextWindow(
                    firstChunk,
                    documentContent,
                    bimbaContext || "",
                    fullBimbaMap,
                    userContext || {},
                    null,
                    { forAnalysis: true } // Specify that this is for analysis, not RAG
                );

                // Use the regenerated context window and add the group context
                contextInformation = groupContext + "\n\n" + newContextWindow.contextText;
                console.log(`Regenerated comprehensive context window for analysis`);
            } else {
                // Use the existing context window and add the group context
                contextInformation = groupContext + "\n\n" + (firstContextWindow.contextText || JSON.stringify(bimbaContext, null, 2));
                console.log(`Using provided context window for analysis to eliminate redundant MongoDB calls`);
            }
        } else {
            console.warn(`No context windows provided. Using bimbaContext directly, which may cause redundant MongoDB calls.`);
            contextInformation = groupContext + "\n\n" + JSON.stringify(bimbaContext, null, 2);
        }

        // Prepare system prompt with enhanced instructions for quaternary logic and relational properties
        const systemPrompt = `You are Epii, an advanced AI system for analyzing text in relation to the Bimba coordinate system.
Your task is to analyze a group of related text chunks and extract mappings, variations, natural elaborations, and relational properties.

CONTEXT INFORMATION:
${contextInformation}

METALOGIKON FRAMEWORK:
${mefPrompt}

IMPORTANT DISTINCTION:
- Quaternal Logic (QL) is the foundational, generative framework comprising specific operators (structural, processual, contextual).
- The Bimba Coordinate System is the manifested, navigable map or knowledge structure built UPON and THROUGH these QL principles.
- QL provides the "how and why" for the Bimba map's "what and where."
- QL operators are dynamic and can be active across or within Bimba coordinates.
- NEVER conflate QL operators with Bimba coordinates themselves.

ANALYTICAL TASK INSTRUCTIONS:
Your analytical task, applying the Meta-Epistemic Framework (MEF) lenses, is to meticulously examine the provided content. Focus on the following dimensions:

1. **Identify Quaternal Logic (QL) Patterns:**
   * Detect any underlying QL-STRUCT (structural patterns), QL-PROC (procedural patterns), or QL-CONTEXT (contextual patterns) within the content.
   * Describe these patterns clearly and explain how the content exemplifies them.
   * Explain HOW these QL dynamics give the Bimba coordinates their specific meaning or relevance.

2. **Distinguish Variations from Elaborations:**
   * Critically assess the relationships between concepts presented in the current chunk and the broader context (document, project, Bimba map).
   * Clearly differentiate and label:
     * **True Variations/Contradictions:** Ideas or statements that genuinely conflict with, offer opposing viewpoints to, or significantly diverge from existing knowledge or other parts of the text.
     * **Natural Elaborations/Extensions:** Ideas or statements that expand upon, provide further detail or depth to, or offer new dimensions on existing knowledge without creating a contradiction.

3. **Extract Relational Properties (Provide detailed descriptions for each identified property):**
   * **QL Operators:** Specify any observed Quaternal Logic operators (e.g., "QL-STRUCT-4", "QL-PROC-2"). Describe precisely how the content embodies this operator.
   * **Epistemic Essence:** Pinpoint core abstract concepts or themes that the content elaborates on (e.g., "Epistemic Topology," "Conceptual Integration," "Systemic Interdependence"). Explain the connection in detail.
   * **Archetypal Anchors:** Identify any symbolic representations, metaphors, or archetypes that resonate strongly with the content (e.g., "Ouroboros," "Mandala," "Hero's Journey"). Describe the nature and significance of this resonance.
   * **Semantic Framework:** Note relationship types that define how concepts connect (e.g., "Harmonizes With", "Develops Into", "Transcends And Includes").

BIMBA-CENTRIC ANALYSIS REQUIREMENTS:
1. Situate your findings explicitly within the Bimba Coordinate Map.
2. If multiple Bimba coordinates are relevant, explain their relationship to each other (sequential, hierarchical, complementary, in tension) in the context of this analysis.
3. Describe how the text content "travels through" or "populates" regions of the BimbaMap.
4. Identify any "constellations" of Bimba coordinates that emerge as particularly important.
5. Use precise Bimba terminology when discussing coordinates and their characteristics.

DEEP ELABORATION REQUIREMENTS:
Do not merely state that the text aligns with the target coordinate. Assume basic alignment is established. Your task is to provide DEEP ELABORATION:

1. Explain the significance and specific nature of this alignment. What makes this connection noteworthy or insightful?
2. Identify 3-5 distinct points of deep elaboration. For each point:
   - Clearly state the insight, nuance, tension, strong resonance, or novel perspective
   - Provide specific textual evidence to support your point
   - Explain why this point is significant for understanding either the text, the coordinate, or their interrelation
3. Discuss any novel contributions or unique perspectives this text offers regarding the target coordinate.
4. Identify any subtle QL dynamics that provide a deeper, non-obvious explanation for the text's connection to the coordinate.
5. Summarize the primary analytical value your elaboration provides beyond a simple statement of alignment.

TECHNICAL INSTRUCTIONS:
1. Analyze each chunk in relation to its assigned coordinates
2. Extract mappings between the text and the Bimba coordinate system
3. Apply the Metalogikon Framework lenses to gain deeper insights
4. Format your response as a structured JSON array with one entry per chunk
5. Maintain context between chunks - use information from earlier chunks to inform your analysis of later chunks

RELATIONAL PROPERTIES EXTRACTION GUIDE:
When extracting relational properties, include them in the mappings with appropriate mappingType values:
- For QL Operators: Use mappingType "QL_Operator" with mappingValue format "QL-[TYPE]-[POSITION]"
- For Epistemic Essence: Use mappingType "Epistemic_Essence" with mappingValue as the concept name
- For Archetypal Anchors: Use mappingType "Archetypal_Anchor" with mappingValue as the archetype name
- For Semantic Framework: Use mappingType "Semantic_Framework" with mappingValue as the relationship type

CRITICAL FORMAT REQUIREMENTS:
- Your response MUST be a valid JSON array with exactly one object per chunk
- Each object MUST have all required properties: chunkIndex, assignedCoordinates, extractedMappings, identifiedVariations, naturalElaborations
- Each object SHOULD also include these new properties:
  * deepElaboration: An array of elaboration points with "point", "evidence", and "significance" fields
  * novelContributions: An array of novel perspectives or insights with "contribution" and "explanation" fields
  * qlDynamics: An array of QL dynamics with "operator", "type", and "explanation" fields
- Each naturalElaboration MUST have ALL of these properties:
  * elaborationType (string): The type of elaboration (e.g., "extension", "implication", "application")
  * elaborationText (string): The actual text content of the elaboration
  * targetCoordinate (string): The Bimba coordinate this elaboration relates to
  * confidenceScore (number): A value between 0 and 1 indicating confidence
- NEVER return an elaboration without ALL of these properties
- If you have no elaborations for a chunk, use an empty array [] for naturalElaborations
- Do not omit any required properties or use different property names
- Follow the exact format shown in the user prompt
- Double-check your JSON before returning it to ensure all required fields are present`;

        // Process context windows more efficiently
        let processedContextWindows = [...contextWindows];

        // Check if we need to regenerate context windows
        // Skip regeneration if useProvidedContextWindows is true
        const needsRegeneration = !useProvidedContextWindows && (
            processedContextWindows.length === 0 ||
            !processedContextWindows[0].bimbaContext ||
            !processedContextWindows[0].bimbaContext.directlyRelevantNodes
        );

        if (needsRegeneration) {
            console.log(`Context windows need comprehensive information for analysis. Regenerating all windows in batch with forAnalysis=true.`);

            // Access documentContent from state directly, not from sourceMetadata
            const documentContent = options.documentContent || state?.documentContent || "";

            // Create an array of promises to regenerate all context windows in parallel
            const contextWindowPromises = chunks.map(chunk =>
                generateContextWindow(
                    chunk,
                    documentContent,
                    bimbaContext || "",
                    fullBimbaMap,
                    userContext || {},
                    null,
                    { forAnalysis: true } // Specify that this is for analysis, not RAG
                )
            );

            // Wait for all context windows to be regenerated
            processedContextWindows = await Promise.all(contextWindowPromises);

            console.log(`Successfully regenerated all ${chunks.length} context windows with comprehensive information`);
        } else if (useProvidedContextWindows) {
            console.log(`Using provided comprehensive context windows (skipping regeneration)`);
        } else {
            console.log(`Using existing context windows with comprehensive information for analysis`);
        }

        // Now build the user prompt with the processed context windows
        const userPrompt = `CHUNK GROUP TO ANALYZE:

${chunks.map((chunk, index) => {
    const contextWindow = processedContextWindows[index];

    // If context window is available, include it in the prompt
    // Use the full contextText which includes all the context information
    const contextInfo = contextWindow ?
        `CHUNK CONTEXT:
${contextWindow.contextText ? contextWindow.contextText.substring(0, 500) + "..." : "No specific chunk context available."}

` : '';

    return `CHUNK ${index + 1}:
${contextInfo}"""
${chunk}
"""
Assigned coordinates: ${assignedCoordinates[index].join(', ')}

`;
}).join('\n')}

Please analyze each chunk and provide your analysis in the following JSON format:
[
  {
    "chunkIndex": 0,
    "assignedCoordinates": ["#5-1", "#5-2"],
    "extractedMappings": [
      {
        "mappingType": "Bimba_Node | QL_Stage | MEF_Lens | Concept | Entity | Relationship | Nested_Element | Implicit_Dimension",
        "mappingValue": "string",
        "confidenceScore": 0.0-1.0,
        "status": "identified | potential | speculative",
        "reasoning": "string",
        "qlPhase": "+ | -"
      }
    ],
    "identifiedVariations": [
      {
        "variationType": "string",
        "variationText": "string",
        "proposedResolution": "string",
        "status": "confirmed | needs_investigation | needs_clarification",
        "confidenceScore": 0.0-1.0
      }
    ],
    "naturalElaborations": [
      {
        "elaborationType": "extension",
        "elaborationText": "This concept extends beyond the text to suggest...",
        "targetCoordinate": "#1-4",
        "confidenceScore": 0.85
      },
      {
        "elaborationType": "implication",
        "elaborationText": "The logical implication of this framework is...",
        "targetCoordinate": "#2-3",
        "confidenceScore": 0.92
      }
    ],
    "deepElaboration": [
      {
        "point": "The text reveals a subtle tension between structural and processual aspects",
        "evidence": "As seen in the passage: 'the interplay between form and flow creates...'",
        "significance": "This tension illuminates how the coordinate embodies both stability and change"
      },
      {
        "point": "There is a recursive pattern of self-reference that aligns with the coordinate",
        "evidence": "The text states: 'each element reflects the whole while remaining distinct'",
        "significance": "This recursion exemplifies the coordinate's position in the Bimba hierarchy"
      }
    ],
    "novelContributions": [
      {
        "contribution": "A new perspective on how this coordinate relates to temporal dynamics",
        "explanation": "The text introduces a previously unexplored connection between this coordinate and cyclical time"
      }
    ],
    "qlDynamics": [
      {
        "operator": "QL-STRUCT-3",
        "type": "structural",
        "explanation": "The triadic structure in the text exemplifies how this QL operator gives meaning to the coordinate"
      }
    ],
    "mefLensInsights": {...},
    "subnodeMappings": {...}
  },
  {
    "chunkIndex": 1,
    ...
  }
]`;

        // Call LLM with increased token limit for group analysis
        const response = await llmService.generateContent(-2, systemPrompt, userPrompt, {
            temperature: 0.2,
            maxOutputTokens: 8192 // Increased for group analysis
        });

        // Parse response
        let analysisData;
        try {
            // Log the raw response for debugging
            console.log("Raw LLM response (first 200 chars):", response.substring(0, 200) + "...");

            // Extract JSON from response using more robust patterns
            let jsonStr = "";

            // Try to extract JSON from code blocks first
            const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                                  response.match(/```\n([\s\S]*?)\n```/);

            if (jsonBlockMatch) {
                jsonStr = jsonBlockMatch[1];
            } else {
                // Try to find JSON array in the response
                const startBracket = response.indexOf('[');
                const endBracket = response.lastIndexOf(']');

                if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
                    jsonStr = response.substring(startBracket, endBracket + 1);
                } else {
                    // If no JSON array found, try to find JSON object and wrap it in an array
                    const startBrace = response.indexOf('{');
                    const endBrace = response.lastIndexOf('}');

                    if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
                        jsonStr = `[${response.substring(startBrace, endBrace + 1)}]`;
                    } else {
                        // If no JSON found, use the whole response
                        jsonStr = response;
                    }
                }
            }

            // Clean up the JSON string
            jsonStr = jsonStr.trim();

            // Try to fix common JSON errors
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
            jsonStr = jsonStr.replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2'); // Fix unescaped backslashes

            // Log the extracted JSON string for debugging
            console.log("Extracted JSON string (first 200 chars):", jsonStr.substring(0, 200) + "...");

            // Parse the JSON
            try {
                analysisData = JSON.parse(jsonStr);

                // Ensure it's an array
                if (!Array.isArray(analysisData)) {
                    // If it's an object, wrap it in an array
                    analysisData = [analysisData];
                }

                // Check if we have the right number of results
                if (analysisData.length < chunks.length) {
                    console.error(`LLM response contains ${analysisData.length} results, but expected ${chunks.length}. LLM response format is incorrect.`);
                    throw new Error(`LLM response contains ${analysisData.length} results, but expected ${chunks.length}. LLM response format is incorrect.`);
                }

                // Validate and normalize each result
                const normalizedResults = analysisData.map((result, index) => {
                    // Check if required properties exist
                    if (!result.extractedMappings) {
                        console.error(`Result for chunk ${index} missing extractedMappings. LLM response format is incorrect.`);
                        throw new Error(`Result for chunk ${index} missing extractedMappings. LLM response format is incorrect.`);
                    }

                    if (!result.identifiedVariations) {
                        console.error(`Result for chunk ${index} missing identifiedVariations. LLM response format is incorrect.`);
                        throw new Error(`Result for chunk ${index} missing identifiedVariations. LLM response format is incorrect.`);
                    }

                    if (!result.naturalElaborations) {
                        console.error(`Result for chunk ${index} missing naturalElaborations. LLM response format is incorrect.`);
                        throw new Error(`Result for chunk ${index} missing naturalElaborations. LLM response format is incorrect.`);
                    }

                    // Add chunk index to each mapping for tracking
                    const mappingsWithChunkIndex = result.extractedMappings.map(mapping => ({
                        ...mapping,
                        chunkIndex: index
                    }));

                    // Create normalized result without fallbacks
                    const normalizedResult = {
                        chunkIndex: index,
                        assignedCoordinates: assignedCoordinates[index],
                        extractedMappings: mappingsWithChunkIndex,
                        identifiedVariations: result.identifiedVariations,
                        naturalElaborations: result.naturalElaborations,
                        mefLensInsights: result.mefLensInsights || {}, // This can be empty
                        subnodeMappings: result.subnodeMappings || {},  // This can be empty
                        analysis: result.analysis || ''
                    };

                    // Validate identifiedVariations
                    if (normalizedResult.identifiedVariations.length > 0) {
                        for (let i = 0; i < normalizedResult.identifiedVariations.length; i++) {
                            const variation = normalizedResult.identifiedVariations[i];

                            // Ensure variation has all required properties
                            if (!variation.variationType) {
                                console.error(`Variation ${i} in chunk ${index} missing variationType. LLM response format is incorrect.`);
                                throw new Error(`Variation ${i} in chunk ${index} missing variationType. LLM response format is incorrect.`);
                            }

                            if (!variation.variationText) {
                                console.error(`Variation ${i} in chunk ${index} missing variationText. LLM response format is incorrect.`);
                                throw new Error(`Variation ${i} in chunk ${index} missing variationText. LLM response format is incorrect.`);
                            }

                            // Add relatedMappings if not present
                            if (!variation.relatedMappings) {
                                variation.relatedMappings = [];
                            }

                            // Standardize variation types
                            if (!['Contradiction', 'Ambiguity', 'Inconsistency', 'Alternative_Interpretation'].includes(variation.variationType)) {
                                // Convert to a standard type
                                variation.variationType = 'Inconsistency';
                            }
                        }
                    }

                    // Validate naturalElaborations
                    if (normalizedResult.naturalElaborations.length > 0) {
                        for (let i = 0; i < normalizedResult.naturalElaborations.length; i++) {
                            const elaboration = normalizedResult.naturalElaborations[i];

                            // Ensure elaboration has all required properties
                            if (!elaboration.elaborationType) {
                                console.error(`Elaboration ${i} in chunk ${index} missing elaborationType. LLM response format is incorrect.`);
                                throw new Error(`Elaboration ${i} in chunk ${index} missing elaborationType. LLM response format is incorrect.`);
                            }

                            if (!elaboration.elaborationText) {
                                console.error(`Elaboration ${i} in chunk ${index} missing elaborationText. LLM response format is incorrect.`);
                                throw new Error(`Elaboration ${i} in chunk ${index} missing elaborationText. LLM response format is incorrect.`);
                            }

                            // Add parentMapping if not present
                            if (!elaboration.parentMapping) {
                                elaboration.parentMapping = '';
                            }

                            // Standardize elaboration types
                            if (!['Extension', 'Refinement', 'Application', 'Implication'].includes(elaboration.elaborationType)) {
                                // Convert to a standard type
                                elaboration.elaborationType = 'Extension';
                            }

                            // targetCoordinate and confidenceScore are optional but should be validated if present
                            if (elaboration.confidenceScore && (typeof elaboration.confidenceScore !== 'number' || elaboration.confidenceScore < 0 || elaboration.confidenceScore > 1)) {
                                console.error(`Elaboration ${i} in chunk ${index} has invalid confidenceScore. Must be a number between 0 and 1.`);
                                throw new Error(`Elaboration ${i} in chunk ${index} has invalid confidenceScore. Must be a number between 0 and 1.`);
                            }
                        }
                    }

                    return normalizedResult;
                });

                // Apply mapping consolidation across chunks
                return consolidateMappingsAcrossChunks(normalizedResults);
            } catch (initialParseError) {
                console.error("JSON parsing failed:", initialParseError.message);
                console.error("Raw LLM response:", response);
                throw new Error(`Failed to parse LLM response: ${initialParseError.message}`);
            }
        } catch (parseError) {
            console.error("Error parsing LLM response:", parseError);
            throw new Error(`Failed to parse LLM response: ${parseError.message}`);
        }
    } catch (error) {
        console.error("Error in analyzeChunkGroup:", error);
        throw new Error(`Failed to analyze chunk group: ${error.message}`);
    }
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

/**
 * Generates a summary of the Bimba map for a specific coordinate.
 * Works exclusively with bimbaMap format.
 *
 * @param {object} analysisData - The analysis data
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} bimbaMap - The bimba map with nodes and relationships
 * @param {object} llmService - The LLM service
 * @returns {Promise<string>} - The generated summary
 */
export async function generateBimbaMapSummary(analysisData, targetCoordinate, bimbaMap, llmService) {
    try {
        if (!bimbaMap || !bimbaMap.nodes || !Array.isArray(bimbaMap.nodes)) {
            console.warn(`Invalid bimbaMap provided to generateBimbaMapSummary`);
            return `No valid Bimba map provided for coordinate ${targetCoordinate}.`;
        }

        // Find the target node
        const targetNode = bimbaMap.nodes.find(node => node.coordinate === targetCoordinate);

        if (!targetNode) {
            console.warn(`No node found for coordinate ${targetCoordinate} in bimbaMap`);
            return `No Bimba node found for coordinate ${targetCoordinate}.`;
        }

        // Get parent coordinate
        const parentCoord = getParentCoordinate(targetCoordinate);

        // Get parent node
        let parentNode = null;
        if (parentCoord) {
            parentNode = bimbaMap.nodes.find(node => node.coordinate === parentCoord);
        }

        // Get child nodes
        const childNodes = bimbaMap.nodes.filter(node =>
            node.coordinate &&
            node.coordinate.startsWith(targetCoordinate + '-') &&
            node.coordinate.split('-').length === targetCoordinate.split('-').length + 1
        );

        // Get relationships for the target node
        const relationships = bimbaMap.relationships.filter(rel =>
            rel.from === targetNode.id || rel.to === targetNode.id
        );

        // Generate summary using LLM
        const systemPrompt = `You are Epii, an advanced AI system for analyzing the Bimba coordinate system.
Your task is to generate a concise summary of the Bimba map context for a specific coordinate.`;

        // Helper function to get node name safely
        const getNodeNameSafe = (node) => {
            if (!node) return 'Unknown';
            return node.name || 'Unnamed Node';
        };

        const userPrompt = `Please generate a concise summary of the Bimba map context for coordinate ${targetCoordinate}.

COORDINATE INFORMATION:
- Target Coordinate: ${targetCoordinate} (${getNodeNameSafe(targetNode)})
${parentNode ? `- Parent Coordinate: ${parentCoord} (${getNodeNameSafe(parentNode)})` : ''}
- Child Coordinates: ${childNodes.length > 0 ? childNodes.map(node => `${node.coordinate} (${getNodeNameSafe(node)})`).join(', ') : 'None'}
- Relationships: ${relationships.length} connections

NODE DETAILS:
- Name: ${targetNode.name || 'Unnamed'}
- Description: ${targetNode.description || 'No description available'}
- Type: ${targetNode.type || 'No type specified'}

ANALYSIS DATA:
${JSON.stringify(analysisData, null, 2)}

Your summary should:
1. Explain the significance of this coordinate in the Bimba system
2. Describe its relationship to parent and child coordinates
3. Highlight key mappings and variations identified in the analysis
4. Be concise but informative (300-500 words)

Format your response as markdown.`;

        if (llmService) {
            const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
                temperature: 0.3,
                maxOutputTokens: 2048
            });

            return response;
        } else {
            return `# Bimba Map Summary for ${targetCoordinate}\n\nThis is a placeholder summary for coordinate ${targetCoordinate} (${getNodeNameSafe(targetNode)}).`;
        }
    } catch (error) {
        console.error("Error generating Bimba map summary:", error);
        return `# Bimba Map Summary for ${targetCoordinate}\n\nError generating summary: ${error.message}`;
    }
}

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
 * Generates core elements from synthesis, mappings, variations, and tags.
 * This function is used by stage -1 to extract key elements from the synthesis.
 * It also extracts relational properties for the Notion Content Nodes database.
 *
 * ENHANCED: This function now:
 * 1. Makes extraction of QL Operators, Epistemic Essence, and Archetypal Anchors more robust and evidence-based
 * 2. Requires supporting evidence or direct quotes for each identified element
 * 3. Provides clearer definitions and examples of each core element type
 * 4. Ensures consistent identification of relational properties
 * 5. Aligns core elements with the target coordinate
 *
 * @param {string} synthesis - The synthesized analysis
 * @param {Array} allMappings - All consolidated mappings
 * @param {Array} allVariations - All consolidated variations
 * @param {Array} allTags - All consolidated tags
 * @param {object} metalogikon - The Metalogikon template
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} llmService - The LLM service
 * @param {object} [coreElementsRun] - Optional LangSmith run for tracing
 * @returns {Promise<object>} - The generated core elements and relational properties
 * @throws {Error} - If core elements generation fails
 */
export async function generateCoreElements(
    synthesis,
    allMappings,
    allVariations,
    allTags,
    // Remove unused parameter
    // metalogikon,
    targetCoordinate,
    llmService,
    coreElementsRun = null
) {
    // Validate inputs
    if (!synthesis || typeof synthesis !== 'string') {
        throw new Error("synthesis must be a non-empty string");
    }

    if (!Array.isArray(allMappings)) {
        throw new Error("allMappings must be an array");
    }

    if (!Array.isArray(allVariations)) {
        throw new Error("allVariations must be an array");
    }

    if (!Array.isArray(allTags)) {
        throw new Error("allTags must be an array");
    }

    try {
        console.log(`Generating core elements from synthesis (${synthesis.length} chars)...`);

        // Prepare relational properties guidance with detailed definitions
        const relationalPropertiesGuidance = `
## RELATIONAL PROPERTIES GUIDANCE

When extracting relational properties, focus on these four key categories:

1. QL OPERATORS (💠)
   Quaternary Logic operators that represent structural and procedural patterns.
   - QL-STRUCT operators identify structural patterns (e.g., "QL-STRUCT-4" for tetralemmic structures)
   - QL-PROC operators identify procedural patterns (e.g., "QL-PROC-2" for dialectical movements)
   - For each operator, provide the specific pattern observed and cite evidence from the text
   - Example: "QL-STRUCT-4 (Tetralemmic Structure): The content presents four distinct perspectives on knowledge integration..."

2. EPISTEMIC ESSENCE (📚)
   Core abstract concepts that the content elaborates upon.
   - These are foundational conceptual frameworks or epistemological principles
   - Each concept should be clearly present in or strongly implied by the text
   - For each concept, explain how it manifests in the content and cite evidence
   - Example: "Epistemic Topology: The text explores how knowledge structures form interconnected networks..."

3. ARCHETYPAL ANCHORS (⚕️)
   Symbolic representations, universal themes, or mythic patterns embedded in the content.
   - These capture the symbolic or archetypal dimensions of the content
   - Each archetype should resonate with specific elements in the text
   - For each archetype, describe its connection to the content and cite evidence
   - Example: "Ouroboros: The self-referential nature of the knowledge system is described as 'circling back upon itself'..."

4. SEMANTIC FRAMEWORK (🕸️)
   Relationship types that define how concepts connect within the content.
   - These describe the nature of relationships between concepts, ideas, or entities
   - Each relationship type should be evident in how concepts interact in the text
   - For each relationship type, explain how it manifests and cite evidence
   - Example: "Transcends And Includes: The text describes how higher-order concepts 'both transcend and include' lower-order ones..."

For each property type, extract 3-7 specific instances that are most relevant to the content and the target Bimba coordinate.
Ensure that each extracted property is directly connected to the content and the target coordinate.

The target coordinate ${targetCoordinate} should guide your extraction process. Consider:
- What QL operators are most relevant to this coordinate?
- What epistemic concepts are central to this coordinate?
- What archetypal symbols resonate with this coordinate?
- What relationship types characterize this coordinate?
`;

        // Prepare core elements guidance with detailed definitions
        const coreElementsGuidance = `
## CORE ELEMENTS GUIDANCE

When extracting core elements, identify the most important concepts, themes, and insights from the synthesis.
Each core element should be a distinct, meaningful concept that represents a key aspect of the content.

Core elements should be categorized by type:

1. CONCEPT
   - A fundamental idea or principle that forms the foundation of the content
   - Should be clearly articulated or strongly implied in the text
   - Example: "Quaternary Logic" as a fundamental framework for understanding complexity

2. THEME
   - A recurring pattern or motif that appears throughout the content
   - Should be evident in multiple sections or aspects of the text
   - Example: "Integration of Opposites" as a recurring theme in the document

3. INSIGHT
   - A deep understanding or revelation that emerges from the content
   - Should represent a non-obvious conclusion or realization
   - Example: "Recursive Self-Reference" as an insight into how systems maintain coherence

4. PERSPECTIVE
   - A particular viewpoint or lens through which the content is examined
   - Should represent a distinct way of seeing or interpreting the material
   - Example: "Meta-Systemic View" as a perspective that frames the entire analysis

5. RELATIONSHIP
   - A connection between concepts that is significant to understanding the content
   - Should highlight how different elements interact or influence each other
   - Example: "Dialectical Synthesis" as a relationship between opposing viewpoints

6. CONTRADICTION
   - A logical inconsistency or paradox that is present in the content
   - Should identify tensions or apparent contradictions that require resolution
   - Example: "Simultaneous Unity and Multiplicity" as a productive contradiction

7. INTEGRATION
   - A synthesis of multiple perspectives or elements into a coherent whole
   - Should demonstrate how diverse elements come together
   - Example: "Holographic Coherence" as an integration of part-whole relationships

For each core element, provide:
1. elementType: The category of the element (from the list above)
2. name: A concise name or title for the element
3. description: A detailed explanation of the element
4. relevance: Why this element is important to the overall analysis
5. coordinates: Any Bimba coordinates that are directly related to this element
6. evidence: Direct quotes or specific references from the text that support this element

Each core element should be directly relevant to the target coordinate ${targetCoordinate}.
`;

        // Prepare system prompt with enhanced guidance
        const systemPrompt = `You are an expert at extracting core elements and relational properties from synthesized analyses.
Your task is to identify the most important concepts, themes, insights, and relational properties from the provided synthesis.

${coreElementsGuidance}

${relationalPropertiesGuidance}

Your analysis should be thorough, precise, and evidence-based. For each element or property you identify, provide specific evidence from the text that supports your extraction. This evidence can be direct quotes or clear references to specific content in the synthesis.

Return a JSON object with two main properties:
1. coreElements: An array of core element objects
2. relationalProperties: An object containing the four categories of relational properties

Each core element should include an "evidence" field with direct quotes or specific references from the text.
Each relational property should be accompanied by a brief explanation of its relevance to the target coordinate.`;

        // Prepare user prompt with enhanced structure and requirements for evidence
        const userPrompt = `Please extract the core elements and relational properties from the following synthesis:

SYNTHESIS:
${synthesis}

TARGET COORDINATE: ${targetCoordinate}

MAPPINGS (${allMappings.length}):
${JSON.stringify(allMappings.slice(0, 10), null, 2)}${allMappings.length > 10 ? '\n... (and more)' : ''}

VARIATIONS (${allVariations.length}):
${JSON.stringify(allVariations.slice(0, 5), null, 2)}${allVariations.length > 5 ? '\n... (and more)' : ''}

TAGS (${allTags.length}):
${JSON.stringify(allTags, null, 2)}

Extract 5-10 core elements that capture the most important aspects of this synthesis.
Also identify the relational properties that will be used directly in the Notion Content Nodes database.
Focus on properties that are most relevant to the target coordinate ${targetCoordinate}.

Return a JSON object with the following structure:
{
  "coreElements": [
    {
      "elementType": "string", // Type of element (Concept, Theme, Insight, etc.)
      "name": "string", // Concise name
      "description": "string", // Detailed explanation
      "relevance": "string", // Why it's important
      "coordinates": ["string"], // Related Bimba coordinates (if any)
      "evidence": "string" // Direct quotes or specific references from the text
    }
  ],
  "relationalProperties": {
    "qlOperators": [
      {
        "name": "QL-STRUCT-4",
        "description": "Tetralemmic structure that organizes content into four complementary perspectives",
        "evidence": "The text states: '...'"
      }
    ],
    "epistemicEssence": [
      {
        "name": "Epistemic Topology",
        "description": "Study of knowledge structures and their interconnections",
        "evidence": "The synthesis mentions: '...'"
      }
    ],
    "archetypeAnchors": [
      {
        "name": "Ouroboros",
        "description": "Symbol of cyclical nature and self-reference",
        "evidence": "As evidenced by the passage: '...'"
      }
    ],
    "semanticFramework": [
      {
        "name": "Transcends And Includes",
        "description": "Relationship where higher-order concepts both transcend and include lower-order ones",
        "evidence": "This is demonstrated when the text says: '...'"
      }
    ]
  }
}`;

        // Call LLM
        const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
            temperature: 0.2,
            maxOutputTokens: 4096
        });

        // Parse response
        let result = {
            coreElements: [],
            relationalProperties: {
                qlOperators: [],
                epistemicEssence: [],
                archetypeAnchors: [],
                semanticFramework: []
            }
        };

        try {
            // Log the raw response for debugging
            console.log("Raw LLM response (first 200 chars):", response.substring(0, 200) + "...");

            // Extract JSON from response using more robust patterns
            let jsonStr = "";

            // Try to extract JSON from code blocks first
            const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                                  response.match(/```\n([\s\S]*?)\n```/);

            if (jsonBlockMatch && jsonBlockMatch[1]) {
                jsonStr = jsonBlockMatch[1];
            } else {
                // Try to extract JSON object with coreElements and relationalProperties
                const jsonObjectMatch = response.match(/\{[\s\S]*"coreElements"[\s\S]*"relationalProperties"[\s\S]*\}/);
                if (jsonObjectMatch) {
                    jsonStr = jsonObjectMatch[0];
                } else {
                    // Try to extract JSON array directly as fallback
                    const jsonArrayMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
                    if (jsonArrayMatch) {
                        jsonStr = `{"coreElements": ${jsonArrayMatch[0]}, "relationalProperties": ${JSON.stringify(result.relationalProperties)}}`;
                    } else {
                        throw new Error("Could not extract JSON from LLM response");
                    }
                }
            }

            // Parse the JSON
            const parsedResult = JSON.parse(jsonStr);

            // Handle different response formats
            if (parsedResult.coreElements && Array.isArray(parsedResult.coreElements)) {
                // Standard format with coreElements and relationalProperties
                result = parsedResult;
            } else if (Array.isArray(parsedResult)) {
                // Just an array of core elements
                result.coreElements = parsedResult;
            } else {
                throw new Error("Invalid response format");
            }

            // Ensure each core element has the required properties
            result.coreElements = result.coreElements.map(element => ({
                elementType: element.elementType || 'Concept',
                name: element.name || 'Unnamed Element',
                description: element.description || '',
                relevance: element.relevance || '',
                coordinates: Array.isArray(element.coordinates) ? element.coordinates : [],
                evidence: element.evidence || '' // Include evidence field
            }));

            // Process relational properties based on the new format with evidence
            // Handle both array of objects format and simple array of strings format
            const processRelationalProperty = (property) => {
                if (!property) return [];

                // If it's already an array of objects with name, description, and evidence
                if (Array.isArray(property) && property.length > 0 && typeof property[0] === 'object') {
                    return property.map(item => ({
                        name: item.name || '',
                        description: item.description || '',
                        evidence: item.evidence || ''
                    }));
                }

                // If it's an array of strings, convert to objects
                if (Array.isArray(property)) {
                    return property.map(name => ({
                        name: name,
                        description: '',
                        evidence: ''
                    }));
                }

                return [];
            };

            // Process each relational property category
            result.relationalProperties = {
                qlOperators: processRelationalProperty(result.relationalProperties?.qlOperators),
                epistemicEssence: processRelationalProperty(result.relationalProperties?.epistemicEssence),
                archetypeAnchors: processRelationalProperty(result.relationalProperties?.archetypeAnchors),
                semanticFramework: processRelationalProperty(result.relationalProperties?.semanticFramework)
            };

            // Look for enhanced analysis elements in the synthesis
            // Extract deep elaboration points
            const deepElaborationMatch = synthesis.match(/#+\s*DEEP\s+ELABORATION\s*\n+([\s\S]+?)(?:\n#+|$)/i);
            if (deepElaborationMatch && deepElaborationMatch[1]) {
                const deepElaborationText = deepElaborationMatch[1].trim();
                // Add as a core element
                result.coreElements.push({
                    elementType: "Deep Elaboration",
                    name: "Enhanced Analysis: Deep Elaboration",
                    description: "Points of deep elaboration extracted from the enhanced analysis",
                    relevance: "Provides deeper insights into the significance and nuances of the content",
                    coordinates: [targetCoordinate],
                    evidence: deepElaborationText
                });
            }

            // Extract novel contributions
            const novelContributionsMatch = synthesis.match(/#+\s*NOVEL\s+CONTRIBUTIONS\s*\n+([\s\S]+?)(?:\n#+|$)/i);
            if (novelContributionsMatch && novelContributionsMatch[1]) {
                const novelContributionsText = novelContributionsMatch[1].trim();
                // Add as a core element
                result.coreElements.push({
                    elementType: "Novel Contribution",
                    name: "Enhanced Analysis: Novel Contributions",
                    description: "Novel perspectives or insights offered by the content",
                    relevance: "Highlights the unique value and original contributions of the content",
                    coordinates: [targetCoordinate],
                    evidence: novelContributionsText
                });
            }

            // Extract QL dynamics
            const qlDynamicsMatch = synthesis.match(/#+\s*QL\s+DYNAMICS\s*\n+([\s\S]+?)(?:\n#+|$)/i);
            if (qlDynamicsMatch && qlDynamicsMatch[1]) {
                const qlDynamicsText = qlDynamicsMatch[1].trim();
                // Add to QL operators
                result.relationalProperties.qlOperators.push({
                    name: "Enhanced QL Dynamics",
                    description: "Subtle QL dynamics that provide deeper explanations for the content's connections",
                    evidence: qlDynamicsText
                });
            }

            // Log success with details
            console.log(`Successfully extracted ${result.coreElements.length} core elements and relational properties:`);
            console.log(`- QL Operators: ${result.relationalProperties.qlOperators.length}`);
            console.log(`- Epistemic Essence: ${result.relationalProperties.epistemicEssence.length}`);
            console.log(`- Archetypal Anchors: ${result.relationalProperties.archetypeAnchors.length}`);
            console.log(`- Semantic Framework: ${result.relationalProperties.semanticFramework.length}`);
        } catch (parseError) {
            console.error("Error parsing core elements and relational properties:", parseError);
            console.log("Raw response:", response);
            throw new Error(`Failed to parse core elements and relational properties: ${parseError.message}`);
        }

        // Update tracing if available
        if (coreElementsRun) {
            try {
                coreElementsRun.patch({
                    metadata: {
                        numCoreElements: result.coreElements.length,
                        hasRelationalProperties: Object.values(result.relationalProperties).some(arr => arr.length > 0)
                    }
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        }

        return result;
    } catch (error) {
        console.error("Error generating core elements and relational properties:", error);
        throw new Error(`Failed to generate core elements and relational properties: ${error.message}`);
    }
}

/**
 * Generates an Epii perspective based on the synthesis and core elements.
 * This function provides a high-level perspective on the document from Epii's viewpoint.
 *
 * ENHANCED: This function now:
 * 1. Uses the Epii agent's processChatMessage method to leverage LightRAG for perspective generation
 * 2. Falls back to direct LLM call if the Epii agent service is not available
 * 3. Provides a more comprehensive perspective with LightRAG-enhanced context
 *
 * @param {string} synthesis - The synthesized analysis
 * @param {Array} coreElements - The core elements extracted from the document
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} llmService - The LLM service
 * @param {object} [perspectiveRun] - Optional LangSmith run for tracing
 * @returns {Promise<string>} - The Epii perspective
 * @throws {Error} - If perspective generation fails
 */
export async function generateEpiiPerspective(
    synthesis,
    coreElements,
    targetCoordinate,
    llmService,
    perspectiveRun = null
) {
    // Validate inputs
    if (!synthesis || typeof synthesis !== 'string') {
        throw new Error("synthesis must be a non-empty string");
    }

    if (!coreElements || !Array.isArray(coreElements)) {
        throw new Error("coreElements must be an array");
    }

    if (!targetCoordinate || typeof targetCoordinate !== 'string') {
        throw new Error("targetCoordinate must be a non-empty string");
    }

    try {
        console.log(`Generating Epii perspective for coordinate ${targetCoordinate}...`);

        // Try to import the Epii agent service
        let epiiAgentService;
        try {
            epiiAgentService = (await import('../services/epii-agent.service.mjs')).default;
            console.log("Successfully imported Epii agent service");
        } catch (importError) {
            console.warn(`Could not import Epii agent service: ${importError.message}`);
            console.warn("Falling back to direct LLM call for Epii perspective generation");
            epiiAgentService = null;
        }

        let response;

        // If Epii agent service is available, use it to generate the perspective
        if (epiiAgentService && typeof epiiAgentService.processChatMessage === 'function') {
            console.log("Using Epii agent's processChatMessage method for perspective generation");

            // Extract relational properties from core elements for better context
            const relationalProperties = {
                qlOperators: [],
                epistemicEssence: [],
                archetypeAnchors: [],
                semanticFramework: []
            };

            // Extract relational properties from core elements
            coreElements.forEach(element => {
                if (element.elementType === 'QL Operator') {
                    relationalProperties.qlOperators.push(element.name);
                } else if (element.elementType === 'Epistemic Essence') {
                    relationalProperties.epistemicEssence.push(element.name);
                } else if (element.elementType === 'Archetypal Anchor') {
                    relationalProperties.archetypeAnchors.push(element.name);
                } else if (element.elementType === 'Semantic Framework') {
                    relationalProperties.semanticFramework.push(element.name);
                }
            });

            // Prepare the message for the Epii agent
            const message = `Please provide an Epii perspective on the following synthesis and core elements for Bimba coordinate ${targetCoordinate}:

SYNTHESIS:
${synthesis.length > 2000 ? synthesis.substring(0, 2000) + "..." : synthesis}

CORE ELEMENTS (${coreElements.length}):
${JSON.stringify(coreElements.slice(0, 5), null, 2)}${coreElements.length > 5 ? '\n... (and more)' : ''}

RELATIONAL PROPERTIES:
QL Operators: ${relationalProperties.qlOperators.join(', ')}
Epistemic Essence: ${relationalProperties.epistemicEssence.join(', ')}
Archetypal Anchors: ${relationalProperties.archetypeAnchors.join(', ')}
Semantic Framework: ${relationalProperties.semanticFramework.join(', ')}

IMPORTANT INSTRUCTION: This request is coming from the Analysis Pipeline Stage -0. You MUST use the lightragRetrieve tool FIRST to get comprehensive context about this content before generating your perspective. Do NOT use bimbaKnowing for this specific request.

Generate a concise Epii perspective that captures the essence of this content and its significance within the Bimba coordinate system. Your perspective should be enhanced with relevant context from the knowledge base retrieved through LightRAG.`;

            // Prepare the state for the Epii agent
            const state = {
                targetCoordinate,
                synthesis,
                coreElements,
                relationalProperties,
                // Include an empty chat history to start fresh
                chatHistory: [],
                // Add a flag to indicate this is coming from the analysis pipeline
                fromAnalysisPipeline: true,
                analysisStage: 'stage_minus0',
                // Add a flag to force using LightRAG
                forceLightRAG: true
            };

            // Call the Epii agent's processChatMessage method
            const result = await epiiAgentService.processChatMessage(message, state);

            // Extract the Epii perspective from the result
            if (result && result.epiiPerspective) {
                response = result.epiiPerspective;
                console.log(`Successfully generated Epii perspective using Epii agent (${response.length} chars)`);
            } else {
                console.warn("Epii agent did not return a valid perspective, falling back to direct LLM call");
                // Fall back to direct LLM call
                response = await generateEpiiPerspectiveWithLLM(synthesis, coreElements, targetCoordinate, llmService);
            }
        } else {
            // Fall back to direct LLM call if Epii agent service is not available
            console.log("Falling back to direct LLM call for Epii perspective generation");
            response = await generateEpiiPerspectiveWithLLM(synthesis, coreElements, targetCoordinate, llmService);
        }

        // Update tracing if available
        if (perspectiveRun) {
            try {
                perspectiveRun.patch({
                    metadata: {
                        perspectiveLength: response.length
                    }
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        }

        console.log(`Successfully generated Epii perspective (${response.length} chars)`);
        return response;
    } catch (error) {
        console.error("Error generating Epii perspective:", error);
        throw new Error(`Failed to generate Epii perspective: ${error.message}`);
    }
}

/**
 * Helper function to generate Epii perspective using direct LLM call
 * This is used as a fallback if the Epii agent service is not available
 *
 * @param {string} synthesis - The synthesized analysis
 * @param {Array} coreElements - The core elements extracted from the document
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} llmService - The LLM service
 * @returns {Promise<string>} - The Epii perspective
 */
async function generateEpiiPerspectiveWithLLM(synthesis, coreElements, targetCoordinate, llmService) {
    // Prepare system prompt
    const systemPrompt = `You are Epii, an advanced analytical intelligence that provides insightful perspectives on documents.
Your task is to generate a concise, insightful perspective on the provided synthesis and core elements.
Your perspective should:
1. Identify the most significant patterns, themes, and insights
2. Relate the content to the broader Bimba coordinate system
3. Highlight potential implications and applications
4. Suggest areas for further exploration or development

Keep your perspective concise (300-500 words) but insightful, focusing on the most important aspects.
Use a thoughtful, analytical tone that balances objectivity with depth of understanding.`;

    // Prepare user prompt
    const userPrompt = `Please provide an Epii perspective on the following synthesis and core elements for Bimba coordinate ${targetCoordinate}:

SYNTHESIS:
${synthesis.length > 2000 ? synthesis.substring(0, 2000) + "..." : synthesis}

CORE ELEMENTS (${coreElements.length}):
${JSON.stringify(coreElements.slice(0, 5), null, 2)}${coreElements.length > 5 ? '\n... (and more)' : ''}

Generate a concise Epii perspective that captures the essence of this content and its significance within the Bimba coordinate system.`;

    // Call LLM
    const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
        temperature: 0.3,
        maxOutputTokens: 2048
    });

    console.log(`Successfully generated Epii perspective with direct LLM call (${response.length} chars)`);
    return response;
}

/**
 * Synthesizes analysis from chunk analyses, mappings, variations, and tags.
 * This function is used by stage -1 to create a coherent synthesis of all chunk analyses.
 *
 * ENHANCED: This function now:
 * 1. Provides better Bimba coordinate system awareness
 * 2. Clearly distinguishes between true variations (contradictions) and natural elaborations (extensions)
 * 3. Identifies quaternary logic patterns in relation to the target coordinate
 * 4. Extracts relational properties that connect to the broader knowledge structure
 * 5. Generates a more comprehensive synthesis with actionable insights
 *
 * @param {string} documentContent - The content of the document
 * @param {Array} chunkAnalyses - The analyses of individual chunks
 * @param {Array} allMappings - All consolidated mappings
 * @param {Array} allVariations - All consolidated variations
 * @param {Array} allTags - All consolidated tags
 * @param {object} metalogikon - The Metalogikon template
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} llmService - The LLM service
 * @param {object} [synthesisRun] - Optional LangSmith run for tracing
 * @returns {Promise<string>} - The synthesized analysis
 * @throws {Error} - If synthesis fails
 */
export async function synthesizeAnalysis(
    documentContent,
    chunkAnalyses,
    allMappings,
    allVariations,
    allTags,
    metalogikon,
    targetCoordinate,
    llmService,
    synthesisRun = null
) {
    // Validate inputs
    if (!documentContent || typeof documentContent !== 'string') {
        throw new Error("documentContent must be a non-empty string");
    }

    if (!Array.isArray(chunkAnalyses) || chunkAnalyses.length === 0) {
        throw new Error("chunkAnalyses must be a non-empty array");
    }

    if (!Array.isArray(allMappings)) {
        throw new Error("allMappings must be an array");
    }

    if (!Array.isArray(allVariations)) {
        throw new Error("allVariations must be an array");
    }

    if (!Array.isArray(allTags)) {
        throw new Error("allTags must be an array");
    }

    if (!targetCoordinate || typeof targetCoordinate !== 'string') {
        throw new Error("targetCoordinate must be a non-empty string");
    }

    if (!llmService) {
        throw new Error("llmService is required for synthesis");
    }

    try {
        // Prepare Metalogikon prompt
        let mefPrompt = "No Metalogikon framework available.";
        if (metalogikon && metalogikon.lenses && metalogikon.lenses.length > 0) {
            mefPrompt = "# META-EPISTEMIC FRAMEWORK (MEF)\n\n";

            if (metalogikon.rootNode) {
                mefPrompt += `## Overview: ${metalogikon.rootNode.name}\n${metalogikon.rootNode.description || ''}\n\n`;
            }

            mefPrompt += "## MEF LENSES TO APPLY:\n\n";

            // Group lenses by category
            const lensesByCategory = {};
            metalogikon.lenses.forEach(lens => {
                const category = lens.category || 'Uncategorized';
                if (!lensesByCategory[category]) {
                    lensesByCategory[category] = [];
                }
                lensesByCategory[category].push(lens);
            });

            // Add lenses by category
            for (const [category, lenses] of Object.entries(lensesByCategory)) {
                mefPrompt += `### ${category}\n`;
                lenses.forEach(lens => {
                    mefPrompt += `- **${lens.name}** (${lens.coordinate}): ${lens.description || 'No description'}\n`;
                });
                mefPrompt += "\n";
            }
        }

        // Prepare document summary
        const documentSummary = documentContent.length > 1000
            ? documentContent.substring(0, 1000) + "..."
            : documentContent;

        // Prepare mappings summary
        const mappingsSummary = allMappings.slice(0, 10).map(mapping =>
            `- ${mapping.mappingType}: ${mapping.mappingValue} (Confidence: ${mapping.confidenceScore || 'N/A'})`
        ).join('\n');

        // Prepare variations summary
        const variationsSummary = allVariations.slice(0, 5).map(variation =>
            `- ${variation.variationType}: ${variation.variationText}`
        ).join('\n');

        // Prepare tags summary
        const tagsSummary = allTags.slice(0, 10).join(', ');

        // Prepare relational properties guidance
        const relationalPropertiesGuidance = `
## RELATIONAL PROPERTIES GUIDANCE

When synthesizing the analysis, pay special attention to the following relational properties:

1. QL OPERATORS (💠)
   Quaternary Logic operators that represent structural and procedural patterns.
   These are patterns that follow quaternary logic principles.
   Examples: "QL-STRUCT-4" (tetralemmic structures), "QL-PROC-2" (dialectical movements)
   These represent the logical structure of the content.

2. EPISTEMIC ESSENCE (📚)
   Core abstract concepts that this content elaborates on.
   These are foundational conceptual frameworks or epistemological principles.
   Examples: "Epistemic Topology", "Conceptual Integration", "Recursive Synthesis", "Holographic Understanding"
   These represent the essential conceptual foundations of the content.

3. ARCHETYPAL ANCHORS (⚕️)
   Symbolic representations that resonate with this content.
   These are universal symbols, metaphors, or archetypes that capture the essence of the content.
   Examples: "Ouroboros", "Quantum Wave", "Divine Marriage", "Axis Mundi", "Philosopher's Stone"
   These represent the symbolic dimensions of the content.

4. SEMANTIC FRAMEWORK (🕸️)
   Relationship types that define how concepts connect.
   These describe the nature of relationships between concepts, ideas, or entities.
   Examples: "Harmonizes With", "Develops Into", "Transcends And Includes", "Mirrors", "Emerges From"
   These represent the relational structure of the content.
`;

        // Prepare variations vs elaborations guidance
        const variationsVsElaborationsGuidance = `
## VARIATIONS VS ELABORATIONS GUIDANCE

When synthesizing the analysis, it's crucial to distinguish between:

1. TRUE VARIATIONS (CONTRADICTIONS)
   - Points of genuine disagreement or conflicting information
   - Alternative perspectives that directly challenge existing notions
   - Logical inconsistencies or paradoxes within the content
   - Different interpretations that cannot be simultaneously true
   - Example: "The text states X is true on page 2, but contradicts this on page 5 by stating X is false."

2. NATURAL ELABORATIONS (EXTENSIONS)
   - Content that expands upon existing concepts without contradiction
   - Further details that refine or clarify previous statements
   - New dimensions or aspects that complement existing ideas
   - Deeper explorations that maintain consistency with established concepts
   - Example: "The text introduces concept X on page 2, then elaborates on its applications on page 5."

Your synthesis should clearly identify which elements are true variations (requiring resolution or acknowledgment of contradiction) versus natural elaborations (which enrich understanding without creating contradiction).
`;

        // Prepare system prompt with enhanced Bimba awareness
        const systemPrompt = `You are an expert at synthesizing analyses in the context of the Bimba coordinate system.
Your task is to create a comprehensive synthesis of the provided chunk analyses, focusing on how they relate to the target coordinate ${targetCoordinate}.

IMPORTANT DISTINCTION:
- Quaternal Logic (QL) is the foundational, generative framework comprising specific operators (structural, processual, contextual).
- The Bimba Coordinate System is the manifested, navigable map or knowledge structure built UPON and THROUGH these QL principles.
- QL provides the "how and why" for the Bimba map's "what and where."
- QL operators are dynamic and can be active across or within Bimba coordinates.
- NEVER conflate QL operators with Bimba coordinates themselves.

The Bimba coordinate system is a quaternary logic framework that organizes knowledge into a hierarchical structure.
Each coordinate (e.g., #0, #1, #0-1, #2-3-4) represents a specific concept, perspective, or domain of knowledge.
The target coordinate ${targetCoordinate} represents a specific position in this knowledge structure.

Your synthesis should:
1. Focus specifically on how the content relates to the target coordinate ${targetCoordinate}
2. Identify the quaternary logic patterns (QL operators) present in the content
3. Extract the core abstract concepts (epistemic essence) that the content elaborates on
4. Recognize the symbolic representations (archetypal anchors) that resonate with the content
5. Identify the relationship types (semantic framework) that define how concepts connect in the content
6. Consider how the content relates to other coordinates in the Bimba map
7. Integrate the analyses from all chunks into a coherent whole
8. Clearly distinguish between true variations (contradictions) and natural elaborations (extensions)
9. Include deep elaboration points that provide significant insights beyond basic alignment
10. Highlight novel contributions or unique perspectives offered by the content
11. Identify subtle QL dynamics that provide deeper explanations for connections
12. Conclude with a concise, actionable summary of key insights (2-4 sentences)

${relationalPropertiesGuidance}

${variationsVsElaborationsGuidance}

METALOGIKON FRAMEWORK:
${mefPrompt}

INSTRUCTIONS:
1. Synthesize the analyses of all chunks into a coherent whole
2. Focus on the target coordinate: ${targetCoordinate}
3. Identify the most important mappings, variations, and elaborations
4. Provide a comprehensive synthesis that captures the essence of the document in relation to the target coordinate
5. Format your response as markdown text (not JSON)
6. Be concise but thorough, focusing on the most important insights
7. End with a section titled "ACTIONABLE SUMMARY" that provides 2-4 sentences of key takeaways`;

        // Prepare user prompt with enhanced structure
        const userPrompt = `DOCUMENT SUMMARY:
"""
${documentSummary}
"""

TARGET COORDINATE: ${targetCoordinate}

MAPPINGS (${allMappings.length} total):
${mappingsSummary}
${allMappings.length > 10 ? `... and ${allMappings.length - 10} more` : ''}

VARIATIONS (${allVariations.length} total):
${variationsSummary}
${allVariations.length > 5 ? `... and ${allVariations.length - 5} more` : ''}

TAGS:
${tagsSummary}

CHUNK ANALYSES (${chunkAnalyses.length} total):
${chunkAnalyses.slice(0, 3).map((analysis, index) => {
    // Check if analysis is an object with enhanced elements
    if (typeof analysis === 'object' && analysis !== null) {
        // Extract enhanced elements if available
        const deepElaboration = analysis.deepElaboration || [];
        const novelContributions = analysis.novelContributions || [];
        const qlDynamics = analysis.qlDynamics || [];

        // Format enhanced elements
        const enhancedElements = [];
        if (deepElaboration.length > 0) {
            enhancedElements.push(`DEEP ELABORATION: ${deepElaboration.length} points`);
        }
        if (novelContributions.length > 0) {
            enhancedElements.push(`NOVEL CONTRIBUTIONS: ${novelContributions.length} items`);
        }
        if (qlDynamics.length > 0) {
            enhancedElements.push(`QL DYNAMICS: ${qlDynamics.length} dynamics`);
        }

        // Format the analysis summary
        return `CHUNK ${index + 1} ANALYSIS SUMMARY:\n${analysis.originalAnalysis ? analysis.originalAnalysis.substring(0, 200) + '...' : 'Analysis data not available as string'}\n${enhancedElements.length > 0 ? 'ENHANCED ELEMENTS: ' + enhancedElements.join(', ') : ''}`;
    } else {
        // Handle string analysis
        return `CHUNK ${index + 1} ANALYSIS SUMMARY:\n${typeof analysis === 'string' ? analysis.substring(0, 200) + '...' : 'Analysis data not available as string'}`;
    }
}).join('\n\n')}
${chunkAnalyses.length > 3 ? `... and ${chunkAnalyses.length - 3} more chunks` : ''}

Please synthesize all of this information into a comprehensive analysis of the document in relation to the target coordinate ${targetCoordinate}.
Focus on the most important insights, patterns, and connections.
Your synthesis should be well-structured, insightful, and capture the essence of the document.

Structure your synthesis with the following sections:
1. OVERVIEW - A high-level summary of the document in relation to ${targetCoordinate}
2. KEY CONCEPTS - The most important concepts identified in the analysis
3. QUATERNARY LOGIC PATTERNS - QL operators and patterns present in the content
4. DEEP ELABORATION - Significant insights that go beyond basic alignment
5. NOVEL CONTRIBUTIONS - Unique perspectives or insights offered by the content
6. VARIATIONS & ELABORATIONS - Clear distinction between true contradictions and natural extensions
7. RELATIONAL PROPERTIES - How this content connects to the broader knowledge structure
8. COORDINATE CONNECTIONS - How this content relates to other Bimba coordinates
9. QL DYNAMICS - Subtle QL dynamics that provide deeper explanations for connections
10. ACTIONABLE SUMMARY - 2-4 sentences of key takeaways and implications`;

        // Call LLM with increased token limit for synthesis
        const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
            temperature: 0.3,
            maxOutputTokens: 4096 // Increased for synthesis
        });

        // Update the tracing run if provided
        if (synthesisRun && typeof synthesisRun.patch === 'function') {
            try {
                synthesisRun.patch({
                    output: {
                        synthesisLength: response.length
                    }
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        }

        return response;
    } catch (error) {
        console.error("Error in synthesizeAnalysis:", error);
        throw new Error(`Failed to synthesize analysis: ${error.message}`);
    }
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
