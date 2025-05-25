/**
 * Synthesis utilities for the Epii Analysis Pipeline.
 * These functions provide a consistent interface for synthesizing analysis results,
 * with proper formatting and error handling.
 */

// Import required modules

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

Extract the following relational properties from the synthesis and mappings:

1. QL Operators: Quaternal Logic operators that structure the content
   - Format: "QL-[TYPE]-[POSITION]" (e.g., "QL-STRUCT-3", "QL-PROC-2", "QL-CONTEXT-4")
   - Types: STRUCT (structural), PROC (processual), CONTEXT (contextual)
   - Position: 0-5 (representing position in the QL cycle)
   - Example: "QL-STRUCT-3" indicates a structural operator at position 3
   - Generate 6-12 detailed QL Operator properties with rich descriptions

2. Epistemic Essence: Core abstract concepts or themes that the content elaborates on
   - These are fundamental conceptual frameworks or epistemological patterns
   - Examples: "Epistemic Topology", "Conceptual Integration", "Systemic Interdependence"
   - Generate 6-12 detailed Epistemic Essence properties with rich descriptions

3. Archetypal Anchors: Underlying patterns, dynamics, or archetypal energies that can be inferred from the content
   - These are deep structural patterns that give symbolic meaning to the content, whether explicitly mentioned or implicitly present
   - Look for patterns like: cyclical processes, transformative journeys, integration dynamics, threshold moments, creative emergence, systemic wholeness, etc.
   - Examples: "Cyclical Integration" (ouroboric pattern), "Threshold Navigation" (liminal dynamics), "Emergent Synthesis" (creative manifestation)
   - INFER archetypal patterns from content themes and dynamics rather than looking for literal symbolic references
   - Generate 6-12 detailed Archetypal Anchor properties with rich descriptions

4. Semantic Framework: Relationship types that define how concepts connect
   - These describe the nature of relationships between concepts
   - Examples: "Harmonizes With", "Develops Into", "Transcends And Includes"
   - Generate 6-12 detailed Semantic Framework properties with rich descriptions

For each property, provide:
1. name: A concise name or title for the property
2. description: A detailed explanation (100-150 words) that provides rich, natural language insight
3. evidence: Direct quotes or specific references from the text that support this property

For each core element, provide:
1. elementType: The category of the element (from the list above)
2. name: A concise name or title for the element
3. description: A detailed explanation of the element
4. relevance: Why this element is important to the overall analysis
5. coordinates: Any Bimba coordinates that are directly related to this element
6. evidence: Direct quotes or specific references from the text that support this element`;

        // Prepare system prompt
        const systemPrompt = `You are an expert analyst specializing in extracting core elements and relational properties from synthesized analyses.
Your task is to identify the most important concepts, themes, insights, and relational properties from the provided synthesis.

${relationalPropertiesGuidance}

Focus on extracting elements that are:
1. Central to understanding the content
2. Directly relevant to the target coordinate
3. Supported by evidence from the text
4. Connected to the broader Bimba coordinate system

Be precise, evidence-based, and comprehensive in your extraction.`;

        // Prepare user prompt
        const userPrompt = `Extract core elements and relational properties from the following synthesis:

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

IMPORTANT: Generate 6-12 detailed properties for EACH relational property type (QL Operators, Epistemic Essence, Archetypal Anchors, Semantic Framework). Each property should have a rich, detailed description that provides significant analytical value.

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
        "name": "string", // e.g., "QL-STRUCT-3"
        "description": "string", // Detailed explanation (100-150 words) of how this operator manifests
        "evidence": "string" // Supporting evidence from the text
      }
      // Generate 6-12 QL Operator properties
    ],
    "epistemicEssence": [
      {
        "name": "string", // e.g., "Epistemic Topology"
        "description": "string", // Detailed explanation (100-150 words) of this epistemic essence
        "evidence": "string" // Supporting evidence from the text
      }
      // Generate 6-12 Epistemic Essence properties
    ],
    "archetypalAnchors": [
      {
        "name": "string", // e.g., "Cyclical Integration", "Threshold Navigation", "Emergent Synthesis"
        "description": "string", // Detailed explanation (100-150 words) of this archetypal pattern inferred from the content
        "evidence": "string" // Supporting evidence from the text that demonstrates this pattern
      }
      // Generate 6-12 Archetypal Anchor properties - INFER patterns from content dynamics, don't look for literal symbols
    ],
    "semanticFramework": [
      {
        "name": "string", // e.g., "Harmonizes With"
        "description": "string", // Detailed explanation (100-150 words) of this relationship type
        "evidence": "string" // Supporting evidence from the text
      }
      // Generate 6-12 Semantic Framework properties
    ]
  }
}`;

        // Call LLM
        const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
            temperature: 0.2,
            maxOutputTokens: 4096
        });

        // Parse response
        let result;
        try {
            // Extract JSON from response
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
            const jsonStr = jsonMatch ? jsonMatch[1] : response;

            result = JSON.parse(jsonStr);

            // Validate result structure
            if (!result.coreElements || !Array.isArray(result.coreElements)) {
                result.coreElements = [];
            }

            if (!result.relationalProperties) {
                result.relationalProperties = {
                    qlOperators: [],
                    epistemicEssence: [],
                    archetypalAnchors: [],
                    semanticFramework: []
                };
            }

            // Ensure relationalProperties has all required fields
            if (!result.relationalProperties.qlOperators) result.relationalProperties.qlOperators = [];
            if (!result.relationalProperties.epistemicEssence) result.relationalProperties.epistemicEssence = [];
            if (!result.relationalProperties.archetypalAnchors) result.relationalProperties.archetypalAnchors = [];
            if (!result.relationalProperties.semanticFramework) result.relationalProperties.semanticFramework = [];

            // Ensure each core element has the required properties
            result.coreElements = result.coreElements.map(element => ({
                elementType: element.elementType || 'Concept',
                name: element.name || 'Unnamed Element',
                description: element.description || '',
                relevance: element.relevance || '',
                coordinates: Array.isArray(element.coordinates) ? element.coordinates : [],
                evidence: element.evidence || '' // Include evidence field
            }));

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
                // Add as a core element
                result.coreElements.push({
                    elementType: "QL Dynamics",
                    name: "Enhanced Analysis: QL Dynamics",
                    description: "Quaternal Logic dynamics identified in the content",
                    relevance: "Reveals the underlying QL patterns that give meaning to the Bimba coordinates",
                    coordinates: [targetCoordinate],
                    evidence: qlDynamicsText
                });
            }

            console.log(`Successfully extracted ${result.coreElements.length} core elements and relational properties`);
        } catch (parseError) {
            console.error("Error parsing LLM response:", parseError);
            throw new Error(`Failed to parse LLM response: ${parseError.message}`);
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
            epiiAgentService = (await import('../../services/epii-agent.service.mjs')).default;
            console.log("Successfully imported Epii agent service");
        } catch (importError) {
            console.warn(`Could not import Epii agent service: ${importError.message}`);
            console.warn("Falling back to direct LLM call for Epii perspective generation");
            epiiAgentService = null;
        }

        let response;

        // Extract relational properties for the Epii agent
        const relationalProperties = {};
        if (coreElements.length > 0 && coreElements[0].relationalProperties) {
            relationalProperties.qlOperators = coreElements[0].relationalProperties.qlOperators || [];
            relationalProperties.epistemicEssence = coreElements[0].relationalProperties.epistemicEssence || [];
            relationalProperties.archetypalAnchors = coreElements[0].relationalProperties.archetypalAnchors || [];
            relationalProperties.semanticFramework = coreElements[0].relationalProperties.semanticFramework || [];
        }

        // If Epii agent service is available, use it
        if (epiiAgentService) {
            console.log("Using Epii agent service for perspective generation");

            // Prepare the message for the Epii agent
            const message = `Generate an Epii perspective on the following synthesis and core elements for Bimba coordinate ${targetCoordinate}:

SYNTHESIS:
${synthesis.length > 2000 ? synthesis.substring(0, 2000) + "..." : synthesis}

CORE ELEMENTS (${coreElements.length}):
${JSON.stringify(coreElements.slice(0, 5), null, 2)}${coreElements.length > 5 ? '\n... (and more)' : ''}

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
 * @param {Array} batchAnalyses - The analyses of batches (rich JSON objects)
 * @param {Array} allMappings - All consolidated mappings from all batches
 * @param {Array} allVariations - All consolidated variations from all batches
 * @param {Array} allTags - All consolidated tags from all batches
 * @param {object} metalogikon - The Metalogikon template
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} llmService - The LLM service
 * @param {object} [synthesisRun] - Optional LangSmith run for tracing
 * @returns {Promise<string>} - The synthesized analysis
 * @throws {Error} - If synthesis fails
 */
export async function synthesizeAnalysis(
    documentContent,
    batchAnalyses, // Changed from chunkAnalyses
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

    if (!batchAnalyses || !Array.isArray(batchAnalyses)) { // Changed validation
        throw new Error("batchAnalyses must be an array");
    }

    if (!allMappings || !Array.isArray(allMappings)) {
        throw new Error("allMappings must be an array");
    }

    if (!allVariations || !Array.isArray(allVariations)) {
        throw new Error("allVariations must be an array");
    }

    if (!allTags || !Array.isArray(allTags)) {
        throw new Error("allTags must be an array");
    }

    if (!targetCoordinate || typeof targetCoordinate !== 'string') {
        throw new Error("targetCoordinate must be a non-empty string");
    }

    try {
        console.log(`Synthesizing analysis from ${batchAnalyses.length} batch analyses...`); // Updated log

        // Prepare system prompt
        const systemPrompt = `You are an expert analyst specializing in synthesizing analyses of document chunks.
Your task is to create a coherent, insightful synthesis of the provided chunk analyses, mappings, variations, and tags.

IMPORTANT DISTINCTIONS:
- Quaternal Logic (QL) is the foundational, generative framework comprising specific operators (structural, processual, contextual).
- The Bimba Coordinate System is the manifested, navigable map or knowledge structure built UPON and THROUGH these QL principles.
- QL provides the "how and why" for the Bimba map's "what and where."
- QL operators are dynamic and can be active across or within Bimba coordinates.
- NEVER conflate QL operators with Bimba coordinates themselves.

SYNTHESIS REQUIREMENTS:
1. Create a coherent narrative that integrates insights from all chunks
2. Clearly distinguish between true variations (contradictions) and natural elaborations (extensions)
3. Identify quaternary logic patterns in relation to the target coordinate
4. Extract relational properties that connect to the broader knowledge structure
5. Generate actionable insights and implications

Your synthesis should be comprehensive, insightful, and well-structured.
Focus on the most significant patterns, themes, and insights that emerge from the analyses.`;

        // Prepare user prompt
        const userPrompt = `Synthesize the following batch analyses into a coherent whole:

TARGET COORDINATE: ${targetCoordinate}

DOCUMENT CONTENT (EXCERPT):
${documentContent.length > 1000 ? documentContent.substring(0, 1000) + "..." : documentContent}

BATCH ANALYSES (${batchAnalyses.length}):
${JSON.stringify(batchAnalyses.slice(0, 3), null, 2)}${batchAnalyses.length > 3 ? '\n... (and more)' : ''}
// Each item in batchAnalyses is a rich JSON object representing analysis for a whole batch.
// LLM should understand that it's synthesizing from these batch-level summaries/analyses.

CONSOLIDATED MAPPINGS (${allMappings.length}):
${JSON.stringify(allMappings.slice(0, 5), null, 2)}${allMappings.length > 5 ? '\n... (and more)' : ''}

CONSOLIDATED VARIATIONS (${allVariations.length}):
${JSON.stringify(allVariations.slice(0, 3), null, 2)}${allVariations.length > 3 ? '\n... (and more)' : ''}

TAGS (${allTags.length}):
${JSON.stringify(allTags, null, 2)}

METALOGIKON FRAMEWORK:
${metalogikon && metalogikon.rootNode ?
    `${metalogikon.rootNode.name}: ${metalogikon.rootNode.description || 'No description'}` :
    'No Metalogikon framework available.'}

Create a comprehensive synthesis that includes the following sections:
1. OVERALL SUMMARY - A concise summary of the document's key points and significance
2. BIMBA COORDINATE ALIGNMENT - How the content aligns with the target coordinate ${targetCoordinate}
3. EXTRACTED MAPPINGS - The most significant mappings and their implications
4. IDENTIFIED VARIATIONS - True contradictions or tensions in the content
5. NATURAL ELABORATIONS - Extensions or developments of ideas that build upon each other
6. DEEP ELABORATION - 3-5 points of deep elaboration with evidence and significance
7. NOVEL CONTRIBUTIONS - Unique perspectives or insights offered by the content
8. MEF LENS INSIGHTS - Insights gained through the Metalogikon framework
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
