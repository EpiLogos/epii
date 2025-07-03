/**
 * useEpii Hook - Compatibility Layer
 * 
 * Provides the same interface as the original EpiiContext-based useEpii hook
 * but powered by the universal AG-UI StateDelta event system.
 * 
 * This maintains backward compatibility while migrating to universal state management.
 */

import { useCallback } from 'react';
import { useUniversalDocumentState } from './useUniversalDocumentState';

// Legacy action types for compatibility
export type EpiiAction = 
  | { type: 'SET_DOCUMENTS'; payload: any[] }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: string | null }
  | { type: 'ADD_DOCUMENT'; payload: any }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; [key: string]: any } }
  | { type: 'UPDATE_DOCUMENT_METADATA'; payload: { id: string; name?: string; bimbaCoordinate?: string } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_CURRENT_SELECTION'; payload: any }
  | { type: 'ADD_SELECTION'; payload: any }
  | { type: 'UPDATE_SELECTION'; payload: { id: string; [key: string]: any } }
  | { type: 'DELETE_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATUS_MESSAGE'; payload: string | null }
  | { type: 'START_ANALYSIS_SESSION'; payload: { name: string; documentId: string } }
  | { type: 'UPDATE_ANALYSIS_SESSION'; payload: { id: string; [key: string]: any } }
  | { type: 'SET_CURRENT_SESSION'; payload: string | null }
  | { type: 'ADD_CHAT_MESSAGE'; payload: any };

/**
 * Legacy useEpii hook interface for backward compatibility
 */
export const useEpii = () => {
  const documentState = useUniversalDocumentState();

  // Create dispatch function that maps old actions to new state methods
  const dispatch = useCallback((action: EpiiAction) => {
    console.log('[useEpii] Legacy action dispatched:', action.type);

    switch (action.type) {
      case 'SET_DOCUMENTS':
        // This is typically handled by the universal state manager automatically
        console.warn('[useEpii] SET_DOCUMENTS is deprecated. Documents are managed automatically.');
        break;

      case 'SET_CURRENT_DOCUMENT':
        documentState.setCurrentDocument(action.payload);
        break;

      case 'ADD_DOCUMENT':
        documentState.addDocument(action.payload);
        break;

      case 'UPDATE_DOCUMENT': {
        const { id, ...updates } = action.payload;
        documentState.updateDocument(id, updates);
        break;
      }

      case 'UPDATE_DOCUMENT_METADATA': {
        const { id, ...metadata } = action.payload;
        documentState.updateDocument(id, metadata);
        break;
      }

      case 'DELETE_DOCUMENT':
        documentState.deleteDocument(action.payload);
        break;

      case 'SET_CURRENT_SELECTION':
        documentState.setCurrentSelection(action.payload);
        break;

      case 'ADD_SELECTION':
        documentState.addSelection(action.payload);
        break;

      case 'UPDATE_SELECTION': {
        const { id, ...updates } = action.payload;
        documentState.updateSelection(id, updates);
        break;
      }

      case 'DELETE_SELECTION':
        documentState.deleteSelection(action.payload);
        break;

      case 'CLEAR_SELECTIONS':
        documentState.clearSelections();
        break;

      case 'SET_LOADING':
        documentState.setLoading(action.payload);
        break;

      case 'SET_ERROR':
        documentState.setError(action.payload);
        break;

      case 'SET_STATUS_MESSAGE':
        documentState.setStatusMessage(action.payload);
        break;

      case 'START_ANALYSIS_SESSION': {
        const { name, documentId } = action.payload;
        documentState.createAnalysisSession(name, documentId);
        break;
      }

      case 'UPDATE_ANALYSIS_SESSION': {
        const { id, ...updates } = action.payload;
        documentState.updateAnalysisSession(id, updates);
        break;
      }

      case 'SET_CURRENT_SESSION':
        documentState.setCurrentSession(action.payload);
        break;

      case 'ADD_CHAT_MESSAGE':
        documentState.addChatMessage(action.payload);
        break;

      default:
        console.warn('[useEpii] Unknown action type:', (action as any).type);
    }
  }, [documentState]);

  // Return legacy-compatible interface
  return {
    state: {
      // Convert universal state to legacy format
      documents: documentState.documents,
      currentDocumentId: documentState.currentDocumentId,
      currentSelection: documentState.currentSelection,
      selections: documentState.selections,
      analysisSessions: documentState.analysisSessions,
      currentSessionId: documentState.currentSessionId,
      chatMessages: documentState.chatMessages,
      isLoading: documentState.isLoading,
      error: documentState.error,
      statusMessage: documentState.statusMessage
    },
    dispatch
  };
};

/**
 * Legacy useEpiiAnalysis hook for backward compatibility
 */
export const useEpiiAnalysis = () => {
  const documentState = useUniversalDocumentState();

  return {
    // Analysis-specific state
    analysisSessions: documentState.analysisSessions,
    currentSession: documentState.currentSession,
    currentSessionId: documentState.currentSessionId,
    
    // Analysis-specific actions
    createSession: documentState.createAnalysisSession,
    updateSession: documentState.updateAnalysisSession,
    deleteSession: documentState.deleteAnalysisSession,
    setCurrentSession: documentState.setCurrentSession,
    
    // Related state
    currentDocument: documentState.currentDocument,
    selections: documentState.selections,
    
    // Utilities
    getSessionsByDocument: documentState.getSessionsByDocument,
    getSelectionsByDocument: documentState.getSelectionsByDocument
  };
};

export default useEpii;