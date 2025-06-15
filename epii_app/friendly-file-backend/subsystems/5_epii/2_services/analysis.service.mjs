/**
 * Analysis Service
 *
 * Provides methods for analyzing documents:
 * - Starting document analysis
 * - Tracking analysis sessions
 * - Retrieving analysis results
 *
 * This service implements the analysis phase of the Meta-Techne loop:
 * Ingest → Tag → Embed → Store → Retrieve → Synthesize → Crystallize → Sync
 */

import mongoose from 'mongoose';
import Document from '../../../databases/shared/models/Document.model.mjs';
import AnalysisSession from '../3_models/AnalysisSession.model.mjs';
import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';
import epiiAgentService from './epii-agent.service.mjs';

/**
 * Start document analysis
 * @param {Object} params - Parameters for analysis
 * @param {string} params.documentId - ID of the document to analyze
 * @param {string} params.userId - ID of the user starting the analysis
 * @param {string} params.targetCoordinate - Bimba coordinate for the analysis
 * @returns {Promise<Object>} - The created analysis session
 */
export const startDocumentAnalysis = async ({
  documentId,
  userId,
  targetCoordinate
}) => {
  try {
    // Validate required parameters
    if (!documentId || !userId || !targetCoordinate) {
      throw new Error('Missing required parameters for analysis');
    }

    // Import the standardized document utilities
    const { extractDocumentFromBPMCPResult, getDocumentContent } = await import('../utils/document.utils.mjs');

    // Use the BPMCP service to get the document
    console.log(`Getting document via BPMCP service: ${documentId}`);
    const result = await bpMCPService.getDocumentById(documentId);

    // Extract the document using the standardized utility
    const rawDocument = extractDocumentFromBPMCPResult(result);

    // Convert the document to a Mongoose document if needed
    let document;
    try {
      document = new Document(rawDocument);
    } catch (error) {
      // If conversion fails, use the raw document
      document = rawDocument;
      console.warn(`Using raw document from BPMCP service: ${error.message}`);
    }

    // Get the document content using the standardized utility
    const content = getDocumentContent(document);

    // Log document information
    console.log(`Document retrieved successfully: ${documentId}`);
    console.log(`Content length: ${content.length} chars`);
    console.log(`Content preview: "${content.substring(0, 50)}..."`);

    // Ensure document has textContent property (standardized)
    if (!document.textContent) {
      document.textContent = content;
    }

    console.log(`Successfully retrieved document via BPMCP service: ${documentId}`);

    // Create a new analysis session
    const sessionId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const analysisSession = new AnalysisSession({
      sessionId,
      userId,
      documentId,
      targetCoordinate,
      status: 'analyzing',
      startedAt: new Date()
    });

    // Save the analysis session
    await analysisSession.save();

    // Update the document status using the cache system instead of direct MongoDB calls
    try {
      // Import the document cache service
      const { updateDocumentInCache } = await import('../utils/documentCache.utils.mjs');

      // Update the document in cache
      await updateDocumentInCache(documentId, {
        'metadata.analysisStatus': 'processing',
        'analysisStatus': 'processing',
        'metadata.analysisStartedAt': new Date()
      });

      console.log(`Updated document ${documentId} analysis status to 'processing' in cache`);
    } catch (cacheError) {
      console.warn(`Could not update document in cache: ${cacheError.message}`);
      // Fall back to direct update only if cache update fails
      document.metadata.analysisStatus = 'processing';
      await document.save();
    }

    // Start the analysis pipeline asynchronously
    processDocumentAnalysis(document, analysisSession)
      .then(() => console.log(`Analysis completed for document: ${documentId}`))
      .catch(error => console.error(`Error analyzing document: ${documentId}`, error));

    return analysisSession;
  } catch (error) {
    console.error('Error starting document analysis:', error);
    throw error;
  }
};

/**
 * Process document analysis
 * @param {Object} document - The document to analyze
 * @param {Object} analysisSession - The analysis session
 * @returns {Promise<void>}
 */
const processDocumentAnalysis = async (document, analysisSession) => {
  try {
    // Get the document ID
    const documentId = document._id ? document._id.toString() : document.id;

    // Import the standardized document utility
    const { getDocumentContent } = await import('../utils/document.utils.mjs');

    // Get document content using the standardized utility
    let documentContent;
    try {
      documentContent = getDocumentContent(document);
    } catch (error) {
      console.error(`Error getting document content: ${error.message}`);
      throw new Error(`Document ${documentId} has no textContent property for analysis`);
    }

    console.log(`Using document content for analysis, length: ${documentContent.length}`);
    console.log(`Content preview: "${documentContent.substring(0, 50)}..."`);

    // Prepare the initial state for the analysis pipeline
    const initialState = {
      documentId: documentId,
      documentContent: documentContent,
      targetCoordinate: analysisSession.targetCoordinate,
      userId: analysisSession.userId,
      sourceMetadata: {
        sourceFileName: document.title || document.fileName || document.originalName || "Untitled Document",
        targetCoordinate: analysisSession.targetCoordinate,
        documentId: documentId
      }
    };

    // Import the refactored pipeline
    const { runPipeline } = await import('../pipelines/epii_analysis_pipeline_refactored.mjs');

    console.log(`Running refactored analysis pipeline for document ${documentId} with target coordinate ${analysisSession.targetCoordinate}`);

    // Run the analysis pipeline with error handling
    try {
      // Run the refactored pipeline with the initial state
      const result = await runPipeline({
        ...initialState,
        bpMCPService,
        handleErrors: true // Return errors instead of throwing
      });

      // Check if the pipeline returned an error
      if (result.error) {
        throw new Error(`Pipeline error: ${result.error}`);
      }

      // Check if the pipeline completed all stages
      if (!result.notionUpdatePayload) {
        throw new Error(`Pipeline did not complete all stages - missing notionUpdatePayload from stage -0`);
      }

      // Check if the pipeline completed stage -0 (final stage)
      if (!result.epiiPerspective) {
        throw new Error(`Pipeline did not complete stage -0 - missing epiiPerspective`);
      }

      console.log(`Analysis pipeline completed successfully for document ${documentId} - all stages completed`);

      // Update the analysis session with the results
      analysisSession.status = 'complete';
      analysisSession.completedAt = new Date();
      analysisSession.results = {
        synthesis: result.synthesis || '',
        coreElements: result.coreElements || [],
        mappings: result.allMappings || [],
        variations: result.allVariations || [],
        tags: result.allTags || [],
        epiiPerspective: result.epiiPerspective || '',
        notionUpdatePayload: result.notionUpdatePayload || null
      };
      await analysisSession.save();

      console.log(`Updated analysis session with results for document ${documentId}`);

      // The document is already updated by the pipeline, no need to update it here
      console.log(`Document ${documentId} analysis status updated by pipeline`);

      // Send the analysis results to the frontend cache
      try {
        const cacheResult = await bpMCPService.sendAnalysisResultsToCache(
          documentId,
          analysisSession.results
        );

        if (cacheResult?.skipped) {
          console.log(`Frontend cache update skipped for document ${documentId} - broadcastEvent tool not available`);
        } else {
          console.log(`Sent analysis results to frontend cache for document ${documentId}`);
        }
      } catch (cacheError) {
        // Check if this is the "Unknown tool: broadcastEvent" error
        if (cacheError.message && cacheError.message.includes('Unknown tool: broadcastEvent')) {
          console.warn(`The broadcastEvent tool is not available in the current MCP server. Skipping frontend cache update.`);
          console.warn(`This is not a critical error and the analysis can continue.`);
        } else {
          console.error(`Error sending analysis results to cache: ${cacheError.message}`);
        }
        // Continue even if cache update fails
      }
    } catch (pipelineError) {
      console.error(`Error running analysis pipeline: ${pipelineError.message}`);

      // Update the analysis session with the error
      analysisSession.status = 'error';
      analysisSession.completedAt = new Date();
      analysisSession.error = pipelineError.message;
      await analysisSession.save();

      // Update the document status using the cache system
      try {
        // Import the document cache service
        const { updateDocumentInCache } = await import('../utils/documentCache.utils.mjs');

        // Update the document in cache
        await updateDocumentInCache(documentId, {
          'analysisStatus': 'failed',
          'metadata.analysisStatus': 'failed',
          'metadata.analysisError': pipelineError.message,
          'metadata.analysisErrorTimestamp': new Date()
        });

        console.log(`Updated document ${documentId} with error status in cache`);
      } catch (updateError) {
        console.error(`Error updating document status in cache: ${updateError.message}`);

        // Fall back to direct update only if cache update fails
        try {
          await bpMCPService.updateDocument(documentId, {
            $set: {
              'analysisStatus': 'failed',
              'metadata.analysisStatus': 'failed',
              'metadata.analysisError': pipelineError.message,
              'metadata.analysisErrorTimestamp': new Date()
            }
          });
          console.log(`Updated document ${documentId} with error status via direct MongoDB call`);
        } catch (directUpdateError) {
          console.error(`Error updating document status via direct MongoDB call: ${directUpdateError.message}`);
        }
      }

      throw pipelineError;
    }
  } catch (error) {
    console.error('Error processing document analysis:', error);

    // Update the analysis session with the error
    analysisSession.status = 'error';
    analysisSession.completedAt = new Date();
    await analysisSession.save();

    // Update the document status using the cache system
    try {
      // Import the document cache service
      const { updateDocumentInCache } = await import('../utils/documentCache.utils.mjs');

      // Update the document in cache
      await updateDocumentInCache(documentId, {
        'analysisStatus': 'failed',
        'metadata.analysisStatus': 'failed',
        'metadata.analysisError': error.message,
        'metadata.analysisErrorTimestamp': new Date()
      });

      console.log(`Updated document ${documentId} with error status in cache`);
    } catch (cacheError) {
      console.error(`Error updating document status in cache: ${cacheError.message}`);

      // Fall back to direct update only if cache update fails
      try {
        document.metadata.analysisStatus = 'failed';
        await document.save();
        console.log(`Updated document ${documentId} with error status via direct save`);
      } catch (saveError) {
        console.error(`Error saving document status: ${saveError.message}`);
      }
    }

    throw error;
  }
};

/**
 * Get analysis session by ID
 * @param {string} sessionId - Analysis session ID
 * @returns {Promise<Object>} - The analysis session
 */
export const getAnalysisSession = async (sessionId) => {
  try {
    const session = await AnalysisSession.findOne({ sessionId });
    if (!session) {
      throw new Error(`Analysis session not found: ${sessionId}`);
    }
    return session;
  } catch (error) {
    console.error('Error getting analysis session:', error);
    throw error;
  }
};

/**
 * Get latest analysis session for a document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} - The latest analysis session
 */
export const getLatestAnalysisSession = async (documentId) => {
  try {
    const session = await AnalysisSession.findOne({ documentId })
      .sort({ startedAt: -1 })
      .limit(1);
    return session;
  } catch (error) {
    console.error('Error getting latest analysis session:', error);
    throw error;
  }
};

export default {
  startDocumentAnalysis,
  getAnalysisSession,
  getLatestAnalysisSession
};
