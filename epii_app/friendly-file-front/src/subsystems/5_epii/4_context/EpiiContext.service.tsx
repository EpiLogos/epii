/**
 * Service-Layer Based EpiiContext
 * 
 * This is the new service-layer based implementation of EpiiContext that provides
 * a clean, predictable API over the EpiiStateService. This follows the holographic
 * architecture pattern where complex logic is handled in services, and React hooks
 * provide simple, stable APIs.
 * 
 * Architectural Benefits:
 * - Eliminates React dependency complexity and temporal dead zone errors
 * - Enables complex async coordination outside React's constraint system
 * - Provides stable, testable APIs independent of React lifecycles
 * - Supports AG-UI event bridging for global coordination
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EpiiState, Document, TextSelection, AnalysisSession } from '../0_foundation/epiiTypes';
import { getEpiiStateService, DocumentOperation, SelectionOperation, AnalysisOperation } from '../1_services/EpiiStateService';

// Service instance
const epiiStateService = getEpiiStateService();

// Simplified context interface
interface EpiiContextValue {
  // State (read-only for components)
  state: EpiiState;
  
  // Document operations
  createDocument: (document: Partial<Document>) => Promise<void>;
  updateDocument: (documentId: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  setCurrentDocument: (documentId: string | null) => void;
  updateDocumentCoordinate: (documentId: string, coordinate: string) => Promise<void>;
  
  // Selection operations
  addSelection: (selection: Omit<TextSelection, 'id' | 'timestamp'>) => void;
  updateSelection: (selectionId: string, updates: Partial<TextSelection>) => void;
  removeSelection: (selectionId: string) => void;
  clearSelections: () => void;
  setCurrentSelection: (selection: TextSelection | null) => void;
  
  // Analysis operations
  createAnalysisSession: (documentId: string, targetCoordinate?: string) => Promise<void>;
  startAnalysis: (sessionId: string) => Promise<void>;
  updateAnalysisSession: (sessionId: string, updates: Partial<AnalysisSession>) => void;
  completeAnalysisSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  
  // UI state operations
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusMessage: (message: string | null) => void;
  
  // Legacy dispatch for backward compatibility (will be phased out)
  dispatch: (action: any) => void;
}

// Create context
const EpiiContext = createContext<EpiiContextValue | undefined>(undefined);

// Provider component
export const EpiiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EpiiState>(epiiStateService.getState());

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = epiiStateService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Document operations
  const createDocument = useCallback(async (document: Partial<Document>) => {
    const operation: DocumentOperation = {
      type: 'create',
      document
    };
    await epiiStateService.handleDocumentOperation(operation);
  }, []);

  const updateDocument = useCallback(async (documentId: string, updates: Partial<Document>) => {
    const operation: DocumentOperation = {
      type: 'update',
      documentId,
      document: updates
    };
    await epiiStateService.handleDocumentOperation(operation);
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    const operation: DocumentOperation = {
      type: 'delete',
      documentId
    };
    await epiiStateService.handleDocumentOperation(operation);
  }, []);

  const setCurrentDocument = useCallback((documentId: string | null) => {
    epiiStateService.setCurrentDocument(documentId);
  }, []);

  const updateDocumentCoordinate = useCallback(async (documentId: string, coordinate: string) => {
    const operation: DocumentOperation = {
      type: 'coordinate_update',
      documentId,
      coordinate
    };
    await epiiStateService.handleDocumentOperation(operation);
  }, []);

  // Selection operations
  const addSelection = useCallback((selection: Omit<TextSelection, 'id' | 'timestamp'>) => {
    const operation: SelectionOperation = {
      type: 'add',
      selection
    };
    epiiStateService.handleSelectionOperation(operation);
  }, []);

  const updateSelection = useCallback((selectionId: string, updates: Partial<TextSelection>) => {
    const operation: SelectionOperation = {
      type: 'update',
      selectionId,
      updates
    };
    epiiStateService.handleSelectionOperation(operation);
  }, []);

  const removeSelection = useCallback((selectionId: string) => {
    const operation: SelectionOperation = {
      type: 'remove',
      selectionId
    };
    epiiStateService.handleSelectionOperation(operation);
  }, []);

  const clearSelections = useCallback(() => {
    const operation: SelectionOperation = {
      type: 'clear'
    };
    epiiStateService.handleSelectionOperation(operation);
  }, []);

  const setCurrentSelection = useCallback((selection: TextSelection | null) => {
    // Direct state update for current selection (simple case)
    // This could be moved to service if needed
  }, []);

  // Analysis operations
  const createAnalysisSession = useCallback(async (documentId: string, targetCoordinate?: string) => {
    const operation: AnalysisOperation = {
      type: 'create',
      documentId,
      targetCoordinate
    };
    await epiiStateService.handleAnalysisOperation(operation);
  }, []);

  const startAnalysis = useCallback(async (sessionId: string) => {
    const operation: AnalysisOperation = {
      type: 'start',
      sessionId
    };
    await epiiStateService.handleAnalysisOperation(operation);
  }, []);

  const updateAnalysisSession = useCallback((sessionId: string, updates: Partial<AnalysisSession>) => {
    const operation: AnalysisOperation = {
      type: 'update',
      sessionId,
      session: updates
    };
    epiiStateService.handleAnalysisOperation(operation);
  }, []);

  const completeAnalysisSession = useCallback((sessionId: string) => {
    const operation: AnalysisOperation = {
      type: 'complete',
      sessionId
    };
    epiiStateService.handleAnalysisOperation(operation);
  }, []);

  const setCurrentSession = useCallback((sessionId: string | null) => {
    // Direct state update for current session
    // This could be moved to service if needed
  }, []);

  // UI state operations
  const setLoading = useCallback((isLoading: boolean) => {
    epiiStateService.setLoading(isLoading);
  }, []);

  const setError = useCallback((error: string | null) => {
    epiiStateService.setError(error);
  }, []);

  const setStatusMessage = useCallback((message: string | null) => {
    epiiStateService.setStatusMessage(message);
  }, []);

  // Legacy dispatch for backward compatibility
  const dispatch = useCallback((action: any) => {
    console.warn('[EpiiContext] Legacy dispatch called. Please migrate to service layer APIs:', action);
    
    // Map some common actions to new APIs for backward compatibility
    switch (action.type) {
      case 'SET_CURRENT_DOCUMENT':
        setCurrentDocument(action.payload);
        break;
      case 'SET_LOADING':
        setLoading(action.payload);
        break;
      case 'SET_ERROR':
        setError(action.payload);
        break;
      case 'SET_STATUS_MESSAGE':
        setStatusMessage(action.payload?.text || action.payload);
        break;
      default:
        console.warn('[EpiiContext] Unmapped legacy action:', action.type);
    }
  }, [setCurrentDocument, setLoading, setError, setStatusMessage]);

  const contextValue: EpiiContextValue = {
    state,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
    updateDocumentCoordinate,
    addSelection,
    updateSelection,
    removeSelection,
    clearSelections,
    setCurrentSelection,
    createAnalysisSession,
    startAnalysis,
    updateAnalysisSession,
    completeAnalysisSession,
    setCurrentSession,
    setLoading,
    setError,
    setStatusMessage,
    dispatch
  };

  return (
    <EpiiContext.Provider value={contextValue}>
      {children}
    </EpiiContext.Provider>
  );
};

// Hook for using the context
export const useEpii = () => {
  const context = useContext(EpiiContext);
  if (context === undefined) {
    throw new Error('useEpii must be used within an EpiiProvider');
  }
  return context;
};

// Helper hooks for specific functionality
export const useEpiiDocuments = () => {
  const { state, createDocument, updateDocument, deleteDocument, setCurrentDocument } = useEpii();
  return {
    documents: state.documents,
    currentDocument: state.documents.find(doc => doc.id === state.currentDocumentId) || null,
    currentDocumentId: state.currentDocumentId,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument
  };
};

export const useEpiiSelections = () => {
  const { state, addSelection, updateSelection, removeSelection, clearSelections } = useEpii();
  return {
    selections: state.selections,
    currentSelection: state.currentSelection,
    addSelection,
    updateSelection,
    removeSelection,
    clearSelections
  };
};

export const useEpiiAnalysis = () => {
  const { state, createAnalysisSession, startAnalysis, updateAnalysisSession, completeAnalysisSession } = useEpii();
  return {
    analysisSessions: state.analysisSessions,
    currentSessionId: state.currentSessionId,
    currentSession: state.analysisSessions.find(session => session.id === state.currentSessionId) || null,
    createAnalysisSession,
    startAnalysis,
    updateAnalysisSession,
    completeAnalysisSession
  };
};

export const useEpiiUI = () => {
  const { state, setLoading, setError, setStatusMessage } = useEpii();
  return {
    isLoading: state.isLoading,
    error: state.error,
    statusMessage: state.statusMessage,
    setLoading,
    setError,
    setStatusMessage
  };
};