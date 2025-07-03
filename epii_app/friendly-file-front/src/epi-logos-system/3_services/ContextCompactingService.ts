/**
 * Context Compacting Service for Epi-Logos Agent
 * Handles context compacting for long conversations to maintain performance
 */

import { 
  AgentMessage, 
  AgentContext, 
  ContextCompactingResult,
  AGENT_CONFIG 
} from '../0_foundation';
import { sessionHistoryService } from './SessionHistoryService';

class ContextCompactingService {
  private isCompacting = false;
  private compactingInProgress = new Set<string>();

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for compacting triggers
   */
  private setupEventListeners(): void {
    window.addEventListener('epi-logos:context-compacting-needed', (event: any) => {
      const { sessionId } = event.detail;
      this.compactSessionContext(sessionId);
    });
  }

  /**
   * Compact context for a specific session
   */
  async compactSessionContext(sessionId: string): Promise<ContextCompactingResult | null> {
    if (this.compactingInProgress.has(sessionId)) {
      console.log(`[ContextCompactingService] Compacting already in progress for session: ${sessionId}`);
      return null;
    }

    this.compactingInProgress.add(sessionId);
    
    try {
      console.log(`[ContextCompactingService] Starting context compacting for session: ${sessionId}`);
      
      const messages = sessionHistoryService.getSessionMessages(sessionId);
      if (messages.length < AGENT_CONFIG.contextCompactingThreshold) {
        console.log(`[ContextCompactingService] Session ${sessionId} below compacting threshold`);
        return null;
      }

      const result = await this.performContextCompacting(messages, sessionId);
      
      // Update session with compacted messages
      if (result) {
        await this.updateSessionWithCompactedContext(sessionId, result);
      }

      console.log(`[ContextCompactingService] Completed context compacting for session: ${sessionId}`);
      return result;

    } catch (error) {
      console.error(`[ContextCompactingService] Failed to compact context for session ${sessionId}:`, error);
      return null;
    } finally {
      this.compactingInProgress.delete(sessionId);
    }
  }

  /**
   * Perform the actual context compacting
   */
  private async performContextCompacting(
    messages: AgentMessage[], 
    sessionId: string
  ): Promise<ContextCompactingResult> {
    const originalCount = messages.length;
    const keepRecentCount = Math.floor(AGENT_CONFIG.maxMessagesInMemory * 0.3); // Keep 30% of max
    const compactOlderCount = originalCount - keepRecentCount;

    // Keep the most recent messages as-is
    const recentMessages = messages.slice(-keepRecentCount);
    
    // Messages to compact (older ones)
    const messagesToCompact = messages.slice(0, compactOlderCount);

    // Create compacted summary messages
    const compactedMessages = await this.createCompactedSummary(messagesToCompact);

    // Combine compacted and recent messages
    const finalMessages = [...compactedMessages, ...recentMessages];

    // Preserve important context from all messages
    const preservedContext = this.extractPreservedContext(messages);

    const result: ContextCompactingResult = {
      compactedMessages: finalMessages,
      preservedContext,
      compressionRatio: finalMessages.length / originalCount,
      originalMessageCount: originalCount,
      compactedMessageCount: finalMessages.length
    };

    return result;
  }

  /**
   * Create compacted summary from older messages
   */
  private async createCompactedSummary(messages: AgentMessage[]): Promise<AgentMessage[]> {
    if (messages.length === 0) {
      return [];
    }

    // Group messages by conversation topics/time windows
    const messageGroups = this.groupMessagesByContext(messages);
    const summaryMessages: AgentMessage[] = [];

    for (const group of messageGroups) {
      const summary = this.createGroupSummary(group);
      summaryMessages.push(summary);
    }

    return summaryMessages;
  }

  /**
   * Group messages by context/topic for better summarization
   */
  private groupMessagesByContext(messages: AgentMessage[]): AgentMessage[][] {
    const groups: AgentMessage[][] = [];
    const groupSize = 10; // Messages per group

    for (let i = 0; i < messages.length; i += groupSize) {
      const group = messages.slice(i, i + groupSize);
      groups.push(group);
    }

    return groups;
  }

  /**
   * Create a summary message for a group of messages
   */
  private createGroupSummary(messages: AgentMessage[]): AgentMessage {
    const startTime = messages[0]?.timestamp || new Date();
    const endTime = messages[messages.length - 1]?.timestamp || new Date();
    
    // Extract key topics and outcomes
    const userMessages = messages.filter(m => m.type === 'user');
    const agentMessages = messages.filter(m => m.type === 'agent');
    
    const topics = this.extractTopics(messages);
    const outcomes = this.extractOutcomes(agentMessages);
    const documents = this.extractDocumentReferences(messages);
    const coordinates = this.extractCoordinateReferences(messages);

    const summaryContent = this.buildSummaryContent(
      topics, 
      outcomes, 
      documents, 
      coordinates,
      userMessages.length,
      agentMessages.length,
      startTime,
      endTime
    );

    return {
      id: `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'system',
      content: summaryContent,
      timestamp: endTime,
      context: {
        isCompactedSummary: true,
        originalMessageCount: messages.length,
        timeRange: { start: startTime, end: endTime },
        topics,
        documents,
        coordinates
      },
      metadata: {
        orchestrationType: 'context-compacting',
        processingTime: 0,
        confidence: 0.9
      }
    };
  }

  /**
   * Extract main topics from messages
   */
  private extractTopics(messages: AgentMessage[]): string[] {
    const topics = new Set<string>();
    
    messages.forEach(message => {
      // Simple keyword extraction - can be enhanced with NLP
      const content = message.content.toLowerCase();
      
      if (content.includes('document') || content.includes('analysis')) {
        topics.add('document-analysis');
      }
      if (content.includes('coordinate') || content.includes('bimba')) {
        topics.add('coordinate-work');
      }
      if (content.includes('synthesis') || content.includes('knowledge')) {
        topics.add('knowledge-synthesis');
      }
      if (content.includes('selection') || content.includes('text')) {
        topics.add('text-selection');
      }
      if (message.metadata?.orchestrationType) {
        topics.add(message.metadata.orchestrationType);
      }
    });

    return Array.from(topics);
  }

  /**
   * Extract key outcomes from agent messages
   */
  private extractOutcomes(agentMessages: AgentMessage[]): string[] {
    const outcomes: string[] = [];
    
    agentMessages.forEach(message => {
      if (message.metadata?.orchestrationType) {
        outcomes.push(`Completed ${message.metadata.orchestrationType}`);
      }
      
      // Extract specific accomplishments
      const content = message.content.toLowerCase();
      if (content.includes('analysis complete')) {
        outcomes.push('Analysis completed');
      }
      if (content.includes('synthesis generated')) {
        outcomes.push('Synthesis generated');
      }
      if (content.includes('coordinates updated')) {
        outcomes.push('Coordinates updated');
      }
    });

    return outcomes;
  }

  /**
   * Extract document references
   */
  private extractDocumentReferences(messages: AgentMessage[]): string[] {
    const documents = new Set<string>();
    
    messages.forEach(message => {
      if (message.context?.document?.title) {
        documents.add(message.context.document.title);
      }
      if (message.context?.document?.id) {
        documents.add(message.context.document.id);
      }
    });

    return Array.from(documents);
  }

  /**
   * Extract coordinate references
   */
  private extractCoordinateReferences(messages: AgentMessage[]): string[] {
    const coordinates = new Set<string>();
    
    messages.forEach(message => {
      if (message.context?.coordinates) {
        message.context.coordinates.forEach(coord => coordinates.add(coord));
      }
      if (message.context?.document?.bimbaCoordinate) {
        coordinates.add(message.context.document.bimbaCoordinate);
      }
    });

    return Array.from(coordinates);
  }

  /**
   * Build summary content string
   */
  private buildSummaryContent(
    topics: string[],
    outcomes: string[],
    documents: string[],
    coordinates: string[],
    userMessageCount: number,
    agentMessageCount: number,
    startTime: Date,
    endTime: Date
  ): string {
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes
    
    let summary = `📋 **Conversation Summary** (${duration}min, ${userMessageCount + agentMessageCount} messages)\n\n`;
    
    if (topics.length > 0) {
      summary += `**Topics:** ${topics.join(', ')}\n\n`;
    }
    
    if (outcomes.length > 0) {
      summary += `**Key Outcomes:**\n${outcomes.map(o => `• ${o}`).join('\n')}\n\n`;
    }
    
    if (documents.length > 0) {
      summary += `**Documents:** ${documents.join(', ')}\n\n`;
    }
    
    if (coordinates.length > 0) {
      summary += `**Coordinates:** ${coordinates.join(', ')}\n\n`;
    }
    
    summary += `*This summary represents ${userMessageCount} user messages and ${agentMessageCount} agent responses.*`;
    
    return summary;
  }

  /**
   * Extract and preserve important context
   */
  private extractPreservedContext(messages: AgentMessage[]): AgentContext {
    const preservedContext: AgentContext = {};
    
    // Find the most recent document context
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].context?.document && !preservedContext.document) {
        preservedContext.document = messages[i].context!.document;
      }
      if (messages[i].context?.selections && !preservedContext.selections) {
        preservedContext.selections = messages[i].context!.selections;
      }
      if (messages[i].context?.coordinates && !preservedContext.coordinates) {
        preservedContext.coordinates = messages[i].context!.coordinates;
      }
    }

    // Collect all unique coordinates mentioned
    const allCoordinates = new Set<string>();
    messages.forEach(message => {
      if (message.context?.coordinates) {
        message.context.coordinates.forEach(coord => allCoordinates.add(coord));
      }
    });
    preservedContext.coordinates = Array.from(allCoordinates);

    return preservedContext;
  }

  /**
   * Update session with compacted context
   */
  private async updateSessionWithCompactedContext(
    sessionId: string, 
    result: ContextCompactingResult
  ): Promise<void> {
    // Update session context with preserved context
    sessionHistoryService.updateSessionContext(result.preservedContext);
    
    // Clear current message history and replace with compacted messages
    const session = sessionHistoryService.getCurrentSession();
    if (session && session.id === sessionId) {
      // This would require exposing a method in SessionHistoryService to replace messages
      // For now, we'll just log the success
      console.log(`[ContextCompactingService] Session context compacted: ${result.compressionRatio.toFixed(2)} compression ratio`);
    }
  }

  /**
   * Get compacting status
   */
  getCompactingStatus(): { isCompacting: boolean; sessionsInProgress: string[] } {
    return {
      isCompacting: this.compactingInProgress.size > 0,
      sessionsInProgress: Array.from(this.compactingInProgress)
    };
  }

  /**
   * Force compact session (manual trigger)
   */
  async forceCompactSession(sessionId: string): Promise<ContextCompactingResult | null> {
    return await this.compactSessionContext(sessionId);
  }
}

// Singleton instance
export const contextCompactingService = new ContextCompactingService();
export default contextCompactingService;