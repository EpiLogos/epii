/**
 * Document State Management Service with AG-UI Integration
 * Handles real-time document state updates via AG-UI events
 *
 * This service provides centralized document state management that:
 * 1. Listens for AG-UI document events from the backend
 * 2. Updates local state (EpiiContext, useBimbaCoordinates)
 * 3. Refreshes UI components automatically
 * 4. Eliminates need for manual page refreshes
 */

import { onAGUIEvent, offAGUIEvent } from './webSocketService';
import documentCacheService from './documentCacheService';

// Types for AG-UI document events
interface DocumentCreatedEvent {
  type: 'DocumentCreated';
  documentId: string;
  documentName: string;
  targetCoordinate: string;
  documentType: 'bimba' | 'pratibimba';
  collection: string;
  metadata: any;
}

interface DocumentAnalysisCompletedEvent {
  type: 'DocumentAnalysisCompleted';
  documentId: string;
  targetCoordinate: string;
  analysisResults: any;
  pratibimbaCreated: boolean;
  pratibimbaId?: string;
  memoryIntegration: any;
}

interface CoordinateDocumentsUpdatedEvent {
  type: 'CoordinateDocumentsUpdated';
  targetCoordinate: string;
  documentCount: number;
  documentIds: string[];
  updateType: 'created' | 'updated' | 'deleted' | 'analysis_completed';
}

interface DocumentStateRefreshEvent {
  type: 'DocumentStateRefresh';
  scope: 'all' | 'coordinate' | 'document';
  targetCoordinate?: string;
  documentId?: string;
  reason: string;
}

// State update callbacks
type StateUpdateCallback = () => void;
type CoordinateRefreshCallback = (coordinate: string) => void;
type DocumentUpdateCallback = (documentId: string, changes: any) => void;

class DocumentStateService {
  private stateUpdateCallbacks: StateUpdateCallback[] = [];
  private coordinateRefreshCallbacks: CoordinateRefreshCallback[] = [];
  private documentUpdateCallbacks: DocumentUpdateCallback[] = [];
  private isInitialized = false;

  /**
   * Initialize the document state service with AG-UI event listeners
   */
  initialize(): void {
    if (this.isInitialized) {
      console.warn('DocumentStateService already initialized');
      return;
    }

    console.log('🚀 Initializing DocumentStateService with AG-UI integration...');

    // Register AG-UI event handlers
    onAGUIEvent('DocumentCreated', this.handleDocumentCreated.bind(this));
    onAGUIEvent('DocumentAnalysisCompleted', this.handleDocumentAnalysisCompleted.bind(this));
    onAGUIEvent('CoordinateDocumentsUpdated', this.handleCoordinateDocumentsUpdated.bind(this));
    onAGUIEvent('DocumentStateRefresh', this.handleDocumentStateRefresh.bind(this));
    onAGUIEvent('PratibimbaCreated', this.handlePratibimbaCreated.bind(this));

    this.isInitialized = true;
    console.log('✅ DocumentStateService initialized successfully');
  }

  /**
   * Cleanup AG-UI event listeners
   */
  cleanup(): void {
    if (!this.isInitialized) return;

    console.log('🧹 Cleaning up DocumentStateService...');

    offAGUIEvent('DocumentCreated', this.handleDocumentCreated.bind(this));
    offAGUIEvent('DocumentAnalysisCompleted', this.handleDocumentAnalysisCompleted.bind(this));
    offAGUIEvent('CoordinateDocumentsUpdated', this.handleCoordinateDocumentsUpdated.bind(this));
    offAGUIEvent('DocumentStateRefresh', this.handleDocumentStateRefresh.bind(this));
    offAGUIEvent('PratibimbaCreated', this.handlePratibimbaCreated.bind(this));

    this.isInitialized = false;
    console.log('✅ DocumentStateService cleaned up');
  }

  /**
   * Register callback for general state updates
   */
  onStateUpdate(callback: StateUpdateCallback): void {
    this.stateUpdateCallbacks.push(callback);
  }

  /**
   * Register callback for coordinate-specific refreshes
   */
  onCoordinateRefresh(callback: CoordinateRefreshCallback): void {
    this.coordinateRefreshCallbacks.push(callback);
  }

  /**
   * Register callback for document updates
   */
  onDocumentUpdate(callback: DocumentUpdateCallback): void {
    this.documentUpdateCallbacks.push(callback);
  }

  /**
   * Handle document created events
   */
  private async handleDocumentCreated(event: DocumentCreatedEvent): Promise<void> {
    console.log('📄 Document created event received:', event);

    try {
      // Clear document cache for the coordinate to force refresh
      await documentCacheService.clearCoordinateCache(event.targetCoordinate);

      // Clear all caches to ensure comprehensive refresh
      await documentCacheService.clearAllCaches();

      // Trigger coordinate refresh
      this.triggerCoordinateRefresh(event.targetCoordinate);

      // Trigger general state update (this will reload documents from MongoDB)
      this.triggerStateUpdate();

      // Also trigger document update for the specific document
      this.triggerDocumentUpdate(event.documentId, {
        created: true,
        documentType: event.documentType,
        targetCoordinate: event.targetCoordinate,
        forceRefresh: true
      });

      console.log(`✅ Processed document created event for ${event.documentId} at ${event.targetCoordinate}`);
    } catch (error) {
      console.error('❌ Error handling document created event:', error);
    }
  }

  /**
   * Handle document analysis completed events
   */
  private async handleDocumentAnalysisCompleted(event: DocumentAnalysisCompletedEvent): Promise<void> {
    console.log('🔬 Document analysis completed event received:', event);

    try {
      // Update document cache with analysis results
      await documentCacheService.updateDocumentWithAnalysisResults(
        event.documentId,
        event.analysisResults
      );

      // If a pratibimba was created, refresh the coordinate
      if (event.pratibimbaCreated && event.pratibimbaId) {
        await documentCacheService.clearCoordinateCache(event.targetCoordinate);
        this.triggerCoordinateRefresh(event.targetCoordinate);
      }

      // Trigger document update
      this.triggerDocumentUpdate(event.documentId, {
        analysisCompleted: true,
        analysisResults: event.analysisResults,
        memoryIntegration: event.memoryIntegration
      });

      // Trigger general state update
      this.triggerStateUpdate();

      console.log(`✅ Processed document analysis completed event for ${event.documentId}`);
    } catch (error) {
      console.error('❌ Error handling document analysis completed event:', error);
    }
  }

  /**
   * Handle coordinate documents updated events
   */
  private async handleCoordinateDocumentsUpdated(event: CoordinateDocumentsUpdatedEvent): Promise<void> {
    console.log('📂 Coordinate documents updated event received:', event);

    try {
      // Clear coordinate cache to force refresh
      await documentCacheService.clearCoordinateCache(event.targetCoordinate);

      // Trigger coordinate refresh
      this.triggerCoordinateRefresh(event.targetCoordinate);

      // Trigger general state update
      this.triggerStateUpdate();

      console.log(`✅ Processed coordinate documents updated event for ${event.targetCoordinate} (${event.updateType})`);
    } catch (error) {
      console.error('❌ Error handling coordinate documents updated event:', error);
    }
  }

  /**
   * Handle document state refresh events
   */
  private async handleDocumentStateRefresh(event: DocumentStateRefreshEvent): Promise<void> {
    console.log('🔄 Document state refresh event received:', event);

    try {
      switch (event.scope) {
        case 'all':
          // Clear all caches and refresh everything
          await documentCacheService.clearAllCaches();
          this.triggerStateUpdate();
          break;

        case 'coordinate':
          if (event.targetCoordinate) {
            await documentCacheService.clearCoordinateCache(event.targetCoordinate);
            this.triggerCoordinateRefresh(event.targetCoordinate);
          }
          break;

        case 'document':
          if (event.documentId) {
            await documentCacheService.clearDocumentCache(event.documentId);
            this.triggerDocumentUpdate(event.documentId, { refreshed: true });
          }
          break;
      }

      console.log(`✅ Processed document state refresh event (${event.scope})`);
    } catch (error) {
      console.error('❌ Error handling document state refresh event:', error);
    }
  }

  /**
   * Handle pratibimba created events
   */
  private async handlePratibimbaCreated(event: any): Promise<void> {
    console.log('💎 Pratibimba created event received:', event);

    try {
      // Clear coordinate cache to show new pratibimba
      await documentCacheService.clearCoordinateCache(event.targetCoordinate);

      // Trigger coordinate refresh
      this.triggerCoordinateRefresh(event.targetCoordinate);

      // Trigger general state update
      this.triggerStateUpdate();

      console.log(`✅ Processed pratibimba created event for ${event.pratibimbaId}`);
    } catch (error) {
      console.error('❌ Error handling pratibimba created event:', error);
    }
  }

  /**
   * Trigger state update callbacks
   */
  private triggerStateUpdate(): void {
    this.stateUpdateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in state update callback:', error);
      }
    });
  }

  /**
   * Trigger coordinate refresh callbacks
   */
  private triggerCoordinateRefresh(coordinate: string): void {
    this.coordinateRefreshCallbacks.forEach(callback => {
      try {
        callback(coordinate);
      } catch (error) {
        console.error('Error in coordinate refresh callback:', error);
      }
    });
  }

  /**
   * Trigger document update callbacks
   */
  private triggerDocumentUpdate(documentId: string, changes: any): void {
    this.documentUpdateCallbacks.forEach(callback => {
      try {
        callback(documentId, changes);
      } catch (error) {
        console.error('Error in document update callback:', error);
      }
    });
  }
}

// Create singleton instance
const documentStateService = new DocumentStateService();

export default documentStateService;
