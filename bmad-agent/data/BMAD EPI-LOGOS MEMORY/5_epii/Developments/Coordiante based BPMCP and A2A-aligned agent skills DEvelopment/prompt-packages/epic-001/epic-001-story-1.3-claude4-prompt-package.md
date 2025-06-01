# AI Builder Prompt Package: EPIC-001 / Story 1.3

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 1.3, contributing to EPIC-001.

## 1. Story Context & Goals

**Story ID:** 1.3
**Epic ID:** EPIC-001: Enhanced Unified RAG with Dynamic Graph Memory (Graphiti) via BPMCP for Advanced Contextual Awareness

**Story Description (from story-1.3.md):**
```
- As an Epii Agent backend system (operating within the 6-subsystem architecture),
- I want to orchestrate enhanced BPMCP tools (from Stories 1.1 & 1.2, now including UI context like chat/canvas selections for Graphiti queries) to synthesize a unified RAG input,
- This involves leveraging Graphiti for dynamic context, Qdrant/LightRAG for semantic chunks, Neo4j Bimba for structure, and Notion for source documents, all harmonized and potentially informed by UI context,
- So that the Epii Agent receives a comprehensive, context-rich information base, streamlining its context window, enabling effective 6-stage analysis, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-001.md, relevant excerpt):**
```
Enable agents to easily fetch, synthesize, and act upon relevant information from diverse data sources (static, processed, dynamic/real-time, and UI-interactional via AG-UI protocol) based on precise spatio-semantic context (Bimba coordinates) and evolving agent/user interactions. The Graphiti service will be crucial for unifying user state (including chat/canvas focus from AG-UI), document insights, Bimba coordinate knowledge, agent-skill specific data, and semantic relationships into a single, highly accessible memory layer. This unified view, always anchored by Bimba coordinates, is essential for current analytical tasks, informing potential Notion or Bimba updates, and for future Nara Mode developments.
```

## 2. Acceptance Criteria (from story-1.3.md)

```
1.  Epii Agent backend orchestrates BPMCP tools (Graphiti, Story 1.1 & 1.2 enhancements) using initial query, Bimba coordinate, Graphiti entity ID, and UI context (chat/canvas selections).
2.  Orchestration logic (in backend or BPMCP skill) intelligently sequences BPMCP calls, leveraging harmonized schemas and UI context.
3.  Information from BPMCP (Graphiti, Qdrant/LightRAG, Neo4j Bimba, Notion) is synthesized, ranked/filtered, using UI context for relevance, emphasizing structured, harmonized input for the agent, optimizing for context window efficiency.
4.  Data provided to Epii Agent is structured (harmonized schema), comprehensive, supports its 6-stage pipeline, and reflects the 6-subsystem architecture's data flow.
5.  Data includes citations (Bimba coordinates, Graphiti IDs, sources, UI context markers) in harmonized structure.
6.  Orchestration handles no-information scenarios gracefully.
7.  Configuration parameters (depth, sources, thresholds, UI context flags) are passed to BPMCP tools.
8.  The process considers how insights might flag needs for Notion or Bimba updates.
```

## 3. Tasks / Subtasks (from story-1.3.md)

```
- [ ] Task 1: Design Epii Agent Backend Orchestration for Unified RAG with Graphiti (AC: #1, #7)
    - [ ] Define how the Epii Agent backend will invoke BPMCP tools (Graphiti tools, Story 1.1 & 1.2 enhancements) via A2A skills.
    - [ ] Specify input parameters (query, Bimba coordinates, Graphiti IDs, config options) and their mapping to BPMCP tool parameters.
    - [ ] Define the expected harmonized output structure from orchestrated BPMCP calls for the agent's pipeline (AC #5).
- [ ] Task 2: Implement Orchestration Logic in Epii Agent Backend (or BPMCP Skill) for Graphiti & Multi-Source RAG (AC: #2)
    - [ ] Develop logic to:
        - Query Graphiti for dynamic, real-time context.
        - Call enhanced Story 1.1 functionality (Graphiti + Qdrant/LightRAG RAG).
        - Use results to inform calls to enhanced Story 1.2 functionality (multi-source related concept data including Graphiti).
    - [ ] Manage data flow (adhering to harmonized schema) and error handling between orchestrated BPMCP tool calls (AC #6).
- [ ] Task 3: Implement Information Structuring & Harmonization for Agent Consumption (AC: #3, #4)
    - [ ] Develop logic in the Epii Agent backend to process, structure, and rank/filter the aggregated data from BPMCP tools according to the defined harmonized schema.
    - [ ] Ensure data is clearly attributed (source, Bimba coordinate, Graphiti ID) and prepared for the agent's analysis stages.
- [ ] Task 4: Verify Integration with Epii Agent's Analysis Pipeline
    - [ ] Confirm that the structured output from the orchestration can be effectively consumed by the Epii Agent's 6-stage analysis pipeline, particularly enriching Stages 0 (Perception & Filtering), 1 (Contextualization & Grounding), and 2 (Hypothesis Generation & Prioritization).
    - [ ] Test with example queries and Bimba coordinates relevant to the agent's tasks.
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** Epii Subsystem (#5) interacting with Siva aspect (#5-2) managed memory.
*   **Bimba Coordinate System:** Essential for contextual grounding.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md & epic-001.md)

*   **Backend Architecture (Siva Aspect #5-2):** Orchestrates QL cycles and memory.
*   **BPMCP:** Provides tools for Bimba, Pratibimba (Qdrant), MongoDB, Notion, Web. Enhanced by Story 1.1 & 1.2 for Graphiti and multi-source RAG.
*   **LightRAG MCP Server:** Python-based, graph+vector fusion.
*   **Graphiti Service:** Python-based, dynamic knowledge graph, central to this story for unifying context.
*   **AG-UI Protocol:** Communicates UI context to backend/Graphiti.
*   **Schema Harmonization:** CRITICAL. Output for Epii agent must be from a harmonized schema (defined in Story 1.2).
*   **Epii Agent Backend:** Orchestrates BPMCP calls, possibly via A2A skills. Processes and structures data for its 6-stage analysis pipeline.
*   **Programming Languages/Frameworks:** Node.js (BPMCP, Epii Agent Backend likely), Python (LightRAG, Graphiti).

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the full-stack functionality for Story 1.3, focusing on the Epii Agent backend's orchestration of enhanced BPMCP tools (from Stories 1.1 & 1.2, including Graphiti and UI context integration) to synthesize a unified, harmonized RAG input for the agent's 6-stage analysis pipeline. This is the culmination of EPIC-001's RAG enhancements.

Key Objectives & Requirements:

1.  **Epii Agent Backend Orchestration Design (Node.js or chosen backend language):
    *   **A2A Skill Definition (if applicable):** If orchestration is via an A2A skill, define the skill's interface, inputs (query, Bimba coordinates, initial Graphiti entity IDs, UI context, configuration options like depth, source filters, thresholds), and outputs (harmonized, structured data for the agent pipeline).
    *   **Orchestration Service/Module:** Design a service or module within the Epii Agent backend responsible for this orchestration.
    *   **Input Mapping:** Clearly map the overall request parameters to the specific inputs required by the BPMCP tools developed/enhanced in Stories 1.1 and 1.2.

2.  **Orchestration Logic Implementation (Epii Agent Backend):
    *   **Intelligent Sequencing:** Develop the core logic to intelligently sequence calls to the BPMCP tools:
        *   Initial call to Graphiti (via BPMCP tool from Story 1.1) for dynamic context based on Bimba coordinate, query, and UI context.
        *   Call to enhanced RAG (Story 1.1 BPMCP functionality: Graphiti + Qdrant/LightRAG) using initial inputs and Graphiti insights.
        *   If applicable, use results to inform calls to the multi-source concept expansion (Story 1.2 BPMCP functionality: Graphiti traversal + Qdrant/LightRAG + Neo4j Bimba + Notion).
    *   **Configuration Management:** Allow orchestration to be configurable (e.g., which sources to prioritize, depth of search, relevance thresholds, how strongly to weigh UI context flags).
    *   **Data Flow Management:** Manage the flow of data between these orchestrated calls, ensuring adherence to the harmonized schema defined in Story 1.2.
    *   **Error Handling:** Implement robust error handling for failures in any of the underlying BPMCP calls or if no meaningful information is retrieved. Provide graceful fallback or clear error reporting.

3.  **Information Synthesis, Structuring, and Ranking (Epii Agent Backend):
    *   **Synthesis:** Process the aggregated data (already in a harmonized format from BPMCP tools as per Story 1.2) from the various BPMCP calls.
    *   **Ranking/Filtering:** Implement logic to rank or filter the synthesized information based on relevance to the initial query, Bimba coordinate, UI context, and potentially agent's current task/goal. This is crucial for optimizing the context window.
    *   **Structuring for Agent Pipeline:** Ensure the final data payload provided to the Epii Agent's 6-stage analysis pipeline is optimally structured, comprehensive, and clearly attributes information to its source (including Bimba coordinates, Graphiti IDs, specific source system, and UI context markers).

4.  **Integration with Epii Agent's 6-Stage Analysis Pipeline:
    *   **Output Format:** Define and implement the precise output format that this orchestration layer will provide to the Epii Agent's pipeline (Stages 0-2 primarily).
    *   **Verification:** Confirm that this output can be effectively consumed and utilized by the pipeline stages for perception, contextualization, and hypothesis generation.
    *   Conduct example runs with realistic queries, Bimba coordinates, and UI context scenarios to test the end-to-end flow.

5.  **Documentation:
    *   Document the orchestration logic, A2A skill interface (if any), configuration options, and the final data structure provided to the Epii Agent.
    *   Update any relevant diagrams or architectural documents to reflect this orchestration layer.

Considerations:

*   **Philosophical Alignment:** Ensure the solution aligns with the 6-subsystem architecture, with the Epii agent backend orchestrating memory access.
*   **Schema Consistency:** Strictly adhere to the harmonized schema developed in Story 1.2.
*   **Performance:** The orchestration of multiple calls must be performant to support interactive agent use cases.
*   **Modularity:** Build upon the modular BPMCP tools from Stories 1.1 and 1.2.

Please provide the necessary code modifications (primarily in the Epii Agent backend), new files, A2A skill definitions (if applicable), and documentation updates to achieve these objectives. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-001-story-1.3-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`