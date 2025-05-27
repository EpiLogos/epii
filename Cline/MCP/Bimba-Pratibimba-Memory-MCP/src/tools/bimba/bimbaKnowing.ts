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
      // MODE 2: AGENT AWARENESS QUERY - Pull the agent's immediate 6 subnodes, with QL filtering
      else if (isAgentAwarenessQuery) {
        console.log(`${logPrefix} Using AGENT AWARENESS MODE for agent identity query`);

        let agentQuery = `
          // Get the agent node
          MATCH (agent)
          WHERE agent.bimbaCoordinate = $agentCoordinate
        `;
        
        const agentQueryParams: Record<string, any> = { agentCoordinate: validatedArgs.agentCoordinate };
        const subnodeWhereClauses: string[] = ["subnode.bimbaCoordinate STARTS WITH $agentCoordinate + '-'"];

        // Apply QL filters to subnodes
        if (validatedArgs.qlPosition !== undefined) {
          subnodeWhereClauses.push(Array.isArray(validatedArgs.qlPosition) ? "subnode.qlPosition IN $qlPosition" : "subnode.qlPosition = $qlPosition");
          agentQueryParams.qlPosition = validatedArgs.qlPosition;
        }
        if (validatedArgs.strengthRange) {
          subnodeWhereClauses.push("subnode.strength >= $minStrength AND subnode.strength <= $maxStrength");
          agentQueryParams.minStrength = validatedArgs.strengthRange[0];
          agentQueryParams.maxStrength = validatedArgs.strengthRange[1];
        }
        if (validatedArgs.confidenceThreshold) { // Assuming subnodes might have a confidence property
          subnodeWhereClauses.push("subnode.confidence >= $confidenceThreshold");
          agentQueryParams.confidenceThreshold = validatedArgs.confidenceThreshold;
        }
        if (validatedArgs.qlDynamics) {
          subnodeWhereClauses.push(Array.isArray(validatedArgs.qlDynamics) ? "subnode.qlDynamics IN $qlDynamics" : "subnode.qlDynamics = $qlDynamics");
          agentQueryParams.qlDynamics = validatedArgs.qlDynamics;
        }
        if (validatedArgs.qlContextFrame) {
          subnodeWhereClauses.push(Array.isArray(validatedArgs.qlContextFrame) ? "subnode.qlContextFrame IN $qlContextFrame" : "subnode.qlContextFrame = $qlContextFrame");
          agentQueryParams.qlContextFrame = validatedArgs.qlContextFrame;
        }
        
        agentQuery += `
          // Get its immediate subnodes, potentially filtered by QL properties
          OPTIONAL MATCH (agent)-[r]->(subnode)
          WHERE ${subnodeWhereClauses.join(" AND ")}

          RETURN agent,
                 collect(DISTINCT {
                   node: subnode,
                   relationship: type(r)
                 }) as subnodes
        `;

        const agentResult = await session.run(agentQuery, agentQueryParams);

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
        `;

        const whereClauses: string[] = ["node.embedding IS NOT NULL"];
        const params: Record<string, any> = {
          embedding: queryVector,
          k: neo4j.int(Math.floor(validatedArgs.limit * 5)), // Increased k for better filtering
          initialLimit: neo4j.int(Math.floor(validatedArgs.limit * 3)),
          innerLimit: neo4j.int(10), // Limit for contextual expansion
          limit: neo4j.int(validatedArgs.limit),
        };

        // B. Subsystem Contextualization from focusCoordinate
        if (validatedArgs.focusCoordinate) {
          const focusParts = validatedArgs.focusCoordinate.split('-');
          const subsystemPrefix = focusParts[0]; // e.g., #2 from #2-1-0-0 or #2 from #2
          whereClauses.push(`(node.bimbaCoordinate STARTS WITH $subsystemPrefix)`);
          params.subsystemPrefix = subsystemPrefix;
          // If full focusCoordinate is more specific than just the subsystem, add that too
          if (validatedArgs.focusCoordinate !== subsystemPrefix) {
            whereClauses.push(`(node.bimbaCoordinate STARTS WITH $focusCoordinate OR node.bimbaCoordinate = $focusCoordinate)`);
            params.focusCoordinate = validatedArgs.focusCoordinate;
          }
        }
        
        // A. QL Property Integration
        if (validatedArgs.qlPosition !== undefined) {
          if (Array.isArray(validatedArgs.qlPosition)) {
            whereClauses.push("node.qlPosition IN $qlPosition");
          } else {
            whereClauses.push("node.qlPosition = $qlPosition");
          }
          params.qlPosition = validatedArgs.qlPosition;
        }
        if (validatedArgs.strengthRange) {
          whereClauses.push("node.strength >= $minStrength AND node.strength <= $maxStrength");
          params.minStrength = validatedArgs.strengthRange[0];
          params.maxStrength = validatedArgs.strengthRange[1];
        }
        if (validatedArgs.confidenceThreshold) {
          // This applies to the vector search score OR an explicit confidence property on the node
          whereClauses.push("(score >= $confidenceThreshold OR node.confidence >= $confidenceThreshold)");
          params.confidenceThreshold = validatedArgs.confidenceThreshold;
        }
        // For qlDynamics and qlContextFrame, they might be on nodes or relationships.
        // For now, applying to nodes. If they are on relationships, this query needs adjustment
        // or a separate relationship-focused query. The QL doc implies they can be on nodes.
        if (validatedArgs.qlDynamics) {
          if (Array.isArray(validatedArgs.qlDynamics)) {
            whereClauses.push("node.qlDynamics IN $qlDynamics");
          } else {
            whereClauses.push("node.qlDynamics = $qlDynamics");
          }
          params.qlDynamics = validatedArgs.qlDynamics;
        }
        if (validatedArgs.qlContextFrame) {
          if (Array.isArray(validatedArgs.qlContextFrame)) {
            whereClauses.push("node.qlContextFrame IN $qlContextFrame");
          } else {
            whereClauses.push("node.qlContextFrame = $qlContextFrame");
          }
          params.qlContextFrame = validatedArgs.qlContextFrame;
        }

        if (whereClauses.length > 0) {
          vectorSearchQuery += `\nWHERE ${whereClauses.join(" AND ")}\n`;
        }

        // Add contextual graph traversal based on context depth
        if (validatedArgs.contextDepth > 1) {
          vectorSearchQuery += `
            // Collect initial nodes from vector search
            WITH node, score
            LIMIT $initialLimit

            // Expand to include related nodes based on context depth
            CALL {
              WITH node // This is the 'node' from the main vector search
              MATCH path = (node)-[*1..${validatedArgs.contextDepth}]-(related)
              // Apply subsystemPrefix to related nodes if focusCoordinate was given
              WHERE related.bimbaCoordinate IS NOT NULL 
                ${validatedArgs.focusCoordinate ? "AND related.bimbaCoordinate STARTS WITH $subsystemPrefix" : ""}
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
        const vectorSearchResult = await session.run(vectorSearchQuery, params);

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

      // C. Parent, Sibling, and Child Awareness
      // This will be done after processing the main results.
      // We will add 'parents', 'children', 'siblings' properties to each result item.
      // Limit detailed fetching to top N results for performance.
      const topNResultsForRelationalFetching = 3; // Configurable: fetch details for top 3 results
      const processedResults = []; 

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const nodeId = result.id; 
        const nodeCoordinate = result.properties.bimbaCoordinate; 

        if (!nodeId || !nodeCoordinate) {
          processedResults.push(result); // Push result as is if no ID/coordinate
          continue;
        }
        
        const relationalData: { parents: any[], children: any[], siblings: any[] } = {
          parents: [],
          children: [],
          siblings: [],
        };

        // Only fetch detailed relations for top N results OR 
        // if it's the agent's direct node or one of its direct subnodes in agent awareness mode
        const shouldFetchRelations = validatedArgs.includeRelations && 
                                     (i < topNResultsForRelationalFetching || 
                                      (isAgentAwarenessQuery && (result.relevanceType === "direct" || result.relevanceType === "branch")));

        if (shouldFetchRelations) {
          // Fetch Parents
          const parentQuery = `
            MATCH (parent)-[:HAS_CHILD|CONTAINS|RELATES_TO]->(current)
            WHERE id(current) = $nodeId
            RETURN parent.name AS name, parent.bimbaCoordinate AS coordinate, labels(parent) as labels, id(parent) as id
            LIMIT 5`;
          const parentResult = await session.run(parentQuery, { nodeId: neo4j.int(nodeId) });
          relationalData.parents = parentResult.records.map(r => ({ 
            id: r.get('id').toString(), name: r.get('name'), coordinate: r.get('coordinate'), labels: r.get('labels') 
          }));

          // Fetch Children
          const childrenQuery = `
            MATCH (current)-[:HAS_CHILD|CONTAINS|RELATES_TO]->(child)
            WHERE id(current) = $nodeId
            RETURN child.name AS name, child.bimbaCoordinate AS coordinate, labels(child) as labels, id(child) as id
            LIMIT 10`;
          const childrenResult = await session.run(childrenQuery, { nodeId: neo4j.int(nodeId) });
          relationalData.children = childrenResult.records.map(r => ({ 
            id: r.get('id').toString(), name: r.get('name'), coordinate: r.get('coordinate'), labels: r.get('labels') 
          }));
          
          // Fetch Siblings
          const siblingQuery = `
            MATCH (parent)-[:HAS_CHILD|CONTAINS|RELATES_TO]->(current)
            WHERE id(current) = $nodeId
            WITH parent
            MATCH (parent)-[:HAS_CHILD|CONTAINS|RELATES_TO]->(sibling)
            WHERE id(sibling) <> $nodeId AND sibling.bimbaCoordinate IS NOT NULL 
            RETURN sibling.name AS name, sibling.bimbaCoordinate AS coordinate, labels(sibling) as labels, id(sibling) as id
            LIMIT 10`;
          const siblingResult = await session.run(siblingQuery, { nodeId: neo4j.int(nodeId) });
          relationalData.siblings = siblingResult.records.map(r => ({ 
            id: r.get('id').toString(), name: r.get('name'), coordinate: r.get('coordinate'), labels: r.get('labels') 
          })).filter((s, index, self) => index === self.findIndex(t => t.id === s.id)); // Deduplicate siblings
        }
        
        processedResults.push({ ...result, ...relationalData });
      }
      results = processedResults; 

      // 6. Ensure complete branch structure for holistic response
      // The existing logic for 'graphRelationships' might be redundant now with specific parent/child/sibling fetching.
      // I'll comment it out for now as it fetches generic relationships.
      // if (validatedArgs.includeRelations && results.length > 0) { ... }
      
      // The branch structure completion (placeholder nodes) can remain as is.
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
        qlFilters: { // Add QL filters used to the output
          qlPosition: validatedArgs.qlPosition,
          strengthRange: validatedArgs.strengthRange,
          confidenceThreshold: validatedArgs.confidenceThreshold,
          qlDynamics: validatedArgs.qlDynamics,
          qlContextFrame: validatedArgs.qlContextFrame,
        },
        vectorSearchUsed: "db.index.vector.queryNodes",
        branchAwarenessEnabled: validatedArgs.agentCoordinate ? true : false,
        branchDistribution: branchCounts, // This will be populated based on the final 'results'
        branchHierarchy: branchHierarchy, // This will be populated based on the final 'results'
        hexagonalStructure: {
          note: "The Bimba system follows a 6-fold hexagonal structure with each parent node having 6 subnodes",
          mainBranches: Object.keys(branchCounts).length, // This needs to be calculated after results are finalized
          totalResults: results.length
        },
        // Organize results by branch for a more holistic view
        organizedByBranch: {} as Record<string, any[]>, // This will be populated based on the final 'results'
        // Keep the flat results for backward compatibility
        results: results // This 'results' now contains parent/child/sibling data
      };

      // Re-calculate branchCounts and branchHierarchy based on the potentially filtered 'results'
      // and also populate organizedByBranch
      branchCounts = {}; // Reset
      branchHierarchy = {}; // Reset
      organizedResults.organizedByBranch = {}; // Reset

      results.forEach(result => {
        // Populate branchCounts and branchHierarchy
        if (result.properties && result.properties.bimbaCoordinate) {
          const coord = result.properties.bimbaCoordinate;
          const mainBranch = coord.split('-')[0];
          branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;
          if (!branchHierarchy[mainBranch]) {
            branchHierarchy[mainBranch] = [];
          }
          if (coord.includes('-') && !branchHierarchy[mainBranch].includes(coord)) {
            branchHierarchy[mainBranch].push(coord);
          }

          // Populate organizedByBranch
          const parts = coord.split('-');
          if (coord === '#') {
            if (!organizedResults.organizedByBranch['root']) {
              organizedResults.organizedByBranch['root'] = [];
            }
            organizedResults.organizedByBranch['root'].push(result);
          } else {
            const displayMainBranch = parts[0].startsWith('#') ? parts[0] : `#${parts[0]}`;
            if (!organizedResults.organizedByBranch[displayMainBranch]) {
              organizedResults.organizedByBranch[displayMainBranch] = [];
            }
            organizedResults.organizedByBranch[displayMainBranch].push(result);
          }
        }
      });
      
      // Update counts in hexagonalStructure
      organizedResults.hexagonalStructure.mainBranches = Object.keys(branchCounts).length;
      organizedResults.hexagonalStructure.totalResults = results.length;
      
      // Update branchDistribution and branchHierarchy in the final object
      organizedResults.branchDistribution = branchCounts;
      organizedResults.branchHierarchy = branchHierarchy;
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
