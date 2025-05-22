/**
 * Type definitions for the Epii mode components
 * Bimba Coordinate: #5-3-4.5-0
 */

// Document types
export interface DocumentVersion {
  timestamp: Date;
  textContent: string; // Changed from content to textContent
}

// Base Document interface
export interface Document {
  id: string;
  name: string;
  textContent?: string; // Optional - will be loaded on demand from MongoDB
  content?: string; // Deprecated: kept for backward compatibility
  lastModified: Date;
  versions?: DocumentVersion[]; // Optional - will be loaded on demand
  bimbaCoordinate?: string;
  analysisStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  lastSyncTime?: number; // Timestamp of last MongoDB sync
  isTemporary?: boolean; // Flag for temporary documents not yet saved to MongoDB

  // Bimba-Pratibimba relationship fields
  documentType: 'bimba' | 'pratibimba'; // Original document or crystallization

  // For Bimba (original) documents
  pratibimbaIds?: string[]; // IDs of crystallizations derived from this document

  // For Pratibimba (crystallization) documents
  bimbaId?: string; // ID of the original document this is derived from
  sourceSelection?: TextSelection; // The text selection that was crystallized
  crystallizationIntent?: string; // Purpose/intent of this crystallization
  crystallizationDate?: Date; // When this crystallization was created
}

// Specialized type for Bimba (original) documents
export interface BimbaDocument extends Document {
  documentType: 'bimba';
  pratibimbaIds: string[];
}

// Specialized type for Pratibimba (crystallization) documents
export interface PratibimbaDocument extends Document {
  documentType: 'pratibimba';
  bimbaId: string;
  sourceSelection: TextSelection;
  crystallizationIntent: string;
  crystallizationDate: Date;
}

// Analysis types
export interface AnalysisMapping {
  mappingType: string;
  mappingValue: string;
  reasoning?: string;
}

export interface AnalysisVariation {
  variationType: string;
  status: string;
  variationText?: string;
}

export interface NotionUpdatePayload {
  targetCoordinate: string;
  content: string;
  title?: string;
  analysisResults?: {
    semanticFramework?: string[];
    symbolicAnchors?: string[];
    conceptualFramework?: string[];
    logicOperators?: string[];
    contentType?: string;
  };
  relatedCoordinates?: string[];
  tags?: string[];

  // Subnode payloads for multi-target updates
  subnodePayloads?: {
    [coordinate: string]: {
      targetCoordinate: string;
      parentCoordinate: string;
      content: string;
      title: string;
      analysisResults?: {
        semanticFramework?: string[];
        symbolicAnchors?: string[];
        conceptualFramework?: string[];
        logicOperators?: string[];
        contentType?: string;
      };
      relatedCoordinates?: string[];
      tags?: string[];
      notionPageId?: string;
    }
  };

  // Original data for backward compatibility and debugging
  _originalData?: {
    sourceNotionPageId?: string;
    sourceFileName?: string;
    analysisTimestamp?: string;
    extractedMappings?: AnalysisMapping[];
    identifiedVariations?: AnalysisVariation[];
    overallSummary?: string;
    processedSubnodeMappings?: any;
    analysisMetadata?: {
      qlPhaseDistribution?: {
        synthesis?: number;
        analysis?: number;
      };
      dominantMEFLenses?: string[];
      nonDualPerspectives?: number;
      paradoxicalElements?: number;
    };
  };
}

export interface AnalysisResults {
  extractedMappings?: AnalysisMapping[];
  identifiedVariations?: AnalysisVariation[];
  overallSummary?: string;
  notionUpdatePayload?: NotionUpdatePayload;
}

export interface AnalysisSession {
  id: string;
  documentId: string;
  targetCoordinate: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  results: AnalysisResults | null;
  startedAt: Date;
  completedAt?: Date;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sessionId?: string; // Make sessionId optional since we might not always have it
  documentId?: string; // Associate chat messages with specific documents
  tool_calls?: any[]; // Tool calls made by the assistant
}

// Text selection type
export interface TextSelection {
  id?: string;           // Unique identifier for the selection
  documentId?: string;   // ID of the document this selection belongs to
  start: number;         // Start position in the document
  end: number;           // End position in the document
  text: string;          // Selected text content
  timestamp?: Date;      // When the selection was created
  isPratibimba?: boolean; // Whether this selection is from a Pratibimba document
  color?: string;        // Optional color for highlighting
  bimbaCoordinate?: string; // Bimba coordinate of the document this selection belongs to
}

// Status message type
export interface StatusMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

// Epii state type
export interface EpiiState {
  // All documents (both Bimba and Pratibimba)
  documents: Document[];
  currentDocumentId: string | null;

  // Selection state
  currentSelection: TextSelection | null;  // Currently active selection
  selections: TextSelection[];             // All saved selections

  // Analysis state
  analysisSessions: AnalysisSession[];
  currentSessionId: string | null;

  // Chat state
  chatMessages: ChatMessage[];

  // UI state
  isLoading: boolean;
  error: string | null;
  statusMessage: StatusMessage | null;
}

// Epii action types
export type EpiiAction =
  | { type: 'SET_CURRENT_DOCUMENT', payload: string }
  | { type: 'ADD_DOCUMENT', payload: Document }
  | { type: 'SET_DOCUMENTS', payload: Document[] }
  | { type: 'UPDATE_DOCUMENT', payload: { id: string, textContent?: string, content?: string, name?: string, analysisStatus?: string, forceSync?: boolean, documentType?: 'bimba' | 'pratibimba' } }
  | { type: 'UPDATE_DOCUMENT_METADATA', payload: { id: string, name?: string, bimbaCoordinate?: string } }
  | { type: 'APPEND_DOCUMENT_CONTENT', payload: { id: string, textContent: string, content?: string, forceSync?: boolean } }
  | { type: 'UPDATE_DOCUMENT_COORDINATE', payload: { id: string, bimbaCoordinate: string } }
  | { type: 'UPDATE_DOCUMENT_SYNC_TIME', payload: { id: string, lastSyncTime: number } }
  | { type: 'REMOVE_DOCUMENT', payload: string }
  | { type: 'START_ANALYSIS', payload: { documentId: string, targetCoordinate: string } }
  | { type: 'ADD_ANALYSIS_SESSION', payload: any }
  | { type: 'UPDATE_ANALYSIS_SESSION', payload: any }
  | { type: 'SET_ANALYSIS_RESULTS', payload: { sessionId: string, results: AnalysisResults } }
  | { type: 'ADD_CHAT_MESSAGE', payload: ChatMessage }
  | { type: 'CLEAR_CHAT_MESSAGES', payload?: string } // Optional document ID to clear messages for
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_STATUS_MESSAGE', payload: StatusMessage | null }
  // Selection actions
  | { type: 'SET_SELECTION', payload: TextSelection | null }
  | { type: 'SET_SELECTIONS', payload: TextSelection[] }
  | { type: 'ADD_SELECTION', payload: TextSelection }
  | { type: 'SAVE_AND_CLEAR_SELECTION', payload: TextSelection } // New action to batch save and clear
  | { type: 'UPDATE_SELECTION', payload: TextSelection }
  | { type: 'REMOVE_SELECTION', payload: string } // Selection ID
  | { type: 'CLEAR_SELECTIONS', payload?: string } // Optional document ID to clear selections for
  | { type: 'CREATE_PRATIBIMBA', payload: {
      bimbaId: string,
      name: string,
      textContent: string,
      content?: string, // Deprecated: kept for backward compatibility
      sourceSelection: TextSelection,
      crystallizationIntent: string,
      bimbaCoordinate?: string
    }
  };
