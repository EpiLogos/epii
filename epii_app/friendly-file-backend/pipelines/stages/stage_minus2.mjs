/**
 * Stage -2: Relate Concepts & Identify Variations (Analyze Chunks)
 *
 * ENHANCED: This stage now goes beyond simple alignment confirmation to provide
 * deep elaboration on the significance, nuances, and implications of the alignment
 * between text chunks and Bimba coordinates.
 *
 * This is the core analysis engine. It iterates through chunks, tags them, extracts mappings,
 * and identifies variations using LLMs and context. Enhanced with context windows for better analysis.
 * It now provides deeper elaboration, clearer differentiation between QL and Bimba, and more
 * sophisticated Bimba-centric analysis.
 */

// Import required modules
import epiiLLMService from '../../services/epii-llm.service.mjs';
import langsmithTracing from '../../services/langsmith-tracing.mjs';

/**
 * Stage -2: Relate Concepts & Identify Variations (Analyze Chunks)
 * The core analysis engine. Iterates through chunks, tags them, extracts mappings, and identifies variations using LLMs and context.
 * Enhanced with context windows for better analysis.
 *
 * @param {object} state - The state from Stage -3
 * @returns {Promise<object>} - A promise resolving to the state after Stage -2
 */
export async function runStageMinus2(state) {
    const {
        documentChunks,
        originalChunks,
        sourceMetadata,
        coordinateMap
    } = state;
    console.log(`--- Epii Pipeline: Stage -2 (Relate Concepts & Identify Variations) ---`);

    // Create a run tree for this stage with error handling
    let stageRun;
    try {
        stageRun = langsmithTracing.createStageRunTree(
            "Stage -2: Relate Concepts & Identify Variations",
            {
                numChunks: documentChunks.length,
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
        // 1. Retrieve the Metalogikon epistemic analysis template
        console.log(`Retrieving Metalogikon epistemic analysis template...`);
        const templateRun = langsmithTracing.createToolRun(
            stageRun,
            "Get Metalogikon Template",
            { coordinateMapSize: Object.keys(coordinateMap).length }
        );

        let metalogikon;
        try {
            // Import graphData utilities
            const { getMetalogikonTemplateFromBimbaMap } = await import('../../utils/graphData.utils.mjs');

            // Call the function directly with bimbaMap
            metalogikon = getMetalogikonTemplateFromBimbaMap(coordinateMap, state.fullBimbaMap);

            console.log(`Retrieved Metalogikon template with ${metalogikon.lenses?.length || 0} lenses`);
            console.log(`MEF Root: ${metalogikon.rootNode?.name || 'Unknown'}`);

            // Log some of the MEF lenses for debugging
            if (metalogikon.lenses && metalogikon.lenses.length > 0) {
                console.log(`MEF Lenses sample: ${metalogikon.lenses.slice(0, 3).map(l => l.name).join(', ')}...`);
            }

            try {
                langsmithTracing.endRunSuccess(templateRun, {
                    templateSize: metalogikon.lenses?.length || 0
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        } catch (templateError) {
            console.error(`Error retrieving Metalogikon template: ${templateError.message}`);
            try {
                langsmithTracing.endRunError(templateRun, templateError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
            throw new Error(`Failed to retrieve Metalogikon template: ${templateError.message}`);
        }

        // 2. Generate comprehensive context windows for all chunks at once
        console.log(`Generating comprehensive context windows for all ${documentChunks.length} chunks...`);
        const contextWindowsRun = langsmithTracing.createToolRun(
            stageRun,
            "Generate Comprehensive Context Windows",
            { numChunks: documentChunks.length }
        );

        // Import the generateContextWindow function
        const { generateContextWindow } = await import('../../utils/content/context.mjs');

        let comprehensiveContextWindows = [];
        try {
            // Generate all comprehensive context windows in parallel
            comprehensiveContextWindows = await Promise.all(
                originalChunks.map(chunk =>
                    generateContextWindow(
                        chunk,
                        state.documentContent,
                        state.bimbaEnhancedContext,
                        state.fullBimbaMap,
                        state.projectContext,
                        state.bimbaMapSummary,
                        { forAnalysis: true } // Crucial flag for comprehensive context
                    )
                )
            );

            console.log(`Successfully generated ${comprehensiveContextWindows.length} comprehensive context windows`);

            // End the context windows run with success
            try {
                langsmithTracing.endRunSuccess(contextWindowsRun, {
                    numContextWindows: comprehensiveContextWindows.length
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        } catch (contextWindowsError) {
            console.error(`Error generating comprehensive context windows:`, contextWindowsError);

            // End the context windows run with error
            try {
                langsmithTracing.endRunError(contextWindowsRun, contextWindowsError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            throw new Error(`Failed to generate comprehensive context windows: ${contextWindowsError.message}`);
        }

        // 3. Process chunks in batches for better performance
        console.log(`Processing ${documentChunks.length} chunks in batches...`);
        const batchSize = 6; // Process 6 chunks at a time
        const numBatches = Math.ceil(documentChunks.length / batchSize);
        console.log(`Will process chunks in ${numBatches} batches of up to ${batchSize} chunks each`);

        // Initialize arrays to store analysis results
        const chunkAnalyses = [];
        const chunkMappings = [];
        const chunkVariations = [];
        const chunkTags = [];

        // Process chunks in batches
        for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
            const batchStart = batchIndex * batchSize;
            const batchEnd = Math.min((batchIndex + 1) * batchSize, documentChunks.length);
            const currentBatchSize = batchEnd - batchStart;

            console.log(`Processing batch ${batchIndex + 1}/${numBatches} (chunks ${batchStart + 1}-${batchEnd})...`);

            // Create a batch run for tracing
            const batchRun = langsmithTracing.createChildRun(
                stageRun,
                `Batch ${batchIndex + 1}`,
                {
                    batchIndex,
                    batchSize: currentBatchSize,
                    chunkRange: `${batchStart + 1}-${batchEnd}`
                }
            );

            // Process chunks as a group to maintain context between them
            console.log(`Analyzing batch ${batchIndex + 1} as a group to maintain context between chunks...`);

            // Note: batchRun was already created above, no need to create it again

            let batchResults;
            try {
                // Extract batch chunks and use the pre-generated comprehensive context windows
                const batchChunks = originalChunks.slice(batchStart, batchEnd);
                const batchContextWindows = comprehensiveContextWindows.slice(batchStart, batchEnd);

                // Verify that we have context windows for all chunks in the batch
                if (batchContextWindows.length !== batchChunks.length) {
                    console.warn(`Context windows array length (${batchContextWindows.length}) does not match batch chunks length (${batchChunks.length}). This should not happen.`);
                }

                // Log the first context window for debugging
                console.log(`--- Context Window Debug Information (Stage -2) ---`);
                console.log(`Using pre-generated comprehensive context window for first chunk in batch (first 200 chars): ${batchContextWindows[0].contextText.substring(0, 200)}...`);
                console.log(`Context window count: ${batchContextWindows.length} for ${batchChunks.length} chunks`);
                console.log(`--- End Context Window Debug Information ---`);

                // Create assigned coordinates for each chunk (using target coordinate)
                const batchAssignedCoordinates = Array(batchChunks.length).fill([sourceMetadata.targetCoordinate]);

                // Import the analyzeChunkGroup function
                const { analyzeChunkGroup } = await import('../../utils/content/analysis.mjs');

                // Analyze the batch as a group using pre-generated comprehensive context windows
                const batchAnalysisResults = await analyzeChunkGroup(
                    batchChunks,
                    sourceMetadata,
                    state.bimbaContext,
                    state.userContext,
                    batchAssignedCoordinates,
                    metalogikon,
                    {
                        llmService: epiiLLMService,
                        contextWindows: batchContextWindows,
                        useProvidedContextWindows: true, // Flag to use provided context windows
                        fullBimbaMap: state.fullBimbaMap,
                        documentContent: state.documentContent // Pass documentContent in options
                    },
                    state // Pass the entire state as a fallback
                );

                // Process the results with enhanced elaborations
                batchResults = batchAnalysisResults.map((result, index) => {
                    const chunkIndex = batchStart + index;

                    // Store the analysis results
                    chunkAnalyses[chunkIndex] = result.analysis || '';
                    chunkMappings[chunkIndex] = result.extractedMappings || [];
                    chunkVariations[chunkIndex] = result.identifiedVariations || [];
                    chunkTags[chunkIndex] = result.tags || [];

                    // Extract the enhanced elaboration elements
                    const deepElaboration = result.deepElaboration || [];
                    const novelContributions = result.novelContributions || [];
                    const qlDynamics = result.qlDynamics || [];

                    // Add enhanced elements to the analysis object
                    if (deepElaboration.length > 0 || novelContributions.length > 0 || qlDynamics.length > 0) {
                        // If the analysis is already a string, convert it to an object
                        let analysisObj;
                        try {
                            analysisObj = typeof chunkAnalyses[chunkIndex] === 'string' ?
                                JSON.parse(chunkAnalyses[chunkIndex]) : chunkAnalyses[chunkIndex];
                        } catch (e) {
                            // If parsing fails, create a new object
                            analysisObj = { originalAnalysis: chunkAnalyses[chunkIndex] };
                        }

                        // Add enhanced elements
                        analysisObj.deepElaboration = deepElaboration;
                        analysisObj.novelContributions = novelContributions;
                        analysisObj.qlDynamics = qlDynamics;
                        analysisObj.isEnhancedAnalysis = true;

                        // Update the analysis
                        chunkAnalyses[chunkIndex] = analysisObj;
                    }

                    // Log success with enhanced information
                    console.log(`Successfully analyzed chunk ${chunkIndex + 1}/${documentChunks.length} with ${deepElaboration.length} deep elaboration points, ${novelContributions.length} novel contributions, and ${qlDynamics.length} QL dynamics`);

                    return {
                        chunkIndex,
                        success: true,
                        hasEnhancedAnalysis: deepElaboration.length > 0 || novelContributions.length > 0 || qlDynamics.length > 0
                    };
                });

                // End the batch run successfully
                try {
                    langsmithTracing.endRunSuccess(batchRun, {
                        successCount: currentBatchSize,
                        errorCount: 0
                    });
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }
            } catch (batchError) {
                console.error(`Error analyzing batch ${batchIndex + 1}:`, batchError);

                // End the batch run with error
                try {
                    langsmithTracing.endRunError(batchRun, batchError);
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

                // Store empty results for all chunks in the batch
                for (let i = batchStart; i < batchEnd; i++) {
                    chunkAnalyses[i] = `Error analyzing batch: ${batchError.message}`;
                    chunkMappings[i] = [];
                    chunkVariations[i] = [];
                    chunkTags[i] = [];
                }

                // Create batch results with errors
                batchResults = Array(currentBatchSize).fill().map((_, index) => ({
                    chunkIndex: batchStart + index,
                    success: false,
                    error: batchError.message
                }));
            }

            console.log(`Batch ${batchIndex + 1} complete. Results:`, batchResults.map(r => r.success ? 'Success' : 'Error'));
        }

        // 7. Prepare state for the next stage WITHOUT using ...state to avoid state bloat
        const stageMinus2Output = {
            chunkAnalyses,
            chunkMappings,
            chunkVariations,
            chunkTags,
            // Flag to indicate that this stage has been enhanced with deeper elaboration
            hasEnhancedAnalysis: true,
            metalogikon,
            // Include only essential properties from previous state
            documentId: state.documentId,
            targetCoordinate: state.targetCoordinate,
            sourceFileName: state.sourceFileName,
            sourceType: state.sourceType,
            fileId: state.fileId,
            userId: state.userId,
            // Include minimal context data needed for next stage
            bimbaContext: state.bimbaContext,
            userContext: state.userContext,
            coordinateMap: state.coordinateMap,
            bimbaEnhancedContext: state.bimbaEnhancedContext,
            bimbaMapSummary: state.bimbaMapSummary,
            fullBimbaMap: state.fullBimbaMap,
            projectContext: state.projectContext,
            // Include source metadata
            sourceMetadata: state.sourceMetadata,
            // Include minimal document reference
            document: state.document,
            // Include bpMCPService for document operations
            bpMCPService: state.bpMCPService,
            // Include original document content and chunks for reference
            documentContent: state.documentContent,
            documentChunks: state.documentChunks,
            originalChunks: state.originalChunks,
            chunkContextWindows: state.chunkContextWindows
            // Explicitly NOT including graphData to prevent leakage
        };

        // Double-check that no graph data is included
        if (stageMinus2Output.graphData) {
            console.log(`Removing graphData from stageMinus2Output`);
            delete stageMinus2Output.graphData;
        }

        // End the stage run
        try {
            // Count enhanced analysis elements
            let deepElaborationCount = 0;
            let novelContributionsCount = 0;
            let qlDynamicsCount = 0;

            // Iterate through chunk analyses to count enhanced elements
            chunkAnalyses.forEach(analysis => {
                if (typeof analysis === 'object') {
                    deepElaborationCount += (analysis.deepElaboration || []).length;
                    novelContributionsCount += (analysis.novelContributions || []).length;
                    qlDynamicsCount += (analysis.qlDynamics || []).length;
                }
            });

            langsmithTracing.endRunSuccess(stageRun, {
                numChunksAnalyzed: chunkAnalyses.length,
                numMappingsTotal: chunkMappings.flat().length,
                numVariationsTotal: chunkVariations.flat().length,
                numTagsTotal: chunkTags.flat().length,
                // Include enhanced analysis metrics
                numDeepElaborations: deepElaborationCount,
                numNovelContributions: novelContributionsCount,
                numQLDynamics: qlDynamicsCount,
                hasEnhancedAnalysis: true
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        console.log("--- Epii Pipeline: Stage -2 Complete ---");

        return stageMinus2Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -2:`, error);

        // End the stage run with error
        try {
            langsmithTracing.endRunError(stageRun, error);
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        throw new Error(`Epii Pipeline Stage -2 failed: ${error.message}`);
    }
}
