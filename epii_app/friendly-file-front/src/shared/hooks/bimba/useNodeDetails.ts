/**
 * useNodeDetails Hook
 * 
 * This hook is responsible for fetching and managing node details from the Bimba graph.
 * It aligns with the #4 Nara subsystem (contextual application).
 */

import { useQuery } from '@tanstack/react-query';
import { Node } from "../../components/meta/metaData";
import { MCPNodeProperties, MCPNodeConnection, NotionResolution } from "../../components/meta/NodeDetailsPanel";
import bpmcpService from "../../services/bpmcpService";

// Define interface for node details
export interface NodeDetails {
  properties: MCPNodeProperties;
  connections: MCPNodeConnection[];
  notionResolution?: NotionResolution | null;
}

/**
 * Hook for fetching and managing node details
 * @param node The node to fetch details for
 * @returns The node details, error, and loading state
 */
export function useNodeDetails(node: Node | null) {
  const coordinate = node?.bimbaCoordinate;
  
  // Fetch node details using react-query and BPMCP service
  const { data, error, isLoading } = useQuery<NodeDetails, Error>({
    queryKey: ['bpmcpNodeDetails', coordinate],
    queryFn: async () => {
      if (!coordinate) throw new Error('Coordinate is required');
      
      console.log(`[useNodeDetails] Fetching details for coordinate: ${coordinate}`);
      const { nodeDetails, notionResolution } = await bpmcpService.getEnhancedNodeDetails(coordinate);
      
      // Transform BPMCP data to match hook interface
      const transformedDetails: NodeDetails = {
        properties: nodeDetails.properties || {},
        connections: [
          ...nodeDetails.relations.parents.map(rel => ({
            type: rel.relationshipType,
            direction: 'in' as const,
            nodes: [{ name: rel.properties.name || rel.bimbaCoordinate, bimbaCoordinate: rel.bimbaCoordinate }]
          })),
          ...nodeDetails.relations.children.map(rel => ({
            type: rel.relationshipType,
            direction: 'out' as const,
            nodes: [{ name: rel.properties.name || rel.bimbaCoordinate, bimbaCoordinate: rel.bimbaCoordinate }]
          })),
          ...nodeDetails.relations.siblings.map(rel => ({
            type: rel.relationshipType,
            direction: 'out' as const,
            nodes: [{ name: rel.properties.name || rel.bimbaCoordinate, bimbaCoordinate: rel.bimbaCoordinate }]
          }))
        ],
        notionResolution
      };
      
      console.log(`[useNodeDetails] Successfully transformed details for ${coordinate}`);
      return transformedDetails;
    },
    enabled: !!coordinate, // Only run the query if coordinate is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
  
  return { data, error, isLoading };
}
