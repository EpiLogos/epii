/**
 * Analysis utilities for the Epii Analysis Pipeline.
 * These functions provide a consistent interface for analyzing content
 * using LLMs, with proper formatting and error handling.
 */

// Import required modules
import { generateContextWindow } from './context.mjs';
import { consolidateMappingsAcrossChunks } from './processing.mjs';

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
 * Helper function to format relevant coordinates from bimbaContext
 *
 * @param {object} bimbaContext - The Bimba context object
 * @returns {string} - Formatted string of relevant coordinates
 */
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

NATURAL ELABORATION ENHANCEMENT REQUIREMENTS:
Do not merely state that the text aligns with the target coordinate. Assume basic alignment is established. Your task is to provide DEEP NATURAL ELABORATIONS:

1. Make each naturalElaboration rich and insightful (100-150 words per elaboration).

2. For each naturalElaboration:
   - Clearly state the insight, nuance, tension, strong resonance, or novel perspective
   - Provide specific textual evidence to support your point
   - Explain why this point is significant for understanding either the text, the coordinate, or their interrelation
   - Include subtle QL dynamics that provide deeper, non-obvious explanations
   - Discuss novel contributions or unique perspectives the text offers

3. Use descriptive elaborationType values that indicate the nature of the elaboration:
   - "deep_insight" for profound conceptual connections
   - "structural_pattern" for form-based relationships
   - "processual_dynamic" for movement or transformation
   - "contextual_framework" for situational or environmental factors
   - "conceptual_bridge" for connections between seemingly disparate ideas

4. Maintain the same number of naturalElaborations you would normally produce, but make each one significantly deeper and more insightful.

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
        "elaborationType": "deep_insight",
        "elaborationText": "The text reveals a recursive pattern of self-reference that exemplifies the coordinate's emphasis on meta-awareness. This pattern manifests in the way the author structures the argument, creating layers of meaning that reflect upon each other. The passage where the author states '...' demonstrates how each concept contains within it the seeds of its own evolution. This insight is particularly significant because it shows how the coordinate manifests in practical contexts beyond theoretical frameworks. The QL-STRUCT-4 pattern is subtly present here, creating a tetralemmic structure where each position both transcends and includes the previous ones. This offers a novel perspective on how knowledge structures can simultaneously maintain stability while enabling transformation.",
        "targetCoordinate": "#1-4",
        "confidenceScore": 0.92
      },
      {
        "elaborationType": "conceptual_bridge",
        "elaborationText": "This text establishes a previously unrecognized connection between the target coordinate and the broader theme of epistemic topology. The evidence for this connection appears in the passage where '...' which demonstrates how knowledge structures can be mapped onto spatial metaphors. The significance of this connection lies in how it reveals the coordinate's function as a bridge between abstract conceptual frameworks and concrete applications. The underlying QL-CONTEXT-3 dynamic creates a contextual field where seemingly disparate domains can interact and inform each other. This novel contribution extends our understanding of the coordinate beyond its traditional boundaries, suggesting new applications in fields where topological thinking has been underutilized.",
        "targetCoordinate": "#2-3",
        "confidenceScore": 0.88
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

                    // Ensure all naturalElaborations have required properties
                    if (Array.isArray(result.naturalElaborations)) {
                        result.naturalElaborations.forEach((elaboration, elabIndex) => {
                            if (!elaboration.elaborationType || !elaboration.elaborationText || !elaboration.targetCoordinate || elaboration.confidenceScore === undefined) {
                                console.error(`Natural elaboration ${elabIndex} for chunk ${index} missing required properties. LLM response format is incorrect.`);
                                throw new Error(`Natural elaboration ${elabIndex} for chunk ${index} missing required properties. LLM response format is incorrect.`);
                            }
                        });
                    }

                    // Add chunk text for reference
                    return {
                        ...result,
                        chunkText: chunks[index],
                        assignedCoordinates: assignedCoordinates[index]
                    };
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
