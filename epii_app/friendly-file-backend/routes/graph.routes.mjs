import express from 'express';
import { getFoundationalGraph, createNode, getRelationshipSuggestions } from '../controllers/graph.controller.mjs';

const router = express.Router();

// Route to get foundational graph data for visualization
router.get('/foundational', (req, res) => {
  getFoundationalGraph(req, res);
});

// Route for creating a new node
router.post('/create-node', createNode);

// Route for getting relationship suggestions
router.get('/relationship-suggestions', getRelationshipSuggestions);


// Add other graph-related routes here if needed

export default router;
