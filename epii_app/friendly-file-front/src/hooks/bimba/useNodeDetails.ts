/**
 * useNodeDetails Hook
 * 
 * This hook is responsible for fetching and managing node details from the Bimba graph.
 * It aligns with the #4 Nara subsystem (contextual application).
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Node } from '../../components/meta/metaData';
import { MCPNodeProperties, MCPNodeConnection } from '../../components/meta/NodeDetailsPanel';

// Define interface for node details
export interface NodeDetails {
  properties: MCPNodeProperties;
  connections: MCPNodeConnection[];
}

/**
 * Hook for fetching and managing node details
 * @param node The node to fetch details for
 * @returns The node details, error, and loading state
 */
export function useNodeDetails(node: Node | null) {
  const coordinate = node?.bimbaCoordinate;
  
  // Fetch node details using react-query
  const { data, error, isLoading } = useQuery<NodeDetails, Error>({
    queryKey: ['nodeDetails', coordinate],
    queryFn: async () => {
      if (!coordinate) throw new Error('Coordinate is required');
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const { data } = await axios.get(`${backendUrl}/api/node-details/${encodeURIComponent(coordinate)}`);
      return data;
    },
    enabled: !!coordinate, // Only run the query if coordinate is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
  
  return { data, error, isLoading };
}
