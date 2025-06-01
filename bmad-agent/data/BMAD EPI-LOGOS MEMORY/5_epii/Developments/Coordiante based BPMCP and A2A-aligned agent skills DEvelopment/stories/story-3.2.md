# Story 3.2: Epii Agent Skill Invocation and Context Management

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-3.2.md`

## Status: Approved

## Story

- **As an** Epii Agent (within the **6-subsystem architecture**),
- **I want** to invoke a skill series, passing context (Bimba coordinates, dynamic Graphiti insights informed by **UI context like chat/canvas selections**, and **Graphiti-derived document-level memory/Bimba structure**) and data between them,
- **So that** I can execute plans (from Story 3.1), enabling **refined analysis for skill execution,** with **streamlined context windows,** and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Epii Agent (within **6-subsystem architecture**) takes a skill execution plan (Story 3.1) as input.
2.  Agent iterates through the planned skill sequence.
3.  For each skill, Agent uses Skills Router (Story 2.3) for invocation with specified parameters, including **UI context markers.**
4.  Agent captures output from each invoked skill.
5.  Agent manages context (Bimba coordinates, relevant Graphiti state/entities informed by **UI context**, **Graphiti-derived document-level memory/Bimba structure**) and passes data between skills; Graphiti context is updated/queried, ensuring **streamlined context windows.**
6.  Agent handles basic skill invocation errors (skill not found/execution error), potentially adapting plan or reporting failure, considering **UI context** for error reporting.
7.  Overall Bimba coordinate context and relevant dynamic Graphiti context (reflecting **UI context**) are maintained and available to each skill.
8.  Skill invocation and data passing mechanisms are designed to **inform potential Notion/Bimba updates** based on execution outcomes.

## Tasks / Subtasks

- [ ] Task 1: Develop logic for the Epii Agent to process a skill execution plan (AC: #1, #2)
- [ ] Task 2: Integrate skill invocation via the Skills Router (from Story 2.3) into the Epii Agent's execution loop (AC: #3)
- [ ] Task 3: Implement output capturing from skill invocations (AC: #4)
- [ ] Task 4: Design and implement a mechanism for context/data passing between sequential skill invocations (AC: #5)
    - [ ] Subtask 4.1: Define how data is mapped and transformed between skill outputs and inputs, **and how Graphiti context is propagated or updated.**
- [ ] Task 5: Implement basic error handling and reporting for skill invocation failures (AC: #6)
    - [ ] Subtask 5.1: Define strategies for recovery or plan adaptation (e.g., retry, alternative skill - future).
- [ ] Task 6: Ensure Bimba coordinate context **and dynamic Graphiti context** are consistently managed and passed during skill execution (AC: #7)
- [ ] Task 7: Document the skill invocation and context management module of the Epii Agent.

## Dev Technical Guidance

-   This story builds directly on Story 3.1 (Task Decomposition) and Story 2.3 (Skills Router).
-   The `Epii_Agent_Skill_Orchestration_Logic.md` shard is critical here.
-   Focus on robust execution of the plan. State management for the ongoing sequence of skill calls is important.
-   Consider how to manage the 'working memory' of the agent as it executes a plan, **potentially using Graphiti to store and retrieve intermediate state or dynamic context.**
-   Error handling should be graceful. For now, reporting failure is sufficient, but future stories might explore more sophisticated recovery.
-   The Bimba coordinate **and relevant Graphiti-derived data** should be core pieces of context passed to every skill, potentially influencing its behavior or data access.
-   Refer to `../../docs/architecture_shards/epii-agent-architecture.md` and `../../docs/architecture_shards/skills-router-architecture.md`.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log