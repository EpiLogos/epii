/**
 * Stage -0: Synthesize Payload (Generate Notion Update)
 *
 * This stage generates the final payload for updating Notion with the analysis results.
 * It formats the synthesis, core elements, mappings, variations, and tags into a structured
 * payload that can be used to update the Notion page.
 *
 * Key responsibilities:
 * 1. Generate the Notion update payload for the target coordinate
 * 2. Generate additional payloads for related coordinates identified in mappings
 * 3. Generate the Epii perspective
 * 4. Update file metadata if this was a file upload
 * 5. Update MongoDB with minimal metadata and send full results to frontend cache
 */

// Import required modules
import epiiLLMService from '../../services/epii-llm.service.mjs';
import langsmithTracing from '../../services/langsmith-tracing.mjs';

/**
 * Stage -0: Synthesize Payload (Generate Notion Update)
 * Generates the final payload for updating Notion with the analysis results.
 * Formats the synthesis, core elements, mappings, variations, and tags into a structured payload.
 *
 * @param {object} state - The state from Stage -1
 * @returns {Promise<object>} - A promise resolving to the final state with notionUpdatePayload
 * @throws {Error} - If any step in the process fails
 */
export async function runStageMinus0(state) {
    // Validate required input state properties
    if (!state.synthesis || typeof state.synthesis !== 'string') {
        throw new Error("Invalid state: synthesis must be a non-empty string");
    }
    if (!state.coreElements || !Array.isArray(state.coreElements)) {
        throw new Error("Invalid state: coreElements must be an array");
    }
    if (!state.relationalProperties || typeof state.relationalProperties !== 'object') {
        throw new Error("Invalid state: relationalProperties must be an object");
    }
    if (!state.allMappings || !Array.isArray(state.allMappings)) {
        throw new Error("Invalid state: allMappings must be an array");
    }
    if (!state.allVariations || !Array.isArray(state.allVariations)) {
        throw new Error("Invalid state: allVariations must be an array");
    }
    if (!state.allTags || !Array.isArray(state.allTags)) {
        throw new Error("Invalid state: allTags must be an array");
    }
    if (!state.sourceMetadata || !state.sourceMetadata.targetCoordinate) {
        throw new Error("Invalid state: sourceMetadata.targetCoordinate is required");
    }
    // documentContent is no longer required for the Notion payload

    const {
        synthesis,
        coreElements,
        relationalProperties,
        allMappings,
        allVariations,
        allTags,
        sourceMetadata,
        documentContent, // This is now optional
        fileId
    } = state;
    console.log(`--- Epii Pipeline: Stage -0 (Synthesize Payload) ---`);

    // Create a run tree for this stage with error handling
    let stageRun;
    try {
        stageRun = langsmithTracing.createStageRunTree(
            "Stage -0: Synthesize Payload",
            {
                targetCoordinate: sourceMetadata.targetCoordinate,
                sourceFileName: sourceMetadata.sourceFileName,
                numMappings: allMappings.length,
                numVariations: allVariations.length,
                numTags: allTags.length
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
        // 1. Generate the Notion update payload for the target coordinate
        console.log(`Generating Notion update payload for target coordinate ${sourceMetadata.targetCoordinate}...`);
        // Create a child run for the payload generation
        let payloadRun;
        try {
            payloadRun = langsmithTracing.createChildRun(
                stageRun,
                "Generate Notion Payload",
                {
                    targetCoordinate: sourceMetadata.targetCoordinate,
                    synthesisLength: synthesis.length,
                    numCoreElements: coreElements.length,
                    numMappings: allMappings.length,
                    numVariations: allVariations.length,
                    numTags: allTags.length
                }
            );
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
            // Create a mock run that won't break the pipeline
            payloadRun = {
                end: () => {},
                patch: () => {}
            };
        }

        // Import the generateNotionUpdatePayload function
        const { generateNotionUpdatePayload } = await import('../../utils/notion.utils.mjs');

        // Generate the main Notion update payload
        let notionUpdatePayload;
        try {
            // Create a state object with just the context window
            const notionState = {
                contextWindow: state.contextWindow || null
            };

            notionUpdatePayload = await generateNotionUpdatePayload(
                synthesis,
                coreElements,
                allMappings,
                allVariations,
                allTags,
                sourceMetadata,
                documentContent,
                epiiLLMService,
                payloadRun,
                relationalProperties,
                notionState // Pass the state with context window
            );

            if (!notionUpdatePayload || typeof notionUpdatePayload !== 'object') {
                throw new Error("Invalid Notion update payload: must be an object");
            }

            // End the payload run
            langsmithTracing.endRunSuccess(payloadRun, {
                payloadSize: JSON.stringify(notionUpdatePayload).length
            });
        } catch (payloadError) {
            // End the payload run with error
            try {
                langsmithTracing.endRunError(payloadRun, payloadError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Rethrow the error to stop the pipeline
            throw new Error(`Failed to generate Notion update payload: ${payloadError.message}`);
        }

        // 2. Extract related coordinates from mappings
        // Extract unique coordinates from mappings that are not the target coordinate
        const relatedCoordinates = new Set();
        allMappings.forEach(mapping => {
            // Check if the mapping has a coordinate reference
            if (mapping.targetCoordinate &&
                mapping.targetCoordinate !== sourceMetadata.targetCoordinate) {
                relatedCoordinates.add(mapping.targetCoordinate);
            }
        });

        if (relatedCoordinates.size > 0) {
            console.log(`Found ${relatedCoordinates.size} related coordinates in mappings`);

            // Add related coordinates to the main payload for reference
            notionUpdatePayload.relatedCoordinates = Array.from(relatedCoordinates);
        }

        // 3. Generate the Epii perspective
        console.log(`Generating Epii perspective...`);
        // Create a child run for the perspective generation
        let perspectiveRun;
        try {
            perspectiveRun = langsmithTracing.createChainRun(
                stageRun,
                "Generate Epii Perspective",
                {
                    synthesisLength: synthesis.length
                }
            );
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
            // Create a mock run that won't break the pipeline
            perspectiveRun = {
                end: () => {},
                patch: () => {}
            };
        }

        // Import the generateEpiiPerspective function
        const { generateEpiiPerspective } = await import('../../utils/content/synthesis.mjs');

        // Generate the Epii perspective
        let epiiPerspective;
        try {
            epiiPerspective = await generateEpiiPerspective(
                synthesis,
                coreElements,
                sourceMetadata.targetCoordinate,
                epiiLLMService,
                perspectiveRun
            );

            if (!epiiPerspective || typeof epiiPerspective !== 'string') {
                throw new Error("Invalid Epii perspective: must be a non-empty string");
            }

            // End the perspective run
            langsmithTracing.endRunSuccess(perspectiveRun, {
                perspectiveLength: epiiPerspective.length
            });

            // CREATE GRAPHITI EPISODE with the structured analysis results
            console.log(`Creating Graphiti episode for analysis results...`);
            try {
                const { createGraphitiEpisodeFromAnalysis } = await import('../../utils/content/synthesis.mjs');
                await createGraphitiEpisodeFromAnalysis(
                    synthesis,
                    coreElements,
                    sourceMetadata.targetCoordinate,
                    epiiPerspective,
                    relationalProperties,
                    sourceMetadata
                );
                console.log(`✅ Successfully created Graphiti episode for ${sourceMetadata.targetCoordinate}`);
            } catch (graphitiError) {
                console.error(`❌ Failed to create Graphiti episode:`, graphitiError);
                // Don't throw - this shouldn't break the pipeline
            }
        } catch (perspectiveError) {
            // End the perspective run with error
            try {
                langsmithTracing.endRunError(perspectiveRun, perspectiveError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Rethrow the error to stop the pipeline
            throw new Error(`Failed to generate Epii perspective: ${perspectiveError.message}`);
        }

        // 3.5. CRITICAL: Add Epii Perspective to Notion Payload
        console.log(`Adding Epii perspective to Notion update payload...`);
        try {
            // Add the Epii perspective as a content block to the Notion payload
            if (!notionUpdatePayload.contentBlocks) {
                notionUpdatePayload.contentBlocks = [];
            }

            // Add Epii perspective as a dedicated section
            notionUpdatePayload.contentBlocks.push({
                type: 'heading_2',
                heading_2: {
                    rich_text: [{
                        type: 'text',
                        text: { content: '🎯 Epii Perspective' }
                    }]
                }
            });

            notionUpdatePayload.contentBlocks.push({
                type: 'paragraph',
                paragraph: {
                    rich_text: [{
                        type: 'text',
                        text: { content: epiiPerspective }
                    }]
                }
            });

            // Also add it to the properties for easy access
            if (!notionUpdatePayload.properties) {
                notionUpdatePayload.properties = {};
            }

            // Add Epii perspective as a rich text property
            notionUpdatePayload.properties.epiiPerspective = {
                type: 'rich_text',
                rich_text: [{
                    type: 'text',
                    text: { content: epiiPerspective }
                }]
            };

            console.log(`Successfully added Epii perspective (${epiiPerspective.length} chars) to Notion payload`);
        } catch (perspectiveAddError) {
            console.error(`Error adding Epii perspective to Notion payload: ${perspectiveAddError.message}`);
            // Don't throw - this shouldn't break the pipeline, but log the issue
        }

        // 4. Update the file's analysis status if this was a file upload
        if (fileId) {
            console.log(`Updating file analysis status for file ID: ${fileId}...`);
            let fileRun;
            try {
                fileRun = langsmithTracing.createChainRun(
                    stageRun,
                    "Update File Status",
                    {
                        fileId
                    }
                );
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
                // Create a mock run that won't break the pipeline
                fileRun = {
                    end: () => {},
                    patch: () => {}
                };
            }

            try {
                // Import the FileMetadata model
                const { default: FileMetadata } = await import('../../models/FileMetadata.mjs');

                // Find and update the file metadata
                const fileMetadata = await FileMetadata.findById(fileId);
                if (!fileMetadata) {
                    throw new Error(`File metadata not found for ID: ${fileId}`);
                }

                // Update only minimal metadata - NOT the full analysis results
                fileMetadata.analysisStatus = 'completed';
                fileMetadata.analysisCompletedAt = new Date();

                // Save the updated metadata
                await fileMetadata.save();
                console.log(`Updated file analysis status to 'completed'`);

                // End the file run
                langsmithTracing.endRunSuccess(fileRun, {
                    fileId,
                    status: 'completed'
                });
            } catch (fileError) {
                // End the file run with error
                try {
                    langsmithTracing.endRunError(fileRun, fileError);
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

                // Log the error but continue with the pipeline
                console.error(`Error updating file analysis status: ${fileError.message}`);
            }
        }

        // 5. Update MongoDB with minimal metadata
        console.log(`Updating document with analysis results...`);
        let documentRun;
        try {
            documentRun = langsmithTracing.createChainRun(
                stageRun,
                "Update Document",
                {
                    documentId: state.documentId
                }
            );
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
            // Create a mock run that won't break the pipeline
            documentRun = {
                end: () => {},
                patch: () => {}
            };
        }

        try {
            // Import the updateDocumentWithAnalysisResults function
            const { updateDocumentWithAnalysisResults } = await import('../../utils/document.utils.mjs');

            // Update MongoDB with the full notionUpdatePayload to ensure it's available for crystallization
            await updateDocumentWithAnalysisResults(
                state.documentId,
                sourceMetadata,
                notionUpdatePayload, // Pass the full notionUpdatePayload
                state.bpMCPService
            );

            // End the document run
            langsmithTracing.endRunSuccess(documentRun, {
                documentId: state.documentId
            });

            console.log(`Successfully updated document ${state.documentId} with minimal analysis metadata`);
        } catch (documentError) {
            // End the document run with error
            try {
                langsmithTracing.endRunError(documentRun, documentError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Rethrow the error to stop the pipeline
            throw new Error(`Failed to update document with analysis results: ${documentError.message}`);
        }

        // 6. Prepare the full analysis results for the frontend cache
        // Include only essential data needed by the frontend
        const fullAnalysisResults = {
            // Analysis results
            synthesis,
            coreElements,
            relationalProperties,
            mappings: allMappings,
            variations: allVariations,
            tags: allTags,
            epiiPerspective,

            // Include the full Notion update payload for crystallization
            notionUpdatePayload,

            // Metadata
            timestamp: new Date().toISOString(),
            documentId: state.documentId,
            sourceFileName: sourceMetadata.sourceFileName,
            sourceType: sourceMetadata.sourceType
        };

        // 7. Store full analysis results in the cache
        console.log(`Storing full analysis results in cache...`);
        let cacheRun;
        try {
            cacheRun = langsmithTracing.createChainRun(
                stageRun,
                "Store in Cache",
                {
                    documentId: state.documentId,
                    resultSize: JSON.stringify(fullAnalysisResults).length
                }
            );
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
            // Create a mock run that won't break the pipeline
            cacheRun = {
                end: () => {},
                patch: () => {}
            };
        }

        try {
            // Import the document cache utility
            const { storeAnalysisResultsInCache } = await import('../../utils/documentCache.utils.mjs');

            // Create a properly structured object with notionUpdatePayload at the top level
            // This ensures the frontend can find it directly
            const analysisResultsForCache = {
                // Include the full notionUpdatePayload directly at the top level
                // This is critical for crystallization to work properly
                notionUpdatePayload,

                // Include the full analysis results as well
                fullAnalysisResults,

                // Add metadata
                timestamp: new Date().toISOString(),
                documentId: state.documentId,
                sourceFileName: sourceMetadata.sourceFileName,
                sourceType: sourceMetadata.sourceType,

                // Add debugging information
                _source: 'stage_minus0'
            };

            // Log the structure we're storing
            console.log(`Storing analysis results with structure: ${Object.keys(analysisResultsForCache).join(', ')}`);

            // Verify notionUpdatePayload is present at the top level
            if (analysisResultsForCache.notionUpdatePayload) {
                console.log(`notionUpdatePayload is present at the top level with targetCoordinate: ${analysisResultsForCache.notionUpdatePayload.targetCoordinate}`);
            } else {
                console.warn(`WARNING: notionUpdatePayload is NOT present at the top level!`);
            }

            // Store the properly structured results in the cache
            await storeAnalysisResultsInCache(state.documentId, analysisResultsForCache);

            // End the cache run
            langsmithTracing.endRunSuccess(cacheRun, {
                documentId: state.documentId,
                success: true
            });

            console.log(`Successfully stored full analysis results in cache for document ${state.documentId}`);
        } catch (cacheError) {
            // End the cache run with error
            try {
                langsmithTracing.endRunError(cacheRun, cacheError);
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }

            // Log the error but don't stop the pipeline
            console.warn(`Error storing analysis results in cache: ${cacheError.message}`);
            console.warn(`This is not a critical error, continuing with the pipeline...`);

            // Instead of throwing, we'll just log a warning and continue
            // This allows the pipeline to complete even if the cache update fails
        }

        // 8. Prepare the final state WITHOUT using ...state to avoid state bloat
        // Only include essential properties needed for the pipeline result
        const stageMinus0Output = {
            // Analysis results
            notionUpdatePayload,
            epiiPerspective,

            // Document identification
            documentId: state.documentId,
            fileId: state.fileId,

            // User context
            userId: state.userId,

            // Source metadata
            sourceMetadata: state.sourceMetadata,

            // AG-UI context for event emission
            skillContext: state.skillContext
        };

        // End the stage run
        try {
            langsmithTracing.endRunSuccess(stageRun, {
                payloadSize: JSON.stringify(notionUpdatePayload).length,
                perspectiveLength: epiiPerspective.length,
                numMappings: allMappings.length,
                numVariations: allVariations.length,
                numTags: allTags.length
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        console.log("--- Epii Pipeline: Stage -0 Complete ---");
        console.log("=== Epii Analysis Pipeline Complete ===");
        console.log(`Generated Notion update payload for coordinate ${sourceMetadata.targetCoordinate}`);
        console.log(`Found ${notionUpdatePayload.relatedCoordinates?.length || 0} related coordinates`);
        console.log(`Analysis results sent to frontend cache for document ${state.documentId}`);

        return stageMinus0Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -0:`, error);

        // Categorize the error for better debugging
        let errorType = 'GENERAL_ERROR';
        let errorMessage = error.message;

        if (errorMessage.includes('Notion')) {
            errorType = 'NOTION_PAYLOAD_ERROR';
        } else if (errorMessage.includes('document')) {
            errorType = 'DOCUMENT_UPDATE_ERROR';
        } else if (errorMessage.includes('cache')) {
            errorType = 'CACHE_ERROR';
        } else if (errorMessage.includes('perspective')) {
            errorType = 'PERSPECTIVE_ERROR';
        }

        // End the stage run with error
        try {
            langsmithTracing.endRunError(stageRun, {
                error: errorMessage,
                errorType,
                stage: 'minus0'
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        // If this was a file upload, update the file's analysis status
        if (fileId) {
            try {
                const { default: FileMetadata } = await import('../../models/FileMetadata.mjs');
                const fileMetadata = await FileMetadata.findById(fileId);
                if (fileMetadata) {
                    // Update only minimal metadata
                    fileMetadata.analysisStatus = 'failed';
                    fileMetadata.analysisError = errorMessage;
                    fileMetadata.analysisErrorType = errorType;
                    fileMetadata.analysisCompletedAt = new Date();
                    await fileMetadata.save();
                    console.log(`Updated file analysis status to 'failed' with error type ${errorType}`);
                } else {
                    console.warn(`Could not find file metadata for ID ${fileId} to update status`);
                }
            } catch (updateError) {
                console.error(`Error updating file analysis status:`, updateError);
            }
        }

        // If we have a document ID and bpMCPService, update the document status
        if (state.documentId && state.bpMCPService) {
            try {
                await state.bpMCPService.updateDocument(state.documentId, {
                    $set: {
                        'analysisStatus': 'failed',
                        'metadata.analysisStatus': 'failed',
                        'metadata.analysisError': errorMessage,
                        'metadata.analysisErrorType': errorType,
                        'metadata.analysisErrorTimestamp': new Date()
                    }
                });
                console.log(`Updated document ${state.documentId} with error status`);
            } catch (updateError) {
                console.error(`Error updating document status:`, updateError);
            }
        }

        // Throw a more descriptive error
        throw new Error(`Epii Pipeline Stage -0 failed [${errorType}]: ${errorMessage}`);
    }
}
