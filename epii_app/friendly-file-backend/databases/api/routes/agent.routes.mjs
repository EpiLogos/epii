/**
 * @fileoverview API routes for agent interactions (Query Processing and KB Update).
 */

import express from 'express';
import { processQuery, updateKnowledgeBase } from '../controllers/agent.controller.mjs';

// TODO: Add authentication/authorization middleware if needed, especially for /kb-update

const router = express.Router();

// Route for Mode 2: Query Processing
// POST /api/agent/query
// Body: { query: string, userId: string, history?: any[] }
router.post('/query', processQuery);

// Route for Mode 1: Knowledge Base Update (Admin Only)
// POST /api/agent/kb-update
// Body: { text: string, userId: string }
// TODO: Apply admin-only middleware here
router.post('/kb-update', updateKnowledgeBase);


export default router;