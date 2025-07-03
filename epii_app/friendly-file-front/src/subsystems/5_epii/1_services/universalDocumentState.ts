/**
 * Universal Document State Management
 * Replaces EpiiContext with AG-UI StateDelta event-driven state management
 * 
 * This service centralizes all document state through webSocketService AG-UI events,
 * eliminating the need for local React Context and providing universal access.
 */

import { emitAGUIEvent, onAGUIEvent, offAGUIEvent } from './webSocketService';
import documentCacheService from './documentCacheService';
import documentStateService from './documentStateService';

// Document state types
export interface UniversalDocument {
  id: string;
  _id?: string;
  name: string;
  textContent: string;
  content?: string; // Backward compatibility
  documentType: 'bimba' | 'pratibimba';
  bimbaCoordinate: string;
  targetCoordinate?: string;
  isTemporary: boolean;
  analysisStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResults?: any;
  lastModified: Date;
  createdAt: Date;
  versions?: Array<{
    timestamp: Date;
    textContent: string;
  }>;
  metadata?: Record<string, any>;
}

export interface DocumentSelection {
  id: string;
  documentId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  coordinate?: string;
  notes?: string;
  timestamp: Date;
}

export interface AnalysisSession {
  id: string;
  documentId: string;
  name: string;
  selections: string[]; // Selection IDs
  analysisResults?: any;
  createdAt: Date;
  lastModified: Date;
}

export interface ChatMessage {
  id: string;
  sessionId?: string;
  content: string;
  type: 'user' | 'agent' | 'system';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UniversalDocumentState {
  // Document management
  documents: UniversalDocument[];
  currentDocumentId: string | null;
  
  // Selection management
  selections: DocumentSelection[];
  currentSelection: DocumentSelection | null;
  
  // Analysis sessions
  analysisSessions: AnalysisSession[];
  currentSessionId: string | null;
  
  // Chat messages (will be deprecated in favor of universal agent)
  chatMessages: ChatMessage[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  statusMessage: string | null;
  
  // Synchronization
  lastUpdate: Date;
  syncStatus: 'idle' | 'syncing' | 'error';
}

// AG-UI StateDelta event types for document operations
export interface DocumentStateDelta {
  type: 'StateDelta';
  scope: 'document' | 'selection' | 'analysis' | 'chat' | 'ui';
  operation: 'create' | 'update' | 'delete' | 'sync';
  documentId?: string;
  selectionId?: string;
  sessionId?: string;
  messageId?: string;
  changes: Partial<UniversalDocumentState>;
  metadata?: {
    source: string;
    timestamp: string;
    bimbaCoordinate?: string;
    [key: string]: any;
  };
}

class UniversalDocumentStateManager {
  private state: UniversalDocumentState;
  private listeners: Map<string, ((state: UniversalDocumentState) => void)[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.state = this.getInitialState();
    this.setupEventListeners();
  }

  /**
   * Get initial state
   */
  private getInitialState(): UniversalDocumentState {
    return {
      documents: [],
      currentDocumentId: null,
      selections: [],
      currentSelection: null,
      analysisSessions: [],
      currentSessionId: null,
      chatMessages: [],
      isLoading: false,
      error: null,
      statusMessage: null,
      lastUpdate: new Date(),
      syncStatus: 'idle'
    };
  }

  /**
   * Initialize the universal document state manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('[UniversalDocumentState] Already initialized');
      return;
    }

    console.log('[UniversalDocumentState] Initializing universal document state manager...');

    // Initialize document state service
    documentStateService.initialize();

    // Setup AG-UI event handlers
    this.setupAGUIEventHandlers();

    // Load initial state from services
    await this.loadInitialState();

    this.isInitialized = true;
    console.log('[UniversalDocumentState] ✅ Universal document state manager initialized');
  }

  /**
   * Setup AG-UI event listeners
   */
  private setupEventListeners(): void {
    // Listen for document state changes from documentStateService
    documentStateService.onStateUpdate(() => {
      this.syncFromExternalSources();
    });

    documentStateService.onDocumentUpdate((documentId, changes) => {
      this.handleDocumentUpdate(documentId, changes);
    });
  }

  /**
   * Setup AG-UI StateDelta event handlers
   */
  private setupAGUIEventHandlers(): void {
    // Listen for StateDelta events
    onAGUIEvent('StateDelta', (event: DocumentStateDelta) => {
      this.handleStateDelta(event);
    });

    // Listen for document lifecycle events
    onAGUIEvent('DocumentCreated', (event: any) => {
      this.handleDocumentCreated(event);
    });

    onAGUIEvent('DocumentUpdated', (event: any) => {
      this.handleDocumentUpdated(event);
    });

    onAGUIEvent('DocumentDeleted', (event: any) => {
      this.handleDocumentDeleted(event);
    });

    onAGUIEvent('DocumentAnalysisCompleted', (event: any) => {
      this.handleAnalysisCompleted(event);
    });
  }

  /**
   * Load initial state from external sources
   */
  private async loadInitialState(): Promise<void> {
    try {
      this.updateState({ isLoading: true });

      // Load documents from cache/MongoDB
      const documents = await this.loadDocuments();
      
      // Load selections from localStorage
      const selections = this.loadSelectionsFromStorage();
      
      // Load analysis sessions from localStorage
      const analysisSessions = this.loadAnalysisSessionsFromStorage();
      
      // Load chat messages from localStorage
      const chatMessages = this.loadChatMessagesFromStorage();

      this.updateState({
        documents,
        selections,
        analysisSessions,
        chatMessages,
        isLoading: false,
        lastUpdate: new Date()
      });

    } catch (error) {
      console.error('[UniversalDocumentState] Error loading initial state:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load state'
      });
    }
  }

  /**
   * Load documents from document cache service
   */
  private async loadDocuments(): Promise<UniversalDocument[]> {
    try {
      const allDocuments = documentCacheService.getAllDocuments();
      return allDocuments.map(doc => this.normalizeDocument(doc));
    } catch (error) {
      console.error('[UniversalDocumentState] Error loading documents:', error);
      return [];
    }
  }

  /**
   * Normalize document to universal format
   */
  private normalizeDocument(doc: any): UniversalDocument {
    return {
      id: doc.id || doc._id,
      _id: doc._id || doc.id,
      name: doc.name || 'Untitled Document',
      textContent: doc.textContent || doc.content || '',
      content: doc.content || doc.textContent,
      documentType: doc.documentType || 'bimba',
      bimbaCoordinate: doc.bimbaCoordinate || doc.targetCoordinate || '',
      targetCoordinate: doc.targetCoordinate || doc.bimbaCoordinate,
      isTemporary: doc.isTemporary || false,
      analysisStatus: doc.analysisStatus,
      analysisResults: doc.analysisResults,
      lastModified: doc.lastModified ? new Date(doc.lastModified) : new Date(),
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      versions: doc.versions || [],
      metadata: doc.metadata || {}
    };
  }

  /**
   * Load selections from localStorage
   */
  private loadSelectionsFromStorage(): DocumentSelection[] {
    try {
      const stored = localStorage.getItem('epii_selections');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Load analysis sessions from localStorage
   */
  private loadAnalysisSessionsFromStorage(): AnalysisSession[] {
    try {
      const stored = localStorage.getItem('epii_analysis_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Load chat messages from localStorage
   */
  private loadChatMessagesFromStorage(): ChatMessage[] {
    try {
      const stored = localStorage.getItem('epii_chat_messages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Handle StateDelta events
   */
  private handleStateDelta(event: DocumentStateDelta): void {
    console.log('[UniversalDocumentState] Handling StateDelta event:', event);

    // Apply the changes to state
    this.updateState(event.changes);

    // Emit change notifications
    this.notifyListeners(event.scope);
  }

  /**
   * Handle document created events
   */
  private handleDocumentCreated(event: any): void {
    console.log('[UniversalDocumentState] Document created:', event);
    this.syncFromExternalSources();
  }

  /**
   * Handle document updated events
   */
  private handleDocumentUpdated(event: any): void {
    console.log('[UniversalDocumentState] Document updated:', event);
    this.syncFromExternalSources();
  }

  /**
   * Handle document deleted events
   */
  private handleDocumentDeleted(event: any): void {
    console.log('[UniversalDocumentState] Document deleted:', event);
    
    // Remove document from state
    const updatedDocuments = this.state.documents.filter(doc => 
      doc.id !== event.documentId && doc._id !== event.documentId
    );
    
    this.updateState({ 
      documents: updatedDocuments,
      currentDocumentId: this.state.currentDocumentId === event.documentId ? null : this.state.currentDocumentId
    });
  }

  /**
   * Handle analysis completed events
   */
  private handleAnalysisCompleted(event: any): void {
    console.log('[UniversalDocumentState] Analysis completed:', event);
    
    // Update document with analysis results
    const updatedDocuments = this.state.documents.map(doc => {
      if (doc.id === event.documentId || doc._id === event.documentId) {
        return {
          ...doc,
          analysisStatus: 'completed' as const,
          analysisResults: event.analysisResults,
          lastModified: new Date()
        };
      }
      return doc;
    });

    this.updateState({ documents: updatedDocuments });
  }

  /**
   * Handle external document updates
   */
  private handleDocumentUpdate(documentId: string, changes: any): void {
    const updatedDocuments = this.state.documents.map(doc => {
      if (doc.id === documentId || doc._id === documentId) {
        return { ...doc, ...changes, lastModified: new Date() };
      }
      return doc;
    });

    this.updateState({ documents: updatedDocuments });
  }

  /**
   * Sync state from external sources
   */
  private async syncFromExternalSources(): Promise<void> {
    this.updateState({ syncStatus: 'syncing' });
    
    try {
      const documents = await this.loadDocuments();
      this.updateState({ 
        documents,
        syncStatus: 'idle',
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('[UniversalDocumentState] Sync error:', error);
      this.updateState({ syncStatus: 'error' });
    }
  }

  /**
   * Update state and persist relevant parts
   */
  private updateState(changes: Partial<UniversalDocumentState>): void {
    this.state = { ...this.state, ...changes, lastUpdate: new Date() };

    // Persist relevant state to localStorage
    if (changes.selections) {
      localStorage.setItem('epii_selections', JSON.stringify(changes.selections));
    }
    if (changes.analysisSessions) {
      localStorage.setItem('epii_analysis_sessions', JSON.stringify(changes.analysisSessions));
    }
    if (changes.chatMessages) {
      localStorage.setItem('epii_chat_messages', JSON.stringify(changes.chatMessages));
    }

    // Notify all listeners
    this.notifyListeners('all');
  }

  /**
   * Notify listeners of state changes
   */
  private notifyListeners(scope: string): void {
    const allListeners = this.listeners.get('all') || [];
    const scopeListeners = this.listeners.get(scope) || [];
    
    [...allListeners, ...scopeListeners].forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('[UniversalDocumentState] Error in listener:', error);
      }
    });
  }

  // Public API methods

  /**
   * Get current state
   */
  getState(): UniversalDocumentState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: UniversalDocumentState) => void, scope: string = 'all'): () => void {
    if (!this.listeners.has(scope)) {
      this.listeners.set(scope, []);
    }
    
    this.listeners.get(scope)!.push(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(scope);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit StateDelta event to notify other components
   */
  emitStateDelta(delta: Partial<DocumentStateDelta>): boolean {
    const event: DocumentStateDelta = {
      type: 'StateDelta',
      scope: delta.scope || 'document',
      operation: delta.operation || 'update',
      changes: delta.changes || {},
      metadata: {
        source: 'UniversalDocumentState',
        timestamp: new Date().toISOString(),
        ...delta.metadata
      },
      ...delta
    };

    return emitAGUIEvent('StateDelta', event);
  }

  /**
   * Set current document
   */
  setCurrentDocument(documentId: string | null): void {
    this.updateState({ currentDocumentId: documentId });
    
    this.emitStateDelta({
      scope: 'document',
      operation: 'update',
      documentId: documentId || undefined,
      changes: { currentDocumentId: documentId }
    });
  }

  /**
   * Add or update document
   */
  upsertDocument(document: Partial<UniversalDocument>): void {
    const normalizedDoc = this.normalizeDocument(document);
    
    const existingIndex = this.state.documents.findIndex(doc => 
      doc.id === normalizedDoc.id || doc._id === normalizedDoc._id
    );

    let updatedDocuments: UniversalDocument[];
    if (existingIndex >= 0) {
      // Update existing
      updatedDocuments = [...this.state.documents];
      updatedDocuments[existingIndex] = { ...updatedDocuments[existingIndex], ...normalizedDoc };
    } else {
      // Add new
      updatedDocuments = [...this.state.documents, normalizedDoc];
    }

    this.updateState({ documents: updatedDocuments });
    
    this.emitStateDelta({
      scope: 'document',
      operation: existingIndex >= 0 ? 'update' : 'create',
      documentId: normalizedDoc.id,
      changes: { documents: updatedDocuments }
    });
  }

  /**
   * Get current document
   */
  getCurrentDocument(): UniversalDocument | null {
    if (!this.state.currentDocumentId) return null;
    
    return this.state.documents.find(doc => 
      doc.id === this.state.currentDocumentId || doc._id === this.state.currentDocumentId
    ) || null;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (!this.isInitialized) return;

    // Remove AG-UI event listeners
    offAGUIEvent('StateDelta', this.handleStateDelta.bind(this));
    
    // Cleanup document state service
    documentStateService.cleanup();
    
    this.isInitialized = false;
    console.log('[UniversalDocumentState] ✅ Cleaned up');
  }
}

// Create singleton instance
export const universalDocumentState = new UniversalDocumentStateManager();

export default universalDocumentState;