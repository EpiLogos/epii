import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
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
    console.log(`${logPrefix} Context depth: ${validatedArgs.contextDepth}`);
    if (validatedArgs.focusCoordinate) {
      console.log(`${logPrefix} Focus coordinate: ${validatedArgs.focusCoordinate}`);
    }
    if (validatedArgs.agentCoordinate) {
      console.log(`${logPrefix} Agent coordinate: ${validatedArgs.agentCoordinate}`);
    }
    
    // 1. Generate embedding for the query
    let queryVector: number[];
    try {
      queryVector = await embeddings.embedQuery(String(validatedArgs.query));
      console.log(`${logPrefix} Generated embedding vector with ${queryVector.length} dimensions`);
    } catch (embedError: any) {
      console.error(`${logPrefix} Error generating embedding:`, embedError);
      throw new McpError(ErrorCode.InternalError, `Failed to generate embedding: ${embedError.message}`);
    }
    
    // 2. Create Neo4j session
    const session = neo4jDriver.session();
    
    try {
      // 3. Prepare Cypher query
      const vectorSearchQuery = `
        CALL db.index.vector.queryNodes('node_embeddings', $limit, $queryVector)
        YIELD node, score
        WHERE (
          $focusCoordinate IS NULL OR 
          node.bimbaCoordinate STARTS WITH $focusCoordinate
        )
        RETURN node, score
      `;
      
      // 4. Execute query and process results
      const result = await session.run(vectorSearchQuery, {
        limit: validatedArgs.limit,
        queryVector: queryVector,
        focusCoordinate: validatedArgs.focusCoordinate || null,
      });
      
      // Process results
      const results = [];
      const branchCounts: Record<string, number> = {};
      const branchHierarchy: Record<string, any> = {};
      
      for (const record of result.records) {
        const node = record.get('node');
        const score = record.get('score');
        
        // Extract node properties
        const nodeProperties: Record<string, any> = {};
        for (const key in node.properties) {
          if (key === 'embedding') continue;
          nodeProperties[key] = node.properties[key];
        }
        
        // Get branch information
        const mainBranch = nodeProperties.bimbaCoordinate ? 
          nodeProperties.bimbaCoordinate.split('-')[0] : null;
        const branchDepth = nodeProperties.bimbaCoordinate ? 
          nodeProperties.bimbaCoordinate.split('-').length : 1;
        
        // Track branch counts
        if (mainBranch) {
          branchCounts[mainBranch] = (branchCounts[mainBranch] || 0) + 1;
        }
        
        // Build branch hierarchy
        if (nodeProperties.bimbaCoordinate) {
          const coordinate = nodeProperties.bimbaCoordinate;
          const parts = coordinate.split('-');
          
          // Initialize branch hierarchy if needed
          if (!branchHierarchy[parts[0]]) {
            branchHierarchy[parts[0]] = {
              name: parts[0],
              children: {},
              nodeCount: 0
            };
          }
          
          // Add node to hierarchy
          let currentLevel = branchHierarchy[parts[0]];
          currentLevel.nodeCount++;
          
          // Build the rest of the path
          for (let i = 1; i < parts.length; i++) {
            const pathPart = parts[i];
            const pathKey = parts.slice(0, i+1).join('-');
            
            if (!currentLevel.children[pathKey]) {
              currentLevel.children[pathKey] = {
                name: pathPart,
                fullPath: pathKey,
                children: {},
                nodeCount: 0
              };
            }
            
            currentLevel = currentLevel.children[pathKey];
            currentLevel.nodeCount++;
          }
        }
        
        // Calculate branch relevance
        const branchRelevance = validatedArgs.agentCoordinate && nodeProperties.bimbaCoordinate &&
                               nodeProperties.bimbaCoordinate.startsWith(validatedArgs.agentCoordinate || '')
          ? "direct" // Direct relevance - in agent's branch
          : validatedArgs.agentCoordinate && nodeProperties.bimbaCoordinate &&
            nodeProperties.bimbaCoordinate.startsWith((validatedArgs.agentCoordinate || '').split('-')[0] || '')
            ? "related" // Related relevance - in same main branch
            : "general"; // General relevance - different branch
        
        // Get related nodes if requested
        let parentNodes = [];
        let childNodes = [];
        let siblingNodes = [];
        
        if (validatedArgs.includeRelations) {
          // Get parent nodes
          const parentsQuery = `
            MATCH (n)-[r]->(parent)
            WHERE id(n) = $nodeId
            RETURN parent, type(r) as relType
            LIMIT 10
          `;
          
          const parentsResult = await session.run(parentsQuery, {
            nodeId: node.identity,
          });
          
          parentNodes = parentsResult.records.map(record => {
            const parentNode = record.get('parent');
            const relType = record.get('relType');
            
            const parentProperties: Record<string, any> = {};
            for (const key in parentNode.properties) {
              if (key === 'embedding') continue;
              parentProperties[key] = parentNode.properties[key];
            }
            
            return {
              properties: parentProperties,
              labels: parentNode.labels || [],
              relationshipType: relType,
              relationshipDirection: "parent"
            };
          });
          
          // Get child nodes
          const childrenQuery = `
            MATCH (n)<-[r]-(child)
            WHERE id(n) = $nodeId
            RETURN child, type(r) as relType
            LIMIT 10
          `;
          
          const childrenResult = await session.run(childrenQuery, {
            nodeId: node.identity,
          });
          
          childNodes = childrenResult.records.map(record => {
            const childNode = record.get('child');
            const relType = record.get('relType');
            
            const childProperties: Record<string, any> = {};
            for (const key in childNode.properties) {
              if (key === 'embedding') continue;
              childProperties[key] = childNode.properties[key];
            }
            
            return {
              properties: childProperties,
              labels: childNode.labels || [],
              relationshipType: relType,
              relationshipDirection: "child"
            };
          });
          
          // Get sibling nodes
          const siblingsQuery = `
            MATCH (n)-[:HAS_PARENT]->(parent)<-[:HAS_PARENT]-(sibling)
            WHERE id(n) = $nodeId AND id(sibling) <> id(n)
            RETURN sibling, 'HAS_PARENT' as relType
            LIMIT 10
          `;
          
          const siblingsResult = await session.run(siblingsQuery, {
            nodeId: node.identity,
          });
          
          siblingNodes = siblingsResult.records.map(record => {
            const siblingNode = record.get('sibling');
            const relType = record.get('relType');
            
            const siblingProperties: Record<string, any> = {};
            for (const key in siblingNode.properties) {
              if (key === 'embedding') continue;
              siblingProperties[key] = siblingNode.properties[key];
            }
            
            return {
              properties: siblingProperties,
              labels: siblingNode.labels || [],
              relationshipType: relType,
              relationshipDirection: "sibling"
            };
          });
        }
        
        // Add to results
        results.push({
          matchedNode: {
            properties: nodeProperties,
            labels: node.labels,
            score: score,
            branchDepth: branchDepth,
            branchRelevance: branchRelevance,
            hierarchyLevel: nodeProperties.bimbaCoordinate ? nodeProperties.bimbaCoordinate.split('-').length : 1,
            hierarchyPath: nodeProperties.bimbaCoordinate ? nodeProperties.bimbaCoordinate.split('-') : []
          },
          hierarchicalContext: {
            parents: parentNodes,
            children: childNodes,
            siblings: siblingNodes
          }
        });
      }
      
      // 5. Return combined results with enhanced metadata
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
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
            results: results
          }, null, 2)
        }]
      };
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "bimbaKnowing");
  }
}
