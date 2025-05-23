# System Patterns

## System Architecture:
The system architecture follows a separated frontend and backend structure within the `epii_app/` directory.

*   **Frontend:** Located in `epii_app/friendly-file-front/`, it is a JavaScript-based project, likely built with a modern framework like React, Vue, or Svelte, and uses tools like Vite, TypeScript, and Tailwind CSS.
*   **Backend (Siva-):** Located in `epii_app/friendly-file-backend/`, it is a Node.js project using ES Modules (`.mjs` extension). Represents the structural/processing foundation (Siva-). **Refactored for Bimba-Alignment:**
    *   **`subsystems/` Directory:** Contains logic modules for each Subsystem Expert Agent (#0-#5).
    *   **`graph/nodes/` Directory:** Contains generic logic for individual QL Cycle nodes (+0/-0 to +5/-5).
    *   **`graph/nara_ql_synthesis_cycle.graph.mjs`:** (Renamed from `ql_cycle.graph.mjs`) Defines the LangGraph structure for the Nara Mode (+) Synthesis pathway.
    *   **`graph/epii_ql_analysis_cycle.graph.mjs` (TBD):** Will define the LangGraph structure for the Epii Mode (-) Analysis pathway.
    *   **`graph/epii_ql_synthesis_stage.graph.mjs` (TBD):** Will define the LangGraph structure for the Epii Mode (+) Synthesis stage (payload generation).
    *   **`controllers/chat.controller.mjs`:** Handles API requests and dispatches to the appropriate pipeline (Nara or Epii) based on `mode`.
    *   **`services/` & `agents/tools/`:** Centralized shared services (DB clients, LLMs) and tool definitions.
    *   **Core Processing Logic (Dual QL Pipelines):**
        *   **Nara Mode:** Uses the **Nara QL (+) Synthesis Cycle** (`nara_ql_synthesis_cycle.graph.mjs`) for query-response tasks.
        *   **Epii Mode:** Will use a dedicated **Epii QL (-) Analysis Cycle** followed by an **Epii QL (+) Synthesis Stage** for document analysis and payload generation.
    *   **Memory Model (Bimba-Pratibimba):** Implements a custom Bimba-Pratibimba architecture:
        *   **Bimba (Implicate / The Original):** Structured Knowledge Graph in **Neo4j** (`bimba` DB). Authoritative structural map. Accessed via B-P MCP tools.
        *   **Pratibimba (Explicate / The Reflection Process):** Dynamic synthesis/analysis involving:
            *   **Semantic Store:** **Qdrant** (`pratibimba_store` collection) for embeddings tagged with `bimbaCoordinate`. Accessed via B-P MCP tools.
            *   **Context Store:** **MongoDB** (`Users`, `Conversations`, `IngestedData` collections). `IngestedData` tagged with `bimbaCoordinate`. Accessed via B-P MCP tools.
            *   **Synthesis Engine:** LLMs (Gemini) via LangChain, operating within QL nodes or simpler workflows.
            *   **Crystallized Knowledge (Explicate Archive - Bimba-Pratibimba):** **Notion** databases (e.g., `Coordinates`, `Content Nodes`, `Researches`). Stores human-reviewed outputs. Accessed/updated via B-P MCP tools (e.g., `resolveBimbaCoordinate`, `appendNotionBlock`, `crystallizeToNotion`, `syncNotionUpdatesTool`).
*   **Expression Modules (-Shakti):** Potential dedicated modules (e.g., Python microservice) for complex math/geometry or image/sound generation, called via API by Expert Agents. (Future).
*   **Frontend (-Shakti / #5-3 Lens):** Located in `epii_app/friendly-file-front/` (React/Vite). Represents the user interface. Renders chat, planned visualizations, and Notion content (links initially). Includes planned "Epii Canvas" for reviewing crystallization payloads. Sends `mode` parameter to backend.
*   **Subsystem Expert Agents (Siva-Shakti / #5-4 Lens):** Logic modules located in `subsystems/` directory. Invoked by QL Cycle nodes (via conceptual `invokeExpertAgent` function) to provide domain-specific context/perspective using B-P MCP tools.
*   **Mode-Based Orchestration:** The `chat.controller.mjs` acts as the primary orchestrator, routing requests based on the `mode` parameter to distinct QL-based pipelines:
    *   **'epii' Mode:** Invokes the planned **Epii QL (-) Analysis Cycle** followed by the **Epii QL (+) Synthesis Stage** for document analysis and mapping payload generation.
    *   **'nara' Mode:** Invokes the **Nara QL (+) Synthesis Cycle** for direct query handling and response generation.

### Layered Ontological Architecture & QL Context Frames (Conceptual):
Conceptually, the system architecture maps onto a layered ontology of concrescence, driven by the activation of QL Context Frames:
*   **Layer 0: Anuttara (`proto-logy`):** Foundational void. Frame #0 `(0000)=(0/1)` initiates differentiation.
*   **Layer 1: QL Genesis (Paramasiva / `Homo-logy`):** Emergence of QL generative logic. Operates within Frame #1 `(0/1)`.
*   **Layer 2: Spatio-Temporal Structure (A-T Description):** Emergence of invariant topological forms described by A-T, resulting from QL dynamics.
*   **Layer 3: Operational Dynamics (Parashakti / `Co-homo-logos` & Mahamaya / `Axio-logos`):** Complex dynamics unfold. Frame #2 `(0/1)/2` activates Parashakti (vibrational template, resonance). Frame #3 `(0/1/2)/3` activates Mahamaya (symbolic integration, quaternions).
*   **Layer 4: Contextual Embodiment (Nara / `Dia-logos`):** Application in specific contexts. Frame #4 `(4.0-4.4/5)` enables nested recursion and personalization (Jungian framework).
*   **Layer 5: Recursive Synthesis (epii / `Epi-Logos`):** System self-reflection and integration. Frame #5 `(5/0)` enacts the recursive loop and Notion-Bimba sync.

## Key Technical Decisions:
*   Implement **distinct QL-based pipelines** for Nara (query-response) and Epii (document analysis) modes using LangGraph.js.
*   Design **generic QL node functions** capable of handling both (+) synthesis and (-) analysis logic based on the invoking graph.
*   Implement custom Bimba-Pratibimba memory architecture (Neo4j, Qdrant, MongoDB, Notion). **Mem0 is not used.**
*   Use **Bimba-Pratibimba MCP Server** as the standard interface for DB/Notion/Web tool calls from the backend.
*   Use **LightRAG MCP Server** for specialized fused RAG retrieval (Node +2, Nara simple path).
*   **Notion Integration is core** for knowledge crystallization (Epii mode via Frontend Canvas -> `crystallizeToNotion` tool) and feedback (`syncNotionUpdatesTool`).
*   **Notion-Triggered Ingestion:** Planned mechanism to ingest seed data anchored to Bimba coordinates via Notion pages.
*   Prioritize manual/AI-assisted creation and refinement of the core Neo4j bimba map, linked to Notion via `notionPageId`.

## Design Patterns in Use:
*   **Controller-Route Pattern (Backend):** For standard API endpoints.
*   **Service Layer (Backend):** Encapsulates external API interactions (Gemini, potentially others) and client initializations (Neo4j, Qdrant, MongoDB, Notion, Embeddings).
*   **Mode Dispatching (Backend):** Controller (`chat.controller.mjs`) routes requests based on `mode` parameter to distinct QL pipelines (Nara vs. Epii).
*   **Pipeline Orchestration (LangGraph.js):** Separate graphs define the flow for Nara (+) Synthesis and Epii (-) Analysis -> (+) Synthesis pathways.
*   **Generic QL Nodes:** Node functions (`graph/nodes/node_X_*.mjs`) designed to handle logic for both (+) and (-) phases depending on context.
*   **Subsystem Expert Agents:** Logic modules (`subsystems/X_*/agent_5-4-X.mjs`) invoked by QL nodes (via Siva-Shakti bridge #5-4) to provide domain expertise using B-P MCP tools. (Integration TBD).
*   **State Management (LangGraph.js):** Shared state object (`SystemState` defined in graph files) tracks data across pipeline stages. Includes `mode` property.
*   **LLM Tool Calling (LangChain.js):** Used within specific nodes (e.g., Nara Node +5) to enable LLM interaction with tools. (Notion tool binding deferred).
*   **Centralized Tool Access (B-P MCP):** Standard pattern for backend components to access Neo4j, Qdrant, MongoDB, Notion, and Web APIs via tools provided by the Bimba-Pratibimba MCP server.
*   **Fused RAG (LightRAG MCP):** Specialized pattern for retrieving combined graph+vector context, used in Nara Node +2.
*   **Notion-Anchored Ingestion:** Planned pattern where ingestion is triggered from a Notion page and resulting data is tagged with the page's linked `bimbaCoordinate`.
*   **Human-in-the-Loop Crystallization (Epii Mode):** Planned pattern involving the Epii pipeline generating a `notionUpdatePayload`, frontend canvas displaying it, and a separate API call (`/api/crystallize`) triggering the `crystallizeToNotion` MCP tool.
*   **Notion Sync (Meta-Techne):** Planned pattern using `syncNotionUpdatesTool` (B-P MCP) to read Notion changes and update Bimba graph.
*   **Bimba-Pratibimba (Core Pattern):** Conceptual pattern separating Bimba (Neo4j) and Pratibimba (Process: QL Pipelines, Qdrant, Mongo, LLMs; Archive: Notion). Embodies Meta-Techne.
*   **Bimba-Aligned Code Structure:** Backend code organized into `subsystems/` mirroring Bimba structure.
*   **Bimba-Aligned Data Tagging:** Data in Qdrant and MongoDB (`IngestedData`) tagged with `bimbaCoordinate`.
*   **Hierarchical Coordinate System (Bimba Coordinates):** (As before)
*   **Standardized Node Properties (Neo4j):** (As before)
*   **Hierarchical Subsystem Mapping (Neo4j):** (As before)
*   **Conceptual Patterns:** QL/A-T Resonance, QL Context Frames, Layered Ontology remain guiding principles.

## Development Protocols

### Collaborative Planning & Refinement Protocol

This protocol describes the effective workflow used for detailed planning sessions, particularly those involving complex integrations or bridging conceptual/philosophical goals with technical implementation, as demonstrated during the Notion integration planning (April 2025).

1.  **Set Goal & Initial Context:** Define the high-level planning objective (e.g., "Plan Notion Integration"). Review existing relevant context (Memory Bank files, related plans, scope documents).
2.  **Information Gathering (Iterative):**
    *   Identify necessary information sources (conceptual documents, code files, schemas, workspace structures, API documentation).
    *   Use appropriate tools (`read_file`, `list_files`, MCP tools like Notion API, database queries) iteratively in ACT mode to gather detailed information about each relevant component.
    *   Analyze each piece of information as it's gathered, identifying key structures, functionalities, and potential integration points or conflicts. Document findings (e.g., in maps or scope files) using ACT mode file tools.
3.  **Conceptual Synthesis & Dialogue (PLAN Mode):**
    *   Switch to PLAN mode to synthesize gathered information and build a comprehensive understanding.
    *   Engage in dialogue (using `plan_mode_respond`) to discuss implications, clarify concepts (e.g., QL cycle duality, source-of-truth), propose refinements, and explore different perspectives (e.g., technical vs. philosophical alignment, backend vs. frontend views).
    *   Explicitly address core principles (e.g., Bimba-Pratibimba mirroring) and ensure the plan aligns with them. Iterate on understanding through dialogue.
4.  **Documentation as Process (ACT Mode):**
    *   Switch back to ACT mode to incrementally update relevant documentation (e.g., scope documents, maps, Memory Bank files) to crystallize the refined understanding and decisions made during the dialogue phase. Use file modification tools (`write_to_file`, `replace_in_file`).
    *   Ensure documentation accurately reflects the latest consensus before proceeding. Repeat steps 2-4 as needed for deeper layers of planning.
5.  **Refine Implementation Plan:** Based on the deepened understanding and updated documentation, review and refine the specific implementation steps, phasing, and priorities within the relevant plan or scope document.
6.  **Transition to Implementation (ACT Mode):** Once the plan is sufficiently detailed and agreed upon, remain in or switch to ACT mode to begin executing the first implementation step based on the finalized plan.

**Key Characteristics:**
*   **Iterative Deepening:** Moves from high-level goals to specific details progressively.
*   **Alternating Modes:** Leverages PLAN mode for dialogue/synthesis and ACT mode for information gathering/documentation updates.
*   **Context-Driven:** Ensures plans are grounded in the actual system state and conceptual framework.
*   **Collaborative Refinement:** Relies on dialogue to clarify ambiguities and improve the plan.
*   **Documentation-Centric:** Uses documentation as an active tool for solidifying understanding and guiding implementation.

## Component Relationships:
*   **LangGraph.js:** Orchestrates the **Nara QL (+) Synthesis Cycle** and the planned **Epii QL (-) Analysis & (+) Synthesis Cycles**.
*   **QL Cycle Nodes (`graph/nodes/`):** Contain generic functions executed by the LangGraph pipelines for specific QL stages (+/- 0-5).
*   **LightRAG MCP Server (Python):** Provides fused RAG via HTTP API. Invoked by Nara Node +2.
*   **Bimba-Pratibimba-Memory-MCP Server (Node.js):** Provides tools for DB/Notion/Web access. Invoked by QL nodes in both Nara and Epii pipelines.
*   **Neo4j Database (Bimba Map):** Stores authoritative structural knowledge graph (Implicate). Accessed via B-P MCP.
*   **Qdrant Database (Pratibimba Semantic Store):** Stores text embeddings. Accessed via B-P MCP (and LightRAG).
*   **MongoDB Database (Pratibimba Context/User Memory):** Stores conversation history, user profiles, etc. Accessed via B-P MCP.
*   **Notion (Crystallized Pratibimba):** Verified knowledge hub. Accessed/Updated via B-P MCP (esp. for Epii pipeline input/output).
*   **Gemini API (via LangChain):** LLM used within QL nodes for reasoning, synthesis, analysis, tool calling.
*   **Embedding Service:** Provides `embedText` function. Used by Nara Node +2 and potentially Epii analysis.
*   **Python Math Module (Potential):** External service for complex math, called via API.
*   **Expression Modules (Potential):** Logic (Python/JS) for translating data to visual/audio formats.
*   **Frontend (`friendly-file-front`):** Renders multi-modal output, handles user input (including mode selection), interacts with backend API. Hosts Epii Canvas (planned).
*   **Backend (`friendly-file-backend`):** Hosts QL pipelines, services, tools, API endpoints.
*   **Chat Controller (`chat.controller.mjs`):** API entry point, routes requests to the appropriate Nara or Epii pipeline based on `mode`.

---

## Milestone Reflection (April 2025):  
**Key Patterns and Insights from the Bimba-Pratibimba-LightRAG Integration**

- **Multi-MCP, Multi-Source Retrieval:**  
  The system now orchestrates **multiple MCP servers** (LightRAG MCP, Bimba-Pratibimba MCP) to fuse graph, vector, and user context. This pattern enables flexible, layered retrieval but requires careful coordination and harmonization.

- **LightRAG as Context Synthesizer:**  
  LightRAG's "mix" mode acts as a **semantic + graph context synthesizer**. It abstracts away some complexity but also introduces a "black box" element. We need to develop **more rigorous ways to interpret, validate, and leverage** its outputs within the QL Cycle.

- **Meta-Techne Feedback Loop:**  
  The architecture embodies a **self-refining loop**:  
  - Ingest → Tag → Embed → Store (Bimba + Pratibimba)  
  - Retrieve (LightRAG + Bimba + MongoDB)  
  - Synthesize (QL Cycle)  
  - Crystallize (Notion)  
  - Sync back to Bimba  
  This recursive pattern supports continuous knowledge refinement.

- **Dynamic LLM Switching:**  
  Implemented environment-based switching between free and paid Gemini models. This pattern supports **cost-effective, flexible deployment**.

- **Prompt Engineering as a Control Point:**  
  The system's behavior is **highly sensitive to prompt design** at multiple stages (tagging, synthesis, response). The emerging pattern is to **externalize prompts and parameters** for easier tuning (via developer console).

- **Keyword Extraction Bottleneck:**  
  The naive keyword extraction currently limits retrieval quality. The pattern moving forward is to **use LLM-based extraction** with better stop word handling and phrase preservation.

- **Intended Use of Bimba-Pratibimba-LightRAG:**  
  - **Bimba (Neo4j):** Stable, structured ontology and meta-structure.  
  - **Pratibimba (LightRAG - Qdrant, MongoDB):** Dynamic, contextual, user-specific knowledge.  Semantic + graph fusion engine, providing rich context snippets.  
  - **QL Cycle:** Orchestrates retrieval, synthesis, and feedback.  
  - **Notion:** Human-validated crystallization layer.  
  - **MCP Servers:** Modularize access, enable flexible orchestration.

- **Documentation & Context Management:**  
  The LightRAG docs and internal logs are **useful but fragmented**. We need a **more consistent way for Cline to ingest, index, and leverage** this documentation as context, likely via the Bimba-Pratibimba-Memory-MCP server.

- **Emerging Pattern:**  
  A **layered, recursive, multi-agent system** where each layer (LightRAG, Bimba, Pratibimba, Notion) contributes to a **dynamic, self-refining knowledge ecosystem**.

This reflection should guide the next phase of architectural refinement and development.

---
**Architectural Clarification Note (2025-04-11):**

It is crucial to distinguish between the different "agent" layers within the Epii (#5) subsystem:

*   **Siva- (Lens #5-2):** Represents the **6 QL Cycle Nodes** (Node +0/-5 to Node +5/-0) implemented in LangGraph. This is the backend processing *structure/orchestration layer*.
*   **-Shakti (Lens #5-3):** Represents the **6 Core Processing Agents/Modules** defined by QL context frames (`(0000)=(0/1)` to `(5/0)`), detailed in `memory-bank/reflections/-Shakti/agent_*.md`. These perform the actual *functional logic* (mathematical, symbolic, etc.).
*   **Siva-Shakti (Lens #5-4):** Represents the **6 Subsystem Expert Agents** (Anuttara #0 to Epii #5), planned in `memory-bank/reflections/Siva-Shakti_Agent_Plans/`. These provide *domain-specific context/perspective* to the QL cycle, informing the Core Processing Agents.

## Workflow Reflection & Bimba-Centric Protocol (April 2025)

### Lessons from the Notion/MCP Integration Attempt

- **Context Failure:** The recent failed attempt to integrate the MCP client for Notion display revealed that relying on IDE context, codebase browsing, or assumed SDK patterns is insufficient for robust system development in Epi-Logos.
- **Source of Truth Principle:** The Bimba graph (especially at #5-2 for backend, #5-3 for frontend, #5-4 for integration/agent logic) is *intended* to be the authoritative source for technical architecture, component relationships, and implementation details. However, the Bimba-Pratibimba MCP architecture is **not yet fully implemented or stable**. This means that, for now, context gathering must combine direct Bimba queries (via Neo4j or existing tools), Notion, and careful review of the memory bank and plan files.
- **MCP as Knowledge Gateway (Planned):** Once properly integrated, MCP servers (Bimba-Pratibimba, LightRAG) will be the primary interface for retrieving system structure, official documentation, and research/inspiration (via RAG). This will enable a more reliable, scalable, and context-rich development workflow.
- **PLAN Mode Discipline:** PLAN mode must be used for all significant planning, context gathering, and architectural synthesis. ACT mode is only for implementation after context is verified.
- **Explicit Protocol (Interim):** Until MCP integration is stable, the following protocol is mandatory:

### Bimba-Aligned Development Protocol (v2.0)

1.  **Context Gathering (Memory Bank & Bimba):**
    *   **Start:** Always begin by reading core Memory Bank files (`project_brief`, `productContext`, `activeContext`, `systemPatterns`, `techContext`, `progress`) and relevant plans (`Horizon_2.0_shakti_integration_plan.md`, `horizon_2.0_first_integration_crystallization_pathway.md`). Full System Context to be updated periodically in `bimba_tech_architecture.md`.
    *   **Bimba Query:** Use B-P MCP tools (`queryBimbaGraph`, `getNodeOverview`) to query the Neo4j Bimba graph for structural context related to the task/coordinate.
    *   **Notion Query:** Use B-P MCP tools (`resolveBimbaCoordinate`, `getNotionPageProperties`, `queryNotion`) to retrieve relevant crystallized knowledge from Notion, starting from Bimba coordinates.
    *   **Synthesize:** Use PLAN mode to synthesize findings before proceeding.
2.  **Planning (PLAN Mode):**
    *   Develop implementation strategy aligned with Bimba structure, modes, and QL-ordered path (`#5 -> #4 -> ...`).
    *   Update relevant plans (`.md` files) and confirm approach.
3.  **Implementation (ACT Mode - Bimba-Aligned):**
    *   Place new logic (agent modules, node refinements) in the appropriate Bimba-aligned directory (`subsystems/`, `graph/nodes/`).
    *   Use B-P MCP tools for standard data/web access. Use LightRAG MCP for fused RAG.
    *   Implement mode-specific logic where applicable.
4.  **Documentation & Feedback (Memory Bank & Notion):**
    *   Update core Memory Bank files (`activeContext`, `progress`, `systemPatterns`, etc.) to reflect changes.
    *   Use Epii mode and the crystallization workflow (once functional) to add synthesized insights/documentation to Notion `Content Nodes`.
    *   Use `syncNotionUpdatesTool` (once functional) to update Bimba based on Notion changes.
    *   Use PLAN mode for reflection.

**This protocol emphasizes grounding development in the Memory Bank and Bimba structure, using MCP tools consistently, respecting operational modes, and closing the Meta-Techne loop via Notion.**
