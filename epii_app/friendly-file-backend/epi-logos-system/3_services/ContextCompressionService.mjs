/**
 * Context Compression Service
 * 
 * Provides intelligent context compression, history management, and archival
 * capabilities with expert-specific compression strategies.
 * 
 * Bimba Coordinate: #5-3-2 (Epii Backend Context Management)
 */

import ChatSessionService from './ChatSessionService.mjs';

export class ContextCompressionService {
  constructor(mongoClient, llmService) {
    this.sessionService = new ChatSessionService(mongoClient);
    this.llmService = llmService;
    this.compressionPrompts = this._initializeCompressionPrompts();
    
    // Start background archival process
    this._startArchivalScheduler();
  }

  /**
   * Initialize expert-specific compression prompts
   * @private
   */
  _initializeCompressionPrompts() {
    return {
      'epii-chat': {
        systemPrompt: `You are the Epii agent creating a compression summary from your integral meta-perspective (#5-1-5). Focus on:
- Document analysis insights and coordinate assignments
- Bimba coordinate relationships and knowledge synthesis
- Crystallization patterns and knowledge integration
- Key philosophical and epistemic insights developed

Preserve the essential understanding while condensing the conversation flow.`,
        
        compressionTemplate: `## Epii Session Summary
**Coordinate Focus**: {coordinates}
**Documents Analyzed**: {documents}
**Key Insights**: {insights}
**Knowledge Synthesis**: {synthesis}
**Conversation Arc**: {conversation_flow}`
      },

      'nara-chat': {
        systemPrompt: `You are the Nara agent creating a compression summary from your individualized cognition perspective (#4). Focus on:
- Personal context and identity exploration
- Astrological insights and birth chart analysis
- Individual growth patterns and self-discovery
- Oracle guidance and personal recommendations

Maintain the personal and relational aspects of the conversation.`,
        
        compressionTemplate: `## Nara Session Summary
**Identity Context**: {identity_aspects}
**Personal Themes**: {personal_themes}
**Oracle Guidance**: {oracle_insights}
**Growth Patterns**: {growth_patterns}
**Individual Focus**: {individual_insights}`
      },

      'paramasiva-chat': {
        systemPrompt: `You are the Paramasiva agent creating a compression summary from your quaternary logic perspective (#1). Focus on:
- 3D visualization patterns and topological insights
- Quaternary logic cycles and geometric processing
- Algebraic topology relationships
- Dimensional analysis and form generation

Capture the geometric and logical structures explored.`,
        
        compressionTemplate: `## Paramasiva Session Summary
**Geometric Patterns**: {geometric_insights}
**QL Cycles**: {ql_patterns}
**Topological Forms**: {topology}
**Dimensional Work**: {dimensional_analysis}
**Structural Logic**: {structural_patterns}`
      },

      'anuttara-chat': {
        systemPrompt: `You are the Anuttara agent creating a compression summary from your transcendent void perspective (#0). Focus on:
- Foundational geometry and proto-logical forms
- Void operations and fundamental patterns
- Particle systems and emergent behaviors
- Root-level insights and foundational understanding

Preserve the foundational and emergent aspects.`,
        
        compressionTemplate: `## Anuttara Session Summary
**Foundational Patterns**: {foundational_insights}
**Void Operations**: {void_work}
**Emergent Forms**: {emergence_patterns}
**Proto-Logic**: {proto_logical_insights}
**Root Understanding**: {root_insights}`
      },

      'universal-chat': {
        systemPrompt: `You are creating a compression summary from the universal coordination perspective. Focus on:
- Cross-system coordination and integration
- General knowledge synthesis
- Multi-domain insights and connections
- Universal patterns and principles

Maintain the integrative and cross-domain nature of the conversation.`,
        
        compressionTemplate: `## Universal Session Summary
**Cross-System Insights**: {cross_system_patterns}
**Integration Points**: {integration_insights}
**Universal Principles**: {universal_patterns}
**Multi-Domain Connections**: {domain_connections}
**Coordination Themes**: {coordination_patterns}`
      }
    };
  }

  /**
   * Compress session context with expert-specific strategy
   * @param {string} sessionId - Session identifier
   * @param {number} [keepRecentCount=10] - Messages to keep uncompressed
   * @param {boolean} [forceCompression=false] - Force compression regardless of message count
   * @returns {Promise<Object>} Compression result
   */
  async compressSessionContext(sessionId, keepRecentCount = 10, forceCompression = false) {
    const logPrefix = '[ContextCompressionService]';
    console.log(`${logPrefix} Starting compression for session ${sessionId}`);

    try {
      const session = await this.sessionService.getSession(sessionId, true);
      if (!session) {
        throw new Error('Session not found');
      }

      // Check if compression is needed
      if (!forceCompression && session.messages.length <= keepRecentCount + 5) {
        return { 
          compressed: false, 
          reason: 'Insufficient messages for compression',
          messageCount: session.messages.length 
        };
      }

      // Get expert-specific compression strategy
      const expertSkillId = session.expertSkillId || 'universal-chat';
      const compressionStrategy = this.compressionPrompts[expertSkillId] || this.compressionPrompts['universal-chat'];

      // Split messages for compression
      const messagesToCompress = session.messages.slice(0, -keepRecentCount);
      const messagesToKeep = session.messages.slice(-keepRecentCount);

      // Generate intelligent compression summary
      const compressionSummary = await this._generateIntelligentSummary(
        messagesToCompress,
        compressionStrategy,
        session
      );

      // Use session service to perform the compression
      const result = await this.sessionService.compressSessionContext(sessionId, keepRecentCount);

      // Enhanced result with intelligent summary
      result.intelligentSummary = compressionSummary;
      result.expertStrategy = expertSkillId;
      result.compressionQuality = this._assessCompressionQuality(compressionSummary, messagesToCompress);

      console.log(`${logPrefix} Successfully compressed session ${sessionId} using ${expertSkillId} strategy`);
      return result;
    } catch (error) {
      console.error(`${logPrefix} Compression failed for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Generate intelligent compression summary using LLM
   * @private
   */
  async _generateIntelligentSummary(messages, compressionStrategy, session) {
    try {
      // Prepare conversation text
      const conversationText = this._formatMessagesForCompression(messages);
      
      // Extract context variables for template
      const contextVars = await this._extractContextVariables(messages, session);
      
      // Generate compression prompt
      const compressionPrompt = this._buildCompressionPrompt(
        conversationText,
        compressionStrategy,
        contextVars
      );

      // Call LLM service for intelligent summary
      let intelligentSummary;
      if (this.llmService) {
        const response = await this.llmService.generateResponse(compressionPrompt, {
          maxTokens: 1024,
          temperature: 0.3, // Lower temperature for consistent summaries
          systemPrompt: compressionStrategy.systemPrompt
        });
        intelligentSummary = response.content || response;
      } else {
        // Fallback to structured summary without LLM
        intelligentSummary = this._createFallbackSummary(messages, contextVars);
      }

      return {
        intelligentSummary,
        contextVariables: contextVars,
        compressionStrategy: compressionStrategy.systemPrompt,
        messageCount: messages.length,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('[ContextCompressionService] Failed to generate intelligent summary:', error);
      
      // Fallback to basic summary
      return {
        fallbackSummary: `Compressed ${messages.length} messages from ${messages[0]?.timestamp} to ${messages[messages.length - 1]?.timestamp}`,
        error: error.message,
        generatedAt: new Date()
      };
    }
  }

  /**
   * Format messages for compression processing
   * @private
   */
  _formatMessagesForCompression(messages) {
    return messages.map(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      return `[${timestamp}] ${msg.role}: ${msg.content}`;
    }).join('\n\n');
  }

  /**
   * Extract context variables from messages and session
   * @private
   */
  async _extractContextVariables(messages, session) {
    const variables = {
      coordinates: this._extractCoordinates(messages),
      documents: this._extractDocuments(messages),
      insights: this._extractInsights(messages),
      patterns: this._extractPatterns(messages),
      themes: this._extractThemes(messages),
      conversation_flow: this._analyzeConversationFlow(messages),
      session_type: session.sessionType,
      expert_skill: session.expertSkillId,
      time_span: {
        start: messages[0]?.timestamp,
        end: messages[messages.length - 1]?.timestamp,
        duration: this._calculateDuration(messages)
      }
    };

    // Expert-specific variable extraction
    switch (session.expertSkillId) {
      case 'epii-chat':
        variables.synthesis = this._extractKnowledgeSynthesis(messages);
        variables.crystallization = this._extractCrystallizationPatterns(messages);
        break;
      case 'nara-chat':
        variables.identity_aspects = this._extractIdentityAspects(messages);
        variables.personal_themes = this._extractPersonalThemes(messages);
        variables.oracle_insights = this._extractOracleInsights(messages);
        break;
      case 'paramasiva-chat':
        variables.geometric_insights = this._extractGeometricInsights(messages);
        variables.ql_patterns = this._extractQLPatterns(messages);
        break;
      case 'anuttara-chat':
        variables.foundational_insights = this._extractFoundationalInsights(messages);
        variables.void_work = this._extractVoidOperations(messages);
        break;
    }

    return variables;
  }

  /**
   * Build compression prompt from template and variables
   * @private
   */
  _buildCompressionPrompt(conversationText, strategy, variables) {
    const prompt = `Please create a comprehensive summary of this conversation session.

**Session Context:**
- Type: ${variables.session_type}
- Expert: ${variables.expert_skill}
- Duration: ${variables.time_span.duration}
- Messages: ${conversationText.split('\n\n').length}

**Conversation:**
${conversationText}

**Instructions:**
${strategy.systemPrompt}

Please create a summary following this structure:
${strategy.compressionTemplate}

Focus on preserving the essential insights, patterns, and progression while significantly reducing the length.`;

    return prompt;
  }

  /**
   * Create fallback summary without LLM
   * @private
   */
  _createFallbackSummary(messages, variables) {
    return {
      messageCount: messages.length,
      timeSpan: variables.time_span,
      keyTopics: variables.themes.slice(0, 5),
      coordinates: variables.coordinates,
      documents: variables.documents,
      conversationFlow: variables.conversation_flow,
      generationType: 'fallback'
    };
  }

  /**
   * Assess compression quality
   * @private
   */
  _assessCompressionQuality(summary, originalMessages) {
    const originalLength = originalMessages.reduce((acc, msg) => acc + msg.content.length, 0);
    const summaryLength = JSON.stringify(summary).length;
    const compressionRatio = summaryLength / originalLength;
    
    return {
      compressionRatio,
      qualityScore: compressionRatio < 0.3 ? 'excellent' : 
                   compressionRatio < 0.5 ? 'good' : 
                   compressionRatio < 0.7 ? 'fair' : 'poor',
      originalLength,
      compressedLength: summaryLength,
      preservedElements: this._countPreservedElements(summary)
    };
  }

  /**
   * Count preserved elements in summary
   * @private
   */
  _countPreservedElements(summary) {
    let count = 0;
    const summaryText = JSON.stringify(summary).toLowerCase();
    
    // Count preserved coordinate references
    const coordinates = summaryText.match(/#\d+/g) || [];
    count += coordinates.length;
    
    // Count preserved document references
    if (summaryText.includes('document')) count++;
    
    // Count preserved insights/patterns
    if (summaryText.includes('insight')) count++;
    if (summaryText.includes('pattern')) count++;
    
    return count;
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
  _extractDocuments(messages) {
    return messages
      .filter(m => m.context?.documentId)
      .map(m => ({
        id: m.context.documentId,
        name: m.context.documentName || 'Unknown'
      }))
      .filter((doc, index, arr) => 
        arr.findIndex(d => d.id === doc.id) === index
      );
  }

  /**
   * Extract insights from message content
   * @private
   */
  _extractInsights(messages) {
    const insights = [];
    messages.forEach(msg => {
      // Look for insight indicators
      if (msg.content.toLowerCase().includes('insight') || 
          msg.content.toLowerCase().includes('understanding') ||
          msg.content.toLowerCase().includes('realize')) {
        const sentences = msg.content.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes('insight') && sentence.length > 20) {
            insights.push(sentence.trim());
          }
        });
      }
    });
    return insights.slice(0, 5); // Top 5 insights
  }

  /**
   * Extract patterns from conversation
   * @private
   */
  _extractPatterns(messages) {
    // Look for recurring themes, repeated words, patterns
    const wordFreq = {};
    const patterns = [];
    
    messages.forEach(msg => {
      const words = msg.content.toLowerCase().match(/\b\w{4,}\b/g) || [];
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    });

    // Find frequent patterns
    Object.entries(wordFreq)
      .filter(([word, count]) => count >= 3)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([word]) => patterns.push(word));
    
    return patterns;
  }

  /**
   * Extract themes from conversation
   * @private
   */
  _extractThemes(messages) {
    const themes = [];
    const themeKeywords = {
      'document_analysis': ['analyze', 'document', 'content', 'text'],
      'coordinate_work': ['coordinate', 'bimba', '#', 'position'],
      'knowledge_synthesis': ['synthesis', 'integration', 'combine', 'merge'],
      'personal_growth': ['growth', 'development', 'personal', 'identity'],
      'geometric_patterns': ['geometry', 'shape', 'pattern', 'form'],
      'philosophical_inquiry': ['philosophy', 'wisdom', 'truth', 'meaning']
    };

    const allText = messages.map(m => m.content.toLowerCase()).join(' ');
    
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => allText.includes(keyword));
      if (matches.length >= 2) {
        themes.push({ theme, strength: matches.length });
      }
    });

    return themes.sort((a, b) => b.strength - a.strength).map(t => t.theme);
  }

  /**
   * Analyze conversation flow
   * @private
   */
  _analyzeConversationFlow(messages) {
    if (messages.length === 0) return 'empty';
    
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    const avgMessageLength = messages.reduce((acc, m) => acc + m.content.length, 0) / messages.length;
    
    let flowType = 'conversational';
    if (userMessages > assistantMessages * 1.5) flowType = 'inquiry-driven';
    if (assistantMessages > userMessages * 1.5) flowType = 'explanation-heavy';
    if (avgMessageLength > 500) flowType = 'detailed-discussion';
    
    return {
      type: flowType,
      messageRatio: userMessages / (assistantMessages || 1),
      avgLength: Math.round(avgMessageLength),
      progression: this._analyzeProgression(messages)
    };
  }

  /**
   * Analyze conversation progression
   * @private
   */
  _analyzeProgression(messages) {
    // Simple progression analysis
    const firstThird = messages.slice(0, Math.floor(messages.length / 3));
    const lastThird = messages.slice(-Math.floor(messages.length / 3));
    
    const firstThemes = this._extractThemes(firstThird);
    const lastThemes = this._extractThemes(lastThird);
    
    const themeEvolution = {
      started_with: firstThemes[0] || 'general',
      evolved_to: lastThemes[0] || 'general',
      consistency: firstThemes.filter(t => lastThemes.includes(t)).length
    };
    
    return themeEvolution;
  }

  /**
   * Calculate conversation duration
   * @private
   */
  _calculateDuration(messages) {
    if (messages.length < 2) return '0 minutes';
    
    const start = new Date(messages[0].timestamp);
    const end = new Date(messages[messages.length - 1].timestamp);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.round(durationMs / (1000 * 60));
    
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  // Expert-specific extraction methods
  _extractKnowledgeSynthesis(messages) {
    return messages.filter(m => 
      m.content.toLowerCase().includes('synthesis') ||
      m.content.toLowerCase().includes('integration') ||
      m.content.toLowerCase().includes('combining')
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractCrystallizationPatterns(messages) {
    return messages.filter(m => 
      m.content.toLowerCase().includes('crystalliz') ||
      m.content.toLowerCase().includes('crystal')
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractIdentityAspects(messages) {
    const identityKeywords = ['identity', 'self', 'personal', 'who am i', 'myself'];
    return messages.filter(m => 
      identityKeywords.some(keyword => m.content.toLowerCase().includes(keyword))
    ).map(m => m.content.substring(0, 150) + '...').slice(0, 3);
  }

  _extractPersonalThemes(messages) {
    const personalKeywords = ['personal', 'my', 'i feel', 'i think', 'i am'];
    return personalKeywords.filter(keyword => 
      messages.some(m => m.content.toLowerCase().includes(keyword))
    );
  }

  _extractOracleInsights(messages) {
    return messages.filter(m => 
      m.content.toLowerCase().includes('oracle') ||
      m.content.toLowerCase().includes('guidance') ||
      m.content.toLowerCase().includes('insight')
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractGeometricInsights(messages) {
    const geoKeywords = ['geometric', 'geometry', 'shape', 'form', 'topology'];
    return messages.filter(m => 
      geoKeywords.some(keyword => m.content.toLowerCase().includes(keyword))
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractQLPatterns(messages) {
    return messages.filter(m => 
      m.content.toLowerCase().includes('quaternary') ||
      m.content.toLowerCase().includes('ql') ||
      m.content.toLowerCase().includes('quaternal')
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractFoundationalInsights(messages) {
    const foundationKeywords = ['foundation', 'fundamental', 'basic', 'root', 'core'];
    return messages.filter(m => 
      foundationKeywords.some(keyword => m.content.toLowerCase().includes(keyword))
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  _extractVoidOperations(messages) {
    return messages.filter(m => 
      m.content.toLowerCase().includes('void') ||
      m.content.toLowerCase().includes('empty') ||
      m.content.toLowerCase().includes('transcendent')
    ).map(m => m.content.substring(0, 200) + '...').slice(0, 3);
  }

  /**
   * Archive old sessions based on inactivity
   */
  async archiveOldSessions(daysInactive = 30) {
    const logPrefix = '[ContextCompressionService]';
    console.log(`${logPrefix} Starting archival process for sessions inactive > ${daysInactive} days`);

    try {
      const sessionsToArchive = await this.sessionService.getSessionsForArchival(daysInactive);
      let archivedCount = 0;

      for (const session of sessionsToArchive) {
        try {
          // Compress before archiving if not already compressed
          if (!session.isCompressed && session.messageCount > 10) {
            await this.compressSessionContext(session._id, 5, true);
          }

          // Archive the session
          const archived = await this.sessionService.archiveSession(session._id);
          if (archived) {
            archivedCount++;
          }
        } catch (error) {
          console.error(`${logPrefix} Failed to archive session ${session._id}:`, error);
        }
      }

      console.log(`${logPrefix} Archived ${archivedCount} sessions`);
      return { archivedCount, totalFound: sessionsToArchive.length };
    } catch (error) {
      console.error(`${logPrefix} Archival process failed:`, error);
      throw error;
    }
  }

  /**
   * Start background scheduler for automatic archival
   * @private
   */
  _startArchivalScheduler() {
    // Run archival process daily at 2 AM
    const archivalInterval = 24 * 60 * 60 * 1000; // 24 hours
    
    setInterval(async () => {
      try {
        console.log('[ContextCompressionService] Running scheduled archival process');
        await this.archiveOldSessions();
      } catch (error) {
        console.error('[ContextCompressionService] Scheduled archival failed:', error);
      }
    }, archivalInterval);

    console.log('[ContextCompressionService] Archival scheduler started');
  }

  /**
   * Get compression statistics
   */
  async getCompressionStats() {
    // This would query the database for compression statistics
    // Implementation depends on the database structure
    return {
      totalSessions: 'N/A - requires database query',
      compressedSessions: 'N/A - requires database query',
      compressionRatio: 'N/A - requires database query',
      archivalStats: 'N/A - requires database query'
    };
  }
}

export default ContextCompressionService;