/**
 * Hooks for document analysis in Epii mode
 * Bimba Coordinate: #5-3-4.5-2
 */

import { useState, useCallback } from 'react';
import { useEpii } from '../4_context/EpiiContext';
import { AnalysisResults } from '../0_foundation/epiiTypes';
import { v4 as uuidv4 } from 'uuid';
import { isValidBimbaCoordinate } from '../1_utils/epiiHelpers';
import { useGraphData } from '../../0_anuttara/2_hooks/useGraphData';

/**
 * Hook for managing document analysis
 */
export const useDocumentAnalysis = () => {
  const { state, dispatch } = useEpii();
  const { currentDocumentId, analysisSessions } = state;
  const [targetCoordinate, setTargetCoordinate] = useState<string>('#5-2-1');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Get graph data for enhanced Bimba awareness
  const { nodes, edges } = useGraphData();

  // Get current document's analysis sessions
  const documentSessions = currentDocumentId
    ? analysisSessions.filter(session => session.documentId === currentDocumentId)
    : [];

  // Get latest analysis session
  const latestSession = documentSessions.length > 0
    ? documentSessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0]
    : null;

  // Start analysis
  const startAnalysis = useCallback(async (coordinate: string) => {
    if (!currentDocumentId) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No document selected. Please upload or select a document first.'
      });
      return null;
    }

    if (!isValidBimbaCoordinate(coordinate)) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Invalid Bimba coordinate format. Please use the format #X-X-X.'
      });
      return null;
    }

    setIsAnalyzing(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Create new session ID
      const sessionId = uuidv4();

      // Start analysis session
      dispatch({
        type: 'START_ANALYSIS',
        payload: {
          documentId: currentDocumentId,
          targetCoordinate: coordinate
        }
      });

      // Add notification message
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId,
          role: 'assistant',
          content: `Starting analysis for target coordinate ${coordinate}...`,
          timestamp: new Date()
        }
      });

      // Call API to analyze document with graph data for enhanced Bimba awareness
      const response = await fetch('/api/epii-agent/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: currentDocumentId,
          targetCoordinate: coordinate,
          graphData: { nodes, edges } // Pass graph data to backend
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Set analysis results
      dispatch({
        type: 'SET_ANALYSIS_RESULTS',
        payload: {
          sessionId,
          results: data.results
        }
      });

      // Add completion message
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId,
          role: 'assistant',
          content: `Analysis complete! I've identified key mappings and variations in the document. You can now refine the analysis or proceed to crystallization.`,
          timestamp: new Date()
        }
      });

      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'Analysis completed successfully.'
        }
      });

      return data.results;
    } catch (error) {
      console.error('Error analyzing document:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'There was an error analyzing the document. Please try again.'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [currentDocumentId, dispatch, nodes, edges]);

  // Crystallize analysis results
  const crystallizeResults = useCallback(async (results: AnalysisResults) => {
    if (!currentDocumentId) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No document selected for crystallization.'
      });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Call API to crystallize results - simplified to just send documentId
      // The backend will fetch the notionUpdatePayload from cache
      const response = await fetch('/api/analysis/crystallize', {
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

      // Add notification message
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: uuidv4(),
          sessionId: 'default',
          role: 'assistant',
          content: `Crystallization complete! The analysis results have been integrated into the Bimba-Pratibimba memory architecture.`,
          timestamp: new Date()
        }
      });

      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'Crystallization completed successfully.'
        }
      });

      return true;
    } catch (error) {
      console.error('Error crystallizing results:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'There was an error crystallizing the results. Please try again.'
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [currentDocumentId, dispatch]);

  return {
    targetCoordinate,
    setTargetCoordinate,
    startAnalysis,
    crystallizeResults,
    isAnalyzing,
    documentSessions,
    latestSession
  };
};
