# 🔮 BPMCP: Universal Knowledge Operations Platform

**Bimba-Pratibimba Memory MCP Server**
*A Comprehensive Model Context Protocol Server for Multi-Database Knowledge Operations*

BPMCP serves as the **unified operational heart** of the entire Epi-Logos knowledge ecosystem, providing centralized access to all memory systems, databases, and external services. This TypeScript-based MCP server orchestrates operations across **Neo4j**, **Qdrant**, **MongoDB**, **Notion**, and **web services**, creating a seamless interface for complex knowledge workflows.

## **Architectural Philosophy: Universal Memory Orchestration**

The BPMCP embodies the principle of **unified knowledge operations** - all data interactions flow through a single, intelligent center that maintains consistency, enables cross-database relationships, and provides a coherent interface for diverse knowledge operations. It serves as the **operational foundation** where multiple data paradigms (graph, vector, document, structured) work in harmony.

---

## **🎯 Comprehensive Tool Ecosystem**

BPMCP provides **28+ specialized tools** organized into seven operational categories, enabling sophisticated cross-database workflows and knowledge operations:

### **🔮 Bimba Tools (Neo4j Graph Operations)**
Core knowledge graph operations for the foundational Bimba structure:

#### **`queryBimbaGraph`** - Graph Queries (Enhanced)
- **Purpose**: Query the Neo4j knowledge graph with flexible Cypher support, now with enhanced capabilities for deeper and more accurate structural retrieval.
- **Access Mode**: `READ` - Safe exploration and data retrieval
- **Features**: Complex graph traversals, relationship analysis, coordinate resolution, and improved structural accuracy.
- **Returns**: Structured graph data with nodes, relationships, and metadata, enabling direct integration into agent-driven development processes (Meta-Techne loop).

#### **`updateBimbaGraph`** - Graph Modifications ⭐
- **Purpose**: Write operations for knowledge graph updates
- **Access Mode**: `WRITE` - Precise modifications with transaction safety
- **Features**: Property updates, relationship creation/deletion, multi-coordinate operations
- **Safeguards**: Automatic value sanitization, error handling, rollback support

#### **`bimbaKnowing`** - Semantic Search (Enhanced)
- **Purpose**: Vector-powered semantic search across the knowledge graph, now with enhanced capabilities for deeper and more accurate semantic retrieval.
- **Technology**: Embedding similarity with graph structure awareness and advanced semantic matching.
- **Features**: Context-aware search, coordinate-based filtering, improved relevance scoring, and more reliable semantic retrieval.
- **Integration**: Supports LLM-guided knowledge discovery and exploration, enabling direct integration into agent-driven development processes (Meta-Techne loop).

#### **`generateBimbaEmbeddings`** - Vector Management
- **Purpose**: Generate and manage vector embeddings for graph nodes
- **Technology**: Advanced embedding models with Neo4j vector indexing
- **Features**: Batch processing, incremental updates, semantic clustering
- **Applications**: Search optimization, knowledge mapping, relationship discovery

#### **`resolveBimbaCoordinate`** - Coordinate Resolution
- **Purpose**: Resolve Bimba coordinates to associated Notion pages and metadata
- **Features**: Coordinate validation, URL generation, cross-system linking
- **Integration**: Bridges graph coordinates with external systems

### **🌊 Pratibimba Tools (Vector Search Operations)**
Vector-based operations for semantic context and similarity:

#### **`searchPratibimbaContext`** - Vector Search
- **Purpose**: Semantic search across Qdrant vector collections
- **Technology**: High-performance vector similarity with metadata filtering
- **Features**: Threshold-based filtering, collection targeting, metadata inclusion
- **Applications**: Context retrieval, semantic clustering, content discovery

### **🧠 Graphiti Tools (Temporal Knowledge Graph Operations)**
Dynamic memory operations with Bimba coordinate integration:

#### **`addGraphitiEpisode`** - Episode Creation ⭐
- **Purpose**: Add episodes to Graphiti's temporal knowledge graph with coordinate context
- **Features**: Multi-format support (text, JSON, message), coordinate-aware grouping, QL variant integration
- **Technology**: HTTP client integration with Graphiti MCP server
- **Applications**: Dynamic memory creation, context-aware episode storage, temporal knowledge building

#### **`searchGraphitiEntities`** - Entity Search
- **Purpose**: Search for entity nodes with Bimba coordinate filtering
- **Features**: Coordinate-based filtering, entity type targeting, relationship context
- **Integration**: QL-aligned search with coordinate hierarchy awareness
- **Applications**: Entity discovery, relationship mapping, coordinate-specific context retrieval

#### **`searchGraphitiFacts`** - Relationship Search
- **Purpose**: Search for facts (relationships) between entities with coordinate filtering
- **Features**: Relationship discovery, temporal context, coordinate-aware filtering
- **Technology**: Advanced fact retrieval with coordinate integration
- **Applications**: Relationship analysis, temporal fact discovery, coordinate-based relationship mapping

#### **`getGraphitiContext`** - Dynamic Context Retrieval ⭐
- **Purpose**: Get comprehensive dynamic context for Bimba coordinates from Graphiti
- **Features**: Multi-depth context retrieval, related coordinate discovery, entity/fact/episode aggregation
- **Integration**: Coordinate hierarchy awareness, parent-child relationship mapping
- **Applications**: Coordinate-centric memory retrieval, dynamic context building, cross-coordinate analysis

#### **`getGraphitiEpisodes`** - Episode Retrieval
- **Purpose**: Get recent episodes with coordinate filtering and temporal context
- **Features**: Coordinate-based filtering, temporal ordering, group-based organization
- **Technology**: Enhanced episode retrieval with coordinate awareness
- **Applications**: Recent memory access, coordinate-specific episode history, temporal context building

#### **`deleteGraphitiEpisode`** - Episode Management
- **Purpose**: Delete episodes from Graphiti's temporal knowledge graph
- **Features**: UUID-based deletion, safe removal with validation
- **Applications**: Memory cleanup, episode lifecycle management

#### **`deleteGraphitiEntityEdge`** - Relationship Management
- **Purpose**: Delete entity relationships from the temporal graph
- **Features**: UUID-based edge deletion, relationship cleanup
- **Applications**: Relationship management, graph maintenance

#### **`getGraphitiEntityEdge`** - Relationship Retrieval
- **Purpose**: Get specific entity relationships by UUID
- **Features**: Detailed relationship data, temporal context
- **Applications**: Relationship analysis, edge inspection

#### **`clearGraphitiGraph`** - Graph Management
- **Purpose**: Clear all data from Graphiti's temporal knowledge graph
- **Features**: Complete graph reset with confirmation requirements
- **Applications**: Development reset, clean slate operations

#### **`getGraphitiStatus`** - Server Status
- **Purpose**: Check Graphiti MCP server status and Neo4j connection
- **Features**: Health monitoring, connection validation
- **Applications**: System monitoring, troubleshooting, integration validation

### **📄 Document Tools (MongoDB Operations)**
Comprehensive document management and lifecycle operations:

#### **`listDocuments`** - Document Discovery
- **Purpose**: Query and list documents with flexible filtering
- **Features**: Pagination, sorting, projection, coordinate-based filtering
- **Integration**: Supports document workflow management

#### **`getDocumentById`** - Document Retrieval
- **Purpose**: Retrieve specific documents by ID with full metadata
- **Features**: Version history, analysis status, coordinate associations
- **Applications**: Document editing, analysis preparation, status tracking

#### **`listDocumentsByCoordinate`** - Coordinate-Based Listing
- **Purpose**: Find all documents associated with specific Bimba coordinates
- **Features**: Coordinate filtering, relationship mapping, bulk operations
- **Integration**: Supports coordinate-centric workflows

#### **`storeDocument`** - Document Creation
- **Purpose**: Store new documents with metadata and coordinate associations
- **Features**: Automatic versioning, metadata validation, coordinate linking
- **Workflow**: Supports upload, analysis preparation, and crystallization flows

#### **`updateDocument`** - Document Modification
- **Purpose**: Update document content, metadata, and status
- **Features**: Version tracking, status management, coordinate updates
- **Applications**: Analysis results, crystallization status, content refinement

#### **`deleteDocument`** - Document Removal
- **Purpose**: Safe document deletion with relationship cleanup
- **Features**: Cascade handling, backup creation, audit trails
- **Safeguards**: Confirmation requirements, relationship validation

#### **`startDocumentAnalysis`** - Analysis Initiation
- **Purpose**: Trigger document analysis workflows with context
- **Features**: Target coordinate specification, graph data integration
- **Integration**: Connects to analysis pipeline and status tracking

### **🌐 Notion Tools (Structured Knowledge Operations)**
Notion integration for crystallized knowledge management:

#### **`queryNotion`** - Notion Search
- **Purpose**: Search Notion databases and pages with flexible queries
- **Features**: Database filtering, property queries, relationship traversal
- **Integration**: Supports crystallization workflows and content discovery

#### **`getNotionPageProperties`** - Property Retrieval
- **Purpose**: Extract properties and metadata from Notion pages
- **Features**: Property validation, file extraction, relationship mapping
- **Applications**: Sync operations, content analysis, metadata extraction

#### **`appendNotionBlock`** - Content Addition
- **Purpose**: Add structured content blocks to Notion pages
- **Features**: Rich text support, block type validation, formatting preservation
- **Integration**: Supports crystallization and content publishing workflows

#### **`crystallizeToNotion`** - Knowledge Crystallization
- **Purpose**: Transform analyzed content into structured Notion pages
- **Features**: Coordinate linking, property mapping, relationship establishment
- **Workflow**: Core crystallization process for knowledge transformation

### **🌐 Web Tools (External Research Operations)**
Web-based research and integration capabilities:

#### **`searchWeb`** - Web Search
- **Purpose**: Search the web for information with content extraction
- **Features**: Multi-source search, content filtering, result ranking
- **Integration**: Supports research workflows and knowledge expansion

#### **`researchAndIntegrate`** - Research Workflows
- **Purpose**: Comprehensive research with automatic integration
- **Features**: Multi-step research, source validation, knowledge synthesis
- **Applications**: Topic exploration, fact verification, knowledge expansion

### **📊 MongoDB Tools (General Database Operations)**
Direct MongoDB operations for flexible data management:

#### **`getMongoContext`** - Database Queries
- **Purpose**: Direct MongoDB queries with flexible collection access
- **Features**: Complex queries, aggregation support, projection control
- **Applications**: Analytics, reporting, cross-collection operations

### **🔄 System Tools (Infrastructure Operations)**
Core system operations and communication:

#### **`broadcastEvent`** - Event Broadcasting
- **Purpose**: WebSocket-based event distribution to connected clients
- **Features**: Real-time notifications, cache invalidation, system coordination
- **Architecture**: Unified communication layer for distributed operations

---

## **🏗️ Technical Architecture**

### **WebSocket Transport Layer**
- **Custom WebSocket Server**: Enhanced MCP transport for real-time operations
- **Client Integration**: Seamless connection with Epii frontend and backend services
- **Message Routing**: Intelligent tool dispatch and response handling
- **Error Handling**: Comprehensive error propagation and recovery

### **Database Integration**
- **Neo4j Driver**: Direct connection to the sacred Bimba knowledge graph
- **Connection Management**: Robust session handling with proper cleanup
- **Transaction Safety**: ACID compliance for all write operations
- **Performance Optimization**: Connection pooling and query optimization

### **Tool Architecture**
```typescript
// Unified tool interface
interface Tool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}

// Centralized handler registry
const handlers: Record<string, ToolHandler> = {
  "queryBimbaGraph": handleQueryBimbaGraph,
  "updateBimbaGraph": handleUpdateBimbaGraph,  // NEW
  "bimbaKnowing": handleBimbaKnowing,
  "generateBimbaEmbeddings": handleGenerateBimbaEmbeddings,
  "broadcastEvent": handleBroadcastEvent
};
```

---

## **🚀 Development & Deployment**

### **Build Process**
```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Development with auto-rebuild
npm run watch

# Start the server
node build/index.js
```

### **Integration with Epi-Logos Ecosystem**
The BPMCP server serves as the central data layer for the entire Epi-Logos system:

1. **Backend Services** (`epii_app/friendly-file-backend/services/bpWebSocketClient.mjs`)
   - Document analysis pipelines
   - Agent subsystem operations
   - Cross-database workflows

2. **API Layer** (`/api/bpmcp/call-tool` endpoints)
   - RESTful tool access
   - Authentication and validation
   - Error handling and logging

3. **Frontend Applications** (Direct tool integration)
   - React components for document management
   - Visualization systems for graph data
   - Real-time updates via WebSocket events

4. **Agent Systems** (Multi-agent coordination)
   - Epii agent for analysis and crystallization
   - Nara agent for personalized interactions
   - Cross-agent memory sharing and coordination

5. **External Integrations** (Third-party services)
   - Notion workspace synchronization
   - Web research and content ingestion
   - Vector search and semantic operations

### **Configuration**
```typescript
// Server configuration
const server = new Server({
  name: "bimba-pratibimba-memory-mcp",
  version: "0.1.0"
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});
```

---

## **🔄 Operational Flow**

### **Universal Knowledge Operations**
1. **Request Initiation**: Frontend, backend, or agent initiates tool call
2. **WebSocket Routing**: Request routed to BPMCP WebSocket server
3. **Tool Dispatch**: BPMCP selects appropriate handler based on tool name
4. **Database Coordination**: Handler coordinates across multiple databases as needed
5. **Response Assembly**: Results aggregated and formatted for return
6. **Event Broadcasting**: Optional system-wide notifications for cache invalidation
7. **Client Update**: Requesting system updates with new data and state

### **Example Workflows**

#### **Document Analysis Workflow**
```typescript
// 1. Store document
await bpmcp.callTool('storeDocument', {
  document: { textContent: content, metadata: { source: 'upload' } },
  targetCoordinate: '#5-2-1'
});

// 2. Start analysis
await bpmcp.callTool('startDocumentAnalysis', {
  documentId: docId,
  targetCoordinate: '#5-2-1',
  graphData: bimbaContext
});

// 3. Search for context
const context = await bpmcp.callTool('searchPratibimbaContext', {
  query: 'semantic analysis context',
  limit: 10,
  threshold: 0.7
});

// 4. Crystallize results
await bpmcp.callTool('crystallizeToNotion', {
  coordinate: '#5-2-1',
  properties: analysisResults,
  relations: relatedCoordinates
});
```

#### **Cross-Database Research Workflow**
```typescript
// 1. Web research
const webResults = await bpmcp.callTool('searchWeb', {
  query: 'quantum consciousness research',
  limit: 5,
  includeContent: true
});

// 2. Find related Bimba coordinates
const bimbaContext = await bpmcp.callTool('bimbaKnowing', {
  query: 'consciousness quantum mechanics',
  contextDepth: 3,
  focusCoordinate: '#2-3-4'
});

// 3. Store research document
await bpmcp.callTool('storeDocument', {
  document: { textContent: synthesizedContent },
  targetCoordinate: '#2-3-4'
});

// 4. Update knowledge graph
await bpmcp.callTool('updateBimbaGraph', {
  query: 'MATCH (n) WHERE n.bimbaCoordinate = $coord SET n.researchStatus = $status',
  params: { coord: '#2-3-4', status: 'updated' }
});
```

#### **Notion Synchronization Workflow**
```typescript
// 1. Query Notion for updates
const notionPages = await bpmcp.callTool('queryNotion', {
  database: 'coordinates',
  filter: { lastModified: { after: lastSync } }
});

// 2. Resolve coordinates
for (const page of notionPages) {
  const coordinate = await bpmcp.callTool('resolveBimbaCoordinate', {
    targetCoordinate: page.coordinate
  });

  // 3. Update graph with Notion changes
  await bpmcp.callTool('updateBimbaGraph', {
    query: 'MATCH (n) WHERE n.bimbaCoordinate = $coord SET n += $props',
    params: { coord: page.coordinate, props: page.properties }
  });
}
```

---

## **🌟 Key Achievements**

### **✅ Universal Data Orchestration**
- **Multi-Database Coordination**: Seamless operations across Neo4j, Qdrant, MongoDB, Notion, and Graphiti
- **28+ Specialized Tools**: Comprehensive coverage of all knowledge operations including temporal memory
- **Cross-System Workflows**: Complex operations spanning multiple data paradigms
- **Unified Interface**: Consistent tool calling across all system components
- **Temporal Memory Integration**: Dynamic knowledge graph operations with coordinate-aware context

### **✅ Advanced Knowledge Operations**
- **Graph + Vector Fusion**: Combines structural and semantic search capabilities
- **Document Lifecycle Management**: Complete document workflows from upload to crystallization
- **Coordinate-Based Organization**: Bimba coordinate system integration across all tools
- **Real-time Synchronization**: Live updates between internal systems and external services

### **✅ Robust Infrastructure**
- **WebSocket Transport**: Enhanced MCP with real-time bidirectional communication
- **Transaction Safety**: ACID compliance with proper rollback and error handling
- **Event Broadcasting**: System-wide notifications and cache invalidation
- **Performance Optimization**: Efficient operations designed for high-frequency use

### **✅ Extensible Architecture**
- **Modular Tool System**: Easy addition of new tools and capabilities
- **Service Integration**: Pluggable external services (Notion, web APIs, embeddings)
- **Agent Coordination**: Multi-agent memory sharing and workflow coordination
- **Cross-Application Usage**: Reusable across different applications and contexts

---

## **📋 Development Notes**

### **Tool Development Pattern**
```typescript
// 1. Define schema
export const ToolNameSchema = z.object({
  param: z.string().describe("Parameter description")
});

// 2. Create tool definition
export const toolNameTool: Tool = {
  name: "toolName",
  description: "Tool description",
  inputSchema: zodToJsonSchema(ToolNameSchema)
};

// 3. Implement handler
export async function handleToolName(dependencies: ToolDependencies, args: any) {
  const validatedArgs = ToolNameSchema.parse(args);
  // Implementation...
}
```

### **Database Access**
- **Neo4j Sessions**: Always use proper session management with try/finally blocks
- **Access Modes**: `READ` for queries, `WRITE` for modifications
- **Error Handling**: Specific Neo4j error code mapping to meaningful messages

---

*The BPMCP serves as the sacred operational heart where mathematical precision meets transcendent functionality, enabling the Epii system to honor both the technical requirements and philosophical essence of knowledge operations.*
