import express from 'express';
import { runPipeline as runEpiiPipeline } from '../pipelines/epii_analysis_pipeline.mjs';
import epiiAgentService from '../../2_services/epii-agent.service.mjs';
import crystallizationService from '../../2_services/crystallization.service.mjs';

const router = express.Router();

/**
 * @route POST /api/epii-agent/analyze
 * @desc Analyze a document using the Epii agent
 * @access Private
 */
router.post('/analyze', async (req, res) => {
  try {
    const { targetCoordinate, notionPageId, fileId, graphData } = req.body;

    // Validate required parameters
    if (!targetCoordinate) {
      return res.status(400).json({ error: 'Target Bimba coordinate is required' });
    }

    if (!notionPageId && !fileId) {
      return res.status(400).json({ error: 'Either notionPageId or fileId is required' });
    }

    // Run the Epii pipeline with graphData if provided
    const result = await runEpiiPipeline({
      targetCoordinate,
      notionPageId,
      fileId,
      userId: req.user?.id, // Pass user ID if available
      graphData: graphData || { nodes: [], edges: [] } // Pass graphData from frontend
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in Epii agent analyze endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/epii-agent/chat
 * @desc Process a chat message in the context of document analysis
 * @access Private
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, analysisSessionId, documentContent, targetCoordinate, graphData } = req.body;

    // Validate required parameters
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!analysisSessionId) {
      return res.status(400).json({ error: 'Analysis session ID is required' });
    }

    if (!documentContent) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    if (!targetCoordinate) {
      return res.status(400).json({ error: 'Target Bimba coordinate is required' });
    }

    // Get the current chat history
    const chatHistory = req.body.chatHistory || [];

    // Process the chat message with graphData if provided
    const result = await epiiAgentService.processChatMessage(message, {
      documentContent,
      targetCoordinate,
      chatHistory,
      analysisSessionId,
      graphData: graphData || { nodes: [], edges: [] } // Pass graphData from frontend
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in Epii agent chat endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
