/**
 * Hooks for document management in Epii mode
 * Bimba Coordinate: #5-3-4.5-2
 */

import { useState, useCallback, useEffect } from 'react';
import { useEpii } from '../4_context/EpiiContext';
import { Document } from '../0_foundation/epiiTypes';
import { v4 as uuidv4 } from 'uuid';
import { getLanguageForSyntaxHighlighting } from "../1_services/utils/epiiHelpers";
import { useGraphData } from '../../0_anuttara/2_hooks/useGraphData';
import '../1_services/webSocketService'; // Import to ensure WebSocket connection is established

/**
 * Hook for managing document uploads
 */
export const useDocumentUpload = (userId: string) => {
  const { state, dispatch } = useEpii();
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = useCallback(async (file: File, targetCoordinate?: string) => {
    if (!file) return null;

    setIsUploading(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Add target coordinate if provided
      if (targetCoordinate) {
        formData.append('targetCoordinate', targetCoordinate);
      }

      // Upload file to server using the files API (temporary solution until documents API is fully working)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // First, check if the documents API is available
      let response;
      let useDocumentsApi = false;

      try {
        const debugResponse = await fetch(`${backendUrl}/api/documents/debug`);
        if (debugResponse.ok) {
          console.log('Documents API is available, using it for upload');
          useDocumentsApi = true;
          response = await fetch(`${backendUrl}/api/documents/upload`, {
            method: 'POST',
            body: formData,
          });
        } else {
          console.warn('Documents API debug endpoint not available, falling back to files API');
          useDocumentsApi = false;
        }
      } catch (error) {
        console.warn('Error checking documents API, falling back to files API:', error);
        useDocumentsApi = false;
      }

      // Fallback to files API if needed
      if (!useDocumentsApi) {
        console.log('Using files API for upload');
        response = await fetch(`${backendUrl}/files/upload`, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Get document content
      const content = data.document.textContent || await readFileAsText(file);

      // Create new document
      const newDocument: Document = {
        id: data.document.id || uuidv4(),
        name: file.name,
        content,
        lastModified: new Date(data.document.uploadDate),
        versions: [{ timestamp: new Date(data.document.uploadDate), content }],
        bimbaCoordinate: data.document.targetCoordinate || targetCoordinate
      };

      // Add document to state
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: newDocument
      });

      // Set current document
      dispatch({
        type: 'SET_CURRENT_DOCUMENT',
        payload: newDocument.id
      });

      // Add welcome message
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId: 'default',
          role: 'assistant',
          content: `I've loaded "${file.name}". You can edit the document, ask me questions about it, or start the analysis process when you're ready.`,
          timestamp: new Date()
        }
      });

      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: `File "${file.name}" uploaded successfully.`
        }
      });

      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'There was an error uploading the file. Please try again.'
      });
      return null;
    } finally {
      setIsUploading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, userId]);

  const readFileAsText = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }, []);

  return {
    uploadDocument,
    isUploading,
    readFileAsText
  };
};

/**
 * Hook for managing document editing
 */
export const useDocumentEditor = () => {
  const { state, dispatch } = useEpii();
  const { currentDocumentId, documents } = state;
  const [content, setContent] = useState<string>('');
  const [language, setLanguage] = useState<string>('text');

  // Load current document content
  useEffect(() => {
    if (currentDocumentId) {
      const document = documents.find(doc => doc.id === currentDocumentId);
      if (document) {
        setContent(document.content);
        setLanguage(getLanguageForSyntaxHighlighting(document.name, document.content));
      }
    } else {
      setContent('');
      setLanguage('text');
    }
  }, [currentDocumentId, documents]);

  // Handle content change
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);

    if (currentDocumentId) {
      // Auto-save after 1 second of inactivity
      const timeoutId = setTimeout(() => {
        dispatch({
          type: 'UPDATE_DOCUMENT',
          payload: { id: currentDocumentId, content: newContent }
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentDocumentId, dispatch]);

  return {
    content,
    language,
    setContent,
    handleContentChange
  };
};

/**
 * Hook for managing document history
 */
export const useDocumentHistory = () => {
  const { state } = useEpii();
  const { documents, currentDocumentId } = state;

  const currentDocument = currentDocumentId
    ? documents.find(doc => doc.id === currentDocumentId)
    : null;

  const documentVersions = currentDocument?.versions || [];

  return {
    currentDocument,
    documentVersions
  };
};

/**
 * Hook for document analysis
 */
export const useDocumentAnalysis = () => {
  const { state, dispatch } = useEpii();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetCoordinate, setTargetCoordinate] = useState<string | null>(null);
  const [latestSession, setLatestSession] = useState<any | null>(null);

  // Get graph data for enhanced Bimba awareness
  const { nodes, edges } = useGraphData();

  // Initialize target coordinate when document changes
  useEffect(() => {
    const { currentDocumentId, documents } = state;

    if (!currentDocumentId) {
      setTargetCoordinate(null);
      return;
    }

    // Find the current document
    const currentDocument = documents.find(doc => doc.id === currentDocumentId);
    if (currentDocument) {
      // Set target coordinate from document's stored coordinate
      // Priority: targetCoordinate -> metadata.targetCoordinate -> bimbaCoordinate (deprecated)
      const documentCoordinate =
        currentDocument.targetCoordinate ||
        currentDocument.metadata?.targetCoordinate ||
        currentDocument.bimbaCoordinate;

      if (documentCoordinate) {
        console.log(`useDocumentAnalysis: Setting target coordinate from document: ${documentCoordinate}`);
        setTargetCoordinate(documentCoordinate);
      }
    }
  }, [state.currentDocumentId, state.documents]);

  // AG-UI Event Handler for Analysis Completion
  useEffect(() => {
    const handleAnalysisCompleted = (event: any) => {
      console.log('🎉 useDocumentAnalysis: Analysis completed event received:', event);

      const { currentDocumentId } = state;

      // Check if this event is for the current document
      if (event.documentId === currentDocumentId) {
        console.log('✅ Analysis completion event matches current document, updating latestSession...');

        // Create a session from the analysis results
        const sessionId = `session-${Date.now()}`;
        const session = {
          id: sessionId,
          documentId: event.documentId,
          targetCoordinate: event.targetCoordinate,
          startTime: new Date(Date.now() - 60000), // Assume started 1 minute ago
          endTime: new Date(),
          status: 'completed',
          results: event.analysisResults || {}
        };

        // Update latest session to trigger results panel display
        setLatestSession(session);

        // Also add to document sessions
        dispatch({
          type: 'ADD_ANALYSIS_SESSION',
          payload: session
        });

        // Show completion status message
        dispatch({
          type: 'SET_STATUS_MESSAGE',
          payload: {
            type: 'success',
            text: `Analysis completed successfully for coordinate ${event.targetCoordinate}.`
          }
        });

        console.log('✅ Updated latestSession with analysis results - results panel should now be visible');
      }
    };

    // Import webSocketService and register event handler
    const setupEventHandler = async () => {
      try {
        const { onAGUIEvent, offAGUIEvent } = await import('../1_services/webSocketService');

        // Register the event handler
        onAGUIEvent('DocumentAnalysisCompleted', handleAnalysisCompleted);

        // Cleanup function
        return () => {
          offAGUIEvent('DocumentAnalysisCompleted', handleAnalysisCompleted);
        };
      } catch (error) {
        console.error('Failed to setup DocumentAnalysisCompleted event handler:', error);
      }
    };

    const cleanup = setupEventHandler();

    // Return cleanup function
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [state.currentDocumentId, dispatch]);

  // Check for existing analysis results when document changes
  useEffect(() => {
    const { currentDocumentId } = state;

    if (!currentDocumentId) return;

    const checkExistingAnalysisResults = async () => {
      try {
        // Import document service
        const { documentService } = await import('../1_services/documentService');

        // Get document using document service (which uses cache)
        const document = await documentService.getDocument(currentDocumentId);

        if (!document) {
          console.warn(`Failed to get document ${currentDocumentId} for analysis status check`);
          return;
        }

        // Extract analysis status from document
        const analysisStatus = document.analysisStatus ||
                              document.metadata?.analysisStatus;

        console.log(`Document ${currentDocumentId} has analysis status: ${analysisStatus}`);

        // If analysis is completed, get the results
        if (analysisStatus === 'completed') {
          console.log('Found completed analysis for document, fetching results...');

          try {
            // Get analysis results from document metadata if available
            const analysisResults = document.metadata?.analysisResults ||
                                   document.analysisResults;

            if (analysisResults) {
              console.log('Successfully loaded existing analysis results from document metadata');

              // Create a session for the existing results
              const sessionId = uuidv4();
              const session = {
                id: sessionId,
                documentId: currentDocumentId,
                targetCoordinate: document.metadata?.targetCoordinate || document.targetCoordinate || '#5',
                startTime: document.metadata?.analysisStartedAt || document.analysisStartedAt || new Date(),
                endTime: document.metadata?.analysisCompletedAt || document.analysisCompletedAt || new Date(),
                status: 'completed',
                results: analysisResults
              };

              // Add session to state
              dispatch({
                type: 'ADD_ANALYSIS_SESSION',
                payload: session
              });

              // Set as latest session
              setLatestSession(session);

              // Set target coordinate
              if (document.metadata?.targetCoordinate || document.targetCoordinate) {
                setTargetCoordinate(document.metadata?.targetCoordinate || document.targetCoordinate);
              }

              console.log('Analysis session created from existing results');
            } else {
              console.warn('No analysis results found in document metadata');
            }
          } catch (resultsError) {
            console.error('Error processing analysis results:', resultsError);
          }
        }
      } catch (error) {
        console.error('Error checking for existing analysis results:', error);
      }
    };

    checkExistingAnalysisResults();
  }, [state.currentDocumentId, dispatch]);

  // Listen for document updates via WebSocket
  useEffect(() => {
    const handleDocumentUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { documentId, analysisResults } = customEvent.detail;

      // Check if this is the current document
      if (documentId === state.currentDocumentId) {
        console.log(`Received analysis results for current document ${documentId} via WebSocket`);

        try {
          // Create a session for the new results
          const sessionId = uuidv4();
          const session = {
            id: sessionId,
            documentId,
            targetCoordinate: analysisResults.targetCoordinate || '#5',
            startTime: new Date(Date.now() - 60000), // Assume started 1 minute ago
            endTime: new Date(),
            status: 'completed',
            results: analysisResults
          };

          // Add session to state
          dispatch({
            type: 'ADD_ANALYSIS_SESSION',
            payload: session
          });

          // Set as latest session
          setLatestSession(session);

          // Set target coordinate
          if (analysisResults.targetCoordinate) {
            setTargetCoordinate(analysisResults.targetCoordinate);
          }

          // Add message to chat
          dispatch({
            type: 'ADD_CHAT_MESSAGE',
            payload: {
              id: uuidv4(),
              sessionId,
              role: 'assistant',
              content: `Analysis complete for coordinate ${analysisResults.targetCoordinate || '#5'}. I've identified ${analysisResults.mappings?.length || 0} mappings and ${analysisResults.variations?.length || 0} variations in the document.`,
              timestamp: new Date()
            }
          });

          // Set analyzing to false
          setIsAnalyzing(false);
          dispatch({ type: 'SET_LOADING', payload: false });

          console.log('Analysis session created from WebSocket results');
        } catch (error) {
          console.error('Error processing WebSocket analysis results:', error);
        }
      }
    };

    // Add event listener
    window.addEventListener('documentUpdated', handleDocumentUpdated);

    // Clean up
    return () => {
      window.removeEventListener('documentUpdated', handleDocumentUpdated);
    };
  }, [state.currentDocumentId, dispatch]);

  // Start analysis for the current document
  const startAnalysis = useCallback(async () => {
    const { currentDocumentId } = state;
    const currentDocument = state.documents.find(doc => doc.id === currentDocumentId);

    if (!currentDocumentId) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No document selected for analysis'
      });
      return null;
    }

    if (!currentDocument) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Current document not found'
      });
      return null;
    }

    if (!targetCoordinate) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Please specify a target Bimba coordinate for analysis'
      });
      return null;
    }

    setIsAnalyzing(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Generate AG-UI run identifiers
      const runId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('🚀 Calling Epii Analysis Pipeline skill via centralized AG-UI WebSocket service...');
      console.log(`📋 AG-UI Run ID: ${runId}`);
      console.log(`🧵 AG-UI Thread ID: ${threadId}`);
      console.log(`🎯 Target Coordinate: ${targetCoordinate}`);

      // Import the executeSkillWithAGUI function
      const { executeSkillWithAGUI } = await import('../1_services/webSocketService');

      // Execute skill using centralized WebSocket service with AG-UI support
      // Pass complete document metadata AND graphData through AG-UI protocol
      const result = await executeSkillWithAGUI(
        'epii-analysis-pipeline',
        {
          content: currentDocument.textContent || '',
          targetCoordinate,
          fileName: currentDocument.fileName || 'document.txt',
          userId: 'default-user',
          analysisDepth: 'standard',
          includeNotion: true,
          includeBimba: true,
          includeGraphiti: true,
          includeLightRAG: true,
          // Pass complete document metadata to avoid separate MongoDB fetch
          documentMetadata: {
            documentId: currentDocumentId,
            lightRagMetadata: currentDocument.metadata?.lightRagMetadata || null,
            analysisStatus: currentDocument.metadata?.analysisStatus || null,
            targetCoordinate: currentDocument.targetCoordinate || targetCoordinate,
            collection: currentDocument.collection || 'Documents',
            documentType: currentDocument.documentType || 'bimba',
            lastModified: currentDocument.lastModified || new Date().toISOString(),
            // Include any other relevant metadata
            ...currentDocument.metadata
          },
          // CRITICAL: Pass graphData from frontend state to be transformed into bimbaMap
          graphData: {
            nodes: nodes || [],
            edges: edges || []
          }
        },
        {
          agentId: 'epii-analysis-client',
          agentCoordinate: '#5-0',
          targetCoordinate,
          requestType: 'document-analysis',
          // Include document state in context
          documentState: {
            documentId: currentDocumentId,
            hasLightRagMetadata: !!(currentDocument.metadata?.lightRagMetadata),
            lightRagStatus: currentDocument.metadata?.lightRagMetadata?.ingestionStatus || 'none',
            lastAnalysis: currentDocument.metadata?.analysisStatus || 'none'
          }
        },
        {
          runId,
          threadId,
          enableAGUI: true
        }
      );

      console.log('✅ Analysis pipeline skill execution completed:', result);

      // Create a new analysis session
      const sessionId = uuidv4();
      const session = {
        id: sessionId,
        documentId: currentDocumentId,
        targetCoordinate,
        startTime: new Date(),
        status: 'processing',
        results: null
      };

      // Add session to state
      dispatch({
        type: 'ADD_ANALYSIS_SESSION',
        payload: session
      });

      // Add message to chat
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId,
          role: 'assistant',
          content: `Starting analysis for coordinate ${targetCoordinate}...`,
          timestamp: new Date()
        }
      });

      setLatestSession(session);

      // Set up polling to check analysis status
      const pollInterval = setInterval(async () => {
        try {
          // Check document status
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
          const statusResponse = await fetch(`${backendUrl}/api/documents/${currentDocumentId}`);

          if (!statusResponse.ok) {
            throw new Error(`Failed to get document status: ${statusResponse.statusText}`);
          }

          const documentData = await statusResponse.json();
          const analysisStatus = documentData.document.analysisStatus ||
                                documentData.document.metadata?.analysisStatus;

          console.log(`Current analysis status: ${analysisStatus}`);

          if (analysisStatus === 'completed') {
            // Analysis completed successfully
            clearInterval(pollInterval);

            // Get analysis results
            const results = documentData.document.metadata?.analysisResults || {
              extractedMappings: [],
              identifiedVariations: [],
              overallSummary: 'Analysis completed, but no detailed results were found.'
            };

            // Update session with results
            const updatedSession = {
              ...session,
              status: 'completed',
              endTime: new Date(),
              results
            };

            // Update session in state
            dispatch({
              type: 'UPDATE_ANALYSIS_SESSION',
              payload: updatedSession
            });

            // Add message to chat
            dispatch({
              type: 'ADD_CHAT_MESSAGE',
              payload: {
                id: uuidv4(),
                sessionId,
                role: 'assistant',
                content: `Analysis complete for coordinate ${targetCoordinate}. I've identified ${results.extractedMappings?.length || 0} mappings and ${results.identifiedVariations?.length || 0} variations in the document.`,
                timestamp: new Date()
              }
            });

            setLatestSession(updatedSession);
            setIsAnalyzing(false);
            dispatch({ type: 'SET_LOADING', payload: false });

          } else if (analysisStatus === 'failed') {
            // Analysis failed
            clearInterval(pollInterval);

            // Get error message
            const errorMessage = documentData.document.metadata?.analysisError ||
                               'Analysis failed for unknown reasons.';

            // Update session with error
            const updatedSession = {
              ...session,
              status: 'failed',
              endTime: new Date(),
              error: errorMessage
            };

            // Update session in state
            dispatch({
              type: 'UPDATE_ANALYSIS_SESSION',
              payload: updatedSession
            });

            // Add message to chat
            dispatch({
              type: 'ADD_CHAT_MESSAGE',
              payload: {
                id: uuidv4(),
                sessionId,
                role: 'assistant',
                content: `Analysis failed: ${errorMessage}`,
                timestamp: new Date()
              }
            });

            setLatestSession(updatedSession);
            setIsAnalyzing(false);
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({
              type: 'SET_ERROR',
              payload: `Analysis failed: ${errorMessage}`
            });
          }
          // If status is still 'processing', continue polling

        } catch (error) {
          console.error('Error polling analysis status:', error);
        }
      }, 5000); // Poll every 5 seconds

      // Clean up interval on component unmount
      return () => clearInterval(pollInterval);

      return sessionId;
    } catch (error) {
      console.error('Error starting analysis:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to start analysis. Please try again.'
      });
      setIsAnalyzing(false);
      dispatch({ type: 'SET_LOADING', payload: false });
      return null;
    }
  }, [state, dispatch, targetCoordinate, nodes, edges]);

  // Crystallize analysis results - simplified version that uses the backend API
  const crystallizeResults = useCallback(async () => {
    const { currentDocumentId } = state;
    const currentDocument = state.documents.find(doc => doc.id === currentDocumentId);

    if (!latestSession) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No analysis session available'
      });
      return false;
    }

    if (latestSession.status !== 'completed') {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Analysis not yet completed'
      });
      return false;
    }

    if (!currentDocumentId || !currentDocument) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No document selected for crystallization'
      });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log(`Crystallizing analysis results for document ${currentDocumentId}...`);

      // Call the simplified API endpoint that just needs the documentId
      // The backend will fetch the notionUpdatePayload from cache
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/analysis/crystallize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: currentDocumentId
        }),
      });

      if (!response.ok) {
        throw new Error(`Crystallization request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Crystallization successful:', data);

      // Import document cache service to clear analysis results
      const documentCacheService = (await import('../1_services/documentCacheService')).default;
      documentCacheService.clearAnalysisResults(currentDocumentId);
      console.log(`Cleared analysis results from cached document ${currentDocumentId}`);

      // Add message to chat
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId: latestSession.id,
          role: 'assistant',
          content: `Results crystallized for coordinate ${latestSession.targetCoordinate}. The analysis has been integrated into the Bimba graph.`,
          timestamp: new Date()
        }
      });

      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'Analysis results crystallized successfully'
        }
      });

      // Refresh the document list to show the new pratibimba document
      try {
        console.log('Refreshing document list after crystallization...');

        // Import useBimbaCoordinates hook functions to refresh coordinates
        const coordinatesModule = await import('../2_hooks/useBimbaCoordinates');

        // Refresh the specific coordinate where the document was crystallized
        if (latestSession.targetCoordinate) {
          console.log(`Refreshing coordinate ${latestSession.targetCoordinate} after crystallization...`);

          // Check if refreshCoordinateDocuments function exists
          if (typeof coordinatesModule.refreshCoordinateDocuments === 'function') {
            await coordinatesModule.refreshCoordinateDocuments(latestSession.targetCoordinate);
            console.log(`Refreshed coordinate ${latestSession.targetCoordinate}`);
          } else {
            // Fallback to refreshing all coordinates
            console.log('refreshCoordinateDocuments not found, refreshing all coordinates...');
            if (typeof coordinatesModule.refreshAllCoordinates === 'function') {
              await coordinatesModule.refreshAllCoordinates();
              console.log('Refreshed all coordinates');
            }
          }
        } else {
          // If no specific coordinate, refresh all
          console.log('No specific coordinate to refresh, refreshing all coordinates...');
          if (typeof coordinatesModule.refreshAllCoordinates === 'function') {
            await coordinatesModule.refreshAllCoordinates();
            console.log('Refreshed all coordinates');
          }
        }

        console.log('Successfully refreshed documents after crystallization');
      } catch (refreshError) {
        console.error('Error refreshing document list after crystallization:', refreshError);
      }

      return true;
    } catch (error) {
      console.error('Error crystallizing results:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to crystallize results: ${error.message}`
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [latestSession, dispatch, state]);

  return {
    isAnalyzing,
    targetCoordinate,
    setTargetCoordinate,
    startAnalysis,
    crystallizeResults,
    latestSession
  };
};
