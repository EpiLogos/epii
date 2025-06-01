# AI Builder Prompt Package: EPIC-003 / Story 3.2

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 3.2, contributing to EPIC-003.

## 1. Story Context & Goals

**Story ID:** 3.2
**Epic ID:** EPIC-003: Epii Agent Enhancement for Advanced Skill Execution & Orchestration with Graphiti-Powered Intelligence

**Story Description (from story-3.2.md):**
```
- As an Epii Agent (within the 6-subsystem architecture),
- I want to invoke a skill series, passing context (Bimba coordinates, dynamic Graphiti insights informed by UI context like chat/canvas selections, and Graphiti-derived document-level memory/Bimba structure) and data between them,
- So that I can execute plans (from Story 3.1), enabling refined analysis for skill execution, with streamlined context windows, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-003.md, relevant excerpt):**
```
Empower the Epii Agent with sophisticated orchestration, enabling complex, multi-step tasks by dynamically leveraging A2A skills. The Graphiti service's role as a dynamic, unified memory (capturing user state via AG-UI, document insights, Bimba knowledge) is central, providing real-time awareness for intelligent decision-making, adaptive execution, and informing potential Notion or Bimba updates, always maintaining Bimba coordinate integrity. This is critical for autonomous, contextually-aware agent behavior and efficient context utilization.
```

## 2. Acceptance Criteria (from story-3.2.md)

```
1.  Epii Agent (within 6-subsystem architecture) takes a skill execution plan (Story 3.1) as input.
2.  Agent iterates through the planned skill sequence.
3.  For each skill, Agent uses Skills Router (Story 2.3) for invocation with specified parameters, including UI context markers.
4.  Agent captures output from each invoked skill.
5.  Agent manages context (Bimba coordinates, relevant Graphiti state/entities informed by UI context, Graphiti-derived document-level memory/Bimba structure) and passes data between skills; Graphiti context is updated/queried, ensuring streamlined context windows.
6.  Agent handles basic skill invocation errors (skill not found/execution error), potentially adapting plan or reporting failure, considering UI context for error reporting.
7.  Overall Bimba coordinate context and relevant dynamic Graphiti context (reflecting UI context) are maintained and available to each skill.
8.  Skill invocation and data passing mechanisms are designed to inform potential Notion/Bimba updates based on execution outcomes.
```

## 3. Tasks / Subtasks (from story-3.2.md)

```
- [ ] Task 1: Develop logic for the Epii Agent to process a skill execution plan (AC: #1, #2)
- [ ] Task 2: Integrate skill invocation via the Skills Router (from Story 2.3) into the Epii Agent's execution loop (AC: #3)
- [ ] Task 3: Implement output capturing from skill invocations (AC: #4)
- [ ] Task 4: Design and implement a mechanism for context/data passing between sequential skill invocations (AC: #5)
    - [ ] Subtask 4.1: Define how data is mapped and transformed between skill outputs and inputs, and how Graphiti context is propagated or updated.
- [ ] Task 5: Implement basic error handling and reporting for skill invocation failures (AC: #6)
    - [ ] Subtask 5.1: Define strategies for recovery or plan adaptation (e.g., retry, alternative skill - future).
- [ ] Task 6: Ensure Bimba coordinate context and dynamic Graphiti context are consistently managed and passed during skill execution (AC: #7)
- [ ] Task 7: Document the skill invocation and context management module of the Epii Agent.
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** The Epii Agent's execution of skill plans is a key function within this architecture.
*   **Bimba Coordinate System:** Provides essential grounding context for each skill invocation within a plan.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md, epic-003.md, story-3.2.md & relevant architecture shards)

*   **Epii Agent:** The orchestrator executing a pre-defined skill plan (from Story 3.1).
*   **Skill Execution Plan:** A sequence of (skill_id, input_params_template, relevant_graphiti_context_snapshot, ui_context_markers) tuples.
*   **Skills Router:** The service (from Story 2.3) used by the Epii Agent to invoke individual skills in the plan.
*   **Graphiti Service:** Continuously provides and updates dynamic context. The Epii Agent must manage this context throughout the execution of a skill plan, ensuring each skill receives relevant Graphiti insights (UI state, document memory, Bimba structure) and potentially updating Graphiti with intermediate results or new understanding.
*   **AG-UI Protocol:** UI interactions influence Graphiti, and this UI context (passed as markers or queries to Graphiti) must be considered by the agent when invoking skills and managing the overall plan execution.
*   **Context Management & Data Passing:** A core challenge is managing the flow of data (outputs from one skill becoming inputs to another) and context (Bimba coordinates, evolving Graphiti state) across a sequence of skill invocations. This is crucial for streamlined context windows.
*   **Error Handling:** Basic error handling for skill invocation failures is required, with consideration for how UI context might influence error reporting or recovery attempts.
*   **Programming Languages/Frameworks:** Epii Agent logic likely in Python or Node.js, interacting with Skills Router (Node.js) and Graphiti (Python).
*   **Relevant Documentation:** `Epii_Agent_Skill_Orchestration_Logic.md`, `epii-agent-architecture.md`, `skills-router-architecture.md`.

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the skill execution and context management capabilities within the Epii Agent as defined in Story 3.2. The agent must be able to take a skill execution plan (generated in Story 3.1), iterate through it, invoke skills via the Skills Router, manage the flow of data and dynamic context (especially from Graphiti, including UI context), and handle basic errors. This is crucial for realizing the orchestration power envisioned in EPIC-003.

Key Objectives & Requirements:

1.  **Plan Processing Logic (Epii Agent - Python/Node.js):
    *   **Input Plan:** The agent must accept a skill execution plan as input. This plan is a sequence of tuples: `(skill_id, input_params_template, relevant_graphiti_context_snapshot, ui_context_markers)`. (AC#1)
    *   **Iteration:** Implement logic to iterate through the skills in the plan sequentially. (AC#2)

2.  **Skill Invocation via Skills Router (Epii Agent):
    *   **Parameter Preparation:** For each skill in the plan, prepare the actual input parameters. This involves:
        *   Resolving any placeholders in `input_params_template` with outputs from previously executed skills in the sequence.
        *   Incorporating relevant Bimba coordinate context.
        *   Fetching or preparing the specific `graphitiContext` required for this skill, based on `relevant_graphiti_context_snapshot` from the plan and potentially querying Graphiti for the latest state related to `ui_context_markers` or other dynamic elements. (AC#5, AC#7)
    *   **Invocation Call:** Use the Skills Router API (from Story 2.3) to invoke the skill with the prepared parameters and context (including `ui_context_markers` to be passed to the Skills Router). (AC#3)

3.  **Output Capturing and Data Flow (Epii Agent):
    *   **Capture Output:** Capture the output returned by the Skills Router for each successfully invoked skill. (AC#4)
    *   **Data Passing:** Implement the mechanism to make this output available as input to subsequent skills in the plan, as defined by the `input_params_template` dependencies. (AC#5, Subtask 4.1)
    *   **Graphiti Context Updates:** Consider how skill outputs or intermediate states might update or refine the agent's understanding of the Graphiti context. This could involve the agent making updates to Graphiti or refining subsequent Graphiti queries. (AC#5, Subtask 4.1)

4.  **Context Management (Epii Agent):
    *   **Bimba Context:** Ensure the overall Bimba coordinate context for the task is maintained and made available to each skill invocation as appropriate. (AC#7)
    *   **Graphiti Dynamic Context:** This is critical. The agent must manage the dynamic context from Graphiti throughout the plan's execution. This means:
        *   Passing relevant snapshots or queries of Graphiti data (informed by `uiContext` from AG-UI) to each skill.
        *   Potentially using Graphiti as a 'working memory' to store intermediate results or evolving contextual understanding during the plan execution. (AC#5, AC#7, Subtask 4.1)
    *   **Streamlined Context Windows:** The goal is to provide each skill with precisely the context it needs, avoiding overload, and ensuring the agent itself maintains an efficient contextual understanding.

5.  **Error Handling (Epii Agent):
    *   Implement basic error handling for skill invocations made through the Skills Router. This includes: (AC#6)
        *   Detecting failures (e.g., skill not found, execution error reported by Skills Router).
        *   Logging the error along with relevant context (e.g., skill_id, parameters, `uiContext` at the time of failure).
        *   For this story, the agent can report the failure of the overall plan. More advanced recovery (retry, alternative skill) can be a future enhancement. (Subtask 5.1)
    *   Consider how `uiContext` might influence how errors are reported to the user or system.

6.  **Informing Notion/Bimba Updates (Conceptual Design):
    *   The mechanisms for skill invocation and data passing should be designed with the awareness that the outcomes of skill executions (or the entire plan) might need to inform updates to Notion or Bimba. (AC#8) This could involve structuring skill outputs or agent-level summaries in a way that facilitates such updates by other services or subsequent skills.

7.  **Developer Documentation (Markdown):
    *   Document the skill execution loop, context management strategies (especially for Graphiti), and data passing mechanisms within the Epii Agent.
    *   Explain how the agent interacts with the Skills Router.
    *   Detail the error handling procedures.

Considerations:

*   **State Management for Plan Execution:** How does the agent keep track of the current step in the plan, outputs from previous steps, and the evolving context?
*   **Asynchronous Skill Execution:** If skills invoked via the Skills Router can be long-running or asynchronous, how does the Epii Agent manage this? (For this story, assume synchronous or a simple callback/promise handling if skills are quick).
*   **Transactionality/Rollback:** For complex plans, are there any considerations for partial success or the need to roll back actions if a later skill fails? (Likely out of scope for this story, but good to note for future).

Please provide the necessary Python/Node.js code for the Epii Agent's execution logic, context management, interactions with other services, documentation updates (Markdown), and any relevant configuration. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-003-story-3.2-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`