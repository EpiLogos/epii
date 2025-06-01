# Story 1.1: Enhance BPMCP RAG to Retrieve Dynamic Info (Graphiti) & Document Chunks (LightRAG) by Semantic Similarity & Hierarchical Bimba Coordinate

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Epii Subsystem)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-1.1.md`

## Status: Approved

## Story

- **As an** Epii Agent (via its backend service, considering the **6-subsystem architecture**),
- **I want** the BPMCP's RAG capability enhanced so that when I query with a Bimba coordinate, it first consults Graphiti for dynamic knowledge linked to that coordinate, **including current user chat context and UI canvas selections,**
- **Then** retrieves document chunks from Qdrant/LightRAG based on semantic similarity to the initial query, enriched by insights/entities from Graphiti (including **UI context**),
- **So that** my analysis is grounded in real-time interactions and processed information, **optimizing my context window** and providing a nuanced understanding that can **inform potential Notion/Bimba updates.**
## Acceptance Criteria (ACs)

1.  BPMCP RAG tool prioritizes Graphiti lookup for a Bimba coordinate, **incorporating available chat/UI canvas context.**
2.  Graphiti queries return relevant entities, relationships, and attributes associated with the Bimba coordinate and **UI contextual cues.**
3.  Information from Graphiti (key entities, summaries, **UI interaction flags**) refines the subsequent query to Qdrant/LightRAG.
4.  Combined results are synthesized, distinguishing/merging dynamic (Graphiti, UI) and static (LightRAG) information, **contributing to a streamlined context for the agent.**
5.  Graphiti schema for BimbaCoordinate, DocumentFocus, UserQueryTerm, **ChatContext, UICanvasSelection** is defined/implemented.
6.  Performance is acceptable for agent interaction.
7.  The process considers how insights might flag needs for **Notion or Bimba updates.**
8.  Error handling for invalid Bimba coordinates, Graphiti/LightRAG connectivity is implemented.
9.  Hierarchical Bimba coordinate matching is robust for Graphiti and LightRAG queries.

## Tasks / Subtasks

- [ ] **Task 1: Design BPMCP Tools for Graphiti & Enhanced Qdrant Access** (AC: #1, #9)
    - [ ] Define signatures for a new BPMCP tool to query Graphiti (e.g., `queryGraphitiContext`).
    - [ ] Define enhancements or a new wrapper for `searchPratibimbaContext` / `bimbaKnowing` for Qdrant access, ensuring schema alignment for metadata.
    - [ ] Document the expected input/output schemas, focusing on harmonized metadata (Bimba coordinates, timestamps, source identifiers).
- [ ] **Task 2: Implement Graphiti Querying in BPMCP** (AC: #2, #4, #7)
    - [ ] Develop the `queryGraphitiContext` tool in BPMCP to connect to Graphiti, perform semantic/graph searches, and filter by Bimba coordinate (hierarchically).
    - [ ] Implement robust hierarchical Bimba coordinate matching for Graphiti queries.
- [ ] **Task 3: Enhance/Implement LightRAG Querying in BPMCP** (AC: #3, #4, #7)
    - [ ] Enhance existing Qdrant access in BPMCP (or create new logic) to meet story requirements, including robust hierarchical Bimba coordinate matching.
- [ ] **Task 4: Ensure Consistent & Harmonized Result Formatting** (AC: #5, #6, #9)
    - [ ] Ensure both tools return data in a clear, structured, and harmonized format.
    - [ ] Confirm proper handling for no-result cases from either source.
- [ ] **Task 5: Implement Comprehensive Error Handling** (AC: #8)
    - [ ] Implement error handling for Graphiti and Qdrant connectivity, and invalid Bimba coordinates for both paths.
- [ ] **Task 6: Unit Testing**
    - [ ] Write unit tests for Graphiti semantic/graph search and coordinate filtering.
    - [ ] Write unit tests for Qdrant semantic search and coordinate filtering (hierarchical).
    - [ ] Write unit tests for error handling for both data sources.
    - [ ] Write unit tests for schema compliance of returned data.
- [ ] **Task 7: Document Schema Harmonization Approach** (AC: #9)
    - [ ] Create or update documentation detailing the harmonized metadata schema for information retrieved from Graphiti and Qdrant via these BPMCP tools.

## Dev Technical Guidance

-   This story directly supports EPIC-001 by introducing Graphiti for dynamic RAG and enhancing existing Qdrant/LightRAG access, all orchestrated via BPMCP.
-   A new BPMCP tool will be needed for Graphiti. Existing tools like `searchPratibimbaContext` or `bimbaKnowing` might be enhanced or wrapped for Qdrant access to ensure schema consistency.
-   Define and document the schema for Graphiti nodes/edges relevant to agent memory (e.g., observations, temporary facts, skill outputs) and ensure Bimba coordinate linkage.
-   The metadata schema (Bimba coordinates, timestamps, source, etc.) across Graphiti and Qdrant results MUST be harmonized.
-   Hierarchical Bimba coordinate matching is critical for both Graphiti and Qdrant paths.
-   The enhanced BPMCP tools will be callable via A2A skills (EPIC-002), providing agents access to both dynamic (Graphiti) and processed (Qdrant/LightRAG) information layers.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log

Qdrant = LightRAG!