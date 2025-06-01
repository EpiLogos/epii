# Story 1.2: Enhance BPMCP to Identify Related Concepts and Retrieve Associated Data from Graphiti, Qdrant/LightRAG, Neo4j Bimba, and Notion, Emphasizing Schema Harmonization

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-1.2.md`

## Status: Approved

### Story 1.2: Enhance BPMCP for Graphiti-Driven Concept Expansion and Multi-Source Data Retrieval with UI Context

*   **As an** Epii Agent (via its backend service, considering the **6-subsystem architecture**),
*   **I want** BPMCP enhanced so after an initial Graphiti query (including **UI context like chat/canvas selections**), it traverses Graphiti from identified entities (linked to Bimba map and user focus) to discover related concepts,
*   **Then** for these related concepts, orchestrate retrieval of associated data from Qdrant/LightRAG, MongoDB, Neo4j Bimba, and Notion, all within the Bimba coordinate context and **potentially informed by UI context,**
*   **So that** I build a comprehensive understanding by exploring connections and gathering diverse information, **streamlining my context window,** with schema harmonization, and **informing potential Notion/Bimba updates.**
*   **Acceptance Criteria:**
    *   BPMCP tool takes initial entities from Graphiti (including **UI context**) and a Bimba coordinate.
    *   Tool traverses Graphiti from input entities to find related concepts, respecting Bimba coordinate and **UI context.**
    *   For related concepts, retrieves data from Qdrant/LightRAG, MongoDB, Neo4j Bimba, Notion, **using UI context to refine queries where applicable.**
    *   Retrieval from each source is governed by Bimba coordinate context.
    *   Results are collected with metadata (source, Bimba coordinate, Graphiti link, **UI context markers**).
    *   Multi-source information is synthesized/presented, highlighting connections, respecting schema harmonization, and **optimizing for context window efficiency.**
    *   Schemas (Graphiti, Qdrant, MongoDB, Neo4j Bimba, Notion) are aligned for synthesis.
    *   The process considers how insights might flag needs for **Notion or Bimba updates.**

## Tasks / Subtasks

- [ ] **Task 1: Design BPMCP Orchestration for Multi-Source Concept Expansion with Graphiti** (AC: #1)
    - [ ] Define new BPMCP tools or enhancements to existing ones (e.g., `bimbaKnowing`) for querying Graphiti and orchestrating with `queryBimbaGraph`, `searchPratibimbaContext`, and `queryNotion`.
    - [ ] Specify parameters for the orchestrated service: `primary_identifiers` (Bimba coordinates, Graphiti entity IDs), `relationship_types_of_interest` (for Bimba and Graphiti), `max_depth`, `max_related_concepts`.
    - [ ] Define the structure of the returned aggregated and harmonized data, including source attribution.
- [ ] **Task 2: Implement Graphiti and Neo4j Bimba Traversal via BPMCP** (AC: #2)
    - [ ] Develop/Enhance BPMCP tools to query Graphiti for related entities and relationships.
    - [ ] Ensure BPMCP's `queryBimbaGraph` or `bimbaKnowing` effectively queries Neo4j Bimba for various relationship types.
- [ ] **Task 3: Implement Multi-Source Data Retrieval and Harmonization via BPMCP** (AC: #3, #4)
    - [ ] For each related identifier (Bimba coordinate or Graphiti entity):
        - [ ] Use new BPMCP tools to retrieve data from Graphiti.
        - [ ] Use enhanced RAG from Story 1.1 (or `searchPratibimbaContext`) for Qdrant/LightRAG chunks.
        - [ ] Use `queryBimbaGraph` or `bimbaKnowing` for Neo4j Bimba properties.
        - [ ] Use `queryNotion` or `getNotionPageProperties` for Notion data.
    - [ ] Develop logic to aggregate and harmonize results from these diverse sources, adhering to the defined common schema.
- [ ] **Task 4: Define and Document Schema Harmonization Strategy** (AC: #4)
    - [ ] Analyze data schemas of Graphiti, Qdrant/LightRAG (chunk metadata), Neo4j Bimba, and MongoDB (document metadata, if relevant here).
    - [ ] Define a common, harmonized schema for key data elements (e.g., IDs, titles, content snippets, timestamps, relationships, Bimba coordinates).
    - [ ] Document the mapping from each source schema to the harmonized schema.
    - [ ] Establish a process for managing and updating these schemas in tandem if future changes are warranted.
- [ ] **Task 5: Ensure Consistent Aggregated Result Formatting and Error Handling** (AC: #5, #6)
    - [ ] Implement the defined structured and harmonized format for the aggregated data.
    - [ ] Ensure clear linkage to primary identifiers and source attribution.
    - [ ] Implement robust error handling for cases where data is missing from one or more sources.

## Dev Technical Guidance

-   This story builds directly on Story 1.1 and is crucial for EPIC-001's goal of comprehensive, context-aware information retrieval by integrating Graphiti and enhancing BPMCP's capabilities for multi-source data aggregation and schema harmonization.
-   The implementation will involve creating new BPMCP tools for Graphiti interaction and orchestrating them with existing/enhanced tools for Qdrant/LightRAG (from Story 1.1), Neo4j Bimba (`queryBimbaGraph`, `bimbaKnowing`), and Notion (`queryNotion`, `getNotionPageProperties`).
-   A key focus is the **schema harmonization** across Graphiti, Qdrant/LightRAG metadata, Neo4j Bimba, and potentially MongoDB document metadata. This unified view is essential for robust agent reasoning and future Nara Mode developments.
-   Consult the BPMCP README for existing tool details and the Graphiti documentation for its API and data model.
-   Refer to `../../docs/architecture_shards/component-view.md#BPMCP-Tool-Orchestration` for interaction patterns.
-   Defining clear, harmonized data structures is paramount. The output must be easily consumable by the Epii Agent.
-   Recursive expansion should leverage Graphiti's and Neo4j's traversal strengths. Performance and error handling for diverse, potentially missing data sources are critical.
-   Alignment with `../../docs/architecture_shards/operational-guidelines.md` and the documented schema harmonization strategy is important.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log