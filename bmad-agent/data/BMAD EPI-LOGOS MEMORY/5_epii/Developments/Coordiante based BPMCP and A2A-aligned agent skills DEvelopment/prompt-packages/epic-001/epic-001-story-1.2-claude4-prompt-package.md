# AI Builder Prompt Package: EPIC-001 / Story 1.2

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 1.2, contributing to EPIC-001.

## 1. Story Context & Goals

**Story ID:** 1.2
**Epic ID:** EPIC-001: Enhanced Unified RAG with Dynamic Graph Memory (Graphiti) via BPMCP for Advanced Contextual Awareness

**Story Description (from story-1.2.md):**
```
- As an Epii Agent (via its backend service, considering the 6-subsystem architecture),
- I want BPMCP enhanced so after an initial Graphiti query (including UI context like chat/canvas selections), it traverses Graphiti from identified entities (linked to Bimba map and user focus) to discover related concepts,
- Then for these related concepts, orchestrate retrieval of associated data from Qdrant/LightRAG, MongoDB, Neo4j Bimba, and Notion, all within the Bimba coordinate context and potentially informed by UI context,
- So that I build a comprehensive understanding by exploring connections and gathering diverse information, streamlining my context window, with schema harmonization, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-001.md, relevant excerpt):**
```
Enable agents to easily fetch, synthesize, and act upon relevant information from diverse data sources (static, processed, dynamic/real-time, and UI-interactional via AG-UI protocol) based on precise spatio-semantic context (Bimba coordinates) and evolving agent/user interactions. The Graphiti service will be crucial for unifying user state (including chat/canvas focus from AG-UI), document insights, Bimba coordinate knowledge, agent-skill specific data, and semantic relationships into a single, highly accessible memory layer. This unified view, always anchored by Bimba coordinates, is essential for current analytical tasks, informing potential Notion or Bimba updates, and for future Nara Mode developments.
```

## 2. Acceptance Criteria (from story-1.2.md)

```
1.  BPMCP tool takes initial entities from Graphiti (including UI context) and a Bimba coordinate.
2.  Tool traverses Graphiti from input entities to find related concepts, respecting Bimba coordinate and UI context.
3.  For related concepts, retrieves data from Qdrant/LightRAG, MongoDB, Neo4j Bimba, Notion, using UI context to refine queries where applicable.
4.  Retrieval from each source is governed by Bimba coordinate context.
5.  Results are collected with metadata (source, Bimba coordinate, Graphiti link, UI context markers).
6.  Multi-source information is synthesized/presented, highlighting connections, respecting schema harmonization, and optimizing for context window efficiency.
7.  Schemas (Graphiti, Qdrant, MongoDB, Neo4j Bimba, Notion) are aligned for synthesis.
8.  The process considers how insights might flag needs for Notion or Bimba updates.
```

## 3. Tasks / Subtasks (from story-1.2.md)

```
- [ ] Task 1: Design BPMCP Orchestration for Multi-Source Concept Expansion with Graphiti (AC: #1)
    - [ ] Define new BPMCP tools or enhancements to existing ones (e.g., `bimbaKnowing`) for querying Graphiti and orchestrating with `queryBimbaGraph`, `searchPratibimbaContext`, and `queryNotion`.
    - [ ] Specify parameters for the orchestrated service: `primary_identifiers` (Bimba coordinates, Graphiti entity IDs), `relationship_types_of_interest` (for Bimba and Graphiti), `max_depth`, `max_related_concepts`.
    - [ ] Define the structure of the returned aggregated and harmonized data, including source attribution.
- [ ] Task 2: Implement Graphiti and Neo4j Bimba Traversal via BPMCP (AC: #2)
    - [ ] Develop/Enhance BPMCP tools to query Graphiti for related entities and relationships.
    - [ ] Ensure BPMCP's `queryBimbaGraph` or `bimbaKnowing` effectively queries Neo4j Bimba for various relationship types.
- [ ] Task 3: Implement Multi-Source Data Retrieval and Harmonization via BPMCP (AC: #3, #4)
    - [ ] For each related identifier (Bimba coordinate or Graphiti entity):
        - [ ] Use new BPMCP tools to retrieve data from Graphiti.
        - [ ] Use enhanced RAG from Story 1.1 (or `searchPratibimbaContext`) for Qdrant/LightRAG chunks.
        - [ ] Use `queryBimbaGraph` or `bimbaKnowing` for Neo4j Bimba properties.
        - [ ] Use `queryNotion` or `getNotionPageProperties` for Notion data.
    - [ ] Develop logic to aggregate and harmonize results from these diverse sources, adhering to the defined common schema.
- [ ] Task 4: Define and Document Schema Harmonization Strategy (AC: #4)
    - [ ] Analyze data schemas of Graphiti, Qdrant/LightRAG (chunk metadata), Neo4j Bimba, and MongoDB (document metadata, if relevant here).
    - [ ] Define a common, harmonized schema for key data elements (e.g., IDs, titles, content snippets, timestamps, relationships, Bimba coordinates).
    - [ ] Document the mapping from each source schema to the harmonized schema.
    - [ ] Establish a process for managing and updating these schemas in tandem if future changes are warranted.
- [ ] Task 5: Ensure Consistent Aggregated Result Formatting and Error Handling (AC: #5, #6)
    - [ ] Implement the defined structured and harmonized format for the aggregated data.
    - [ ] Ensure clear linkage to primary identifiers and source attribution.
    - [ ] Implement robust error handling for cases where data is missing from one or more sources.
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology. Aims to create AI that resonates with deeper patterns of consciousness and existence, moving beyond purely mechanistic or materialistic views.
*   **Six-Fold Recursive Architecture:** Mirrors consciousness (Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, Epii). This story primarily concerns the **Epii Subsystem (#5)**, which is the agentic layer, and its interaction with memory systems orchestrated by the **Siva aspect (#5-2)** of the backend.
*   **Bimba Coordinate System:** A spatio-semantic addressing system for all knowledge and data within the Epi-Logos project. Essential for contextual grounding and inter-system coherence. Graphiti and LightRAG operations must be anchored to or reference Bimba coordinates.
*   **Vibrational-Harmonic Ontology:** The underlying philosophical assumption that reality, including information and consciousness, operates on principles of vibration, resonance, and harmonics. This informs the design of how information is related and retrieved.

## 5. Technical Context (from friendly-file-backend/README.md & epic-001.md)

*   **Backend Architecture (Siva Aspect #5-2):** The backend implements the Siva aspect, orchestrating QL cycles and managing advanced memory architecture.
*   **Bimba-Pratibimba Memory MCP (BPMCP):** A WebSocket-enabled server providing tools for Bimba graph, Pratibimba vector store (Qdrant), MongoDB, Notion, and Web access. This story requires enhancing BPMCP tools or adding new ones for orchestration.
    *   Relevant existing tools: `bimbaKnowing`, `searchPratibimbaContext`, `queryBimbaGraph`, `queryNotion`, `getNotionPageProperties`.
    *   New/Enhanced tools needed for Graphiti traversal and multi-source orchestration.
*   **LightRAG MCP Server:** Python-based, offers graph+vector fusion. Used for Qdrant/LightRAG document chunks.
*   **Graphiti Service:** Python-based service for dynamic knowledge graph. Key for identifying related concepts and initial traversal.
*   **AG-UI Protocol:** UI context (chat, canvas) informs Graphiti queries and potentially refines queries to other sources.
*   **Schema Harmonization:** CRITICAL. Data from Graphiti, Qdrant/LightRAG, Neo4j Bimba, MongoDB, and Notion must be mapped to a common schema for synthesis. This is a primary focus of Story 1.2.
*   **Hierarchical Bimba Coordinate Matching:** Applies to all data sources.
*   **Programming Languages/Frameworks:** Node.js (BPMCP), Python (LightRAG, Graphiti).

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the full-stack functionality for Story 1.2, which enhances BPMCP to traverse Graphiti for related concepts (informed by UI context and Bimba coordinates) and then orchestrate retrieval of associated data from Qdrant/LightRAG, MongoDB, Neo4j Bimba, and Notion. A core focus is schema harmonization across these sources. This contributes to EPIC-001.

Key Objectives & Requirements:

1.  **BPMCP Orchestration Logic (Node.js for BPMCP):**
    *   **Design and Implement Orchestration Tool(s):**
        *   Create new BPMCP tool(s) or significantly enhance existing ones (e.g., `bimbaKnowing`) to manage the multi-step process.
        *   Input: Initial entities/identifiers from a Graphiti query (as per Story 1.1, including UI context markers and Bimba coordinate).
        *   Step 1: Traverse Graphiti from these input entities to find related concepts/entities, respecting the Bimba coordinate context and any UI context filters.
        *   Step 2: For each related concept/entity identified:
            *   Query Graphiti for its detailed properties (using tool from Story 1.1 or similar).
            *   Query Qdrant/LightRAG for associated document chunks (using enhanced RAG from Story 1.1), potentially refining queries with UI context.
            *   Query Neo4j Bimba (using `queryBimbaGraph` or `bimbaKnowing`) for structural properties and relationships.
            *   Query Notion (using `queryNotion` or `getNotionPageProperties`) for relevant page content.
            *   (Consider if MongoDB queries are directly relevant here or if its content is accessed via LightRAG/Graphiti links).
    *   **Parameterization:** Allow parameters like `relationship_types_of_interest` (for Bimba and Graphiti), `max_depth` for traversal, `max_related_concepts` to control scope.

2.  **Graphiti and Neo4j Bimba Traversal (within BPMCP Tools):**
    *   Implement/enhance BPMCP tool(s) to perform effective traversal queries against Graphiti (for dynamic relationships) and Neo4j Bimba (for structural relationships).
    *   Ensure these traversals respect Bimba coordinate boundaries and can leverage UI context where applicable.

3.  **Multi-Source Data Retrieval and Aggregation (within BPMCP Orchestration):**
    *   For each identified related concept, systematically call the appropriate BPMCP tools (new or existing/enhanced) to fetch data from Graphiti, Qdrant/LightRAG, Neo4j Bimba, and Notion.
    *   Collect all results, ensuring each piece of data includes comprehensive metadata: source system (Graphiti, Qdrant, Bimba, Notion), original Bimba coordinate, link to the specific Graphiti entity that led to this data, and any relevant UI context markers.

4.  **Schema Harmonization Strategy (Design & Implementation):**
    *   **Define Common Schema:** Analyze the data structures from Graphiti, Qdrant/LightRAG (chunk metadata), Neo4j Bimba node/relationship properties, and Notion page properties.
    *   Define a target common, harmonized schema for key data elements (e.g., `id`, `type`, `title`, `content_snippet`, `full_content_link`, `timestamp_created`, `timestamp_modified`, `relationships_list`, `bimba_coordinates_array`, `source_system`, `source_specific_id`).
    *   **Implement Mapping Logic:** Within the BPMCP orchestration, implement logic to transform data from each source into this harmonized schema.
    *   **Document:** Thoroughly document the source schemas, the target harmonized schema, and the mapping rules.
    *   Establish a process for managing and updating these schemas.

5.  **Result Synthesis and Presentation:**
    *   Develop logic to synthesize the multi-source, harmonized information.
    *   The presentation should highlight connections between data points and optimize for the agent's context window (e.g., summaries, key entities, relationship highlights).
    *   Ensure clear linkage to primary identifiers and source attribution in the final synthesized output.

6.  **Error Handling & Performance:**
    *   Implement robust error handling for scenarios where data might be missing from one or more sources, or if a traversal yields no results.
    *   Handle connectivity issues to any of the data sources.
    *   Optimize for acceptable performance, especially during graph traversals and multi-source data fetching.

7.  **Unit Testing:**
    *   Develop unit tests for:
        *   Graphiti and Bimba traversal logic within BPMCP (mocking services).
        *   Data retrieval from each source via BPMCP tools (mocking services).
        *   Schema mapping and harmonization logic.
        *   Result aggregation and synthesis.
        *   Error handling for missing data or connectivity issues.

Considerations:

*   **Philosophical Alignment:** Maintain Bimba-coordinate grounding and adherence to the 6-subsystem architecture.
*   **AG-UI Protocol:** UI context should be usable to refine queries and guide traversals.
*   **Modularity & Reusability:** Leverage tools developed in Story 1.1. Design new components modularly.
*   **Existing Codebase:** Build upon the BPMCP server and its existing toolset.

Please provide the necessary code modifications, new files, and documentation updates to achieve these objectives. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-001-story-1.2-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`