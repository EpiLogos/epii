/**
 * Session Routing Service
 * 
 * Manages intelligent session routing based on document context, mode changes,
 * and user interactions. Implements context-aware session switching and creation.
 * 
 * Bimba Coordinate: #5-3-3 (Epii Frontend Session Routing)
 */

import { sessionHistoryService } from './SessionHistoryService';
import { emitAGUIEvent } from './webSocketService';
import { AgentSession } from '../0_foundation';

export type SessionContext = {
  documentId?: string;
  documentName?: string;
  documentType?: string;
  coordinate?: string;
  expertSkillId?: string;
  mode?: string;
  analysisSessionId?: string;
  userId?: string;
};

export type SessionTransition = {
  from: string | null;
  to: string;
  trigger: 'document_selection' | 'document_deselection' | 'mode_change' | 'manual' | 'coordinate_focus';
  context: SessionContext;
  preserveHistory?: boolean;
};

export interface SessionRoutingConfig {
  autoSwitching: boolean;
  preserveContext: boolean;
  maxRecentSessions: number;
  compressionThreshold: number;
}

class SessionRoutingService {
  private currentSessionId: string | null = null;
  private sessionCache = new Map<string, AgentSession>();
  private routingConfig: SessionRoutingConfig = {
    autoSwitching: true,
    preserveContext: true,
    maxRecentSessions: 10,
    compressionThreshold: 50
  };

  private recentSessions: string[] = [];
  private sessionContextMap = new Map<string, SessionContext>();

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the service and load current session
   */
  private async initializeService() {
    try {
      const currentSession = sessionHistoryService.getCurrentSession();
      if (currentSession) {
        this.currentSessionId = currentSession.id;
        this.sessionCache.set(currentSession.id, currentSession);
      }
      
      // Load recent sessions for quick switching
      await this.loadRecentSessions();
      
      console.log('[SessionRoutingService] Initialized with session:', this.currentSessionId);
    } catch (error) {
      console.error('[SessionRoutingService] Initialization failed:', error);
    }
  }

  /**
   * Load recent sessions into cache
   */
  private async loadRecentSessions() {
    try {
      // This would call backend service when available
      // For now, use sessionHistoryService
      const sessions = await sessionHistoryService.getRecentSessions(this.routingConfig.maxRecentSessions);
      
      sessions.forEach(session => {
        this.sessionCache.set(session.id, session);
        this.recentSessions.push(session.id);
        
        // Cache session context
        if (session.context) {
          this.sessionContextMap.set(session.id, session.context);
        }
      });
      
      console.log(`[SessionRoutingService] Loaded ${sessions.length} recent sessions`);
    } catch (error) {
      console.error('[SessionRoutingService] Failed to load recent sessions:', error);
    }
  }

  /**
   * Handle document selection - switch to document-specific session
   */
  async handleDocumentSelection(documentId: string, documentName: string, documentType: string = 'bimba'): Promise<AgentSession> {
    if (!this.routingConfig.autoSwitching) {
      return this.getCurrentSession();
    }

    const context: SessionContext = {
      documentId,
      documentName,
      documentType,
      userId: 'current-user' // TODO: Get from user context
    };

    // Check if we already have a session for this document
    const existingSessionId = this.findSessionByContext(context);
    
    if (existingSessionId) {
      console.log(`[SessionRoutingService] Switching to existing document session: ${existingSessionId}`);
      return this.switchToSession(existingSessionId, 'document_selection', context);
    }

    // Create new document-specific session
    console.log(`[SessionRoutingService] Creating new document session for: ${documentName}`);
    return this.createNewSession('document', context);
  }

  /**
   * Handle document deselection - switch back to general session
   */
  async handleDocumentDeselection(): Promise<AgentSession> {
    if (!this.routingConfig.autoSwitching) {
      return this.getCurrentSession();
    }

    // Find most recent general session or create new one
    const generalSessionId = this.findMostRecentSessionByType('general');
    
    if (generalSessionId) {
      console.log(`[SessionRoutingService] Switching back to general session: ${generalSessionId}`);
      return this.switchToSession(generalSessionId, 'document_deselection', {});
    }

    // Create new general session
    console.log('[SessionRoutingService] Creating new general session');
    return this.createNewSession('general', {});
  }

  /**
   * Handle mode change - switch to expert-specific session
   */
  async handleModeChange(newMode: string, expertSkillId: string, coordinate: string): Promise<AgentSession> {
    if (!this.routingConfig.autoSwitching) {
      return this.getCurrentSession();
    }

    const context: SessionContext = {
      mode: newMode,
      expertSkillId,
      coordinate,
      userId: 'current-user'
    };

    // Check if we have a recent session for this mode/expert
    const existingSessionId = this.findSessionByExpert(expertSkillId);
    
    if (existingSessionId) {
      console.log(`[SessionRoutingService] Switching to existing ${newMode} session: ${existingSessionId}`);
      return this.switchToSession(existingSessionId, 'mode_change', context);
    }

    // Create new mode-specific session
    console.log(`[SessionRoutingService] Creating new ${newMode} session`);
    return this.createNewSession('coordinate', context);
  }

  /**
   * Handle coordinate focus - switch to coordinate-specific session
   */
  async handleCoordinateFocus(coordinate: string): Promise<AgentSession> {
    const context: SessionContext = {
      coordinate,
      expertSkillId: this.determineExpertForCoordinate(coordinate),
      userId: 'current-user'
    };

    // Check for existing coordinate session
    const existingSessionId = this.findSessionByContext({ coordinate });
    
    if (existingSessionId) {
      console.log(`[SessionRoutingService] Switching to existing coordinate session: ${existingSessionId}`);
      return this.switchToSession(existingSessionId, 'coordinate_focus', context);
    }

    // Create new coordinate session
    console.log(`[SessionRoutingService] Creating new coordinate session for: ${coordinate}`);
    return this.createNewSession('coordinate', context);
  }

  /**
   * Manually switch to a specific session
   */
  async switchToSession(sessionId: string, trigger: SessionTransition['trigger'], context: SessionContext): Promise<AgentSession> {
    const previousSessionId = this.currentSessionId;
    
    try {
      // Get session from cache or load from service
      let session = this.sessionCache.get(sessionId);
      
      if (!session) {
        session = await sessionHistoryService.getSession(sessionId);
        if (!session) {
          throw new Error(`Session ${sessionId} not found`);
        }
        this.sessionCache.set(sessionId, session);
      }

      // Update current session
      this.currentSessionId = sessionId;
      this.sessionContextMap.set(sessionId, context);

      // Update recent sessions order
      this.updateRecentSessions(sessionId);

      // Emit session transition event
      const transition: SessionTransition = {
        from: previousSessionId,
        to: sessionId,
        trigger,
        context,
        preserveHistory: this.routingConfig.preserveContext
      };

      this.emitSessionTransition(transition);

      console.log(`[SessionRoutingService] Session transition: ${previousSessionId} → ${sessionId} (${trigger})`);
      return session;
    } catch (error) {
      console.error('[SessionRoutingService] Failed to switch session:', error);
      // Fallback to current session
      return this.getCurrentSession();
    }
  }

  /**
   * Create a new session with specified type and context
   */
  async createNewSession(sessionType: 'general' | 'document' | 'analysis' | 'coordinate', context: SessionContext): Promise<AgentSession> {
    try {
      const session = await sessionHistoryService.createSession({
        sessionType,
        context,
        metadata: {
          expertSkillId: context.expertSkillId,
          autoCreated: true,
          createdBy: 'SessionRoutingService'
        }
      });

      // Cache the new session
      this.sessionCache.set(session.id, session);
      this.sessionContextMap.set(session.id, context);
      
      // Switch to the new session
      return this.switchToSession(session.id, 'manual', context);
    } catch (error) {
      console.error('[SessionRoutingService] Failed to create new session:', error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): AgentSession {
    if (this.currentSessionId && this.sessionCache.has(this.currentSessionId)) {
      return this.sessionCache.get(this.currentSessionId)!;
    }

    // Fallback to sessionHistoryService
    return sessionHistoryService.getCurrentSession() || sessionHistoryService.startNewSession();
  }

  /**
   * Find session by context (document, coordinate, etc.)
   */
  private findSessionByContext(context: SessionContext): string | null {
    for (const [sessionId, sessionContext] of this.sessionContextMap.entries()) {
      if (context.documentId && sessionContext.documentId === context.documentId) {
        return sessionId;
      }
      if (context.coordinate && sessionContext.coordinate === context.coordinate) {
        return sessionId;
      }
    }
    return null;
  }

  /**
   * Find session by expert skill ID
   */
  private findSessionByExpert(expertSkillId: string): string | null {
    for (const [sessionId, context] of this.sessionContextMap.entries()) {
      if (context.expertSkillId === expertSkillId) {
        return sessionId;
      }
    }
    return null;
  }

  /**
   * Find most recent session by type
   */
  private findMostRecentSessionByType(sessionType: string): string | null {
    // Look through recent sessions in reverse order (most recent first)
    for (let i = this.recentSessions.length - 1; i >= 0; i--) {
      const sessionId = this.recentSessions[i];
      const session = this.sessionCache.get(sessionId);
      
      if (session && session.sessionType === sessionType) {
        return sessionId;
      }
    }
    return null;
  }

  /**
   * Update recent sessions order
   */
  private updateRecentSessions(sessionId: string) {
    // Remove from current position
    this.recentSessions = this.recentSessions.filter(id => id !== sessionId);
    
    // Add to end (most recent)
    this.recentSessions.push(sessionId);
    
    // Limit to max recent sessions
    if (this.recentSessions.length > this.routingConfig.maxRecentSessions) {
      const removedSession = this.recentSessions.shift();
      if (removedSession) {
        this.sessionCache.delete(removedSession);
        this.sessionContextMap.delete(removedSession);
      }
    }
  }

  /**
   * Determine expert skill for coordinate
   */
  private determineExpertForCoordinate(coordinate: string): string {
    if (coordinate.startsWith('#5')) return 'epii-chat';
    if (coordinate.startsWith('#4')) return 'nara-chat';
    if (coordinate.startsWith('#1')) return 'paramasiva-chat';
    if (coordinate.startsWith('#0')) return 'anuttara-chat';
    return 'universal-chat';
  }

  /**
   * Emit session transition event
   */
  private emitSessionTransition(transition: SessionTransition) {
    emitAGUIEvent('StateDelta', {
      type: 'session-transition',
      subsystem: 'epi-logos-system',
      transition,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get session routing statistics
   */
  getRoutingStats() {
    return {
      currentSessionId: this.currentSessionId,
      cachedSessions: this.sessionCache.size,
      recentSessions: this.recentSessions.length,
      config: this.routingConfig,
      sessionContexts: Object.fromEntries(this.sessionContextMap.entries())
    };
  }

  /**
   * Update routing configuration
   */
  updateConfig(newConfig: Partial<SessionRoutingConfig>) {
    this.routingConfig = { ...this.routingConfig, ...newConfig };
    console.log('[SessionRoutingService] Configuration updated:', this.routingConfig);
  }

  /**
   * Clear session cache and force reload
   */
  async clearCache() {
    this.sessionCache.clear();
    this.sessionContextMap.clear();
    this.recentSessions = [];
    await this.loadRecentSessions();
    console.log('[SessionRoutingService] Cache cleared and reloaded');
  }

  /**
   * Get context for a specific session
   */
  getSessionContext(sessionId: string): SessionContext | null {
    return this.sessionContextMap.get(sessionId) || null;
  }

  /**
   * Check if session needs compression
   */
  shouldCompressSession(sessionId: string): boolean {
    const session = this.sessionCache.get(sessionId);
    return session ? session.messageCount >= this.routingConfig.compressionThreshold : false;
  }
}

// Export singleton instance
export const sessionRoutingService = new SessionRoutingService();
export default sessionRoutingService;