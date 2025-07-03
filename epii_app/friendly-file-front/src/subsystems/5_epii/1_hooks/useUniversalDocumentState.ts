/**
 * useUniversalDocumentState Hook
 * 
 * React hook that provides the same interface as the old EpiiContext
 * but powered by the universal AG-UI StateDelta event system.
 * 
 * This hook replaces useEpii() and useEpiiAnalysis() hooks.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import universalDocumentState, { 
  UniversalDocumentState, 
  UniversalDocument, 
  DocumentSelection, 
  AnalysisSession,
  ChatMessage 
} from '../1_services/universalDocumentState';

export interface DocumentStateHook {
  // State
  state: UniversalDocumentState;
  
  // Document management
  documents: UniversalDocument[];
  currentDocument: UniversalDocument | null;
  currentDocumentId: string | null;
  
  // Selection management
  selections: DocumentSelection[];
  currentSelection: DocumentSelection | null;
  
  // Analysis sessions
  analysisSessions: AnalysisSession[];
  currentSessionId: string | null;
  currentSession: AnalysisSession | null;
  
  // Chat messages (deprecated in favor of universal agent)
  chatMessages: ChatMessage[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  statusMessage: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  
  // Actions - Documents
  setCurrentDocument: (documentId: string | null) => void;
  addDocument: (document: Partial<UniversalDocument>) => void;
  updateDocument: (documentId: string, updates: Partial<UniversalDocument>) => void;
  deleteDocument: (documentId: string) => void;
  
  // Actions - Selections
  addSelection: (selection: Omit<DocumentSelection, 'id' | 'timestamp'>) => void;
  updateSelection: (selectionId: string, updates: Partial<DocumentSelection>) => void;
  deleteSelection: (selectionId: string) => void;
  setCurrentSelection: (selection: DocumentSelection | null) => void;
  clearSelections: () => void;
  
  // Actions - Analysis Sessions
  createAnalysisSession: (name: string, documentId: string, selections?: string[]) => string;
  updateAnalysisSession: (sessionId: string, updates: Partial<AnalysisSession>) => void;
  deleteAnalysisSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  
  // Actions - Chat (deprecated)
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
  
  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusMessage: (message: string | null) => void;
  
  // Utilities
  getDocumentById: (documentId: string) => UniversalDocument | null;
  getDocumentsByCoordinate: (coordinate: string) => UniversalDocument[];
  getSelectionsByDocument: (documentId: string) => DocumentSelection[];
  getSessionsByDocument: (documentId: string) => AnalysisSession[];
  
  // Sync
  refresh: () => Promise<void>;
  forceSync: () => Promise<void>;
}

export const useUniversalDocumentState = (): DocumentStateHook => {
  const [state, setState] = useState<UniversalDocumentState>(universalDocumentState.getState());
  const initializationRef = useRef<Promise<void> | null>(null);

  // Initialize universal document state if needed
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = universalDocumentState.initialize();
    }
  }, []);

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = universalDocumentState.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Document management actions
  const setCurrentDocument = useCallback((documentId: string | null) => {
    universalDocumentState.setCurrentDocument(documentId);
  }, []);

  const addDocument = useCallback((document: Partial<UniversalDocument>) => {
    const newDocument: UniversalDocument = {
      id: document.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: document.name || 'Untitled Document',
      textContent: document.textContent || '',
      content: document.content || document.textContent || '',
      documentType: document.documentType || 'bimba',
      bimbaCoordinate: document.bimbaCoordinate || '',
      isTemporary: document.isTemporary || false,
      lastModified: new Date(),
      createdAt: new Date(),
      versions: [],
      ...document
    };

    universalDocumentState.upsertDocument(newDocument);
  }, []);

  const updateDocument = useCallback((documentId: string, updates: Partial<UniversalDocument>) => {
    const existing = state.documents.find(doc => doc.id === documentId || doc._id === documentId);
    if (!existing) {
      console.warn(`[useUniversalDocumentState] Document ${documentId} not found for update`);
      return;
    }

    const updatedDocument = { ...existing, ...updates, lastModified: new Date() };
    universalDocumentState.upsertDocument(updatedDocument);
  }, [state.documents]);

  const deleteDocument = useCallback((documentId: string) => {
    universalDocumentState.emitStateDelta({
      scope: 'document',
      operation: 'delete',
      documentId,
      changes: {
        documents: state.documents.filter(doc => doc.id !== documentId && doc._id !== documentId),
        currentDocumentId: state.currentDocumentId === documentId ? null : state.currentDocumentId
      }
    });
  }, [state.documents, state.currentDocumentId]);

  // Selection management actions
  const addSelection = useCallback((selection: Omit<DocumentSelection, 'id' | 'timestamp'>) => {
    const newSelection: DocumentSelection = {
      ...selection,
      id: `sel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    const updatedSelections = [...state.selections, newSelection];
    
    universalDocumentState.emitStateDelta({
      scope: 'selection',
      operation: 'create',
      selectionId: newSelection.id,
      changes: { selections: updatedSelections }
    });
  }, [state.selections]);

  const updateSelection = useCallback((selectionId: string, updates: Partial<DocumentSelection>) => {
    const updatedSelections = state.selections.map(sel =>
      sel.id === selectionId ? { ...sel, ...updates, timestamp: new Date() } : sel
    );

    universalDocumentState.emitStateDelta({
      scope: 'selection',
      operation: 'update',
      selectionId,
      changes: { selections: updatedSelections }
    });
  }, [state.selections]);

  const deleteSelection = useCallback((selectionId: string) => {
    const updatedSelections = state.selections.filter(sel => sel.id !== selectionId);
    
    universalDocumentState.emitStateDelta({
      scope: 'selection',
      operation: 'delete',
      selectionId,
      changes: { 
        selections: updatedSelections,
        currentSelection: state.currentSelection?.id === selectionId ? null : state.currentSelection
      }
    });
  }, [state.selections, state.currentSelection]);

  const setCurrentSelection = useCallback((selection: DocumentSelection | null) => {
    universalDocumentState.emitStateDelta({
      scope: 'selection',
      operation: 'update',
      changes: { currentSelection: selection }
    });
  }, []);

  const clearSelections = useCallback(() => {
    universalDocumentState.emitStateDelta({
      scope: 'selection',
      operation: 'delete',
      changes: { 
        selections: [],
        currentSelection: null
      }
    });
  }, []);

  // Analysis session actions
  const createAnalysisSession = useCallback((name: string, documentId: string, selections: string[] = []): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: AnalysisSession = {
      id: sessionId,
      documentId,
      name,
      selections,
      createdAt: new Date(),
      lastModified: new Date()
    };

    const updatedSessions = [...state.analysisSessions, newSession];
    
    universalDocumentState.emitStateDelta({
      scope: 'analysis',
      operation: 'create',
      sessionId,
      changes: { 
        analysisSessions: updatedSessions,
        currentSessionId: sessionId
      }
    });

    return sessionId;
  }, [state.analysisSessions]);

  const updateAnalysisSession = useCallback((sessionId: string, updates: Partial<AnalysisSession>) => {
    const updatedSessions = state.analysisSessions.map(session =>
      session.id === sessionId ? { ...session, ...updates, lastModified: new Date() } : session
    );

    universalDocumentState.emitStateDelta({
      scope: 'analysis',
      operation: 'update',
      sessionId,
      changes: { analysisSessions: updatedSessions }
    });
  }, [state.analysisSessions]);

  const deleteAnalysisSession = useCallback((sessionId: string) => {
    const updatedSessions = state.analysisSessions.filter(session => session.id !== sessionId);
    
    universalDocumentState.emitStateDelta({
      scope: 'analysis',
      operation: 'delete',
      sessionId,
      changes: { 
        analysisSessions: updatedSessions,
        currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
      }
    });
  }, [state.analysisSessions, state.currentSessionId]);

  const setCurrentSession = useCallback((sessionId: string | null) => {
    universalDocumentState.emitStateDelta({
      scope: 'analysis',
      operation: 'update',
      changes: { currentSessionId: sessionId }
    });
  }, []);

  // Chat actions (deprecated)
  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    console.warn('[useUniversalDocumentState] addChatMessage is deprecated. Use universal agent instead.');
    
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    const updatedMessages = [...state.chatMessages, newMessage];
    
    universalDocumentState.emitStateDelta({
      scope: 'chat',
      operation: 'create',
      messageId: newMessage.id,
      changes: { chatMessages: updatedMessages }
    });
  }, [state.chatMessages]);

  const clearChatMessages = useCallback(() => {
    console.warn('[useUniversalDocumentState] clearChatMessages is deprecated. Use universal agent instead.');
    
    universalDocumentState.emitStateDelta({
      scope: 'chat',
      operation: 'delete',
      changes: { chatMessages: [] }
    });
  }, []);

  // UI actions
  const setLoading = useCallback((loading: boolean) => {
    universalDocumentState.emitStateDelta({
      scope: 'ui',
      operation: 'update',
      changes: { isLoading: loading }
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    universalDocumentState.emitStateDelta({
      scope: 'ui',
      operation: 'update',
      changes: { error }
    });
  }, []);

  const setStatusMessage = useCallback((statusMessage: string | null) => {
    universalDocumentState.emitStateDelta({
      scope: 'ui',
      operation: 'update',
      changes: { statusMessage }
    });
  }, []);

  // Utility functions
  const getDocumentById = useCallback((documentId: string): UniversalDocument | null => {
    return state.documents.find(doc => doc.id === documentId || doc._id === documentId) || null;
  }, [state.documents]);

  const getDocumentsByCoordinate = useCallback((coordinate: string): UniversalDocument[] => {
    return state.documents.filter(doc => 
      doc.bimbaCoordinate === coordinate || doc.targetCoordinate === coordinate
    );
  }, [state.documents]);

  const getSelectionsByDocument = useCallback((documentId: string): DocumentSelection[] => {
    return state.selections.filter(sel => sel.documentId === documentId);
  }, [state.selections]);

  const getSessionsByDocument = useCallback((documentId: string): AnalysisSession[] => {
    return state.analysisSessions.filter(session => session.documentId === documentId);
  }, [state.analysisSessions]);

  // Sync functions
  const refresh = useCallback(async () => {
    // Trigger a refresh from external sources
    await universalDocumentState.initialize();
  }, []);

  const forceSync = useCallback(async () => {
    setLoading(true);
    try {
      await universalDocumentState.initialize();
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Derived state
  const currentDocument = state.currentDocumentId ? getDocumentById(state.currentDocumentId) : null;
  const currentSession = state.currentSessionId ? 
    state.analysisSessions.find(session => session.id === state.currentSessionId) || null : null;

  return {
    // State
    state,
    
    // Derived state
    documents: state.documents,
    currentDocument,
    currentDocumentId: state.currentDocumentId,
    selections: state.selections,
    currentSelection: state.currentSelection,
    analysisSessions: state.analysisSessions,
    currentSessionId: state.currentSessionId,
    currentSession,
    chatMessages: state.chatMessages,
    isLoading: state.isLoading,
    error: state.error,
    statusMessage: state.statusMessage,
    syncStatus: state.syncStatus,
    
    // Actions
    setCurrentDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    addSelection,
    updateSelection,
    deleteSelection,
    setCurrentSelection,
    clearSelections,
    createAnalysisSession,
    updateAnalysisSession,
    deleteAnalysisSession,
    setCurrentSession,
    addChatMessage,
    clearChatMessages,
    setLoading,
    setError,
    setStatusMessage,
    
    // Utilities
    getDocumentById,
    getDocumentsByCoordinate,
    getSelectionsByDocument,
    getSessionsByDocument,
    refresh,
    forceSync
  };
};

export default useUniversalDocumentState;