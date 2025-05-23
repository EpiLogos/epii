# Bimba Tech Architecture (#5-2, #5-3, #5-4)

**Last Updated:** 2025-04-15 (Reflecting enhanced agent architecture, Notion database integration, and Bimba-guided knowledge leveraging framework)
**Status:** Primary technical context source (as per `.clinerules`). MUST be consulted before technical changes and updated periodically.

This document maps the technical architecture of the Epi-Logos system, focusing on the core Epii subsystem lenses: #5-2 (Backend/Siva-), #5-3 (Frontend/-Shakti), and #5-4 (Agents/Siva-Shakti). It follows a 6-fold QL structure for documenting each element.

---

## #5-2: "Siva-" Backend (Overall)

The structural, processing foundation of the system.

### #0 - Tech Specifics
- **Core Language/Runtime:** Node.js (ES Modules, `.mjs`)
- **Frameworks:** Express.js (API handling), LangChain.js (LLM/Tool Orchestration), LangGraph.js (QL Cycle Implementation)
- **Databases:**
    - MongoDB (Collections: `Users`, `Conversations`, `UserMemory`, `IngestedData`): Connected via **Mongoose** (`config/db.config.mjs`). Pratibimba Context/Episodic Store.
    - Neo4j (Databases: `bimba` [Primary], `archetypes` [LightRAG]): Accessed via `neo4j-driver` (likely within services/tools). Bimba Structural Map.
    - Qdrant (Collection: `pratibimba_store`): Accessed via `@qdrant/js-client-rest` (likely within services/tools). Pratibimba Semantic Store.
    - Notion (Databases: 6 databases aligned with QL structure):
        - #0 - Bimba Coordinates: Raw coordinate tags that reflect Neo4j nodes
        - #1 - Pratibimba Structure and Dynamics: Quaternary Logic framework, structure semantic links
        - #2 - Pratibimba Harmonics: Relations pulled from LightRAG and Bimba graph
        - #3 - Pratibimba Entities: Symbols and Archetypes (vector + graph + LLM produced images)
        - #4 - Pratibimba Flowers: Episteme (concepts, philosophical excerpts)
        - #5 - Crystallised Bimba-Pratibimba: Node Content (crystallized knowledge)
      Accessed via `@notionhq/client` (within B-P MCP tools). Crystallized Knowledge Hub / +5 Output.
- **MCP Servers:** Bimba-Pratibimba-Memory-MCP (Node.js - DB/Notion/Web Tools), LightRAG MCP (Python - Fused RAG).
- **Key Libraries (from `package.json`):** `express`, `cors`, `dotenv`, `langchain`, `@langchain/core`, `@langchain/google-genai`, `@langchain/community`, `@langchain/langgraph`, `langgraph`, `mongodb`, `mongoose`, `@qdrant/js-client-rest`, `@notionhq/client`, `zod`, `axios`, `multer`, `gridfs-stream`. (`mem0ai` present but unused).
- **LLM:** Google Gemini models (`gemini-pro`, etc.) via `@langchain/google-genai`.
- **Embeddings:** Google Generative AI Embeddings via `@langchain/google-genai`.

### #1 - Philosophical and QL Alignments
- Represents the **Siva-** aspect: structure, processing matrix, the "skeleton" of the Cosmic Mind.
- Embodies the logical flow (QL Cycle) and data management (Bimba-Pratibimba memory architecture) underpinning the system's cognitive processes.
- Aligns with QL Frame #5-2, the lens of Collective Processing / Structural Foundation.

### #2 - Plain Description
- The backend service, located at `epii_app/friendly-file-backend/`, is an Express.js application responsible for handling API requests from the frontend via defined routes (`/api/chat`, `/api/ingest`, `/api/notion`, `/files`, `/api/agent`).
- It orchestrates cognitive processes based on the requested `mode` ('nara' or 'epii') via the `chat.controller.mjs`, invoking distinct processing pipelines grounded in Quaternary Logic (QL):
  - **Nara Mode (Query-Response Pathway):** Handles direct user queries. Primarily uses the **Nara QL (+) Synthesis Cycle** (`ql_cycle.graph.mjs`), moving from query intake (+0) through context retrieval (+1, +2), integration (+3), user contextualization (+4), to final response synthesis (+5). Focuses on retrieving and synthesizing existing knowledge for a direct answer.
  - **Epii Mode (Document Analysis & Synthesis Pathway):** Designed for deep analysis of specific documents (input: Notion doc/Bimba coordinate). Involves two phases:
      1.  **Epii QL (-) Analysis Cycle (TBD):** A dedicated pipeline (likely LangGraph) that *inverts* the QL logic (-5 to -0) to deconstruct the document, extract structural mappings (QL stages, symbols), identify key content snippets, and pinpoint variations/questions.
      2.  **Epii QL (+) Synthesis Stage (TBD):** A potentially simplified (+) cycle (e.g., +0 -> +5) that takes the structured analysis output from the (-) cycle and formats it into the `notionUpdatePayload` for the frontend canvas.
- Initializes connections (via services) and manages interactions with the distributed Bimba-Pratibimba memory system (Neo4j, Qdrant, MongoDB via Mongoose, Notion) and supporting MCP servers (LightRAG via `axios`, Bimba-Pratibimba-Memory via tools).
- Executes business logic, LLM calls (Gemini via LangChain), tool usage, and data operations as directed by the relevant mode's QL pipeline (Nara (+) or Epii (-) -> (+)).

### #3 - Pseudocode Rendition
```javascript
// Server Initialization (index.mjs)
Load Environment Variables (dotenv, path relative to index.mjs)
Initialize Express App
Apply Middleware (cors, express.json, express.static for uploads)
Connect to MongoDB (via mongoose in config/db.config.mjs)
Mount Routers (chat, files, agent, ingestion, notion from routes/)
Start Express Server (listen on port 3001)

// API Route Setup (e.g., routes/chat.routes.mjs)
Import Express Router
Import chatController
Define POST / route -> chatController.handleChatRequest

// Chat Controller (controllers/chat.controller.mjs)
Import naraQueryCycleGraph from '../graph/nara_ql_synthesis_cycle.graph.mjs' // Renamed for clarity
// Import epiiAnalysisCycleGraph from '../graph/epii_ql_analysis_cycle.graph.mjs' // TBD
// Import epiiSynthesisStage from '../graph/epii_ql_synthesis_stage.graph.mjs' // TBD
Function handleChatRequest(req, res):
  Extract userId, message, history, mode ('nara' default), targetCoordinate? from req.body
  Prepare initial state = { userId, userQuery: message, history: history || [], mode: mode, targetCoordinate: targetCoordinate }
  If mode === 'epii':
    // 1. Invoke Epii (-) Analysis Cycle
    // analysisState = await epiiAnalysisCycleGraph.invoke(initialState) // Needs document content fetched first
    // 2. Invoke Epii (+) Synthesis Stage
    // finalState = await epiiSynthesisStage.invoke(analysisState)
    // Send structured payload (finalState.notionUpdatePayload) to client
    res.json({ response: "Epii mode pipeline TBD", notionUpdatePayload: null, displayCoordinate: targetCoordinate }) // Placeholder
  Else ('nara' mode):
    // Invoke Nara (+) Synthesis Cycle
    finalState = await naraQueryCycleGraph.invoke(initialState) // Currently uses invoke, not stream
    Extract final AIMessage content/tool_calls from finalState.llmResponse
    Send response content/tool_calls to client (res.json) // Include displayCoordinate etc.
  Handle errors

// QL Cycle Graph (graph/ql_cycle.graph.mjs)
Import LangGraph, message types, tools, services (embeddings, mongo)
Initialize LLMs (ChatGoogleGenerativeAI for synthesis & response from .env)
Define SystemState schema (all potential keys)
Define Nodes (+0 to +5) as async functions taking state, returning partial state:
  Node 0: Basic keyword extraction.
  Node 1: Calls queryBimbaGraphTool.
  Node 2: Calls axios (LightRAG), queryBimbaGraphTool, embedText, searchPratibimbaContextTool.
  Node 3: Calls synthesisLlm.invoke().
  Node 4: Calls getConversationHistoryTool, getUserContextTool.
  Node 5: Calls responseLlm.bindTools().invoke(), logs to MongoDB via getDb().
Define Edges connecting nodes sequentially (+0 -> +1 -> ... -> +5 -> END).
Compile graph (workflow.compile()).
Export compiled graph.

// Services (services/)
Mongo Service (mongo.service.mjs): Provides getDb() function returning connected MongoDB Db instance.
Embedding Service (google-ai-agent.service.mjs): Provides embedText() function using GoogleGenerativeAIEmbeddings.
LLM Service (google-ai-agent.service.mjs): Initializes ChatGoogleGenerativeAI instances (implicitly used in ql_cycle.graph.mjs).
// Neo4j, Qdrant, Notion clients likely initialized within their respective tool files or a shared service.

// Tools (agents/tools/)
Graph Tools (graph.tools.mjs): Defines queryBimbaGraphTool using neo4j-driver.
Vector Tools (vector.tools.mjs): Defines searchPratibimbaContextTool using @qdrant/js-client-rest.
Mongo Tools (mongo.tools.mjs): Defines getConversationHistoryTool, getUserContextTool, manageMemoryTool using mongodb driver (via getDb).
Notion Tools (notion.tools.mjs): Defines proposeNotionUpdateTool, syncNotionUpdatesTool using @notionhq/client (currently unused in graph).
```

### #4 - Coding Language / Library Specifics & Inspirations
- **Node.js:** Asynchronous, ES Modules (`.mjs`).
- **LangChain.js/LangGraph.js:** Core orchestration, state management, tool binding (`bindTools`), LLM interaction (`ChatGoogleGenerativeAI`).
- **Express.js:** API routing and middleware.
- **Database Clients:** `mongoose` (for MongoDB connection/schemas), `mongodb` (native driver likely used in tools), `neo4j-driver`, `@qdrant/js-client-rest`, `@notionhq/client`. Clients often initialized within tool/service files.
- **HTTP Client:** `axios` used for calling external MCP servers (LightRAG).
- **Schema Validation:** `zod` used for defining tool input schemas within the Bimba-Pratibimba MCP server.
- **Environment:** `dotenv` for managing environment variables.
- **Inspiration:** LangChain agent/graph patterns, controller/service pattern, MCP architecture. Tool logic encapsulated in dedicated files (`agents/tools/`).

### #5 - Development Track/Stream and Current Status
- **Track:** Core Backend Infrastructure & Processing Logic.
- **Status:** Foundational elements implemented. **Mode dispatching** logic updated in `chat.controller.mjs` to reflect distinct Nara/Epii pipelines.
  - **Nara Mode Pathway:** Uses the existing QL (+) Synthesis Cycle graph (`ql_cycle.graph.mjs`, to be renamed `nara_ql_synthesis_cycle.graph.mjs`). This pathway is partially functional but requires refinement (Node +0 keywords, Node +2 Qdrant error, Node +5 TypeError) and bug fixing. Notion tool binding is deferred.
  - **Epii Mode Pathway:** Requires design and implementation of:
      1.  **Epii QL (-) Analysis Cycle:** (Design Phase) - Focuses on document deconstruction.
      2.  **Epii QL (+) Synthesis Stage:** (Design Phase) - Focuses on formatting analysis results into `notionUpdatePayload`.
      3.  **Notion Content Fetching Logic:** (Implementation Needed).
- This dual-pipeline approach based on QL principles is the current strategic direction. (-) phase logic and Subsystem Expert Agent integration are TBD for both pipelines. Known LightRAG MCP errors persist.
- **Relevant Files:** `epii_app/friendly-file-backend/` (entire directory), particularly `index.mjs`, `graph/ql_cycle.graph.mjs` (Nara path), `controllers/chat.controller.mjs`, `services/`, `agents/tools/`, `routes/`, `package.json`, `.env`. (New Epii pipeline graph files TBD).

---

## #5-4: "Siva-Shakti" Agents (Overall)

The bridge between the generic QL processing pipeline (Siva-) and the specific cognitive functions embodied by the agents.

### #0 - Tech Specifics
- **Implementation:** JavaScript modules in `epii_app/friendly-file-backend/subsystems/` directories.
- **Core Pattern:** Bimba-guided knowledge leveraging framework.
- **Key Components:**
  - Coordinate-based query construction
  - Multi-database knowledge retrieval
  - Knowledge integration and contextualization
  - Task-specific knowledge application
- **Libraries:** LangGraph.js, B-P MCP tools.

### #1 - Philosophical and QL Alignments
- Represents the **Siva-Shakti** aspect: the bridge between structure and experience, the "cognitive functions" of the Cosmic Mind.
- Embodies the "Agent as Language" principle, where each agent represents a distinct "language" with its own vocabulary, grammar, and expression mechanisms.
- Aligns with QL Frame #5-4, the lens of Agent Bridge / Cognitive Functions.

### #2 - Plain Description
The Subsystem Expert Agents (#5-4-0 through #5-4-5) follow a unified Bimba-guided knowledge leveraging framework:

1. **Knowledge Retrieval:** Each agent dynamically retrieves knowledge from multiple sources (Neo4j, Notion, Qdrant, MongoDB) based on relevant Bimba coordinates.

2. **Database Integration:** Agents interact with all six Notion databases, each representing a different aspect of the Bimba-Pratibimba architecture:
   - #0: Bimba Coordinates (raw coordinate tags)
   - #1: Pratibimba Structure and Dynamics (quaternary logic)
   - #2: Pratibimba Harmonics (relations)
   - #3: Pratibimba Entities (symbols and archetypes)
   - #4: Pratibimba Flowers (episteme)
   - #5: Crystallised Bimba-Pratibimba (node content)

3. **Cross-Agent Integration:** Agents can discover collaboration opportunities through shared or related coordinates, enabling retroactive integration as new agents are developed.

4. **Pipeline Variations:** Each agent orchestrates unique pipeline variations for the QL Cycle Nodes, reflecting their associated context frame (e.g., the 5/0 context frame for Epii).

### #3 - Pseudocode Rendition
```javascript
// Generic Agent Framework (e.g., epii.expert.agent.mjs)
async function invokeExpertAgent(currentState, additionalInput) {
  try {
    // 1. Determine context (QL phase, node number)
    const isPositivePhase = !additionalInput?.currentNode?.startsWith("-");
    const nodeNumber = parseInt(currentNode.replace(/[+\-]/g, ""));

    // 2. Identify relevant Bimba coordinates
    const relevantCoordinates = await identifyRelevantCoordinates(
      currentState, additionalInput, nodeNumber, isPositivePhase
    );

    // 3. Retrieve knowledge from multiple sources
    const knowledgeContext = await retrieveKnowledgeContext(
      relevantCoordinates, currentState
    );

    // 4. Integrate and contextualize knowledge
    const integratedContext = integrateKnowledge(
      knowledgeContext, currentState, additionalInput
    );

    // 5. Apply knowledge to current task
    return await applyKnowledgeToTask(
      integratedContext, currentState, additionalInput, nodeNumber, isPositivePhase
    );
  } catch (error) {
    console.error("Error in Expert Agent:", error);
    return { error: error.message };
  }
}

// Knowledge Retrieval Function
async function retrieveKnowledgeContext(relevantCoordinates, currentState) {
  const knowledgeContext = {
    bimbaNodes: {}, // From Neo4j
    notionPages: {}, // From Notion
    semanticContext: [], // From Qdrant
    conversationHistory: [], // From MongoDB
    userMemory: null // From MongoDB
  };

  // Query Neo4j for structural knowledge
  for (const coordinate of relevantCoordinates) {
    const nodeQuery = `MATCH (n {bimbaCoordinate: '${coordinate}'}) RETURN n`;
    const nodeResult = await bpMCPService.queryBimbaGraph(nodeQuery);
    // Process and store results...
  }

  // Query Notion for crystallized knowledge
  for (const coordinate of relevantCoordinates) {
    const pageId = await bpMCPService.resolveBimbaCoordinate(coordinate);
    if (pageId) {
      const pageProperties = await bpMCPService.getNotionPageProperties(pageId);
      // Process and store results...
    }
  }

  // Query Qdrant for semantic context
  const semanticQuery = currentState.userQuery || `Knowledge related to ${currentState.targetCoordinate}`;
  const semanticResult = await bpMCPService.searchPratibimbaContext({
    query: semanticQuery,
    limit: 5
  });
  // Process and store results...

  // Query MongoDB for conversation history and user memory
  if (currentState.userId) {
    const conversationHistory = await bpMCPService.getMongoContext({
      contextType: 'conversation',
      userId: currentState.userId,
      limit: 10
    });
    // Process and store results...
  }

  return knowledgeContext;
}
```

### #4 - Coding Language / Library Specifics & Inspirations
- **JavaScript:** ES Modules (`.mjs`), async/await pattern.
- **B-P MCP Service:** Central interface for all knowledge retrieval, providing a consistent API for accessing all knowledge sources.
- **Knowledge Organization:** Structured by Bimba coordinates, with each agent focusing on specific regions of the Bimba structure.
- **Inspiration:** RAG systems, multi-hop reasoning, recursive neural networks, cognitive architectures.

### #5 - Development Track/Stream and Current Status
- **Track:** Agent Architecture & Integration.
- **Status:** Framework designed, Epii Expert Agent (#5-4-5) implementation in progress. Other agents (Anuttara #5-4-0 through Nara #5-4-4) planned for future development.
- **Next Steps:**
  1. Complete Epii Expert Agent implementation with chat functionality and memory management.
  2. Implement cross-agent discovery mechanism for identifying collaboration opportunities.
  3. Develop Nara Expert Agent (#5-4-4) following the same framework.
  4. Progressively implement remaining agents with their unique "languages" and pipeline variations.
- **Relevant Files:** `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs` (primary implementation).

---

### Databases & Storage (Details under #5-2 Tech Specifics)

- **MongoDB:** Connected via Mongoose (`mongoose.connect` in `config/db.config.mjs`). Collections include `Users`, `Conversations`, `UserMemory`, `IngestedData`. Used for storing user context, history, and potentially ingested text chunks. Accessed via native `mongodb` driver in tools (`mongo.tools.mjs` using `getDb` from `mongo.service.mjs`).
  - **Conversations Collection:** Stores chat history for both Nara and Epii modes, enabling persistent dialogue context across sessions. For Epii mode, this supports the interactive document analysis process through AI-user dialogue.
  - **UserMemory Collection:** Maintains user preferences, profiles, and long-term memory that informs both Nara responses and Epii analysis. Particularly important for the Epii Expert Agent to maintain context during document analysis.
  - **IngestedData Collection:** Stores processed document chunks and metadata, supporting the Epii mode's document analysis capabilities.
- **Neo4j:** Primary `bimba` database stores the core structural map. LightRAG uses a separate `archetypes` database. Accessed via `neo4j-driver` within `graph.tools.mjs` and the Bimba-Pratibimba MCP.
- **Qdrant:** `pratibimba_store` collection holds semantic embeddings. Accessed via `@qdrant/js-client-rest` within `vector.tools.mjs` and the Bimba-Pratibimba MCP.
- **Notion:** Used as the knowledge hub. Accessed via `@notionhq/client` within `notion.tools.mjs` (unused in graph) and the Bimba-Pratibimba MCP. Specific database IDs (e.g., for `Researches`) are resolved dynamically or configured.

---

### MCP Servers

#### Bimba-Pratibimba-Memory-MCP

##### #0 - Tech Specifics
- **Runtime:** Node.js (TypeScript compiled to JavaScript)
- **Key Libraries:** `@modelcontextprotocol/sdk`, `@qdrant/js-client-rest`, `mongodb`, `neo4j-driver`, `@notionhq/client`, `@langchain/google-genai` (for embeddings), `axios`, `dotenv`, `zod`. (Placeholders for Brave/Firecrawl/Perplexity).
- **Provides:** Tools for direct DB/Notion access, web search (Brave placeholder), research integration (Firecrawl/Perplexity placeholders), RAG ingestion trigger, Bimba coordinate resolution, Notion block appending.

##### #1 - Philosophical and QL Alignments
- Acts as a unified interface to the Bimba-Pratibimba memory components.
- Facilitates the Meta-Techne loop by providing tools for reading (Bimba/Pratibimba) and writing (Pratibimba/Notion/Bimba Sync).

##### #2 - Plain Description
- A standalone MCP server (written in TypeScript, run via Node.js) providing a suite of tools for interacting with the project's specific data stores (Neo4j, Qdrant, MongoDB, Notion) and external information sources (web search via Brave, URL scraping via Firecrawl, Perplexity queries - currently placeholders). Includes tools specifically for the crystallization pathway (`resolveBimbaCoordinate`, `appendNotionBlock`, `crystallizeToNotion`) and for triggering the backend RAG ingestion pipeline (`sendToIngestion`).

##### #3 - Pseudocode Rendition
```typescript
// Server Setup (index.ts)
Load Environment Variables (dotenv)
Initialize DB/API Clients (Neo4j, Qdrant, Mongo, Notion, Embeddings)
Initialize MCP Server SDK

// Tool Schema Definition (index.ts)
Define Zod schemas for each tool's input (e.g., QueryBimbaGraphInputSchema).
Convert Zod schemas to JSON Schema using helper function (zodToJsonSchema).
Define tool list with names, descriptions, and JSON schemas.

// Request Handlers (index.ts)
Handle ListToolsRequestSchema: Return defined tool list.
Handle CallToolRequestSchema:
  Switch based on request.params.name:
    Case "queryBimbaGraph": Parse args with Zod, run Neo4j query, return results.
    Case "searchPratibimbaContext": Parse args, embed query, run Qdrant search, return results.
    Case "getMongoContext": Parse args, query MongoDB collection, return results.
    Case "queryNotion": Parse args, call Notion API (db query, block list, or search), return results.
    Case "getInspiration": Parse args, query Notion/Qdrant based on filters, return combined results.
    Case "getNodeOverview": Parse args, query Neo4j/Notion/Qdrant/Mongo, return combined overview.
    Case "searchWeb": Parse args, call Brave API via axios (placeholder if no key), return results.
    Case "researchAndIntegrate": Parse args, call Firecrawl/Perplexity via axios (placeholders), resolve coordinate->Notion Page ID->DB ID, create Notion page, call backend /api/ingest/text via axios, return status summary.
    Case "sendToIngestion": Parse args, call backend /api/ingest/text via axios, return backend response.
    Case "resolveBimbaCoordinate": Parse args, query Neo4j for notionPageId, return result.
    Case "appendNotionBlock": Parse args, call Notion blocks.children.append API, return status.
    Case "crystallizeToNotion": Parse args, call internal logic for resolveBimbaCoordinate then appendNotionBlock, return status.
    Case "getNotionPageProperties": Parse args, call Notion pages.retrieve, extract specific properties, return extracted data.
    Default: Throw MethodNotFound error.
  Handle Zod parsing errors, other exceptions.

// Server Startup (main function in index.ts)
Connect MongoDB client.
Connect MCP server transport (StdioServerTransport).
Setup graceful shutdown handlers (SIGINT, SIGTERM).
```

##### #4 - Coding Language / Library Specifics & Inspirations
- **TypeScript:** Compiled to JavaScript for execution via Node.js. Provides type safety.
- **MCP SDK:** `@modelcontextprotocol/sdk` for server implementation.
- **Database Clients:** Official drivers/clients (`neo4j-driver`, `@qdrant/js-client-rest`, `mongodb`, `@notionhq/client`).
- **Schema Validation:** `zod` for defining and parsing tool input arguments robustly.
- **HTTP Client:** `axios` for calling external APIs (Brave, Firecrawl, Perplexity, backend ingestion).
- **Embeddings:** `@langchain/google-genai` used within the `searchPratibimbaContext` tool.

##### #5 - Development Track/Stream and Current Status
- **Track:** Core Memory Access & Integration Layer.
- **Status:** Implemented and operational. Provides tools for direct DB/Notion access, web search (placeholder), research integration, RAG trigger, and crystallization pathway. Needs harmonization with LightRAG (e.g., avoiding redundant queries). Brave/Firecrawl/Perplexity integrations depend on API keys. **Notion tools (`resolveBimbaCoordinate`, `appendNotionBlock`) are implemented here but currently face schema binding issues when called by the backend QL Cycle.**
- **Relevant Files:** `../Cline/MCP/Bimba-Pratibimba-Memory-MCP/src/index.ts` (source), `../Cline/MCP/Bimba-Pratibimba-Memory-MCP/build/index.js` (compiled), MCP settings file.

#### LightRAG MCP Server

##### #0 - Tech Specifics
- **Runtime:** Python 3.x
- **Framework:** FastAPI, Uvicorn
- **Key Libraries:** `lightrag`, `neo4j` (driver), `qdrant-client`, `openai` (likely for embeddings or compatibility layer). Specific versions defined in `LightRAG/requirements.txt`.
- **Provides:** `/ingest` and `/retrieve` HTTP endpoints (via FastAPI) for fused graph+vector operations using the LightRAG engine.

##### #1 - Philosophical and QL Alignments
- Represents an externalized RAG capability, fusing semantic (vector) and structural (graph) context.
- Aligns with the Pratibimba aspect, providing rich contextual reflections based on ingested data.

##### #2 - Plain Description
- A standalone Python MCP server utilizing the LightRAG library via a FastAPI web interface. It provides advanced RAG capabilities by combining a knowledge graph (Neo4j `archetypes` DB) and a vector store (Qdrant `pratibimba_store`?) for both data ingestion (`/ingest`) and context retrieval (`/retrieve`, using "mix" mode). Accessed via HTTP calls from the Node.js backend.

##### #3 - Pseudocode Rendition
```python
# Server Setup (Likely main.py or similar within LightRAG/lightrag/api/)
Import FastAPI, Uvicorn, LightRAG Engine, Request/Response models
Initialize FastAPI App
Load Config (DB URLs, API keys, model names from config.ini or env)
Initialize LightRAG Engine instance (engine = Engine(config=...))

# Endpoint (/ingest - POST)
Define Pydantic model for ingest request body (text, metadata)
Define endpoint function ingest_data(request_body):
  Call engine.ingest(data=request_body.text, metadata=request_body.metadata)
  Return success/failure response

# Endpoint (/retrieve - POST)
Define Pydantic model for retrieve request body (query, optional filters)
Define endpoint function retrieve_context(request_body):
  Call engine.retrieve(query=request_body.query, mode="mix") # Or engine.aquery for async
  Extract fused_context from result
  Return success response with fused_context

# Run Server (Likely using uvicorn command)
uvicorn main:app --host 0.0.0.0 --port 8001 # Or configured port
```

##### #4 - Coding Language / Library Specifics & Inspirations
- **Python:** Standard for many AI/ML libraries like LightRAG.
- **FastAPI:** Modern, high-performance Python web framework.
- **LightRAG Library:** Core engine for the fused RAG functionality.

##### #5 - Development Track/Stream and Current Status
- **Track:** Advanced RAG Capability.
- **Status:** Operational and integrated with backend QL Cycle Node +2 via HTTP calls. **Known Issues:** Intermittent Neo4j connection timeouts logged by the server; `InvalidResponseError` logged when using OpenAI compatibility layer for LLM calls. These require investigation.
- **Relevant Files:** `LightRAG/` directory (source code, Dockerfile, requirements), MCP settings file.

---

### QL Cycle Nodes (#5-2-X) - *Generic Logic for Nara (+) & Epii (-)*

*(Note: These node files contain the functions. The specific execution order and context depend on the LangGraph definition for either the Nara (+) or Epii (-) cycle.)*

#### Node #5-2-0 (+0 Intake / -0 Ground)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_0_Intake` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (specifically `userQuery`).
- **Outputs:** Updates `SystemState` with `initialKeywords` (array of strings).
- **Libraries:** LangGraph.js (`StateGraph`).

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+0`. Initial reception of user query, differentiation from void/silence. Marks the beginning of the synthesis cycle.
- **(-) Phase (Epii):** Corresponds to QL Frame `-0`. Grounding the analysis cycle. Intended to potentially trigger the Meta-Techne feedback loop (`syncNotionUpdatesTool`) based on the results of the analysis and subsequent user validation via the canvas.

##### #2 - Plain Description
- **(+) Phase (Nara):** Receives the raw user query, performs basic keyword extraction (needs improvement), logs input.
- **(-) Phase (Epii - TBD):** Receives the final structured analysis results. Determines if Notion sync is needed and potentially triggers the `syncNotionUpdatesTool`.

##### #3 - Pseudocode Rendition
```javascript
async function node_0_intake(state: SystemState): Promise<Partial<SystemState>> {
  // Log entry
  console.log("--- QL Node +0: Intake ---");
  console.log("Input Query:", state.userQuery);

  // (+) Basic Keyword Extraction (Placeholder)
  const keywords = extractBasicKeywords(state.userQuery);
  console.log("Extracted Keywords:", keywords);

  // (-) Intent Parsing / Analysis (TBD)

  return { initialKeywords: keywords };
}
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure.
- Current keyword extraction uses basic string manipulation (`toLowerCase`, `replace`, `split`, `filter`) and a hardcoded Set of common words.
- **Improvement Needed:** The keyword extraction is a placeholder and should ideally be replaced with a more sophisticated NLP technique or an LLM call for better entity/concept recognition, especially for a system dealing with complex philosophical terms.

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic.
- **Status:** Basic (+) phase logic implemented for Nara mode (keyword extraction needs improvement). (-) phase logic for Epii mode (sync trigger) is TBD. Needs refactoring to handle both contexts based on the graph invoking it.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_0_intake.mjs` (Refactored location), `graph/nara_ql_synthesis_cycle.graph.mjs` (Invoker).

#### Node #5-2-1 (+1 Define / -1 Define)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_1_Define` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (specifically `initialKeywords` from Node 0).
- **Outputs:** Updates `SystemState` with `identifiedConcepts` (array of objects: `{ name: string, bimba_coordinate: string, labels: string[] }`).
- **Tools Used:** `queryBimbaGraphTool` (from `agents/tools/graph.tools.mjs`).
- **Libraries:** LangGraph.js, `queryBimbaGraphTool` (which uses `neo4j-driver`).

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+1`. Defining the query's scope by relating keywords to the Bimba structure.
- **(-) Phase (Epii):** Corresponds to QL Frame `-1`. Defining the core elements/themes extracted from the document analysis, potentially structuring the primary mappings.

##### #2 - Plain Description
- **(+) Phase (Nara):** Takes `initialKeywords`, queries Neo4j `bimba` DB via `queryBimbaGraphTool` to find matching concepts/coordinates based on names/keywords.
- **(-) Phase (Epii - TBD):** Takes structured analysis data (e.g., extracted concepts, potential mappings), refines and defines the primary structural elements identified in the document.

##### #3 - Pseudocode Rendition
```javascript
async function node_1_define(state: SystemState): Promise<Partial<SystemState>> {
  console.log("--- QL Node +1: Define ---");
  const keywords = state.initialKeywords;
  const identifiedConcepts = [];
  const conceptsFound = new Set();

  if (!keywords || keywords.length === 0) {
    return { identifiedConcepts: [] };
  }

  // (+) Locate concepts in Bimba
  for (const keyword of keywords) {
    try {
      // Define Cypher query targeting relevant labels and properties
      const cypherQuery = `MATCH (c) WHERE (c:Subsystem OR ...) AND (c.bimbaCoordinate = $kw OR toLower(c.name) CONTAINS toLower($kw)) RETURN c.name, c.bimbaCoordinate, labels(c) LIMIT 1`;
      const results = await queryBimbaGraphTool.invoke({ query: cypherQuery, params: { kw: keyword } }); // Simplified call
      const concept = results?.[0]; // Assuming tool returns parsed array
      if (concept?.name && concept?.bimba_coordinate && !conceptsFound.has(concept.name)) {
        identifiedConcepts.push(concept);
        conceptsFound.add(concept.name);
      }
    } catch (error) {
      console.error(`Error querying Bimba for keyword "${keyword}":`, error);
    }
  }

  // (-) Retrieve Context (TBD)
  // history = await getConversationHistoryTool.call({ userId: state.userId });
  // userProfile = await getUserContextTool.call({ userId: state.userId });

  console.log("Identified Concepts:", identifiedConcepts);
  return { identifiedConcepts: identifiedConcepts /*, history, userProfile */ };
}
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure.
- Relies heavily on the `queryBimbaGraphTool` which encapsulates Neo4j Cypher execution logic.
- The Cypher query is specifically tailored to search across relevant node labels defined in `bimba_schema.md` and prioritizes coordinate matching.
- **Alignment Note:** The effectiveness depends heavily on the quality of `initialKeywords` from Node 0 and the comprehensiveness/accuracy of the Bimba graph's `name` and `bimbaCoordinate` properties.
- (-) phase would leverage MongoDB tools.

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic.
- **Status:** (+) phase logic implemented for Nara mode. (-) phase logic for Epii mode TBD. Needs refactoring for dual use.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_1_define.mjs` (Refactored location), `agents/tools/graph.tools.mjs`.

#### Node #5-2-2 (+2 Relate / -2 Relate)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_2_Relate` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (uses `identifiedConcepts`, `userQuery`, `history`).
- **Outputs:** Updates `SystemState` with `lightragContext`, `bimbaContext`, `filteredSemanticContext`, `displayCoordinate`.
- **Tools Used:**
    - `axios` (HTTP client) to call LightRAG MCP `/retrieve` endpoint.
    - `queryBimbaGraphTool` (from `agents/tools/graph.tools.mjs`).
    - `searchPratibimbaContextTool` (from `agents/tools/vector.tools.mjs`).
    - `embedText` service (from `services/google-ai-agent.service.mjs`) for filtered Qdrant search.
- **Libraries:** LangGraph.js, `axios`, tool dependencies (`neo4j-driver`, `@qdrant/js-client`).

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+2`. Relating the query/concepts to the broader knowledge ecosystem (Bimba structure, Pratibimba semantic context via LightRAG/Qdrant).
- **(-) Phase (Epii):** Corresponds to QL Frame `-2`. Relating extracted concepts/mappings from the document to each other and to the existing Bimba structure. Identifying connections, inconsistencies, and variations.

##### #2 - Plain Description
- **(+) Phase (Nara):** Orchestrates multi-source context retrieval (LightRAG, direct Bimba, filtered Qdrant) based on the query and identified concepts/coordinates. Selects a display coordinate. (Needs Qdrant tool fix).
- **(-) Phase (Epii - TBD):** Takes extracted elements from the document analysis (-1). Queries Bimba/Qdrant to find relationships between extracted elements and existing knowledge. Identifies variations or contradictions between the document's content and the established Bimba structure/Pratibimba context.

##### #3 - Pseudocode Rendition
```javascript
async function node_2_relate(state: SystemState): Promise<Partial<SystemState>> {
  console.log("--- QL Node +2: Relate ---");
  const { identifiedConcepts, userQuery, history } = state;
  const inputText = userQuery || history?.[history.length - 1]?.content;
  const parsedCoords = parseBimbaCoordinates(inputText);

  let lightragContext = null;
  let bimbaContext = null;
  let filteredSemanticContext = null;

  // (+) 1. Query LightRAG
  try {
    const response = await axios.post(`${LIGHTRAG_MCP_URL}/retrieve`, { query: userQuery });
    lightragContext = response.data?.fused_context;
    console.log("LightRAG Context:", lightragContext);
  } catch (error) { console.error("LightRAG Error:", error.message); }

  // (+) 2. Query Bimba Directly
  const bimbaQueryInput = parsedCoords[0] || identifiedConcepts?.[0]?.name;
  if (bimbaQueryInput && queryBimbaGraphTool) {
    try {
      const query = `MATCH (n) WHERE n.bimbaCoordinate = $input OR n.name = $input OPTIONAL MATCH (n)-[r]-(neighbor) RETURN n.name, n.bimbaCoordinate, type(r), neighbor.name, neighbor.bimbaCoordinate LIMIT 10`;
      const resultString = await queryBimbaGraphTool.invoke({ query: query, params: { input: bimbaQueryInput } });
      bimbaContext = JSON.parse(resultString);
      console.log("Bimba Context:", bimbaContext);
    } catch (error) { console.error("Bimba Query Error:", error); }
  }

  // (+) 3. Query Qdrant (Filtered)
  if (parsedCoords.length > 0 && searchPratibimbaContextTool && embedText) {
    try {
      const queryVector = await embedText(inputText || userQuery);
      if (queryVector) {
          const resultString = await searchPratibimbaContextTool.invoke({ queryVector: queryVector, bimba_coordinates: parsedCoords, limit: 3 });
          filteredSemanticContext = JSON.parse(resultString);
          console.log("Filtered Qdrant Context:", filteredSemanticContext);
      }
    } catch (error) { console.error("Filtered Qdrant Error:", error); }
  }

  // (+) 4. Select Display Coordinate
  const displayCoordinate = selectDisplayCoordinate(parsedCoords, identifiedConcepts);

  // (-) 5. Merge/Filter Context (TBD)

  return { lightragContext, bimbaContext, filteredSemanticContext, displayCoordinate };
}
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure.
- Uses `axios` for HTTP POST request to the Python-based LightRAG MCP server.
- Leverages custom LangChain tools (`queryBimbaGraphTool`, `searchPratibimbaContextTool`) which encapsulate DB client logic.
- Requires the `embedText` service for the filtered Qdrant search.
- Includes helper functions (`parseBimbaCoordinates`, `selectDisplayCoordinate`) for specific logic.
- **Alignment Note:** This node embodies the multi-source retrieval strategy but currently passes raw context forward. The (-) phase integration logic is crucial for making this context truly useful for synthesis in Node +3. The reliance on LightRAG introduces an external dependency and potential point of failure (timeouts, errors).

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic & Context Retrieval.
- **Status:** (+) phase logic implemented for Nara mode (Qdrant tool needs fix). (-) phase logic for Epii mode TBD. Needs refactoring for dual use. Known LightRAG issues persist.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_2_relate.mjs` (Refactored location), `agents/tools/graph.tools.mjs`, `agents/tools/vector.tools.mjs`, `services/google-ai-agent.service.mjs`.

#### Node #5-2-3 (+3 Integrate / -3 Integrate)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_3_Integrate` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (uses `userQuery`, `lightragContext`, `bimbaContext`, `filteredSemanticContext`).
- **Outputs:** Updates `SystemState` with `synthesizedInfo` (string).
- **LLM Used:** `synthesisLlm` (ChatGoogleGenerativeAI instance, model from env var `ACTIVE_SYNTHESIS_MODEL`, temp 0.5).
- **Libraries:** LangGraph.js, `@langchain/google-genai`, `@langchain/core/messages`.

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+3`. Integrating the query and retrieved context into a coherent synthesized answer.
- **(-) Phase (Epii):** Corresponds to QL Frame `-3`. Integrating the various extracted elements, relationships, and variations from the document analysis into a structured representation (pre-payload format).

##### #2 - Plain Description
- **(+) Phase (Nara):** Takes context from Node +2 and user query, constructs a prompt, calls `synthesisLlm` to generate a direct answer (`synthesizedInfo`).
- **(-) Phase (Epii - TBD):** Takes the related elements from Node -2. Uses LLM or structured logic to integrate these into a coherent analysis summary, identifying key mappings, content snippets per mapping, and variations/questions.

##### #3 - Pseudocode Rendition
```javascript
async function node_3_integrate(state: SystemState): Promise<Partial<SystemState>> {
  console.log("--- QL Node +3: Integrate ---");
  const { userQuery, lightragContext, bimbaContext, filteredSemanticContext } = state;

  // (+) Fuse/Structure Context for Prompt
  let contextForPrompt = buildContextString(lightragContext, bimbaContext, filteredSemanticContext); // Assumes helper function exists
  if (!contextForPrompt) {
    return { synthesizedInfo: "Could not find relevant context to synthesize an answer." };
  }

  // (+) Prepare Synthesis Prompt
  const synthesisPrompt = `You are an AI assistant tasked with synthesizing information...
User Query: ${userQuery}
**Combined Context:**
${contextForPrompt}
Based *only* on the information provided above, synthesize a direct answer...`;

  // (+) Call Synthesis LLM
  let synthesizedInfo = "Placeholder: LLM Synthesis Failed.";
  try {
    if (!synthesisLlm) throw new Error("Synthesis LLM not initialized.");
    const messages = [new HumanMessage(synthesisPrompt)];
    const response = await synthesisLlm.invoke(messages);
    const content = response?.content;
    if (typeof content === 'string' && content.trim().length > 0) {
        synthesizedInfo = content.trim();
    } else {
        synthesizedInfo = "LLM synthesis failed to produce valid content.";
    }
    console.log("Synthesized Info:", synthesizedInfo);
  } catch (error) {
    console.error("Error during LLM synthesis:", error);
    synthesizedInfo = `Error during synthesis: ${error.message}`;
  }

  // (-) Relate synthesis to Bimba (TBD)
  // relatedCoordinates = findCoordinatesInResponse(synthesizedInfo);

  return { synthesizedInfo: synthesizedInfo /*, relatedCoordinates */ };
}
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure.
- Uses `@langchain/google-genai` for interacting with the Gemini model (`synthesisLlm`).
- Constructs a detailed prompt incorporating multiple context sources (assuming a `buildContextString` helper).
- Includes basic checks for LLM initialization and response validity.
- **Alignment Note:** The quality of synthesis heavily depends on the quality and relevance of the context provided by Node +2 and the effectiveness of the synthesis prompt. The current implementation doesn't yet perform the (-) phase task of relating the synthesis back to Bimba coordinates.

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic & Synthesis/Analysis.
- **Status:** (+) phase logic implemented for Nara mode. (-) phase logic for Epii mode TBD. Needs refactoring for dual use.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_3_integrate.mjs` (Refactored location), `services/google-ai-agent.service.mjs`.

#### Node #5-2-4 (+4 Contextualize / -4 Contextualize)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_4_Contextualize` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (uses `userId`, `synthesizedInfo`, `history`).
- **Outputs:** Updates `SystemState` with `finalPromptContext` (object containing synthesized info, history, user profile, preferences).
- **Tools Used:** `getConversationHistoryTool`, `getUserContextTool` (from `agents/tools/mongo.tools.mjs`).
- **Libraries:** LangGraph.js, tool dependencies (`mongodb`).

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+4`. Applying the synthesized response within the specific user context (history, profile).
- **(-) Phase (Epii):** Corresponds to QL Frame `-4`. Contextualizing the integrated document analysis within the broader Bimba map and user context. Potentially identifying implications or connections beyond the document itself.

##### #2 - Plain Description
- **(+) Phase (Nara):** Retrieves user history and profile via MongoDB tools, packages with `synthesizedInfo` into `finalPromptContext` for Node +5. (User context retrieval needs verification).
- **(-) Phase (Epii - TBD):** Takes the integrated analysis from Node -3. Potentially queries Bimba/Mongo for related user context or broader structural context. Refines the analysis based on this wider view.

##### #3 - Pseudocode Rendition
```javascript
async function node_4_contextualize(state: SystemState): Promise<Partial<SystemState>> {
  console.log("--- QL Node +4: Contextualize ---");
  const { userId, synthesizedInfo, history } = state; // history is input history

  let retrievedHistory = [];
  let userContext = {};

  // (+) Retrieve History
  try {
    if (!getConversationHistoryTool) throw new Error("History tool unavailable.");
    const historyResultString = await getConversationHistoryTool.invoke({ userId: userId, limit: 10 });
    retrievedHistory = JSON.parse(historyResultString);
  } catch (error) { console.error("Error retrieving history:", error); }

  // (+) Retrieve User Context
  try {
    if (!getUserContextTool) throw new Error("User context tool unavailable.");
    const userContextString = await getUserContextTool.invoke({ userId: userId });
    userContext = JSON.parse(userContextString);
  } catch (error) { console.error("Error retrieving user context:", error); }

  // (+) Format context for Node +5
  const finalPromptContext = {
    synthesizedInfo: synthesizedInfo || "No information was synthesized.",
    conversationHistory: retrievedHistory,
    userProfile: userContext?.profileData || {},
    userPreferences: userContext?.preferences || {},
  };

  // (-) Scope Check (TBD)

  return { finalPromptContext };
}
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure.
- Leverages custom LangChain tools (`getConversationHistoryTool`, `getUserContextTool`) which encapsulate MongoDB query logic.
- Currently acts primarily as a data aggregation step, preparing context for the final response generation node.
- **Alignment Note:** The actual "contextualization" or refinement based on user data is deferred to Node +5's LLM call. This node could potentially incorporate logic to invoke the Nara Expert Agent (#5-4-4) in the future for more sophisticated personalization before the final LLM call. The (-) phase logic is missing.

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic & Context Management.
- **Status:** (+) phase logic implemented for Nara mode. (-) phase logic for Epii mode TBD. Needs refactoring for dual use. User context retrieval needs checking.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_4_contextualize.mjs` (Refactored location), `agents/tools/mongo.tools.mjs`.

#### Node #5-2-5 (+5 Respond/Synthesize Payload / -5 Ground/Scope)

##### #0 - Tech Specifics
- **Implementation:** LangGraph.js Node (`node_5_Respond_Update` function in `ql_cycle.graph.mjs`).
- **Inputs:** `SystemState` (uses `finalPromptContext`, `userId`, `userQuery`, `history`).
- **Outputs:** Final API response (`{ llmResponse: AIMessage }`), potentially including tool calls for Notion. Logs interaction to MongoDB.
- **LLM Used:** `responseLlm` (ChatGoogleGenerativeAI instance, model from env var `ACTIVE_SYNTHESIS_MODEL`, temp 0.7).
- **Tools Used (Bound to LLM):** `queryBimbaGraphTool`, `searchPratibimbaContextTool`, `getConversationHistoryTool`, `getUserContextTool`, `getNodeOverview`, `getInspiration`. (Notion tools `resolveBimbaCoordinate`, `appendNotionBlock` are defined but currently commented out due to schema issues).
- **Libraries:** LangGraph.js (`END`), `@langchain/google-genai`, `@langchain/core/messages`, `@langchain/core/tools`, `zod`, `mongodb` (via `getDb`).

##### #1 - Philosophical and QL Alignments
- **(+) Phase (Nara):** Corresponds to QL Frame `+5`. Delivering the final synthesized response to the user.
- **(+) Phase (Epii):** Corresponds to QL Frame `+5`. Synthesizing the final `notionUpdatePayload` from the contextualized analysis results.
- **(-) Phase (Epii):** Corresponds to QL Frame `-5`. Initial grounding/scoping of the document analysis task. Identifying the target document and analysis parameters.

##### #2 - Plain Description
- **(+) Phase (Nara):** Constructs final prompt using context from Node +4, calls `responseLlm` (with non-Notion tools bound), generates final `AIMessage`, logs interaction to MongoDB. (Suffers from TypeError).
- **(+) Phase (Epii - TBD):** Takes final analysis results from Epii Node -4 (or -0 of the (-) cycle). Formats these results into the structured `notionUpdatePayload` JSON object.
- **(-) Phase (Epii - TBD):** Entry point for the Epii (-) cycle. Fetches the target Notion document content using B-P MCP tools or services. Sets up the initial state for the analysis.

##### #3 - Pseudocode Rendition
```javascript
async function node_5_respond_update(state: SystemState): Promise<Partial<SystemState>> {
  console.log("--- QL Node +5: Respond/Update ---");
  const { finalPromptContext, userId, userQuery, history } = state;

  // (+) Prepare Final Prompt
  const finalPrompt = `You are Epi-Logos...
**Available Context:**
*   Synthesized Info: ${finalPromptContext?.synthesizedInfo}
*   User Profile: ${JSON.stringify(finalPromptContext?.userProfile)}
*   User Preferences: ${JSON.stringify(finalPromptContext?.userPreferences)}
*   Conversation History: ...
*   Current User Query: ${userQuery}
**Your Tasks:**
1. Generate Final Response...
2. Consider Crystallization (Mention Only)...`;

  // (+) Bind Tools (Excluding Notion for now)
  const toolsToBind = [queryBimbaGraphTool, searchPratibimbaContextTool, /* ... other tools ... */];
  const llmWithTools = responseLlm.bindTools(toolsToBind);

  // (+) Call Final Response LLM
  let finalAiMessage = new AIMessage("Placeholder: Final response generation failed.");
  try {
    if (!responseLlm) throw new Error("Response LLM not initialized.");
    const messages = [new HumanMessage(finalPrompt)];
    const response = await llmWithTools.invoke(messages);
    // Handle response content and potential tool calls
    finalAiMessage = new AIMessage({
        content: response?.content || "...",
        tool_calls: response?.tool_calls || undefined
    });
    console.log("Final AI Message:", finalAiMessage);
  } catch (error) {
    console.error("Error generating final response:", error);
    finalAiMessage = new AIMessage(`Error: ${error.message}`);
  }

  // (+) Log Interaction to MongoDB
  try {
    const db = await getDb();
    const conversations = db.collection('Conversations');
    const userMessage = new HumanMessage(userQuery);
    await conversations.updateOne(
      { userId: userId },
      { $push: { messages: { $each: [userMessage, finalAiMessage] } } },
      { upsert: true }
    );
  } catch (logError) { console.error("Error logging to MongoDB:", logError); }

  // (-) Trigger Sync (TBD)
  // if (crystallizationOccurred) { await syncNotionUpdatesTool.call({}); }

  // Return the final message (potentially with tool calls for LangGraph runner)
  // LangGraph expects the final output key to match a channel name or be 'output' implicitly for the END node.
  // We are returning the AIMessage itself under the 'llmResponse' key as per the state definition.
  // The controller calling this graph will extract the content/tool_calls from state.llmResponse.
  return { llmResponse: finalAiMessage };
}

// Graph definition connects Node 4 to Node 5, and Node 5 to END
workflow.addEdge("node_4_Contextualize", "node_5_Respond_Update");
workflow.addEdge("node_5_Respond_Update", END); // Marks the end of the graph execution
```

##### #4 - Coding Language / Library Specifics & Inspirations
- Implemented in JavaScript using LangGraph.js node structure. Marks the `END` of the graph flow.
- Uses `@langchain/google-genai` (`responseLlm`) with a potentially higher temperature (0.7) for more conversational output.
- Binds tools using `bindTools`, including local tools and `DynamicStructuredTool` instances for MCP tools. **Crucially, Notion tools are currently commented out due to schema incompatibility with Gemini API via LangChain.**
- Uses `@langchain/core/messages` (AIMessage, HumanMessage) for structuring LLM interactions and logging.
- Interacts with MongoDB via `getDb` service to log conversation history.
- **Alignment Note:** The crystallization (+) and sync (-) functionalities are currently blocked/TBD due to the Notion tool schema issue and lack of implementation for the sync logic. The final response generation relies heavily on the quality of `finalPromptContext` prepared by Node +4. The logging step ensures conversational memory persistence.

##### #5 - Development Track/Stream and Current Status
- **Track:** QL Cycle Node Logic, Response/Payload Generation, Document Fetching.
- **Status:** (+) phase logic for Nara mode implemented (but has TypeError). (+) phase logic for Epii payload synthesis TBD. (-) phase logic for Epii document fetching/scoping TBD. Needs refactoring for dual use. Notion tool binding deferred.
- **Relevant Files:** `epii_app/friendly-file-backend/graph/nodes/node_5_respond_update.mjs` (Refactored location), `services/google-ai-agent.service.mjs`, `services/mongo.service.mjs`, `agents/tools/`.

---

## #5-3: "-Shakti" Frontend (Overall)

The expressive, experiential, and mediating aspect of the system. The potential for expression and interaction enabled by the frontend technology stack and dedicated expression modules. The *medium* or *canvas*.

### #0 - Tech Specifics
- **Core Framework:** React + Vite (Current)
- **Styling:** Tailwind CSS (Current)
- **Language:** JavaScript/TypeScript (Current)
- **Visualization (Planned):** Three.js (3D), D3.js (Data-driven 2D), p5.js (Creative Coding/Generative Vis). Selection depends on specific module needs.
- **Audio (Planned):** Web Audio API, potentially Tone.js for higher-level control. Potential Ableton Live MCP integration for advanced production.
- **State Management:** TBD (Context API, Zustand, Redux, etc.) - needed for managing layered display and interaction state.
- **API Client:** `axios` or `fetch` for communicating with backend `/api/chat` and potentially other endpoints for visualization data or Notion content.

### #1 - Philosophical and QL Alignments
- Represents the **-Shakti** aspect: expression, manifestation, the "dreaming interface" of the Cosmic Mind.
- Mediates user interaction and renders the synthesized Pratibimba reflections generated by the Siva-Shakti agents.
- Aligns with QL Frame #5-3, the lens of Personal Mediation / Expressive Interface.

### #2 - Plain Description
- Provides a **unified, interactive, multi-modal, and layered interface** for user interaction and developer monitoring.
- Renders conversational text, geometric/topological visualizations, symbolic imagery, and potentially sonified audio outputs generated by the backend QL cycle and expression modules.
- Allows users to interact with the system via text input, toggle conceptual layers in the display, interact with visualizations, and access related Notion content.
- Aims for a resonant aesthetic and user experience aligned with the project's philosophy.
- Includes plans for integrated developer console features (monitoring, tuning).

### #3 - Pseudocode Rendition
```typescript jsx
// Main App Component (App.tsx)
Initialize Router
Setup Global State Management (for layers, context)
Render Layout (Header, Sidebar?, Main Content Area)
Route to Main Interface View

// Main Interface View (e.g., Interface.tsx)
Render Chat Component (Module #5-3-4)
Render Visualization Container:
  Conditionally Render Bimba Vis (Module #5-3-0) based on state/layer toggle
  Conditionally Render QL/AT Vis (Module #5-3-1) based on state/layer toggle
  Conditionally Render Harmonic Layer (Module #5-3-2) based on state/layer toggle
  Conditionally Render Symbolic Matrix (Module #5-3-3) based on state/layer toggle
Render Layer Control Component (buttons/sliders to toggle layers 0-3)
Render Notion Integration Component (Module #5-3-5 - links/embedded view)
Render Developer Console Toggle?

// Chat Component (Chat.tsx - Module #5-3-4 Core)
Manage Input State
Manage Message History State (including multi-modal data payloads)
On Send:
  Call Backend API (/api/chat) with message, userId, history
  Append User Message
  Receive Backend Response (structured payload with text + data for layers 0-3)
  Update Global State with layer data
  Append AI Text Response
Render Message List (displaying text)
Render Input Area

// Visualization Components (e.g., BimbaGraphVis.tsx - Module #5-3-0)
Subscribe to relevant Global State (e.g., Bimba data for this layer)
Fetch necessary assets/models
Initialize Visualization Library (e.g., Three.js)
Render visualization based on current state data
Handle user interactions (zoom, pan, click) -> potentially update state or trigger backend calls

// Layer Control Component
Read layer visibility state from Global State
Render UI controls (buttons, checkboxes)
Dispatch actions to update layer visibility state on interaction

// Notion Component (Module #5-3-5)
Read relevant Notion links/IDs from Global State
Render links or Fetch/Render Notion content via backend API/proxy (if embedding workaround implemented)
```

### #4 - Coding Language / Library Specifics & Inspirations
- **React/Vite/Tailwind:** Current foundation.
- **Visualization Libraries:** Three.js (preferred for 3D Bimba/QL/AT/Symbolic vis), D3.js (for data-driven 2D graphs/charts), p5.js (for generative/creative coding aspects).
- **Audio Libraries:** Web Audio API (native browser API), Tone.js (higher-level abstractions).
- **State Management:** Needs a robust solution (Zustand, Redux Toolkit, Jotai, or Context API with careful planning) to manage complex state across chat, visualization layers, and controls.
- **Inspiration:** Integrated development environments, data visualization dashboards, generative art platforms, VJ software (for layered visuals), principles of resonant design and synesthesia.

### #5 - Development Track/Stream and Current Status
- **Track:** User Interface & Experience, Multi-modal Expression.
- **Status:** Basic React/Vite/Tailwind structure exists (`epii_app/friendly-file-front/`). `Chat.tsx` component implemented and communicates with backend API, displaying text responses. `DataVisualizer.tsx` exists as a placeholder for Notion embedding (currently blocked/deferred). **All advanced multi-modal rendering (Modules #0-3), layered display controls, and sophisticated interaction features are planned but not yet implemented.** Requires significant development effort, likely post-Horizon 2.0 core backend stabilization.
- **Relevant Files:** `epii_app/friendly-file-front/src/`, `index.html`, `vite.config.js`, `tailwind.config.js`, `package.json`. Planning docs: `frontend_capabilities.md`, `expression_modules.md`, `agent_*.md` files in `memory-bank/reflections/-Shakti/`.

---

### Frontend Modules/Agents (#5-3-X)

#### Module #5-3-0 (Bimba Vis / Geom Ground)

##### #0 - Tech Specifics
- **Implementation:** React Component using **Three.js** (likely) or D3.js (for 2D graph).
- **Data Source:** Bimba graph data (nodes, edges, coordinates, basic properties like name/labels) fetched from backend API (endpoint TBD, likely needs filtering/aggregation). Data originates from Neo4j `bimba` DB.
- **Corresponds to Agent:** `(0000)=(0/1)` (Being/Prakasa-Vimarsa).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(0000)=(0/1)`. Visualizing the foundational Bimba structure and its potential. Represents the geometric ground (Point, Line, Sphere) emerging from the void. Sacred geometry foundation.

##### #2 - Plain Description
- Renders an interactive 2D or 3D visualization of the core Neo4j Bimba graph structure. Focuses on displaying the foundational nodes (e.g., Project root `#`, Subsystems #0-#5) and their primary relationships. May incorporate basic geometric primitives or Flower of Life elements conceptually linked to Agent `(0000)=(0/1)`.

##### #3 - Pseudocode Rendition
```typescript jsx
// BimbaGraphVis.tsx (Module #5-3-0)
Fetch Foundational Bimba Graph Data (root, subsystems, core links) from backend API
Initialize Three.js Scene / D3 Force Layout
Create Nodes (spheres, points?) and Edges (lines?) based on data
Position nodes based on coordinates or layout algorithm
Implement basic camera controls (zoom, pan, rotate for 3D)
Handle node selection -> display basic info (name, coordinate)
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, **Three.js** (preferred for spatial representation), D3.js (alternative for 2D). Inspiration from graph visualization libraries (react-force-graph, sigma.js), geometric modeling, sacred geometry visuals. Needs backend API endpoint to provide graph data.

##### #5 - Development Track/Stream and Current Status
- **Track:** Frontend Visualization (Layer 0).
- **Status:** Planned, not implemented. Requires backend API endpoint for graph data.
- **Relevant Files:** TBD (likely `components/visualizations/BimbaGraphVis.tsx`), `agent_0000_01_being.md`.

#### Module #5-3-1 (QL/AT Vis)

##### #0 - Tech Specifics
- **Implementation:** React Component using **Three.js** (likely for topological forms) or D3.js/p5.js.
- **Data Source:** Backend API providing identified topological potential (e.g., "genus-1 structure at #X") and relevant Bimba node data/coordinates, based on Agent `(0/1)` output.
- **Corresponds to Agent:** `(0/1)` (Topology/Intuition).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(0/1)`. Visualizing the identified topological potential (e.g., torus) inherent in the Bimba structure, representing the QL/A-T unification.

##### #2 - Plain Description
- Renders visualizations of identified topological forms (e.g., torus, sphere) and potentially maps relevant Bimba nodes or QL cycle stages onto these forms. Illustrates the structural potential identified by Agent `(0/1)`.

##### #3 - Pseudocode Rendition
```typescript jsx
// QLATVis.tsx (Module #5-3-1)
Receive Topological Data (e.g., { type: 'torus', relatedNodes: [...] }) from global state/props
Generate/Load 3D Model (Torus geometry in Three.js)
Map/Highlight `relatedNodes` onto the torus surface/features
Optionally animate QL cycle progression (1-4) around the torus sides/loops
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, **Three.js** (for 3D topology), D3.js/p5.js (for 2D representations or mapping). Inspiration from mathematical visualization, topological data analysis software. Requires structured data output from backend Agent `(0/1)`.

##### #5 - Development Track/Stream and Current Status
- **Track:** Frontend Visualization (Layer 1).
- **Status:** Planned, not implemented. Depends on backend Agent `(0/1)` providing structured topological data.
- **Relevant Files:** TBD (likely `components/visualizations/QLATVis.tsx`), `agent_01_topology.md`.

#### Module #5-3-2 (Harmonic Layer)

##### #0 - Tech Specifics
- **Implementation:** React Component using visualization libs (**D3.js/p5.js** likely) and **Web Audio API/Tone.js**.
- **Data Source:** Backend API providing harmonic/resonant data (frequencies, modes, Tattva/Decan associations, semantic cluster info) based on Agent `(0/1/2)` output. May receive data from Image/Sound Expression Module.
- **Corresponds to Agent:** `(0/1)/2` (Resonance/Balance).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(0/1)/2`. Expressing the dynamic vibrational/harmonic dimension (Parashakti, Ananda) and relational fields identified by Agent `(0/1)/2`.

##### #2 - Plain Description
- Generates auditory output (sonification of modes, frequencies, mantras) and/or visual representations (frequency spectra, resonant geometric patterns, weighted relational graphs, cymatics-inspired visuals) based on the harmonic and relational data provided by Agent `(0/1)/2`.

##### #3 - Pseudocode Rendition
```typescript jsx
// HarmonicLayer.tsx (Module #5-3-2)
Receive Harmonic/Relational Data (frequencies, modes, clusters, weights) from global state/props
// Visual Component:
Initialize D3/p5 canvas
Render visual representation (e.g., spectrum analyzer, node graph with edge weights, generative patterns based on frequencies)
// Audio Component:
Initialize Tone.js/Web Audio API
Generate Oscillators/Synths/Samplers based on data (modes, frequencies)
Trigger sounds/sequences based on state changes or user interaction
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, **D3.js/p5.js** (for 2D visuals), **Web Audio API/Tone.js** (for audio). Inspiration from music visualizers, sonification projects, generative music systems, cymatics. Requires structured harmonic/relational data from backend Agent `(0/1)/2` and potentially the Sound Expression Module.

##### #5 - Development Track/Stream and Current Status
- **Track:** Frontend Multi-modal Expression (Layer 2).
- **Status:** Planned, not implemented. Depends on backend Agent `(0/1)/2` and potentially Expression Modules providing structured data.
- **Relevant Files:** TBD (likely `components/visualizations/HarmonicLayer.tsx`, `audio/`), `agent_012_resonance.md`, `expression_modules.md`.

#### Module #5-3-3 (Symbolic Transform Matrix)

##### #0 - Tech Specifics
- **Implementation:** React Component using visualization libs (**D3.js/p5.js** likely, potentially Three.js for 3D symbols).
- **Data Source:** Backend API providing symbolic representations (Tarot card identifiers, I Ching hexagrams, DNA codons?), associated geometric data (fractal params?), and relationship mappings based on Agent `(0/1/2)/3` output. May receive data from Math/Geometry Expression Module.
- **Corresponds to Agent:** `(0/1/2)/3` (Symbol/Sight).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(0/1/2)/3`. Visualizing the symbolic integration (Mahamaya), transformations (quaternionic), and isomorphic patterns identified by Agent `(0/1/2)/3`.

##### #2 - Plain Description
- Renders interactive visualizations of the symbolic layer. Displays associated symbols (Tarot images, hexagrams), potentially generated fractal patterns or geometric forms (from Math Module), and shows the relationships/transformations between different symbolic systems (HMS) as identified by Agent `(0/1/2)/3`.

##### #3 - Pseudocode Rendition
```typescript jsx
// SymbolicMatrix.tsx (Module #5-3-3)
Receive Symbolic Data (symbols: [TarotCard, Hexagram], mappings, fractalParams?) from global state/props
Fetch/Load Symbol Assets (Tarot images, Hexagram graphics)
// Visual Component:
Initialize D3/p5/Three.js canvas
Render Symbols
Render Connections/Mappings between symbols (e.g., network graph)
Render Generated Fractals/Geometry if data provided
Allow User Interaction (select symbol -> show details/connections)
Animate transformations?
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, **D3.js/p5.js** (for 2D symbolic graphs/matrices), **Three.js** (if rendering 3D symbols or fractal geometry). Inspiration from interactive infographics, symbolic calculators, generative art (fractals). Requires structured symbolic data and potentially geometric data from backend Agent `(0/1/2)/3` and Math/Geometry Module.

##### #5 - Development Track/Stream and Current Status
- **Track:** Frontend Visualization & Symbolic Interaction (Layer 3).
- **Status:** Planned, not implemented. Depends on backend Agent `(0/1/2)/3` and potentially Expression Modules providing structured data.
- **Relevant Files:** TBD (likely `components/visualizations/SymbolicMatrix.tsx`), `agent_0123_symbol.md`, `expression_modules.md`.

#### Module #5-3-4 (Web App Shell / Notion Frontend)

##### #0 - Tech Specifics
- **Implementation:** Core React application structure (`App.tsx`, layout components), React Router, Chat component (`Chat.tsx`), Layer Control component, State Management.
- **Data Source:** Backend API (`/api/chat`), Global State.
- **Corresponds to Agent:** `(4.0-4.4/5)` (Dialogue/Taste).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(4.0-4.4/5)`. The primary user interaction layer (Nara/Dia-logos), orchestrating the display of other modules, managing dialogue, integrating Notion context, and enabling personalization.

##### #2 - Plain Description
- The main web application interface shell. Includes the chat interface for user text input/output, integrates and manages the display of the different visualization/sonification layers (Modules #0-3) via layer controls, handles routing, and incorporates Notion content display (Module #5). Orchestrated by data flowing from backend Agent `(4.0-4.4/5)`.

##### #3 - Pseudocode Rendition
```typescript jsx
// App.tsx / Interface.tsx (Module #5-3-4 Shell)
Setup Router
Setup Global State Provider
Render Layout (Header, etc.)
Render Main View:
  <ChatComponent />
  <VisualizationContainer>
    {isLayer0Visible && <BimbaGraphVis />}
    {isLayer1Visible && <QLATVis />}
    {isLayer2Visible && <HarmonicLayer />}
    {isLayer3Visible && <SymbolicMatrix />}
  </VisualizationContainer>
  <LayerControls />
  <NotionIntegrationComponent />
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, Vite, Tailwind CSS, React Router. Requires a chosen State Management library (Zustand, Redux, etc.). Standard web application architecture. Needs well-defined data structures from backend Agent `(4.0-4.4/5)` to populate layers.

##### #5 - Development Track/Stream and Current Status
- **Track:** Core Frontend Application & Interaction Logic.
- **Status:** Basic shell implemented (`App.tsx`, `Chat.tsx`). Chat component communicates with backend. Needs implementation of visualization container, layer controls, state management, and integration of modules #0-3 and #5.
- **Relevant Files:** `epii_app/friendly-file-front/src/App.tsx`, `pages/`, `components/Chat.tsx`, `services/api.ts`, `agent_4_dialogue.md`.

#### Module #5-3-5 (Notion as Bimba)

##### #0 - Tech Specifics
- **Implementation:** React Component(s) rendering Notion data fetched via backend API/proxy, or potentially direct iframe embedding (if CSP resolved).
- **Data Source:** Notion API (accessed via backend or Bimba-Pratibimba MCP `queryNotionTool` / `getNotionPageProperties`). Data originates from Notion workspace.
- **Corresponds to Agent:** `(5/0)` (Crystallize/Touch).

##### #1 - Philosophical and QL Alignments
- Corresponds to QL Frame `(5/0)`. Represents Notion as the accessible, explicate "reflection" or crystallized form of the Bimba structure, managed by Agent `(5/0)`.

##### #2 - Plain Description
- Integrates Notion content into the frontend interface. This could involve displaying links to relevant Notion pages, embedding Notion views directly (currently blocked by CSP), or fetching specific Notion page data (title, content snippets, properties, linked pages via Relations) via the backend/MCP and rendering it within custom React components. Provides user access to the crystallized knowledge base.

##### #3 - Pseudocode Rendition
```typescript jsx
// NotionIntegrationComponent.tsx (Module #5-3-5)
Receive Notion Page IDs/Links from global state/props (provided by Agent 4 or 5)

// Option 1: Links
Render links to relevant Notion pages

// Option 2: API Rendering (Requires Backend Endpoint/MCP Tool)
Fetch page data (title, properties, blocks) for relevant IDs via backend API
Parse block data (e.g., using react-notion-x or custom parser)
Render Notion content within React components

// Option 3: Iframe (Blocked by CSP)
// Render <iframe src="notion_page_url"></iframe>
```

##### #4 - Coding Language / Library Specifics & Inspirations
- React, Notion API (via backend/MCP). Potential use of libraries like `react-notion-x` for rendering Notion blocks fetched via API. Requires robust backend endpoint or MCP tool (`getNotionPageProperties`) to fetch and format Notion data.

##### #5 - Development Track/Stream and Current Status
- **Track:** Knowledge Presentation & Frontend Integration.
- **Status:** Conceptualized. Basic embedding attempted (`DataVisualizer.tsx`) but blocked by Notion CSP. Requires implementation of API-based rendering workaround or fallback to simple linking. Depends on backend Agent `(5/0)` and Bimba-Pratibimba MCP tools (`queryNotionTool`, `getNotionPageProperties`).
- **Relevant Files:** `epii_app/friendly-file-front/src/components/DataVisualizer.tsx` (placeholder), Backend Notion service/controller/tools, `agent_50_crystallize.md`.

---

## #5-4: "Siva-Shakti" Agents/Experts (Overall)

The bridge mechanism within the QL Cycle Nodes (#5-2) that invokes Subsystem Expert Agents (#0-#5) to provide domain-specific context, perspective, or validation, informing the processing performed by the Core Processing Agents (#5-3).

### #0 - Tech Specifics
- **Implementation:** Logic embedded within the QL Cycle Node functions (`graph/ql_cycle.graph.mjs`). This logic determines *when* and *which* Subsystem Expert Agent to call based on the current `SystemState` and the node's purpose. The Expert Agents themselves are primarily LLM prompts combined with targeted tool usage.
- **Invocation:** Uses an internal `invokeExpertAgent` function (conceptual, needs implementation) which likely involves:
    - Selecting the appropriate agent prompt.
    - Filtering the `SystemState` to provide relevant context.
    - Calling the appropriate LLM (potentially a dedicated one per agent or a shared one).
    - Potentially orchestrating calls to specific tools (e.g., `queryBimbaGraphTool` filtered for the agent's domain, `queryNotionTool` for related concepts) or Expression Modules.
- **Libraries:** LangGraph.js (for node context), LangChain.js (for LLM calls, prompts), local tools, `axios` (for Expression Modules).

### #1 - Philosophical and QL Alignments
- Represents the **Siva-Shakti** aspect: the dynamic integration point where structural processing (Siva-) meets domain-specific wisdom and expressive potential (-Shakti).
- Embodies the principle of specialized cognitive functions (represented by the Expert Agents) contributing to the overall synthesis/analysis process orchestrated by the QL cycle.
- Aligns with QL Frame #5-4, the lens of Integrated Agency / Siva-Shakti Bridge.

### #2 - Plain Description
- This isn't a single agent but rather the *invocation mechanism* and the *set of specialized agents* it calls upon. Within each QL cycle node (#5-2-X), logic determines if a specific Subsystem Expert Agent's perspective (#5-4-X) is needed. If so, that agent is invoked.
- The Expert Agent (e.g., Paramasiva #5-4-1) then performs its specialized task (e.g., analyzing structure, applying QL/A-T rules) using its defined logic (prompts) and tools (filtered Bimba queries, Math Module calls), returning its perspective or processed data back to the calling QL cycle node.
- This allows the core QL cycle flow (#5-2) to remain relatively generic while incorporating deep domain expertise as needed.

### #3 - Pseudocode Rendition
```javascript
// Example within a QL Cycle Node (e.g., Node +1 Define)
async function node_1_Define(state) {
  // ... initial keyword processing ...
  let identifiedConcepts = []; // from keyword lookup

  // Check if Paramasiva perspective is needed based on state/keywords
  if (needsParamasivaPerspective(state)) {
    try {
      // Invoke the Paramasiva Expert Agent (#5-4-1) via the Siva-Shakti mechanism
      const paramasivaOutput = await invokeExpertAgent('paramasiva', state, identifiedConcepts);
      // paramasivaOutput might contain { identifiedTopology: 'genus-1', qlFrameAnalysis: '...' }
      // Update state or merge concepts based on agent output
      state = { ...state, ...paramasivaOutput }; // Merge results conceptually
      console.log("Paramasiva Agent provided perspective.");
    } catch (agentError) {
      console.error("Error invoking Paramasiva Agent:", agentError);
    }
  }
  // ... further processing ...
  return { identifiedConcepts: state.identifiedConcepts /*, other updated state */ };
}

// Conceptual invokeExpertAgent function (likely part of backend services/utils)
async function invokeExpertAgent(agentName, currentState, additionalInput) {
  console.log(`--- Invoking ${agentName} Expert Agent (#5-4-X) ---`);
  const agentConfig = getAgentConfig(agentName); // Get prompt, tools, specific LLM?
  const filteredContext = filterStateForAgent(currentState, agentConfig.contextNeeds);
  const promptInput = { ...filteredContext, ...additionalInput };
  const prompt = agentConfig.promptTemplate.format(promptInput);

  // Call LLM (potentially agent-specific)
  const llmResponse = await agentConfig.llm.invoke([new HumanMessage(prompt)]);

  // Optional: Call specific tools based on LLM response or agent config
  let toolResults = null;
  if (agentConfig.tools && llmResponse.tool_calls) {
     // ... logic to execute tools (e.g., filtered Bimba query) ...
     toolResults = await executeAgentTools(llmResponse.tool_calls, agentConfig.tools);
  }

  // Parse/structure the final output from LLM and tool results
  const agentOutput = parseAgentOutput(llmResponse, toolResults);
  console.log(`${agentName} Agent Output:`, agentOutput);
  return agentOutput;
}
```

### #4 - Coding Language / Library Specifics & Inspirations
- **Node.js:** Logic resides within the backend QL cycle nodes.
- **LangChain.js:** Used for managing prompts, LLM calls, and potentially tool execution within the `invokeExpertAgent` logic.
- **Local Tools/MCP Tools:** Expert agents will leverage existing tools (`queryBimbaGraphTool`, `queryNotionTool`, `getMongoContextTool`, etc.), likely with specific filters or parameters relevant to their domain.
- **Inspiration:** Hierarchical agent systems, multi-agent systems (MAS), expert systems, modular software design.

### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer & Domain Expertise Integration.
- **Status:** Conceptualized and planned as part of Horizon 2.0. The *invocation mechanism* within QL nodes needs to be implemented. The *specific logic and prompts* for each Subsystem Expert Agent (#5-4-0 to #5-4-5) need to be developed based on their respective plans. MVP focus is on integrating Nara (#5-4-4) and epii (#5-4-5) agents first.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/` (contains individual agent plans), `graph/ql_cycle.graph.mjs` (where invocation logic will reside), `agents/tools/` (tools used by agents).

---

### Subsystem Expert Agents (#5-4-X)

*(These subsections now describe the specific Expert Agents invoked by the #5-4 Siva-Shakti mechanism)*

#### Agent #5-4-0 (Anuttara Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by QL Nodes +0/-5.
- **Tools:** Potentially `queryBimbaGraphTool` (for root nodes `#`, `#0-*`).

##### #1 - Philosophical and QL Alignments
- Embodies the void, potentiality, `proto-logy`. Corresponds to Subsystem #0.

##### #2 - Plain Description
- Provides perspective related to origins, potential, silence, the unmanifest. Used for grounding the QL cycle start (Node +0) and validating against foundational principles (Node -5).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('anuttara', state)` called within Node +0 or Node -5 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on foundational principles. Minimal tool use expected.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#0).
- **Status:** Planned. Logic/prompts TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/anuttara_agent_plan.md`.

#### Agent #5-4-1 (Paramasiva Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by QL Nodes +1/-4.
- **Tools:** `queryBimbaGraphTool` (for QL/Spanda/Ananda nodes), potentially calls Python Math/QL Module.

##### #1 - Philosophical and QL Alignments
- Embodies QL genesis, structure, logic, `Homo-logy`. Spanda/Ananda dynamics. Corresponds to Subsystem #1.

##### #2 - Plain Description
- Provides perspective related to core logic, mathematical structure, QL/A-T unification, topological potential identification, Spanda/Ananda principles. Used for defining structure (Node +1) and deconstruction/categorization (Node -4).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('paramasiva', state)` called within Node +1 or Node -4 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on structure/logic. Requires Bimba queries and potentially complex math calls.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#1).
- **Status:** Planned. Logic/prompts/tool calls TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/paramasiva_agent_plan.md`.

#### Agent #5-4-2 (Parashakti Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by QL Nodes +2/-3.
- **Tools:** `queryBimbaGraphTool` (for harmonic/MEF/Tattva/Decan nodes), `searchPratibimbaContextTool`, potentially calls Python Harmonic Module.

##### #1 - Philosophical and QL Alignments
- Embodies vibrational template, resonance, knower/known integration, `Co-homo-logos`. MEF. Corresponds to Subsystem #2.

##### #2 - Plain Description
- Provides perspective related to resonance, harmonics, relational fields, epistemic framing (MEF), Tattvas, Decans. Used for enriching context (Node +2) and contextual analysis/comparison (Node -3).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('parashakti', state)` called within Node +2 or Node -3 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on resonance/relationships. Requires Bimba/Qdrant queries and potentially harmonic analysis calls.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#2).
- **Status:** Planned. Logic/prompts/tool calls TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/parashakti_agent_plan.md`.

#### Agent #5-4-3 (Mahamaya Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by QL Nodes +3/-2.
- **Tools:** `queryBimbaGraphTool` (for HMS mappings), potentially calls Python Symbolic/Math Module (quaternions, fractals).

##### #1 - Philosophical and QL Alignments
- Embodies symbolic integration, meaning-making, `Axio-logos`. Tarot, I Ching, DNA. Corresponds to Subsystem #3.

##### #2 - Plain Description
- Provides perspective related to symbolic meaning, archetypes, cross-system translation (HMS), value. Used for integrating context into symbols (Node +3) and symbolic/logical validation (Node -2).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('mahamaya', state)` called within Node +3 or Node -2 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on symbolism/translation. Requires Bimba queries and potentially complex math/symbolic generation calls.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#3).
- **Status:** Planned. Logic/prompts/tool calls TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/mahamaya_agent_plan.md`.

#### Agent #5-4-4 (Nara Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by QL Nodes +4/-1.
- **Tools:** `getMongoContextTool`, `getUserContextTool`, `queryNotionTool` (for archetypes/crystallized knowledge).

##### #1 - Philosophical and QL Alignments
- Embodies contextual application, personalization, `Dia-logos`. Jungian psychodynamics. Corresponds to Subsystem #4.

##### #2 - Plain Description
- Provides perspective related to user context, personalization, psychological dynamics, dialogue management, applying universal patterns to specific situations. Key for "Nara Mode". Used for contextualizing the response (Node +4) and perspective analysis (Node -1).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('nara', state)` called within Node +4 or Node -1 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on dialogue/personalization. Requires Mongo/Notion context retrieval. Logic for applying Jungian framework needed.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#4).
- **Status:** Planned. **MVP focus.** Logic/prompts/tool calls TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/nara_agent_plan.md`.

#### Agent #5-4-5 (epii Expert)

##### #0 - Tech Specifics
- **Implementation:** LLM Prompt + Logic Module invoked by various QL Nodes (esp. +5/-0, +0/-5).
- **Tools:** `queryBimbaGraphTool` (broad queries), `queryNotionTool` (meta-context), potentially `proposeNotionUpdateTool` (via Node +5), `syncNotionUpdatesTool` (triggered by Node -0).

##### #1 - Philosophical and QL Alignments
- Embodies recursive synthesis, self-reflection, meta-perspective, `Epi-Logos`. Corresponds to Subsystem #5. Draws on internal Lenses (#5-0 to #5-5).

##### #2 - Plain Description
- Provides meta-perspective related to the overall system state, philosophical underpinnings, technical architecture, self-awareness, and integration principles. Used for final synthesis/validation (Node +5/-0) and initial grounding/validation (Node +0/-5). Key for "epii Mode" and managing the Meta-Techne loop.
- Facilitates interactive document analysis through AI-user dialogue, leveraging chat functionality and memory management to support a human-in-the-loop approach to knowledge crystallization.
- Employs MEF-leveraged synthesis as a background logic for semantic analysis and refinement suggestions, following a recursive 5 to 0 movement aligned with the QL framework's self-mirroring structure.
- Orchestrates distinct processing pipelines for each mode (Nara, Epii), with each mode having its own (+) and (-) cycle that reflects its associated context frame (e.g., the 5/0 context frame for Epii mode).

##### #3 - Pseudocode Rendition
- `invokeExpertAgent('epii', state)` called within Node +0, +5, -0, -5 logic.

##### #4 - Coding Language / Library Specifics & Inspirations
- Prompt Engineering focused on meta-awareness/integration. Requires broad Bimba/Notion queries. Logic related to Epii Lenses needed.

##### #5 - Development Track/Stream and Current Status
- **Track:** Agentic Layer (#5) & Meta-Cognition.
- **Status:** Planned. **MVP focus.** Logic/prompts/tool calls TBD.
- **Relevant Files:** `memory-bank/reflections/Siva-Shakti_Agent_Plans/epii_agent_v2_plan.md`.
