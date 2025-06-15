import { callBPMCPTool, closeBPMCPClient } from './bpWebSocketClient.mjs';

/**
 * Shared service for accessing B-P MCP tools
 */
class BPMCPService {
  constructor() {
    // Simple in-memory document cache
    this.documentCache = new Map();
    console.log("BPMCPService initialized with document cache");
  }
  /**
   * Call a tool on the B-P MCP server
   * @param {string} toolName - The name of the tool to call
   * @param {object} args - The arguments for the tool
   * @returns {Promise<any>} - The result of the tool call
   */
  async callTool(toolName, args) {
    return callBPMCPTool(toolName, args);
  }

  /**
   * Close the connection to the B-P MCP server
   */
  close() {
    closeBPMCPClient();
  }

  // Add convenience methods for common tools

  /**
   * Query the Bimba graph
   * @param {string} query - Cypher query
   * @param {object} [params] - Query parameters
   * @returns {Promise<any>} - Query results
   */
  async queryBimbaGraph(query, params = {}) {
    return this.callTool('queryBimbaGraph', { query, params });
  }

  /**
   * Search the Pratibimba context
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @returns {Promise<any>} - Search results
   */
  async searchPratibimbaContext(query, options = {}) {
    return this.callTool('searchPratibimbaContext', {
      query,
      collection: options.collection,
      filters: options.filters,
      limit: options.limit
    });
  }

  /**
   * Get context from MongoDB
   * @param {string} contextType - Type of context ('conversation', 'userMemory', 'ingestedData')
   * @param {string} [userId] - User ID (required for 'conversation' and 'userMemory')
   * @param {object} [query] - Additional query parameters
   * @param {number} [limit] - Maximum number of results
   * @returns {Promise<any>} - Context data
   */
  async getMongoContext(contextType, userId, query = {}, limit = 10) {
    // Ensure limit is an integer
    const intLimit = typeof limit === 'number' ? Math.floor(limit) : 10;

    return this.callTool('getMongoContext', {
      contextType,
      userId,
      query,
      limit: intLimit
    });
  }

  /**
   * Query Notion
   * @param {object} options - Query options
   * @returns {Promise<any>} - Notion data
   */
  async queryNotion(options) {
    return this.callTool('queryNotion', options);
  }

  /**
   * Get inspiration based on a query
   * @param {string} query - The topic or area for which inspiration is sought
   * @param {string[]} [coordinateFilter] - Optional array of Bimba coordinates
   * @param {number} [limit] - Maximum number of results
   * @returns {Promise<any>} - Inspiration data
   */
  async getInspiration(query, coordinateFilter, limit) {
    return this.callTool('getInspiration', {
      query,
      coordinateFilter,
      limit
    });
  }

  /**
   * Get an overview of a node
   * @param {string} bimbaCoordinate - The Bimba coordinate of the node
   * @returns {Promise<any>} - Node overview
   */
  async getNodeOverview(bimbaCoordinate) {
    return this.callTool('getNodeOverview', { bimbaCoordinate });
  }

  /**
   * Get architectural context using semantic search and graph traversal
   * @param {string} query - Natural language query about system architecture
   * @param {number} [contextDepth=1] - Depth of graph traversal (1-3 hops)
   * @param {string} [focusCoordinate] - Optional Bimba coordinate to focus search
   * @param {string} [agentCoordinate] - Agent's home coordinate for branch awareness (e.g., '#5' for Epii)
   * @param {number} [limit=6] - Maximum number of initial results (default: 6 for hexagonal structure)
   * @returns {Promise<any>} - Architectural context
   */
  async bimbaKnowing(query, contextDepth = 1, focusCoordinate, agentCoordinate, limit = 6) {
    // Convert to integers to ensure they're valid integers
    // The server now uses neo4j.int() to properly convert these to Neo4j integers
    const intContextDepth = Math.floor(Number(contextDepth || 1));
    const intLimit = Math.floor(Number(limit || 6));

    console.log(`bimbaKnowing with limit: ${intLimit}, contextDepth: ${intContextDepth}`);

    // Create a clean object with integer values
    const args = {
      query,
      contextDepth: intContextDepth,
      focusCoordinate,
      agentCoordinate,
      limit: intLimit
    };

    // Log the exact arguments being sent
    console.log(`Sending bimbaKnowing args:`, JSON.stringify(args));

    return this.callTool('bimbaKnowing', args);
  }

  /**
   * Search the web
   * @param {string} query - Search query
   * @returns {Promise<any>} - Search results
   */
  async searchWeb(query) {
    return this.callTool('searchWeb', { query });
  }

  /**
   * Research and integrate content
   * @param {object} options - Research options
   * @returns {Promise<any>} - Research results
   */
  async researchAndIntegrate(options) {
    return this.callTool('researchAndIntegrate', options);
  }

  /**
   * Send content to ingestion
   * @param {string} textContent - The text content to ingest
   * @param {object} metadata - Metadata for the content
   * @returns {Promise<any>} - Ingestion results
   */
  async sendToIngestion(textContent, metadata) {
    return this.callTool('sendToIngestion', {
      textContent,
      metadata
    });
  }

  /**
   * Resolve a Bimba coordinate to a Notion page ID
   * @param {string} bimbaCoordinate - The Bimba coordinate to resolve
   * @returns {Promise<any>} - Resolution results
   */
  async resolveBimbaCoordinate(bimbaCoordinate) {
    return this.callTool('resolveBimbaCoordinate', { bimbaCoordinate });
  }

  /**
   * Append blocks to a Notion page
   * @param {string} notionPageId - The ID of the Notion page
   * @param {Array} blocksToAppend - The blocks to append
   * @returns {Promise<any>} - Append results
   */
  async appendNotionBlock(notionPageId, blocksToAppend) {
    return this.callTool('appendNotionBlock', {
      notionPageId,
      blocksToAppend
    });
  }

  /**
   * Crystallize content to a Notion page
   * @param {object} options - Crystallization options
   * @param {string} options.targetBimbaCoordinate - The Bimba coordinate of the target node
   * @param {Array} [options.contentBlocks] - Structured Notion blocks to append (preferred)
   * @param {string} [options.contentToAppend] - The content to append (legacy)
   * @param {string} [options.title] - Title for the page if it needs to be created
   * @param {object} [options.properties] - Additional properties to set on the page
   * @param {boolean} [options.createIfNotExists=true] - Whether to create the page if it doesn't exist
   * @param {string} [options.contentFormat='markdown'] - Format of the content to append ('markdown' or 'plain') - for legacy contentToAppend
   * @param {Array} [options.relations] - Relations to establish with other Notion databases
   * @returns {Promise<any>} - Crystallization results
   */
  async crystallizeToNotion(options) {
    // Handle backward compatibility with the old function signature
    if (typeof options === 'string') {
      const targetBimbaCoordinate = options;
      const contentToAppend = arguments[1];

      console.warn('Using deprecated crystallizeToNotion signature. Please update to use the options object.');

      return this.callTool('crystallizeToNotion', {
        targetBimbaCoordinate,
        contentToAppend
      });
    }

    // Validate required parameters
    if (!options.targetBimbaCoordinate) {
      throw new Error('targetBimbaCoordinate is required');
    }

    // Validate that we have either contentBlocks or contentToAppend
    if (!options.contentBlocks && !options.contentToAppend) {
      throw new Error('Either contentBlocks or contentToAppend is required');
    }

    // Set default values
    const params = {
      targetBimbaCoordinate: options.targetBimbaCoordinate,
      title: options.title,
      properties: options.properties,
      createIfNotExists: options.createIfNotExists !== false, // Default to true
      relations: options.relations
    };

    // Add structured blocks if available
    if (options.contentBlocks && Array.isArray(options.contentBlocks)) {
      params.contentBlocks = options.contentBlocks;
    }

    // Add legacy content if available (and no contentBlocks)
    if (options.contentToAppend && !options.contentBlocks) {
      params.contentToAppend = options.contentToAppend;
      params.contentFormat = options.contentFormat || 'markdown';
    }

    return this.callTool('crystallizeToNotion', params);
  }

  /**
   * Get Notion page properties
   * @param {string} notionPageId - The ID of the Notion page
   * @param {string} [fetchFileFromProperty] - Optional property to fetch file from
   * @returns {Promise<any>} - Page properties
   */
  async getNotionPageProperties(notionPageId, fetchFileFromProperty) {
    return this.callTool('getNotionPageProperties', {
      notionPageId,
      fetchFileFromProperty
    });
  }

  /**
   * List documents by Bimba coordinate
   * @param {string} coordinate - The Bimba coordinate
   * @param {number} [limit=100] - Maximum number of documents to return
   * @returns {Promise<any>} - List of documents
   */
  async listDocumentsByCoordinate(coordinate, limit = 100) {
    // Ensure limit is an integer
    const intLimit = typeof limit === 'number' ? Math.floor(limit) : 100;

    return this.callTool('listDocumentsByCoordinate', {
      coordinate,
      limit: intLimit
    });
  }

  /**
   * List all documents
   * @param {object} [query={}] - Optional query parameters
   * @param {number} [limit=100] - Maximum number of documents to return
   * @param {number} [skip=0] - Number of documents to skip (for pagination)
   * @returns {Promise<any>} - List of documents
   */
  async listAllDocuments(query = {}, limit = 100, skip = 0) {
    // Ensure limit is an integer
    const intLimit = typeof limit === 'number' ? Math.floor(limit) : 100;
    // Ensure skip is an integer
    const intSkip = typeof skip === 'number' ? Math.floor(skip) : 0;

    return this.callTool('listDocuments', {
      query,
      limit: intLimit,
      skip: intSkip
    });
  }

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @param {string} [collection='Documents'] - Collection name
   * @param {boolean} [useCache=true] - Whether to use the cache
   * @returns {Promise<any>} - Document data with standardized textContent property
   */
  async getDocumentById(documentId, collection = 'Documents', useCache = true) {
    if (!documentId) {
      throw new Error("Document ID is required");
    }

    // Check cache first if useCache is true
    if (useCache && this.documentCache.has(documentId)) {
      console.log(`Using cached document ${documentId}`);
      return this.documentCache.get(documentId);
    }

    console.log(`Getting document by ID: ${documentId}`);

    try {
      // Call the BPMCP service directly
      const result = await this.callTool('getDocumentById', {
        documentId,
        collection
      });

      // Process and standardize the result
      if (result) {
        // Handle array result format
        const doc = Array.isArray(result) && result.length > 0 ? result[0] : result;

        // Standardize the document to ensure it has textContent
        if (doc) {
          // If document has content but not textContent, standardize it
          if (!doc.textContent && doc.content) {
            console.warn(`Standardizing document ${documentId}: copying 'content' to 'textContent'`);
            doc.textContent = doc.content;
          }

          // Log document information
          if (doc.textContent) {
            console.log(`Successfully retrieved document ${documentId} with content length: ${doc.textContent.length}`);
            console.log(`Content preview: "${doc.textContent.substring(0, 50)}..."`);
          } else {
            console.warn(`Document ${documentId} has no textContent property!`);
            console.log(`Document structure: ${JSON.stringify(Object.keys(doc))}`);
          }

          // Cache the result if useCache is true
          if (useCache) {
            console.log(`Caching document ${documentId}`);
            this.documentCache.set(documentId, Array.isArray(result) ? result : [doc]);
          }
        } else {
          console.warn(`Document ${documentId} not found or empty result`);
        }
      }

      return result;
    } catch (error) {
      console.error(`Error getting document ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Store document in MongoDB
   * @param {object} document - Document data
   * @returns {Promise<any>} - Stored document
   */
  async storeDocument(document) {
    // Add metadata to the document and ensure required fields are present
    const documentWithMetadata = {
      ...document,
      // Map fileName to title if title is not provided
      title: document.title || document.fileName || document.originalName || "Untitled Document",
      metadata: {
        source: document.originalName,
        source_type: 'file',
        userId: document.userId || 'anonymous',
        mimeType: document.mimeType,
        size: document.size,
        path: document.path
      }
    };

    console.log(`Preparing document for storage with title: ${documentWithMetadata.title}`);

    return this.callTool('storeDocument', {
      document: documentWithMetadata
    });
  }

  /**
   * Update document
   * @param {string} documentId - Document ID
   * @param {object} update - MongoDB update operation
   * @param {string} [collection='Documents'] - Collection name
   * @returns {Promise<any>} - Updated document
   */
  async updateDocument(documentId, update, collection = 'Documents') {
    // Log the update operation for debugging
    console.log(`Updating document ${documentId} in collection ${collection} with update:`,
      JSON.stringify({
        textContent: update.$set?.textContent ? `${update.$set.textContent.substring(0, 50)}...` : undefined,
        lastModified: update.$set?.lastModified,
        size: update.$set?.size
      })
    );

    return this.callTool('updateDocument', {
      documentId,
      update,
      collection
    });
  }

  /**
   * Update document coordinate
   * @param {string} documentId - Document ID
   * @param {string} coordinate - New Bimba coordinate
   * @returns {Promise<any>} - Updated document
   */
  async updateDocumentCoordinate(documentId, coordinate) {
    return this.updateDocument(documentId, {
      $set: {
        targetCoordinate: coordinate
      }
    });
  }

  /**
   * Delete document
   * @param {string} documentId - Document ID
   * @returns {Promise<any>} - Deletion result
   */
  async deleteDocument(documentId) {
    return this.callTool('deleteDocument', {
      documentId
    });
  }

  /**
   * Store analysis results in the cache
   * Ensures that no graph data is included in the payload
   * Uses the document cache utility for storage
   *
   * @param {string} documentId - Document ID
   * @param {object} analysisResults - Analysis results to store in the cache
   * @returns {Promise<any>} - Result of the operation
   */
  async sendAnalysisResultsToCache(documentId, analysisResults) {
    if (!documentId || !analysisResults) {
      throw new Error('Document ID and analysis results are required');
    }

    console.log(`Storing analysis results in document cache for document ${documentId}`);

    try {
      // Create a clean version of the analysis results without any graph data
      const cleanAnalysisResults = { ...analysisResults };

      // Explicitly remove any graph data that might be present
      if (cleanAnalysisResults.graphData) {
        console.log(`Removing graphData from analysis results before storing in cache`);
        delete cleanAnalysisResults.graphData;
      }

      // Also check for nested graph data
      if (cleanAnalysisResults.notionUpdatePayload && cleanAnalysisResults.notionUpdatePayload.graphData) {
        console.log(`Removing nested graphData from notionUpdatePayload before storing in cache`);
        delete cleanAnalysisResults.notionUpdatePayload.graphData;
      }

      // Check for graph data in analysisResults
      if (cleanAnalysisResults.analysisResults && cleanAnalysisResults.analysisResults.graphData) {
        console.log(`Removing nested graphData from analysisResults before storing in cache`);
        delete cleanAnalysisResults.analysisResults.graphData;
      }

      // Import the document cache utility
      const { storeAnalysisResultsInCache } = await import('../utils/documentCache.utils.mjs');

      // Store the clean analysis results in the cache
      console.log(`Storing clean analysis results in document cache (${Object.keys(cleanAnalysisResults).length} properties)`);
      await storeAnalysisResultsInCache(documentId, cleanAnalysisResults);

      // Return a success response
      return {
        success: true,
        message: "Analysis results stored in document cache successfully",
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error storing analysis results in document cache: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start document analysis
   * @param {string} documentId - Document ID
   * @param {string} targetCoordinate - Target Bimba coordinate
   * @param {object} [graphData] - Optional graph data for enhanced Bimba awareness
   * @returns {Promise<any>} - Analysis result
   */
  async startDocumentAnalysis(documentId, targetCoordinate, graphData) {
    if (!documentId) {
      throw new Error("Document ID is required for analysis");
    }

    if (!targetCoordinate) {
      throw new Error("Target Bimba coordinate is required for analysis");
    }

    // Import the standardized document utilities
    const { extractDocumentFromBPMCPResult, getDocumentContent } = await import('../utils/document.utils.mjs');

    // Get the document first to ensure it exists and to get its metadata
    const result = await this.getDocumentById(documentId);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new Error(`Document not found with ID: ${documentId}`);
    }

    // Extract and standardize the document
    const document = extractDocumentFromBPMCPResult(result);

    // Get document content using the standardized utility
    const documentContent = getDocumentContent(document);

    // Get metadata and filename
    const documentMetadata = document.metadata || {};
    const fileName = document.title || document.fileName || document.originalName || 'Unknown File';

    // Update the document's analysis status to 'processing'
    const analysisStartTime = new Date();
    await this.updateDocument(documentId, {
      $set: {
        'analysisStatus': 'processing',
        'metadata.analysisStatus': 'processing',
        'metadata.analysisStartedAt': analysisStartTime,
        'metadata.versionControl.lastAnalysisDate': analysisStartTime
      }
    });

    // Import the real analysis pipeline
    try {
      console.log(`Starting real analysis pipeline for document ${documentId} with target coordinate ${targetCoordinate}`);

      // Import the runPipeline function from the refactored pipeline
      const { runPipeline } = await import('../pipelines/epii_analysis_pipeline_refactored.mjs');

      // Start the analysis pipeline with standardized document properties
      // This avoids the need to fetch the document again during analysis
      const initialState = {
        documentId: documentId,
        targetCoordinate: targetCoordinate,
        userId: 'admin', // Default to admin user for now
        graphData: graphData || { nodes: [], edges: [] },
        // Include the document with standardized properties
        document: {
          _id: documentId,
          textContent: documentContent, // Always use standardized textContent
          title: fileName,
          metadata: documentMetadata
        },
        // Include content and metadata for convenience
        documentContent: documentContent, // Standardized content
        sourceFileName: fileName,
        documentMetadata: documentMetadata,
        // Include bpMCPService for document operations
        bpMCPService: this
      };

      // Create a promise that will resolve when the analysis is complete
      const analysisPromise = new Promise((resolve, reject) => {
        // Run the FULL pipeline with all stages
        console.log(`Running FULL pipeline with all stages (-5 through -0) for document ${documentId}`);
        runPipeline(initialState)
          .then(async (result) => {
            // Verify that all stages completed successfully
            if (!result.notionUpdatePayload || !result.epiiPerspective) {
              throw new Error(`Pipeline did not complete all stages - missing final stage outputs`);
            }

            console.log(`Analysis pipeline completed successfully for document ${documentId} - ALL STAGES COMPLETED`);

            try {
              // Import the standardized document utility
              const { updateDocumentWithAnalysisResults } = await import('../utils/document.utils.mjs');

              // Use the standardized utility to update the document
              // Ensure we're using the notionUpdatePayload from the final stage
              if (!result.notionUpdatePayload) {
                throw new Error("Missing notionUpdatePayload from pipeline result - cannot update document");
              }

              await updateDocumentWithAnalysisResults(
                documentId,
                {
                  targetCoordinate,
                  // Include any additional metadata from the pipeline result
                  ...(result.sourceMetadata || {})
                },
                result.notionUpdatePayload,
                this
              );

              console.log(`Successfully updated document ${documentId} with analysis results using standardized utility`);
              resolve(result);
            } catch (updateError) {
              console.error(`Error updating document with analysis results: ${updateError.message}`);
              // Still resolve with the result even if the update fails
              resolve(result);
            }
          })
          .catch(async (error) => {
            console.error(`Error running analysis pipeline: ${error.message}`);

            try {
              // Update the document with the error - await this to ensure it completes
              const errorTime = new Date();
              await this.updateDocument(documentId, {
                $set: {
                  'analysisStatus': 'failed',
                  'metadata.analysisStatus': 'failed',
                  'metadata.analysisCompletedAt': errorTime,
                  'metadata.analysisError': error.message
                }
              });

              console.log(`Updated document ${documentId} with analysis error status`);
            } catch (updateError) {
              console.error(`Error updating document with analysis error: ${updateError.message}`);
            }

            // Always reject with the original error
            reject(new Error(`Analysis pipeline failed: ${error.message}`));
          });
      });

      // Store the promise in a global map so we can check its status later
      if (!global.analysisPromises) {
        global.analysisPromises = new Map();
      }
      global.analysisPromises.set(documentId, analysisPromise);

      // Return a success message immediately
      return {
        message: "Document analysis has been started with the real pipeline",
        documentId: documentId,
        targetCoordinate: targetCoordinate
      };
    } catch (error) {
      console.error(`Error starting analysis pipeline: ${error.message}`);

      try {
        // Update the document with the error status
        await this.updateDocument(documentId, {
          $set: {
            'analysisStatus': 'failed',
            'metadata.analysisStatus': 'failed',
            'metadata.analysisError': `Failed to start analysis: ${error.message}`
          }
        });

        console.log(`Updated document ${documentId} with startup error status`);
      } catch (updateError) {
        console.error(`Error updating document with startup error: ${updateError.message}`);
      }

      // No fallback - propagate the error with clear message
      throw new Error(`Failed to start analysis pipeline: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new BPMCPService();
