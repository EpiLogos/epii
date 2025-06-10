/**
 * Stage -5: Fetch Document
 *
 * This stage is responsible for fetching the document from various sources:
 * 1. Direct content provided in the initial state
 * 2. File upload (fileId provided)
 * 3. MongoDB document (documentId provided)
 *
 * The document content is then pre-processed and prepared for the next stage.
 * This stage also transforms graphData into bimbaMap at the outset to prevent
 * graphData from leaking through the pipeline.
 *
 * Key responsibilities:
 * - Fetch document content from the appropriate source
 * - Pre-process document content for analysis
 * - Transform graphData to bimbaMap
 * - Prepare clean state for the next stage
 */

// Import required modules
import { preprocessDocumentContent, getDocumentFromBPMCP as getDocumentUtil } from '../../utils/document.utils.mjs';
import { getFullBimbaMapFromGraphData, validateGraphData } from '../../utils/graphData.utils.mjs';
import { runStageMinus4 } from './stage_minus4.mjs';

/**
 * Retrieves a document using the standardized document utilities.
 * This is a wrapper around the getDocumentFromBPMCP utility in document.utils.mjs
 * that ensures the bpMCPService is available.
 *
 * @param {string} documentId - The ID of the document to retrieve
 * @param {object} [state] - Optional state object that might contain the document content
 * @returns {Promise<{document: object, content: string}>} - The document object and its content
 * @throws {Error} - If the document is not found or has no textContent property
 */
async function getDocumentFromBPMCP(documentId, state = null) {
    if (!documentId) {
        throw new Error("Document ID is required");
    }

    // Ensure state is an object
    state = state || {};

    // Ensure bpMCPService is available
    if (!state.bpMCPService) {
        console.log(`Importing bpMCPService for document retrieval...`);
        state.bpMCPService = (await import('../../services/bpMCPService.mjs')).default;
    }

    try {
        // Use the imported utility function
        return await getDocumentUtil(documentId, state, state.bpMCPService);
    } catch (error) {
        console.error(`Error retrieving document ${documentId}:`, error);
        throw new Error(`Failed to retrieve document ${documentId}: ${error.message}`);
    }
}

/**
 * Stage -5: Fetch Document
 * Starts the Epii Document Analysis Pipeline by fetching the document from various sources.
 * This stage also transforms graphData into bimbaMap at the outset to prevent
 * graphData from leaking through the pipeline.
 *
 * @param {object} initialState - The initial state containing userId and either targetCoordinate or fileId.
 * @param {string} initialState.userId - The ID of the user initiating the request (admin).
 * @param {string} [initialState.targetCoordinate] - The Bimba coordinate of the Notion page containing the seed file.
 * @param {string} [initialState.fileId] - The ID of the uploaded file to analyze.
 * @param {string} [initialState.documentId] - The ID of the MongoDB document to analyze.
 * @param {string} [initialState.documentContent] - Direct document content to analyze.
 * @param {object} [initialState.graphData] - Graph data for Bimba context.
 * @returns {Promise<object>} - A promise resolving to the state after Stage -5
 */
export async function runStageMinus5(initialState) {
    console.log(`--- Epii Pipeline: Stage -5 (Fetch Document) ---`);

    // Validate required parameters
    const { userId, targetCoordinate, fileId, documentId } = initialState;

    if (!userId) {
        throw new Error("User ID is required for Epii mode.");
    }

    if (!targetCoordinate && !fileId && !documentId && !initialState.documentContent) {
        throw new Error("Either targetCoordinate, fileId, documentId, or documentContent is required for Epii mode.");
    }

    console.log(`Source: ${
        initialState.documentContent ? 'Direct Content' :
        fileId ? 'File Upload (ID: ' + fileId + ')' :
        documentId ? 'MongoDB (ID: ' + documentId + ')' :
        'Notion (Coordinate: ' + targetCoordinate + ')'
    }`);

    // Initialize variables
    let documentContent;
    let sourceFileName;
    let sourceType;

    try {
        // CASE 1: Direct content provided in the initial state
        if (initialState.documentContent) {
            console.log(`Using document content provided in initial state (${initialState.documentContent.length} chars)`);

            // Use content and metadata from initialState
            documentContent = initialState.documentContent;
            sourceFileName = initialState.sourceFileName || "Document from initial state";
            sourceType = initialState.sourceType || 'direct_content';

            // Pre-process the document content
            console.log(`Pre-processing document content for "${sourceFileName}"...`);
            documentContent = await preprocessDocumentContent(documentContent, sourceFileName);

            console.log(`Using pre-processed document content (${documentContent.length} chars)`);
        }
        // CASE 2: File upload (fileId provided)
        else if (fileId) {
            console.log(`Fetching uploaded file with ID: ${fileId}...`);

            // Import FileMetadata model dynamically to avoid circular dependencies
            const { default: FileMetadata } = await import('../../models/FileMetadata.mjs');

            // Find the file metadata
            const fileMetadata = await FileMetadata.findById(fileId);
            if (!fileMetadata) {
                throw new Error(`File not found with ID: ${fileId}`);
            }

            // Update the file's analysis status to 'processing'
            fileMetadata.analysisStatus = 'processing';

            // Get the document content - always use textContent
            if (fileMetadata.textContent) {
                // Use the pre-extracted text content if available
                documentContent = fileMetadata.textContent;
                sourceFileName = fileMetadata.originalName || fileMetadata.fileName || "Uploaded File";
                sourceType = 'file_upload';

                console.log(`Using existing textContent from file metadata (${documentContent.length} chars)`);
            } else {
                // Extract text from the file if textContent is not available
                console.log(`Extracting text from file: ${fileMetadata.filePath}`);
                const fileService = await import('../../services/file.service.mjs');
                documentContent = await fileService.extractTextFromFile(fileMetadata.filePath, fileMetadata.mimeType);

                // Update the file metadata with the extracted text using standardized property name
                fileMetadata.textContent = documentContent;

                // Remove any legacy content property to ensure consistency
                if (fileMetadata.content) {
                    delete fileMetadata.content;
                    console.log(`Removed legacy 'content' property from file metadata`);
                }

                sourceFileName = fileMetadata.originalName || fileMetadata.fileName || "Uploaded File";
                sourceType = 'file_upload';

                console.log(`Extracted text from file (${documentContent.length} chars)`);
            }

            // If targetCoordinate is provided, update the file metadata
            if (targetCoordinate && (!fileMetadata.targetCoordinate || fileMetadata.targetCoordinate !== targetCoordinate)) {
                fileMetadata.targetCoordinate = targetCoordinate;
                console.log(`Updated file metadata with target coordinate: ${targetCoordinate}`);
            }

            // Save all changes to the file metadata
            await fileMetadata.save();

            // Pre-process the document content
            console.log(`Pre-processing document content for "${sourceFileName}"...`);
            documentContent = await preprocessDocumentContent(documentContent, sourceFileName);

            console.log(`Successfully processed file "${sourceFileName}" (${documentContent.length} chars)`);
        }
        // CASE 3: MongoDB document (documentId provided)
        else if (documentId) {
            console.log(`Fetching document content from MongoDB for document ID: ${documentId}`);

            // Use the getDocumentFromBPMCP utility function for consistent document retrieval
            const { document, content } = await getDocumentFromBPMCP(documentId, initialState);

            // Set document content and metadata
            sourceFileName = document.title || document.fileName || document.originalName || "Untitled Document";
            sourceType = 'mongodb';

            // Store the document in initialState to avoid fetching it again
            initialState.document = document;

            // Pre-process the document content
            console.log(`Pre-processing document content for "${sourceFileName}"...`);
            documentContent = await preprocessDocumentContent(content, sourceFileName);

            // Get the target coordinate from the document metadata if available
            if (!targetCoordinate && document.metadata && document.metadata.targetCoordinate) {
                targetCoordinate = document.metadata.targetCoordinate;
                console.log(`Using target coordinate from document metadata: ${targetCoordinate}`);
            }

            console.log(`Successfully processed document "${sourceFileName}" (${documentContent.length} chars) from MongoDB`);
        }
        // CASE 4: Notion page (targetCoordinate provided but no documentId or fileId)
        else if (targetCoordinate) {
            // This case will be handled by the Notion integration in a future implementation
            // For now, we'll throw an error
            throw new Error(`Direct Notion integration not yet implemented. Please provide a documentId or fileId.`);
        }
        else {
            // This should never happen due to the validation at the beginning
            throw new Error("No valid source provided for document content");
        }

        // Transform graphData to bimbaMap at the outset
        // This is a critical step to prevent graphData from leaking through the pipeline
        let bimbaMap = null;

        if (initialState.graphData) {
            console.log(`Transforming graphData to bimbaMap at the beginning of the pipeline...`);

            // Validate graphData structure first
            const validatedGraphData = validateGraphData(initialState.graphData);

            if (validatedGraphData.nodes.length > 0 || validatedGraphData.edges.length > 0) {
                // Transform graphData to bimbaMap
                bimbaMap = getFullBimbaMapFromGraphData(validatedGraphData);
                console.log(`Generated bimbaMap with ${bimbaMap.nodes.length} nodes and ${bimbaMap.relationships.length} relationships`);

                // Log the transformation for debugging
                if (bimbaMap.nodes.length > 0) {
                    console.log(`Successfully transformed graphData into bimbaMap structure`);
                    console.log(`Root nodes: ${bimbaMap.summary.rootNodes.map(n => n.coordinate).join(', ')}`);
                } else {
                    console.warn(`Transformed bimbaMap has no nodes. Check graphData structure.`);
                }
            } else {
                console.warn(`GraphData provided but contains no nodes or edges. Creating empty bimbaMap.`);
                bimbaMap = {
                    nodes: [],
                    relationships: [],
                    structure: {},
                    summary: { totalNodes: 0, totalRelationships: 0, rootNodes: [] }
                };
            }

            // Remove graphData from initialState to prevent it from being passed through
            console.log(`Removing original graphData from state to prevent leakage`);
            initialState.graphData = null;
        } else {
            console.log(`No graphData provided. Creating empty bimbaMap.`);
            bimbaMap = {
                nodes: [],
                relationships: [],
                structure: {},
                summary: { totalNodes: 0, totalRelationships: 0, rootNodes: [] }
            };
        }

        // Create a minimal document object with standardized properties
        const documentObj = {
            _id: initialState.documentId || fileId || `temp-${Date.now()}`,
            textContent: documentContent, // Always include textContent
            title: sourceFileName,
            metadata: initialState.document?.metadata || {}
        };

        // Prepare a clean state for the next stage
        // Only include essential properties to avoid state bloat
        const stageMinus5Output = {
            // Document content and metadata
            documentContent,
            sourceFileName,
            sourceType,

            // Source identifiers
            fileId,
            userId,
            targetCoordinate,
            documentId: initialState.documentId,

            // Document object with standardized properties
            document: documentObj,

            // Bimba context
            bimbaMap,

            // Flags and metadata
            documentFetched: true,
            sourceMetadata: {
                documentId: initialState.documentId,
                sourceFileName,
                targetCoordinate,
                sourceType,
                documentMetadata: documentObj.metadata,
                bimbaMapSummary: bimbaMap.summary ?
                    `Bimba map with ${bimbaMap.nodes.length} nodes and ${bimbaMap.relationships.length} relationships` :
                    null
            },

            // Essential services
            bpMCPService: initialState.bpMCPService,

            // AG-UI context for event emission
            skillContext: initialState.skillContext
        };

        // Validate the output state with more detailed checks
        if (!stageMinus5Output.documentContent) {
            throw new Error("Document content is required for the next stage");
        }

        if (typeof stageMinus5Output.documentContent !== 'string') {
            throw new Error(`Invalid document content type: expected string, got ${typeof stageMinus5Output.documentContent}`);
        }

        if (stageMinus5Output.documentContent.trim().length === 0) {
            throw new Error("Document content is empty after preprocessing");
        }

        if (!stageMinus5Output.bimbaMap) {
            throw new Error("BimbaMap is required for the next stage");
        }

        // Ensure bimbaMap has nodes array, even if empty
        if (!Array.isArray(stageMinus5Output.bimbaMap.nodes)) {
            console.warn("BimbaMap has no nodes array, initializing empty array");
            stageMinus5Output.bimbaMap.nodes = [];
        }

        // Ensure bimbaMap has relationships array, even if empty
        if (!Array.isArray(stageMinus5Output.bimbaMap.relationships)) {
            console.warn("BimbaMap has no relationships array, initializing empty array");
            stageMinus5Output.bimbaMap.relationships = [];
        }

        // Check for target coordinate but don't throw an error if missing
        // This allows the pipeline to continue even without a target coordinate
        if (!stageMinus5Output.sourceMetadata || !stageMinus5Output.sourceMetadata.targetCoordinate) {
            console.warn("Target coordinate is missing in sourceMetadata - using default '#5'");
            if (!stageMinus5Output.sourceMetadata) {
                stageMinus5Output.sourceMetadata = {};
            }
            stageMinus5Output.sourceMetadata.targetCoordinate = '#5';
            stageMinus5Output.targetCoordinate = '#5';
        }

        // Double-check that no graph data is included
        if (stageMinus5Output.graphData) {
            console.warn(`Found unexpected graphData in stageMinus5Output - removing to prevent leakage`);
            delete stageMinus5Output.graphData;
        }

        // Ensure bpMCPService is included
        if (!stageMinus5Output.bpMCPService) {
            console.warn(`bpMCPService missing from stageMinus5Output - adding from initialState`);
            stageMinus5Output.bpMCPService = initialState.bpMCPService;
        }

        console.log("--- Epii Pipeline: Stage -5 Complete ---");
        return stageMinus5Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -5:`, error);

        // Categorize the error for better debugging
        let errorType = 'GENERAL_ERROR';
        let errorMessage = error.message;

        if (errorMessage.includes('Document not found') || errorMessage.includes('File not found')) {
            errorType = 'NOT_FOUND_ERROR';
        } else if (errorMessage.includes('textContent')) {
            errorType = 'CONTENT_FORMAT_ERROR';
        } else if (errorMessage.includes('graphData')) {
            errorType = 'GRAPH_DATA_ERROR';
        }

        // If this was a file upload, update the file's analysis status
        if (fileId) {
            try {
                console.log(`Updating file analysis status to 'failed' for file ${fileId}`);
                const { default: FileMetadata } = await import('../../models/FileMetadata.mjs');
                const fileMetadata = await FileMetadata.findById(fileId);

                if (fileMetadata) {
                    fileMetadata.analysisStatus = 'failed';
                    fileMetadata.analysisResults = {
                        error: errorMessage,
                        errorType,
                        timestamp: new Date()
                    };
                    await fileMetadata.save();
                    console.log(`Successfully updated file analysis status to 'failed'`);
                } else {
                    console.warn(`Could not find file metadata for ID ${fileId} to update status`);
                }
            } catch (updateError) {
                console.error(`Error updating file analysis status:`, updateError);
            }
        }

        // If this was a MongoDB document, update its analysis status if possible
        if (initialState.documentId && initialState.bpMCPService) {
            try {
                console.log(`Updating document analysis status to 'failed' for document ${initialState.documentId}`);
                await initialState.bpMCPService.updateDocument(initialState.documentId, {
                    $set: {
                        'analysisStatus': 'failed',
                        'metadata.analysisStatus': 'failed',
                        'metadata.analysisError': errorMessage,
                        'metadata.analysisErrorType': errorType,
                        'metadata.analysisErrorTimestamp': new Date()
                    }
                });
                console.log(`Successfully updated document analysis status to 'failed'`);
            } catch (updateError) {
                console.error(`Error updating document analysis status:`, updateError);
            }
        }

        // Throw a detailed error for the controller
        throw new Error(`Epii Pipeline Stage -5 failed [${errorType}]: ${errorMessage}`);
    }
}
