import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { QueryBimbaGraphSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const queryBimbaGraphTool: Tool = {
  name: "queryBimbaGraph",
  description: "Execute a Cypher query against the Neo4j Bimba graph.",
  inputSchema: zodToJsonSchema(QueryBimbaGraphSchema),
};

/**
 * Execute a Cypher query against the Neo4j Bimba graph
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleQueryBimbaGraph(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = QueryBimbaGraphSchema.parse(args);
    const { neo4jDriver } = dependencies.db;
    const logPrefix = `[queryBimbaGraph]`;
    
    console.log(`${logPrefix} Executing Cypher query: "${validatedArgs.query}"`);
    if (validatedArgs.params) {
      console.log(`${logPrefix} With parameters: ${JSON.stringify(validatedArgs.params)}`);
    }
    
    // Create Neo4j session
    const session = neo4jDriver.session();
    
    try {
      // Execute query
      const result = await session.run(validatedArgs.query, validatedArgs.params || {});
      
      // Process results
      const records = result.records.map(record => {
        const recordObj: Record<string, any> = {};
        
        // Process each field in the record
        for (const key of record.keys) {
          const value = record.get(key);
          
          // Handle Neo4j node
          if (value && typeof value === 'object' && value.labels && value.properties) {
            const nodeProperties: Record<string, any> = {};
            
            // Process node properties
            for (const propKey in value.properties) {
              if (propKey === 'embedding') continue; // Skip embedding property
              nodeProperties[propKey] = value.properties[propKey];
            }
            
            recordObj[key] = {
              labels: value.labels,
              properties: nodeProperties
            };
          }
          // Handle Neo4j relationship
          else if (value && typeof value === 'object' && value.type && value.properties) {
            const relProperties: Record<string, any> = {};
            
            // Process relationship properties
            for (const propKey in value.properties) {
              relProperties[propKey] = value.properties[propKey];
            }
            
            recordObj[key] = {
              type: value.type,
              properties: relProperties
            };
          }
          // Handle other values
          else {
            recordObj[key] = value;
          }
        }
        
        return recordObj;
      });
      
      console.log(`${logPrefix} Query returned ${records.length} records`);
      
      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            query: validatedArgs.query,
            params: validatedArgs.params || {},
            recordCount: records.length,
            records: records
          }, null, 2)
        }]
      };
    } finally {
      await session.close();
    }
  } catch (error: any) {
    throw handleError(error, "queryBimbaGraph");
  }
}
