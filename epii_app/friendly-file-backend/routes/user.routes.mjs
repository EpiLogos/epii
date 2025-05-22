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

const router = express.Router();

// Auth routes
router.post('/signup', userController.createUser);
router.post('/signin', userController.authenticateUser);

// User profile routes
router.get('/:userId', userController.getUserProfile);
router.put('/:userId', userController.updateUserProfile);

// User preferences routes
router.put('/:userId/preferences', userController.updateUserPreferences);

// User identity routes
router.put('/:userId/identity', userController.updateUserIdentity);

// Bio synthesis route
router.post('/:userId/synthesize-bio', userController.synthesizeUserBio);

export default router;
