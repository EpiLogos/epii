/**
 * useGraphInteractions Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-4 (Bimba Vis / Geom Ground - Context)
 * 
 * This hook is responsible for handling node interactions (click, hover, etc.).
 * It manages the active node state and fetches node details from the backend.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { Node, Edge } from "../../../shared/components/meta/metaData";
import { getActiveNodeData, ActiveNodeData } from '../1_utils/geometryUtils';

// Debounce function to limit the rate of function calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Hook for handling node interactions
 * @param nodes - The styled graph nodes
 * @param edges - The styled graph edges
 * @returns The active node data and interaction handlers
 */
export function useGraphInteractions(nodes: Node[], edges: Edge[]) {
  // State for active node
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // State for active node data
  const [activeNodeData, setActiveNodeData] = useState<ActiveNodeData | null>(null);

  // State for highlighted nodes and links
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());

  // State for node details cache
  const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});

  // Create a reference to store the last clicked node to prevent duplicate clicks
  const lastClickedNodeRef = useRef<string | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Node click handler with throttling to prevent rapid clicks
  const handleNodeClick = useCallback((node: Node) => {
    // Prevent duplicate clicks on the same node in quick succession
    if (lastClickedNodeRef.current === node.id) {
      return;
    }

    // Set the last clicked node and clear it after a delay
    lastClickedNodeRef.current = node.id;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      lastClickedNodeRef.current = null;
    }, 300); // 300ms throttle time

    // Set the active node ID
    setActiveNodeId(node.id);

    // Calculate highlighted nodes and links
    const connectedNodes = new Set<string>();
    const connectedLinks = new Set<string>();

    // Add the clicked node itself
    connectedNodes.add(node.id);

    // Find all connected nodes and links
    edges.forEach(edge => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

      // Check if the edge is connected to the clicked node
      if (sourceId === node.id || targetId === node.id) {
        // Add the connected node
        if (sourceId === node.id) {
          connectedNodes.add(targetId);
        } else {
          connectedNodes.add(sourceId);
        }

        // Add the edge
        connectedLinks.add(edge.id || `${sourceId}-${targetId}`);
      }
    });

    setHighlightedNodes(connectedNodes);
    setHighlightedLinks(connectedLinks);

    // IMPORTANT: Don't modify any node properties here
    // This ensures click doesn't affect animations or physics
    // Instead, we'll just update the visual highlighting
  }, [edges]);

  // Create a reference to store the raw hover handler
  const rawHoverHandlerRef = useRef<(node: Node | null) => void>();

  // Node hover handler with debouncing
  const handleNodeHover = useCallback(
    debounce((node: Node | null) => {
      try {
        if (!node) {
          // Clear highlights if not hovering over a node and no active node
          if (!activeNodeId) {
            setHighlightedNodes(new Set());
            setHighlightedLinks(new Set());
          }
          return;
        }

        // Don't change highlights if there's an active node
        if (activeNodeId) return;

        // Calculate highlighted nodes and links
        const connectedNodes = new Set<string>();
        const connectedLinks = new Set<string>();

        // Add the hovered node itself
        connectedNodes.add(node.id);

        // Find all connected nodes and links
        edges.forEach(edge => {
          const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
          const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

          // Check if the edge is connected to the hovered node
          if (sourceId === node.id || targetId === node.id) {
            // Add the connected node
            if (sourceId === node.id) {
              connectedNodes.add(targetId);
            } else {
              connectedNodes.add(sourceId);
            }

            // Add the edge
            connectedLinks.add(edge.id || `${sourceId}-${targetId}`);
          }
        });

        setHighlightedNodes(connectedNodes);
        setHighlightedLinks(connectedLinks);

        // IMPORTANT: Don't modify any node properties here
        // This ensures hover doesn't affect animations or physics
      } catch (error) {
        // Silent error - don't log to avoid console spam during hover
      }
    }, 50), // 50ms debounce time for smoother transitions
    [edges, activeNodeId]
  );

  // Store the raw handler in a ref to avoid recreating the debounced function
  rawHoverHandlerRef.current = handleNodeHover;

  // Background click handler with throttling
  const lastBackgroundClickTimeRef = useRef<number>(0);

  const handleBackgroundClick = useCallback(() => {
    // Prevent rapid background clicks
    const now = Date.now();
    if (now - lastBackgroundClickTimeRef.current < 300) { // 300ms throttle
      return;
    }
    lastBackgroundClickTimeRef.current = now;

    // Clear active node and highlights
    setActiveNodeId(null);
    setActiveNodeData(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  }, []);

  // Fetch node details when active node changes
  useEffect(() => {
    if (!activeNodeId) {
      setActiveNodeData(null);
      return;
    }

    // Prepare active node data
    const nodeData = getActiveNodeData(activeNodeId, nodes, edges, highlightedNodes, highlightedLinks);
    setActiveNodeData(nodeData);

    // Check if we have the node's bimbaCoordinate
    const node = nodes.find(n => n.id === activeNodeId);
    if (!node || !node.bimbaCoordinate) {
      // No bimbaCoordinate, can't fetch details
      setActiveNodeData(prev => prev ? {
        ...prev,
        isLoading: false
      } : null);
      return;
    }

    // Check if we have cached details
    const cacheKey = node.bimbaCoordinate;
    if (detailsCache[cacheKey]) {
      setActiveNodeData(prev => prev ? {
        ...prev,
        details: detailsCache[cacheKey],
        isLoading: false
      } : null);
      return;
    }

    // Fetch details from API with timeout and cancelation
    const fetchDetails = async () => {
      // Create a cancelation token
      const cancelToken = axios.CancelToken.source();

      // Set a timeout to cancel the request if it takes too long
      const timeoutId = setTimeout(() => {
        cancelToken.cancel('Request took too long');
      }, 5000); // 5 second timeout

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

        // Make the request with the cancel token
        const response = await axios.get(
          `${backendUrl}/api/node-details/${encodeURIComponent(node.bimbaCoordinate!)}`,
          {
            cancelToken: cancelToken.token,
            timeout: 5000 // 5 second timeout
          }
        );

        // Clear the timeout since the request completed
        clearTimeout(timeoutId);

        const nodeDetails = response.data;

        // Update cache
        setDetailsCache(prev => ({
          ...prev,
          [cacheKey]: nodeDetails
        }));

        // Update active node data
        setActiveNodeData(prev => prev ? {
          ...prev,
          details: nodeDetails,
          isLoading: false
        } : null);
      } catch (error) {
        // Clear the timeout
        clearTimeout(timeoutId);

        // Check if the request was canceled
        if (axios.isCancel(error)) {
          console.warn('Request canceled:', error.message);
          setActiveNodeData(prev => prev ? {
            ...prev,
            error: 'Request timed out. Try again later.',
            isLoading: false
          } : null);
        } else {
          console.error('Error fetching node details:', error);
          setActiveNodeData(prev => prev ? {
            ...prev,
            error: 'Failed to fetch node details',
            isLoading: false
          } : null);
        }
      }
    };

    fetchDetails();
  }, [activeNodeId, nodes, edges, highlightedNodes, highlightedLinks, detailsCache]);

  return {
    activeNodeId,
    activeNodeData,
    highlightedNodes,
    highlightedLinks,
    handleNodeClick,
    handleNodeHover,
    handleBackgroundClick
  };
}
