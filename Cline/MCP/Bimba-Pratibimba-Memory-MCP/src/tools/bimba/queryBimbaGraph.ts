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
  const logPrefix = `[queryBimbaGraph]`;
  let session = null;

  try {
    // Validate arguments
    const validatedArgs = QueryBimbaGraphSchema.parse(args);

    // Get Neo4j driver
    const { neo4jDriver } = dependencies.db;

    if (!neo4jDriver) {
      console.error(`${logPrefix} Neo4j driver is not available`);
      throw new McpError(ErrorCode.InternalError, "Neo4j driver is not available");
    }

    console.log(`${logPrefix} Executing Cypher query`);

    // Create Neo4j session with explicit configuration
    session = neo4jDriver.session({
      defaultAccessMode: 'READ',
      database: 'neo4j',
      fetchSize: 1000
    });

    try {
      // Execute query
      const result = await session.run(validatedArgs.query, validatedArgs.params || {});
      console.log(`${logPrefix} Query returned ${result.records.length} records`);

      // Process results
      const records = result.records.map(record => {
        const recordObj: Record<string, any> = {};

        // Process each field in the record
        for (const key of record.keys) {
          const value = record.get(key);
          const keyStr = String(key);

          // Handle Neo4j node
          if (value && typeof value === 'object' && value.labels && value.properties) {
            const nodeProperties: Record<string, any> = {};

            // Process node properties
            for (const propKey in value.properties) {
              if (propKey === 'embedding') continue; // Skip embedding property
              nodeProperties[propKey] = value.properties[propKey];
            }

            recordObj[keyStr] = {
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

            recordObj[keyStr] = {
              type: value.type,
              properties: relProperties
            };
          }
          // Handle other values
          else {
            recordObj[keyStr] = value;
          }
        }

        return recordObj;
      });

      // Extract the graph data from the records
      let graphData = null;
      if (records.length > 0 && records[0].graphData) {
        graphData = records[0].graphData;
      }

      // Return results
      return {
        content: [{
          type: "text",
          text: JSON.stringify(graphData || {
            nodes: [],
            links: []
          }, null, 2)
        }]
      };
    } catch (queryError: any) {
      console.error(`${logPrefix} Error executing query:`, queryError);
      throw new McpError(ErrorCode.InternalError, `Error executing Neo4j query: ${queryError.message || 'Unknown error'}`);
    } finally {
      if (session) {
        await session.close();
      }
    }
  } catch (error: any) {
    console.error(`${logPrefix} Tool execution error:`, error);

    // Make sure session is closed even if there's an error
    if (session) {
      try {
        await session.close();
      } catch (closeError) {
        console.error(`${logPrefix} Error closing Neo4j session after error:`, closeError);
      }
    }

    throw handleError(error, "queryBimbaGraph");
  }
}
