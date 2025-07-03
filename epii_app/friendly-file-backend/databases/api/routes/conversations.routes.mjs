/**
 * Conversations Routes
 * RESTful API routes for agent conversation management
 */

import express from 'express';
import conversationsController from '../controllers/conversations.controller.mjs';

const router = express.Router();

// GET /api/conversations - Get all conversations for a user
router.get('/', conversationsController.getUserConversations);

// GET /api/conversations/stats - Get conversation statistics for a user
router.get('/stats', conversationsController.getConversationStats);

// GET /api/conversations/:conversationId - Get specific conversation
router.get('/:conversationId', conversationsController.getConversation);

// POST /api/conversations - Create or update a conversation
router.post('/', conversationsController.saveConversation);

// POST /api/conversations/:conversationId/messages - Add message to conversation
router.post('/:conversationId/messages', conversationsController.addMessageToConversation);

// DELETE /api/conversations/:conversationId - Delete a conversation
router.delete('/:conversationId', conversationsController.deleteConversation);

export default router;