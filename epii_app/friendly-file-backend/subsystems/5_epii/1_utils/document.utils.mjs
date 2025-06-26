/**
 * Utility functions for working with documents in the Epii Analysis Pipeline.
 * These functions provide a consistent interface for accessing and manipulating
 * document content, with proper validation and error handling.
 */

// Import document cache utilities
import { getDocumentFromCache, updateDocumentInCache } from '../../../databases/shared/utils/documentCache.utils.mjs';

// Import crypto for hashing
import crypto from 'crypto';

/**
 * Gets the content of a document using only the standardized 'textContent' property.
 * No fallbacks are used to ensure consistency across the system.
 *
 * @param {object} document - The document to get content from
 * @returns {string} - The document content
 * @throws {Error} - If the document has no textContent property or is invalid
 */
export function getDocumentContent(document) {
    if (!document) {
        throw new Error('Cannot get content from null or undefined document');
    }

    if (typeof document !== 'object') {
        throw new Error(`Invalid document type: expected object, got ${typeof document}`);
    }

    // Only use the standardized textContent property - no fallbacks
    if (!document.textContent) {
        // Log available properties for debugging
        const contentProperties = Object.keys(document).filter(key =>
            typeof document[key] === 'string' &&
            document[key].length > 0 &&
            key.toLowerCase().includes('content')
        );

        if (contentProperties.length > 0) {
            console.error(`Document ${document._id || 'unknown'} has no textContent property, but has these content properties:`, contentProperties);
            console.error(`This indicates a non-standardized document. All documents should use 'textContent' as the standard property.`);
        }

        throw new Error(`Document ${document._id || 'unknown'} has no textContent property`);
    }

    if (typeof document.textContent !== 'string') {
        console.warn(`Document ${document._id || 'unknown'} textContent is not a string (type: ${typeof document.textContent}), converting to string`);
        return String(document.textContent);
    }

    return document.textContent;
}

/**
 * Gets the title of a document with fallbacks for different property names.
 *
 * @param {object} document - The document to get title from
 * @returns {string} - The document title, or 'Untitled Document' if not found
 */
export function getDocumentTitle(document) {
    if (!document) return 'Untitled Document';

    return document.title ||
           document.fileName ||
           document.originalName ||
           document.name ||
           'Untitled Document';
}

/**
 * Gets the metadata of a document with fallbacks for different property names.
 *
 * @param {object} document - The document to get metadata from
 * @returns {object} - The document metadata, or an empty object if not found
 */
export function getDocumentMetadata(document) {
    if (!document) return {};

    return document.metadata || {};
}

/**
 * Detects the format of a document based on content and filename.
 *
 * @param {string} content - The document content
 * @param {string} fileName - The name of the document file
 * @returns {string} - The detected format ('markdown', 'html', 'json', 'text')
 */
export function detectDocumentFormat(content, fileName) {
    // Check file extension first
    if (fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'md') return 'markdown';
        if (extension === 'html' || extension === 'htm') return 'html';
        if (extension === 'json') return 'json';
    }

    // If no content, return text
    if (!content) return 'text';

    // Check content patterns
    const firstNonWhitespace = content.trim().substring(0, 10);

    // Check for JSON
    if (firstNonWhitespace.startsWith('{') || firstNonWhitespace.startsWith('[')) {
        try {
            JSON.parse(content);
            return 'json';
        } catch (e) {
            // Not valid JSON
        }
    }

    // Check for HTML
    if (content.includes('<html') || content.includes('<!DOCTYPE html')) {
        return 'html';
    }

    // Check for Markdown
    if (content.includes('# ') || content.includes('## ') || content.includes('```') ||
        content.includes('*') && content.includes('**')) {
        return 'markdown';
    }

    // Default to plain text
    return 'text';
}

/**
 * Pre-processes document content to prepare it for analysis.
 * Performs cleaning, normalization, and format detection.
 *
 * @param {string} content - The raw document content
 * @param {string} fileName - The name of the document file
 * @returns {Promise<string>} - The processed document content
 * @throws {Error} - If content is not a string or processing fails
 */
export async function preprocessDocumentContent(content, fileName) {
    // Validate input
    if (content === null || content === undefined) {
        throw new Error("Document content cannot be null or undefined");
    }

    if (typeof content !== 'string') {
        throw new Error(`Invalid document content type: expected string, got ${typeof content}`);
    }

    if (content.trim().length === 0) {
        console.warn("Document content is empty, returning empty string");
        return '';
    }

    try {
        console.log(`Pre-processing document content (${content.length} chars) for file: ${fileName || 'unnamed'}`);

        // 1. Normalize line endings
        let processedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // 2. Remove excessive whitespace
        processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

        // 3. Detect document format
        const format = detectDocumentFormat(processedContent, fileName);
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
                    console.warn(`Failed to parse JSON content: ${jsonError.message}`);
                    // Keep original content if JSON parsing fails
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

        // 6. Validate the processed content
        if (processedContent.trim().length === 0) {
            console.warn("Document content is empty after processing, using original content");
            return content;
        }

        console.log(`Successfully pre-processed document content (${processedContent.length} chars)`);
        return processedContent;
    } catch (error) {
        console.error(`Error pre-processing document content:`, error);
        throw new Error(`Failed to pre-process document content: ${error.message}`);
    }
}

/**
 * Creates a standardized document object with consistent property names.
 *
 * @param {string} documentId - The ID of the document
 * @param {string} content - The document content
 * @param {string} title - The document title
 * @param {object} metadata - The document metadata
 * @returns {object} - A standardized document object
 */
export function createStandardDocument(documentId, content, title, metadata = {}) {
    return {
        _id: documentId,
        textContent: content, // Use standardized textContent property
        title: title,
        metadata: metadata
    };
}

/**
 * Extracts a document from the BPMCP service result and standardizes it.
 * Ensures the document has a textContent property.
 *
 * @param {object} result - The result from the BPMCP service
 * @returns {object} - The standardized document
 * @throws {Error} - If the document cannot be extracted or standardized
 */
export function extractDocumentFromBPMCPResult(result) {
    let document = null;

    // Case 1: Array of documents (standard format)
    if (Array.isArray(result) && result.length > 0) {
        document = result[0];
    }
    // Case 2: Direct document object
    else if (result && typeof result === 'object' && result._id) {
        document = result;
    }
    // Case 3: BPMCP format with content array containing JSON string
    else if (result && result.content && Array.isArray(result.content)) {
        try {
            const contentItem = result.content.find(item => item.type === 'text' && item.text);
            if (contentItem && contentItem.text) {
                const parsedDoc = JSON.parse(contentItem.text);
                if (Array.isArray(parsedDoc) && parsedDoc.length > 0) {
                    document = parsedDoc[0];
                } else if (parsedDoc && typeof parsedDoc === 'object') {
                    document = parsedDoc;
                }
            }
        } catch (parseError) {
            throw new Error(`Failed to parse BPMCP result: ${parseError.message}`);
        }
    }

    if (!document) {
        throw new Error('No valid document found in BPMCP result');
    }

    // Standardize the document to ensure it has textContent
    if (!document._id) {
        throw new Error('Document has no _id property');
    }

    // If document has content but not textContent, standardize it
    if (!document.textContent && document.content) {
        // Create a new document with the standardized property
        const standardizedDoc = {
            ...document,
            textContent: document.content
        };

        // Log the standardization for debugging
        console.warn(`Standardizing document ${document._id}: copying 'content' to 'textContent'`);

        return standardizedDoc;
    }

    // If document has neither textContent nor content, it's invalid
    if (!document.textContent) {
        throw new Error(`Document ${document._id} has no textContent property`);
    }

    return document;
}

/**
 * Gets a document from the cache or BPMCP service with proper state handling.
 * Checks if the document is already in the state before fetching.
 * Ensures the document has a standardized textContent property.
 *
 * UPDATED: Now uses document cache utility to prevent redundant document fetches.
 *
 * @param {string} documentId - The ID of the document to fetch
 * @param {object} state - The current state, which may contain the document
 * @param {object} bpMCPService - The BPMCP service
 * @returns {Promise<{document: object, content: string}>} - The document and its content
 * @throws {Error} - If the document cannot be fetched or standardized
 */
export async function getDocumentFromBPMCP(documentId, state = {}, bpMCPService) {
    if (!documentId) {
        throw new Error("Document ID is required");
    }

    // CASE 1: Check if document is already in state with complete data
    if (state.documentFetched && state.document && state.document._id === documentId) {
        console.log(`Using document ${documentId} from state (already fetched)`);

        // Ensure the document has textContent
        if (!state.document.textContent) {
            throw new Error(`Document ${documentId} in state has no textContent property`);
        }

        return {
            document: state.document,
            content: state.document.textContent
        };
    }

    // CASE 2: Check if document content is provided directly in state
    if (state.documentContent) {
        console.log(`Using document content from state for ${documentId}`);

        // Create a minimal document object with the standardized property
        const document = {
            _id: documentId,
            textContent: state.documentContent,
            title: state.sourceFileName || 'Document from state',
            metadata: state.documentMetadata || {}
        };

        return { document, content: state.documentContent };
    }

    // CASE 3: Try to get document from cache first
    try {
        console.log(`Trying to get document ${documentId} from cache...`);
        const cachedDocument = await getDocumentFromCache(documentId);

        if (cachedDocument) {
            // Ensure the document has textContent
            if (!cachedDocument.textContent) {
                console.warn(`Cached document ${documentId} has no textContent property, will fetch from BPMCP`);
            } else {
                console.log(`Successfully retrieved document ${documentId} from cache (${cachedDocument.textContent.length} chars)`);
                return {
                    document: cachedDocument,
                    content: cachedDocument.textContent
                };
            }
        }
    } catch (cacheError) {
        console.warn(`Could not retrieve document ${documentId} from cache: ${cacheError.message}`);
        // Continue to BPMCP service fetch
    }

    // CASE 4: Need to fetch from BPMCP service
    if (!bpMCPService || !bpMCPService.getDocument) {
        throw new Error("BPMCP service with getDocument method is required");
    }

    console.log(`Fetching document ${documentId} from BPMCP service...`);

    try {
        // Fetch the document from the BPMCP service
        const result = await bpMCPService.getDocument(documentId);

        // Extract and standardize the document
        const document = extractDocumentFromBPMCPResult(result);

        // Get the content using our standardized method (will throw if no textContent)
        const content = getDocumentContent(document);

        console.log(`Successfully fetched document ${documentId} from BPMCP (${content.length} chars)`);
        console.log(`Content preview: "${content.substring(0, 50)}..."`);

        return { document, content };
    } catch (error) {
        console.error(`Error fetching document ${documentId}:`, error);
        throw new Error(`Failed to fetch document: ${error.message}`);
    }
}

/**
 * Chunks a document into smaller pieces for processing.
 * Enhanced with context windows to preserve Bimba context during chunking.
 * This implementation follows the design in the analysis pipeline development plan.
 *
 * @param {string} documentContent - The content of the document to chunk
 * @param {string} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {object} projectContext - Project-level context
 * @param {object} options - Additional options
 * @param {Function} options.generateContextWindow - Function to generate context windows
 * @param {number} options.CHUNK_SIZE - The size of each chunk
 * @param {number} options.CHUNK_OVERLAP - The overlap between chunks
 * @returns {Promise<Array<{pageContent: string, originalContent: string, metadata: object}>>} - An array of chunks with context windows
 */
export async function chunkDocument(
    documentContent,
    bimbaEnhancedContext,
    fullBimbaMap,
    projectContext,
    options = {}
) {
    if (!documentContent) {
        return [];
    }

    try {
        // Extract options
        const {
            generateContextWindow,
            CHUNK_SIZE = 1000,
            CHUNK_OVERLAP = 200,
            bimbaMapSummary = null
        } = options;

        // Split the document into paragraphs
        const paragraphs = documentContent.split(/\n\s*\n/);

        // Group paragraphs into chunks
        const chunks = [];
        let currentChunk = "";

        for (const paragraph of paragraphs) {
            if (currentChunk.length + paragraph.length + 2 > CHUNK_SIZE && currentChunk.length > 0) {
                // Add the current chunk to the list
                chunks.push(currentChunk);
                // Start a new chunk with overlap
                const words = currentChunk.split(/\s+/);
                const overlapWords = words.slice(-Math.floor(CHUNK_OVERLAP / 5));
                currentChunk = overlapWords.join(' ') + '\n\n' + paragraph;
            } else {
                // Add the paragraph to the current chunk
                if (currentChunk.length > 0) {
                    currentChunk += '\n\n';
                }
                currentChunk += paragraph;
            }
        }

        // Add the last chunk if it's not empty
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        console.log(`Split document into ${chunks.length} chunks.`);

        // Process each chunk to add context window
        console.log(`Adding context windows to chunks...`);
        const contextualizedChunks = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunkText = chunks[i];
            console.log(`Processing chunk ${i+1}/${chunks.length}...`);

            // Generate chunk-specific context window
            if (!generateContextWindow) {
                throw new Error("generateContextWindow function is required for chunking");
            }

            try {
                // Generate context window using the provided function
                // For stage -3 (RAG), we use the lightweight context window
                // Comprehensive context windows will be created in stage -2 if needed
                const contextWindow = await generateContextWindow(
                    chunkText,
                    documentContent,
                    bimbaEnhancedContext,
                    fullBimbaMap,
                    projectContext,
                    bimbaMapSummary,
                    {
                        // Create lightweight context windows for RAG ingestion
                        // This reduces the amount of data sent to LightRAG
                        forAnalysis: false
                    }
                );

                // Add the chunk to the list with context window
                // Ensure consistent data structure with standardized property names
                contextualizedChunks.push({
                    pageContent: `${contextWindow.contextText}\n\n${chunkText}`, // Full content with context window prepended
                    originalContent: chunkText, // Original chunk text without context window
                    metadata: {
                        index: i + 1,
                        contextWindow, // Complete context window object for use in later stages
                        bimbaCoordinates: contextWindow.bimbaContext?.mentionedCoordinates || [] // Extract coordinates for easy access
                    }
                });
            } catch (error) {
                // Log the error and rethrow it to stop the pipeline
                console.error(`Error generating context window for chunk ${i+1}:`, error);
                throw error; // Rethrow the error to stop the pipeline
            }
        }

        console.log(`Added context windows to ${contextualizedChunks.length} chunks.`);
        return contextualizedChunks;
    } catch (error) {
        console.error("Error chunking document:", error);
        throw new Error(`Failed to chunk document: ${error.message}`);
    }
}

/**
 * Sends document chunks to LightRAG for ingestion.
 * Uses direct HTTP call to the LightRAG MCP server instead of going through the BPMCP service.
 * This implementation sends the full context window with each chunk to enable contextual RAG functionality.
 *
 * IMPORTANT: This function has been updated to process chunks SEQUENTIALLY instead of in parallel,
 * to ensure that all operations complete before the function returns and to prevent asynchronous
 * operations from continuing after the pipeline stage completes.
 *
 * UPDATED: Now uses document cache utility to prevent redundant document fetches during ingestion.
 *
 * @param {Array<{pageContent: string, originalContent: string, metadata: object}>} chunks - The chunks to send
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} bpMCPService - The BPMCP service (used for document updates only)
 * @returns {Promise<Array<{success: boolean, index: number, error?: string}>>} - A promise that resolves to an array of results
 * @throws {Error} - If the LightRAG server is unavailable or returns an error
 */
export async function sendChunksToLightRAG(chunks, sourceMetadata, bpMCPService) {
    if (!chunks || chunks.length === 0) {
        console.log("No chunks to send to LightRAG.");
        return []; // Return empty array for consistent return type
    }

    try {
        console.log(`Preparing to send ${chunks.length} chunks to LightRAG...`);

        // Import axios for HTTP requests
        const axios = (await import('axios')).default;

        // Get LightRAG server URL from environment or use default
        const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";
        const LIGHTRAG_INGEST_URL = `${LIGHTRAG_MCP_SERVER_URL}/ingest`;

        // Process chunks SEQUENTIALLY to ensure all operations complete before returning
        const results = [];
        let processedCount = 0;
        let errorCount = 0;

        // Check if the document has been recently ingested
        if (sourceMetadata.documentId && sourceMetadata.documentContent && sourceMetadata.targetCoordinate) {
            try {
                const recentlyIngested = await hasBeenRecentlyIngested(
                    sourceMetadata.documentId,
                    sourceMetadata.documentContent,
                    sourceMetadata.targetCoordinate,
                    bpMCPService
                );

                if (recentlyIngested) {
                    console.log(`Document ${sourceMetadata.documentId} has been recently ingested with the same content and target coordinate. Skipping LightRAG ingestion.`);

                    // Return a successful result without actually sending chunks
                    return chunks.map((_, index) => ({
                        success: true,
                        index,
                        skipped: true
                    }));
                }

                console.log(`Document ${sourceMetadata.documentId} needs to be ingested into LightRAG.`);
            } catch (checkError) {
                console.warn(`Error checking if document has been recently ingested: ${checkError.message}. Proceeding with ingestion.`);
            }
        }

        console.log(`Sending ${chunks.length} chunks to LightRAG SEQUENTIALLY...`);

        // In the simplified version, we don't need to fetch the document from cache
        // since we're only checking the ingestion status

        // Process each chunk one at a time
        for (let index = 0; index < chunks.length; index++) {
            const chunk = chunks[index];
            console.log(`Processing chunk ${index + 1}/${chunks.length} sequentially...`);

            try {
                // Extract coordinates from metadata or use target coordinate
                const coordinates = [];
                if (sourceMetadata.targetCoordinate) {
                    // Ensure target coordinate has "#" prefix
                    const normalizedTargetCoordinate = sourceMetadata.targetCoordinate.startsWith('#')
                        ? sourceMetadata.targetCoordinate
                        : `#${sourceMetadata.targetCoordinate}`;
                    coordinates.push(normalizedTargetCoordinate);
                }

                // Add any coordinates from chunk metadata if available
                if (chunk.metadata && chunk.metadata.contextWindow &&
                    chunk.metadata.contextWindow.bimbaContext &&
                    chunk.metadata.contextWindow.bimbaContext.mentionedCoordinates) {
                    // Ensure all mentioned coordinates have "#" prefix
                    const normalizedMentionedCoordinates = chunk.metadata.contextWindow.bimbaContext.mentionedCoordinates
                        .map(coord => coord.startsWith('#') ? coord : `#${coord}`);
                    coordinates.push(...normalizedMentionedCoordinates);
                }

                // Check if originalContent exists
                if (!chunk.originalContent) {
                    console.error(`Chunk ${index} missing originalContent, skipping LightRAG ingestion`);
                    const result = {
                        success: false,
                        index,
                        error: "Missing originalContent"
                    };
                    results.push(result);
                    errorCount++;
                    continue; // Skip to next chunk
                }

                // Prepare payload for the LightRAG server
                // Include the full pageContent which contains the context window prepended to the chunk
                const payload = {
                    chunk_text: chunk.pageContent, // Use pageContent which includes context window
                    original_text: chunk.originalContent, // Also include original text for reference
                    bimba_coordinates: [...new Set(coordinates)] // Remove duplicates
                };

                console.log(`Sending chunk ${index + 1}/${chunks.length} with coords ${payload.bimba_coordinates.join(', ')} to ${LIGHTRAG_INGEST_URL}`);

                // Call the LightRAG server's /ingest endpoint
                const response = await axios.post(LIGHTRAG_INGEST_URL, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 120000 // 2 minute timeout - doubled from 60000ms
                });

                const result = {
                    success: response.data && response.data.status === 'success',
                    index
                };

                results.push(result);

                if (result.success) {
                    processedCount++;
                    console.log(`Chunk ${index + 1}/${chunks.length} successfully ingested`);
                } else {
                    errorCount++;
                    console.error(`Chunk ${index + 1}/${chunks.length} ingestion failed`);
                }

            } catch (chunkError) {
                console.error(`Error sending chunk ${index} to LightRAG:`, chunkError);
                const result = {
                    success: false,
                    index,
                    error: chunkError.message
                };
                results.push(result);
                errorCount++;
            }

            // Log progress after each chunk
            console.log(`LightRAG ingestion progress: ${index + 1}/${chunks.length} chunks processed (${processedCount} successful, ${errorCount} failed)`);
        }

        console.log(`Finished sending chunks to LightRAG SEQUENTIALLY. Processed: ${processedCount}, Errors: ${errorCount}`);

        // Store LightRAG metadata in sourceMetadata instead of updating the document directly
        // This will be used later in a consolidated document update at the end of the pipeline
        if (sourceMetadata.documentId) {
            // No need to store chunk IDs in the simplified version
            // Just focus on the ingestion status

            // Store metadata for later use - simplified to focus on ingestion status
            // Ensure target coordinate has "#" prefix
            const normalizedTargetCoordinate = sourceMetadata.targetCoordinate?.startsWith('#')
                ? sourceMetadata.targetCoordinate
                : `#${sourceMetadata.targetCoordinate}`;

            sourceMetadata.lightRagMetadata = {
                ingestionDate: new Date(),
                totalChunks: chunks.length,
                ingestionStatus: processedCount > 0 ? 'completed' : 'failed',
                targetCoordinate: normalizedTargetCoordinate
            };

            console.log(`Stored LightRAG metadata for document ${sourceMetadata.documentId} (will be updated at end of pipeline)`);

            // Update document ingestion metadata if ingestion was successful
            if (processedCount > 0 && sourceMetadata.targetCoordinate) {
                try {
                    await updateDocumentIngestionMetadata(
                        sourceMetadata.documentId,
                        sourceMetadata.documentContent, // Pass document content for hash generation
                        sourceMetadata.targetCoordinate,
                        bpMCPService
                    );
                    console.log(`Updated LightRAG ingestion metadata for document ${sourceMetadata.documentId}`);
                } catch (updateError) {
                    console.warn(`Error updating LightRAG ingestion metadata: ${updateError.message}. This won't affect the pipeline.`);
                }
            }
        }

        // Return the results array for proper error handling in the pipeline stage
        return results;
    } catch (error) {
        console.error("Error in LightRAG ingestion process:", error);
        throw new Error(`LightRAG ingestion failed: ${error.message}`);
    }
}

/**
 * Updates a document with analysis results in a consolidated manner.
 * This should be called at the end of the pipeline to avoid multiple document updates.
 *
 * This function implements a clear separation between MongoDB storage and cache storage:
 * - MongoDB: Stores ONLY minimal metadata about the analysis process
 * - Cache: Stores the COMPLETE analysis results including the full notionUpdatePayload
 *
 * @param {string} documentId - The ID of the document to update
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} notionUpdatePayload - The Notion update payload from the pipeline
 * @param {object} _ - Unused parameter (kept for backward compatibility)
 * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful
 * @throws {Error} - If the update fails or any required parameter is missing
 */
export async function updateDocumentWithAnalysisResults(documentId, sourceMetadata, notionUpdatePayload, _) {
    // Validate required parameters
    if (!documentId) {
        throw new Error("Document ID is required for update");
    }
    if (!sourceMetadata || !sourceMetadata.targetCoordinate) {
        throw new Error("Source metadata with targetCoordinate is required");
    }
    if (!notionUpdatePayload || !notionUpdatePayload.targetCoordinate) {
        throw new Error("Notion update payload with targetCoordinate is required");
    }

    try {
        console.log(`Updating document ${documentId} with analysis metadata...`);

        // Extract related coordinates if available
        const relatedCoordinates = Array.isArray(notionUpdatePayload.relatedCoordinates)
            ? notionUpdatePayload.relatedCoordinates
            : [];

        // Import the document cache utility
        const { storeAnalysisResultsInCache } = await import('../../../databases/shared/utils/documentCache.utils.mjs');

        // 1. Store COMPLETE analysis results in the document cache with consistent structure
        console.log(`Storing complete analysis results in document cache for document ${documentId}...`);

        // Create a properly structured object with notionUpdatePayload at the top level
        const analysisResultsForCache = {
            // Include the full notionUpdatePayload directly at the top level
            // This ensures consistent structure with stage_minus0.mjs
            notionUpdatePayload,

            // Include other metadata
            sourceMetadata,
            timestamp: new Date(),

            // Add debugging information
            _source: 'updateDocumentWithAnalysisResults'
        };

        // Log the structure we're storing
        console.log(`Storing analysis results with structure: ${Object.keys(analysisResultsForCache).join(', ')}`);

        // Verify notionUpdatePayload is present and has required fields
        if (notionUpdatePayload && notionUpdatePayload.targetCoordinate) {
            console.log(`notionUpdatePayload has targetCoordinate: ${notionUpdatePayload.targetCoordinate}`);
        } else {
            console.warn(`WARNING: notionUpdatePayload is missing or has no targetCoordinate!`);
        }

        await storeAnalysisResultsInCache(documentId, analysisResultsForCache);

        // 2. Create a flat updates object with ONLY minimal metadata for MongoDB
        const updates = {
            'analysisStatus': 'completed',
            'metadata.analysisStatus': 'completed',
            'metadata.analysisCompletedAt': new Date(),
            'metadata.analysisResults.completionDate': new Date(),
            'metadata.analysisResults.targetCoordinate': sourceMetadata.targetCoordinate,
            'metadata.analysisResults.title': notionUpdatePayload.title,
            'metadata.analysisResults.relatedCoordinates': relatedCoordinates
            // DO NOT store the full notionUpdatePayload in MongoDB
        };

        // Add LightRAG metadata if available - only status and counts
        if (sourceMetadata?.lightRagMetadata) {
            updates['metadata.lightRagMetadata.ingestionDate'] = sourceMetadata.lightRagMetadata.ingestionDate;
            updates['metadata.lightRagMetadata.totalChunks'] = sourceMetadata.lightRagMetadata.totalChunks;
            updates['metadata.lightRagMetadata.ingestionStatus'] = sourceMetadata.lightRagMetadata.ingestionStatus;
            updates['metadata.lightRagMetadata.processedCount'] = sourceMetadata.lightRagMetadata.processedCount;
            updates['metadata.lightRagMetadata.errorCount'] = sourceMetadata.lightRagMetadata.errorCount;

            // Ensure target coordinate is preserved
            if (sourceMetadata.lightRagMetadata.targetCoordinate) {
                updates['metadata.lightRagMetadata.targetCoordinate'] = sourceMetadata.lightRagMetadata.targetCoordinate;
            }

            // Preserve content hash if it exists
            if (sourceMetadata.lightRagMetadata.contentHash) {
                updates['metadata.lightRagMetadata.contentHash'] = sourceMetadata.lightRagMetadata.contentHash;
            }
        }

        // 3. Update the document in MongoDB with minimal metadata
        try {
            console.log(`Updating document ${documentId} in MongoDB with minimal metadata...`);
            await updateDocumentInCache(documentId, updates);

            console.log(`Successfully updated document ${documentId} with analysis metadata`);
            console.log(`Target coordinate: ${sourceMetadata.targetCoordinate}`);
            console.log(`Related coordinates: ${relatedCoordinates.length > 0 ? relatedCoordinates.join(', ') : 'none'}`);

            return true;
        } catch (updateError) {
            console.error(`Error updating document in MongoDB:`, updateError);
            throw new Error(`Failed to update document: ${updateError.message}`);
        }
    } catch (error) {
        console.error(`Error preparing analysis results for document ${documentId}:`, error);
        throw new Error(`Failed to update document with analysis results: ${error.message}`);
    }
}

/**
 * Generates a hash for a document based on its content and target coordinate.
 * This is used to determine if a document has changed significantly enough to require reingestion.
 *
 * @param {string} documentContent - The content of the document
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @returns {string} - The hash of the document
 */
export function generateDocumentHash(documentContent, targetCoordinate) {
    if (!documentContent || typeof documentContent !== 'string') {
        throw new Error("documentContent must be a non-empty string");
    }

    if (!targetCoordinate || typeof targetCoordinate !== 'string') {
        throw new Error("targetCoordinate must be a non-empty string");
    }

    // Create a hash of the document content and target coordinate
    const hash = crypto.createHash('sha256');
    hash.update(documentContent);
    hash.update(targetCoordinate);
    return hash.digest('hex');
}

/**
 * Checks if a document has been recently ingested into LightRAG.
 * This simplified function only checks if the document has a 'completed' ingestion status.
 *
 * @param {string} documentId - The ID of the document
 * @param {string} _ - Unused parameter (kept for backward compatibility)
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} bpMCPService - The BPMCP service
 * @returns {Promise<boolean>} - True if the document has been successfully ingested
 */
export async function hasBeenRecentlyIngested(documentId, documentContent, targetCoordinate, bpMCPService) {
    if (!documentId || !bpMCPService) {
        return false;
    }

    try {
        console.log(`Checking if document ${documentId} has been recently ingested...`);

        // IMPORTANT: Force bypass the cache by setting useCache=false
        // This ensures we always get the latest document state from MongoDB
        console.log(`Fetching document ${documentId} from MongoDB (bypassing cache)...`);
        const document = await bpMCPService.getDocumentById(documentId, 'Documents', false);

        if (!document) {
            console.log(`Document ${documentId} not found in MongoDB, will need to ingest`);
            return false;
        }

        console.log(`Document ${documentId} found in MongoDB. Checking LightRAG metadata...`);
        console.log(`Document metadata:`, JSON.stringify(document.metadata?.lightRagMetadata || {}, null, 2));

        console.log(`Retrieved document ${documentId} directly from MongoDB (bypassing cache)`);
        console.log(`Checking LightRAG ingestion status for document ${documentId}...`);

        // Log the document structure for debugging
        console.log(`Document metadata structure: ${JSON.stringify(Object.keys(document.metadata || {}))}`);
        if (document.metadata && document.metadata.lightRagMetadata) {
            console.log(`LightRAG metadata: ${JSON.stringify(document.metadata.lightRagMetadata)}`);
        } else {
            console.log(`Document has no lightRagMetadata`);
        }

        // Check if lightRagMetadata exists and ingestionStatus is either 'completed' or 'skipped'
        // Both statuses indicate the document has been processed and doesn't need reingestion
        if (document.metadata &&
            document.metadata.lightRagMetadata &&
            (document.metadata.lightRagMetadata.ingestionStatus === 'completed' ||
             document.metadata.lightRagMetadata.ingestionStatus === 'skipped')) {

            // Check if the document has a different target coordinate
            // Normalize both coordinates for comparison
            if (targetCoordinate && document.metadata.lightRagMetadata.targetCoordinate) {
                const normalizedRequestedCoordinate = targetCoordinate.startsWith('#') ? targetCoordinate : `#${targetCoordinate}`;
                const normalizedStoredCoordinate = document.metadata.lightRagMetadata.targetCoordinate.startsWith('#')
                    ? document.metadata.lightRagMetadata.targetCoordinate
                    : `#${document.metadata.lightRagMetadata.targetCoordinate}`;

                if (normalizedStoredCoordinate !== normalizedRequestedCoordinate) {
                    console.log(`Document ${documentId} target coordinate has changed from ${normalizedStoredCoordinate} to ${normalizedRequestedCoordinate}, will need to reingest`);
                    return false;
                }
            }

            // SIMPLIFIED: Don't check content hash - if status is 'completed' and coordinate matches, skip ingestion
            // The original system was working fine without complex hashing
            console.log(`Document ${documentId} content hash checking disabled - using simple status check`);
            console.log(`Document has completed ingestion status for coordinate ${document.metadata.lightRagMetadata.targetCoordinate}`);


            console.log(`Document ${documentId} has been successfully ingested with status '${document.metadata.lightRagMetadata.ingestionStatus}', skipping ingestion`);
            return true;
        }

        // If we get here, the document needs to be ingested
        console.log(`Document ${documentId} needs to be ingested into LightRAG (status: ${document.metadata?.lightRagMetadata?.ingestionStatus || 'none'})`);
        return false;
    } catch (error) {
        console.error(`Error checking if document ${documentId} has been recently ingested:`, error);
        return false;
    }
}

/**
 * Updates a document's LightRAG ingestion metadata.
 * This simplified function just sets the ingestion status to 'completed'.
 *
 * @param {string} documentId - The ID of the document
 * @param {string} _ - Unused parameter (kept for backward compatibility)
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} bpMCPService - The BPMCP service
 * @returns {Promise<object>} - The updated document
 */
export async function updateDocumentIngestionMetadata(documentId, documentContent, targetCoordinate, bpMCPService) {
    if (!documentId || !bpMCPService) {
        throw new Error("Missing required parameters for updateDocumentIngestionMetadata");
    }

    try {
        // Create update object with required fields
        const updateObj = {
            // Set the ingestion status to completed - this is the ONLY required field
            'metadata.lightRagMetadata.ingestionStatus': 'completed',
            'metadata.lightRagMetadata.ingestionDate': new Date()
        };

        // Add target coordinate if provided - ensure it has "#" prefix
        if (targetCoordinate) {
            const normalizedCoordinate = targetCoordinate.startsWith('#') ? targetCoordinate : `#${targetCoordinate}`;
            updateObj['metadata.lightRagMetadata.targetCoordinate'] = normalizedCoordinate;
            console.log(`Storing normalized target coordinate: ${normalizedCoordinate}`);
        }

        // SIMPLIFIED: Don't generate content hash - the original system was working fine without it
        // Just focus on setting the ingestion status to 'completed' and target coordinate
        console.log(`Simplified LightRAG metadata update - no hash generation needed`);


        // Update the document in MongoDB with minimal required fields
        const updatedDocument = await bpMCPService.updateDocument(documentId, {
            $set: updateObj
        });

        // IMPORTANT: Invalidate the document cache to ensure fresh data on next fetch
        if (bpMCPService.documentCache && typeof bpMCPService.documentCache.delete === 'function') {
            console.log(`Invalidating cache for document ${documentId} after updating LightRAG metadata`);
            bpMCPService.documentCache.delete(documentId);
        }

        // Import and use the document cache utility to ensure proper invalidation
        try {
            const { invalidateDocumentCache } = await import('../../../databases/shared/utils/documentCache.utils.mjs');
            invalidateDocumentCache(documentId);
            console.log(`Invalidated document cache for ${documentId} using documentCache utility`);
        } catch (cacheError) {
            console.warn(`Could not invalidate document cache using utility: ${cacheError.message}`);
            // Continue even if cache invalidation fails - the direct cache.delete above should work
        }

        // Invalidate UnifiedRAG cache for the target coordinate
        if (targetCoordinate) {
            try {
                const { getInstance } = await import('../../friendly-file-back2front/skills/bimba-skills-registry.js');
                const registry = await getInstance();
                const unifiedRAGSkill = registry.getSkillById('unifiedRAG');

                if (unifiedRAGSkill && unifiedRAGSkill.handler) {
                    // Get the actual skill instance to call invalidateCoordinateCache
                    const skillInstance = unifiedRAGSkill.handler.__self || unifiedRAGSkill;
                    if (skillInstance && typeof skillInstance.invalidateCoordinateCache === 'function') {
                        skillInstance.invalidateCoordinateCache(targetCoordinate);
                        console.log(`Invalidated UnifiedRAG cache for coordinate ${targetCoordinate}`);
                    }
                }
            } catch (ragCacheError) {
                console.warn(`Could not invalidate UnifiedRAG cache: ${ragCacheError.message}`);
            }
        }

        console.log(`Updated LightRAG ingestion metadata for document ${documentId} - status set to 'completed'`);
        return updatedDocument;
    } catch (error) {
        console.error(`Error updating LightRAG ingestion metadata for document ${documentId}:`, error);
        throw new Error(`Failed to update LightRAG ingestion metadata: ${error.message}`);
    }
}