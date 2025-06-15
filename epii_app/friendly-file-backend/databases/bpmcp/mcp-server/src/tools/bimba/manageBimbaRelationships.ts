import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ManageBimbaRelationshipsSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";

// Tool definition
export const manageBimbaRelationshipsTool: Tool = {
  name: "manageBimbaRelationships",
  description: "Pure relationship management tool - create, update, or delete relationships between any nodes regardless of labels. Works with nodes identified by bimbaCoordinate property or node IDs.",
  inputSchema: zodToJsonSchema(ManageBimbaRelationshipsSchema),
};

/**
 * Manage relationships between nodes in the Bimba graph
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleManageBimbaRelationships(dependencies: ToolDependencies, args: any) {
  const logPrefix = `[manageBimbaRelationships]`;
  let session = null;

  try {
    // Validate arguments
    const validatedArgs = ManageBimbaRelationshipsSchema.parse(args);

    // Get Neo4j driver
    const { neo4jDriver } = dependencies.db;

    if (!neo4jDriver) {
      console.error(`${logPrefix} Neo4j driver is not available`);
      throw new McpError(ErrorCode.InternalError, "Neo4j driver is not available");
    }

    console.log(`${logPrefix} Managing relationship: ${validatedArgs.operation}`);

    // Create Neo4j session with WRITE access mode
    session = neo4jDriver.session({
      defaultAccessMode: 'WRITE',
      database: 'neo4j',
      fetchSize: 1000
    });

    let query = '';
    let params: Record<string, any> = {};

    // Build query based on operation type
    switch (validatedArgs.operation) {
      case 'create':
        query = buildCreateRelationshipQuery(validatedArgs);
        params = buildCreateRelationshipParams(validatedArgs);
        break;

      case 'update':
        query = buildUpdateRelationshipQuery(validatedArgs);
        params = buildUpdateRelationshipParams(validatedArgs);
        break;

      case 'delete':
        query = buildDeleteRelationshipQuery(validatedArgs);
        params = buildDeleteRelationshipParams(validatedArgs);
        break;

      default:
        throw new McpError(ErrorCode.InvalidParams, `Unsupported operation: ${validatedArgs.operation}`);
    }

    console.log(`${logPrefix} Executing query:`, query);
    console.log(`${logPrefix} With params:`, params);

    try {
      // Execute relationship management query
      const result = await session.run(query, params);
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

      // Return structured response with operation confirmation
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            operation: validatedArgs.operation,
            recordCount: records.length,
            records: records,
            operationConfirmed: records.length > 0
          }, null, 2)
        }]
      };
    } catch (queryError: any) {
      console.error(`${logPrefix} Error executing relationship query:`, queryError);
      throw new McpError(ErrorCode.InternalError, `Error executing Neo4j relationship query: ${queryError.message || 'Unknown error'}`);
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

    throw handleError(error, "manageBimbaRelationships");
  }
}

/**
 * Build Cypher query for creating relationships
 * Pure relationship management - works with any nodes that have bimbaCoordinate property
 */
function buildCreateRelationshipQuery(args: any): string {
  const safeRelationType = String(args.relationshipType).replace(/[^a-zA-Z0-9_]/g, '');

  // Handle both bimbaCoordinate and node-ID formats
  const sourceMatch = args.sourceCoordinate.startsWith('node-')
    ? `MATCH (source) WHERE toString(id(source)) = $sourceId`
    : `MATCH (source) WHERE source.bimbaCoordinate = $sourceCoordinate`;

  const targetMatch = args.targetCoordinate.startsWith('node-')
    ? `MATCH (target) WHERE toString(id(target)) = $targetId`
    : `MATCH (target) WHERE target.bimbaCoordinate = $targetCoordinate`;

  return `
    ${sourceMatch}
    ${targetMatch}
    CREATE (source)-[r:${safeRelationType}]->(target)
    SET r += $relationshipProperties
    SET r.createdAt = datetime()
    RETURN source, target, r,
           true as sourceFound,
           true as targetFound,
           true as relationshipCreated
  `;
}

/**
 * Build parameters for creating relationships
 * Handles both bimbaCoordinate and node-ID formats
 */
function buildCreateRelationshipParams(args: any): Record<string, any> {
  const params: Record<string, any> = {
    relationshipProperties: args.relationshipProperties || {}
  };

  // Handle source coordinate/ID
  if (args.sourceCoordinate.startsWith('node-')) {
    params.sourceId = args.sourceCoordinate.replace('node-', '');
  } else {
    params.sourceCoordinate = args.sourceCoordinate;
  }

  // Handle target coordinate/ID
  if (args.targetCoordinate.startsWith('node-')) {
    params.targetId = args.targetCoordinate.replace('node-', '');
  } else {
    params.targetCoordinate = args.targetCoordinate;
  }

  return params;
}

/**
 * Build Cypher query for updating relationships
 * Pure relationship management - works with any nodes
 */
function buildUpdateRelationshipQuery(args: any): string {
  const safeRelationType = String(args.relationshipType).replace(/[^a-zA-Z0-9_]/g, '');

  // Handle both bimbaCoordinate and node-ID formats
  const sourceMatch = args.sourceCoordinate.startsWith('node-')
    ? `(source) WHERE toString(id(source)) = $sourceId`
    : `(source) WHERE source.bimbaCoordinate = $sourceCoordinate`;

  const targetMatch = args.targetCoordinate.startsWith('node-')
    ? `(target) WHERE toString(id(target)) = $targetId`
    : `(target) WHERE target.bimbaCoordinate = $targetCoordinate`;

  return `
    MATCH ${sourceMatch}-[r:${safeRelationType}]->${targetMatch}
    SET r += $relationshipProperties
    SET r.updatedAt = datetime()
    RETURN source, target, r,
           true as relationshipFound,
           true as relationshipUpdated
  `;
}

/**
 * Build parameters for updating relationships
 * Handles both bimbaCoordinate and node-ID formats
 */
function buildUpdateRelationshipParams(args: any): Record<string, any> {
  const params: Record<string, any> = {
    relationshipProperties: args.relationshipProperties || {}
  };

  // Handle source coordinate/ID
  if (args.sourceCoordinate.startsWith('node-')) {
    params.sourceId = args.sourceCoordinate.replace('node-', '');
  } else {
    params.sourceCoordinate = args.sourceCoordinate;
  }

  // Handle target coordinate/ID
  if (args.targetCoordinate.startsWith('node-')) {
    params.targetId = args.targetCoordinate.replace('node-', '');
  } else {
    params.targetCoordinate = args.targetCoordinate;
  }

  return params;
}

/**
 * Build Cypher query for deleting relationships
 * Pure relationship management - works with any nodes
 */
function buildDeleteRelationshipQuery(args: any): string {
  const safeRelationType = String(args.relationshipType).replace(/[^a-zA-Z0-9_]/g, '');

  // Handle both bimbaCoordinate and node-ID formats
  const sourceMatch = args.sourceCoordinate.startsWith('node-')
    ? `(source) WHERE toString(id(source)) = $sourceId`
    : `(source) WHERE source.bimbaCoordinate = $sourceCoordinate`;

  const targetMatch = args.targetCoordinate.startsWith('node-')
    ? `(target) WHERE toString(id(target)) = $targetId`
    : `(target) WHERE target.bimbaCoordinate = $targetCoordinate`;

  return `
    MATCH ${sourceMatch}-[r:${safeRelationType}]->${targetMatch}
    DELETE r
    RETURN source, target,
           true as relationshipFound,
           true as relationshipDeleted
  `;
}

/**
 * Build parameters for deleting relationships
 * Handles both bimbaCoordinate and node-ID formats
 */
function buildDeleteRelationshipParams(args: any): Record<string, any> {
  const params: Record<string, any> = {};

  // Handle source coordinate/ID
  if (args.sourceCoordinate.startsWith('node-')) {
    params.sourceId = args.sourceCoordinate.replace('node-', '');
  } else {
    params.sourceCoordinate = args.sourceCoordinate;
  }

  // Handle target coordinate/ID
  if (args.targetCoordinate.startsWith('node-')) {
    params.targetId = args.targetCoordinate.replace('node-', '');
  } else {
    params.targetCoordinate = args.targetCoordinate;
  }

  return params;
}
