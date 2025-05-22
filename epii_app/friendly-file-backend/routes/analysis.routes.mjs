/**
 * Analysis Routes
 *
 * Routes for document analysis:
 * - Starting document analysis
 * - Getting analysis results
 * - Generating Notion update previews
 */

import express from 'express';
import {
  startDocumentAnalysis,
  getAnalysisSessionStatus,
  getLatestAnalysisResults,
  createCrystallizationFromAnalysis,
  updateDocumentStatus,
  getNotionUpdatePayload
} from '../controllers/analysis.controller.mjs';

const router = express.Router();

// Start document analysis
// POST /api/analysis/start
router.post('/start', startDocumentAnalysis);

// Get analysis session status
// GET /api/analysis/session/:sessionId
router.get('/session/:sessionId', getAnalysisSessionStatus);

// Get latest analysis results for a document
// GET /api/analysis/results/:documentId
router.get('/results/:documentId', getLatestAnalysisResults);

// Create a crystallization document from analysis results
// POST /api/analysis/crystallize
router.post('/crystallize', createCrystallizationFromAnalysis);

// Update document status after crystallization
// POST /api/analysis/update-document-status
router.post('/update-document-status', updateDocumentStatus);

// Get Notion update payload directly from cache
// GET /api/analysis/notion-payload/:documentId
router.get('/notion-payload/:documentId', getNotionUpdatePayload);

export default router;
