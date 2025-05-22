import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GenerateBimbaEmbeddingsSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const generateBimbaEmbeddingsTool: Tool = {
  name: "generateBimbaEmbeddings",
  description: "Generate embeddings for nodes in the Bimba graph that don't have them yet.",
  inputSchema: zodToJsonSchema(GenerateBimbaEmbeddingsSchema),
};

/**
 * Generate embeddings for nodes in the Bimba graph
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGenerateBimbaEmbeddings(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = GenerateBimbaEmbeddingsSchema.parse(args);
    const { neo4jDriver } = dependencies.db;
    const { embeddings } = dependencies.services;
    const logPrefix = `[generateBimbaEmbeddings]`;
    
    console.log(`${logPrefix} Starting embedding generation process...`);
    console.log(`${logPrefix} Limit: ${validatedArgs.limit}`);
    if (validatedArgs.labelFilter) {
      console.log(`${logPrefix} Label filter: ${validatedArgs.labelFilter}`);
    }
    
    // Create Neo4j session
    const session = neo4jDriver.session();
    
    try {
      // 1. Find nodes that need embeddings
      let findNodesQuery = `
        MATCH (n)
        WHERE ${validatedArgs.forceRegenerate ? 'true' : 'n.embedding IS NULL'}
      `;
      
      if (validatedArgs.labelFilter) {
        findNodesQuery += `AND n:${validatedArgs.labelFilter} `;
      }
      
      findNodesQuery += `
        RETURN id(n) AS id, n.name AS name, n.description AS description, 
               n.function AS function, n.role AS role, n.bimbaCoordinate AS bimbaCoordinate,
               labels(n) AS labels
        LIMIT $limit
      `;
      
      const findNodesResult = await session.run(findNodesQuery, { limit: validatedArgs.limit });
      const nodesToProcess = findNodesResult.records;
      
      console.log(`${logPrefix} Found ${nodesToProcess.length} nodes to process`);
      
      if (nodesToProcess.length === 0) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "success",
              message: "No nodes found that need embeddings.",
              nodesProcessed: 0
            }, null, 2)
          }]
        };
      }
      
      // 2. Generate embeddings and update nodes
      const processedNodes: any[] = [];
      const failedNodes: any[] = [];
      
      for (const record of nodesToProcess) {
        const nodeId = record.get('id');
        const nodeName = record.get('name') || '';
        const nodeDescription = record.get('description') || '';
        const nodeFunction = record.get('function') || '';
        const nodeRole = record.get('role') || '';
        const nodeBimbaCoordinate = record.get('bimbaCoordinate') || '';
        const nodeLabels = record.get('labels') || [];
        
        // Combine node properties for embedding
        const textToEmbed = [
          `Name: ${nodeName}`,
          `Description: ${nodeDescription}`,
          `Function: ${nodeFunction}`,
          `Role: ${nodeRole}`,
          `Bimba Coordinate: ${nodeBimbaCoordinate}`,
          `Labels: ${nodeLabels.join(', ')}`
        ].filter(line => line.split(': ')[1].trim() !== '').join('\n');
        
        if (textToEmbed.trim() === '') {
          console.log(`${logPrefix} Skipping node ${nodeId} - no text to embed`);
          failedNodes.push({
            id: nodeId.toString(),
            reason: "No text to embed"
          });
          continue;
        }
        
        try {
          // Generate embedding
          const nodeEmbedding = await embeddings.embedQuery(textToEmbed);
          
          // Update node with embedding
          const updateNodeQuery = `
            MATCH (n)
            WHERE id(n) = $nodeId
            SET n.embedding = $embedding
            RETURN n
          `;
          
          await session.run(updateNodeQuery, {
            nodeId: nodeId,
            embedding: nodeEmbedding
          });
          
          console.log(`${logPrefix} Updated node ${nodeId} with embedding`);
          
          processedNodes.push({
            id: nodeId.toString(),
            name: nodeName,
            bimbaCoordinate: nodeBimbaCoordinate,
            embeddingDimensions: nodeEmbedding.length
          });
        } catch (error: any) {
          console.error(`${logPrefix} Error processing node ${nodeId}:`, error);
          failedNodes.push({
            id: nodeId.toString(),
            name: nodeName,
            reason: error.message
          });
        }
      }
      
      // 3. Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "success",
            message: `Processed ${processedNodes.length} nodes, ${failedNodes.length} failed.`,
            nodesProcessed: processedNodes.length,
            nodesFailed: failedNodes.length,
            processedNodes: processedNodes,
            failedNodes: failedNodes
          }, null, 2)
        }]
      };
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "generateBimbaEmbeddings");
  }
}
