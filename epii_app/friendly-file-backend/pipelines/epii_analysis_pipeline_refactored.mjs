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
import { invalidateBimbaCache, invalidateMEFCache, clearLLMCache } from '../utils/cache.utils.mjs';

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
            const enhancedInitialState = {
                ...initialState,
                graphData: initialState.graphData || { nodes: [], edges: [] }
            };

            // Run the complete pipeline
            console.log(`Running complete Epii Analysis Pipeline...`);

            // Run all stages in sequence with proper error handling
            try {
                // Stage -5: Fetch Document
                currentStage = 'stage_minus5';
                console.log(`Starting ${currentStage}...`);
                const stageMinus5Output = await runStageMinus5(enhancedInitialState);

                // Stage -4: Contextualize Analysis
                currentStage = 'stage_minus4';
                console.log(`Starting ${currentStage}...`);
                const stageMinus4Output = await runStageMinus4(stageMinus5Output);

                // Stage -3: Integrate Structure
                currentStage = 'stage_minus3';
                console.log(`Starting ${currentStage}...`);
                const stageMinus3Output = await runStageMinus3(stageMinus4Output);

                // Stage -2: Relate Concepts & Identify Variations
                currentStage = 'stage_minus2';
                console.log(`Starting ${currentStage}...`);
                const stageMinus2Output = await runStageMinus2(stageMinus3Output);

                // Stage -1: Define Core Elements
                currentStage = 'stage_minus1';
                console.log(`Starting ${currentStage}...`);
                const stageMinus1Output = await runStageMinus1(stageMinus2Output);

                // Stage -0: Synthesize Payload
                currentStage = 'stage_minus0';
                console.log(`Starting ${currentStage}...`);
                const stageMinus0Output = await runStageMinus0(stageMinus1Output);

                // Ensure we're not returning the full graph data
                const result = {
                    ...stageMinus0Output,
                    graphData: stageMinus0Output.graphData ?
                        `[Graph data with ${stageMinus0Output.graphData.nodes?.length || 0} nodes and ${stageMinus0Output.graphData.edges?.length || stageMinus0Output.graphData.links?.length || 0} edges]` :
                        null
                };

                console.log(`Epii Analysis Pipeline completed successfully`);
                return result;
            } catch (stageError) {
                // Handle stage-specific errors
                console.error(`Error in ${currentStage}:`, stageError);

                // Update document status if possible using the cache system
                if (initialState.documentId) {
                    try {
                        // Import the document cache utilities
                        const { updateDocumentInCache } = await import('../utils/documentCache.utils.mjs');

                        // Update the document in cache
                        await updateDocumentInCache(initialState.documentId, {
                            'analysisStatus': 'failed',
                            'metadata.analysisStatus': 'failed',
                            'metadata.analysisError': stageError.message,
                            'metadata.analysisErrorStage': currentStage,
                            'metadata.analysisErrorTimestamp': new Date()
                        });

                        console.log(`Updated document ${initialState.documentId} with error status for stage ${currentStage} using cache system`);
                    } catch (updateError) {
                        console.error(`Error updating document status using cache:`, updateError);

                        // Fall back to direct update only if cache update fails
                        if (initialState.bpMCPService) {
                            try {
                                await initialState.bpMCPService.updateDocument(initialState.documentId, {
                                    $set: {
                                        'analysisStatus': 'failed',
                                        'metadata.analysisStatus': 'failed',
                                        'metadata.analysisError': stageError.message,
                                        'metadata.analysisErrorStage': currentStage,
                                        'metadata.analysisErrorTimestamp': new Date()
                                    }
                                });
                                console.log(`Updated document ${initialState.documentId} with error status for stage ${currentStage} via direct MongoDB call`);
                            } catch (directUpdateError) {
                                console.error(`Error updating document status via direct MongoDB call:`, directUpdateError);
                            }
                        }
                    }
                }

                // Update file status if possible
                if (initialState.fileId) {
                    try {
                        const { default: FileMetadata } = await import('../models/FileMetadata.mjs');
                        const fileMetadata = await FileMetadata.findById(initialState.fileId);
                        if (fileMetadata) {
                            fileMetadata.analysisStatus = 'failed';
                            fileMetadata.analysisError = stageError.message;
                            fileMetadata.analysisErrorStage = currentStage;
                            fileMetadata.analysisCompletedAt = new Date();
                            await fileMetadata.save();
                            console.log(`Updated file ${initialState.fileId} with error status for stage ${currentStage}`);
                        }
                    } catch (updateError) {
                        console.error(`Error updating file status:`, updateError);
                    }
                }

                // Rethrow with enhanced error message
                throw new Error(`Epii Pipeline failed at ${currentStage}: ${stageError.message}`);
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
