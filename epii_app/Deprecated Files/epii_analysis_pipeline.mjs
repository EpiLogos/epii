import bpMCPService from '../services/bpMCPService.mjs'; // Import the MCP service
import { notionClient } from '../services/notion.service.mjs'; // Import Notion client for direct access
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import epiiAgentService from '../services/epii-agent.service.mjs';
import epiiLLMService from '../services/epii-llm.service.mjs'; // Import the LLM service
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
import langsmithTracing from '../services/langsmith-tracing.mjs'; // Import LangSmith tracing
import langsmithEvaluators from '../services/langsmith-evaluators.mjs'; // Import LangSmith evaluators
import { invalidateBimbaCache, invalidateMEFCache, clearLLMCache } from '../utils/cache.utils.mjs'; // Import cache utilities
import { generateContextWindow, generateBimbaEnhancedContext, extractRelevantBimbaContext, generateChunkContext } from '../utils/content.utils.mjs'; // Import content utilities
import { chunkDocument, sendChunksToLightRAG } from '../utils/document.utils.mjs'; // Import document utilities

// Load environment variables
dotenv.config({ path: './.env' }); // Ensure env vars are loaded

// Constants for chunking
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

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
 * Pre-processes document content to prepare it for analysis.
 * Performs cleaning, normalization, and format detection.
 *
 * @param {string} content - The raw document content
 * @param {string} fileName - The name of the document file
 * @returns {Promise<string>} - The processed document content
 */
async function preprocessDocumentContent(content, fileName) {
    console.log(`Pre-processing document content for "${fileName}"...`);

    if (!content) {
        console.warn(`Empty content for document "${fileName}"`);
        return '';
    }

    try {
        // Import document utilities
        const { preprocessDocumentContent: preprocessContent } = await import('../utils/document.utils.mjs');

        // Use the utility function to preprocess document content
        const processedContent = await preprocessContent(content, fileName);

        console.log(`Pre-processing complete. Original length: ${content.length}, Processed length: ${processedContent.length}`);
        return processedContent;
    } catch (error) {
        console.error(`Error pre-processing document content:`, error);

        // Fallback implementation if the import fails
        try {
            // 1. Normalize line endings
            let processedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

            // 2. Remove excessive whitespace
            processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

            // 3. Detect document format
            const format = await detectDocumentFormat(processedContent, fileName);
            console.log(`Detected document format: ${format}`);

            // 4. Format-specific processing
            switch (format) {
                case 'markdown':
                    // Remove HTML comments
                    processedContent = processedContent.replace(/<!--[\s\S]*?-->/g, '');
                    break;
                case 'html':
                    // Simple HTML to text conversion
                    processedContent = processedContent.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ');
                    break;
                case 'json':
                    // Try to extract text from JSON if it's a document format
                    try {
                        const jsonData = JSON.parse(processedContent);
                        if (jsonData.content || jsonData.text || jsonData.body) {
                            processedContent = jsonData.content || jsonData.text || jsonData.body;
                            console.log(`Extracted text content from JSON document`);
                        }
                    } catch (jsonError) {
                        // Keep original content if JSON parsing fails
                        console.warn(`Failed to parse JSON content: ${jsonError.message}`);
                    }
                    break;
                default:
                    // No special processing for plain text
                    break;
            }

            // 5. Ensure content ends with newline
            if (!processedContent.endsWith('\n')) {
                processedContent += '\n';
            }

            console.log(`Pre-processing complete. Original length: ${content.length}, Processed length: ${processedContent.length}`);
            return processedContent;
        } catch (error) {
            console.error(`Error in pre-processing:`, error);
            throw new Error(`Failed to pre-process document content: ${error.message}`);
        }
    }
}

/**
 * Detects the format of a document based on content and filename.
 *
 * @param {string} content - The document content
 * @param {string} fileName - The name of the document file
 * @returns {Promise<string>} - The detected format ('markdown', 'html', 'json', 'text')
 */
async function detectDocumentFormat(content, fileName) {
    try {
        // Import document utilities
        const { detectDocumentFormat: detectFormat } = await import('../utils/document.utils.mjs');

        // Use the utility function to detect document format
        return detectFormat(content, fileName);
    } catch (error) {
        console.error(`Error detecting document format:`, error);
        throw new Error(`Failed to detect document format: ${error.message}`);
    }
}

/**
 * Retrieves Bimba context for a coordinate from graphData.
 * This replaces direct Neo4j queries with graphData usage.
 *
 * @param {string} coordinate - The Bimba coordinate to get context for
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {Array} - The Bimba context with node and connections
 */
async function getBimbaContextFromGraphData(coordinate, graphData = { nodes: [], edges: [] }) {
    console.log(`Getting Bimba context for ${coordinate} from graphData (${graphData.nodes.length} nodes)`);

    try {
        // Import graphData utilities
        const { getBimbaContextFromGraphData: getBimbaContext } = await import('../utils/graphData.utils.mjs');

        // Use the utility function to get the Bimba context
        return getBimbaContext(graphData, coordinate);
    } catch (error) {
        console.error(`Error getting Bimba context from graphData:`, error);
        throw new Error(`Failed to get Bimba context: ${error.message}`);
    }
}

/**
 * Retrieves the full Bimba map from graphData.
 * Organizes the Bimba nodes into a hierarchical structure.
 * Uses caching to improve performance.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - The full Bimba map with hierarchical structure
 */
async function getFullBimbaMapFromGraphData(graphData = { nodes: [], edges: [] }) {
    console.log(`Getting full Bimba map from graphData (${graphData.nodes.length} nodes)`);

    try {
        // Import utilities
        const { getFullBimbaMapFromGraphData: getFullBimbaMap } = await import('../utils/graphData.utils.mjs');
        const { getCachedBimbaMap } = await import('../utils/cache.utils.mjs');

        // Use cached Bimba map
        return getCachedBimbaMap(
            (data) => getFullBimbaMap(data),
            graphData
        );
    } catch (error) {
        console.error(`Error getting full Bimba map from graphData:`, error);
        throw new Error(`Failed to get full Bimba map: ${error.message}`);
    }
}

/**
 * Retrieves project-level context from graphData.
 * Focuses on the root nodes of the Bimba structure.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - Project-level context
 */
async function getProjectContextFromGraphData(graphData = { nodes: [], edges: [] }) {
    console.log(`Getting project context from graphData with ${graphData.nodes.length} nodes`);

    try {
        // Import graphData utilities
        const { getProjectContextFromGraphData: getProjectContext } = await import('../utils/graphData.utils.mjs');

        // Use the utility function to get the project context
        return getProjectContext(graphData);
    } catch (error) {
        console.error(`Error getting project context from graphData:`, error);
        throw new Error(`Failed to get project context: ${error.message}`);
    }
}



/**
 * Generates a Bimba coordinate map from graphData.
 * This replaces Notion API calls and Neo4j queries.
 * Uses caching to improve performance.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - Map of coordinates to their metadata
 */
async function getBimbaCoordinateMapFromGraphData(graphData = { nodes: [], edges: [] }) {
    try {
        // Import utilities
        const { getBimbaCoordinateMapFromGraphData: getCoordinateMap } = await import('../utils/graphData.utils.mjs');
        const { getCachedGraphData } = await import('../utils/cache.utils.mjs');

        // Use cached coordinate map
        return getCachedGraphData(
            () => getCoordinateMap(graphData)
        );
    } catch (error) {
        console.error(`Error generating Bimba coordinate map from graphData:`, error);
        throw new Error(`Failed to generate Bimba coordinate map: ${error.message}`);
    }
}

/**
 * Retrieves a document from the BPMCP service with consistent error handling and content extraction.
 * This function handles all possible response formats from the BPMCP service.
 *
 * If the document content is already available in the state, it will use that instead of making an API call.
 *
 * @param {string} documentId - The ID of the document to retrieve
 * @param {object} [state] - Optional state object that might contain the document content
 * @returns {Promise<{document: object, content: string}>} - The document object and its content
 * @throws {Error} - If the document is not found or has no content
 */
async function getDocumentFromBPMCP(documentId, state = null) {
    // Import document utilities
    const { extractDocumentFromBPMCPResult, getDocumentContent } = await import('../utils/document.utils.mjs');

    // ALWAYS check if document is already available in the state first
    if (state) {
        // Check for document object in state
        if (state.document) {
            console.log(`Using document object from state for ${documentId}`);
            const content = getDocumentContent(state.document);
            if (content) {
                return { document: state.document, content };
            }
            console.warn(`Document object in state has no content, will try other sources`);
        }

        // Check for document content in state
        if (state.documentContent) {
            console.log(`Using document content from state for ${documentId} (${state.documentContent.length} chars)`);

            // Create a minimal document object with the available metadata
            const document = {
                _id: documentId,
                content: state.documentContent,
                fileName: state.sourceFileName || 'Unknown File',
                metadata: state.documentMetadata || {}
            };

            return { document, content: state.documentContent };
        }
    }

    // If we get here, we need to fetch the document - but this should rarely happen
    // as we should pass the document through state whenever possible
    console.warn(`WARNING: Document not found in state. Fetching document ${documentId} from BPMCP service.`);

    // Ensure bpMCPService is available
    if (!state || !state.bpMCPService) {
        console.log(`Importing bpMCPService for document retrieval...`);
        state = state || {};
        state.bpMCPService = (await import('../services/bpMCPService.mjs')).default;
    }

    try {
        // Call the BPMCP service to get the document
        const result = await state.bpMCPService.callTool('getDocumentById', {
            documentId
        });

        // Extract document using utility function
        const document = extractDocumentFromBPMCPResult(result);

        if (!document) {
            throw new Error(`Document not found or invalid format with ID: ${documentId}`);
        }

        // Get the document content using utility function
        const content = getDocumentContent(document);

        if (!content) {
            console.warn(`Document ${documentId} has no content in any expected field!`);
            throw new Error(`Document ${documentId} has no content`);
        }

        console.log(`Successfully extracted content from document ${documentId}, length: ${content.length}`);
        console.log(`Content preview: "${content.substring(0, 50)}..."`);

        return { document, content };
    } catch (error) {
        console.error(`Error retrieving document ${documentId} from BPMCP service:`, error);
        throw new Error(`Failed to retrieve document ${documentId}: ${error.message}`);
    }
}

/**
 * DEPRECATED: This file contains the original monolithic implementation of the Epii Analysis Pipeline.
 * Please use the refactored pipeline in epii_analysis_pipeline_refactored.mjs instead.
 *
 * This file is kept for reference purposes only and will be removed in a future release.
 * All new development should use the modular implementation in the /stages directory.
 *
 * @deprecated Use epii_analysis_pipeline_refactored.mjs instead
 *
 * Runs the Epii Document Analysis Pipeline.
 * Starts with Stage -5: Fetching the document from Notion or from a direct file upload.
 *
 * This pipeline is designed for admin usage and follows these principles:
 * 1. Triggered by a query with a Bimba coordinate (e.g., "ingest document for #5")
 * 2. Fetches document from either:
 *    a. The "Seed Files" property in the Notion Content Nodes database, or
 *    b. A direct file upload (fileId provided in initialState)
 * 3. Performs MEF/Metalogikon epistemic analysis on chunk groups
 * 4. Produces mod6 (0-5) mappings for nested elements of the target Bimba node
 * 5. Identifies variations, contradictions, and embellishments
 * 6. Considers non-dual, paradoxical, and integrative perspectives beyond binary thinking
 * 7. Recognizes the self-mirroring nature of the QL framework (+0 = -5, +1 = -4, etc.)
 * 8. Enables interactive document analysis through AI-user dialogue rather than full automation
 *
 * The pipeline follows the QL (-) Analysis cycle followed by a (+) Synthesis stage:
 * - Stage -5: Fetch Document (corresponds to +0)
 * - Stage -4: Contextualize Analysis (corresponds to +1)
 * - Stage -3: Integrate Structure (corresponds to +2)
 * - Stage -2: Relate Concepts & Identify Variations (corresponds to +3)
 * - Stage -1: Define Core Elements (corresponds to +4)
 * - Stage -0: Synthesize Payload (corresponds to +5)
 *
 * @param {object} initialState - The initial state containing userId and either targetCoordinate or fileId.
 * @param {string} initialState.userId - The ID of the user initiating the request (admin).
 * @param {string} [initialState.targetCoordinate] - The Bimba coordinate of the Notion page containing the seed file.
 * @param {string} [initialState.fileId] - The ID of the uploaded file to analyze.
 * @returns {Promise<object>} - A promise resolving to the final state with notionUpdatePayload for frontend canvas.
 */
export const runStageMinus5 = async (initialState) => {
    const { userId, targetCoordinate, fileId } = initialState;
    console.log(`--- Epii Pipeline: Stage -5 (Fetch Document) ---`);

    if (!targetCoordinate && !fileId) {
        throw new Error("Either targetCoordinate or fileId is required for Epii mode.");
    }

    console.log(`Source: ${fileId ? 'File Upload (ID: ' + fileId + ')' : 'Notion (Coordinate: ' + targetCoordinate + ')'}`);

    let notionPageId = null;
    let documentContent;
    let sourceFileName;
    let sourceType;

    try {
        // Check if document content is provided in the initial state
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
        // Otherwise, determine the source type and fetch the document
        else if (fileId) {
            // 1. Fetch document from uploaded file
            console.log(`Fetching uploaded file with ID: ${fileId}...`);

            // Import FileMetadata model dynamically to avoid circular dependencies
            const { default: FileMetadata } = await import('../models/FileMetadata.mjs');

            // Find the file metadata
            const fileMetadata = await FileMetadata.findById(fileId);
            if (!fileMetadata) {
                throw new Error(`File not found with ID: ${fileId}`);
            }

            // Get the document content
            if (fileMetadata.textContent) {
                // Use the pre-extracted text content if available
                documentContent = fileMetadata.textContent;
                sourceFileName = fileMetadata.originalName;
                sourceType = 'file_upload';
            } else {
                // Extract text from the file if textContent is not available
                console.log(`Extracting text from file: ${fileMetadata.filePath}`);
                const fileService = await import('../services/file.service.mjs');
                documentContent = await fileService.extractTextFromFile(fileMetadata.filePath, fileMetadata.mimeType);

                // Update the file metadata with the extracted text
                fileMetadata.textContent = documentContent;
                await fileMetadata.save();

                sourceFileName = fileMetadata.originalName;
                sourceType = 'file_upload';
            }

            // Update the file's analysis status
            fileMetadata.analysisStatus = 'processing';
            await fileMetadata.save();

            console.log(`Successfully fetched file "${sourceFileName}" (${documentContent.length} chars).`);

            // If targetCoordinate is provided, update the file metadata
            if (targetCoordinate) {
                try {
                    // Update the file metadata with the target coordinate
                    fileMetadata.targetCoordinate = targetCoordinate;
                    await fileMetadata.save();

                    console.log(`Updated file metadata with target coordinate: ${targetCoordinate}`);
                    console.log(`Notion page ID resolution will be handled by the update payload logic later in the pipeline.`);
                } catch (updateError) {
                    console.warn(`Warning: Could not update file metadata: ${updateError.message}`);
                    // Continue with analysis even if metadata update fails
                }
            }
        } else {
            // 2. Fetch document from MongoDB directly using BPMCP service
            // The document ID should be in initialState.documentId
            const documentId = initialState.documentId;

            if (!documentId) {
                throw new Error("Document ID is required when not using fileId");
            }

            console.log(`Fetching document content from MongoDB for document ID: ${documentId}`);

            try {
                // Use the getDocumentFromBPMCP utility function for consistent document retrieval
                // Pass the state to avoid redundant API calls if content is already available
                const { document, content } = await getDocumentFromBPMCP(documentId, initialState);

                // Set document content and metadata
                sourceFileName = document.title || document.fileName || document.originalName || "Untitled Document";
                sourceType = 'mongodb';

                // Pre-process the document content
                documentContent = await preprocessDocumentContent(content, sourceFileName);

                // Get the target coordinate from the document metadata if available
                if (document.metadata && document.metadata.targetCoordinate) {
                    // If the document already has a target coordinate, use it
                    if (!targetCoordinate) {
                        targetCoordinate = document.metadata.targetCoordinate;
                        console.log(`Using target coordinate from document metadata: ${targetCoordinate}`);
                    }
                }

                // We don't need to get the Notion page ID here
                // It will be handled by the update payload logic later in the pipeline
                console.log(`Notion page ID resolution will be handled by the update payload logic.`);

                console.log(`Successfully fetched document "${sourceFileName}" (${documentContent.length} chars) from MongoDB.`);
            } catch (mongoError) {
                console.error(`Error fetching document from MongoDB: ${mongoError.message}`);
                throw mongoError;
            }
        }

        // Prepare state for the next stage - ONLY include necessary properties
        // DO NOT use ...initialState to avoid accumulating redundant data
        const stageMinus5Output = {
            documentContent,
            sourceFileName,
            sourceType,
            fileId,
            userId,
            targetCoordinate,
            documentId: initialState.documentId,
            // Store minimal document reference to avoid fetching it again
            document: initialState.document ? {
                _id: initialState.document._id,
                title: initialState.document.title || initialState.document.fileName || initialState.document.originalName,
                metadata: {
                    targetCoordinate: initialState.document.metadata?.targetCoordinate
                }
            } : null,
            // Pass minimal graph data if available - only nodes with coordinates
            graphData: initialState.graphData ? {
                nodes: initialState.graphData.nodes.map(node => ({
                    id: node.id,
                    bimbaCoordinate: node.bimbaCoordinate || (node.properties && node.properties.coordinate),
                    name: node.name || node.title || node.label || 'Unnamed Node'
                })).filter(node => node.bimbaCoordinate),
                edges: (initialState.graphData.edges || initialState.graphData.links || []).map(edge => ({
                    source: typeof edge.source === 'object' ? edge.source.id : edge.source,
                    target: typeof edge.target === 'object' ? edge.target.id : edge.target,
                    type: edge.type || 'CONNECTED_TO'
                }))
            } : { nodes: [], edges: [] },
            // Add a flag to indicate that the document has been fetched
            documentFetched: true,
            // Add minimal source metadata for consistent access throughout the pipeline
            sourceMetadata: {
                documentId: initialState.documentId,
                sourceFileName,
                targetCoordinate,
                sourceType
            },
            // Include bpMCPService for document operations
            bpMCPService: initialState.bpMCPService
        };

        console.log("--- Epii Pipeline: Stage -5 Complete ---");

        // Continue to Stage -4
        return await runStageMinus4(stageMinus5Output);

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -5:`, error);

        // If this was a file upload, update the file's analysis status
        if (fileId) {
            try {
                const { default: FileMetadata } = await import('../models/FileMetadata.mjs');
                const fileMetadata = await FileMetadata.findById(fileId);
                if (fileMetadata) {
                    fileMetadata.analysisStatus = 'failed';
                    fileMetadata.analysisResults = { error: error.message };
                    await fileMetadata.save();
                }
            } catch (updateError) {
                console.error(`Error updating file analysis status:`, updateError);
            }
        }

        // Re-throw or handle error appropriately for the controller
        throw new Error(`Epii Pipeline Stage -5 failed: ${error.message}`);
    }
};

/**
 * Stage -4: Contextualize Analysis
 * Gathers relevant context from Bimba, user memory, and the coordinate map to inform the analysis.
 * Enhanced with full Bimba map and project context.
 *
 * @param {object} state - The state from Stage -5
 * @returns {Promise<object>} - A promise resolving to the state after Stage -4
 */
async function runStageMinus4(state) {
    const { targetCoordinate, notionPageId, sourceFileName, documentContent } = state;
    console.log(`--- Epii Pipeline: Stage -4 (Contextualize Analysis) ---`);

    try {
        // 1. Retrieve Bimba context for targetCoordinate from graphData
        console.log(`Retrieving Bimba context for coordinate ${targetCoordinate} from graphData...`);
        const bimbaContext = await getBimbaContextFromGraphData(targetCoordinate, state.graphData);
        console.log(`Retrieved Bimba context with ${bimbaContext?.length || 0} records`);

        // 2. Retrieve full Bimba map and project context from graphData
        console.log(`Retrieving full Bimba map and project context from graphData...`);

        // Import graphData utilities
        const { getFullBimbaMapFromGraphData, getProjectContextFromGraphData } = await import('../utils/graphData.utils.mjs');

        const fullBimbaMap = getFullBimbaMapFromGraphData(state.graphData);
        const projectContext = getProjectContextFromGraphData(state.graphData);

        console.log(`Retrieved full Bimba map with ${fullBimbaMap.nodes.length} nodes`);
        console.log(`Retrieved project context: ${projectContext.projectName}`);
        console.log(`Project description: ${projectContext.projectDescription}`);

        // Note: User context retrieval removed as this is an admin-only job
        // We'll set userContext to an empty array
        const userContext = [];
        console.log(`User context retrieval skipped (admin-only job)`);

        // 3. Generate Bimba Coordinate Map from graphData
        console.log(`Generating Bimba Coordinate Map from graphData...`);
        const coordinateMap = await getBimbaCoordinateMapFromGraphData(state.graphData);
        console.log(`Generated Bimba Coordinate Map with ${Object.keys(coordinateMap).length} coordinates`);

        // 4. Generate Bimba-enhanced document context
        console.log(`Generating Bimba-enhanced document context...`);
        const bimbaEnhancedContext = await generateBimbaEnhancedContext(
            documentContent,
            sourceFileName,
            targetCoordinate,
            bimbaContext,
            fullBimbaMap,
            projectContext,
            epiiLLMService
        );
        console.log(`Generated Bimba-enhanced context (${bimbaEnhancedContext.length} chars)`);

        // Prepare source metadata
        const sourceMetadata = {
            notionPageId,
            targetCoordinate,
            sourceFileName,
            documentId: state.documentId, // Include document ID if available
            documentType: sourceFileName.split('.').pop().toLowerCase()
        };

        // Add document metadata if available
        if (state.documentMetadata) {
            sourceMetadata.documentMetadata = state.documentMetadata;
        }

        // Add last modified date if available
        if (state.lastModified) {
            sourceMetadata.lastModified = state.lastModified;
        }

        // Prepare state for the next stage - ONLY include necessary properties
        // DO NOT use ...state to avoid accumulating redundant data
        const stageMinus4Output = {
            documentContent,
            sourceMetadata,
            bimbaContext,
            userContext,
            coordinateMap,
            // Add new context elements
            bimbaEnhancedContext,
            fullBimbaMap,
            projectContext,
            // Include only essential properties from previous state
            documentId: state.documentId,
            targetCoordinate,
            sourceFileName,
            sourceType: state.sourceType,
            fileId: state.fileId,
            userId: state.userId,
            documentFetched: state.documentFetched,
            // Include minimal graph data
            graphData: state.graphData,
            // Include bpMCPService for document operations
            bpMCPService: state.bpMCPService
        };

        console.log("--- Epii Pipeline: Stage -4 Complete ---");

        // Continue to Stage -3
        return await runStageMinus3(stageMinus4Output);

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -4 for coordinate ${targetCoordinate}:`, error);
        throw new Error(`Epii Pipeline Stage -4 failed: ${error.message}`);
    }
}

/**
 * Stage -3: Integrate Structure (Chunk & Ingest for RAG)
 * Chunks the document and sends chunks for ingestion into LightRAG to enable conversational refinement later.
 * Enhanced with context windows to preserve Bimba context during chunking.
 *
 * @param {object} state - The state from Stage -4
 * @returns {Promise<object>} - A promise resolving to the state after Stage -3
 */
async function runStageMinus3(state) {
    const {
        documentContent,
        sourceMetadata,
        bimbaEnhancedContext,
        fullBimbaMap,
        projectContext
    } = state;
    console.log(`--- Epii Pipeline: Stage -3 (Integrate Structure) ---`);

    try {
        // 1. Chunk the document with context windows
        console.log(`Chunking document (${documentContent.length} chars) with context windows...`);
        const chunks = await chunkDocument(
            documentContent,
            bimbaEnhancedContext,
            fullBimbaMap,
            projectContext,
            {
                generateContextWindow,
                CHUNK_SIZE: 1000,
                CHUNK_OVERLAP: 200
            }
        );
        console.log(`Document chunked into ${chunks.length} chunks with context windows`);

        // 2. Send chunks to LightRAG for ingestion synchronously
        console.log(`Starting synchronous LightRAG ingestion for ${chunks.length} chunks...`);
        // Wait for LightRAG ingestion to complete before continuing
        try {
            const results = await sendChunksToLightRAG(chunks, sourceMetadata, state.bpMCPService);
            const successCount = results.filter(r => r.success).length;
            console.log(`LightRAG ingestion completed: ${successCount}/${chunks.length} chunks successful`);
        } catch (error) {
            console.error(`LightRAG ingestion failed: ${error.message}`);
            // Continue with pipeline even if LightRAG ingestion fails
            console.log(`Continuing pipeline despite LightRAG ingestion failure`);
        }

        // 3. Prepare document chunks for the next stage
        // Ensure all chunks have originalContent before proceeding
        for (let i = 0; i < chunks.length; i++) {
            if (!chunks[i].originalContent) {
                console.error(`Chunk ${i} missing originalContent, this should never happen`);
                throw new Error(`Chunk ${i} missing originalContent. Check chunkDocument implementation.`);
            }
        }

        // Map chunks to their respective properties without fallbacks
        const documentChunks = chunks.map(chunk => chunk.pageContent);
        const originalChunks = chunks.map(chunk => chunk.originalContent);
        const chunkContextWindows = chunks.map(chunk => chunk.metadata.contextWindow);

        // Prepare state for the next stage - ONLY include necessary properties
        // DO NOT use ...state to avoid accumulating redundant data
        const stageMinus3Output = {
            documentChunks,
            originalChunks,
            chunkContextWindows,
            sourceMetadata,
            // Include only essential properties from previous state
            documentId: state.documentId,
            targetCoordinate: state.targetCoordinate,
            sourceFileName: state.sourceFileName,
            sourceType: state.sourceType,
            fileId: state.fileId,
            userId: state.userId,
            // Include minimal context data needed for next stages
            bimbaContext: state.bimbaContext,
            userContext: state.userContext,
            coordinateMap: state.coordinateMap,
            // Include minimal graph data
            graphData: state.graphData,
            // Include bpMCPService for document operations
            bpMCPService: state.bpMCPService
        };

        console.log("--- Epii Pipeline: Stage -3 Complete ---");

        // Continue to Stage -2
        return await runStageMinus2(stageMinus3Output);

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -3:`, error);
        throw new Error(`Epii Pipeline Stage -3 failed: ${error.message}`);
    }
}



/**
 * Gets relevant Bimba context for a chunk.
 * This is a wrapper around the extractRelevantBimbaContext function in content.utils.mjs.
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {object} fullBimbaMap - The full Bimba map
 * @returns {Promise<object>} - The relevant Bimba context
 */
async function getRelevantBimbaContext(chunkContent, fullBimbaMap) {
    console.log(`Getting relevant Bimba context for chunk...`);

    try {
        // Import content utilities
        const { extractRelevantBimbaContext } = await import('../utils/content/context.mjs');

        // Use the utility function to extract relevant Bimba context
        return extractRelevantBimbaContext(chunkContent, fullBimbaMap);
    } catch (error) {
        console.error(`Error getting relevant Bimba context:`, error);
        return {
            relevantNodes: [],
            mentionedCoordinates: []
        };
    }
}

/**
 * Gets chunk-specific context.
 * This is a wrapper around the generateChunkContext function in content.utils.mjs.
 *
 * @param {string} chunkContent - The content of the chunk
 * @param {string} documentContent - The content of the document
 * @param {string} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @returns {Promise<string>} - The chunk-specific context
 */
async function getChunkContext(chunkContent, documentContent, bimbaEnhancedContext) {
    console.log(`Getting chunk-specific context...`);

    try {
        // Import content utilities
        const { generateChunkContext } = await import('../utils/content.utils.mjs');

        // Use the utility function to generate chunk-specific context
        return generateChunkContext(chunkContent, documentContent, bimbaEnhancedContext, epiiLLMService);
    } catch (error) {
        console.error(`Error getting chunk-specific context:`, error);
        return `Error getting chunk-specific context: ${error.message}`;
    }
}





/**
 * Stage -2: Relate Concepts & Identify Variations (Analyze Chunks)
 * The core analysis engine. Iterates through chunks, tags them, extracts mappings, and identifies variations using LLMs and context.
 * Enhanced with context windows for better analysis.
 *
 * @param {object} state - The state from Stage -3
 * @returns {Promise<object>} - A promise resolving to the state after Stage -2
 */
async function runStageMinus2(state) {
    const {
        documentChunks,
        originalChunks,
        chunkContextWindows,
        sourceMetadata,
        bimbaContext,
        userContext,
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
            const { getMetalogikonTemplate: getTemplate } = await import('../utils/graphData.utils.mjs');

            // Call the function directly with the correct parameters
            metalogikon = getTemplate(coordinateMap, state.graphData);

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
            // Continue with an empty template rather than failing the pipeline
            metalogikon = {
                rootNode: { name: "Meta-Epistemic Framework", description: "A framework for analyzing knowledge from multiple perspectives" },
                categories: {},
                lenses: []
            };
        }

        // 2. Initialize chunkAnalysisResults array
        const chunkAnalysisResults = [];

        // 3. Process chunks in groups of 6
        console.log(`Processing ${documentChunks.length} chunks in groups of 6...`);
        const CHUNK_GROUP_SIZE = 6;
        const chunkGroups = [];
        const originalChunkGroups = [];
        const contextWindowGroups = [];

        // Group chunks
        for (let i = 0; i < documentChunks.length; i += CHUNK_GROUP_SIZE) {
            const group = documentChunks.slice(i, Math.min(i + CHUNK_GROUP_SIZE, documentChunks.length));
            chunkGroups.push(group);

            // Group original chunks and context windows
            // originalChunks must exist at this point - we validated this in Stage -3
            originalChunkGroups.push(originalChunks.slice(i, Math.min(i + CHUNK_GROUP_SIZE, originalChunks.length)));

            // chunkContextWindows must exist at this point - we validated this in Stage -3
            contextWindowGroups.push(chunkContextWindows.slice(i, Math.min(i + CHUNK_GROUP_SIZE, chunkContextWindows.length)));
        }

        console.log(`Created ${chunkGroups.length} chunk groups`);

        // Process each group
        for (let groupIndex = 0; groupIndex < chunkGroups.length; groupIndex++) {
            const group = originalChunkGroups[groupIndex]; // Use original chunks for analysis
            const contextWindows = contextWindowGroups[groupIndex];
            const startIdx = groupIndex * CHUNK_GROUP_SIZE;
            const endIdx = Math.min(startIdx + group.length - 1, documentChunks.length - 1);

            console.log(`Processing chunk group ${groupIndex+1}/${chunkGroups.length} (chunks ${startIdx+1}-${endIdx+1})...`);

            // Create a run for this group with error handling
            let groupRun;
            try {
                groupRun = langsmithTracing.createChainRun(
                    stageRun,
                    `Process Chunk Group ${groupIndex+1}/${chunkGroups.length}`,
                    {
                        groupIndex,
                        numChunks: group.length,
                        startChunk: startIdx + 1,
                        endChunk: endIdx + 1
                    }
                );
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
                // Create a mock groupRun that won't break the pipeline
                groupRun = {
                    create_child: () => ({ end: () => {}, patch: () => {} }),
                    end: () => {},
                    patch: () => {}
                };
            }

            try {
                // 3a. Tag all chunks in the group with Bimba coordinates
                console.log(`Assigning Bimba coordinates for all chunks in group ${groupIndex+1}...`);

                // Create a run for coordinate assignment
                let taggingRun;
                try {
                    taggingRun = langsmithTracing.createLLMRun(
                        groupRun,
                        "Assign Bimba Coordinates for Group",
                        {
                            numChunks: group.length,
                            targetCoordinate: sourceMetadata.targetCoordinate
                        }
                    );
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
                    taggingRun = { end: () => {}, patch: () => {} };
                }

                // Assign coordinates to each chunk in parallel
                let assignedCoordinates;
                try {
                    // Process each chunk in parallel to get coordinates
                    const coordinatePromises = group.map((chunk, i) =>
                        assignBimbaCoordinates(chunk, sourceMetadata, coordinateMap, {
                            contextWindow: contextWindows[i]
                        })
                    );

                    // Wait for all coordinate assignments to complete
                    assignedCoordinates = await Promise.all(coordinatePromises);

                    console.log(`Assigned coordinates for all chunks in group ${groupIndex+1}`);

                    // End the tagging run with success
                    try {
                        langsmithTracing.endRunSuccess(taggingRun, {
                            numChunksTagged: assignedCoordinates.length
                        });
                    } catch (tracingError) {
                        console.warn(`LangSmith tracing error: ${tracingError.message}`);
                    }
                } catch (taggingError) {
                    try {
                        langsmithTracing.endRunError(taggingRun, taggingError);
                    } catch (tracingError) {
                        console.warn(`LangSmith tracing error: ${tracingError.message}`);
                    }
                    throw new Error(`Failed to assign coordinates for group ${groupIndex+1}: ${taggingError.message}`);
                }

                // 3b. Analyze the entire group using LLM
                console.log(`Analyzing chunk group ${groupIndex+1} as a unit...`);

                // Create a run for group analysis
                let analysisRun;
                try {
                    analysisRun = langsmithTracing.createLLMRun(
                        groupRun,
                        "Analyze Chunk Group",
                        {
                            numChunks: group.length,
                            coordinatesAssigned: assignedCoordinates.map(coords => coords.join(', '))
                        }
                    );
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}. Continuing without tracing.`);
                    analysisRun = { end: () => {}, patch: () => {} };
                }

                // Import the analyzeChunkGroup function
                const { analyzeChunkGroup } = await import('../utils/content.utils.mjs');

                try {
                    // Analyze the entire group at once
                    const groupAnalysisResults = await analyzeChunkGroup(
                        group,
                        sourceMetadata,
                        bimbaContext,
                        userContext,
                        assignedCoordinates,
                        metalogikon,
                        {
                            llmService: epiiLLMService,
                            graphData: state.graphData || { nodes: [], edges: [] },
                            contextWindows
                        }
                    );

                    console.log(`Analysis complete for chunk group ${groupIndex+1}`);

                    // End the analysis run with success
                    try {
                        langsmithTracing.endRunSuccess(analysisRun, {
                            numResults: groupAnalysisResults.length
                        });
                    } catch (tracingError) {
                        console.warn(`LangSmith tracing error: ${tracingError.message}`);
                    }

                    // Add results to chunkAnalysisResults
                    for (let i = 0; i < groupAnalysisResults.length; i++) {
                        const result = groupAnalysisResults[i];
                        const absoluteChunkIndex = startIdx + i;

                        chunkAnalysisResults.push({
                            chunkIndex: absoluteChunkIndex,
                            chunkText: group[i],
                            assignedCoordinates: assignedCoordinates[i],
                            extractedMappings: result.extractedMappings || [],
                            identifiedVariations: result.identifiedVariations || [],
                            naturalElaborations: result.naturalElaborations || [],
                            mefLensInsights: result.mefLensInsights || {},
                            subnodeMappings: result.subnodeMappings || {}
                        });
                    }

                    // End the group run with success
                    try {
                        langsmithTracing.endRunSuccess(groupRun, {
                            numChunksProcessed: group.length
                        });
                    } catch (tracingError) {
                        console.warn(`LangSmith tracing error: ${tracingError.message}`);
                    }
                } catch (analysisError) {
                    try {
                        langsmithTracing.endRunError(analysisRun, analysisError);
                        langsmithTracing.endRunError(groupRun, analysisError);
                    } catch (tracingError) {
                        console.warn(`LangSmith tracing error: ${tracingError.message}`);
                    }

                    // Throw the error to stop the pipeline
                    throw new Error(`Analysis failed for chunk group ${groupIndex+1}: ${analysisError.message}`);
                }
            } catch (groupError) {
                try {
                    langsmithTracing.endRunError(groupRun, groupError);
                } catch (tracingError) {
                    console.warn(`LangSmith tracing error: ${tracingError.message}`);
                }

                // Throw the error to stop the pipeline
                throw new Error(`Processing failed for chunk group ${groupIndex+1}: ${groupError.message}`);
            }
        }

        // Prepare state for the next stage - ONLY include necessary properties
        // DO NOT use ...state to avoid accumulating redundant data
        const stageMinus2Output = {
            chunkAnalysisResults,
            sourceMetadata,
            // Include only essential properties from previous state
            documentId: state.documentId,
            targetCoordinate: state.targetCoordinate,
            sourceFileName: state.sourceFileName,
            sourceType: state.sourceType,
            fileId: state.fileId,
            userId: state.userId,
            // Include minimal context data needed for next stages
            bimbaContext: state.bimbaContext,
            userContext: state.userContext,
            coordinateMap: state.coordinateMap,
            // Include minimal graph data
            graphData: state.graphData,
            // Include metalogikon for next stage
            metalogikon,
            // Include bpMCPService for document operations
            bpMCPService: state.bpMCPService
        };

        console.log("--- Epii Pipeline: Stage -2 Complete ---");

        // End the stage run with success with error handling
        try {
            langsmithTracing.endRunSuccess(stageRun, {
                numChunksProcessed: chunkAnalysisResults.length,
                numSuccessfulChunks: chunkAnalysisResults.filter(r => !r.error).length,
                numFailedChunks: chunkAnalysisResults.filter(r => r.error).length
            });
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        // Continue to Stage -1
        return await runStageMinus1(stageMinus2Output);
    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -2:`, error);

        // End the stage run with error with error handling
        try {
            langsmithTracing.endRunError(stageRun, error);
        } catch (tracingError) {
            console.warn(`LangSmith tracing error: ${tracingError.message}`);
        }

        throw new Error(`Epii Pipeline Stage -2 failed: ${error.message}`);
    }
}

/**
 * Retrieves the Metalogikon epistemic analysis template from the Bimba graph.
 * Gets all child nodes of #2-1 down to two layers of nesting.
 * Uses caching to improve performance.
 *
 * @param {object} coordinateMap - The Bimba coordinate map
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {Promise<object>} - The Metalogikon template
 * @throws {Error} - If template retrieval fails
 */
async function getMetalogikonTemplate(coordinateMap, graphData = { nodes: [], edges: [] }) {
    try {
        // Import utilities
        const { getMetalogikonTemplate: getTemplate } = await import('../utils/graphData.utils.mjs');
        const { getCachedMEFTemplate } = await import('../utils/cache.utils.mjs');

        // Use cached MEF template
        return getCachedMEFTemplate(
            '#2-1', // MEF root coordinate
            (params) => getTemplate(params.coordinateMap, params.graphData),
            { coordinateMap, graphData }
        );
    } catch (error) {
        console.error(`Error retrieving Metalogikon template:`, error);
        throw new Error(`Failed to retrieve Metalogikon template: ${error.message}`);
    }
}

/**
 * Assigns Bimba coordinates to a chunk based on content and context.
 * Uses an LLM to analyze the chunk and assign relevant coordinates.
 * Enhanced with context window awareness.
 *
 * @param {string} chunk - The chunk text
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} coordinateMap - Map of Bimba coordinates to titles and labels
 * @param {object} options - Additional options
 * @param {RunTree} [options.parentRun] - Optional parent run for tracing
 * @param {object} [options.contextWindow] - Context window for the chunk
 * @returns {Promise<string[]>} - Array of assigned Bimba coordinates
 */
async function assignBimbaCoordinates(chunk, sourceMetadata, coordinateMap, options = {}) {
    console.log(`Assigning Bimba coordinates for chunk related to ${sourceMetadata.targetCoordinate}...`);

    // Import graphData utilities
    const { assignCoordinates } = await import('../utils/graphData.utils.mjs');

    // Use the utility function to assign Bimba coordinates
    return assignCoordinates(
        chunk,
        sourceMetadata,
        coordinateMap,
        options,
        epiiLLMService
    );
}

/**
 * Detects references to subnodes in a chunk.
 * Basic structural detection method used as part of hybrid retrieval.
 *
 * @param {string} chunk - The chunk text
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {Promise<object>} - Detected subnodes with their details
 * @throws {Error} - If subnode detection fails
 */
async function detectSubnodeReferences(chunk, targetCoordinate, graphData) {
    try {
        // Import graphData utilities
        const { detectSubnodeReferences: detectReferences } = await import('../utils/graphData.utils.mjs');

        // Use the utility function to detect subnode references
        return detectReferences(chunk, targetCoordinate, graphData);
    } catch (error) {
        console.error(`Error detecting subnode references:`, error);
        throw new Error(`Failed to detect subnode references: ${error.message}`);
    }
}

/**
 * Performs hybrid retrieval combining Bimba structural context with semantic matching.
 *
 * @param {string} chunk - The chunk text
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} graphData - The graph data with nodes and edges
 * @param {object} contextWindow - The context window for the chunk
 * @returns {Promise<object>} - The hybrid retrieval results
 * @throws {Error} - If hybrid retrieval fails
 */
async function performHybridRetrieval(chunk, targetCoordinate, graphData, contextWindow) {
    console.log(`Performing hybrid retrieval for chunk related to ${targetCoordinate}...`);

    try {
        // Import graphData utilities
        const { performHybridRetrieval: performRetrieval } = await import('../utils/graphData.utils.mjs');

        // Use the utility function to perform hybrid retrieval
        return performRetrieval(
            chunk,
            targetCoordinate,
            graphData,
            contextWindow,
            detectSubnodeReferences
        );
    } catch (error) {
        console.error(`Error performing hybrid retrieval:`, error);
        throw new Error(`Failed to perform hybrid retrieval: ${error.message}`);
    }
}

/**
 * Analyzes a chunk using an LLM to extract mappings and identify variations.
 * Enhanced with subnode awareness and context windows.
 *
 * @param {string} chunk - The chunk text
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} bimbaContext - Context from the Bimba graph
 * @param {object} userContext - Context from user memory
 * @param {string[]} assignedCoords - Array of assigned Bimba coordinates
 * @param {object} metalogikon - The Metalogikon template
 * @param {object} options - Additional options
 * @param {RunTree} [options.parentRun] - Optional parent run for tracing
 * @param {object} [options.graphData] - Graph data with nodes and edges
 * @param {object} [options.contextWindow] - Context window for the chunk
 * @returns {Promise<object>} - Analysis results with mappings, variations, and subnode mappings
 */
/**
 * Prepares the Metalogikon template for the prompt with enhanced MEF guidance.
 *
 * @param {object} metalogikon - The Metalogikon template
 * @returns {Promise<string>} - The enhanced Metalogikon prompt
 * @throws {Error} - If prompt preparation fails
 */
async function prepareMetalogikonPrompt(metalogikon) {
    try {
        // Import content utilities
        const { prepareMetalogikonPrompt: preparePrompt } = await import('../utils/content.utils.mjs');

        // Use the utility function to prepare the Metalogikon prompt
        return preparePrompt(metalogikon);
    } catch (error) {
        console.error(`Error preparing Metalogikon prompt:`, error);
        throw new Error(`Failed to prepare Metalogikon prompt: ${error.message}`);
    }
}

/**
 * Analyzes a chunk using the content.utils.mjs analyzeChunk function.
 * This is a wrapper that adds the LLM service to the options.
 *
 * @param {string} chunk - The chunk text
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} bimbaContext - The Bimba context
 * @param {object} userContext - The user context
 * @param {string[]} assignedCoords - The assigned coordinates
 * @param {object} metalogikon - The Metalogikon template
 * @param {object} options - Additional options
 * @returns {Promise<object>} - The analysis results
 * @throws {Error} - If analysis fails
 */
async function analyzeChunk(chunk, sourceMetadata, bimbaContext, userContext, assignedCoords, metalogikon, options = {}) {
    console.log(`Analyzing chunk related to ${assignedCoords.join(', ')}...`);

    try {
        // Import content utilities
        const { analyzeChunk: analyze } = await import('../utils/content.utils.mjs');

        // Add LLM service to options
        const enhancedOptions = {
            ...options,
            llmService: epiiLLMService
        };

        // Use the utility function to analyze the chunk
        return analyze(
            chunk,
            sourceMetadata,
            bimbaContext,
            userContext,
            assignedCoords,
            metalogikon,
            enhancedOptions
        );
    } catch (error) {
        console.error(`Error in analyzeChunk:`, error);
        throw new Error(`Failed to analyze chunk: ${error.message}`);
    }
}

/**
 * Stage -1: Define Core Elements (Consolidate Analysis)
 * Aggregates and structures the analysis results from all chunks.
 *
 * @param {object} state - The state from Stage -2
 * @returns {Promise<object>} - A promise resolving to the state after Stage -1
 */
/**
 * Enhanced consolidation of mappings with sophisticated deduplication and merging.
 *
 * @param {object[]} mappings - The mappings to consolidate
 * @returns {Promise<object>} - The consolidated mappings
 */
async function consolidateMappingsEnhanced(mappings) {
    // Import content utilities
    const { consolidateMappingsEnhanced: consolidateMappings } = await import('../utils/content.utils.mjs');

    // Use the utility function to consolidate mappings
    return consolidateMappings(mappings, generateId);
}

/**
 * Reranks mappings to prioritize the most relevant ones.
 *
 * @param {object} consolidatedMappings - The consolidated mappings
 * @param {string} targetCoordinate - The target coordinate
 * @returns {Promise<object[]>} - The reranked mappings
 */
async function rerankMappings(consolidatedMappings, targetCoordinate) {
    // Import content utilities
    const { rerankMappings: rerankMaps } = await import('../utils/content.utils.mjs');

    // Use the utility function to rerank mappings
    return rerankMaps(consolidatedMappings, targetCoordinate);
}

/**
 * Generates a natural language summary of the Bimba map based on analysis results.
 *
 * @param {object} analysisData - The analysis data
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} graphData - The graph data
 * @returns {Promise<string>} - The generated summary
 */
async function generateBimbaMapSummary(analysisData, targetCoordinate, graphData) {
    console.log(`Generating Bimba map summary for ${targetCoordinate}...`);

    // Import content utilities
    const { generateBimbaMapSummary: generateSummary } = await import('../utils/content.utils.mjs');

    // Use the utility function to generate the Bimba map summary
    return generateSummary(analysisData, targetCoordinate, graphData, epiiLLMService);
}

async function runStageMinus1(state) {
    const { chunkAnalysisResults, sourceMetadata, graphData } = state;
    console.log(`--- Epii Pipeline: Stage -1 (Define Core Elements) ---`);

    try {
        // 1. Extract all mappings, variations, natural elaborations, and MEF lens insights
        console.log(`Extracting data from ${chunkAnalysisResults.length} chunks...`);

        const allMappings = [];
        const allVariations = [];
        const allNaturalElaborations = [];
        const allMEFLensInsights = {};
        const consolidatedSubnodeMappings = {};

        // Iterate through chunkAnalysisResults
        for (const result of chunkAnalysisResults) {
            // Process mappings
            if (result.extractedMappings && Array.isArray(result.extractedMappings)) {
                allMappings.push(...result.extractedMappings.map(m => ({
                    ...m,
                    chunkIndex: result.chunkIndex,
                    contentReference: result.chunkText
                })));
            }

            // Process variations
            if (result.identifiedVariations && Array.isArray(result.identifiedVariations)) {
                allVariations.push(...result.identifiedVariations.map(v => ({
                    ...v,
                    chunkIndex: result.chunkIndex,
                    contentReference: result.chunkText
                })));
            }

            // Process natural elaborations
            if (result.naturalElaborations && Array.isArray(result.naturalElaborations)) {
                // Validate each elaboration before adding it
                for (const elaboration of result.naturalElaborations) {
                    if (!elaboration.elaborationText) {
                        console.error(`Elaboration in chunk ${result.chunkIndex} missing elaborationText. This should never happen.`);
                        throw new Error(`Elaboration in chunk ${result.chunkIndex} missing elaborationText. Check LLM response format.`);
                    }

                    if (!elaboration.elaborationType) {
                        console.error(`Elaboration in chunk ${result.chunkIndex} missing elaborationType. This should never happen.`);
                        throw new Error(`Elaboration in chunk ${result.chunkIndex} missing elaborationType. Check LLM response format.`);
                    }
                }

                // Add validated elaborations to the collection
                allNaturalElaborations.push(...result.naturalElaborations.map(e => ({
                    ...e,
                    chunkIndex: result.chunkIndex,
                    contentReference: result.chunkText
                })));
            }

            // Process MEF lens insights
            if (result.mefLensInsights && typeof result.mefLensInsights === 'object') {
                Object.entries(result.mefLensInsights).forEach(([lens, insight]) => {
                    if (!allMEFLensInsights[lens]) {
                        allMEFLensInsights[lens] = [];
                    }
                    allMEFLensInsights[lens].push({
                        insight,
                        chunkIndex: result.chunkIndex
                    });
                });
            }

            // Process subnode mappings
            if (result.subnodeMappings && Object.keys(result.subnodeMappings).length > 0) {
                console.log(`Processing subnode mappings for chunk ${result.chunkIndex}...`);

                for (const [subnodeCoord, subnodeData] of Object.entries(result.subnodeMappings)) {
                    if (!consolidatedSubnodeMappings[subnodeCoord]) {
                        consolidatedSubnodeMappings[subnodeCoord] = {
                            coordinate: subnodeCoord,
                            mappings: [],
                            summaries: [],
                            chunks: []
                        };
                    }

                    // Add mappings
                    if (subnodeData.mappings && Array.isArray(subnodeData.mappings)) {
                        for (const mapping of subnodeData.mappings) {
                            consolidatedSubnodeMappings[subnodeCoord].mappings.push({
                                ...mapping,
                                mappingId: `submap-${generateId()}`,
                                chunkIndex: result.chunkIndex
                            });
                        }
                    }

                    // Add summary
                    if (subnodeData.summary) {
                        consolidatedSubnodeMappings[subnodeCoord].summaries.push({
                            text: subnodeData.summary,
                            chunkIndex: result.chunkIndex
                        });
                    }

                    // Add chunk reference
                    consolidatedSubnodeMappings[subnodeCoord].chunks.push({
                        text: result.chunkText,
                        chunkIndex: result.chunkIndex
                    });
                }
            }
        }

        // 2. Consolidate mappings with enhanced logic
        console.log(`Consolidating ${allMappings.length} mappings...`);
        const consolidatedMappings = await consolidateMappingsEnhanced(allMappings);
        console.log(`Consolidated into ${consolidatedMappings.length} unique mappings`);

        // 3. Rerank mappings to prioritize the most relevant ones
        console.log(`Reranking mappings...`);
        const rankedMappings = await rerankMappings(consolidatedMappings, sourceMetadata.targetCoordinate);

        // 4. Consolidate variations
        console.log(`Consolidating ${allVariations.length} variations...`);
        const consolidatedVariations = {};

        for (const variation of allVariations) {
            // Skip variations without variationText
            if (!variation || !variation.variationText) {
                console.warn(`Skipping variation without variationText in chunk ${variation.chunkIndex}`);
                continue;
            }

            const key = variation.variationText.slice(0, 50); // Simple key for consolidation
            if (!consolidatedVariations[key]) {
                consolidatedVariations[key] = {
                    ...variation,
                    variationId: `var-${generateId()}`,
                    status: variation.status || 'needs_clarification',
                    relevantContentSnippets: []
                };
            }

            consolidatedVariations[key].relevantContentSnippets.push({
                text: variation.contentReference,
                chunkIndex: variation.chunkIndex
            });
        }
        console.log(`Consolidated into ${Object.keys(consolidatedVariations).length} unique variations`);

        // 5. Consolidate natural elaborations
        console.log(`Consolidating ${allNaturalElaborations.length} natural elaborations...`);
        const consolidatedElaborations = {};

        // Normalize elaborations before consolidation
        for (let i = 0; i < allNaturalElaborations.length; i++) {
            const elaboration = allNaturalElaborations[i];

            // Skip null elaborations
            if (!elaboration) {
                console.warn(`Skipping null elaboration at index ${i}`);
                continue;
            }

            // Check if elaborationText exists
            if (!elaboration.elaborationText) {
                console.error(`Elaboration missing elaborationText in chunk ${elaboration.chunkIndex}. This should never happen.`);
                throw new Error(`Elaboration missing elaborationText in chunk ${elaboration.chunkIndex}. Check LLM response format.`);
            }

            const key = elaboration.elaborationText.slice(0, 50); // Simple key for consolidation
            if (!consolidatedElaborations[key]) {
                consolidatedElaborations[key] = {
                    ...elaboration,
                    elaborationId: `elab-${generateId()}`,
                    relevantContentSnippets: []
                };
            }

            consolidatedElaborations[key].relevantContentSnippets.push({
                text: elaboration.contentReference,
                chunkIndex: elaboration.chunkIndex
            });
        }
        console.log(`Consolidated into ${Object.keys(consolidatedElaborations).length} unique natural elaborations`);

        // 6. Consolidate MEF lens insights
        console.log(`Consolidating MEF lens insights...`);
        const consolidatedMEFInsights = {};

        Object.entries(allMEFLensInsights).forEach(([lens, insights]) => {
            consolidatedMEFInsights[lens] = insights.map(i => i.insight).join(' | ');
        });
        console.log(`Consolidated into ${Object.keys(consolidatedMEFInsights).length} unique lenses`);

        // 7. Generate natural language summary
        console.log(`Generating natural language summary...`);
        const bimbaMapSummary = await generateBimbaMapSummary({
            extractedMappings: rankedMappings,
            identifiedVariations: Object.values(consolidatedVariations),
            naturalElaborations: Object.values(consolidatedElaborations),
            processedSubnodeMappings: consolidatedSubnodeMappings
        }, sourceMetadata.targetCoordinate, graphData);

        // 8. Process subnode mappings for final output
        const processedSubnodeMappings = {};

        // Get node details from graphData for each subnode
        if (Object.keys(consolidatedSubnodeMappings).length > 0) {
            console.log(`Processing ${Object.keys(consolidatedSubnodeMappings).length} subnode mappings for final output...`);

            for (const [subnodeCoord, subnodeData] of Object.entries(consolidatedSubnodeMappings)) {
                // Get subnode details from graphData
                const subnodeDetails = state.graphData?.nodes?.find(node => node.bimbaCoordinate === subnodeCoord);

                // Generate a consolidated summary for the subnode
                const consolidatedSummary = subnodeData.summaries.length > 0
                    ? subnodeData.summaries.map(s => s.text).join('\n\n')
                    : `Content related to ${subnodeCoord}`;

                processedSubnodeMappings[subnodeCoord] = {
                    coordinate: subnodeCoord,
                    mappings: subnodeData.mappings,
                    chunks: subnodeData.chunks,
                    summary: consolidatedSummary,
                    nodeDetails: {
                        name: subnodeDetails?.name || subnodeDetails?.title || subnodeDetails?.label || 'Unnamed Node',
                        description: subnodeDetails?.description || '',
                        notionPageId: subnodeDetails?.notionPageId || null
                    }
                };
            }
        }

        // 9. Analyze QL phase distribution
        const qlPhaseDistribution = {
            synthesis: rankedMappings.filter(m => m.qlPhase === '+').length,
            analysis: rankedMappings.filter(m => m.qlPhase === '-').length
        };

        // 10. Identify dominant MEF lenses
        const mefLenses = rankedMappings
            .filter(m => m.mappingType === 'MEF_Lens')
            .map(m => m.mappingValue);

        // 11. Generate overall summary
        const overallSummary = `Analysis of document ${sourceMetadata.sourceFileName} related to ${sourceMetadata.targetCoordinate} identified ${rankedMappings.length} mappings (${qlPhaseDistribution.synthesis} synthesis, ${qlPhaseDistribution.analysis} analysis), ${Object.keys(consolidatedVariations).length} variations, and ${Object.keys(consolidatedElaborations).length} natural elaborations. ${mefLenses.length > 0 ? `Dominant MEF lenses: ${mefLenses.join(', ')}.` : ''}`;

        // Prepare final analysis data
        const finalAnalysisData = {
            extractedMappings: rankedMappings,
            identifiedVariations: Object.values(consolidatedVariations),
            naturalElaborations: Object.values(consolidatedElaborations),
            mefLensInsights: consolidatedMEFInsights,
            bimbaMapSummary,
            overallSummary,
            processedSubnodeMappings
        };

        // Prepare state for the next stage
        const stageMinus1Output = {
            finalAnalysisData,
            sourceMetadata,
            // Pass through other state properties
            ...state
        };

        console.log("--- Epii Pipeline: Stage -1 Complete ---");

        // Continue to Stage -0 (Synthesize Payload)
        return await runStageMinus0(stageMinus1Output);

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -1:`, error);
        throw new Error(`Epii Pipeline Stage -1 failed: ${error.message}`);
    }
}

/**
 * Stage -0: Synthesize Payload (Epii (+) Stage)
 * Formats the consolidated analysis into the final notionUpdatePayload.
 * Standardizes the payload according to the NotionUpdatePayload interface in epiiTypes.ts.
 *
 * @param {object} state - The state from Stage -1
 * @returns {Promise<object>} - A promise resolving to the final state with notionUpdatePayload
 */
async function runStageMinus0(state) {
    const { finalAnalysisData, sourceMetadata, graphData } = state;
    console.log(`--- Epii Pipeline: Stage -0 (Synthesize Payload) ---`);

    try {
        // Import notion utilities
        const { generateNotionUpdatePayload } = await import('../utils/notion.utils.mjs');
        // Import graphData utilities
        const { getFullBimbaMapFromGraphData } = await import('../utils/graphData.utils.mjs');

        // Create a clean version of the data without large objects
        const cleanAnalysisData = { ...finalAnalysisData };
        const cleanSourceMetadata = { ...sourceMetadata };

        // Create a minimal version of graphData with only the essential information for coordinate extraction
        let minimalGraphData = null;
        if (graphData && graphData.nodes) {
            // Extract only the necessary properties from each node
            minimalGraphData = {
                nodes: graphData.nodes.map(node => ({
                    id: node.id,
                    bimbaCoordinate: node.bimbaCoordinate || (node.properties && node.properties.coordinate) || null,
                    name: node.name || node.title || node.label || 'Unnamed Node'
                })).filter(node => node.bimbaCoordinate), // Only include nodes with coordinates
                edges: (graphData.edges || graphData.links || []).map(edge => ({
                    source: typeof edge.source === 'object' ? edge.source.id : edge.source,
                    target: typeof edge.target === 'object' ? edge.target.id : edge.target,
                    type: edge.type || 'CONNECTED_TO'
                }))
            };

            console.log(`Created minimal graphData with ${minimalGraphData.nodes.length} nodes and ${minimalGraphData.edges.length} edges`);
        }

        // Use the utility function to generate the Notion update payload
        const notionUpdatePayload = await generateNotionUpdatePayload(
            cleanAnalysisData,
            cleanSourceMetadata,
            minimalGraphData, // Pass the minimal graphData
            {
                determineContentType,
                extractRelatedCoordinatesWithStructure,
                generateTags,
                generateContentFromAnalysis,
                generateSubnodeContent
            }
        );

        // Prepare final state with only necessary properties
        const stageMinus0Output = {
            notionUpdatePayload,
            finalAnalysisData: cleanAnalysisData,
            sourceMetadata: cleanSourceMetadata,
            // Include only necessary properties from state, not the full state
            documentId: state.documentId,
            targetCoordinate: state.targetCoordinate,
            bpMCPService: state.bpMCPService
        };

        // Log the notionUpdatePayload to help with debugging
        console.log(`Generated notionUpdatePayload for ${sourceMetadata.targetCoordinate}:`,
            JSON.stringify({
                targetCoordinate: notionUpdatePayload.targetCoordinate,
                title: notionUpdatePayload.title,
                contentLength: notionUpdatePayload.content?.length || 0,
                relatedCoordinates: notionUpdatePayload.relatedCoordinates?.length || 0
            })
        );

        console.log("--- Epii Pipeline: Stage -0 Complete ---");
        console.log("Epii Document Analysis Pipeline completed successfully.");

        // Create a clean version of the final state without any graph data
        const cleanOutput = {
            ...stageMinus0Output,
            // Don't include graphData at all
            graphData: undefined
        };

        // Update the document with analysis results if we have a document ID
        if (sourceMetadata.documentId && state.bpMCPService) {
            try {
                // Import document utilities
                const { updateDocumentWithAnalysisResults } = await import('../utils/document.utils.mjs');

                // Update the document with consolidated analysis results
                await updateDocumentWithAnalysisResults(
                    sourceMetadata.documentId,
                    sourceMetadata,
                    notionUpdatePayload,
                    state.bpMCPService
                );

                console.log(`Document ${sourceMetadata.documentId} updated with analysis results`);
            } catch (updateError) {
                console.error(`Error updating document with analysis results:`, updateError);
                // Continue even if update fails - don't throw an error here
                // This ensures the pipeline completes and returns results even if document update fails
            }
        }

        return cleanOutput;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -0:`, error);
        throw new Error(`Epii Pipeline Stage -0 failed: ${error.message}`);
    }
}

/**
 * Determines the content type based on analysis data.
 *
 * @param {object} analysisData - The analysis data
 * @returns {Promise<string>} - The content type
 */
async function determineContentType(analysisData) {
    // Import content utilities
    const { determineContentType: getContentType } = await import('../utils/content.utils.mjs');

    // Use the utility function to determine the content type
    return getContentType(analysisData);
}

/**
 * Generates tags from analysis data.
 *
 * @param {object} analysisData - The analysis data
 * @returns {Promise<string[]>} - The generated tags
 */
async function generateTags(analysisData) {
    // Import content utilities
    const { generateTags: getTags } = await import('../utils/content.utils.mjs');

    // Use the utility function to generate tags
    return getTags(analysisData);
}

/**
 * Extracts related coordinates with structural awareness using graphData.
 *
 * @param {object[]} mappings - The mappings from analysis
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} graphData - The graph data from frontend context
 * @returns {Promise<string[]>} - The related coordinates
 */
async function extractRelatedCoordinatesWithStructure(mappings, targetCoordinate, graphData) {
    // Import graphData utilities
    const { extractRelatedCoordinatesWithStructure: extractRelatedCoordinates } = await import('../utils/graphData.utils.mjs');

    // Use the utility function to extract related coordinates
    return extractRelatedCoordinates(mappings, targetCoordinate, graphData);
}

/**
 * Gets the parent coordinate of a given coordinate.
 * This is a wrapper around the utility function in graphData.utils.mjs.
 *
 * @param {string} coordinate - The coordinate
 * @returns {string|null} - The parent coordinate or null if no parent
 */
async function getParentCoordinate(coordinate) {
    // Import graphData utilities
    const { getParentCoordinate: getParent } = await import('../utils/graphData.utils.mjs');

    // Use the utility function to get the parent coordinate
    return getParent(coordinate);
}

/**
 * Checks if a coordinate is a child of another coordinate.
 * This is a wrapper around the utility function in graphData.utils.mjs.
 *
 * @param {string} childCoord - The potential child coordinate
 * @param {string} parentCoord - The potential parent coordinate
 * @returns {boolean} - True if childCoord is a direct child of parentCoord
 */
async function isChildCoordinate(childCoord, parentCoord) {
    // Import graphData utilities
    const { isChildCoordinate: isChild } = await import('../utils/graphData.utils.mjs');

    // Use the utility function to check if childCoord is a child of parentCoord
    return isChild(childCoord, parentCoord);
}

/**
 * Generates content for a specific subnode.
 *
 * @param {object} subnodeData - The subnode data
 * @param {string} subnodeCoordinate - The subnode coordinate
 * @param {object} sourceMetadata - The source metadata
 * @returns {string} - The generated content
 */
async function generateSubnodeContent(subnodeData, subnodeCoordinate, sourceMetadata) {
    // Import content utilities
    const { generateSubnodeContent: generateContent } = await import('../utils/content.utils.mjs');

    // Use the utility function to generate content
    return generateContent(subnodeData, subnodeCoordinate, sourceMetadata);
}

/**
 * Generates content from analysis data with structural context.
 *
 * @param {object} analysisData - The analysis data
 * @param {object} sourceMetadata - The source metadata
 * @param {object} graphData - The graph data from frontend context
 * @returns {string} - The generated content
 */
async function generateContentFromAnalysis(analysisData, sourceMetadata, graphData) {
    // Import content utilities
    const { generateContentFromAnalysis: generateContent } = await import('../utils/content.utils.mjs');

    // Use the utility function to generate content
    return generateContent(analysisData, sourceMetadata, graphData);
}

/**
 * Generates a random ID for mappings and variations.
 *
 * @returns {string} - A random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}



/**
 * Main entry point for the Epii Document Analysis Pipeline.
 *
 * @param {object} initialState - Initial state for the pipeline
 * @param {string} [initialState.targetCoordinate] - The target Bimba coordinate for analysis
 * @param {string} [initialState.notionPageId] - Optional Notion page ID if source is Notion
 * @param {string} [initialState.fileId] - Optional file ID if source is a direct file upload
 * @param {string} [initialState.userId] - Optional user ID for user-specific context
 * @param {string} [initialState.chatMessage] - Optional chat message for ongoing analysis sessions
 * @param {string} [initialState.analysisSessionId] - Optional analysis session ID for chat messages
 * @param {string} [initialState.documentContent] - Optional document content for chat messages
 * @param {object} [initialState.graphData] - Optional graph data from frontend context
 * @returns {Promise<object>} - A promise resolving to the final state after all stages
 */
export async function runEpiiPipeline(initialState) {
    console.log(`Starting Epii Pipeline...`);

    try {
        // Check if this is a simple chat message
        if (initialState.userQuery) {
            console.log(`Processing chat message from user: ${initialState.userId}`);

            // Use the Epii Agent Service to process the chat message
            // This will use the synthesis LLM with BPMCP tools
            const chatState = {
                userId: initialState.userId,
                userQuery: initialState.userQuery,
                documentContent: initialState.documentContent,
                targetCoordinate: initialState.targetCoordinate,
                documentId: initialState.documentId,
                chatHistory: initialState.history || [],
                // Include any available LightRAG context
                lightragContext: initialState.lightragContext,
                // Include graphData from frontend
                graphData: initialState.graphData || { nodes: [], edges: [] }
            };

            const result = await epiiAgentService.processChatMessage(initialState.userQuery, chatState);

            return {
                epiiPerspective: result.epiiPerspective,
                documentId: initialState.documentId,
                targetCoordinate: initialState.targetCoordinate,
                toolResults: result.toolResults
            };
        }

        // If we have a document to analyze
        if (initialState.targetCoordinate || initialState.fileId) {
            console.log(`Starting Epii Document Analysis Pipeline...`);
            // Log initial state without the full graphData
            console.log(`Initial state:`, {
                ...initialState,
                graphData: initialState.graphData ?
                    `[Graph data with ${initialState.graphData.nodes?.length || 0} nodes and ${initialState.graphData.edges?.length || initialState.graphData.links?.length || 0} edges]` :
                    null
            });

            // Ensure graphData is included in the state
            const enhancedInitialState = {
                ...initialState,
                graphData: initialState.graphData || { nodes: [], edges: [] }
            };

            // Run the complete pipeline directly
            console.log(`Running complete Epii Analysis Pipeline...`);

            // Start with Stage -5 to fetch the document
            const stageMinus5Output = await runStageMinus5(enhancedInitialState);

            // Continue with Stage -4
            const stageMinus4Output = await runStageMinus4(stageMinus5Output);

            // Continue with Stage -3
            const stageMinus3Output = await runStageMinus3(stageMinus4Output);

            // Continue with Stage -2
            const stageMinus2Output = await runStageMinus2(stageMinus3Output);

            // Continue with Stage -1
            const stageMinus1Output = await runStageMinus1(stageMinus2Output);

            // Finish with Stage -0
            const stageMinus0Output = await runStageMinus0(stageMinus1Output);

            // Ensure we're not returning the full graph data
            const result = {
                ...stageMinus0Output,
                graphData: `[Graph data with ${stageMinus0Output.graphData?.nodes?.length || 0} nodes and ${stageMinus0Output.graphData?.edges?.length || stageMinus0Output.graphData?.links?.length || 0} edges]`
            };

            return result;
        }

        // If we don't have a document, just return a simple response
        return {
            epiiPerspective: "I'm ready to help you analyze documents. Please provide a document or ask me a question."
        };
    } catch (error) {
        console.error(`Epii Pipeline failed:`, error);
        return {
            error: error.message,
            epiiPerspective: `Error in Epii analysis: ${error.message}`
        };
    }
}

// The runStageMinus5 function is already defined at the top of the file

// Export the pipeline
export const epiiAnalysisPipeline = {
    runStageMinus5,
    runStageMinus4,
    runStageMinus3,
    runStageMinus2,
    runStageMinus1,
    runStageMinus0,
    runPipeline: async (initialState = {}) => {
        try {
            // Make sure we have the bpMCPService
            if (!initialState.bpMCPService) {
                // Import it if not provided
                initialState.bpMCPService = (await import('../services/bpMCPService.mjs')).default;
                console.log("Imported bpMCPService for pipeline");
            }

            // Run the pipeline stages in sequence
            const stageMinus5Output = await runStageMinus5(initialState);
            const stageMinus4Output = await runStageMinus4(stageMinus5Output);
            const stageMinus3Output = await runStageMinus3(stageMinus4Output);
            const stageMinus2Output = await runStageMinus2(stageMinus3Output);
            const stageMinus1Output = await runStageMinus1(stageMinus2Output);
            const stageMinus0Output = await runStageMinus0(stageMinus1Output);

            return stageMinus0Output;
        } catch (error) {
            console.error(`Error running Epii Analysis Pipeline:`, error);
            throw error;
        }
    }
};
