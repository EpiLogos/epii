import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { graph } from "../../../neo4j/neo4j.service.mjs"; // Import the initialized graph instance

// Define the Zod schema for the tool's input
const queryBimbaSchema = z.object({
  query: z.string().describe("The read-only Cypher query to execute against the Bimba knowledge graph."),
  params: z.object({}).passthrough().optional().describe("Optional parameters object for the Cypher query.")
});

// Create the DynamicStructuredTool
const queryBimbaGraphTool = new DynamicStructuredTool({
  name: "queryBimbaGraph",
  description: "Executes a read-only Cypher query against the Bimba knowledge graph (Neo4j) to retrieve structural information, relationships, or node properties. Use this to understand core concepts, QL mappings, and connections.",
  schema: queryBimbaSchema,
  func: async ({ query, params }) => {
    console.log(`Executing Cypher Query: ${query}`, "Params:", params || {}); // Log the query being executed
    if (!graph) {
      return "Error: Neo4jGraph instance is not available. Check Neo4j service initialization.";
    }
    try {
      // Ensure params is an object if provided, otherwise undefined
      const executionParams = typeof params === 'object' && params !== null ? params : undefined;
      const result = await graph.query(query, executionParams);
      // LangChain's graph.query typically returns an array of objects
      // Convert the result to a JSON string for the LLM
      return JSON.stringify(result, null, 2); // Pretty print JSON
    } catch (error) {
      console.error("Error executing Cypher query via LangChain tool:", error);
      // Return a meaningful error message string to the LLM
      return `Error executing Cypher query: ${error.message}`;
    }
  },
});

export { queryBimbaGraphTool };
