# AI Builder Prompt Package: EPIC-003 / Story 3.1

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 3.1, contributing to EPIC-003.

## 1. Story Context & Goals

**Story ID:** 3.1
**Epic ID:** EPIC-003: Epii Agent Enhancement for Advanced Skill Execution & Orchestration with Graphiti-Powered Intelligence

**Story Description (from story-3.1.md):**
```
- As an Epii Agent (within the 6-subsystem architecture),
- I want to decompose a complex user request (including UI context like chat/canvas selections) into a skill sequence by querying the Skills Registry, using Bimba context, dynamic Graphiti insights (informed by UI context), and leveraging document-level memory/Bimba structure from Graphiti,
- So that I can plan multi-step task execution, enabling refined analysis for skill sequencing, with streamlined context windows, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-003.md, relevant excerpt):**
```
Empower the Epii Agent with sophisticated orchestration, enabling complex, multi-step tasks by dynamically leveraging A2A skills. The Graphiti service's role as a dynamic, unified memory (capturing user state via AG-UI, document insights, Bimba knowledge) is central, providing real-time awareness for intelligent decision-making, adaptive execution, and informing potential Notion or Bimba updates, always maintaining Bimba coordinate integrity. This is critical for autonomous, contextually-aware agent behavior and efficient context utilization.
```

## 2. Acceptance Criteria (from story-3.1.md)

```
1.  Epii Agent (within 6-subsystem architecture) receives complex user request (NL or structured, including UI context like chat/canvas selections).
2.  Agent analyzes request to identify sub-tasks/capabilities, considering UI context.
3.  For sub-tasks, Agent queries Skills Registry (Story 2.2) for relevant skills, using Bimba context, dynamic Graphiti context (informed by UI context), and Graphiti-derived document-level memory/Bimba structure.
4.  Agent selects appropriate skill(s) for sub-tasks from query results, factoring in UI context and Graphiti insights for relevance.
5.  Agent determines logical skill sequence, adapting based on real-time Graphiti conditions (reflecting UI context), to fulfill request, enabling refined analysis for skill sequencing.
6.  Output: plan/sequence of (skill_id, input_params, relevant_graphiti_context_snapshot, UI_context_markers) tuples, ensuring streamlined context windows.
7.  Handles simple skill dependencies (output of A is input to B).
8.  The planning process considers how skill execution might inform Notion/Bimba updates.
```

## 3. Tasks / Subtasks (from story-3.1.md)

```
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
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** The Epii Agent operates at a high level within this architecture, orchestrating skills.
*   **Bimba Coordinate System:** Provides foundational context for the agent's understanding and planning.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md, epic-003.md, story-3.1.md & relevant architecture shards)

*   **Epii Agent:** The core intelligent entity responsible for understanding user requests, planning, and orchestrating A2A skills.
*   **Graphiti Service:** A central nervous system for the Epii Agent. It provides dynamic context including user UI interactions (via AG-UI), document-level memory, and Bimba structural knowledge. The agent heavily relies on Graphiti for task decomposition, skill discovery, and sequencing.
*   **AG-UI Protocol:** Feeds UI context (chat, canvas selections) into Graphiti, making it available to the Epii Agent for planning.
*   **Skills Registry:** The service (developed in Story 2.2) that the Epii Agent queries to find relevant skills based on sub-tasks, Bimba context, and Graphiti insights.
*   **A2A Skills:** Reusable capabilities (defined in Story 2.1) that the Epii Agent sequences to fulfill complex requests.
*   **Task Decomposition:** The process by which the Epii Agent breaks down a complex user request into smaller, manageable sub-tasks that can potentially be mapped to individual skills.
*   **Skill Sequencing/Planning:** The process of determining the logical order in which selected skills should be executed, including handling simple dependencies between them.
*   **Contextualization:** The agent must use Bimba coordinates, dynamic Graphiti context (including UI state and document memory), and the user's original request to inform every step of decomposition, discovery, and sequencing.
*   **Streamlined Context Windows:** A key goal is to ensure that both the agent and the individual skills operate with optimized, relevant context, avoiding unnecessary information overload.
*   **Programming Languages/Frameworks:** The Epii Agent's core logic is likely to be in Python or Node.js, interacting with the Skills Registry (Node.js) and Graphiti (Python).
*   **Relevant Documentation:** `epii-agent-architecture.md`, `Epii_Agent_Skill_Orchestration_Logic.md`.

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Enhance the Epii Agent's core logic to enable task decomposition and skill sequencing as defined in Story 3.1. The agent must leverage the Skills Registry and rich contextual information from the Graphiti service (including UI context via AG-UI, document memory, and Bimba structure) to plan multi-step task execution. This is a foundational capability for EPIC-003.

Key Objectives & Requirements:

1.  **User Request Ingestion and Initial Analysis (Epii Agent - Python/Node.js):
    *   **Input Handling:** Design the agent's input mechanism to receive complex user requests. These requests can be natural language or structured and MUST include or allow for the integration of `uiContext` (e.g., active chat keywords, canvas selections from AG-UI via Graphiti). (AC#1)
    *   **Sub-task Identification:** Implement logic to analyze the user request and the `uiContext` to identify potential sub-tasks or required capabilities. This might involve:
        *   Natural Language Understanding (NLU) techniques (e.g., using an LLM for initial breakdown, intent extraction, entity recognition).
        *   Pattern matching or rule-based systems for simpler requests.
        *   Leveraging Graphiti to understand entities and relationships mentioned in the request or highlighted in the UI. (AC#2, Subtask 1.1)

2.  **Skills Registry Integration for Skill Discovery (Epii Agent):
    *   **Query Formulation:** For each identified sub-task, the agent must formulate a query to the Skills Registry (developed in Story 2.2). This query MUST include:
        *   A description of the sub-task.
        *   Relevant Bimba context (derived from the user request or agent's current focus).
        *   Dynamic Graphiti context (e.g., specific entities from Graphiti related to the sub-task, UI context markers, references to document-level memory or Bimba structure held in Graphiti). (AC#3)
    *   **Query Execution:** Implement the client-side logic to call the Skills Registry API and receive skill suggestions.

3.  **Skill Selection Logic (Epii Agent):
    *   **Evaluation Criteria:** From the list of skills returned by the Skills Registry, the agent must select the most appropriate skill(s) for each sub-task. Selection criteria should include:
        *   Relevance score provided by the Skills Registry.
        *   Specificity of the skill to the sub-task.
        *   Alignment with the current `uiContext` and broader Graphiti insights. (AC#4, Subtask 3.1)
    *   Consider how to handle cases where no suitable skill is found or multiple highly relevant skills are returned.

4.  **Skill Sequencing and Plan Generation (Epii Agent):
    *   **Logical Ordering:** Develop logic to determine the sequence in which the selected skills should be executed. This plan should adapt based on real-time conditions or insights from Graphiti (reflecting UI context changes). (AC#5)
    *   **Plan Representation:** The output of this stage should be a plan, represented as a sequence of tuples. Each tuple should contain:
        *   `skill_id`: The ID of the skill to be invoked.
        *   `input_params_template`: A template or structure for the input parameters required by the skill, possibly with placeholders for outputs from previous skills or dynamic context.
        *   `relevant_graphiti_context_snapshot`: A reference or summary of the specific Graphiti context relevant at the time of planning for this skill step.
        *   `ui_context_markers`: Specific markers from the UI context that influenced the selection or sequencing of this skill. (AC#6, Subtask 4.1)

5.  **Handling Simple Skill Dependencies (Epii Agent):
    *   Implement a mechanism to manage simple dependencies where the output of one skill in the sequence is required as input for a subsequent skill. (AC#7)
    *   This involves designing how the `input_params_template` in the plan can specify these dependencies and how the agent will resolve them at execution time (Story 3.2). (Subtask 5.1)

6.  **Consideration for Notion/Bimba Updates (Conceptual):
    *   The planning process should inherently consider that the execution of the skill sequence might lead to information that could inform updates to Notion or Bimba (AC#8). This might influence skill choice or the parameters passed to skills.

7.  **Developer Documentation (Markdown):
    *   Document the task decomposition, skill discovery, selection, and sequencing modules within the Epii Agent.
    *   Explain how `uiContext` and Graphiti insights are leveraged throughout the planning process.
    *   Describe the structure of the generated execution plan.

Considerations:

*   **LLM Integration:** Clearly define the role of LLMs (e.g., for NLU and initial decomposition) versus more deterministic logic (for skill querying, selection based on registry data, and basic sequencing).
*   **Graphiti Interaction:** Specify how the Epii Agent interacts with Graphiti to obtain the necessary dynamic context. Does it make direct queries to Graphiti, or is context pushed/provided to it?
*   **Complexity of Planning:** For this story, focus on basic planning (linear sequences, simple dependencies). More advanced planning (e.g., conditional branching, parallel execution, error recovery strategies) can be future enhancements.
*   **State Management:** How does the agent maintain state during the planning process, especially if it involves multiple interactions with the user or external services like Graphiti and the Skills Registry?

Please provide the necessary Python/Node.js code for the Epii Agent's planning logic, interactions with other services, documentation updates (Markdown), and any relevant configuration. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-003-story-3.1-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`