# AI Builder Prompt Package: EPIC-003 / Story 3.3 - Epii Agent Interaction with Epii Analysis Pipeline via Skills

## Target AI Model: Claude 4 (Full Stack Development)

## Development Context:

*   **Project:** Epi-Logos Seed Files - BMad Agent Development
*   **Subsystem/Layer:** 5_epii
*   **Development Name:** Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
*   **Relevant READMEs:**
    *   `BMAD EPI-LOGOS MEMORY/README.md` (Overall BMad Epi-Logos Memory Structure)
    *   `BMAD EPI-LOGOS MEMORY/5_epii/README.md` (Epii Subsystem Overview)
    *   `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/README.md` (Specific Development Readme)

## Core Objective:

To generate the necessary code and documentation for the Epii Agent to interact with the Epii Analysis Pipeline using dedicated skills. This involves creating skills for submitting data to the pipeline and retrieving/interpreting results, all within the Bimba context and leveraging dynamic Graphiti data (including UI context and document/Bimba structure). The goal is to enable refined analysis for skill execution, streamline context windows, and inform potential Notion/Bimba updates.

## Epic Details (EPIC-003):

*   **Description:** Enhance the Epii Agent's core logic to masterfully utilize the A2A Skill Management Framework (EPIC-002). This involves improving its ability to decompose tasks by leveraging the **Graphiti service** for dynamic context (including user chat/canvas interactions **via AG-UI protocol** and refined analytical insights). The agent will discover skills using Bimba coordinates and rich Graphiti context (which holds document-level memory and Bimba structural knowledge, **all grounded by Bimba coordinates**), invoke them with precise dynamic context, and manage information flow. The agent's interaction with the Epii Analysis Pipeline (QL stages) will be skill-based, using the **Graphiti service** to manage state. **This enhancement aligns with the 6-subsystem backend architecture, where the Graphiti service acts as a central nervous system for the agent's orchestration logic, crucial for streamlining context windows for both the agent and invoked skills.**
*   **Goal:** Empower the Epii Agent with sophisticated orchestration, enabling complex, multi-step tasks by dynamically leveraging A2A skills. The **Graphiti service's** role as a dynamic, unified memory (capturing user state via **AG-UI**, document insights, Bimba knowledge) is central, providing real-time awareness for intelligent decision-making, adaptive execution, and **informing potential Notion or Bimba updates, always maintaining Bimba coordinate integrity.** This is critical for autonomous, contextually-aware agent behavior and **efficient context utilization.**

## Story Details (Story 3.3):

*   **Story:** As an Epii Agent (within the **6-subsystem architecture**), I want to use skills to submit data (including **UI context like chat/canvas selections** and **Graphiti-derived document-level memory/Bimba structure**) to the Epii Analysis Pipeline and retrieve/interpret results, within Bimba context, enriching interaction with dynamic Graphiti data/updates, so that I can leverage specialized analytical capabilities, enabling **refined analysis for skill execution,** with **streamlined context windows,** and **informing potential Notion/Bimba updates.**

### Acceptance Criteria (ACs):

1.  Dedicated skill `submitToAnalysisPipelineSkill` exists (within **6-subsystem architecture**).
2.  Submission skill accepts data, analysis params, Bimba coordinate, and pertinent Graphiti context (related entities, current state, **UI context markers**, **Graphiti-derived document-level memory/Bimba structure**).
3.  Submission skill returns job ID/tracking mechanism.
4.  Dedicated skill `getAnalysisPipelineResultsSkill` exists.
5.  Retrieval skill uses job ID and Bimba coordinate to fetch results.
6.  Retrieval skill returns structured results for Agent processing, potentially updating Graphiti with metadata/findings, ensuring **streamlined context windows.**
7.  Epii Agent orchestrates these skills (plan from Story 3.1/3.2) to submit, wait/poll, retrieve/use results, enabling **refined analysis.**
8.  Both skills use Bimba coordinate and relevant Graphiti context (reflecting **UI context**) for data scoping, result interpretation, or updating Graphiti.
9.  The interaction with the Analysis Pipeline is designed to **inform potential Notion/Bimba updates** based on analytical outcomes.

### Tasks / Subtasks:

*   [ ] Task 1: Design and implement `submitToAnalysisPipelineSkill` (AC: #1, #2)
    *   [ ] Subtask 1.1: Define the interface for the Epii Analysis Pipeline for task submission.
    *   [ ] Subtask 1.2: Implement the skill logic to package data and parameters and send them to the pipeline, including Bimba coordinate **and relevant Graphiti context.**
    *   [ ] Subtask 1.3: Ensure the skill correctly handles the pipeline's response (e.g., job ID) (AC: #3).
*   [ ] Task 2: Design and implement `getAnalysisPipelineResultsSkill` (AC: #4, #5)
    *   [ ] Subtask 2.1: Define the interface for the Epii Analysis Pipeline for result retrieval using a job ID and Bimba coordinate.
    *   [ ] Subtask 2.2: Implement the skill logic to query the pipeline, parse the results (AC: #6), **and potentially update Graphiti with analysis summaries or links.**
*   [ ] Task 3: Register both skills in the Skills Registry (Story 2.1).
*   [ ] Task 4: Develop Epii Agent logic to orchestrate the submission and retrieval skills (AC: #7)
    *   [ ] Subtask 4.1: Implement waiting/polling strategy if pipeline processing is asynchronous.
*   [ ] Task 5: Ensure Bimba coordinate **and Graphiti context** are consistently used, propagated, and potentially updated by both skills and the agent (AC: #8).
*   [ ] Task 6: Document the new skills and the agent's interaction pattern with the Epii Analysis Pipeline.

### Dev Technical Guidance:

*   This story integrates the Epii Agent with a potentially complex backend system (Epii Analysis Pipeline).
*   The design of the skills should abstract the complexities of the pipeline interaction.
*   Refer to `../../docs/architecture_shards/epii-analysis-pipeline-interface.md` for details on how the pipeline is expected to be called.
*   The Bimba coordinate **and dynamic Graphiti context** are crucial for ensuring that analysis is contextually relevant and that its results can be integrated back into the agent's evolving understanding.
*   These skills will likely be A2A-aligned, meaning they are discoverable and invocable via the standard mechanisms (Skills Router).
*   Consider asynchronous communication patterns. The submission skill might return immediately with a job ID, and the agent might need to poll for results using the retrieval skill.
*   Error handling for pipeline interactions (e.g., pipeline unavailable, analysis failed) is important.

## Prompt for Claude 4 (Full Stack Development):

```plaintext
As a senior full-stack AI engineer, your task is to implement Story 3.3: "Epii Agent Interaction with Epii Analysis Pipeline via Skills" for the Epii Agent, which is part of the BMad Epi-Logos project. This story focuses on enabling the Epii Agent to leverage the Epii Analysis Pipeline through dedicated A2A skills for submitting data and retrieving analytical results, all within the context of Bimba coordinates and dynamic Graphiti insights (including UI context via AG-UI and document/Bimba structure from Graphiti).

**Project Context:**

*   The Epii Agent operates within a 6-subsystem backend architecture.
*   The Graphiti service acts as a central nervous system, providing dynamic, unified memory (user state via AG-UI, document insights, Bimba knowledge).
*   Bimba coordinates are fundamental for contextualization and data integrity.
*   Skills are managed by the A2A Skill Management Framework (Epic 002), including a Skills Registry and a Skills Router.
*   The goal is to achieve refined analysis, streamlined context windows for LLM calls, and inform potential Notion/Bimba updates.

**Key Requirements from Story 3.3 & Epic 003:**

1.  **Implement `submitToAnalysisPipelineSkill`:**
    *   This skill should be part of the 6-subsystem architecture.
    *   It must accept: data for analysis, analysis parameters, the current Bimba coordinate, and relevant Graphiti context (including related entities, current state, UI context markers from AG-UI, and Graphiti-derived document-level memory/Bimba structure).
    *   It should interact with the Epii Analysis Pipeline (assume an interface is defined or needs to be defined based on `../../docs/architecture_shards/epii-analysis-pipeline-interface.md`).
    *   It must return a job ID or a similar tracking mechanism for asynchronous processing.

2.  **Implement `getAnalysisPipelineResultsSkill`:**
    *   This skill should also be part of the 6-subsystem architecture.
    *   It must accept a job ID (from the submission skill) and the Bimba coordinate.
    *   It should query the Epii Analysis Pipeline for results.
    *   It must return structured results suitable for the Epii Agent to process.
    *   It should potentially update the Graphiti service with metadata or summaries of the findings, ensuring streamlined context for future operations.

3.  **Skill Registration:** Both new skills must be registered in the Skills Registry (as per Story 2.1).

4.  **Epii Agent Orchestration Logic:**
    *   Develop or update the Epii Agent's logic to orchestrate these two skills effectively. This includes planning the submission, handling asynchronous processing (e.g., waiting/polling for results using the job ID), retrieving results, and then using these results for further actions or decision-making.
    *   This orchestration should enable refined analysis by leveraging the pipeline's capabilities.

5.  **Context Management (Bimba & Graphiti):**
    *   Ensure that Bimba coordinates and relevant Graphiti context (reflecting UI context and document/Bimba structure) are consistently used and propagated throughout the skill invocation and pipeline interaction process.
    *   The interaction should be designed to inform potential Notion/Bimba updates based on analytical outcomes, maintaining data integrity through Bimba coordinates.

6.  **Documentation:** Provide clear documentation for the new skills and the agent's interaction pattern with the Epii Analysis Pipeline.

**Technical Considerations:**

*   **Language/Framework:** Assume Python for the backend services and skills, aligning with the Graphiti service and general A2A skill development.
*   **Asynchronous Operations:** Design for asynchronous communication with the Epii Analysis Pipeline. The submission skill should likely be non-blocking.
*   **Error Handling:** Implement robust error handling for all interactions with the pipeline (e.g., pipeline unavailable, analysis errors, invalid job ID).
*   **Modularity:** Design the skills to be modular and reusable.
*   **Interface Definition:** If the `epii-analysis-pipeline-interface.md` is not detailed enough, propose a clear API contract for the pipeline interactions (submission and retrieval).
*   **Graphiti Integration:** Clearly define how these skills will read from and potentially write to the Graphiti service.

**Deliverables:**

1.  Python code for `submitToAnalysisPipelineSkill`.
2.  Python code for `getAnalysisPipelineResultsSkill`.
3.  Snippets or instructions for registering these skills in the Skills Registry.
4.  Python code or pseudocode for the Epii Agent's orchestration logic for these skills.
5.  Markdown documentation for the new skills and their usage, including interaction with the Epii Analysis Pipeline and Graphiti.
6.  Consider any necessary updates to data models or schemas for parameters and results.

Please provide a comprehensive solution, including code, explanations, and documentation, keeping in mind the principles of clean code, modularity, and alignment with the existing BMad Epi-Logos architecture.
```

## Philosophical & Technical Context (from READMEs):

*   **BMAD EPI-LOGOS MEMORY Principles:** (Summarize key principles from the root README, e.g., Bimba-Pratibimba dynamics, role of coordinates, knowledge crystallization, agentic interaction with memory).
    *   The BMad Epi-Logos Memory system is designed around the Bimba-Pratibimba concept, representing a dynamic interplay between structured knowledge (Bimba) and its evolving reflections (Pratibimba).
    *   Bimba coordinates are central to uniquely identifying and linking knowledge fragments across the system.
    *   Knowledge Crystallization is a key process, refining insights and structuring them within Bimba.
    *   Agents interact with this memory, both consuming and contributing to its evolution.
    *   The system aims for a fractal, self-similar structure, promoting scalability and coherence.
*   **Epii Subsystem (5_epii) Focus:** (Summarize from the 5_epii README, e.g., role of Epii Agent, its connection to other subsystems, core functionalities being developed).
    *   The Epii subsystem is the locus of the primary intelligent agent, the Epii Agent.
    *   It's responsible for task understanding, planning, execution, and interaction with the user and other BMad subsystems.
    *   Key functionalities include advanced reasoning, skill-based action, and dynamic context management.
    *   It heavily relies on the Graphiti service for contextual understanding and memory.
*   **Coordiante based BPMCP and A2A-aligned agent skills DEvelopment Specifics:** (Summarize from the development-specific README, e.g., goals of this development, key architectural decisions like A2A skills, Graphiti integration, AG-UI protocol).
    *   This development focuses on establishing a robust A2A (Agent-to-Agent/Service) skill management framework.
    *   It introduces the Graphiti service as a critical component for dynamic contextualization and unified memory.
    *   The AG-UI protocol facilitates the flow of UI context (e.g., user selections) to the backend for deeper understanding.
    *   Bimba coordinates are integral to grounding all skills and data within the broader knowledge graph.
    *   The aim is to create a more autonomous, contextually-aware, and capable Epii Agent.

This prompt package provides the AI with all necessary information to understand the task, its context, and the expected deliverables for implementing Story 3.3.{"toolcall":{"name":"finish","thought":"All prompt packages for epics 1, 2, and 3 have been successfully created. The task is now complete.","params":{"summary":"I have successfully created all the AI Builder Prompt Packages for the stories associated with `epic-001.md`, `epic-002.md`, and `epic-003.md`. The following files were generated in the `/Users/admin/Documents/Epi-Logos_Seed_Files/bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt_packages/` directory:

*   `epic-001-story-1.1-claude4-prompt-package.md`
*   `epic-001-story-1.2-claude4-prompt-package.md`
*   `epic-001-story-1.3-claude4-prompt-package.md`
*   `epic-002-story-2.1-claude4-prompt-package.md`
*   `epic-002-story-2.2-claude4-prompt-package.md`
*   `epic-002-story-2.3-claude4-prompt-package.md`
*   `epic-003-story-3.1-claude4-prompt-package.md`
*   `epic-003-story-3.2-claude4-prompt-package.md`
*   `epic-003-story-3.3-claude4-prompt-package.md`

Each package is tailored for Claude 4 full-stack development and includes details from the respective epic and story files, relevant READMEs for philosophical and technical context, acceptance criteria, and associated tasks."}}}}