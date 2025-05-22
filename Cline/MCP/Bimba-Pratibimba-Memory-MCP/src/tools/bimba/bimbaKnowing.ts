import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import neo4j from "neo4j-driver";
import { BimbaKnowingSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const bimbaKnowingTool: Tool = {
  name: "bimbaKnowing",
  description: "Semantic search and graph traversal for architectural context from the Bimba graph. Combines vector similarity with structural understanding.",
  inputSchema: zodToJsonSchema(BimbaKnowingSchema),
};

/**
 * Helper function to determine if a query is about the Bimba structure itself
 * @param query The query string
 * @returns boolean indicating if the query is about Bimba structure
 */
function isQueryAboutBimbaStructure(query: string): boolean {
  const bimbaStructureKeywords = [
    'bimba', 'bimba system', 'bimba structure', 'bimba architecture',
    'bimba framework', 'bimba model', 'quaternary logic', 'hexagonal structure'
  ];

  const normalizedQuery = query.toLowerCase().trim();
  return bimbaStructureKeywords.some(keyword =>
    normalizedQuery.includes(keyword.toLowerCase())
  );
}

/**
 * Helper function to determine if a query is about the agent's identity
 * @param query The query string
 * @returns boolean indicating if the query is about agent identity
 */
function isQueryAboutAgentIdentity(query: string): boolean {
  const agentIdentityKeywords = [
    'who are you', 'your identity', 'epii', 'agent', 'yourself',
    'your role', 'your function', 'your purpose', 'your coordinate'
  ];

  const normalizedQuery = query.toLowerCase().trim();
  return agentIdentityKeywords.some(keyword =>
    normalizedQuery.includes(keyword.toLowerCase())
  );
}

/**
 * Execute bimbaKnowing tool
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleBimbaKnowing(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = BimbaKnowingSchema.parse(args);
    const { neo4jDriver } = dependencies.db;
    const { embeddings } = dependencies.services;
    const logPrefix = `[bimbaKnowing]`;

    console.log(`${logPrefix} Processing query: "${validatedArgs.query}"`);
    console.log(`${logPrefix} Using limit: ${validatedArgs.limit}, contextDepth: ${validatedArgs.contextDepth}`);

    // Create Neo4j session
    const session = neo4jDriver.session();

    try {
      // Determine query mode based on the query content
      const isStructuralQuery = isQueryAboutBimbaStructure(validatedArgs.query);
      const isAgentAwarenessQuery = isQueryAboutAgentIdentity(validatedArgs.query) && validatedArgs.agentCoordinate;

      let results: any[] = [];
      let branchCounts: Record<string, number> = {};
      let branchHierarchy: Record<string, string[]> = {};

      // MODE 1: STRUCTURAL QUERY - Use pure graph traversal for Bimba structure queries
      if (isStructuralQuery) {
        console.log(`${logPrefix} Using STRUCTURAL MODE for Bimba structure query`);

        // Start from the root node and traverse the structure
        const structuralQuery = `
          // Start from the root node
          MATCH (root {bimbaCoordinate: '#'})

          // Get the main branches (level 1)
          OPTIONAL MATCH (root)-[r1]->(branch)
          WHERE branch.bimbaCoordinate IS NOT NULL

          // Get subnodes of each branch (level 2)
          OPTIONAL MATCH (branch)-[r2]->(subnode)
          WHERE subnode.bimbaCoordinate IS NOT NULL

          RETURN root,
                 collect(DISTINCT {
                   node: branch,
                   level: 1,
                   relationships: type(r1)
                 }) as branches,
                 collect(DISTINCT {
                   node: subnode,
                   parentCoord: branch.bimbaCoordinate,
                   level: 2,
                   relationships: type(r2)
                 }) as subnodes
        `;

        const structuralResult = await session.run(structuralQuery);

        if (structuralResult.records.length > 0) {
          const record = structuralResult.records[0];
          const rootNode = record.get('root');
          const branches = record.get('branches') || [];
          const subnodes = record.get('subnodes') || [];

          // Process root node if it exists
          if (rootNode && rootNode.properties) {
            const rootProperties: Record<string, any> = {};
            for (const key in rootNode.properties) {
              if (key === 'embedding') continue;
              rootProperties[key] = rootNode.properties[key];
            }

            // Add root node to results
            results.push({
              id: rootNode.identity.toString(),
              labels: rootNode.labels,
              properties: rootProperties,
              level: 0,
              relevanceType: "structural"
            });
          } else {
            console.log(`${logPrefix} Root node not found in the database`);
            // Add a default root node to results
            results.push({
              id: "root",
              labels: ["Node"],
              properties: {
                name: "Bimba Root",
                bimbaCoordinate: "#",
                description: "The root of the Bimba system"
              },
              level: 0,
              relevanceType: "structural"
            });
          }

          // Process branch nodes
          branches.forEach((branchData: any) => {
            // Skip if branchData or branchNode is null
            if (!branchData || !branchData.node) return;

            const branchNode = branchData.node;
            const level = branchData.level;
            const relationship = branchData.relationships;

            // Skip if branchNode.properties is null
            if (!branchNode.properties) return;

            const branchProperties: Record<string, any> = {};
            for (const key in branchNode.properties) {
              if (key === 'embedding') continue;
              branchProperties[key] = branchNode.properties[key];
            }

            // Track branch distribution
            if (branchProperties.bimbaCoordinate) {
              const mainBranch = branchProperties.bimbaCoordinate.split('-')[0];
              branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;

              // Track branch hierarchy
              if (!branchHierarchy[mainBranch]) {
                branchHierarchy[mainBranch] = [];
              }
            }

            results.push({
              id: branchNode.identity.toString(),
              labels: branchNode.labels,
              properties: branchProperties,
              level: level,
              relationship: relationship,
              relevanceType: "structural"
            });
          });

          // Process subnodes
          subnodes.forEach((subnodeData: any) => {
            // Skip if subnodeData or subnodeNode is null
            if (!subnodeData || !subnodeData.node) return;

            const subnodeNode = subnodeData.node;
            const parentCoord = subnodeData.parentCoord;
            const level = subnodeData.level;
            const relationship = subnodeData.relationships;

            // Skip if subnodeNode.properties is null
            if (!subnodeNode.properties) return;

            const subnodeProperties: Record<string, any> = {};
            for (const key in subnodeNode.properties) {
              if (key === 'embedding') continue;
              subnodeProperties[key] = subnodeNode.properties[key];
            }

            // Track branch hierarchy
            if (subnodeProperties.bimbaCoordinate) {
              const mainBranch = subnodeProperties.bimbaCoordinate.split('-')[0];

              if (!branchHierarchy[mainBranch]) {
                branchHierarchy[mainBranch] = [];
              }

              if (!branchHierarchy[mainBranch].includes(subnodeProperties.bimbaCoordinate)) {
                branchHierarchy[mainBranch].push(subnodeProperties.bimbaCoordinate);
              }
            }

            results.push({
              id: subnodeNode.identity.toString(),
              labels: subnodeNode.labels,
              properties: subnodeProperties,
              parentCoordinate: parentCoord,
              level: level,
              relationship: relationship,
              relevanceType: "structural"
            });
          });
        }
      }
      // MODE 2: AGENT AWARENESS QUERY - Pull the agent's immediate 6 subnodes
      else if (isAgentAwarenessQuery) {
        console.log(`${logPrefix} Using AGENT AWARENESS MODE for agent identity query`);

        const agentQuery = `
          // Get the agent node
          MATCH (agent)
          WHERE agent.bimbaCoordinate = $agentCoordinate

          // Get its immediate 6 subnodes
          OPTIONAL MATCH (agent)-[r]->(subnode)
          WHERE subnode.bimbaCoordinate STARTS WITH $agentCoordinate + '-'

          RETURN agent,
                 collect(DISTINCT {
                   node: subnode,
                   relationship: type(r)
                 }) as subnodes
        `;

        const agentResult = await session.run(agentQuery, {
          agentCoordinate: validatedArgs.agentCoordinate
        });

        if (agentResult.records.length > 0) {
          const record = agentResult.records[0];
          const agentNode = record.get('agent');
          const subnodes = record.get('subnodes') || [];

          // Process agent node if it exists
          if (agentNode && agentNode.properties) {
            const agentProperties: Record<string, any> = {};
            for (const key in agentNode.properties) {
              if (key === 'embedding') continue;
              agentProperties[key] = agentNode.properties[key];
            }

            // Add agent node to results
            results.push({
              id: agentNode.identity.toString(),
              labels: agentNode.labels,
              properties: agentProperties,
              relevanceType: "direct"
            });
          } else {
            console.log(`${logPrefix} Agent node not found for coordinate: ${validatedArgs.agentCoordinate}`);
            // Add a default agent node
            results.push({
              id: "agent",
              labels: ["Node"],
              properties: {
                name: "Epii Agent",
                bimbaCoordinate: validatedArgs.agentCoordinate || "#5",
                description: "The Epii agent node"
              },
              relevanceType: "direct"
            });
          }

          // Track branch distribution for the agent node
          const agentCoord = validatedArgs.agentCoordinate || "#5";
          const mainBranch = agentCoord.split('-')[0];
          branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;

          // Track branch hierarchy
          if (!branchHierarchy[mainBranch]) {
            branchHierarchy[mainBranch] = [];
          }

          // Process subnodes
          subnodes.forEach((subnodeData: any) => {
            // Skip if subnodeData or subnodeNode is null
            if (!subnodeData || !subnodeData.node) return;

            const subnodeNode = subnodeData.node;
            const relationship = subnodeData.relationship;

            // Skip if subnodeNode.properties is null
            if (!subnodeNode.properties) return;

            const subnodeProperties: Record<string, any> = {};
            for (const key in subnodeNode.properties) {
              if (key === 'embedding') continue;
              subnodeProperties[key] = subnodeNode.properties[key];
            }

            // Track branch distribution
            if (subnodeProperties.bimbaCoordinate) {
              const mainBranch = subnodeProperties.bimbaCoordinate.split('-')[0];
              branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;

              // Track branch hierarchy
              if (!branchHierarchy[mainBranch]) {
                branchHierarchy[mainBranch] = [];
              }

              if (subnodeProperties.bimbaCoordinate.includes('-') &&
                  !branchHierarchy[mainBranch].includes(subnodeProperties.bimbaCoordinate)) {
                branchHierarchy[mainBranch].push(subnodeProperties.bimbaCoordinate);
              }
            }

            results.push({
              id: subnodeNode.identity.toString(),
              labels: subnodeNode.labels,
              properties: subnodeProperties,
              relationship: relationship,
              relevanceType: "branch"
            });
          });
        }
      }
      // MODE 3: SEMANTIC QUERY - Use vector search for content-specific queries
      else {
        console.log(`${logPrefix} Using SEMANTIC MODE for content-specific query`);

        // Generate embedding for the query
        let queryVector: number[];
        try {
          queryVector = await embeddings.embedQuery(validatedArgs.query);
        } catch (embedError: any) {
          console.error(`${logPrefix} Error generating embedding:`, embedError);
          throw new McpError(ErrorCode.InternalError, `Failed to generate embedding: ${embedError.message}`);
        }

        // Prepare vector search query
        let vectorSearchQuery = `
          // First, perform vector similarity search
          CALL db.index.vector.queryNodes('bimba_embedding_index', $k, $embedding)
          YIELD node, score
          WHERE node.embedding IS NOT NULL
        `;

        // Add focus coordinate filter if provided
        if (validatedArgs.focusCoordinate) {
          vectorSearchQuery += `
            AND (node.bimbaCoordinate STARTS WITH $focusCoordinate
                 OR node.bimbaCoordinate = $focusCoordinate)
          `;
        }

        // Add contextual graph traversal based on context depth
        if (validatedArgs.contextDepth > 1) {
          vectorSearchQuery += `
            // Collect initial nodes from vector search
            WITH node, score
            LIMIT $initialLimit

            // Expand to include related nodes based on context depth
            CALL {
              WITH node
              MATCH path = (node)-[*1..${validatedArgs.contextDepth}]-(related)
              WHERE related.bimbaCoordinate IS NOT NULL
              RETURN related,
                    size([x IN nodes(path) WHERE x.bimbaCoordinate IS NOT NULL]) AS pathLength
              LIMIT $innerLimit
            }

            // Return both vector search results and related nodes
            RETURN node AS resultNode, score,
                   collect(DISTINCT {node: related, pathLength: pathLength}) AS relatedNodes
            ORDER BY score DESC
            LIMIT $limit
          `;
        } else {
          // Simple query without context expansion
          vectorSearchQuery += `
            RETURN node AS resultNode, score, [] AS relatedNodes
            ORDER BY score DESC
            LIMIT $limit
          `;
        }

        // Execute vector search
        const vectorSearchParams = {
          embedding: queryVector,
          k: neo4j.int(Math.floor(validatedArgs.limit * 3)),
          initialLimit: neo4j.int(Math.floor(validatedArgs.limit * 2)),
          innerLimit: neo4j.int(10),
          limit: neo4j.int(validatedArgs.limit),
          focusCoordinate: validatedArgs.focusCoordinate
        };

        const vectorSearchResult = await session.run(vectorSearchQuery, vectorSearchParams);

        // Process vector search results
        vectorSearchResult.records.forEach(record => {
          const node = record.get('resultNode');
          const score = record.get('score');
          const relatedNodes = record.get('relatedNodes') || [];

          // Extract node properties
          const nodeProperties: Record<string, any> = {};
          for (const key in node.properties) {
            if (key === 'embedding') continue; // Skip embedding property
            nodeProperties[key] = node.properties[key];
          }

          // Track branch distribution
          if (nodeProperties.bimbaCoordinate) {
            const mainBranch = nodeProperties.bimbaCoordinate.split('-')[0];
            branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;

            // Track branch hierarchy
            if (!branchHierarchy[mainBranch]) {
              branchHierarchy[mainBranch] = [];
            }
            if (nodeProperties.bimbaCoordinate.includes('-') &&
                !branchHierarchy[mainBranch].includes(nodeProperties.bimbaCoordinate)) {
              branchHierarchy[mainBranch].push(nodeProperties.bimbaCoordinate);
            }
          }

          // Determine relevance type based on agent coordinate if provided
          const relevanceType = validatedArgs.agentCoordinate && nodeProperties.bimbaCoordinate ?
              nodeProperties.bimbaCoordinate === validatedArgs.agentCoordinate ?
              "direct" : // Direct relevance - exact match
              nodeProperties.bimbaCoordinate.startsWith(validatedArgs.agentCoordinate) ?
              "branch" : // Branch relevance - same branch
              nodeProperties.bimbaCoordinate.startsWith((validatedArgs.agentCoordinate || '').split('-')[0] || '') ?
              "related" : // Related relevance - in same main branch
              "general" : // General relevance - different branch
              "general"; // Default if no agent coordinate provided

          // Process related nodes
          const relatedNodesData = relatedNodes.map((relatedItem: any) => {
            const relatedNode = relatedItem.node;
            const pathLength = relatedItem.pathLength;

            // Extract related node properties
            const relatedProperties: Record<string, any> = {};
            for (const key in relatedNode.properties) {
              if (key === 'embedding') continue;
              relatedProperties[key] = relatedNode.properties[key];
            }

            return {
              id: relatedNode.identity.toString(),
              labels: relatedNode.labels,
              properties: relatedProperties,
              pathLength: pathLength,
              relationshipType: "contextual" // This is a simplified relationship type
            };
          });

          // Add result
          results.push({
            id: node.identity.toString(),
            labels: node.labels,
            properties: nodeProperties,
            score: score,
            relevanceType: relevanceType,
            relatedNodes: relatedNodesData
          });
        });
      }

      // 5. If includeRelations is true, fetch actual graph relationships for top results
      if (validatedArgs.includeRelations && results.length > 0) {
        // Get the IDs of the top nodes (use at most 3 nodes)
        const topCount = Math.min(3, results.length);
        const topNodeIds = results.slice(0, topCount)
          .map(result => result.id);

        // Fetch actual relationships
        const relationshipsQuery = `
          MATCH (n)-[r]-(m)
          WHERE id(n) IN $nodeIds AND m.bimbaCoordinate IS NOT NULL
          RETURN id(n) AS sourceId, type(r) AS relType, id(m) AS targetId,
                 m.name AS targetName, m.bimbaCoordinate AS targetCoordinate,
                 labels(m) AS targetLabels
          LIMIT 50
        `;

        const relationshipsResult = await session.run(relationshipsQuery, {
          nodeIds: topNodeIds,
          limit: neo4j.int(50) // Explicitly convert the LIMIT parameter to a Neo4j integer
        });

        // Process relationships and add them to the results
        const relationshipsByNodeId: Record<string, any[]> = {};

        relationshipsResult.records.forEach(record => {
          const sourceId = record.get('sourceId').toString();
          const relType = record.get('relType');
          const targetId = record.get('targetId').toString();
          const targetName = record.get('targetName');
          const targetCoordinate = record.get('targetCoordinate');
          const targetLabels = record.get('targetLabels');

          if (!relationshipsByNodeId[sourceId]) {
            relationshipsByNodeId[sourceId] = [];
          }

          relationshipsByNodeId[sourceId].push({
            type: relType,
            targetId: targetId,
            targetName: targetName,
            targetCoordinate: targetCoordinate,
            targetLabels: targetLabels
          });
        });

        // Add relationships to results
        results.forEach(result => {
          if (relationshipsByNodeId[result.id]) {
            result.graphRelationships = relationshipsByNodeId[result.id];
          }
        });
      }

      // 6. Ensure complete branch structure for holistic response
      // If we have a focus on a specific branch (especially for agent queries), ensure all 6 subnodes are represented
      if (validatedArgs.agentCoordinate && validatedArgs.agentCoordinate.startsWith('#')) {
        const branchCoord = validatedArgs.agentCoordinate;
        console.log(`${logPrefix} Ensuring complete branch structure for ${branchCoord}`);

        // Check if we have all 6 subnodes (0-5) for this branch
        const existingSubnodes: Record<string, boolean> = {};

        // Find existing subnodes in results
        results.forEach(result => {
          if (result.properties && result.properties.bimbaCoordinate) {
            const coord = result.properties.bimbaCoordinate;
            if (coord.startsWith(branchCoord + '-')) {
              const subnodeNum = coord.split('-').pop();
              if (subnodeNum && !isNaN(parseInt(subnodeNum))) {
                existingSubnodes[subnodeNum] = true;
              }
            }
          }
        });

        // Create placeholder nodes for missing subnodes
        for (let i = 0; i <= 5; i++) {
          if (!existingSubnodes[i.toString()]) {
            console.log(`${logPrefix} Adding placeholder for missing subnode ${branchCoord}-${i}`);
            results.push({
              id: `placeholder-${branchCoord}-${i}`,
              labels: ["Node"],
              properties: {
                name: `${branchCoord}-${i} Node`,
                bimbaCoordinate: `${branchCoord}-${i}`,
                description: `Subnode ${i} of ${branchCoord} branch`
              },
              relevanceType: "branch",
              isPlaceholder: true
            });
          }
        }
      }

      // 7. Organize results by Quaternary Logic structure
      const organizedResults = {
        query: validatedArgs.query,
        contextDepth: validatedArgs.contextDepth,
        focusCoordinate: validatedArgs.focusCoordinate,
        agentCoordinate: validatedArgs.agentCoordinate,
        vectorSearchUsed: "db.index.vector.queryNodes",
        branchAwarenessEnabled: validatedArgs.agentCoordinate ? true : false,
        branchDistribution: branchCounts,
        branchHierarchy: branchHierarchy,
        hexagonalStructure: {
          note: "The Bimba system follows a 6-fold hexagonal structure with each parent node having 6 subnodes",
          mainBranches: Object.keys(branchCounts).length,
          totalResults: results.length
        },
        // Organize results by branch for a more holistic view
        organizedByBranch: {} as Record<string, any[]>,
        // Keep the flat results for backward compatibility
        results: results
      };

      // Organize results by branch
      results.forEach(result => {
        if (result.properties && result.properties.bimbaCoordinate) {
          const coord = result.properties.bimbaCoordinate;
          const parts = coord.split('-');

          // Handle root node
          if (coord === '#') {
            if (!organizedResults.organizedByBranch['root']) {
              organizedResults.organizedByBranch['root'] = [];
            }
            organizedResults.organizedByBranch['root'].push(result);
            return;
          }

          // Handle main branches and subnodes
          const mainBranch = parts[0].startsWith('#') ? parts[0] : `#${parts[0]}`;

          if (!organizedResults.organizedByBranch[mainBranch]) {
            organizedResults.organizedByBranch[mainBranch] = [];
          }

          organizedResults.organizedByBranch[mainBranch].push(result);
        }
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify(organizedResults, null, 2)
        }]
      };
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "bimbaKnowing");
  }
}
