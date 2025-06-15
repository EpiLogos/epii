/**
 * Epii Analysis Pipeline - Main Entry Point
 *
 * This file serves as the main entry point for the Epii Analysis Pipeline.
 * It imports all the stage functions from their respective files and exports
 * the complete pipeline.
 *
 * The pipeline follows the QL (-) Analysis cycle:
 * - Stage -5: Fetch Document (corresponds to +0)
 * - Stage -4: Contextualize Analysis (corresponds to +1)
 * - Stage -3: Integrate Structure (corresponds to +2)
 * - Stage -2: Relate Concepts & Identify Variations (corresponds to +3)
 * - Stage -1: Define Core Elements (corresponds to +4)
 * - Stage -0: Synthesize Payload (corresponds to +5)
 */

// Import all stage functions
import { runStageMinus5 } from './stages/stage_minus5.mjs';
import { runStageMinus4 } from './stages/stage_minus4.mjs';
import { runStageMinus3 } from './stages/stage_minus3.mjs';
import { runStageMinus2 } from './stages/stage_minus2.mjs';
import { runStageMinus1 } from './stages/stage_minus1.mjs';
import { runStageMinus0 } from './stages/stage_minus0.mjs';

// Import utility functions
import { invalidateBimbaCache, invalidateMEFCache, clearLLMCache } from '../../../../databases/shared/utils/cache.utils.mjs';
import { emitStageStarted, emitStageFinished, emitStageError, emitPipelineFailure, emitBimbaUpdateSuggestions, emitMemoryOnboarding, hasAGUIContext } from '../../../../databases/shared/utils/agui-integration.mjs';

/**
 * Invalidates all caches related to Bimba data.
 * This should be called when Bimba structure is updated.
 *
 * @returns {void}
 */
export function invalidateAllBimbaCaches() {
    console.log("Invalidating all Bimba-related caches");
    invalidateBimbaCache();
    invalidateMEFCache();
    clearLLMCache();
}

/**
 * Runs the complete Epii Analysis Pipeline.
 *
 * @param {object} initialState - The initial state for the pipeline
 * @returns {Promise<object>} - The final state after all stages
 * @throws {Error} - If any stage fails and error handling is not enabled
 */
export async function runPipeline(initialState = {}) {
    // Track the current stage for better error reporting
    let currentStage = 'initialization';

    try {
        // Validate required parameters
        if (!initialState.userId) {
            throw new Error("User ID is required for pipeline execution");
        }

        if (!initialState.targetCoordinate && !initialState.fileId && !initialState.documentId && !initialState.documentContent) {
            throw new Error("Either targetCoordinate, fileId, documentId, or documentContent is required");
        }

        // Make sure we have the bpMCPService
        if (!initialState.bpMCPService) {
            try {
                // Import it if not provided
                initialState.bpMCPService = (await import('../services/bpMCPService.mjs')).default;
                console.log("Imported bpMCPService for pipeline");
            } catch (importError) {
                throw new Error(`Failed to import bpMCPService: ${importError.message}`);
            }
        }

        // If we have a document to analyze
        if (initialState.targetCoordinate || initialState.fileId || initialState.documentId || initialState.documentContent) {
            console.log(`Starting Epii Document Analysis Pipeline...`);
            // Log initial state without the full graphData
            console.log(`Initial state:`, {
                userId: initialState.userId,
                targetCoordinate: initialState.targetCoordinate,
                fileId: initialState.fileId,
                documentId: initialState.documentId,
                documentContent: initialState.documentContent ? `[${initialState.documentContent.length} chars]` : null,
                graphData: initialState.graphData ?
                    `[Graph data with ${initialState.graphData.nodes?.length || 0} nodes and ${initialState.graphData.edges?.length || initialState.graphData.links?.length || 0} edges]` :
                    null
            });

            // Ensure graphData is included in the state
            let enhancedInitialState = {
                ...initialState,
                graphData: initialState.graphData || { nodes: [], edges: [] }
            };

            // Run the complete pipeline
            console.log(`Running complete Epii Analysis Pipeline...`);

            // Run all stages in sequence with proper error handling and AG-UI integration
            try {
                // Stage -5: Fetch Document
                currentStage = 'stage_minus5';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(enhancedInitialState)) {
                    emitStageStarted(enhancedInitialState.skillContext, currentStage, 'Fetching and preparing document', {
                        targetCoordinate: enhancedInitialState.targetCoordinate
                    });
                }
                const stageMinus5Output = await runStageMinus5(enhancedInitialState);
                if (hasAGUIContext(stageMinus5Output)) {
                    emitStageFinished(stageMinus5Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus5Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Stage -4: Contextualize Analysis
                currentStage = 'stage_minus4';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(stageMinus5Output)) {
                    emitStageStarted(stageMinus5Output.skillContext, currentStage, 'Gathering context and Bimba integration', {
                        targetCoordinate: stageMinus5Output.sourceMetadata?.targetCoordinate
                    });
                }
                const stageMinus4Output = await runStageMinus4(stageMinus5Output);
                if (hasAGUIContext(stageMinus4Output)) {
                    emitStageFinished(stageMinus4Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus4Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Stage -3: Integrate Structure
                currentStage = 'stage_minus3';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(stageMinus4Output)) {
                    emitStageStarted(stageMinus4Output.skillContext, currentStage, 'Chunking document and LightRAG integration', {
                        targetCoordinate: stageMinus4Output.sourceMetadata?.targetCoordinate
                    });
                }
                const stageMinus3Output = await runStageMinus3(stageMinus4Output);
                if (hasAGUIContext(stageMinus3Output)) {
                    emitStageFinished(stageMinus3Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus3Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Stage -2: Relate Concepts & Identify Variations
                currentStage = 'stage_minus2';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(stageMinus3Output)) {
                    emitStageStarted(stageMinus3Output.skillContext, currentStage, 'Analyzing concepts and identifying patterns', {
                        targetCoordinate: stageMinus3Output.sourceMetadata?.targetCoordinate,
                        chunksProcessed: stageMinus3Output.chunkAnalyses?.length || 0
                    });
                }
                const stageMinus2Output = await runStageMinus2(stageMinus3Output);
                if (hasAGUIContext(stageMinus2Output)) {
                    emitStageFinished(stageMinus2Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus2Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Stage -1: Define Core Elements
                currentStage = 'stage_minus1';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(stageMinus2Output)) {
                    emitStageStarted(stageMinus2Output.skillContext, currentStage, 'Synthesizing core elements', {
                        targetCoordinate: stageMinus2Output.sourceMetadata?.targetCoordinate,
                        mappingsFound: stageMinus2Output.batchMappings?.flat().length || 0
                    });
                }
                const stageMinus1Output = await runStageMinus1(stageMinus2Output);
                if (hasAGUIContext(stageMinus1Output)) {
                    emitStageFinished(stageMinus1Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus1Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Stage -0: Synthesize Payload
                currentStage = 'stage_minus0';
                console.log(`Starting ${currentStage}...`);
                if (hasAGUIContext(stageMinus1Output)) {
                    emitStageStarted(stageMinus1Output.skillContext, currentStage, 'Generating final payload and Epii perspective', {
                        targetCoordinate: stageMinus1Output.sourceMetadata?.targetCoordinate,
                        coreElementsCount: stageMinus1Output.coreElements?.length || 0
                    });
                }
                const stageMinus0Output = await runStageMinus0(stageMinus1Output);
                if (hasAGUIContext(stageMinus0Output)) {
                    emitStageFinished(stageMinus0Output.skillContext, currentStage, {
                        targetCoordinate: stageMinus0Output.sourceMetadata?.targetCoordinate
                    });
                }

                // Emit Bimba update suggestions if AG-UI context is available
                if (hasAGUIContext(stageMinus1Output)) {
                    emitBimbaUpdateSuggestions(stageMinus1Output.skillContext, {
                        coreElements: stageMinus0Output.coreElements,
                        relationalProperties: stageMinus0Output.relationalProperties,
                        targetCoordinate: stageMinus0Output.sourceMetadata?.targetCoordinate,
                        notionUpdatePayload: stageMinus0Output.notionUpdatePayload
                    });
                }

                // Emit memory onboarding completion if AG-UI context is available
                if (hasAGUIContext(stageMinus1Output)) {
                    emitMemoryOnboarding(stageMinus1Output.skillContext, {
                        targetCoordinate: stageMinus0Output.sourceMetadata?.targetCoordinate,
                        graphiti: stageMinus0Output.graphitiEpisode || null,
                        lightrag: stageMinus0Output.lightragIngestion || null,
                        notion: stageMinus0Output.notionUpdatePayload || null,
                        bimba: stageMinus0Output.bimbaUpdates || null
                    });
                }

                // Ensure we're not returning the full graph data
                const result = {
                    ...stageMinus0Output,
                    graphData: stageMinus0Output.graphData ?
                        `[Graph data with ${stageMinus0Output.graphData.nodes?.length || 0} nodes and ${stageMinus0Output.graphData.edges?.length || stageMinus0Output.graphData.links?.length || 0} edges]` :
                        null
                };

                // Pipeline completion - let the skill wrapper handle RUN_FINISHED event emission
                // This avoids duplicate RUN_FINISHED events that cause spurious state updates
                console.log(`[Pipeline] Pipeline stages completed successfully - skill wrapper will emit completion event`);

                console.log(`Epii Analysis Pipeline completed successfully`);
                return result;
            } catch (stageError) {
                // Handle stage-specific errors - but don't fail the entire pipeline
                console.error(`Error in ${currentStage}:`, stageError);

                // Only emit AG-UI error events for critical stages to avoid spurious failure states
                if (hasAGUIContext(enhancedInitialState) && (currentStage === 'stage_minus5' || currentStage === 'stage_minus4' || currentStage === 'stage_minus2' || currentStage === 'stage_minus1')) {
                    emitStageError(enhancedInitialState.skillContext, currentStage, stageError);
                } else {
                    // For non-critical stages, just log the error without emitting events
                    console.warn(`⚠️ Non-critical stage error in ${currentStage} (pipeline continues):`, stageError.message);
                }

                // Log the error but continue with a degraded result
                console.warn(`⚠️ Stage ${currentStage} failed, but continuing pipeline with degraded functionality`);

                // Only fail the entire pipeline for critical stages (-5, -4, -2, -1)
                // Stage -1 is CRITICAL because core elements are essential for analysis
                if (currentStage === 'stage_minus5' || currentStage === 'stage_minus4' || currentStage === 'stage_minus2' || currentStage === 'stage_minus1') {
                    console.error(`❌ Critical stage ${currentStage} failed - cannot continue pipeline`);

                    // Emit critical pipeline failure event
                    if (hasAGUIContext(enhancedInitialState)) {
                        emitPipelineFailure(enhancedInitialState.skillContext, currentStage, stageError);
                    }

                    // Update document status for critical failures only
                    if (initialState.documentId) {
                        try {
                            const { updateDocumentInCache } = await import('../utils/documentCache.utils.mjs');
                            await updateDocumentInCache(initialState.documentId, {
                                'analysisStatus': 'failed',
                                'metadata.analysisStatus': 'failed',
                                'metadata.analysisError': stageError.message,
                                'metadata.analysisErrorStage': currentStage,
                                'metadata.analysisErrorTimestamp': new Date()
                            });
                        } catch (updateError) {
                            console.error(`Error updating document status:`, updateError);
                        }
                    }

                    // Rethrow only for critical stage failures
                    throw new Error(`Critical pipeline stage ${currentStage} failed: ${stageError.message}`);
                } else {
                    // For non-critical stages, continue with a minimal result
                    console.log(`🔄 Continuing pipeline despite ${currentStage} failure`);

                    // Create a minimal result to continue the pipeline
                    const minimalResult = {
                        ...enhancedInitialState,
                        [`${currentStage}_error`]: stageError.message,
                        [`${currentStage}_failed`]: true,
                        // Ensure we have basic structure to continue
                        synthesis: enhancedInitialState.synthesis || `Analysis completed with ${currentStage} failure: ${stageError.message}`,
                        coreElements: enhancedInitialState.coreElements || [],
                        relationalProperties: enhancedInitialState.relationalProperties || {},
                        epiiPerspective: enhancedInitialState.epiiPerspective || `Analysis completed despite ${currentStage} failure.`,
                        // Preserve documentId for AG-UI events
                        documentId: enhancedInitialState.documentId || enhancedInitialState.sourceMetadata?.documentId
                    };

                    // Continue with the next stage using the minimal result
                    if (currentStage === 'stage_minus3') {
                        // Skip to stage -2 with minimal chunking
                        minimalResult.documentChunks = [enhancedInitialState.documentContent || ''];
                        minimalResult.originalChunks = [enhancedInitialState.documentContent || ''];
                    }

                    // Use the minimal result for subsequent stages
                    enhancedInitialState = minimalResult;
                }
            }
        }

        // If we don't have a document, just return a simple response
        return {
            epiiPerspective: "I'm ready to help you analyze documents. Please provide a document or ask me a question."
        };
    } catch (error) {
        console.error(`Epii Pipeline failed:`, error);

        // If handleErrors is true, return an error object instead of throwing
        if (initialState.handleErrors === true) {
            return {
                error: error.message,
                errorStage: currentStage,
                errorTimestamp: new Date().toISOString(),
                epiiPerspective: `Error in Epii analysis at stage ${currentStage}: ${error.message}`
            };
        }

        // Otherwise, rethrow the error
        throw error;
    }
}

// Export the pipeline with all stages
export const epiiAnalysisPipeline = {
    runStageMinus5,
    runStageMinus4,
    runStageMinus3,
    runStageMinus2,
    runStageMinus1,
    runStageMinus0,
    runPipeline
};

// Default export for backward compatibility
export default epiiAnalysisPipeline;
