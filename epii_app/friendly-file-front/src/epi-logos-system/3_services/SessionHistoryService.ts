/**
 * Session History Service for Epi-Logos Agent
 * Manages conversation persistence across page reloads and sessions
 * Integrates with MongoDB Conversations collection for full persistence
 */

import { 
  AgentMessage, 
  AgentSession, 
  SessionHistoryEntry, 
  AgentContext,
  AGENT_CONFIG 
} from '../0_foundation';

// MongoDB Conversation Types
interface ConversationMessage {
  type: 'human' | 'ai' | 'system' | 'tool' | 'function';
  content: string;
  tool_call_id?: string;
  name?: string;
  args?: any;
  timestamp: Date;
}

interface MongoConversation {
  conversationId: string;
  userId: string;
  messages: ConversationMessage[];
  currentState: any;
  createdAt: Date;
  updatedAt: Date;
}

class SessionHistoryService {
  private currentSession: AgentSession | null = null;
  private messageHistory: Map<string, AgentMessage[]> = new Map();
  private sessionStorage: Storage;
  private readonly STORAGE_KEY = 'epi-logos-sessions';
  private readonly CURRENT_SESSION_KEY = 'epi-logos-current-session';
  private readonly MAX_STORED_SESSIONS = 10;
  private readonly BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  private currentUserId: string = 'default-user'; // Should be set by auth system

  constructor() {
    this.sessionStorage = window.localStorage;
    this.loadStoredSessions();
    this.restoreCurrentSession();
  }

  /**
   * Start a new agent session
   */
  startNewSession(initialContext: AgentContext = {}): AgentSession {
    const session: AgentSession = {
      id: this.generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      messageCount: 0,
      context: initialContext,
      preferences: {
        maxMessagesInMemory: AGENT_CONFIG.maxMessagesInMemory,
        contextCompactingThreshold: AGENT_CONFIG.contextCompactingThreshold,
        preferredOrchestrationStrategy: AGENT_CONFIG.defaultOrchestrationStrategy,
        enabledSubsystems: AGENT_CONFIG.enabledSubsystems as any[]
      }
    };

    this.currentSession = session;
    this.messageHistory.set(session.id, []);
    this.saveCurrentSession();

    console.log(`[SessionHistoryService] Started new session: ${session.id}`);
    return session;
  }

  /**
   * Get current active session
   */
  getCurrentSession(): AgentSession | null {
    return this.currentSession;
  }

  /**
   * Add message to current session
   */
  addMessage(message: Omit<AgentMessage, 'id'>): AgentMessage {
    if (!this.currentSession) {
      throw new Error('No active session. Please start a new session first.');
    }

    const fullMessage: AgentMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    };

    const sessionMessages = this.messageHistory.get(this.currentSession.id) || [];
    sessionMessages.push(fullMessage);
    this.messageHistory.set(this.currentSession.id, sessionMessages);

    // Update session metadata
    this.currentSession.messageCount++;
    this.currentSession.lastActivity = new Date();

    // Check if context compacting is needed
    if (sessionMessages.length > this.currentSession.preferences!.contextCompactingThreshold) {
      this.triggerContextCompacting();
    }

    this.saveCurrentSession();
    this.saveSessionToStorage();

    return fullMessage;
  }

  /**
   * Get message history for current session
   */
  getCurrentSessionMessages(): AgentMessage[] {
    if (!this.currentSession) {
      return [];
    }
    return this.messageHistory.get(this.currentSession.id) || [];
  }

  /**
   * Get message history for specific session
   */
  getSessionMessages(sessionId: string): AgentMessage[] {
    return this.messageHistory.get(sessionId) || [];
  }

  /**
   * Update session context
   */
  updateSessionContext(newContext: Partial<AgentContext>): void {
    if (!this.currentSession) {
      return;
    }

    this.currentSession.context = {
      ...this.currentSession.context,
      ...newContext
    };

    this.currentSession.lastActivity = new Date();
    this.saveCurrentSession();
  }

  /**
   * Archive current session and start new one
   */
  archiveCurrentSession(): AgentSession | null {
    if (!this.currentSession) {
      return null;
    }

    const archivedSession = { ...this.currentSession };
    this.saveSessionToStorage();
    
    console.log(`[SessionHistoryService] Archived session: ${archivedSession.id}`);
    
    // Start new session with preserved context
    return this.startNewSession(archivedSession.context);
  }

  /**
   * Clear session history
   */
  clearSessionHistory(): void {
    if (this.currentSession) {
      this.messageHistory.set(this.currentSession.id, []);
      this.currentSession.messageCount = 0;
      this.saveCurrentSession();
    }
  }

  /**
   * Get all stored sessions
   */
  getAllSessions(): SessionHistoryEntry[] {
    const stored = this.sessionStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('[SessionHistoryService] Failed to parse stored sessions:', error);
      return [];
    }
  }

  /**
   * Restore session by ID
   */
  restoreSession(sessionId: string): boolean {
    const allSessions = this.getAllSessions();
    const sessionToRestore = allSessions.find(s => s.sessionId === sessionId);

    if (!sessionToRestore) {
      return false;
    }

    // Create new session based on stored session
    const restoredSession: AgentSession = {
      id: sessionToRestore.sessionId,
      startTime: sessionToRestore.startTime,
      lastActivity: new Date(), // Update to current time
      messageCount: sessionToRestore.messages.length,
      context: sessionToRestore.context,
      preferences: {
        maxMessagesInMemory: AGENT_CONFIG.maxMessagesInMemory,
        contextCompactingThreshold: AGENT_CONFIG.contextCompactingThreshold,
        preferredOrchestrationStrategy: AGENT_CONFIG.defaultOrchestrationStrategy,
        enabledSubsystems: AGENT_CONFIG.enabledSubsystems as any[]
      }
    };

    this.currentSession = restoredSession;
    this.messageHistory.set(sessionId, sessionToRestore.messages);
    this.saveCurrentSession();

    console.log(`[SessionHistoryService] Restored session: ${sessionId}`);
    return true;
  }

  /**
   * Trigger context compacting for current session
   */
  private triggerContextCompacting(): void {
    // This will be handled by ContextCompactingService
    console.log('[SessionHistoryService] Context compacting threshold reached');
    // Emit event for ContextCompactingService to handle
    window.dispatchEvent(new CustomEvent('epi-logos:context-compacting-needed', {
      detail: { sessionId: this.currentSession?.id }
    }));
  }

  /**
   * Save current session to localStorage
   */
  private saveCurrentSession(): void {
    if (!this.currentSession) {
      return;
    }

    this.sessionStorage.setItem(
      this.CURRENT_SESSION_KEY, 
      JSON.stringify({
        session: this.currentSession,
        messages: this.getCurrentSessionMessages()
      })
    );
  }

  /**
   * Load stored sessions from localStorage
   */
  private loadStoredSessions(): void {
    const stored = this.sessionStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const sessions = JSON.parse(stored);
      sessions.forEach((session: SessionHistoryEntry) => {
        this.messageHistory.set(session.sessionId, session.messages);
      });
    } catch (error) {
      console.error('[SessionHistoryService] Failed to load stored sessions:', error);
    }
  }

  /**
   * Restore current session from localStorage
   */
  private restoreCurrentSession(): void {
    const stored = this.sessionStorage.getItem(this.CURRENT_SESSION_KEY);
    if (!stored) {
      return;
    }

    try {
      const { session, messages } = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      session.startTime = new Date(session.startTime);
      session.lastActivity = new Date(session.lastActivity);
      
      const parsedMessages = messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      this.currentSession = session;
      this.messageHistory.set(session.id, parsedMessages);

      console.log(`[SessionHistoryService] Restored current session: ${session.id}`);
    } catch (error) {
      console.error('[SessionHistoryService] Failed to restore current session:', error);
    }
  }

  /**
   * Save session to persistent storage
   */
  private saveSessionToStorage(): void {
    if (!this.currentSession) {
      return;
    }

    const allSessions = this.getAllSessions();
    const sessionEntry: SessionHistoryEntry = {
      sessionId: this.currentSession.id,
      messages: this.getCurrentSessionMessages(),
      context: this.currentSession.context,
      startTime: this.currentSession.startTime,
      archived: false
    };

    // Update existing session or add new one
    const existingIndex = allSessions.findIndex(s => s.sessionId === this.currentSession!.id);
    if (existingIndex >= 0) {
      allSessions[existingIndex] = sessionEntry;
    } else {
      allSessions.unshift(sessionEntry); // Add to beginning
    }

    // Keep only recent sessions
    const recentSessions = allSessions.slice(0, this.MAX_STORED_SESSIONS);

    this.sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentSessions));
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old sessions
   */
  cleanupOldSessions(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const allSessions = this.getAllSessions();
    const cutoffDate = new Date(Date.now() - maxAge);
    
    const recentSessions = allSessions.filter(session => 
      session.startTime > cutoffDate
    );

    this.sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentSessions));
    console.log(`[SessionHistoryService] Cleaned up ${allSessions.length - recentSessions.length} old sessions`);
  }

  /**
   * Set current user ID for MongoDB integration
   */
  setUserId(userId: string): void {
    this.currentUserId = userId;
    console.log(`[SessionHistoryService] User ID set to: ${userId}`);
  }

  /**
   * Convert AgentMessage to MongoDB ConversationMessage format
   */
  private convertToMongoMessage(message: AgentMessage): ConversationMessage {
    return {
      type: message.role === 'user' ? 'human' : 
            message.role === 'assistant' ? 'ai' : 
            message.role === 'system' ? 'system' : 'ai',
      content: message.content,
      timestamp: message.timestamp,
      // Add tool_call_id and args if present in message
      ...(message.tool_call_id && { tool_call_id: message.tool_call_id }),
      ...(message.args && { args: message.args })
    };
  }

  /**
   * Convert MongoDB ConversationMessage to AgentMessage format
   */
  private convertFromMongoMessage(mongoMessage: ConversationMessage, index: number): AgentMessage {
    return {
      id: `mongo_msg_${index}_${Date.now()}`,
      role: mongoMessage.type === 'human' ? 'user' : 
            mongoMessage.type === 'ai' ? 'assistant' : 
            mongoMessage.type === 'system' ? 'system' : 'assistant',
      content: mongoMessage.content,
      timestamp: new Date(mongoMessage.timestamp),
      ...(mongoMessage.tool_call_id && { tool_call_id: mongoMessage.tool_call_id }),
      ...(mongoMessage.args && { args: mongoMessage.args })
    };
  }

  /**
   * Save current session to MongoDB
   */
  async saveSessionToMongoDB(): Promise<boolean> {
    if (!this.currentSession) {
      console.warn('[SessionHistoryService] No current session to save to MongoDB');
      return false;
    }

    try {
      const messages = this.getCurrentSessionMessages();
      const mongoMessages = messages.map(msg => this.convertToMongoMessage(msg));

      const conversationData = {
        conversationId: this.currentSession.id,
        userId: this.currentUserId,
        messages: mongoMessages,
        currentState: {
          context: this.currentSession.context,
          preferences: this.currentSession.preferences,
          messageCount: this.currentSession.messageCount,
          startTime: this.currentSession.startTime,
          lastActivity: this.currentSession.lastActivity
        }
      };

      const response = await fetch(`${this.BACKEND_BASE_URL}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData)
      });

      if (!response.ok) {
        throw new Error(`MongoDB save failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`[SessionHistoryService] Session saved to MongoDB: ${this.currentSession.id}`);
      return true;

    } catch (error) {
      console.error('[SessionHistoryService] Failed to save session to MongoDB:', error);
      return false;
    }
  }

  /**
   * Load session from MongoDB
   */
  async loadSessionFromMongoDB(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_BASE_URL}/api/conversations/${sessionId}?userId=${this.currentUserId}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`[SessionHistoryService] Session ${sessionId} not found in MongoDB`);
          return false;
        }
        throw new Error(`MongoDB load failed: ${response.statusText}`);
      }

      const mongoConversation: MongoConversation = await response.json();

      // Convert MongoDB conversation back to session format
      const restoredSession: AgentSession = {
        id: mongoConversation.conversationId,
        startTime: new Date(mongoConversation.createdAt),
        lastActivity: new Date(mongoConversation.updatedAt),
        messageCount: mongoConversation.messages.length,
        context: mongoConversation.currentState?.context || {},
        preferences: mongoConversation.currentState?.preferences || {
          maxMessagesInMemory: AGENT_CONFIG.maxMessagesInMemory,
          contextCompactingThreshold: AGENT_CONFIG.contextCompactingThreshold,
          preferredOrchestrationStrategy: AGENT_CONFIG.defaultOrchestrationStrategy,
          enabledSubsystems: AGENT_CONFIG.enabledSubsystems as any[]
        }
      };

      // Convert messages
      const messages = mongoConversation.messages.map((msg, index) => 
        this.convertFromMongoMessage(msg, index)
      );

      this.currentSession = restoredSession;
      this.messageHistory.set(sessionId, messages);
      this.saveCurrentSession(); // Save to localStorage as well

      console.log(`[SessionHistoryService] Session loaded from MongoDB: ${sessionId}`);
      return true;

    } catch (error) {
      console.error('[SessionHistoryService] Failed to load session from MongoDB:', error);
      return false;
    }
  }

  /**
   * Get all conversations for current user from MongoDB
   */
  async getConversationsFromMongoDB(limit: number = 20): Promise<SessionHistoryEntry[]> {
    try {
      const response = await fetch(`${this.BACKEND_BASE_URL}/api/conversations?userId=${this.currentUserId}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }

      const conversations: MongoConversation[] = await response.json();

      return conversations.map(conv => ({
        sessionId: conv.conversationId,
        messages: conv.messages.map((msg, index) => this.convertFromMongoMessage(msg, index)),
        context: conv.currentState?.context || {},
        startTime: new Date(conv.createdAt),
        endTime: undefined, // MongoDB doesn't track explicit end times
        archived: false
      }));

    } catch (error) {
      console.error('[SessionHistoryService] Failed to get conversations from MongoDB:', error);
      return [];
    }
  }

  /**
   * Enhanced add message with MongoDB persistence
   */
  async addMessageWithPersistence(message: Omit<AgentMessage, 'id'>): Promise<AgentMessage> {
    // Add to local storage first (for immediate access)
    const fullMessage = this.addMessage(message);

    // Attempt to save to MongoDB (non-blocking)
    this.saveSessionToMongoDB().catch(error => {
      console.warn('[SessionHistoryService] Background MongoDB save failed:', error);
    });

    return fullMessage;
  }

  /**
   * Enhanced session start with MongoDB integration
   */
  async startNewSessionWithPersistence(initialContext: AgentContext = {}): Promise<AgentSession> {
    const session = this.startNewSession(initialContext);

    // Try to save initial session to MongoDB
    await this.saveSessionToMongoDB();

    return session;
  }

  /**
   * Sync local session with MongoDB
   */
  async syncWithMongoDB(): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }

    // Try to load latest from MongoDB first
    const loaded = await this.loadSessionFromMongoDB(this.currentSession.id);
    
    if (!loaded) {
      // Session doesn't exist in MongoDB, save current session
      return await this.saveSessionToMongoDB();
    }

    return true;
  }
}

// Singleton instance
export const sessionHistoryService = new SessionHistoryService();
export default sessionHistoryService;