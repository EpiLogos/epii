/**
 * Stage -1: Define Core Elements (Synthesize Analysis)
 *
 * This stage synthesizes the chunk analyses into a coherent whole, defining core elements
 * and preparing for the final payload generation. It integrates the mappings, variations,
 * and tags from all chunks.
 *
 * ENHANCED: This stage now:
 * 1. Provides better Bimba coordinate system awareness in synthesis
 * 2. Clearly distinguishes between true variations (contradictions) and natural elaborations (extensions)
 * 3. Makes extraction of relational properties more robust and evidence-based
 * 4. Generates actionable summaries with key insights
 * 5. Aligns core elements with the target coordinate
 *
 * Key responsibilities:
 * 1. Consolidate mappings from all chunks
 * 2. Synthesize the analysis into a coherent summary with Bimba awareness
 * 3. Generate evidence-based core elements and relational properties
 * 4. Extract actionable insights from the synthesis
 * 5. Prepare optimized state for stage -0
 */

// Import required modules
import epiiLLMService from '../../services/epii-llm.service.mjs';
import langsmithTracing from '../../services/langsmith-tracing.mjs';

/**
 * Stage -1: Define Core Elements (Synthesize Analysis)
 * Synthesizes the chunk analyses into a coherent whole, defining core elements and preparing for the final payload generation.
 * Integrates the mappings, variations, and tags from all chunks.
 *
 * ENHANCED: This function now:
 * 1. Provides better Bimba coordinate system awareness in synthesis
 * 2. Clearly distinguishes between true variations (contradictions) and natural elaborations (extensions)
 * 3. Makes extraction of relational properties more robust and evidence-based
 * 4. Generates actionable summaries with key insights
 * 5. Optimizes state passing to Stage -0
 *
 * @param {object} state - The state from Stage -2
 * @returns {Promise<object>} - A promise resolving to the optimized state after Stage -1
 * @throws {Error} - If any step in the process fails
 */
export async function runStageMinus1(state) {
    // Validate required input state properties
    if (!state.chunkAnalyses || !Array.isArray(state.chunkAnalyses)) {
        throw new Error("Invalid state: chunkAnalyses must be an array");
    }
    if (!state.chunkMappings || !Array.isArray(state.chunkMappings)) {
        throw new Error("Invalid state: chunkMappings must be an array");
    }
    if (!state.chunkVariations || !Array.isArray(state.chunkVariations)) {
        throw new Error("Invalid state: chunkVariations must be an array");
    }
    if (!state.chunkTags || !Array.isArray(state.chunkTags)) {
        throw new Error("Invalid state: chunkTags must be an array");
    }
    if (!state.sourceMetadata || !state.sourceMetadata.targetCoordinate) {
        throw new Error("Invalid state: sourceMetadata.targetCoordinate is required");
    }
    if (!state.documentContent) {
        throw new Error("Invalid state: documentContent is required");
    }

    const {
        chunkAnalyses,
        chunkMappings,
        chunkVariations,
        chunkTags,
        metalogikon,
        sourceMetadata,
        documentContent
    } = state;
    console.log(`--- Epii Pipeline: Stage -1 (Define Core Elements) ---`);

    // Create a run tree for this stage with error handling
    let stageRun;
    try {
        stageRun = langsmithTracing.createStageRunTree(
            "Stage -1: Define Core Elements",
            {
                numChunks: chunkAnalyses.length,
                targetCoordinate: sourceMetadata.targetCoordinate,
                sourceFileName: sourceMetadata.sourceFileName
            }
        );
    } catch (tracingError) {
        console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
        // Create a mock stageRun that won't break the pipeline
        stageRun = {
            create_child: () => ({ end: () => {}, patch: () => {} }),
            end: () => {},
            patch: () => {}
        };
    }

    try {
        // 1. Combine all mappings, variations, and tags
        console.log(`Combining mappings, variations, and tags from ${chunkAnalyses.length} chunks...`);

        // Import the consolidation utilities
        const { consolidateMappingsEnhanced } = await import('../../utils/content/processing.mjs');

        // Generate a deterministic ID generator function with a prefix for traceability
        const idGenerator = (prefix = 'map') => {
            let counter = 0;
            return () => `${prefix}-${Date.now()}-${++counter}`;
        };

        // Consolidate mappings by coordinate to avoid duplicates
        // Flatten the chunk mappings array and pass to consolidation function
        if (!Array.isArray(chunkMappings.flat())) {
            throw new Error("Invalid chunkMappings structure: cannot be flattened to an array");
        }

        const allMappings = consolidateMappingsEnhanced(chunkMappings.flat(), idGenerator('map'));

        // Deduplicate variations and tags
        const uniqueVariations = new Map();
        chunkVariations.flat().forEach(variation => {
            const key = `${variation.variationType}:${variation.variationText}`;
            if (!uniqueVariations.has(key)) {
                uniqueVariations.set(key, variation);
            }
        });
        const allVariations = Array.from(uniqueVariations.values());

        // Deduplicate tags
        const allTags = [...new Set(chunkTags.flat())];

        console.log(`Combined and consolidated into ${allMappings.length} mappings, ${allVariations.length} variations, and ${allTags.length} tags`);

        // 2. Synthesize the analysis
        console.log(`Synthesizing analysis...`);
        const synthesisRun = langsmithTracing.createChildRun(
            stageRun,
            "Synthesize Analysis",
            {
                numMappings: allMappings.length,
                numVariations: allVariations.length,
                numTags: allTags.length
            }
        );

        // Import the synthesizeAnalysis function
        const { synthesizeAnalysis } = await import('../../utils/content/synthesis.mjs');

        // Synthesize the analysis
        let synthesis;
        try {
            synthesis = await synthesizeAnalysis(
                documentContent,
                chunkAnalyses,
                allMappings,
                allVariations,
                allTags,
                metalogikon,
                sourceMetadata.targetCoordinate,
                epiiLLMService,
                synthesisRun
            );

            if (!synthesis || typeof synthesis !== 'string') {
                throw new Error("Invalid synthesis result: must be a non-empty string");
            }

            // End the synthesis run
            langsmithTracing.endRunSuccess(synthesisRun, {
                synthesisLength: synthesis.length
            });
        } catch (synthesisError) {
            // End the synthesis run with error
            try {
                langsmithTracing.endRunError(synthesisRun, synthesisError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Rethrow the error to stop the pipeline
            throw new Error(`Failed to synthesize analysis: ${synthesisError.message}`);
        }

        // 3. Generate core elements
        console.log(`Generating core elements...`);
        const coreElementsRun = langsmithTracing.createChildRun(
            stageRun,
            "Generate Core Elements",
            {
                synthesisLength: synthesis.length
            }
        );

        // Import the generateCoreElements function
        const { generateCoreElements } = await import('../../utils/content/synthesis.mjs');

        // Generate core elements and relational properties
        let coreElementsResult;
        try {
            coreElementsResult = await generateCoreElements(
                synthesis,
                allMappings,
                allVariations,
                allTags,
                // Remove metalogikon parameter as it's no longer used
                sourceMetadata.targetCoordinate,
                epiiLLMService,
                coreElementsRun
            );

            if (!coreElementsResult || !coreElementsResult.coreElements || !Array.isArray(coreElementsResult.coreElements)) {
                throw new Error("Invalid core elements result: must contain an array of coreElements");
            }

            // End the core elements run
            langsmithTracing.endRunSuccess(coreElementsRun, {
                numCoreElements: coreElementsResult.coreElements.length,
                hasRelationalProperties: Object.values(coreElementsResult.relationalProperties).some(arr => arr.length > 0)
            });
        } catch (coreElementsError) {
            // End the core elements run with error
            try {
                langsmithTracing.endRunError(coreElementsRun, coreElementsError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Rethrow the error to stop the pipeline
            throw new Error(`Failed to generate core elements and relational properties: ${coreElementsError.message}`);
        }

        // 4. Prepare state for the next stage WITHOUT using ...state to avoid state bloat
        // Only include essential properties needed by stage -0
        // ENHANCED: Optimized state passing to reduce memory usage and improve clarity

        // Extract actionable summary from synthesis if available
        let actionableSummary = "";
        const actionableSummaryMatch = synthesis.match(/#+\s*ACTIONABLE\s+SUMMARY\s*\n+([\s\S]+?)(?:\n#+|$)/i);
        if (actionableSummaryMatch && actionableSummaryMatch[1]) {
            actionableSummary = actionableSummaryMatch[1].trim();
            console.log(`Extracted actionable summary (${actionableSummary.length} chars)`);
        }

        const stageMinus1Output = {
            // Analysis results - core outputs from this stage
            synthesis,
            coreElements: coreElementsResult.coreElements,
            relationalProperties: coreElementsResult.relationalProperties,
            allMappings,
            allVariations,
            allTags,
            actionableSummary, // New field with extracted actionable summary

            // Document identification - essential for tracking
            documentId: state.documentId,
            fileId: state.fileId,

            // User context - needed for permissions
            userId: state.userId,

            // Source metadata - contains targetCoordinate and other essential metadata
            sourceMetadata: state.sourceMetadata,

            // Service for document operations - needed for stage -0
            bpMCPService: state.bpMCPService
        };

        // Ensure no unnecessary data is included
        if (stageMinus1Output.graphData) {
            console.error(`Removing unexpected graphData from stageMinus1Output`);
            delete stageMinus1Output.graphData;
        }

        // Log the optimized state structure
        console.log("Optimized state for Stage -0 with the following properties:");
        console.log(Object.keys(stageMinus1Output).join(", "));

        // End the stage run with enhanced tracing information
        try {
            langsmithTracing.endRunSuccess(stageRun, {
                synthesisLength: synthesis.length,
                numCoreElements: coreElementsResult.coreElements.length,
                hasRelationalProperties: Object.values(coreElementsResult.relationalProperties).some(arr => arr.length > 0),
                numMappings: allMappings.length,
                numVariations: allVariations.length,
                numTags: allTags.length,
                hasActionableSummary: Boolean(stageMinus1Output.actionableSummary),
                actionableSummaryLength: stageMinus1Output.actionableSummary ? stageMinus1Output.actionableSummary.length : 0,
                qlOperatorsCount: coreElementsResult.relationalProperties.qlOperators.length,
                epistemicEssenceCount: coreElementsResult.relationalProperties.epistemicEssence.length,
                archetypeAnchorsCount: coreElementsResult.relationalProperties.archetypeAnchors.length,
                semanticFrameworkCount: coreElementsResult.relationalProperties.semanticFramework.length
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        console.log("--- Epii Pipeline: Stage -1 Complete ---");
        console.log(`Produced ${allMappings.length} consolidated mappings, ${allVariations.length} variations, and ${allTags.length} tags`);
        console.log(`Synthesis length: ${synthesis.length} characters, Core elements: ${coreElementsResult.coreElements.length}`);

        // Log relational properties with more detail
        console.log(`Relational properties extracted:`);
        console.log(`- QL Operators: ${coreElementsResult.relationalProperties.qlOperators.length} (${coreElementsResult.relationalProperties.qlOperators.map(op => op.name || op).join(', ')})`);
        console.log(`- Epistemic Essence: ${coreElementsResult.relationalProperties.epistemicEssence.length} (${coreElementsResult.relationalProperties.epistemicEssence.map(ee => ee.name || ee).join(', ')})`);
        console.log(`- Archetypal Anchors: ${coreElementsResult.relationalProperties.archetypeAnchors.length} (${coreElementsResult.relationalProperties.archetypeAnchors.map(aa => aa.name || aa).join(', ')})`);
        console.log(`- Semantic Framework: ${coreElementsResult.relationalProperties.semanticFramework.length} (${coreElementsResult.relationalProperties.semanticFramework.map(sf => sf.name || sf).join(', ')})`);

        // Log actionable summary if available
        if (stageMinus1Output.actionableSummary) {
            console.log(`Actionable Summary: "${stageMinus1Output.actionableSummary}"`);
        } else {
            console.log(`No actionable summary extracted from synthesis`);
        }

        return stageMinus1Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -1:`, error);

        // End the stage run with error
        try {
            langsmithTracing.endRunError(stageRun, error);
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        // Throw a more descriptive error
        throw new Error(`Epii Pipeline Stage -1 failed: ${error.message}`);
    }
}
