import express from 'express';
import { getNotionContentByCoordinate, executeNotionUpdateProposal } from '../controllers/notion.controller.mjs';

const router = express.Router();

// Route to get Notion page properties based on Bimba coordinate
// GET /api/notion-content/:coordinate
router.get('/notion-content/:coordinate', getNotionContentByCoordinate);

// Route to execute a Notion update proposal
// POST /api/notion-update
router.post('/notion-update', executeNotionUpdateProposal);

export default router;
