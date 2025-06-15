import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GetMongoContextSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const getMongoContextTool: Tool = {
  name: "getMongoContext",
  description: "Query MongoDB for context information.",
  inputSchema: zodToJsonSchema(GetMongoContextSchema),
};

/**
 * Query MongoDB for context information
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleGetMongoContext(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = GetMongoContextSchema.parse(args);
    const { mongoDb } = dependencies.db;
    const logPrefix = `[getMongoContext]`;
    
    console.log(`${logPrefix} Querying collection: ${validatedArgs.collection}`);
    console.log(`${logPrefix} Query: ${JSON.stringify(validatedArgs.query)}`);
    
    // Get collection
    const collection = mongoDb.collection(validatedArgs.collection);
    
    // Build query options
    const options: any = {
      limit: validatedArgs.limit
    };
    
    if (validatedArgs.sort) {
      options.sort = validatedArgs.sort;
    }
    
    if (validatedArgs.projection) {
      options.projection = validatedArgs.projection;
    }
    
    // Execute query
    const results = await collection.find(validatedArgs.query, options).toArray();
    
    console.log(`${logPrefix} Found ${results.length} results in collection ${validatedArgs.collection}`);
    
    // Convert ObjectId to string for serialization
    const serializableResults = results.map(doc => {
      const serializableDoc: any = { ...doc };
      if (doc._id) {
        serializableDoc._id = doc._id.toString();
      }
      return serializableDoc;
    });
    
    // Return results
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          collection: validatedArgs.collection,
          query: validatedArgs.query,
          totalResults: results.length,
          results: serializableResults
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "getMongoContext");
  }
}
