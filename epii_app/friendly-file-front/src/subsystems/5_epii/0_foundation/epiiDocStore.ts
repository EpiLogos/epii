/**
 * Document storage service for Epii mode
 * Bimba Coordinate: #5-3-4.5-0
 *
 * IMPORTANT: This file is ONLY for temporary document storage and session/message management.
 * Permanent document storage is handled by MongoDB via the documentService.
 *
 * localStorage should ONLY be used for:
 * 1. Temporary documents (starting with 'temp-')
 * 2. Analysis sessions
 * 3. Chat messages
 */

import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentVersion, AnalysisSession, ChatMessage, TextSelection } from './epiiTypes';

// Storage keys
const DOCUMENTS_KEY = 'epii_documents';
const SESSIONS_KEY = 'epii_sessions';
const MESSAGES_KEY = 'epii_messages';
const SELECTIONS_KEY = 'epii_selections';

// Document storage functions - ONLY FOR TEMPORARY DOCUMENTS
export const saveDocument = (document: Document): Document => {
  // IMPORTANT: This function should ONLY be used for temporary documents
  if (!document.id.startsWith('temp-') && !document.isTemporary) {
    console.warn(`WARNING: Attempting to save non-temporary document ${document.id} to localStorage. This should be saved to MongoDB instead.`);
    return document;
  }

  const documents = getDocuments();
  const existingIndex = documents.findIndex(doc => doc.id === document.id);

  let updatedDocument: Document;

  if (existingIndex >= 0) {
    // Update existing document
    updatedDocument = {
      ...document,
      lastModified: new Date(),
      versions: [
        ...documents[existingIndex].versions,
        { timestamp: new Date(), content: document.content }
      ]
    };
    documents[existingIndex] = updatedDocument;
  } else {
    // Add new document
    updatedDocument = {
      ...document,
      id: document.id || `temp-${uuidv4()}`, // Ensure temporary ID format
      isTemporary: true, // Mark as temporary
      lastModified: new Date(),
      versions: [{ timestamp: new Date(), content: document.content }]
    };
    documents.push(updatedDocument);
  }

  // Save to localStorage
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));

  console.log(`Temporary document ${updatedDocument.id} saved to localStorage, content length: ${updatedDocument.content?.length || 0}`);
  return updatedDocument;
};

export const getDocuments = (): Document[] => {
  const documentsJson = localStorage.getItem(DOCUMENTS_KEY);
  if (!documentsJson) return [];

  try {
    const documents = JSON.parse(documentsJson);

    // Convert string dates back to Date objects
    return documents.map((doc: any) => ({
      ...doc,
      lastModified: new Date(doc.lastModified),
      versions: doc.versions.map((version: any) => ({
        ...version,
        timestamp: new Date(version.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error parsing documents from localStorage:', error);
    return [];
  }
};

export const getDocument = (id: string): Document | null => {
  const documents = getDocuments();
  return documents.find(doc => doc.id === id) || null;
};

// Delete document from localStorage ONLY - for temporary documents
export const deleteDocument = (id: string): boolean => {
  // IMPORTANT: This function should ONLY be used for temporary documents
  if (!id.startsWith('temp-')) {
    console.warn(`WARNING: Attempting to delete non-temporary document ${id} from localStorage. This should be deleted from MongoDB instead.`);
  }

  const documents = getDocuments();
  const newDocuments = documents.filter(doc => doc.id !== id);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(newDocuments));

  console.log(`Document ${id} removed from localStorage`);
  return newDocuments.length < documents.length;
};

// Document version history
export const getDocumentVersions = (id: string): DocumentVersion[] => {
  const document = getDocument(id);
  return document ? document.versions : [];
};

export const restoreDocumentVersion = (id: string, timestamp: Date): Document | null => {
  const document = getDocument(id);
  if (!document) return null;

  const version = document.versions.find(v => v.timestamp.getTime() === timestamp.getTime());
  if (!version) return null;

  const updatedDocument = {
    ...document,
    content: version.content,
    lastModified: new Date(),
    versions: [
      ...document.versions,
      { timestamp: new Date(), content: version.content }
    ]
  };

  saveDocument(updatedDocument);
  return updatedDocument;
};

// Analysis session storage
export const saveAnalysisSession = (session: AnalysisSession): AnalysisSession => {
  try {
    // First, try to save a lightweight version of the session to localStorage
    // by removing the potentially large results object
    const lightweightSession = {
      ...session,
      id: session.id || uuidv4(),
      startedAt: new Date(),
      // Store a reference to results but not the actual results
      results: session.results ? {
        hasResults: true,
        resultsSummary: session.results.overallSummary ?
          session.results.overallSummary.substring(0, 100) + '...' :
          'Analysis results available'
      } : null
    };

    const sessions = getAnalysisSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = lightweightSession;
    } else {
      sessions.push(lightweightSession);
    }

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    // If the session has results, we should also save them to MongoDB
    // This is handled by the backend API when analysis is completed
    // We don't need to do anything extra here

    return session;
  } catch (error) {
    // If localStorage fails (e.g., quota exceeded), just log the error and return the session
    console.warn('Failed to save analysis session to localStorage:', error);
    return session;
  }
};

export const getAnalysisSessions = (): AnalysisSession[] => {
  const sessionsJson = localStorage.getItem(SESSIONS_KEY);
  if (!sessionsJson) return [];

  try {
    const sessions = JSON.parse(sessionsJson);

    // Convert string dates back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      startedAt: new Date(session.startedAt),
      completedAt: session.completedAt ? new Date(session.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error parsing sessions from localStorage:', error);
    return [];
  }
};

export const getAnalysisSession = (id: string): AnalysisSession | null => {
  const sessions = getAnalysisSessions();
  return sessions.find(s => s.id === id) || null;
};

export const getDocumentAnalysisSessions = (documentId: string): AnalysisSession[] => {
  const sessions = getAnalysisSessions();
  return sessions.filter(s => s.documentId === documentId);
};

// Chat message storage
export const saveChatMessage = (message: ChatMessage): ChatMessage => {
  const messages = getChatMessages();
  messages.push({
    ...message,
    id: message.id || uuidv4(),
    timestamp: new Date()
  });

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return message;
};

export const getChatMessages = (): ChatMessage[] => {
  const messagesJson = localStorage.getItem(MESSAGES_KEY);
  if (!messagesJson) return [];

  try {
    const messages = JSON.parse(messagesJson);

    // Convert string dates back to Date objects
    return messages.map((message: any) => ({
      ...message,
      timestamp: new Date(message.timestamp)
    }));
  } catch (error) {
    console.error('Error parsing messages from localStorage:', error);
    return [];
  }
}

// Selection storage functions
export const saveSelections = (selections: TextSelection[]): void => {
  try {
    localStorage.setItem(SELECTIONS_KEY, JSON.stringify(selections));
    console.log(`Saved ${selections.length} selections to localStorage`);
  } catch (error) {
    console.error('Error saving selections to localStorage:', error);
  }
};

export const getSelections = (): TextSelection[] => {
  const selectionsJson = localStorage.getItem(SELECTIONS_KEY);
  if (!selectionsJson) {
    console.log('No saved selections found in localStorage');
    return [];
  }

  try {
    const selections = JSON.parse(selectionsJson);
    console.log(`Loaded ${selections.length} saved selections from localStorage:`, selections);

    // Convert string dates back to Date objects
    const parsedSelections = selections.map((selection: any) => ({
      ...selection,
      timestamp: selection.timestamp ? new Date(selection.timestamp) : new Date()
    }));

    console.log('Parsed selections with Date objects:', parsedSelections);
    return parsedSelections;
  } catch (error) {
    console.error('Error parsing selections from localStorage:', error);
    return [];
  }
}

export const getSessionChatMessages = (sessionId: string): ChatMessage[] => {
  const messages = getChatMessages();
  return messages.filter(m => m.sessionId === sessionId);
};
