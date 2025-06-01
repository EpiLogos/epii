# Story 2.2: Query Skills Registry for Context-Relevant Skills

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-2.2.md`

## Status: Approved

## Story

- **As the** System (within the **6-subsystem architecture**, acting for an Agent),
- **I want** to query the Skills Registry for skills relevant to a task, Bimba coordinate, **UI context (chat/canvas selections influencing Graphiti context),** and **leveraging document-level memory/Bimba structure from Graphiti,**
- **So that** agents discover appropriate capabilities, enabling **refined analysis for skill execution,** **streamlined context for invocation,** and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Skills Registry API (within **6-subsystem architecture**) for querying skills is available.
2.  Query API accepts: task description, Bimba coordinate(s), Graphiti context (entity IDs, types, patterns, **influenced by UI context like chat/canvas selections**), skill name, metadata, explicitly supporting queries based on **document-level memory and Bimba structural knowledge from Graphiti.**
3.  Query logic matches skills by: semantic similarity, Bimba coordinate patterns, Graphiti entity/type patterns (considering **UI context**), and **Graphiti-derived document/structural knowledge.**
4.  Query results: list of matching skill definitions/summaries, ranked by relevance (considering **UI context** and **Graphiti insights**).
5.  Query is efficient for many skills.
6.  (Future) Access controls noted.
7.  Skill discovery aids **refined analysis for skill execution** and **streamlines context for invocation.**
8.  The discovery process considers how skill applicability might relate to **potential Notion/Bimba updates.**

## Tasks / Subtasks

- [ ] Task 1: Design the Skill Query API endpoint (AC: #1, #2)
    - [ ] Subtask 1.1: Define query parameters (task description, Bimba coordinates, **Graphiti context parameters**, tags, etc.).
    - [ ] Subtask 1.2: Define the structure of the query response (list of skills, ranking information).
- [ ] Task 2: Implement the core query logic for the Skills Registry (AC: #3)
    - [ ] Subtask 2.1: Develop Bimba coordinate matching logic (e.g., exact, prefix, wildcard, hierarchical).
    - [ ] Subtask 2.2: Implement semantic search capability for matching task descriptions to skill descriptions (e.g., using embeddings).
    - [ ] Subtask 2.3: Combine Bimba coordinate, **Graphiti context**, and semantic matching for comprehensive skill discovery.
- [ ] Task 3: Implement ranking for query results (AC: #4)
    - [ ] Subtask 3.1: Define a relevance scoring mechanism.
- [ ] Task 4: Optimize query performance (AC: #5)
    - [ ] Subtask 4.1: Consider indexing strategies for skill metadata, Bimba coordinates, **and Graphiti applicability patterns.**
- [ ] Task 5: Document the Skill Query API (AC: #1, #2)
- [ ] Task 6: (Future) Outline design for access control mechanisms (AC: #6)

## Dev Technical Guidance

-   This story enables dynamic skill discovery by agents.
-   The Skills Registry query mechanism is central to the A2A framework's flexibility.
-   Refer to `../../docs/architecture_shards/bpmcp-architecture-overview.md#skills-registry` and `../../docs/architecture_shards/bpmcp-architecture-overview.md#skills-router`.
-   For semantic search, consider integrating with a vector database or using embedding models directly if skill descriptions are stored appropriately. See `../../docs/architecture_shards/vector-database-integration.md`.
-   Bimba coordinate and **Graphiti context** matching should be robust and align with the patterns defined in Story 2.1.
-   The `A2A_Skill_Framework_Design.md` and `Epii_Agent_Skill_Orchestration_Logic.md` shards will provide important context.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log