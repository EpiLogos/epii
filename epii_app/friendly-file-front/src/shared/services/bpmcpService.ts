/**
 * BPMCP Service for Frontend Integration
 * Handles calls to BPMCP tools via backend API
 * Bimba Coordinate: #5-3-4.5
 */

import axios from 'axios';

export interface BpmcpNodeProperties {
  name?: string;
  type?: string;
  description?: string;
  content?: string;
  function?: string;
  bimbaCoordinate?: string;
  [key: string]: unknown;
}

export interface BpmcpNodeRelation {
  bimbaCoordinate: string;
  properties: BpmcpNodeProperties;
  relationshipType: string;
}

export interface BpmcpNodeDetails {
  bimbaCoordinate: string;
  properties: BpmcpNodeProperties | null;
  relations: {
    parents: BpmcpNodeRelation[];
    children: BpmcpNodeRelation[];
    siblings: BpmcpNodeRelation[];
  };
}

export interface NotionResolution {
  targetCoordinate: string;
  foundCoordinate: string;
  notionPageId: string;
  notionPageUrl: string;
  labels: string[];
}

const EXCLUDED_PROPERTIES = [
  'embedding', 
  'updatedAt', 
  'createdAt', 
  'notionPageId',
  // QL-specific properties that are not meaningful to general users
  'qlOperatorTypes',
  'qlPosition',
  'contextFrame', 
  'notionBimbaMapBlockId',
  'qlCategory'
];

class BpmcpService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  /**
   * Filter properties to exclude technical metadata and clean up values
   */
  private filterProperties(properties: Record<string, any> | null): BpmcpNodeProperties {
    if (!properties) return {};
    
    const filtered: BpmcpNodeProperties = {};
    Object.entries(properties).forEach(([key, value]) => {
      // Skip excluded properties
      if (EXCLUDED_PROPERTIES.includes(key)) {
        return;
      }
      
      // Skip properties with "N/A" values or empty strings
      if (value === 'N/A' || value === '' || value === null || value === undefined) {
        return;
      }
      
      // Special handling for type field - skip if it's N/A
      if (key === 'type' && (value === 'N/A' || !value)) {
        return;
      }
      
      filtered[key] = value;
    });
    
    return filtered;
  }

  /**
   * Query node details using BPMCP queryBimbaGraph tool
   */
  async queryBimbaGraph(coordinate: string): Promise<BpmcpNodeDetails> {
    try {
      console.log(`[BPMCP Service] Querying node details for coordinate: ${coordinate}`);
      
      const response = await axios.post(`${this.baseUrl}/api/bpmcp/call-tool`, {
        toolName: 'queryBimbaGraph',
        args: { specificCoordinate: coordinate }
      });

      const data = response.data;
      
      // Filter properties at all levels
      const nodeDetails: BpmcpNodeDetails = {
        bimbaCoordinate: data.bimbaCoordinate,
        properties: this.filterProperties(data.properties),
        relations: {
          parents: data.relations?.parents?.map((rel: any) => ({
            bimbaCoordinate: rel.bimbaCoordinate,
            properties: this.filterProperties(rel.properties),
            relationshipType: rel.relationshipType
          })) || [],
          children: data.relations?.children?.map((rel: any) => ({
            bimbaCoordinate: rel.bimbaCoordinate,
            properties: this.filterProperties(rel.properties),
            relationshipType: rel.relationshipType
          })) || [],
          siblings: data.relations?.siblings?.map((rel: any) => ({
            bimbaCoordinate: rel.bimbaCoordinate,
            properties: this.filterProperties(rel.properties),
            relationshipType: rel.relationshipType
          })) || []
        }
      };

      console.log(`[BPMCP Service] Successfully fetched node details for ${coordinate}`);
      return nodeDetails;
    } catch (error) {
      console.error(`[BPMCP Service] Error querying node details:`, error);
      throw new Error(`Failed to fetch node details for ${coordinate}`);
    }
  }

  /**
   * Resolve Bimba coordinate to Notion page URL
   */
  async resolveBimbaCoordinate(targetCoordinate: string): Promise<NotionResolution | null> {
    try {
      console.log(`[BPMCP Service] Resolving Notion page for coordinate: ${targetCoordinate}`);
      
      const response = await axios.post(`${this.baseUrl}/api/bpmcp/resolveBimbaCoordinate`, {
        targetCoordinate
      });

      const data = response.data;
      
      console.log(`[BPMCP Service] Successfully resolved Notion page for ${targetCoordinate}`);
      return data;
    } catch (error) {
      console.warn(`[BPMCP Service] Could not resolve Notion page for ${targetCoordinate}:`, error);
      return null;
    }
  }

  /**
   * Get enhanced node details with Notion link resolution
   */
  async getEnhancedNodeDetails(coordinate: string): Promise<{
    nodeDetails: BpmcpNodeDetails;
    notionResolution: NotionResolution | null;
  }> {
    try {
      // First get the node details
      const nodeDetails = await this.queryBimbaGraph(coordinate);
      
      // Try to resolve Notion link
      let notionResolution: NotionResolution | null = null;
      try {
        notionResolution = await this.resolveBimbaCoordinate(coordinate);
      } catch (error) {
        // Notion resolution is optional, continue without it
        console.warn(`[BPMCP Service] Notion resolution failed for ${coordinate}, continuing without it`);
      }

      return { nodeDetails, notionResolution };
    } catch (error) {
      console.error(`[BPMCP Service] Error getting enhanced node details:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const bpmcpService = new BpmcpService();
export default bpmcpService;