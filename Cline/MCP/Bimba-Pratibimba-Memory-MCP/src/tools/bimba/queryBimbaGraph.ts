import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import neo4j, { Session } from "neo4j-driver"; // Import Session
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
  let session: Session | null = null;

  // Regex for direct coordinate string, allowing '#' prefix and alphanumeric/hyphen/underscore components
  const directCoordinateRegex = /^#(?:[0-5](?:-[0-5A-Za-z\d]+)*|[A-Za-z\d_]+)$/i;
  // Regex to extract coordinate from a simple MATCH query (e.g., MATCH (n {bimbaCoordinate: '#1-2-3'}) RETURN n)
  // This regex captures the coordinate itself.
  const cypherSingleNodeRegex = /MATCH\s*\([a-zA-Z0-9_]+\s*\{bimbaCoordinate:\s*['"](#(?:[0-5](?:-[0-5A-Za-z\d]+)*|[A-Za-z\d_]+))['"]\}\)\s*RETURN/i;


  // Helper to process properties, removing 'embedding'
  const processNodeProperties = (props: Record<string, any> | null) => {
    if (!props) return null;
    const { embedding, ...rest } = props;
    return rest;
  };

  // Helper function to fetch single node details and relations
  async function fetchSingleNodeWithRelations(coordinate: string, dbSession: Session, logPrefixVal: string) {
    const resultStructure = {
      bimbaCoordinate: coordinate,
      properties: null as Record<string, any> | null,
      relations: {
        parents: [] as any[],
        children: [] as any[],
        siblings: [] as any[],
      },
    };

    // 1. Fetch Node Properties
    const nodeResult = await dbSession.run(
      "MATCH (n {bimbaCoordinate: $coord}) RETURN properties(n) AS props",
      { coord: coordinate }
    );

    if (nodeResult.records.length === 0) {
      console.log(`${logPrefixVal} Node not found: ${coordinate}`);
      return { content: [{ type: "text", text: JSON.stringify(resultStructure, null, 2) }] };
    }
    resultStructure.properties = processNodeProperties(nodeResult.records[0].get("props"));

    // 2. Fetch Parents
    const parentResult = await dbSession.run(
      "MATCH (p)-[r]->(n {bimbaCoordinate: $coord}) RETURN p.bimbaCoordinate AS bimbaCoordinate, properties(p) AS properties, type(r) AS relationshipType",
      { coord: coordinate }
    );
    resultStructure.relations.parents = parentResult.records.map(rec => ({
      bimbaCoordinate: rec.get("bimbaCoordinate"),
      properties: processNodeProperties(rec.get("properties")),
      relationshipType: rec.get("relationshipType"),
    }));

    // 3. Fetch Children
    const childrenResult = await dbSession.run(
      "MATCH (n {bimbaCoordinate: $coord})-[r]->(c) RETURN c.bimbaCoordinate AS bimbaCoordinate, properties(c) AS properties, type(r) AS relationshipType",
      { coord: coordinate }
    );
    resultStructure.relations.children = childrenResult.records.map(rec => ({
      bimbaCoordinate: rec.get("bimbaCoordinate"),
      properties: processNodeProperties(rec.get("properties")),
      relationshipType: rec.get("relationshipType"),
    }));
    
    // 4. Fetch Siblings (distinct)
    const siblingResult = await dbSession.run(
      "MATCH (p)-[]->(n {bimbaCoordinate: $coord}) WITH p, n " + // Added 'n' to WITH to use in WHERE
      "MATCH (p)-[r_s]->(s) WHERE s.bimbaCoordinate <> n.bimbaCoordinate " + // Ensure sibling is not the node itself
      "RETURN DISTINCT s.bimbaCoordinate AS bimbaCoordinate, properties(s) AS properties, type(r_s) AS relationshipType",
      { coord: coordinate }
    );
    const siblingMap = new Map(); // To ensure distinct siblings by coordinate
    siblingResult.records.forEach(rec => {
      const siblingCoord = rec.get("bimbaCoordinate");
      if (siblingCoord && !siblingMap.has(siblingCoord)) { // Check if coordinate is not null/undefined
        siblingMap.set(siblingCoord, {
          bimbaCoordinate: siblingCoord,
          properties: processNodeProperties(rec.get("properties")),
          relationshipType: rec.get("relationshipType"),
        });
      }
    });
    resultStructure.relations.siblings = Array.from(siblingMap.values());

    return { content: [{ type: "text", text: JSON.stringify(resultStructure, null, 2) }] };
  }

  try {
    // Validate arguments
    const validatedArgs = QueryBimbaGraphSchema.parse(args);
    let targetCoordinate: string | null = null;

    if (validatedArgs.specificCoordinate) {
      targetCoordinate = validatedArgs.specificCoordinate;
      console.log(`${logPrefix} Prioritizing specificCoordinate: ${targetCoordinate}`);
    } else if (validatedArgs.query) {
      if (directCoordinateRegex.test(validatedArgs.query)) {
        targetCoordinate = validatedArgs.query;
        console.log(`${logPrefix} Detected direct coordinate in query: ${targetCoordinate}`);
      } else {
        const match = validatedArgs.query.match(cypherSingleNodeRegex);
        if (match && match[1]) { // match[1] should be the coordinate
          targetCoordinate = match[1];
          console.log(`${logPrefix} Detected single-node Cypher query for coordinate: ${targetCoordinate}`);
        }
      }
    }

    // Get Neo4j driver - This needs to be available for both paths if a session is to be created.
    const { neo4jDriver } = dependencies.db;

    if (!neo4jDriver) {
      console.error(`${logPrefix} Neo4j driver is not available`);
      throw new McpError(ErrorCode.InternalError, "Neo4j driver is not available");
    }

    // Create Neo4j session with explicit configuration
    session = neo4jDriver.session({
      defaultAccessMode: 'READ',
      database: 'neo4j',
      fetchSize: 1000
    });

    if (targetCoordinate) {
      // Use the new logic for single node + relations
      // The fetchSingleNodeWithRelations function will use the session internally.
      // The session will be closed in the main finally block.
      return await fetchSingleNodeWithRelations(targetCoordinate, session, logPrefix);
    } else if (validatedArgs.query) {
      // Fallback to existing general query logic
      console.log(`${logPrefix} Executing general Cypher query: ${validatedArgs.query}`);
      const cypherQuery = validatedArgs.query;
      const queryParams = validatedArgs.params;
      
      // This specific try...catch is for errors during the general query execution
      try {
        const result = await session.run(cypherQuery, queryParams || {});
        console.log(`${logPrefix} Query returned ${result.records.length} records`);

        const records = result.records.map(record => {
          const recordObj: Record<string, any> = {};
          for (const key of record.keys) {
            const value = record.get(key);
            const keyStr = String(key);
            if (value && typeof value === 'object' && value.labels && value.properties) { // Node
              recordObj[keyStr] = { labels: value.labels, properties: processNodeProperties(value.properties) };
            } else if (value && typeof value === 'object' && value.type && value.properties) { // Relationship
              recordObj[keyStr] = { type: value.type, properties: processNodeProperties(value.properties) };
            } else {
              recordObj[keyStr] = value;
            }
          }
          return recordObj;
        });

        let graphData = null;
        if (records.length > 0 && records[0] && records[0].graphData) {
          graphData = records[0].graphData;
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify(graphData || {
              message: "Query executed. If you expected graph data, ensure your query returns it in a 'graphData' field or use specificCoordinate / single-node query syntax for structured output.",
              processedRecords: records,
            }, null, 2),
          }],
        };
      } catch (queryError: any) { // Catches errors from session.run for general queries
        console.error(`${logPrefix} Error executing general Neo4j query:`, queryError);
        // Ensure the error is an McpError or wrapped as one if necessary by handleError
        if (queryError instanceof McpError) throw queryError;
        throw new McpError(ErrorCode.ThirdPartyServiceError, `Error executing general Neo4j query: ${queryError.message || 'Unknown error'}`);
      }
    } else {
      // This case should ideally be caught by Zod schema refinement.
      // If it's reached, it means validatedArgs.query and validatedArgs.specificCoordinate are both null.
      // The Zod refine for QueryBimbaGraphSchema should prevent this.
      // Throwing an error here is a safeguard.
      throw new McpError(ErrorCode.InvalidRequest, "A query or specificCoordinate must be provided; this state should not be reached if validation is correct.");
    }

  } catch (error: any) { // Outer catch for errors like arg parsing, session creation, or errors bubbled up
    console.error(`${logPrefix} Tool execution error:`, error);
    // Pass the original error to handleError if it's already an McpError or needs specific formatting
    throw handleError(error, "queryBimbaGraph"); 
  } finally { // Outer finally to ensure session is always closed if created
    if (session) {
      try {
        await session.close();
        console.log(`${logPrefix} Neo4j session closed.`);
      } catch (closeError) {
        console.error(`${logPrefix} Error closing Neo4j session:`, closeError);
      }
    }
  }
}
