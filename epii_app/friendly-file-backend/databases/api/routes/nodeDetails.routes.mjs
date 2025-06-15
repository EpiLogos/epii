import express from 'express';
import { getNodeDetails } from '../controllers/nodeDetails.controller.mjs';

const router = express.Router();

// Define the route for fetching node details by Bimba coordinate
// GET /api/node-details/:bimbaCoordinate
router.get('/:bimbaCoordinate', getNodeDetails);

export default router;
