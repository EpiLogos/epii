import { callBPMCPTool, closeBPMCPClient } from './bpWebSocketClient.mjs';

/**
 * Shared service for accessing B-P MCP tools
 */
class BPMCPService {
  /**
   * Call a tool on the B-P MCP server
   * @param {string} toolName - The name of the tool to call
   * @param {object} args - The arguments for the tool
   * @returns {Promise<any>} - The result of the tool call
   */
  async callTool(toolName, args) {
    return callBPMCPTool(toolName, args);
  }
  
  /**
   * Close the connection to the B-P MCP server
   */
  close() {
    closeBPMCPClient();
  }
  
  // Add convenience methods for common tools
  
  /**
   * Query the Bimba graph
   * @param {string} query - Cypher query
   * @param {object} [params] - Query parameters
   * @returns {Promise<any>} - Query results
   */
  async queryBimbaGraph(query, params = {}) {
    return this.callTool('queryBimbaGraph', { query, params });
  }
  
  /**
   * Search the Pratibimba context
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @returns {Promise<any>} - Search results
   */
  async searchPratibimbaContext(query, options = {}) {
    return this.callTool('searchPratibimbaContext', { 
      query, 
      collection: options.collection,
      filters: options.filters,
      limit: options.limit
    });
  }
  
  /**
   * Get context from MongoDB
   * @param {string} contextType - Type of context ('conversation', 'userMemory', 'ingestedData')
   * @param {string} [userId] - User ID (required for 'conversation' and 'userMemory')
   * @param {object} [query] - Additional query parameters
   * @param {number} [limit] - Maximum number of results
   * @returns {Promise<any>} - Context data
   */
  async getMongoContext(contextType, userId, query = {}, limit = 10) {
    return this.callTool('getMongoContext', {
      contextType,
      userId,
      query,
      limit
    });
  }
  
  /**
   * Query Notion
   * @param {object} options - Query options
   * @returns {Promise<any>} - Notion data
   */
  async queryNotion(options) {
    return this.callTool('queryNotion', options);
  }
  
  /**
   * Get inspiration based on a query
   * @param {string} query - The topic or area for which inspiration is sought
   * @param {string[]} [coordinateFilter] - Optional array of Bimba coordinates
   * @param {number} [limit] - Maximum number of results
   * @returns {Promise<any>} - Inspiration data
   */
  async getInspiration(query, coordinateFilter, limit) {
    return this.callTool('getInspiration', {
      query,
      coordinateFilter,
      limit
    });
  }
  
  /**
   * Get an overview of a node
   * @param {string} bimbaCoordinate - The Bimba coordinate of the node
   * @returns {Promise<any>} - Node overview
   */
  async getNodeOverview(bimbaCoordinate) {
    return this.callTool('getNodeOverview', { bimbaCoordinate });
  }
  
  /**
   * Search the web
   * @param {string} query - Search query
   * @returns {Promise<any>} - Search results
   */
  async searchWeb(query) {
    return this.callTool('searchWeb', { query });
  }
  
  /**
   * Research and integrate content
   * @param {object} options - Research options
   * @returns {Promise<any>} - Research results
   */
  async researchAndIntegrate(options) {
    return this.callTool('researchAndIntegrate', options);
  }
  
  /**
   * Send content to ingestion
   * @param {string} textContent - The text content to ingest
   * @param {object} metadata - Metadata for the content
   * @returns {Promise<any>} - Ingestion results
   */
  async sendToIngestion(textContent, metadata) {
    return this.callTool('sendToIngestion', {
      textContent,
      metadata
    });
  }
  
  /**
   * Resolve a Bimba coordinate to a Notion page ID
   * @param {string} bimbaCoordinate - The Bimba coordinate to resolve
   * @returns {Promise<any>} - Resolution results
   */
  async resolveBimbaCoordinate(bimbaCoordinate) {
    return this.callTool('resolveBimbaCoordinate', { bimbaCoordinate });
  }
  
  /**
   * Append blocks to a Notion page
   * @param {string} notionPageId - The ID of the Notion page
   * @param {Array} blocksToAppend - The blocks to append
   * @returns {Promise<any>} - Append results
   */
  async appendNotionBlock(notionPageId, blocksToAppend) {
    return this.callTool('appendNotionBlock', {
      notionPageId,
      blocksToAppend
    });
  }
  
  /**
   * Crystallize content to a Notion page
   * @param {string} targetBimbaCoordinate - The Bimba coordinate of the target node
   * @param {string} contentToAppend - The content to append
   * @returns {Promise<any>} - Crystallization results
   */
  async crystallizeToNotion(targetBimbaCoordinate, contentToAppend) {
    return this.callTool('crystallizeToNotion', {
      targetBimbaCoordinate,
      contentToAppend
    });
  }
  
  /**
   * Get Notion page properties
   * @param {string} notionPageId - The ID of the Notion page
   * @param {string} [fetchFileFromProperty] - Optional property to fetch file from
   * @returns {Promise<any>} - Page properties
   */
  async getNotionPageProperties(notionPageId, fetchFileFromProperty) {
    return this.callTool('getNotionPageProperties', {
      notionPageId,
      fetchFileFromProperty
    });
  }
}

// Export singleton instance
export default new BPMCPService();
