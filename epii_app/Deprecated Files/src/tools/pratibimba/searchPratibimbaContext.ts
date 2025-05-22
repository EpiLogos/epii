import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { SearchPratibimbaContextSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const searchPratibimbaContextTool: Tool = {
  name: "searchPratibimbaContext",
  description: "Search for context in the Pratibimba vector store using semantic similarity.",
  inputSchema: zodToJsonSchema(SearchPratibimbaContextSchema),
};

/**
 * Search for context in the Pratibimba vector store
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleSearchPratibimbaContext(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = SearchPratibimbaContextSchema.parse(args);
    const { qdrantClient } = dependencies.db;
    const { embeddings } = dependencies.services;
    const logPrefix = `[searchPratibimbaContext]`;
    
    console.log(`${logPrefix} Processing query: "${validatedArgs.query}"`);
    console.log(`${logPrefix} Limit: ${validatedArgs.limit}`);
    
    // Generate embedding for the query
    let queryVector: number[];
    try {
      queryVector = await embeddings.embedQuery(String(validatedArgs.query));
      console.log(`${logPrefix} Generated embedding vector with ${queryVector.length} dimensions`);
    } catch (embedError: any) {
      console.error(`${logPrefix} Error generating embedding:`, embedError);
      throw new McpError(ErrorCode.InternalError, `Failed to generate embedding: ${embedError.message}`);
    }
    
    // Determine collection name
    const collectionName = validatedArgs.collection || "pratibimba_context";
    
    // Search Qdrant
    try {
      const searchResult = await qdrantClient.search(collectionName, {
        vector: queryVector,
        limit: validatedArgs.limit,
        filter: {
          must: [
            {
              key: "score",
              range: {
                gte: validatedArgs.threshold
              }
            }
          ]
        },
        with_payload: validatedArgs.includeMetadata,
        with_vectors: false
      });
      
      console.log(`${logPrefix} Found ${searchResult.length} results in collection ${collectionName}`);
      
      // Process results
      const results = searchResult.map(result => {
        return {
          id: result.id,
          score: result.score,
          payload: result.payload
        };
      });
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            query: validatedArgs.query,
            collection: collectionName,
            threshold: validatedArgs.threshold,
            totalResults: results.length,
            results: results
          }, null, 2)
        }]
      };
    } catch (searchError: any) {
      console.error(`${logPrefix} Error searching Qdrant:`, searchError);
      throw new McpError(ErrorCode.InternalError, `Failed to search Qdrant: ${searchError.message}`);
    }
  } catch (error: any) {
    throw handleError(error, "searchPratibimbaContext");
  }
}
