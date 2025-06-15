/**
 * useGraphData Hook
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-2 (Bimba Vis / Geom Ground - Hooks)
 *
 * This hook is responsible for fetching and managing the raw graph data.
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { Node, Edge } from "../../../shared/components/meta/metaData";

// Define interface for graph data structure expected from backend
interface GraphData {
  nodes: Node[];
  links: Edge[];
}

/**
 * Fetch function for react-query
 * @returns The graph data from the backend
 */
const fetchFullGraph = async (): Promise<GraphData> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const { data } = await axios.get(`${backendUrl}/api/graph/foundational`);

    // Ensure data has the expected structure
    if (!data || !data.nodes || !data.links) {
      console.error('Invalid graph data format:', data);
      throw new Error('Invalid graph data format');
    }

    // Ensure nodes have IDs
    const nodesWithIds = data.nodes.map((node: any) => {
      if (!node.id) {
        node.id = `node-${Math.random().toString(36).substring(2, 9)}`;
      }
      return node;
    });

    // Ensure links have IDs and valid source/target
    const linksWithIds = data.links.map((link: any) => {
      if (!link.id) {
        const sourceId = typeof link.source === 'object' ? link.source?.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target?.id : link.target;
        link.id = `link-${sourceId}-${targetId}-${Math.random().toString(36).substring(2, 5)}`;
      }
      return link;
    });

    return {
      nodes: nodesWithIds,
      links: linksWithIds
    };
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw error;
  }
};

/**
 * Hook for fetching and managing graph data
 * @returns The graph nodes, edges, error, and loading state
 */
export function useGraphData() {
  // Fetch graph data using react-query
  const { data: fullGraphData, error, isLoading } = useQuery<GraphData, Error>({
    queryKey: ['fullGraph'],
    queryFn: fetchFullGraph,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // Extract nodes and edges from the response
  const nodes = useMemo(() => {
    const rawNodes = fullGraphData?.nodes || [];

    // Check if a root node with bimbaCoordinate "#" exists
    const rootNodeExists = rawNodes.some(node => node.bimbaCoordinate === '#');

    // If no root node exists, create one
    if (!rootNodeExists && rawNodes.length > 0) {
      console.log('Creating root node with bimbaCoordinate "#"');

      // Create a new root node
      const rootNode = {
        id: 'root-node',
        bimbaCoordinate: '#',
        name: 'Root',
        label: 'Root',
        labels: ['Root']
      };

      // Add the root node to the beginning of the array
      return [rootNode, ...rawNodes];
    }

    return rawNodes;
  }, [fullGraphData]);

  const edges = useMemo(() => {
    const rawEdges = fullGraphData?.links || [];
    const rootNodeExists = nodes.some(node => node.bimbaCoordinate === '#');

    // If we have a root node and main subsystem nodes, ensure they're connected
    if (rootNodeExists) {
      const rootNode = nodes.find(node => node.bimbaCoordinate === '#');
      if (!rootNode) return rawEdges;

      const newEdges = [...rawEdges];

      // Connect the root node to all main subsystem nodes (#0-#5)
      for (let i = 0; i <= 5; i++) {
        const subsystemNode = nodes.find(node => node.bimbaCoordinate === `#${i}`);
        if (subsystemNode) {
          // Check if an edge already exists
          const edgeExists = rawEdges.some(edge =>
            (edge.source === rootNode.id && edge.target === subsystemNode.id) ||
            (typeof edge.source === 'object' && edge.source?.id === rootNode.id &&
             typeof edge.target === 'object' && edge.target?.id === subsystemNode.id)
          );

          if (!edgeExists) {
            // Add a new edge
            newEdges.push({
              id: `edge-root-to-${i}`,
              source: rootNode.id,
              target: subsystemNode.id,
              type: 'HAS_CHILD'
            });
          }
        }
      }

      return newEdges;
    }

    return rawEdges;
  }, [fullGraphData, nodes]);

  return { nodes, edges, error, isLoading };
}
