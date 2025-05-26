import express from 'express';
import { 
    getFoundationalGraph,
    handleSuggestRelationshipType, // Import new handler
    handleCreateNode // Import new handler
} from '../controllers/graph.controller.mjs';

const router = express.Router();

// Route to get foundational graph data for visualization
router.get('/foundational', getFoundationalGraph); // Existing route registration

// Route to suggest relationship type
router.get('/suggest-relationship/:parentCoordinate', handleSuggestRelationshipType);

// Route to create a new node
router.post('/node', handleCreateNode);

// Add other graph-related routes here if needed

export default router;
