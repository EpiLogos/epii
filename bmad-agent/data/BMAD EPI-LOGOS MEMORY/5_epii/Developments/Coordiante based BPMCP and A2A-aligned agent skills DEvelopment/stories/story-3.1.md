# Story 3.1: Epii Agent Task Decomposition and Skill Sequencing

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-3.1.md`

## Status: Approved

## Story

- **As an** Epii Agent (within the **6-subsystem architecture**),
- **I want** to decompose a complex user request (including **UI context like chat/canvas selections**) into a skill sequence by querying the Skills Registry, using Bimba context, dynamic Graphiti insights (informed by **UI context**), and **leveraging document-level memory/Bimba structure from Graphiti,**
- **So that** I can plan multi-step task execution, enabling **refined analysis for skill sequencing,** with **streamlined context windows,** and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Epii Agent (within **6-subsystem architecture**) receives complex user request (NL or structured, including **UI context like chat/canvas selections**).
2.  Agent analyzes request to identify sub-tasks/capabilities, considering **UI context.**
3.  For sub-tasks, Agent queries Skills Registry (Story 2.2) for relevant skills, using Bimba context, dynamic Graphiti context (informed by **UI context**), and **Graphiti-derived document-level memory/Bimba structure.**
4.  Agent selects appropriate skill(s) for sub-tasks from query results, factoring in **UI context** and **Graphiti insights** for relevance.
5.  Agent determines logical skill sequence, adapting based on real-time Graphiti conditions (reflecting **UI context**), to fulfill request, enabling **refined analysis for skill sequencing.**
6.  Output: plan/sequence of (skill_id, input_params, relevant_graphiti_context_snapshot, **UI_context_markers**) tuples, ensuring **streamlined context windows.**
7.  Handles simple skill dependencies (output of A is input to B).
8.  The planning process considers how skill execution might **inform Notion/Bimba updates.**

## Tasks / Subtasks

- [ ] Task 1: Develop request analysis and sub-task identification logic for Epii Agent (AC: #1, #2)
    - [ ] Subtask 1.1: Explore techniques for natural language understanding and intent extraction for task decomposition.
- [ ] Task 2: Integrate Skills Registry querying capability (from Story 2.2) into the Epii Agent (AC: #3)
- [ ] Task 3: Implement skill selection logic (AC: #4)
    - [ ] Subtask 3.1: Define criteria for selecting the best skill if multiple are returned (e.g., specificity, developer preference, historical success rate - future).
- [ ] Task 4: Develop skill sequencing and planning logic (AC: #5, #6)
    - [ ] Subtask 4.1: Implement basic planning algorithms (e.g., linear sequence, simple dependency graph).
- [ ] Task 5: Implement handling of simple skill dependencies (AC: #7)
    - [ ] Subtask 5.1: Design how output from one skill is mapped to the input of a subsequent skill in the plan.
- [ ] Task 6: Document the task decomposition and planning module of the Epii Agent.

## Dev Technical Guidance

-   This story enhances the core intelligence of the Epii Agent.
-   The agent's ability to plan is crucial for autonomous operation.
-   Refer to `../../docs/architecture_shards/epii-agent-architecture.md` for the agent's internal design.
-   LLMs can be leveraged for the initial request decomposition (AC #1, #2), but the subsequent skill mapping and sequencing should be more deterministic, relying on the structured Skills Registry.
-   Consider using a state machine or a simple planning library if complexity grows.
-   The `Epii_Agent_Skill_Orchestration_Logic.md` shard is central to this story.
-   Ensure Bimba coordinates **and relevant Graphiti context indicators** from the user request (or derived by the agent) are propagated and used during skill discovery and sequencing.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log