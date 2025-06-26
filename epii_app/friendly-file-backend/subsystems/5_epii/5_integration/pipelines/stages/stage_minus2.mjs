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
import epiiLLMService from '../../../2_services/epii-llm.service.mjs';
import langsmithTracing from '../../../../../databases/shared/services/langsmith-tracing.mjs';

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
        // 1. Retrieve Metalogikon Framework using BPMCP bimbaKnowing tool
        console.log(`Retrieving Metalogikon Framework from #2-1 and all children using BPMCP...`);
        const templateRun = langsmithTracing.createToolRun(
            stageRun,
            "Retrieve MEF via BPMCP",
            { mefRootCoordinate: '#2-1' }
        );

        let metalogikon;
        try {
            // Use BPMCP bimbaKnowing tool to get MEF root and all children
            const mefRootCoordinate = '#2-1';

            console.log(`🔬 Fetching MEF from #2-1 and all children using queryBimbaGraph...`);

            // Use queryBimbaGraph to get #2-1 and all children/grandchildren
            const mefResult = await state.bpMCPService.callTool('queryBimbaGraph', {
                query: `MATCH (n)
                        WHERE n.bimbaCoordinate = '#2-1'
                           OR n.bimbaCoordinate STARTS WITH '#2-1-'
                        RETURN n
                        ORDER BY n.bimbaCoordinate`,
                params: {}
            });

            // Just use the raw MEF data directly - no complex parsing bullshit!
            let mefContext = "No Metalogikon Framework data available.";
            let hasMEFData = false;

            if (mefResult && mefResult.processedRecords && Array.isArray(mefResult.processedRecords) && mefResult.processedRecords.length > 0) {
                console.log(`✅ MEF: Successfully got ${mefResult.processedRecords.length} records from BPMCP`);

                // Convert raw records directly to readable text for the LLM
                mefContext = `# Metalogikon Framework Context\n\n`;
                mefContext += `Retrieved ${mefResult.processedRecords.length} MEF nodes for analysis:\n\n`;

                mefResult.processedRecords.forEach((record, index) => {
                    if (record.n && record.n.properties) {
                        const props = record.n.properties;
                        mefContext += `## ${props.bimbaCoordinate || `Node ${index + 1}`}: ${props.name || 'Unnamed'}\n`;
                        if (props.description) {
                            mefContext += `${props.description}\n\n`;
                        }
                        if (props.content) {
                            mefContext += `${props.content}\n\n`;
                        }
                    }
                });

                hasMEFData = true;
                console.log(`✅ MEF: Successfully processed ${mefResult.processedRecords.length} records into context`);
            } else {
                console.warn(`⚠️ MEF: No processedRecords found in BPMCP result`);
            }

            // Simple metalogikon object - just indicate if we have data
            metalogikon = {
                mefContext: mefContext,
                hasData: hasMEFData
            };

            try {
                langsmithTracing.endRunSuccess(templateRun, {
                    mefDataFound: metalogikon.hasData,
                    mefContextLength: mefContext.length
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        } catch (templateError) {
            console.warn(`⚠️ MEF retrieval failed, but continuing pipeline: ${templateError.message}`);

            // Don't emit error events for MEF failures - they're not critical to pipeline success
            try {
                langsmithTracing.endRunSuccess(templateRun, {
                    mefRetrievalFailed: true,
                    errorMessage: templateError.message,
                    fallbackUsed: true
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Fallback to empty MEF structure - this is not a pipeline failure
            console.log(`📝 Using fallback empty MEF structure - pipeline continues normally`);
            metalogikon = {
                mefContext: "No Metalogikon Framework data available.",
                hasData: false
            };
        }

        // 2. Prepare for batch processing - we'll generate context windows per batch, not per chunk
        console.log(`Preparing for batch analysis of ${documentChunks.length} chunks...`);
        const contextWindowsRun = langsmithTracing.createToolRun(
            stageRun,
            "Prepare Batch Context Windows",
            { numChunks: documentChunks.length }
        );

        // Import the generateContextWindow function
        const { generateContextWindow } = await import('../../../1_utils/content/context.mjs');

        // We'll generate context windows per batch during batch processing
        console.log(`Context windows will be generated per batch during analysis`);

        // End the context windows preparation run
        try {
            langsmithTracing.endRunSuccess(contextWindowsRun, {
                message: "Batch context window preparation completed"
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        // 3. Process chunks in batches for better performance
        console.log(`Processing ${documentChunks.length} chunks in batches...`);
        const batchSize = 6; // Process 6 chunks at a time
        const numBatches = Math.ceil(documentChunks.length / batchSize);
        console.log(`Will process chunks in ${numBatches} batches of up to ${batchSize} chunks each`);

        // Initialize arrays to store batch-level results
        const batchAnalyses = []; // Stores the rich JSON object for each batch
        const batchMappings = []; // Stores mappings extracted from each batchAnalysisObject
        const batchVariations = []; // Stores variations extracted from each batchAnalysisObject
        const batchTags = []; // Stores tags extracted from each batchAnalysisObject


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

            // Generate a single comprehensive context window for the entire batch
            console.log(`Generating comprehensive context window for batch ${batchIndex + 1}...`);

            // Debug: Check what we're passing to context window generation
            console.log(`🔍 Context window generation inputs:
- fullBimbaMap nodes: ${state.fullBimbaMap?.nodes?.length || 0}
- bimbaEnhancedContext length: ${state.bimbaEnhancedContext?.length || 0}
- projectContext keys: ${Object.keys(state.projectContext || {}).join(', ')}
- targetCoordinate: ${sourceMetadata.targetCoordinate}
- bimbaMapSummary length: ${state.bimbaMapSummary?.length || 0}`);

            const batchContextWindow = await generateContextWindow(
                concatenatedBatchContent,
                state.documentContent,
                state.bimbaEnhancedContext,
                state.fullBimbaMap,
                {
                    ...state.projectContext,
                    targetCoordinate: sourceMetadata.targetCoordinate // Ensure target coordinate is passed
                },
                state.bimbaMapSummary,
                { forAnalysis: true } // Crucial flag for comprehensive context
            );

            // Debug: Check what we got back from context window generation
            console.log(`✅ Generated context window with:
- bimbaContext.directlyRelevantNodes: ${batchContextWindow.bimbaContext?.directlyRelevantNodes?.length || 0}
- bimbaContext.parentNodes: ${batchContextWindow.bimbaContext?.parentNodes?.length || 0}
- bimbaContext.siblingNodes: ${batchContextWindow.bimbaContext?.siblingNodes?.length || 0}
- qlContext available: ${!!batchContextWindow.qlContext}
- contextText length: ${batchContextWindow.contextText?.length || 0}`);

            const batchContextWindows = [batchContextWindow]; // Single context window for the batch

            // The concept of "assignedCoordinates" might also change.
            // If the analysis is for the whole batch, it might relate to the primary targetCoordinate.
            // For now, we'll pass the main targetCoordinate, assuming analyzeChunkGroup adapts.
            const batchTargetCoordinate = sourceMetadata.targetCoordinate;


            console.log(`Analyzing concatenated content of batch ${batchIndex + 1} (length: ${concatenatedBatchContent.length} chars)...`);

            let singleBatchAnalysisResult; // This will be the rich JSON object
            try {
                const { analyzeChunkGroup } = await import('../../../1_utils/content/analysis.mjs');
                singleBatchAnalysisResult = await analyzeChunkGroup(
                    batchChunkTexts,
                    sourceMetadata,
                    state.bimbaContext,
                    state.userContext,
                    [batchTargetCoordinate],
                    metalogikon,
                    {
                        llmService: epiiLLMService,
                        concatenatedContent: concatenatedBatchContent,
                        contextWindows: batchContextWindows,
                        useProvidedContextWindows: true,
                        fullBimbaMap: state.fullBimbaMap,
                        documentContent: state.documentContent,
                        analyzeAsSingleUnit: true
                    },
                    state
                );

                // Store the rich JSON object for the batch
                batchAnalyses[batchIndex] = singleBatchAnalysisResult;

                // Populate batch-level mappings, variations, tags
                batchMappings[batchIndex] = singleBatchAnalysisResult.extractedMappings || [];
                batchVariations[batchIndex] = singleBatchAnalysisResult.identifiedVariations || [];
                batchTags[batchIndex] = singleBatchAnalysisResult.extractedTags || []; // Assuming 'extractedTags' field

                // Logging for the batch result
                if (singleBatchAnalysisResult && !singleBatchAnalysisResult.error) {
                    const analysisText = singleBatchAnalysisResult.analysis || singleBatchAnalysisResult.overallSummary || "";
                    console.log(`Successfully analyzed batch ${batchIndex + 1}. Analysis text length: ${analysisText.length}`);
                    console.log(`Batch ${batchIndex + 1}: ${batchMappings[batchIndex].length} mappings, ${batchVariations[batchIndex].length} variations, ${batchTags[batchIndex].length} tags.`);
                } else if (singleBatchAnalysisResult && singleBatchAnalysisResult.error) {
                    console.error(`Error analyzing batch ${batchIndex + 1}: ${singleBatchAnalysisResult.error}`);
                     // Store error information appropriately if needed for downstream
                    batchMappings[batchIndex] = [];
                    batchVariations[batchIndex] = [];
                    batchTags[batchIndex] = [];
                } else {
                    console.warn(`Batch ${batchIndex + 1} analysis result was empty or not in expected format.`);
                    batchMappings[batchIndex] = [];
                    batchVariations[batchIndex] = [];
                    batchTags[batchIndex] = [];
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
                console.warn(`⚠️ Batch ${batchIndex + 1} analysis failed, but continuing pipeline:`, batchError.message);

                // Don't emit error events for batch failures - they're handled gracefully
                // Just end the batch run with a warning instead of an error
                try {
                    langsmithTracing.endRunSuccess(batchRun, {
                        batchFailed: true,
                        errorMessage: batchError.message,
                        fallbackUsed: true
                    });
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

                // Store error information for the batch
                const errorMsg = `Batch analysis failed but pipeline continues: ${batchError.message}`;
                batchAnalyses[batchIndex] = { error: errorMsg, analysis: errorMsg, overallSummary: errorMsg, mainThemes:[], extractedMappings:[], identifiedVariations:[], naturalElaborations:[], deepElaboration:[], novelContributions:[], qlDynamics:[], extractedTags:[] };
                batchMappings[batchIndex] = [];
                batchVariations[batchIndex] = [];
                batchTags[batchIndex] = [];
            }
        }

        // 7. Prepare state for the next stage
        const stageMinus2Output = {
            batchAnalyses,        // Array of rich JSON objects (one per batch)
            batchMappings,        // Array of arrays of mappings (one inner array per batch)
            batchVariations,      // Array of arrays of variations (one inner array per batch)
            batchTags,            // Array of arrays of tags (one inner array per batch)
            hasEnhancedBatchAnalysis: true,
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
            chunkContextWindows: state.chunkContextWindows, // Pass context windows if needed downstream
            // AG-UI context for event emission
            skillContext: state.skillContext
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
            numMappingsTotal: batchMappings.flat().length,
            numVariationsTotal: batchVariations.flat().length,
            numTagsTotal: batchTags.flat().length,
            hasEnhancedBatchAnalysis: true // Keep this flag or adapt its meaning
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
