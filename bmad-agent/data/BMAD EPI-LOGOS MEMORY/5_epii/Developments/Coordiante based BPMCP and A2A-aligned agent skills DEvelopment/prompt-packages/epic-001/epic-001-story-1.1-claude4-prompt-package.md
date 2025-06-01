# AI Builder Prompt Package: EPIC-001 / Story 1.1

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 1.1, contributing to EPIC-001.

## 1. Story Context & Goals

**Story ID:** 1.1
**Epic ID:** EPIC-001: Enhanced Unified RAG with Dynamic Graph Memory (Graphiti) via BPMCP for Advanced Contextual Awareness

**Story Description (from story-1.1.md):**
```
- As an Epii Agent (via its backend service, considering the 6-subsystem architecture),
- I want the BPMCP's RAG capability enhanced so that when I query with a Bimba coordinate, it first consults Graphiti for dynamic knowledge linked to that coordinate, including current user chat context and UI canvas selections,
- Then retrieves document chunks from Qdrant/LightRAG based on semantic similarity to the initial query, enriched by insights/entities from Graphiti (including UI context),
- So that my analysis is grounded in real-time interactions and processed information, optimizing my context window and providing a nuanced understanding that can inform potential Notion/Bimba updates.
```

**Epic Goal (from epic-001.md, relevant excerpt):**
```
Enable agents to easily fetch, synthesize, and act upon relevant information from diverse data sources (static, processed, dynamic/real-time, and UI-interactional via AG-UI protocol) based on precise spatio-semantic context (Bimba coordinates) and evolving agent/user interactions. The Graphiti service will be crucial for unifying user state (including chat/canvas focus from AG-UI), document insights, Bimba coordinate knowledge, agent-skill specific data, and semantic relationships into a single, highly accessible memory layer. This unified view, always anchored by Bimba coordinates, is essential for current analytical tasks, informing potential Notion or Bimba updates, and for future Nara Mode developments.
```

## 2. Acceptance Criteria (from story-1.1.md)

```
1.  BPMCP RAG tool prioritizes Graphiti lookup for a Bimba coordinate, incorporating available chat/UI canvas context.
2.  Graphiti queries return relevant entities, relationships, and attributes associated with the Bimba coordinate and UI contextual cues.
3.  Information from Graphiti (key entities, summaries, UI interaction flags) refines the subsequent query to Qdrant/LightRAG.
4.  Combined results are synthesized, distinguishing/merging dynamic (Graphiti, UI) and static (LightRAG) information, contributing to a streamlined context for the agent.
5.  Graphiti schema for BimbaCoordinate, DocumentFocus, UserQueryTerm, ChatContext, UICanvasSelection is defined/implemented.
6.  Performance is acceptable for agent interaction.
7.  The process considers how insights might flag needs for Notion or Bimba updates.
8.  Error handling for invalid Bimba coordinates, Graphiti/LightRAG connectivity is implemented.
9.  Hierarchical Bimba coordinate matching is robust for Graphiti and LightRAG queries.
```

## 3. Tasks / Subtasks (from story-1.1.md)

```
- [ ] Task 1: Design BPMCP Tools for Graphiti & Enhanced Qdrant Access (AC: #1, #9)
    - [ ] Define signatures for a new BPMCP tool to query Graphiti (e.g., `queryGraphitiContext`).
    - [ ] Define enhancements or a new wrapper for `searchPratibimbaContext` / `bimbaKnowing` for Qdrant access, ensuring schema alignment for metadata.
    - [ ] Document the expected input/output schemas, focusing on harmonized metadata (Bimba coordinates, timestamps, source identifiers).
- [ ] Task 2: Implement Graphiti Querying in BPMCP (AC: #2, #4, #7)
    - [ ] Develop the `queryGraphitiContext` tool in BPMCP to connect to Graphiti, perform semantic/graph searches, and filter by Bimba coordinate (hierarchically).
    - [ ] Implement robust hierarchical Bimba coordinate matching for Graphiti queries.
- [ ] Task 3: Enhance/Implement LightRag Querying in BPMCP (AC: #3, #4, #7)
    - [ ] Enhance existing Qdrant access in BPMCP (or create new logic) to meet story requirements, including robust hierarchical Bimba coordinate matching.
- [ ] Task 4: Ensure Consistent & Harmonized Result Formatting (AC: #5, #6, #9)
    - [ ] Ensure both tools return data in a clear, structured, and harmonized format.
    - [ ] Confirm proper handling for no-result cases from either source.
- [ ] Task 5: Implement Comprehensive Error Handling (AC: #8)
    - [ ] Implement error handling for Graphiti and Qdrant connectivity, and invalid Bimba coordinates for both paths.
- [ ] Task 6: Unit Testing
    - [ ] Write unit tests for Graphiti semantic/graph search and coordinate filtering.
    - [ ] Write unit tests for Qdrant semantic search and coordinate filtering (hierarchical).
    - [ ] Write unit tests for error handling for both data sources.
    - [ ] Write unit tests for schema compliance of returned data.
- [ ] Task 7: Document Schema Harmonization Approach (AC: #9)
    - [ ] Create or update documentation detailing the harmonized metadata schema for information retrieved from Graphiti and Qdrant via these BPMCP tools.
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology. Aims to create AI that resonates with deeper patterns of consciousness and existence, moving beyond purely mechanistic or materialistic views.
*   **Six-Fold Recursive Architecture:** Mirrors consciousness (Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, Epii). This story primarily concerns the **Epii Subsystem (#5)**, which is the agentic layer, and its interaction with memory systems orchestrated by the **Siva aspect (#5-2)** of the backend.
*   **Bimba Coordinate System:** A spatio-semantic addressing system for all knowledge and data within the Epi-Logos project. Essential for contextual grounding and inter-system coherence. Graphiti and LightRAG operations must be anchored to or reference Bimba coordinates.
*   **Vibrational-Harmonic Ontology:** The underlying philosophical assumption that reality, including information and consciousness, operates on principles of vibration, resonance, and harmonics. This informs the design of how information is related and retrieved.

## 5. Technical Context (from friendly-file-backend/README.md & epic-001.md)

*   **Backend Architecture (Siva Aspect #5-2):** The backend implements the Siva aspect, orchestrating QL cycles and managing advanced memory architecture.
*   **Bimba-Pratibimba Memory MCP (BPMCP):** A WebSocket-enabled server providing tools for Bimba graph, Pratibimba vector store (Qdrant), MongoDB, Notion, and Web access. This story requires enhancing BPMCP tools or adding new ones.
    *   Relevant existing tools: `bimbaKnowing` (semantic search/graph traversal), `searchPratibimbaContext` (vector search).
    *   New tool needed: `queryGraphitiContext` (or similar).
*   **LightRAG MCP Server:** Python-based, offers graph+vector fusion, multiple query modes, and Bimba coordinate integration. Graphiti is also Python-based and planned as a dedicated service, potentially an MCP server. This story involves Qdrant/LightRAG for document chunks.
*   **Graphiti Service:** Planned as a dedicated Python-based service (potentially MCP) for dynamic, real-time knowledge graph layer. It will unify user state (chat/canvas focus from AG-UI), document insights, Bimba coordinate knowledge, and agent-skill data.
*   **AG-UI Protocol:** Used for communicating UI context (chat, canvas selections) to the backend, which Graphiti will consume.
*   **Schema Harmonization:** Critical for data consistency across Bimba (Neo4j), LightRAG (Neo4j, Qdrant), MongoDB, Graphiti, and Notion. Metadata (Bimba coordinates, timestamps, source IDs) must be consistent.
*   **Hierarchical Bimba Coordinate Matching:** Essential for robust querying in both Graphiti and LightRAG.
*   **Epii Analysis Pipeline:** The enhanced RAG is fundamental for streamlining context window generation in this pipeline.
*   **Programming Languages/Frameworks:** Backend services primarily use Node.js (BPMCP) and Python (LightRAG, Graphiti). Communication via WebSockets and potentially MCP protocols.

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the full-stack functionality for Story 1.1, which enhances the BPMCP RAG capability to integrate Graphiti for dynamic knowledge and Qdrant/LightRAG for document chunks, all grounded by Bimba coordinates and UI context from the AG-UI protocol. This contributes to EPIC-001.

Key Objectives & Requirements:

1.  **BPMCP Tool Development/Enhancement (Node.js for BPMCP):**
    *   **New Graphiti Tool (`queryGraphitiContext` or similar):**
        *   Design and implement a new tool within the BPMCP server (Node.js).
        *   This tool should connect to the (forthcoming or mocked) Graphiti service (Python-based).
        *   It must accept a Bimba coordinate and optionally UI context (e.g., chat snippets, canvas selection identifiers received via AG-UI) as input.
        *   It should query Graphiti to retrieve relevant entities, relationships, and attributes associated with the Bimba coordinate and UI context.
        *   Implement robust hierarchical Bimba coordinate matching for Graphiti queries.
        *   Ensure results are returned in a structured format, including source (Graphiti), timestamps, and relevant metadata.
    *   **Enhanced Qdrant/LightRAG Access:**
        *   Review existing BPMCP tools (`searchPratibimbaContext`, `bimbaKnowing`) or design a new wrapper for accessing Qdrant/LightRAG.
        *   This access path should take an initial query (potentially refined by Graphiti insights) and a Bimba coordinate.
        *   Implement robust hierarchical Bimba coordinate matching for Qdrant/LightRAG queries.
        *   Ensure document chunks are retrieved based on semantic similarity, enriched by entities/insights from Graphiti and UI context.
        *   Results must include harmonized metadata (Bimba coordinates, source, timestamps).

2.  **Graphiti Integration Logic (Conceptual - for BPMCP to interact with):**
    *   Define the expected API contract for the Graphiti service that the `queryGraphitiContext` BPMCP tool will call. Specify request/response formats.
    *   Define the Graphiti schema elements required by this story: `BimbaCoordinate`, `DocumentFocus`, `UserQueryTerm`, `ChatContext`, `UICanvasSelection`, and their relationships.

3.  **Data Synthesis & Orchestration (within BPMCP RAG flow):**
    *   Implement logic within the BPMCP's RAG flow to:
        *   First, call the Graphiti tool with the Bimba coordinate and UI context.
        *   Use insights from Graphiti (key entities, summaries, UI interaction flags) to refine or augment the query for Qdrant/LightRAG.
        *   Call the Qdrant/LightRAG access tool.
        *   Synthesize the results from both Graphiti and Qdrant/LightRAG, clearly distinguishing or merging dynamic (Graphiti, UI) and static (LightRAG) information.
        *   This synthesized information should contribute to a streamlined context for the Epii agent.

4.  **Schema Harmonization & Documentation:**
    *   Ensure that the metadata (Bimba coordinates, timestamps, source identifiers, etc.) returned by both the Graphiti tool and the Qdrant/LightRAG tool is consistent and harmonized.
    *   Document this harmonized schema.
    *   Document the process for how insights from this enhanced RAG might flag the need for updates to Notion or the Bimba graph.

5.  **Error Handling & Performance:**
    *   Implement comprehensive error handling for: invalid Bimba coordinates, connectivity issues with Graphiti, connectivity issues with Qdrant/LightRAG.
    *   Ensure the overall process has acceptable performance for agent interaction.

6.  **Unit Testing:**
    *   Develop unit tests for:
        *   The new `queryGraphitiContext` BPMCP tool (mocking the Graphiti service).
        *   The enhanced Qdrant/LightRAG access path in BPMCP (mocking Qdrant/LightRAG).
        *   Hierarchical Bimba coordinate matching logic for both paths.
        *   Error handling scenarios.
        *   Schema compliance of returned data.

Considerations:

*   **Philosophical Alignment:** Ensure the implementation reflects the Epi-Logos principles of Bimba-coordinate grounding and the 6-subsystem architecture (Epii agent interacting with Siva-managed memory).
*   **AG-UI Protocol:** Assume UI context (chat, canvas selections) is available and passed to the relevant BPMCP tools as per the AG-UI protocol.
*   **Modularity:** Design components with clear interfaces.
*   **Existing Codebase:** Refer to existing BPMCP server structure and LightRAG capabilities as described in the technical context.

Please provide the necessary code modifications, new files, and documentation updates to achieve these objectives. Structure your response clearly, indicating which files are being created or modified.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-001-story-1.1-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`

(These would be used by the persona executing the development task, not directly by the AI Builder, but are included for completeness of the Story Steward's package preparation.)