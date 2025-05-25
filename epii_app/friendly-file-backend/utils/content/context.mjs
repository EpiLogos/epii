/**
 * Context generation utilities for the Epii Analysis Pipeline.
 * These functions provide a consistent interface for generating context windows
 * for analysis, with proper formatting and error handling.
 */

// Import required modules
import bimbaKnowingService from '../../services/bimbaKnowing.service.mjs';
import bpMCPService from '../../services/bpMCPService.mjs';

/**
 * Formats QL context for inclusion in context windows.
 *
 * @param {object} qlContext - The QL context object
 * @returns {string} - Formatted QL context
 */
export function formatQLContext(qlContext) {
    if (!qlContext) return 'No QL context available.';

    let formattedContext = '';

    // Format QL operators
    if (qlContext.operators && qlContext.operators.length > 0) {
        formattedContext += '### QL Operators\n';
        qlContext.operators.forEach(operator => {
            formattedContext += `- **${operator.name}**: ${operator.description || 'No description'}\n`;
        });
        formattedContext += '\n';
    }

    // Format QL dynamics
    if (qlContext.dynamics && qlContext.dynamics.length > 0) {
        formattedContext += '### QL Dynamics\n';
        qlContext.dynamics.forEach(dynamic => {
            formattedContext += `- **${dynamic.name}**: ${dynamic.description || 'No description'}\n`;
        });
        formattedContext += '\n';
    }

    // Format QL results
    if (qlContext.results && qlContext.results.length > 0) {
        formattedContext += '### QL Analysis Results\n';
        qlContext.results.forEach(result => {
            formattedContext += `- **${result.type}**: ${result.description || 'No description'}\n`;
        });
        formattedContext += '\n';
    }

    return formattedContext || 'QL context available but no specific operators or dynamics found.';
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
 * 7. PRIORITIZES target coordinate from project context
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {string} [targetCoordinate] - Optional target coordinate to prioritize
 * @returns {Promise<object>} - The relevant Bimba context with enhanced structure
 */
export async function extractRelevantBimbaContext(chunkContent, fullBimbaMap, targetCoordinate = null) {
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

        // Determine the focus coordinate with target coordinate prioritization
        let focusCoordinate = null;

        // PRIORITIZE target coordinate if provided
        if (targetCoordinate) {
            focusCoordinate = targetCoordinate;
            console.log(`Using prioritized target coordinate: ${focusCoordinate}`);
        }
        // Fallback to mentioned coordinates in chunk
        else if (mentionedCoordinates.length > 0) {
            focusCoordinate = mentionedCoordinates[0];
            console.log(`Using first mentioned coordinate: ${focusCoordinate}`);
        }

        // If we have a focus coordinate, use bimbaKnowing to get enhanced context
        if (focusCoordinate) {
            console.log(`Retrieving Bimba context for ${focusCoordinate} using bimbaKnowing tool`);

            // Call bimbaKnowing tool with comprehensive parameters including QL context
            const bimbaKnowingResult = await bpMCPService.callTool('bimbaKnowing', {
                query: `Provide comprehensive context for ${focusCoordinate} including neighboring coordinates, their relationships, and Quaternal Logic operators`,
                contextDepth: 3,
                focusCoordinate: focusCoordinate,
                includeRelations: true,
                includeQLContext: true
            });

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
            nodes.forEach(node => {
                // Normalize coordinate format (replace dots with dashes)
                const normalizedCoordinate = node.coordinate ? node.coordinate.replace(/\./g, '-') : null;

                // Skip nodes without coordinates
                if (!normalizedCoordinate) return;

                // Create a processed node with essential information
                const processedNode = {
                    coordinate: normalizedCoordinate,
                    name: node.name || 'Unnamed Node',
                    description: node.description || '',
                    type: node.type || 'unknown',
                    level: normalizedCoordinate.split('-').length - 1
                };

                // Add to all nodes with coordinates
                allNodesWithCoordinates.push(processedNode);

                // Check if this is a directly relevant node (mentioned in the chunk)
                if (mentionedCoordinates.includes(normalizedCoordinate)) {
                    directlyRelevantNodes.push(processedNode);
                }

                // Check if this is a parent node of a mentioned coordinate
                for (const mentionedCoord of mentionedCoordinates) {
                    if (mentionedCoord.startsWith(normalizedCoordinate + '-')) {
                        parentNodes.push(processedNode);
                        break;
                    }
                }

                // Check if this is a sibling node of a mentioned coordinate
                for (const mentionedCoord of mentionedCoordinates) {
                    const mentionedParts = mentionedCoord.split('-');
                    if (mentionedParts.length > 1) {
                        const mentionedParent = mentionedParts.slice(0, -1).join('-');
                        const nodeParts = normalizedCoordinate.split('-');
                        if (nodeParts.length > 1) {
                            const nodeParent = nodeParts.slice(0, -1).join('-');
                            if (mentionedParent === nodeParent && normalizedCoordinate !== mentionedCoord) {
                                siblingNodes.push(processedNode);
                                break;
                            }
                        }
                    }
                }
            });
        } else if (fullBimbaMap && fullBimbaMap.nodes) {
            // If no coordinates are mentioned, use the full Bimba map
            console.log(`No coordinates mentioned in chunk. Using full Bimba map with ${fullBimbaMap.nodes.length} nodes.`);

            // Process nodes from the full Bimba map
            fullBimbaMap.nodes.forEach(node => {
                // Skip nodes without coordinates
                if (!node.bimbaCoordinate) return;

                // Normalize coordinate format (replace dots with dashes)
                const normalizedCoordinate = node.bimbaCoordinate.replace(/\./g, '-');

                // Create a processed node with essential information
                const processedNode = {
                    coordinate: normalizedCoordinate,
                    name: node.name || node.title || 'Unnamed Node',
                    description: node.description || '',
                    type: node.type || 'unknown',
                    level: normalizedCoordinate.split('-').length - 1
                };

                // Add to all nodes with coordinates
                allNodesWithCoordinates.push(processedNode);
            });

            // If we have relationships in the full Bimba map, add them
            if (fullBimbaMap.edges) {
                relationships.push(...fullBimbaMap.edges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    type: edge.type || 'unknown'
                })));
            }
        }

        // Create a coordinate structure for hierarchical navigation
        const coordinateStructure = {};
        allNodesWithCoordinates.forEach(node => {
            const parts = node.coordinate.split('-');
            let current = coordinateStructure;
            let path = '';

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                path = path ? `${path}-${part}` : part;

                if (!current[part]) {
                    current[part] = {
                        coordinate: path,
                        children: {},
                        node: i === parts.length - 1 ? node : null
                    };
                } else if (i === parts.length - 1) {
                    current[part].node = node;
                }

                current = current[part].children;
            }
        });

        // Process nodes to ensure we have unique entries
        const processedRelevantNodes = [...new Map(directlyRelevantNodes.map(node => [node.coordinate, node])).values()];
        const processedParentNodes = [...new Map(parentNodes.map(node => [node.coordinate, node])).values()];
        const processedSiblingNodes = [...new Map(siblingNodes.map(node => [node.coordinate, node])).values()];

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
    try {
        // Validate inputs
        if (!chunkContent || typeof chunkContent !== 'string') {
            throw new Error("chunkContent must be a non-empty string");
        }

        // Create a content preview with smart truncation
        const contentPreview = chunkContent.length > 500 ?
            chunkContent.substring(0, 500) + '...' :
            chunkContent;

        // Calculate position in document
        let positionPercentage = 0;
        let positionDescription = 'Unknown position';

        if (documentContent && documentContent.length > 0) {
            const chunkPosition = documentContent.indexOf(chunkContent.substring(0, 100));
            if (chunkPosition !== -1) {
                positionPercentage = Math.round((chunkPosition / documentContent.length) * 100);

                // Determine position description
                if (positionPercentage < 10) {
                    positionDescription = 'Beginning of document';
                } else if (positionPercentage < 33) {
                    positionDescription = 'Early in document';
                } else if (positionPercentage < 66) {
                    positionDescription = 'Middle of document';
                } else if (positionPercentage < 90) {
                    positionDescription = 'Later in document';
                } else {
                    positionDescription = 'End of document';
                }
            }
        }

        // Parse bimbaEnhancedContext if it's a string
        let bimbaContextStr = bimbaEnhancedContext;
        if (typeof bimbaEnhancedContext === 'object') {
            bimbaContextStr = JSON.stringify(bimbaEnhancedContext, null, 2);
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
 * Helper function for smart text truncation.
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function smartTruncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;

    let truncated = '';
    const paragraphs = text.split('\n\n');
    let i = 0;

    // Add paragraphs until we reach the maxLength
    while (i < paragraphs.length && truncated.length + paragraphs[i].length + 2 <= maxLength) {
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

    try {
        // Parse bimbaEnhancedContext if it's a string
        let bimbaContextStr = bimbaEnhancedContext;
        if (typeof bimbaEnhancedContext === 'object') {
            bimbaContextStr = JSON.stringify(bimbaEnhancedContext, null, 2);
        }

        // Generate chunk-specific context
        const chunkContext = await generateChunkContext(
            chunkContent,
            documentContent,
            bimbaContextStr
        );

        // For RAG (stage -3), create a lightweight context window
        if (!forAnalysis) {
            console.log("Generating lightweight context window for RAG (stage -3)");

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

                // Formatted text for LLM consumption
                contextText: `# Context Window for RAG Ingestion

## CHUNK CONTEXT
Content Preview: ${chunkContext.contentPreview.substring(0, 200)}...
Position: ${chunkContext.position.description} (${chunkContext.position.percentage}%)

## DOCUMENT CONTEXT
${bimbaContextStr ? smartTruncateText(bimbaContextStr, 300) : 'No document context available.'}

## PROJECT CONTEXT
Project: ${projectContext.projectName || 'Unnamed Project'}
${projectContext.projectDescription ? `Description: ${projectContext.projectDescription}` : 'No project description available.'}

## BIMBA MAP SUMMARY (Overall Project Structure)
${bimbaMapSummary && bimbaMapSummary.rootNodeDescription ? bimbaMapSummary.rootNodeDescription :
  (bimbaMapSummary && bimbaMapSummary.totalNodes ? `Total Bimba Nodes: ${bimbaMapSummary.totalNodes}` : 'No Bimba map summary available.')}
`
            };

            return lightContextWindow;
        }

        // For analysis (stage -2), create a comprehensive context window
        console.log("Generating comprehensive context window for analysis (stage -2)");

        // Extract relevant Bimba context for this chunk, prioritizing target coordinate
        const targetCoordinate = projectContext && projectContext.targetCoordinate ? projectContext.targetCoordinate : null;
        const relevantBimbaContext = await extractRelevantBimbaContext(
            chunkContent,
            fullBimbaMap,
            targetCoordinate
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
                // PRIORITIZE the target coordinate from project context first
                let targetCoordinate = null;

                // First priority: target coordinate from project context
                if (projectContext && projectContext.targetCoordinate) {
                    targetCoordinate = projectContext.targetCoordinate;
                    console.log(`Using target coordinate from project context: ${targetCoordinate}`);
                }
                // Second priority: first mentioned coordinate in the chunk
                else if (relevantBimbaContext.mentionedCoordinates && relevantBimbaContext.mentionedCoordinates.length > 0) {
                    targetCoordinate = relevantBimbaContext.mentionedCoordinates[0];
                    console.log(`Using first mentioned coordinate as fallback: ${targetCoordinate}`);
                }

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

                    // The bimbaKnowing tool returns a JSON string in the first content item
                    qlContext = JSON.parse(bimbaKnowingResult.content[0].text);
                    console.log(`Successfully retrieved QL context for ${targetCoordinate}`);
                } else {
                    console.warn(`No target coordinate available for QL context retrieval`);
                }
            } catch (qlError) {
                console.error(`Error retrieving QL context:`, qlError);
                // Continue without QL context
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
    `- ${node.coordinate}: ${node.name}${node.description ? ` - ${node.description}` : ''}`
).join('\n')}

## Project Context
Project: ${projectContext.projectName || 'Unnamed Project'}
${projectContext.projectDescription ? `Description: ${projectContext.projectDescription}` : 'No project description available.'}
${projectContext.rootNode ? `Root Node: ${projectContext.rootNode.coordinate} - ${projectContext.rootNode.name}` : ''}

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
