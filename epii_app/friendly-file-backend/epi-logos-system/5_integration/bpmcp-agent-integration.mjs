/**
 * BPMCP Agent Integration for Epi-Logos Agent
 * Connects the universal agent orchestrator to BPMCP knowledge operations
 */

import { BPWebSocketClient } from '../../databases/bpmcp/bpWebSocketClient.mjs';

class BPMCPAgentIntegration {
  constructor() {
    this.bpClient = null;
    this.isConnected = false;
    this.availableTools = new Set();
    this.knowledgeCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialize BPMCP connection for agent
   */
  async initialize() {
    try {
      console.log('[BPMCPAgentIntegration] Initializing BPMCP connection for Epi-Logos Agent...');
      
      this.bpClient = new BPWebSocketClient({
        name: 'epi-logos-agent',
        version: '1.0.0'
      });

      await this.bpClient.connect();
      this.isConnected = true;

      // Discover available tools
      await this.discoverAvailableTools();

      console.log('[BPMCPAgentIntegration] BPMCP integration initialized successfully');
      console.log(`[BPMCPAgentIntegration] Available tools: ${Array.from(this.availableTools).join(', ')}`);

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Failed to initialize BPMCP connection:', error);
      throw error;
    }
  }

  /**
   * Discover available BPMCP tools
   */
  async discoverAvailableTools() {
    try {
      // Query available tools from BPMCP server
      const toolsResponse = await this.bpClient.callTool('tools/list', {});
      
      if (toolsResponse?.tools) {
        toolsResponse.tools.forEach(tool => {
          this.availableTools.add(tool.name);
        });
      } else {
        // Default known tools
        this.availableTools.add('queryBimbaGraph');
        this.availableTools.add('bimbaKnowing');
        this.availableTools.add('generateBimbaEmbeddings');
        this.availableTools.add('manageBimbaRelationships');
      }
    } catch (error) {
      console.warn('[BPMCPAgentIntegration] Could not discover tools, using defaults:', error.message);
      // Fallback to known tools
      this.availableTools.add('queryBimbaGraph');
      this.availableTools.add('bimbaKnowing');
      this.availableTools.add('generateBimbaEmbeddings');
      this.availableTools.add('manageBimbaRelationships');
    }
  }

  /**
   * Query Bimba graph with caching
   */
  async queryBimbaGraph(query, options = {}) {
    const cacheKey = `query:${JSON.stringify({ query, options })}`;
    
    // Check cache first
    if (this.knowledgeCache.has(cacheKey)) {
      const cached = this.knowledgeCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('[BPMCPAgentIntegration] Returning cached Bimba query result');
        return cached.data;
      }
    }

    try {
      const result = await this.bpClient.callTool('queryBimbaGraph', {
        query,
        limit: options.limit || 10,
        includeRelationships: options.includeRelationships !== false,
        coordinateFilter: options.coordinateFilter,
        ...options
      });

      // Cache the result
      this.knowledgeCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Bimba graph query failed:', error);
      throw error;
    }
  }

  /**
   * Bimba knowing (semantic search) with caching
   */
  async bimbaKnowing(query, options = {}) {
    const cacheKey = `knowing:${JSON.stringify({ query, options })}`;
    
    // Check cache first
    if (this.knowledgeCache.has(cacheKey)) {
      const cached = this.knowledgeCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('[BPMCPAgentIntegration] Returning cached Bimba knowing result');
        return cached.data;
      }
    }

    try {
      const result = await this.bpClient.callTool('bimbaKnowing', {
        query,
        topK: options.topK || 5,
        threshold: options.threshold || 0.7,
        includeCoordinates: options.includeCoordinates !== false,
        coordinateFilter: options.coordinateFilter,
        ...options
      });

      // Cache the result
      this.knowledgeCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Bimba knowing query failed:', error);
      throw error;
    }
  }

  /**
   * Generate Bimba embeddings
   */
  async generateBimbaEmbeddings(content, coordinate, options = {}) {
    try {
      const result = await this.bpClient.callTool('generateBimbaEmbeddings', {
        content,
        coordinate,
        metadata: options.metadata || {},
        updateExisting: options.updateExisting !== false,
        ...options
      });

      // Clear related cache entries
      this.clearCacheByPattern(`knowing:.*${coordinate}`);
      this.clearCacheByPattern(`query:.*${coordinate}`);

      return result;

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Bimba embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Manage Bimba relationships
   */
  async manageBimbaRelationships(action, relationships, options = {}) {
    try {
      const result = await this.bpClient.callTool('manageBimbaRelationships', {
        action, // 'create', 'update', 'delete'
        relationships,
        ...options
      });

      // Clear relationship-related cache
      this.clearCacheByPattern('query:.*');

      return result;

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Bimba relationship management failed:', error);
      throw error;
    }
  }

  /**
   * Universal knowledge query - combines multiple BPMCP tools
   */
  async universalKnowledgeQuery(query, context = {}) {
    try {
      console.log(`[BPMCPAgentIntegration] Executing universal knowledge query: ${query}`);

      const results = {
        query,
        timestamp: new Date().toISOString(),
        context,
        results: {}
      };

      // 1. Semantic search with bimbaKnowing
      if (this.availableTools.has('bimbaKnowing')) {
        try {
          results.results.semanticSearch = await this.bimbaKnowing(query, {
            topK: 10,
            coordinateFilter: context.coordinateFilter,
            includeCoordinates: true
          });
        } catch (error) {
          console.warn('[BPMCPAgentIntegration] Semantic search failed:', error.message);
          results.results.semanticSearch = { error: error.message };
        }
      }

      // 2. Graph query for structural relationships
      if (this.availableTools.has('queryBimbaGraph')) {
        try {
          results.results.graphQuery = await this.queryBimbaGraph(query, {
            limit: 15,
            includeRelationships: true,
            coordinateFilter: context.coordinateFilter
          });
        } catch (error) {
          console.warn('[BPMCPAgentIntegration] Graph query failed:', error.message);
          results.results.graphQuery = { error: error.message };
        }
      }

      // 3. Coordinate-specific queries if coordinates provided
      if (context.coordinates?.length > 0) {
        results.results.coordinateSpecific = {};
        
        for (const coordinate of context.coordinates) {
          try {
            const coordResult = await this.bimbaKnowing(query, {
              coordinateFilter: [coordinate],
              topK: 5
            });
            results.results.coordinateSpecific[coordinate] = coordResult;
          } catch (error) {
            console.warn(`[BPMCPAgentIntegration] Coordinate query failed for ${coordinate}:`, error.message);
            results.results.coordinateSpecific[coordinate] = { error: error.message };
          }
        }
      }

      // 4. Synthesize results
      results.synthesis = this.synthesizeKnowledgeResults(results.results);

      return results;

    } catch (error) {
      console.error('[BPMCPAgentIntegration] Universal knowledge query failed:', error);
      throw error;
    }
  }

  /**
   * Synthesize knowledge results from multiple sources
   */
  synthesizeKnowledgeResults(results) {
    const synthesis = {
      totalResults: 0,
      topRelevantCoordinates: [],
      keyInsights: [],
      recommendations: []
    };

    // Count total results
    if (results.semanticSearch?.results) {
      synthesis.totalResults += results.semanticSearch.results.length;
    }
    if (results.graphQuery?.nodes) {
      synthesis.totalResults += results.graphQuery.nodes.length;
    }

    // Extract top coordinates
    const coordinateCounts = new Map();
    
    const addCoordinate = (coord) => {
      if (coord) {
        coordinateCounts.set(coord, (coordinateCounts.get(coord) || 0) + 1);
      }
    };

    // From semantic search
    if (results.semanticSearch?.results) {
      results.semanticSearch.results.forEach(result => {
        addCoordinate(result.coordinate);
      });
    }

    // From graph query
    if (results.graphQuery?.nodes) {
      results.graphQuery.nodes.forEach(node => {
        addCoordinate(node.coordinate);
      });
    }

    // Sort coordinates by frequency
    synthesis.topRelevantCoordinates = Array.from(coordinateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([coord, count]) => ({ coordinate: coord, relevance: count }));

    // Generate insights
    if (synthesis.totalResults > 0) {
      synthesis.keyInsights.push(`Found ${synthesis.totalResults} relevant knowledge fragments`);
      
      if (synthesis.topRelevantCoordinates.length > 0) {
        synthesis.keyInsights.push(
          `Most relevant coordinates: ${synthesis.topRelevantCoordinates.map(c => c.coordinate).join(', ')}`
        );
      }
    }

    return synthesis;
  }

  /**
   * Clear cache entries matching pattern
   */
  clearCacheByPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.knowledgeCache.keys()) {
      if (regex.test(key)) {
        this.knowledgeCache.delete(key);
      }
    }
  }

  /**
   * Get available tools
   */
  getAvailableTools() {
    return Array.from(this.availableTools);
  }

  /**
   * Check if tool is available
   */
  hasKnowledgeTool(toolName) {
    return this.availableTools.has(toolName);
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      availableTools: this.getAvailableTools(),
      cacheSize: this.knowledgeCache.size,
      lastActivity: new Date().toISOString()
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.knowledgeCache.clear();
    console.log('[BPMCPAgentIntegration] Knowledge cache cleared');
  }

  /**
   * Close connection
   */
  async close() {
    if (this.bpClient) {
      await this.bpClient.close();
      this.isConnected = false;
      this.clearCache();
      console.log('[BPMCPAgentIntegration] BPMCP connection closed');
    }
  }
}

export default BPMCPAgentIntegration;