/**
 * Unified RAG Skill
 * The foundational A2A-aligned skill that orchestrates all BPMCP tools
 * into a dynamic, holistic context window for any coordinate or set of coordinates
 *
 * Bimba Coordinate: #0 (Universal - accessible by all agents)
 * Epic: 002 - A2A Skill Management Framework
 * Story: 1.3 - Unified RAG Implementation
 */

// Import the proper BPMCP service that connects via WebSocket
const path = require('path');

// We need to dynamically import the ES module bpMCPService
let bpMCPService = null;

async function getBPMCPService() {
  if (!bpMCPService) {
    try {
      // Import the ES module bpMCPService from the backend
      const servicePath = path.resolve(__dirname, '../../friendly-file-backend/services/bpMCPService.mjs');
      const bpMCPModule = await import(servicePath);
      bpMCPService = bpMCPModule.default;
      console.log('[UnifiedRAG] BPMCP service loaded successfully');
    } catch (error) {
      console.error('[UnifiedRAG] Failed to load BPMCP service:', error);
      throw new Error('Failed to initialize BPMCP service connection');
    }
  }
  return bpMCPService;
}

class UnifiedRAGSkill {
  constructor() {
    this.skillId = 'unifiedRAG';
    this.name = 'Unified RAG Context Builder';
    this.description = 'Orchestrates Bimba, LightRAG, Graphiti, and Notion tools to create comprehensive context windows for any coordinate or query';
    this.bimbaCoordinate = '#'; // Root coordinate - universal access
    this.version = '1.0.0';

    // Available data sources
    this.dataSources = {
      bimba: 'bimbaKnowing',
      lightrag: 'lightragNaive',
      graphiti: 'getGraphitiContext',
      notion: 'getNotionPageContent'
    };

    // Coordinate-based caching system
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Main skill execution - creates unified context window
   * @param {Object} params - Skill parameters
   * @param {string} params.query - Natural language query
   * @param {string|Array} params.coordinates - Bimba coordinate(s) to focus on
   * @param {Object} [params.sources] - Which sources to include {bimba: true, lightrag: true, graphiti: true, notion: true}
   * @param {Object} [params.options] - Additional options for each source
   * @param {string} [params.agentCoordinate] - Calling agent's coordinate for context
   * @param {Object} [params.uiContext] - UI context from AG-UI protocol
   * @returns {Promise<Object>} - Unified context window
   */
  async execute(params) {
    const startTime = Date.now();
    const logPrefix = `[UnifiedRAG]`;

    console.log(`${logPrefix} Starting unified RAG for query: "${params.query}"`);
    console.log(`${logPrefix} Target coordinates: ${JSON.stringify(params.coordinates)}`);

    // Validate and normalize inputs
    const validatedParams = this._validateAndNormalizeParams(params);
    const { query, coordinates, sources, options, agentCoordinate, uiContext } = validatedParams;

    // TEMPORARILY DISABLE CACHE FOR DEBUGGING
    console.log(`${logPrefix} Cache DISABLED for debugging - forcing fresh retrieval`);
    const cacheKey = this._generateCacheKey(query, coordinates, sources); // Still need this for later

    // Initialize result structure
    const unifiedContext = {
      query,
      coordinates,
      agentCoordinate,
      timestamp: new Date().toISOString(),
      sources: {},
      synthesis: {},
      metadata: {
        executionTime: null,
        sourcesQueried: [],
        coordinatesCovered: [],
        totalTokens: 0
      }
    };

    try {
      // Execute data source queries with layered prioritization
      // Layer 0: Agent Branch Awareness (foundational identity)
      const agentBranchContext = await this._getAgentBranchContext(agentCoordinate, query);

      // Layer 1: Structural Foundation (queryBimbaGraph for structural context)
      const structuralPromises = [];
      if (sources.bimba) {
        structuralPromises.push(this._getStructuralContext(query, coordinates, options.bimba));
        structuralPromises.push(this._getBimbaContext(query, coordinates, options.bimba, agentCoordinate));
      }

      // Execute structural layer first
      const structuralResults = await Promise.allSettled(structuralPromises);

      // Layer 2: Dynamic and Semantic Context (parallel execution)
      const contextPromises = [];

      // Graphiti Dynamic Memory (high priority - temporal context)
      if (sources.graphiti) {
        contextPromises.push(this._getGraphitiContext(query, coordinates, options.graphiti, uiContext));
      }

      // LightRAG Semantic Context (default enabled - semantic enrichment)
      if (sources.lightrag) {
        contextPromises.push(this._getLightRAGContext(query, coordinates, options.lightrag, uiContext));
      }

      // Execute context layer
      const contextResults = await Promise.allSettled(contextPromises);

      // Layer 3: Crystallized Knowledge (optional)
      const knowledgePromises = [];
      if (sources.notion) {
        knowledgePromises.push(this._getNotionContext(query, coordinates, options.notion));
      }

      // Execute knowledge layer
      const knowledgeResults = await Promise.allSettled(knowledgePromises);

      // Combine all results maintaining layered priority order
      const sourceResults = [
        { value: agentBranchContext, status: 'fulfilled' }, // Agent branch awareness
        ...structuralResults, // Structural foundation
        ...contextResults,    // Dynamic + semantic context
        ...knowledgeResults   // Crystallized knowledge
      ];

      // Process results and handle failures gracefully
      this._processSourceResults(sourceResults, unifiedContext, sources);

      // IMMEDIATE SYNTHESIS after each layer
      console.log(`${logPrefix} Performing immediate synthesis of collected layers...`);

      // Synthesize Graphiti layer immediately if available
      if (unifiedContext.sources.graphiti?.success) {
        unifiedContext.graphitiSynthesis = this._synthesizeGraphitiImmediate(unifiedContext.sources.graphiti);
      }

      // Synthesize Bimba layer immediately if available - COMBINE ALL BIMBA SOURCES
      console.log(`${logPrefix} ========== BIMBA SYNTHESIS STAGE ==========`);
      console.log(`${logPrefix} Available sources:`, Object.keys(unifiedContext.sources));

      const bimbaSources = [];
      if (unifiedContext.sources['agent-branch']?.success) {
        bimbaSources.push(unifiedContext.sources['agent-branch']);
        console.log(`${logPrefix} ✅ Agent-branch source available`);
      } else {
        console.log(`${logPrefix} ❌ Agent-branch source not available:`, unifiedContext.sources['agent-branch']?.error || 'No data');
      }

      if (unifiedContext.sources.structural?.success) {
        bimbaSources.push(unifiedContext.sources.structural);
        console.log(`${logPrefix} ✅ Structural source available`);
      } else {
        console.log(`${logPrefix} ❌ Structural source not available:`, unifiedContext.sources.structural?.error || 'No data');
      }

      if (unifiedContext.sources.bimba?.success) {
        bimbaSources.push(unifiedContext.sources.bimba);
        console.log(`${logPrefix} ✅ Bimba source available`);
      } else {
        console.log(`${logPrefix} ❌ Bimba source not available:`, unifiedContext.sources.bimba?.error || 'No data');
      }

      if (bimbaSources.length > 0) {
        console.log(`${logPrefix} Found ${bimbaSources.length} Bimba-related sources for synthesis`);

        bimbaSources.forEach((source, i) => {
          console.log(`${logPrefix} === Bimba Source ${i+1}: ${source.source} ===`);
          console.log(`${logPrefix} Data size: ${JSON.stringify(source.data).length} characters`);
          console.log(`${logPrefix} Data structure keys:`, Object.keys(source.data || {}));
          console.log(`${logPrefix} First 500 chars of data:`, JSON.stringify(source.data).substring(0, 500) + '...');
        });

        // Combine all Bimba data for comprehensive synthesis
        const combinedBimbaData = {
          sources: bimbaSources,
          combinedData: bimbaSources.map(s => s.data)
        };

        console.log(`${logPrefix} Calling LLM synthesis with combined data...`);
        unifiedContext.bimbaSynthesis = await this._synthesizeBimbaImmediate({ data: combinedBimbaData });

        console.log(`${logPrefix} === BIMBA SYNTHESIS RESULT ===`);
        console.log(`${logPrefix} Synthesis method:`, unifiedContext.bimbaSynthesis?.synthesisMethod);
        console.log(`${logPrefix} Context length:`, unifiedContext.bimbaSynthesis?.structuralContext?.length || 0, 'characters');
        console.log(`${logPrefix} First 300 chars of synthesized context:`, unifiedContext.bimbaSynthesis?.structuralContext?.substring(0, 300) + '...');
        console.log(`${logPrefix} Full synthesis object keys:`, Object.keys(unifiedContext.bimbaSynthesis || {}));
      } else {
        console.log(`${logPrefix} ❌ NO BIMBA DATA AVAILABLE FOR SYNTHESIS`);
        console.log(`${logPrefix} Source statuses:`);
        console.log(`${logPrefix} - agent-branch:`, unifiedContext.sources['agent-branch']?.success ? 'SUCCESS' : 'FAILED');
        console.log(`${logPrefix} - structural:`, unifiedContext.sources.structural?.success ? 'SUCCESS' : 'FAILED');
        console.log(`${logPrefix} - bimba:`, unifiedContext.sources.bimba?.success ? 'SUCCESS' : 'FAILED');
      }
      console.log(`${logPrefix} ========================================`);


      // Synthesize LightRAG layer immediately if available
      if (unifiedContext.sources.lightrag?.success) {
        unifiedContext.lightragSynthesis = this._synthesizeLightRAGImmediate(unifiedContext.sources.lightrag);
      }

      // Final harmonization using immediate syntheses
      unifiedContext.synthesis = this._harmonizeImmediateSyntheses(
        unifiedContext.graphitiSynthesis,
        unifiedContext.bimbaSynthesis,
        unifiedContext.lightragSynthesis,
        query,
        coordinates
      );

      // Calculate metadata
      unifiedContext.metadata.executionTime = Date.now() - startTime;
      unifiedContext.metadata.sourcesQueried = Object.keys(unifiedContext.sources);
      unifiedContext.metadata.coordinatesCovered = this._extractCoordinatesCovered(unifiedContext);

      console.log(`${logPrefix} Completed in ${unifiedContext.metadata.executionTime}ms`);
      console.log(`${logPrefix} Sources: ${unifiedContext.metadata.sourcesQueried.join(', ')}`);

      // *** FULL PAYLOAD LOGGING ***
      console.log(`${logPrefix} ========== FULL UNIFIED RAG PAYLOAD ==========`);
      console.log(JSON.stringify(unifiedContext, null, 2));
      console.log(`${logPrefix} ============================================`);

      // Cache the result for coordinate-based queries
      if (coordinates.length > 0) {
        this._setCachedResult(cacheKey, unifiedContext);
        console.log(`${logPrefix} Cached result for key: ${cacheKey}`);
      }

      return {
        success: true,
        data: unifiedContext,
        skillId: this.skillId,
        executionTime: unifiedContext.metadata.executionTime
      };

    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        success: false,
        error: error.message,
        skillId: this.skillId,
        executionTime: Date.now() - startTime,
        partialData: unifiedContext
      };
    }
  }

  /**
   * Validate and normalize input parameters
   * @private
   */
  _validateAndNormalizeParams(params) {
    if (!params.query) {
      throw new Error('Query parameter is required');
    }

    // Normalize coordinates to array
    let coordinates = params.coordinates || [];
    if (typeof coordinates === 'string') {
      coordinates = [coordinates];
    }

    // Default sources - all enabled unless explicitly disabled
    const sources = {
      bimba: true,
      lightrag: true,
      graphiti: true,
      notion: true,
      ...params.sources
    };

    // Default options for each source
    const options = {
      bimba: {
        contextDepth: 2,
        includeRelations: true,
        limit: 12,
        ...params.options?.bimba
      },
      lightrag: {
        limit: 15, // Increased from 8 to 15 for richer document chunks
        threshold: 0.7,
        mixedMode: true, // Use LightRAG's mixed mode (graph + vector)
        ...params.options?.lightrag
      },
      graphiti: {
        limit: 10,
        contextDepth: 2,
        includeRelated: true,
        includeEntities: true,
        includeFacts: true,
        ...params.options?.graphiti
      },
      notion: {
        includeContent: true,
        maxPages: 5,
        useCoordinateResolution: true, // Use resolveBimbaCoordinate
        ...params.options?.notion
      }
    };

    return {
      query: params.query,
      coordinates,
      sources,
      options,
      agentCoordinate: params.agentCoordinate || '#5', // Default to Epii agent
      uiContext: params.uiContext || {}
    };
  }

  /**
   * Get agent-specific branch awareness context
   * @private
   */
  async _getAgentBranchContext(agentCoordinate, query) {
    const logPrefix = `[UnifiedRAG:AgentBranch]`;
    console.log(`${logPrefix} Getting branch awareness for agent: ${agentCoordinate}`);

    try {
      const service = await getBPMCPService();

      // Get agent's branch-specific context using bimbaKnowing
      const result = await service.bimbaKnowing(
        `Agent branch awareness: ${query}`,
        2, // contextDepth
        agentCoordinate, // focusCoordinate (agent's own branch)
        agentCoordinate, // agentCoordinate
        6  // limit - focused on agent's branch
      );

      return {
        source: 'agent-branch',
        success: true,
        data: result,
        agentCoordinate: agentCoordinate,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'agent-branch',
        success: false,
        error: error.message,
        agentCoordinate: agentCoordinate,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get structural context using queryBimbaGraph with QL-aware 6-fold coordinate structure
   * @private
   */
  async _getStructuralContext(query, coordinates, options) {
    const logPrefix = `[UnifiedRAG:Structural]`;
    console.log(`${logPrefix} Getting QL-aware structural context...`);

    try {
      const service = await getBPMCPService();

      if (coordinates.length > 0) {
        const targetCoordinate = coordinates[0];
        console.log(`${logPrefix} Getting 6-fold QL structure for: ${targetCoordinate}`);

        // Extract parent coordinate for 6-fold structure (e.g., #1-4 -> #1)
        const parentCoord = targetCoordinate.includes('-') ?
          targetCoordinate.split('-')[0] : targetCoordinate;

        // Build QL-aware Cypher query for 6-fold coordinate structure
        const cypherQuery = `
          MATCH (target:VectorNode {bimbaCoordinate: $targetCoord})
          OPTIONAL MATCH (parent:VectorNode {bimbaCoordinate: $parentCoord})

          WITH target, parent
          OPTIONAL MATCH (ql0:VectorNode {bimbaCoordinate: $parentCoord + "-0"})
          OPTIONAL MATCH (ql1:VectorNode {bimbaCoordinate: $parentCoord + "-1"})
          OPTIONAL MATCH (ql2:VectorNode {bimbaCoordinate: $parentCoord + "-2"})
          OPTIONAL MATCH (ql3:VectorNode {bimbaCoordinate: $parentCoord + "-3"})
          OPTIONAL MATCH (ql4:VectorNode {bimbaCoordinate: $parentCoord + "-4"})
          OPTIONAL MATCH (ql5:VectorNode {bimbaCoordinate: $parentCoord + "-5"})

          RETURN target, parent, ql0, ql1, ql2, ql3, ql4, ql5
        `;

        const result = await service.callTool('queryBimbaGraph', {
          query: cypherQuery,
          params: {
            targetCoord: targetCoordinate,
            parentCoord: parentCoord
          }
        });

        console.log(`${logPrefix} Retrieved QL-aware 6-fold structure for ${targetCoordinate}`);

        return {
          source: 'structural',
          success: true,
          data: result,
          coordinatesFocused: coordinates,
          qlAware: true,
          parentCoordinate: parentCoord,
          timestamp: new Date().toISOString()
        };
      } else {
        // Fallback for general queries
        console.log(`${logPrefix} Using general QL-aware query`);
        const cypherQuery = `
          MATCH (n:VectorNode)
          WHERE n.name CONTAINS $searchTerm OR n.description CONTAINS $searchTerm
          RETURN n, n.bimbaCoordinate as coordinate
          ORDER BY n.bimbaCoordinate
          LIMIT ${options.limit || 10}
        `;

        const result = await service.callTool('queryBimbaGraph', {
          query: cypherQuery,
          params: { searchTerm: query.split(' ')[0] }
        });

        return {
          source: 'structural',
          success: true,
          data: result,
          coordinatesFocused: coordinates,
          qlAware: false,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'structural',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get Bimba structural context
   * @private
   */
  async _getBimbaContext(query, coordinates, options, agentCoordinate) {
    const logPrefix = `[UnifiedRAG:Bimba]`;
    console.log(`${logPrefix} Getting QL-aware Bimba context...`);

    try {
      const service = await getBPMCPService();

      if (coordinates.length > 0) {
        const targetCoordinate = coordinates[0];
        const parentCoord = targetCoordinate.includes('-') ?
          targetCoordinate.split('-')[0] : targetCoordinate;

        console.log(`${logPrefix} Getting QL-informed context for ${targetCoordinate} (parent: ${parentCoord})`);

        // Enhanced query WITHOUT hardcoded QL positions - let the actual data speak
        const enhancedQuery = `${query} - focusing on coordinate ${targetCoordinate} within the structural context of parent coordinate ${parentCoord}`;

        const result = await service.bimbaKnowing(
          enhancedQuery,
          options.contextDepth || 3, // Increased for QL structure
          targetCoordinate,
          agentCoordinate || '#', // Universal coordinate for UnifiedRAG
          options.limit || 30 // Increased for 6-fold structure
        );

        return {
          source: 'bimba',
          success: true,
          data: result,
          coordinatesFocused: coordinates,
          parentCoordinate: parentCoord,
          qlAware: true,
          timestamp: new Date().toISOString()
        };
      } else {
        // General QL-aware query
        const qlAwareQuery = `${query} - understanding this within the Quaternary Logic (QL) 6-fold structure that underlies the entire Bimba knowledge space`;

        const result = await service.bimbaKnowing(
          qlAwareQuery,
          options.contextDepth || 2,
          null,
          agentCoordinate || '#',
          options.limit || 20
        );

        return {
          source: 'bimba',
          success: true,
          data: result,
          coordinatesFocused: coordinates,
          qlAware: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'bimba',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get Graphiti dynamic memory context
   * @private
   */
  async _getGraphitiContext(query, coordinates, options, uiContext) {
    const logPrefix = `[UnifiedRAG:Graphiti]`;
    console.log(`${logPrefix} Querying Graphiti memory...`);

    try {
      const service = await getBPMCPService();

      // Use primary coordinate for Graphiti context
      const primaryCoordinate = coordinates.length > 0 ? coordinates[0] : '#5'; // Default to Epii

      const result = await service.callTool('getGraphitiContext', {
        bimbaCoordinate: primaryCoordinate,
        contextDepth: options.contextDepth || 2,
        includeRelated: options.includeRelated !== false, // Default true
        maxEntities: options.limit || 10,
        maxFacts: options.limit || 10,
        maxEpisodes: options.limit || 5
      });

      return {
        source: 'graphiti',
        success: true,
        data: result,
        coordinatesFocused: coordinates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'graphiti',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get LightRAG semantic context using direct HTTP call to LightRAG MCP server
   * @private
   */
  async _getLightRAGContext(query, coordinates, options, uiContext = {}) {
    const logPrefix = `[UnifiedRAG:LightRAG]`;
    console.log(`${logPrefix} Querying LightRAG with coordinate-aware retrieval...`);

    try {
      // Get LightRAG server URL from environment
      const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";
      console.log(`${logPrefix} Using LightRAG server at: ${LIGHTRAG_MCP_SERVER_URL}`);

      // Get document IDs for the coordinates from document cache
      const documentIds = await this._getDocumentIdsForCoordinates(coordinates);
      console.log(`${logPrefix} Found ${documentIds.length} documents for coordinates ${coordinates.join(', ')}:`, documentIds);

      // Build document-focused query using the document names we already found
      let enhancedQuery = query;

      if (documentIds.length > 0) {
        // Query for DOCUMENT CONTENT about Quaternary Logic principles
        enhancedQuery = `Quaternary Logic principles foundations tetradic structure four-fold logic systems basic expanded applications`;
        console.log(`${logPrefix} Querying for document content about Quaternary Logic principles`);
      } else {
        // Fallback to coordinate query
        enhancedQuery = `${query} QuaternalLogicFlowering Quaternary Logic`;
        console.log(`${logPrefix} Fallback to coordinate query`);
      }

      console.log(`${logPrefix} Enhanced query: "${enhancedQuery}"`);

      // Make direct HTTP call to LightRAG using GLOBAL mode for comprehensive content
      const axios = (await import('axios')).default;

      const response = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
        query: enhancedQuery,
        mode: "global", // Use global mode for more comprehensive foundational content
        top_k: options.limit || 10
      });

      return {
        source: 'lightrag',
        success: true,
        data: response.data,
        coordinatesFocused: coordinates,
        documentIds: documentIds,
        queryUsed: enhancedQuery,
        mode: 'global',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'lightrag',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get document IDs for specific coordinates from document cache
   * @private
   */
  async _getDocumentIdsForCoordinates(coordinates) {
    const logPrefix = `[UnifiedRAG:DocumentCache]`;

    if (!coordinates || coordinates.length === 0) {
      return [];
    }

    try {
      // Use BPMCP service to query MongoDB document cache
      const service = await getBPMCPService();

      const documentIds = [];

      for (const coordinate of coordinates) {
        console.log(`${logPrefix} Looking up documents for coordinate: ${coordinate}`);

        // First, let's see what's actually in the Documents collection
        const allDocsResult = await service.callTool('getMongoContext', {
          collection: 'Documents',
          query: {},
          projection: { _id: 1, title: 1, originalName: 1, fileName: 1, targetCoordinate: 1 },
          limit: 5
        });

        console.log(`${logPrefix} Sample documents in collection:`, JSON.stringify(allDocsResult, null, 2));

        // Query MongoDB for documents with this target coordinate
        const result = await service.callTool('getMongoContext', {
          collection: 'Documents',
          query: { targetCoordinate: coordinate },
          projection: { _id: 1, title: 1, originalName: 1, fileName: 1, targetCoordinate: 1 },
          limit: 10
        });

        console.log(`${logPrefix} Query result for ${coordinate}:`, JSON.stringify(result, null, 2));

        // Parse BPMCP response - RESULT IS DIRECT, NOT WRAPPED
        if (result && result.results && result.results.length > 0) {
          console.log(`${logPrefix} Direct result structure found`);

          // Use _id as the document identifier (MongoDB ObjectId converted to string)
          const coordDocIds = result.results.map(doc => doc._id || doc.documentId).filter(Boolean);
          documentIds.push(...coordDocIds);
          console.log(`${logPrefix} EXTRACTED IDs:`, coordDocIds);
          console.log(`${logPrefix} Found ${coordDocIds.length} documents for ${coordinate}:`, coordDocIds);

          // Also log document names for debugging
          const docNames = result.results.map(doc => doc.title || doc.originalName || doc.fileName).filter(Boolean);
          console.log(`${logPrefix} Document names: ${docNames.join(', ')}`);
        } else {
          console.log(`${logPrefix} No documents found for coordinate: ${coordinate}`);
          console.log(`${logPrefix} Result structure:`, JSON.stringify(result, null, 2));
        }
      }

      // Remove duplicates
      const uniqueDocumentIds = [...new Set(documentIds)];
      console.log(`${logPrefix} Total unique document IDs found: ${uniqueDocumentIds.length}`);

      return uniqueDocumentIds;
    } catch (error) {
      console.error(`${logPrefix} Error getting document IDs:`, error);
      return [];
    }
  }



  /**
   * Get Notion crystallized knowledge using coordinate resolution
   * @private
   */
  async _getNotionContext(query, coordinates, options) {
    const logPrefix = `[UnifiedRAG:Notion]`;
    console.log(`${logPrefix} Querying Notion content...`);

    try {
      const service = await getBPMCPService();
      let notionResults = [];

      // If we have coordinates, resolve them to Notion page URLs first
      if (coordinates.length > 0) {
        console.log(`${logPrefix} Resolving coordinates to Notion pages: ${coordinates.join(', ')}`);

        for (const coordinate of coordinates.slice(0, 3)) { // Limit to 3 coordinates
          try {
            // Use resolveBimbaCoordinate to get Notion page URL
            const resolveResult = await service.callTool('resolveBimbaCoordinate', {
              coordinate: coordinate
            });

            if (resolveResult && resolveResult.content && resolveResult.content[0]) {
              const resolvedData = JSON.parse(resolveResult.content[0].text);

              if (resolvedData.notionUrl) {
                // Get the actual Notion page content using the URL
                const pageResult = await service.callTool('getNotionPageContent', {
                  url: resolvedData.notionUrl
                });

                if (pageResult && pageResult.content && pageResult.content[0]) {
                  const pageData = JSON.parse(pageResult.content[0].text);
                  notionResults.push({
                    coordinate: coordinate,
                    url: resolvedData.notionUrl,
                    ...pageData
                  });
                }
              }
            }
          } catch (coordError) {
            console.warn(`${logPrefix} Failed to resolve coordinate ${coordinate}:`, coordError.message);
          }
        }
      }

      // Note: No fallback general search - Notion is coordinate-specific only

      return {
        source: 'notion',
        success: true,
        data: {
          results: notionResults,
          totalResults: notionResults.length,
          coordinatesResolved: coordinates,
          query: query
        },
        coordinatesFocused: coordinates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        source: 'notion',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Process source results and handle failures gracefully
   * @private
   */
  _processSourceResults(sourceResults, unifiedContext, sources) {
    // Process layered results
    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const sourceData = result.value;
        const sourceKey = sourceData.source;

        if (sourceKey) {
          unifiedContext.sources[sourceKey] = sourceData;
        } else {
          // Handle agent branch context (first result)
          if (index === 0) {
            unifiedContext.sources['agent-branch'] = sourceData;
          }
        }
      } else {
        console.warn(`[UnifiedRAG] Source ${index} failed:`, result.reason);
        // Create error entry for failed source
        const errorKey = `source-${index}`;
        unifiedContext.sources[errorKey] = {
          source: errorKey,
          success: false,
          error: result.reason?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        };
      }
    });
  }

  /**
   * Synthesize unified context from all sources
   * @private
   */
  async _synthesizeContext(unifiedContext, query, coordinates) {
    const synthesis = {
      summary: '',
      keyInsights: [],
      agentBranchContext: null,
      structuralContext: null,
      semanticRelevance: [],
      dynamicMemory: [],
      crystallizedKnowledge: [],
      coordinateMapping: {},
      recommendations: []
    };

    // Extract agent branch awareness (foundational)
    if (unifiedContext.sources['agent-branch']?.success) {
      synthesis.agentBranchContext = this._extractStructuralContext(unifiedContext.sources['agent-branch'].data);
    }

    // Extract structural foundation
    if (unifiedContext.sources.structural?.success) {
      synthesis.structuralFoundation = this._extractStructuralContext(unifiedContext.sources.structural.data);
    }

    // Extract structural context from Bimba
    if (unifiedContext.sources.bimba?.success) {
      synthesis.structuralContext = this._extractStructuralContext(unifiedContext.sources.bimba.data);
    }

    // Extract semantic relevance from LightRAG
    if (unifiedContext.sources.lightrag?.success) {
      synthesis.semanticRelevance = this._extractSemanticContext(unifiedContext.sources.lightrag.data);
    }

    // Extract dynamic memory from Graphiti
    if (unifiedContext.sources.graphiti?.success) {
      synthesis.dynamicMemory = this._extractDynamicContext(unifiedContext.sources.graphiti.data);
    }

    // Extract crystallized knowledge from Notion
    if (unifiedContext.sources.notion?.success) {
      synthesis.crystallizedKnowledge = this._extractNotionContext(unifiedContext.sources.notion.data);
    }

    // Generate summary and insights
    synthesis.summary = this._generateContextSummary(synthesis, query, coordinates);
    synthesis.keyInsights = this._extractKeyInsights(synthesis);
    synthesis.recommendations = this._generateRecommendations(synthesis, coordinates);

    return synthesis;
  }

  /**
   * Extract structural context from Bimba results
   * @private
   */
  _extractStructuralContext(bimbaData) {
    // Extract key structural information from bimbaKnowing results
    try {
      console.log('[UnifiedRAG] Processing Bimba data:', JSON.stringify(bimbaData, null, 2));

      // Handle BPMCP tool response format
      let parsed = bimbaData;
      if (bimbaData.content && Array.isArray(bimbaData.content)) {
        const textContent = bimbaData.content[0]?.text;
        if (textContent) {
          parsed = JSON.parse(textContent);
        }
      } else if (typeof bimbaData === 'string') {
        parsed = JSON.parse(bimbaData);
      }

      console.log('[UnifiedRAG] Parsed Bimba data:', JSON.stringify(parsed, null, 2));

      return {
        focusCoordinate: parsed.focusCoordinate,
        branchDistribution: parsed.branchDistribution,
        hexagonalStructure: parsed.hexagonalStructure,
        organizedByBranch: parsed.organizedByBranch,
        totalResults: parsed.results?.length || 0,
        rawResults: parsed.results || [],
        rawData: parsed // Include full raw data for debugging
      };
    } catch (error) {
      console.warn('[UnifiedRAG] Failed to parse Bimba structural context:', error);
      console.warn('[UnifiedRAG] Raw Bimba data was:', bimbaData);
      return {
        totalResults: 0,
        error: error.message,
        rawData: bimbaData
      };
    }
  }

  /**
   * Extract semantic context from LightRAG raw chunks
   * @private
   */
  _extractSemanticContext(lightragData) {
    // Extract semantic relevance information from LightRAG raw chunks
    try {
      // Handle raw chunks response format
      if (lightragData.status === 'success' && lightragData.chunks) {
        return lightragData.chunks.map(chunk => ({
          content: chunk.content,
          score: chunk.score,
          coordinate: chunk.bimba_coordinates ? chunk.bimba_coordinates.join(', ') : 'unknown',
          source: 'lightrag-chunk',
          id: chunk.id,
          documentId: chunk.full_doc_id,
          filePath: chunk.file_path,
          bimbaCoordinates: chunk.bimba_coordinates || [],
          metadata: chunk.metadata
        }));
      }

      // Handle direct chunks array (fallback)
      if (Array.isArray(lightragData.chunks)) {
        return lightragData.chunks.map(chunk => ({
          content: chunk.content || 'No content available',
          score: chunk.score || 0.0,
          coordinate: chunk.bimba_coordinates ? chunk.bimba_coordinates.join(', ') : 'unknown',
          source: 'lightrag-chunk-direct',
          id: chunk.id,
          bimbaCoordinates: chunk.bimba_coordinates || []
        }));
      }

      // Handle legacy fused context format (fallback)
      if (lightragData.fused_context) {
        return [{
          content: lightragData.fused_context,
          score: 1.0,
          coordinate: 'mixed',
          source: 'lightrag-fused'
        }];
      }

      console.warn('[UnifiedRAG] Unexpected LightRAG response format:', lightragData);
      return [];
    } catch (error) {
      console.warn('[UnifiedRAG] Failed to parse LightRAG semantic context:', error);
      return [];
    }
  }

  /**
   * Extract dynamic context from Graphiti results
   * @private
   */
  _extractDynamicContext(graphitiData) {
    // Extract dynamic memory information from Graphiti
    try {
      let parsed = graphitiData;

      // Handle BPMCP tool response format
      if (graphitiData.content && Array.isArray(graphitiData.content)) {
        const textContent = graphitiData.content[0]?.text;
        if (textContent) {
          parsed = JSON.parse(textContent);
        }
      } else if (typeof graphitiData === 'string') {
        parsed = JSON.parse(graphitiData);
      }

      // Extract from Graphiti context structure
      if (parsed.context) {
        return {
          entities: parsed.context.entities || [],
          facts: parsed.context.facts || [],
          episodes: parsed.context.episodes || [],
          relationships: parsed.context.relationships || [],
          relatedCoordinates: parsed.context.relatedCoordinates || [],
          summary: parsed.summary || {}
        };
      }

      // Fallback for direct structure
      return {
        entities: parsed.entities || [],
        facts: parsed.facts || [],
        episodes: parsed.episodes || [],
        relationships: parsed.relationships || [],
        relatedCoordinates: parsed.relatedCoordinates || [],
        summary: parsed.summary || {}
      };
    } catch (error) {
      console.warn('[UnifiedRAG] Failed to parse Graphiti dynamic context:', error);
      return {
        entities: [],
        facts: [],
        episodes: [],
        relationships: [],
        relatedCoordinates: [],
        summary: {}
      };
    }
  }

  /**
   * Extract crystallized knowledge from Notion results
   * @private
   */
  _extractNotionContext(notionData) {
    // Extract Notion page information with coordinate resolution
    try {
      let parsed = notionData;

      // Handle BPMCP tool response format
      if (notionData.content && Array.isArray(notionData.content)) {
        const textContent = notionData.content[0]?.text;
        if (textContent) {
          parsed = JSON.parse(textContent);
        }
      } else if (typeof notionData === 'string') {
        parsed = JSON.parse(notionData);
      }

      // Handle enhanced Notion data structure from coordinate resolution
      if (parsed.results) {
        return parsed.results.map(page => ({
          title: page.properties?.title?.title?.[0]?.text?.content || page.title || 'Untitled',
          url: page.url,
          pageId: page.id || page.pageId,
          coordinate: page.coordinate,
          properties: page.properties,
          content: page.content,
          created_time: page.created_time,
          last_edited_time: page.last_edited_time
        }));
      }

      // Handle direct page data (from coordinate resolution)
      if (parsed.id || parsed.pageId) {
        return [{
          title: parsed.properties?.title?.title?.[0]?.text?.content || parsed.title || 'Untitled',
          url: parsed.url,
          pageId: parsed.id || parsed.pageId,
          coordinate: parsed.coordinate,
          properties: parsed.properties,
          content: parsed.content,
          created_time: parsed.created_time,
          last_edited_time: parsed.last_edited_time
        }];
      }

      return [];
    } catch (error) {
      console.warn('[UnifiedRAG] Failed to parse Notion context:', error);
      return [];
    }
  }

  /**
   * Generate context summary
   * @private
   */
  _generateContextSummary(synthesis, query, coordinates) {
    const parts = [];

    if (synthesis.structuralContext) {
      parts.push(`Structural context for ${coordinates.join(', ')} with ${synthesis.structuralContext.totalResults} related nodes`);
    }

    if (synthesis.semanticRelevance.length > 0) {
      parts.push(`${synthesis.semanticRelevance.length} semantically relevant documents`);
    }

    if (synthesis.dynamicMemory.entities?.length > 0) {
      parts.push(`${synthesis.dynamicMemory.entities.length} dynamic entities in memory`);
    }

    if (synthesis.crystallizedKnowledge.length > 0) {
      parts.push(`${synthesis.crystallizedKnowledge.length} crystallized knowledge pages`);
    }

    return `Unified context for "${query}": ${parts.join(', ')}`;
  }

  /**
   * Extract key insights across all sources
   * @private
   */
  _extractKeyInsights(synthesis) {
    const insights = [];

    // Add structural insights
    if (synthesis.structuralContext?.branchDistribution) {
      const branches = Object.keys(synthesis.structuralContext.branchDistribution);
      insights.push(`Active in ${branches.length} coordinate branches: ${branches.join(', ')}`);
    }

    // Add semantic insights
    if (synthesis.semanticRelevance.length > 0) {
      const avgScore = synthesis.semanticRelevance.reduce((sum, item) => sum + (item.score || 0), 0) / synthesis.semanticRelevance.length;
      insights.push(`Average semantic relevance: ${avgScore.toFixed(2)}`);
    }

    return insights;
  }

  /**
   * Generate recommendations for next actions
   * @private
   */
  _generateRecommendations(synthesis, coordinates) {
    const recommendations = [];

    // Recommend coordinate exploration
    if (synthesis.structuralContext?.branchDistribution) {
      const branches = Object.keys(synthesis.structuralContext.branchDistribution);
      if (branches.length > 1) {
        recommendations.push(`Consider exploring related branches: ${branches.slice(1).join(', ')}`);
      }
    }

    // Recommend deeper semantic search
    if (synthesis.semanticRelevance.length > 0) {
      recommendations.push('Consider refining query for more specific semantic matches');
    }

    return recommendations;
  }

  /**
   * Extract all coordinates covered in the unified context
   * @private
   */
  _extractCoordinatesCovered(unifiedContext) {
    const coordinates = new Set();

    // Add coordinates from each source
    Object.values(unifiedContext.sources).forEach(source => {
      if (source.coordinatesFocused) {
        source.coordinatesFocused.forEach(coord => coordinates.add(coord));
      }
    });

    return Array.from(coordinates);
  }

  /**
   * Chained LLM synthesis - separate LLM call for each RAG layer
   * @private
   */
  async _chainedRAGSynthesis(unifiedContext, query, coordinates) {
    const logPrefix = `[UnifiedRAG:ChainedSynthesis]`;
    console.log(`${logPrefix} Processing each RAG layer separately...`);

    try {
      // Import LLM
      const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
      const { HumanMessage } = await import('@langchain/core/messages');

      // Initialize synthesis LLM
      const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
      const synthesisModelName = process.env[activeModelVarName] || 'gemini-pro';

      const synthesisLLM = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: synthesisModelName,
        temperature: 0.1
        // NO TOKEN LIMITS - let the LLM generate complete responses
      });

      // DIRECT DATA EXTRACTION - No LLM interpretation, use structured data directly
      const bimbaAnalysis = this._extractBimbaData(unifiedContext.sources.bimba, coordinates);
      const graphitiAnalysis = this._extractGraphitiData(unifiedContext.sources.graphiti, coordinates);
      const lightragAnalysis = this._extractLightRAGData(unifiedContext.sources.lightrag, coordinates);

      // Only use LLM for final harmonization with all the rich data
      const finalSynthesis = await this._harmonizeLayers(synthesisLLM, HumanMessage, bimbaAnalysis, graphitiAnalysis, lightragAnalysis, query, coordinates);

      return finalSynthesis;
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        structuralFoundation: { coordinate: coordinates[0] || 'unknown' },
        relationships: { siblings: [] },
        documentContent: { content: 'Synthesis failed' },
        synthesis: 'Chained synthesis failed: ' + error.message
      };
    }
  }

  /**
   * Immediate synthesis of Graphiti data using actual structure
   * @private
   */
  _synthesizeGraphitiImmediate(graphitiSource) {
    const logPrefix = `[UnifiedRAG:GraphitiSynthesis]`;
    console.log(`${logPrefix} Synthesizing Graphiti data immediately`);

    if (!graphitiSource?.data) {
      return { error: 'No Graphiti data available' };
    }

    const data = graphitiSource.data;
    return {
      coordinate: data.coordinate || 'unknown',
      relatedCoordinates: data.context?.relatedCoordinates || [],
      totalEntities: data.summary?.totalEntities || 0,
      totalFacts: data.summary?.totalFacts || 0,
      totalEpisodes: data.summary?.totalEpisodes || 0,
      entities: data.context?.entities || [],
      facts: data.context?.facts || [],
      episodes: data.context?.episodes || [],
      contextDepth: data.contextDepth || 0,
      includeRelated: data.includeRelated || false
    };
  }

  /**
   * Immediate synthesis of Bimba data using actual Neo4j structure
   * @private
   */
  async _synthesizeBimbaImmediate(bimbaSource) {
    const logPrefix = `[UnifiedRAG:BimbaSynthesis]`;
    console.log(`${logPrefix} Using LLM to synthesize raw Neo4j data into structural context`);

    if (!bimbaSource?.data) {
      return { error: 'No Bimba data available' };
    }

    const data = bimbaSource.data;
    console.log(`${logPrefix} Raw Bimba data size:`, JSON.stringify(data).length, 'characters');

    // USE LLM TO SYNTHESIZE RAW NEO4J DATA INTO STRUCTURAL CONTEXT
    try {
      const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
      const { HumanMessage } = await import('@langchain/core/messages');

      const synthesisLLM = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: 'gemini-2.0-flash',
        temperature: 0.1
      });

      // Handle combined data structure from multiple Bimba sources
      let dataToAnalyze = data;
      if (data.sources && data.combinedData) {
        console.log(`${logPrefix} === LLM SYNTHESIS INPUT PROCESSING ===`);
        console.log(`${logPrefix} Processing combined data from ${data.sources.length} Bimba sources`);
        console.log(`${logPrefix} Source types:`, data.sources.map(s => s.source));
        console.log(`${logPrefix} Combined data array length:`, data.combinedData.length);

        data.combinedData.forEach((sourceData, i) => {
          console.log(`${logPrefix} Source ${i+1} data keys:`, Object.keys(sourceData || {}));
          console.log(`${logPrefix} Source ${i+1} data size:`, JSON.stringify(sourceData).length, 'characters');
        });

        dataToAnalyze = {
          combinedSources: data.sources.length,
          sourceTypes: data.sources.map(s => s.source),
          allData: data.combinedData
        };

        console.log(`${logPrefix} Final dataToAnalyze structure:`, Object.keys(dataToAnalyze));
        console.log(`${logPrefix} Total data size for LLM:`, JSON.stringify(dataToAnalyze).length, 'characters');
      } else {
        console.log(`${logPrefix} === SINGLE SOURCE DATA ===`);
        console.log(`${logPrefix} Data keys:`, Object.keys(data || {}));
        console.log(`${logPrefix} Data size:`, JSON.stringify(data).length, 'characters');
      }

      const synthesisPrompt = `Analyze this comprehensive Neo4j Bimba data and extract ONLY the actual structural information found in the data:

${JSON.stringify(dataToAnalyze, null, 2)}

CRITICAL INSTRUCTIONS:
- DO NOT make up or infer coordinate mappings that aren't explicitly in the data
- DO NOT create hardcoded QL position assignments
- ONLY use the actual node properties, names, and relationships found in the Neo4j data
- Focus on the ACTUAL coordinate being queried and its REAL relationships

Extract and summarize:
1. The target coordinate's ACTUAL properties from the data (name, qlPosition, qlOperatorTypes, contextFrame, qlCategory)
2. The ACTUAL parent coordinate and its properties
3. The ACTUAL sibling coordinates found in the data and their real names/properties
4. The ACTUAL structural relationships and hierarchy present in the data
5. Any ACTUAL QL patterns or coordinate structures explicitly present

Return ONLY what is actually present in the data - no speculation, no hardcoded mappings, no invented relationships.`;

      console.log(`${logPrefix} Sending prompt to LLM (${synthesisPrompt.length} characters)...`);
      const response = await synthesisLLM.invoke([new HumanMessage(synthesisPrompt)]);
      const structuralContext = response.content;

      console.log(`${logPrefix} === LLM SYNTHESIS RESPONSE ===`);
      console.log(`${logPrefix} Response type:`, typeof structuralContext);
      console.log(`${logPrefix} Response length:`, structuralContext?.length || 0, 'characters');
      console.log(`${logPrefix} First 500 chars of response:`, structuralContext?.substring(0, 500) + '...');
      console.log(`${logPrefix} Last 200 chars of response:`, structuralContext?.substring(-200));

      const result = {
        structuralContext: structuralContext,
        rawDataSize: JSON.stringify(data).length,
        synthesisMethod: 'LLM',
        timestamp: new Date().toISOString()
      };

      console.log(`${logPrefix} Final synthesis result keys:`, Object.keys(result));
      console.log(`${logPrefix} === END LLM SYNTHESIS ===`);

      return result;

    } catch (error) {
      console.error(`${logPrefix} LLM synthesis failed:`, error);
      // Fallback to basic text summary
      return {
        structuralContext: `Raw Neo4j data available (${JSON.stringify(data).length} characters) but LLM synthesis failed: ${error.message}`,
        rawDataSize: JSON.stringify(data).length,
        synthesisMethod: 'fallback',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Synthesize Neo4j Bimba data into readable structural context
   * @private
   */
  _synthesizeBimbaStructuralContext(data) {
    const logPrefix = `[UnifiedRAG:BimbaContextSynthesis]`;
    console.log(`${logPrefix} Synthesizing Neo4j data into structural context`);

    let context = '';

    // Process the actual Neo4j content
    if (data.content && Array.isArray(data.content)) {
      context += `## Bimba Structural Analysis\n\n`;
      context += `**Nodes Retrieved**: ${data.content.length}\n`;
      context += `**Target Coordinate**: ${data.coordinatesFocused?.join(', ') || 'Unknown'}\n`;
      context += `**Parent Coordinate**: ${data.parentCoordinate || 'Unknown'}\n\n`;

      // Analyze each node for structural information
      const nodeAnalysis = data.content.map((node, index) => {
        let nodeContext = `### Node ${index + 1}: ${node.bimbaCoordinate || 'Unknown Coordinate'}\n`;

        if (node.properties) {
          nodeContext += `**Properties**:\n`;
          Object.entries(node.properties).forEach(([key, value]) => {
            nodeContext += `- ${key}: ${value}\n`;
          });
        }

        if (node.labels && node.labels.length > 0) {
          nodeContext += `**Labels**: ${node.labels.join(', ')}\n`;
        }

        return nodeContext;
      }).join('\n');

      context += nodeAnalysis;

      // Analyze coordinate patterns
      const coordinates = data.content.map(node => node.bimbaCoordinate).filter(Boolean);
      if (coordinates.length > 0) {
        context += `\n## Coordinate Pattern Analysis\n`;
        context += `**Coordinates Found**: ${coordinates.join(', ')}\n`;

        // Identify parent-child relationships
        const parentCoords = coordinates.filter(coord => !coord.includes('-'));
        const childCoords = coordinates.filter(coord => coord.includes('-'));

        if (parentCoords.length > 0) {
          context += `**Parent Coordinates**: ${parentCoords.join(', ')}\n`;
        }
        if (childCoords.length > 0) {
          context += `**Child Coordinates**: ${childCoords.join(', ')}\n`;
        }

        // Identify 6-fold patterns
        const sixFoldGroups = {};
        childCoords.forEach(coord => {
          const parent = coord.split('-')[0];
          if (!sixFoldGroups[parent]) sixFoldGroups[parent] = [];
          sixFoldGroups[parent].push(coord);
        });

        Object.entries(sixFoldGroups).forEach(([parent, children]) => {
          context += `**${parent} 6-fold Structure**: ${children.join(', ')} (${children.length}/6 positions)\n`;
        });
      }
    } else {
      context = `## Bimba Structural Analysis\n\nNo detailed structural data available in the expected format.\n`;
      context += `**Raw Data Keys**: ${Object.keys(data).join(', ')}\n`;
    }

    return context;
  }

  /**
   * Extract structural patterns from actual Bimba data
   * @private
   */
  _extractStructuralPatterns(data) {
    const patterns = {
      nodeCount: 0,
      coordinateTypes: [],
      relationships: [],
      properties: []
    };

    // Analyze the actual data structure to find patterns
    if (data.content && Array.isArray(data.content)) {
      patterns.nodeCount = data.content.length;
      // Extract coordinate types and properties from actual nodes
      data.content.forEach(item => {
        if (item.bimbaCoordinate) {
          patterns.coordinateTypes.push(item.bimbaCoordinate);
        }
        if (item.properties) {
          Object.keys(item.properties).forEach(prop => {
            if (!patterns.properties.includes(prop)) {
              patterns.properties.push(prop);
            }
          });
        }
      });
    }

    return patterns;
  }

  /**
   * Immediate synthesis of LightRAG data using actual document structure
   * @private
   */
  _synthesizeLightRAGImmediate(lightragSource) {
    const logPrefix = `[UnifiedRAG:LightRAGSynthesis]`;
    console.log(`${logPrefix} Synthesizing LightRAG data immediately using actual document structure`);

    if (!lightragSource?.data) {
      return { error: 'No LightRAG data available' };
    }

    const data = lightragSource.data;
    const available = !!(data.fused_context && !data.fused_context.includes('no-context'));

    return {
      available: available,
      fusedContext: data.fused_context || '',
      lightragRawResult: data.lightrag_raw_result || '',
      status: data.status || 'unknown',
      documentIds: lightragSource.documentIds || [],
      queryUsed: lightragSource.queryUsed || '',
      mode: lightragSource.mode || 'unknown',
      // Extract key content themes from the actual document
      contentAnalysis: available ? this._analyzeDocumentContent(data.fused_context) : null
    };
  }

  /**
   * Analyze actual document content for key themes
   * @private
   */
  _analyzeDocumentContent(content) {
    if (!content || content.includes('no-context')) {
      return null;
    }

    return {
      length: content.length,
      hasQuaternaryLogic: content.toLowerCase().includes('quaternary logic'),
      hasEpiLogos: content.toLowerCase().includes('epi-logos'),
      hasStructuralInfo: content.toLowerCase().includes('structure') || content.toLowerCase().includes('framework'),
      hasMathematical: content.toLowerCase().includes('mathematical') || content.toLowerCase().includes('geometric'),
      keyTerms: this._extractKeyTerms(content)
    };
  }

  /**
   * Extract key terms from document content
   * @private
   */
  _extractKeyTerms(content) {
    const terms = [];
    const patterns = [
      /quaternary logic/gi,
      /epi-logos/gi,
      /tetradic/gi,
      /four-fold/gi,
      /6-fold/gi,
      /vortex mathematics/gi,
      /double-covering/gi,
      /recursive/gi
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        terms.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(terms)]; // Remove duplicates
  }

  /**
   * Harmonize immediate syntheses without LLM complexity
   * @private
   */
  _harmonizeImmediateSyntheses(graphitiSynthesis, bimbaSynthesis, lightragSynthesis, query, coordinates) {
    const logPrefix = `[UnifiedRAG:ImmediateHarmonization]`;
    console.log(`${logPrefix} Harmonizing immediate syntheses`);

    return {
      structuralFoundation: {
        coordinate: coordinates[0] || 'unknown',
        bimbaData: bimbaSynthesis || { error: 'No Bimba synthesis' },
        structuralPatterns: bimbaSynthesis?.structuralPatterns || null
      },
      relationships: {
        graphitiData: graphitiSynthesis || { error: 'No Graphiti synthesis' },
        relatedCoordinates: graphitiSynthesis?.relatedCoordinates || []
      },
      documentContent: {
        lightragData: lightragSynthesis || { error: 'No LightRAG synthesis' },
        available: lightragSynthesis?.available || false,
        contentAnalysis: lightragSynthesis?.contentAnalysis || null
      },
      synthesis: `Coordinate ${coordinates[0]} analysis: ${bimbaSynthesis?.structuralContext ? 'Rich Bimba structural context synthesized' : 'No Bimba context'}, ${graphitiSynthesis?.relatedCoordinates?.length || 0} related coordinates from Graphiti, ${lightragSynthesis?.available ? 'document content available' : 'no document content'}`
    };
  }

  /**
   * Extract Bimba data directly without LLM interpretation (DEPRECATED)
   * @private
   */
  _extractBimbaData(bimbaSource, coordinates) {
    const logPrefix = `[UnifiedRAG:BimbaExtract]`;

    if (!bimbaSource?.data) {
      console.log(`${logPrefix} No Bimba data available`);
      return { coordinate: coordinates[0], error: 'No Bimba data' };
    }

    const data = bimbaSource.data;
    console.log(`${logPrefix} Extracting rich structural data directly`);

    return {
      coordinate: coordinates[0],
      rawBimbaData: data, // Include ALL the rich data
      coordinatesFocused: data.coordinatesFocused || [],
      parentCoordinate: data.parentCoordinate || null,
      qlAware: data.qlAware || false,
      agentCoordinate: data.agentCoordinate || null,
      timestamp: data.timestamp || null,
      // Extract any nested structural information
      structuralContext: data.content || data.results || data.organizedByBranch || null
    };
  }

  /**
   * Extract Graphiti data directly without LLM interpretation
   * @private
   */
  _extractGraphitiData(graphitiSource, coordinates) {
    const logPrefix = `[UnifiedRAG:GraphitiExtract]`;

    if (!graphitiSource?.data) {
      console.log(`${logPrefix} No Graphiti data available`);
      return { coordinate: coordinates[0], error: 'No Graphiti data' };
    }

    const data = graphitiSource.data;
    console.log(`${logPrefix} Extracting relationship data directly`);

    return {
      coordinate: coordinates[0],
      rawGraphitiData: data, // Include ALL the relationship data
      relatedCoordinates: data.context?.relatedCoordinates || [],
      totalEntities: data.summary?.totalEntities || 0,
      totalFacts: data.summary?.totalFacts || 0,
      totalEpisodes: data.summary?.totalEpisodes || 0,
      contextDepth: data.contextDepth || 0,
      entities: data.context?.entities || [],
      facts: data.context?.facts || [],
      episodes: data.context?.episodes || []
    };
  }

  /**
   * Extract LightRAG data directly without LLM interpretation
   * @private
   */
  _extractLightRAGData(lightragSource, coordinates) {
    const logPrefix = `[UnifiedRAG:LightRAGExtract]`;

    if (!lightragSource?.data) {
      console.log(`${logPrefix} No LightRAG data available`);
      return { coordinate: coordinates[0], error: 'No LightRAG data' };
    }

    const data = lightragSource.data;
    console.log(`${logPrefix} Extracting document content directly`);

    return {
      coordinate: coordinates[0],
      rawLightRAGData: data, // Include ALL the document data
      fusedContext: data.fused_context || '',
      lightragRawResult: data.lightrag_raw_result || '',
      status: data.status || 'unknown',
      documentIds: lightragSource.documentIds || [],
      queryUsed: lightragSource.queryUsed || '',
      mode: lightragSource.mode || 'unknown',
      available: !!(data.fused_context && !data.fused_context.includes('no-context'))
    };
  }

  /**
   * Process Bimba structural layer separately (DEPRECATED - replaced by direct extraction)
   * @private
   */
  async _processBimbaLayer(llm, HumanMessage, bimbaSource, coordinates) {
    const prompt = `You are extracting structural information from Bimba data for coordinate ${coordinates.join(', ')}.

The data contains rich structural information about coordinate hierarchies and properties. Extract the key structural elements and present them clearly.

BIMBA DATA:
${JSON.stringify(bimbaSource?.data || {}, null, 2)}

Extract the structural foundation. Return valid JSON only:
{
  "coordinate": "${coordinates[0]}",
  "structuralSummary": "Brief summary of the coordinate's structural role",
  "parentCoordinate": "Parent coordinate if available",
  "hierarchicalContext": "Description of the 6-fold structure and relationships",
  "keyProperties": "Main structural properties found in the data"
}`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    try {
      let content = response.content;
      console.log(`[UnifiedRAG:BimbaLayer] Raw LLM response:`, content);

      // Clean up markdown and extract JSON
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }

      // Extract JSON from response - handle incomplete JSON
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }

      console.log(`[UnifiedRAG:BimbaLayer] Cleaned content for parsing:`, content);
      const parsed = JSON.parse(content);
      console.log(`[UnifiedRAG:BimbaLayer] Successfully parsed:`, parsed);
      return parsed;
    } catch (e) {
      console.error(`[UnifiedRAG:BimbaLayer] JSON parsing failed:`, e.message);
      console.error(`[UnifiedRAG:BimbaLayer] Content that failed:`, response.content);
      return { coordinate: coordinates[0], error: 'Failed to parse Bimba analysis: ' + e.message };
    }
  }

  /**
   * Process Graphiti relationships layer separately
   * @private
   */
  async _processGraphitiLayer(llm, HumanMessage, graphitiSource, coordinates) {
    const prompt = `Extract relationship information from this Graphiti data for coordinate ${coordinates.join(', ')}:

${JSON.stringify(graphitiSource?.data || {}, null, 2)}

Extract ONLY the relationships. Return JSON:
{
  "siblings": "array of related coordinates",
  "structure": "6-fold pattern description"
}`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    try {
      let content = response.content;
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      return JSON.parse(content);
    } catch (e) {
      return { siblings: [], error: 'Failed to parse Graphiti analysis' };
    }
  }

  /**
   * Process LightRAG content layer separately
   * @private
   */
  async _processLightRAGLayer(llm, HumanMessage, lightragSource, coordinates) {
    const prompt = `You are extracting document content from LightRAG data for coordinate ${coordinates.join(', ')}.

LIGHTRAG DATA:
${JSON.stringify(lightragSource?.data || {}, null, 2)}

Extract the document content. Return valid JSON only:
{
  "available": true,
  "contentSummary": "Brief summary of the main document content",
  "keyTopics": "Main topics covered in the document",
  "relevantDetails": "Key details relevant to Quaternary Logic"
}`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    try {
      let content = response.content;
      console.log(`[UnifiedRAG:LightRAGLayer] Raw LLM response:`, content);

      // Clean up markdown and extract JSON
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }

      // Extract JSON from response - handle incomplete JSON
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }

      console.log(`[UnifiedRAG:LightRAGLayer] Cleaned content for parsing:`, content);
      const parsed = JSON.parse(content);
      console.log(`[UnifiedRAG:LightRAGLayer] Successfully parsed:`, parsed);
      return parsed;
    } catch (e) {
      console.error(`[UnifiedRAG:LightRAGLayer] JSON parsing failed:`, e.message);
      console.error(`[UnifiedRAG:LightRAGLayer] Content that failed:`, response.content);
      return { content: 'Failed to parse LightRAG content: ' + e.message, available: false };
    }
  }

  /**
   * Harmonize all processed layers
   * @private
   */
  async _harmonizeLayers(llm, HumanMessage, bimbaAnalysis, graphitiAnalysis, lightragAnalysis, query, coordinates) {
    const prompt = `Harmonize these processed RAG layers for coordinate ${coordinates.join(', ')} in response to: "${query}"

BIMBA STRUCTURAL ANALYSIS: ${JSON.stringify(bimbaAnalysis, null, 2)}
GRAPHITI RELATIONSHIPS: ${JSON.stringify(graphitiAnalysis, null, 2)}
LIGHTRAG CONTENT ANALYSIS: ${JSON.stringify(lightragAnalysis, null, 2)}

HARMONIZATION INSTRUCTIONS:
1. **Structural Foundation**: Use the Bimba analysis as the primary structural context
2. **Relationship Context**: Integrate the Graphiti relationships to show coordinate connections
3. **Content Integration**: Place the LightRAG content within the structural framework
4. **Synthesis**: Show how the coordinate's structural position relates to the document content
5. **Query Relevance**: Connect everything back to the original query

Create comprehensive synthesis. Return JSON:
{
  "structuralFoundation": {
    "coordinate": "coordinate from Bimba analysis",
    "qlPosition": "QL position and meaning",
    "structuralRole": "role within the 6-fold structure",
    "properties": "key structural properties",
    "hierarchicalContext": "parent/child relationships"
  },
  "relationships": {
    "siblings": "sibling coordinates from Graphiti",
    "sixFoldPattern": "how this fits in the 6-fold QL structure",
    "relatedCoordinates": "related coordinates and their roles"
  },
  "documentContent": {
    "available": "boolean from LightRAG analysis",
    "mainContent": "primary document content",
    "keyConcepts": "key concepts from content analysis",
    "structuralRelevance": "how content relates to coordinate's structural role"
  },
  "synthesis": "comprehensive integration showing how the coordinate's structural position, relationships, and associated content work together to address the query",
  "queryResponse": "direct response to the original query using all integrated layers"
}`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    try {
      let content = response.content;
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      return JSON.parse(content);
    } catch (e) {
      return {
        structuralFoundation: bimbaAnalysis,
        relationships: graphitiAnalysis,
        documentContent: lightragAnalysis,
        synthesis: 'Harmonization failed but individual layers processed'
      };
    }
  }

  /**
   * Intelligent LLM synthesis of RAG layers (DEPRECATED - replaced by chained synthesis)
   * @private
   */
  async _intelligentRAGSynthesis(unifiedContext, query, coordinates) {
    const logPrefix = `[UnifiedRAG:Synthesis]`;
    console.log(`${logPrefix} Synthesizing RAG layers with LLM...`);

    try {
      // Import LLM - use exact same pattern as epii-agent.service.mjs
      const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
      const { HumanMessage } = await import('@langchain/core/messages');

      // Initialize synthesis LLM - EXACT same pattern as epii agent
      const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
      const synthesisModelName = process.env[activeModelVarName] || 'gemini-pro';

      const synthesisLLM = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: synthesisModelName,
        temperature: 0.1
        // NO TOKEN LIMITS - let the LLM generate complete responses
      });

      console.log(`${logPrefix} Initialized synthesis LLM with model: ${synthesisModelName}`);

      // Build synthesis prompt - SIMPLE LAYER PRIORITIES
      const synthesisPrompt = `# UNIFIED RAG SYNTHESIS

Synthesize these RAG layers for coordinate ${coordinates.join(', ')}:

## LAYER 1: BIMBA STRUCTURAL FOUNDATION (PRIMARY)
${JSON.stringify(unifiedContext.sources.bimba?.data || {}, null, 2)}

## LAYER 2: GRAPHITI RELATIONSHIPS
${JSON.stringify(unifiedContext.sources.graphiti?.data || {}, null, 2)}

## LAYER 3: LIGHTRAG DOCUMENT CONTENT
${JSON.stringify(unifiedContext.sources.lightrag?.data || {}, null, 2)}

## SYNTHESIS INSTRUCTIONS:
1. **Start with Layer 1** - Extract the coordinate's structural position and properties
2. **Add Layer 2** - Map the coordinate relationships
3. **Contextualize Layer 3** - Place document content within the structural framework

## OUTPUT JSON:
{
  "structuralFoundation": {
    "coordinate": "${coordinates[0] || 'unknown'}",
    "position": "Extract from Bimba data",
    "properties": "Extract key properties from Bimba data"
  },
  "relationships": {
    "siblings": "Extract from Graphiti data",
    "structure": "6-fold QL pattern"
  },
  "documentContent": {
    "content": "LightRAG document content",
    "context": "How it relates to the structural position"
  },
  "synthesis": "How all layers work together"
}`;

      // Call synthesis LLM
      const response = await synthesisLLM.invoke([new HumanMessage(synthesisPrompt)]);

      // Parse JSON response - HANDLE MARKDOWN CODE BLOCKS
      let synthesis;
      try {
        let jsonContent = response.content;

        // Remove markdown code blocks if present
        if (jsonContent.includes('```json')) {
          jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```/g, '');
        }

        synthesis = JSON.parse(jsonContent);
        console.log(`${logPrefix} LLM synthesis successful`);
      } catch (parseError) {
        console.warn(`${logPrefix} Failed to parse LLM response as JSON:`, parseError.message);
        console.warn(`${logPrefix} Raw response:`, response.content);
        synthesis = {
          structuralFoundation: { coordinate: coordinates[0] || 'unknown' },
          coordinateRelationships: { siblings: [] },
          semanticContent: { available: false },
          synthesizedInsights: ['LLM synthesis parsing failed: ' + parseError.message],
          contextualSummary: response.content.substring(0, 500)
        };
      }

      return synthesis;
    } catch (error) {
      console.error(`${logPrefix} Error:`, error);
      return {
        structuralFoundation: { coordinate: coordinates[0] || 'unknown' },
        coordinateRelationships: { siblings: [] },
        semanticContent: { available: false },
        synthesizedInsights: ['Synthesis failed: ' + error.message],
        contextualSummary: 'Failed to synthesize RAG layers'
      };
    }
  }

  /**
   * Format unified context for chat consumption
   * Returns synthesis in the format expected by chat
   * @param {Object} unifiedContext - The unified context from execute()
   * @returns {Object} - Synthesis formatted for chat consumption
   */
  formatForChat(unifiedContext) {
    console.log('[UnifiedRAG] formatForChat: Returning synthesis in expected format');

    // Return synthesis in the format expected by EpiiChat
    return {
      synthesis: unifiedContext.synthesis,
      sources: unifiedContext.sources,
      coordinates: unifiedContext.metadata.coordinatesCovered,
      executionTime: unifiedContext.metadata.executionTime,
      metadata: unifiedContext.metadata,
      timestamp: unifiedContext.timestamp
    };
  }

  /**
   * Execute UnifiedRAG and return chat-formatted result
   * Convenience method for chat skills
   * @param {Object} params - Same as execute() params
   * @returns {Promise<Object>} - Chat-formatted RAG package
   */
  async executeForChat(params) {
    const result = await this.execute(params);

    if (result.success) {
      return {
        success: true,
        data: this.formatForChat(result.data),
        skillId: this.skillId,
        executionTime: result.executionTime
      };
    } else {
      return result; // Return error as-is
    }
  }

  /**
   * Generate cache key for coordinate-based caching
   * @private
   */
  _generateCacheKey(query, coordinates, sources) {
    const coordKey = coordinates.sort().join(',') || 'no-coords';
    const sourceKey = Object.keys(sources).filter(k => sources[k]).sort().join(',');
    const queryHash = query.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
    return `${coordKey}:${sourceKey}:${queryHash}`;
  }

  /**
   * Get cached result if valid
   * @private
   */
  _getCachedResult(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(cacheKey); // Remove expired cache
    }
    return null;
  }

  /**
   * Set cached result
   * @private
   */
  _setCachedResult(cacheKey, data) {
    this.cache.set(cacheKey, {
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      timestamp: Date.now()
    });

    // Clean up old cache entries (keep max 50 entries)
    if (this.cache.size > 50) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
    };
  }

  /**
   * Clear cache (useful for testing or when documents are updated)
   */
  clearCache() {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Get skill metadata for registration
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: this.name,
      description: this.description,
      bimbaCoordinate: this.bimbaCoordinate,
      version: this.version,
      agentId: 'universal',
      inputSchema: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', description: 'Natural language query' },
          coordinates: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Bimba coordinate(s) to focus on'
          },
          sources: {
            type: 'object',
            properties: {
              bimba: { type: 'boolean', default: true },
              lightrag: { type: 'boolean', default: true },
              graphiti: { type: 'boolean', default: true },
              notion: { type: 'boolean', default: true }
            }
          },
          options: { type: 'object', description: 'Source-specific options' },
          agentCoordinate: { type: 'string', description: 'Calling agent coordinate' },
          uiContext: { type: 'object', description: 'UI context from AG-UI protocol' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          skillId: { type: 'string' },
          executionTime: { type: 'number' }
        }
      },
      qlMetadata: {
        qlPosition: 0,
        contextFrame: '(0-5)',
        qlMode: 'universal'
      }
    };
  }
}

module.exports = UnifiedRAGSkill;
