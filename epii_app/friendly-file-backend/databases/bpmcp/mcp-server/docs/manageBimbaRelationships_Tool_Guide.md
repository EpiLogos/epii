# manageBimbaRelationships Tool Guide

## Overview

The `manageBimbaRelationships` tool is a pure relationship management tool designed to create, update, and delete relationships between any nodes in the Neo4j graph database, regardless of node labels or properties. It works with nodes identified by their `bimbaCoordinate` property or node IDs.

## Tool Definition

```typescript
{
  name: "manageBimbaRelationships",
  description: "Pure relationship management tool - create, update, or delete relationships between any nodes regardless of labels. Works with nodes identified by bimbaCoordinate property or node IDs.",
  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["create", "update", "delete"],
        description: "Operation to perform on the relationship."
      },
      sourceCoordinate: {
        type: "string", 
        description: "Bimba coordinate of the source node (e.g., '#5-2') or node ID (e.g., 'node-123')."
      },
      targetCoordinate: {
        type: "string",
        description: "Bimba coordinate of the target node (e.g., '#5-2-1') or node ID (e.g., 'node-456')."
      },
      relationshipType: {
        type: "string",
        description: "Type of relationship (e.g., 'HAS_INTERNAL_COMPONENT', 'RELATES_TO')."
      },
      relationshipProperties: {
        type: "object",
        description: "Optional properties to set on the relationship.",
        optional: true
      }
    },
    required: ["operation", "sourceCoordinate", "targetCoordinate", "relationshipType"]
  }
}
```

## Core Features

### 1. Pure Relationship Management
- Works with **any nodes** regardless of labels
- No restrictions on node types or properties
- Focuses solely on relationship operations

### 2. Flexible Node Identification
- **Coordinate-based**: Uses `bimbaCoordinate` property (e.g., `#1-2-3`)
- **ID-based**: Uses Neo4j node IDs (e.g., `node-123`)
- Automatic detection and handling of both formats

### 3. Comprehensive Operations
- **Create**: Establish new relationships between nodes
- **Update**: Modify properties of existing relationships
- **Delete**: Remove relationships between nodes

## Usage Examples

### Creating Relationships

#### Coordinate-based Creation
```javascript
await bpMCPService.callTool('manageBimbaRelationships', {
  operation: 'create',
  sourceCoordinate: '#1-2',
  targetCoordinate: '#1-2-3',
  relationshipType: 'HAS_INTERNAL_COMPONENT',
  relationshipProperties: {
    strength: 0.85,
    createdBy: 'ag-ui-system',
    context: 'document-analysis'
  }
});
```

#### Node ID-based Creation
```javascript
await bpMCPService.callTool('manageBimbaRelationships', {
  operation: 'create',
  sourceCoordinate: 'node-123',
  targetCoordinate: 'node-456', 
  relationshipType: 'RELATES_TO',
  relationshipProperties: {
    semantic_similarity: 0.92,
    discovered_via: 'llm-analysis'
  }
});
```

#### Mixed Format Creation
```javascript
await bpMCPService.callTool('manageBimbaRelationships', {
  operation: 'create',
  sourceCoordinate: '#1-4',
  targetCoordinate: 'node-789',
  relationshipType: 'CONNECTS_TO',
  relationshipProperties: {
    connection_type: 'semantic',
    bidirectional: true
  }
});
```

### Updating Relationships

```javascript
await bpMCPService.callTool('manageBimbaRelationships', {
  operation: 'update',
  sourceCoordinate: '#1-2',
  targetCoordinate: '#1-2-3',
  relationshipType: 'HAS_INTERNAL_COMPONENT',
  relationshipProperties: {
    strength: 0.95,
    lastUpdated: new Date().toISOString(),
    confidence: 'high'
  }
});
```

### Deleting Relationships

```javascript
await bpMCPService.callTool('manageBimbaRelationships', {
  operation: 'delete',
  sourceCoordinate: '#1-2',
  targetCoordinate: '#1-2-3',
  relationshipType: 'HAS_INTERNAL_COMPONENT'
});
```

## Generated Cypher Queries

### Create Operation
```cypher
// For coordinate-based nodes
MATCH (source) WHERE source.bimbaCoordinate = $sourceCoordinate
MATCH (target) WHERE target.bimbaCoordinate = $targetCoordinate
CREATE (source)-[r:RELATIONSHIP_TYPE]->(target)
SET r += $relationshipProperties
SET r.createdAt = datetime()
RETURN source, target, r, true as sourceFound, true as targetFound, true as relationshipCreated

// For node ID-based nodes
MATCH (source) WHERE toString(id(source)) = $sourceId
MATCH (target) WHERE toString(id(target)) = $targetId
CREATE (source)-[r:RELATIONSHIP_TYPE]->(target)
SET r += $relationshipProperties
SET r.createdAt = datetime()
RETURN source, target, r, true as sourceFound, true as targetFound, true as relationshipCreated
```

### Update Operation
```cypher
// For coordinate-based nodes
MATCH (source) WHERE source.bimbaCoordinate = $sourceCoordinate-[r:RELATIONSHIP_TYPE]->(target) WHERE target.bimbaCoordinate = $targetCoordinate
SET r += $relationshipProperties
SET r.updatedAt = datetime()
RETURN source, target, r, true as relationshipFound, true as relationshipUpdated

// For node ID-based nodes  
MATCH (source) WHERE toString(id(source)) = $sourceId-[r:RELATIONSHIP_TYPE]->(target) WHERE toString(id(target)) = $targetId
SET r += $relationshipProperties
SET r.updatedAt = datetime()
RETURN source, target, r, true as relationshipFound, true as relationshipUpdated
```

### Delete Operation
```cypher
// For coordinate-based nodes
MATCH (source) WHERE source.bimbaCoordinate = $sourceCoordinate-[r:RELATIONSHIP_TYPE]->(target) WHERE target.bimbaCoordinate = $targetCoordinate
DELETE r
RETURN source, target, true as relationshipFound, true as relationshipDeleted

// For node ID-based nodes
MATCH (source) WHERE toString(id(source)) = $sourceId-[r:RELATIONSHIP_TYPE]->(target) WHERE toString(id(target)) = $targetId
DELETE r
RETURN source, target, true as relationshipFound, true as relationshipDeleted
```

## Response Format

### Successful Operation
```json
{
  "content": [{
    "type": "text", 
    "text": "{
      \"success\": true,
      \"operation\": \"create\",
      \"recordCount\": 1,
      \"records\": [
        {
          \"source\": { \"bimbaCoordinate\": \"#1-2\", \"name\": \"Source Node\" },
          \"target\": { \"bimbaCoordinate\": \"#1-2-3\", \"name\": \"Target Node\" },
          \"r\": {
            \"type\": \"HAS_INTERNAL_COMPONENT\",
            \"properties\": {
              \"strength\": 0.85,
              \"createdAt\": \"2024-01-15T10:30:00Z\"
            }
          },
          \"sourceFound\": true,
          \"targetFound\": true,
          \"relationshipCreated\": true
        }
      ],
      \"operationConfirmed\": true
    }"
  }]
}
```

### Failed Operation
```json
{
  "content": [{
    "type": "text",
    "text": "{
      \"success\": false,
      \"operation\": \"create\",
      \"recordCount\": 0,
      \"records\": [],
      \"operationConfirmed\": false,
      \"error\": \"Source node not found\"
    }"
  }]
}
```

## Integration with AG-UI

The tool integrates seamlessly with the AG-UI system for relationship management:

```javascript
// Frontend usage in BimbaUpdateOverlay
const relResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    toolName: 'manageBimbaRelationships',
    args: {
      operation: 'create',
      sourceCoordinate: selectedCoordinate,
      targetCoordinate: rel.targetCoordinate,
      relationshipType: rel.type,
      relationshipProperties: rel.properties || {}
    }
  })
});

const result = await relResponse.json();
console.log('Relationship operation result:', result);
```

## Error Handling

### Common Error Scenarios
1. **Node Not Found**: Source or target node doesn't exist
2. **Relationship Already Exists**: Attempting to create duplicate relationship
3. **Relationship Not Found**: Attempting to update/delete non-existent relationship
4. **Invalid Relationship Type**: Using invalid characters in relationship type
5. **Database Connection Issues**: Neo4j connectivity problems

### Error Response Examples
```json
{
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Source node with coordinate '#1-2-99' not found"
  }
}
```

## Best Practices

### 1. Node Identification
- Use `bimbaCoordinate` for Bimba nodes when available
- Use node IDs for non-coordinate nodes
- Ensure coordinates are properly formatted (e.g., `#1-2-3`)

### 2. Relationship Types
- Use descriptive, uppercase relationship types
- Follow Neo4j naming conventions (no spaces, use underscores)
- Be consistent with relationship type naming across the system

### 3. Properties
- Include meaningful metadata in relationship properties
- Add timestamps for audit trails
- Use consistent property naming conventions

### 4. Error Handling
- Always check the `operationConfirmed` field in responses
- Handle cases where nodes might not exist
- Implement retry logic for transient failures

### 5. Performance
- Batch multiple relationship operations when possible
- Use appropriate indexes on `bimbaCoordinate` properties
- Monitor query performance for large graphs
