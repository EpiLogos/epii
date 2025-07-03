/**
 * EpiiStateService - Service Layer State Management
 * 
 * This service handles complex async operations and event coordination outside React's
 * dependency system, providing a clean, predictable API for React components.
 * 
 * Architectural Pattern: Service Layer for Holographic Subsystem State Management
 * - Complex async operations handled in service layer
 * - Clean React hook API over service
 * - AG-UI event bridging for global coordination
 * - Maintains subsystem completeness while enabling universal interfaces
 */

import { EventEmitter } from 'events';
import { 
  EpiiState, 
  Document, 
  TextSelection, 
  AnalysisSession,
  ChatMessage 
} from '../0_foundation/epiiTypes';
import { emitAGUIEvent, onAGUIEvent, offAGUIEvent } from '../../../epi-logos-system/3_services/webSocketService';
import documentService from './documentService';
import { saveDocument, saveAnalysisSession, saveChatMessage } from '../0_foundation/epiiDocStore';

export interface EpiiStateServiceConfig {
  enableAGUIEvents: boolean;
  enablePersistence: boolean;
  debugMode: boolean;
}

export interface DocumentOperation {
  type: 'create' | 'update' | 'delete' | 'coordinate_update';
  documentId?: string;
  document?: Partial<Document>;
  coordinate?: string;
  metadata?: any;
}

export interface SelectionOperation {
  type: 'add' | 'update' | 'remove' | 'clear';
  selection?: TextSelection;
  selectionId?: string;
  updates?: Partial<TextSelection>;
}

export interface AnalysisOperation {
  type: 'create' | 'update' | 'start' | 'complete';
  sessionId?: string;
  session?: Partial<AnalysisSession>;
  documentId?: string;
  targetCoordinate?: string;
}

class EpiiStateService extends EventEmitter {
  private state: EpiiState;
  private config: EpiiStateServiceConfig;
  private listeners: Map<string, Function> = new Map();

  constructor(config: Partial<EpiiStateServiceConfig> = {}) {
    super();
    
    this.config = {
      enableAGUIEvents: true,
      enablePersistence: true,
      debugMode: false,
      ...config
    };

    // Initialize state
    this.state = this.getInitialState();
    
    // Set up AG-UI event bridging if enabled
    if (this.config.enableAGUIEvents) {
      this.setupAGUIEventBridging();
    }

    this.log('EpiiStateService initialized');
  }

  /**
   * Get initial state - combines localStorage and default values
   */
  private getInitialState(): EpiiState {
    const initialState: EpiiState = {
      // Document state
      documents: [],
      currentDocumentId: null,

      // Selection state
      currentSelection: null,
      selections: [],

      // Analysis state
      analysisSessions: [],
      currentSessionId: null,

      // Chat state (will be deprecated in favor of universal agent)
      chatMessages: [],

      // UI state
      isLoading: false,
      error: null,
      statusMessage: null
    };

    // Load persisted state if enabled
    if (this.config.enablePersistence) {
      // TODO: Load from localStorage/indexedDB
      // For now, return initial state
    }

    return initialState;
  }

  /**
   * Set up AG-UI event bridging for global coordination
   */
  private setupAGUIEventBridging(): void {
    // Listen for document state changes from other subsystems
    onAGUIEvent('document:created', this.handleDocumentCreated.bind(this));
    onAGUIEvent('document:updated', this.handleDocumentUpdated.bind(this));
    onAGUIEvent('document:deleted', this.handleDocumentDeleted.bind(this));
    onAGUIEvent('selection:created', this.handleSelectionCreated.bind(this));
    
    this.log('AG-UI event bridging established');
  }

  /**
   * Clean up event listeners
   */
  public destroy(): void {
    if (this.config.enableAGUIEvents) {
      offAGUIEvent('document:created', this.handleDocumentCreated.bind(this));
      offAGUIEvent('document:updated', this.handleDocumentUpdated.bind(this));
      offAGUIEvent('document:deleted', this.handleDocumentDeleted.bind(this));
      offAGUIEvent('selection:created', this.handleSelectionCreated.bind(this));
    }
    
    this.removeAllListeners();
    this.log('EpiiStateService destroyed');
  }

  /**
   * Get current state (for React hooks)
   */
  public getState(): EpiiState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes (for React hooks)
   */
  public subscribe(listener: (state: EpiiState) => void): () => void {
    const eventName = 'stateChange';
    this.on(eventName, listener);
    
    return () => {
      this.off(eventName, listener);
    };
  }

  /**
   * Emit state change to subscribers
   */
  private emitStateChange(): void {
    this.emit('stateChange', this.getState());
    
    if (this.config.enableAGUIEvents) {
      // Emit AG-UI StateDelta event for global coordination
      emitAGUIEvent('StateDelta', {
        subsystem: 'epii',
        stateType: 'document',
        currentDocumentId: this.state.currentDocumentId,
        documentCount: this.state.documents.length,
        selectionCount: this.state.selections.length,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Handle complex document operations outside React constraints
   */
  public async handleDocumentOperation(operation: DocumentOperation): Promise<void> {
    this.log('Handling document operation:', operation.type);
    
    try {
      switch (operation.type) {
        case 'create':
          await this.createDocument(operation.document!);
          break;
        case 'update':
          await this.updateDocument(operation.documentId!, operation.document!);
          break;
        case 'delete':
          await this.deleteDocument(operation.documentId!);
          break;
        case 'coordinate_update':
          await this.updateDocumentCoordinate(operation.documentId!, operation.coordinate!);
          break;
      }
    } catch (error) {
      this.handleError('Document operation failed', error);
    }
  }

  /**
   * Handle complex selection operations
   */
  public async handleSelectionOperation(operation: SelectionOperation): Promise<void> {
    this.log('Handling selection operation:', operation.type);
    
    switch (operation.type) {
      case 'add':
        this.addSelection(operation.selection!);
        break;
      case 'update':
        this.updateSelection(operation.selectionId!, operation.updates!);
        break;
      case 'remove':
        this.removeSelection(operation.selectionId!);
        break;
      case 'clear':
        this.clearSelections();
        break;
    }
  }

  /**
   * Handle analysis operations
   */
  public async handleAnalysisOperation(operation: AnalysisOperation): Promise<void> {
    this.log('Handling analysis operation:', operation.type);
    
    try {
      switch (operation.type) {
        case 'create':
          await this.createAnalysisSession(operation.documentId!, operation.targetCoordinate);
          break;
        case 'start':
          await this.startAnalysis(operation.sessionId!);
          break;
        case 'update':
          this.updateAnalysisSession(operation.sessionId!, operation.session!);
          break;
        case 'complete':
          this.completeAnalysisSession(operation.sessionId!);
          break;
      }
    } catch (error) {
      this.handleError('Analysis operation failed', error);
    }
  }

  // Document operations
  private async createDocument(documentData: Partial<Document>): Promise<void> {
    const newDocument: Document = {
      id: documentData.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: documentData.name || 'Untitled Document',
      textContent: documentData.textContent || '',
      content: documentData.content || documentData.textContent || '',
      documentType: documentData.documentType || 'bimba',
      bimbaCoordinate: documentData.bimbaCoordinate || '',
      isTemporary: documentData.isTemporary || false,
      lastModified: new Date(),
      createdAt: new Date(),
      versions: [],
      ...documentData
    } as Document;

    this.state = {
      ...this.state,
      documents: [...this.state.documents, newDocument],
      currentDocumentId: newDocument.id
    };

    // Persist if enabled
    if (this.config.enablePersistence && newDocument.isTemporary) {
      saveDocument(newDocument);
    }

    this.emitStateChange();
    this.log('Document created:', newDocument.id);
  }

  private async updateDocument(documentId: string, updates: Partial<Document>): Promise<void> {
    const documentIndex = this.state.documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      throw new Error(`Document ${documentId} not found`);
    }

    const updatedDocument = {
      ...this.state.documents[documentIndex],
      ...updates,
      lastModified: new Date()
    };

    const newDocuments = [...this.state.documents];
    newDocuments[documentIndex] = updatedDocument;

    this.state = {
      ...this.state,
      documents: newDocuments
    };

    // Persist if enabled and temporary
    if (this.config.enablePersistence && updatedDocument.isTemporary) {
      saveDocument(updatedDocument);
    }

    this.emitStateChange();
    this.log('Document updated:', documentId);
  }

  private async deleteDocument(documentId: string): Promise<void> {
    this.state = {
      ...this.state,
      documents: this.state.documents.filter(doc => doc.id !== documentId),
      currentDocumentId: this.state.currentDocumentId === documentId ? null : this.state.currentDocumentId,
      selections: this.state.selections.filter(sel => sel.documentId !== documentId)
    };

    this.emitStateChange();
    this.log('Document deleted:', documentId);
  }

  private async updateDocumentCoordinate(documentId: string, coordinate: string): Promise<void> {
    await this.updateDocument(documentId, { bimbaCoordinate: coordinate });
  }

  // Selection operations
  private addSelection(selectionData: Omit<TextSelection, 'id' | 'timestamp'>): void {
    const newSelection: TextSelection = {
      id: `sel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...selectionData
    };

    this.state = {
      ...this.state,
      selections: [...this.state.selections, newSelection],
      currentSelection: newSelection
    };

    this.emitStateChange();
    this.log('Selection added:', newSelection.id);
  }

  private updateSelection(selectionId: string, updates: Partial<TextSelection>): void {
    const selectionIndex = this.state.selections.findIndex(sel => sel.id === selectionId);
    if (selectionIndex === -1) return;

    const updatedSelection = {
      ...this.state.selections[selectionIndex],
      ...updates
    };

    const newSelections = [...this.state.selections];
    newSelections[selectionIndex] = updatedSelection;

    this.state = {
      ...this.state,
      selections: newSelections,
      currentSelection: this.state.currentSelection?.id === selectionId ? updatedSelection : this.state.currentSelection
    };

    this.emitStateChange();
    this.log('Selection updated:', selectionId);
  }

  private removeSelection(selectionId: string): void {
    this.state = {
      ...this.state,
      selections: this.state.selections.filter(sel => sel.id !== selectionId),
      currentSelection: this.state.currentSelection?.id === selectionId ? null : this.state.currentSelection
    };

    this.emitStateChange();
    this.log('Selection removed:', selectionId);
  }

  private clearSelections(): void {
    this.state = {
      ...this.state,
      selections: [],
      currentSelection: null
    };

    this.emitStateChange();
    this.log('Selections cleared');
  }

  // Analysis operations
  private async createAnalysisSession(documentId: string, targetCoordinate?: string): Promise<void> {
    const document = this.state.documents.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const newSession: AnalysisSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Analysis of ${document.name}`,
      documentId,
      targetCoordinate: targetCoordinate || document.bimbaCoordinate,
      status: 'created',
      results: null,
      lastModified: new Date(),
      createdAt: new Date()
    };

    this.state = {
      ...this.state,
      analysisSessions: [...this.state.analysisSessions, newSession],
      currentSessionId: newSession.id
    };

    if (this.config.enablePersistence) {
      saveAnalysisSession(newSession);
    }

    this.emitStateChange();
    this.log('Analysis session created:', newSession.id);
  }

  private async startAnalysis(sessionId: string): Promise<void> {
    this.updateAnalysisSession(sessionId, { 
      status: 'running',
      lastModified: new Date()
    });
    
    // Emit AG-UI event to trigger analysis pipeline
    if (this.config.enableAGUIEvents) {
      const session = this.state.analysisSessions.find(s => s.id === sessionId);
      if (session) {
        emitAGUIEvent('ToolCallStart', {
          tool: 'epii-analysis-pipeline',
          sessionId,
          documentId: session.documentId,
          targetCoordinate: session.targetCoordinate
        });
      }
    }
  }

  private updateAnalysisSession(sessionId: string, updates: Partial<AnalysisSession>): void {
    const sessionIndex = this.state.analysisSessions.findIndex(session => session.id === sessionId);
    if (sessionIndex === -1) return;

    const updatedSession = {
      ...this.state.analysisSessions[sessionIndex],
      ...updates,
      lastModified: new Date()
    };

    const newSessions = [...this.state.analysisSessions];
    newSessions[sessionIndex] = updatedSession;

    this.state = {
      ...this.state,
      analysisSessions: newSessions
    };

    if (this.config.enablePersistence) {
      saveAnalysisSession(updatedSession);
    }

    this.emitStateChange();
    this.log('Analysis session updated:', sessionId);
  }

  private completeAnalysisSession(sessionId: string): void {
    this.updateAnalysisSession(sessionId, { 
      status: 'completed',
      lastModified: new Date()
    });
  }

  // AG-UI event handlers
  private handleDocumentCreated(event: any): void {
    this.log('AG-UI event: document created', event);
    // Handle external document creation
  }

  private handleDocumentUpdated(event: any): void {
    this.log('AG-UI event: document updated', event);
    // Handle external document updates
  }

  private handleDocumentDeleted(event: any): void {
    this.log('AG-UI event: document deleted', event);
    // Handle external document deletion
  }

  private handleSelectionCreated(event: any): void {
    this.log('AG-UI event: selection created', event);
    // Handle external selection creation
  }

  // Utility methods
  private handleError(message: string, error: any): void {
    this.state = {
      ...this.state,
      error: message,
      isLoading: false
    };
    
    this.emitStateChange();
    this.log('Error:', message, error);
  }

  private log(...args: any[]): void {
    if (this.config.debugMode) {
      console.log('[EpiiStateService]', ...args);
    }
  }

  // Public API methods for React hooks
  public setCurrentDocument(documentId: string | null): void {
    this.state = {
      ...this.state,
      currentDocumentId: documentId
    };
    this.emitStateChange();
  }

  public setLoading(isLoading: boolean): void {
    this.state = {
      ...this.state,
      isLoading
    };
    this.emitStateChange();
  }

  public setError(error: string | null): void {
    this.state = {
      ...this.state,
      error
    };
    this.emitStateChange();
  }

  public setStatusMessage(message: string | null): void {
    this.state = {
      ...this.state,
      statusMessage: message
    };
    this.emitStateChange();
  }
}

// Singleton instance
let epiiStateServiceInstance: EpiiStateService | null = null;

export function getEpiiStateService(): EpiiStateService {
  if (!epiiStateServiceInstance) {
    epiiStateServiceInstance = new EpiiStateService({
      enableAGUIEvents: true,
      enablePersistence: true,
      debugMode: true // Enable for development
    });
  }
  return epiiStateServiceInstance;
}

export function destroyEpiiStateService(): void {
  if (epiiStateServiceInstance) {
    epiiStateServiceInstance.destroy();
    epiiStateServiceInstance = null;
  }
}

export default EpiiStateService;