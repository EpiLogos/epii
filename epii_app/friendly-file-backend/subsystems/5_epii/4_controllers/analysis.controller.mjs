/**
 * Analysis Controller
 *
 * Provides endpoints for document analysis:
 * - Starting document analysis
 * - Getting analysis results
 * - Generating Notion update previews
 */

import analysisService from '../2_services/analysis.service.mjs';
import Document from '../../../databases/shared/models/Document.model.mjs';
import AnalysisSession from '../3_models/AnalysisSession.model.mjs';
import crystallizationService from '../2_services/crystallization.service.mjs';
import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';

/**
 * Start document analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const startDocumentAnalysis = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.user?.id || 'system';
    const { targetCoordinate, graphData } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    if (!targetCoordinate) {
      return res.status(400).json({ error: 'Target Bimba coordinate is required' });
    }

    // Validate the target coordinate format
    const coordinateRegex = /^#[0-5](-[0-5])*$/;
    if (!coordinateRegex.test(targetCoordinate)) {
      return res.status(400).json({
        error: 'Invalid target coordinate format. Must be in the format #X-X-X where X is 0-5'
      });
    }

    console.log(`Starting analysis for document ${documentId} with target coordinate ${targetCoordinate}`);

    // Check if document exists before starting analysis
    try {
      const document = await bpMCPService.getDocumentById(documentId);
      if (!document || !Array.isArray(document) || document.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }
      console.log(`Document found, proceeding with analysis`);
    } catch (docError) {
      console.error(`Error checking document existence:`, docError);
      return res.status(404).json({ error: `Document not found: ${docError.message}` });
    }

    // Start the analysis
    const analysisSession = await analysisService.startDocumentAnalysis({
      documentId,
      userId,
      targetCoordinate,
      graphData: graphData || { nodes: [], edges: [] }
    });

    res.status(200).json({
      success: true,
      message: 'Document analysis started',
      sessionId: analysisSession.sessionId,
      status: analysisSession.status,
      targetCoordinate: analysisSession.targetCoordinate,
      startedAt: analysisSession.startedAt
    });
  } catch (error) {
    console.error('Error starting document analysis:', error);
    res.status(500).json({
      error: error.message,
      success: false,
      message: `Failed to start document analysis: ${error.message}`
    });
  }
};

/**
 * Get analysis session status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAnalysisSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { documentId } = req.query; // Allow checking by documentId as well

    if (!sessionId && !documentId) {
      return res.status(400).json({ error: 'Either Session ID or Document ID is required' });
    }

    // If we have a documentId, check if there's an active analysis promise
    if (documentId && global.analysisPromises && global.analysisPromises.has(documentId)) {
      // Check the status of the promise
      const analysisPromise = global.analysisPromises.get(documentId);

      try {
        // Try to get the document to check its status
        const documents = await bpMCPService.callTool('getDocumentById', {
          documentId
        });

        const document = Array.isArray(documents) && documents.length > 0
          ? documents[0]
          : (documents && typeof documents === 'object' ? documents : null);

        if (document) {
          // Check if analysis is completed
          const analysisStatus = document.analysisStatus ||
                               (document.metadata && document.metadata.analysisStatus);

          if (analysisStatus === 'completed') {
            // Analysis is complete
            return res.status(200).json({
              success: true,
              session: {
                documentId,
                status: 'complete',
                startedAt: document.metadata?.analysisStartedAt || new Date(),
                completedAt: document.metadata?.analysisCompletedAt || new Date(),
                results: document.metadata?.analysisResults || null
              }
            });
          } else if (analysisStatus === 'failed') {
            // Analysis failed
            return res.status(200).json({
              success: false,
              session: {
                documentId,
                status: 'failed',
                startedAt: document.metadata?.analysisStartedAt || new Date(),
                completedAt: document.metadata?.analysisCompletedAt || new Date(),
                error: document.metadata?.analysisError || 'Unknown error'
              }
            });
          }
        }

        // If we get here, analysis is still in progress
        return res.status(200).json({
          success: true,
          session: {
            documentId,
            status: 'processing',
            startedAt: new Date(),
            completedAt: null,
            results: null
          }
        });
      } catch (error) {
        console.error('Error checking document status:', error);
        // Continue to check the session if available
      }
    }

    // If we have a sessionId, get the analysis session
    if (sessionId) {
      const session = await analysisService.getAnalysisSession(sessionId);

      return res.status(200).json({
        success: true,
        session: {
          sessionId: session.sessionId,
          status: session.status,
          startedAt: session.startedAt,
          completedAt: session.completedAt,
          results: session.status === 'complete' ? session.results : null
        }
      });
    }

    // If we get here, we couldn't find any information
    return res.status(404).json({ error: 'Analysis session not found' });
  } catch (error) {
    console.error('Error getting analysis session status:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get latest analysis results for a document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLatestAnalysisResults = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Import the document cache utility
    const { getAnalysisResultsFromCache } = await import('../utils/documentCache.utils.mjs');

    // First try to get analysis results from the cache
    console.log(`Checking document cache for analysis results for document ${documentId}...`);
    let cachedResults = await getAnalysisResultsFromCache(documentId);

    // If not found in document cache, try to migrate from old cache
    if (!cachedResults) {
      console.log(`No analysis results found in document cache, checking old cache...`);
      try {
        const { migrateAnalysisResults } = await import('../utils/cacheTransition.utils.mjs');
        const migrated = await migrateAnalysisResults(documentId);

        if (migrated) {
          console.log(`Successfully migrated analysis results from old cache, retrieving from document cache...`);
          cachedResults = await getAnalysisResultsFromCache(documentId);
        }
      } catch (migrationError) {
        console.warn(`Error migrating from old cache: ${migrationError.message}`);
      }
    }

    if (cachedResults) {
      console.log(`Found analysis results in cache for document ${documentId}`);
      return res.status(200).json({
        success: true,
        documentId,
        analysisResults: cachedResults,
        source: 'cache'
      });
    }

    // If not in cache, fall back to MongoDB
    console.log(`No analysis results found in cache, checking MongoDB for document ${documentId}`);
    const result = await bpMCPService.callTool('getDocumentById', {
      documentId
    });

    // Process the result
    let document = null;

    // Case 1: Array of documents (standard format)
    if (Array.isArray(result) && result.length > 0) {
      document = result[0];
      console.log(`Retrieved document via BPMCP service (array format): ${documentId}`);
    }
    // Case 2: Direct document object
    else if (result && typeof result === 'object' && result._id) {
      document = result;
      console.log(`Retrieved document via BPMCP service (direct object): ${documentId}`);
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
          console.log(`Retrieved document via BPMCP service (parsed from content): ${documentId}`);
        }
      } catch (parseError) {
        console.error(`Error parsing BPMCP response:`, parseError);
      }
    }

    if (!document) {
      return res.status(404).json({ error: `Document not found or invalid format with ID: ${documentId}` });
    }

    // Get content length from any available content property
    const contentLength =
      document.content?.length ||
      document.textContent?.length ||
      document.text?.length ||
      document.rawContent?.length ||
      document.raw?.length ||
      0;

    if (contentLength === 0) {
      console.warn(`Document ${documentId} has no content in any expected field!`);
      return res.status(400).json({ error: `Document ${documentId} has no content` });
    }

    console.log(`Successfully retrieved document via BPMCP service: ${documentId}, content length: ${contentLength}`);

    // Check if the document has analysis results
    if (!document.metadata || (!document.metadata.analysisResults && !document.metadata.notionUpdatePayload)) {
      console.error(`Document ${documentId} has no analysis results or notionUpdatePayload in metadata`);
      console.log(`Document metadata:`, document.metadata);
      return res.status(404).json({ error: 'No analysis results found for this document' });
    }

    // Get minimal analysis metadata from MongoDB
    const analysisMetadata = document.metadata.analysisResults || {};

    // If we have notionUpdatePayload directly in metadata, include it
    // This is for backward compatibility
    if (document.metadata.notionUpdatePayload && !analysisMetadata.notionUpdatePayload) {
      analysisMetadata.notionUpdatePayload = document.metadata.notionUpdatePayload;

      // Also store it in the cache for future use
      console.log(`Found notionUpdatePayload in document metadata, storing in cache for future use`);
      const { storeAnalysisResultsInCache } = await import('../utils/documentCache.utils.mjs');
      await storeAnalysisResultsInCache(documentId, {
        notionUpdatePayload: document.metadata.notionUpdatePayload,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      documentId,
      analysisResults: analysisMetadata,
      source: 'mongodb',
      note: 'Only minimal metadata available in MongoDB, full results not found in cache'
    });
  } catch (error) {
    console.error('Error getting latest analysis results:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a crystallization document from analysis results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCrystallizationFromAnalysis = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.user?.id || 'system';

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required'
      });
    }

    console.log(`Creating crystallization for document ${documentId}`);

    // Get the document from BPMCP service
    console.log(`Getting document via BPMCP service: ${documentId}`);
    const result = await bpMCPService.callTool('getDocumentById', {
      documentId
    });

    // Process the result to get the document
    let document = null;

    // Handle different response formats
    if (Array.isArray(result) && result.length > 0) {
      document = result[0];
    } else if (result && typeof result === 'object' && result._id) {
      document = result;
    } else if (result && result.content && Array.isArray(result.content)) {
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
        console.error(`Error parsing BPMCP response:`, parseError);
      }
    }

    if (!document) {
      return res.status(404).json({ error: `Document not found with ID: ${documentId}` });
    }

    // Get the notionUpdatePayload directly from the document cache
    console.log(`Getting notionUpdatePayload from document cache for document ${documentId}`);
    const { getAnalysisResultsFromCache } = await import('../../../databases/shared/utils/documentCache.utils.mjs');
    let cachedResults = await getAnalysisResultsFromCache(documentId);

    // DEBUGGING: Log the exact structure of what we found
    if (cachedResults) {
      console.log(`FOUND CACHE RESULTS with keys: ${Object.keys(cachedResults).join(', ')}`);

      // Check for notionUpdatePayload at different levels
      if (cachedResults.notionUpdatePayload) {
        console.log(`notionUpdatePayload found at TOP LEVEL with keys: ${Object.keys(cachedResults.notionUpdatePayload).join(', ')}`);
      }
      if (cachedResults.fullAnalysisResults && cachedResults.fullAnalysisResults.notionUpdatePayload) {
        console.log(`notionUpdatePayload found in fullAnalysisResults with keys: ${Object.keys(cachedResults.fullAnalysisResults.notionUpdatePayload).join(', ')}`);
      }
      if (cachedResults.results && cachedResults.results.notionUpdatePayload) {
        console.log(`notionUpdatePayload found in results with keys: ${Object.keys(cachedResults.results.notionUpdatePayload).join(', ')}`);
      }
    } else {
      console.log(`NO CACHE RESULTS FOUND for document ${documentId}`);
    }

    // If not found in document cache, try to migrate from old cache
    if (!cachedResults) {
      console.log(`No analysis results found in document cache, checking old cache...`);
      try {
        const { migrateAnalysisResults } = await import('../1_utils/cacheTransition.utils.mjs');
        const migrated = await migrateAnalysisResults(documentId);

        if (migrated) {
          console.log(`Successfully migrated analysis results from old cache, retrieving from document cache...`);
          cachedResults = await getAnalysisResultsFromCache(documentId);
        }
      } catch (migrationError) {
        console.warn(`Error migrating from old cache: ${migrationError.message}`);
      }
    }

    if (!cachedResults) {
      return res.status(404).json({
        success: false,
        error: 'No analysis results found in cache for this document'
      });
    }

    // Extract notionUpdatePayload from cached results
    let notionUpdatePayload = null;

    // Check for notionUpdatePayload at the top level (preferred location)
    if (cachedResults.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.notionUpdatePayload;
    }
    // Check for notionUpdatePayload in fullAnalysisResults
    else if (cachedResults.fullAnalysisResults && cachedResults.fullAnalysisResults.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.fullAnalysisResults.notionUpdatePayload;
    }
    // Check for notionUpdatePayload in results (legacy structure)
    else if (cachedResults.results && cachedResults.results.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.results.notionUpdatePayload;
    }

    if (!notionUpdatePayload) {
      return res.status(404).json({
        success: false,
        error: 'No Notion update payload found in cache for this document'
      });
    }

    // Log what we found
    console.log(`Found notionUpdatePayload with keys: ${Object.keys(notionUpdatePayload).join(', ')}`);

    // Debug: Log the structure of contentBlocks if present
    if (notionUpdatePayload.contentBlocks) {
      console.log(`ContentBlocks type: ${typeof notionUpdatePayload.contentBlocks}`);
      if (Array.isArray(notionUpdatePayload.contentBlocks)) {
        console.log(`ContentBlocks is an array with ${notionUpdatePayload.contentBlocks.length} items`);
        // Log the first item as a sample
        if (notionUpdatePayload.contentBlocks.length > 0) {
          const sample = notionUpdatePayload.contentBlocks[0];
          console.log(`First contentBlock sample type: ${typeof sample}`);
          if (typeof sample === 'object') {
            console.log(`First contentBlock sample keys: ${Object.keys(sample).join(', ')}`);
          }
        }
      } else if (typeof notionUpdatePayload.contentBlocks === 'object') {
        console.log(`ContentBlocks is an object with keys: ${Object.keys(notionUpdatePayload.contentBlocks).join(', ')}`);
      }
    }

    // SIMPLIFIED APPROACH: Just use what we have and provide defaults for missing values
    // IMPORTANT: For crystallization, we want to use the content from the notionUpdatePayload,
    // not the original document content. The notionUpdatePayload contains the analysis results.
    let content = '';

    if (notionUpdatePayload.content) {
      // Direct content field
      content = notionUpdatePayload.content;
      console.log(`Using content directly from notionUpdatePayload (${content.length} characters)`);
    } else if (notionUpdatePayload.contentBlocks) {
      // If content is in contentBlocks array, join them
      if (Array.isArray(notionUpdatePayload.contentBlocks)) {
        // Process each content block to extract text
        const processedBlocks = notionUpdatePayload.contentBlocks.map(block => {
          if (typeof block === 'string') {
            return block;
          } else if (block && typeof block === 'object') {
            // Try to extract text from the block
            if (block.text) return block.text;
            if (block.content) return block.content;
            if (block.title) return `# ${block.title}`;

            // If we can't extract text directly, try to stringify it nicely
            try {
              return JSON.stringify(block, null, 2);
            } catch (e) {
              return '[Complex content block]';
            }
          }
          return String(block);
        });

        content = processedBlocks.join('\n\n');
        console.log(`Extracted content from contentBlocks array (${content.length} characters)`);
      } else if (typeof notionUpdatePayload.contentBlocks === 'object') {
        // If contentBlocks is an object, try to extract meaningful content
        try {
          const blocks = [];

          // If it has keys that look like indices (0, 1, 2...), treat it as an array-like object
          const keys = Object.keys(notionUpdatePayload.contentBlocks);
          const isArrayLike = keys.every(key => !isNaN(parseInt(key)));

          if (isArrayLike) {
            // Process as array-like object
            keys.sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
              const block = notionUpdatePayload.contentBlocks[key];
              if (typeof block === 'string') {
                blocks.push(block);
              } else if (block && typeof block === 'object') {
                if (block.text) blocks.push(block.text);
                else if (block.content) blocks.push(block.content);
                else if (block.title) blocks.push(`# ${block.title}`);
                else blocks.push(JSON.stringify(block, null, 2));
              } else {
                blocks.push(String(block));
              }
            });
          } else {
            // Process as a regular object with named properties
            Object.entries(notionUpdatePayload.contentBlocks).forEach(([key, value]) => {
              if (typeof value === 'string') {
                blocks.push(`## ${key}\n${value}`);
              } else if (value && typeof value === 'object') {
                if (value.text) blocks.push(`## ${key}\n${value.text}`);
                else if (value.content) blocks.push(`## ${key}\n${value.content}`);
                else if (value.title) blocks.push(`# ${value.title}`);
                else blocks.push(`## ${key}\n${JSON.stringify(value, null, 2)}`);
              } else {
                blocks.push(`## ${key}\n${String(value)}`);
              }
            });
          }

          if (blocks.length > 0) {
            content = blocks.join('\n\n');
            console.log(`Extracted content from contentBlocks object (${content.length} characters)`);
          } else {
            // If we couldn't extract text, use the stringified version
            content = JSON.stringify(notionUpdatePayload.contentBlocks, null, 2);
            console.log(`Using stringified contentBlocks (${content.length} characters)`);
          }
        } catch (err) {
          console.error(`Error extracting content from contentBlocks:`, err);
          content = JSON.stringify(notionUpdatePayload.contentBlocks, null, 2);
          console.log(`Using fallback stringified contentBlocks (${content.length} characters)`);
        }
      } else {
        // If contentBlocks is something else, stringify it
        content = JSON.stringify(notionUpdatePayload.contentBlocks, null, 2);
        console.log(`Using stringified contentBlocks (${content.length} characters)`);
      }
    } else {
      // As a last resort, create a summary from the notionUpdatePayload
      content = `# Analysis Summary for ${document.title || 'Document'}\n\n`;
      content += `Target Coordinate: ${notionUpdatePayload.targetCoordinate || 'Not specified'}\n\n`;

      if (notionUpdatePayload.title) {
        content += `## ${notionUpdatePayload.title}\n\n`;
      }

      if (notionUpdatePayload.properties) {
        content += `## Properties\n\n`;
        Object.entries(notionUpdatePayload.properties).forEach(([key, value]) => {
          content += `- **${key}**: ${JSON.stringify(value)}\n`;
        });
      }

      content += `\n\n*This is an automatically generated summary as no content was found in the analysis results.*`;
      console.log(`Created summary content (${content.length} characters)`);
    }
    const title = notionUpdatePayload.title || `Crystallization of ${document.title || 'Document'}`;
    const targetCoordinate = notionUpdatePayload.targetCoordinate || document.metadata?.targetCoordinate || '#';

    // Log the parameters we're using
    console.log(`Creating crystallization with parameters:
      - originalDocumentId: ${documentId}
      - userId: ${userId}
      - content length: ${content.length} characters
      - title: ${title}
      - targetCoordinate: ${targetCoordinate}
      - relatedCoordinates: ${JSON.stringify(notionUpdatePayload.relatedCoordinates || [])}
    `);

    // ENHANCED: Include Epii perspective as structured content blocks
    console.log(`Structuring crystallization content with Epii perspective...`);

    // Get the Epii perspective from the analysis results
    const epiiPerspective = cachedResults?.fullAnalysisResults?.epiiPerspective ||
                           cachedResults?.epiiPerspective ||
                           'No Epii perspective available';

    console.log(`Found Epii perspective: ${epiiPerspective.length} characters`);

    // Structure the content as blocks for comprehensive crystallization
    const contentBlocks = [
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '📊 Document Analysis Synthesis' }
          }]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: content }
          }]
        }
      },
      {
        type: 'divider',
        divider: {}
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '🎯 Epii Perspective' }
          }]
        }
      },
      {
        type: 'callout',
        callout: {
          icon: { emoji: '🧠' },
          rich_text: [{
            type: 'text',
            text: { content: epiiPerspective }
          }]
        }
      }
    ];

    // Create a crystallization document with structured content blocks
    const crystallization = await crystallizationService.createCrystallization({
      originalDocumentId: documentId,
      userId,
      content, // Keep legacy content for compatibility
      contentBlocks, // Add structured content blocks
      title,
      targetCoordinate,
      relatedCoordinates: notionUpdatePayload.relatedCoordinates || []
    });

    // Update the crystallization document with the Notion update payload
    // Since we're using bpMCPService, we need to update the document using the service
    console.log(`Updating crystallization document ${crystallization._id} with notionUpdatePayload`);

    // Update the document via BPMCP
    await bpMCPService.updateDocument(crystallization._id, {
      $set: {
        'metadata.notionUpdatePayload': notionUpdatePayload,
        'metadata.status': 'ready_for_notion'
      }
    }, 'pratibimbaDocuments'); // Specify the collection name

    // Update the original document to indicate that a crystallization has been created
    await bpMCPService.updateDocument(documentId, {
      $set: {
        'metadata.crystallizationCreated': true,
        'metadata.crystallizationId': crystallization._id,
        'metadata.crystallizationStatus': 'created',
        'metadata.crystallizationTimestamp': new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Crystallization created from analysis results',
      crystallization: {
        id: crystallization._id,
        title: crystallization.title,
        targetCoordinate: crystallization.targetCoordinate || crystallization.metadata?.targetCoordinate,
        status: crystallization.metadata?.status,
        createdAt: crystallization.createdAt || new Date(),
        relatedCoordinates: crystallization.metadata?.relatedCoordinates || []
      }
    });
  } catch (error) {
    console.error('Error creating crystallization from analysis:', error);
    console.error('Error details:', error.stack);

    // Log the notionUpdatePayload for debugging (document variable might not be in scope in the catch block)
    try {
      if (typeof notionUpdatePayload !== 'undefined') {
        console.error('notionUpdatePayload structure:', Object.keys(notionUpdatePayload).join(', '));
      } else {
        console.error('notionUpdatePayload is undefined');
      }
    } catch (logError) {
      console.error('Error logging notionUpdatePayload:', logError.message);
    }

    // Send a simplified error response
    res.status(500).json({
      success: false,
      error: `Failed to create crystallization: ${error.message}`
      // Don't include documentId as it might not be in scope in the catch block
    });
  }
};

/**
 * Update document status after crystallization
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const updateDocumentStatus = async (req, res) => {
  try {
    const { documentId, status, crystallizationTimestamp } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Update the document status
    await bpMCPService.updateDocument(documentId, {
      $set: {
        'metadata.crystallizationCreated': true,
        'metadata.crystallizationStatus': status || 'created',
        'metadata.crystallizationTimestamp': crystallizationTimestamp || new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: `Document status updated to ${status || 'created'}`
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get the Notion update payload for a document directly from cache
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNotionUpdatePayload = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required'
      });
    }

    console.log(`Getting notionUpdatePayload from document cache for document ${documentId}`);

    // Import the document cache utility
    const { getAnalysisResultsFromCache } = await import('../../../databases/shared/utils/documentCache.utils.mjs');

    // Get analysis results from cache
    let cachedResults = await getAnalysisResultsFromCache(documentId);

    // If not found in document cache, try to migrate from old cache
    if (!cachedResults) {
      console.log(`No analysis results found in document cache, checking old cache...`);
      try {
        const { migrateAnalysisResults } = await import('../1_utils/cacheTransition.utils.mjs');
        const migrated = await migrateAnalysisResults(documentId);

        if (migrated) {
          console.log(`Successfully migrated analysis results from old cache, retrieving from document cache...`);
          cachedResults = await getAnalysisResultsFromCache(documentId);
        }
      } catch (migrationError) {
        console.warn(`Error migrating from old cache: ${migrationError.message}`);
      }
    }

    if (!cachedResults) {
      return res.status(404).json({
        success: false,
        error: 'No analysis results found in cache for this document'
      });
    }

    // Extract notionUpdatePayload from cached results
    let notionUpdatePayload = null;

    // Check for notionUpdatePayload at the top level (preferred location)
    if (cachedResults.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.notionUpdatePayload;
    }
    // Check for notionUpdatePayload in fullAnalysisResults
    else if (cachedResults.fullAnalysisResults && cachedResults.fullAnalysisResults.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.fullAnalysisResults.notionUpdatePayload;
    }
    // Check for notionUpdatePayload in results (legacy structure)
    else if (cachedResults.results && cachedResults.results.notionUpdatePayload) {
      notionUpdatePayload = cachedResults.results.notionUpdatePayload;
    }

    if (!notionUpdatePayload) {
      return res.status(404).json({
        success: false,
        error: 'No Notion update payload found in cache for this document'
      });
    }

    return res.status(200).json({
      success: true,
      notionUpdatePayload
    });
  } catch (error) {
    console.error('Error getting Notion update payload:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to get Notion update payload: ${error.message}`
    });
  }
};

export default {
  startDocumentAnalysis,
  getAnalysisSessionStatus,
  getLatestAnalysisResults,
  createCrystallizationFromAnalysis,
  updateDocumentStatus,
  getNotionUpdatePayload
};
