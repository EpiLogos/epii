/**
 * Conversations Controller
 * Handles CRUD operations for agent conversations using MongoDB
 */

import Conversation from '../../shared/models/Conversation.model.mjs';

/**
 * Create or update a conversation
 */
const saveConversation = async (req, res) => {
  try {
    const { conversationId, userId, messages, currentState } = req.body;

    if (!conversationId || !userId) {
      return res.status(400).json({ 
        error: 'conversationId and userId are required' 
      });
    }

    // Try to find existing conversation
    let conversation = await Conversation.findOne({ conversationId, userId });

    if (conversation) {
      // Update existing conversation
      conversation.messages = messages || conversation.messages;
      conversation.currentState = currentState || conversation.currentState;
      conversation.updatedAt = new Date();
      
      await conversation.save();
      console.log(`Updated conversation ${conversationId} for user ${userId}`);
    } else {
      // Create new conversation
      conversation = new Conversation({
        conversationId,
        userId,
        messages: messages || [],
        currentState: currentState || {},
      });
      
      await conversation.save();
      console.log(`Created new conversation ${conversationId} for user ${userId}`);
    }

    res.json({
      success: true,
      conversationId: conversation.conversationId,
      messageCount: conversation.messages.length
    });

  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({ 
      error: 'Failed to save conversation',
      details: error.message 
    });
  }
};

/**
 * Get a specific conversation by ID
 */
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const conversation = await Conversation.findOne({ 
      conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    res.json(conversation);

  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ 
      error: 'Failed to get conversation',
      details: error.message 
    });
  }
};

/**
 * Get all conversations for a user
 */
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 }) // Most recent first
      .limit(limit)
      .skip(offset)
      .select('conversationId userId messages currentState createdAt updatedAt');

    const total = await Conversation.countDocuments({ userId });

    res.json({
      conversations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({ 
      error: 'Failed to get conversations',
      details: error.message 
    });
  }
};

/**
 * Delete a conversation
 */
const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await Conversation.deleteOne({ 
      conversationId, 
      userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    console.log(`Deleted conversation ${conversationId} for user ${userId}`);
    res.json({ success: true });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ 
      error: 'Failed to delete conversation',
      details: error.message 
    });
  }
};

/**
 * Add a message to an existing conversation
 */
const addMessageToConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        error: 'userId and message are required' 
      });
    }

    const conversation = await Conversation.findOne({ 
      conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    // Add timestamp if not provided
    if (!message.timestamp) {
      message.timestamp = new Date();
    }

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    
    await conversation.save();

    console.log(`Added message to conversation ${conversationId} for user ${userId}`);
    res.json({
      success: true,
      messageCount: conversation.messages.length
    });

  } catch (error) {
    console.error('Error adding message to conversation:', error);
    res.status(500).json({ 
      error: 'Failed to add message',
      details: error.message 
    });
  }
};

/**
 * Get conversation statistics for a user
 */
const getConversationStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const stats = await Conversation.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalConversations: { $sum: 1 },
          totalMessages: { $sum: { $size: '$messages' } },
          avgMessagesPerConversation: { $avg: { $size: '$messages' } },
          oldestConversation: { $min: '$createdAt' },
          newestConversation: { $max: '$updatedAt' }
        }
      }
    ]);

    const result = stats[0] || {
      totalConversations: 0,
      totalMessages: 0,
      avgMessagesPerConversation: 0,
      oldestConversation: null,
      newestConversation: null
    };

    res.json(result);

  } catch (error) {
    console.error('Error getting conversation stats:', error);
    res.status(500).json({ 
      error: 'Failed to get stats',
      details: error.message 
    });
  }
};

export default {
  saveConversation,
  getConversation,
  getUserConversations,
  deleteConversation,
  addMessageToConversation,
  getConversationStats
};