# 0_anuttara Subsystem

## Bimba Tech Architecture Alignment
- **#5-4-0 (Bimba Graph)**
- Integrates with Neo4j graph database via the B-P MCP service
- Represents the Agent (0000)=(0/1) (Being/Prakasa-Vimarsa)

## Overview
The 0_anuttara subsystem is responsible for the foundational database connections and core services. It provides the "void" from which all other subsystems emerge, handling the fundamental data storage and retrieval operations.

## QL Structure

### 0_foundation
Contains database connection configurations and constants, including:
- Neo4j connection settings
- Qdrant connection settings
- MongoDB connection settings
- WebSocket connection settings

### 1_utils
Contains utility functions for database operations, including:
- Graph query utilities
- Data transformation utilities
- Connection management utilities

### 2_services
Contains core services for database operations, including:
- bpMCPService - Bimba-Pratibimba MCP WebSocket client
- neo4jService - Neo4j graph database service
- qdrantService - Qdrant vector database service
- mongodbService - MongoDB document database service

### 3_models
Contains data models for database entities, including:
- BimbaNode - Neo4j node model
- BimbaRelation - Neo4j relation model
- VectorEmbedding - Qdrant vector model
- DocumentMetadata - MongoDB document model

### 4_controllers
Contains controllers for database operations, including:
- GraphController - Neo4j graph operations
- VectorController - Qdrant vector operations
- DocumentController - MongoDB document operations

### 5_integration
Contains integration components that bring together multiple services, including:
- DatabaseIntegration - Unified database access
- MCP Integration - Unified MCP service access

## Current Implementation Status

Most of the functionality is currently implemented in:
- `/services/bpMCPService.mjs` - Bimba-Pratibimba MCP WebSocket client
- `/services/neo4j.service.mjs` - Neo4j graph database service
- `/services/qdrant.service.mjs` - Qdrant vector database service

The subsystem directory structure is being established to gradually migrate these components to their proper Bimba-aligned locations.

## Usage

To use the bpMCPService:

```javascript
import bpMCPService from '../services/bpMCPService.mjs';

// Query the Bimba graph
const query = `
  MATCH (n {bimbaCoordinate: '#5-2-1'})
  RETURN n
`;
const result = await bpMCPService.queryBimbaGraph(query);
```

To use the Neo4j service:

```javascript
import neo4jService from '../services/neo4j.service.mjs';

// Execute a Cypher query
const result = await neo4jService.executeCypher(
  'MATCH (n) RETURN n LIMIT 10'
);
```

## Key Responsibilities

1. **Database Connections** - Establish and maintain connections to Neo4j, Qdrant, and MongoDB
2. **WebSocket Communication** - Communicate with the B-P MCP service via WebSocket
3. **Graph Operations** - Execute Cypher queries against the Neo4j database
4. **Vector Operations** - Store and retrieve vector embeddings from Qdrant
5. **Document Operations** - Store and retrieve documents from MongoDB
6. **Data Transformation** - Transform data between different formats and structures
7. **Connection Management** - Handle connection errors, retries, and reconnections

## Integration with Other Subsystems

- Provides graph data to 1_paramasiva for pipeline processing
- Provides vector data to 2_parashakti for semantic search
- Provides document data to 3_mahamaya for symbolic transformation
- Provides API endpoints to 4_nara for client access
- Provides Notion integration to 5_epii for agent functionality
