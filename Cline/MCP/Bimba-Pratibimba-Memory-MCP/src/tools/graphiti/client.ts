/**
 * Graphiti MCP Client Service
 *
 * This client communicates with the Graphiti MCP server via SSE transport.
 * Implements proper MCP-to-MCP communication using the TypeScript SDK.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { EventSource } from 'eventsource';

// Polyfill EventSource for Node.js environment
if (typeof globalThis.EventSource === 'undefined') {
  globalThis.EventSource = EventSource as any;
}

export interface GraphitiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export interface GraphitiToolResponse {
  content: Array<{
    type: string;
    text?: string;
    data?: any;
  }>;
  isError?: boolean;
}

export class GraphitiClient {
  private mcpClient: Client;
  private transport: SSEClientTransport | null = null;
  private config: GraphitiClientConfig;
  private isConnected: boolean = false;

  constructor(config: GraphitiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config,
    };

    // Create MCP client for communicating with Graphiti MCP server
    this.mcpClient = new Client({
      name: 'bpmcp-graphiti-client',
      version: '1.0.0',
    }, {
      capabilities: {}
    });
  }

  /**
   * Connect to the Graphiti MCP server via SSE transport
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const logPrefix = '[GraphitiClient.connect]';

    try {
      console.log(`${logPrefix} Connecting to Graphiti MCP server at ${this.config.baseUrl}`);

      // Create SSE transport to connect to Graphiti server
      this.transport = new SSEClientTransport(new URL(`${this.config.baseUrl}/sse`));

      // Connect the MCP client
      await this.mcpClient.connect(this.transport);

      this.isConnected = true;
      console.log(`${logPrefix} Successfully connected to Graphiti MCP server`);

    } catch (error: any) {
      console.error(`${logPrefix} Failed to connect:`, error.message);
      this.isConnected = false;
      throw new Error(`Failed to connect to Graphiti MCP server: ${error.message}`);
    }
  }

  /**
   * Disconnect from the Graphiti MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      if (this.transport) {
        await this.transport.close();
        this.transport = null;
      }
      this.isConnected = false;
      console.log('[GraphitiClient.disconnect] Disconnected from Graphiti MCP server');
    } catch (error: any) {
      console.error('[GraphitiClient.disconnect] Error during disconnect:', error.message);
    }
  }

  /**
   * Call a tool on the Graphiti MCP server via MCP protocol
   */
  async callTool(toolName: string, args: Record<string, any>): Promise<GraphitiToolResponse> {
    const logPrefix = `[GraphitiClient.callTool(${toolName})]`;

    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }

      console.log(`${logPrefix} Calling MCP tool with args:`, JSON.stringify(args, null, 2));

      // Call the tool via MCP protocol
      const result = await this.mcpClient.callTool({
        name: toolName,
        arguments: args
      });

      console.log(`${logPrefix} MCP tool call successful`);

      // Convert MCP result to our expected format
      return {
        content: Array.isArray(result.content) ? result.content : [],
        isError: Boolean(result.isError)
      };

    } catch (error: any) {
      console.error(`${logPrefix} MCP tool call failed:`, error.message);

      // Return error response in expected format
      return {
        content: [{
          type: 'text',
          text: `Error calling Graphiti tool '${toolName}': ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Check if the Graphiti server is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }

      // Try to get server status via MCP
      const response = await this.callTool('get_status', {});
      return !response.isError;
    } catch (error) {
      console.error('[GraphitiClient] Health check failed:', error);
      return false;
    }
  }

  /**
   * Add an episode to Graphiti with coordinate-aware context
   */
  async addEpisode(params: {
    name: string;
    episodeBody: string;
    source?: string;
    sourceDescription?: string;
    groupId?: string;
    uuid?: string;
    bimbaCoordinate?: string;
    qlVariant?: string;
    contextFrame?: string;
    analysisContext?: string;
    relevanceScore?: number;
  }): Promise<GraphitiToolResponse> {
    // Prepare group_id with coordinate context if provided
    let effectiveGroupId = params.groupId;
    if (!effectiveGroupId && params.bimbaCoordinate) {
      // Use coordinate as group_id for coordinate-based organization
      effectiveGroupId = params.bimbaCoordinate.replace('#', 'coord_');
    }

    // Enhance episode body with coordinate context if provided
    let enhancedEpisodeBody = params.episodeBody;
    if (params.bimbaCoordinate || params.qlVariant || params.analysisContext) {
      const contextMetadata = {
        bimbaCoordinate: params.bimbaCoordinate,
        qlVariant: params.qlVariant,
        contextFrame: params.contextFrame,
        analysisContext: params.analysisContext,
        relevanceScore: params.relevanceScore,
      };

      // For JSON episodes, merge context into the JSON
      if (params.source === 'json') {
        try {
          const episodeData = JSON.parse(params.episodeBody);
          const enhancedData = {
            ...episodeData,
            _bimbaContext: contextMetadata,
          };
          enhancedEpisodeBody = JSON.stringify(enhancedData);
        } catch (error) {
          console.warn('[GraphitiClient] Failed to parse JSON episode body, adding context as text');
          enhancedEpisodeBody = `${params.episodeBody}\n\nBimba Context: ${JSON.stringify(contextMetadata)}`;
        }
      } else {
        // For text episodes, append context
        enhancedEpisodeBody = `${params.episodeBody}\n\nBimba Context: ${JSON.stringify(contextMetadata)}`;
      }
    }

    return this.callTool('add_memory', {
      name: params.name,
      episode_body: enhancedEpisodeBody,
      source: params.source || 'text',
      source_description: params.sourceDescription || '',
      group_id: effectiveGroupId,
      uuid: params.uuid,
    });
  }

  /**
   * Search for entities/nodes with coordinate filtering
   */
  async searchEntities(params: {
    query: string;
    groupIds?: string[];
    maxNodes?: number;
    centerNodeUuid?: string;
    entityType?: string;
    bimbaCoordinate?: string;
    qlVariant?: string;
    contextFrame?: string;
  }): Promise<GraphitiToolResponse> {
    // Enhance group_ids with coordinate-based filtering
    let effectiveGroupIds = params.groupIds || [];
    if (params.bimbaCoordinate && effectiveGroupIds.length === 0) {
      effectiveGroupIds = [params.bimbaCoordinate.replace('#', 'coord_')];
    }

    return this.callTool('search_memory_nodes', {
      query: params.query,
      group_ids: effectiveGroupIds.length > 0 ? effectiveGroupIds : undefined,
      max_nodes: params.maxNodes || 10,
      center_node_uuid: params.centerNodeUuid,
      entity: params.entityType || '',
    });
  }

  /**
   * Search for facts/relationships with coordinate filtering
   */
  async searchFacts(params: {
    query: string;
    groupIds?: string[];
    maxFacts?: number;
    centerNodeUuid?: string;
    bimbaCoordinate?: string;
    qlVariant?: string;
  }): Promise<GraphitiToolResponse> {
    // Enhance group_ids with coordinate-based filtering
    let effectiveGroupIds = params.groupIds || [];
    if (params.bimbaCoordinate && effectiveGroupIds.length === 0) {
      effectiveGroupIds = [params.bimbaCoordinate.replace('#', 'coord_')];
    }

    return this.callTool('search_memory_facts', {
      query: params.query,
      group_ids: effectiveGroupIds.length > 0 ? effectiveGroupIds : undefined,
      max_facts: params.maxFacts || 10,
      center_node_uuid: params.centerNodeUuid,
    });
  }

  /**
   * Get recent episodes with coordinate filtering
   */
  async getEpisodes(params: {
    groupId?: string;
    lastN?: number;
    bimbaCoordinate?: string;
    qlVariant?: string;
  }): Promise<GraphitiToolResponse> {
    let effectiveGroupId = params.groupId;
    if (!effectiveGroupId && params.bimbaCoordinate) {
      effectiveGroupId = params.bimbaCoordinate.replace('#', 'coord_');
    }

    return this.callTool('get_episodes', {
      group_id: effectiveGroupId,
      last_n: params.lastN || 10,
    });
  }

  /**
   * Delete an episode
   */
  async deleteEpisode(uuid: string): Promise<GraphitiToolResponse> {
    return this.callTool('delete_episode', { uuid });
  }

  /**
   * Delete an entity edge
   */
  async deleteEntityEdge(uuid: string): Promise<GraphitiToolResponse> {
    return this.callTool('delete_entity_edge', { uuid });
  }

  /**
   * Get an entity edge by UUID
   */
  async getEntityEdge(uuid: string): Promise<GraphitiToolResponse> {
    return this.callTool('get_entity_edge', { uuid });
  }

  /**
   * Clear the entire graph
   */
  async clearGraph(): Promise<GraphitiToolResponse> {
    return this.callTool('clear_graph', {});
  }

  /**
   * Get server status
   */
  async getStatus(): Promise<GraphitiToolResponse> {
    return this.callTool('get_status', {});
  }
}
