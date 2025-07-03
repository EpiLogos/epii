/**
 * Chat Session Management Service
 * 
 * Provides comprehensive session management with MongoDB persistence,
 * context-aware routing, compression, and archival capabilities.
 * 
 * Bimba Coordinate: #5-3-4 (Epii Backend Session Management)
 */

import { ObjectId } from 'mongodb';

export class ChatSessionService {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    this.db = mongoClient.db('epi_logos_sessions');
    this.sessionsCollection = this.db.collection('chat_sessions');
    this.messagesCollection = this.db.collection('chat_messages');
    
    // Ensure indexes for performance
    this._ensureIndexes();
  }

  /**
   * Create indexes for optimal query performance
   * @private
   */
  async _ensureIndexes() {
    try {
      // Session indexes
      await this.sessionsCollection.createIndex({ userId: 1, timestamp: -1 });
      await this.sessionsCollection.createIndex({ sessionType: 1 });
      await this.sessionsCollection.createIndex({ contextId: 1 });
      await this.sessionsCollection.createIndex({ isActive: 1 });
      await this.sessionsCollection.createIndex({ lastActivity: -1 });
      
      // Message indexes
      await this.messagesCollection.createIndex({ sessionId: 1, timestamp: 1 });
      await this.messagesCollection.createIndex({ userId: 1, timestamp: -1 });
      await this.messagesCollection.createIndex({ messageType: 1 });

      console.log('[ChatSessionService] Database indexes ensured');
    } catch (error) {
      console.error('[ChatSessionService] Failed to create indexes:', error);
    }
  }

  /**
   * Create a new chat session
   * @param {string} userId - User identifier
   * @param {string} sessionType - Type of session ('general', 'document', 'analysis', 'coordinate')
   * @param {string} [contextId] - Associated context (documentId, coordinate, etc.)
   * @param {Object} [metadata] - Additional session metadata
   * @returns {Promise<Object>} Created session object
   */
  async createNewSession(userId, sessionType = 'general', contextId = null, metadata = {}) {
    const sessionId = new ObjectId().toString();
    const now = new Date();

    const session = {
      _id: sessionId,
      userId,
      sessionType,
      contextId,
      title: this._generateSessionTitle(sessionType, contextId, metadata),
      timestamp: now,
      lastActivity: now,
      messageCount: 0,
      isActive: true,
      isCompressed: false,
      compressionSummary: null,
      expertSkillId: this._determineExpertSkill(sessionType, contextId, metadata),
      metadata: {
        ...metadata,
        createdAt: now,
        version: '1.0'
      }
    };

    try {
      await this.sessionsCollection.insertOne(session);
      console.log(`[ChatSessionService] Created new ${sessionType} session: ${sessionId}`);
      return session;
    } catch (error) {
      console.error('[ChatSessionService] Failed to create session:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * Get session by ID with optional message loading
   * @param {string} sessionId - Session identifier
   * @param {boolean} [includeMessages=false] - Whether to include messages
   * @param {number} [messageLimit=50] - Maximum messages to load
   * @returns {Promise<Object|null>} Session object or null if not found
   */
  async getSession(sessionId, includeMessages = false, messageLimit = 50) {
    try {
      const session = await this.sessionsCollection.findOne({ _id: sessionId });
      
      if (!session) {
        return null;
      }

      if (includeMessages) {
        const messages = await this.messagesCollection
          .find({ sessionId })
          .sort({ timestamp: -1 })
          .limit(messageLimit)
          .toArray();
        
        session.messages = messages.reverse(); // Chronological order
      }

      return session;
    } catch (error) {
      console.error('[ChatSessionService] Failed to get session:', error);
      return null;
    }
  }

  /**
   * Get session history for a user
   * @param {string} userId - User identifier
   * @param {number} [limit=20] - Maximum sessions to return
   * @param {string} [sessionType] - Filter by session type
   * @returns {Promise<Array>} Array of session objects
   */
  async getSessionHistory(userId, limit = 20, sessionType = null) {
    try {
      const query = { userId, isActive: true };
      if (sessionType) {
        query.sessionType = sessionType;
      }

      const sessions = await this.sessionsCollection
        .find(query)
        .sort({ lastActivity: -1 })
        .limit(limit)
        .toArray();

      // Add message count and last message preview
      for (const session of sessions) {
        const messageCount = await this.messagesCollection.countDocuments({ sessionId: session._id });
        const lastMessage = await this.messagesCollection
          .findOne({ sessionId: session._id }, { sort: { timestamp: -1 } });

        session.messageCount = messageCount;
        session.lastMessagePreview = lastMessage ? 
          lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '') : 
          null;
      }

      return sessions;
    } catch (error) {
      console.error('[ChatSessionService] Failed to get session history:', error);
      return [];
    }
  }

  /**
   * Add a message to a session
   * @param {string} sessionId - Session identifier
   * @param {Object} message - Message object
   * @returns {Promise<Object>} Created message object
   */
  async addMessage(sessionId, message) {
    const messageId = new ObjectId().toString();
    const now = new Date();

    const messageDoc = {
      _id: messageId,
      sessionId,
      userId: message.userId || message.context?.userId,
      messageType: message.type || 'user',
      content: message.content,
      role: message.role || (message.type === 'user' ? 'user' : 'assistant'),
      timestamp: now,
      context: message.context || {},
      metadata: {
        ...message.metadata,
        createdAt: now
      }
    };

    try {
      await this.messagesCollection.insertOne(messageDoc);
      
      // Update session last activity and message count
      await this.sessionsCollection.updateOne(
        { _id: sessionId },
        { 
          $set: { lastActivity: now },
          $inc: { messageCount: 1 }
        }
      );

      console.log(`[ChatSessionService] Added message to session ${sessionId}`);
      return messageDoc;
    } catch (error) {
      console.error('[ChatSessionService] Failed to add message:', error);
      throw new Error(`Failed to add message: ${error.message}`);
    }
  }

  /**
   * Clear all messages from a session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<boolean>} Success status
   */
  async clearSessionMessages(sessionId) {
    try {
      const result = await this.messagesCollection.deleteMany({ sessionId });
      
      await this.sessionsCollection.updateOne(
        { _id: sessionId },
        { 
          $set: { 
            messageCount: 0, 
            lastActivity: new Date(),
            isCompressed: false,
            compressionSummary: null
          }
        }
      );

      console.log(`[ChatSessionService] Cleared ${result.deletedCount} messages from session ${sessionId}`);
      return true;
    } catch (error) {
      console.error('[ChatSessionService] Failed to clear session messages:', error);
      return false;
    }
  }

  /**
   * Compress session context by summarizing old messages
   * @param {string} sessionId - Session identifier
   * @param {number} [keepRecentCount=10] - Number of recent messages to keep uncompressed
   * @returns {Promise<Object>} Compression result
   */
  async compressSessionContext(sessionId, keepRecentCount = 10) {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Get messages to compress (all except the most recent)
      const allMessages = await this.messagesCollection
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .toArray();

      if (allMessages.length <= keepRecentCount) {
        return { compressed: false, reason: 'Insufficient messages for compression' };
      }

      const messagesToCompress = allMessages.slice(0, -keepRecentCount);
      const messagesToKeep = allMessages.slice(-keepRecentCount);

      // Create compression summary
      const compressionSummary = await this._createCompressionSummary(
        messagesToCompress, 
        session.expertSkillId,
        session.sessionType
      );

      // Delete compressed messages
      const messageIdsToDelete = messagesToCompress.map(msg => msg._id);
      await this.messagesCollection.deleteMany({ 
        _id: { $in: messageIdsToDelete } 
      });

      // Update session with compression info
      await this.sessionsCollection.updateOne(
        { _id: sessionId },
        {
          $set: {
            isCompressed: true,
            compressionSummary,
            messageCount: messagesToKeep.length,
            lastActivity: new Date(),
            'metadata.compressedAt': new Date(),
            'metadata.originalMessageCount': allMessages.length,
            'metadata.compressedMessageCount': messagesToCompress.length
          }
        }
      );

      console.log(`[ChatSessionService] Compressed ${messagesToCompress.length} messages in session ${sessionId}`);
      return {
        compressed: true,
        originalCount: allMessages.length,
        compressedCount: messagesToCompress.length,
        remainingCount: messagesToKeep.length,
        summary: compressionSummary
      };
    } catch (error) {
      console.error('[ChatSessionService] Failed to compress session:', error);
      throw new Error(`Compression failed: ${error.message}`);
    }
  }

  /**
   * Archive a session (mark as inactive)
   * @param {string} sessionId - Session identifier
   * @returns {Promise<boolean>} Success status
   */
  async archiveSession(sessionId) {
    try {
      const result = await this.sessionsCollection.updateOne(
        { _id: sessionId },
        {
          $set: {
            isActive: false,
            'metadata.archivedAt': new Date()
          }
        }
      );

      console.log(`[ChatSessionService] Archived session ${sessionId}`);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('[ChatSessionService] Failed to archive session:', error);
      return false;
    }
  }

  /**
   * Search sessions by content or metadata
   * @param {string} userId - User identifier
   * @param {string} query - Search query
   * @param {Object} [filters] - Additional filters
   * @returns {Promise<Array>} Array of matching sessions
   */
  async searchSessions(userId, query, filters = {}) {
    try {
      // Build search pipeline
      const pipeline = [
        { $match: { userId, isActive: true, ...filters } }
      ];

      // Add text search if query provided
      if (query) {
        pipeline.unshift({
          $match: {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { 'metadata.tags': { $regex: query, $options: 'i' } },
              { contextId: { $regex: query, $options: 'i' } }
            ]
          }
        });
      }

      // Add lookup for message content search
      pipeline.push(
        {
          $lookup: {
            from: 'chat_messages',
            localField: '_id',
            foreignField: 'sessionId',
            as: 'messages'
          }
        },
        {
          $addFields: {
            hasMatchingMessage: {
              $anyElementTrue: {
                $map: {
                  input: '$messages',
                  as: 'msg',
                  in: { $regexMatch: { input: '$$msg.content', regex: query, options: 'i' } }
                }
              }
            }
          }
        },
        {
          $match: {
            $or: [
              { hasMatchingMessage: true },
              { messages: { $size: 0 } } // Include sessions without messages if title/metadata matched
            ]
          }
        },
        {
          $project: {
            messages: 0, // Remove messages from output
            hasMatchingMessage: 0
          }
        },
        { $sort: { lastActivity: -1 } },
        { $limit: 50 }
      );

      const results = await this.sessionsCollection.aggregate(pipeline).toArray();
      return results;
    } catch (error) {
      console.error('[ChatSessionService] Failed to search sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions that need archival (inactive for 30+ days)
   * @returns {Promise<Array>} Array of sessions to archive
   */
  async getSessionsForArchival() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      return await this.sessionsCollection
        .find({
          isActive: true,
          lastActivity: { $lt: thirtyDaysAgo }
        })
        .sort({ lastActivity: 1 })
        .toArray();
    } catch (error) {
      console.error('[ChatSessionService] Failed to get sessions for archival:', error);
      return [];
    }
  }

  /**
   * Update session metadata
   * @param {string} sessionId - Session identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<boolean>} Success status
   */
  async updateSession(sessionId, updates) {
    try {
      const result = await this.sessionsCollection.updateOne(
        { _id: sessionId },
        { 
          $set: {
            ...updates,
            lastActivity: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('[ChatSessionService] Failed to update session:', error);
      return false;
    }
  }

  /**
   * Generate session title based on type and context
   * @private
   */
  _generateSessionTitle(sessionType, contextId, metadata) {
    switch (sessionType) {
      case 'document':
        return `Document: ${metadata.documentName || contextId || 'Unknown'}`;
      case 'coordinate':
        return `Coordinate: ${contextId || 'Unknown'}`;
      case 'analysis':
        return `Analysis: ${metadata.analysisType || 'Document Analysis'}`;
      default:
        const date = new Date();
        return `Session ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
    }
  }

  /**
   * Determine appropriate expert skill for session
   * @private
   */
  _determineExpertSkill(sessionType, contextId, metadata) {
    // Map session types to expert skills
    if (metadata.expertSkillId) {
      return metadata.expertSkillId;
    }

    switch (sessionType) {
      case 'document':
      case 'analysis':
        return 'epii-chat'; // Document analysis is Epii's domain
      case 'coordinate':
        // Determine by coordinate prefix
        if (contextId?.startsWith('#5')) return 'epii-chat';
        if (contextId?.startsWith('#4')) return 'nara-chat';
        if (contextId?.startsWith('#1')) return 'paramasiva-chat';
        if (contextId?.startsWith('#0')) return 'anuttara-chat';
        return 'universal-chat';
      default:
        return 'universal-chat';
    }
  }

  /**
   * Create compression summary using expert-specific prompts
   * @private
   */
  async _createCompressionSummary(messages, expertSkillId, sessionType) {
    // This would integrate with the LLM service to create intelligent summaries
    // For now, return a structured summary
    
    const summary = {
      messageCount: messages.length,
      timespan: {
        start: messages[0]?.timestamp,
        end: messages[messages.length - 1]?.timestamp
      },
      participants: [...new Set(messages.map(m => m.role))],
      keyTopics: this._extractKeyTopics(messages),
      expertContext: expertSkillId,
      sessionType,
      compressionType: 'automatic',
      compressedAt: new Date()
    };

    // Add expert-specific summary based on skill
    switch (expertSkillId) {
      case 'epii-chat':
        summary.epiiInsights = this._extractEpiiInsights(messages);
        break;
      case 'nara-chat':
        summary.personalContext = this._extractPersonalContext(messages);
        break;
      default:
        summary.generalSummary = this._createGeneralSummary(messages);
    }

    return summary;
  }

  /**
   * Extract key topics from messages
   * @private
   */
  _extractKeyTopics(messages) {
    // Simple keyword extraction - could be enhanced with NLP
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const keywords = text.match(/\b\w{4,}\b/g) || [];
    const frequency = {};
    
    keywords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .filter(([word, count]) => count > 2)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Extract Epii-specific insights
   * @private
   */
  _extractEpiiInsights(messages) {
    return {
      coordinatesDiscussed: this._extractCoordinates(messages),
      documentsAnalyzed: this._extractDocumentReferences(messages),
      analysisDepth: messages.length > 20 ? 'deep' : 'surface'
    };
  }

  /**
   * Extract coordinate references from messages
   * @private
   */
  _extractCoordinates(messages) {
    const text = messages.map(m => m.content).join(' ');
    const coordinates = text.match(/#\d+(?:-\d+)*(?:-\d+)*(?:-\d+)*/g) || [];
    return [...new Set(coordinates)];
  }

  /**
   * Extract document references from messages
   * @private
   */
  _extractDocumentReferences(messages) {
    return messages
      .filter(m => m.context?.documentId)
      .map(m => ({
        documentId: m.context.documentId,
        documentName: m.context.documentName
      }))
      .filter((doc, index, arr) => 
        arr.findIndex(d => d.documentId === doc.documentId) === index
      );
  }

  /**
   * Extract personal context for Nara sessions
   * @private
   */
  _extractPersonalContext(messages) {
    return {
      identityAspects: this._extractIdentityReferences(messages),
      personalQueries: messages.filter(m => 
        m.content.toLowerCase().includes('i ') || 
        m.content.toLowerCase().includes('my ')
      ).length
    };
  }

  /**
   * Extract identity references
   * @private
   */
  _extractIdentityReferences(messages) {
    // Look for astrological, personal, or identity-related terms
    const identityTerms = [
      'astrology', 'birth', 'chart', 'sign', 'identity', 
      'personal', 'me', 'myself', 'who am i'
    ];
    
    return identityTerms.filter(term => 
      messages.some(m => m.content.toLowerCase().includes(term))
    );
  }

  /**
   * Create general summary for universal sessions
   * @private
   */
  _createGeneralSummary(messages) {
    if (messages.length === 0) return 'Empty session';
    
    const topics = this._extractKeyTopics(messages);
    const questionCount = messages.filter(m => m.content.includes('?')).length;
    
    return {
      conversationFlow: `${messages.length} messages exchanged`,
      primaryTopics: topics.slice(0, 3),
      interactionType: questionCount > messages.length * 0.3 ? 'inquiry-heavy' : 'conversational',
      complexity: messages.some(m => m.content.length > 500) ? 'complex' : 'simple'
    };
  }
}

export default ChatSessionService;