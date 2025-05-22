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

        // Initialize array to store batch analysis results
        const batchAnalyses = [];
        // Per-chunk mappings, variations, and tags might be deprecated or changed with batch-level analysis.
        // For now, we'll keep them but they might not be populated as before, or their meaning might shift.
        const chunkMappings = []; // Retained for now, structure might need to change
        const chunkVariations = []; // Retained for now, structure might need to change
        const chunkTags = []; // Retained for now, structure might need to change


        // Process chunks in batches
        for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
            const batchStart = batchIndex * batchSize;
            const batchEnd = Math.min((batchIndex + 1) * batchSize, documentChunks.length);
            const currentBatchSize = batchEnd - batchStart;

            console.log(`Processing batch ${batchIndex + 1}/${numBatches} (analyzing ${currentBatchSize} chunks as a single unit)...`);

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

            // Concatenate chunks in the batch to form a single text unit for analysis
            // We'll use originalChunks as they represent the unmodified content.
            const batchChunkTexts = originalChunks.slice(batchStart, batchEnd);
            const concatenatedBatchContent = batchChunkTexts.join("\n\n---\n\n"); // Separator for clarity if needed by LLM

            // For context, we might need a strategy for combining context windows or using a general one.
            // For now, let's assume analyzeChunkGroup will handle context for the concatenated content.
            // We can pass all context windows for the batch, or a combined one.
            // Let's pass the array of context windows, the new analyzeChunkGroup can decide how to use them.
            const batchContextWindows = comprehensiveContextWindows.slice(batchStart, batchEnd);

            // The concept of "assignedCoordinates" might also change.
            // If the analysis is for the whole batch, it might relate to the primary targetCoordinate.
            // For now, we'll pass the main targetCoordinate, assuming analyzeChunkGroup adapts.
            const batchTargetCoordinate = sourceMetadata.targetCoordinate;


            console.log(`Analyzing concatenated content of batch ${batchIndex + 1} (length: ${concatenatedBatchContent.length} chars)...`);

            let singleBatchAnalysisResult;
            try {
                // Import the analyzeChunkGroup function
                // This function is now expected to:
                // 1. Take concatenated content (or an array of chunks it will concatenate).
                // 2. Return a SINGLE analysis object for the entire batch.
                const { analyzeChunkGroup } = await import('../../utils/content/analysis.mjs');

                // Call analyzeChunkGroup with the concatenated content
                // The options object might need adjustment based on the refactored analyzeChunkGroup.
                // We pass `batchChunkTexts` (array) and `concatenatedBatchContent` (string)
                // The new `analyzeChunkGroup` should ideally handle this, perhaps preferring `concatenatedBatchContent`.
                singleBatchAnalysisResult = await analyzeChunkGroup(
                    batchChunkTexts, // Array of original chunk texts in the batch
                    sourceMetadata,
                    state.bimbaContext,
                    state.userContext,
                    [batchTargetCoordinate], // Assign the batch to the main target coordinate
                    metalogikon,
                    {
                        llmService: epiiLLMService,
                        concatenatedContent: concatenatedBatchContent, // Explicitly pass concatenated content
                        contextWindows: batchContextWindows, // Pass all context windows for the batch
                        useProvidedContextWindows: true,
                        fullBimbaMap: state.fullBimbaMap,
                        documentContent: state.documentContent, // Full document content for broader context
                        analyzeAsSingleUnit: true // New flag indicating batch-level analysis
                    },
                    state // Pass the entire state as a fallback
                );

                // Store the single analysis result for the batch
                batchAnalyses[batchIndex] = singleBatchAnalysisResult;

                // Logging for the batch result
                // The structure of singleBatchAnalysisResult will determine what can be logged here.
                // Assuming it's an object with an 'analysis' text and potentially other fields.
                if (typeof singleBatchAnalysisResult === 'object' && singleBatchAnalysisResult.analysis) {
                    console.log(`Successfully analyzed batch ${batchIndex + 1}. Analysis length: ${singleBatchAnalysisResult.analysis.length}`);
                    // If the new analyzeChunkGroup still provides mappings, variations, tags for the batch as a whole:
                    // chunkMappings[batchIndex] = singleBatchAnalysisResult.extractedMappings || [];
                    // chunkVariations[batchIndex] = singleBatchAnalysisResult.identifiedVariations || [];
                    // chunkTags[batchIndex] = singleBatchAnalysisResult.tags || [];
                } else if (typeof singleBatchAnalysisResult === 'string') {
                    console.log(`Successfully analyzed batch ${batchIndex + 1}. Analysis length: ${singleBatchAnalysisResult.length}`);
                } else {
                    console.log(`Successfully analyzed batch ${batchIndex + 1}. Result type: ${typeof singleBatchAnalysisResult}`);
                }


                // End the batch run successfully
                try {
                    langsmithTracing.endRunSuccess(batchRun, {
                        analysisLength: typeof singleBatchAnalysisResult === 'string' ? singleBatchAnalysisResult.length : (singleBatchAnalysisResult?.analysis?.length || 0),
                        processedAsSingleUnit: true
                    });
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

            } catch (batchError) {
                console.error(`Error analyzing batch ${batchIndex + 1} as a single unit:`, batchError);

                // End the batch run with error
                try {
                    langsmithTracing.endRunError(batchRun, batchError);
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

                // Store error information for the batch
                batchAnalyses[batchIndex] = `Error analyzing batch as single unit: ${batchError.message}`;
                // chunkMappings, chunkVariations, chunkTags would remain empty for this batch or handle error appropriately
            }
            // Removed per-chunk result logging, batch result logged above
        }

        // 7. Prepare state for the next stage
        // The output now contains batchAnalyses instead of chunkAnalyses.
        // chunkMappings, chunkVariations, chunkTags might be re-evaluated based on batch analysis.
        // For now, they are passed as potentially empty or differently structured.
        const stageMinus2Output = {
            batchAnalyses, // New: array of single analysis results per batch
            // chunkAnalyses, // Old: array of per-chunk analyses - REMOVED/REPLACED
            chunkMappings, // Retained: structure/relevance TBD with batch analysis
            chunkVariations, // Retained: structure/relevance TBD with batch analysis
            chunkTags, // Retained: structure/relevance TBD with batch analysis
            // Flag to indicate that this stage has been enhanced with deeper elaboration (now at batch level)
            hasEnhancedBatchAnalysis: true, // Renamed for clarity
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
            documentChunks: state.documentChunks, // Still pass original chunking info if needed downstream
            originalChunks: state.originalChunks,
            chunkContextWindows: state.chunkContextWindows // Pass context windows if needed downstream
            // Explicitly NOT including graphData to prevent leakage
        };

        // Double-check that no graph data is included
        if (stageMinus2Output.graphData) {
            console.log(`Removing graphData from stageMinus2Output`);
            delete stageMinus2Output.graphData;
        }

        // End the stage run
        try {
            // Metrics for batch-level analysis
            const numBatchesAnalyzed = batchAnalyses.length;
            let totalAnalysisContentLength = 0;
            batchAnalyses.forEach(analysis => {
                if (typeof analysis === 'string') {
                    totalAnalysisContentLength += analysis.length;
                } else if (typeof analysis === 'object' && analysis.analysis) {
                    totalAnalysisContentLength += analysis.analysis.length;
                }
                // Add more specific metrics if the structure of batch analysis is known
            });

            langsmithTracing.endRunSuccess(stageRun, {
                numBatchesAnalyzed,
                totalAnalysisContentLength,
                // numMappingsTotal, numVariationsTotal, numTagsTotal might need re-evaluation
                // based on how they are handled with batch-level analysis.
                // For now, we'll report based on what's available.
                numMappingsTotal: chunkMappings.flat().length, // If populated per batch
                numVariationsTotal: chunkVariations.flat().length, // If populated per batch
                numTagsTotal: chunkTags.flat().length, // If populated per batch
                hasEnhancedBatchAnalysis: true
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        console.log("--- Epii Pipeline: Stage -2 Complete ---");
        console.log(`Completed analysis for ${batchAnalyses.length} batches.`);

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
