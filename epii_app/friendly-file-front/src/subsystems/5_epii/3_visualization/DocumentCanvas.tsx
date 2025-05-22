/**
 * Canvas for document editing and analysis
 * Bimba Coordinate: #5-3-4.5-3
 */

import React, { useState, useEffect } from 'react';
import {
  FileText, Save, AlertCircle, Loader, PenTool, Trash2, Sparkles,
  FileText as FileIcon, Settings, X, ChevronUp, ChevronDown
} from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import { TextSelection, NotionUpdatePayload } from '../0_foundation/epiiTypes';
import { useEpii } from '../4_context/EpiiContext';
import { useDocumentAnalysis } from '../2_hooks/useEpiiDocument';
import documentService from '../1_services/documentService';
import DocumentControls from './DocumentControls';
import AnalysisResultsPanel from './AnalysisResultsPanel';
import NotionPreview from './NotionPreview';

interface DocumentCanvasProps {
  userId: string;
  onDocumentDeleted?: (documentId: string, coordinate?: string) => void;
}

const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ userId, onDocumentDeleted }) => {
  const { state, dispatch } = useEpii();
  const {
    currentDocumentId,
    documents,
    error,
    statusMessage
  } = state;

  // Get current document with improved debugging
  console.log(`DocumentCanvas: Looking for document with ID ${currentDocumentId} in ${documents.length} documents`);
  if (documents.length > 0) {
    console.log(`DocumentCanvas: Available document IDs:`, documents.map(doc => doc.id || doc._id));
  }

  // Find document by id or _id
  let currentDocument = documents.find(doc =>
    doc.id === currentDocumentId ||
    doc._id === currentDocumentId
  );

  // Ensure document has both id and _id properties if found
  if (currentDocument) {
    if (!currentDocument.id && currentDocument._id) {
      currentDocument.id = currentDocument._id;
    }
    if (!currentDocument._id && currentDocument.id) {
      currentDocument._id = currentDocument.id;
    }
  }

  // Debug output for document matching
  if (currentDocument) {
    console.log(`DocumentCanvas: Found document with ID ${currentDocumentId}`);
  } else if (currentDocumentId) {
    console.log(`DocumentCanvas: Document with ID ${currentDocumentId} NOT found in documents array`);
  }

  // Check if this is a pratibimba document
  const isPratibimba = currentDocument?.documentType === 'pratibimba';

  // Document hooks
  const {
    startAnalysis,
    isAnalyzing,
    targetCoordinate,
    setTargetCoordinate,
    crystallizeResults,
    latestSession
  } = useDocumentAnalysis();

  // Local state
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSendingToNotion, setIsSendingToNotion] = useState<boolean>(false);
  const [showNotionPreview, setShowNotionPreview] = useState<boolean>(false);
  const [showAnalysisResults, setShowAnalysisResults] = useState<boolean>(false);
  const [showDocumentControls, setShowDocumentControls] = useState<boolean>(false);
  const [notionPageUrl, setNotionPageUrl] = useState<string | undefined>(undefined);
  // We keep track of the current selection in local state for immediate updates
  // but the source of truth is in the EpiiContext
  const [, setCurrentSelection] = useState<TextSelection | null>(null);

  // Update local state when current document changes
  useEffect(() => {
    // Check if we have a current document
    if (currentDocument) {
      const isPratibimba = currentDocument.documentType === 'pratibimba';
      console.log(`Loading ${isPratibimba ? 'pratibimba' : 'bimba'} document ${currentDocument.id}: ${currentDocument.name}`);

      // DEBUG: Log the entire document object to see what fields are actually present
      console.log('Current document object:', JSON.stringify(currentDocument, null, 2));

      // Set the document name
      setDocumentName(currentDocument.name);

      // Set the target coordinate if available
      if (currentDocument.bimbaCoordinate) {
        setTargetCoordinate(currentDocument.bimbaCoordinate);
      }

      // CRITICAL FIX: Immediately set document content if it's available in the document object
      // This ensures the content is set even if the async loading function hasn't completed yet
      if (currentDocument.textContent) {
        console.log(`IMMEDIATE FIX: Setting document content from textContent, length: ${currentDocument.textContent.length}`);
        setDocumentContent(currentDocument.textContent);
        previousContentRef.current = currentDocument.textContent;
      } else if (currentDocument.content) {
        // Fallback to content field if textContent is not available
        console.log(`IMMEDIATE FIX: Setting document content from content field, length: ${currentDocument.content.length}`);
        setDocumentContent(currentDocument.content);
        previousContentRef.current = currentDocument.content;

        // Also update the document in the context to use textContent consistently
        dispatch({
          type: 'UPDATE_DOCUMENT',
          payload: {
            id: currentDocument.id,
            textContent: currentDocument.content,
            forceSync: false
          }
        });
      }

      // Set loading state
      setIsSaving(true);

      // IMPROVED DOCUMENT LOADING STRATEGY:
      // 1. If document has content in state, use it directly
      // 2. Otherwise, check the cache (via documentService)
      // 3. Only if cache misses, load from MongoDB

      const loadDocumentContent = async () => {
        try {
          // First check if document already has textContent in state
          if (currentDocument.textContent) {
            console.log(`Using existing textContent for document ${currentDocument.id}, length: ${currentDocument.textContent.length}`);
            console.log(`Content preview: "${currentDocument.textContent.substring(0, 50)}..."`);
            setDocumentContent(currentDocument.textContent);
            previousContentRef.current = currentDocument.textContent;
            setIsSaving(false);
            return;
          }

          // Fallback to content for backward compatibility
          if (currentDocument.content) {
            console.log(`Using existing content for document ${currentDocument.id}, length: ${currentDocument.content.length}`);
            console.log(`Content preview: "${currentDocument.content.substring(0, 50)}..."`);
            setDocumentContent(currentDocument.content);
            previousContentRef.current = currentDocument.content;
            setIsSaving(false);
            return;
          }

          // If it's a temporary document with no content, just set empty content
          if (currentDocument.isTemporary || currentDocument.id.startsWith('temp-')) {
            console.log(`No content available for temporary document ${currentDocument.id}`);
            setDocumentContent('');
            previousContentRef.current = '';
            setIsSaving(false);
            return;
          }

          // Import document cache service first
          const documentCacheService = (await import('../1_services/documentCacheService')).default;

          // Clean the document ID to ensure it's in a format that MongoDB can handle
          const cleanedId = currentDocument.id.replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);

          // First check if the document is in the cache
          const cachedDoc = documentCacheService.getDocumentById(cleanedId) ||
                           documentCacheService.getDocumentById(currentDocument.id);

          if (cachedDoc && cachedDoc.textContent) {
            console.log(`Using document ${currentDocument.id} from cache with textContent length: ${
              cachedDoc.textContent?.length || 0
            }`);

            // Use textContent only - no fallbacks to other property names
            const docContent = cachedDoc.textContent;

            console.log(`Loaded document ${currentDocument.id} from cache, textContent length: ${docContent.length}`);
            if (docContent) {
              console.log(`Content preview: "${docContent.substring(0, 50)}..."`);
            }

            setDocumentContent(docContent);
            previousContentRef.current = docContent;

            // Only update document in context if content is not empty
            if (docContent.length > 0) {
              dispatch({
                type: 'UPDATE_DOCUMENT',
                payload: {
                  id: currentDocument.id,
                  textContent: docContent, // Use textContent consistently
                  name: cachedDoc.name || currentDocument.name,
                  // Don't force sync since we just loaded it
                  forceSync: false
                }
              });
            }

            setIsSaving(false);
            return;
          }

          // If not in cache, then as a last resort, fetch from MongoDB
          console.log(`Document ${currentDocument.id} not found in cache, fetching from MongoDB...`);

          // Import document service
          const { documentService } = await import('../1_services/documentService');

          // Use documentService to load from MongoDB
          const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';
          const doc = await documentService.getDocument(cleanedId, collection, true);

          // MongoDB documents use textContent field
          if (doc) {
            // Get the content from textContent field
            const docContent = doc.textContent || '';

            console.log(`Loaded document ${currentDocument.id} using documentService, textContent length: ${docContent.length}`);
            if (docContent) {
              console.log(`Content preview: "${docContent.substring(0, 50)}..."`);
            }

            setDocumentContent(docContent);
            previousContentRef.current = docContent;

            // Only update document in context if content is not empty
            // This prevents infinite loops with empty documents
            if (docContent.length > 0) {
              dispatch({
                type: 'UPDATE_DOCUMENT',
                payload: {
                  id: currentDocument.id,
                  textContent: docContent, // Use textContent consistently
                  name: doc.name || currentDocument.name,
                  // Don't force sync since we just loaded it
                  forceSync: false
                }
              });
            } else {
              console.log(`Not updating document ${currentDocument.id} in context - content is empty`);
            }
          } else {
            console.warn(`Document ${currentDocument.id} not found in MongoDB or cache`);
            setDocumentContent('');
            previousContentRef.current = '';
          }
        } catch (error) {
          console.error(`Error loading document ${currentDocument.id} from MongoDB:`, error);
          setDocumentContent('');
          previousContentRef.current = '';
        } finally {
          setIsSaving(false);
        }
      };

      // Call the async function
      loadDocumentContent();
    }

    // Update the previous document ID ref
    previousDocumentIdRef.current = currentDocument?.id;
  }, [currentDocument, dispatch, setTargetCoordinate]);

  // Save document when switching to another document or when content changes
  const previousDocumentIdRef = React.useRef(currentDocumentId);
  const previousContentRef = React.useRef(documentContent);
  const previousNameRef = React.useRef(documentName);
  const contentChangeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-save when content changes
  useEffect(() => {
    // Don't do anything if there's no current document
    if (!currentDocumentId) {
      return;
    }

    // Clear any existing timeout
    if (contentChangeTimeoutRef.current) {
      clearTimeout(contentChangeTimeoutRef.current);
    }

    // Don't save if content is empty, unchanged, or if we're just initializing
    if (!documentContent ||
        documentContent === previousContentRef.current ||
        !previousContentRef.current) {
      // Update the ref for next comparison
      previousContentRef.current = documentContent;
      return;
    }

    // Only auto-save if there's a meaningful change (more than 5 characters different)
    const prevLength = previousContentRef.current?.length || 0;
    const currentLength = documentContent?.length || 0;
    const lengthDiff = Math.abs(currentLength - prevLength);

    if (lengthDiff < 5 && prevLength > 0) {
      // Small change, might be just cursor movement or minor edit
      // Update the ref but don't trigger save
      previousContentRef.current = documentContent;
      return;
    }

    console.log(`Content changed significantly (${lengthDiff} chars), scheduling auto-save for ${currentDocumentId}`);

    // Set a timeout to save after 2 seconds of inactivity
    contentChangeTimeoutRef.current = setTimeout(() => {
      if (currentDocumentId) {
        console.log(`Auto-saving document ${currentDocumentId} after content change`);

        // Update the document in state
        dispatch({
          type: 'UPDATE_DOCUMENT',
          payload: {
            id: currentDocumentId,
            textContent: documentContent, // Use textContent consistently
            name: documentName,
            // Always force sync to ensure changes are saved
            forceSync: true
          }
        });
      }

      // Update the ref after saving
      previousContentRef.current = documentContent;
    }, 2000);

    // Cleanup function
    return () => {
      if (contentChangeTimeoutRef.current) {
        clearTimeout(contentChangeTimeoutRef.current);
      }
    };
  }, [documentContent, currentDocumentId, documentName, dispatch]);

  // Save document when switching to another document
  useEffect(() => {
    // If we're switching from one document to another, save the previous document
    if (previousDocumentIdRef.current &&
        previousDocumentIdRef.current !== currentDocumentId) {

      console.log(`Switching from document ${previousDocumentIdRef.current} to ${currentDocumentId || 'none'}`);

      // Find the previous document
      const prevDocument = documents.find(doc => doc.id === previousDocumentIdRef.current);

      if (prevDocument && previousContentRef.current) {
        // Check if content has actually changed before saving
        const prevDocInState = documents.find(doc => doc.id === previousDocumentIdRef.current);
        const hasContentChanged = prevDocInState &&
                                 prevDocInState.textContent !== previousContentRef.current;

        if (hasContentChanged) {
          console.log(`Saving previous document ${prevDocument.id} before switching - content changed`);
          console.log(`Previous content length: ${previousContentRef.current.length}`);

          // Update the previous document in state with the PREVIOUS content (not current)
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: prevDocument.id,
              textContent: previousContentRef.current, // Use textContent consistently
              name: previousNameRef.current,
              forceSync: true // Force sync to MongoDB
            }
          });
        } else {
          console.log(`Not saving previous document ${prevDocument.id} - content unchanged`);
        }
      }

      // If we're switching to a new document, immediately set its content if available
      if (currentDocumentId) {
        const newDocument = documents.find(doc => doc.id === currentDocumentId);
        if (newDocument && newDocument.textContent) {
          console.log(`Immediately setting content for new document ${currentDocumentId}, length: ${newDocument.textContent.length}`);
          setDocumentContent(newDocument.textContent);
          previousContentRef.current = newDocument.textContent;
        }
      }
    }

    // Update the refs for next time
    previousDocumentIdRef.current = currentDocumentId;

    // Only update these refs if we have a current document
    if (currentDocumentId) {
      previousContentRef.current = documentContent;
      previousNameRef.current = documentName;
    }
  }, [currentDocumentId, dispatch, documentContent, documentName, documents]);

  // Create a new empty document
  const createNewDocument = async () => {
    // Initial content and name
    const initialContent = documentContent || '';
    const initialName = 'Untitled Document';

    // Set loading state
    setIsSaving(true);

    try {
      // Create document in MongoDB using the document service
      const result = await documentService.createDocument({
        name: initialName,
        textContent: initialContent, // Use textContent consistently
        userId: userId
      });

      // Create the document object for the context
      const newDoc = {
        id: result.id || `temp-${Date.now()}`,
        name: initialName,
        textContent: initialContent, // Use textContent consistently
        lastModified: new Date(),
        versions: [{ timestamp: new Date(), textContent: initialContent }], // Use textContent consistently
        documentType: 'bimba' as const, // Explicitly set as bimba document
        pratibimbaIds: [] // Initialize with empty array
      };

      // Add document to context state
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: newDoc
      });

      // Set as current document
      dispatch({
        type: 'SET_CURRENT_DOCUMENT',
        payload: newDoc.id
      });

      // Update local state
      setDocumentContent(initialContent);
      setDocumentName(initialName);

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'New document created successfully.'
        }
      });
    } catch (error) {
      console.error('Error creating document:', error);

      // Fallback to local-only document
      const tempId = `temp-${Date.now()}`;
      const localDoc = {
        id: tempId,
        name: initialName,
        textContent: initialContent, // Use textContent consistently
        lastModified: new Date(),
        versions: [{ timestamp: new Date(), textContent: initialContent }], // Use textContent consistently
        documentType: 'bimba' as const, // Explicitly set as bimba document
        pratibimbaIds: [] // Initialize with empty array
      };

      // Add to context state
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: localDoc
      });

      // Set as current document
      dispatch({
        type: 'SET_CURRENT_DOCUMENT',
        payload: localDoc.id
      });

      // Update local state
      setDocumentContent(initialContent);
      setDocumentName(initialName);

      // Show error message
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to create document in MongoDB. Using local storage only.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle document change
  const handleDocumentChange = (content: string) => {
    setDocumentContent(content);
  };

  // Handle text selection
  const handleSelectionChange = (selection: TextSelection | null) => {
    // If selection is null, don't clear it - this allows selections to persist
    if (selection === null) {
      console.log('Selection cleared, but not clearing in state to allow persistence');
      setCurrentSelection(null);
      // We don't clear the selection in the context
      // This allows selections to persist when switching documents
      return;
    }

    // Always update the selection, even if it's the same text
    // This allows re-selecting the same text after clicking elsewhere
    setCurrentSelection(selection);
    console.log(`Selection: "${selection.text}" (${selection.start}-${selection.end})`);

    // The DocumentViewer now handles updating the EpiiContext directly
    // We don't need to do it here anymore, but we keep the local state update
    // for backward compatibility
  };

  // Handle selection action
  const handleSelectionAction = (action: 'analyze' | 'crystallize', selection: TextSelection) => {
    if (!selection || !currentDocumentId) return;

    console.log(`Selection action: ${action}`, selection);

    if (action === 'analyze') {
      // For now, just log the selection
      console.log(`Analyzing selection: "${selection.text}"`);

      // Show a status message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'info',
          text: `Analyzing selection: "${selection.text.substring(0, 30)}${selection.text.length > 30 ? '...' : ''}"`
        }
      });
    } else if (action === 'crystallize') {
      // Create a new pratibimba document from the selection
      handleCreatePratibimba(selection);
    }
  };

  // Handle preview Notion update
  const handlePreviewNotionUpdate = () => {
    if (!currentDocument || !currentDocumentId) return;

    // Show the Notion preview
    setShowNotionPreview(true);
  };

  // Handle send to Notion
  const handleSendToNotion = async (updatedPayload?: NotionUpdatePayload) => {
    if (!currentDocument || !currentDocumentId) return;

    // Set loading state
    setIsSendingToNotion(true);

    try {
      // Get the document's coordinate from various possible sources
      let documentCoordinate =
        currentDocument.bimbaCoordinate ||
        currentDocument.metadata?.targetCoordinate ||
        targetCoordinate ||
        '#5-2-1'; // Fallback default

      // Ensure the coordinate has the # prefix
      if (documentCoordinate && !documentCoordinate.startsWith('#')) {
        documentCoordinate = '#' + documentCoordinate;
      }

      console.log('Using document coordinate for Notion update:', documentCoordinate);

      // Prepare the notionUpdatePayload
      let notionUpdatePayload;

      if (updatedPayload) {
        // Use the updated payload from the NotionPreview component
        notionUpdatePayload = {
          ...updatedPayload,
          // Ensure the coordinate is set
          targetCoordinate: updatedPayload.targetCoordinate || documentCoordinate
        };
      } else {
        // Create a default payload
        notionUpdatePayload = {
          // Always include these required fields
          targetCoordinate: documentCoordinate,
          content: currentDocument.textContent || '# ' + currentDocument.title + '\n\nContent from document.',
          title: currentDocument.title || 'Document for ' + documentCoordinate,

          // Include these if available from the document
          ...(currentDocument.metadata?.notionUpdatePayload || {}),

          // Ensure these fields are always present
          analysisResults: currentDocument.metadata?.analysisResults || {},
          relatedCoordinates: currentDocument.metadata?.relatedCoordinates || [],

          // Use the correct property names for Notion
          properties: {
            // The title property is handled separately in the backend
            // "Node Name" will be set to the title value

            // Set non-relation properties directly
            // Content Type is a select property
            "Content Type": {
              select: {
                name: currentDocument.metadata?.analysisResults?.contentType || "Crystallization"
              }
            },

            // Status is a status property
            "Status": {
              status: {
                name: "Draft"
              }
            }

            // Relation properties will be handled by the backend by adding notes to the content:
            // - "💠 QL Operators" (relation to Quaternal Logic DB)
            // - "🕸️ Semantic Framework" (relation to Semantics DB)
            // - "⚕️ Archetypal Anchors" (relation to Symbols DB)
            // - "📚 Epistemic Essence" (relation to Concepts DB)
          }
        };
      }

      console.log('Sending Notion update with payload:', notionUpdatePayload);

      // Call the API to send to Notion
      const response = await fetch('http://localhost:3001/api/notion-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notionUpdatePayload,
          sourceDocumentId: currentDocumentId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send to Notion: ${response.statusText}`);
      }

      const result = await response.json();

      // Update the document status
      dispatch({
        type: 'UPDATE_DOCUMENT',
        payload: {
          id: currentDocumentId,
          metadata: {
            ...currentDocument.metadata,
            status: 'sent_to_notion',
            notionReference: {
              updated: true,
              updateDate: new Date(),
              notionPageId: result.notionPageId,
              status: 'synced'
            }
          },
          forceSync: true
        }
      });

      // Set the Notion page URL
      setNotionPageUrl(result.url);

      // Close the preview
      setShowNotionPreview(false);

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: `Successfully sent to Notion.`
        }
      });

      // Reload documents using the cache first
      const reloadDocuments = async () => {
        try {
          console.log('Reloading documents after Notion update...');

          // Import document cache service first
          const documentCacheModule = await import('../1_services/documentCacheService');
          const documentCacheService = documentCacheModule.default;

          // Invalidate the cache for the current document and its coordinate
          if (currentDocument && currentDocument.id) {
            documentCacheService.invalidateDocument(currentDocument.id);

            if (currentDocument.bimbaCoordinate) {
              const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';
              documentCacheService.invalidateCoordinate(currentDocument.bimbaCoordinate, collection);
            }
          }

          // Get documents from the context state - no need to reload from MongoDB
          const { state } = useEpii();
          const documents = state.documents;

          // Filter documents by type
          const mongoDocuments = documents.filter(doc => doc.documentType === 'bimba');
          const mongoPratibimbaDocuments = documents.filter(doc => doc.documentType === 'pratibimba');

          // Process and format documents
          let formattedDocs = [];

          // Format bimba documents
          if (mongoDocuments && Array.isArray(mongoDocuments)) {
            const formattedBimbaDocs = mongoDocuments.map(doc => ({
              id: doc._id,
              name: doc.fileName || doc.originalName || 'Untitled Document',
              bimbaCoordinate: doc.targetCoordinate || null,
              lastModified: new Date(doc.lastModified || doc.uploadDate),
              isTemporary: false,
              documentType: 'bimba',
              pratibimbaIds: doc.pratibimbaIds || [],
              versions: []
            }));
            formattedDocs = [...formattedDocs, ...formattedBimbaDocs];
          }

          // Format pratibimba documents
          if (mongoPratibimbaDocuments && Array.isArray(mongoPratibimbaDocuments)) {
            const formattedPratibimbaDocs = mongoPratibimbaDocuments.map(doc => ({
              id: doc._id,
              name: doc.fileName || doc.originalName || 'Untitled Crystallization',
              bimbaCoordinate: doc.targetCoordinate || null,
              lastModified: new Date(doc.lastModified || doc.uploadDate),
              documentType: 'pratibimba',
              bimbaId: doc.bimbaId,
              sourceSelection: doc.sourceSelection,
              crystallizationIntent: doc.crystallizationIntent,
              crystallizationDate: new Date(doc.crystallizationDate),
              versions: []
            }));
            formattedDocs = [...formattedDocs, ...formattedPratibimbaDocs];
          }

          // Update state with all documents
          dispatch({
            type: 'SET_DOCUMENTS',
            payload: formattedDocs
          });

          console.log('Successfully reloaded documents after Notion update');
        } catch (error) {
          console.error('Error reloading documents after Notion update:', error);
        }
      };

      // Execute the reload after a short delay to ensure MongoDB has been updated
      setTimeout(reloadDocuments, 1000);
    } catch (error) {
      console.error('Error sending to Notion:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to send to Notion: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSendingToNotion(false);
    }
  };

  // Handle creating a new pratibimba document from selection
  const handleCreatePratibimba = async (selection: TextSelection) => {
    if (!currentDocumentId || !currentDocument) return;

    // Show loading state
    setIsSaving(true);

    try {
      // Create a default name for the crystallization
      const pratibimbaName = `Crystallization of ${documentName}`;

      // Create a new pratibimba document
      dispatch({
        type: 'CREATE_PRATIBIMBA',
        payload: {
          bimbaId: currentDocumentId,
          name: pratibimbaName,
          content: selection.text,
          sourceSelection: selection,
          crystallizationIntent: 'Manual crystallization from selection',
          bimbaCoordinate: currentDocument.bimbaCoordinate
        }
      });

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: `Created crystallization from selection.`
        }
      });
    } catch (error) {
      console.error('Error creating crystallization:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to create crystallization: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle creating a new empty pratibimba document
  const handleCreateEmptyPratibimba = async () => {
    if (!currentDocumentId || !currentDocument) return;

    // Show loading state
    setIsSaving(true);

    try {
      // Create a default name for the crystallization
      const pratibimbaName = `Crystallization of ${documentName}`;

      // Create a new pratibimba document
      dispatch({
        type: 'CREATE_PRATIBIMBA',
        payload: {
          bimbaId: currentDocumentId,
          name: pratibimbaName,
          content: '', // Empty content
          sourceSelection: { start: 0, end: 0, text: '' },
          crystallizationIntent: 'Manual empty crystallization',
          bimbaCoordinate: currentDocument.bimbaCoordinate
        }
      });

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: `Created empty crystallization.`
        }
      });
    } catch (error) {
      console.error('Error creating empty crystallization:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to create crystallization: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!currentDocumentId || !currentDocument) {
      console.warn("Cannot delete document: No current document selected");
      return;
    }

    // Check if this is a pratibimba document
    const isPratibimba = currentDocument.documentType === 'pratibimba';
    const documentIdToDelete = currentDocumentId; // Store in a constant to avoid closure issues
    const documentCoordinate = currentDocument?.bimbaCoordinate;

    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${documentName}"? This action cannot be undone.`)) {
      return;
    }

    setIsSaving(true);
    console.log(`Deleting ${isPratibimba ? 'pratibimba' : 'bimba'} document ${documentIdToDelete}`);

    try {
      // First, clear the current document state to prevent UI issues
      // This ensures we don't try to render a document that's being deleted
      dispatch({
        type: 'SET_CURRENT_DOCUMENT',
        payload: null
      });

      // Reset canvas state immediately to prevent UI issues
      setDocumentContent('');
      setDocumentName('');
      setTargetCoordinate(null);

      // Skip MongoDB delete for temporary documents
      if (documentIdToDelete.startsWith('temp-')) {
        console.log(`Deleting temporary document ${documentIdToDelete} from state only`);

        // Just remove from state
        dispatch({
          type: 'REMOVE_DOCUMENT',
          payload: documentIdToDelete
        });

        // Show success message
        dispatch({
          type: 'SET_STATUS_MESSAGE',
          payload: {
            type: 'success',
            text: 'Document deleted successfully.'
          }
        });
      } else {
        // For MongoDB documents, we'll delete from the database
        console.log(`Deleting document ${documentIdToDelete} from MongoDB collection ${isPratibimba ? 'pratibimbaDocuments' : 'Documents'}`);

        // Delete from MongoDB using the appropriate collection
        const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';

        // Remove from state first to ensure UI responsiveness
        dispatch({
          type: 'REMOVE_DOCUMENT',
          payload: documentIdToDelete
        });

        // Then delete from MongoDB asynchronously
        const deletePromise = documentService.deleteDocument(documentIdToDelete, collection);

        // Show a pending message
        dispatch({
          type: 'SET_STATUS_MESSAGE',
          payload: {
            type: 'info',
            text: `Deleting ${isPratibimba ? 'crystallization' : 'document'} from database...`
          }
        });

        // Wait for the deletion to complete
        const result = await deletePromise;
        console.log(`Delete ${isPratibimba ? 'pratibimba' : 'bimba'} result:`, result);

        // Force reload of document list from MongoDB
        if (onDocumentDeleted) {
          // Pass both the document ID and the coordinate (if available)
          onDocumentDeleted(documentIdToDelete, documentCoordinate);
        }

        // Show success message based on the result
        if (result.success) {
          dispatch({
            type: 'SET_STATUS_MESSAGE',
            payload: {
              type: 'success',
              text: `${isPratibimba ? 'Crystallization' : 'Document'} deleted successfully from database.`
            }
          });
        } else {
          // Even if the API call failed, we've already removed it from state
          // So we'll show a warning message
          dispatch({
            type: 'SET_STATUS_MESSAGE',
            payload: {
              type: 'warning',
              text: `${isPratibimba ? 'Crystallization' : 'Document'} removed from view, but there was an issue with database deletion: ${result.message}`
            }
          });
        }
      }
    } catch (error) {
      console.error('Error deleting document:', error);

      // Even if there was an error, we've already removed the document from state
      // So we'll show a warning message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'warning',
          text: `Document removed from view, but there was an error with database deletion: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle document save
  const handleSaveDocument = async () => {
    if (!currentDocumentId || !currentDocument) return;

    // Check if this is a pratibimba document
    const isPratibimba = currentDocument.documentType === 'pratibimba';

    setIsSaving(true);
    console.log(`Saving ${isPratibimba ? 'pratibimba' : 'bimba'} document ${currentDocumentId} with content length: ${documentContent.length}`);
    console.log(`Content preview: "${documentContent.substring(0, 50)}..."`);

    try {
      if (currentDocumentId.startsWith('temp-')) {
        // This is a temporary document, create a new one in MongoDB
        console.log('Creating new document in MongoDB from temporary document');

        try {
          let result: { id?: string, content?: string, bimbaId?: string, sourceSelection?: TextSelection, crystallizationIntent?: string };

          if (isPratibimba) {
            // Get the bimba document ID from the state
            const bimbaId = currentDocument.bimbaId;

            if (!bimbaId) {
              throw new Error('Cannot create pratibimba document without a bimba document ID');
            }

            // Create pratibimba document in MongoDB
            result = await documentService.createPratibimbaDocument({
              name: documentName,
              content: documentContent,
              bimbaId: bimbaId,
              sourceSelection: currentDocument.sourceSelection || { start: 0, end: 0, text: '' },
              crystallizationIntent: currentDocument.crystallizationIntent || 'Manual crystallization',
              bimbaCoordinate: targetCoordinate
            });
          } else {
            // Create regular document in MongoDB
            result = await documentService.createDocument({
              name: documentName,
              content: documentContent,
              targetCoordinate: targetCoordinate
            });
          }

          console.log(`Created new ${isPratibimba ? 'pratibimba' : 'bimba'} document in MongoDB: ${result.id}`);
          console.log(`New document content length: ${result.content?.length || 0}`);

          // Verify the document was created correctly
          let verifiedDoc: { textContent?: string, content?: string };
          if (isPratibimba) {
            verifiedDoc = await documentService.getPratibimbaDocument(result.id);
          } else {
            verifiedDoc = await documentService.getDocument(result.id);
          }

          if (verifiedDoc && verifiedDoc.textContent) {
            console.log(`Verified new ${isPratibimba ? 'pratibimba' : 'bimba'} document exists in MongoDB with content length: ${verifiedDoc.textContent.length}`);
            console.log(`Verified content preview: "${verifiedDoc.textContent.substring(0, 50)}..."`);

            if (verifiedDoc.textContent.length !== documentContent.length) {
              console.warn(`WARNING: Saved content length (${verifiedDoc.textContent.length}) does not match expected (${documentContent.length})`);
            }
          }

          if (isPratibimba) {
            // Create a new pratibimba document object for the context
            const newDoc = {
              id: result.id,
              name: documentName,
              content: documentContent,
              bimbaCoordinate: targetCoordinate,
              lastModified: new Date(),
              documentType: 'pratibimba' as const,
              bimbaId: result.bimbaId,
              sourceSelection: result.sourceSelection || { start: 0, end: 0, text: '' },
              crystallizationIntent: result.crystallizationIntent || 'Manual crystallization',
              crystallizationDate: new Date(),
              versions: [{ timestamp: new Date(), content: documentContent }]
            };

            // Add the new document to state
            dispatch({
              type: 'ADD_DOCUMENT',
              payload: newDoc
            });

            // Set as current document
            dispatch({
              type: 'SET_CURRENT_DOCUMENT',
              payload: newDoc.id
            });
          } else {
            // Create a new bimba document object for the context
            const newDoc = {
              id: result.id,
              name: documentName,
              content: documentContent,
              bimbaCoordinate: targetCoordinate,
              lastModified: new Date(),
              isTemporary: false,
              documentType: 'bimba' as const,
              pratibimbaIds: [],
              versions: [{ timestamp: new Date(), content: documentContent }]
            };

            // Add the new document to state
            dispatch({
              type: 'ADD_DOCUMENT',
              payload: newDoc
            });

            // Set as current document
            dispatch({
              type: 'SET_CURRENT_DOCUMENT',
              payload: newDoc.id
            });
          }

          // Show success message
          dispatch({
            type: 'SET_STATUS_MESSAGE',
            payload: {
              type: 'success',
              text: `${isPratibimba ? 'Crystallization' : 'Document'} saved to MongoDB successfully.`
            }
          });
        } catch (createError) {
          console.error(`Error creating ${isPratibimba ? 'pratibimba' : 'bimba'} document in MongoDB:`, createError);

          // Update the temporary document in state
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: currentDocumentId,
              content: documentContent,
              name: documentName
            }
          });

          // Show error message
          dispatch({
            type: 'SET_ERROR',
            payload: `Failed to save ${isPratibimba ? 'crystallization' : 'document'} to MongoDB. Saved locally only.`
          });
        }
      } else {
        // This is an existing document, update it in MongoDB
        try {
          // First, update the document in context state to ensure it's saved
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: currentDocumentId,
              content: documentContent,
              name: documentName,
              forceSync: true // Force sync to MongoDB
            }
          });

          // Update the previous content ref to prevent auto-save issues
          previousContentRef.current = documentContent;

          // Clean the document ID to ensure it's in a format that MongoDB can handle
          const cleanedId = currentDocumentId.replace(/[^0-9a-f]/gi, '').padEnd(24, '0').substring(0, 24);
          console.log(`Original ID: ${currentDocumentId}, Cleaned ID: ${cleanedId}`);

          console.log(`Updating ${isPratibimba ? 'pratibimba' : 'bimba'} document ${currentDocumentId} in MongoDB`);
          console.log(`Content length: ${documentContent.length}, Content preview: "${documentContent.substring(0, 50)}..."`);

          // Update document in MongoDB using cleaned ID and the appropriate collection
          const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';
          await documentService.updateDocument(cleanedId, {
            content: documentContent,
            name: documentName,
            targetCoordinate: targetCoordinate
          }, collection);

          // Update metadata in state
          dispatch({
            type: 'UPDATE_DOCUMENT_METADATA',
            payload: {
              id: currentDocumentId,
              name: documentName,
              bimbaCoordinate: targetCoordinate
            }
          });

          console.log(`${isPratibimba ? 'Pratibimba' : 'Bimba'} document ${currentDocumentId} saved successfully to MongoDB`);

          // Show success message
          dispatch({
            type: 'SET_STATUS_MESSAGE',
            payload: {
              type: 'success',
              text: `${isPratibimba ? 'Crystallization' : 'Document'} saved successfully to MongoDB.`
            }
          });
        } catch (updateError) {
          console.error(`Error updating ${isPratibimba ? 'pratibimba' : 'bimba'} document in MongoDB:`, updateError);

          // Show error message
          dispatch({
            type: 'SET_ERROR',
            payload: `Failed to save ${isPratibimba ? 'crystallization' : 'document'} to MongoDB. Please try again.`
          });
        }
      }
    } catch (error) {
      console.error('Error saving document:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to save document. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle analysis start
  const handleStartAnalysis = async () => {
    if (!currentDocumentId || !targetCoordinate) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Please specify a target Bimba coordinate for analysis.'
      });
      return;
    }

    try {
      // Save document first
      await handleSaveDocument();

      // Start analysis
      await startAnalysis();

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: `Analysis started for coordinate ${targetCoordinate}.`
        }
      });
    } catch (error) {
      console.error('Error starting analysis:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to start analysis. Please try again.'
      });
    }
  };

  // Handle crystallize results
  const handleCrystallizeResults = async () => {
    if (!latestSession) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No analysis session available.'
      });
      return;
    }

    try {
      // Crystallize results
      await crystallizeResults();

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'Analysis results crystallized successfully.'
        }
      });
    } catch (error) {
      console.error('Error crystallizing results:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to crystallize results. Please try again.'
      });
    }
  };

  // Only show the empty state when there's no current document ID
  // This ensures we don't show the empty state when a document is selected but content is still loading
  if (!currentDocumentId) {
    console.log("Rendering empty state - no current document ID");
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-epii-darker rounded-lg border border-epii-dark">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-8 border-2 border-dashed rounded-lg transition-all">
          <PenTool size={48} className="mb-4 text-epii-neon" />
          <h3 className="text-xl font-semibold mb-2">
            Create a New Document
          </h3>
          <p className="text-center text-gray-400 mb-4">
            Start writing or select a document from the sidebar
          </p>
          <button
            onClick={createNewDocument}
            className="bg-epii-neon text-epii-darker px-4 py-2 rounded-md hover:brightness-110 transition-all"
          >
            New Document
          </button>
        </div>
      </div>
    );
  }

  // If we have a current document ID but no document object, show a loading state
  if (currentDocumentId && !currentDocument) {
    console.log(`Document with ID ${currentDocumentId} is selected but not found in documents array. Showing loading state.`);
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-epii-darker rounded-lg border border-epii-dark">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-epii-neon mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">
            Loading Document...
          </h3>
          <p className="text-center text-gray-400 mb-4">
            Please wait while the document is being loaded
          </p>
        </div>
      </div>
    );
  }

  // Render document canvas with loaded document
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-epii-dark">
        <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
          {isPratibimba ? (
            <Sparkles size={18} className="mr-2 text-purple-400 flex-shrink-0" />
          ) : (
            <FileText size={18} className="mr-2 text-epii-neon flex-shrink-0" />
          )}
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            onBlur={handleSaveDocument}
            className={`font-medium bg-transparent border-b border-transparent hover:border-epii-dark focus:${isPratibimba ? 'border-purple-400' : 'border-epii-neon'} focus:outline-none max-w-[150px] sm:max-w-[200px] ${isPratibimba ? 'text-purple-200' : ''}`}
            title="Click to edit document title"
          />
          {/* Document type indicator */}
          <span className={`ml-2 text-xs ${isPratibimba ? 'bg-purple-900/50 text-purple-300' : 'bg-epii-dark text-epii-neon'} px-2 py-1 rounded-md flex-shrink-0`}>
            {isPratibimba ? 'Crystallization' : 'Document'}
          </span>
          {/* Coordinate indicator */}
          {currentDocument?.bimbaCoordinate ? (
            <span className="ml-2 text-xs bg-epii-dark text-epii-neon px-2 py-1 rounded-md flex-shrink-0">
              {currentDocument.bimbaCoordinate}
            </span>
          ) : (
            <span className="ml-2 text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-md flex-shrink-0">
              #
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={targetCoordinate || ''}
              onChange={(e) => setTargetCoordinate(e.target.value)}
              placeholder="Target coordinate"
              className="w-full sm:w-32 md:w-40 p-1 text-sm bg-epii-dark text-white rounded-md focus:outline-none focus:ring-1 focus:ring-epii-neon"
            />
          </div>
          {!currentDocument?.bimbaCoordinate && targetCoordinate && (
            <button
              className="p-1 px-2 text-xs rounded-md transition-all bg-green-700 text-white hover:bg-green-600 flex-shrink-0"
              title="Assign coordinate"
              onClick={async () => {
                try {
                  // Update document with the assigned coordinate
                  await handleSaveDocument();

                  // Update the document in state with the new coordinate
                  if (currentDocument) {
                    dispatch({
                      type: 'UPDATE_DOCUMENT_COORDINATE',
                      payload: {
                        id: currentDocument.id,
                        bimbaCoordinate: targetCoordinate
                      }
                    });

                    try {
                      // Skip MongoDB update for temporary documents
                      if (currentDocument.id.startsWith('temp-')) {
                        console.warn('Skipping MongoDB update for temporary document:', currentDocument.id);
                      } else {
                        // Update coordinate in MongoDB using document service
                        if (isPratibimba) {
                          await documentService.updatePratibimbaDocument(currentDocument.id, {
                            targetCoordinate: targetCoordinate,
                            name: documentName,
                            content: documentContent
                          });
                        } else {
                          await documentService.updateDocument(currentDocument.id, {
                            targetCoordinate: targetCoordinate,
                            name: documentName,
                            content: documentContent
                          });
                        }

                        console.log(`Successfully updated coordinate for document ${currentDocument.id} to ${targetCoordinate}`);
                      }
                    } catch (apiError) {
                      console.warn('Error updating coordinate in MongoDB:', apiError);
                    }

                    // Show success message
                    dispatch({
                      type: 'SET_STATUS_MESSAGE',
                      payload: {
                        type: 'success',
                        text: `Coordinate ${targetCoordinate} assigned to document.`
                      }
                    });
                  }
                } catch (error) {
                  console.error('Error assigning coordinate:', error);
                  dispatch({
                    type: 'SET_ERROR',
                    payload: 'Failed to assign coordinate. Please try again.'
                  });
                }
              }}
            >
              Assign
            </button>
          )}

          {/* Only show Crystallize button for bimba documents */}
          {!isPratibimba && (
            <button
              className={`p-1 px-2 text-xs rounded-md transition-all ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-700 text-purple-100 hover:bg-purple-600'} flex-shrink-0`}
              title="Create new crystallization"
              onClick={() => handleCreateEmptyPratibimba()}
              disabled={isSaving}
            >
              <Sparkles size={12} className="mr-1" />
              Crystallize
            </button>
          )}
          <button
            className={`p-1 rounded-md transition-all ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-epii-dark hover:bg-epii-dark/80'} flex-shrink-0`}
            title="Save changes"
            onClick={handleSaveDocument}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
          </button>
          <button
            className={`p-1 rounded-md transition-all ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-800 hover:bg-red-700'} flex-shrink-0`}
            title="Delete document"
            onClick={handleDeleteDocument}
            disabled={isSaving}
          >
            <Trash2 size={14} className="text-red-200" />
          </button>
        </div>
      </div>
      <div className="relative flex-grow overflow-hidden">
        {/* Main document viewer - takes full width when panels are collapsed */}
        <div className="h-full overflow-auto">
          {/* DEBUG: Log what content is being passed to DocumentViewer */}
          {console.log(`DocumentCanvas: Passing content to DocumentViewer, length: ${documentContent.length}`)}
          {console.log(`DocumentCanvas: Content preview: "${documentContent.substring(0, 50)}..."`)}
          <DocumentViewer
            content={documentContent}
            filename={documentName}
            onChange={handleDocumentChange}
            onSelectionChange={handleSelectionChange}
            onSelectionAction={handleSelectionAction}
            readOnly={false}
            isPratibimba={isPratibimba}
          />
        </div>

        {/* Floating action button for controls */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowDocumentControls(!showDocumentControls)}
            className="bg-epii-dark hover:bg-epii-neon hover:text-epii-darker text-epii-neon p-2 rounded-full shadow-lg transition-colors"
            title={showDocumentControls ? "Hide controls" : "Show controls"}
          >
            {showDocumentControls ? <X size={20} /> : <Settings size={20} />}
          </button>
        </div>

        {/* Slide-out document controls panel */}
        <div className={`absolute top-0 right-0 h-full bg-epii-darker border-l border-epii-dark shadow-xl transition-all duration-300 z-20 overflow-hidden ${
          showDocumentControls ? 'w-80' : 'w-0'
        }`}>
          <div className="w-80 h-full overflow-auto">
            <DocumentControls
              onStartAnalysis={handleStartAnalysis}
              onCrystallize={handleCrystallizeResults}
              onPreviewNotionUpdate={handlePreviewNotionUpdate}
              onSendToNotion={handleSendToNotion}
              isAnalyzing={isAnalyzing}
              isSendingToNotion={isSendingToNotion}
              analysisResults={latestSession?.results || null}
              defaultCoordinate={currentDocument?.bimbaCoordinate || targetCoordinate || '#5-2-1'}
              documentType={isPratibimba ? 'pratibimba' : 'bimba'}
              documentStatus={currentDocument?.metadata?.status || 'draft'}
              notionPageUrl={notionPageUrl}
              onClose={() => setShowDocumentControls(false)}
            />
          </div>
        </div>

        {/* Slide-up analysis results panel */}
        {!isPratibimba && latestSession && latestSession.status === 'completed' && latestSession.results && (
          <div className={`absolute bottom-0 left-0 right-0 bg-epii-darker border-t border-epii-dark shadow-xl transition-all duration-300 ${
            showAnalysisResults ? 'h-1/2' : 'h-12'
          }`}>
            <div
              className="h-12 px-4 flex items-center justify-between cursor-pointer hover:bg-epii-dark/50"
              onClick={() => setShowAnalysisResults(!showAnalysisResults)}
            >
              <h3 className="font-medium flex items-center">
                <Sparkles size={18} className="mr-2 text-epii-neon" />
                Analysis Results
                {latestSession.results.extractedMappings && (
                  <span className="ml-2 bg-blue-600 text-xs px-2 py-0.5 rounded-full text-blue-100">
                    {latestSession.results.extractedMappings.length} mappings
                  </span>
                )}
              </h3>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCrystallizeResults();
                  }}
                  className="mr-4 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                >
                  <Sparkles size={16} className="mr-1" />
                  <span>Crystallize</span>
                </button>
                {showAnalysisResults ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </div>
            </div>

            <div className={`overflow-auto ${showAnalysisResults ? 'h-[calc(100%-3rem)]' : 'h-0'}`}>
              <AnalysisResultsPanel
                analysisResults={latestSession.results}
                onCrystallize={handleCrystallizeResults}
                isOpen={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-3 bg-red-900/50 border-t border-red-800 text-white flex items-center">
          <AlertCircle size={16} className="mr-2 text-red-400" />
          {error}
        </div>
      )}

      {statusMessage && (
        <div className={`p-3 ${statusMessage.type === 'success' ? 'bg-green-900/50 border-green-800' : 'bg-yellow-900/50 border-yellow-800'} border-t text-white flex items-center`}>
          <AlertCircle size={16} className="mr-2" />
          {statusMessage.text}
        </div>
      )}

      {/* Notion Preview Modal */}
      {showNotionPreview && currentDocument && (
        <NotionPreview
          notionUpdatePayload={currentDocument.metadata?.notionUpdatePayload || {
            targetCoordinate: currentDocument.metadata?.targetCoordinate || '',
            content: currentDocument.content || '',
            title: currentDocument.title || '',
            analysisResults: currentDocument.metadata?.analysisResults || {},
            relatedCoordinates: currentDocument.metadata?.relatedCoordinates || [],
            tags: []
          }}
          onClose={() => setShowNotionPreview(false)}
          onSendToNotion={handleSendToNotion}
          isSending={isSendingToNotion}
        />
      )}
    </div>
  );
};

export default DocumentCanvas;
