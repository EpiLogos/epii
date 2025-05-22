/**
 * useNotionContent Hook
 * 
 * This hook is responsible for fetching and managing Notion content based on Bimba coordinates.
 * It aligns with the #5 Epii subsystem (crystallized knowledge).
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define interface for Notion properties
export interface NotionProperties {
  title?: string;
  content?: string;
  description?: string;
  visualEncapsulationUrl?: string;
  pageUrl?: string;
  [key: string]: any;
}

/**
 * Hook for fetching and managing Notion content
 * @param coordinate The Bimba coordinate to fetch content for
 * @returns The Notion content, error, and loading state
 */
export function useNotionContent(coordinate: string | undefined) {
  // Fetch Notion content using react-query
  const { data, error, isLoading } = useQuery<NotionProperties, Error>({
    queryKey: ['notionContent', coordinate],
    queryFn: async () => {
      if (!coordinate) throw new Error('Coordinate is required');
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const { data } = await axios.get(`${backendUrl}/api/notion-content/${encodeURIComponent(coordinate)}`);
      return data;
    },
    enabled: !!coordinate, // Only run the query if coordinate is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
  
  return { data, error, isLoading };
}
