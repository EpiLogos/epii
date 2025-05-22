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
    console.log(`${logPrefix} Force regenerate: ${validatedArgs.forceRegenerate}`);
    
    // Create Neo4j session
    const session = neo4jDriver.session();
    
    try {
      // Find nodes that need embeddings
      const findNodesQuery = `
        MATCH (n)
        ${validatedArgs.labelFilter ? `WHERE n:${validatedArgs.labelFilter}` : ''}
        ${validatedArgs.forceRegenerate ? '' : 'AND n.embedding IS NULL'}
        RETURN n
        LIMIT $limit
      `;
      
      const nodesResult = await session.run(findNodesQuery, {
        limit: validatedArgs.limit
      });
      
      console.log(`${logPrefix} Found ${nodesResult.records.length} nodes that need embeddings`);
      
      // Process nodes
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (const record of nodesResult.records) {
        const node = record.get('n');
        const nodeId = node.identity;
        
        try {
          // Prepare text for embedding
          let textToEmbed = '';
          
          // Add node properties to text
          for (const key in node.properties) {
            if (key === 'embedding') continue;
            
            const value = node.properties[key];
            if (typeof value === 'string' && value.trim().length > 0) {
              textToEmbed += `${key}: ${value}\n`;
            }
          }
          
          // Skip if no text to embed
          if (textToEmbed.trim().length === 0) {
            console.log(`${logPrefix} Skipping node ${nodeId} - no text to embed`);
            results.push({
              nodeId: nodeId,
              status: 'skipped',
              reason: 'No text to embed'
            });
            continue;
          }
          
          // Generate embedding
          const embeddingVector = await embeddings.embedQuery(textToEmbed);
          console.log(`${logPrefix} Generated embedding for node ${nodeId} with ${embeddingVector.length} dimensions`);
          
          // Update node with embedding
          const updateQuery = `
            MATCH (n)
            WHERE id(n) = $nodeId
            SET n.embedding = $embedding
            RETURN n
          `;
          
          await session.run(updateQuery, {
            nodeId: nodeId,
            embedding: embeddingVector
          });
          
          console.log(`${logPrefix} Updated node ${nodeId} with embedding`);
          
          // Add to results
          results.push({
            nodeId: nodeId,
            status: 'success',
            dimensions: embeddingVector.length
          });
          
          successCount++;
        } catch (error: any) {
          console.error(`${logPrefix} Error generating embedding for node ${nodeId}:`, error);
          
          results.push({
            nodeId: nodeId,
            status: 'error',
            error: error.message
          });
          
          errorCount++;
        }
      }
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            totalProcessed: nodesResult.records.length,
            successCount: successCount,
            errorCount: errorCount,
            results: results
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
