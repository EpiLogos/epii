/**
 * User Routes
 *
 * Defines API endpoints for user-related operations:
 * - User creation (signup)
 * - User authentication (signin)
 * - User profile retrieval and update
 * - User preferences management
 * - User identity management
 */

import express from 'express';
import userController from '../controllers/user.controller.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Auth routes (no protection)
router.post('/signup', userController.createUser);
router.post('/signin', userController.authenticateUser);

// User profile routes (protected)
router.get('/:userId', authMiddleware, userController.getUserProfile);
router.put('/:userId', authMiddleware, userController.updateUserProfile);

// User preferences routes (protected)
router.put('/:userId/preferences', authMiddleware, userController.updateUserPreferences);

// User identity routes (protected)
router.put('/:userId/identity', authMiddleware, userController.updateUserIdentity);

// Bio synthesis route (protected)
router.post('/:userId/synthesize-bio', authMiddleware, userController.synthesizeUserBio);

export default router;
