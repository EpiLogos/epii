/**
 * Document Operations Service
 * Provides programmatic API for document operations that can be triggered by the FloatingAgent
 * Coordinate: #5-1-2.5
 */

import universalDocumentState from './universalDocumentState';
import { emitAGUIEvent } from './webSocketService';
import { TextSelection } from '../0_foundation/epiiTypes';

export interface DocumentOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreatePratibimbaOptions {
  sourceDocumentId: string;
  selection: TextSelection;
  name?: string;
}

export interface AnalysisOptions {
  documentId: string;
  targetCoordinate?: string;
  analysisType?: 'standard' | 'deep' | 'quick';
}

export interface CrystallizationOptions {
  sessionId: string;
  targetCoordinate?: string;
}

/**
 * Document Operations Service
 * Enables programmatic control of document operations for agent workflows
 */
class DocumentOperationsService {
  /**
   * Create a new document programmatically
   */
  async createDocument(options: {
    name: string;
    content: string;
    coordinate?: string;
    documentType?: 'bimba' | 'pratibimba';
  }): Promise<DocumentOperationResult> {
    try {
      const newDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: options.name,
        textContent: options.content,
        documentType: options.documentType || 'bimba',
        bimbaCoordinate: options.coordinate || '#5',
        targetCoordinate: options.coordinate || '#5',
        isTemporary: false,
        lastModified: new Date(),
        createdAt: new Date(),
        versions: [],
        metadata: {
          createdBy: 'FloatingAgent',
          creationMethod: 'programmatic'
        }
      };

      universalDocumentState.upsertDocument(newDocument);
      universalDocumentState.setCurrentDocument(newDocument.id);

      // Emit AG-UI event
      emitAGUIEvent('DocumentCreated', {
        documentId: newDocument.id,
        documentName: newDocument.name,
        documentType: newDocument.documentType,
        targetCoordinate: newDocument.bimbaCoordinate,
        source: 'programmatic'
      });

      return {
        success: true,
        message: `Document "${options.name}" created successfully`,
        data: { documentId: newDocument.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create document: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create a pratibimba document from a text selection
   */
  async createPratibimba(options: CreatePratibimbaOptions): Promise<DocumentOperationResult> {
    try {
      const sourceDocument = universalDocumentState.getState().documents.find(
        doc => doc.id === options.sourceDocumentId
      );

      if (!sourceDocument) {
        return {
          success: false,
          message: 'Source document not found'
        };
      }

      const pratibimbaName = options.name || `Crystallization of ${sourceDocument.name}`;
      
      const pratibimbaDoc = {
        id: `pratibimba_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: pratibimbaName,
        textContent: options.selection.text,
        documentType: 'pratibimba' as const,
        bimbaCoordinate: sourceDocument.bimbaCoordinate,
        targetCoordinate: sourceDocument.targetCoordinate || sourceDocument.bimbaCoordinate,
        isTemporary: false,
        lastModified: new Date(),
        createdAt: new Date(),
        versions: [],
        metadata: {
          bimbaId: options.sourceDocumentId,
          sourceSelection: options.selection,
          crystallizationIntent: 'Agent-guided crystallization',
          createdBy: 'FloatingAgent'
        }
      };

      universalDocumentState.upsertDocument(pratibimbaDoc);

      // Emit AG-UI event
      emitAGUIEvent('DocumentCreated', {
        documentId: pratibimbaDoc.id,
        documentName: pratibimbaDoc.name,
        documentType: 'pratibimba',
        targetCoordinate: pratibimbaDoc.bimbaCoordinate,
        sourceDocumentId: options.sourceDocumentId,
        source: 'crystallization'
      });

      return {
        success: true,
        message: `Crystallization "${pratibimbaName}" created successfully`,
        data: { documentId: pratibimbaDoc.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create crystallization: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Start analysis for a document
   */
  async startAnalysis(options: AnalysisOptions): Promise<DocumentOperationResult> {
    try {
      const state = universalDocumentState.getState();
      const document = state.documents.find(doc => doc.id === options.documentId);

      if (!document) {
        return {
          success: false,
          message: 'Document not found'
        };
      }

      const targetCoordinate = options.targetCoordinate || document.targetCoordinate || document.bimbaCoordinate;

      // Create analysis session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const session = {
        id: sessionId,
        documentId: options.documentId,
        name: `Analysis of ${document.name}`,
        selections: [],
        analysisType: options.analysisType || 'standard',
        targetCoordinate,
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'processing',
        metadata: {
          triggeredBy: 'FloatingAgent'
        }
      };

      // Add session to universal state (this would need to be implemented in the universal state)
      // For now, emit the AG-UI event to trigger backend analysis
      const analysisStarted = emitAGUIEvent('AnalysisRequested', {
        documentId: options.documentId,
        sessionId,
        targetCoordinate,
        analysisType: options.analysisType || 'standard',
        documentMetadata: {
          name: document.name,
          type: document.documentType,
          contentLength: document.textContent?.length || 0
        }
      });

      if (analysisStarted) {
        return {
          success: true,
          message: `Analysis started for document "${document.name}"`,
          data: { sessionId, targetCoordinate }
        };
      } else {
        return {
          success: false,
          message: 'Failed to start analysis - WebSocket communication error'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to start analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Crystallize analysis results to Notion
   */
  async crystallizeResults(options: CrystallizationOptions): Promise<DocumentOperationResult> {
    try {
      // Emit AG-UI event to trigger crystallization workflow
      const crystallizationStarted = emitAGUIEvent('CrystallizationRequested', {
        sessionId: options.sessionId,
        targetCoordinate: options.targetCoordinate,
        source: 'FloatingAgent'
      });

      if (crystallizationStarted) {
        return {
          success: true,
          message: 'Crystallization process started',
          data: { sessionId: options.sessionId }
        };
      } else {
        return {
          success: false,
          message: 'Failed to start crystallization - WebSocket communication error'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to crystallize results: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Save document programmatically
   */
  async saveDocument(documentId: string): Promise<DocumentOperationResult> {
    try {
      const state = universalDocumentState.getState();
      const document = state.documents.find(doc => doc.id === documentId);

      if (!document) {
        return {
          success: false,
          message: 'Document not found'
        };
      }

      // Update the document's last modified time
      universalDocumentState.upsertDocument({
        ...document,
        lastModified: new Date()
      });

      // Emit AG-UI event for save operation
      emitAGUIEvent('DocumentSaveRequested', {
        documentId,
        documentName: document.name,
        source: 'FloatingAgent'
      });

      return {
        success: true,
        message: `Document "${document.name}" saved successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Delete document programmatically
   */
  async deleteDocument(documentId: string): Promise<DocumentOperationResult> {
    try {
      const state = universalDocumentState.getState();
      const document = state.documents.find(doc => doc.id === documentId);

      if (!document) {
        return {
          success: false,
          message: 'Document not found'
        };
      }

      const documentName = document.name;

      // Remove from universal state
      universalDocumentState.emitStateDelta({
        scope: 'document',
        operation: 'delete',
        documentId,
        changes: {
          documents: state.documents.filter(doc => doc.id !== documentId),
          currentDocumentId: state.currentDocumentId === documentId ? null : state.currentDocumentId
        }
      });

      // Emit AG-UI event for backend deletion
      emitAGUIEvent('DocumentDeleted', {
        documentId,
        documentName,
        source: 'FloatingAgent'
      });

      return {
        success: true,
        message: `Document "${documentName}" deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get current document context for agent awareness
   */
  getCurrentDocumentContext() {
    const state = universalDocumentState.getState();
    const currentDocument = state.currentDocumentId ? 
      state.documents.find(doc => doc.id === state.currentDocumentId) : null;

    return {
      currentDocument,
      totalDocuments: state.documents.length,
      hasSelections: state.selections.length > 0,
      recentDocuments: state.documents
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 5)
    };
  }
}

// Export singleton instance
export const documentOperationsService = new DocumentOperationsService();
export default documentOperationsService;