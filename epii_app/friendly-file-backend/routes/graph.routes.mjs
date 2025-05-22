import express from 'express';
import { getFoundationalGraph } from '../controllers/graph.controller.mjs';

const router = express.Router();

// Route to get foundational graph data for visualization
router.get('/foundational', (req, res) => {
  getFoundationalGraph(req, res);
});

// Add other graph-related routes here if needed

export default router;
