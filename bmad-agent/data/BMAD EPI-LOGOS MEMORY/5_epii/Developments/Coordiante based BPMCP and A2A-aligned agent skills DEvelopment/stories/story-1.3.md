# Story 1.3: Enhance and Orchestrate BPMCP Tools (including Graphiti) for Unified, Harmonized RAG and Information Synthesis by Epii Agent

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-1.3.md`

## Status: Approved

## Story

- **As an** Epii Agent backend system (operating within the **6-subsystem architecture**),
- **I want** to orchestrate enhanced BPMCP tools (from Stories 1.1 & 1.2, now including **UI context like chat/canvas selections** for Graphiti queries) to synthesize a unified RAG input,
- **This involves** leveraging Graphiti for dynamic context, Qdrant/LightRAG for semantic chunks, Neo4j Bimba for structure, and Notion for source documents, all harmonized and **potentially informed by UI context,**
- **So that** the Epii Agent receives a comprehensive, context-rich information base, **streamlining its context window,** enabling effective 6-stage analysis, and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Epii Agent backend orchestrates BPMCP tools (Graphiti, Story 1.1 & 1.2 enhancements) using initial query, Bimba coordinate, Graphiti entity ID, and **UI context (chat/canvas selections).**
2.  Orchestration logic (in backend or BPMCP skill) intelligently sequences BPMCP calls, leveraging harmonized schemas and **UI context.**
3.  Information from BPMCP (Graphiti, Qdrant/LightRAG, Neo4j Bimba, Notion) is synthesized, ranked/filtered, using **UI context for relevance,** emphasizing structured, harmonized input for the agent, **optimizing for context window efficiency.**
4.  Data provided to Epii Agent is structured (harmonized schema), comprehensive, supports its 6-stage pipeline, and reflects the **6-subsystem architecture's** data flow.
5.  Data includes citations (Bimba coordinates, Graphiti IDs, sources, **UI context markers**) in harmonized structure.
6.  Orchestration handles no-information scenarios gracefully.
7.  Configuration parameters (depth, sources, thresholds, **UI context flags**) are passed to BPMCP tools.
8.  The process considers how insights might flag needs for **Notion or Bimba updates.**

## Tasks / Subtasks

- [ ] **Task 1: Design Epii Agent Backend Orchestration for Unified RAG with Graphiti** (AC: #1, #7)
    - [ ] Define how the Epii Agent backend will invoke BPMCP tools (Graphiti tools, Story 1.1 & 1.2 enhancements) via A2A skills.
    - [ ] Specify input parameters (query, Bimba coordinates, Graphiti IDs, config options) and their mapping to BPMCP tool parameters.
    - [ ] Define the expected harmonized output structure from orchestrated BPMCP calls for the agent's pipeline (AC #5).
- [ ] **Task 2: Implement Orchestration Logic in Epii Agent Backend (or BPMCP Skill) for Graphiti & Multi-Source RAG** (AC: #2)
    - [ ] Develop logic to:
        - Query Graphiti for dynamic, real-time context.
        - Call enhanced Story 1.1 functionality (Graphiti + Qdrant/LightRAG RAG).
        - Use results to inform calls to enhanced Story 1.2 functionality (multi-source related concept data including Graphiti).
    - [ ] Manage data flow (adhering to harmonized schema) and error handling between orchestrated BPMCP tool calls (AC #6).
- [ ] **Task 3: Implement Information Structuring & Harmonization for Agent Consumption** (AC: #3, #4)
    - [ ] Develop logic in the Epii Agent backend to process, structure, and rank/filter the aggregated data from BPMCP tools according to the defined harmonized schema.
    - [ ] Ensure data is clearly attributed (source, Bimba coordinate, Graphiti ID) and prepared for the agent's analysis stages.
- [ ] **Task 4: Verify Integration with Epii Agent's Analysis Pipeline**
    - [ ] Confirm that the structured output from the orchestration can be effectively consumed by the Epii Agent's 6-stage analysis pipeline, particularly enriching Stages 0 (Perception & Filtering), 1 (Contextualization & Grounding), and 2 (Hypothesis Generation & Prioritization).
    - [ ] Test with example queries and Bimba coordinates relevant to the agent's tasks.

## Dev Technical Guidance

-   This story focuses on the Epii Agent backend orchestrating BPMCP tools (including new Graphiti capabilities and enhancements from Stories 1.1 & 1.2) for a powerful, unified, and harmonized RAG, fulfilling a key part of EPIC-001. Graphiti's integration is central to providing dynamic, real-time context and unifying diverse knowledge types (user, document, Bimba coordinate, agent-skill, semantic) for current analysis and future Nara Mode.
-   Orchestration will likely be in the Epii Agent backend (via A2A skills) or a dedicated BPMCP skill. Schema harmonization across all data sources (Graphiti, Qdrant/LightRAG, Neo4j Bimba, Notion, MongoDB) is critical.
-   Consult Epii Agent backend README, BPMCP README, Graphiti documentation, and the schema harmonization document (from Story 1.2).
-   The Epii Agent's 6-stage analysis pipeline is the primary consumer; the harmonized output directly feeds Stages 0-2.
-   Advanced synthesis by the Epii Agent will build upon this structured, harmonized data.
-   Performance, error handling, and clear feedback are essential, especially with the added complexity of Graphiti and schema harmonization.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log