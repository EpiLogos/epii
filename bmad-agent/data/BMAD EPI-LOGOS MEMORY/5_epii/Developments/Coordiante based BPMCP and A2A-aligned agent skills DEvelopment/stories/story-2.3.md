# Story 2.3: Skill Invocation and Execution Management by Skills Router

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-2.3.md`

## Status: Approved

## Story

- **As the** Skills Router (within the **6-subsystem architecture**),
- **I want** to invoke a skill, passing parameters, Bimba coordinate, **UI context (chat/canvas selections for Graphiti),** and **leveraging document-level memory/Bimba structure from Graphiti,** managing its execution,
- **So that** agent capabilities are reliably executed, enabling **refined analysis,** with **streamlined context,** and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Skills Router API (part of **6-subsystem architecture**) for invoking skills by ID is available.
2.  Invocation request includes: input params (per schema), Bimba context, dynamic Graphiti context (influenced by **UI context like chat/canvas selections**), and mechanisms to utilize **document-level memory/Bimba structural knowledge from Graphiti.**
3.  Skills Router retrieves skill definition from Skills Registry.
4.  Input parameters validated against skill's input schema.
5.  Skills Router maps to and executes underlying BPMCP tool/function with validated params and all relevant context (Bimba, Graphiti, **UI context markers**), supporting **refined analysis for skill execution.**
6.  Output captured and returned per skill's output schema, ensuring **streamlined context.**
7.  Error handling for: skill not found, input validation failure, execution errors.
8.  Logging of skill invocations (ID, timestamp, status, **UI context snapshot**).
9.  Skill execution considers how results might **inform Notion/Bimba updates.**

## Tasks / Subtasks

- [ ] Task 1: Design the Skill Invocation API for the Skills Router (AC: #1, #2)
    - [ ] Subtask 1.1: Define input (skill ID, parameters, Bimba context, **Graphiti context**) and output (skill execution result, status).
- [ ] Task 2: Implement skill definition retrieval from Skills Registry (AC: #3)
- [ ] Task 3: Implement input parameter validation against skill schema (AC: #4)
- [ ] Task 4: Implement the core skill execution logic (AC: #5)
    - [ ] Subtask 4.1: Develop a mechanism to dynamically call the BPMCP tool/function specified in the skill definition.
    - [ ] Subtask 4.2: Ensure Bimba coordinate context **and Graphiti-derived dynamic context** are appropriately passed or utilized by the underlying tool.
- [ ] Task 5: Implement output formatting according to skill schema (AC: #6)
- [ ] Task 6: Implement comprehensive error handling (AC: #7)
- [ ] Task 7: Implement logging for skill invocations (AC: #8)
- [ ] Task 8: Document the Skill Invocation API.

## Dev Technical Guidance

-   The Skills Router is the execution engine for the A2A Skill Framework.
-   This component bridges the gap between skill definition and actual execution via BPMCP tools.
-   Refer to `../../docs/architecture_shards/bpmcp-architecture-overview.md#skills-router`.
-   Dynamic invocation of BPMCP tools might require reflection or a command pattern.
-   Ensure robust error propagation from underlying tools back to the invoking agent.
-   Context management (especially Bimba coordinates **and dynamic Graphiti context**) is crucial for ensuring skills operate as intended.
-   The `A2A_Skill_Framework_Design.md` and `Epii_Agent_Skill_Orchestration_Logic.md` shards are key references.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log