# AI Builder Prompt Package: EPIC-002 / Story 2.2

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 2.2, contributing to EPIC-002.

## 1. Story Context & Goals

**Story ID:** 2.2
**Epic ID:** EPIC-002: A2A Skill Management Framework with Graphiti-Powered Dynamic Contextualization

**Story Description (from story-2.2.md):**
```
- As the System (within the 6-subsystem architecture, acting for an Agent),
- I want to query the Skills Registry for skills relevant to a task, Bimba coordinate, UI context (chat/canvas selections influencing Graphiti context), and leveraging document-level memory/Bimba structure from Graphiti,
- So that agents discover appropriate capabilities, enabling refined analysis for skill execution, streamlined context for invocation, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-002.md, relevant excerpt):**
```
To establish a robust foundation for creating and managing reusable agent capabilities that are discoverable and executable within Bimba coordinate and rich Graphiti context (including real-time user interactions via AG-UI and refined analytical insights from the Graphiti service). This ensures skills adapt to evolving information, streamline their own context windows for execution, and can effectively inform or trigger updates to Notion or Bimba, maintaining Bimba coordinate integrity.
```

## 2. Acceptance Criteria (from story-2.2.md)

```
1.  Skills Registry API (within 6-subsystem architecture) for querying skills is available.
2.  Query API accepts: task description, Bimba coordinate(s), Graphiti context (entity IDs, types, patterns, influenced by UI context like chat/canvas selections), skill name, metadata, explicitly supporting queries based on document-level memory and Bimba structural knowledge from Graphiti.
3.  Query logic matches skills by: semantic similarity, Bimba coordinate patterns, Graphiti entity/type patterns (considering UI context), and Graphiti-derived document/structural knowledge.
4.  Query results: list of matching skill definitions/summaries, ranked by relevance (considering UI context and Graphiti insights).
5.  Query is efficient for many skills.
6.  (Future) Access controls noted.
7.  Skill discovery aids refined analysis for skill execution and streamlines context for invocation.
8.  The discovery process considers how skill applicability might relate to potential Notion/Bimba updates.
```

## 3. Tasks / Subtasks (from story-2.2.md)

```
- [ ] Task 1: Design the Skill Query API endpoint (AC: #1, #2)
    - [ ] Subtask 1.1: Define query parameters (task description, Bimba coordinates, Graphiti context parameters, tags, etc.).
    - [ ] Subtask 1.2: Define the structure of the query response (list of skills, ranking information).
- [ ] Task 2: Implement the core query logic for the Skills Registry (AC: #3)
    - [ ] Subtask 2.1: Develop Bimba coordinate matching logic (e.g., exact, prefix, wildcard, hierarchical).
    - [ ] Subtask 2.2: Implement semantic search capability for matching task descriptions to skill descriptions (e.g., using embeddings).
    - [ ] Subtask 2.3: Combine Bimba coordinate, Graphiti context, and semantic matching for comprehensive skill discovery.
- [ ] Task 3: Implement ranking for query results (AC: #4)
    - [ ] Subtask 3.1: Define a relevance scoring mechanism.
- [ ] Task 4: Optimize query performance (AC: #5)
    - [ ] Subtask 4.1: Consider indexing strategies for skill metadata, Bimba coordinates, and Graphiti applicability patterns.
- [ ] Task 5: Document the Skill Query API (AC: #1, #2)
- [ ] Task 6: (Future) Outline design for access control mechanisms (AC: #6)
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** Skill discovery and invocation operate within this framework.
*   **Bimba Coordinate System:** A primary filter and contextualizer for skill discovery.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md, epic-002.md & story-2.2.md)

*   **Skills Registry:** Component of BPMCP (or a dedicated service) responsible for storing and providing query access to skill definitions created in Story 2.1.
*   **Graphiti Service:** Provides dynamic context (document memory, Bimba structure, UI state via AG-UI) that heavily influences skill relevance and discovery.
*   **AG-UI Protocol:** Feeds UI interaction data into Graphiti, which is then used by the Skills Registry query logic.
*   **Query Parameters:** Include task description (for semantic match), Bimba coordinates, Graphiti context (entity IDs/types/patterns, UI context markers), skill name, and other metadata.
*   **Matching Logic:** Combines semantic similarity (task description vs. skill description), Bimba coordinate pattern matching, and Graphiti context pattern matching.
*   **Ranking:** Query results should be ranked by relevance, considering all matching factors, especially Graphiti insights and UI context.
*   **Performance:** Queries need to be efficient, potentially requiring indexing on skill metadata, Bimba patterns, and Graphiti applicability patterns.
*   **Programming Languages/Frameworks:** Node.js (Skills Registry API likely), Python (Graphiti). Semantic search might involve vector databases or embedding models.

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the Skill Query API and associated logic for the Skills Registry as defined in Story 2.2. This will enable agents to dynamically discover contextually relevant skills based on task descriptions, Bimba coordinates, and rich dynamic context from the Graphiti service (including UI interactions via AG-UI and document/Bimba structural memory). This is a core part of EPIC-002.

Key Objectives & Requirements:

1.  **Skill Query API Endpoint Design (Node.js - extending the Skills Registry from Story 2.1):
    *   **API Definition:** Design a RESTful API endpoint (e.g., `GET /api/v1/skills/query` or `POST /api/v1/skills/search` if complex query body is needed). Define query parameters clearly (AC#2):
        *   `taskDescription` (string, for semantic matching)
        *   `bimbaCoordinates` (array of strings or a single string, supporting patterns)
        *   `graphitiContext` (object, e.g., `{"nodeTypes": ["TypeA"], "relatedToEntityID": "graphiti-id-123", "uiContext": {"activeChatKeywords": ["keyword1"], "canvasSelectionType": "NodeTypeX"}}`)
        *   `skillName` (string, optional, for direct lookup or partial match)
        *   `tags` (array of strings, optional)
        *   Other metadata filters (e.g., `version`, `author`).
    *   **Response Structure:** Define the API response structure. It should be a list of matching skill definitions (or summaries), including a relevance score and details on why it matched (e.g., matched Bimba patterns, Graphiti context elements). (AC#4)

2.  **Core Query Logic Implementation (Node.js - Skills Registry):
    *   **Bimba Coordinate Matching:** Implement logic to match skills based on Bimba coordinate patterns stored in their definitions against the query's Bimba coordinates. Support exact matches, prefix matching, wildcard matching, and hierarchical understanding. (AC#3)
    *   **Graphiti Context Matching:** Implement logic to match skills based on Graphiti entity/type patterns and UI context markers. This will involve comparing the query's `graphitiContext` with the `graphitiContext` linkage defined in skill definitions (Story 2.1). This is a critical part for dynamic contextualization. (AC#3)
    *   **Semantic Search for Task Description:** Implement or integrate a semantic search capability. This could involve:
        *   Generating embeddings for skill descriptions (if not already done during registration) and the incoming `taskDescription`.
        *   Performing a similarity search (e.g., cosine similarity) against stored skill description embeddings.
        *   Consider using a vector database or a library for managing and searching embeddings. (AC#3)
    *   **Combined Matching Strategy:** Develop a strategy to combine results from Bimba matching, Graphiti context matching, and semantic search. For example, a skill might need to satisfy Bimba criteria AND have a high semantic similarity, or satisfy Graphiti context AND Bimba criteria.

3.  **Ranking of Query Results (Node.js - Skills Registry):
    *   **Relevance Scoring:** Define and implement a relevance scoring mechanism. The score should consider the strength of the match across different criteria (semantic similarity score, specificity of Bimba match, relevance of Graphiti context match, influence of UI context). (AC#4)
    *   **Sort Results:** Ensure query results are sorted by this relevance score in descending order.

4.  **Query Performance Optimization (Conceptual & Initial Implementation):
    *   **Indexing Strategy:** Outline and implement initial indexing strategies for the skill storage mechanism chosen in Story 2.1. This should cover fields frequently used in queries, such as skill name, tags, Bimba coordinate patterns (if feasible to index effectively), and key Graphiti applicability attributes. (AC#5)
    *   Discuss potential bottlenecks and how they might be addressed in future iterations.

5.  **Developer Documentation (Markdown - extending documentation from Story 2.1):
    *   Document the new Skill Query API endpoint in detail, including all query parameters and the response structure, with examples.
    *   Explain how the different matching criteria (Bimba, Graphiti, semantic) work together.
    *   Provide guidance on how to formulate effective queries.

Considerations:

*   **Integration with Graphiti Service:** While this story focuses on the Skills Registry, the query logic will heavily rely on interpreting `graphitiContext` parameters. The actual fetching of dynamic data from Graphiti to enrich the context *before* querying the Skills Registry, or by the Skill Router *after* skill selection, might be part of a subsequent story or the Skill Router's responsibility. For this story, assume the `graphitiContext` in the query is sufficiently descriptive.
*   **Scalability:** Keep scalability in mind, especially for semantic search and combined matching logic, as the number of skills grows.
*   **Flexibility:** The query mechanism should be flexible enough to accommodate new matching criteria in the future.

Please provide the necessary code modifications (Node.js for the Skills Registry API and logic), documentation updates (Markdown), and any relevant configuration. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-002-story-2.2-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`