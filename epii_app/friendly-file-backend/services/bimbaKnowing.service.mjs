/**
 * Enhanced BimbaKnowing Service
 *
 * This service extends the functionality of the BimbaKnowing tool from the
 * Bimba-Pratibimba MCP server to leverage the enhanced Quaternal Logic (QL) schema.
 * It provides methods for generating QL-aware Cypher queries and processing results.
 */

import bpMCPService from './bpMCPService.mjs';

/**
 * BimbaKnowing service for QL-aware knowledge retrieval
 */
class BimbaKnowingService {
  /**
   * Query the Bimba knowledge graph with QL awareness
   * @param {Object} params - Query parameters
   * @param {string} params.query - Natural language query
   * @param {number} [params.contextDepth=2] - Depth of graph traversal
   * @param {string} [params.focusCoordinate] - Optional coordinate to focus on
   * @param {boolean} [params.includeRelations=true] - Whether to include relationships
   * @returns {Promise<Object>} - Query results
   */
  async queryWithQLAwareness(params) {
    const { query, contextDepth = 2, focusCoordinate, includeRelations = true } = params;

    // Check if the query is QL-specific
    const isQLQuery = this.isQLSpecificQuery(query);

    // Generate enhanced Cypher query if needed
    if (isQLQuery) {
      // For QL-specific queries, we'll use our enhanced query
      const enhancedQuery = this.generateEnhancedQuery(params);

      // Execute the query directly through bpMCPService
      const result = await bpMCPService.queryBimbaGraph(enhancedQuery.query, enhancedQuery.params);

      // Process the result
      return this.processQLQueryResult(result, params);
    } else {
      // For regular queries, use the standard BimbaKnowing tool
      return bpMCPService.bimbaKnowing(
        query,
        contextDepth,
        focusCoordinate,
        params.agentCoordinate,
        params.limit || 10
      );
    }
  }

  /**
   * Check if a query is specifically about Quaternal Logic
   * @param {string} query - The query to check
   * @returns {boolean} - Whether the query is QL-specific
   */
  isQLSpecificQuery(query) {
    const qlKeywords = [
      'quaternal logic', 'ql', 'ql operator', 'ql dynamic',
      'structural operator', 'processual operator', 'contextual operator',
      'implicate', 'explicate', 'ql position', 'ql category'
    ];

    const normalizedQuery = query.toLowerCase();
    return qlKeywords.some(keyword => normalizedQuery.includes(keyword));
  }

  /**
   * Generate an enhanced Cypher query that leverages the QL schema
   * @param {Object} params - Query parameters
   * @returns {Object} - Query and parameters
   */
  generateEnhancedQuery(params) {
    const { query, contextDepth = 2, focusCoordinate, includeRelations = true } = params;

    // Base query parameters
    const queryParams = {
      focusCoordinate: focusCoordinate || null
    };

    // Start building the query
    let cypherQuery = '';

    // If we have a focus coordinate, start with that node
    if (focusCoordinate) {
      cypherQuery = `
        // Start with the focus coordinate
        MATCH (n)
        WHERE n.bimbaCoordinate = $focusCoordinate
      `;
    } else {
      // Otherwise, find nodes with QL properties
      cypherQuery = `
        // Find nodes with QL properties
        MATCH (n)
        WHERE n.qlPosition IS NOT NULL OR n.qlCategory IS NOT NULL OR n.qlOperatorTypes IS NOT NULL
      `;
    }

    // Add QL-specific filtering based on the query
    if (query.toLowerCase().includes('structural operator')) {
      cypherQuery += `
        AND (
          n.qlOperatorTypes IS NOT NULL AND
          ANY(type IN n.qlOperatorTypes WHERE type = 'structural')
        )
      `;
    } else if (query.toLowerCase().includes('processual operator')) {
      cypherQuery += `
        AND (
          n.qlOperatorTypes IS NOT NULL AND
          ANY(type IN n.qlOperatorTypes WHERE type = 'processual')
        )
      `;
    } else if (query.toLowerCase().includes('contextual operator')) {
      cypherQuery += `
        AND (
          n.qlOperatorTypes IS NOT NULL AND
          ANY(type IN n.qlOperatorTypes WHERE type = 'contextual')
        )
      `;
    }

    if (query.toLowerCase().includes('implicate')) {
      cypherQuery += `
        AND n.qlCategory = 'implicate'
      `;
    } else if (query.toLowerCase().includes('explicate')) {
      cypherQuery += `
        AND n.qlCategory = 'explicate'
      `;
    }

    // Add QL position filtering if specified
    const positionMatch = query.match(/ql position (\d)/i);
    if (positionMatch) {
      const position = parseInt(positionMatch[1]);
      cypherQuery += `
        AND n.qlPosition = ${position}
      `;
    }

    // Include relationships if requested
    if (includeRelations) {
      cypherQuery += `
        // Get outgoing relationships
        OPTIONAL MATCH (n)-[r]->(m)
        WHERE type(r) IN ['CONTAINS', 'RELATES_TO', 'IMPLEMENTS', 'EXTENDS']

        // Collect outgoing relationships with QL properties
        WITH n, collect({
          source: n.bimbaCoordinate,
          target: m.bimbaCoordinate,
          type: type(r),
          qlType: r.qlType,
          qlDynamics: r.qlDynamics,
          qlContextFrame: r.qlContextFrame,
          qlCycle: r.qlCycle
        }) as outRelations

        // Get incoming relationships
        OPTIONAL MATCH (n)<-[r]-(m)
        WHERE type(r) IN ['CONTAINS', 'RELATES_TO', 'IMPLEMENTS', 'EXTENDS']

        // Collect incoming relationships with QL properties
        WITH n, outRelations, collect({
          source: m.bimbaCoordinate,
          target: n.bimbaCoordinate,
          type: type(r),
          qlType: r.qlType,
          qlDynamics: r.qlDynamics,
          qlContextFrame: r.qlContextFrame,
          qlCycle: r.qlCycle
        }) as inRelations

        // Return the node and all relationships
        RETURN n, outRelations + inRelations as relations
      `;
    } else {
      // Just return the nodes
      cypherQuery += `
        RETURN n
      `;
    }

    // Add limit
    cypherQuery += `
      LIMIT 20
    `;

    return {
      query: cypherQuery,
      params: queryParams
    };
  }

  /**
   * Process the result of a QL-specific query
   * @param {Object} result - The query result
   * @param {Object} params - The original query parameters
   * @returns {Object} - Processed result
   */
  processQLQueryResult(result, params) {
    // Extract records from the result
    const records = result.records || [];

    // Process nodes and relationships
    const nodes = [];
    const relationships = [];

    records.forEach(record => {
      const node = record.get('n');

      // Process node
      if (node) {
        const nodeData = {
          id: node.identity.toString(),
          labels: node.labels,
          properties: { ...node.properties }
        };

        // Add QL-specific properties
        if (node.properties.qlPosition !== undefined) {
          nodeData.qlPosition = node.properties.qlPosition;
        }

        if (node.properties.qlCategory) {
          nodeData.qlCategory = node.properties.qlCategory;
        }

        if (node.properties.qlOperatorTypes) {
          nodeData.qlOperatorTypes = node.properties.qlOperatorTypes;
        }

        if (node.properties.contextFrame) {
          nodeData.contextFrame = node.properties.contextFrame;
        }

        nodes.push(nodeData);
      }

      // Process relationships if available
      const relations = record.get('relations');
      if (relations && Array.isArray(relations)) {
        relations.forEach(rel => {
          if (rel.source && rel.target) {
            relationships.push({
              source: rel.source,
              target: rel.target,
              type: rel.type,
              qlType: rel.qlType,
              qlDynamics: rel.qlDynamics,
              qlContextFrame: rel.qlContextFrame,
              qlCycle: rel.qlCycle
            });
          }
        });
      }
    });

    // Format the result to match the BimbaKnowing tool's output
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          query: params.query,
          contextDepth: params.contextDepth,
          focusCoordinate: params.focusCoordinate,
          qlAwarenessEnabled: true,
          results: nodes,
          relationships: relationships
        }, null, 2)
      }]
    };
  }

  /**
   * Get QL context for a target coordinate
   * @param {string} targetCoordinate - The target coordinate
   * @returns {Promise<Object>} - QL context
   */
  async getQLContext(targetCoordinate) {
    return this.queryWithQLAwareness({
      query: `Retrieve Quaternal Logic operators (structural, processual, contextual) relevant to ${targetCoordinate}`,
      contextDepth: 2,
      focusCoordinate: targetCoordinate,
      includeRelations: true
    });
  }
}

// Export singleton instance
export default new BimbaKnowingService();
