/**
 * Routes for calling BPMCP tools
 * Bimba Coordinate: #5-3-4.5-1
 */

import express from 'express';
import bpmcpService from '../services/bpMCPService.mjs';

const router = express.Router();

/**
 * @route POST /api/bpmcp/call-tool
 * @desc Call a BPMCP tool
 * @access Public
 */
router.post('/call-tool', async (req, res) => {
  try {
    const { toolName, args } = req.body;

    if (!toolName) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    console.log(`Calling BPMCP tool '${toolName}' with args:`, args);

    // Add special handling for listDocuments tool to support pagination and timeouts
    if (toolName === 'listDocuments') {
      // Set a shorter timeout for this specific tool to avoid long-running requests
      const timeoutMs = 30000; // 30 seconds

      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      });

      // Create the actual request promise
      const requestPromise = bpmcpService.callTool(toolName, args);

      try {
        // Race the two promises
        const result = await Promise.race([requestPromise, timeoutPromise]);

        // If we got here, the request completed before the timeout
        return res.status(200).json(result);
      } catch (error) {
        if (error.message === 'Request timed out') {
          console.error(`Timeout exceeded for listDocuments tool`);
          // Return an empty array instead of an error for timeouts
          return res.status(200).json([]);
        }
        throw error;
      }
    } else {
      // For all other tools, use the normal flow
      const result = await bpmcpService.callTool(toolName, args);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(`Error calling BPMCP tool:`, error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/bpmcp/list-tools
 * @desc List available BPMCP tools
 * @access Public
 */
router.get('/list-tools', async (req, res) => {
  try {
    const result = await bpmcpService.callTool('listTools', {});
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error listing BPMCP tools:`, error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
