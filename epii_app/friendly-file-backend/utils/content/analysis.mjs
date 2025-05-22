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
        useProvidedContextWindows = false, // Existing flag
        concatenatedContent = null,       // New option for single unit analysis
        analyzeAsSingleUnit = false,      // New flag for single unit analysis
        documentContent // ensure documentContent is extracted from options for single unit context
    } = options;

    if (!llmService) {
        throw new Error("LLM service is required for chunk group analysis");
    }

    // Prepare Metalogikon prompt (common for both paths)
    let mefPrompt = "No Metalogikon framework available.";
    if (metalogikon && metalogikon.lenses && metalogikon.lenses.length > 0) {
        mefPrompt = "# META-EPISTEMIC FRAMEWORK (MEF)\n\n";
        if (metalogikon.rootNode) {
            mefPrompt += `## Overview: ${metalogikon.rootNode.name}\n${metalogikon.rootNode.description || ''}\n\n`;
        }
        mefPrompt += "## MEF LENSES TO APPLY:\n\n";
        const lensesByCategory = {};
        metalogikon.lenses.forEach(lens => {
            const category = lens.category || 'Uncategorized';
            if (!lensesByCategory[category]) {
                lensesByCategory[category] = [];
            }
            lensesByCategory[category].push(lens);
        });
        for (const [category, lenses] of Object.entries(lensesByCategory)) {
            mefPrompt += `### ${category}\n`;
            lenses.forEach(lens => {
                mefPrompt += `- **${lens.name}** (${lens.coordinate}): ${lens.description || 'No description'}\n`;
            });
            mefPrompt += "\n";
        }
    }

    // Create a group context (common for both paths, adapted for single unit if needed)
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
    formatRelevantCoordinates(contextWindows[0].bimbaContext) : // Uses first chunk's context window
    "No specific Bimba coordinates highlighted in this text's immediate context."}
`;


    try {
        if (analyzeAsSingleUnit && concatenatedContent) {
            // --- NEW PATH: Analyze concatenated content as a single unit ---
            console.log(`Analyzing concatenated content as a single unit. Length: ${concatenatedContent.length}`);

            let singleUnitContextInformation = groupContext; // Start with general group context

            // 1.a Context Aggregation: Iterate through options.contextWindows
            if (contextWindows && contextWindows.length > 0) {
                let aggregatedContextText = "\n\n--- Aggregated Context from Batch Chunks ---\n";
                contextWindows.forEach((cw, idx) => {
                    // Ensure cw and cw.contextText are not null or undefined
                    const textToAppend = cw && cw.contextText ? cw.contextText : "No specific context text for this chunk.";
                    aggregatedContextText += `\nContext for Original Chunk ${idx + 1} (part of this batch):\n${textToAppend}\n`;
                });
                singleUnitContextInformation += aggregatedContextText;
                console.log(`Using aggregated context from ${contextWindows.length} windows for single unit analysis.`);
            } else if (chunks && chunks.length > 0) {
                // Fallback: if no context window passed, try to generate one for the first chunk of the original batch
                console.warn(`No context windows provided for single unit analysis. Attempting to generate for the first original chunk.`);
                const firstChunkForContext = chunks[0];
                const docContentForContext = options.documentContent || state?.documentContent || "";
                const tempContextWindow = await generateContextWindow(
                    firstChunkForContext, docContentForContext, bimbaContext || "",
                    fullBimbaMap, userContext || {}, null, { forAnalysis: true }
                );
                singleUnitContextInformation += "\n\n" + tempContextWindow.contextText;
            } else {
                console.warn(`No context windows or original chunks available for single unit analysis context. Using general bimbaContext.`);
                singleUnitContextInformation += "\n\n" + JSON.stringify(bimbaContext, null, 2);
            }

            // 1.b Rich JSON Output: System prompt instructs LLM for a single rich JSON object.
            const systemPromptSingleUnit = `You are Epii, an advanced AI system for analyzing text in relation to the Bimba coordinate system.
Your task is to analyze the provided block of text and extract a comprehensive analysis including overall summary, main themes, mappings, variations, natural elaborations, QL dynamics, and other relational properties.

CONTEXT INFORMATION:
${singleUnitContextInformation}

METALOGIKON FRAMEWORK:
${mefPrompt}

IMPORTANT DISTINCTION:
- Quaternal Logic (QL) is the foundational, generative framework...
- NEVER conflate QL operators with Bimba coordinates themselves.

ANALYTICAL TASK INSTRUCTIONS: (Apply to the entire block of text)
1.  Provide an overall summary of the text block.
2.  Identify the main themes or topics discussed.
3.  Extract mappings, variations, natural elaborations, deep elaborations, novel contributions, and QL dynamics relevant to the entire block.
4.  Apply the Metalogikon Framework lenses to gain deeper insights for the entire block.

BIMBA-CENTRIC ANALYSIS REQUIREMENTS: (Apply to the entire block of text)
...

NATURAL ELABORATION ENHANCEMENT REQUIREMENTS: (Apply to the entire block of text)
...

TECHNICAL INSTRUCTIONS:
1. Analyze the text block in relation to the primary target coordinate: ${sourceMetadata.targetCoordinate}
2. Format your response as a single, structured JSON object as specified in the user prompt.
3. Ensure all specified fields in the JSON structure are present, using empty arrays [] if no items of a particular type are found.

RELATIONAL PROPERTIES EXTRACTION GUIDE: (remains same)
...

CRITICAL FORMAT REQUIREMENTS:
- Your response MUST be a valid single JSON object.
- The object MUST contain all fields as specified in the user prompt's JSON structure example.
- Pay close attention to nesting and data types (arrays of objects, strings, etc.).
- Double-check your JSON before returning it.`;

            // 1.b Rich JSON Output: User prompt defines the structure of the single JSON object.
            const userPromptSingleUnit = `TEXT BLOCK TO ANALYZE:
"""
${concatenatedContent}
"""
Assigned primary coordinate: ${sourceMetadata.targetCoordinate}

Please analyze this text block and provide your analysis in the following JSON format (a single object):
{
  "assignedCoordinates": ["${sourceMetadata.targetCoordinate}"],
  "overallSummary": "string (concise summary of the entire text block)",
  "mainThemes": ["string (list of main themes or topics)"],
  "analysis": "string (detailed textual analysis of the block, integrating various insights)",
  "extractedMappings": [ /* array of mapping objects, format same as before */ ],
  "identifiedVariations": [ /* array of variation objects, format same as before */ ],
  "naturalElaborations": [ /* array of natural elaboration objects, format same as before */ ],
  "deepElaboration": [ /* array of deep elaboration objects, format same as before */ ],
  "novelContributions": [ /* array of novel contribution objects, format same as before */ ],
  "qlDynamics": [ /* array of QL dynamic objects, format same as before */ ],
  "extractedTags": ["string (list of relevant tags or keywords for the block)"],
  "mefLensInsights": { /* MEF lens insights object, format same as before */ },
  "subnodeMappings": { /* subnode mappings object, format same as before */ }
}`;

            const response = await llmService.generateContent(-2, systemPromptSingleUnit, userPromptSingleUnit, {
                temperature: 0.2, // Adjusted temperature for potentially more creative/synthesizing tasks
                maxOutputTokens: 8192 // Retain large token limit
            });

            // Parse response (expecting a single JSON object)
            let analysisResult;
            try {
                console.log("Raw LLM response for single unit (first 200 chars):", response.substring(0, 200) + "...");
                let jsonStr = "";
                const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
                if (jsonBlockMatch) {
                    jsonStr = jsonBlockMatch[1];
                } else {
                    const startBrace = response.indexOf('{');
                    const endBrace = response.lastIndexOf('}');
                    if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
                        jsonStr = response.substring(startBrace, endBrace + 1);
                    } else {
                        jsonStr = response; // Fallback, though risky
                    }
                }
                jsonStr = jsonStr.trim().replace(/,(\s*[}\]])/g, '$1').replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2');
                console.log("Extracted JSON string for single unit (first 200 chars):", jsonStr.substring(0, 200) + "...");
                analysisResult = JSON.parse(jsonStr);

                // Validate and normalize the single result based on the new rich structure
                analysisResult.assignedCoordinates = analysisResult.assignedCoordinates || [sourceMetadata.targetCoordinate];
                analysisResult.overallSummary = analysisResult.overallSummary || "No overall summary provided.";
                analysisResult.mainThemes = analysisResult.mainThemes || [];
                analysisResult.analysis = analysisResult.analysis || "No detailed analysis text provided.";
                analysisResult.extractedMappings = analysisResult.extractedMappings || [];
                analysisResult.identifiedVariations = analysisResult.identifiedVariations || [];
                analysisResult.naturalElaborations = analysisResult.naturalElaborations || [];
                analysisResult.deepElaboration = analysisResult.deepElaboration || [];
                analysisResult.novelContributions = analysisResult.novelContributions || [];
                analysisResult.qlDynamics = analysisResult.qlDynamics || [];
                analysisResult.extractedTags = analysisResult.extractedTags || [];
                analysisResult.mefLensInsights = analysisResult.mefLensInsights || {};
                analysisResult.subnodeMappings = analysisResult.subnodeMappings || {};
                
                // Validate naturalElaborations structure if present
                if (Array.isArray(analysisResult.naturalElaborations)) {
                    analysisResult.naturalElaborations.forEach((elaboration, elabIndex) => {
                        if (!elaboration.elaborationType || !elaboration.elaborationText || !elaboration.targetCoordinate || elaboration.confidenceScore === undefined) {
                            console.warn(`Natural elaboration ${elabIndex} in single unit result missing required properties. Filling with defaults.`);
                            elaboration.elaborationType = elaboration.elaborationType || "unknown";
                            elaboration.elaborationText = elaboration.elaborationText || "Missing text";
                            elaboration.targetCoordinate = elaboration.targetCoordinate || sourceMetadata.targetCoordinate;
                            elaboration.confidenceScore = elaboration.confidenceScore !== undefined ? elaboration.confidenceScore : 0.5;
                        }
                    });
                }
                analysisResult.concatenatedContentLength = concatenatedContent.length;

                return analysisResult;

            } catch (parseError) {
                console.error("JSON parsing failed for single unit analysis:", parseError.message);
                console.error("Raw LLM response for single unit:", response);
                // Attempt to return a structured error object if parsing fails
                return {
                    error: "Failed to parse LLM response for single unit analysis",
                    rawResponse: response.substring(0, 1000) + "...", // Include part of the raw response
                    assignedCoordinates: [sourceMetadata.targetCoordinate],
                    overallSummary: "Error in processing.",
                    mainThemes: [],
                    analysis: `Error: ${parseError.message}`,
                    extractedMappings: [],
                    identifiedVariations: [],
                    naturalElaborations: [],
                    deepElaboration: [],
                    novelContributions: [],
                    qlDynamics: [],
                    extractedTags: [],
                    mefLensInsights: {},
                    subnodeMappings: {}
                };
            }

        } else {
            // --- EXISTING PATH: Analyze chunks in a group, returning array of results ---
            if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
                throw new Error("chunks must be a non-empty array for multi-chunk analysis");
            }
            if (!assignedCoordinates || !Array.isArray(assignedCoordinates) || assignedCoordinates.length === 0) {
                throw new Error("assignedCoordinates must be a non-empty array for multi-chunk analysis");
            }
            if (chunks.length !== assignedCoordinates.length) {
                throw new Error("chunks and assignedCoordinates must have the same length for multi-chunk analysis");
            }
            if (contextWindows.length !== chunks.length && useProvidedContextWindows) { // check only if useProvidedContextWindows is true
                console.warn(`Context windows array length (${contextWindows.length}) does not match chunks length (${chunks.length}) when useProvidedContextWindows is true. This may cause issues.`);
            }

            console.log(`Performing multi-chunk analysis for ${chunks.length} chunks.`);
            if (useProvidedContextWindows) {
                console.log(`Using ${contextWindows.length} provided context windows to eliminate redundant MongoDB calls`);
            }


    // Display the first context window for debugging
    if (contextWindows && contextWindows.length > 0 && useProvidedContextWindows) { // Check useProvidedContextWindows
        console.log(`--- Context Window Debug Information (Multi-Chunk) ---`);
        console.log(`Context window for chunk 1 (first 200 chars): ${contextWindows[0].contextText.substring(0, 200)}...`);
        console.log(`--- End Context Window Debug Information ---`);
    }

    try {
        // Prepare Metalogikon prompt
        let mefPrompt = "No Metalogikon framework available.";
            // This is the start of the existing logic for multi-chunk analysis
            let contextInformation = groupContext; // Use the common groupContext

            // Prepare system prompt with enhanced instructions for quaternary logic and relational properties
            const systemPrompt = `You are Epii, an advanced AI system for analyzing text in relation to the Bimba coordinate system.
Your task is to analyze a group of related text chunks and extract mappings, variations, natural elaborations, and relational properties.

CONTEXT INFORMATION:
${contextInformation} 
// Note: contextInformation here is the groupContext. Individual chunk contexts are added to the userPrompt below.

METALOGIKON FRAMEWORK:
${mefPrompt}

IMPORTANT DISTINCTION: 
... (rest of distinction remains same)

ANALYTICAL TASK INSTRUCTIONS:
... (rest of instructions remain same)

BIMBA-CENTRIC ANALYSIS REQUIREMENTS:
... (rest of requirements remain same)

NATURAL ELABORATION ENHANCEMENT REQUIREMENTS:
... (rest of requirements remain same)

TECHNICAL INSTRUCTIONS:
1. Analyze each chunk in relation to its assigned coordinates
2. Extract mappings between the text and the Bimba coordinate system
3. Apply the Metalogikon Framework lenses to gain deeper insights
4. Format your response as a structured JSON array with one entry per chunk
5. Maintain context between chunks - use information from earlier chunks to inform your analysis of later chunks

RELATIONAL PROPERTIES EXTRACTION GUIDE:
... (rest of guide remains same)

CRITICAL FORMAT REQUIREMENTS:
- Your response MUST be a valid JSON array with exactly one object per chunk
... (rest of format requirements for array output remain same)
`;

            // Process context windows more efficiently for multi-chunk
            let processedContextWindows = [...contextWindows];
            const currentDocumentContent = options.documentContent || state?.documentContent || "";

            const needsRegeneration = !useProvidedContextWindows && (
                processedContextWindows.length !== chunks.length || // if lengths don't match, regeneration is needed
                (processedContextWindows.length > 0 && (!processedContextWindows[0].bimbaContext || !processedContextWindows[0].bimbaContext.directlyRelevantNodes))
            );

            if (needsRegeneration && chunks.length > 0) { // Ensure chunks array is not empty
                console.log(`Context windows need comprehensive information or length mismatch. Regenerating all windows in batch with forAnalysis=true.`);
                const contextWindowPromises = chunks.map(chunk =>
                    generateContextWindow(
                        chunk,
                        currentDocumentContent,
                        bimbaContext || "",
                        fullBimbaMap,
                        userContext || {},
                        null,
                        { forAnalysis: true }
                    )
                );
                processedContextWindows = await Promise.all(contextWindowPromises);
                console.log(`Successfully regenerated all ${chunks.length} context windows with comprehensive information`);
            } else if (useProvidedContextWindows) {
                console.log(`Using provided comprehensive context windows (skipping regeneration) for multi-chunk.`);
            } else if (chunks.length > 0) { // Ensure chunks array is not empty before logging this
                console.log(`Using existing context windows with comprehensive information for multi-chunk analysis.`);
            }


            const userPrompt = `CHUNK GROUP TO ANALYZE:

${chunks.map((chunk, index) => {
    // Ensure processedContextWindows[index] exists before trying to access its properties
    const contextWindow = processedContextWindows && processedContextWindows[index] ? processedContextWindows[index] : null;
    const contextInfo = contextWindow ?
        `CHUNK CONTEXT:\n${contextWindow.contextText ? contextWindow.contextText.substring(0, 500) + "..." : "No specific chunk context available."}\n\n` : '';
    return `CHUNK ${index + 1}:\n${contextInfo}"""\n${chunk}\n"""\nAssigned coordinates: ${assignedCoordinates[index].join(', ')}\n\n`;
}).join('\n')}

Please analyze each chunk and provide your analysis in the following JSON format:
[ /* ... array format same as before ... */ ]`;

            const response = await llmService.generateContent(-2, systemPrompt, userPrompt, {
                temperature: 0.2,
                maxOutputTokens: 8192
            });

            // Parse response (expecting a JSON array)
            let analysisDataArray;
            try {
                console.log("Raw LLM response for multi-chunk (first 200 chars):", response.substring(0, 200) + "...");
                let jsonStr = "";
                const jsonBlockMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
                if (jsonBlockMatch) {
                    jsonStr = jsonBlockMatch[1];
                } else {
                    const startBracket = response.indexOf('[');
                    const endBracket = response.lastIndexOf(']');
                    if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
                        jsonStr = response.substring(startBracket, endBracket + 1);
                    } else {
                         jsonStr = response; // fallback
                    }
                }
                jsonStr = jsonStr.trim().replace(/,(\s*[}\]])/g, '$1').replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2');
                console.log("Extracted JSON string for multi-chunk (first 200 chars):", jsonStr.substring(0, 200) + "...");
                analysisDataArray = JSON.parse(jsonStr);

                if (!Array.isArray(analysisDataArray)) {
                    analysisDataArray = [analysisDataArray]; // Wrap if it's a single object by mistake
                }
                if (analysisDataArray.length < chunks.length) {
                     console.error(`LLM response for multi-chunk contains ${analysisDataArray.length} results, but expected ${chunks.length}.`);
                     // Pad with error objects if necessary, or throw specific error
                     while(analysisDataArray.length < chunks.length) {
                        analysisDataArray.push({ error: "Missing analysis for chunk", chunkIndex: analysisDataArray.length });
                     }
                }

                const normalizedResults = analysisDataArray.slice(0, chunks.length).map((result, index) => {
                    if(result.error) return result; // pass through error object
                    if (!result.extractedMappings) throw new Error(`Result for chunk ${index} missing extractedMappings.`);
                    if (!result.identifiedVariations) throw new Error(`Result for chunk ${index} missing identifiedVariations.`);
                    if (!result.naturalElaborations) throw new Error(`Result for chunk ${index} missing naturalElaborations.`);
                    if (Array.isArray(result.naturalElaborations)) {
                        result.naturalElaborations.forEach((elaboration, elabIndex) => {
                            if (!elaboration.elaborationType || !elaboration.elaborationText || !elaboration.targetCoordinate || elaboration.confidenceScore === undefined) {
                                throw new Error(`Natural elaboration ${elabIndex} for chunk ${index} missing required properties.`);
                            }
                        });
                    }
                    return { ...result, chunkText: chunks[index], assignedCoordinates: assignedCoordinates[index] };
                });
                return consolidateMappingsAcrossChunks(normalizedResults);

            } catch (parseError) {
                console.error("JSON parsing failed for multi-chunk analysis:", parseError.message);
                console.error("Raw LLM response for multi-chunk:", response);
                throw new Error(`Failed to parse LLM response for multi-chunk analysis: ${parseError.message}`);
            }
        }
    } catch (error) {
        console.error("Error in analyzeChunkGroup:", error);
        throw new Error(`Failed to analyze chunk group: ${error.message}`);
    }
}
