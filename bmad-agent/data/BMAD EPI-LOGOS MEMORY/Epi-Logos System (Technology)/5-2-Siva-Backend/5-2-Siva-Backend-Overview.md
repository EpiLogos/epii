# 5-2 Siva-Backend: Overview

## 1. Current Architecture (As per `epii_app/friendly-file-backend/README.md`)

The `friendly-file-backend` currently serves as the universal nervous system and brain of the Epi-Logos system, embodying the **#5-2 Siva-** aspect of the Bimba architecture. While its primary focus is the **Epii agent mode**, it's designed to govern all Quaternal Logic (QL) cycles and pipelines for dynamic, modular, and evolvable data/epistemic processing across all six subsystems (Anuttara through Epii).

### Key Current Functions:

*   **Universal QL Cycle Orchestration**: Manages QL cycles (descent-to-source and ascent-to-expression) for any agent, with the current implementation centered on Epii's 6-stage analysis pipeline (Stage -5 to -0).
*   **Advanced Memory Architecture**: Orchestrates the Bimba-Pratibimba memory system via BPMCP and LightRAG MCP services.
*   **Agent-Agnostic Processing Engine**: Provides modular epistemic processing, extendable to all six subsystem agents (currently specialized for Epii).
*   **Intelligent Context Synthesis**: Combines structural (Bimba), semantic (Pratibimba), and crystallized (Notion) knowledge.
*   **Multi-Modal Integration**: Orchestrates Google Generative AI, LangSmith tracing, and cross-database operations.

### Advanced Memory Systems:

*   **Bimba-Pratibimba Memory-MCP Server (`Cline/MCP/Bimba-Pratibimba-Memory-MCP/`)**: A WebSocket-enabled MCP server with 12 specialized tools for accessing Bimba (structural), Pratibimba (dynamic), MongoDB (document), Notion (crystallized), and Web (external) memory.
    *   **Bimba Tools**: `bimbaKnowing` (advanced semantic search and graph traversal), `queryBimbaGraph` (direct Cypher execution), `generateBimbaEmbeddings`.
    *   **Pratibimba Tools**: `searchPratibimbaContext` (semantic search in Qdrant).
    *   **MongoDB Tools**: `getMongoContext` (user histories, conversations, episodic memory).
    *   **Notion Tools**: `queryNotion`, `getNotionPageProperties`, `appendNotionBlock`, `crystallizeToNotion` (core crystallization).
    *   **Web Tools**: `searchWeb`, `researchAndIntegrate`.
*   **LightRAG MCP Server (`Cline/MCP/lightrag-mcp-server/`)**: A Python-based graph+vector fusion system (Neo4j + Qdrant) with capabilities for local, global, and mixed-mode retrieval, Bimba coordinate integration, and high-performance processing. It uses an HTTP API and WebSocket support.

### Current Epii Agent Analysis Pipeline (QL (-) Cycle):

*   **Stage -5: Document Fetching and Preprocessing**: Multi-source retrieval, content extraction, metadata preservation, caching.
*   **Stage -4: Contextual Analysis Preparation**: Comprehensive context gathering (Bimba map, user memory, coordinate-specific), enhanced `bimbaKnowing` integration, project context synthesis, dynamic context window generation.
*   **Stage -3: Structural Integration and LightRAG Ingestion**: Intelligent document chunking, LightRAG ingestion, Bimba coordinate tagging, context preservation.
*   **Stage -2: Core Analysis Engine (Recently Enhanced & Partially Tested)**: Chunk group processing, enhanced context fusion (LightRAG, Bimba, MongoDB) with target coordinate prioritization, semantic coordinate mapping, pattern-based archetypal recognition, QL operator extraction, relational properties generation, variation identification.
    *   **Enhancements (Partially Tested)**: Target Coordinate Prioritization, Semantic Mappings Logic, Archetypal Anchors Pattern Inference.
*   **Stage -1: Synthesis and Core Element Definition**: Analysis integration, core element extraction, relational properties synthesis, preparation for crystallization.
*   **Stage -0: Payload Generation and Epii Perspective**: Notion payload formatting, Epii agent meta-reflective synthesis, property generation, crystallization preparation.

### Current Directory Structure (Simplified from README and Refactoring Plan Initial Assessment):

```
friendly-file-backend/
├── controllers/        # HTTP request handlers
├── routes/             # API endpoint definitions
├── services/           # Business logic, external service integrations (BPMCP, LightRAG, LLMs, DBs)
├── models/             # MongoDB schemas and data models
├── pipelines/          # Epii Analysis Pipeline (QL cycle stages)
├── graph/              # Neo4j graph interaction (likely via services)
├── subsystems/         # Placeholder for Bimba-aligned structure (currently minimal)
├── prompts/            # LLM prompts
├── utils/              # Utility functions (caching, document processing, Notion, QL)
├── config/             # Database connections, CORS, environment variables
└── index.mjs           # Main application entry point
```

## 2. Intended/Refactored Architecture (As per `memory-bank/Bimba Tech Architecture Refactoring Plan.md`)

The refactoring plan aims to align the `friendly-file-backend` more explicitly with the Bimba architecture, creating a clearer separation between universal database operations and agent-specific functionalities.

### Target Bimba Structure (Corrected from Refactoring Plan):

```
friendly-file-backend/ (#5-2 Siva-)
├── databases/                    # Universal database functions & MCP servers
│   ├── neo4j/                   # Neo4j database operations & utils
│   ├── lightrag/                # LightRAG MCP (neo4j + qdrant)
│   ├── mongodb/                 # MongoDB operations & utils
│   ├── notion/                  # Notion database operations
│   ├── bpmcp/                   # BPMCP server integration (client-side logic for backend)
│   ├── shared/                  # Shared database utilities, models, foundational utils
│   │   ├── models/              # Shared data models (e.g., for documents, users, across DBs)
│   │   ├── utils/               # Foundational utilities (e.g., ql, graphData, caching relevant to DB ops)
│   │   └── services/            # Shared database services (e.g., generic CRUD, connection managers)
│   ├── api/                     # Shared API layer for database operations (if direct access needed beyond agents)
│   │   ├── controllers/         # General database operation controllers
│   │   └── routes/              # Shared routes (e.g. for chat, graph, notion, documents if not agent-specific)
│   └── config/                  # Database configurations (connection strings, credentials access)
├── subsystems/                  # Agent-specific functionality & QL cycle implementations
│   ├── 0_anuttara/             # Foundational agent logic
│   ├── 1_paramasiva/           # QL/AT Logic agent logic
│   ├── 2_parashakti/           # Harmonic layer agent logic
│   ├── 3_mahamaya/             # Symbolic transform agent logic
│   ├── 4_nara/                 # Nara agent logic (includes synthesis pipeline, contextual processing, user interaction management, and Nara-specific services/controllers)
│   └── 5_epii/                 # Epii agent logic (includes analysis pipeline, Epii-specific services/controllers)
├── shared/                     # Shared components NOT specific to databases (e.g., general app utilities, non-DB models)
│   ├── services/               # General application services (e.g., authentication, logging not tied to a DB type)
│   ├── models/                 # Non-database specific models (e.g., API request/response structures)
│   └── utils/                  # General application utilities
├── api/                        # Main application API layer (routes calls to agent subsystems or shared services)
│   ├── controllers/            # Top-level controllers orchestrating agent subsystems
│   └── routes/                 # Main API routes exposed to the frontend/back2front
├── config/                     # Root application configuration (server port, global settings)
└── index.mjs                   # Main application entry point
```

### Key Aspects of Refactoring:

*   **Bifurcation**: Clear separation between:
    *   `databases/`: Universal database functions, MCP client integrations, shared database models/utils, and potentially direct DB API endpoints.
    *   `subsystems/`: Agent-specific logic, QL cycle implementations, and unique functionalities for each of the six Bimba layers (0-Anuttara to 5-Epii).
*   **Shared Components**: Introduction of `shared/` directories at both the `databases/` level (for database-related shared code) and the root level (for general application-shared code).
*   **API Layer**: A refined `api/` directory at the root to handle incoming requests and delegate them to the appropriate agent subsystems or shared services.
*   **Agent-Specific Logic**: Each directory within `subsystems/` (e.g., `5_epii/`) will house all components specific to that agent, including its unique controllers, services, pipelines, and models if they are not shared.

### Migration Considerations (General from Plan):

*   **Controllers (`controllers/`)**: Likely to be split. Some may move into specific agent `subsystems/{agent_name}/controllers/` if they handle agent-specific logic. Others might become part of the root `api/controllers/` for orchestrating or `databases/api/controllers/` if they provide direct generic database access.
*   **Routes (`routes/`)**: Similar to controllers, routes will be re-mapped. Agent-specific routes go to `subsystems/{agent_name}/routes/`, general API routes to `api/routes/`, and database-specific API routes to `databases/api/routes/`.
*   **Services (`services/`)**: This will see significant reorganization.
    *   Database-specific services (e.g., `neo4j.service.mjs`, `qdrant.service.mjs`, parts of `bpMCPService.mjs` dealing with client-side DB interaction) would move under `databases/{db_type}/` or `databases/shared/services/`.
    *   Agent-specific services (e.g., `epii-agent.service.mjs`, `analysis.service.mjs`, `crystallization.service.mjs`) would move into `subsystems/5_epii/services/`.
    *   Truly shared, non-DB application services would go into the root `shared/services/`.
*   **Models (`models/`)**: MongoDB schemas in `models/` would likely move to `databases/mongodb/models/` or `databases/shared/models/` if they are used by multiple database services.
*   **Pipelines (`pipelines/`)**: The Epii Analysis Pipeline (`epii_analysis_pipeline_refactored.mjs` and its stages) would move into `subsystems/5_epii/pipelines/`.
*   **Utils (`utils/`)**: Will be distributed based on specificity.
    *   Database-centric utils (e.g., `ql.utils.mjs`, `graphData.utils.mjs`, `cache.utils.mjs` if DB-caching) to `databases/shared/utils/`.
    *   Agent-specific utils to their respective `subsystems/{agent_name}/utils/`.
    *   General app utils to root `shared/utils/`.
*   **Prompts (`prompts/`)**: Likely to be co-located with the agent services that use them, e.g., `subsystems/5_epii/prompts/`.
*   **Config (`config/`)**: `db.config.mjs` to `databases/config/`. `cors.config.mjs` might stay in root `config/` or move to `api/config/`.

This refactoring will enhance modularity, clarify responsibilities, and make the backend more scalable and aligned with the Bimba philosophical and architectural principles.