/**
 * Hook for fetching Bimba coordinates and related documents
 * Bimba Coordinate: #5-3-4.5-2
 */

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useGraphData } from '../../0_anuttara/2_hooks/useGraphData';
import { useQuery } from '@tanstack/react-query';
import documentCacheService from '../1_services/documentCacheService';

// Define types for Bimba coordinates and related documents
export interface BimbaCoordinate {
  coordinate: string;
  title: string;
  labels: string[];
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  lastModified: Date;
  bimbaCoordinate: string;
  notionPageId?: string;
  documentType?: 'bimba' | 'pratibimba';
  bimbaId?: string;
  content?: string;
  versions?: Array<{timestamp: Date, content: string}>;
}

/**
 * Fetch documents for a specific coordinate using BPMCP service
 */
const fetchDocumentsForCoordinateAPI = async (coordinate: string): Promise<Document[]> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      // Call the listDocumentsByCoordinate tool via the backend API
      const response = await axios.post(`${backendUrl}/api/bpmcp/call-tool`, {
        toolName: 'listDocumentsByCoordinate',
        args: { coordinate }
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((doc: any) => ({
          id: doc._id || doc.id,
          name: doc.originalName || doc.fileName || 'Unnamed Document',
          lastModified: new Date(doc.uploadDate || doc.lastModified),
          bimbaCoordinate: doc.targetCoordinate,
          notionPageId: doc.notionPageId
        }));
      }
    } catch (bpmcpError) {
      console.warn(`Error calling BPMCP listDocumentsByCoordinate tool in API: ${bpmcpError}`);

      // Fallback to node details API
      try {
        const nodeDetailsResponse = await axios.get(`${backendUrl}/api/node-details/${encodeURIComponent(coordinate)}`);
        const nodeDetails = nodeDetailsResponse.data;

        // Check if the node has a Notion page ID
        const notionPageId = nodeDetails?.targetNodeProperties?.notionPageId;

        // If there's a Notion page ID, create a document for it
        if (notionPageId) {
          return [{
            id: notionPageId,
            name: nodeDetails?.targetNodeProperties?.title || nodeDetails?.targetNodeProperties?.name || coordinate,
            lastModified: new Date(),
            bimbaCoordinate: coordinate,
            notionPageId
          }];
        }
      } catch (nodeError) {
        console.error(`Error fetching node details for coordinate ${coordinate}:`, nodeError);
      }
    }

    return [];
  } catch (error) {
    console.error(`Error fetching documents for coordinate ${coordinate}:`, error);
    return [];
  }
};

/**
 * Hook for fetching Bimba coordinates and related documents
 * Leverages the existing useGraphData hook from Anuttara
 */
export function useBimbaCoordinates(isDocumentsLoading?: boolean) {
  // Use the existing graph data hook from Anuttara
  const { nodes, edges, isLoading: isLoadingGraph, error: graphError } = useGraphData();

  // State for documents
  const [documentsByCoordinate, setDocumentsByCoordinate] = useState<Record<string, Document[]>>({});
  const [expandedCoordinates, setExpandedCoordinates] = useState<Set<string>>(new Set());

  // Initialize AG-UI integration for coordinate refreshes
  useEffect(() => {
    const initializeAGUIIntegration = async () => {
      try {
        const documentStateService = (await import('../1_services/documentStateService')).default;

        // Register callback for coordinate-specific refreshes
        documentStateService.onCoordinateRefresh((coordinate: string) => {
          console.log(`📡 AG-UI triggered coordinate refresh for ${coordinate}`);

          // Force refresh documents for this coordinate
          refreshCoordinateDocuments(coordinate);
        });

        console.log('✅ AG-UI integration initialized for useBimbaCoordinates');
      } catch (error) {
        console.error('❌ Failed to initialize AG-UI integration for coordinates:', error);
      }
    };

    initializeAGUIIntegration();
  }, []);

  // Transform nodes into BimbaCoordinate objects
  const coordinates = useMemo(() => {
    if (!nodes) return [];

    return nodes
      .filter(node => node.bimbaCoordinate) // Only include nodes with bimbaCoordinate
      .map(node => ({
        coordinate: node.bimbaCoordinate || '',
        title: node.name || node.label || node.bimbaCoordinate || '',
        labels: Array.isArray(node.labels) ? node.labels : [],
        documents: documentsByCoordinate[node.bimbaCoordinate || ''] || []
      }));
  }, [nodes, documentsByCoordinate]);

  // Flatten documents from all coordinates
  const documents = useMemo(() => {
    return Object.values(documentsByCoordinate).flat();
  }, [documentsByCoordinate]);

  // Fetch documents for a specific coordinate - CACHE ONLY
  const fetchDocumentsForCoordinate = async (coordinate: string) => {
    // Mark this coordinate as expanded
    setExpandedCoordinates(prev => new Set(prev).add(coordinate));

    try {
      // First check if we already have documents for this coordinate in state
      const existingDocs = documentsByCoordinate[coordinate];
      if (existingDocs && existingDocs.length > 0) {
        console.log(`Using ${existingDocs.length} documents for coordinate ${coordinate} from state`);
        return existingDocs;
      }

      // Import document cache service
      const documentCacheService = (await import('../1_services/documentCacheService')).default;

      // Get documents from cache ONLY - no MongoDB fallback
      const cachedBimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'Documents');
      const cachedPratibimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'pratibimbaDocuments');

      // Combine both document types
      const documents = [
        ...cachedBimbaDocuments,
        ...cachedPratibimbaDocuments
      ];

      // Standardize document format
      const docs = documents.map(doc => ({
        id: doc._id || doc.id,
        name: doc.name || doc.originalName || doc.fileName || 'Unnamed Document',
        lastModified: new Date(doc.uploadDate || doc.lastModified),
        bimbaCoordinate: doc.targetCoordinate,
        targetCoordinate: doc.targetCoordinate,
        notionPageId: doc.notionPageId,
        documentType: doc.documentType || 'bimba',
        bimbaId: doc.bimbaId,
        hasContent: !!(doc.content || doc.textContent)
      }));

      // Update documents state
      setDocumentsByCoordinate(prev => ({
        ...prev,
        [coordinate]: docs
      }));

      console.log(`Found ${docs.length} cached documents for coordinate ${coordinate}`);
      return docs;
    } catch (error) {
      console.error(`Error fetching documents for coordinate ${coordinate}:`, error);

      // No documents found
      setDocumentsByCoordinate(prev => ({
        ...prev,
        [coordinate]: []
      }));

      return [];
    }
  };

  // Fetch node details for a specific coordinate
  const fetchNodeDetails = async (coordinate: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.get(`${backendUrl}/api/node-details/${encodeURIComponent(coordinate)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching node details for coordinate ${coordinate}:`, error);
      throw new Error(`Failed to fetch node details for coordinate ${coordinate}`);
    }
  };

  // Get related coordinates for a given coordinate
  const getRelatedCoordinates = (coordinate: string) => {
    if (!nodes || !edges) return [];

    // Find the node with this coordinate
    const node = nodes.find(n => n.bimbaCoordinate === coordinate);
    if (!node) return [];

    // Find all edges connected to this node
    const connectedEdges = edges.filter(edge =>
      edge.source === node.id || edge.target === node.id
    );

    // Get the IDs of connected nodes
    const connectedNodeIds = connectedEdges.map(edge =>
      edge.source === node.id ? edge.target : edge.source
    );

    // Find the nodes with these IDs
    const connectedNodes = nodes.filter(n =>
      connectedNodeIds.includes(n.id) && n.bimbaCoordinate
    );

    // Return the bimbaCoordinates of connected nodes
    return connectedNodes.map(n => n.bimbaCoordinate || '');
  };

  // Fetch documents for expanded coordinates when nodes change
  useEffect(() => {
    // Don't fetch if nodes are missing, no coordinates are expanded, or documents are still loading
    if (!nodes || expandedCoordinates.size === 0) {
      return;
    }

    // If documents are still loading, don't try to fetch coordinates
    if (isDocumentsLoading) {
      console.log('Documents still loading, waiting to fetch coordinates...');
      return;
    }

    // Create a copy of the expanded coordinates to avoid state updates during the effect
    const coordinatesToFetch = Array.from(expandedCoordinates);

    // Track which coordinates we've already processed to avoid redundant fetches
    const processedCoordinates = new Set<string>();

    // Process coordinates - CACHE ONLY, NO MONGODB CALLS
    const fetchCoordinates = async () => {
      try {
        // First check if any coordinates are already in the cache or state
        const uncachedCoordinates: string[] = [];

        // Check which coordinates need to be fetched
        for (const coordinate of coordinatesToFetch) {
          // Skip if we've already processed this coordinate
          if (processedCoordinates.has(coordinate)) {
            continue;
          }

          // Check if we already have documents for this coordinate in state
          const existingDocs = documentsByCoordinate[coordinate];
          if (existingDocs && existingDocs.length > 0) {
            console.log(`Already have ${existingDocs.length} documents for coordinate ${coordinate} in state`);
            processedCoordinates.add(coordinate);
            continue;
          }

          // Need to fetch this coordinate from cache
          uncachedCoordinates.push(coordinate);
        }

        // Log the plan
        if (uncachedCoordinates.length > 0) {
          console.log(`Need to fetch documents for ${uncachedCoordinates.length} coordinates from cache: ${uncachedCoordinates.join(', ')}`);
        } else {
          console.log('All coordinates already in state, no need to fetch');
          return;
        }

        // Process each coordinate - CACHE ONLY
        for (const coordinate of uncachedCoordinates) {
          if (processedCoordinates.has(coordinate)) {
            continue;
          }

          // Use our fetchDocumentsForCoordinate function which only uses cache
          const docs = await fetchDocumentsForCoordinate(coordinate);
          processedCoordinates.add(coordinate);
        }
      } catch (error) {
        console.error('Error fetching documents for coordinates:', error);
      }
    };

    // Execute the fetch operation
    fetchCoordinates();

    // Only run this effect when nodes, expandedCoordinates, or isDocumentsLoading changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, expandedCoordinates.size, isDocumentsLoading]);

  // Function to refresh documents for a specific coordinate
  const refreshCoordinateDocuments = async (coordinate: string) => {
    if (!coordinate) return;

    console.log(`Refreshing documents for coordinate ${coordinate}...`);

    try {
      // Import document cache service
      const documentCacheService = (await import('../1_services/documentCacheService')).default;

      // Remove from state first
      setDocumentsByCoordinate(prev => {
        const newState = { ...prev };
        delete newState[coordinate];
        return newState;
      });

      // Invalidate cache for this coordinate only
      documentCacheService.invalidateCoordinate(coordinate, 'Documents');
      documentCacheService.invalidateCoordinate(coordinate, 'pratibimbaDocuments');

      // Import document service
      const { documentService } = await import('../1_services/documentService');

      // Get documents from cache after invalidation
      const cachedBimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'Documents');
      const cachedPratibimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'pratibimbaDocuments');

      // Combine both document types
      const documents = [...cachedBimbaDocuments, ...cachedPratibimbaDocuments];

      if (documents.length > 0) {
        // Standardize document format
        const docs = documents.map(doc => ({
          id: doc._id || doc.id,
          name: doc.name || doc.originalName || doc.fileName || 'Unnamed Document',
          lastModified: new Date(doc.uploadDate || doc.lastModified),
          bimbaCoordinate: doc.targetCoordinate,
          targetCoordinate: doc.targetCoordinate,
          notionPageId: doc.notionPageId,
          documentType: doc.documentType || 'bimba',
          bimbaId: doc.bimbaId,
          hasContent: !!(doc.content || doc.textContent)
        }));

        // Update documents state directly
        setDocumentsByCoordinate(prev => ({
          ...prev,
          [coordinate]: docs
        }));

        console.log(`Refreshed ${docs.length} documents for coordinate ${coordinate} from cache`);
      } else {
        // No documents found
        setDocumentsByCoordinate(prev => ({
          ...prev,
          [coordinate]: []
        }));

        console.log(`No documents found for coordinate ${coordinate} in cache after refresh`);
      }
    } catch (error) {
      console.error(`Error refreshing documents for coordinate ${coordinate}:`, error);
    }
  };

  return {
    coordinates,
    documents,
    isLoading: isLoadingGraph,
    error: graphError?.message || null,
    fetchDocumentsForCoordinate,
    fetchNodeDetails,
    getRelatedCoordinates,
    refreshCoordinateDocuments
  };
}
