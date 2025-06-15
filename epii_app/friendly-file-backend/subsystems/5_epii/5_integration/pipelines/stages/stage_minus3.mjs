/**
 * Stage -3: Integrate Structure (Chunk & Ingest for RAG)
 *
 * This stage chunks the document and sends chunks for ingestion into LightRAG
 * to enable conversational refinement later. It is enhanced with context windows
 * to preserve Bimba context during chunking.
 */

// Import required modules
import { chunkDocument, sendChunksToLightRAG } from '../../../1_utils/document.utils.mjs';
import { generateContextWindow } from '../../../1_utils/content/context.mjs';
import { runStageMinus2 } from './stage_minus2.mjs';

// Constants for chunking
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

/**
 * Stage -3: Integrate Structure (Chunk & Ingest for RAG)
 * Chunks the document and sends chunks for ingestion into LightRAG to enable conversational refinement later.
 * Enhanced with context windows to preserve Bimba context during chunking.
 *
 * @param {object} state - The state from Stage -4
 * @returns {Promise<object>} - A promise resolving to the state after Stage -3
 */
export async function runStageMinus3(state) {
    const {
        documentContent,
        sourceMetadata,
        bimbaEnhancedContext,
        fullBimbaMap,
        projectContext
    } = state;
    console.log(`--- Epii Pipeline: Stage -3 (Integrate Structure) ---`);

    try {
        // Import bpMCPService if not available in state
        let bpMCPService = state.bpMCPService;
        if (!bpMCPService) {
            console.log("bpMCPService not found in state, importing it directly");
            bpMCPService = (await import('../../services/bpMCPService.mjs')).default;
        }

        // Flag to track if we should skip LightRAG ingestion
        let skipLightRagIngestion = false;

        // Check if the document has been recently ingested
        if (sourceMetadata.documentId && documentContent && sourceMetadata.targetCoordinate) {
            try {
                // Import the hasBeenRecentlyIngested function
                const { hasBeenRecentlyIngested } = await import('../../../1_utils/document.utils.mjs');

                console.log(`Checking if document ${sourceMetadata.documentId} has been recently ingested...`);
                const recentlyIngested = await hasBeenRecentlyIngested(
                    sourceMetadata.documentId,
                    documentContent,
                    sourceMetadata.targetCoordinate,
                    bpMCPService
                );

                if (recentlyIngested) {
                    console.log(`Document ${sourceMetadata.documentId} has been recently ingested with the same content and target coordinate. Will skip LightRAG ingestion but still perform chunking.`);
                    skipLightRagIngestion = true;

                    // Add LightRAG metadata to indicate ingestion was skipped but successful
                    // Ensure target coordinate has "#" prefix
                    const normalizedTargetCoordinate = sourceMetadata.targetCoordinate?.startsWith('#')
                        ? sourceMetadata.targetCoordinate
                        : `#${sourceMetadata.targetCoordinate}`;

                    sourceMetadata.lightRagMetadata = {
                        ingestionDate: new Date(),
                        ingestionStatus: 'skipped',
                        skippedReason: 'Document recently ingested',
                        targetCoordinate: normalizedTargetCoordinate
                    };

                    // SIMPLIFIED: Don't generate content hash when skipping - the original system was working fine
                    console.log(`Skipped LightRAG ingestion for document ${sourceMetadata.documentId} - no hash generation needed`);

                } else {
                    console.log(`Document ${sourceMetadata.documentId} needs to be ingested into LightRAG.`);
                }
            } catch (checkError) {
                console.warn(`Error checking if document has been recently ingested: ${checkError.message}. Proceeding with ingestion.`);
            }
        }
        // 1. Chunk the document with enhanced coordinate-based metadata
        console.log(`Chunking document (${documentContent.length} chars) with enhanced coordinate metadata...`);

        // Prepare enhanced metadata for coordinate-based chunking
        const enhancedChunkingOptions = {
            generateContextWindow,
            CHUNK_SIZE,
            CHUNK_OVERLAP,
            bimbaMapSummary: state.bimbaMapSummary,
            // Enhanced coordinate metadata for LightRAG integration
            coordinateMetadata: {
                targetCoordinate: sourceMetadata.targetCoordinate,
                sourceFileName: sourceMetadata.sourceFileName,
                sourceType: sourceMetadata.sourceType,
                documentId: sourceMetadata.documentId,
                analysisTimestamp: new Date().toISOString(),
                pipelineStage: 'stage_minus3',
                // Add hierarchical coordinate context
                coordinateHierarchy: sourceMetadata.targetCoordinate.split('-').map((part, index, arr) =>
                    '#' + arr.slice(0, index + 1).join('-')
                ),
                // Add coordinate-specific context
                coordinateContext: {
                    primary: sourceMetadata.targetCoordinate,
                    related: [], // Will be populated from Bimba context if available
                    depth: sourceMetadata.targetCoordinate.split('-').length - 1
                }
            }
        };

        // Extract related coordinates from Bimba context if available
        if (bimbaEnhancedContext && typeof bimbaEnhancedContext === 'string') {
            try {
                // Look for coordinate references in the context
                const coordinateMatches = bimbaEnhancedContext.match(/#[0-9]+(-[0-9]+)*/g);
                if (coordinateMatches) {
                    enhancedChunkingOptions.coordinateMetadata.coordinateContext.related =
                        [...new Set(coordinateMatches)].filter(coord => coord !== sourceMetadata.targetCoordinate);
                }
            } catch (contextError) {
                console.warn(`Error extracting coordinates from Bimba context: ${contextError.message}`);
            }
        }

        const chunks = await chunkDocument(
            documentContent,
            bimbaEnhancedContext,
            fullBimbaMap,
            projectContext,
            enhancedChunkingOptions
        );
        console.log(`Document chunked into ${chunks.length} chunks with enhanced coordinate metadata`);

        // 2. Send chunks to LightRAG for ingestion synchronously (if not skipped)
        let results = [];
        let successCount = 0;

        if (skipLightRagIngestion) {
            console.log(`Skipping LightRAG ingestion for ${chunks.length} chunks as document was recently ingested.`);

            // Create mock successful results for all chunks
            results = chunks.map((_, index) => ({
                success: true,
                index,
                skipped: true
            }));

            successCount = chunks.length;
            console.log(`Created mock results for ${chunks.length} chunks (all marked as successfully skipped).`);

            // Update sourceMetadata with chunk count
            if (sourceMetadata.lightRagMetadata) {
                sourceMetadata.lightRagMetadata.totalChunks = chunks.length;
                sourceMetadata.lightRagMetadata.processedCount = chunks.length;
                sourceMetadata.lightRagMetadata.errorCount = 0;
            }
        } else {
            console.log(`Starting synchronous LightRAG ingestion for ${chunks.length} chunks...`);

            // Log the LightRAG server URL for debugging
            const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";
            console.log(`Using LightRAG server at: ${LIGHTRAG_MCP_SERVER_URL}`);

            // Send chunks to LightRAG with enhanced coordinate metadata
            const enhancedSourceMetadata = {
                ...sourceMetadata,
                // Add the enhanced coordinate metadata to source metadata
                coordinateMetadata: enhancedChunkingOptions.coordinateMetadata,
                // Add chunk-level metadata for better retrieval
                chunkMetadata: {
                    totalChunks: chunks.length,
                    chunkSize: CHUNK_SIZE,
                    chunkOverlap: CHUNK_OVERLAP,
                    hasContextWindows: chunks.every(chunk => chunk.metadata?.contextWindow),
                    coordinateEnhanced: true
                }
            };

            results = await sendChunksToLightRAG(chunks, enhancedSourceMetadata, bpMCPService);

            // Add null/undefined check before filtering results
            successCount = results && Array.isArray(results)
                ? results.filter(r => r && r.success).length
                : 0;

            console.log(`LightRAG ingestion results: ${results ? results.length : 0} total, ${successCount} successful`);

            // If no chunks were successfully ingested, throw an error to stop the pipeline
            if (successCount === 0) {
                throw new Error(`LightRAG ingestion failed: No chunks were successfully ingested`);
            }

            console.log(`LightRAG ingestion completed: ${successCount}/${chunks.length} chunks successful`);
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

        // Prepare state for the next stage WITHOUT using ...state to avoid state bloat
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
            bimbaEnhancedContext,
            bimbaMapSummary: state.bimbaMapSummary,
            fullBimbaMap,
            projectContext,
            // Include minimal document reference
            document: state.document,
            // Include bpMCPService for document operations
            bpMCPService: state.bpMCPService,
            // Include original document content for reference
            documentContent,
            // AG-UI context for event emission
            skillContext: state.skillContext
            // Explicitly NOT including graphData to prevent leakage
        };

        // Double-check that no graph data is included
        if (stageMinus3Output.graphData) {
            console.log(`Removing graphData from stageMinus3Output`);
            delete stageMinus3Output.graphData;
        }

        console.log("--- Epii Pipeline: Stage -3 Complete ---");

        return stageMinus3Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -3:`, error);
        throw new Error(`Epii Pipeline Stage -3 failed: ${error.message}`);
    }
}
