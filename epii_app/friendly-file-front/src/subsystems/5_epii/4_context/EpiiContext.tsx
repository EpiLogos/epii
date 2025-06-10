/**
 * Context provider for Epii mode
 * Bimba Coordinate: #5-3-4.5-4
 *
 * DOCUMENT STORAGE STRATEGY:
 * 1. Permanent documents are stored in MongoDB ONLY
 * 2. Temporary documents (starting with 'temp-') are stored in localStorage ONLY
 * 3. Analysis sessions and chat messages are stored in localStorage
 *
 * The EpiiContext maintains the state of documents, but:
 * - For permanent documents, MongoDB is the source of truth
 * - For temporary documents, localStorage is the source of truth
 */

import React, { createContext, useReducer, useContext, useEffect, useRef, useCallback } from 'react';
import {
  EpiiState,
  EpiiAction,
  Document,
  PratibimbaDocument,
  AnalysisSession
} from '../0_foundation/epiiTypes';
import {
  saveDocument,
  saveAnalysisSession,
  saveChatMessage,
  getAnalysisSessions,
  getChatMessages
} from '../0_foundation/epiiDocStore';
import { cleanDocumentId } from '../1_utils/epiiHelpers';
import { useUserContext } from '../../0_anuttara/4_context/useUserContext';

// Initial state
const initialState: EpiiState = {
  // All documents (both Bimba and Pratibimba)
  documents: [],
  currentDocumentId: null,

  // Selection state
  currentSelection: null,
  selections: [],

  // Analysis state
  analysisSessions: [],
  currentSessionId: null,

  // Chat state
  chatMessages: [],

  // UI state
  isLoading: false,
  error: null,
  statusMessage: null
};

// Create context
const EpiiContext = createContext<{
  state: EpiiState;
  dispatch: React.Dispatch<EpiiAction>;
} | undefined>(undefined);

// Create reducer
function epiiReducer(state: EpiiState, action: EpiiAction): EpiiState {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };

    case 'SET_CURRENT_DOCUMENT': {
      const newDocumentId = action.payload;
      const oldDocumentId = state.currentDocumentId;

      console.log(`EpiiContext: Switching document from ${oldDocumentId} to ${newDocumentId}`);

      // Important: We're not modifying the selections array at all here
      // This ensures that all saved selections remain intact regardless of document switching

      // We're also not clearing the current selection
      // This allows the selection to persist when switching documents
      return {
        ...state,
        currentDocumentId: newDocumentId
      };
    }

    case 'ADD_DOCUMENT': {
      const newDocument = action.payload;
      // Only save to localStorage if it's a temporary document
      if (newDocument.isTemporary) {
        saveDocument(newDocument);
      }

      // Don't clear selections when adding a new document
      return {
        ...state,
        documents: [...state.documents, newDocument],
        currentDocumentId: newDocument.id
        // Explicitly not modifying selections or currentSelection
      };
    }

    case 'UPDATE_DOCUMENT_METADATA': {
      const { id, name, bimbaCoordinate } = action.payload;
      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === id) {
          return {
            ...doc,
            name: name !== undefined ? name : doc.name,
            bimbaCoordinate: bimbaCoordinate !== undefined ? bimbaCoordinate : doc.bimbaCoordinate,
            targetCoordinate: bimbaCoordinate !== undefined ? bimbaCoordinate : doc.targetCoordinate, // ✅ Keep both in sync
            lastModified: new Date()
          };
        }
        return doc;
      });

      return {
        ...state,
        documents: updatedDocuments
      };
    }

    case 'UPDATE_DOCUMENT': {
      const { id, textContent, content, name, analysisStatus, forceSync } = action.payload;

      // DEBUG: Log the entire payload to see what's actually being passed
      console.log('UPDATE_DOCUMENT payload:', JSON.stringify(action.payload, null, 2));

      // Use textContent if provided, fall back to content for backward compatibility
      const documentContent = textContent !== undefined ? textContent : content;

      console.log(`UPDATE_DOCUMENT action for document ${id}, textContent length: ${documentContent?.length || 0}, forceSync: ${forceSync}`);

      // Check if this is a pratibimba document
      // Use either id or _id to find the document
      const isPratibimba = state.documents.find(doc =>
        doc.id === id || doc._id === id
      )?.documentType === 'pratibimba';

      // Update documents in state
      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === id || doc._id === id) {
          // Ensure document has both id and _id properties
          if (!doc.id && doc._id) {
            doc.id = doc._id;
          }
          if (!doc._id && doc.id) {
            doc._id = doc.id;
          }
          const updates: Partial<Document> = {
            lastModified: new Date()
          };

          if (documentContent !== undefined) {
            updates.textContent = documentContent;
            // Also update content for backward compatibility
            updates.content = documentContent;
            updates.versions = [...(doc.versions || []), {
              timestamp: new Date(),
              textContent: documentContent
            }];
          }

          if (name !== undefined) {
            updates.name = name;
          }

          if (analysisStatus !== undefined && !isPratibimba) {
            // Convert string to valid analysisStatus type
            const validStatus = ['pending', 'processing', 'completed', 'failed'].includes(analysisStatus)
              ? analysisStatus as 'pending' | 'processing' | 'completed' | 'failed'
              : 'pending';
            updates.analysisStatus = validStatus;
          }

          return { ...doc, ...updates };
        }
        return doc;
      });

      // Save the updated document
      const updatedDoc = updatedDocuments.find(doc => doc.id === id);
      if (updatedDoc && forceSync) {
        // Skip saving if content is empty to prevent infinite loops
        if (updatedDoc.content === undefined || updatedDoc.content === null || updatedDoc.content.length === 0) {
          console.log(`Skipping MongoDB sync for document ${updatedDoc.id} - content is empty`);
          return {
            ...state,
            documents: updatedDocuments
          };
        }

        // Use a more reliable approach to save to MongoDB
        const saveToMongoDB = async () => {
          try {
            // Import documentService
            const module = await import('../1_services/documentService');
            const documentService = module.documentService;

            // Clean the document ID to ensure it's in a format that MongoDB can handle
            const cleanedId = cleanDocumentId(updatedDoc.id);
            console.log(`Force-syncing ${isPratibimba ? 'pratibimba' : 'bimba'} document ${updatedDoc.id} to MongoDB (cleaned ID: ${cleanedId})...`);
            console.log(`Content length: ${updatedDoc.content?.length || 0}, Content preview: "${updatedDoc.content?.substring(0, 50)}..."`);

            // Save to MongoDB with the appropriate collection
            const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';

            // For pratibimba documents, preserve existing targetCoordinate; for bimba documents, use bimbaCoordinate
            const coordinateToSave = isPratibimba
              ? (updatedDoc.targetCoordinate || updatedDoc.bimbaCoordinate)
              : updatedDoc.bimbaCoordinate;

            console.log(`EpiiContext UPDATE_DOCUMENT: Saving ${isPratibimba ? 'pratibimba' : 'bimba'} document with targetCoordinate: ${coordinateToSave}`);

            await documentService.updateDocument(cleanedId, {
              textContent: updatedDoc.textContent || updatedDoc.content, // Use textContent consistently
              name: updatedDoc.name,
              targetCoordinate: coordinateToSave
            }, collection);

            console.log(`${isPratibimba ? 'Pratibimba' : 'Bimba'} document ${updatedDoc.id} force-synced to MongoDB`);

            // Verify the document was saved correctly
            let savedDoc: { textContent?: string };
            if (isPratibimba) {
              savedDoc = await documentService.getPratibimbaDocument(cleanedId);
            } else {
              savedDoc = await documentService.getDocument(cleanedId);
            }

            if (savedDoc && savedDoc.textContent) {
              console.log(`Verified ${isPratibimba ? 'pratibimba' : 'bimba'} document ${updatedDoc.id} exists in MongoDB with content length: ${savedDoc.textContent.length}`);
              console.log(`Verified content preview: "${savedDoc.textContent.substring(0, 50)}..."`);
            } else {
              console.warn(`${isPratibimba ? 'Pratibimba' : 'bimba'} document ${updatedDoc.id} not found in MongoDB after force sync!`);
            }
          } catch (error) {
            console.error(`Error force-syncing ${isPratibimba ? 'pratibimba' : 'bimba'} document ${updatedDoc.id} to MongoDB:`, error);
          }
        };

        // Execute the async function
        saveToMongoDB();
      }

      return {
        ...state,
        documents: updatedDocuments
      };
    }

    case 'APPEND_DOCUMENT_CONTENT': {
      const { id, textContent, content, forceSync } = action.payload;

      // Use textContent if provided, fall back to content for backward compatibility
      const contentToAppend = textContent !== undefined ? textContent : content;

      console.log(`EpiiContext: APPEND_DOCUMENT_CONTENT action received`);
      console.log(`Document ID: ${id}, Content to append length: ${contentToAppend.length}, Force sync: ${forceSync}`);

      // Find the document to append to
      const documentToUpdate = state.documents.find(doc => doc.id === id || doc._id === id);

      if (!documentToUpdate) {
        console.error(`Cannot append to document ${id} - document not found`);
        console.log(`Available documents:`, state.documents.map(doc => ({ id: doc.id, name: doc.name })));
        return state;
      }

      // Create the updated content by appending
      const existingContent = documentToUpdate.textContent || documentToUpdate.content || '';
      const newContent = existingContent.trim() + '\n\n' + contentToAppend.trim();

      console.log(`EpiiContext: Appending content to document ${id}`);
      console.log(`Existing content length: ${existingContent.length}, New content length: ${newContent.length}`);
      console.log(`Existing content preview: "${existingContent.substring(0, 50)}..."`);
      console.log(`Content to append: "${contentToAppend.substring(0, 50)}..."`);
      console.log(`Final content preview: "${newContent.substring(0, 50)}..."`);

      // Verify the content was actually appended
      if (newContent.length <= existingContent.length) {
        console.warn(`WARNING: New content length (${newContent.length}) is not greater than existing content length (${existingContent.length})`);
      }

      // Update the document with the appended content
      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === id || doc._id === id) {
          // Ensure document has both id and _id properties
          if (!doc.id && doc._id) {
            doc.id = doc._id;
          }
          if (!doc._id && doc.id) {
            doc._id = doc.id;
          }
          return {
            ...doc,
            textContent: newContent,
            content: newContent, // Also update content for backward compatibility
            lastModified: new Date(),
            versions: [...(doc.versions || []), {
              timestamp: new Date(),
              textContent: newContent
            }]
          };
        }
        return doc;
      });

      // Save the updated document
      const updatedDoc = updatedDocuments.find(doc => doc.id === id);
      if (updatedDoc) {
        // STORAGE STRATEGY:
        // 1. Temporary documents (temp-*) -> localStorage only
        // 2. Permanent documents -> MongoDB only (with forceSync)

        // Only save to localStorage if it's a temporary document
        if (updatedDoc.isTemporary || updatedDoc.id.startsWith('temp-')) {
          console.log(`Saving temporary document ${updatedDoc.id} with appended content to localStorage`);
          saveDocument(updatedDoc);
        }

        // ALWAYS force sync for append operations to ensure content is saved to MongoDB
        if (!updatedDoc.id.startsWith('temp-')) {
          // Use a more reliable approach to save to MongoDB
          const saveToMongoDB = async () => {
            try {
              // Import documentService
              const module = await import('../1_services/documentService');
              const documentService = module.documentService;

              // Clean the document ID to ensure it's in a format that MongoDB can handle
              const cleanedId = cleanDocumentId(updatedDoc.id);
              console.log(`Force-syncing document ${updatedDoc.id} with appended content to MongoDB (cleaned ID: ${cleanedId})...`);
              console.log(`Content length: ${updatedDoc.content?.length || 0}, Content preview: "${updatedDoc.content?.substring(0, 50)}..."`);

              // Save to MongoDB with retries using cleaned ID
              await documentService.updateDocument(cleanedId, {
                content: updatedDoc.textContent || updatedDoc.content,
                name: updatedDoc.name
              });

              console.log(`Document ${updatedDoc.id} with appended content force-synced to MongoDB`);

              // Verify the document was saved correctly using cleaned ID
              const savedDoc: { textContent?: string } = await documentService.getDocument(cleanedId);
              if (savedDoc && savedDoc.textContent) {
                console.log(`Verified document ${updatedDoc.id} exists in MongoDB with content length: ${savedDoc.textContent.length}`);
                console.log(`Verified content preview: "${savedDoc.textContent.substring(0, 50)}..."`);

                // Double-check that the content was actually saved
                if (savedDoc.textContent.length < newContent.length) {
                  console.error(`WARNING: Saved content length (${savedDoc.textContent.length}) is less than expected (${newContent.length})`);
                }
              } else {
                console.warn(`Document ${updatedDoc.id} not found in MongoDB after force sync!`);
              }
            } catch (error) {
              console.error(`Error force-syncing document ${updatedDoc.id} to MongoDB:`, error);
            }
          };

          // Execute the async function
          saveToMongoDB();
        }
      }

      return {
        ...state,
        documents: updatedDocuments
      };
    }

    case 'UPDATE_DOCUMENT_COORDINATE': {
      const { id, bimbaCoordinate } = action.payload;

      console.log(`UPDATE_DOCUMENT_COORDINATE action for document ${id}, coordinate: ${bimbaCoordinate}`);

      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === id || doc._id === id) {
          // Ensure document has both id and _id properties
          if (!doc.id && doc._id) {
            doc.id = doc._id;
          }
          if (!doc._id && doc.id) {
            doc._id = doc.id;
          }

          return {
            ...doc,
            bimbaCoordinate,
            targetCoordinate: bimbaCoordinate, // ✅ Keep both in sync
            lastModified: new Date()
          };
        }
        return doc;
      });

      // Save the updated document
      const updatedDoc = updatedDocuments.find(doc => doc.id === id);
      if (updatedDoc) {
        // STORAGE STRATEGY:
        // 1. Temporary documents (temp-*) -> localStorage only
        // 2. Permanent documents -> MongoDB only

        // Only save to localStorage if it's a temporary document
        if (updatedDoc.isTemporary || updatedDoc.id.startsWith('temp-')) {
          console.log(`Saving temporary document ${updatedDoc.id} with updated coordinate to localStorage`);
          saveDocument(updatedDoc);
        }

        // Always update in MongoDB if not temporary
        if (!updatedDoc.isTemporary && !updatedDoc.id.startsWith('temp-')) {
          const updateInMongoDB = async () => {
            try {
              // Import documentService
              const module = await import('../1_services/documentService');
              const documentService = module.documentService;

              // Clean the document ID to ensure it's in a format that MongoDB can handle
              const cleanedId = cleanDocumentId(updatedDoc.id);
              console.log(`Updating coordinate for document ${updatedDoc.id} (cleaned ID: ${cleanedId}) to ${bimbaCoordinate} in MongoDB...`);

              // Update coordinate in MongoDB using cleaned ID
              await documentService.updateDocument(cleanedId, {
                targetCoordinate: bimbaCoordinate,
                // Also update content to ensure it's saved correctly
                textContent: updatedDoc.textContent || updatedDoc.content,
                name: updatedDoc.name
              });

              console.log(`Updated coordinate for document ${updatedDoc.id} to ${bimbaCoordinate} in MongoDB`);

              // Verify the document was saved correctly
              const savedDoc: { targetCoordinate?: string, textContent?: string } = await documentService.getDocument(cleanedId);
              if (savedDoc) {
                console.log(`Verified document ${updatedDoc.id} exists in MongoDB with coordinate: ${savedDoc.targetCoordinate}`);

                if (savedDoc.targetCoordinate !== bimbaCoordinate) {
                  console.warn(`WARNING: Saved coordinate (${savedDoc.targetCoordinate}) does not match expected (${bimbaCoordinate})`);
                }

                // Also verify content was preserved
                if (savedDoc.textContent && updatedDoc.content) {
                  if (savedDoc.textContent.length !== updatedDoc.content.length) {
                    console.warn(`WARNING: Saved content length (${savedDoc.textContent.length}) does not match expected (${updatedDoc.content.length})`);
                  }
                }
              } else {
                console.warn(`Document ${updatedDoc.id} not found in MongoDB after coordinate update!`);
              }
            } catch (error) {
              console.error(`Error updating coordinate for document ${updatedDoc.id} in MongoDB:`, error);
            }
          };

          // Execute the async function
          updateInMongoDB();
        }
      }

      return {
        ...state,
        documents: updatedDocuments
      };
    }

    case 'UPDATE_DOCUMENT_SYNC_TIME': {
      const { id, lastSyncTime } = action.payload;
      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === id || doc._id === id) {
          // Ensure document has both id and _id properties
          if (!doc.id && doc._id) {
            doc.id = doc._id;
          }
          if (!doc._id && doc.id) {
            doc._id = doc.id;
          }

          return {
            ...doc,
            lastSyncTime
          };
        }
        return doc;
      });

      return {
        ...state,
        documents: updatedDocuments
      };
    }

    case 'REMOVE_DOCUMENT': {
      const documentId = action.payload;
      console.log(`Removing document ${documentId} from state`);

      // Get the document to be removed
      const documentToRemove = state.documents.find(doc => doc.id === documentId || doc._id === documentId);

      if (!documentToRemove) {
        console.warn(`Document ${documentId} not found in state`);
        return state;
      }

      // Check if this is a pratibimba document
      const isPratibimba = documentToRemove?.documentType === 'pratibimba';
      const bimbaId = isPratibimba ? documentToRemove?.bimbaId : null;
      const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';

      // Delete the document from MongoDB
      // We'll handle this asynchronously but track the deletion status
      const documentDeletionPromise = (async () => {
        try {
          // Import documentService
          const module = await import('../1_services/documentService');
          const documentService = module.documentService;

          // Delete from MongoDB and get the result
          const result = await documentService.deleteDocument(documentId, collection);
          console.log(`Document ${documentId} deletion result:`, result);

          // Return the success status
          return result.success;
        } catch (error) {
          console.error(`Error deleting document ${documentId} from MongoDB:`, error);
          return false;
        }
      })();

      // Store the deletion promise in a global variable for debugging
      // @ts-ignore - Adding custom property for debugging
      window._epiiLastDocumentDeletionPromise = documentDeletionPromise;

      // Filter out the document from the state
      const updatedDocuments = state.documents.filter(doc => {
        // Remove the document itself
        if (doc.id === documentId || doc._id === documentId) {
          return false;
        }

        // If we're removing a bimba document, also remove its pratibimba documents
        if (!isPratibimba && doc.bimbaId === documentId) {
          // Also delete this pratibimba from MongoDB
          const deletePratibimba = async () => {
            try {
              const module = await import('../1_services/documentService');
              const documentService = module.documentService;
              await documentService.deleteDocument(doc.id, 'pratibimbaDocuments');
              console.log(`Pratibimba document ${doc.id} deleted from MongoDB`);
            } catch (error) {
              console.error(`Error deleting pratibimba document ${doc.id} from MongoDB:`, error);
            }
          };
          deletePratibimba();
          return false;
        }

        return true;
      });

      // Update pratibimba references in bimba documents
      const finalDocuments = updatedDocuments.map(doc => {
        // If this is a bimba document and we're removing a pratibimba, update its pratibimbaIds
        if (bimbaId && doc.id === bimbaId && doc.pratibimbaIds) {
          return {
            ...doc,
            pratibimbaIds: doc.pratibimbaIds.filter(id => id !== documentId)
          };
        }
        return doc;
      });

      // Log the before and after counts
      console.log(`Documents before: ${state.documents.length}, after: ${finalDocuments.length}`);

      // Clear chat messages for the deleted document
      const updatedChatMessages = state.chatMessages.filter(msg => msg.documentId !== documentId);

      return {
        ...state,
        documents: finalDocuments,
        chatMessages: updatedChatMessages,
        currentDocumentId: state.currentDocumentId === documentId ? null : state.currentDocumentId
      };
    }

    case 'START_ANALYSIS': {
      const { documentId, targetCoordinate } = action.payload;
      const newSession: AnalysisSession = {
        id: `session-${Date.now()}`,
        documentId,
        targetCoordinate,
        status: 'pending' as const,
        results: null,
        startedAt: new Date()
      };

      // Save the new session
      saveAnalysisSession(newSession);

      return {
        ...state,
        analysisSessions: [...state.analysisSessions, newSession],
        currentSessionId: newSession.id
      };
    }

    case 'ADD_ANALYSIS_SESSION': {
      const newSession = action.payload;

      // Save the new session
      saveAnalysisSession(newSession);

      return {
        ...state,
        analysisSessions: [...state.analysisSessions, newSession],
        currentSessionId: newSession.id
      };
    }

    case 'UPDATE_ANALYSIS_SESSION': {
      const updatedSession = action.payload;

      // Ensure the status is a valid AnalysisSession status
      if (updatedSession.status && typeof updatedSession.status === 'string') {
        const validStatuses = ['pending', 'analyzing', 'complete', 'error'];
        if (!validStatuses.includes(updatedSession.status)) {
          updatedSession.status = 'pending' as 'pending' | 'analyzing' | 'complete' | 'error';
        } else {
          // Cast to the correct type
          updatedSession.status = updatedSession.status as 'pending' | 'analyzing' | 'complete' | 'error';
        }
      }

      const updatedSessions = state.analysisSessions.map(session =>
        session.id === updatedSession.id ? updatedSession as AnalysisSession : session
      );

      // Save the updated session
      saveAnalysisSession(updatedSession as AnalysisSession);

      return {
        ...state,
        analysisSessions: updatedSessions
      };
    }

    case 'SET_ANALYSIS_RESULTS': {
      const { sessionId, results } = action.payload;
      const updatedSessions = state.analysisSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              status: 'complete' as const,
              results,
              completedAt: new Date()
            }
          : session
      );

      // Save the updated session
      const updatedSession = updatedSessions.find(session => session.id === sessionId);
      if (updatedSession) {
        saveAnalysisSession(updatedSession);
      }

      return {
        ...state,
        analysisSessions: updatedSessions
      };
    }

    case 'ADD_CHAT_MESSAGE': {
      const newMessage = action.payload;

      // Ensure the message has the current document ID if not already set
      if (!newMessage.documentId && state.currentDocumentId) {
        newMessage.documentId = state.currentDocumentId;
      }

      // Save the new message
      saveChatMessage(newMessage);

      return {
        ...state,
        chatMessages: [...state.chatMessages, newMessage]
      };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_STATUS_MESSAGE':
      return { ...state, statusMessage: action.payload };

    case 'SET_SELECTION': {
      const selection = action.payload;

      // If selection is null, just clear the current selection
      if (!selection) {
        return { ...state, currentSelection: null };
      }

      // Find the document to get its bimbaCoordinate
      const document = state.documents.find(doc => doc.id === selection.documentId);

      // Add ID, timestamp, and bimbaCoordinate if not present
      const enhancedSelection = {
        ...selection,
        id: selection.id || `sel-${Date.now()}`,
        timestamp: selection.timestamp || new Date(),
        // Determine if this is from a pratibimba document
        isPratibimba: selection.isPratibimba !== undefined
          ? selection.isPratibimba
          : document?.documentType === 'pratibimba',
        // Add bimbaCoordinate from the document
        bimbaCoordinate: selection.bimbaCoordinate || document?.bimbaCoordinate
      };

      return { ...state, currentSelection: enhancedSelection };
    }

    case 'ADD_SELECTION': {
      const selection = action.payload;

      // Find the document to get its bimbaCoordinate
      const document = state.documents.find(doc => doc.id === selection.documentId);

      // Check if this selection already exists (by content and document)
      const existingSelection = state.selections.find(
        sel => sel.documentId === selection.documentId &&
               sel.start === selection.start &&
               sel.end === selection.end
      );

      // If it already exists, just set it as current but don't add it again
      if (existingSelection) {
        console.log('Selection already exists, setting as current:', existingSelection);
        return {
          ...state,
          currentSelection: existingSelection
        };
      }

      // Add ID, timestamp, and bimbaCoordinate if not present
      const enhancedSelection = {
        ...selection,
        id: selection.id || `sel-${Date.now()}`,
        timestamp: selection.timestamp || new Date(),
        // Determine if this is from a pratibimba document
        isPratibimba: selection.isPratibimba !== undefined
          ? selection.isPratibimba
          : document?.documentType === 'pratibimba',
        // Add bimbaCoordinate from the document
        bimbaCoordinate: selection.bimbaCoordinate || document?.bimbaCoordinate
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Adding new selection:', enhancedSelection);
      }

      // Add to selections array
      const updatedSelections = [...state.selections, enhancedSelection];

      // No need to save to localStorage

      return {
        ...state,
        currentSelection: enhancedSelection,
        selections: updatedSelections
      };
    }

    // New action type to save and clear selection in one step
    case 'SAVE_AND_CLEAR_SELECTION': {
      const selection = action.payload;

      // Find the document to get its bimbaCoordinate
      const document = state.documents.find(doc => doc.id === selection.documentId);

      // Check if this selection already exists (by content and document)
      const existingSelection = state.selections.find(
        sel => sel.documentId === selection.documentId &&
               sel.start === selection.start &&
               sel.end === selection.end
      );

      // If it already exists, just clear the current selection
      if (existingSelection) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Selection already exists, clearing current selection');
        }
        return {
          ...state,
          currentSelection: null
        };
      }

      // Add ID, timestamp, and bimbaCoordinate if not present
      const enhancedSelection = {
        ...selection,
        id: selection.id || `sel-${Date.now()}`,
        timestamp: selection.timestamp || new Date(),
        // Determine if this is from a pratibimba document
        isPratibimba: selection.isPratibimba !== undefined
          ? selection.isPratibimba
          : document?.documentType === 'pratibimba',
        // Add bimbaCoordinate from the document
        bimbaCoordinate: selection.bimbaCoordinate || document?.bimbaCoordinate
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Saving and clearing selection:', enhancedSelection);
      }

      // Add to selections array and clear current selection
      const updatedSelections = [...state.selections, enhancedSelection];

      // No need to save to localStorage

      return {
        ...state,
        currentSelection: null,
        selections: updatedSelections
      };
    }

    case 'UPDATE_SELECTION': {
      const updatedSelection = action.payload;

      // Update in selections array
      const updatedSelections = state.selections.map(sel =>
        sel.id === updatedSelection.id ? updatedSelection : sel
      );

      // Also update current selection if it's the same one
      const updatedCurrentSelection =
        state.currentSelection?.id === updatedSelection.id
          ? updatedSelection
          : state.currentSelection;

      // No need to save to localStorage

      return {
        ...state,
        currentSelection: updatedCurrentSelection,
        selections: updatedSelections
      };
    }

    case 'REMOVE_SELECTION': {
      const selectionId = action.payload;

      // Remove from selections array
      const updatedSelections = state.selections.filter(sel => sel.id !== selectionId);

      // Clear current selection if it's the one being removed
      const updatedCurrentSelection =
        state.currentSelection?.id === selectionId
          ? null
          : state.currentSelection;

      // No need to save to localStorage

      return {
        ...state,
        currentSelection: updatedCurrentSelection,
        selections: updatedSelections
      };
    }

    case 'SET_SELECTIONS': {
      // Set the selections array directly
      return {
        ...state,
        selections: action.payload
      };
    }

    case 'CLEAR_SELECTIONS': {
      const documentId = action.payload;

      // If document ID is provided, only clear selections for that document
      if (documentId) {
        const updatedSelections = state.selections.filter(sel => sel.documentId !== documentId);
        const updatedCurrentSelection =
          state.currentSelection?.documentId === documentId
            ? null
            : state.currentSelection;

        // No need to save to localStorage

        return {
          ...state,
          currentSelection: updatedCurrentSelection,
          selections: updatedSelections
        };
      }

      // Otherwise, clear all selections
      // No need to save to localStorage

      return {
        ...state,
        currentSelection: null,
        selections: []
      };
    }

    case 'CLEAR_CHAT_MESSAGES': {
      // If a document ID is provided, only clear messages for that document
      if (action.payload) {
        return {
          ...state,
          chatMessages: state.chatMessages.filter(msg => msg.documentId !== action.payload)
        };
      }
      // Otherwise, clear all messages
      return { ...state, chatMessages: [] };
    }

    // Pratibimba (crystallization) document actions
    case 'CREATE_PRATIBIMBA': {
      const { bimbaId, name, textContent, content, sourceSelection, crystallizationIntent, bimbaCoordinate } = action.payload;

      // Use textContent if provided, fall back to content for backward compatibility
      const documentContent = textContent !== undefined ? textContent : content;

      // Create a new pratibimba document
      const newPratibimba: PratibimbaDocument = {
        id: `pratibimba-${Date.now()}`,
        name,
        textContent: documentContent,
        lastModified: new Date(),
        documentType: 'pratibimba' as const,
        bimbaId,
        // If sourceSelection is null or undefined, create a default one
        sourceSelection: sourceSelection || {
          start: 0,
          end: 0,
          text: ''
        },
        crystallizationIntent,
        crystallizationDate: new Date(),
        bimbaCoordinate: bimbaCoordinate || undefined,
        versions: []
      };

      // Update the bimba document to reference this pratibimba
      const updatedDocuments = state.documents.map(doc => {
        if (doc.id === bimbaId) {
          const pratibimbaIds = doc.pratibimbaIds || [];
          return {
            ...doc,
            pratibimbaIds: [...pratibimbaIds, newPratibimba.id]
          };
        }
        return doc;
      });

      // Save the new pratibimba document to MongoDB
      const savePratibimba = async () => {
        try {
          // Import documentService
          const module = await import('../1_services/documentService');
          const documentService = module.default;

          // Save to MongoDB with special collection for pratibimba documents
          const result = await documentService.createPratibimbaDocument({
            name: newPratibimba.name,
            textContent: newPratibimba.textContent, // Use textContent consistently
            bimbaId: newPratibimba.bimbaId,
            sourceSelection: newPratibimba.sourceSelection,
            crystallizationIntent: newPratibimba.crystallizationIntent,
            bimbaCoordinate: newPratibimba.bimbaCoordinate
          });

          if (result && result.id) {
            console.log(`Created new pratibimba document in MongoDB with ID: ${result.id}`);

            // Update the state with the new MongoDB ID
            setTimeout(() => {
              console.log(`Updating pratibimba document ID in state: ${newPratibimba.id} -> ${result.id}`);

              // Dispatch an action to update the document ID
              window.dispatchEvent(new CustomEvent('update-document-id', {
                detail: {
                  oldId: newPratibimba.id,
                  newId: result.id
                }
              }));
            }, 500);
          } else {
            console.warn(`Created pratibimba document but no ID was returned`);
          }
        } catch (error) {
          console.error('Error creating pratibimba document:', error);
        }
      };

      // Execute the async function
      savePratibimba();

      // Add the new pratibimba document to the documents array
      return {
        ...state,
        documents: [...updatedDocuments, newPratibimba],
        currentDocumentId: newPratibimba.id
      };
    }



    default:
      return state;
  }
}

// Create provider
export const EpiiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Access user context
  const userContext = useUserContext();
  const { state: userState } = userContext;
  const userId = userState.userData?.userId;

  // Add a ref to track whether documents have been loaded
  const documentsLoadedRef = useRef(false);
  // Add a ref to track whether we're currently loading documents
  const isLoadingDocumentsRef = useRef(false);

  // Initialize with empty documents and empty selections
  const [state, dispatch] = useReducer(epiiReducer, {
    ...initialState,
    documents: [], // Start with empty documents, will load from MongoDB
    analysisSessions: getAnalysisSessions(),
    chatMessages: getChatMessages(),
    selections: [], // Start with empty selections, don't load from localStorage
    isLoading: true // Add loading state to track document loading progress
  });

  // Initialize document state service for AG-UI integration
  useEffect(() => {
    const initializeDocumentStateService = async () => {
      try {
        const documentStateService = (await import('../1_services/documentStateService')).default;

        // Initialize the service
        documentStateService.initialize();

        // Register callbacks for state updates
        documentStateService.onStateUpdate(() => {
          console.log('📡 AG-UI triggered state update - refreshing documents...');
          // Force refresh of documents from MongoDB
          loadDocuments();
        });

        documentStateService.onDocumentUpdate((documentId: string, changes: any) => {
          console.log(`📡 AG-UI triggered document update for ${documentId}:`, changes);

          // Update document in state if it exists
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: documentId,
              ...changes,
              forceSync: true
            }
          });
        });

        console.log('✅ Document state service initialized with AG-UI integration');

        // Cleanup on unmount
        return () => {
          documentStateService.cleanup();
        };
      } catch (error) {
        console.error('❌ Failed to initialize document state service:', error);
      }
    };

    initializeDocumentStateService();
  }, []);

  // Function to reload documents (can be called by AG-UI events)
  const loadDocuments = useCallback(async () => {
    try {
      console.log('🔄 Loading documents from MongoDB...');

      // First load bimba documents
      const fetchedBimbaDocuments = await documentService.getAllDocuments('Documents');

      // Then load pratibimba documents
      const fetchedPratibimbaDocuments = await documentService.getAllDocuments('pratibimbaDocuments');

      // Cache ALL documents at once
      documentCacheService.cacheAllDocuments(fetchedBimbaDocuments, fetchedPratibimbaDocuments);

      // Combine all documents
      const documents = [...fetchedBimbaDocuments, ...fetchedPratibimbaDocuments];

      // Update state with all documents
      dispatch({
        type: 'SET_DOCUMENTS',
        payload: documents
      });

      console.log(`✅ Loaded ${documents.length} documents (${fetchedBimbaDocuments.length} bimba, ${fetchedPratibimbaDocuments.length} pratibimba)`);
    } catch (error) {
      console.error('❌ Error loading documents:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to load documents: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: false
      });
    }
  }, []);

  // Define the loadDocumentsFromMongoDB function with useCallback
  // to ensure it's only created once and to fix dependency issues
  const loadDocumentsFromMongoDB = useCallback(async () => {
    // Skip if we're already loading documents
    if (isLoadingDocumentsRef.current) {
      return;
    }

    // Skip if we've already loaded documents
    if (documentsLoadedRef.current) {
      return;
    }

    // Mark that we're loading documents
    isLoadingDocumentsRef.current = true;

    try {
      // Import documentService and documentCacheService
      const [moduleService, moduleCacheService] = await Promise.all([
        import('../1_services/documentService'),
        import('../1_services/documentCacheService')
      ]);

      const documentService = moduleService.documentService;
      const documentCacheService = moduleCacheService.default;

      // Load bimba documents first - no cache check, just load directly
      const fetchedBimbaDocuments = await documentService.getAllDocuments('Documents');

      // Update state with bimba documents immediately so sidebar can show them
      if (fetchedBimbaDocuments.length > 0) {
        dispatch({
          type: 'SET_DOCUMENTS',
          payload: fetchedBimbaDocuments
        });
      }

      // Then load pratibimba documents
      const fetchedPratibimbaDocuments = await documentService.getAllDocuments('pratibimbaDocuments');

      // Cache ALL documents at once
      documentCacheService.cacheAllDocuments(fetchedBimbaDocuments, fetchedPratibimbaDocuments);

      // Combine all documents
      const documents = [...fetchedBimbaDocuments, ...fetchedPratibimbaDocuments];

      // Update state with all documents
      dispatch({
        type: 'SET_DOCUMENTS',
        payload: documents
      });

      // Set a status message for non-admin users about read-only mode
      if (userState.userData?.role !== 'admin') {
        dispatch({
          type: 'SET_STATUS_MESSAGE',
          payload: {
            type: 'info',
            text: 'You are in read-only mode. Document editing is only available for admin users.'
          }
        });
      }

      // Set loading state to false when documents are loaded
      console.log('Document loading complete, setting loading state to false');
      dispatch({ type: 'SET_LOADING', payload: false });

      // Mark as loaded AFTER everything is complete
      documentsLoadedRef.current = true;
      console.log('Documents loaded successfully');
    } catch (error) {
      console.error('Error loading documents from MongoDB:', error);
      // Set loading state to false even if there's an error
      dispatch({ type: 'SET_LOADING', payload: false });
      // Set error message
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load documents. Please try refreshing the page.'
      });
    } finally {
      // Mark that we're no longer loading documents
      isLoadingDocumentsRef.current = false;
    }
  }, [dispatch, userState.userData?.role]);

  // Load documents from MongoDB on startup - immediately with no delay
  useEffect(() => {
    // Start loading documents immediately
    loadDocumentsFromMongoDB();
  }, [loadDocumentsFromMongoDB]);



  // No need to save selections to localStorage - they should be cleared on page refresh

  // Clear error and status message after 5 seconds
  useEffect(() => {
    if (state.error || state.statusMessage) {
      const timeoutId = setTimeout(() => {
        if (state.error) {
          dispatch({ type: 'SET_ERROR', payload: null });
        }
        if (state.statusMessage) {
          dispatch({ type: 'SET_STATUS_MESSAGE', payload: null });
        }
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.error, state.statusMessage]);

  // Listen for document ID updates
  useEffect(() => {
    const handleDocumentIdUpdate = (event: CustomEvent) => {
      const { oldId, newId } = event.detail;
      console.log(`Handling document ID update event: ${oldId} -> ${newId}`);

      // Update document references
      const updatedDocuments = state.documents.map(doc => {
        // Update the document ID
        if (doc.id === oldId) {
          return {
            ...doc,
            id: newId
          };
        }

        // Update pratibimba references in bimba documents
        if (doc.pratibimbaIds && doc.pratibimbaIds.includes(oldId)) {
          return {
            ...doc,
            pratibimbaIds: doc.pratibimbaIds.map(id => id === oldId ? newId : id)
          };
        }

        return doc;
      });

      // Update the current document ID if needed
      const updatedCurrentDocumentId = state.currentDocumentId === oldId ? newId : state.currentDocumentId;

      // Update the state
      dispatch({
        type: 'SET_DOCUMENTS',
        payload: updatedDocuments
      });

      if (updatedCurrentDocumentId !== state.currentDocumentId) {
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: updatedCurrentDocumentId
        });
      }
    };

    // Add event listener
    window.addEventListener('update-document-id', handleDocumentIdUpdate as EventListener);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('update-document-id', handleDocumentIdUpdate as EventListener);
    };
  }, [state.documents, state.currentDocumentId]);

  return (
    <EpiiContext.Provider value={{ state, dispatch }}>
      {children}
    </EpiiContext.Provider>
  );
};

// Create hook for using the context
export const useEpii = () => {
  const context = useContext(EpiiContext);
  if (context === undefined) {
    throw new Error('useEpii must be used within an EpiiProvider');
  }
  return context;
};
