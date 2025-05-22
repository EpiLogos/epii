/**
 * useBimbaGraph Hook
 * 
 * This hook is responsible for fetching and managing the Bimba graph data from Neo4j.
 * It aligns with the #0 Anuttara subsystem (foundational structure).
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Node, Edge } from '../../components/meta/metaData';

// Define interface for graph data structure expected from backend
interface BimbaGraphData {
  nodes: Node[];
  links: Edge[];
}

/**
 * Fetch function for react-query
 * @returns The Bimba graph data from the backend
 */
const fetchBimbaGraph = async (): Promise<BimbaGraphData> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  const { data } = await axios.get(`${backendUrl}/api/graph/foundational`);
  return { nodes: data.nodes, links: data.links };
};

/**
 * Hook for fetching and managing Bimba graph data
 * @returns The graph nodes, edges, error, and loading state
 */
export function useBimbaGraph() {
  // Fetch graph data using react-query
  const { data: graphData, error, isLoading } = useQuery<BimbaGraphData, Error>({
    queryKey: ['bimbaGraph'],
    queryFn: fetchBimbaGraph,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
  
  // Extract nodes and edges from the response
  const nodes = graphData?.nodes || [];
  const edges = graphData?.links || [];
  
  return { nodes, edges, error, isLoading };
}
