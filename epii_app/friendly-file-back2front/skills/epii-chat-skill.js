/**
 * Epii Chat Skill
 * Provides the direct conversational interface that was working pre-A2A
 * This is the primary chat LLM functionality, not the analysis pipeline
 *
 * Bimba Coordinate: #5 (Epii agent's primary conversational interface)
 */

class EpiiChatSkill {
  constructor() {
    this.skillId = 'epii-chat';
    this.name = 'Epii Conversational Interface';
    this.description = 'Direct chat interface with the Epii agent using its integral meta-perspective';
    this.bimbaCoordinate = '#5';
    this.version = '1.0.0';
  }

  /**
   * Execute the chat skill - direct conversation with Epii agent
   * @param {Object} params - Chat parameters
   * @param {string} params.message - User message
   * @param {Array} [params.history] - Chat history
   * @param {string} [params.targetCoordinate] - Focus coordinate
   * @param {string} [params.documentId] - Document context
   * @param {string} [params.documentContent] - Document content
   * @param {Object} [params.context] - Additional context
   * @returns {Promise<Object>} - Chat response
   */
  async execute(params, context = {}) {
    const startTime = Date.now();
    const logPrefix = `[EpiiChat]`;

    console.log(`${logPrefix} Processing chat message: "${params.message.substring(0, 50)}..."`);

    try {
      // Get the Epii agent service from context
      const epiiAgentService = context._epiiAgentService || context.epiiAgentService;
      if (!epiiAgentService) {
        throw new Error('Epii agent service not available in context');
      }

      // Prepare the chat context
      const chatContext = {
        userId: context.agentId || 'unknown',
        history: params.history || [],
        targetCoordinate: params.targetCoordinate,
        documentId: params.documentId,
        documentContent: params.documentContent,
        mode: 'chat', // Explicitly set to chat mode, not analysis
        ...params.context
      };

      // Check if this is document-related chat or general conversation
      let response;
      let ragContext = null;

      // Detect coordinates in message content or use explicit targetCoordinate
      const detectedCoordinates = this._extractCoordinatesFromMessage(params.message);
      const allCoordinates = [
        ...(params.targetCoordinate ? [params.targetCoordinate] : []),
        ...detectedCoordinates
      ];

      // If we have coordinates, document context, or this is a coordinate-related query, use UnifiedRAG
      if (allCoordinates.length > 0 || params.documentId || this._isCoordinateRelatedQuery(params.message)) {
        console.log(`${logPrefix} Using UnifiedRAG for enhanced context`);
        console.log(`${logPrefix} Detected coordinates: ${allCoordinates.join(', ')}`);

        try {
          // Get UnifiedRAG skill from context
          const unifiedRAGSkill = context._unifiedRAGSkill || this._getUnifiedRAGSkill(context);

          if (unifiedRAGSkill) {
            // Check if coordinates have associated documents
            const hasDocuments = await this._checkCoordinateDocuments(allCoordinates, params.documentId);

            // Prepare UnifiedRAG parameters
            const ragParams = {
              query: params.message,
              coordinates: allCoordinates,
              agentCoordinate: '#5', // Epii agent coordinate
              sources: {
                bimba: true,
                lightrag: true, // Default enabled - especially important for coordinate-document relationships
                graphiti: true,
                notion: false // Notion is opt-in only
              },
              options: {
                bimba: { contextDepth: 2, limit: 8 },
                lightrag: { limit: 5, threshold: 0.7 },
                graphiti: { limit: 8 },
                notion: { maxPages: 3 }
              },
              uiContext: {
                documentId: params.documentId,
                userId: context.userId || context.agentId
              }
            };

            // Execute UnifiedRAG
            const ragResult = await unifiedRAGSkill.executeForChat(ragParams);

            if (ragResult.success) {
              ragContext = ragResult.data;
              console.log(`${logPrefix} UnifiedRAG context retrieved:`, {
                sources: ragContext.sourcesQueried,
                coordinates: ragContext.coordinatesCovered,
                executionTime: ragContext.executionTime
              });
            } else {
              console.warn(`${logPrefix} UnifiedRAG failed:`, ragResult.error);
            }
          }
        } catch (error) {
          console.warn(`${logPrefix} UnifiedRAG error:`, error);
        }
      }

      // Determine chat mode and context
      let chatMode = 'chat'; // Default to direct chat mode
      let enhancedContext = {
        targetCoordinate: allCoordinates[0] || params.targetCoordinate,
        chatHistory: params.history || [],
        ragContext: ragContext // Pass the RAG context to Epii agent
      };

      // Only use document-chat mode if we have actual document content (not just documentId)
      if (params.documentContent) {
        console.log(`${logPrefix} Document-related chat with content`);
        chatMode = 'document-chat';
        enhancedContext.documentContent = params.documentContent;
        enhancedContext.analysisSessionId = params.documentId;
        enhancedContext.mode = 'document-chat';
      } else if (ragContext) {
        console.log(`${logPrefix} Coordinate-based chat with RAG enhancement`);
        // Keep default chat mode but with RAG context
      } else {
        console.log(`${logPrefix} General conversation`);
      }

      // Always use processChatMessage for consistency
      response = await epiiAgentService.processChatMessage(params.message, enhancedContext);
      console.log(`${logPrefix} Raw response from Epii agent:`, JSON.stringify(response, null, 2));

      // Normalize the response format
      const normalizedResponse = this._normalizeResponse(response);
      console.log(`${logPrefix} Normalized response:`, JSON.stringify(normalizedResponse, null, 2));

      const executionTime = Date.now() - startTime;
      console.log(`${logPrefix} Chat completed in ${executionTime}ms`);

      return {
        success: true,
        data: {
          message: normalizedResponse.message,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          context: {
            targetCoordinate: normalizedResponse.targetCoordinate || params.targetCoordinate,
            documentId: params.documentId,
            bimbaCoordinates: normalizedResponse.bimbaCoordinates || []
          },
          metadata: {
            executionTime,
            mode: 'chat',
            skillId: this.skillId
          }
        },
        skillId: this.skillId,
        executionTime
      };

    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        success: false,
        error: error.message,
        skillId: this.skillId,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Extract coordinate patterns from message content
   * @private
   */
  _extractCoordinatesFromMessage(message) {
    const coordinatePattern = /#\d+(?:-\d+)*(?:-\d+)*(?:-\d+)*/g;
    const matches = message.match(coordinatePattern) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  /**
   * Check if the message is coordinate-related (mentions QL, Bimba, etc.)
   * @private
   */
  _isCoordinateRelatedQuery(message) {
    const coordinateKeywords = [
      'quaternal logic', 'quaternary logic', 'ql',
      'bimba', 'coordinate', 'branch',
      'paramasiva', 'parashakti', 'mahamaya', 'nara', 'epii',
      '#0', '#1', '#2', '#3', '#4', '#5'
    ];

    const lowerMessage = message.toLowerCase();
    return coordinateKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check if coordinates have associated documents
   * @private
   */
  async _checkCoordinateDocuments(coordinates, documentId) {
    try {
      // If we have a documentId, there are definitely documents
      if (documentId) {
        console.log(`[EpiiChat] Document context available: ${documentId}`);
        return true;
      }

      // For coordinates, we could check if documents exist
      // This is a placeholder for future document-coordinate relationship checking
      if (coordinates.length > 0) {
        console.log(`[EpiiChat] Checking documents for coordinates: ${coordinates.join(', ')}`);
        // TODO: Implement actual document checking logic if needed
        // For now, assume coordinates may have documents (LightRAG will handle gracefully)
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[EpiiChat] Error checking coordinate documents:', error);
      return false;
    }
  }

  /**
   * Get UnifiedRAG skill instance
   * @private
   */
  _getUnifiedRAGSkill(context) {
    try {
      // Try to get from skills registry
      if (context._skillsRegistry) {
        return context._skillsRegistry.getSkillById('unifiedRAG');
      }

      // Fallback: create new instance
      const UnifiedRAGSkill = require('./unifiedRAG');
      return new UnifiedRAGSkill();
    } catch (error) {
      console.warn('[EpiiChat] Could not get UnifiedRAG skill:', error);
      return null;
    }
  }

  /**
   * Create a fallback chat response when no direct chat method is available
   * @private
   */
  async _createFallbackChatResponse(message, context, epiiAgentService) {
    console.log('[EpiiChat] Creating fallback chat response');

    // Try to use the LLM service directly if available
    if (epiiAgentService.llmService) {
      const prompt = this._createChatPrompt(message, context);
      const llmResponse = await epiiAgentService.llmService.generateResponse(prompt);

      return {
        message: llmResponse.content || llmResponse,
        targetCoordinate: context.targetCoordinate
      };
    }

    // Ultimate fallback
    return {
      message: `I understand you're asking about: "${message}". I'm currently operating in a limited mode. For full functionality, please ensure the Epii agent service is properly configured with chat capabilities.`,
      targetCoordinate: context.targetCoordinate
    };
  }

  /**
   * Create a chat prompt for the LLM
   * @private
   */
  _createChatPrompt(message, context) {
    let prompt = `You are the Epii agent, operating from your Integral Meta-Perspective (#5-1-5). `;

    if (context.targetCoordinate) {
      prompt += `The current focus is on coordinate ${context.targetCoordinate}. `;
    }

    if (context.history && context.history.length > 0) {
      prompt += `\n\nRecent conversation:\n`;
      context.history.slice(-3).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    prompt += `\n\nUser: ${message}\n\nRespond from your integrated understanding, drawing on the Bimba coordinate system and Quaternary Logic principles. Be conversational and helpful while maintaining your philosophical depth.`;

    return prompt;
  }

  /**
   * Normalize response format from different service methods
   * @private
   */
  _normalizeResponse(response) {
    if (typeof response === 'string') {
      return { message: response };
    }

    if (response.epiiPerspective) {
      return {
        message: response.epiiPerspective,
        targetCoordinate: response.targetCoordinate,
        bimbaCoordinates: response.bimbaCoordinates
      };
    }

    if (response.message) {
      return response;
    }

    if (response.content) {
      return { message: response.content };
    }

    if (response.response) {
      return { message: response.response };
    }

    return {
      message: JSON.stringify(response)
    };
  }

  /**
   * Get skill metadata for registration
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: this.name,
      description: this.description,
      bimbaCoordinate: this.bimbaCoordinate,
      version: this.version,
      agentId: 'epii-agent',
      inputSchema: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', description: 'User message' },
          history: { type: 'array', description: 'Chat history' },
          targetCoordinate: { type: 'string', description: 'Focus coordinate' },
          documentId: { type: 'string', description: 'Document context ID' },
          documentContent: { type: 'string', description: 'Document content' },
          context: { type: 'object', description: 'Additional context' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              role: { type: 'string' },
              timestamp: { type: 'string' },
              context: { type: 'object' },
              metadata: { type: 'object' }
            }
          },
          skillId: { type: 'string' },
          executionTime: { type: 'number' }
        }
      },
      qlMetadata: {
        qlPosition: 5,
        contextFrame: '(0-5)',
        qlMode: 'integral'
      }
    };
  }
}

module.exports = EpiiChatSkill;
