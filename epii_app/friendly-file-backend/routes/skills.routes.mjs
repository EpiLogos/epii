/**
 * Skills API Routes
 * Provides REST endpoints for A2A skills execution and management
 * 
 * Epic: 002 - A2A Skill Management Framework
 * Routes for skill discovery, execution, and orchestration
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// Import A2A Skills Service (will be dynamically imported)
let a2aSkillsService;

// Dynamic import for ES modules compatibility
async function getA2ASkillsService() {
  if (!a2aSkillsService) {
    // Import the CommonJS module
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    a2aSkillsService = require('../../friendly-file-back2front/services/a2aSkillsService.js');
  }
  return a2aSkillsService;
}

/**
 * GET /api/skills
 * Get all available skills or search skills
 */
router.get('/', 
  [
    query('query').optional().isString().withMessage('Query must be a string'),
    query('bimbaCoordinate').optional().isString().withMessage('Bimba coordinate must be a string'),
    query('agentId').optional().isString().withMessage('Agent ID must be a string'),
    query('qlPosition').optional().isInt({ min: 0, max: 5 }).withMessage('QL position must be 0-5')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { query, bimbaCoordinate, agentId, qlPosition } = req.query;

      let skills;
      if (query || bimbaCoordinate || agentId || qlPosition !== undefined) {
        // Search skills with criteria
        skills = skillsService.findSkills({
          textQuery: query,
          bimbaCoordinate,
          agentId,
          qlPosition: qlPosition !== undefined ? parseInt(qlPosition) : undefined
        });
      } else {
        // Get all skills
        skills = skillsService.getAllSkills();
      }

      res.json({
        success: true,
        data: skills,
        count: skills.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Skills API] Error getting skills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve skills',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/skills/:skillId
 * Get specific skill by ID
 */
router.get('/:skillId',
  [
    param('skillId').isString().notEmpty().withMessage('Skill ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { skillId } = req.params;

      const skill = skillsService.registry.getSkillById(skillId);
      if (!skill) {
        return res.status(404).json({
          success: false,
          error: 'Skill not found',
          skillId
        });
      }

      // Get performance metrics
      const metrics = skillsService.getPerformanceMetrics(skillId);
      const history = skillsService.getExecutionHistory(skillId, 5);

      res.json({
        success: true,
        data: {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          bimbaCoordinate: skill.bimbaCoordinate,
          agentId: skill.agentId,
          version: skill.version,
          qlMetadata: skill.qlMetadata,
          inputSchema: skill.inputSchema,
          outputSchema: skill.outputSchema,
          metrics,
          recentExecutions: history
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Skills API] Error getting skill:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve skill',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/skills/:skillId/execute
 * Execute a specific skill
 */
router.post('/:skillId/execute',
  [
    param('skillId').isString().notEmpty().withMessage('Skill ID is required'),
    body('params').optional().isObject().withMessage('Params must be an object'),
    body('context').optional().isObject().withMessage('Context must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { skillId } = req.params;
      const { params = {}, context = {} } = req.body;

      // Add request context
      const enhancedContext = {
        ...context,
        requestId: req.headers['x-request-id'] || `req_${Date.now()}`,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      };

      const result = await skillsService.executeSkill(skillId, params, enhancedContext);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('[Skills API] Error executing skill:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute skill',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/skills/unified-rag
 * Execute the unified RAG skill - convenience endpoint
 */
router.post('/unified-rag',
  [
    body('query').isString().notEmpty().withMessage('Query is required'),
    body('coordinates').optional().custom((value) => {
      if (typeof value === 'string' || Array.isArray(value)) {
        return true;
      }
      throw new Error('Coordinates must be a string or array of strings');
    }),
    body('sources').optional().isObject().withMessage('Sources must be an object'),
    body('options').optional().isObject().withMessage('Options must be an object'),
    body('agentCoordinate').optional().isString().withMessage('Agent coordinate must be a string'),
    body('uiContext').optional().isObject().withMessage('UI context must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { query, coordinates, sources, options, agentCoordinate, uiContext } = req.body;

      const context = {
        agentCoordinate: agentCoordinate || '#5',
        requestId: req.headers['x-request-id'] || `rag_${Date.now()}`,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      };

      const result = await skillsService.executeUnifiedRAG({
        query,
        coordinates,
        sources,
        options,
        agentCoordinate,
        uiContext
      }, context);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error) {
      console.error('[Skills API] Error executing unified RAG:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute unified RAG',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/skills/coordinate/:coordinate
 * Get skill by Bimba coordinate
 */
router.get('/coordinate/:coordinate',
  [
    param('coordinate').isString().notEmpty().withMessage('Coordinate is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { coordinate } = req.params;

      const skill = skillsService.getSkillByCoordinate(coordinate);
      if (!skill) {
        return res.status(404).json({
          success: false,
          error: 'No skill found for coordinate',
          coordinate
        });
      }

      res.json({
        success: true,
        data: skill,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Skills API] Error getting skill by coordinate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve skill by coordinate',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/skills/agent/:agentId
 * Get skills for a specific agent
 */
router.get('/agent/:agentId',
  [
    param('agentId').isString().notEmpty().withMessage('Agent ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const skillsService = await getA2ASkillsService();
      const { agentId } = req.params;

      const skills = skillsService.getSkillsForAgent(agentId);

      res.json({
        success: true,
        data: skills,
        count: skills.length,
        agentId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Skills API] Error getting skills for agent:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve skills for agent',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/skills/status
 * Get skills service status
 */
router.get('/status', async (req, res) => {
  try {
    const skillsService = await getA2ASkillsService();
    const status = skillsService.getServiceStatus();

    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Skills API] Error getting service status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status',
      message: error.message
    });
  }
});

export default router;
