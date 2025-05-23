# Tech Context (Updated April 2025)

## Technologies Used

### Backend
- **Node.js (ES Modules, `.mjs`)**
- **LangGraph.js:** Orchestrates the QL 0-5 Cycle
- **LangChain.js:** LLM orchestration, tool calling, database integrations
- **Express.js:** API server
- **Gemini LLMs:** via `@langchain/google-genai`, with dynamic free/paid switching
- **Neo4j:** Bimba graph (Implicate order, stable ontology)
- **Qdrant:** Pratibimba semantic store (vector embeddings)
- **MongoDB:** Pratibimba context store (user profiles, history, explicit memories)
- **Notion:** Crystallized knowledge hub (+5 stage, human-validated insights)
- **Python LightRAG MCP Server:** FastAPI + Uvicorn, LightRAG library, provides `/ingest` and `/retrieve` endpoints for graph + vector fusion
- **Node.js Bimba-Pratibimba-Memory-MCP Server:** Custom tools for Neo4j, Qdrant, MongoDB, Notion, external sources

### Frontend
- **React + Vite + Tailwind CSS**
- **Visualization:** Planned use of Three.js, D3.js, p5.js
- **Audio:** Web Audio API (future)
- **Developer Console:** Planned for prompt/parameter tuning, monitoring, control

### Development Environment
- **VSCode on macOS**
- **Cline, Roo-Code, Cursor**

---

## Dependencies
*   **Core Backend (Node.js - `epii_app/friendly-file-backend/package.json`):** `express`, `cors`, `dotenv`, `multer`, `axios`, `langchain`, `@langchain/core`, `@langchain/google-genai`, `@langchain/community`, `@langchain/langgraph`, `langgraph`, `mongodb`, `mongoose`, `@qdrant/js-client-rest`, `@notionhq/client`, `zod`, `gridfs-stream`, `textract`. (`mem0ai` present but unused).
*   **Frontend (JS/TS - `epii_app/friendly-file-front/package.json`):** `react`, `vite`, `tailwindcss`, `typescript`. *Visualization/audio libraries TBD.*
*   **Bimba-Pratibimba MCP (Node.js/TS - `../Cline/MCP/Bimba-Pratibimba-Memory-MCP/package.json`):** `@modelcontextprotocol/sdk`, `@qdrant/js-client-rest`, `mongodb`, `neo4j-driver`, `@notionhq/client`, `@langchain/google-genai`, `axios`, `dotenv`, `zod`.
*   **LightRAG MCP (Python - `LightRAG/requirements.txt`):** `fastapi`, `uvicorn`, `lightrag`, `neo4j`, `qdrant-client`, `openai`.
*   **Prospective Python Service (Advanced Math):** TBD (`numpy`, `scipy`, etc.).

---

## Architecture Overview (Post-Refactor)

- **Bimba-Aligned Backend:** Node.js backend (`friendly-file-backend`) structured with `subsystems/` (for Expert Agent logic) and `graph/nodes/` (for QL Node logic).
- **Mode-Driven Controller:** `chat.controller.mjs` dispatches requests to 'epii' (full QL cycle) or 'nara' (simpler RAG/subset) workflows.
- **Centralized Tooling (B-P MCP):** Bimba-Pratibimba MCP server (`../Cline/MCP/Bimba-Pratibimba-Memory-MCP/`) provides standard tools for DB/Notion/Web access.
- **Specialized RAG (LightRAG MCP):** Python LightRAG MCP server (`LightRAG/`) provides fused graph+vector retrieval via HTTP API.
- **QL Cycle (LangGraph):** Core processing logic (`graph/ql_cycle.graph.mjs`) orchestrates nodes and potentially calls Expert Agents.
- **Notion-Anchored Ingestion:** Planned ingestion pipeline triggered from Notion, tagging data with Bimba coordinates.
- **Meta-Techne Loop:** Ingest (Notion-triggered) -> Analyze (Epii Mode QL Cycle) -> Crystallize (Epii Mode Frontend Canvas -> B-P MCP Notion Tools) -> Sync (B-P MCP Sync Tool -> Bimba).
- **Async, Cross-Language:** Node.js backend interacts with Python LightRAG MCP via HTTP (`axios`).
- **Dynamic LLM Switching:** Handled within Node.js backend/nodes.

---

## Technical Constraints & Lessons Learned

- **Notion Tool Binding (Gemini/LangChain):** Schema definition for array parameters (like `blocksToAppend`) caused 400 errors. Fix attempted via MCP schema update and re-enabling tools in Node +5, **requires testing**.
- **LightRAG MCP Errors:** Intermittent Neo4j timeouts and LLM compatibility errors persist. Need investigation.
- **Async Event Loop Conflicts:** Previously fixed in LightRAG MCP.
- **Prompt Engineering:** Remains critical, especially for agent logic and mode differentiation. Needs externalization/tuning (Dev Console planned).
- **Keyword Extraction:** Rudimentary implementation in Node +0 needs improvement (LLM/NLP).
- **Cross-MCP Coordination:** Defining clear roles (B-P MCP for granular access, LightRAG for fused RAG) helps, but potential overlaps need management.
- **Data Seeding:** Notion-triggered ingestion is key. Requires initial Bimba-Notion links.
- **Notion API Rate Limits:** May impact sync frequency.
- **Hybrid Architecture Complexity:** Managing Node.js + Python + multiple databases + LLMs + MCPs.
- **Advanced Math Service:** Future plan.

---

## Next Focus Areas (Based on H2.0 v2.0 Plan - Phase 1)

1.  **Test Notion Tool Binding Fix.**
2.  **Implement Notion-Triggered Ingestion.**
3.  **Implement Notion Sync Tool.**
4.  **Implement Basic Epii Mode Logic & Frontend Canvas.**
5.  Address LightRAG MCP errors.
6.  Refine prompts & keyword extraction.

---

## Milestone Update (April 2025)

The Bimba-Pratibimba-LightRAG architecture is now operational, supporting multi-source, multi-modal retrieval and synthesis, with dynamic LLM switching and cross-language orchestration.
